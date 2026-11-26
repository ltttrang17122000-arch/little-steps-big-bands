import {mockReading} from './mock-reading.js';
import {mockListening} from './mock-listening.js';

const q = (prompt,answer,why,choices) => ({prompt,answer,why,options:choices?.split('|')});
const read = (title,paragraphs,questions) => ({title,paragraphs,questions});
const hear = (id,title,lines,questions) => ({id,title,lines,questions,audio:'audio/'+id+'.mp3'});
const write = (title,type,target,prompt,model,table) => ({title,type,target,prompt,model,table});
const speak = (title,type,time,prompts,guide) => ({title,type,time,prompts,guide});

const placementReading = [
  read('A first visit to Brook House',[
    'Brook House has a workshop on Tuesday and a tour on Saturday. The workshop starts at half past ten in the morning. Reserve a work table online. Bring a small object to repair, but leave anything with a plug at home. Tools and gloves are available. People with children under twelve can visit the house, but the children cannot join the workshop.',
    'The Saturday tour lasts about an hour. It is free in July, but please take a timed ticket at the entrance so staff know how many people to expect. The old kitchen will be closed this week. A guide will show a collection of photographs in the dining room instead. The tour ends in the garden, where visitors may have their own lunch on the benches.'
  ],[
    q('When does the workshop take place?','Tuesday','The tour takes place on Saturday.','Tuesday|Friday|Saturday'),
    q('Bring an object to ______. Write one word.','repair','This is an activity for repairing a small object.'),
    q('Children under twelve can take part in the workshop.','False','Children can visit the house but not join the workshop.','True|False|Not Given'),
    q('Where are photographs displayed on the tour?','The dining room','The kitchen is closed this week.','The garden|The dining room|The kitchen'),
    q('There is a café in the garden.','Not Given','The text only says visitors can have their own lunch.','True|False|Not Given')
  ]),
  read('Can a town borrow silence?',[
    'A. A library service noticed that its quiet study rooms were fully booked most afternoons. The building could not be enlarged. Staff approached a nearby arts centre, which had a separate entrance and a rehearsal room that stood empty before six. The room was equipped with chairs but lacked suitable desks. A local college agreed to lend enough folding tables for the spring trial.',
    'B. Originally, the partnership counted every reservation as a successful use of the room. It soon discovered that several people booked a place only in case the library got busy. They rarely cancelled unused bookings. The library added a check-in window and offered empty seats a few minutes later to those waiting at the door. Attendance rose even though the maximum number of reservations remained the same.',
    'C. There was one unexpected concern. The extra room solved the problem for students who wanted a short visit, but some required longer, uninterrupted periods. They could not rely on a seat in a room which had to be cleared well before rehearsal started. The partnership decided to reserve some of the original rooms for long stays. Its report recommends evaluating whether people can finish the work they came to do, alongside counting visits.'
  ],[
    q('Which item did the college lend?','Folding tables','Chairs were already in the room.','Folding tables|Chairs|Bookshelves'),
    q('Which paragraph describes the difference between bookings and attendance?','B','B describes reservations that were often unused.','A|B|C'),
    q('The new check-in system raised the maximum number of reservations.','False','The maximum remained the same.','True|False|Not Given'),
    q('The arts centre needed the room for ______ later in the day. Write one word.','rehearsal|rehearsals','The study room had to be cleared for rehearsal.'),
    q('What additional outcome does the report recommend measuring?','Whether users finished their intended work','Completion is the final recommended measure.','How many staff worked at the door|Whether users finished their intended work|How many tables the college bought')
  ])
];
export const assessmentAudio = [
  hear('placement-l1','An appointment and a delivery',[
    ['A','You’ve reached the furniture shop. How can I help?'],
    ['B','My chair is ordered for Friday, but I now have an appointment until eleven.'],
    ['A','We have a truck in your area at ten, but I can change your delivery to Wednesday at two.'],
    ['B','Wednesday is fine. Can the driver come to the door on Silver Lane?'],
    ['A','Yes. Please leave a note on the gate, and make sure an adult is there. If a driver cannot find the house, we will phone the number you gave when you ordered.'],
    ['B','Will I pay anything extra?'],
    ['A','The delivery is included. Assembly normally costs eight pounds. I can add assembly without a charge today, because we had to change the first available slot.']
  ],[
    q('New delivery day: ______. Write one word.','wednesday','Friday was the original day and Wednesday is confirmed.'),
    q('New delivery time: ______. Write one word or number.','two|2','The new slot is at two on Wednesday.'),
    q('Which lane should the driver use?','Silver Lane','The customer asks for Silver Lane.','Silver Lane|Church Lane|Market Lane'),
    q('Leave a note on the ______. Write one word.','gate','The assistant tells the customer to leave a note on the gate.'),
    q('Which additional service is free this time?','Assembly','Assembly normally costs money but is included here.','Carrying away the old chair|Assembly|Choosing a colour')
  ]),
  hear('placement-l2','Presenting a student survey',[
    ['B','The first draft of the report gave an average of twelve minutes for the walk from the bus stop to class. A reader asked whether the measurement included the new entrance. It didn’t. The survey took place before the side gate reopened. We considered combining that earlier result with estimates from a map. That would have hidden a further difference: people who knew the gate used a shortcut, while newcomers still took the main road. Next time we will walk each route with students who have different lengths of experience on campus. We will publish a range of times instead of presenting a single precise figure.']
  ],[
    q('The original average was ______ minutes. Write one word or number.','twelve|12','The opening gives the first average.'),
    q('Why did the new entrance not appear in the first survey?','The side gate was still closed','It reopened after the survey.','The side gate was still closed|The report used only maps|The survey took place at night'),
    q('Which people already used a shortcut?','People familiar with the gate','Newcomers generally kept to the main road.','All first-year students|People familiar with the gate|Students who had missed classes'),
    q('The team plans to publish a ______ of times. Write one word.','range','They plan a range rather than one time.'),
    q('What will the team do in the next study?','Walk the routes with students of different experience levels','They will include both familiar and less familiar users.','Use maps alone|Walk the routes with students of different experience levels|Ask all students to use the same path')
  ]),
  hear('weekly-l1','Organising a coastal cleanup',[
    ['A','The forecast is dry, so we can meet at the harbour as planned. Do we still need everyone there at nine?'],
    ['B','The ranger has asked us to begin half an hour later. There is also some confusion over the meeting point. Stand by the flagpole beside the kiosk. From there we will allocate two teams to the beach and one to the footpath.'],
    ['A','Is the footpath easier? I have a volunteer with a broken toe.'],
    ['B','There are some steps. I think we should ask him to help weigh bags by the kiosk, which means there’s no need for him to walk much.'],
    ['A','We’re weighing all the waste, then?'],
    ['B','Only litter from the beach. We used a different method for the footpath last year, and we cannot compare weights reliably until we have repeated measurements from this year. All areas will use separate bags for glass. If you find batteries, call the ranger.'],
    ['A','Are we offering refreshments?'],
    ['B','Yes. The café will make hot drinks. Bring a cup to avoid adding to the waste.']
  ],[
    q('New meeting time: ______. Write a time.','9:30|9.30|half past nine|nine thirty','The meeting moves 30 minutes later than nine.'),
    q('Meet at the ______ by the kiosk. Write one word.','flagpole','The kiosk itself is a landmark beside the flagpole.'),
    q('How can the volunteer with an injured foot help?','Weigh bags near the kiosk','This lets him stay near the meeting point.','Weigh bags near the kiosk|Clear the furthest footpath|Drive the ranger to the beach'),
    q('Why is footpath litter excluded from the weighing comparison?','Last year’s method differed','A consistent series does not yet exist.','Nobody will pick it up|It cannot be weighed at all|Last year’s method differed'),
    q('Call the ranger if you find ______. Write one word.','batteries','Glass uses separate bags. Batteries require the ranger.'),
    q('Bring a ______ for refreshments. Write one word.','cup','Participants bring their own cup.')
  ])
];
const weeklyReading = [
  read('Repairing a coastal path',[
    'A. Two parts of the Henton coastal path were closed after winter storms. Residents expected the council to reopen the shorter section first, because a repair would appear simpler. The shorter section, however, provided the only route for vehicles carrying materials to the longer one. As a result, temporary access had to remain in place until the main works finished.',
    'B. At a consultation, the council was asked to move the path further inland. An engineer saw an advantage in the proposal: the new route could avoid steep steps. A surveyor cautioned that the alternative crossed land with several private owners. Asking all of them for a permanent agreement could delay repairs. The council adopted a short-term access agreement for part of the inland strip and retained part of the original route.',
    'C. The repair has introduced a new board which shows visitors the distance still to walk and the next exit point. Its earliest design used red and green lines to distinguish the two routes. A user test found that a few readers had difficulty telling them apart, so the designer added a different symbol along each line. A survey will compare the number of visitors who turn back early with figures collected last summer, but the council accepts that visitor numbers alone cannot tell whether the signs are clear.'
  ],[
    q('Why was the short section not reopened first?','It provided vehicle access for the other repairs','Construction traffic still depended on it.','It provided vehicle access for the other repairs|It had no connection to the longer part|It was closed on the request of private owners'),
    q('Which paragraph describes a change after a user test?','C','The test led to adding different symbols.','A|B|C'),
    q('The proposed inland route could avoid steep ______. Write one word.','steps','B identifies this potential accessibility gain.'),
    q('The council moved the entire path onto permanently leased land.','False','Only part of the path was moved, under a temporary agreement.','True|False|Not Given'),
    q('The revised board uses different ______ so the lines can be told apart. Write one word.','symbols','The design added symbols in addition to colours.'),
    q('What was the sample size for the user test?','It is not stated','The text says a few readers had difficulty but gives no sample size.','Five visitors|Fifty visitors|It is not stated')
  ])
];
const mockWriting = [
  write('How visitors reached an island','Academic Task 1',150,'The table gives the number of visitors arriving by three modes of transport in two months, before and after the opening of a new pier. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.','Total arrivals rose in both months after the pier opened. Scheduled ferry services accounted for the largest numeric increase in each month. The increase was particularly marked in August, from 48,000 to 66,000 ferry passengers. Do not attribute every change to the pier, because the table gives no evidence about other influences.',[['Month','Ferry before','Ferry after','Private boat before','Private boat after','Plane before','Plane after'],['May','24,000','34,000','9,000','10,000','12,000','11,000'],['August','48,000','66,000','15,000','17,000','20,000','14,000']]),
  write('Public investment for occasional users','Discussion and opinion',250,'Some people think public facilities should be designed around what their most frequent users need. Others believe they should give special consideration to people who are currently using them very little. Discuss both views and give your opinion.','Frequent users can tell managers which features work because they experience the service repeatedly. However, low use can indicate a barrier, for example when irregular working hours make a booking system difficult to use. A proportionate evaluation should compare evidence from both groups and reserve changes for barriers that have significant effects.')
];
const mockSpeaking = [
  speak('Local journeys and routines','IELTS Part 1',270,['What journeys do you make most often?','Do you enjoy walking in the area where you live?','Has the way you travel locally changed?','Do you prefer to plan journeys in advance?','What makes a place easy to visit?'],'Check whether you give a natural answer plus a relevant detail.'),
  speak('A service that saved you time','IELTS Part 2',120,['Describe a public or private service that saved you time.','Say what the service was, when you used it and what you had to do.','Explain why it saved time and how the experience might differ for somebody else.','Follow-up: Would you use the service again?'],'Use one minute to plan. Keep the spoken response to two minutes.'),
  speak('Convenience and access to services','IELTS Part 3 discussion',300,['How should a city decide whether a public service is convenient?','Could an online service make access more difficult?','Should services designed for a majority be changed for smaller groups?','How might demand for face-to-face services change?'],'Compare groups and develop both the primary claim and one plausible objection.')
];
const placementWriting = [
  write('A better opening time','Opinion',120,'Your neighbourhood library is considering closing earlier and opening for more hours on Saturdays. Give your opinion, with two reasons and one example.','A later opening on weekdays matters to those who can only study after work. Saturday hours would help families, but a weekday option would avoid forcing every visitor into the same weekend period.')
];
const placementSpeaking = [
  speak('Your most useful study habit','Personal interview',90,['Where and when do you normally study?','Describe something you do when you do not understand a new word.','Which part of your study routine would you change? Why?'],'Listen for clear tense, useful detail and understandable pronunciation.'),
  speak('Learning with other people','Discussion',120,['When is a study partner helpful?','When might working alone be more effective?','Give an example from a real or imagined study session.'],'Check whether you compared the situations using a clear reason.')
];

