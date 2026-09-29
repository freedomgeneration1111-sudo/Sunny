import { readFile,writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [command,...args]=process.argv.slice(2);const option=(name,fallback)=>{const index=args.indexOf(name);return index>=0?args[index+1]:fallback;};
const api=(option("--api",process.env.OPERATOR_OS_API_URL??"http://127.0.0.1:8787")).replace(/\/$/,"");const headers={"Content-Type":"application/json"};
const runnerToken=process.env.CMS_RUNNER_TOKEN?.trim();
if(command==="initialize"&&runnerToken)headers.Authorization=`Bearer ${runnerToken}`;
else{
  if(process.env.OPERATOR_OS_TOKEN)headers.Authorization=`Bearer ${process.env.OPERATOR_OS_TOKEN}`;
  if(process.env.OPERATOR_OS_RESPONDER_ID)headers["X-Development-Responder-Id"]=process.env.OPERATOR_OS_RESPONDER_ID;
}
if(command==="initialize"){
  const pricing=JSON.parse(await readFile(new URL("../lib/content/servicePricing.json",import.meta.url),"utf8"));const faqs=JSON.parse(await readFile(new URL("../lib/content/faqs.json",import.meta.url),"utf8"));
  const path=runnerToken?"/v1/cms-runner/initialize":"/v1/internal/cms/initialize";const response=await fetch(`${api}${path}`,{method:"POST",headers,body:JSON.stringify({pricing:{schemaVersion:1,values:pricing.values},faqs:{schemaVersion:1,...faqs}})});await finish(response);
}else if(command==="export"){
  const output=resolve(option("--out","artifacts/focus-cms-snapshot.json"));const response=await fetch(`${api}/v1/internal/cms/snapshot`,{headers});if(!response.ok)await finish(response);await writeFile(output,JSON.stringify(await response.json(),null,2)+"\n");console.log(output);
}else{console.error("Usage: npm run cms:initialize -- --api <url> | OPERATOR_OS_API_URL=<url> CMS_RUNNER_TOKEN=<token> npm run cms:initialize | npm run cms:export -- --api <url> --out <file>");process.exitCode=2;}
async function finish(response){const text=await response.text();if(!response.ok)throw new Error(`${response.status} ${text}`);console.log(text);}
