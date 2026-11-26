import {lessons, lengths, levels, skills, words} from './bank.js';
import {assessments, assessmentGroups} from './assessments.js';
import {academy, pathways, sources} from './academy.js';
import {researchRows} from './research.js';
import {defaultJourneyProgram, journeyCatalog, journeyEntries, journeyLessonId, journeyProgramPattern,
  journeySkills, loadJourneyDay, makeJourneyLesson, parseJourneyLesson} from './journey.js';

const $ = (selector, root = document) => root.querySelector(selector);
const main = $('#main');
const nav = $('#primary');
const modal = $('#dialog');
const assetURL = path => globalThis.littleStepsAssets?.[path] ?? path;
const storageKey = 'little-steps-study-v1';
const historyLimit = 3500;
const skillName = key => (skills[key] ?? journeySkills[key])?.name ?? 'Practice';
const defaultLevels = Object.fromEntries(Object.keys(skills).map(skill => [skill, 'B2']));
const emptyState = () => ({levels:{...defaultLevels}, drafts:{}, history:[], saved:[], learned:[], notebook:[], reviewDates:{}, journeyLevels:{}, plan:'short'});
const lessonById = new Map([...lessons,...assessments].map(lesson => [lesson.id,lesson]));
const wordByName = new Map(words.map(word => [word.word,word]));
const pageState = {skill:'all', level:'all', length:'all', search:'', vocabLevel:'B2', vocabSearch:'', vocabView:'all', reviewIndex:0, assessmentLevel:'B2'};
const validDraftKey = key => lessonById.has(key.replace(/^assessment-/, '')) || Boolean(parseJourneyLesson(key));
const dictionaries = {
  reading:'<path d="M3 5.5c3.5-.7 6 .1 9 2 3-1.9 5.5-2.7 9-2v13c-3.5-.7-6 .1-9 2-3-1.9-5.5-2.7-9-2z"/><path d="M12 7.5v13"/>',
  listening:'<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="12" width="4" height="7" rx="1.5"/><rect x="17" y="12" width="4" height="7" rx="1.5"/>',
  writing:'<path d="m4 17-1 4 4-1L20 7a2 2 0 0 0-3-3L4 17zm11-10 3 3M4 21h9"/>',
  speaking:'<path d="M20 11a7.8 7.8 0 0 1-8 8 8 8 0 0 1-3-.6l-4 1 1-3.6A8 8 0 1 1 20 11z"/><path d="M8.5 11H15m-6.5 3H13"/>',
  vocabulary:'<path d="m4 19 6-14 6 14m-10-5h8m2 2 3 3 3-3m-3 3V9"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  task:'<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8 9h8m-8 4h8m-8 4h4"/>',
  goal:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  check:'<path d="m5 12 4 4 10-10"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${dictionaries[name] || dictionaries.task}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanText = value => typeof value === 'string' ? value.slice(0, 30000) : '';
const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);
const clamp = (n, min, max) => Math.min(max, Math.max(min,n));
const clock = total => Math.floor(Math.max(0,total)/60) + ':' + String(Math.max(0,total)%60).padStart(2,'0');
const lengthFor = id => lengths.find(item => item.id === id);
const lessonsFor = (skill,level) => lessons.filter(item => item.skill === skill && item.level === level);

function normalizeState(raw) {
  const result = emptyState();
  if (!isRecord(raw)) return result;
  for (const skill of Object.keys(skills)) {
    if (levels.includes(raw.levels?.[skill])) result.levels[skill] = raw.levels[skill];
  }
  for (const [program,level] of Object.entries(raw.journeyLevels ?? {})) {
    if (journeyProgramPattern.test(program) && levels.includes(level)) result.journeyLevels[program] = level;
  }
  for (const [key, data] of Object.entries(raw.drafts ?? {})) {
    if (!validDraftKey(key) || !isRecord(data)) continue;
    const lesson = lessonById.get(key.replace(/^assessment-/, ''));
    const draft = makeDraft();
    draft.part = Number.isInteger(data.part) ? clamp(data.part,0,(lesson?.parts.length ?? 1) - 1) : 0;
    draft.mode = data.mode === 'independent' ? data.mode : 'supported';
    draft.submitted = data.submitted === true;
    draft.elapsed = Number.isFinite(data.elapsed) ? clamp(Math.floor(data.elapsed),0,86400) : 0;
    draft.started = Number.isFinite(data.started) && data.started > 0 && data.started < Date.now() ? data.started : 0;
    for (const name of ['answers','texts','types','notes']) {
      for (const [index, val] of Object.entries(data[name] ?? {})) {
        if (/^\d{1,2}(?:-\d{1,2})?$/.test(index)) draft[name][index] = cleanText(val);
      }
    }
    result.drafts[key] = draft;
  }
  if (Array.isArray(raw.history)) result.history = raw.history.filter(event =>
    isRecord(event) && validDraftKey(String(event.key)) && Number.isFinite(event.date)
    && event.date >= 0 && event.date <= 8640000000000000
  ).slice(0,historyLimit).map(event => ({
    key:event.key,date:event.date,score:Number.isFinite(event.score) ? event.score : null,
    total:Number.isFinite(event.total) ? event.total : null,
    misses:Array.isArray(event.misses) ? event.misses.filter(id => /^\d{1,2}-\d{1,2}$/.test(id)).slice(0,40) : []
  }));
  for (const name of ['saved','learned']) {
    if (Array.isArray(raw[name])) result[name] = [...new Set(raw[name].filter(word => wordByName.has(word)))];
  }
  result.plan = lengths.some(x=>x.id===raw.plan) ? raw.plan : 'short';
  for (const [name,review] of Object.entries(raw.reviewDates ?? {})) {
    if (wordByName.has(name) && Number.isFinite(review?.due) && Number.isInteger(review?.step)) {
      result.reviewDates[name] = {due:review.due,step:clamp(review.step,0,3)};
    }
  }
  if (Array.isArray(raw.notebook)) result.notebook = raw.notebook.filter(item=>
    isRecord(item) && Number.isFinite(item.date) && ['mistake','grammar','vocabulary','strategy'].includes(item.kind)
  ).slice(0,200).map(item=>({title:cleanText(item.title).slice(0,100),text:cleanText(item.text).slice(0,1800),kind:item.kind,date:item.date}));
  return result;
}
function makeDraft() {
  return {part:0,mode:'supported',submitted:false,elapsed:0,started:0,answers:{},texts:{},types:{},notes:{}};
}
let state = emptyState();
try {state = normalizeState(JSON.parse(localStorage.getItem(storageKey)));} catch {}
let active = null;
let routeSequence = 0;
let journeyOverview;
const journeyFilters = {view:'days',skill:'all',query:''};
let academySkill = 'reading';
let academyType = 0;
const seenShuffle = new Set();
let toastHandle;
let runInterval;
let storageFailed = false;

