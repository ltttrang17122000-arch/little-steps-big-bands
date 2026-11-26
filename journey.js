export const journeySkills = {
  reading: {name:'Reading', minutes:15, details:'Read, locate evidence and check your answers.'},
  listening: {name:'Listening', minutes:12, details:'Listen to a recorded extract and check against the transcript.'},
  writing: {name:'Writing', minutes:35, details:'Plan and write an Academic task. Compare your response with the model.'},
  speaking: {name:'Speaking', minutes:10, details:'Record your response and listen back against the criteria.'},
  vocabulary: {name:'Vocabulary', minutes:8, details:'Study five words or phrases, then practise recalling them.'},
  grammar: {name:'Grammar', minutes:8, details:'Choose forms in context and review why each one works.'}
};
export const defaultJourneyProgram = 'ielts-academic';
export const journeyProgramPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const journeyLessonId = (program, day, skill, level) =>
  'journey-' + program + '-' + String(day).padStart(3,'0') + '-' + skill + '-' + level;

const lessonPattern = /^journey-([a-z0-9]+(?:-[a-z0-9]+)*)-(\d{3})-(reading|listening|writing|speaking|vocabulary|grammar)-([ABC][12])$/;
export const parseJourneyLesson = id => {
  const match = lessonPattern.exec(id ?? '');
  if (!match || Number(match[2])<1 || Number(match[2])>365) return null;
  return {program:match[1],day:Number(match[2]),skill:match[3],level:match[4]};
};

const jsonPath = /^journey\/(?:catalog\.json|packs\/[a-z0-9-]+\.json)$/;
let catalogRequest;
const packages = new Map();

async function loadJson(path) {
  if (!jsonPath.test(path)) throw new Error('Invalid study data path');
  const embedded = globalThis.littleStepsJourneyData?.[path];
  if (embedded) return embedded;
  const response = await fetch(path,{credentials:'same-origin'});
  if (!response.ok) throw new Error('Study data could not be opened');
  return response.json();
}

export const journeyCatalog = () => {
  catalogRequest ??= loadJson('journey/catalog.json').then(catalog=>{
    if (catalog.version!==1 || !Array.isArray(catalog.programs) || !Array.isArray(catalog.packs)) {
      throw new Error('Unsupported study catalog');
    }
    return catalog;
  }).catch(error=>{
    catalogRequest = undefined;
    throw error;
  });
  return catalogRequest;
};

export const journeyEntries = (catalog, program) =>
  catalog.packs.filter(pack=>pack.program===program).flatMap(pack=>pack.days)
    .sort((a,b)=>a.day-b.day);

export const loadJourneyDay = async (catalog, program, dayNumber) => {
  const entry = catalog.packs.find(pack=>pack.program===program && pack.days.some(day=>day.day===dayNumber));
  if (!entry) return null;
  if (!packages.has(entry.path)) {
    const pending = loadJson(entry.path).then(pack=>{
      if (pack.version!==1 || pack.id!==entry.id || pack.program!==program || !Array.isArray(pack.days)) {
        throw new Error('This package does not match the catalog');
      }
      return pack;
    }).catch(error=>{
      packages.delete(entry.path);
      throw error;
    });
    packages.set(entry.path,pending);
  }
  const pack = await packages.get(entry.path);
  return pack.days.find(day=>day.day===dayNumber) ?? null;
};

