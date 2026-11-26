const blank = (prompt,answer,why) => ({prompt,answer,why});
const select = (prompt,choices,answer,why) => ({prompt,options:choices.split('|'),answer,why});
const part = (id,title,lines,questions) => ({id,title,lines,questions,audio:'audio/'+id+'.mp3'});
export const mockListening = [
  part('mock-l1','Joining the riverside rowing club',[
    ['A','Hello, I’m calling about the beginners’ rowing sessions. The website listed a Tuesday evening group. Is that still available?'],
    ['B','The Tuesday and Thursday groups are full. I can offer the Monday group from next month. Its first meeting is on the eighth at six fifteen. We used to start at half past six, but the coach wants time to fit everyone with the equipment before going out.'],
    ['A','Monday works. What information do you need?'],
    ['B','Your surname, please, and an email address.'],
    ['A','My family name is Mercer. That’s M, E, R, C, E, R.'],
    ['B','Thank you. Members pay fifty-two pounds for the introductory course. I see you already belong to the leisure centre, but that does not count as a club membership. Your course costs sixty-four pounds. The old price was sixty, which may be what you saw in the newsletter.'],
    ['A','Fine. Do I need to buy a life jacket?'],
    ['B','We lend jackets. Bring a towel and clothes that can get wet. The most important thing to wear is trainers, since you’ll be carrying part of a boat down the ramp. The lock code changes regularly, but you won’t need it.'],
    ['A','Where do we wait when we arrive?'],
    ['B','Meet at the smaller gate beside the warehouse. The gate at the car park is normally shut in the evening. A coach will collect the group at six ten.'],
    ['A','Right. Is parking included?'],
    ['B','The members’ lot is only for coaches. There’s public parking on Ash Street. It’s two minutes from the gate. If you get the bus, get off at the library.'],
    ['A','Will the first night just be a talk?'],
    ['B','It includes a safety check by the ramp. You will then practise balancing on the training boat, provided the river level is low enough. We will practise turning the boat in the second week.'],
    ['A','How do I let you know if I can’t come?'],
    ['B','For bookings, please use the online form. For a last-minute absence call the number on your receipt. The email inbox is checked only in the mornings. We don’t offer a refund for a class you miss, but you can ask about a different group if there’s space.']
  ],[
    blank('First meeting day: ______. Write one word.','monday','Tuesday and Thursday were full. The offered group meets Monday.'),
    blank('New starting time: ______. Write a time.','6:15|6.15|six fifteen|quarter past six|a quarter past six','6:30 is the previous time.'),
    blank('Surname: ______. Write one word.','mercer','The caller spells M-E-R-C-E-R.'),
    blank('Course fee for the caller: £______. Write a number.','64|sixty-four|sixty four','£52 is the members’ price and £60 was the old price.'),
    blank('Members are advised to wear ______ on their feet. Write one word.','trainers','The receptionist mentions trainers for carrying the boat.'),
    blank('The meeting gate is next to the ______. Write one word.','warehouse','The group meets at the small gate beside the warehouse.'),
    blank('Public cars can be parked on ______ Street. Write one word.','ash','Ash Street has public parking.'),
    blank('The nearest suggested bus stop is at the ______. Write one word.','library','Bus users get off at the library.'),
    blank('On the first night, the group practises ______ on the training boat. Write one word.','balancing','Turning is planned for the following week.'),
    select('What should the caller do if they have to miss a class at short notice?','Phone the number on the receipt|Send an email the same morning|Fill in the new booking form','Phone the number on the receipt','The online form is for bookings. Short-notice absence is reported by phone.')
  ]),
  part('mock-l2','Visiting the old pump house',[
    ['B','Welcome to the old pump house. I’m going to tell you where things are and what we can see this morning. You are facing the main hall. Notice the large boiler door directly ahead. It looks like the entrance to the working engine, but the one you will actually use is a smaller door on your right, beside the bench. The large boiler door is kept closed.'],
    ['B','To your left, a passage leads to the garden. Before you reach the garden door, the first alcove contains the original tools. The second alcove has the temporary textile show. We had to use that space because the upstairs gallery is being painted. Please leave large bags at reception rather than carrying them through that narrow passage.'],
    ['B','Past the entrance desk on your right is a glass case containing the river maps. They show how pipes followed the river before they were routed through the town. If you want the audio description for the maps, scan the code on the wall above the case. Printed labels do not include the earlier route.'],
    ['B','We will show the engine turning at eleven forty. A trial had been advertised for eleven fifteen. That has been cancelled, because the engineer is attending a school session. The demonstration will last around eight minutes. The best place for photographs is the marked line in front of the rail. Please do not reach over it.'],
    ['B','After the demonstration, the guide from the archives will talk about the men and women who recorded water levels. We originally planned to show a film, but you will instead handle copies of the logbooks. The oldest surviving book is too fragile to display. The garden is open for the entire visit. There is a small café on the terrace, but the drinking water point is by reception.'],
    ['B','Those of you taking the afternoon workshop should meet in the courtyard. As you go out, keep the drain on your left and look for the white sign. In the workshop you will test how wide pipes affect flow. You will leave with instructions for repeating the experiment. You will not be taking home a kit, because each group will share the same materials.']
  ],[
    select('Which door leads to the working engine?','The small door beside a bench|The main boiler door|The garden door','The small door beside a bench','The large door is kept closed.'),
    blank('The first alcove displays original ______. Write one word.','tools','The first alcove contains tools.'),
    blank('Painting has closed the upstairs ______. Write one word.','gallery','The textile show moved during gallery painting.'),
    blank('Large bags should be left at ______. Write one word.','reception','Bags are not wanted in the narrow passage.'),
    select('How can visitors hear about the earlier pipe route?','Scan the code above the map case|Read the printed map label|Ask at the garden door','Scan the code above the map case','The labels omit the earlier route. Audio is available through the code.'),
    blank('The engine demonstration starts at ______. Write a time.','11:40|11.40|eleven forty|twenty to twelve','The originally advertised 11:15 session was cancelled.'),
    select('What replaces the film?','Handling reproductions of written records|Watching a recent school video|Looking at the original oldest book','Handling reproductions of written records','The activity uses copies of the logbooks.'),
    blank('The drinking water point is by ______. Write one word.','reception','The café is elsewhere on the terrace.'),
    blank('Meet in the ______ for the afternoon workshop. Write one word.','courtyard','The white sign identifies the courtyard.'),
    select('What will workshop participants take home?','Instructions|An experiment kit|A set of pipes','Instructions','Materials are shared, and the instructions go home.')
  ]),
  part('mock-l3','Planning a campus transport report',[
    ['A','Where have you got to with the campus transport assignment? I drafted a survey asking students which bus routes they use.'],
    ['B','Our tutor already has that information from ticket counts. I’d rather ask about occasions when students planned to use the bus, but changed their mind. That would show problems the ticket records can’t see.'],
    ['A','Right. It could be hard to measure an event that didn’t happen. What if we use travel diaries? They might tell us the minute students decided to change plans.'],
    ['B','That’s reasonable, but I doubt we can get everyone to fill one in on weekdays and at weekends. The tutor suggested brief interviews on two mornings. We can ask about a specific trip the day before.'],
    ['A','Let’s start at the library entrance. That’s where most students walk past.'],
    ['B','The library favours students with daytime lectures. We need people who use the sports centre at night. We can use the covered area beside the sports centre for one set, and the canteen for the other. The transport office offered a desk, but anyone walking in there is likely to have a problem already.'],
    ['A','Could we give everyone a list of reasons? Price, journey length, weather, reliability?'],
    ['B','A list might narrow what they tell us. Ask what changed the plan first. If they mention something general like convenience, ask for an example. We can code the answers afterward.'],
    ['A','I’ll prepare a colour chart for the report. Could it compare percentages across the two places?'],
    ['B','Only if we can show the number of interviews as well. Twenty out of forty is quite different evidence from two out of four. The tutor wants the total shown directly on the chart, not hidden in a footnote.'],
    ['A','I’m doing the first round of interviews. Should I try to write down everything?'],
    ['B','Let’s record each one only if they agree. If they say no, take notes instead. Assign numbers rather than collecting names. Finally, say clearly that the results are about trips participants remember. We can’t assume the answers describe every journey.'],
    ['A','Can you do the pilot this Friday?'],
    ['B','Yes. I’ll try just three interviews with different students, then rewrite any question that causes confusion. The main collections can begin next week.']
  ],[
    select('What gap do the students aim to investigate?','Trips students intended to make but changed|Routes already measured by ticket sales|How often drivers need a break','Trips students intended to make but changed','The report is about changes of mind, unseen in the ticket counts.'),
    select('Why do they decide against travel diaries as the main method?','Students may not complete them consistently|Diaries cannot contain times|The tutor has lost the diaries','Students may not complete them consistently','The second student doubts people will fill them in across the week.'),
    blank('They will interview some people near the sports ______. Write one word.','centre|center','The covered area by the sports centre reaches an additional group.'),
    select('Why do they reject the transport office?','Visitors may already have a problem|The office needs a new desk|The office is always locked','Visitors may already have a problem','Office users could bias the sample.'),
    select('How will the first question be presented?','As an open question|As a list of reasons|As a diagram to label','As an open question','They ask what changed the plan before suggesting categories.'),
    blank('If an answer is general, ask for an ______. Write one word.','example','The students want something concrete.'),
    blank('Show the total number of interviews on the ______. Write one word.','chart','The tutor does not want this figure hidden in a footnote.'),
    blank('Assign participants ______ instead of recording their names. Write one word.','numbers','They will identify the interview records numerically.'),
    select('Which limitation will they report?','The study uses journeys people remember|The survey was written by the tutor|Drivers were paid to respond','The study uses journeys people remember','Recall limits how far the results can generalize.'),
    blank('For the pilot, the student will conduct ______ interviews. Write one word or number.','three|3','The study will start with three trial interviews.')
  ]),
  part('mock-l4','The hidden trade-offs in measuring floods',[
    ['B','Today I want to explain why the choice of where to install a gauge can change a town’s understanding of its flood problem. The first generation of modern gauges were often set up next to bridges. This made maintenance easy and provided a fixed structure for recording depth. But a bridge may concentrate water in a narrow channel. The level there need not reflect conditions where people have built houses.'],
    ['B','Some teams have responded by attaching small monitors to buildings at street level. The obvious benefit is that water reaches different streets at different times. A disadvantage is that the monitors can be covered with leaves. We distinguish a covered monitor by comparing its readings with a nearby unit, rather than deleting an unusual observation automatically.'],
    ['B','A second source of evidence is the report a resident makes using a web form. Early reports clustered around businesses, partly because shopkeepers had the strongest reason to record damage early. Places where residents had less reliable internet access appeared to have less flooding. The council therefore added a telephone service. That raised the number of observations, though reports could still differ depending on how residents interpreted the word damage.'],
    ['B','The third step was to check how, rather than how much, water came into the street. Engineers had assumed that the river would be the main route. In one neighbourhood, blocked drains did more to explain damaging floods. This finding changed the recommended local response from higher barriers to more frequent inspection. Another neighbourhood still needed barriers because it lay directly beside a bend in the river.'],
    ['B','Better evidence also exposed a difference between a map intended for planning and one intended for people deciding where to walk. A planning office may be interested in the maximum height of water over many years. For a resident crossing a road, the speed of the water might be more relevant than maximum depth. Recognising this distinction has led our team to publish maps for separate uses.'],
    ['B','Finally, we have changed what we mean by a successful project. Earlier reviews counted how many monitors had been installed. Having more monitors is good only if the data remain useful. We now track the proportion still functioning after two years and whether local staff can recover the readings without asking the contractor. These measures take longer to collect but offer a better record of continued capacity.']
  ],[
    blank('Many early gauges were placed beside ______. Write one word.','bridges','Bridges provided a fixed mounting point and easy maintenance.'),
    blank('At a bridge, water can be concentrated in a narrow ______. Write one word.','channel','Channel shape affects representativeness.'),
    blank('Street-level monitors can be covered by ______. Write one word.','leaves','Leaves can interfere with a reading.'),
    blank('Early online reports often came from people running ______. Write one word.','businesses','The first reports clustered around shops.'),
    blank('The council added reporting by ______. Write one word.','telephone|phone','This reduced reliance on internet access.'),
    blank('In one district the main local problem was blocked ______. Write one word.','drains','Blocked drains explained much of the local flooding.'),
    blank('Engineers suggested more frequent ______ in that district. Write one word.','inspection','Inspect drains instead of relying on a higher barrier there.'),
    blank('To someone crossing a road, the ______ of water may matter more than its depth. Write one word.','speed','Moving water changes the hazard a person experiences.'),
    blank('The project measures how many monitors still function after ______ years. Write one word or number.','two|2','The current follow-up is two years from installation.'),
    select('What other measure is now used?','Whether local staff can recover readings independently|How many reports the contractor can print|Whether residents buy their own monitors','Whether local staff can recover readings independently','The measure assesses capacity without continuing contractor help.')
  ])
];
