import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {root} from './validate-catalog.mjs';
const port=Number(process.env.PORT||4174);
const courseUrl='https://hyangdan2.github.io/EDPilot0001/';
const hubReturn='https://hyangdan2.github.io/EduHub/#entry-edpilot0001';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/'){res.writeHead(302,{Location:'/EduHub/'});return res.end();}
 const course=pathname.startsWith('/EDPilot0001/');
 const prefix=course?'/EDPilot0001/':'/EduHub/';
 if(!pathname.startsWith(prefix))throw Error('404');
 const base=path.resolve(root,course?'../EDPilot0001/output/site':'dist');
 let file=path.resolve(base,pathname.slice(prefix.length));
 if(file!==base&&!file.startsWith(base+path.sep))throw Error('404');
 if((await fs.stat(file)).isDirectory()){if(!pathname.endsWith('/')){res.writeHead(301,{Location:pathname+'/'});return res.end();}file=path.join(file,'index.html');}
 const real=await fs.realpath(file);if(!real.startsWith(base+path.sep))throw Error('404');
 let body=await fs.readFile(real);
 // Local preview only: keep generated distribution files and production URLs untouched.
 if(course&&path.extname(file)==='.html')body=Buffer.from(body.toString().replaceAll(hubReturn,'/EduHub/#entry-edpilot0001'));
 if(!course&&(file.endsWith('search.json')||path.extname(file)==='.html'))body=Buffer.from(body.toString().replaceAll(courseUrl,'/EDPilot0001/'));
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(body);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/EduHub/ (course preview: /EDPilot0001/)`));