const grammarNotes = [
  'Compare each choice in the full sentence. Look for the time reference, the words that govern the form and the intended meaning.',
  'Đọc cả câu trước khi chọn. Sau khi chấm, viết lại một câu mới giữ nguyên quy tắc nhưng đổi ngữ cảnh.'
];
const instruction = {
  reading: [
    'Read the full passage, then link every answer to a sentence or paragraph.',
    'Đọc lướt để nắm mạch lập luận. Với mỗi đáp án, gạch trong đầu cụm từ làm bằng chứng. Với Not Given, kiểm tra bài có nói đến mối quan hệ được hỏi hay không.'
  ],
  listening: [
    'Read the questions, listen once for the answers, then replay to check details.',
    'Dự đoán loại thông tin cần nghe. Chú ý chỗ người nói đổi ý, sửa số hoặc đưa ra quyết định cuối. Đối chiếu transcript sau khi nộp.'
  ],
  writing: [
    'Identify the task, plan the response, and use the model and criteria to revise.',
    'Xác định cách trả lời trước khi viết. Với Task 1, chọn xu hướng hoặc đối chiếu chính. Với Task 2, kiểm tra mỗi dẫn chứng có hỗ trợ trực tiếp luận điểm không.'
  ],
  speaking: [
    'Take a short planning note, record your response and listen back.',
    'Ghi vài từ khóa rồi nói thành ý đầy đủ. Khi nghe lại, đánh dấu một chỗ có ví dụ tốt và một chỗ bạn cần diễn đạt rõ hơn.'
  ],
  vocabulary: [
    'Study the contextual entries and try the recall prompts before opening the word notes.',
    'Đoán từ theo ngữ cảnh, kiểm tra cách kết hợp từ, rồi dùng từ vừa học trong một câu của mình.'
  ],
  grammar: grammarNotes
};

function vocabularyPart(day) {
  const questions = day.v.map(([term,pos,definition,example,collocation],i)=>{
    const pattern = new RegExp('(?<![\\p{L}\\p{N}])'+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}\\p{N}])','iu');
    const context = i % 2 === 1 ? example.replace(pattern,'____') : example;
    const meaning = definition.replace(pattern,'____');
    return {
      prompt:context!==example ? 'Complete the sentence with the day’s word or phrase: '+context : 'Recall the '+pos+' that means: '+meaning,
      answer:term,why:definition+' A common pairing is “'+collocation+'”.'
    };
  });
  return {title:'Vocabulary in context', vocabulary:day.v, questions};
}

function grammarPart(day) {
  const [focus,...items] = day.g;
  return {
    title:focus,
    paragraphs:['Read each whole sentence and decide which form fits its meaning in context.'],
    questions:items.map(([prompt,options,index,why])=>({prompt,options,answer:options[index],why}))
  };
}

function writingPart(day) {
  const [type,prompt,plan,model] = day.w;
  const target = /task\s*1/i.test(type) || day.table || day.diagram ? 150 : 250;
  const category = type.replace(/^Task 2\s*[·:\-–]?\s*/i,'').toLowerCase();
  const types = {
    opinion:'Opinion','to what extent':'Opinion',discussion:'Discussion and opinion',
    'discussion and opinion':'Discussion and opinion','problem and solution':'Problem and solution',
    'two-part':'Two-part question','two-part question':'Two-part question',
    'advantages and disadvantages':'Advantages and disadvantages'
  };
  return {
    title:day.theme, type:target===150 ? 'Academic Task 1' : types[category] ?? 'Opinion',
    prompt,plan,model,target,table:day.table,diagram:day.diagram,source:day.source,
    sourceLabel:day.sourceLabel, visual:day.visual
  };
}

function speakingPart(day) {
  const [type,title,prompts,guide] = day.s;
  const part = type.match(/[123]/)?.[0] ?? '2';
  return {title,type:'IELTS Part '+part,prompts,guide,time:part==='1'?90:part==='2'?120:180};
}

export const makeJourneyLesson = (day, program, skill, level) => {
  const harder = level.startsWith('C');
  const info = journeySkills[skill];
  const part = {
    reading:()=>({...day.r}),
    listening:()=>({...day.l}),
    writing:()=>writingPart(day),
    speaking:()=>speakingPart(day),
    vocabulary:()=>vocabularyPart(day),
    grammar:()=>grammarPart(day)
  }[skill]();
  if (!harder && (skill==='reading' || skill==='listening')) {
    part.questions = part.questions.slice(0,6);
  }
  const base = skill==='writing' && part.target===150 ? 22 : info.minutes;
  const minutes = harder ? Math.max(5,base-2) : base;
  return {
    id:journeyLessonId(program,day.day,skill,level),skill,level,minutes, title:part.title,
    objective:Boolean(part.questions),quiz:part.questions?.length??null,
    instruction:instruction[skill],parts:[part],journey:{program,day:day.day,theme:day.theme},
    challenge:harder ? day.challenge : ''
  };
};
