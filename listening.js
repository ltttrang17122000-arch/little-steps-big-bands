const gap = (prompt, answer, why) => ({prompt, answer, why});
const choice = (prompt, options, answer, why) => ({prompt, options: options.split('|'), answer, why});
const clip = (id, title, lines, ...questions) => ({id, title, lines, questions, audio: 'audio/' + id + '.mp3'});
export const listening = {
  A1: [
    clip('a1-art','Joining an art class',[
      ['A','Hello. Is this the art room? I am here for the class.'],['B','The art room is downstairs. Your class starts at ten, so you have twenty minutes.'],['A','Do I need a pencil?'],['B','Yes. You can take one from the box by the door. Please wait by the blue bench. Mara, your teacher, will meet you there.']],
      gap('The class starts at ______. Write one word or number.', 'ten|10', 'The receptionist says the class starts at ten.'),
      choice('Where is the art room?', 'Upstairs|Downstairs|Outside', 'Downstairs', 'The room is downstairs.'),
      gap('Take a ______ from the box. Write one word.', 'pencil', 'Students can take a pencil from the box.'),
      choice('What colour is the bench?', 'Green|Yellow|Blue', 'Blue', 'Mara will meet students by the blue bench.')),
    clip('a1-picnic','A picnic on Sunday',[
      ['B','Hi, Nina. Our picnic is on Sunday at the lake. Can you bring some cheese? I already have bread and apples. Meet me at the bus stop at twelve. If it rains, we can eat in my kitchen. Call me on Saturday if you need anything.']],
      gap('The picnic is on ______. Write one word.', 'sunday', 'The speaker says it is on Sunday.'),
      choice('What should Nina bring?', 'Bread|Apples|Cheese', 'Cheese', 'The speaker already has bread and apples.'),
      gap('They will meet at the bus ______. Write one word.', 'stop', 'They will meet at the bus stop.'),
      choice('Where can they eat if it rains?', 'In the speaker’s kitchen|At a café|On the bus', 'In the speaker’s kitchen', 'The kitchen is the backup.')),
    clip('a1-bag','A bag at the station',[
      ['A','Excuse me. Did anyone find a black bag?'],['B','I have a black bag here. Is your bag small?'],['A','No, it is big. There is a green scarf inside it.'],['B','This one has a red scarf. Let me call the driver. Which bus were you on?'],['A','Bus six. I sat near the back.'],['B','Come back at two. I can ask the driver then.']],
      choice('What size is the missing bag?', 'Big|Small|Medium', 'Big', 'The passenger says it is big.'),
      gap('The missing bag contains a green ______. Write one word.', 'scarf', 'The passenger describes a green scarf.'),
      gap('The passenger used bus ______. Write one word or number.', 'six|6', 'The passenger was on bus six.'),
      choice('When should the passenger come back?', 'At one|At two|At three', 'At two', 'The clerk asks the passenger to return at two.'))
  ],
  A2: [
    clip('a2-workshop','Booking a weekend workshop',[
      ['A','Good morning, I would like to book the Saturday cooking workshop. I saw one at half past nine.'],['B','That session has sold out. There are still places at a quarter past eleven and at two.'],['A','I have a meeting at two, so please put me down for the earlier one. How much is it?'],['B','Twelve pounds, including ingredients. Please bring an apron. We provide containers, but if you come by bicycle, leave it behind the café. The racks at the main entrance are being replaced.']],
      gap('The visitor books the session at ______. Write a time.', '11:15|11.15|11 15|quarter past eleven|a quarter past eleven|eleven fifteen', 'The only available session before two is at 11:15.'),
      gap('The price is ______ pounds. Write one word or number.', 'twelve|12', 'The ingredients are included in the £12 charge.'),
      gap('Bring an ______. Write one word.', 'apron', 'The venue provides containers, but visitors bring an apron.'),
      choice('Where should cyclists leave their bicycles?', 'At the main entrance|Behind the café|Beside the museum', 'Behind the café', 'The usual racks are out of use.')),
    clip('a2-pool','A change at the swimming pool',[
      ['B','Here is a reminder for Monday swimmers. Because of a school competition, the large pool will close at six on Monday evening, two hours earlier than normal. The small pool and changing rooms will stay open. Adult lessons usually held at seven will move to the same time on Wednesday. To change your booking, please speak to the receptionist before noon on Sunday. The usual parking area is open, but enter from Lake Road. The gate on Hill Road will be locked.']],
      gap('The large pool will close at ______. Write one word or number.', 'six|6', 'It closes two hours earlier than normal, at six.'),
      gap('Adult lessons will move to ______. Write one word.', 'wednesday', 'The lesson day changes to Wednesday. The time stays the same.'),
      choice('By when should swimmers change a booking?', 'Noon on Sunday|Six on Monday|Seven on Wednesday', 'Noon on Sunday', 'The receptionist must be told before noon Sunday.'),
      gap('Drivers should enter from ______ Road. Write one word.', 'lake', 'Hill Road gate will be locked.')),
    clip('a2-volunteer','Helping at the town festival',[
      ['A','Would you like to help at the town festival? We still need people to sell tickets or show visitors where to go. The garden team is already full.'],['B','I can show visitors where to go, but only after lunch.'],['A','Perfect. Meet beside the clock tower at twenty past one. We will give you a yellow jacket and a map.'],['B','Can I bring my little brother?'],['A','Yes, but children under twelve need to stay with an adult. There will be a volunteer with you at first. Remember to wear comfortable shoes.']],
      choice('What will the volunteer do?', 'Sell tickets|Guide visitors|Work in the garden', 'Guide visitors', 'The volunteer chooses showing visitors where to go.'),
      gap('Meet beside the clock ______. Write one word.', 'tower', 'They will meet beside the clock tower.'),
      gap('The volunteer gets a yellow ______. Write one word.', 'jacket', 'The festival hands out a jacket and map.'),
      choice('What should the volunteer wear?', 'A uniform from home|Comfortable shoes|A red hat', 'Comfortable shoes', 'This is the final reminder.'))
  ],
  B1: [
    clip('b1-garden','A tour of the river garden',[
      ['B','Welcome. We are on the south side of the river garden. To your left is an unused greenhouse. We had planned to start there, but the path is muddy, so we will begin at the bee shelter instead. You can look inside through the window. The shelter is kept shut while the bees settle. From there we will pass a wooden bridge and stop at the seed exchange. If you bring seeds next week, label the envelope with the plant name and the month you collected them. Finally, the café sells honey, but the small jars are sold out today. You can order one for next Friday.']],
      choice('Where will the group start?', 'The greenhouse|The bee shelter|The seed exchange', 'The bee shelter', 'The greenhouse was the original plan. A muddy path changed it.'),
      gap('The path to the greenhouse is ______. Write one word.', 'muddy', 'Mud is the reason for changing the first stop.'),
      gap('Write the plant name and the ______ on the seed envelope. Write one word.', 'month', 'The label must say when the seeds were collected.'),
      choice('What is available now?', 'Small honey jars to take home|Ordering a small jar for next Friday|A guided visit inside the bee shelter', 'Ordering a small jar for next Friday', 'Small jars are unavailable today but can be ordered.')),
    clip('b1-library','Choosing a library project',[
      ['A','For our library study, I thought we could count how many people visit the reading room.'],['B','The library already tracks entries. They actually want to know why people leave early. We should speak to users as they leave.'],['A','Do we need to visit every day?'],['B','We can cover Tuesday and Thursday, but the library closes early on Thursdays. We should include Saturday to hear from people who work all week.'],['A','Can we use a written survey?'],['B','A short interview is better. Offer paper only if someone is in a hurry, and do not ask people to give their address.']],
      choice('What does the library want to find out?', 'Why visitors leave early|How many visitors arrive|Where visitors live', 'Why visitors leave early', 'The entry count already exists.'),
      gap('The library closes early on ______. Write one word.', 'thursday|thursdays', 'Thursday opening is shorter.'),
      choice('Why is Saturday included?', 'It is cheaper to book|Workers may be available|The study ends on Friday', 'Workers may be available', 'Saturday may reach those working during the week.'),
      gap('Do not ask visitors for their ______. Write one word.', 'address', 'The speaker excludes home addresses.')),
    clip('b1-bike','Learning to repair a bicycle',[
      ['B','Before we fix a flat tyre, put the bicycle upside down with a cloth under the seat to protect it. The pump is beside the window, but do not use it yet. First remove the inner tube and inflate it just enough to find the hole. If you cannot hear escaping air, put part of the tube into a bowl of water and look for bubbles. Mark the hole with chalk. Wait until the surface is dry before adding glue. After you put the wheel back on, test the brakes before going outside.']],
      gap('Place a ______ under the seat. Write one word.', 'cloth', 'The cloth protects the seat when the bicycle is upside down.'),
      choice('What can reveal a hard-to-find hole?', 'A bowl of water|A dry cloth|The window latch', 'A bowl of water', 'Bubbles in water show escaping air.'),
      gap('Mark the hole with ______. Write one word.', 'chalk', 'Chalk marks the location before repair.'),
      gap('Test the ______ before going outside. Write one word.', 'brakes', 'The last safety instruction concerns the brakes.'))
  ],
  B2: [
    clip('b2-heat','Evaluating a shaded bus stop',[
      ['A','Can we report that the redesigned bus stop reduced surrounding air temperature?'],['B','We found very little change in the air. The bigger difference was a drop in radiant heat. People waiting under the new cover were exposed to less radiation from the sun and pavement.'],['A','What about the passenger survey?'],['B','It shows that users noticed a difference, but we carried it out only on weekdays. We also learned that placing the cover closer to the road would obstruct the driver’s view. The council will keep it in its current position and install a temperature sensor at a second stop next month.']],
      choice('What decreased most clearly?', 'Air temperature|Radiant heat|Road traffic', 'Radiant heat', 'The speaker distinguishes radiant heat from air temperature.'),
      gap('The passenger survey was carried out only on ______. Write one word.', 'weekdays', 'No weekend survey data were collected.'),
      choice('Why will the cover stay where it is?', 'A move could block the driver’s view|The fabric is unavailable|The stop will close', 'A move could block the driver’s view', 'Visibility limits placement.'),
      gap('The council will add a temperature ______ at another stop. Write one word.', 'sensor', 'A sensor is planned at a second stop.')),
    clip('b2-maps','A navigation study',[
      ['B','Participants using turn by turn directions reached the clinic first. If journey speed were our only measure, that would settle the issue. However, in the follow-up, this group remembered fewer landmark relationships than the group which paused to choose a direction. That second group often took wrong turns, so many were less satisfied with the walk. We therefore plan to test a version which asks for a choice only at two designated crossings. We will also record whether people already know the area, since prior familiarity may affect both pace and recall.']],
      choice('What did the fastest group remember less well?', 'Relationships between landmarks|The clinic’s name|How to use the controls', 'Relationships between landmarks', 'Fast arrival came with weaker memory of relative landmark positions.'),
      gap('The next trial will ask for choices at two ______. Write one word.', 'crossings', 'The prompts will appear at two designated crossings.'),
      choice('Why did the second group report lower satisfaction?', 'They frequently went the wrong way|They could not find the phone|The task was cancelled', 'They frequently went the wrong way', 'Wrong turns reduced satisfaction.'),
      gap('Researchers will track prior ______ with the area. Write one word.', 'familiarity', 'Knowing the area may influence both pace and recall.')),
    clip('b2-archive','Making local records easier to find',[
      ['A','People asked us to scan the whole collection. Did the first tests support that?'],['B','The scans were sharp. The problem was that almost nobody could find an individual page. After adding searchable titles, volunteers were much quicker. But family names were still being missed because the handwritten lists contained alternate spellings.'],['A','Can we let visitors suggest tags?'],['B','Yes, as long as suggestions go into a review queue. For the next sample we will select records that people use frequently and a smaller batch that researchers have never requested. Otherwise we might only improve what is easy to discover already.']],
      choice('What was the difficulty after scanning?', 'Locating a particular page|Seeing the text on screen|Saving images to a disk', 'Locating a particular page', 'Image quality was adequate; findability was poor.'),
      gap('Alternate ______ caused some family names to be missed. Write one word.', 'spellings', 'Names appear in more than one spelling.'),
      gap('Visitor suggestions will enter a review ______. Write one word.', 'queue', 'The suggestions require review.'),
      choice('Why include records nobody has requested?', 'To improve access to less visible material|To remove frequently used records|To reduce storage costs', 'To improve access to less visible material', 'The team wants to avoid improving only already-discoverable items.'))
  ],
  C1: [
    clip('c1-food','Interpreting a waste survey',[
      ['B','Households reported discarding less food after we introduced weekly reminders. Initially this looked like evidence of a real reduction. The composition of waste, however, told a different story. The roadside bins contained less food, but apartment managers reported greater use of shared compost containers. Because we could not assign those contents to particular households, our estimate of total waste remained uncertain. We will still distribute the reminders, which cost very little. We have withdrawn the claim that reminders caused a specific reduction. The next study will measure disposal across several routes from the outset.']],
      choice('Why did roadside bins alone give an incomplete picture?', 'Some food moved to shared compost containers|Households left the area|Reminders increased shopping', 'Some food moved to shared compost containers', 'The waste may have changed routes.'),
      gap('The team could not link compost to individual ______. Write one word.', 'households', 'Shared compost data cannot be assigned household by household.'),
      choice('What has the team withdrawn?', 'The reminders|The numerical causal claim|The use of the bins', 'The numerical causal claim', 'Reminders will continue, but the causal estimate was dropped.'),
      gap('The next version will cover multiple disposal ______. Write one word.', 'routes', 'Several routes will be measured from the start.')),
    clip('c1-resilience','Assessing a timetable buffer',[
      ['A','Scheduled journeys will be longer if we add recovery time. Won’t passengers see that as worse?'],['B','Possibly. But the average actual journey hardly changed in the pilot. We saw fewer of the longest delays after incidents spread across the network. The benefit was concentrated before the last connection of the day.'],['A','Can we assume the same improvement on every line?'],['B','No. Our test line had trains waiting on nearby sidings. A crowded line might have fewer possibilities for reallocating vehicles. I’d report the connection data alongside the model assumptions and run a smaller test on a busier route.']],
      choice('Which improvement was most noticeable?', 'Fewer extreme delays before the last connection|Shorter scheduled times on all routes|A much lower mean actual time', 'Fewer extreme delays before the last connection', 'The mean changed little; long delays around the last connection dropped.'),
      gap('Extra trains could wait in nearby ______. Write one word.', 'sidings', 'The tested line had sidings.'),
      choice('What limits generalization?', 'A crowded line may have less room to reassign vehicles|The test used aeroplane schedules|The report lacked connection data', 'A crowded line may have less room to reassign vehicles', 'Available spare capacity may differ.'),
      gap('The report should include the model ______. Write one word.', 'assumptions', 'The assumptions should accompany connection data.')),
    clip('c1-trials','Testing reminders in clinics',[
      ['B','We compared clinics that sent appointment reminders with those that did not. Attendance was higher in the first group. The obvious interpretation was that reminders worked. But the first group also offered more evening appointments. When we compared only daytime appointments, the gap narrowed. We cannot rule out a smaller effect, particularly for appointments booked months in advance. For the follow-up, clinics will alternate reminder schedules while keeping the mix of appointment times steady. We also want to record messages that never reach a patient, since a message queued by the system may look like a message delivered.']],
      choice('Which feature may explain some of the original gap?', 'More appointment slots in the evening|Longer messages|Fewer clinics using reminders', 'More appointment slots in the evening', 'Appointment timing differed between groups.'),
      gap('For daytime bookings, the attendance gap ______. Write one word.', 'narrowed', 'The gap became smaller after restricting the comparison.'),
      choice('Which possible benefit remains open?', 'Helping people remember appointments booked far ahead|Reducing patient travel times|Bringing more clinicians into the system', 'Helping people remember appointments booked far ahead', 'The speaker does not rule that out.'),
      gap('A queued message may look as if it were ______. Write one word.', 'delivered', 'The study wants to verify messages actually reach recipients.'))
  ],
  C2: [
    clip('c2-risk','Which forecast should guide action?',[
      ['A','Management is leaning toward the model with the smallest average prediction error.'],['B','For routine demand that is a reasonable choice. The emergency model is evaluated at the point where a team has to open an overflow room. Few predictions fall that close to the decision threshold, so a summary across all days barely reflects the result we need.'],['A','Then should we lower the threshold to avoid every missed emergency?'],['B','Each false alarm calls staff away from their other duties. More sensitivity might be appropriate if we can add temporary cover. Our report should record both types of error and make the staffing assumption explicit. It would be premature to declare one model best for both jobs.']],
      choice('Why is mean error insufficient here?', 'It gives little weight to predictions near the operational threshold|It counts alarms twice|It excludes routine days completely', 'It gives little weight to predictions near the operational threshold', 'Few cases fall near the operational decision, so the mean hides that performance.'),
      gap('A false alarm draws ______ away from other duties. Write one word.', 'staff', 'Staff called to the overflow room leave their normal duties.'),
      choice('What could make higher sensitivity more acceptable?', 'Temporary cover for staff|A lower number of routine days|Hiding missed emergencies from the report', 'Temporary cover for staff', 'Cover changes the cost of false alarms.'),
      choice('What conclusion does the speaker favour?', 'Match model choice to the operational purpose|Always prefer emergency performance|Rank models purely by routine averages', 'Match model choice to the operational purpose', 'The speaker resists naming a universal winner.')),
    clip('c2-indicator','When a measure changes behaviour',[
      ['B','A funding agency counted completed visits as a measure of outreach. Teams quickly noticed that a short visit carried the same weight as a long review. At several offices, the share of repeat visits rose, although managers could not tell whether that reflected growing need or changes in scheduling. Abolishing the count would have removed a useful warning when attendance fell sharply. Instead, the agency kept it as a screening device and added a sample of case histories before making funding decisions. That compromise requires more reviewer time. It also makes the grounds for unusual awards easier to explain.']],
      gap('A short visit had the same ______ as a long review. Write one word.', 'weight', 'Both visit types carried equal weight in the funding measure.'),
      choice('What remains uncertain about repeat visits?', 'Whether scheduling or need drove the increase|Whether any offices recorded them|Whether the measure assigned them lower weight', 'Whether scheduling or need drove the increase', 'The agency cannot distinguish those explanations.'),
      gap('Reviewers now consult a sample of case ______. Write one word.', 'histories', 'Case histories provide complementary evidence.'),
      choice('Why retain the original count?', 'To flag sharp declines in attendance|To calculate the full award by itself|To eliminate reviewer time', 'To flag sharp declines in attendance', 'The count still works as a warning or screening device.')),
    clip('c2-retrofit','What a retrofit really saved',[
      ['A','Our grant paid for insulation. Why can’t we claim the estimated energy savings?'],['B','They are estimates assuming the same indoor temperatures before and after the work. Interviews suggested many households used part of the benefit to keep rooms warmer. From a comfort standpoint, that is exactly what the grant was intended to do. If we report only energy use, though, that benefit disappears from the evaluation.'],['A','Should we calculate savings against a hypothetical household that never changed its thermostat?'],['B','We can publish that calculation if we state the assumption, alongside actual consumption and reported changes in comfort. The inspection sample was small, so we should avoid assigning an exact figure to the whole city.']],
      choice('What assumption underlies estimated savings?', 'Indoor temperatures stay constant|Fuel prices stay fixed|Every household uses the same thermostat', 'Indoor temperatures stay constant', 'The model assumes unchanged indoor temperatures.'),
      gap('Some households chose to keep their rooms ______. Write one word.', 'warmer', 'Some of the technical gain was taken as increased warmth.'),
      choice('What would a consumption-only report omit?', 'A change in comfort|An estimated meter reading|The date of every installation', 'A change in comfort', 'Actual energy use alone cannot capture improved comfort.'),
      choice('Why avoid a precise city-wide estimate?', 'The inspection sample is small|No homes were insulated|Prices fell across the city', 'The inspection sample is small', 'The sample cannot support a precise total for the city.'))
  ]
};
