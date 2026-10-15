import { readdir,readFile } from "node:fs/promises";
import { join,relative,sep } from "node:path";

export async function enumerateExportedRoutes(outputDirectory){
  const files=await htmlFiles(outputDirectory);const routes=new Map();
  for(const file of files){const rel=relative(outputDirectory,file).split(sep).join("/");const descriptor=routeDescriptor(rel);if(!descriptor)continue;const previous=routes.get(descriptor.route);if(!previous||rel.endsWith("/index.html"))routes.set(descriptor.route,{...descriptor,file});}
  return[...routes.values()].sort((left,right)=>left.route.localeCompare(right.route));
}

export function extractComparableHtml(html){
  const withoutBlocks=html.replace(/<(script|style|svg|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi,"");const body=withoutBlocks.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]??withoutBlocks;
  const links=[...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match)=>{const attrs=attributes(match[1]??"");return{href:attrs.href??"",text:visibleText(match[2]??""),target:attrs.target??null,rel:attrs.rel??null};});
  const media=[...body.matchAll(/<(img|video|source)\b([^>]*)>/gi)].map((match)=>{const attrs=attributes(match[2]??"");return{kind:String(match[1]).toLowerCase(),src:attrs.src??"",srcset:attrs.srcset??null,poster:attrs.poster??null,alt:attrs.alt??null};});
  return{text:visibleText(body),links,media,metadata:{title:visibleText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]??""),description:metaContent(html,"description"),robots:metaContent(html,"robots"),canonical:canonicalHref(html)}};
}

export async function compareCandidateToLive({outputDirectory,liveOrigin,fetchImpl=fetch}){
  const routes=await enumerateExportedRoutes(outputDirectory);const differences=[];const checks=[];
  for(const route of routes){const candidate=extractComparableHtml(await readFile(route.file,"utf8"));const url=new URL(route.route,liveOrigin).toString();const response=await fetchImpl(url,{redirect:"follow",headers:{"User-Agent":"Focus-CMS-Activation-Parity/1.0"}});const live=extractComparableHtml(await response.text());const fields=fieldDifferences(live,candidate);const statusMatches=response.status===route.expectedStatus;checks.push({route:route.route,url,candidateFile:route.file,expectedStatus:route.expectedStatus,liveStatus:response.status,statusMatches});if(!statusMatches||Object.keys(fields).length)differences.push({route:route.route,url,expectedStatus:route.expectedStatus,liveStatus:response.status,fields});
  }
  return{candidateRouteCount:routes.length,checkedRouteCount:checks.length,differenceCount:differences.length,checks,differences};
}

function fieldDifferences(live,candidate){const differences={};if(live.text!==candidate.text)differences.text=textDifference(live.text,candidate.text);if(JSON.stringify(live.links)!==JSON.stringify(candidate.links))differences.links=arrayDifference(live.links,candidate.links);if(JSON.stringify(live.media)!==JSON.stringify(candidate.media))differences.media=arrayDifference(live.media,candidate.media);if(JSON.stringify(live.metadata)!==JSON.stringify(candidate.metadata))differences.metadata={live:live.metadata,candidate:candidate.metadata};return differences;}
function textDifference(live,candidate){const left=live.split(" "),right=candidate.split(" ");let start=0;while(start<left.length&&start<right.length&&left[start]===right[start])start+=1;let leftEnd=left.length-1,rightEnd=right.length-1;while(leftEnd>=start&&rightEnd>=start&&left[leftEnd]===right[rightEnd]){leftEnd-=1;rightEnd-=1;}return{live:excerpt(left,start,leftEnd),candidate:excerpt(right,start,rightEnd)};}
function excerpt(words,start,end){return words.slice(Math.max(0,start-12),Math.min(words.length,end+13)).join(" ");}
function arrayDifference(live,candidate){const liveCounts=counts(live),candidateCounts=counts(candidate);return{liveOnly:expandDifference(liveCounts,candidateCounts),candidateOnly:expandDifference(candidateCounts,liveCounts)};}
function counts(values){const result=new Map();for(const value of values){const key=JSON.stringify(value);result.set(key,(result.get(key)??0)+1);}return result;}
function expandDifference(primary,other){const result=[];for(const [key,count] of primary){for(let index=0;index<Math.max(0,count-(other.get(key)??0));index+=1)result.push(JSON.parse(key));}return result;}
function visibleText(fragment){return normalize(decodeEntities(fragment.replace(/<!--[\s\S]*?-->/g,"").replace(/<[^>]+>/g," ")));}
function normalize(value){return value.replace(/\s+/g," ").trim();}
function attributes(value){const result={};for(const match of value.matchAll(/([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g)){result[String(match[1]).toLowerCase()]=decodeEntities(match[2]??match[3]??match[4]??"");}return result;}
function metaContent(html,name){for(const match of html.matchAll(/<meta\b([^>]*)>/gi)){const attrs=attributes(match[1]??"");if((attrs.name??"").toLowerCase()===name)return attrs.content??"";}return null;}
function canonicalHref(html){for(const match of html.matchAll(/<link\b([^>]*)>/gi)){const attrs=attributes(match[1]??"");if((attrs.rel??"").toLowerCase().split(/\s+/).includes("canonical"))return attrs.href??"";}return null;}
function decodeEntities(value){return value.replace(/&#(x[0-9a-f]+|[0-9]+);|&(amp|lt|gt|quot|apos|nbsp);/gi,(match,numeric,named)=>{if(numeric){const point=String(numeric).toLowerCase().startsWith("x")?Number.parseInt(String(numeric).slice(1),16):Number.parseInt(String(numeric),10);return Number.isFinite(point)?String.fromCodePoint(point):match;}return{amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "}[String(named).toLowerCase()]??match;});}
async function htmlFiles(directory){const entries=await readdir(directory,{withFileTypes:true});const result=[];for(const entry of entries){const path=join(directory,entry.name);if(entry.isDirectory())result.push(...await htmlFiles(path));else if(entry.isFile()&&entry.name.endsWith(".html"))result.push(path);}return result;}
function routeDescriptor(relativePath){if(relativePath==="404.html")return{route:"/__focus-cms-parity-not-found__",expectedStatus:404};if(relativePath.startsWith("_not-found"))return null;if(relativePath==="index.html")return{route:"/",expectedStatus:200};if(relativePath.endsWith("/index.html"))return{route:`/${relativePath.slice(0,-"index.html".length)}`,expectedStatus:200};return{route:`/${relativePath.slice(0,-".html".length)}/`.replace(/\/{2,}/g,"/"),expectedStatus:200};}
