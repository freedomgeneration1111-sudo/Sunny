import { mkdir,readFile,writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

export function releasePaths(root=process.cwd()){
  const directory=resolve(root,".cms-release");return{directory,snapshot:resolve(directory,"snapshot.json"),operation:resolve(directory,"operation.json"),wranglerOutput:resolve(directory,"wrangler-output.ndjson")};
}

export async function buildRelease(options={}){
  const environment=options.env??process.env;const fetchImpl=options.fetchImpl??fetch;const command=options.runCommand??runCommand;const root=options.root??process.cwd();const paths=releasePaths(root);
  const api=required(environment,"OPERATOR_OS_API_URL").replace(/\/$/,"");const token=required(environment,"CMS_RUNNER_TOKEN");const buildId=required(environment,"WORKERS_CI_BUILD_UUID");const sourceGitSha=required(environment,"WORKERS_CI_COMMIT_SHA");let release;
  try{
    const claimed=await claimWithRetry(fetchImpl,`${api}/v1/cms-runner/releases/claim`,token,{buildId,sourceGitSha},options.wait);release=claimed.release;if(!release?.releaseId||!release.snapshot)throw new Error("Runner claim did not return an immutable release snapshot");
    await mkdir(paths.directory,{recursive:true});await writeFile(paths.snapshot,`${JSON.stringify(release.snapshot,null,2)}\n`);await writeFile(paths.operation,`${JSON.stringify({api,buildId,sourceGitSha,releaseId:release.releaseId,operationType:release.operationType,rollbackSourceVersionId:release.rollbackSourceVersionId,paths},null,2)}\n`);
    await command("npm",["run","build"],{cwd:root,env:{...environment,NEXT_PUBLIC_PUBLICATION_STAGE:"production",FOCUS_CMS_SNAPSHOT_PATH:paths.snapshot}});
    return{releaseId:release.releaseId,paths};
  }catch(error){if(release?.releaseId)await reportFailure(fetchImpl,api,token,release.releaseId,buildId,sourceGitSha,"build_failed",error);throw error;}
}

export async function deployRelease(options={}){
  const environment=options.env??process.env;const fetchImpl=options.fetchImpl??fetch;const command=options.runCommand??runCommand;const root=options.root??process.cwd();const paths=releasePaths(root);const operation=JSON.parse(await readFile(paths.operation,"utf8"));const token=required(environment,"CMS_RUNNER_TOKEN");let deploymentCompleted=false;
  const common={buildId:operation.buildId,sourceGitSha:operation.sourceGitSha};
  try{
    await requestJson(fetchImpl,`${operation.api}/v1/cms-runner/releases/${encodeURIComponent(operation.releaseId)}/status`,token,{status:"deploying",...common});
    const childEnv={...environment,WRANGLER_OUTPUT_FILE_PATH:paths.wranglerOutput};
    if(operation.operationType==="rollback"){
      if(!operation.rollbackSourceVersionId)throw new Error("Rollback release has no recorded source Worker version");
      await command("npx",["wrangler","rollback",operation.rollbackSourceVersionId,"--config","wrangler.staging.jsonc","--message",`CMS rollback ${operation.releaseId}`,"--yes"],{cwd:root,env:childEnv});
    }else await command("npx",["wrangler","deploy","--config","wrangler.staging.jsonc"],{cwd:root,env:childEnv});
    const output=await parseWranglerOutput(paths.wranglerOutput);const workerVersionId=operation.operationType==="rollback"?operation.rollbackSourceVersionId:output.versionId;
    if(!workerVersionId)throw new Error("Structured Wrangler output did not include a Worker version ID");
    deploymentCompleted=true;await callbackWithRetry(fetchImpl,`${operation.api}/v1/cms-runner/releases/${encodeURIComponent(operation.releaseId)}/status`,token,{status:"live",...common,workerVersionId,deploymentUrls:output.urls,deploymentTarget:output.target},options.wait);
    return{releaseId:operation.releaseId,workerVersionId,deploymentUrls:output.urls};
  }catch(error){if(!deploymentCompleted)await reportFailure(fetchImpl,operation.api,token,operation.releaseId,operation.buildId,operation.sourceGitSha,"deploy_failed",error);throw error;}
}

export async function parseWranglerOutput(path){
  const text=await readFile(path,"utf8");const values=text.split(/\r?\n/).filter(Boolean).map((line)=>{try{return JSON.parse(line);}catch{throw new Error("Wrangler output file contained non-JSON data");}});let versionId="";const urls=new Set();let target={};
  for(const value of values){const candidates=walk(value);for(const [key,item] of candidates){if(!versionId&&["version_id","versionId"].includes(key)&&typeof item==="string")versionId=item;if(typeof item==="string"&&/^https?:\/\//.test(item))urls.add(item);if(key==="worker_name"&&typeof item==="string")target.workerName=item;if(key==="environment"&&typeof item==="string")target.environment=item;}if(value&&typeof value==="object"&&(value.type==="deploy"||value.type==="rollback"))target.commandType=value.type;}
  return{versionId,urls:[...urls],target};
}

export async function runCommand(command,args,options){
  await new Promise((resolvePromise,reject)=>{const child=spawn(command,args,{cwd:options.cwd,env:options.env,stdio:"inherit"});child.once("error",reject);child.once("exit",(code,signal)=>code===0?resolvePromise():reject(new Error(`${command} ${args.join(" ")} failed (${signal??code})`)));});
}

async function reportFailure(fetchImpl,api,token,releaseId,buildId,sourceGitSha,code,error){try{await requestJson(fetchImpl,`${api}/v1/cms-runner/releases/${encodeURIComponent(releaseId)}/status`,token,{status:"failed",buildId,sourceGitSha,failureCode:code,failureMessage:safeMessage(error)});}catch(reportError){throw new AggregateError([error,reportError],"Release failed and the failure callback could not be recorded");}}
async function claimWithRetry(fetchImpl,url,token,body,wait=defaultWait){for(let attempt=0;attempt<13;attempt+=1){try{return await requestJson(fetchImpl,url,token,body);}catch(error){if(!(error instanceof RunnerHttpError)||error.code!=="release_not_claimable"||attempt===12)throw error;await wait(2_500);}}throw new Error("Release claim retry limit exhausted");}
async function callbackWithRetry(fetchImpl,url,token,body,wait=defaultWait){for(let attempt=0;attempt<5;attempt+=1){try{return await requestJson(fetchImpl,url,token,body);}catch(error){if(error instanceof RunnerHttpError&&error.status<500)throw error;if(attempt===4)throw error;await wait(2_500);}}throw new Error("Release callback retry limit exhausted");}
class RunnerHttpError extends Error{constructor(message,status,code){super(message);this.status=status;this.code=code;}}
async function requestJson(fetchImpl,url,token,body){const response=await fetchImpl(url,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(body)});const value=await response.json().catch(()=>null);if(!response.ok)throw new RunnerHttpError(errorMessage(value,`Operator-OS returned HTTP ${response.status}`),response.status,value&&typeof value==="object"&&value.error&&typeof value.error.code==="string"?value.error.code:undefined);return value;}
function errorMessage(value,fallback){return value&&typeof value==="object"&&value.error&&typeof value.error.message==="string"?value.error.message:fallback;}
function required(environment,key){const value=environment[key];if(typeof value!=="string"||!value.trim())throw new Error(`${key} is required`);return value.trim();}
function safeMessage(error){return(error instanceof Error?error.message:"Release runner failed").slice(0,1000);}
function defaultWait(milliseconds){return new Promise((resolvePromise)=>setTimeout(resolvePromise,milliseconds));}
function walk(value){const entries=[];if(!value||typeof value!=="object")return entries;for(const [key,item] of Object.entries(value)){entries.push([key,item]);if(item&&typeof item==="object")entries.push(...walk(item));}return entries;}
