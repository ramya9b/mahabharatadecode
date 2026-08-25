export type Domain = "family" | "workplace" | "duty" | "identity";

export interface WisdomScenario {
  id: string;
  domain: Domain;
  headline: string;           // The 1-line "that's me" recognition moment
  subline: string;            // The quiet detail that makes it real
  characterId: string;
  characterName: string;
  accentHex: string;
  accentRgb: string;
  // Full card content — written in genuine human voice
  yourSituation: string;      // Describes their pain without rushing past it
  epicMoment: string;         // The exact Mahabharata scene — not a summary
  whatItReveals: string;      // The honest insight that shifts something
  theLesson: string;          // One sentence. The thing they'll carry with them.
  actions: string[];          // 3 specific, honest, immediately usable
  articleSlug?: string;
}

/* i18n keys for domain labels + descriptions — resolve via t() at the call
   site. The localized strings live under "wisdom.domains.*" in each locale. */
export const DOMAIN_META_KEYS: Record<Domain, { labelKey: string; icon: string; descKey: string }> = {
  family:    { labelKey: "wisdom.domains.family",    icon: "🏠", descKey: "wisdom.domains.family_desc" },
  workplace: { labelKey: "wisdom.domains.workplace", icon: "💼", descKey: "wisdom.domains.workplace_desc" },
  duty:      { labelKey: "wisdom.domains.duty",      icon: "⚖️", descKey: "wisdom.domains.duty_desc" },
  identity:  { labelKey: "wisdom.domains.identity",  icon: "🧭", descKey: "wisdom.domains.identity_desc" },
};

/* @deprecated — kept as fallback for any caller we haven't migrated yet */
export const DOMAIN_META: Record<Domain, { label: string; icon: string; description: string }> = {
  family:    { label: "Family & Relationships", icon: "🏠", description: "The people you didn't choose, and the ones you did" },
  workplace: { label: "Workplace & Career",     icon: "💼", description: "What happens when ambition meets the reality of systems" },
  duty:      { label: "Duty & Responsibility",  icon: "⚖️", description: "When you carry more than you were ever asked to carry" },
  identity:  { label: "Identity & Daily Life",  icon: "🧭", description: "The quiet wars you fight when no one is watching" },
};

