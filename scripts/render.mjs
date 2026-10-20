import MarkdownIt from 'markdown-it';
export const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderNote(source) {
 const md=new MarkdownIt({html:false,linkify:false,typographer:false});
 md.validateLink=url=>/^https:\/\//i.test(url)||/^#[\w-]+$/.test(url);
 // Notes use HTTPS sources and fragment links only; local assets are intentionally unsupported.
 md.renderer.rules.image=(tokens,i)=>escapeHtml(tokens[i].content);
 const headings=[];
 md.renderer.rules.heading_open=(tokens,i)=>{const id=`section-${headings.length+1}`;headings.push({id,text:tokens[i+1].content});return `<${tokens[i].tag} id="${id}">`;};
 md.renderer.rules.table_open=()=>'<div class="table-scroll" tabindex="0" role="region" aria-label="표"><table>';
 md.renderer.rules.table_close=()=>'</table></div>';
 const html=md.render(source);
 return {html,headings};
}