function toast(message) {
  const node = $('#toast');
  node.textContent = message;
  clearTimeout(toastHandle);
  toastHandle = setTimeout(() => {node.textContent = '';}, 4300);
}
function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    storageFailed = false;
  } catch {
    if (!storageFailed) toast('Browser storage is unavailable. You can export your study data from Progress.');
    storageFailed = true;
  }
}
function button(label, attrs = '', variant = '') {
  return `<button type="button" class="btn ${variant}" ${attrs}>${label}</button>`;
}
function link(label, href, variant = '') {
  return `<a class="btn ${variant}" href="${href}">${label}</a>`;
}
function select(name, label, entries, value) {
  return `<label class="field">${label}<select data-field="${name}">${entries.map(([val,text]) =>
    `<option value="${esc(val)}" ${value === val ? 'selected' : ''}>${esc(text)}</option>`).join('')}</select></label>`;
}
function heading(title, intro, label = '') {
  return `<div class="page-head">${label ? `<p class="eyebrow">${esc(label)}</p>` : ''}<h1>${esc(title)}</h1><p class="sub">${esc(intro)}</p></div>`;
}
function glyph(name) {
  return `<span class="glyph ${name}">${icon(name)}</span>`;
}
function getRoute() {
  const segments = location.hash.slice(1).split('/');
  const [page = '', id] = segments;
  if (page === 'lesson' || page === 'test') return {page,id};
  if (page === 'journey') return {page,program:id || defaultJourneyProgram,
    day:segments[2] ? Number(segments[2]) : null,level:segments[3]};
  if (page === 'practice') return {page,skill:skills[id] ? id : null,level:levels.includes(segments[2]) ? segments[2] : null};
  return {page:['vocabulary','progress','assessment','academy','research'].includes(page) ? page : 'home'};
}
function navHTML(page) {
  const selected = page==='lesson' && parseJourneyLesson(getRoute().id) ? 'journey' : ['lesson','test','academy','research'].includes(page) ? (page === 'test' ? 'assessment' : 'practice') : page;
  const links = [['home','Home'],['journey','Journey'],['practice','Practice'],['vocabulary','Vocabulary'],['assessment','Assessment'],['progress','Progress']];
  return links.map(([url,label]) => `<a href="#${url}" ${url === selected ? 'aria-current="page"' : ''}>${label}</a>`).join('');
}
function home() {
  const keys = Object.keys(skills);
  const pick = lessonsFor('reading', state.levels.reading).find(item => item.length === 'short');
  const recent = Object.entries(state.drafts).filter(([key,draft]) =>
    !draft.submitted && (draft.elapsed || draft.started || draft.part || Object.values({...draft.answers,...draft.texts,...draft.notes}).some(Boolean))
  ).at(-1);
  const resume = recent ? link('Continue last session', historyHref(recent[0]), 'secondary') : '';
  return `<section class="hero" aria-labelledby="hero-title">
    <div class="hero-inner"><p class="eyebrow">Your English practice space</p>
    <h1 id="hero-title">Little Steps,<br><em>Big Bands.</em></h1>
    <p>Build your English from A1 to C2. Choose one skill, make time for a small practice session, and see how you improve.</p>
    <div class="actions">${link('Open Learning Journey','#journey')}${link('Practice library','#practice','secondary')}${resume}</div></div>
    <div class="hero-plan">${dailyPlan()}</div>
  </section>
  <section aria-labelledby="choose-title"><div class="section-head"><div><h2 id="choose-title">Choose a skill</h2><p class="sub">Pick a level and a session length that suit you.</p></div>
  ${link('Browse all','#practice','flat')}</div><div class="grid four">
  ${keys.map(id => `<a href="#practice/${id}" class="card skill-card">${glyph(id)}
    ${id === 'reading' ? '<span class="tag gold target">Band 9 goal</span>' : ''}
    <h3>${skills[id].name}</h3><p>${skills[id].desc}</p></a>`).join('')}</div></section>
  <section class="card focus" aria-labelledby="focus-title"><div class="focus-main">${glyph('goal')}<div>
    <h3 id="focus-title">Today’s Reading practice</h3><p>${esc(pick.title)} · ${pick.level} · ${pick.minutes} min</p></div></div>
    ${link('Open practice','#lesson/'+pick.id,'secondary')}</section>
  <div class="grid two" style="margin-top:14px">
    <section class="card"><h3>English through English</h3><p class="muted">Look up words in plain English, see them in context and revisit your saved vocabulary.</p>${link('Open vocabulary','#vocabulary','flat')}</section>
    <section class="card"><h3>Check your progress</h3><p class="muted">Try a timed assessment or revisit the evidence behind answers you missed.</p><div class="actions">${link('Take an assessment','#assessment','flat')}${link('View progress','#progress','flat')}</div></section>
  </div>`;
}
function lessonCard(item) {
  const length = lengthFor(item.length);
  const draft = state.drafts[item.id];
  const topics = item.parts.map(part => part.title).filter(title => title !== item.title);
  const subtitle = topics.length ? topics.join(' · ') : (item.parts[0].type || item.route);
  return `<a class="card lesson-card" href="#lesson/${item.id}">
    <div class="actions"><span class="tag">${skills[item.skill].name}</span><span class="tag">${item.level}</span>
    ${draft?.submitted ? '<span class="tag gold">Completed</span>' : ''}</div>
    <h3>${esc(item.title)}</h3><p>${esc(subtitle)}</p>
    <div class="meta"><span>${icon('clock')} ${item.minutes} min</span><span>${icon('task')} ${item.quiz ? item.quiz + ' questions' : item.parts.length + (item.parts.length === 1 ? ' task' : ' tasks')}</span><span>${length.name}</span></div>
  </a>`;
}
function practice() {
  const label = pageState.skill === 'all' ? 'Practice library' : skills[pageState.skill].name + ' practice';
  const choices = Object.entries(skills).map(([id,skill]) => [id,skill.name]);
  return heading(label,'Find a lesson by skill, CEFR level or the time you have available.') + `
    <div class="actions library-actions">${link('Study methods','#academy','secondary')}${button('Pick an unseen lesson','data-act="shuffle"','secondary')}</div>
    <div class="card filters">
      ${select('skill','Skill',[['all','All skills'],...choices],pageState.skill)}
      ${select('level','CEFR level',[['all','All levels'],...levels.map(level=>[level,level])],pageState.level)}
      ${select('length','Session length',[['all','Any length'],...lengths.map(item=>[item.id,item.time+' · '+item.name])],pageState.length)}
      <label class="field">Search lessons<input type="search" data-field="search" value="${esc(pageState.search)}" placeholder="e.g. maps"></label>
    </div><div id="lesson-results">${lessonResults()}</div>`;
}
function matchingLessons() {
  const term = pageState.search.trim().toLowerCase();
  return lessons.filter(item =>
    (pageState.skill === 'all' || item.skill === pageState.skill) &&
    (pageState.level === 'all' || item.level === pageState.level) &&
    (pageState.length === 'all' || item.length === pageState.length) &&
    (!term || [item.title, item.route, ...item.parts.flatMap(part=>[part.title,part.type ?? ''])].join(' ').toLowerCase().includes(term))
  );
}
function lessonResults() {
  const results = matchingLessons();
  return `<p role="status" class="smalltext muted">${results.length} ${results.length === 1 ? 'lesson' : 'lessons'}</p>
  ${results.length ? `<div class="grid three">${results.map(lessonCard).join('')}</div>` :
  `<div class="card"><h3>No lessons match</h3><p>Try widening your filters or searching for a different topic.</p>${button('Clear filters','data-act="reset-filters"','secondary')}</div>`}`;
}
function historyHref(key) {
  return key.startsWith('assessment-') ? '#test/'+key.slice(11) : '#lesson/'+key;
}
function paragraphHTML(text, lookup) {
  if (!lookup) return esc(text);
  return text.split(/([\p{L}]+(?:[’'-][\p{L}]+)?)/u).map((token,i) => {
    if (i % 2 === 0) return esc(token);
    const lower = token.toLowerCase();
    const match = [lower,lower.replace(/s$/,''),lower.replace(/es$/,'')].find(word => wordByName.has(word));
    return match ? `<button type="button" class="lookup" data-act="dictionary" data-word="${match}">${esc(token)}</button>` : esc(token);
  }).join('');
}
function timerSeconds() {
  return active.draft.elapsed + (active.draft.started ? Math.floor((Date.now() - active.draft.started)/1000) : 0);
}
function pauseTimer() {
  if (!active?.draft.started) return;
  active.draft.elapsed = timerSeconds();
  active.draft.started = 0;
}
function renderTimer() {
  const node = $('#timer-display');
  if (!node || !active) return;
  const remaining = active.lesson.minutes*60 - timerSeconds();
  node.textContent = clock(remaining);
  node.classList.toggle('over', remaining < 0);
  if (active.isTest && active.draft.started && remaining <= 0 && !active.draft.submitted) {
    if (active.lesson.objective) submitObjective(true);
    else finishSubjective(true);
  }
}
function presentLesson() {
  const {lesson,draft,isTest} = active;
  const current = lesson.parts[draft.part];
  const name = skillName(lesson.skill);
  const started = Boolean(draft.started || draft.elapsed || draft.submitted);
  const completed = draft.submitted;
  const dayHref = lesson.journey ? journeyLink(lesson.journey.program,lesson.journey.day,lesson.level) : '';
  const previous = link(dayHref ? 'Back to day '+lesson.journey.day : isTest ? 'Back to assessments' : 'Back to practice',
    dayHref || (isTest ? '#assessment' : '#practice/'+lesson.skill+'/'+lesson.level),'flat small');
  const timer = `<div class="actions"><span class="btn secondary small timer" id="timer-display" aria-label="Time remaining">${clock(lesson.minutes*60-timerSeconds())}</span>
    ${completed || (isTest && draft.started) ? '' : button(draft.started ? 'Pause timer' : started ? 'Resume timer' : 'Start timer','data-act="timer"','flat small')}</div>`;
  const stage = lesson.parts.length > 1 && (!isTest || started) ? `<nav class="segment-tabs" aria-label="Lesson parts">${lesson.parts.map((part,i)=>
    button('Part '+(i+1),'data-act="lesson-part" data-i="'+i+'" aria-pressed="'+(draft.part===i)+'"','secondary small')).join('')}</nav>` : '';
  const context = lesson.journey ? 'Day '+lesson.journey.day+' · '+lesson.journey.theme : isTest ? 'Timed assessment' : lengthFor(lesson.length).name;
  const notice = isTest ? (lesson.objective ? 'Complete the questions within the time limit. Answers and explanations appear after you submit.' : 'Complete each task before the timer ends. Use the self-review materials after submitting.') : lesson.instruction[0];
  main.innerHTML = `${previous}<div class="lesson-head">${heading(lesson.title,notice,name + ' · ' + lesson.level + ' · ' + context)}${!isTest || started ? timer : ''}</div>
    <div class="session-controls">${stage}
    <div class="actions">${!isTest || completed ? button('Print lesson','data-act="print"','secondary small') : ''}
    ${!isTest ? link('Study methods','#academy','flat small') : ''}
    ${completed && lesson.journey ? nextJourneyActivity(lesson) : completed && !isTest ? button('Next unseen lesson','data-act="next-unseen"','secondary small') : ''}
    ${completed ? button('Try again','data-act="confirm-retry"','secondary small') : ''}</div></div>
    ${isTest && !started ? `<section class="card"><h2>Ready to start?</h2><p class="sub">${lesson.quiz ? lesson.quiz+' questions' : lesson.parts.length+' tasks'} · ${lesson.minutes} min. The timer runs while this assessment is open or in the background.</p>${button('Begin assessment','data-act="begin-test"')}</section>` :
    `${!isTest ? `<details class="lesson-hint"><summary>Study method · Hướng dẫn</summary><p lang="vi">${esc(lesson.instruction[1])}</p></details>` : ''}
    ${completed && lesson.objective ? resultBanner() : completed ? `<div class="callout correct" role="status">Session saved in Progress.</div>` : ''}
    ${lesson.objective ? objectivePart(current) : lesson.skill === 'writing' ? writingPart(current) : speakingPart(current)}
    ${lesson.challenge ? `<details class="journey-review" ${completed ? 'open' : ''}><summary>C1 extension · apply the day’s topic</summary><p>${esc(lesson.challenge)}</p><label class="field">Extension notes<textarea data-note="96" maxlength="30000" class="short-notes">${esc(draft.notes[96])}</textarea></label></details>` : ''}
    ${extraReview()}`}`;
  renderTimer();
  if (lesson.skill === 'speaking' && $('#record-player')) setupRecording();
}
function extraReview() {
  const {lesson,draft,isTest} = active;
  if (isTest || lesson.length !== 'deep') return '';
  const ask = {
    reading:'Choose one missed answer. Note the exact evidence and rewrite the question in your own words.',
    listening:'Choose a difficult sentence. Replay it, write what you hear, and compare it with the transcript.',
    writing:'Revise the weakest paragraph. Check whether your example directly supports your main point.',
    speaking:'Replay the recording. Note a place where you hesitated, and repeat that part with a clearer example.'
  }[lesson.skill];
  return `<section class="card" style="margin-top:14px"><h3>Review your work</h3><p class="muted">${ask}</p><label class="field">Review notes<textarea data-note="99" rows="3" style="min-height:95px">${esc(draft.notes[99])}</textarea></label></section>`;
}
function grade() {
  const {lesson,draft} = active;
  let score = 0;
  let answered = 0;
  const misses = [];
  for (const [i,part] of lesson.parts.entries()) {
    for (const [j,q] of part.questions.entries()) {
      const id = i+'-'+j;
      const response = draft.answers[id] || '';
      if (response.trim()) answered++;
      if (matches(q,response)) score++;
      else misses.push(id);
    }
  }
  return {score,answered,misses,total:lesson.quiz};
}
function normalizedAnswer(value) {
  return value.normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/[.–-]$/u,'').replace(/\s+/g,' ');
}
function matches(question,value) {
  const normalized = normalizedAnswer(value);
  return normalized !== '' && question.answer.split('|').some(answer => normalizedAnswer(answer) === normalized);
}
function questionsHTML(part) {
  const {lesson,draft} = active;
  const before = lesson.parts.slice(0,draft.part).reduce((sum,item)=>sum+item.questions.length,0);
  return part.questions.map((q,i) => {
    const id = draft.part+'-'+i;
    const value = draft.answers[id] ?? '';
    const good = matches(q,value);
    const feedback = draft.submitted ?
      `<div class="feedback ${good ? 'correct' : 'incorrect'}"><strong>${good ? 'Correct.' : (value.trim() ? 'Correct answer: ' : 'Unanswered. Correct answer: ') + esc(q.answer.split('|')[0]) + '.'}</strong> ${esc(q.why)}</div>` : '';
    const type = q.options ? q.options.join('|') === 'True|False|Not Given' ? 'True / False / Not Given' : q.options.join('|') === 'Yes|No|Not Given' ? 'Yes / No / Not Given' : 'Choose one answer' : 'Type your answer';
    const inputs = q.options ? q.options.map(option => `<label class="choice"><input type="radio" name="q-${id}" data-answer="${id}" value="${esc(option)}" ${option===value ? 'checked' : ''} ${draft.submitted ? 'disabled' : ''}><span>${esc(option)}</span></label>`).join('') :
      `<input type="text" data-answer="${id}" aria-label="Answer to question ${before+i+1}" value="${esc(value)}" maxlength="100" autocomplete="off" spellcheck="false" ${draft.submitted ? 'readonly' : ''}>`;
    return `<fieldset class="question-set"><legend>${before+i+1}. ${esc(q.prompt)}</legend>
      <p class="fine muted" style="margin-bottom:6px">${type}</p>${inputs}${feedback}</fieldset>`;
  }).join('');
}
function objectivePart(part) {
  const {lesson,draft,isTest} = active;
  const isAudio = lesson.skill === 'listening';
  const transcript = ((!isTest && !(lesson.journey && lesson.level.startsWith('C'))) || draft.submitted) && isAudio ? `<details><summary>Open transcript</summary>
    <div class="stack">${part.lines.map(([speaker,line])=>`<p><strong>${speaker}</strong> · ${paragraphHTML(line,true)}</p>`).join('')}</div></details>` : '';
  const body = isAudio ? `<p class="muted">${isTest && !draft.submitted ? 'Play the recording once and answer as you listen.' : 'Play the clip, answer the questions and use the transcript to review.'}</p>
    <audio src="${assetURL(part.audio)}" controls preload="metadata" aria-label="${esc(part.title)} audio"></audio>
    ${!isTest || draft.submitted ? '<p class="fine muted">Original material · synthetic English voices</p>' : ''}${transcript}` :
    part.vocabulary ? journeyVocabulary(part,draft) :
    part.paragraphs.map(line => `<p>${paragraphHTML(line,!isTest || draft.submitted)}</p>`).join('');
  const next = draft.part < lesson.parts.length-1 ? button('Next part','data-act="next-part"','secondary') : '';
  const prev = draft.part > 0 ? button('Previous part','data-act="prev-part"','secondary') : '';
  const submit = draft.submitted ? '' : button(isTest ? 'Submit assessment' : 'Check answers','data-act="submit-answers"');
  return `<div class="exercise-grid"><article class="card passage"><header><p class="eyebrow">${isAudio ? 'Recording' : lesson.skill==='reading' ? 'Passage' : skillName(lesson.skill)}</p>
    <h2>${esc(part.title)}</h2></header>${body}</article>
    <section class="card questions" aria-labelledby="questions-title"><h2 id="questions-title">Questions</h2>
    <p class="muted smalltext" id="answered-count">${grade().answered} of ${lesson.quiz} answered</p>
    ${questionsHTML(part)}<div class="actions">${prev}${next}${submit}</div></section></div>`;
}
function resultBanner() {
  const {score,total} = grade();
  return `<div class="callout ${score === total ? 'correct' : ''}" id="result-banner" tabindex="-1"><strong>${score} / ${total} correct</strong>
    <p>${score === total ? 'You answered every question correctly.' : 'Review the explanations in each part and revisit missed questions in Progress.'}</p></div>`;
}
function addHistory(score = null, total = null, misses = []) {
  state.history.unshift({key:active.key,date:Date.now(),score,total,misses});
  state.history = state.history.slice(0,historyLimit);
}
function submitObjective(forced = false) {
  if (!active || active.draft.submitted) return;
  const {score,total,answered,misses} = grade();
  if (!forced && answered < total) {
    showDialog('Submit your answers?',`<p>${total-answered} of ${total} questions are unanswered. You can finish them or submit now.</p>
      <div class="actions">${button('Keep working','data-act="close-dialog"','secondary')}${button('Submit now','data-act="submit-now"')}</div>`);
    return;
  }
  closeDialog();
  pauseTimer();
  active.draft.submitted = true;
  addHistory(score,total,misses);
  save();
  presentLesson();
  $('#result-banner')?.focus();
}
function tableHTML(rows) {
  if (!rows) return '';
  return `<table><caption>Data for the task</caption><thead><tr>${rows[0].map(cell=>`<th scope="col">${esc(cell)}</th>`).join('')}</tr></thead>
  <tbody>${rows.slice(1).map(row=>`<tr>${row.map((cell,i)=>i===0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function wordCount(text = '') {
  return text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length || 0;
}
function writingPart(task) {
  const {lesson,draft,isTest} = active;
  const part = draft.part;
  const supported = draft.mode === 'supported' && (!isTest || draft.submitted);
  const guessed = draft.types[part] || '';
  const unlocked = isTest || guessed === task.type || draft.submitted;
  const wordTarget = task.target === 150 || task.target === 250 ? 'Minimum' : 'Target';
  const typeOptions = lesson.journey
    ? ['Academic Task 1','Opinion','Discussion and opinion','Advantages and disadvantages','Problem and solution','Two-part question']
    : ['Academic Task 1','Advantages and disadvantages','Data overview','Description','Discussion and opinion','Evaluation','Message','Advice email','Narrative','Opinion','Problem and solution','To what extent','Two-part question'];
  const typeQuestion = !isTest && !draft.submitted ? `<div class="callout">${select('writing-type','Identify the task type',[['','Choose a type'],...typeOptions.map(type=>[type,type])],guessed)}
    ${guessed ? `<p class="feedback ${unlocked ? 'correct' : 'incorrect'}">${unlocked ? (supported ? 'Correct. Use the plan below.' : 'Correct. You can start writing.') : 'Try again. Look at what the instruction asks you to do.'}</p>` : ''}</div>` : '';
  const plan = supported && unlocked ? `<details open><summary>Planning guide</summary><p>${esc(task.plan)}</p></details>` : '';
  const review = (!isTest && supported && unlocked || draft.submitted) ? `<details ${draft.submitted ? 'open' : ''}><summary>Model excerpt and revision checklist</summary>
    <p>${esc(task.model)}</p><ul class="list"><li>Check that you have answered every part of the prompt.</li><li>Give each paragraph one clear job.</li><li>Support a statement with a specific detail, example or comparison.</li><li>Proofread agreement, tense and punctuation.</li></ul></details>` : '';
  const stageButton = draft.submitted ? '' : button('Save completed response','data-act="finish-subjective"');
  return `<div class="exercise-grid">
    <article class="card"><p class="eyebrow">${draft.submitted ? esc(task.type) : 'Writing task'}</p><h2>${esc(task.title)}</h2><p style="margin-top:10px">${esc(task.prompt)}</p>${taskVisual(task)}
    <p class="smalltext muted">${wordTarget} ${task.target} words</p>${typeQuestion}${plan}${review}
    </article>
    <section class="card"><h2>Your response</h2>
    ${isTest ? '' : `<div class="segment-tabs" style="margin:10px 0">${['supported','independent'].map(mode=>
      button(mode[0].toUpperCase()+mode.slice(1),'data-act="writing-mode" data-mode="'+mode+'" aria-pressed="'+(mode===draft.mode)+'"','secondary small')).join('')}</div>`}
    <label class="field"><span>${unlocked ? 'Draft' : 'Identify the task type to unlock the draft'}</span>
    <textarea data-text="${part}" maxlength="30000" ${unlocked ? '' : 'disabled'} ${draft.submitted ? 'readonly' : ''} placeholder="Write your response in English">${esc(draft.texts[part])}</textarea></label>
    <p class="smalltext muted" style="margin-top:8px"><span id="word-count">${wordCount(draft.texts[part])}</span> / ${task.target} words · Draft saved on this browser</p>
    <div class="actions">${part > 0 ? button('Previous task','data-act="prev-part"','secondary') : ''}
    ${part < lesson.parts.length-1 ? button('Next task','data-act="next-part"','secondary') : ''}${stageButton}</div>
    ${!isTest || draft.submitted ? rubricHTML('writing',task.type) : ''}
    </section></div>`;
}
function speakingPart(task) {
  const {lesson,draft,isTest} = active;
  const part = draft.part;
  const isCue = task.type === 'IELTS Part 2';
  return `<div class="exercise-grid">
    <article class="card"><p class="eyebrow">${esc(task.type)}</p><h2>${esc(task.title)}</h2>
    ${task.image ? '<figure class="exercise-photo"><img class="scene" src="market.webp" alt="A street vendor pauses with a bicycle loaded with flowers in Hanoi."><figcaption class="fine muted">Célestine M.C. Leroy · <a href="https://commons.wikimedia.org/wiki/File:Daily_life_in_Vietnam_Street_Vendor_Flowers.jpg" target="_blank" rel="noopener">Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener">CC BY-SA 2.0</a> · Resized</figcaption></figure>' : ''}
    <ul class="list">${task.prompts.map(prompt=>`<li>${esc(prompt)}</li>`).join('')}</ul>
    ${!isTest || draft.submitted ? `<details><summary>Speaking guide</summary><p>${esc(task.guide)}</p></details>` : ''}
    </article>
    <section class="card">
    <h2>Record your response</h2><p class="sub">Target ${clock(task.time)} speaking time. ${isCue ? 'Take up to one minute to prepare first.' : 'Use your notes if you get stuck.'}</p>
    <div class="actions"><span class="btn secondary small timer" id="speak-timer" aria-label="Speaking timer">${clock(task.time)}</span>
    ${button('Start speaking timer','data-act="speak-clock"','secondary small')}
    ${isCue ? button('Start 1 min prep','data-act="prep-clock"','secondary small') : ''}</div>
    <div class="actions" style="margin-top:10px">${button('Start recording','data-act="record-start"')}
    ${button('Stop recording','data-act="record-stop" disabled','secondary')}</div>
    <p id="record-status" class="fine muted" role="status" style="margin-top:7px">Microphone permission is needed to record. Recordings stay on this browser.</p>
    <p id="record-elapsed" class="fine muted" hidden></p><audio id="record-player" controls hidden></audio>
    <div id="record-download" hidden class="actions" style="margin-bottom:8px"><a class="btn secondary small" id="download-recording" download>Download recording</a></div>
    <label class="field">Notes<textarea data-note="${part}" maxlength="30000" style="min-height:110px" placeholder="Jot down key words">${esc(draft.notes[part])}</textarea></label>
    <div class="actions" style="margin-top:11px">${part>0 ? button('Previous task','data-act="prev-part"','secondary') : ''}${part<lesson.parts.length-1 ? button('Next task','data-act="next-part"','secondary') : ''}
    ${draft.submitted ? '' : button('Save completed session','data-act="finish-subjective"')}</div>
    ${!isTest || draft.submitted ? rubricHTML('speaking',task.type) : ''}
    </section></div>`;
}
function vocabulary() {
  return heading('Vocabulary','Look up a word in English, save it, and come back for a short recall practice.') + `
  <div class="card filters">
    ${select('vocabLevel','Word level',[['all','All levels'],...levels.map(l=>[l,l])],pageState.vocabLevel)}
    ${select('vocabView','Word list',[['all','Dictionary'],['saved','Saved words'],['review','Recall practice']],pageState.vocabView)}
    <label class="field">Find a word<input data-field="vocabSearch" type="search" placeholder="e.g. reliable" value="${esc(pageState.vocabSearch)}"></label>
  </div><div id="word-results">${wordResults()}</div>`;
}
function wordDefinition(word, inside = false) {
  const saved = state.saved.includes(word.word);
  const known = state.learned.includes(word.word);
  return `<div class="meta"><span class="tag">${word.level}</span><span>${word.pos}</span>${known ? '<span class="tag gold">Learnt</span>' : ''}</div>
  <p>${esc(word.plain)}</p><p class="example"><em>${esc(word.example)}</em><br><span class="smalltext muted">${esc(word.collocation)}</span></p>
  <details><summary>More precise definition</summary><p>${esc(word.definition)}</p></details>
  <div class="actions" style="margin-top:10px">
  ${button(saved ? 'Remove saved word' : 'Save word','data-act="save-word" data-word="'+word.word+'"','secondary small')}
  ${button(known ? 'Mark for more review' : 'Mark as learnt','data-act="learn-word" data-word="'+word.word+'"','secondary small')}
  ${button('Hear word','data-act="say-word" data-word="'+word.word+'"','flat small')}
  ${inside ? '' : button('Open entry','data-act="dictionary" data-word="'+word.word+'"','flat small')}</div>`;
}
function wordResults() {
  const {vocabLevel,vocabView,vocabSearch} = pageState;
  const query = vocabSearch.trim().toLowerCase();
  const filtered = words.filter(word =>
    (vocabLevel === 'all' || word.level === vocabLevel) &&
    (vocabView === 'all' || state.saved.includes(word.word)) &&
    (vocabView !== 'review' || !state.reviewDates[word.word] || state.reviewDates[word.word].due <= Date.now()) &&
    (!query || (word.word+' '+word.collocation).toLowerCase().includes(query))
  );
  if (!filtered.length) return `<div class="card"><h3>No words in this view</h3><p>${vocabView === 'all' ? 'Choose another level or search term.' : 'Save dictionary entries first, or choose another level.'}</p></div>`;
  if (vocabView === 'review') {
    const index = pageState.reviewIndex % filtered.length;
    const word = filtered[index];
    return `<article class="card word-entry"><p class="eyebrow">Word ${index+1} of ${filtered.length}</p>
      <h3>${esc(word.word)}</h3><p>Say the meaning in your own words, then check the definition.</p>
      <details><summary>Reveal definition</summary>${wordDefinition(word,true)}</details>
      <div class="actions" style="margin-top:10px">${button('Review tomorrow','data-act="schedule-word" data-word="'+word.word+'" data-mode="soon"','secondary small')}
      ${button('Remembered','data-act="schedule-word" data-word="'+word.word+'" data-mode="later"','secondary small')}
      ${button('Next word','data-act="review-next"','flat small')}</div></article>`;
  }
  return `<p class="muted smalltext" role="status">${filtered.length} ${filtered.length===1 ? 'word' : 'words'}</p>
  <div class="grid three">${filtered.map(word=>`<article class="card word-entry"><h3>${esc(word.word)}</h3>${wordDefinition(word)}</article>`).join('')}</div>`;
}
function historyLesson(event) {
  return lessonById.get(event.key.replace(/^assessment-/,''));
}
function historyItem(event) {
  const item = historyLesson(event);
  const journey = parseJourneyLesson(event.key);
  const type = event.key.startsWith('assessment-') ? ' · Assessment' : journey ? ' · Day '+journey.day : '';
  const date = new Intl.DateTimeFormat('en',{dateStyle:'medium'}).format(new Date(event.date));
  const skill = skillName(item?.skill ?? journey?.skill);
  return `<li><div><a href="${historyHref(event.key)}">${esc(item?.title ?? skill)}</a><div class="muted smalltext">${skill} · ${item?.level ?? journey?.level ?? ''}${type} · ${date}</div></div>
    <strong>${event.total == null ? 'Completed' : event.score+' / '+event.total}</strong></li>`;
}
function progress() {
  const counts = new Set(state.history.map(event=>event.key));
  const objective = state.history.filter(event=>event.total>0);
  const comprehension = objective.filter(event=>['reading','listening'].includes(historyLesson(event)?.skill ?? parseJourneyLesson(event.key)?.skill));
  const correct = comprehension.reduce((sum,event)=>sum+event.score,0);
  const total = comprehension.reduce((sum,event)=>sum+event.total,0);
  const uniqueMisses = new Map();
  for (const event of objective) {
    if (uniqueMisses.has(event.key) || !historyLesson(event)) continue;
    uniqueMisses.set(event.key,event);
  }
  const corrections = [...uniqueMisses.values()].flatMap(event => event.misses.map(id=>({event,id}))).slice(0,9);
  return heading('Your progress','See your recent scores, revisit missed questions and keep a copy of your study data.') + `
    <div class="grid three">
      <div class="card"><p class="muted">Sessions completed</p><p class="big-number">${counts.size}</p></div>
      <div class="card"><p class="muted">Reading and Listening accuracy</p><p class="big-number">${total ? Math.round(correct/total*100)+'%' : '—'}</p></div>
      <div class="card"><p class="muted">Words learnt</p><p class="big-number">${state.learned.length} / ${words.length}</p></div>
    </div>
    <div class="section-head"><div><h2>Practice levels</h2><p class="sub">Choose a starting level for each skill.</p></div></div>
    <div class="grid four">${Object.keys(skills).map(skill=>`<div class="card">${select('pref-'+skill,skills[skill].name,levels.map(level=>[level,level]),state.levels[skill])}</div>`).join('')}</div>
    <div class="section-head"><h2>Recent sessions</h2></div>
    <section class="card">${state.history.length ? `<ul class="history">${state.history.slice(0,15).map(historyItem).join('')}</ul>` : '<p>Completed practice and assessments will appear here.</p>'}</section>
    <div class="section-head"><h2>Review missed answers</h2></div>
    <section class="card">${corrections.length ? corrections.map(({event,id})=>{
      const item = historyLesson(event);
      const [i,j] = id.split('-').map(Number);
      const question = item.parts[i]?.questions?.[j];
      return question ? `<details><summary>${esc(question.prompt)}</summary><p><strong>${esc(question.answer.split('|')[0])}</strong> · ${esc(question.why)}</p>
      <p class="smalltext muted">${skillName(item.skill)} · ${esc(item.parts[i].title)} · ${item.level}</p></details>` : '';
    }).join('') : '<p>Missed Reading and Listening answers will appear here after you submit.</p>'}</section>
    ${notebookHTML()}
    <div class="section-head"><h2>Study data</h2></div>
    <section class="card"><p>Progress, answers and drafts stay in this browser. Export them to keep a backup or move to another device. Download Speaking recordings separately from each lesson.</p>
    <div class="actions">${button('Export study data','data-act="export"','secondary')}
    ${button('Import study data','data-act="import"','secondary')}<input type="file" id="data-file" accept="application/json,.json" hidden></div></section>`;
}

function showDialog(title, body) {
  modal.innerHTML = `<div class="dialog-top"><h2 id="dialog-title">${esc(title)}</h2>${button('Close','data-act="close-dialog"','secondary small')}</div>${body}`;
  if (!modal.open) modal.showModal();
}
function closeDialog() {
  if (modal.open) modal.close();
  delete modal.dataset.word;
}
function showWord(name) {
  const word = wordByName.get(name);
  if (!word) return;
  modal.dataset.word = name;
  showDialog(word.word,wordDefinition(word,true));
}
function choosePart(index) {
  if (!active || index<0 || index>=active.lesson.parts.length) return;
  releaseRecording();
  active.draft.part = index;
  save();
  presentLesson();
  main.focus();
}
function finishSubjective(forced = false) {
  const {lesson,draft} = active;
  if (!forced && lesson.skill === 'writing' && lesson.parts.some((_,i)=>!draft.texts[i]?.trim())) {
    toast('Write a response for each task before completing this session.');
    return;
  }
  if (draft.submitted) return;
  releaseRecording();
  pauseTimer();
  draft.submitted = true;
  addHistory();
  save();
  presentLesson();
  toast('Session saved.');
}
function exportStudy() {
  const blob = new Blob([JSON.stringify({format:'little-steps-study-v1',data:state},null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const file = document.createElement('a');
  file.href = url;
  file.download = 'little-steps-study-data.json';
  file.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
let pendingImport;
async function importStudy(file) {
  if (!file) return;
  try {
    if (file.size > 25000000) throw Error('File too large');
    const data = JSON.parse(await file.text());
    if (data.format !== storageKey || !isRecord(data.data)) throw Error('Unexpected file');
    pendingImport = normalizeState(data.data);
    showDialog('Restore study data?', `<p>The backup will replace this browser’s answers, drafts, progress and vocabulary. Speaking recordings stay here.</p><div class="actions">
      ${button('Cancel','data-act="close-dialog"','secondary')}${button('Restore backup','data-act="confirm-import"')}</div>`);
  } catch {toast('This file is not a valid Little Steps study backup.');}
}

let recordingDB;
function openRecordings() {
  if (!recordingDB) recordingDB = new Promise((resolve,reject)=>{
    const request = indexedDB.open('little-steps-recordings',1);
    request.onupgradeneeded = () => request.result.createObjectStore('clips');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return recordingDB;
}
async function recordingStorage(key, blob) {
  const db = await openRecordings();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction('clips',blob ? 'readwrite' : 'readonly');
    const store = tx.objectStore('clips');
    const request = blob ? store.put(blob,key) : store.get(key);
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
let recording = null;
let recordToken = 0;
let recordingURL;
let speakInterval;
const recordingKey = () => active ? active.key + ':' + active.draft.part : '';
const sessionRecordings = new Map();

function audioPreview(blob) {
  const player = $('#record-player');
  if (!player || !blob?.size) return;
  if (recordingURL) URL.revokeObjectURL(recordingURL);
  recordingURL = URL.createObjectURL(blob);
  player.src = recordingURL;
  player.hidden = false;
  const link = $('#download-recording');
  const extension = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm';
  link.href = recordingURL;
  link.download = 'little-steps-' + recordingKey().replace(':','-') + '.' + extension;
  $('#record-download').hidden = false;
}
async function setupRecording() {
  const key = recordingKey();
  try {
    const blob = sessionRecordings.get(key) || await recordingStorage(key);
    if (recordingKey() === key && !recording) audioPreview(blob);
  } catch {}
}
function stopRecording() {
  const current = recording;
  if (!current) return;
  if (current.recorder.state !== 'inactive') current.recorder.stop();
  current.stream.getTracks().forEach(track=>track.stop());
}
function releaseRecording() {
  recordToken++;
  clearInterval(speakInterval);
  stopRecording();
  if (recordingURL) URL.revokeObjectURL(recordingURL);
  recordingURL = undefined;
}
async function startRecording() {
  if (recording) return;
  const status = $('#record-status');
  if (!status) return;
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    status.textContent = 'Recording is unavailable on this browser. You can still practise with the timer and save notes.';
    return;
  }
  const start = $('[data-act="record-start"]');
  const stop = $('[data-act="record-stop"]');
  const key = recordingKey();
  const token = ++recordToken;
  start.disabled = true;
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({audio:true});
    if (token !== recordToken || key !== recordingKey()) {
      stream.getTracks().forEach(track=>track.stop());
      return;
    }
    const recorder = new MediaRecorder(stream);
    const local = {recorder,stream,tick:undefined};
    const chunks = [];
    recording = local;
    recorder.addEventListener('dataavailable', event=>{if(event.data.size) chunks.push(event.data);});
    recorder.addEventListener('stop', async ()=>{
      const blob = new Blob(chunks,{type:recorder.mimeType || 'audio/webm'});
      clearInterval(local.tick);
      if (recording === local) recording = null;
      if (token === recordToken && key === recordingKey()) {
        start.disabled = false;
        stop.disabled = true;
        audioPreview(blob);
        status.textContent = blob.size ? 'Recording ready to play back.' : 'No audio was captured. Try recording again.';
      }
      if (!blob.size) return;
      sessionRecordings.set(key,blob);
      try {await recordingStorage(key,blob);} catch {
        if (token === recordToken && key === recordingKey()) status.textContent = 'Playback is ready. Download the recording to keep it after closing this page.';
      }
    },{once:true});
    recorder.start(1000);
    const elapsed = $('#record-elapsed');
    const began = Date.now();
    elapsed.textContent = 'Recorded 0:00';
    elapsed.hidden = false;
    local.tick = setInterval(()=>{elapsed.textContent='Recorded '+clock(Math.floor((Date.now()-began)/1000));},250);
    stop.disabled = false;
    status.textContent = 'Recording… Select Stop recording when you finish.';
  } catch {
    stream?.getTracks().forEach(track=>track.stop());
    if (token === recordToken) {
      recording = null;
      start.disabled = false;
      status.textContent = 'Microphone access is unavailable. Check browser permissions or practise with the timer and notes.';
    }
  }
}
function startSpeakingClock(prep) {
  const display = $('#speak-timer');
  if (!display || !active) return;
  clearInterval(speakInterval);
  const seconds = prep ? 60 : active.lesson.parts[active.draft.part].time;
  const due = Date.now() + seconds*1000;
  display.textContent = clock(seconds);
  speakInterval = setInterval(()=>{
    const remaining = Math.max(0,Math.ceil((due-Date.now())/1000));
    display.textContent = clock(remaining);
    if (!remaining) {
      clearInterval(speakInterval);
      toast(prep ? 'Preparation time ended.' : 'Speaking time ended.');
    }
  },200);
}

function assessment() {
  return heading('Assessment centre','Use a timed check to choose a starting level, review your week or rehearse all four skills.') + `
    <div class="grid two">${assessmentGroups.map(group=>{
      const items = group.ids.map(id=>lessonById.get(id)).filter(Boolean);
      const scores = items.map(item=>state.history.find(event=>event.key==='assessment-'+item.id));
      const completed = scores.filter(Boolean).length;
      const original = group.id==='mock' ? '<p class="fine muted">Independent practice material. Listening uses synthetic voices, and Writing and Speaking use self-review.</p>' : '';
      const timed = items.reduce((sum,item)=>sum+item.minutes,0);
      return `<section class="card">
        <p class="eyebrow">${timed} min · ${completed} / ${items.length} sections completed</p><h3>${esc(group.title)}</h3>
        <p class="muted">${esc(group.description)}</p>${original}
        <ul class="history">${items.map((item,i)=>`<li><div><strong>${skills[item.skill].name}</strong>
          <div class="muted smalltext">${item.minutes} min · ${item.quiz ? item.quiz+' questions' : item.parts.length+' tasks'}${scores[i]?.total ? ' · '+scores[i].score+' / '+scores[i].total+' correct' : scores[i] ? ' · Completed' : ''}</div>
          </div>${link(scores[i] ? 'View section' : 'Open section','#test/'+item.id,'secondary small')}</li>`).join('')}</ul>
        ${completed===items.length ? assessmentAdvice(group,scores) : ''}
      </section>`;
    }).join('')}</div>
    <p class="fine muted" style="margin-top:13px">Each section saves its own result. Objective scores show answers correct. Writing and Speaking use a model or recording review. <a href="https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test" target="_blank" rel="noopener">Official IELTS sample tests</a></p>`;
}
function assessmentAdvice(group,scores) {
  const scored = scores.filter(item=>item?.total>0);
  if (!scored.length) return '';
  const fraction = scored.reduce((t,item)=>t+item.score,0) / scored.reduce((t,item)=>t+item.total,0);
  const advice = group.id === 'placement' ?
    (fraction >= .80 ? 'Try B2 next and compare with C1 practice.' : fraction >= .55 ? 'Try B1 next and compare with B2 practice.' : 'Start with A2 and move to B1 when the main points are clear.') :
    'Review missed answers first, then practise the question types that caused the most difficulty.';
  return `<div class="callout"><strong>Next practice</strong><p>${advice} ${group.id==='placement' ? 'Use this as a starting suggestion.' : ''}</p>${link('Open progress','#progress','flat small')}</div>`;
}
async function renderRoute(initial = false) {
  const sequence = ++routeSequence;
  clearInterval(runInterval);
  if (active) {
    releaseRecording();
    if (!active.isTest) pauseTimer();
    save();
  }
  active = null;
  closeDialog();
  const route = getRoute();
  nav.innerHTML = navHTML(route.page);
  const journeySession = route.page==='lesson' ? parseJourneyLesson(route.id) : null;
  let journeyPageData;
  if (route.page==='journey' || journeySession) {
    main.innerHTML = '<p class="card" role="status">Opening study material…</p>';
    try {
      const catalog = await journeyCatalog();
      const programId = journeySession?.program ?? route.program;
      const program = catalog.programs.find(item=>item.id===programId);
      const day = program && (journeySession || route.day)
        ? await loadJourneyDay(catalog,programId,journeySession?.day ?? route.day)
        : null;
      if (sequence!==routeSequence) return;
      journeyPageData = {catalog,program,day};
      if (day && journeySession && program.levels.includes(journeySession.level)) {
        const item = makeJourneyLesson(day,programId,journeySession.skill,journeySession.level);
        lessonById.set(item.id,item);
      }
    } catch {
      if (sequence!==routeSequence) return;
      main.innerHTML = heading('Study material unavailable','Reload this page to try opening the data package again.')
        + link('Back to practice','#practice','secondary');
      main.focus();
      return;
    }
  }
  if (route.page==='progress' && state.history.some(event=>parseJourneyLesson(event.key))) {
    await loadJourneyHistory();
    if (sequence!==routeSequence) return;
  }
  const item = lessonById.get(route.id);
  const isTest = route.page === 'test';
  if ((route.page === 'lesson' || isTest) && item && Boolean(item.assessment) === isTest) {
    const key = isTest ? 'assessment-'+item.id : item.id;
    const draft = state.drafts[key] ??= {
      ...makeDraft(),mode:item.journey && item.level.startsWith('C') ? 'independent' : 'supported'
    };
    active = {lesson:item,draft,key,isTest};
    presentLesson();
    runInterval = setInterval(renderTimer,350);
  } else if (route.page === 'journey') {
    main.innerHTML = renderJourneyPage(route,journeyPageData);
  } else if (route.page === 'practice') {
    if (route.skill) {
      pageState.skill = route.skill;
      pageState.level = route.level || state.levels[route.skill];
      pageState.length = 'all';
      pageState.search = '';
    } else {
      Object.assign(pageState,{skill:'all',level:'all',length:'all',search:''});
    }
    main.innerHTML = practice();
  } else if (route.page === 'vocabulary') main.innerHTML = vocabulary();
  else if (route.page === 'academy') main.innerHTML = academyPage();
  else if (route.page === 'research') main.innerHTML = researchPage();
  else if (route.page === 'progress') main.innerHTML = progress();
  else if (route.page === 'assessment') main.innerHTML = assessment();
  else if (route.page === 'lesson' || route.page === 'test') {
    main.innerHTML = heading('Session unavailable','Choose another session from the library.') + link('Open practice','#practice');
  } else main.innerHTML = home();
  document.title = route.page === 'home' ? 'Little Steps, Big Bands' : (main.querySelector('h1')?.textContent.replace(/\s+/g,' ').trim() || 'Practice') + ' | Little Steps, Big Bands';
  if (!initial) {
    main.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}
function refreshField(field,value) {
  if (field==='journey-program' && journeyProgramPattern.test(value)) {
    journeyFilters.query = '';
    journeyFilters.skill = 'all';
    location.hash = journeyLink(value);
    return;
  }
  if (field==='journey-level') {
    const route = getRoute();
    state.journeyLevels[route.program] = value;
    save();
    if (route.day) location.hash = journeyLink(route.program,route.day,value);
    else renderRoute(true).then(()=>$('[data-field="journey-level"]')?.focus({preventScroll:true}));
    return;
  }
  if (field==='journey-view' || field==='journey-skill' || field==='journey-query') {
    journeyFilters[field.slice(8)] = value;
    const node = $('#journey-results');
    if (node && journeyOverview) node.innerHTML = journeyResults(journeyOverview);
    return;
  }
  if (field.startsWith('pref-')) {
    state.levels[field.slice(5)] = value;
    save();
    return;
  }
  if (field === 'plan') {
    state.plan = value;
    save();
    $('.hero-plan').innerHTML = dailyPlan();
    $('[data-field="plan"]').focus({preventScroll:true});
    return;
  }
  if (field === 'academySkill' || field === 'academyType') {
    if (field === 'academySkill') {
      academySkill = value;
      academyType = 0;
    } else academyType = Number(value);
    main.innerHTML = academyPage();
    $('[data-field="'+field+'"]').focus({preventScroll:true});
    return;
  }
  if (field === 'writing-type' && active) {
    active.draft.types[active.draft.part] = value;
    save();
    presentLesson();
    $('[data-field="writing-type"]')?.focus({preventScroll:true});
    return;
  }
  if (!Object.hasOwn(pageState,field)) return;
  pageState[field] = value;
  if (field === 'skill') {
    pageState.level = value === 'all' ? 'all' : state.levels[value];
    const selectLevel = $('[data-field="level"]');
    if (selectLevel) selectLevel.value = pageState.level;
    const title = main.querySelector('h1');
    if (title) title.textContent = value === 'all' ? 'Practice library' : skills[value].name+' practice';
  }
  if (field.startsWith('vocab')) {
    pageState.reviewIndex = 0;
    $('#word-results').innerHTML = wordResults();
  } else {
    $('#lesson-results').innerHTML = lessonResults();
  }
}
document.addEventListener('input',event=>{
  const target = event.target;
  if (target.matches('input[type=search][data-field]')) refreshField(target.dataset.field,target.value);
  if (!active) return;
  const {draft} = active;
  const {answer,text,note} = target.dataset;
  if (answer !== undefined && !draft.submitted) {
    draft.answers[answer] = target.value;
    const answered = $('#answered-count');
    if (answered) answered.textContent = grade().answered+' of '+active.lesson.quiz+' answered';
  } else if (text !== undefined && !draft.submitted) {
    draft.texts[text] = target.value;
    $('#word-count').textContent = wordCount(target.value);
  } else if (note !== undefined) draft.notes[note] = target.value;
  else return;
  save();
});
document.addEventListener('change',event=>{
  const target = event.target;
  if (target.matches('select[data-field]')) refreshField(target.dataset.field,target.value);
  if (target.id==='data-file') {
    importStudy(target.files[0]);
    target.value='';
  }
});
document.addEventListener('click',event=>{
  const buttonNode = event.target.closest('[data-act]');
  if (!buttonNode) return;
  const {act,word,mode,i} = buttonNode.dataset;
  switch (act) {
    case 'reset-filters':
      Object.assign(pageState,{skill:'all',level:'all',length:'all',search:''});
      main.innerHTML = practice();
      $('[data-field="skill"]').focus();
      break;
    case 'dictionary': showWord(word); break;
    case 'shuffle': shuffleLesson(); break;
    case 'next-unseen': {
      const present = active.lesson;
      const alternatives = lessonsFor(present.skill,present.level).filter(item=>item.id!==present.id && !state.drafts[item.id]?.submitted);
      if (!alternatives.length) toast('You have finished the available lessons for this skill and level.');
      else location.hash = '#lesson/'+alternatives[0].id;
      break;
    }
    case 'print':
      if (active) printLesson();
      break;
    case 'say-word':
      if (wordByName.has(word) && 'speechSynthesis' in window) {
        const phrase = new SpeechSynthesisUtterance(word);
        phrase.lang = 'en-GB';
        speechSynthesis.cancel();
        speechSynthesis.speak(phrase);
      } else toast('Pronunciation playback is unavailable in this browser.');
      break;
    case 'schedule-word':
      if (wordByName.has(word)) {
        const step = mode === 'soon' ? 0 : Math.min(3,(state.reviewDates[word]?.step ?? -1)+1);
        const days = mode === 'soon' ? 1 : [2,4,8,16][step];
        state.reviewDates[word] = {step,due:Date.now()+days*86400000};
        save();
        $('#word-results').innerHTML = wordResults();
        toast('Review scheduled in '+days+' day'+(days===1?'':'s')+'.');
      }
      break;
    case 'close-dialog': closeDialog(); break;
    case 'save-word':
    case 'learn-word': {
      if (!wordByName.has(word)) return;
      const key = act==='save-word' ? 'saved' : 'learned';
      const adding = !state[key].includes(word);
      state[key] = adding ? [...state[key],word] : state[key].filter(item=>item!==word);
      save();
      if ($('#word-results')) $('#word-results').innerHTML = wordResults();
      if (modal.open && modal.dataset.word) {
        showWord(word);
        modal.querySelector('[data-act="'+act+'"]')?.focus();
      }
      toast(adding ? (key==='saved' ? 'Word saved.' : 'Marked as learnt.') : 'Word list updated.');
      break;
    }
    case 'review-next':
      pageState.reviewIndex++;
      $('#word-results').innerHTML = wordResults();
      $('[data-act="review-next"]')?.focus();
      break;
    case 'timer':
      if (active.draft.started) pauseTimer();
      else active.draft.started = Date.now();
      save();
      buttonNode.textContent = active.draft.started ? 'Pause timer' : 'Resume timer';
      renderTimer();
      break;
    case 'begin-test':
      active.draft.started = Date.now();
      save();
      presentLesson();
      main.focus();
      break;
    case 'lesson-part': choosePart(Number(i)); break;
    case 'next-part': choosePart(active.draft.part+1); break;
    case 'prev-part': choosePart(active.draft.part-1); break;
    case 'submit-answers': submitObjective(); break;
    case 'submit-now': submitObjective(true); break;
    case 'writing-mode':
      active.draft.mode = mode;
      save();
      presentLesson();
      $('[data-mode="'+mode+'"]')?.focus({preventScroll:true});
      break;
    case 'finish-subjective': finishSubjective(); break;
    case 'record-start': startRecording(); break;
    case 'record-stop': stopRecording(); break;
    case 'speak-clock': startSpeakingClock(false); break;
    case 'prep-clock': startSpeakingClock(true); break;
    case 'confirm-retry':
      showDialog('Start this session again?',`<p>Your recorded result will stay in Progress. The current responses for this session will be cleared.</p>
        <div class="actions">${button('Cancel','data-act="close-dialog"','secondary')}${button('Start again','data-act="retry"')}</div>`);
      break;
    case 'retry':
      closeDialog();
      releaseRecording();
      active.draft = state.drafts[active.key] = {
        ...makeDraft(),mode:active.lesson.journey && active.lesson.level.startsWith('C') ? 'independent' : 'supported'
      };
      save();
      presentLesson();
      main.focus();
      break;
    case 'export': exportStudy(); break;
    case 'import': $('#data-file').click(); break;
    case 'save-note': addNote(); break;
    case 'confirm-import':
      if (pendingImport) {
        state = pendingImport;
        pendingImport = undefined;
        save();
        closeDialog();
        renderRoute();
        toast('Study data restored.');
      }
      break;
  }
});
window.addEventListener('hashchange',()=>renderRoute());
window.addEventListener('pagehide',()=>{
  if (active) {
    if (!active.isTest) pauseTimer();
    releaseRecording();
    save();
  }
});
window.addEventListener('pageshow',event=>{if(event.persisted) renderRoute(true);});

function dailyPlan() {
  const time = lengthFor(state.plan);
  const pickedSkills = state.plan==='short' ? ['reading'] : state.plan==='focus' ? ['reading','listening'] : Object.keys(skills);
  const daily = pickedSkills.map(skill=>{
    const all = lessonsFor(skill,state.levels[skill]);
    const options = all.filter(item=>item.length==='short');
    return dailyLesson(options.length ? options : all);
  });
  function dailyLesson(options) {
    const unique = options.filter(item=>!state.drafts[item.id]?.submitted);
    const candidates = unique.length ? unique : options;
    const date = new Date();
    const day = Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
    return candidates[day%candidates.length];
  }
  const links = daily.map(item=>`<li><a href="#lesson/${item.id}">${skills[item.skill].name} · ${esc(item.title)}</a><span class="muted smalltext"> · ${item.level}</span></li>`);
  const wordsToReview = [3,5,8][lengths.indexOf(time)];
  return `<section class="card"><p class="eyebrow">Daily study plan</p><h2>What can you do today?</h2>
    ${select('plan','Time available',lengths.map(x=>[x.id,x.time+' · '+x.name]),state.plan)}
    <p class="smalltext muted">Work on these goals within your time budget. You can resume any unfinished lesson later.</p><ul>
    ${links.join('')}<li><a href="#vocabulary">Review ${wordsToReview} vocabulary words</a></li></ul></section>`;
}
function shuffleLesson() {
  const choices = matchingLessons().filter(item=>!state.drafts[item.id]?.submitted && !seenShuffle.has(item.id));
  if (!choices.length) {
    toast('You have seen every lesson in this selection. Try another level or topic.');
    return;
  }
  const item = choices[Math.floor(Math.random()*choices.length)];
  seenShuffle.add(item.id);
  location.hash = '#lesson/'+item.id;
}
function academyPage() {
  const types = academy[academySkill];
  const selected = types[academyType] || types[0];
  const name = skills[academySkill].name;
  return heading('Study methods','Learn a method, try a worked example, then practise it at your level.') + `
    <div class="card filters">${select('academySkill','Skill',Object.entries(skills).map(([id,skill])=>[id,skill.name]),academySkill)}
    ${select('academyType','Question or task type',types.map((item,i)=>[String(i),item.type]),String(academyType))}</div>
    <div class="grid two"><section class="card"><h2>${esc(selected.type)}</h2>
    <ol class="list" lang="vi">${selected.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>
    <details><summary>Study references</summary><ul class="list">${sources[academySkill].map(item=>`<li>${esc(item)}</li>`).join('')}</ul>
    <a href="https://ielts.org/take-a-test/test-types/ielts-academic-test/" target="_blank" rel="noopener">IELTS Academic test format</a></details>
    </section><section class="card"><h2>Worked example</h2><p style="margin-top:9px">${esc(selected.example)}</p>
    ${selected.prompt ? `<p><strong>${esc(selected.prompt)}</strong></p>` : ''}
    ${selected.choices ? `<ol class="list" type="A">${selected.choices.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>` : ''}
    <details><summary>Show answer and reasoning</summary><p><strong>${esc(selected.answer)}</strong></p><p>${esc(selected.why)}</p></details>
    <div class="actions" style="margin-top:12px">${link('Practise '+name,'#practice/'+academySkill)}</div></section></div>
    <div class="section-head"><div><h2>Level pathway</h2><p class="sub">Use the goals for this skill to decide where to start.</p></div></div>
    <div class="grid three">${levels.map(level=>{const path=pathways[level];return `<article class="card"><span class="tag">${level}</span><h3>${esc(path.title)}</h3><p>${esc(path.goals[Object.keys(skills).indexOf(academySkill)])}</p>${link('Practice at '+level,'#practice/'+academySkill+'/'+level,'flat small')}</article>`;}).join('')}</div>
    <div class="actions" style="margin-top:14px">${link('Source research log','#research','secondary small')}</div>`;
}
function researchPage() {
  const pages = researchRows.reduce((n,row)=>n+row.pages,0);
  const ocr = researchRows.reduce((n,row)=>n+row.ocr,0);
  const thin = researchRows.reduce((n,row)=>n+row.thin,0);
  return heading('Source research log','Page-level processing across the project’s source PDFs, with teaching decisions and review status.') + `
    <div class="grid three">
      <section class="card"><p class="muted">PDFs processed</p><p class="big-number">${researchRows.length}</p></section>
      <section class="card"><p class="muted">Pages indexed</p><p class="big-number">${pages.toLocaleString('en')}</p></section>
      <section class="card"><p class="muted">Pages processed by OCR</p><p class="big-number">${ocr.toLocaleString('en')}</p></section>
    </div>
    <div class="section-head"><h2>Review status</h2></div>
    <section class="card"><p>Text extraction processed each page. Automated markers flag possible contents, tests, transcripts, answer keys and rubric pages. The method guides use the checked reference sections, and the practice material is newly written.</p>
    <p>${thin} pages returned fewer than 22 extractable English words. Visual verification and detailed, human review of every page remain open. The narrative writing marking guide was excluded under the usage restriction recorded in the source inventory.</p>
    <p>The practice library groups original exercises by level and time. Longer sessions can combine material for review. The bank totals count each unique source exercise only once.</p>
    <p><strong>Practice bank</strong> · ${uniqueCount('reading')} Reading texts · ${uniqueCount('listening')} Listening clips · ${uniqueCount('writing')} Writing tasks · ${uniqueCount('speaking')} Speaking sets.</p>
    <div class="actions"><a class="btn secondary" href="ielts-source-review.csv" download>Download page index</a></div></section>
    <div class="section-head"><h2>PDF processing by file</h2></div>
    <div class="card">${researchRows.map(row=>`<details><summary class="break-anywhere">${esc(row.name)}</summary>
      <p>${row.pages} pages · ${row.ocr} OCR · ${row.thin} with sparse extracted text.</p>
      <p class="smalltext muted">${Object.keys(row.anchors).length ? Object.entries(row.anchors).map(([key,indexes])=>esc(key)+': '+esc(indexes.slice(0,9).join(', '))+(indexes.length>9?' and more':'')).join(' · ') : 'The index has no matching section markers.'}</p></details>`).join('')}</div>`;
}
function uniqueCount(skill) {
  return new Set(lessons.filter(lesson=>lesson.skill===skill).flatMap(lesson=>lesson.parts.map(part=>part.title))).size;
}
const noteKinds = {mistake:'Mistake',grammar:'Grammar',vocabulary:'Vocabulary',strategy:'Strategy'};
function notebookHTML() {
  return `<div class="section-head"><h2>Mistake notebook</h2></div>
  <section class="card"><div class="grid two">
  <div class="stack" style="margin-top:0">${select('note-kind','Note type',Object.entries(noteKinds),'mistake')}
    <label class="field">Title<input id="note-title" type="text" maxlength="100" placeholder="e.g. Missing a word that reverses a claim"></label>
    <label class="field">Note<textarea id="note-text" rows="3" maxlength="1800" style="min-height:90px" placeholder="Write what went wrong and what you will check next time."></textarea></label>
    ${button('Save note','data-act="save-note"','secondary')}</div>
  <div>${state.notebook.length ? state.notebook.slice(0,12).map(note=>`<article class="note ${note.kind}"><p class="fine muted">${noteKinds[note.kind]}</p><h3>${esc(note.title)}</h3><p class="prewrap">${esc(note.text)}</p></article>`).join('') : '<p class="muted">Your study notes will appear here.</p>'}</div>
  </div></section>`;
}
function addNote() {
  const kind = $('[data-field="note-kind"]').value;
  const title = $('#note-title').value.trim();
  const text = $('#note-text').value.trim();
  if (!title || !text) {
    toast('Add a title and a note.');
    return;
  }
  state.notebook.unshift({kind,title,text,date:Date.now()});
  state.notebook = state.notebook.slice(0,200);
  save();
  main.innerHTML = progress();
  $('#note-title').focus();
  toast('Note saved.');
}
function printLesson() {
  const {lesson,draft,isTest} = active;
  if (isTest && !draft.submitted) return;
  let layout = $('#print-layout');
  if (!layout) {
    layout = document.createElement('div');
    layout.id = 'print-layout';
    document.body.append(layout);
  }
  layout.innerHTML = `<h1>${esc(lesson.title)}</h1><p>Little Steps, Big Bands · ${skillName(lesson.skill)} · ${lesson.level}</p>
    ${lesson.parts.map(part=>`<section class="print-task"><h2>${esc(part.title)}</h2>
    ${lesson.skill==='reading' ? part.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('') : ''}
    ${part.vocabulary ? vocabularyTable(part.vocabulary) : ''}
    ${lesson.skill==='writing' ? `<p>${esc(part.prompt)}</p>${taskVisual(part)}<p>Word target ${part.target}.</p>` : ''}
    ${lesson.skill==='speaking' ? `${part.image?'<img src="market.webp" width="280" alt="Street flower vendor"><p class="fine">Célestine M.C. Leroy · Wikimedia Commons · CC BY-SA 2.0</p>':''}<ol>${part.prompts.map(p=>`<li>${esc(p)}</li>`).join('')}</ol>` : ''}
    ${part.questions ? `<ol>${part.questions.map(q=>`<li>${esc(q.prompt)}<br>${q.options?q.options.map((option,i)=>`<span>${String.fromCharCode(65+i)}. ${esc(option)}</span>`).join(' &nbsp; '):'____________________'}</li>`).join('')}</ol>` : ''}
    </section>`).join('')}`;
  window.addEventListener('afterprint',()=>layout.remove(),{once:true});
  window.print();
}
function rubricHTML(skill,type) {
  const writing = skill==='writing';
  const marks = writing ? [
    [type==='Academic Task 1' ? 'Task achievement' : 'Task response','Check whether your response covers every instruction, selects the major features or maintains a clear position.'],
    ['Coherence and cohesion','Check whether each paragraph has a purpose and ideas connect in a logical order.'],
    ['Lexical resource','Underline where a precise word, collocation or paraphrase conveys meaning.'],
    ['Grammatical range and accuracy','Find one varied, accurate structure and one error to correct.']
  ] : [
    ['Fluency and coherence','Listen for pauses caused by searching for words and whether examples follow a clear line.'],
    ['Lexical resource','Identify one useful paraphrase and any places where your word choice was imprecise.'],
    ['Grammatical range and accuracy','Listen for varied structures. Pick one recurring grammar error to practise.'],
    ['Pronunciation','Check whether word stress, endings and sound groups make your meaning easy to hear.']
  ];
  const url = writing ? 'https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing' :
    'https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf';
  const noteId = 40 + active.draft.part;
  return `<details class="rubric"><summary>IELTS self-review criteria</summary><ul class="list">
    ${marks.map(([name,desc])=>`<li><strong>${name}</strong> · ${desc}</li>`).join('')}</ul>
    <label class="field">Evidence and one change to make<textarea data-note="${noteId}" maxlength="1800" style="min-height:75px" placeholder="Example from your response and how to improve it">${esc(active.draft.notes[noteId])}</textarea></label>
    <p class="fine muted">Use the criteria for self-review or ask a teacher to assess your work against them. <a href="${url}" target="_blank" rel="noopener">Official IELTS criteria</a></p></details>`;
}
function taskVisual(task) {
  const source = /^https:\/\//u.test(task.source ?? '')
    ? `<p class="fine muted">Source · <a href="${esc(task.source)}" target="_blank" rel="noopener">${esc(task.sourceLabel)}</a></p>` : '';
  if (task.diagram) {
    return `<figure class="journey-diagram"><figcaption><strong>${esc(task.diagram.title)}</strong></figcaption>
      <div class="journey-flows">${task.diagram.flows.map(([label,steps])=>
        `<section><h3>${esc(label)}</h3><ol>${steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></section>`).join('')}</div>${source}</figure>`;
  }
  if (task.visual==='bars' && task.table) {
    const [header,...rows] = task.table;
    const max = Math.ceil(Math.max(...rows.flatMap(row=>row.slice(1).map(Number)),1));
    return `<figure class="data-chart journey-chart"><figcaption class="smalltext"><strong>${esc(header[0])}</strong></figcaption>
      ${rows.map(([label,...values])=>`<div class="chart-group"><strong>${esc(label)}</strong>
        ${values.map((value,i)=>`<div class="chart-row"><span>${esc(header[i+1])}</span><div class="chart-track"><b class="bar bar-${i}" style="width:${Number(value)/max*100}%" aria-hidden="true"></b></div><span>${esc(value)}</span></div>`).join('')}</div>`).join('')}
      ${source}<details><summary>Show exact data</summary>${tableHTML(task.table)}</details></figure>`;
  }
  if (!task.chart) return task.table ? `<div class="task-table-scroll">${tableHTML(task.table)}${source}</div>` : source;
  const [head,...rows] = task.table;
  const marks = rows.map(row=>({name:row[0],values:row.slice(1).map(value=>Number(value.replaceAll(',',''))/1000000)}));
  return `<div class="data-chart"><p class="smalltext"><strong>Resident population, millions</strong></p>
    <div class="chart-axis" aria-hidden="true"><span>0</span><span>10</span><span>20</span><span>30</span><span>40</span></div>
    ${marks.map(row=>`<div class="chart-group"><strong>${esc(row.name)}</strong>${row.values.map((v,i)=>`<div class="chart-row"><span>${esc(head[i+1])}</span><div class="chart-track"><b class="bar bar-${i}" style="width:${v/40*100}%" aria-hidden="true"></b></div><span>${v.toFixed(1)}</span></div>`).join('')}</div>`).join('')}
    <p class="fine muted">Source · <a href="${esc(task.source)}" target="_blank" rel="noopener">${esc(task.sourceLabel)}</a></p>
    <details><summary>Show exact data</summary>${tableHTML(task.table)}</details>
  </div>`;
}

const journeySkillKeys = Object.keys(journeySkills);
const journeyLink = (program,day,level) => '#journey/'+program+(day ? '/'+day+'/'+level : '');
const journeyExerciseLink = (program,day,skill,level) => '#lesson/'+journeyLessonId(program,day,skill,level);
const journeyCompleted = () => new Set([
  ...state.history.map(event=>event.key),
  ...Object.entries(state.drafts).filter(([,draft])=>draft.submitted).map(([id])=>id)
]);

async function loadJourneyHistory() {
  try {
    const catalog = await journeyCatalog();
    const keys = [...new Set(state.history.filter(event=>parseJourneyLesson(event.key)).slice(0,30).map(event=>event.key))];
    await Promise.allSettled(keys.map(async key=>{
      if (lessonById.has(key)) return;
      const {program,day,skill,level} = parseJourneyLesson(key);
      const item = await loadJourneyDay(catalog,program,day);
      if (item) lessonById.set(key,makeJourneyLesson(item,program,skill,level));
    }));
  } catch {
    // Progress remains readable when an optional study package is unavailable.
  }
}

function journeyLevelControl(program,level) {
  return select('journey-level','Study level',program.levels.map(item=>[
    item, item==='B2' ? 'B2 · Guided practice' : item==='C1' ? 'C1 · Independent challenge' : item
  ]),level);
}

function renderJourneyPage(route,{catalog,program,day}) {
  if (!program) return heading('Programme unavailable','Choose a study programme from the Learning Journey.')
    + link('Open Learning Journey','#journey','secondary');
  const available = journeyEntries(catalog,program.id);
  const preferredLevel = state.journeyLevels[program.id] || state.levels.reading;
  const level = [route.level,preferredLevel,program.levels[0]].find(value=>program.levels.includes(value));
  const completed = journeyCompleted();
  if (route.day!==null) {
    if (!day) {
      return heading('Day unavailable','Choose a published day from the study programme.')
        + link('See available days',journeyLink(program.id),'secondary');
    }
    return journeyDayPage({program,available,day,level,completed});
  }
  journeyOverview = {program,available,level,completed};
  const total = available.length;
  const dayScore = entry=>journeySkillKeys.filter(skill=>completed.has(journeyLessonId(program.id,entry.day,skill,level))).length;
  const finishedDays = available.filter(day=>dayScore(day)===journeySkillKeys.length).length;
  const next = available.find(day=>dayScore(day)<journeySkillKeys.length);
  const finished = available.reduce((sum,entry)=>sum+dayScore(entry),0);
  return `<section class="journey-banner"><div>
    <p class="eyebrow">${esc(program.title)}</p><h1>365-Day Learning Journey</h1>
    <p>Practise six skills each day. Start with any available day, study ahead or return to a completed lesson.</p>
    <div class="actions">${next ? link('Continue with day '+next.day,journeyLink(program.id,next.day,level)) : '<span class="tag gold">Available days complete</span>'}</div>
    </div><div class="journey-metrics">
      <p><strong>${total}</strong> / ${program.goalDays} days available</p>
      <p><strong>${finishedDays}</strong> days finished at ${level}</p>
      <progress value="${finished}" max="${Math.max(1,total*journeySkillKeys.length)}" aria-label="Completed lessons"></progress>
      <p class="fine">${finished} / ${total*journeySkillKeys.length} lessons complete at this level</p>
    </div></section>
    <div class="card filters journey-filters">
      ${catalog.programs.length>1 ? select('journey-program','Programme',catalog.programs.map(p=>[p.id,p.title]),program.id) : ''}
      ${journeyLevelControl(program,level)}
      ${select('journey-view','Browse',[['days','Study by day'],['library','All lessons'],['review','Review and continue']],journeyFilters.view)}
      ${select('journey-skill','Filter by skill',[['all','All six skills'],...journeySkillKeys.map(skill=>[skill,skillName(skill)])],journeyFilters.skill)}
      <label class="field">Find a day or topic<input type="search" data-field="journey-query" value="${esc(journeyFilters.query)}" placeholder="e.g. 12 or transport"></label>
    </div><div id="journey-results">${journeyResults(journeyOverview)}</div>`;
}

function journeyResults({program,available,level,completed}) {
  const term = journeyFilters.query.trim().toLowerCase();
  const matchesDay = day=>!term || [day.theme,'Day '+day.day,String(day.day).padStart(2,'0'),
    ...Object.values(day.titles)].some(value=>value.toLowerCase().includes(term));
  const selectedSkills = journeySkillKeys.filter(skill=>journeyFilters.skill==='all' || journeyFilters.skill===skill);
  if (journeyFilters.view==='days' && journeyFilters.skill==='all') {
    const days = available.filter(matchesDay);
    return `<h2>Study by day</h2><p class="smalltext muted" role="status">${days.length} matching ${days.length===1 ? 'day' : 'days'}</p>
      <div class="grid three journey-days">${days.map(entry=>{
        const done = journeySkillKeys.filter(skill=>completed.has(journeyLessonId(program.id,entry.day,skill,level))).length;
        return `<a class="card journey-card" href="${journeyLink(program.id,entry.day,level)}">
          <div class="meta"><span class="tag">Day ${entry.day}</span><span>${done} / 6 complete</span></div>
          <h3>${esc(entry.theme)}</h3></a>`;
      }).join('')}</div>`;
  }
  const reviewing = journeyFilters.view==='review';
  const items = available.flatMap(day=>selectedSkills.map(skill=>{
    const id = journeyLessonId(program.id,day.day,skill,level);
    const finished = completed.has(id);
    const draft = state.drafts[id];
    const started = Boolean(draft && (draft.started || draft.elapsed || Object.keys(draft.answers).length
      || Object.values(draft.texts).some(Boolean) || Object.values(draft.notes).some(Boolean)));
    return {day,skill,id,finished,started};
  })).filter(item=>matchesDay(item.day) && (!reviewing || item.finished || item.started));
  return `<h2>${reviewing ? 'Review and continue' : 'All available lessons'}</h2>
    <p class="smalltext muted" role="status">${items.length} matching ${items.length===1 ? 'lesson' : 'lessons'}</p>
    ${items.length ? `<div class="grid three journey-days">${items.map(({day,skill,id,finished,started})=>
      `<a class="card journey-card" href="#lesson/${id}"><div class="meta"><span class="tag">Day ${day.day}</span>
      <span>${skillName(skill)}</span>${finished ? '<span class="tag gold">Review</span>' : started ? '<span class="tag">Continue</span>' : ''}</div>
      <h3>${esc(day.titles[skill])}</h3><p class="smalltext muted">${esc(day.theme)}</p></a>`).join('')}</div>` :
      '<p class="card">No lessons in this view. Try a different skill or search term.</p>'}`;
}

function journeyDayPage({program,available,day,level,completed}) {
  const at = available.findIndex(entry=>entry.day===day.day);
  const before = available[at-1];
  const after = available[at+1];
  const activities = journeySkillKeys.map(skill=>makeJourneyLesson(day,program.id,skill,level));
  const minutes = activities.reduce((total,item)=>total+item.minutes,0);
  return `<div class="actions">${link('Back to journey',journeyLink(program.id),'flat small')}</div>
    <div class="journey-day-head">${heading(day.theme,'Six activities · about '+minutes+' min · open any activity below.',program.title+' · Day '+day.day)}
    ${journeyLevelControl(program,level)}</div>
    <div class="grid three journey-days">${activities.map(lesson=>{
      const info = journeySkills[lesson.skill];
      const done = completed.has(lesson.id);
      return `<a class="card journey-card journey-activity" href="#lesson/${lesson.id}">
      ${glyph(lesson.skill)}<div class="meta"><span class="tag">${info.name}</span>
      <span>${lesson.minutes} min${lesson.quiz ? ' · '+lesson.quiz+' questions' : ''}</span></div>
      <h3>${esc(lesson.title)}</h3><p class="smalltext muted">${esc(info.details)}</p>
      ${done ? '<span class="tag gold">Completed · open to review</span>' : ''}</a>`;
    }).join('')}</div>
    <div class="actions journey-day-links">
    ${before ? link('Previous day · '+before.day,journeyLink(program.id,before.day,level),'secondary') : ''}
    ${after ? link('Next day · '+after.day,journeyLink(program.id,after.day,level),'secondary') : ''}</div>`;
}

function nextJourneyActivity(lesson) {
  const {program,day} = lesson.journey;
  const completed = journeyCompleted();
  const next = journeySkillKeys.find(skill=>!completed.has(journeyLessonId(program,day,skill,lesson.level)));
  return next ? link('Continue with '+skillName(next),journeyExerciseLink(program,day,next,lesson.level),'secondary small')
    : link('Review this day',journeyLink(program,day,lesson.level),'secondary small');
}

function vocabularyTable(entries) {
  return `<ul class="journey-vocabulary">${entries.map(([term,pos,definition,example,pairing])=>
    `<li><strong>${esc(term)}</strong> <span class="smalltext muted">${esc(pos)}</span><p>${esc(definition)}</p>
    <p><em>${esc(example)}</em></p><p class="smalltext muted">${esc(pairing)}</p></li>`).join('')}</ul>`;
}
function journeyVocabulary(part,draft) {
  return `<p class="muted">Recall the word or phrase. Open the entries to study or check its use in context.</p>
    <details ${draft.submitted ? 'open' : ''}><summary>Open vocabulary entries</summary>${vocabularyTable(part.vocabulary)}</details>`;
}

renderRoute(true);
