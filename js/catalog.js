export const kinds = {note:'학습 노트',course:'강의',article:'아티클',video:'영상',project:'실습 프로젝트'};
export function sortEntries(entries) { return [...entries].sort((a,b)=>(b.studiedAt||'').localeCompare(a.studiedAt||'') || b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id)); }
export function readState(search, entries) {
 const p=new URLSearchParams(search), topic=p.get('topic')||'', kind=p.get('kind')||'';
 return {q:(p.get('q')||'').slice(0,300),topic:entries.some(e=>e.topic===topic)?topic:'',kind:Object.hasOwn(kinds,kind)?kind:''};
}
export function stateQuery(s) { const p=new URLSearchParams(); for(const k of ['q','topic','kind']) if(s[k]) p.set(k,s[k]); return p.size?'?'+p.toString():''; }
export function filterEntries(entries,s) { const terms=s.q.normalize('NFC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean); return sortEntries(entries.filter(e=>e.status==='published'&&(!s.topic||e.topic===s.topic)&&(!s.kind||e.kind===s.kind)&&terms.every(t=>[e.title,e.summary,e.topic,...e.tags,e.body||''].join(' ').normalize('NFC').toLocaleLowerCase().includes(t)))); }