const section = (id,title,skill,level,minutes,parts) => {
  const objective = skill==='reading' || skill==='listening';
  return {id,title,skill,level,minutes,parts,assessment:true,objective,quiz:objective?parts.reduce((n,p)=>n+p.questions.length,0):null};
};
export const assessments = [
  section('placement-reading','Placement · Reading','reading','A2–B2',18,placementReading),
  section('placement-listening','Placement · Listening','listening','A2–B2',14,assessmentAudio.slice(0,2)),
  section('placement-writing','Placement · Writing','writing','A2–B2',13,placementWriting),
  section('placement-speaking','Placement · Speaking','speaking','A2–B2',8,placementSpeaking),
  section('weekly-reading','Weekly check · Reading','reading','B1–B2',15,weeklyReading),
  section('weekly-listening','Weekly check · Listening','listening','B1–B2',10,assessmentAudio.slice(2)),
  section('mock-listening','Academic mock · Listening','listening','B2–C2',30,mockListening),
  section('mock-reading','Academic mock · Reading','reading','B2–C2',60,mockReading),
  section('mock-writing','Academic mock · Writing','writing','B2–C2',60,mockWriting),
  section('mock-speaking','Academic mock · Speaking','speaking','B2–C2',14,mockSpeaking)
];
export const assessmentGroups = [
  {id:'placement',title:'Placement check',description:'Sample all four skills and get a recommendation for your starting practice level.',ids:['placement-reading','placement-listening','placement-writing','placement-speaking']},
  {id:'weekly',title:'Weekly mini assessment',description:'Use a short Reading and Listening check to see which question types need review.',ids:['weekly-reading','weekly-listening']},
  {id:'mock',title:'Academic practice mock',description:'Rehearse all four skills with an original test. You can also take Reading or Writing separately as a 60-minute skill check.',ids:['mock-listening','mock-reading','mock-writing','mock-speaking']}
];
