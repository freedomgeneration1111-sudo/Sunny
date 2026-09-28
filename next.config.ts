import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { NextConfig } from "next";
import { parseFocusCmsSnapshot,snapshotCore,stableStringify } from "./lib/content/cmsSnapshot";

const snapshotPath=process.env.FOCUS_CMS_SNAPSHOT_PATH;
let publicCmsContent="";
if(snapshotPath){
  const absolute=resolve(snapshotPath);let unparsed:unknown;
  try{unparsed=JSON.parse(readFileSync(absolute,"utf8")) as unknown;}catch(error){throw new Error(`Could not read explicit Focus CMS snapshot at ${absolute}: ${error instanceof Error?error.message:String(error)}`);}
  const snapshot=parseFocusCmsSnapshot(unparsed);
  const digest=createHash("sha256").update(stableStringify(snapshotCore(snapshot))).digest("hex");
  if(snapshot.integrity.hash!==`sha256-${digest}`)throw new Error(`Invalid Focus CMS snapshot: integrity hash does not match ${absolute}`);
  publicCmsContent=JSON.stringify({pricing:snapshot.documents.pricing.content,faqs:snapshot.documents.faqs.content,revisionIds:{pricing:snapshot.documents.pricing.revisionId,faqs:snapshot.documents.faqs.revisionId}});
}

const nextConfig:NextConfig={
  output:"export",trailingSlash:true,
  images:{unoptimized:true},
  eslint:{ignoreDuringBuilds:false},
  env:{NEXT_PUBLIC_FOCUS_CMS_CONTENT_JSON:publicCmsContent},
};
export default nextConfig;
