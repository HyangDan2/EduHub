import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import Ajv from 'ajv';
export const root=path.resolve(import.meta.dirname,'..');
export async function safeFile(relative, directory, base=root) {
 const allowed=await fs.realpath(path.join(base,directory));
 const actual=await fs.realpath(path.resolve(base,relative));
 if(!actual.startsWith(allowed+path.sep)||!(await fs.stat(actual)).isFile()) throw Error(`Disallowed path: ${relative}`);
 return actual;
}
export async function validateCatalog(catalog, base=root) {
 const schema=JSON.parse(await fs.readFile(path.join(root,'schema/entries.schema.json'),'utf8'));
 const validate=new Ajv({allErrors:true}).compile(schema);
 if(!validate(catalog)) throw Error(JSON.stringify(validate.errors));
 const ids=new Set();
 for(const e of catalog.entries) {
  if(ids.has(e.id)) throw Error(`Duplicate ID: ${e.id}`); ids.add(e.id);
  for(const k of ['studiedAt','updatedAt']) if(e[k] && (Number.isNaN(Date.parse(e[k]))||new Date(e[k]).toISOString().slice(0,10)!==e[k])) throw Error(`Invalid date: ${e.id}`);
  for(const s of [...e.sources,...(e.learningUrl?[{url:e.learningUrl}]:[])]) { const u=new URL(s.url); if(u.protocol!=='https:'||!u.hostname||u.username||u.password) throw Error(`Unsafe URL: ${e.id}`); }
  if(e.contentPath) { const p=await safeFile(e.contentPath,'content/notes',base); if(!(await fs.readFile(p,'utf8')).trim()) throw Error(`Empty body: ${e.id}`); }
  if(e.status==='published') {
   if(!e.contentPath&&!e.sources.length&&!e.learningUrl) throw Error(`Missing content: ${e.id}`);
   await safeFile(`docs/onboarding/${e.id}.md`,'docs/onboarding',base);
  }
 }
 return catalog;
}
export async function loadCatalog() { return validateCatalog(JSON.parse(await fs.readFile(path.join(root,'data/entries.json'),'utf8'))); }
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) { const c=await loadCatalog(); console.log(`Validated ${c.entries.length} records.`); }
