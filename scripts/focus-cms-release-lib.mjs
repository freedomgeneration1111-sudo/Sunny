import { mkdir,readFile,writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

export function releasePaths(root=process.cwd()){
  const directory=resolve(root,".cms-release");return{directory,snapshot:resolve(directory,"snapshot.json"),operation:resolve(directory,"operation.json"),wranglerOutput:resolve(directory,"wrangler-output.ndjson")};
}

export async function buildRelease(options={}){
  const environment=options.env??process.env;const fetchImpl=options.fetchImpl??fetch;const command=options.runCommand??runCommand;const root=options.root??process.cwd();const paths=releasePaths(root);
  const api=required(environment,"OPERATOR_OS_API_URL").replace(/\/$/,"");const token=required(environment,"CMS_RUNNER_TOKEN");const buildId=required(environment,"WORKERS_CI_BUILD_UUID");const runnerSourceGitSha=required(environment,"WORKERS_CI_COMMIT_SHA");let release;
  try{
    const claimed=await claimWithRetry(fetchImpl,`${api}/v1/cms-runner/releases/claim`,token,{buildId,runnerSourceGitSha},options.wait);release=claimed.release;if(!release?.releaseId||!release.snapshot)throw new Error("Runner claim did not return an immutable release snapshot");
    await mkdir(paths.directory,{recursive:true});await writeFile(paths.snapshot,`${JSON.stringify(release.snapshot,null,2)}\n`);await writeFile(paths.operation,`${JSON.stringify({api,buildId,runnerSourceGitSha,releaseId:release.releaseId,operationType:release.operationType,rollbackSourceVersionId:release.rollbackSourceVersionId,paths},null,2)}\n`);
    if(release.operationType!=="rollback")await command("npm",["run","build"],{cwd:root,env:{...environment,NEXT_PUBLIC_PUBLICATION_STAGE:"production",FOCUS_CMS_SNAPSHOT_PATH:paths.snapshot}});
    return{releaseId:release.releaseId,paths};
  }catch(error){if(release?.releaseId)await reportFailure(fetchImpl,api,token,release.releaseId,buildId,runnerSourceGitSha,"build_failed",error);throw error;}
}

export async function deployRelease(options={}){
  const environment=options.env??process.env;const fetchImpl=options.fetchImpl??fetch;const command=options.runCommand??runCommand;const root=options.root??process.cwd();const paths=releasePaths(root);const operation=JSON.parse(await readFile(paths.operation,"utf8"));const token=required(environment,"CMS_RUNNER_TOKEN");let remoteMutationSucceeded=false;
  const common={buildId:operation.buildId,runnerSourceGitSha:operation.runnerSourceGitSha};
  try{
    await requestJson(fetchImpl,`${operation.api}/v1/cms-runner/releases/${encodeURIComponent(operation.releaseId)}/status`,token,{status:"deploying",...common});
    const childEnv={...environment,WRANGLER_OUTPUT_FILE_PATH:paths.wranglerOutput};
    let output={versionId:"",urls:[],target:{}};let workerVersionId="";
    if(operation.operationType==="rollback"){
      if(!operation.rollbackSourceVersionId)throw new Error("Rollback release has no recorded source Worker version");
      await command("npx",["wrangler","versions","deploy",`${operation.rollbackSourceVersionId}@100%`,"--config","wrangler.staging.jsonc","--message",`CMS rollback ${operation.releaseId}`,"--yes"],{cwd:root,env:childEnv});remoteMutationSucceeded=true;workerVersionId=operation.rollbackSourceVersionId;output.target={commandType:"version-deploy"};
    }else{
      await command("npx",["wrangler","deploy","--config","wrangler.staging.jsonc","--message",`CMS publish ${operation.releaseId}`],{cwd:root,env:childEnv});remoteMutationSucceeded=true;output=await parseWranglerOutput(paths.wranglerOutput);workerVersionId=output.versionId;
    }
    if(!workerVersionId)throw new Error("Structured Wrangler output did not include a Worker version ID");
    await callbackWithRetry(fetchImpl,`${operation.api}/v1/cms-runner/releases/${encodeURIComponent(operation.releaseId)}/status`,token,{status:"version_observed",...common,workerVersionId,deploymentUrls:output.urls,deploymentTarget:output.target},options.wait);
    const verified=await verifyActiveVersion(command,root,childEnv,workerVersionId,options.wait);const deploymentTarget={...output.target,...verified};
    await callbackWithRetry(fetchImpl,`${operation.api}/v1/cms-runner/releases/${encodeURIComponent(operation.releaseId)}/status`,token,{status:"live",...common,workerVersionId,deploymentUrls:output.urls,deploymentTarget},options.wait);
    return{releaseId:operation.releaseId,workerVersionId,deploymentUrls:output.urls};
  }catch(error){if(!remoteMutationSucceeded)await reportFailure(fetchImpl,operation.api,token,operation.releaseId,operation.buildId,operation.runnerSourceGitSha,"deploy_failed",error);throw error;}
}

export async function reconcileRelease(options={}){
  const environment=options.env??process.env;const fetchImpl=options.fetchImpl??fetch;const command=options.runCommand??runCommand;const root=options.root??process.cwd();const api=required(environment,"OPERATOR_OS_API_URL").replace(/\/$/,"");const token=required(environment,"CMS_RUNNER_TOKEN");
  const state=await requestJson(fetchImpl,`${api}/v1/cms-runner/releases/active`,token,undefined,"GET");const release=state?.release;
  if(!release)throw new Error("No active CMS publication operation requires reconciliation");
  if(release.status!=="deploying")throw new Error(`Active release ${release.releaseId} is ${release.status}, not awaiting post-deployment reconciliation`);
  if(!release.releaseId||!release.runnerBuildId||!release.runnerSourceGitSha)throw new Error("Active release is missing its assigned runner metadata");
  const common={buildId:release.runnerBuildId,runnerSourceGitSha:release.runnerSourceGitSha};let expectedVersionId=release.workerVersionId;let associationTarget={};
  if(release.operationType==="rollback"){
    if(!release.rollbackSourceVersionId)throw new Error(`Rollback release ${release.releaseId} has no recorded historical Worker version`);
    if(expectedVersionId&&expectedVersionId!==release.rollbackSourceVersionId)throw new Error(`Rollback release ${release.releaseId} is associated with ${expectedVersionId}, not its historical target ${release.rollbackSourceVersionId}`);
    expectedVersionId=release.rollbackSourceVersionId;associationTarget={association:"historical-rollback-version"};
  }else if(!expectedVersionId){
    const result=await command("npx",["wrangler","versions","list","--config","wrangler.staging.jsonc","--json"],{cwd:root,env:environment,captureOutput:true});expectedVersionId=parseReleaseVersion(result?.stdout??"",release.releaseId);associationTarget={association:"workers/message",message:`CMS publish ${release.releaseId}`};
  }
  if(!expectedVersionId)throw new Error(`Could not establish an exact Worker version for release ${release.releaseId}`);
  if(!release.workerVersionId)await callbackWithRetry(fetchImpl,`${api}/v1/cms-runner/releases/${encodeURIComponent(release.releaseId)}/status`,token,{status:"version_observed",...common,workerVersionId:expectedVersionId,deploymentUrls:[],deploymentTarget:associationTarget},options.wait);
  const verified=await verifyActiveVersion(command,root,environment,expectedVersionId,options.wait);const priorTarget=release.deploymentTarget&&typeof release.deploymentTarget==="object"&&!Array.isArray(release.deploymentTarget)?release.deploymentTarget:{};const deploymentTarget={...priorTarget,...associationTarget,...verified,reconciled:true};const deploymentUrls=Array.isArray(release.deploymentUrls)?release.deploymentUrls:[];
  await callbackWithRetry(fetchImpl,`${api}/v1/cms-runner/releases/${encodeURIComponent(release.releaseId)}/status`,token,{status:"live",...common,workerVersionId:expectedVersionId,deploymentUrls,deploymentTarget},options.wait);
  return{releaseId:release.releaseId,workerVersionId:expectedVersionId};
}

export async function parseWranglerOutput(path){
  const text=await readFile(path,"utf8");const values=text.split(/\r?\n/).filter(Boolean).map((line)=>{try{return JSON.parse(line);}catch{throw new Error("Wrangler output file contained non-JSON data");}});let versionId="";const urls=new Set();let target={};
  for(const value of values){const candidates=walk(value);for(const [key,item] of candidates){if(!versionId&&["version_id","versionId"].includes(key)&&typeof item==="string")versionId=item;if(typeof item==="string"&&/^https?:\/\//.test(item))urls.add(item);if(key==="worker_name"&&typeof item==="string")target.workerName=item;if(key==="environment"&&typeof item==="string")target.environment=item;}if(value&&typeof value==="object"&&(value.type==="deploy"||value.type==="rollback"))target.commandType=value.type;}
  return{versionId,urls:[...urls],target};
}

export function parseActiveDeployment(text,expectedVersionId){
  let deployments;try{deployments=JSON.parse(text);}catch{throw new Error("Wrangler deployments list returned invalid JSON");}
  if(!Array.isArray(deployments)||deployments.length===0)throw new Error("Wrangler deployments list returned no deployments");
  const latest=[...deployments].sort((left,right)=>String(left?.created_on??"").localeCompare(String(right?.created_on??""))).at(-1);const versions=latest?.versions;
  if(!Array.isArray(versions)||versions.length!==1||versions[0]?.version_id!==expectedVersionId||Number(versions[0]?.percentage)!==100)throw new Error(`Expected Worker version ${expectedVersionId} is not the sole active version at 100% traffic`);
  const target={activeVersionId:expectedVersionId,activePercentage:100};if(typeof latest.id==="string")target.activeDeploymentId=latest.id;if(typeof latest.created_on==="string")target.activeDeploymentCreatedAt=latest.created_on;if(typeof latest.source==="string")target.activeDeploymentSource=latest.source;return target;
}

export function parseReleaseVersion(text,releaseId){
  let versions;try{versions=JSON.parse(text);}catch{throw new Error("Wrangler versions list returned invalid JSON");}
  if(!Array.isArray(versions))throw new Error("Wrangler versions list returned an unexpected response");const message=`CMS publish ${releaseId}`;const candidates=versions.filter((version)=>version?.annotations?.["workers/message"]===message&&typeof(version.id??version.version_id)==="string").map((version)=>version.id??version.version_id);
  if(candidates.length===0)throw new Error(`No recent Worker version is annotated ${JSON.stringify(message)}; release remains active`);
  if(candidates.length!==1)throw new Error(`Multiple Worker versions are annotated ${JSON.stringify(message)}; refusing to guess`);
  return candidates[0];
}

export async function runCommand(command,args,options){
  return new Promise((resolvePromise,reject)=>{const capture=options.captureOutput===true;const child=spawn(command,args,{cwd:options.cwd,env:options.env,stdio:capture?["inherit","pipe","inherit"]:"inherit"});let stdout="";if(capture)child.stdout?.on("data",(chunk)=>{stdout+=String(chunk);});child.once("error",reject);child.once("exit",(code,signal)=>code===0?resolvePromise({stdout}):reject(new Error(`${command} ${args.join(" ")} failed (${signal??code})`)));});
}

async function reportFailure(fetchImpl,api,token,releaseId,buildId,runnerSourceGitSha,code,error){try{await requestJson(fetchImpl,`${api}/v1/cms-runner/releases/${encodeURIComponent(releaseId)}/status`,token,{status:"failed",buildId,runnerSourceGitSha,failureCode:code,failureMessage:safeMessage(error)});}catch(reportError){throw new AggregateError([error,reportError],"Release failed and the failure callback could not be recorded");}}
async function claimWithRetry(fetchImpl,url,token,body,wait=defaultWait){for(let attempt=0;attempt<13;attempt+=1){try{return await requestJson(fetchImpl,url,token,body);}catch(error){if(!(error instanceof RunnerHttpError)||error.code!=="release_not_claimable"||attempt===12)throw error;await wait(2_500);}}throw new Error("Release claim retry limit exhausted");}
async function callbackWithRetry(fetchImpl,url,token,body,wait=defaultWait){for(let attempt=0;attempt<5;attempt+=1){try{return await requestJson(fetchImpl,url,token,body);}catch(error){if(error instanceof RunnerHttpError&&error.status<500)throw error;if(attempt===4)throw error;await wait(2_500);}}throw new Error("Release callback retry limit exhausted");}
async function verifyActiveVersion(command,root,environment,expectedVersionId,wait=defaultWait){let lastError;for(let attempt=0;attempt<5;attempt+=1){try{const result=await command("npx",["wrangler","deployments","list","--config","wrangler.staging.jsonc","--json"],{cwd:root,env:environment,captureOutput:true});return parseActiveDeployment(result?.stdout??"",expectedVersionId);}catch(error){lastError=error;if(attempt<4)await wait(2_500);}}throw new Error(`Could not verify active Worker version after successful mutation: ${safeMessage(lastError)}`);}
class RunnerHttpError extends Error{constructor(message,status,code){super(message);this.status=status;this.code=code;}}
async function requestJson(fetchImpl,url,token,body,method="POST"){const response=await fetchImpl(url,{method,headers:{Authorization:`Bearer ${token}`,...(body===undefined?{}:{"Content-Type":"application/json"})},body:body===undefined?undefined:JSON.stringify(body)});const value=await response.json().catch(()=>null);if(!response.ok)throw new RunnerHttpError(errorMessage(value,`Operator-OS returned HTTP ${response.status}`),response.status,value&&typeof value==="object"&&value.error&&typeof value.error.code==="string"?value.error.code:undefined);return value;}
function errorMessage(value,fallback){return value&&typeof value==="object"&&value.error&&typeof value.error.message==="string"?value.error.message:fallback;}
function required(environment,key){const value=environment[key];if(typeof value!=="string"||!value.trim())throw new Error(`${key} is required`);return value.trim();}
function safeMessage(error){return(error instanceof Error?error.message:"Release runner failed").slice(0,1000);}
function defaultWait(milliseconds){return new Promise((resolvePromise)=>setTimeout(resolvePromise,milliseconds));}
function walk(value){const entries=[];if(!value||typeof value!=="object")return entries;for(const [key,item] of Object.entries(value)){entries.push([key,item]);if(item&&typeof item==="object")entries.push(...walk(item));}return entries;}
