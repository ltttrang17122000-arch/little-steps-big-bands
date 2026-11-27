export const normalizeSearch = value => String(value ?? '').normalize('NFKD').replace(/\p{M}/gu,'')
  .toLowerCase().replace(/[’‘]/g,"'").replace(/[^\p{L}\p{N}'-]+/gu,' ').trim();
export const searchTokens = value => normalizeSearch(value).match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) ?? [];
const memo = new Map();
const shardLimit=30;
export const loadSearchData = name => {
  if (!/^(?:catalog|forms|headwords|lex-[a-f0-9]+)\.json$/.test(name)) return Promise.reject(Error('Invalid search data file'));
  if (!memo.has(name)) {
    const local = globalThis.littleStepsSearchData?.[name];
    const task = local ? Promise.resolve().then(()=>JSON.parse(local)) : fetch('search-data/'+name).then(response=>{
      if (!response.ok) throw Error('Dictionary data unavailable');
      return response.json();
    });
    memo.set(name,task.catch(error=>{memo.delete(name);throw error;}));
    const keys=[...memo.keys()].filter(key=>key.startsWith('lex-'));
    if(keys.length>shardLimit)memo.delete(keys[0]);
  }else if(name.startsWith('lex-')){
    const hit=memo.get(name);memo.delete(name);memo.set(name,hit);
  }
  return memo.get(name);
};
const baseForms = word => {
  const candidates = new Set([word]);
  const replace = (suffix,replacement)=>{if(word.length>suffix.length+2 && word.endsWith(suffix)) candidates.add(word.slice(0,-suffix.length)+replacement);};
  for (const [a,b] of [['ies','y'],['ves','f'],['ves','fe'],['es',''],['s',''],['ied','y'],['ed',''],['ed','e'],['ing',''],['ing','e'],['er',''],['er','e'],['est',''],['est','e']]) replace(a,b);
  const doubled = word.match(/^(.*([bdfgmnprt]))\2(?:ed|ing|er|est)$/);
  if (doubled) candidates.add(doubled[1]);
  return [...candidates];
};
const compare = (a,b)=>a<b?-1:a>b?1:0;
const lowerBound = (array,key,access=x=>x) => {
  let lo=0,hi=array.length;
  while(lo<hi){const mid=(lo+hi)>>>1;if(access(array[mid])<key)lo=mid+1;else hi=mid;}
  return lo;
};
const rowWord = row=>row[0];
const lookupRows = async candidates => {
  const {prefixes} = await loadSearchData('catalog.json');
  const groups=new Map();
  for (const word of candidates) {
    const file=prefixes[word.slice(0,2)];
    if (file) groups.set(file,[...(groups.get(file)??[]),word]);
  }
  return (await Promise.all([...groups].map(async ([file,keys])=>{
    const rows=await loadSearchData(file);
    return keys.map(key=>rows[lowerBound(rows,key,rowWord)]).filter(row=>row&&keys.includes(row[0]));
  }))).flat();
};
export const lexicalEntry = async word => (await lookupRows([normalizeSearch(word)]))[0];

const oneEdit = (a,b) => {
  if(Math.abs(a.length-b.length)>1 || a===b) return false;
  if(a.length>b.length) return oneEdit(b,a);
  let i=0;while(i<a.length&&a[i]===b[i])i++;
  if(a.length!==b.length) return a.slice(i)===b.slice(i+1);
  return a.slice(i+1)===b.slice(i+1) || (a[i]===b[i+1]&&a[i+1]===b[i]&&a.slice(i+2)===b.slice(i+2));
};
function distance(a,b) {
  if (Math.abs(a.length-b.length)>2) return 3;
  let prev=Array.from({length:b.length+1},(_,i)=>i);
  for (let i=1;i<=a.length;i++){
    const row=[i];
    for(let j=1;j<=b.length;j++)row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+Number(a[i-1]!==b[j-1]));
    prev=row;
  }
  return prev[b.length];
}
const spelling = async (query,quick) => {
  if(query.length<4 || query.length>32) return [];
  const terms=await loadSearchData('headwords.json');
  const near=[];
  for (const term of terms) {
    if (term.includes(' ')) continue;
    if (oneEdit(query,term)) near.push([term,1]);
    else if (!quick && query.length>=5 && term[0]===query[0] &&
      (term[1]===query[1] || term.at(-1)===query.at(-1)) && distance(query,term)===2) near.push([term,2]);
  }
  return near.sort(([a,x],[b,y])=>x-y || Number(b[0]===query[0])-Number(a[0]===query[0]) || compare(a,b)).slice(0,8).map(([word])=>word);
};
export const searchLexicon = async (value,{quick=false,related=true,pos=''}={})=>{
  const query=normalizeSearch(value);
  if(!query) return {hits:[],suggestions:[],expansions:[]};
  const {prefixes}=await loadSearchData('catalog.json');
  const candidates = /^[a-z'-]+$/.test(query) ? baseForms(query) : [query];
  if (!quick && candidates.length) {
    const forms=await loadSearchData('forms.json');
    candidates.push(...(Object.hasOwn(forms,query)?forms[query]:[]));
  }
  const accepted=row=>!pos || row[2].some(sense=>sense[0]===pos);
  const exact=(await lookupRows(candidates)).filter(accepted);
  const prefixFile=prefixes[query.slice(0,2)];
  const list=prefixFile ? await loadSearchData(prefixFile) : [];
  const prefix=[];
  if(query.length===1){
    const terms=await loadSearchData('headwords.json');
    const start=lowerBound(terms,query);
    prefix.push(...(await lookupRows(terms.slice(start,start+24).filter(term=>term.startsWith(query)))).filter(accepted));
  }
  for(let i=lowerBound(list,query,rowWord);i<list.length&&list[i][0].startsWith(query)&&prefix.length<24;i++){
    if(accepted(list[i])&&!exact.includes(list[i]))prefix.push(list[i]);
  }
  const compounds=[];
  if (!quick && query.length>=3 && !query.includes(' ')) {
    const heads=await loadSearchData('headwords.json');
    for (const term of heads) {
      if (!term.includes(' ')) continue;
      if (term.endsWith(' '+query) || term.includes(' '+query+' ')) compounds.push(term);
      if (compounds.length>=10) break;
    }
  }
  const synonyms = related ? [...new Set(exact.slice(0,3).flatMap(row=>[...row[3],...row[2].slice(0,2).flatMap(s=>s[3])]))].filter(w=>w!==query).slice(0,16) : [];
  const suggestions=exact.length||prefix.length ? [] : await spelling(query,quick);
  const extra = await lookupRows([...compounds,...synonyms,...suggestions]);
  const unique = new Map();
  const add=(rows,kind)=>{for(const row of rows)if(accepted(row)&&!unique.has(row[0]))unique.set(row[0],{row,kind});};
  add(exact,'exact');add(prefix,'prefix');add(extra.filter(row=>compounds.includes(row[0])),'phrase');
  add(extra.filter(row=>synonyms.includes(row[0])),'related');add(extra.filter(row=>suggestions.includes(row[0])),'spelling');
  return {hits:[...unique.values()],suggestions,expansions:exact.length?[...new Set([...exact.map(row=>row[0]),...synonyms])]:[]};
};

const stopWords = new Set('a an and are as at be by do for from has have in is it of on or that the this to was were with'.split(' '));
const indexedTokens = text => [...new Set(searchTokens(text).filter(word=>word.length>1&&!stopWords.has(word)))];
export const createSearchIndex = docs => {
  const rows=docs.map(doc=>({...doc,key:normalizeSearch(doc.title),full:normalizeSearch(doc.body)}));
  const postings=new Map();
  rows.forEach((doc,id)=>{
    for(const token of indexedTokens([doc.title,doc.body,doc.topic,doc.subtopic,doc.type].join(' '))){
      if(!postings.has(token))postings.set(token,[]);
      postings.get(token).push(id);
    }
  });
  const terms=[...postings.keys()].sort(compare);
  return {rows,postings,terms};
};
export const querySearchIndex = (index,value,expansions=[],filters={})=>{
  const query=normalizeSearch(value);
  if(!query)return [];
  const tokens=indexedTokens(query);
  const matches=new Map();
  for(const token of tokens.length?tokens:[query]){
    const relevant=new Set();
    const forms=baseForms(token);
    for(const form of forms)for(const id of index.postings.get(form)??[])relevant.add(id);
    if(token.length>=3)for(let at=lowerBound(index.terms,token),n=0;index.terms[at]?.startsWith(token)&&n<45;at++,n++){
      for(const id of index.postings.get(index.terms[at]))relevant.add(id);
    }
    for(const id of relevant)matches.set(id,(matches.get(id)??0)+1);
  }
  if(tokens.length===1)for(const word of expansions.slice(0,16)){
    for(const id of index.postings.get(word)??[])if(!matches.has(id))matches.set(id,.35);
  }
  if([1,2].includes(query.length))for(const [id,row] of index.rows.entries())
    if(row.key.startsWith(query)&&!matches.has(id))matches.set(id,1);
  const score = (row,hits) => {
    const title=row.key===query ? 120 : row.key.startsWith(query) ? 65 : row.key.includes(query) ? 45 : 0;
    return title+(row.full.includes(query)?18:0)+hits*10;
  };
  return [...matches].flatMap(([id,hits])=>{
    const row=index.rows[id];
    if(tokens.length>1 && hits<tokens.length && !row.key.includes(query) && !row.full.includes(query))return [];
    if(Object.entries(filters).some(([key,value])=>value && !String(row[key]??'').split('|').includes(value)))return [];
    return [{...row,score:score(row,hits)}];
  }).sort((a,b)=>b.score-a.score||compare(a.title,b.title));
};
