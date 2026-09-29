import { mkdtemp,readFile,writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe,expect,it,vi } from "vitest";
import { buildRelease,deployRelease,releasePaths } from "./focus-cms-release-lib.mjs";

const environment={OPERATOR_OS_API_URL:"https://operator.example.test",CMS_RUNNER_TOKEN:"runner-secret",WORKERS_CI_BUILD_UUID:"build-exact",WORKERS_CI_COMMIT_SHA:"abcdef1234567890"};
const snapshot={schemaVersion:1,business:"focus",exportedAt:"2026-09-28T12:00:00.000Z",documents:{pricing:{revisionId:"pricing_1",schemaVersion:1,content:{schemaVersion:1,values:{}}},faqs:{revisionId:"faqs_1",schemaVersion:1,content:{schemaVersion:1,common:[],pricing:[]}}},integrity:{algorithm:"SHA-256",hash:`sha256-${"0".repeat(64)}`}};

function fetchMock(operationType="publish",rollbackSourceVersionId:string|null=null){
  const calls:Array<{url:string;body:Record<string,unknown>;authorization:string}>=[];const implementation=vi.fn(async(url:string|URL|Request,init:RequestInit)=>{const body=JSON.parse(String(init.body)) as Record<string,unknown>;calls.push({url:String(url),body,authorization:(init.headers as Record<string,string>).Authorization});if(String(url).endsWith("/claim"))return Response.json({ok:true,release:{releaseId:"release-exact",operationType,rollbackSourceVersionId,snapshot}});return Response.json({ok:true,release:{releaseId:"release-exact",status:body.status}});});return{implementation,calls};
}

describe("Focus CMS release runner",()=>{
  it("claims one exact build, materializes its snapshot, and invokes the strict snapshot build",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-build-"));const mock=fetchMock();const command=vi.fn().mockResolvedValue(undefined);await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:command});
    expect(mock.calls[0]).toMatchObject({body:{buildId:"build-exact",sourceGitSha:"abcdef1234567890"},authorization:"Bearer runner-secret"});expect(JSON.parse(await readFile(releasePaths(root).snapshot,"utf8"))).toEqual(snapshot);
    expect(command).toHaveBeenCalledWith("npm",["run","build"],expect.objectContaining({cwd:root,env:expect.objectContaining({FOCUS_CMS_SNAPSHOT_PATH:releasePaths(root).snapshot,NEXT_PUBLIC_PUBLICATION_STAGE:"production"})}));
  });

  it("reports a build failure without attempting deployment",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-fail-"));const mock=fetchMock();await expect(buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{throw new Error("snapshot build failed");}})).rejects.toThrow("snapshot build failed");expect(mock.calls.at(-1)?.body).toMatchObject({status:"failed",failureCode:"build_failed",buildId:"build-exact"});
  });

  it("retries only until the deploy hook build UUID is attached, then claims that exact release",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-race-"));let attempts=0;const wait=vi.fn().mockResolvedValue(undefined);const fetchImpl=vi.fn(async()=>{attempts+=1;if(attempts===1)return Response.json({ok:false,error:{code:"release_not_claimable",message:"not attached yet"}},{status:409});return Response.json({ok:true,release:{releaseId:"release-exact",operationType:"publish",rollbackSourceVersionId:null,snapshot}});});await buildRelease({root,env:environment,fetchImpl,wait,runCommand:async()=>{}});expect(fetchImpl).toHaveBeenCalledTimes(2);expect(wait).toHaveBeenCalledWith(2500);
  });

  it("reports deploying and exact structured Wrangler version metadata",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-deploy-"));const paths=releasePaths(root);const mock=fetchMock();await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{}});
    const command=vi.fn(async(_command:string,_args:string[],options:{env:Record<string,string>})=>{await writeFile(options.env.WRANGLER_OUTPUT_FILE_PATH!,`${JSON.stringify({type:"deploy",version_id:"version-exact",worker_name:"focus-lab-public-staging",targets:[{url:"https://focuslabproductions.com"}]})}\n`);});
    const result=await deployRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:command});expect(result.workerVersionId).toBe("version-exact");expect(command).toHaveBeenCalledWith("npx",["wrangler","deploy","--config","wrangler.staging.jsonc"],expect.any(Object));expect(mock.calls.slice(-2).map((call)=>call.body.status)).toEqual(["deploying","live"]);expect(mock.calls.at(-1)?.body).toMatchObject({workerVersionId:"version-exact",sourceGitSha:"abcdef1234567890"});expect(paths.operation).toContain(".cms-release");
  });

  it("retries the idempotent live callback without redeploying",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-callback-"));const setup=fetchMock();await buildRelease({root,env:environment,fetchImpl:setup.implementation,runCommand:async()=>{}});let liveAttempts=0;const calls:Array<Record<string,unknown>>=[];const fetchImpl=vi.fn(async(_url:string|URL|Request,init:RequestInit)=>{const body=JSON.parse(String(init.body)) as Record<string,unknown>;calls.push(body);if(body.status==="live"&&liveAttempts++===0)return Response.json({ok:false,error:{code:"temporary",message:"retry"}},{status:503});return Response.json({ok:true});});const command=vi.fn(async(_command:string,_args:string[],options:{env:Record<string,string>})=>{await writeFile(options.env.WRANGLER_OUTPUT_FILE_PATH!,`${JSON.stringify({type:"deploy",version_id:"version-exact"})}\n`);});const wait=vi.fn().mockResolvedValue(undefined);await deployRelease({root,env:environment,fetchImpl,runCommand:command,wait});expect(command).toHaveBeenCalledOnce();expect(calls.map((body)=>body.status)).toEqual(["deploying","live","live"]);expect(wait).toHaveBeenCalledWith(2500);
  });

  it("uses Wrangler's supported version rollback syntax and reports rollback failure",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-rollback-"));const mock=fetchMock("rollback","version-prior");await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{}});const command=vi.fn(async()=>{throw new Error("rollback command failed");});await expect(deployRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:command})).rejects.toThrow("rollback command failed");expect(command).toHaveBeenCalledWith("npx",["wrangler","rollback","version-prior","--config","wrangler.staging.jsonc","--message","CMS rollback release-exact","--yes"],expect.any(Object));expect(mock.calls.at(-1)?.body).toMatchObject({status:"failed",failureCode:"deploy_failed"});
  });
});
