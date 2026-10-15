#!/usr/bin/env node
import { mkdir,writeFile } from "node:fs/promises";
import { dirname,resolve } from "node:path";
import { compareCandidateToLive } from "./focus-cms-parity-lib.mjs";

const candidate=resolve(option("--candidate","out"));const liveOrigin=option("--live-origin","https://focuslabproductions.com");const reportPath=process.argv.includes("--report")?resolve(option("--report","artifacts/focus-cms-parity.json")):null;const reportOnly=process.argv.includes("--report-only");
const report=await compareCandidateToLive({outputDirectory:candidate,liveOrigin});const output=JSON.stringify(report,null,2)+"\n";if(reportPath){await mkdir(dirname(reportPath),{recursive:true});await writeFile(reportPath,output);}console.log(output.trim());if(report.differenceCount&&!reportOnly)process.exitCode=1;
function option(name,fallback){const index=process.argv.indexOf(name);return index>=0?process.argv[index+1]??fallback:fallback;}
