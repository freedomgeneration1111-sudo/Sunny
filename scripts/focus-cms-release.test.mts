import { mkdtemp,readFile,writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe,expect,it,vi } from "vitest";
import { buildRelease,deployRelease,releasePaths } from "./focus-cms-release-lib.mjs";

const environment={
  OPERATOR_OS_API_URL:"https://operator.example.test",
  CMS_RUNNER_TOKEN:"runner-secret",
  WORKERS_CI_BUILD_UUID:"build-exact",
  WORKERS_CI_COMMIT_SHA:"abcdef1234567890",
};
const snapshot={
  schemaVersion:1,
  business:"focus",
  exportedAt:"2026-09-28T12:00:00.000Z",
  documents:{
    pricing:{revisionId:"pricing_1",schemaVersion:1,content:{schemaVersion:1,values:{}}},
    faqs:{revisionId:"faqs_1",schemaVersion:1,content:{schemaVersion:1,common:[],pricing:[]}},
  },
  integrity:{algorithm:"SHA-256",hash:`sha256-${"0".repeat(64)}`},
};

function fetchMock(operationType="publish",rollbackSourceVersionId:string|null=null){
  const calls:Array<{url:string;body:Record<string,unknown>;authorization:string}>=[];
  const implementation=vi.fn(async(url:string|URL|Request,init:RequestInit)=>{
    const body=JSON.parse(String(init.body)) as Record<string,unknown>;
    calls.push({url:String(url),body,authorization:(init.headers as Record<string,string>).Authorization});
    if(String(url).endsWith("/claim"))return Response.json({ok:true,release:{releaseId:"release-exact",operationType,rollbackSourceVersionId,snapshot}});
    return Response.json({ok:true,release:{releaseId:"release-exact",status:body.status}});
  });
  return{implementation,calls};
}

function activeDeployment(versionId:string){
  return JSON.stringify([
    {id:"deployment-older",source:"wrangler",versions:[{version_id:"version-older",percentage:100}],created_on:"2026-09-28T11:00:00.000Z"},
    {id:"deployment-active",source:"wrangler",versions:[{version_id:versionId,percentage:100}],created_on:"2026-09-28T12:00:00.000Z"},
  ]);
}

function expectNoFailedCallback(calls:Array<{body:Record<string,unknown>}>){
  expect(calls.filter((call)=>call.body.status==="failed")).toEqual([]);
}

