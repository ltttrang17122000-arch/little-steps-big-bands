const talk = (title, type, time, prompts, guide, image = false) => ({title,type,time,prompts,guide,image});
export const speaking = {
  A1: [
    talk('A flower vendor in Hanoi','Picture description',45,['What can you see?','What is the person doing?','What would you like to buy?'],'Use There is / There are and two present continuous verbs.',true),
    talk('Meet a new classmate','Role-play',60,['Say your name and ask your partner’s name.','Tell them where you live and one thing you like.','Ask them two questions about school or work.'],'Practise both voices. Start with “Hi. I’m … What’s your name?”'),
    talk('My place to study','Personal interview',60,['Where do you study?','What is on your desk?','What do you study in the evening?'],'Answer each question in a complete sentence. Add one detail to the last answer.'),
    talk('From home to the park','Picture storytelling',75,['Imagine you get ready to leave home. What do you take?','On the way, you see a friend. What do you say?','What are you doing when you get to the park?'],'Picture each scene in your mind. Link the scenes with first, then and finally.')
  ],
  A2: [
    talk('One place, two ways to shop','Compare and contrast',75,['Look at the street vendor. What is different from a supermarket?','What is similar about the two places?','Which one do you prefer and why?'],'Use both, but and because. Give one concrete example.',true),
    talk('The room is too noisy','Role-play',90,['Call hotel reception and explain the problem.','Ask whether another room is available.','Respond to this offer: “We can move you after lunch.”'],'Use “Could I …?” or “Would it be possible …?” and suggest an alternative.'),
    talk('A change of plans','Storytelling',100,['Describe a day when the weather changed your plans.','Who were you with, and what did you do instead?','How did the day end?'],'Use the past simple to tell events, and one past continuous sentence for the background.'),
    talk('A helpful place in town','Cue card',95,['Describe a place in your town that helps people.','Say where it is, who uses it and what you can do there.','Explain why you would tell a visitor about it.'],'Make a short note for each point. Then speak from the notes.')
  ],
  B1: [
    talk('Learning something new','IELTS Part 1',90,['What skill would you like to learn?','Do you prefer learning alone or with other people?','What was the last thing you learnt outside school?'],'Use an answer, a reason and one detail for each question.'),
    talk('An item worth repairing','IELTS Part 2',120,['Describe an item that you or someone you know repaired.','Say what broke, how it was repaired and who helped.','Explain why it was worth keeping.'],'Use a minute to plan. Note the item, the problem, the repair and the result.'),
    talk('Should towns lend things?','IELTS Part 3 discussion',150,['What objects do people in your country rarely use?','How might a town encourage people to share them?','Which people might have trouble using a lending service?'],'Use an example to develop your claim, then add one qualification.'),
    talk('Two plans for a family visit','Compare and contrast',120,['Compare visiting a museum with shopping from a street vendor.','Which would suit a family with young children?','How might the best choice change if it rains?'],'Compare the same criteria on both sides, such as noise, cost and flexibility.',true)
  ],
  B2: [
    talk('Maps and wayfinding','IELTS Part 1',90,['Do you use a map when you visit a new place?','Have you ever got lost in an unfamiliar area?','Would you rather follow signs or use your phone?'],'Answer naturally, then add one small example.'),
    talk('A useful public space','IELTS Part 2',120,['Describe a public place that was redesigned.','Say where it is, what changed and who uses it.','Explain whether the changes were successful.'],'Take one minute to note a before-and-after contrast and a concrete detail.'),
    talk('Comfort and public spending','IELTS Part 3 discussion',180,['Should comfort on city streets be a public spending priority?','What makes a transport improvement equitable?','How should cities decide which neighbourhoods receive improvements first?'],'For each claim, develop a reason or an example. Compare two priorities.'),
    talk('Agreeing on a limited budget','Role-play',160,['You represent a bus users’ group. Your partner represents local shops.','You want permanent bus stop shade. Shops worry it will hide their signs.','Negotiate a pilot that both sides can accept.'],'Make one concession and state how the trial could be measured.')
  ],
  C1: [
    talk('Measuring a good service','IELTS Part 3 discussion',150,['Can shorter waiting times ever make a service worse?','What performance data should a public organization share?','When might qualitative accounts matter more than averages?'],'Compare the interests of at least two groups. Qualify only where the distinction matters.'),
    talk('A change that surprised you','IELTS Part 2',120,['Describe a policy or change that produced an unexpected result.','Say what people initially expected, what actually happened and what followed.','Explain how your opinion changed.'],'Make a one-minute plan using expectation, evidence, revised position.'),
    talk('A library with unused capacity','Structured debate',210,['Defend keeping some library meeting slots unbooked.','Now defend booking all the slots in advance.','Give a final position with a practical condition.'],'Treat both arguments fairly. Define what “efficient” means for each side.'),
    talk('Explaining mixed evidence','IELTS Part 3 discussion',180,['Why might studies of the same service disagree?','How might an organization present negative findings?','When is a small trial sufficient for a larger decision?'],'Use a realistic scenario. Distinguish uncertainty about effect from uncertainty about implementation.')
  ],
  C2: [
    talk('The trouble with a single metric','IELTS Part 3 discussion',165,['Why do institutions rely on one performance figure?','Can making a figure public undermine its value?','How can a manager know when to change what is measured?'],'Make one conditional claim and explain the incentive behind a specific response.'),
    talk('An apparent success reconsidered','IELTS Part 2',120,['Describe an apparently successful change that looked different after closer examination.','Say who assessed it, what information was overlooked and what changed after that.','Explain what lesson you take from the experience.'],'Use the first minute to plan context, initial measure, missing evidence and a revised judgment.'),
    talk('Deciding under uncertainty','Structured debate',230,['Argue for acting on an imperfect flood forecast.','Now explain when caution would make a delay defensible.','Compare the costs of false alarms and missed events, and propose a decision rule.'],'Keep the comparison symmetric. Identify which assumption would change your position.'),
    talk('Learning from invisible cases','IELTS Part 3 discussion',200,['Why do decision makers give successful projects more attention?','How can missing cases change what should be funded?','When is it reasonable to transfer an idea to a different community?'],'Separate association, plausible explanation and evidence that an intervention caused the outcome.')
  ]
};
