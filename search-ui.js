import {lexicalEntry, normalizeSearch, searchLexicon, searchTokens} from './smart-search.js';
import {categoryLabels, searchStudy} from './search-corpus.js';
import {learnerGlosses} from './learner-glosses.js';

const esc = input => String(input??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const action = (key,label) => `<button class="btn secondary small" type="button" data-search-act="${key}">${label}</button>`;
const labels = {level:'CEFR',programme:'Programme',skill:'Skill',topic:'Topic',subtopic:'Subtopic',type:'Exercise type',
  pos:'Part of speech',difficulty:'Difficulty',status:'Learning status'};
const pattern = query => {
  const terms=searchTokens(query).sort((a,b)=>b.length-a.length).filter(term=>term.length>1);
  return terms.length?new RegExp('('+terms.join('|')+')','gi'):null;
};
const marked = (text,query) => {
  const regex=pattern(query);
  return regex?String(text).split(regex).map((part,i)=>i%2?'<mark>'+esc(part)+'</mark>':esc(part)).join(''):esc(text);
};
const snippet = (text,query) => {
  const value=String(text??'').replace(/\s+/g,' ');
  const first=value.search(pattern(query)??/./);
  const start=first>75?Math.max(0,value.lastIndexOf(' ',first-62)+1):0;
  return (start?'…':'')+value.slice(start,start+180)+(start+180<value.length?'…':'');
};
const historyKey='little-steps-search-history-v1';
const readHistory=()=>{
  try{const history=JSON.parse(localStorage.getItem(historyKey));return Array.isArray(history)?history.filter(x=>typeof x==='string').slice(0,20):[];}catch{return [];}
};
const saveHistory=history=>{try{localStorage.setItem(historyKey,JSON.stringify(history));}catch{}};
const human = name=>name ? name[0].toUpperCase()+name.slice(1) : '';
const wordButtons = items=>items.map(term=>`<button type="button" class="btn flat small" data-lookup="${esc(term)}">${esc(term)}</button>`).join('');

function dictionaryHTML(detail,entry,senses,related,tiers,saved) {
  const levels=['A1','A2','B1','B2'];
  const examples=entry?.example ? `<p><em>${esc(entry.example)}</em></p>` : '';
  const colloc=detail.collocation ? `<p><strong>${entry?.collocation?'Collocation':'Related expression'}</strong> · ${esc(detail.collocation)}</p>` : '';
  const graded=tiers ? `<details open><summary>A1–B2 explanations</summary><dl>${tiers.map((line,i)=>`<dt>${levels[i]}</dt><dd>${esc(line)}</dd>`).join('')}</dl></details>` :
    entry?.plain&&entry.definition!==entry.plain ? `<details><summary>More precise explanation</summary><p>${esc(entry.definition)}</p></details>` : '';
  const definitions=senses.length ? `<details open><summary>English dictionary definitions</summary><ol>${senses.map(([part,meaning,uses,synonyms])=>{
    const samples=uses.map(use=>`<p><em>${esc(use)}</em></p>`).join('');
    const links=synonyms.length?`<div class="actions"><small>Synonyms</small>${wordButtons(synonyms)}</div>`:'';
    return `<li><strong>${esc(part)}</strong> · ${esc(meaning)}${samples}${links}</li>`;
  }).join('')}</ol></details>` : '';
  return `<article class="dictionary-entry"><div class="search-row-head">${action('back','Back to results')}${detail.plain?action('hear','Play pronunciation'):''}</div>
    <h2 tabindex="-1">${esc(detail.word)}</h2><p class="muted">${esc(detail.pos)} ${detail.ipa?' · US IPA /'+esc(detail.ipa)+'/':''}</p>
    ${entry?.plain?'<p>'+esc(entry.plain)+'</p>':''}${examples}${colloc}${graded}${definitions}
    ${related.length?`<details><summary>Word family</summary><div class="actions">${wordButtons(related)}</div></details>`:''}
    ${detail.plain?`<div class="actions"><button type="button" class="btn" data-search-act="save">${saved?'Remove from My Vocabulary':'Save to My Vocabulary'}</button></div>`:
      '<p>No entry found. Try a different spelling or a shorter phrase.</p>'}
    ${senses.length?'<p class="fine muted">Definitions and word relations from Princeton WordNet. US IPA is converted from CMUdict where available.</p>':''}</article>`;
}

export const setupSmartSearch = ({corpus,personal,statusOf,curated,saveWord,isSaved,openResult,announce}) => {
  const dialog=document.querySelector('#global-search'), toggle=document.querySelector('#search-toggle');
  if(!dialog || !toggle)return null;
  const input=dialog.querySelector('input[type=search]'), results=dialog.querySelector('#global-results'), facets=dialog.querySelector('#search-facets');
  const filters=Object.fromEntries(Object.keys(labels).map(key=>[key,'']));
  let category='', history=readHistory(), index, timer, revision=0, rows=[], detail, lastMode='all', opener;
  const selectHTML=(key,options,value)=>`<label class="field">${labels[key]??'Category'}<select name="${key}"><option value="">All</option>
    ${options.map(([id,label])=>`<option value="${esc(id)}" ${id===value?'selected':''}>${esc(label)}</option>`).join('')}</select></label>`;
  const ensureIndex=()=>index??=(corpus().catch(error=>{index=undefined;throw error;}));
  const setFilters=payload=>{
    const values=Object.fromEntries(Object.keys(labels).map(key=>[key,new Set()]));
    for(const doc of [...payload.docs,...personal(payload.docs)]){
      for(const [key,set] of Object.entries(values))for(const v of String(doc[key]??'').split('|'))if(v)set.add(v);
    }
    for(const pos of ['noun','verb','adjective','adverb'])values.pos.add(pos);
    for(const status of ['Saved','Completed','In progress','New'])values.status.add(status);
    facets.innerHTML=selectHTML('category',Object.entries(categoryLabels),category)+Object.entries(values).map(([key,list])=>
      selectHTML(key,[...list].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).map(v=>[v,key==='skill'?human(v):v]),filters[key])).join('');
  };
  const remember=text=>{
    const query=text.trim().slice(0,128);
    if(!query)return;
    history=[query,...history.filter(x=>normalizeSearch(x)!==normalizeSearch(query))].slice(0,20);
    saveHistory(history);
  };
  const recent=()=>{
    rows=[];
    results.innerHTML=history.length?`<div class="search-row-head"><h3>Recent searches</h3>${action('clear','Clear history')}</div>
      <div class="actions">${history.map((item,i)=>`<button class="btn secondary small" type="button" data-recent="${i}">${esc(item)}</button>`).join('')}</div>`:
      '<p class="muted">Search for a word, phrase or something you remember from a lesson.</p>';
  };
  const drawDictionary=async (word, local)=>{
    const call=++revision;
    results.innerHTML='<p role="status">Opening dictionary entry…</p>';
    const lexical=await lexicalEntry(word).catch(()=>null);
    if(call!==revision || !dialog.open)return;
    const entry=local??curated(word);
    const tiers=Object.hasOwn(learnerGlosses,word)?learnerGlosses[word]:null;
    const senses=lexical?.[2]??[];
    const colloc=entry?.collocation??senses.flatMap(sense=>sense[3]).find(term=>term.split(' ').includes(word))??'';
    detail={word:entry?.word??word,pos:entry?.pos??senses[0]?.[0]??'',level:entry?.level??'',plain:entry?.plain??senses[0]?.[1]??'',
      definition:entry?.definition??senses[0]?.[1]??'',example:entry?.example??senses[0]?.[2][0]??'',collocation:colloc,ipa:lexical?.[1]??''};
    results.innerHTML=dictionaryHTML(detail,entry,senses,lexical?.[3]??[],tiers,isSaved(detail.word));
    results.querySelector('h2')?.focus({preventScroll:true});
  };
  const render=(matches,suggestions,query,compact,partial)=>{
    rows=[];
    const grouped=Object.entries(categoryLabels).flatMap(([key,label])=>{
      const list=matches.filter(row=>row.category===key);
      if(!list.length)return [];
      const items=list.slice(0,compact?2:24).map(row=>{
        const id=rows.push(row)-1;
        const info=[row.level?.replaceAll('|',' / '),row.skill?human(row.skill):'',row.kind==='spelling'?'Spelling suggestion':row.type].filter(Boolean).join(' · ');
        return `<li><button type="button" data-result="${id}" class="search-hit"><strong>${marked(row.title,query)}</strong>
          ${info?'<small>'+esc(info)+'</small>':''}<span>${marked(snippet(row.body,query),query)}</span></button></li>`;
      }).join('');
      return `<section class="search-group"><h3>${label}</h3><ul>${items}</ul>${!compact&&list.length>24?'<p class="fine muted">Refine the query or choose a filter to see more specific matches.</p>':''}</section>`;
    });
    const suggestionHTML=suggestions.length?`<div class="actions"><span>Did you mean</span>
      ${suggestions.map(term=>`<button type="button" class="btn flat small" data-suggest="${esc(term)}">${marked(term,query)}</button>`).join('')}</div>`:'';
    results.innerHTML=`<div class="search-row-head"><p role="status" class="smalltext muted">${compact?'Suggestions':'Search results'} · ${matches.length} matches</p>
      ${compact&&matches.length?action('all','See all results'):''}</div>${suggestionHTML}
      ${partial?'<p class="fine muted">Some data packs could not be opened. Results include the packs that are available.</p>':''}
      ${grouped.join('')}${!matches.length?'<p>Try a different word, phrase or filter.</p>':''}`;
  };
  const run=async mode=>{
    lastMode=mode;
    const compact=mode==='quick', sequence=++revision;
    detail=undefined;
    const query=input.value.trim().slice(0,128);
    if(!query){recent();return;}
    const chosen={...filters}, cat=category;
    const facetMatch=doc=>Object.entries(chosen).every(([key,value])=>!value||String(doc[key]??'').split('|').includes(value));
    const [payload,lex]=await Promise.all([ensureIndex().catch(()=>null),searchLexicon(query,{quick:compact,pos:chosen.pos}).catch(()=>null)]);
    if(sequence!==revision||!dialog.open)return;
    const learningStatus=statusOf();
    const docs=payload ? searchStudy(payload,personal(payload.docs),query,lex?.expansions)
      .map(doc=>({...doc,status:doc.status||learningStatus(doc)})).filter(doc=>(!cat||doc.category===cat)&&facetMatch(doc)) : [];
    const dictionary=(!cat || cat==='dictionary') ? (lex?.hits??[]).flatMap(({row,kind})=>{
      const word=row[0], local=curated(word);
      const senses=row[2].filter(sense=>!chosen.pos||sense[0]===chosen.pos);
      const doc={category:'dictionary',title:word,word,skill:'vocabulary',level:local?.level??'',pos:senses.map(sense=>sense[0]).join('|'),
        status:isSaved(word)?'Saved':'New',type:word.includes(' ')?'Phrase':'Word entry',kind,body:senses[0]?.[1]??''};
      return facetMatch(doc)?[doc]:[];
    }):[];
    render([...dictionary,...docs],lex?.suggestions??[],query,compact,!payload?.complete||!lex);
  };
  const open=(prefill='',scope='',target=toggle)=>{
    opener=target;
    if(!dialog.open)dialog.showModal();
    if(scope){category=scope==='all'?'':scope;for(const key of Object.keys(filters))filters[key]='';}
    if(prefill)input.value=prefill;
    input.focus();
    if(!prefill)input.select();
    if(input.value.trim()){results.innerHTML='<p role="status">Searching…</p>';run('all');}else recent();
    ensureIndex().then(setFilters).catch(()=>{});
  };
  const commit=()=>{clearTimeout(timer);remember(input.value);run('all');};
  toggle.addEventListener('click',()=>open('','all'));
  dialog.addEventListener('close',()=>{revision++;clearTimeout(timer);if(opener?.isConnected&&!opener.hidden)opener.focus({preventScroll:true});});
  input.addEventListener('input',()=>{
    clearTimeout(timer);revision++;detail=undefined;timer=setTimeout(()=>run('quick'),130);
  });
  input.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'&&rows.length){event.preventDefault();results.querySelector('[data-result="0"]')?.focus();}
  });
  results.addEventListener('keydown',event=>{
    if(!['ArrowDown','ArrowUp'].includes(event.key)||!event.target.matches('[data-result]'))return;
    event.preventDefault();
    const next=Number(event.target.dataset.result)+(event.key==='ArrowDown'?1:-1);
    if(next<0)input.focus();
    else results.querySelector('[data-result="'+Math.min(rows.length-1,next)+'"]')?.focus();
  });
  dialog.querySelector('form').addEventListener('submit',event=>{event.preventDefault();commit();});
  facets.addEventListener('change',event=>{
    const {name,value}=event.target;
    if(name==='category')category=value;else if(Object.hasOwn(filters,name))filters[name]=value;
    commit();
  });
  dialog.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button)return;
    const {searchAct,result,suggest,recent:recentIndex,lookup}=button.dataset;
    if(lookup){drawDictionary(lookup);return;}
    if(result!==undefined){
      const row=rows[Number(result)];
      if(!row)return;
      remember(input.value);
      if(row.word)drawDictionary(row.word,row.entry);else{dialog.close();openResult(row,filters.level);}
      return;
    }
    if(suggest||recentIndex!==undefined){input.value=suggest??history[Number(recentIndex)];commit();return;}
    if(searchAct==='close')dialog.close();
    if(searchAct==='clear'){history=[];saveHistory(history);recent();}
    if(searchAct==='all')commit();
    if(searchAct==='back')run(lastMode);
    if(searchAct==='reset'){
      category='';for(const key of Object.keys(filters))filters[key]='';
      ensureIndex().then(setFilters).catch(()=>{});run('all');
    }
    if(searchAct==='save'&&detail){saveWord(detail);button.textContent=isSaved(detail.word)?'Remove from My Vocabulary':'Save to My Vocabulary';}
    if(searchAct==='hear'&&detail){
      if(!('speechSynthesis' in window)){announce('Pronunciation is unavailable in this browser.');return;}
      const speech=new SpeechSynthesisUtterance(detail.word);
      speech.lang='en-US';speechSynthesis.cancel();speechSynthesis.speak(speech);
    }
  });
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();open('','all');}
  });
  const selectionButton=document.querySelector('#selection-lookup');
  let selectionText='';
  document.addEventListener('selectionchange',()=>{
    const selection=window.getSelection(), text=selection?.toString().trim()??'';
    const usable=!dialog.open&&text.length>=2&&text.length<=70&&
      selection?.anchorNode&&document.querySelector('#main')?.contains(selection.anchorNode)&&
      !selection.anchorNode.parentElement?.closest('textarea,input,button,select');
    if(usable)selectionText=text;
    if(selectionButton)selectionButton.hidden=!usable;
  });
  selectionButton?.addEventListener('pointerdown',event=>event.preventDefault());
  selectionButton?.addEventListener('click',()=>{if(selectionText)open(selectionText,'dictionary',toggle);});
  return {open};
};
