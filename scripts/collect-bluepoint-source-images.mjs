/**
 * First-party Bluepoint image collection for inventory and source analysis.
 * Run only from GitHub Actions; downloads are retained as a workflow artifact,
 * not published as website assets.
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const output = path.join(root, "source-photo-archive");
const originals = path.join(output, "originals");
await fs.mkdir(originals, { recursive: true });
const routes = ["/", "/breads", "/pastries", "/about", "/community", "/contact", "/faq", "/map"];
const selected = new Map();
function include(raw, page, where, label="") {
  if (typeof raw !== "string" || !raw.trim()) return;
  try {
    const uri = new URL(raw.trim(), "https://www.bluepointbakery.com/");
    if (uri.protocol !== "https:" && uri.protocol !== "http:") return;
    const host = uri.hostname.toLowerCase();
    if (!(host.endsWith("bluepointbakery.com") || host.endsWith("cdn-website.com") ||
          host.endsWith("multiscreensite.com"))) return;
    uri.hash = "";
    uri.search = "";
    const url = uri.toString();
    if (!selected.has(url)) selected.set(url, { url, pages: [], origins: [], labels: [] });
    const record = selected.get(url);
    if (!record.pages.includes(page)) record.pages.push(page);
    if (!record.origins.includes(where)) record.origins.push(where);
    if (label && !record.labels.includes(label)) record.labels.push(label);
  } catch { /* Ignore malformed URLs */ }
}
function includeSet(value, page, where, label="") {
  for (const s of String(value ?? "").split(",")) {
    const match = s.trim().match(/^(.+?)(?:\s+\d+(?:\.\d+)?[wx])?$/);
    if (match) include(match[1], page, where, label);
  }
}
const ledger = await fs.readFile(path.join(root,"docs/PHOTOS.md"),"utf8");
for(const row of ledger.split("\n")){
  const m = row.match(/^\|\s*\[([^\]]+)\]\((https?:\/\/.+?)\)\s*\|/);
  if(m) include(m[2], "documented-original", "docs/PHOTOS.md", m[1]);
}
const browser = await chromium.launch({headless:true});
const ctx = await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
for (const route of routes) {
 const address = "https://www.bluepointbakery.com" + route;
 const page = await ctx.newPage();
 const requested = new Set();
 page.on("request", request => {
   if(request.resourceType()==="image") requested.add(request.url());
 });
 try {
   await page.goto(address, {waitUntil:"domcontentloaded",timeout:45000});
   await page.waitForTimeout(1200);
   for(let i=0;i<12;i++){
     await page.evaluate(({i})=>window.scrollTo(0,Math.min(document.body.scrollHeight, i*850)),{i});
     await page.waitForTimeout(280);
   }
   // Trigger horizontal galleries that reveal image sources as they move.
   await page.evaluate(()=>{
     for(const e of document.querySelectorAll("*")){
       if(e.scrollWidth > e.clientWidth + 80 && e.clientWidth > 150 && e.clientHeight > 80){
          e.scrollLeft=e.scrollWidth;
       }
     }
   });
   await page.waitForTimeout(1000);
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.waitForTimeout(500);
   const found = await page.evaluate(()=>{
     const out=[];
     for (const el of document.querySelectorAll("img")) {
       const label=el.getAttribute("alt")??el.getAttribute("title")??"";
       for (const attr of ["src","data-src","data-original","data-lazy-src","data-image","currentSrc"]){
         const u=attr==="currentSrc"?el.currentSrc:el.getAttribute(attr);
         if(u)out.push({url:u,kind:attr,label});
       }
       for (const attr of ["srcset","data-srcset"]){
         const set=el.getAttribute(attr);
         if(set)out.push({url:set,kind:attr,label});
       }
     }
     for (const el of document.querySelectorAll("source[srcset]")) out.push({
        url:el.getAttribute("srcset"), kind:"source-srcset", label:""
     });
     for (const el of document.querySelectorAll("a[href]")) {
       const u=el.getAttribute("href");
       if(u && /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(u))out.push({url:u,kind:"linked-image",label:el.textContent?.trim().slice(0,80)??""});
     }
     for(const el of document.querySelectorAll("*")){
       const bg=getComputedStyle(el).backgroundImage;
       if(bg && bg!=="none"){
         for(const m of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g))out.push({url:m[1],kind:"background",label:""});
       }
     }
     return out;
   });
   for(const x of found) {
     if(x.kind.includes("srcset"))includeSet(x.url,route,x.kind,x.label);
     else include(x.url,route,x.kind,x.label);
   }
   for(const url of requested)include(url,route,"network-image");
   process.stdout.write(route+": "+found.length+" candidate DOM references, "+requested.size+" network image requests\n");
 } catch(e) {
   process.stderr.write("Page "+route+" failed: "+e.message+"\n");
 } finally {await page.close();}
}
await browser.close();

const all=[...selected.values()];
await fs.writeFile(path.join(output,"source-links.json"),JSON.stringify(all,null,2));
let manifest=[];
for (let i=0;i<all.length;i++) {
 const item=all[i];
 const basename=decodeURIComponent(new URL(item.url).pathname.split("/").pop() || "image")
   .replace(/[^a-zA-Z0-9._-]+/g,"-").slice(0,85);
 const digest=crypto.createHash("sha256").update(item.url).digest("hex").slice(0,12);
 const name=digest+"-"+basename;
 try {
   const resp=await fetch(item.url,{headers:{"user-agent":"Mozilla/5.0 Bluepoint inventory","referer":"https://www.bluepointbakery.com/"}, signal:AbortSignal.timeout(18000)});
   if(!resp.ok)throw Error("HTTP "+resp.status);
   const contentType=(resp.headers.get("content-type")||"").toLowerCase();
   if(!contentType.startsWith("image/"))throw Error("not image ("+contentType+")");
   const buffer=Buffer.from(await resp.arrayBuffer());
   if(buffer.length > 30_000_000)throw Error("oversized image");
   await fs.writeFile(path.join(originals,name),buffer);
   manifest.push({...item,file:"originals/"+name,bytes:buffer.length,sha256:crypto.createHash("sha256").update(buffer).digest("hex"),contentType,status:"downloaded"});
 } catch(e){
   manifest.push({...item,file:null,bytes:0,status:"failed",error:e.message});
 }
 if((i+1)%15===0)process.stdout.write("Checked "+(i+1)+"/"+all.length+" source URLs\n");
}
await fs.writeFile(path.join(output,"download-manifest.json"),JSON.stringify(manifest,null,2));
const success=manifest.filter(x=>x.status==="downloaded");
await fs.writeFile(path.join(output,"SUMMARY.txt"),[
 "Bluepoint Bakery — source-photo collection",
 "Date: 2026-11-14",
 "Pages scanned: "+routes.join(", "),
 "First-party URLs found: "+all.length,
 "Downloaded originals: "+success.length,
 "Failed URLs: "+(all.length-success.length),
 "Unique binary hashes: "+new Set(success.map(x=>x.sha256)).size,
 "Files are for identification and demo image review, not authenticated SKU photos.",
 "Images are not automatically incorporated into the public website."
].join("\n")+"\n");
console.log(await fs.readFile(path.join(output,"SUMMARY.txt"),"utf8"));
