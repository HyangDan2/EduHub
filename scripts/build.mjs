import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {root,loadCatalog} from './validate-catalog.mjs';
import {renderNote,escapeHtml as esc} from './render.mjs';
import {sortEntries,kinds} from '../js/catalog.js';
const catalog=await loadCatalog(), out=path.join(root,'dist');
await fs.rm(out,{recursive:true,force:true}); await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'.nojekyll'),'');
for(const dir of ['css','js','assets/branding']) await fs.cp(path.join(root,dir),path.join(out,dir),{recursive:true});
const entries=await Promise.all(sortEntries(catalog.entries.filter(e=>e.status==='published')).map(async e=>{const {contentPath,...publicEntry}=e; return {...publicEntry,body:contentPath?await fs.readFile(path.join(root,contentPath),'utf8'):''};}));
await fs.mkdir(path.join(out,'data')); await fs.writeFile(path.join(out,'data/search.json'),JSON.stringify(entries));
const origin=process.env.PUBLIC_URL;
if(origin&&(!origin.startsWith('https://')||!origin.endsWith('/EduHub/'))) throw Error('PUBLIC_URL must be a confirmed HTTPS URL ending in /EduHub/');
function head(title,description,prefix,route='') {return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#111310"><title>${esc(title)} · EduHub</title><meta name="description" content="${esc(description)}"><meta property="og:title" content="${esc(title)} · EduHub"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website">${origin?`<link rel="canonical" href="${esc(origin+route)}"><meta property="og:url" content="${esc(origin+route)}">`:''}<link rel="icon" href="${prefix}assets/branding/favicon.svg"><link rel="stylesheet" href="${prefix}css/style.css">`;}
const header=prefix=>`<a class="skip-link" href="#main">본문으로 이동</a><header class="site-header shell"><a class="brand" href="${prefix}"><span class="brand-mark" aria-hidden="true">▤</span>EduHub<span class="lime">.</span></a><nav aria-label="메인 메뉴"><a href="${prefix}#collection">학습 아카이브</a><a class="hq-link" href="https://hyangdan2.github.io/">Web-HQ ↗</a></nav></header>`;
const footer='<footer class="shell site-footer"><div class="footer-brand">HD2Lab <span class="lime">/</span> EduHub<p>A little space for a curious mind.</p></div><span>배움은 지나가도, 기록은 남으니까.</span></footer>';
let home=await fs.readFile(path.join(root,'index.html'),'utf8');
home=home.replace('<!--HEAD-->',head('배움을 쌓는 나만의 공간','공부한 내용과 작은 실험을 모아두는 학습 아카이브.','./')).replace('<!--HEADER-->',header('./')).replace('<!--FOOTER-->',footer);
await fs.writeFile(path.join(out,'index.html'),home);
for(const e of entries) {
 const {html,headings}=renderNote(e.body), related=entries.filter(x=>x.id!==e.id&&(x.topic===e.topic||x.tags.some(t=>e.tags.includes(t)))).slice(0,3);
 const sources=e.sources.map(s=>`<a href="${esc(s.url)}"><span>${esc({original:'원문',repository:'저장소',demo:'실습',reference:'참고 자료'}[s.type])}</span>${esc(s.label)} ↗</a>`).join('');
 const page=`<!doctype html><html lang="ko"><head>${head(e.title,e.summary,'../../',`entries/${e.id}/`)}</head><body>${header('../../')}<main id="main" class="shell detail"><a class="back-link" id="back-link" href="../../#collection">← 학습 아카이브로</a><div class="detail-heading"><p class="eyebrow lime">${esc(e.topic)} / ${esc(kinds[e.kind])}</p><h1>${esc(e.title)}</h1><p class="lede">${esc(e.summary)}</p>${e.learningUrl?`<a class="primary" href="${esc(e.learningUrl)}">학습 시작 ↗</a>`:''}<div class="detail-meta">${e.sample?'<span class="sample">예시 콘텐츠</span>':''}<span>${e.studiedAt?`학습 ${esc(e.studiedAt)}`:'학습일 미기록'}</span><span>기록 수정 ${esc(e.updatedAt)}</span></div></div><div class="reading-layout"><article class="prose">${html||'<p>아래 출처에서 학습 자료를 확인하세요.</p>'}${sources?`<section class="sources"><h2>출처와 연결</h2>${sources}</section>`:''}</article><aside>${headings.length>=3?`<nav class="toc" aria-label="목차"><p class="eyebrow">ON THIS PAGE</p>${headings.map(h=>`<a href="#${h.id}">${esc(h.text)}</a>`).join('')}</nav>`:''}<div class="aside-note"><span class="lime">✳</span><p>작은 질문 하나가<br>다음 배움의 시작.</p></div></aside></div>${related.length?`<section class="related"><p class="eyebrow muted">KEEP CONNECTING</p><h2>이어서 읽어볼 기록</h2><div class="related-grid">${related.map(r=>`<a href="../${r.id}/" data-related><span>${esc(r.topic)}</span><h3>${esc(r.title)}</h3><span>정리 읽기 ↗</span></a>`).join('')}</div></section>`:''}</main>${footer}<script type="module" src="../../js/detail.js"></script></body></html>`;
 const dir=path.join(out,'entries',e.id);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),page);
}
await fs.writeFile(path.join(out,'release.json'),JSON.stringify({digest:createHash('sha256').update(JSON.stringify(entries)).digest('hex'),count:entries.length}));
console.log(`Built ${entries.length} published records in dist/ (base /EduHub/).`);
