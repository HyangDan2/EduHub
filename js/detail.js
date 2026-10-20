const p=new URLSearchParams(location.search),clean=new URLSearchParams();
for(const k of ['q','topic','kind'])if(p.get(k))clean.set(k,p.get(k).slice(0,300));
const query=clean.size?'?'+clean:'';
document.querySelector('#back-link').href='../../'+query+'#collection';
for(const a of document.querySelectorAll('[data-related]'))a.href+=query;
