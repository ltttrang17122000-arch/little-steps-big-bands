import {reading} from './reading.js';
import {listening} from './listening.js';
import {writing} from './writing.js';
import {speaking} from './speaking.js';
import {extraReading, extraListening, extraWriting, extraSpeaking} from './extra-practice.js';

export const levels = ['A1','A2','B1','B2','C1','C2'];
export const skills = {
  reading: {name:'Reading', desc:'Find evidence, spot paraphrases and build toward Band 9.', kind:'Passage practice'},
  listening: {name:'Listening', desc:'Catch key details, follow a speaker and review the transcript.', kind:'Audio practice'},
  writing: {name:'Writing', desc:'Identify the task, plan your response and revise with a checklist.', kind:'Guided writing'},
  speaking: {name:'Speaking', desc:'Work through prompts, record your response and listen back.', kind:'Speaking practice'}
};
export const lengths = [
  {id:'short',name:'Quick practice',time:'5–10 min',minutes:[8,8,10,8],desc:'One small exercise and a quick review.'},
  {id:'focus',name:'Focused practice',time:'15–30 min',minutes:[20,18,25,18],desc:'Practise a technique, then revisit your answers.'},
  {id:'deep',name:'Extended practice',time:'45–60 min',minutes:[45,45,50,45],desc:'Work through several parts with time for review.'}
];
const collections = {reading,listening,writing,speaking};
const extras = {reading:extraReading,listening:extraListening,writing:extraWriting,speaking:extraSpeaking};
const route = {reading:'Read for Band 9',listening:'Listen for the key detail',writing:'Build a clear response',speaking:'Speak with a clear purpose'};
const instruction = {
  reading:['Preview the questions. Look for paraphrases, then locate a line that supports each answer.','Với True / False / Not Given, tìm đúng mệnh đề trong bài. False cần bằng chứng ngược lại. Not Given dùng khi bài thiếu thông tin để kết luận.'],
  listening:['Read the questions first. Listen for corrections and changes before committing to a detail.','Lượt đầu nghe ý chính và trả lời. Khi chữa, nghe lại đoạn có từ chuyển ý hoặc thông tin được sửa.'],
  writing:['Identify the task type before you draft. Use the checklist to revise one paragraph at a time.','Gạch chân động từ chỉ yêu cầu đề. Khi sửa, thay nhận xét chung bằng một chi tiết hoặc một hành động cụ thể.'],
  speaking:['Make brief notes, record once, and listen back for your clearest example and one place to improve.','Lần một nói liền mạch. Nghe lại rồi thu lần hai, phát triển ví dụ hoặc nói rõ hơn ở chỗ bị vấp.']
};
export const lessons = [];
for (const [skillIndex, skill] of Object.keys(skills).entries()) {
  for (const level of levels) {
    const sections = collections[skill][level];
    for (const [i, length] of lengths.entries()) {
      const objective = skill === 'reading' || skill === 'listening';
      const parts = objective ? (i === 0 ? sections.slice(0,1) : i === 1 ? sections.slice(1) : sections) :
        (i === 0 ? sections.slice(0,1) : i === 1 ? sections.slice(1,2) : sections.slice(2));
      const name = i === 0 || !objective && i === 1 ? parts[0].title :
        skill === 'reading' ? (i === 2 ? 'Reading workshop' : parts[0].title + ' & more') :
        skill === 'listening' ? (i === 2 ? 'Listening workshop' : parts[0].title + ' & more') :
        skill === 'writing' ? (['B2','C1','C2'].includes(level) ? 'Academic writing pair' : 'Writing workshop') : 'Speaking workshop';
      lessons.push({id:skill+'-'+level+'-'+length.id,skill,level,length:length.id,minutes:length.minutes[skillIndex],title:name,parts,objective,route:route[skill],instruction:instruction[skill], quiz:objective ? parts.reduce((total,p)=>total+p.questions.length,0) : null});
    }
    const additional = extras[skill][level];
    const objective = skill === 'reading' || skill === 'listening';
    const extraLength = skill === 'writing' && ['B1','B2','C1','C2'].includes(level) ? lengths[1] : lengths[0];
    lessons.push({id:skill+'-'+level+'-extra',skill,level,length:extraLength.id,minutes:extraLength.minutes[skillIndex],title:additional.title,parts:[additional],objective,route:route[skill],instruction:instruction[skill],quiz:objective?additional.questions.length:null});
  }
}