export const scenarios: WisdomScenario[] = [

  /* ════════════════════════════════════════
     FAMILY & RELATIONSHIPS
  ════════════════════════════════════════ */
  {
    id: "fam-01",
    domain: "family",
    headline: "You love someone who keeps choosing everyone else over you.",
    subline: "You're always the one who adjusts. You've gotten so good at it, nobody notices you're doing it anymore.",
    characterId: "karna",
    characterName: "Karna",
    accentHex: "#C2410C",
    accentRgb: "34,197,94",
    yourSituation: `You love them. You have shown up for them in ways they don't even remember. You have rearranged your own life, quietly, without making a scene — because that's what you do. And somehow, every time it matters, they choose someone else. Not dramatically. Not cruelly. Just... they do. And you sit with that, alone, because you don't want to be the kind of person who makes someone feel guilty for living their life.

The loneliness is not about being unloved. It is about being the person who loves harder than they are loved back. And not knowing what to do with that except carry it.`,
    epicMoment: `Karna's mother was Kunti — the same Kunti who was mother to the Pandavas, the people Karna spent his life fighting against. She came to him once, alone, before the war. She told him the truth: that she was his mother. That she had abandoned him as a newborn, placed him in a basket and sent him down a river because she was afraid of what people would say.

She came to reclaim him now — not for his sake, but for her other sons' sake. She wanted him to switch sides. To come home. To finally be seen as who he truly was.

Karna said no. Not in anger. He said: "You come to me now, when I am useful. You left when I was not." He told her he would protect her other four sons — that only the one who faced him in battle might die. He kept that promise. He held his grief in both hands and gave her exactly what she asked for.

He did it alone. He told nobody.`,
    whatItReveals: `The person who loves without equal return is not weak. They are running the hardest emotional marathon in the room — and they are doing it without a crowd. What Karna shows is that this kind of love is not foolishness. It is a form of dignity. But dignity does not require you to be silent about what it costs.

The real question is not "why don't they love me back the same way." The real question is: "Am I staying in this dynamic because I genuinely believe it will change — or because leaving would mean admitting it won't?"`,
    theLesson: "Loving someone more than they love you is not a failure. Pretending you don't notice is.",
    actions: [
      "Say it once, clearly, without accusation — 'I feel like I'm always the one who adjusts, and it's starting to wear on me.' Not to hurt them. Just so the truth exists in the room.",
      "Notice who shows up for you the way you show up for others. That person deserves more of your energy than you're currently giving them.",
      "Stop editing your needs to fit their comfort. A relationship where only one person is honest about what they need is not a relationship — it is a performance.",
    ],
    articleSlug: "karna-loyalty-vs-self-respect",
  },

  {
    id: "fam-02",
    domain: "family",
    headline: "Your parents gave up everything for you. Now you feel guilty for having your own life.",
    subline: "You moved cities. You made choices they don't fully understand. The guilt is quiet but constant.",
    characterId: "karna",
    characterName: "Karna",
    accentHex: "#C2410C",
    accentRgb: "34,197,94",
    yourSituation: `They never said it out loud. They don't need to. You know the math: what they had, what they gave up, what they wanted for you, and where you actually ended up. You are living a life they can't always follow — different city, different values, different timelines for marriage or children or success. You love them. You are also quietly, constantly, a little bit guilty for not being who they imagined.

The hardest part is that they are proud of you. And somehow, that makes it worse.`,
    epicMoment: `Karna was raised by Adhiratha, a charioteer, and his wife Radha. They loved him completely. They gave him everything they had. He grew up knowing he was meant for something more — not because his parents made him feel small, but because the world kept reminding him of the gap between where he came from and where he felt he belonged.

He carried both truths at the same time: deep, genuine love for the people who raised him, and a persistent ache for a different kind of life. He never resolved this tension. He held it.

When he was finally told the truth — that he was the firstborn son of Kunti, that he was a prince — he did not abandon Radha and Adhiratha. He said: "They are my parents. Whatever else is true, that is also true."`,
    whatItReveals: `The guilt you feel is not ingratitude. It is love that doesn't know what to do with itself in the space between who your parents imagined you'd be and who you actually are. That space is not your fault. It is just what growing up looks like.

You do not owe your parents the version of your life they pictured. But you do owe them the real one — shown to them honestly, with patience, without apology.`,
    theLesson: "You can honour where you come from without living inside it forever.",
    actions: [
      "Call them — not to explain yourself, just to talk. You have been so busy managing the guilt that you may have forgotten to actually be present with them.",
      "Stop performing the life they want when you visit. Be honest about what your real life looks like. They can handle more than you think.",
      "Find one thing from how they raised you that you're genuinely grateful for — and tell them. Not as reassurance. Just because it's true.",
    ],
  },

  {
    id: "fam-03",
    domain: "family",
    headline: "Someone in your family is doing something you know is wrong. You're staying silent.",
    subline: "You've told yourself it's not your business. But it is. And you know it.",
    characterId: "bhishma",
    characterName: "Bhishma",
    accentHex: "#7986CB",
    accentRgb: "121,134,203",
    yourSituation: `You are watching something unfold that you know — clearly, without doubt — is wrong. Maybe it's how someone is being treated. Maybe it's a decision that will hurt someone who can't protect themselves. Maybe it's a secret that should not be kept. You are staying silent because speaking would cost you something: comfort, peace, a relationship, your role in the family. You have found a way to call your silence "not getting involved." But you know the difference.`,
    epicMoment: `In the Sabha Parva, Draupadi was dragged into the court of the Kauravas. She had been staked in a gambling game — as if she were property — and won. She was being humiliated in front of the entire royal family.

Bhishma was there. He was the most powerful man in that room. He had the authority, the respect, and the physical ability to stop what was happening. He sat still. He gave a speech about dharma being complex. He did nothing.

He had made an oath of absolute loyalty to whoever sat on the throne of Hastinapura. His oath mattered more to him than the woman being wronged in front of his eyes. He knew he was wrong. He lived with it for the rest of his life. On his deathbed, he called it his greatest failure.`,
    whatItReveals: `Staying silent in the face of something you know is wrong is a choice. It feels like neutrality. It isn't. Silence, in a situation where speaking would matter, is a vote for whatever is happening. Bhishma's story is not a story about a bad man. It is a story about a very good man who used a principle to avoid a difficult moment — and what that costs, long term.`,
    theLesson: "The thing you're calling 'not my place to interfere' is something Bhishma called his greatest regret.",
    actions: [
      "Say the thing you've been not saying. Once. Clearly. Not as an accusation — as an honest observation from someone who cares.",
      "Ask yourself honestly: if this were happening to a stranger, would you call it 'not my business'? The answer tells you whether family loyalty is protecting you or protecting the wrong.",
      "You do not have to fix it. You have to not pretend it isn't happening.",
    ],
    articleSlug: "bhishma-terrible-oath",
  },

  {
    id: "fam-04",
    domain: "family",
    headline: "You said something in anger. The relationship has never fully recovered.",
    subline: "You apologised. They accepted. But something shifted and you both know it.",
    characterId: "draupadi",
    characterName: "Draupadi",
    accentHex: "#E53935",
    accentRgb: "229,57,53",
    yourSituation: `It came out of nowhere — or it felt like nowhere, even though it had been building for a long time. You said something sharp and specific and true in the worst possible way. The damage was immediate. The apology came, and it was accepted, but the apology didn't undo the thing. You both continue. But there is now a scar where there wasn't one before, and you are not entirely sure if it will heal, or if it will just be something you both learn to live around.`,
    epicMoment: `Draupadi laughed at Duryodhana. Not cruelly — he had stumbled and fallen into a pool that looked like solid floor. It was an accidental insult, the kind that happens between people. But in that moment, in that court, with an audience, it landed like a weapon.

Duryodhana never forgot it. Years later, when he had the power, he made sure she paid for it — in the most public and humiliating way possible. One moment of unguarded laughter became the thread that pulled the entire war together.

The Mahabharata does not excuse what Duryodhana did. But it is honest about what a single moment of careless truth can set in motion.`,
    whatItReveals: `Some wounds stay. Not because people are petty, but because the truth of what was said — even when said badly — lands in a place that was already tender. The relationship can survive it. But surviving it means actually talking about what made you say that thing, not just apologising for saying it.`,
    theLesson: "An apology closes the incident. An honest conversation is the only thing that closes the wound.",
    actions: [
      "Go back to the conversation — not to reopen it, but to say what was underneath the anger. 'I said it badly but here's what I was actually feeling.' That's different from another apology.",
      "Give them time without pressure. Some people need to see your behaviour change before they can trust the words again.",
      "Forgive yourself for being human. The goal is to understand it well enough that it doesn't happen the same way again.",
    ],
    articleSlug: "draupadi-fire-and-dignity",
  },

  {
    id: "fam-05",
    domain: "family",
    headline: "You are always the one who holds the family together. Nobody notices until you stop.",
    subline: "Every gathering, every crisis, every difficult conversation — somehow it always falls to you.",
    characterId: "draupadi",
    characterName: "Draupadi",
    accentHex: "#E53935",
    accentRgb: "229,57,53",
    yourSituation: `You are the one who remembers birthdays, who makes the calls, who smooths things over, who organises the visit, who notices when something is wrong before anyone else has said a word. You do it because someone has to and because you are good at it. But it is exhausting in a way you cannot fully explain to anyone who doesn't do it — and the people who would need to understand it are precisely the ones who've never had to.`,
    epicMoment: `Draupadi was the wife of five kings, the queen of the Pandavas. She managed five very different, very strong-willed men through thirteen years of exile — through forests, through disguises, through hunger and humiliation and the constant threat of violence. She kept them together when the easiest thing in the world would have been for each of them to go their own way.

Nobody planned a day for her. Nobody carried her load. When she finally broke — in the court, when she was wronged — it was the accumulated weight of every single day she'd held the whole thing up by herself.

Her question in that court was not just about one moment. It was the question of someone who had given everything and was finally, plainly, demanding to be seen.`,
    whatItReveals: `The person who holds things together is often invisible precisely because they are doing their job so well. What you need is not gratitude — though that would be nice. What you need is for at least one person to take something off your plate without being asked. And that will not happen until you stop doing everything before anyone else has to.`,
    theLesson: "Stop before you have to break. The people who love you cannot miss what they cannot see.",
    actions: [
      "Leave one thing undone this week. Deliberately. See what happens. The world will not end, and someone else might step up.",
      "Tell one person specifically: 'I need you to handle this one.' Not 'can you help' — 'I need you to own this.' The difference matters.",
      "Give yourself the same grace you give everyone else. You are not required to be the only reliable person in your family forever.",
    ],
  },

  /* ════════════════════════════════════════
     WORKPLACE & CAREER
  ════════════════════════════════════════ */
  {
    id: "work-01",
    domain: "workplace",
    headline: "You have the skill. You don't have the title. Others get promoted; you get more work.",
    subline: "You know you're better than what you're being asked to do. The people deciding don't seem to.",
    characterId: "karna",
    characterName: "Karna",
    accentHex: "#C2410C",
    accentRgb: "34,197,94",
    yourSituation: `You have delivered. The results exist, somewhere in a spreadsheet nobody reads. You have trained people who got promoted over you. You have solved problems that were attributed to someone else's strategy. You show up, you do more than your role requires, and you watch people with half your capability get recognised because they know how to work the room, went to the right school, or simply have the audacity to ask for things you were raised to earn.

The worst part is you're starting to wonder if the problem is you.`,
    epicMoment: `At the tournament of Hastinapura, the greatest warriors in the land were competing. Karna walked in uninvited and matched every single thing Arjuna had done. The crowd turned. They had seen something real.

Then someone asked: "What is his lineage?" He was the son of a charioteer. Not royalty. In this world, you could only compete against someone of equal social standing. He was disqualified before he could finish. Not for his skill. For his last name.

Duryodhana, in that moment, stood up and crowned him King of Anga on the spot. Not because Duryodhana was a good person — he wasn't. But because he saw what the system was trying to bury.`,
    whatItReveals: `The institution that is not recognising you may have already decided, and no amount of excellent work will change a decision that was never about your work. This is painful and it is also, eventually, freeing — because it means the problem is not you. It means you are in the wrong arena, not the wrong person.

Karna's career did not change when he got better. It changed when one person with power looked at him directly and said: "I see you."`,
    theLesson: "You cannot earn recognition from a system that has already decided your ceiling. You can only find the arena where the ceiling doesn't exist.",
    actions: [
      "Stop optimising for the people who aren't seeing you. Put that energy into being visible to someone outside your immediate chain of command — a different team, a different leader, an external network.",
      "Ask for what you want explicitly. Not hints. Not hoping your work speaks for itself. Say: 'I want to be considered for X. Here is what I've done. Here is what I can do.' People do not advocate for those who never ask.",
      "Have one honest conversation with someone you trust about whether this organisation is structurally the problem or whether there is something in your approach that needs to change. Be genuinely open to the answer.",
    ],
    articleSlug: "karna-loyalty-vs-self-respect",
  },

  {
    id: "work-02",
    domain: "workplace",
    headline: "You know exactly what needs to happen. Nobody will listen until someone senior says it.",
    subline: "You've watched your idea get ignored, then praised when someone else had it three months later.",
    characterId: "krishna",
    characterName: "Krishna",
    accentHex: "#4A90D9",
    accentRgb: "74,144,217",
    yourSituation: `You have said it. In the meeting, in the email, in the Slack message that got three reactions and no action. You watched it sit there. You watched the problem your idea would have solved grow into a crisis. Then, at some point, someone with a bigger title said essentially what you said — and it became the plan.

It is not about credit. Or it is a little about credit, which you feel guilty about wanting. Mostly it is about the grinding exhaustion of being right quietly while things go wrong loudly.`,
    epicMoment: `Before the war, Krishna went to the Kaurava court as a peace messenger for the Pandavas. He made their case — clearly, with evidence, with full knowledge of the consequences of refusal. Duryodhana refused. Everyone in that room knew Krishna was right. Nobody acted on it.

Krishna did not raise his voice. He did not repeat himself. He had said what was true. He left. He went back to the Pandavas and said: "I have done what I could. Now we prepare."

He did not waste another moment on convincing people who had already decided. He redirected his energy entirely to making the alternative work.`,
    whatItReveals: `There is a difference between being ignored and being ineffective. You may have said the right thing in the wrong room, at the wrong time, to the wrong person. Krishna's power was not that everyone listened to him — it was that he was very precise about who he needed to listen and moved on from everyone else.

The question is not "why won't they hear me." The question is: "Am I talking to the person who actually has the power to act on this?"`,
    theLesson: "Stop repeating yourself to people who have already decided. Find the one person who hasn't decided yet.",
    actions: [
      "Write down your idea as if you're presenting it to someone with full decision-making authority — not your manager, not the committee, the actual decision-maker. Then find a path to that person.",
      "Stop bringing the same idea to the same meeting. Either escalate it, document it formally, or let it go. All three are better than the slow erosion of repeating yourself.",
      "Notice who actually changes things in your organisation. It is rarely the loudest person. Study how they move.",
    ],
    articleSlug: "krishna-leadership-secrets",
  },

  {
    id: "work-03",
    domain: "workplace",
    headline: "You're exhausted. But stopping feels like losing.",
    subline: "You've tied so much of who you are to what you do that rest feels like a personality crisis.",
    characterId: "arjuna",
    characterName: "Arjuna",
    accentHex: "#4CAF50",
    accentRgb: "76,175,80",
    yourSituation: `You have been running at this for a long time. There are days when you don't recognise yourself in the mirror — not because of how you look, but because of how flat you feel. The work used to mean something. Maybe it still does. You can't tell anymore because you haven't slowed down long enough to check. Stopping feels like giving up. Like weakness. Like losing the identity you've spent years building.`,
    epicMoment: `Arjuna was the finest archer alive. He had trained since childhood. His entire identity — his sense of purpose, his self-worth, his relationships — was bound up in being a warrior. And then, standing on the battlefield of Kurukshetra, surrounded by the people he was about to fight, he put down his bow.

Not because he was weak. Because in that moment, the meaning had collapsed. He could not figure out what any of it was for. He sat down on the floor of his chariot and said: "I do not want to fight."

That moment — the greatest warrior in history putting down his weapon and saying "I don't know what I'm doing this for" — is the moment the Bhagavad Gita begins. His breakdown was not the end of his story. It was the beginning of the most important conversation of his life.`,
    whatItReveals: `Exhaustion is not a sign that you are failing. It is a sign that the version of you who started this journey has given everything it had. Something needs to change — not your commitment, not your discipline, but the pace, or the direction, or the meaning you're attaching to the work. The rest you're afraid to take is the thing that would allow you to come back.`,
    theLesson: "Putting down your bow for a moment is not the same as losing the war. It is the thing that makes you capable of winning it.",
    actions: [
      "Take the day off you've been postponing. Not a 'productive rest day.' A real day where nothing counts and nothing gets done. Notice what you feel.",
      "Ask yourself honestly: if you were advising a friend who told you what you just told yourself about how exhausted you are, what would you say to them?",
      "Find the reason you started. Not the goal — the reason. If you can't remember it, that's the problem. That is what needs to be recovered before anything else.",
    ],
    articleSlug: "arjuna-confusion-moment-of-doubt",
  },

  {
    id: "work-04",
    domain: "workplace",
    headline: "Your company's values and your values are not the same. You stay because you need the money.",
    subline: "You've stopped arguing. You just do the work. But something is slowly dying in you.",
    characterId: "bhishma",
    characterName: "Bhishma",
    accentHex: "#7986CB",
    accentRgb: "121,134,203",
    yourSituation: `You know what this organisation is. You've seen enough to have no illusions. There are decisions made here that you would not make, values performed externally that do not match what happens in the room. You have three choices: fight it, which is exhausting and mostly ineffective; leave it, which you're not in a position to do right now; or manage your own conscience about continuing to work here.

You have chosen option three. You've gotten very good at it. You're also aware that 'getting good at it' might be the problem.`,
    epicMoment: `Bhishma served five generations of the Kuru throne. He watched Dhritarashtra make bad decision after bad decision. He watched Duryodhana become what he became. He gave counsel — real counsel, honest and specific. Nobody listened.

He stayed anyway. Not because he was weak, but because he had made a commitment and he was, above everything else, a man who kept his word. He sat on the wrong side of the war. He fought for people he knew were wrong. He died for an oath he had taken before any of it made sense.

On his deathbed, lying on a bed of arrows, he gave the most complete and honest political philosophy in all of Indian literature. He had thought deeply about everything. He had just applied none of it to himself.`,
    whatItReveals: `Staying in a system that conflicts with your values is a choice that costs something that does not appear on any balance sheet. It costs the part of you that used to believe your work meant something. You can manage that cost for a while. At some point, the question becomes: what am I rebuilding toward, and is this the right place from which to build it?`,
    theLesson: "You can stay. Just be honest with yourself about what you are staying for and what you are giving up.",
    actions: [
      "Set a real timeline — not 'I'll leave someday,' but a specific condition: 'I will be out of here by X date or when Y happens.' Having an end point changes how you carry the present.",
      "Stop absorbing the culture. You can comply with the work without internalising the values. Know the difference.",
      "Start building your exit while you're still here. Update the resume. Have the conversations. The options you build quietly now are the ones that will exist when you're ready.",
    ],
    articleSlug: "bhishma-terrible-oath",
  },

  {
    id: "work-05",
    domain: "workplace",
    headline: "You trusted someone at work. They used what you shared against you.",
    subline: "You don't know how to be appropriately open anymore. So you've stopped being open at all.",
    characterId: "draupadi",
    characterName: "Draupadi",
    accentHex: "#E53935",
    accentRgb: "229,57,53",
    yourSituation: `You made the mistake of being honest with someone you thought was safe. You shared something real — a frustration, a fear, an ambition, a vulnerability — and it was used. Maybe directly, maybe subtly. Either way, you learned something about that person and something about yourself. What you learned about yourself is that you misjudged the situation, and that's the part that stings the most.

Now you're careful. Professionally careful. The kind of careful that is slowly turning into isolation.`,
    epicMoment: `Draupadi was wronged in the most public place imaginable — the royal court, full of people who knew her, respected her, had eaten at her table. The betrayal was not from a stranger. It came from within the circle. The people who could have stopped it did not stop it.

What she did next is the reason her story lasts. She did not become cold. She did not disappear. She stood in that court and asked one precise question that nobody in the room could answer. She did not become the thing that was done to her. She stayed herself.`,
    whatItReveals: `Being betrayed by someone you trusted is not evidence that you were foolish to trust. It is evidence that they were unworthy of it. The instinct to close off is understandable — it is protection. But if the protection becomes permanent, the person who hurt you has taken something from you that they don't deserve to keep.`,
    theLesson: "One person being unworthy of your trust does not mean trust itself is the mistake.",
    actions: [
      "Name what specifically happened, to yourself, in plain language. Not 'office politics' — what actually happened. Clarity about the event is the first step to not letting it define your future behaviour.",
      "Find one person in your current environment who has consistently not done this. They exist. Invest there.",
      "The question to ask is not 'should I trust people' but 'what are the signs of someone worth trusting.' Refine the criteria, not the instinct.",
    ],
    articleSlug: "draupadi-fire-and-dignity",
  },

  /* ════════════════════════════════════════
     DUTY & RESPONSIBILITY
  ════════════════════════════════════════ */
  {
    id: "duty-01",
    domain: "duty",
    headline: "Everyone depends on you. There is no version of your life where you get to need someone.",
    subline: "You are strong. You've been strong for so long that nobody thinks to ask if you're okay.",
    characterId: "bhishma",
    characterName: "Bhishma",
    accentHex: "#7986CB",
    accentRgb: "121,134,203",
    yourSituation: `You have been the responsible one for as long as you can remember. In your family, in your friendships, at work. People call you when things go wrong. They don't call to ask how you are unless they need something first. You are the person who holds things together, which means you are also the person who has no one to hand things to when you are falling apart. So you don't fall apart. You have gotten extremely good at not falling apart.

But it is tiring in a way that rest doesn't fix.`,
    epicMoment: `Bhishma was the most capable person in the Kuru dynasty. He had taken an oath that removed him from the line of succession — not because he had to, but because he chose to, so his father could remarry. From that moment, his entire life was in service of others. He raised princes, he guided kings, he fought other people's wars.

He never asked for anything. He never needed anything — not visibly. On his deathbed, pierced by hundreds of arrows but kept alive by sheer will so he could die at an auspicious time, he gave counsel to everyone who came to him. He gave his wisdom to the people who had helped create the circumstances of his death.

No one sat with him and asked: "Are you okay? What did you need, all those years? What was it like?"`,
    whatItReveals: `Reliability is not the same as indestructibility. The person who is always strong is often the person who learned, very early, that being vulnerable was not safe. That lesson served you then. It may be costing you now. Needing something is not weakness. It is the thing that makes you a person rather than a function.`,
    theLesson: "You are allowed to need things. Not just occasionally. Regularly. As a normal part of being alive.",
    actions: [
      "Tell someone specifically what you need — not hints, not hoping they'll notice, specifically. 'I need you to check in on me this week. Not about the project. About me.' See what happens.",
      "Reduce one responsibility that you are currently carrying that nobody asked you to carry. Not forever. For one week. See if the world ends.",
      "Find one place in your life where you get to be the one who needs support rather than the one who provides it. A therapist, a friend who understands, a community. Build it deliberately.",
    ],
    articleSlug: "bhishma-terrible-oath",
  },

  {
    id: "duty-02",
    domain: "duty",
    headline: "You made a promise you now regret. Breaking it feels like losing yourself.",
    subline: "You've changed. The promise made sense when you made it. Now it's a cage.",
    characterId: "bhishma",
    characterName: "Bhishma",
    accentHex: "#7986CB",
    accentRgb: "121,134,203",
    yourSituation: `You said you would. Maybe it was to a person. Maybe to an organisation. Maybe to a version of yourself that had different values or different information. At the time, the commitment felt clear and right. Now you're living inside its consequences and you can see, plainly, that it is producing harm — to you, to others, to what you actually believe. But breaking it would mean being someone who breaks promises. And you are not that person. So you stay.`,
    epicMoment: `Bhishma took his oath — called the "bhishana pratigya," the terrible oath — to never claim the throne and never marry, so that his father could marry a fisherman's daughter without her father fearing their children would be disinherited. It was an act of love.

He kept that oath for his entire life. It cost him children, it cost him agency, and ultimately it cost him the ability to stop one of the most horrific injustices in the entire epic. He had the power. He did not have the freedom. His oath had taken it.

The Sanskrit word "bhishma" means "one who has taken a terrible oath." The name became the person. The promise became the identity.`,
    whatItReveals: `There is a difference between keeping a promise because it is still right and keeping it because breaking it would feel like losing who you are. The first is integrity. The second is a prison you have built around your own identity. A commitment that made sense in one context is not automatically sacred in a completely different one.`,
    theLesson: "Keeping a promise matters. Keeping a promise that is now causing harm is not honour — it is stubbornness wearing honour's clothes.",
    actions: [
      "Separate the two questions: 'Is this promise still producing good?' and 'Would breaking it make me a bad person?' Answer them independently. They are not the same question.",
      "Talk to the person you made the promise to — if that's possible. 'The situation has changed. I need to revisit what we agreed.' Most people respect that more than they respect silent resentment.",
      "Ask yourself: if a person you loved came to you and described this exact situation, what would you advise them? Apply the same standard to yourself.",
    ],
    articleSlug: "bhishma-terrible-oath",
  },

  {
    id: "duty-03",
    domain: "duty",
    headline: "You followed the rules. The rules produced an unjust outcome. And you stayed silent.",
    subline: "You told yourself it wasn't your call. You still think about it.",
    characterId: "bhishma",
    characterName: "Bhishma",
    accentHex: "#7986CB",
    accentRgb: "121,134,203",
    yourSituation: `You did everything right according to the process. You followed the procedure. You got the sign-offs. You did not step outside your authority. And somewhere at the end of that correct procedure, something wrong happened to someone who did not deserve it. You didn't cause it directly. But you were in the room. And you did not stop it. And you have found a way to tell yourself that is not the same as participating.`,
    epicMoment: `Draupadi stood in the court and asked one question: "Was I staked before or after Yudhishthira had already lost himself at the dice? If he had no rights over himself, how could he stake me?" 

It was a perfect legal question. Nobody answered it. Not Bhishma, not Drona, not Vidura — men who knew the law better than anyone in that room. They had procedural knowledge and moral confusion. The rules did not clearly answer her question. And so they did nothing. They let procedure fill the space where judgment should have been.

Draupadi never forgot who was in that room. She never pretended it didn't happen.`,
    whatItReveals: `Procedure is not a substitute for judgment. "I followed the process" is a true statement that can coexist with "I was complicit in something wrong." Both can be simultaneously true. The discomfort you carry about this situation is not irrational guilt. It is accurate perception.`,
    theLesson: "Rules exist to produce justice. When they don't, the person in the room is not absolved by having followed them.",
    actions: [
      "Name what happened accurately to yourself — not in the language of procedure, but in plain human terms. Say out loud: 'Someone was harmed, I was present, and I did not act.'",
      "Find one thing you can do now — even after the fact — that moves toward the right outcome. Not to absolve yourself. Because it's the right thing.",
      "The next time you are in a room where something like this is happening, decide in advance: what is the line I will not let procedure substitute for judgment?",
    ],
    articleSlug: "draupadi-fire-and-dignity",
  },

  {
    id: "duty-04",
    domain: "duty",
    headline: "You are doing the right thing. It is costing you everything.",
    subline: "Integrity doesn't pay the rent. You are holding something nobody else will hold.",
    characterId: "karna",
    characterName: "Karna",
    accentHex: "#C2410C",
    accentRgb: "34,197,94",
    yourSituation: `You are doing what you believe is right — telling the truth when it would be easier to be quiet, standing for someone who can't stand for themselves, refusing to compromise something that matters. And you are watching it cost you. The relationship, the opportunity, the peace. People who took the easier path are doing fine. You are holding something that is genuinely heavy and you are doing it alone.

You don't regret it. But it is hard.`,
    epicMoment: `On the last day, Karna was in his chariot when his wheel sank into the mud. He got down to free it, which left him unarmed and unable to fight. His opponent, Arjuna, had Krishna beside him. In that moment, Karna called for the warrior's code — that you do not strike an unarmed man who is not in a position to defend himself. The code was real. It was the law of war. He had followed it himself, all his life.

Krishna told Arjuna to strike. He did.

Karna died doing what he believed was right — calling for a justice that the moment would not grant him.`,
    whatItReveals: `The right thing does not always produce the right outcome in the timeframe you are living in. Karna's integrity did not save him. But it is the reason his story is still told. The cost of doing the right thing is real. It is not made smaller by being right. But there is a difference between the life you live carrying that cost and the life you live having not paid it.`,
    theLesson: "Doing the right thing and having it work out are two different events. The first is within your control. The second is not.",
    actions: [
      "Name one person — living or not — who would recognise what you are doing right now as the correct thing. Hold that recognition. It matters even if they never know.",
      "Allow yourself to grieve the cost. Pretending it doesn't cost anything is its own kind of dishonesty.",
      "Make sure you are not making it harder than it has to be. Integrity does not require suffering. If there is a way to hold this principle with less personal cost, find it.",
    ],
    articleSlug: "karna-loyalty-vs-self-respect",
  },

  /* ════════════════════════════════════════
     IDENTITY & DAILY LIFE
  ════════════════════════════════════════ */
  {
    id: "id-01",
    domain: "identity",
    headline: "You don't know who you are outside of what you do for other people.",
    subline: "Someone asks what you enjoy. You hesitate. Then you describe what you're good at, not what you love.",
    characterId: "karna",
    characterName: "Karna",
    accentHex: "#C2410C",
    accentRgb: "34,197,94",
    yourSituation: `Your sense of who you are is almost entirely constructed from your usefulness to others. Your role as the reliable one, the productive one, the one people can count on. Take that away and you are not entirely sure what is left. You have not had enough time alone — or you have had too much time alone and discovered that the silence is uncomfortable. Either way, the question "who are you when nobody needs you" is one you do not have a clear answer to.`,
    epicMoment: `Karna was many things: a warrior, a son, a friend, a king, a man of extraordinary generosity. But almost all of those things were defined by his relation to someone else. The son of a charioteer. The friend of Duryodhana. The enemy of Arjuna. The abandoned child of Kunti.

He lived his entire life performing an identity that was always in reference to others. When Krishna, before the battle, told him the full truth — that he was actually the firstborn of the Pandavas, that he could have everything he'd been denied — Karna had no framework for that version of himself. He could not inhabit it. He had never built a self that didn't require an audience.`,
    whatItReveals: `The self that only exists in relation to others is not a full self. It is half of one. The other half — the part that knows what you like, what you believe when nobody is watching, what you would do if nobody needed anything from you — that half needs to be developed deliberately. It does not develop on its own.`,
    theLesson: "You are not only what you are useful for. That is the starting point, not the summary.",
    actions: [
      "Do one thing this week that is purely for yourself — not productive, not for anyone else, not because you should. Notice what you actually enjoy when nothing depends on it.",
      "Answer this honestly: if you woke up tomorrow and nobody needed anything from you, what would you do with the day? Whatever comes to mind first — take that seriously.",
      "Read about what Karna's full story — not the tragedy, but the possibility that existed in him that never got space to grow.",
    ],
    articleSlug: "karna-loyalty-vs-self-respect",
  },

  {
    id: "id-02",
    domain: "identity",
    headline: "You are standing between two worlds. You fully belong to neither.",
    subline: "Too different for where you came from. Not quite enough for where you're going.",
    characterId: "karna",
    characterName: "Karna",
    accentHex: "#C2410C",
    accentRgb: "34,197,94",
    yourSituation: `You grew up one way and became another. Maybe it's class, or education, or migration, or religion, or values that shifted. You go home and you are too much of what you've become. You go to the new world and you are not quite enough of what they want. The people around you in either place do not fully see you, because you are a version of yourself that requires context neither side has.

This is lonely in a specific way that is hard to explain to people who have only ever belonged completely to one place.`,
    epicMoment: `Karna was born a prince and raised a charioteer's son. He was trained in warfare at the highest levels — by the same teacher as the Pandavas — and was technically more skilled than most of them. But he could not compete as a warrior because of his lineage. He could not return to his birth family because they didn't know he existed. He was not fully Kaurava. He was not Pandava. He was not fully commoner.

He spent his entire life in the gap between what he was born to and what he was raised as, between what he deserved and what the world would allow.

He never resolved it. He chose it — chose the side that had accepted him, even if that side was wrong. Not because it was the wisest choice. Because it was the only place where he had ever fully been seen.`,
    whatItReveals: `The loneliness of the in-between is real. But living in the gap between worlds is also where the most interesting people come from. You understand things that people who only know one world cannot understand. The question is not how to fully belong to one side. The question is how to build something that is genuinely yours in the space between them.`,
    theLesson: "The gap between two worlds is uncomfortable. It is also, eventually, the most interesting place to stand.",
    actions: [
      "Find one other person who has made the same crossing you have. They exist. That specific shared experience is worth more than general community.",
      "Stop apologising for the parts of you that don't fit either world. Those parts are the truest ones — the ones you built yourself, without a template.",
      "Write about it. Not for publication. Just to make the experience concrete enough to understand. People who live in the gap often have things to say that nobody else can say.",
    ],
    articleSlug: "karna-loyalty-vs-self-respect",
  },

  {
    id: "id-03",
    domain: "identity",
    headline: "You've achieved what you said you wanted. You feel nothing.",
    subline: "The goal was real. The satisfaction that was supposed to come with it wasn't.",
    characterId: "arjuna",
    characterName: "Arjuna",
    accentHex: "#4CAF50",
    accentRgb: "76,175,80",
    yourSituation: `You got the thing. The job, the relationship, the degree, the recognition — whatever version of it belonged to you. And for a moment, maybe a day, maybe a week, it felt like something. Then it didn't. You are standing on the other side of the goal you spent years working toward, and the primary feeling is a kind of flat confusion. You are wondering if you are broken, or if you wanted the wrong thing, or if this is just how it feels and everyone else is pretending too.`,
    epicMoment: `At the end of the Mahabharata war, the Pandavas won. They got the kingdom back. The injustice was addressed. Justice, by the measure of the story, was done. Arjuna had fought with everything he had for eighteen days.

And then his closest relatives were dead. His teacher was dead. His son Abhimanyu was dead. Half of his world was gone to produce the outcome he had fought for.

The Pandavas eventually renounced the kingdom and walked into the mountains. Arjuna, the greatest warrior who ever lived, left it all behind. Not in defeat. In a different kind of clarity.`,
    whatItReveals: `Achievement and meaning are different things. You can get the achievement without the meaning. When that happens, it is not a sign that you failed. It is a sign that the goal was a placeholder — a thing you were moving toward while the real question waited. The flat feeling is not emptiness. It is the space where the next real question lives.`,
    theLesson: "Getting what you want is not the end of the search. Sometimes it is where the search actually begins.",
    actions: [
      "Sit with the flat feeling instead of immediately filling it with the next goal. It is telling you something. Give it enough quiet to say it.",
      "Ask: what did I think achieving this would give me? Trace back to the actual need. That need is still the real goal, and it is probably still unmet.",
      "Talk to someone who has been where you are. Not for advice — just for the relief of knowing the feeling has a name.",
    ],
    articleSlug: "arjuna-confusion-moment-of-doubt",
  },

  {
    id: "id-04",
    domain: "identity",
    headline: "You are angry. The anger is justified. But it's starting to consume you.",
    subline: "You were right to be angry. Now the anger is making decisions that should be yours to make.",
    characterId: "draupadi",
    characterName: "Draupadi",
    accentHex: "#E53935",
    accentRgb: "229,57,53",
    yourSituation: `Something was done to you that should not have been done. Your anger about it is correct. It was wrong. The problem is that the anger has grown past the event. It is now influencing how you see everything — your relationships, your decisions, your sense of who you are. You are aware of this. You are not entirely sure what to do about it, because the alternatives feel like either denying what happened or forgiving what should not have been done.`,
    epicMoment: `Draupadi's anger lasted thirteen years. From the day she was wronged in the court, through thirteen years of exile, through every hardship and indignity, she carried it. She reminded her husbands — when they were tempted to make peace, when they were growing weary — of what had been done. Her anger was the fire that kept the purpose burning when the people around her might have let it go.

But she also paid a price for carrying it that long. She was magnificent and she was also, in some moments, so consumed by what was owed to her that she could not fully inhabit the present.

There is a scene near the end where, asked what virtue had sustained her through her suffering, she named her own self-possession — not her righteousness, not her anger, but her capacity to remain herself.`,
    whatItReveals: `Anger is information. It tells you something real about what happened and what you need. But information, held too long without being acted on, becomes noise. The question is not whether the anger is justified — it is. The question is whether it is serving you now or whether it is starting to be the thing that runs your life.`,
    theLesson: "Justified anger is a beginning. It was never meant to be a permanent address.",
    actions: [
      "Name what the anger is actually asking for. Justice? Recognition? An apology? Safety? The anger is a request. Get specific about what you are actually requesting.",
      "Decide what you would need to happen to let some of it go. You don't have to let it go now. But know what the conditions are.",
      "Find one relationship or one space in your life where you are not the angry person. Protect that space. You need somewhere to be the full version of yourself, not only the wronged version.",
    ],
    articleSlug: "draupadi-fire-and-dignity",
  },

  {
    id: "id-05",
    domain: "identity",
    headline: "You keep making the same mistake. You know you do it. You cannot stop.",
    subline: "The pattern is clear to you. That clarity hasn't made it stop.",
    characterId: "arjuna",
    characterName: "Arjuna",
    accentHex: "#4CAF50",
    accentRgb: "76,175,80",
    yourSituation: `You can see it coming. You have seen it before. You know the sequence — the trigger, the feeling, the response, the regret. And yet, in the moment, you do the same thing again. Maybe it is how you react to criticism, or how you behave when you feel insecure, or a pattern in who you choose to love, or a habit around money or work or conflict. The self-awareness is real and it is, on its own, completely ineffective.`,
    epicMoment: `Arjuna's doubt on the battlefield was not a one-time thing. His crisis at Kurukshetra was the culmination of a pattern that had played out many times — the gifted person who, at the exact moment of greatest consequence, freezes. Who retreats into paralysis when the stakes are highest.

Krishna did not fix this by removing the doubt. He addressed it by giving Arjuna a framework for thinking about duty and action that was larger than the doubt itself. The doubt didn't go away. Arjuna developed something stronger to stand on than the absence of doubt.`,
    whatItReveals: `Insight without structure doesn't change behaviour. You can understand a pattern perfectly and still be unable to interrupt it, because understanding alone doesn't give you an alternative path in the moment it is happening. What you need is not more self-awareness. It is a practice that works at the speed of the trigger.`,
    theLesson: "Knowing why you do something does not automatically stop you from doing it. You need a faster intervention than understanding.",
    actions: [
      "Pick one trigger and design one specific response you will try next time. Not 'I'll be more aware' — a concrete action. 'When X happens, I will do Y before I do the thing I always do.'",
      "Tell one person who will see the pattern in action. Give them permission to name it when they see it. External interruption works when internal interruption doesn't.",
      "Stop measuring progress by whether the pattern has disappeared. Measure it by whether you are recovering faster each time. That is the actual direction of change.",
    ],
    articleSlug: "arjuna-confusion-moment-of-doubt",
  },

  {
    id: "id-06",
    domain: "identity",
    headline: "You need to forgive someone. You know it. You cannot bring yourself to do it.",
    subline: "Forgiveness feels like saying it was okay. It was not okay. And you cannot pretend it was.",
    characterId: "draupadi",
    characterName: "Draupadi",
    accentHex: "#E53935",
    accentRgb: "229,57,53",
    yourSituation: `Someone hurt you in a way that mattered. They may have apologised or they may not have. Either way, you have not fully let it go. And the part of you that will not let it go believes, not wrongly, that forgiveness equals permission — that releasing the anger means saying the thing that happened was acceptable. You know intellectually that forgiveness is supposed to be for you, not for them. That knowledge has not yet made its way to the place where the hurt actually lives.`,
    epicMoment: `In the moments after the Mahabharata war ended, Draupadi stood on a battlefield where every major Kaurava was dead. Everything she had called for had come to pass. The justice she had carried for thirteen years had been delivered.

She did not feel peace. She felt grief. And some of what she grieved was herself — the years spent in the burning. The things she had held onto long after they needed to be held.

She had won. And in winning, she found that victory and peace are not the same thing. The peace had to be chosen separately, after the war was over.`,
    whatItReveals: `Forgiveness is not a statement about what happened. It is a statement about where you are choosing to live now — inside the wound, or outside it. It does not require the other person to have changed or apologised or acknowledged anything. It is a private act of deciding that the event gets to live in the past rather than the present. You can do this without ever speaking to the person. You can do it while still knowing, clearly, that what they did was wrong.`,
    theLesson: "Forgiveness is not pretending it didn't happen. It is choosing to stop paying rent in the house that it built.",
    actions: [
      "Write a letter you will never send. Say everything — the anger, the grief, the specific things they took from you. Then say what you are choosing to do with it. Don't send it. The act is for you.",
      "Separate the forgiveness from the relationship. You can forgive someone fully and still never speak to them again. The two are not connected.",
      "Be patient with yourself. Forgiveness is rarely a single event. It is a direction. It happens incrementally, and it often has to be chosen more than once.",
    ],
    articleSlug: "draupadi-fire-and-dignity",
  },

  {
    id: "id-07",
    domain: "identity",
    headline: "You grew up being told you were not enough. Part of you still believes it.",
    subline: "You have achieved things that should have settled this. They haven't.",
    characterId: "karna",
    characterName: "Karna",
    accentHex: "#C2410C",
    accentRgb: "34,197,94",
    yourSituation: `It was not always said directly. Sometimes it was a look, or a comparison, or a silence where encouragement should have been. You were too much of some things and not enough of others, and the message — repeated enough times — became a belief. You have done enough in your life to know, intellectually, that it isn't true. But the belief lives below the intellect. It shows up when you are about to do something good and tells you not to bother. When you are in a room of people you respect and tells you you don't belong there.`,
    epicMoment: `Karna was told, from the moment the world discovered who he was, that he did not belong. Not in the tournament. Not in the halls of power. Not with the warriors who were his equals. He was reminded of his origin — the charioteer's son — by people who were afraid of him, because only someone afraid of what he was capable of would need to remind him of where he came from.

He became one of the greatest warriors in recorded history while being told, regularly, that he was not good enough to compete.

He proved them wrong every time he picked up his bow. He never stopped hurting from it. Both of those things were true.`,
    whatItReveals: `The voice that says you're not enough is not a truthful voice. It is an old recording from a time when you were small and the people around you had all the power. You have grown past the circumstances that created it. The voice has not. It does not update automatically. That is something you have to do deliberately, with patience, over a long time.`,
    theLesson: "You have been proving them wrong for years. At some point, you have to also stop needing to prove it.",
    actions: [
      "Notice the next time the voice shows up and ask it: whose voice is this originally? Whose assessment of you does it carry? Put it in context.",
      "Make a list — a real list, not a mental one — of things you have done that the person who said you weren't enough would not have predicted. Read it when you need to.",
      "Find a therapist if you haven't. Not because there is something wrong with you. Because this is real work and you deserve support that is specifically designed for it.",
    ],
    articleSlug: "karna-loyalty-vs-self-respect",
  },

  {
    id: "id-08",
    domain: "identity",
    headline: "You are paralysed by a decision that only you can make.",
    subline: "You have asked everyone. You have read everything. You already know what you need to do.",
    characterId: "arjuna",
    characterName: "Arjuna",
    accentHex: "#4CAF50",
    accentRgb: "76,175,80",
    yourSituation: `You have been in this decision for longer than makes sense. You have gathered more information than is required. You have asked people whose answers you already knew before you asked. The research has become a form of procrastination, and you know it. Somewhere in you, beneath all the information-gathering, is the knowledge of what you need to do — and a very good reason to be afraid of it.`,
    epicMoment: `Arjuna, on the morning of Kurukshetra, did not need more information. He knew everything. He had Krishna beside him, who was — depending on how you read the text — either a brilliant strategist or the universe itself. He had the bow that was made for him. He had trained his entire life for exactly this.

He still put it down.

The Bhagavad Gita is not a book of information. Arjuna had all the information. It is a book about why a person with everything they need still cannot act — and what it takes to move from knowledge to action.`,
    whatItReveals: `At a certain point, more information is not what you need. You need the courage to do the thing you already know you should do, with the full knowledge that it might be costly. The decision has already been made somewhere in you. The deliberation now is not analysis — it is grief about the cost of the action. Let yourself grieve it. Then act.`,
    theLesson: "You do not need more information. You need to make peace with the cost of the decision you have already made.",
    actions: [
      "Set a deadline. Not 'I'll decide soon' — a date, this week, by which you will have made the call and communicated it. Tell someone the deadline so it exists outside your head.",
      "Write down what you are afraid will happen if you make the decision you are leaning toward. Name the fear precisely. Then ask: how likely is that, really?",
      "Make the decision and give yourself 48 hours before you revisit it. Notice how it feels to have decided, regardless of the outcome.",
    ],
    articleSlug: "arjuna-confusion-moment-of-doubt",
  },
];

