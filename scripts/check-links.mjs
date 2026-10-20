import {loadCatalog} from './validate-catalog.mjs';
import MarkdownIt from 'markdown-it';
import fs from 'node:fs/promises';
const urls=new Set(),md=new MarkdownIt({html:false});
for(const e of (await loadCatalog()).entries.filter(e=>e.status==='published')) {for(const s of e.sources)urls.add(s.url);if(e.learningUrl)urls.add(e.learningUrl);if(e.contentPath)for(const t of md.parse(await fs.readFile(e.contentPath,'utf8'),{}))for(const c of t.children||[])if(c.type==='link_open'&&c.attrGet('href')?.startsWith('https://'))urls.add(c.attrGet('href'));}
for(const url of urls){let error;for(let i=0;i<2;i++){try{let r=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(8000)});if([403,405,501].includes(r.status)){r=await fetch(url,{headers:{Range:'bytes=0-1023'},signal:AbortSignal.timeout(8000)});await r.body?.cancel();}if(!r.ok)throw Error(`HTTP ${r.status}`);console.log(`OK ${url} → ${r.url}`);error=null;break;}catch(e){error=e;}}if(error){console.error(`FAIL ${url}: ${error.message}`);process.exitCode=1;}}
console.log(`${urls.size} external destinations checked. HTTP checks do not establish content accuracy.`);