const entry = (word,pos,plain,definition,example,collocation) => ({word,pos,plain,definition,example,collocation});
export const dictionary = {
  A1:[
    entry('market','noun','A place where people buy and sell things.','A place with stalls where traders sell food or other goods.','We buy fruit at the market.','outdoor market'),
    entry('bring','verb','To take something with you to a place.','To carry or take someone or something to a particular place.','Please bring your notebook.','bring a bag'),
    entry('close','verb','To stop being open.','To stop allowing people to come in or use a place.','The market closes at one.','close early'),
    entry('quiet','adjective','Making little or no noise.','Making or containing very little sound.','I need a quiet room to study.','a quiet place'),
    entry('near','preposition','Not far from something.','At a short distance from a place, person or thing.','The library is near the park.','near the station'),
    entry('leave','verb','To go away from a place.','To depart from a place or person.','They leave at twelve.','leave early'),
    entry('scarf','noun','A long piece of cloth you wear around your neck.','A length of fabric worn around the neck, shoulders or head.','I have a green scarf.','wear a scarf'),
    entry('fountain','noun','Water that goes up into the air in a park or garden.','A structure that sends water into the air, usually for decoration.','They sit by the fountain.','a public fountain')
  ],
  A2:[
    entry('borrow','verb','To take and use something, then give it back.','To use something that belongs to someone else for a limited time.','Can I borrow a bicycle for the weekend?','borrow a book'),
    entry('stall','noun','A small table or shop where goods are sold.','A counter or stand, often in a market, from which someone sells goods.','Mia stops at the bread stall.','a food stall'),
    entry('volunteer','noun','Someone who offers to help without pay.','A person who chooses to give time or labour without being paid.','A volunteer gives visitors a map.','a local volunteer'),
    entry('available','adjective','Ready for someone to use.','Able to be used, obtained or occupied at a given time.','Two spaces are still available.','available places'),
    entry('ingredient','noun','One of the foods used to make a dish.','A substance or food that is combined with others in a recipe.','The price includes all the ingredients.','fresh ingredients'),
    entry('charge','noun','Money you have to pay for something.','An amount of money asked for a service, facility or product.','There is no charge for the lesson.','a small charge'),
    entry('repair','verb','To fix something that is broken.','To restore a damaged item to a usable or working condition.','They repair bicycles on Saturday.','repair a brake'),
    entry('containers','noun','Objects that hold things inside.','Objects used to hold, store or transport materials.','The class provides containers for the food.','food containers')
  ],
  B1:[
    entry('reliable','adjective','Something or someone you can trust.','Dependable and likely to give a consistent or accurate result.','We need a reliable source of data.','reliable evidence'),
    entry('demand','noun','How much people want something.','The amount of a product or service that people want to obtain.','Demand for tents rose in summer.','meet demand'),
    entry('seasonal','adjective','Happening during a particular part of the year.','Occurring or varying according to the season.','The library added seasonal equipment.','seasonal demand'),
    entry('equipment','noun','Things needed for a job or activity.','The tools or materials required for a particular activity.','The staff check the equipment.','camping equipment'),
    entry('portion','noun','An amount of food for one person.','A serving of food intended for one person.','A smaller portion can cut waste.','a generous portion'),
    entry('restriction','noun','A rule that limits what you can do.','A condition or rule that places a limit on an activity.','The team observed a new traffic restriction.','a temporary restriction'),
    entry('inflate','verb','To fill something with air.','To expand something by filling it with air or gas.','Inflate the tube slowly.','inflate a tyre'),
    entry('species','noun','A group of living things of the same kind.','A group of organisms with shared characteristics, commonly capable of breeding with one another.','Volunteers learnt to identify common species.','local species')
  ],
  B2:[
    entry('intervention','noun','An action taken to change what is happening.','A planned action introduced to affect a situation or outcome.','Shade was one intervention in the trial.','a targeted intervention'),
    entry('obstruct','verb','To block something or make it harder to use.','To block a passage, view or process so movement or progress is limited.','A large cover could obstruct the driver’s view.','obstruct the view'),
    entry('familiarity','noun','Knowledge of something you have seen or used before.','A degree of knowledge or recognition gained from prior experience.','Familiarity with the area affected recall.','prior familiarity'),
    entry('respondent','noun','Someone who answers questions in a study.','A person who supplies answers to a survey, interview or questionnaire.','Many respondents had tried a repair.','survey respondents'),
    entry('accurate','adjective','Correct and free of mistakes.','Correct or precise enough to represent something faithfully.','She drew an accurate map.','an accurate estimate'),
    entry('visibility','noun','How well something can be seen.','The extent to which something is visible or clear to an observer.','The covering reduced the visibility of signs.','improve visibility'),
    entry('radiant','adjective','Sent out from a warm or bright object.','Transmitted from a source in the form of radiation.','The cover reduced radiant heat.','radiant heat'),
    entry('alternative','noun','A different choice you can make.','One of two or more possible choices or courses of action.','The city offered a quieter alternative.','a practical alternative')
  ],
  C1:[
    entry('radiance','noun','Light given off by a source or surface.','The amount of light emitted or reflected in a particular direction.','The satellite registered a fall in radiance.','nighttime radiance'),
    entry('intermittent','adjective','Stopping and starting again.','Occurring at irregular intervals, with periods of interruption.','The supply was intermittent.','intermittent access'),
    entry('inference','noun','A conclusion you reach from clues.','A conclusion derived from evidence and reasoning rather than direct observation.','The obvious inference was that businesses had closed.','draw an inference'),
    entry('tentative','adjective','Not yet certain or settled.','Provisional and open to revision as stronger evidence becomes available.','The comparison remained tentative.','a tentative conclusion'),
    entry('occupancy','noun','How much of a space is being used.','The extent to which a building, room or facility is occupied.','Occupancy fell at the second centre.','occupancy rates'),
    entry('flexibility','noun','The ability to change a plan when necessary.','The capacity to adapt to changed conditions or demands.','Waiting time and flexibility both matter.','greater flexibility'),
    entry('mitigate','verb','To make a bad effect less serious.','To reduce the severity or harmful consequences of something.','Additional shade could mitigate urban heat.','mitigate an effect'),
    entry('audit','noun','A careful check of records or how something works.','A systematic examination of records, procedures or reported results.','The researchers recommended an audit of omissions.','conduct an audit')
  ],
  C2:[
    entry('threshold','noun','The level where something starts or changes.','A defined boundary at which an event occurs or a decision is triggered.','Staff acted at the capacity threshold.','a decision threshold'),
    entry('aggregate','adjective','Made by putting many results together.','Formed by combining observations or quantities into one total or summary.','Aggregate accuracy can conceal local errors.','aggregate data'),
    entry('provisional','adjective','For now and likely to change later.','Arranged for the time being and subject to subsequent confirmation or revision.','The score was a provisional guide.','a provisional estimate'),
    entry('counterfactual','noun','An idea about what might have happened if things were different.','A hypothetical outcome or state under conditions different from those observed.','The review could not assign a reliable counterfactual.','a plausible counterfactual'),
    entry('decisive','adjective','Strong enough to settle a question.','Having a determining influence on a conclusion or outcome.','They could not show that the factor was decisive everywhere.','decisive evidence'),
    entry('rebuke','noun','A strong expression of disapproval.','An emphatic expression of criticism or disapproval.','The choice was not a rebuke to statistical accuracy.','a public rebuke'),
    entry('assumption','noun','Something you treat as true without being sure.','A proposition taken as a starting point for reasoning or calculation.','The report made the staffing assumption explicit.','an underlying assumption'),
    entry('strategic','adjective','Carefully planned to achieve a goal.','Deliberately shaped to pursue a longer-term objective or advantage.','Funding scores may encourage strategic responses.','strategic decisions')
  ]
};

export const words = Object.entries(dictionary).flatMap(([level,entries])=>entries.map(item=>({...item,level})));
