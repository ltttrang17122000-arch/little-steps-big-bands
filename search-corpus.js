import {createSearchIndex, normalizeSearch, querySearchIndex} from './smart-search.js';
import {journeyCatalog, journeyLessonId, journeySkills, loadJourneyDay} from './journey.js';

export const categoryLabels={
  dictionary:'Master Dictionary', vocabulary:'Vocabulary Academy', myWords:'My Vocabulary',
  skills:'Skills practice', grammar:'Grammar Library', theory:'Theory & Strategy Library',
  questions:'Question Bank', tests:'Mini Tests & Mock Exams', journey:'365-Day Learning Journey',
  notes:'Personal Notes', mistakes:'Mistake Journal', saved:'Saved Exercises'
};
const flattenText = value => {
  if(typeof value==='string')return value;
  if(Array.isArray(value))return value.map(flattenText).join(' ');
  if(value&&typeof value==='object')return Object.values(value).map(flattenText).join(' ');
  return '';
};
const difficulty = level => /C[12]/.test(level) ? 'Advanced' : /B[12]/.test(level) ? 'Intermediate' : /A[12]/.test(level) ? 'Foundation' : '';
const qType = q => q.options?.includes('Not Given')?'True / False / Not Given':q.options?'Multiple choice':'Short answer';
const journeyTopic = day => {
  if(day<=5)return 'Education and culture';
  if(day<=10)return 'Environment and resources';
  if(day<=15)return 'Cities and communities';
  if(day<=20)return 'Science and technology';
  if(day<=25)return 'Work and society';
  return 'Culture and social change';
};
const partText = part => flattenText([part.paragraphs,part.lines,part.prompt,part.prompts,part.plan,part.model,part.guide,part.table,part.diagram,part.questions?.map(q=>q.prompt)]);
const addPart = (docs,part,meta,href,partIndex) => {
  const body=partText(part);
  docs.push({...meta,title:part.title,body,type:meta.category==='tests'?meta.type:part.type || meta.type,href});
  for(const [i,q] of (part.questions??[]).entries()){
    docs.push({...meta,category:'questions',title:q.prompt,body:[part.title,flattenText(q.options)].join(' '),
      type:meta.skill==='grammar'?'Grammar multiple choice':qType(q),href,part:partIndex,question:i});
  }
};
export const makeSearchCorpus = async (lessons,assessments,academy,words) => {
  const docs=[];
  for(const [isTest,group] of [[false,lessons],[true,assessments]]){
    for(const lesson of group){
      const programme=isTest?'IELTS Academic':/^(B2|C1|C2)$/.test(lesson.level)?'IELTS Academic':'General English';
      const level = lesson.level.replace(/[^A-C12]+/g,'|');
      const key=(isTest?'assessment-':'')+lesson.id;
      const href=(isTest?'#test/':'#lesson/')+lesson.id;
      const meta={category:isTest?'tests':'skills',programme,skill:lesson.skill,level,
        difficulty:difficulty(level),topic:'Practice library',subtopic:lesson.title,
        type:isTest?(lesson.id.startsWith('mock')?'Mock exam':'Mini test'):'Skill practice',key};
      if(lesson.parts.length>1)docs.push({...meta,title:lesson.title,body:lesson.parts.map(part=>part.title).join(' '),href});
      lesson.parts.forEach((part,i)=>addPart(docs,part,meta,href,i));
    }
  }
  for(const [skill,items] of Object.entries(academy)){
    items.forEach((item,i)=>docs.push({category:'theory',title:item.type,body:flattenText([item.steps,item.example,item.prompt,item.why]),
      programme:'IELTS Academic',skill,topic:'Study methods',subtopic:item.type,type:'Strategy',href:'#academy/'+skill+'/'+i}));
  }
  for(const word of words)docs.push({category:'vocabulary',title:word.word,word:word.word,body:[word.plain,word.definition,word.example,word.collocation].join(' '),
    pos:word.pos,topic:'Core vocabulary',subtopic:word.collocation,level:word.level,difficulty:difficulty(word.level),skill:'vocabulary',type:'Word study'});
  let complete=true;
  try {
    const catalog=await journeyCatalog();
    const batches=await Promise.allSettled(catalog.packs.map(async pack=>{
      const days=await Promise.all(pack.days.map(({day})=>loadJourneyDay(catalog,pack.program,day)));
      return {pack,days,program:catalog.programs.find(item=>item.id===pack.program)};
    }));
    for(const batch of batches){
      if(batch.status==='rejected'){complete=false;continue;}
      const {pack,days,program}=batch.value;
      for(const day of days.filter(Boolean)){
        const meta={programme:program.title,level:program.levels.join('|'),
          difficulty:[...new Set(program.levels.map(difficulty))].join('|'),topic:day.topic??(pack.id==='academic-001-030'?journeyTopic(day.day):pack.title),subtopic:day.theme};
        const level=program.levels[0];
        const base='#journey/'+pack.program+'/'+day.day+'/'+level;
        docs.push({...meta,category:'journey',title:day.theme,body:['Day '+day.day,day.challenge,day.r.title,day.l.title,day.s[1],day.g[0]].join(' '),type:'Study day',href:base});
        const link=skill=>'#lesson/'+journeyLessonId(pack.program,day.day,skill,level);
        for(const [skill,part] of [['reading',day.r],['listening',day.l],['writing',{title:day.theme,prompt:day.w[1],plan:day.w[2],model:day.w[3],table:day.table,diagram:day.diagram,type:day.w[0]}],
          ['speaking',{title:day.s[1],prompts:day.s[2],guide:day.s[3],type:day.s[0]}],
          ['grammar',{title:day.g[0],paragraphs:[day.challenge],questions:day.g.slice(1).map(([prompt,options])=>({prompt,options}))}]]){
          addPart(docs,part,{...meta,category:skill==='grammar'?'grammar':'skills',skill,type:journeySkills[skill].name,
            key:journeyLessonId(pack.program,day.day,skill,level),journey:{program:pack.program,day:day.day,levels:program.levels}},link(skill),0);
        }
        for(const [term,pos,definition,example,collocation] of day.v){
          docs.push({...meta,category:'vocabulary',title:term,word:term,body:[definition,example,collocation].join(' '),pos,skill:'vocabulary',
            type:'Context vocabulary',href:link('vocabulary'),entry:{word:term,pos,plain:definition,definition,example,collocation,level}});
        }
      }
    }
  }catch{complete=false;}
  return {docs,index:createSearchIndex(docs),complete};
};

export const searchStudy = (corpus,personal,query,expansions,filters) => [
  ...querySearchIndex(corpus.index,query,expansions,filters),
  ...querySearchIndex(createSearchIndex(personal),query,expansions,filters)
].sort((a,b)=>b.score-a.score||normalizeSearch(a.title).localeCompare(normalizeSearch(b.title)));
