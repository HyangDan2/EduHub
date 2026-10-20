import {kinds,readState,stateQuery,filterEntries} from './catalog.js';
const grid=document.querySelector('#entry-grid'), search=document.querySelector('#search'), kind=document.querySelector('#kind'), topics=document.querySelector('#topics'), result=document.querySelector('#result-count');
let entries=[],state={q:'',topic:'',kind:''};
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
function update(push=true) {
 const query=stateQuery(state);if(push&&location.search!==query)history.pushState(null,'',location.pathname+query+'#collection');
 search.value=state.q;kind.value=state.kind;
 for(const b of topics.children)b.setAttribute('aria-pressed',String(b.dataset.topic===state.topic));
 const matches=filterEntries(entries,state);result.textContent=`${matches.length}개의 기록${state.q?` · “${state.q}” 검색 결과`:''}`;
 grid.replaceChildren();
 if(!matches.length){const box=el('div','empty');box.append(el('span','empty-icon','⌕'),el('h3','',entries.length?'아직 찾는 기록이 없어요.':'첫 번째 배움을 기다리고 있어요.'),el('p','',entries.length?'다른 검색어를 입력하거나 필터를 초기화해 보세요.':'학습 기록을 추가하면 여기에 차곡차곡 모입니다.'));if(entries.length){const b=el('button','primary','전체 기록 보기');b.onclick=reset;box.append(b);}grid.append(box);}
 for(const e of matches){const card=el('article','entry-card');card.dataset.kind=e.kind;card.id=`entry-${e.id}`;
 const top=el('div','card-top');top.append(el('span','topic-label',e.topic),el('span','card-symbol',({note:'▤',project:'⌘',course:'◷',article:'↗',video:'▷'})[e.kind]));
 const meta=el('div','card-meta');meta.append(el('span','kind-label',kinds[e.kind]));if(e.sample)meta.append(el('span','sample','예시'));
 const h=el('h3'),a=el('a','entry-link',e.title);a.href=e.learningUrl||`./entries/${e.id}/${query}`;h.append(a);if(e.learningUrl){const intro=el('a','intro-link','자료 소개');intro.href=`./entries/${e.id}/${query}`;meta.append(intro);}
 const tags=el('div','tags');for(const tag of e.tags)tags.append(el('span','',`#${tag}`));
 const foot=el('div','card-foot');foot.append(el('span','',e.studiedAt||'학습일 미기록'),el('span','read-more',e.learningUrl?'학습 시작 ↗':'정리 읽기 ↗'));
 card.append(top,meta,h,el('p','card-description',e.summary),tags,foot);grid.append(card);}
}
function reset(){state={q:'',topic:'',kind:''};update();}
async function load(){grid.setAttribute('aria-busy','true');try{const response=await fetch('./data/search.json');if(!response.ok)throw Error('load');entries=await response.json();if(!Array.isArray(entries))throw Error('format');state=readState(location.search,entries);topics.replaceChildren();for(const topic of ['',...new Set(entries.map(e=>e.topic))]){const b=el('button','topic',topic||'전체');b.type='button';b.dataset.topic=topic;b.onclick=()=>{state.topic=topic;update();};topics.append(b);}document.querySelector('#total-count').textContent=entries.length;update(false);if(location.hash.startsWith('#entry-'))requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}catch{result.textContent='기록을 불러오지 못했습니다.';const box=el('div','empty');box.append(el('h3','','아카이브를 불러오지 못했어요.'),el('p','','잠시 후 다시 시도해 주세요.'));const b=el('button','primary','다시 시도');b.onclick=load;box.append(b);grid.replaceChildren(box);}finally{grid.setAttribute('aria-busy','false');}}
document.querySelector('#search-form').onsubmit=e=>{e.preventDefault();state.q=search.value.trim();update();};
search.addEventListener('input',e=>{if(e.isComposing)return;state.q=search.value;update();});
search.addEventListener('compositionend',()=>{state.q=search.value;update();});
kind.onchange=()=>{state.kind=kind.value;update();};document.querySelector('#clear').onclick=reset;
window.addEventListener('popstate',()=>{state=readState(location.search,entries);update(false);});
load();
