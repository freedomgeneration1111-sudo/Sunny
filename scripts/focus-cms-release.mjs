#!/usr/bin/env node
import { buildRelease,deployRelease,reconcileRelease } from "./focus-cms-release-lib.mjs";

const command=process.argv[2];
try{
  if(command==="build")await buildRelease();
  else if(command==="deploy")await deployRelease();
  else if(command==="reconcile")await reconcileRelease();
  else throw new Error("Usage: node scripts/focus-cms-release.mjs <build|deploy|reconcile>");
}catch(error){console.error(error instanceof Error?error.message:String(error));process.exitCode=1;}