describe("Focus CMS release runner",()=>{
  it("claims one exact build, materializes its snapshot, and invokes the strict snapshot build",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-build-"));const mock=fetchMock();const command=vi.fn().mockResolvedValue(undefined);
    await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:command});
    expect(mock.calls[0]).toMatchObject({body:{buildId:"build-exact",runnerSourceGitSha:"abcdef1234567890"},authorization:"Bearer runner-secret"});
    expect(JSON.parse(await readFile(releasePaths(root).snapshot,"utf8"))).toEqual(snapshot);
    expect(command).toHaveBeenCalledWith("npm",["run","build"],expect.objectContaining({cwd:root,env:expect.objectContaining({FOCUS_CMS_SNAPSHOT_PATH:releasePaths(root).snapshot,NEXT_PUBLIC_PUBLICATION_STAGE:"production"})}));
  });

  it("reports a build failure without attempting deployment",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-fail-"));const mock=fetchMock();
    await expect(buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{throw new Error("snapshot build failed");}})).rejects.toThrow("snapshot build failed");
    expect(mock.calls.at(-1)?.body).toMatchObject({status:"failed",failureCode:"build_failed",buildId:"build-exact",runnerSourceGitSha:"abcdef1234567890"});
  });

  it("retries only until the deploy hook build UUID is attached, then claims that exact release",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-race-"));let attempts=0;const wait=vi.fn().mockResolvedValue(undefined);
    const fetchImpl=vi.fn(async()=>{attempts+=1;if(attempts===1)return Response.json({ok:false,error:{code:"release_not_claimable",message:"not attached yet"}},{status:409});return Response.json({ok:true,release:{releaseId:"release-exact",operationType:"publish",rollbackSourceVersionId:null,snapshot}});});
    await buildRelease({root,env:environment,fetchImpl,wait,runCommand:async()=>{}});
    expect(fetchImpl).toHaveBeenCalledTimes(2);expect(wait).toHaveBeenCalledWith(2500);
  });

  it("verifies the exact active publish version before reporting live",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-deploy-"));const paths=releasePaths(root);const mock=fetchMock();
    await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{}});
    const command=vi.fn(async(_command:string,args:string[],options:{env:Record<string,string>})=>{
      if(args[1]==="deploy"){await writeFile(options.env.WRANGLER_OUTPUT_FILE_PATH!,`${JSON.stringify({type:"deploy",version_id:"version-exact",worker_name:"focus-lab-public-staging",targets:[{url:"https://focuslabproductions.com"}]})}\n`);return{stdout:""};}
      if(args[1]==="deployments")return{stdout:activeDeployment("version-exact")};
      throw new Error(`Unexpected command: ${args.join(" ")}`);
    });
    const result=await deployRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:command});
    expect(result.workerVersionId).toBe("version-exact");
    expect(command).toHaveBeenNthCalledWith(1,"npx",["wrangler","deploy","--config","wrangler.staging.jsonc"],expect.any(Object));
    expect(command).toHaveBeenNthCalledWith(2,"npx",["wrangler","deployments","list","--config","wrangler.staging.jsonc","--json"],expect.objectContaining({captureOutput:true}));
    expect(mock.calls.slice(-2).map((call)=>call.body.status)).toEqual(["deploying","live"]);
    expect(mock.calls.at(-1)?.body).toMatchObject({workerVersionId:"version-exact",runnerSourceGitSha:"abcdef1234567890",deploymentTarget:{activeVersionId:"version-exact",activePercentage:100,activeDeploymentId:"deployment-active"}});
    expect(paths.operation).toContain(".cms-release");
  });

  it.each([
    ["missing output",async()=>{},"ENOENT"],
    ["malformed output",async(path:string)=>{await writeFile(path,"not-json\n");},"non-JSON"],
    ["missing version metadata",async(path:string)=>{await writeFile(path,`${JSON.stringify({type:"deploy",worker_name:"focus-lab-public-staging"})}\n`);},"version ID"],
  ])("keeps the release active when publish command succeeds with %s",async(_label,writeOutput,expectedError)=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-ambiguous-"));const paths=releasePaths(root);const mock=fetchMock();
    await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{}});
    const command=vi.fn(async()=>{await writeOutput(paths.wranglerOutput);return{stdout:""};});
    await expect(deployRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:command})).rejects.toThrow(expectedError);
    expect(mock.calls.map((call)=>call.body.status).filter(Boolean)).toEqual(["deploying"]);expectNoFailedCallback(mock.calls);
  });

  it("keeps the release active when exact active-version verification is inconclusive",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-verify-"));const mock=fetchMock();const wait=vi.fn().mockResolvedValue(undefined);
    await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{}});
    const command=vi.fn(async(_command:string,args:string[],options:{env:Record<string,string>})=>{
      if(args[1]==="deploy"){await writeFile(options.env.WRANGLER_OUTPUT_FILE_PATH!,`${JSON.stringify({type:"deploy",version_id:"version-exact"})}\n`);return{stdout:""};}
      return{stdout:activeDeployment("different-version")};
    });
    await expect(deployRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:command,wait})).rejects.toThrow("Could not verify active Worker version");
    expect(command).toHaveBeenCalledTimes(6);expectNoFailedCallback(mock.calls);expect(mock.calls.map((call)=>call.body.status).filter(Boolean)).toEqual(["deploying"]);
  });

  it("keeps the release active when every final live callback fails",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-callback-"));const setup=fetchMock();
    await buildRelease({root,env:environment,fetchImpl:setup.implementation,runCommand:async()=>{}});
    const calls:Array<Record<string,unknown>>=[];const fetchImpl=vi.fn(async(_url:string|URL|Request,init:RequestInit)=>{const body=JSON.parse(String(init.body)) as Record<string,unknown>;calls.push(body);if(body.status==="live")return Response.json({ok:false,error:{code:"temporary",message:"retry"}},{status:503});return Response.json({ok:true});});
    const command=vi.fn(async(_command:string,args:string[],options:{env:Record<string,string>})=>{if(args[1]==="deploy"){await writeFile(options.env.WRANGLER_OUTPUT_FILE_PATH!,`${JSON.stringify({type:"deploy",version_id:"version-exact"})}\n`);return{stdout:""};}return{stdout:activeDeployment("version-exact")};});
    const wait=vi.fn().mockResolvedValue(undefined);
    await expect(deployRelease({root,env:environment,fetchImpl,runCommand:command,wait})).rejects.toThrow("retry");
    expect(command).toHaveBeenCalledTimes(2);expect(calls.filter((body)=>body.status==="live")).toHaveLength(5);expect(calls.filter((body)=>body.status==="failed")).toEqual([]);
  });

  it("reports failed when the remote-mutating command itself fails",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-command-fail-"));const mock=fetchMock();
    await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{}});
    await expect(deployRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{throw new Error("deploy command failed");}})).rejects.toThrow("deploy command failed");
    expect(mock.calls.at(-1)?.body).toMatchObject({status:"failed",failureCode:"deploy_failed"});
  });

  it("restores the exact historical version without building new site output or depending on rollback output metadata",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-rollback-success-"));const paths=releasePaths(root);const mock=fetchMock("rollback","version-prior");const buildCommand=vi.fn().mockResolvedValue(undefined);
    await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:buildCommand});expect(buildCommand).not.toHaveBeenCalled();
    const command=vi.fn(async(_command:string,args:string[],options:{env:Record<string,string>})=>{
      if(args[1]==="versions"){await writeFile(options.env.WRANGLER_OUTPUT_FILE_PATH!,"malformed-but-irrelevant\n");return{stdout:""};}
      if(args[1]==="deployments")return{stdout:activeDeployment("version-prior")};
      throw new Error(`Unexpected command: ${args.join(" ")}`);
    });
    const result=await deployRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:command});
    expect(result.workerVersionId).toBe("version-prior");
    expect(command).toHaveBeenNthCalledWith(1,"npx",["wrangler","versions","deploy","version-prior@100%","--config","wrangler.staging.jsonc","--message","CMS rollback release-exact","--yes"],expect.any(Object));
    expect(command).toHaveBeenNthCalledWith(2,"npx",["wrangler","deployments","list","--config","wrangler.staging.jsonc","--json"],expect.objectContaining({captureOutput:true}));
    expect(command.mock.calls.some(([,args])=>args[1]==="deploy")).toBe(false);
    expect(mock.calls.at(-1)?.body).toMatchObject({status:"live",workerVersionId:"version-prior",runnerSourceGitSha:"abcdef1234567890",deploymentTarget:{activeVersionId:"version-prior",activePercentage:100}});
    expect(mock.calls.at(-1)?.body).not.toHaveProperty("sourceGitSha");
    expect(paths.operation).toContain(".cms-release");
  });

  it("reports rollback command failure before remote mutation as failed",async()=>{
    const root=await mkdtemp(join(tmpdir(),"sunny-cms-rollback-fail-"));const mock=fetchMock("rollback","version-prior");
    await buildRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:async()=>{}});
    const command=vi.fn(async()=>{throw new Error("rollback command failed");});
    await expect(deployRelease({root,env:environment,fetchImpl:mock.implementation,runCommand:command})).rejects.toThrow("rollback command failed");
    expect(command).toHaveBeenCalledWith("npx",["wrangler","versions","deploy","version-prior@100%","--config","wrangler.staging.jsonc","--message","CMS rollback release-exact","--yes"],expect.any(Object));
    expect(mock.calls.at(-1)?.body).toMatchObject({status:"failed",failureCode:"deploy_failed"});
  });
});
