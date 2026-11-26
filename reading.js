const tf = ['True', 'False', 'Not Given'];
const pick = (prompt, options, answer, why) => ({prompt, options: options.split('|'), answer, why});
const fill = (prompt, answer, why) => ({prompt, answer, why});
const fact = (prompt, answer, why) => ({prompt, options: tf, answer, why});
const part = (title, body, ...questions) => ({title, paragraphs: body.split('\n'), questions});

export const reading = {
  A1: [
    part('Mia’s Saturday market',
      `Mia goes to the market with her dad on Saturday. They go by bus. They take two blue bags because they need fruit and bread. Mia wants apples, but her dad buys six pears. The man at the bread stall gives Mia a small roll to try.
At eleven, they sit by the fountain. Dad drinks coffee and Mia drinks water. The market closes at one. They leave at twelve and eat lunch at home.`,
      pick('How do Mia and Dad get to the market?', 'By car|By bus|On foot', 'By bus', 'The second sentence says they go by bus.'),
      fill('Dad buys six ______. Write one word.', 'pears', 'Mia wants apples, but her dad buys pears.'),
      pick('What does Mia try at the market?', 'A roll|A pear|Coffee', 'A roll', 'The man at the bread stall gives her a roll.'),
      fact('Mia drinks coffee.', 'False', 'Mia drinks water. Dad drinks coffee.'),
      fill('They leave the market at ______. Write one word.', 'twelve|12', 'They go home at twelve, an hour before the market closes.')
    ),
    part('A new class at the library',
      `The library has a free drawing class on Tuesday afternoons. It is for children and adults. The class starts at three in Room Two. Lisa is the teacher. She brings paper and coloured pencils, so students only need to bring a bag.
The first lesson is about trees. In the second lesson, everyone draws a pet. To join, write your name in the book next to the front door before Monday evening. The room has space for twelve people.`,
      pick('What will people draw in the second lesson?', 'A tree|A bag|A pet', 'A pet', 'The first drawing is a tree. The second is a pet.'),
      fill('The class is in Room ______. Write one word or number.', 'two|2', 'The class starts at three in Room Two.'),
      fact('Adults can join the class.', 'True', 'The notice says the class is for children and adults.'),
      fact('The class ends at four.', 'Not Given', 'The notice gives the start time only.'),
      pick('What do students need to bring?', 'A bag|Paper|Coloured pencils', 'A bag', 'Lisa brings everything except a bag.')
    ),
    part('Sam’s plant',
      `Sam gets a small plant from his aunt. At first he puts it on the table near his bed. The room is dark, and after three days the leaves look yellow. His aunt tells him to move the plant to a bright place.
Sam puts it by the kitchen window. He gives it a little water every Wednesday. After two weeks, he sees two new green leaves. He takes a photo and sends it to his aunt. She asks him to bring the plant to her house next Sunday.`,
      pick('Where does Sam put his plant first?', 'By the kitchen window|On a table|Outside his home', 'On a table', 'He first puts it on a table near his bed.'),
      fill('Sam waters the plant every ______. Write one word.', 'wednesday', 'The second paragraph names Wednesday.'),
      fact('New leaves are green.', 'True', 'Sam sees two new green leaves.'),
      fact('Sam’s aunt gave him the plant on his birthday.', 'Not Given', 'The story does not give the reason for the gift.'),
      pick('Why does Sam move the plant?', 'It needs more light|The table is broken|He buys another plant', 'It needs more light', 'His aunt tells him to look for a bright place.')
    )
  ],
  A2: [
    part('The bicycle library',
      `A small town has opened a bicycle library beside its train station. Members can borrow a bicycle for up to three days. The first loan is free, but after that adults pay a small amount each time. Anyone under sixteen needs to come with an adult when they sign up.
The first twelve bicycles came from local people who no longer used them. Volunteers check brakes and lights before every loan. They also run a repair session on the last Saturday of the month. Visitors can bring their own bicycles to that session, even if they are not members.
During the first week, more people asked for baskets than the library expected. The town has ordered six new ones, but they will only arrive next month. Meanwhile, the volunteers suggest bringing a backpack.`,
      fill('The longest loan lasts ______ days. Use one word or number.', 'three|3', 'Members can keep a bicycle for up to three days.'),
      fact('You must be a member to attend a repair session.', 'False', 'The repair session is open to non-members.'),
      pick('Why did the town order baskets?', 'Some baskets broke|People wanted more of them|Volunteers no longer lend bags', 'People wanted more of them', 'More people asked for baskets than the library expected.'),
      fill('Volunteers check brakes and ______. Use one word.', 'lights', 'The article names brakes and lights.'),
      fact('The town bought the first twelve bicycles.', 'False', 'They came from local people who no longer used them.')
    ),
    part('A quieter museum visit',
      `On the first Sunday of each month, the Hill Museum starts the day with a quiet hour. Staff switch off music in the entrance and put fewer visitors in each time slot. Visitors may take a break in a side room with soft chairs and simple picture signs.
At first, the museum introduced the hour for families who found the usual visit too noisy. Staff soon noticed that other people booked it as well. A regular visitor said he liked having enough time to read the labels without crowds behind him.
The shop opens as usual, but the café does not serve food until the hour ends. Visitors can bring a bottle of water. Anyone who books online should arrive within fifteen minutes of the time on their ticket.`,
      fill('The museum turns off ______ in the entrance. Write one word.', 'music', 'Staff switch off entrance music.'),
      pick('Why does one regular visitor like the quiet hour?', 'He can read the labels more easily|The tickets are cheaper|The café has a special menu', 'He can read the labels more easily', 'He can read without crowds behind him.'),
      fact('The museum shop is closed during the quiet hour.', 'False', 'The shop opens as usual.'),
      pick('When does the quiet hour happen?', 'Every Sunday afternoon|On the first Sunday each month|On the last Saturday each month', 'On the first Sunday each month', 'The first sentence gives the day.'),
      fact('The side room has a television.', 'Not Given', 'Only soft chairs and signs are mentioned.')
    ),
    part('Food from the garden',
      `A community garden in West Park grows beans, salad and herbs. Each family can use one small piece of land. A larger area is shared, and people take turns watering it. Everyone can take a small bag of herbs from the shared area on Saturday morning.
In spring, the committee offers a one-hour lesson for new gardeners. They show people how to plant seeds and how to keep young plants safe from birds. Last year, there was a charge for the lesson. This year, a local shop is paying for it so that people can attend for free.
The garden sells some of its salad to a nearby café. The money helps buy tools, but the gardeners still welcome gifts of clean gloves and small pots.`,
      pick('What can everyone take on Saturday morning?', 'Seeds|Gloves|Herbs', 'Herbs', 'The shared area gives each visitor a small bag of herbs.'),
      fill('A local ______ pays for the lesson this year. Use one word.', 'shop', 'A local shop covers the cost.'),
      fact('Gardeners must pay for the spring lesson this year.', 'False', 'It was paid for last year. This year it is free.'),
      fact('The café uses the salad in sandwiches.', 'Not Given', 'The article does not describe the café’s menu.'),
      fill('Money from salad sales helps buy ______. Use one word.', 'tools', 'The sales help pay for tools.')
    )
  ],
  B1: [
    part('Why some libraries lend tools',
      `A. When a local association asked residents which objects they used only a few times a year, drills and ladders appeared repeatedly. It was not that these tools were particularly expensive. The bigger problem was finding somewhere to keep them in small flats. The association responded by creating a library of things.
B. The project had an unexpected start. Staff assumed that users would mainly borrow equipment for home repairs. In the first summer, however, folding chairs and camping tents were the most popular items. Staff began adding seasonal items rather than buying more of everything.
C. Borrowing can reduce demand for new products, but the project’s organizers are cautious about promising environmental savings. People may drive a long way for an item, or borrow objects that they would never have bought in the first place. To learn more, the library now asks users what they would have done if borrowing had not been possible.
D. The organizers are also trying to make the service easier to use. Their latest experiment is a Saturday pickup point at the market. Items still have to be booked online in advance, but people can collect them while doing their usual shopping.`,
      pick('Which paragraph explains how members collect items on Saturdays?', 'A|B|C|D', 'D', 'D describes the market pickup point and online booking.'),
      pick('What motivated residents to ask for access to drills and ladders?', 'Difficulty storing them|Their high price|Lack of repair knowledge', 'Difficulty storing them', 'A says space in small flats was the larger issue.'),
      fill('In the first summer, folding chairs and camping ______ were most popular. Write one word.', 'tents', 'B names chairs and tents.'),
      fact('Environmental gains depend in part on what users would otherwise do.', 'True', 'C asks about alternatives to borrowing and gives travel as a possible cost.'),
      fact('The market pickup point charges a separate fee.', 'Not Given', 'The collection details do not mention a fee.'),
      pick('Which heading best fits paragraph B?', 'Demand changes with the season|A system for evaluating savings|Why tools break', 'Demand changes with the season', 'Actual summer demand led to stocking more seasonal items.')
    ),
    part('Listening to city birds',
      `During a short project in Northbridge, volunteers recorded birdsong in three parks before and after the morning traffic increased. They used identical recorders and placed them at the same height. The project did not aim to count every bird. Instead, the team wanted to know whether a cheap recording method could show patterns worth investigating.
On busy roads, it was harder to hear some birds after seven. This did not necessarily mean the birds had stopped singing. Lower notes could have been covered by the sound of engines. In one park behind a wall, the difference between early and late recordings was much smaller.
The scientists chose not to compare the parks directly because the trees and paths differed. Next year, they plan to study two similar parks on opposite sides of a new traffic restriction. They also want residents to report when they notice birds singing, though these reports will be used alongside the recordings rather than replacing them.
The volunteers can already see one benefit. The recordings help them recognize common species by sound, even on mornings when the birds remain out of sight.`,
      pick('What was the main purpose of the project?', 'To test an inexpensive way of finding patterns|To count every bird in the city|To choose the best park for birds', 'To test an inexpensive way of finding patterns', 'The first paragraph states the aim was to try a low-cost method.'),
      fact('The team used different models of recorder in different parks.', 'False', 'The recorders were identical.'),
      fill('One park was partly protected from road noise by a ______. Write one word.', 'wall', 'The second paragraph describes a park behind a wall.'),
      fact('The next study will replace recordings with residents’ reports.', 'False', 'Reports will be used together with recordings.'),
      pick('Why were the three parks not compared directly?', 'Their physical layout and trees differed|Some recordings were deleted|Volunteers worked on different days', 'Their physical layout and trees differed', 'The scientists cite differences in the paths and trees.'),
      fact('Every volunteer could recognize birdsong before the project.', 'Not Given', 'The text says they learned from recordings, without stating their initial abilities.')
    ),
    part('How a school cut plate waste',
      `At Greenwood School, staff used to plan lunch portions from the number of pupils in each year group. A small study showed that this approach missed an important difference. Among pupils of the same age, some wanted smaller portions on days when they had early lunch breaks, while others wanted more food after sport.
The cook tried offering two sizes of the same main dish. Pupils could ask for a second helping after finishing their first serving. Over four weeks, food left on plates fell by about a fifth. The amount left in kitchen trays barely changed, since the cooks still prepared the same amount.
One popular change was moving the vegetable counter so children could see the choices before joining the line. When researchers asked what made a difference, several children mentioned this level of choice before speaking about smaller portions.
The cook now explains that the next stage is to use both plate and kitchen measurements to plan orders. The school has made no commitment to buy less until it collects data for a whole term.`,
      pick('Which kind of waste fell clearly?', 'Food left on plates|Food left in trays|Both kinds fell equally', 'Food left on plates', 'Plate waste fell about 20 percent, whereas tray waste changed little.'),
      fill('Children could request a second ______. Write one word.', 'helping', 'The cooks offered another helping after the first.'),
      fact('The cooks immediately prepared a smaller total amount.', 'False', 'They still prepared the same amount.'),
      pick('What did some children mention first?', 'Being able to choose vegetables|Being able to eat outside|The shorter lunch break', 'Being able to choose vegetables', 'Several spoke first about the choice visible at the vegetable counter.'),
      fact('The school plans to measure waste for a whole term.', 'True', 'It wants a term of data before committing to lower orders.'),
      fact('The method reduced costs by one fifth.', 'Not Given', 'The study gives a waste percentage and no cost figure.')
    )
  ],
  B2: [
    part('The cooler street experiment',
      `A. In many cities, surface temperature is measured from above, often by satellite. A bright roof may look cooler in such images, yet the air experienced by somebody waiting at a bus stop can remain uncomfortable. Urban planners increasingly distinguish between the temperature of a surface and the heat a person actually feels.
B. In Aster, researchers tested two low-cost interventions on otherwise similar streets: they painted one pavement with a pale coating and added fabric shades above parts of the other. Both lowered afternoon pavement temperature. Yet only the fabric lowered the team's index of pedestrian heat, which took into account heat radiated back towards a person's body.
C. The differences were greatest on cloudless afternoons. On overcast days the two interventions produced similar results on the index, although their effects on pavement temperature were still distinct. The researchers warned that the trial lasted only one summer and did not include winter maintenance costs.
D. The city has chosen to use fabric above several waiting areas rather than adopting it along entire streets. Shop owners pointed out that wide coverings might restrict visibility of shop signs. The city will monitor temperatures and how long people wait in shaded areas before deciding where else to install them.`,
      pick('Which heading best suits A?', 'Two ways of defining urban heat|The cost of measuring sunlight|A history of public transport', 'Two ways of defining urban heat', 'A separates surface temperature from the heat felt by pedestrians.'),
      fact('Both interventions lowered afternoon pavement temperature.', 'True', 'This is stated directly in paragraph B.'),
      fill('The pedestrian index included heat ______ back toward the body. Write one word.', 'radiated', 'The index included radiation toward the person.'),
      pick('Which paragraph identifies a disadvantage raised by businesses?', 'A|B|C|D', 'D', 'Shop owners feared reduced visibility of their signs.'),
      fact('The trial established that the shades were inexpensive to maintain in winter.', 'Not Given', 'Winter maintenance costs were outside the trial.'),
      pick('Why does the city plan more monitoring?', 'To guide decisions about further installations|To choose the paler pavement paint|To estimate shop rent', 'To guide decisions about further installations', 'The last sentence ties monitoring to the location of future shades.')
    ),
    part('The problem with better directions',
      `When a walking app introduced a feature showing major landmarks, its designers expected users to remember routes more easily. Instead, the first results appeared mixed. Participants found the station more quickly, yet participants who relied most heavily on the landmark prompts drew less accurate maps afterward.
A psychologist on the team suggested that the two measurements captured different skills. Following an immediately identifiable object requires little effort to keep track of earlier turns. On the other hand, placing landmarks on a map requires the walker to notice relationships among places.
To test this idea, the developers removed prompts briefly at chosen points. Walkers were asked to predict where they would see the next landmark and confirm the direction themselves. This increased travel times slightly but improved map accuracy. For participants who already knew the district, there was little difference between the two app versions.
The city refused to make prediction mode the default. It argued that a resident trying to learn a neighbourhood and a visitor trying to catch a train have different priorities. Users are now offered a choice at the start of a route, and may change modes along the way.`,
      fact('The first version made participants slower to reach the station.', 'False', 'Participants got to the station quicker.'),
      pick('Which skill is required for mapping a route?', 'Noticing where places are relative to each other|Reading spoken instructions aloud|Identifying a landmark from its name only', 'Noticing where places are relative to each other', 'The psychologist contrasts spotting objects with recognizing relationships.'),
      fill('In the experiment, users predicted where the next ______ would appear. Write one word.', 'landmark', 'The modified app asked walkers to anticipate the next landmark.'),
      fact('Participants familiar with the area benefited greatly from prediction mode.', 'False', 'The two versions produced little difference for familiar users.'),
      fact('The city surveyed tourists before deciding on the default.', 'Not Given', 'Its rationale is reported, but no survey is described.'),
      pick('Which lesson best fits the article?', 'A tool can optimize one result while weakening another|A route app should always hide information|Speed is the best measure of learning', 'A tool can optimize one result while weakening another', 'Speed and route learning responded differently to the same design.')
    ),
    part('When repair cafés become popular',
      `At a repair café, volunteers help visitors fix items such as lamps and kettles. Organizers originally measured success by how many objects left the building in working order. Once the service began reaching more people, however, the count revealed surprisingly little about who was learning to fix things for themselves.
A busy day could produce a high repair rate if people arrived with simple problems. It could also produce a low rate if several visitors needed parts the café did not stock. A volunteer might spend time explaining to a visitor how a motor worked even when a replacement could not be found. Under the old system that conversation never appeared in the data.
One branch began asking visitors to perform the final step whenever it was safe. It also followed up a month later to ask whether they had tried repairing anything else. Many respondents reported trying a repair at home. Since people with successful experiences were more likely to respond, organizers avoided treating the responses as an estimate for all visitors.
Rather than replace one total with another, the branch now reports repairs, participation and follow-up responses in separate columns. Funding providers asked to see a single number, but the organizers argued that different readers had different reasons for using the figures.`,
      pick('What did the initial measure record?', 'Objects successfully repaired|Visits that resulted in new knowledge|How often visitors returned', 'Objects successfully repaired', 'The original measure counted working items at the exit.'),
      fill('A lack of replacement ______ could reduce the repair rate. Write one word.', 'parts', 'The café sometimes did not have the parts needed.'),
      fact('Explaining a repair could be valuable even without a successful repair.', 'True', 'The motor explanation is an example of such value.'),
      pick('Why were follow-up responses interpreted cautiously?', 'People with positive experiences responded more often|Very few visitors had access to phones|Reports counted objects twice', 'People with positive experiences responded more often', 'The respondents may not represent all visitors.'),
      fact('Funders wanted the café to report more varied statistics.', 'False', 'They asked to see a single number.'),
      pick('What is the main argument?', 'Different outcomes should be visible in the data|Repair cafés should only accept simple jobs|Funding should depend on the number of visitors', 'Different outcomes should be visible in the data', 'The branch keeps multiple measures to represent different goals.')
    )
  ],
  C1: [
    part('When darkness becomes data',
      `A. Satellite images showing electrically lit settlements are often used to estimate economic activity in places where ordinary statistics are incomplete. The underlying intuition is plausible: streets, shops and factories commonly use light, and expanding settlements frequently become brighter. Yet the neatness of the correlation can obscure precisely where the method stops being informative.
B. In a pilot study of coastal villages, the satellite registered a substantial fall in radiance after a fuel-price shock. The most obvious inference was that businesses had closed. Interviews suggested a more complicated account. Shopkeepers had shortened opening hours, but some workshops had moved production into daylight and were selling as much as before. Other shops had changed bulbs in response to the same price rise.
C. In settlements where the power supply was intermittent, improvements in battery storage appeared to increase radiance even when estimated output had remained broadly stable. It was the timing of light relative to the satellite's crossing, as much as total consumption, that mattered. Likewise, lamps directed downwards were dimmer from orbit despite being more useful at street level.
D. The researchers proposed retaining nighttime light as an indicator when it is checked against regional knowledge and other sources. They also recommended distinguishing the purpose of an estimate from its apparent precision. A broad ranking of settlement size may tolerate mistakes that would undermine an assessment of whether a particular policy had boosted output after six months.`,
      pick('Which heading best matches B?', 'A change in light has several possible causes|A new energy subsidy leads to growth|Problems interviewing business owners', 'A change in light has several possible causes', 'Closures are only one interpretation. Scheduling and efficiency also affected brightness.'),
      fact('All workshops reduced the volume of goods they sold after the price shock.', 'False', 'Some sold as much as before after moving production into daylight.'),
      fill('In some settlements, better battery ______ changed the brightness detected in orbit. Write one word.', 'storage', 'C identifies improvements in battery storage.'),
      fact('The researchers used a satellite supplied by the local government.', 'Not Given', 'The ownership or origin of the satellite is not stated.'),
      pick('What distinction does paragraph D make?', 'Broad comparisons and fine-grained causal claims require different precision|Estimates made during winter are inherently better|A ranking is useful only when it records all policy details', 'Broad comparisons and fine-grained causal claims require different precision', 'A ranking can survive errors that would compromise a claim about a policy.'),
      pick('Which paragraph describes an effect of lamp direction?', 'A|B|C|D', 'C', 'C contrasts downward lamps’ usefulness from street level and their brightness from orbit.')
    ),
    part('Who benefits from efficient queues?',
      `A transit authority installed timed entry at a busy ferry berth after concluding that long physical queues were discouraging use. Scanners recorded the average wait falling from nineteen to seven minutes. Complaints about crowding decreased, and passengers who planned their trips reliably described the process as less stressful.
A follow-up study asked whether the time had disappeared or simply moved elsewhere. Some passengers made several unsuccessful attempts to find a time slot before receiving confirmation. Others arrived early enough to avoid missing their slot and waited beyond the scanning area. None of that time appeared in the authority's figures. A substantial minority became less willing to alter their plans at short notice.
The authority's proponents pointed out that the earlier system also involved hidden costs. The published wait averaged the experience of passengers who joined the line. People who arrived, saw the queue and left immediately were invisible. The follow-up study could not reconstruct their behaviour precisely, so comparisons of total time across the old and new schemes remained tentative.
The authors recommended recording both waiting and flexibility, alongside an audit of whose experiences each measure excluded. The aim was to expose trade-offs that an apparently decisive average would otherwise hide.`,
      fact('The scanner data omitted some waiting outside the scanning area.', 'True', 'The second paragraph explicitly identifies that omission.'),
      pick('What makes the two systems hard to compare?', 'Both omit different people or kinds of effort|The two studies use different units of time|The scanners cannot distinguish visitors from staff', 'Both omit different people or kinds of effort', 'The new system loses booking effort, and the old one loses people who walk away.'),
      fill('The old figures missed those who saw the ______ and immediately left. Write one word.', 'queue', 'The third paragraph describes those people.'),
      fact('Timed entry removed the need for passengers to arrive early.', 'False', 'Some users deliberately arrived early to protect their slot.'),
      pick('What is the researchers’ recommendation?', 'Report waiting, flexibility and omissions together|Discard timing data altogether|Evaluate only complaints about crowding', 'Report waiting, flexibility and omissions together', 'The final paragraph calls for complementary measures and an audit.'),
      fact('Ferry trips under the new system were more expensive.', 'Not Given', 'The article does not mention ticket prices.')
    ),
    part('The value of leaving an empty room',
      `Conventional assessments of civic buildings treat unoccupied space as evidence of inefficiency. By this logic, a library meeting room should be filled with scheduled activity whenever possible. A team examining neighbourhood facilities proposed that part of a room's value might derive from the readiness with which it can accommodate an unpredictable need.
The researchers compared two similar centres during a six-month period. Both offered the same total bookable capacity. One centre filled its rooms in advance, while the other left two short slots each afternoon for walk-in use. Total occupancy fell marginally at the second centre, but groups lacking fixed work schedules used it more often. A tenant association also met there at short notice when a planned venue became inaccessible.
A criticism was that some repeat visitors had learned to treat the unbooked slots as their own, which would undermine access for newcomers. The centre kept walk-in use but introduced a one-slot weekly limit for each group. Staff observed fewer repeat bookings, while still seeing most slots used when needed. They made no claim about how the limit would operate in a markedly busier district.
The authors argued that an apparently idle resource can be valuable by virtue of the options it preserves. They suggested tracking not just rates of use, but which possible uses a system makes practical.`,
      pick('What did the study hold constant across the centres?', 'Total bookable capacity|Daily occupancy|The number of walk-in slots', 'Total bookable capacity', 'Both offered the same total capacity, although scheduling differed.'),
      fact('The walk-in centre achieved a higher total occupancy.', 'False', 'Total occupancy at that centre fell marginally.'),
      fill('Staff limited each group to one slot per ______. Write one word.', 'week', 'A weekly limit of one slot corresponds to one per week.'),
      fact('The study established the effect of limits in a much busier district.', 'Not Given', 'The authors did not investigate or claim that effect.'),
      pick('Which statement best expresses the author’s argument?', 'Capacity can be useful because it remains available|Empty rooms necessarily indicate poor management|The best policy is to leave every afternoon unscheduled', 'Capacity can be useful because it remains available', 'The conclusion values the options preserved by ready access.'),
      pick('Why did the centre introduce the limit?', 'To keep access open to newcomers|To reduce the cost of heating|To increase the number of rooms', 'To keep access open to newcomers', 'Regular users were occupying the slots that newcomers might need.')
    )
  ],
  C2: [
    part('In praise of imperfect forecasts',
      `A. Forecasting teams routinely celebrate improved accuracy in aggregate. Yet institutions seldom act on an average error. They act at specific decision thresholds, such as the point at which a reservoir operator must release water or a hospital must cancel elective procedures. A narrower overall error may matter surprisingly little if improvement occurs mostly far from those thresholds.
B. Consider a municipal flood programme comparing two models. One produced highly accurate estimates across ordinary rainy days and substantially misclassified a few severe storms. The other gave rougher estimates in routine conditions but was better at identifying when water would exceed the level at which protective barriers should be installed. Engineers recommended the second model for overnight deployment.
C. This preference was not a rebuke to statistical accuracy itself. For daily scheduling, staff continued to use the first model. They also emphasized that changing a threshold shifts the pattern of mistakes. A low trigger could reduce missed storms while increasing expensive false alarms, and frequent alarms could eventually undermine public willingness to act.
D. A later audit found that the forecast judged best by technical teams was often the one presented with the tidiest summaries. Exposing uncertainty by threshold and operational consequence made the tools somewhat harder to compare in a single meeting. It also made the decision record more legible to future users, who could see where earlier choices depended on judgments about the relative cost of errors.`,
      pick('Choose the best heading for A.', 'Why aggregate accuracy may miss what matters|The history of statistical error|When uncertainty can be eliminated', 'Why aggregate accuracy may miss what matters', 'The paragraph distinguishes average error from threshold-sensitive decisions.'),
      fact('The model used overnight was also preferred for daily scheduling.', 'False', 'Daily scheduling retained the first model. Overnight deployment used the second.'),
      fact('The audit found that technical teams received summaries of unequal length.', 'Not Given', 'The summaries differed in tidiness; nothing is said about length.'),
      fill('Frequent false ______ could weaken people’s willingness to act. Write one word.', 'alarms', 'C links frequent alarms to reduced public readiness.'),
      pick('What does the writer imply about a more transparent decision record?', 'It helps later users recover the value judgments behind the choice|It always yields an identical model recommendation|It eliminates the need for thresholds', 'It helps later users recover the value judgments behind the choice', 'D says future users can identify decisions about the relative costs of errors.'),
      pick('Which paragraph explains why a model’s strengths vary by use?', 'A|B|C|D', 'C', 'C gives different uses for the two models and explains the effects of threshold choice.'),
      fact('The second model was less precise on routine days.', 'True', 'B says it gave rougher estimates under ordinary conditions.')
    ),
    part('The afterlife of a public indicator',
      `A. When a government department introduced a score to identify districts underserved by public transport, the score’s authors intended it as a provisional guide to site visits. It combined walking distance, journey frequency and a household survey. Within several years, a revised version was being used to allocate operating grants, though its authors had never tested whether small differences among districts could justify that role.
B. A later investigation showed that districts changed reporting practices once money depended on the score. Some measured walking distances from representative homes, others chose the most remote inhabited property, and both claimed consistency with the loose wording of the original instructions. The variation no longer reflected the qualities the indicator had been built to capture.
C. One response was to standardize measurement. Another was to divide the original score into components and report them beside notes from local audits. The former made comparison easier, although combining the data still concealed distinct causes of poor access. The latter required more work from reviewers but exposed precisely where the needs of two similarly ranked districts differed.
D. The report declined to choose one correction for all purposes. Where an administrative decision involved very few cases, reading local evidence was feasible. For recurring decisions across hundreds of districts, the burden was more serious. The authors argued for a written statement of what the score was expected to do each time its use changed, together with checks for how institutions might respond to the stakes.`,
      pick('Choose the best heading for B.', 'Changes prompted by funding incentives|The original design of the survey|Reasons to remove site visits', 'Changes prompted by funding incentives', 'How districts calculated distance changed once funding was at stake.'),
      fact('The original researchers verified that fine differences warranted funding decisions.', 'False', 'A says this application was never tested.'),
      fill('The score included a household ______. Write one word.', 'survey', 'The initial composite included a household survey.'),
      pick('What remained problematic after standardization?', 'The single score could still hide different reasons for poor access|Distances could no longer be recorded|Districts had to abandon walking data', 'The single score could still hide different reasons for poor access', 'Combining the components still concealed differences.'),
      fact('The final report recommended the same review method for every decision.', 'False', 'D argues that feasibility and the number of decisions matter.'),
      fact('The new method changed the total amount spent on grants.', 'Not Given', 'The article explains allocation practices, not aggregate expenditure.'),
      pick('What does D primarily propose?', 'Reassess an indicator when the purpose or incentives change|Base all recurring grants exclusively on interviews|Freeze each indicator after its first publication', 'Reassess an indicator when the purpose or incentives change', 'The proposal requires defining its role and checking responses each time.')
    ),
    part('The case for sampling failure',
      `A. Studies of successful community projects are often expected to extract principles that can be applied elsewhere. This approach has an intuitive appeal. If many successful projects display the same feature, such as a strong local coordinator, the feature seems an attractive policy target. However, an attribute common in successful cases may be just as common among projects that did not survive.
B. A comparative review of neighbourhood heat plans began with applications rather than final reports. The researchers were interested in the work that was abandoned before it became visible to the official monitoring system. Comparing all applications revealed that many discontinued projects had skilled coordinators. What distinguished the functioning plans was more often access to a second institution that could supply staff during seasonal peaks.
C. There were limits to the comparison. An early project proposal may look ambitious even when its organizers have few realistic prospects. The review treated initial claims as claims, not verified capacity. Some abandoned plans also ended for reasons unrelated to coordination. The researchers used interviews to classify interruption but could not assign a reliable counterfactual outcome to every instance.
D. Their conclusion was restrained. Broadening the sample made some popular explanations less convincing but did not prove that an alternative factor was decisive everywhere. The approach’s chief advantage was to make plausible rival accounts visible. Practitioners could then test those accounts locally before using them to justify an ongoing public expense.`,
      pick('Which heading best matches B?', 'Looking for cases that vanished before monitoring|A method for writing stronger applications|Funding coordinators through local taxes', 'Looking for cases that vanished before monitoring', 'Beginning from all applications brings abandoned projects into the sample.'),
      fact('Skilled coordinators appeared only in plans that continued.', 'False', 'Many projects that stopped had skilled coordinators.'),
      fill('A second institution could supply ______ during seasonal peaks. Write one word.', 'staff', 'B identifies the support as extra staff.'),
      fact('Some project proposals were deliberately misleading.', 'Not Given', 'C warns about unverified claims without establishing intent.'),
      pick('What best describes the authors’ conclusion?', 'A broader sample challenges some claims without settling causation everywhere|A second institution guarantees success|Unfinished projects are too diverse to inform a comparison', 'A broader sample challenges some claims without settling causation everywhere', 'D allows alternative explanations to surface but limits causal certainty.'),
      pick('Which paragraph describes the difficulty of determining what would have happened?', 'A|B|C|D', 'C', 'C says counterfactual outcomes could not reliably be assigned.'),
      fact('Interviews helped categorize reasons why projects stopped.', 'True', 'C says interviews were used to classify interruption.')
    )
  ]
};