export const getScenariosByDomain = (domain: Domain) =>
  scenarios.filter((s) => s.domain === domain);

export const getScenarioById = (id: string) =>
  scenarios.find((s) => s.id === id);

export const getAllDomains = (): Domain[] =>
  ["family", "workplace", "duty", "identity"];

/* ─────────────────────────────────────────────
   Per-locale content overrides — Phase 1 covers FAMILY only.
   Each locale JSON maps scenario id → translated string fields.
   Missing scenarios (not yet translated) fall back to English per-id.
───────────────────────────────────────────── */
import teData from "./wisdom-locales/te.json";
import hiData from "./wisdom-locales/hi.json";
import knData from "./wisdom-locales/kn.json";

type LocaleOverride = Partial<Pick<WisdomScenario,
  "characterName" | "headline" | "subline"
  | "yourSituation" | "epicMoment" | "whatItReveals" | "theLesson" | "actions"
>>;
type LocaleFile = Record<string, LocaleOverride>;

const LOCALE_DATA: Record<"te" | "hi" | "kn", LocaleFile> = {
  te: teData as LocaleFile,
  hi: hiData as LocaleFile,
  kn: knData as LocaleFile,
};

/** Returns the scenario with locale-specific fields applied where available.
 *  Falls back to the English source per-field if no override exists. */
export function localizeScenario(s: WisdomScenario, locale: string): WisdomScenario {
  const code = locale?.slice(0, 2);
  if (code === "en" || !(code in LOCALE_DATA)) return s;
  const overrides = LOCALE_DATA[code as "te" | "hi" | "kn"][s.id];
  return overrides ? { ...s, ...overrides } : s;
}

/** How many scenarios are translated for `locale` — used by the disclaimer
 *  banner to tell the user how much of /wisdom is in their language. */
export function localizedCoverage(locale: string): { translated: number; total: number } {
  const code = locale?.slice(0, 2);
  if (code === "en" || !(code in LOCALE_DATA)) return { translated: 0, total: scenarios.length };
  const data = LOCALE_DATA[code as "te" | "hi" | "kn"];
  return { translated: Object.keys(data).length, total: scenarios.length };
}
