export type CharacterId = "karna" | "krishna" | "arjuna" | "draupadi" | "bhishma";

export interface QuizAnswer {
  id: string;
  text: string;
  character: CharacterId;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle?: string;
  answers: QuizAnswer[];
}

export interface QuizResult {
  winner: CharacterId;
  scores: Record<CharacterId, number>;
  isTie: boolean;
  tiedWith?: CharacterId;
  percentage: number;
}

export const CHARACTER_META: Record<
  CharacterId,
  {
    name: string;
    title: string;
    accentHex: string;
    accentRgb: string;
    imageKey: "karna" | "krishna" | "arjuna" | "draupadi" | "bhishma";
    articleSlug: string;
    resultInsight: string;
    archetype: string;
    traits: string[];
  }
> = {
  karna: {
    name: "Karna",
    title: "The Loyal Warrior",
    accentHex: "#C2410C",
    accentRgb: "194,65,12",
    imageKey: "karna",
    articleSlug: "karna-loyalty-vs-self-respect",
    archetype: "The Devoted One",
    traits: ["Unconditional Loyalty", "Fierce Generosity", "Quiet Honour", "Dignified Endurance"],
    resultInsight:
      "You are someone who keeps their word even when the world gives you every reason not to. Your loyalty runs deeper than strategy — which makes you the most trusted person in any room, and occasionally the most betrayed. You don't give your commitment lightly. But once given, it is unconditional. You understand, at a cellular level, what it means to be seen by the right person at the right moment — and you never forget it.",
  },
  krishna: {
    name: "Krishna",
    title: "The Strategic Mind",
    accentHex: "#4A90D9",
    accentRgb: "74,144,217",
    imageKey: "krishna",
    articleSlug: "krishna-leadership-secrets",
    archetype: "The Illuminator",
    traits: ["Cosmic Vision", "Strategic Clarity", "Effortless Leadership", "Measured Restraint"],
    resultInsight:
      "You see the larger picture when everyone else is reacting to the immediate moment. People around you often don't realise how much you're doing — because the best of your work is invisible. You guide rather than command, illuminate rather than instruct. Your power lies not in what you do, but in the conditions you create for the right things to happen.",
  },
  arjuna: {
    name: "Arjuna",
    title: "The Courageous Doubter",
    accentHex: "#4CAF50",
    accentRgb: "76,175,80",
    imageKey: "arjuna",
    articleSlug: "arjuna-confusion-moment-of-doubt",
    archetype: "The Seeker",
    traits: ["Extraordinary Skill", "Honest Self-Doubt", "Devoted Focus", "Hard-Won Courage"],
    resultInsight:
      "You have extraordinary capability and genuine self-awareness — and the gap between those two things is where your story lives. Your doubt is not weakness. It is the same quality that makes you capable of the deepest understanding. The Bhagavad Gita wasn't spoken to the strongest warrior. It was spoken to the most honest one.",
  },
  draupadi: {
    name: "Draupadi",
    title: "The Unyielding Voice",
    accentHex: "#E53935",
    accentRgb: "229,57,53",
    imageKey: "draupadi",
    articleSlug: "draupadi-fire-and-dignity",
    archetype: "The Truth-Teller",
    traits: ["Fierce Dignity", "Incisive Clarity", "Enduring Strength", "Uncompromised Justice"],
    resultInsight:
      "You see injustice with painful clarity — and unlike most people, you say so. Your dignity is not something you perform. It is something you live. You ask the questions no one else dares to ask, because you understand, at a level others don't, that silence is also a choice — and usually the wrong one.",
  },
  bhishma: {
    name: "Bhishma",
    title: "The Steadfast Elder",
    accentHex: "#7986CB",
    accentRgb: "121,134,203",
    imageKey: "bhishma",
    articleSlug: "bhishma-terrible-oath",
    archetype: "The Keeper of Oaths",
    traits: ["Absolute Discipline", "Unshakeable Honour", "Immense Sacrifice", "Quiet Authority"],
    resultInsight:
      "You are the person who holds things together through sheer reliability. Your commitments are sacred to you — sometimes to a fault. The qualities that make you extraordinary are the same ones that occasionally make you complicit in outcomes you never intended. The hardest question the Mahabharata asks of you: when does keeping your word become its own kind of cowardice?",
  },
};

/* ─────────────────────────────────────────────────────────
   QUESTIONS
   15 questions × 5 answers each = 75 total answers
   Each answer maps to exactly ONE character
   Every character appears exactly once per question
───────────────────────────────────────────────────────── */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "When you're denied something you clearly earned, you...",
    subtitle: "Think about how you've actually responded, not how you wish you had.",
    answers: [
      { id: "1a", text: "Stand up and call it out immediately, even if it makes everyone uncomfortable.", character: "draupadi" },
      { id: "1b", text: "Accept it outwardly but never forget — and make sure you never need them again.", character: "karna" },
      { id: "1c", text: "Feel deeply hurt but find it hard to challenge the situation in the moment.", character: "arjuna" },
      { id: "1d", text: "Look for a different way to get what you need — confrontation is rarely the most efficient path.", character: "krishna" },
      { id: "1e", text: "Honour the process, even when the process failed you. Systems matter.", character: "bhishma" },
    ],
  },
  {
    id: 2,
    question: "Your closest friend is making a serious mistake. You...",
    subtitle: "Not the version of you that gives advice. The version of you that actually lives it.",
    answers: [
      { id: "2a", text: "Follow them into it. Loyalty doesn't come with conditions.", character: "karna" },
      { id: "2b", text: "Create the situation in which they arrive at the realisation themselves.", character: "krishna" },
      { id: "2c", text: "Know they're wrong but struggle to say it — and spend weeks regretting your silence.", character: "arjuna" },
      { id: "2d", text: "Say exactly what needs to be said, right now, regardless of how they'll take it.", character: "draupadi" },
      { id: "2e", text: "Offer your perspective once, clearly, and then step back. It's not your decision.", character: "bhishma" },
    ],
  },
  {
    id: 3,
    question: "What drives you more than anything else?",
    answers: [
      { id: "3a", text: "Keeping a promise, no matter what it costs me personally.", character: "karna" },
      { id: "3b", text: "Making sure the right outcome happens — not necessarily my outcome.", character: "krishna" },
      { id: "3c", text: "Being the best at what I do. Mastery is the point.", character: "arjuna" },
      { id: "3d", text: "Getting justice for those who can't get it themselves.", character: "draupadi" },
      { id: "3e", text: "Fulfilling the role I was given to the very best of my ability.", character: "bhishma" },
    ],
  },
  {
    id: 4,
    question: "You're approaching the biggest moment of your life. You...",
    answers: [
      { id: "4a", text: "Fight with everything you have, knowing the odds may still be against you.", character: "karna" },
      { id: "4b", text: "Are calm. You've prepared for exactly this. You trust the process.", character: "krishna" },
      { id: "4c", text: "Freeze. Then find your answer. Then act — late, but with complete conviction.", character: "arjuna" },
      { id: "4d", text: "Speak the one truth no one else in the room is willing to say.", character: "draupadi" },
      { id: "4e", text: "Execute what the role requires, regardless of how you personally feel about it.", character: "bhishma" },
    ],
  },
  {
    id: 5,
    question: "If you're being completely honest, your biggest flaw is...",
    subtitle: "The one people who love you recognise, even if they don't say it.",
    answers: [
      { id: "5a", text: "I stay loyal past the point where loyalty still makes sense.", character: "karna" },
      { id: "5b", text: "I'm too strategic. People sometimes need warmth, not a plan.", character: "krishna" },
      { id: "5c", text: "I doubt myself most in the moments that need decisiveness.", character: "arjuna" },
      { id: "5d", text: "I hold on to injustice when letting go might actually serve me better.", character: "draupadi" },
      { id: "5e", text: "My sense of duty makes me complicit in things I know, deep down, are wrong.", character: "bhishma" },
    ],
  },
  {
    id: 6,
    question: "When a system — a company, a relationship, a rule — fails someone you care about, you...",
    answers: [
      { id: "6a", text: "Rage quietly while doing everything in your power to compensate for what it failed to provide.", character: "karna" },
      { id: "6b", text: "Work around the system to protect them. Systems are just tools.", character: "krishna" },
      { id: "6c", text: "Feel guilty that you didn't see it coming or act sooner.", character: "arjuna" },
      { id: "6d", text: "Take action immediately, publicly, and without apology.", character: "draupadi" },
      { id: "6e", text: "Accept it. The system is what it is. Working inside it is the only real option.", character: "bhishma" },
    ],
  },
  {
    id: 7,
    question: "Your relationship with the truth is...",
    answers: [
      { id: "7a", text: "I protect people from it when I believe it will cause them unnecessary harm.", character: "karna" },
      { id: "7b", text: "I use it precisely — timing transforms whether truth heals or destroys.", character: "krishna" },
      { id: "7c", text: "I know it but find it hard to act on it right away. I process first.", character: "arjuna" },
      { id: "7d", text: "I speak it regardless of how inconvenient it is for everyone, including me.", character: "draupadi" },
      { id: "7e", text: "I follow it literally, even when the literal truth violates its own spirit.", character: "bhishma" },
    ],
  },
  {
    id: 8,
    question: "At the very end, I want to be remembered as someone who...",
    answers: [
      { id: "8a", text: "Never abandoned a person who once stood up for them.", character: "karna" },
      { id: "8b", text: "Made people more capable and clear than they'd have been alone.", character: "krishna" },
      { id: "8c", text: "Faced their fear — and acted anyway.", character: "arjuna" },
      { id: "8d", text: "Demanded dignity — and got it.", character: "draupadi" },
      { id: "8e", text: "Kept their word across a lifetime of tests.", character: "bhishma" },
    ],
  },
  {
    id: 9,
    question: "Someone gives you a gift when you needed it most. Years later, they ask for something you know is wrong. You...",
    subtitle: "This is not hypothetical. You've been here.",
    answers: [
      { id: "9a", text: "Help them. The debt is real regardless of what they're asking.", character: "karna" },
      { id: "9b", text: "Find a way to serve the spirit of what they need without endorsing what's wrong.", character: "krishna" },
      { id: "9c", text: "Feel paralysed. The gratitude and the wrongness are both real and you can't resolve them.", character: "arjuna" },
      { id: "9d", text: "Refuse clearly. Gratitude doesn't require you to compromise what you know is right.", character: "draupadi" },
      { id: "9e", text: "Help them, because honouring commitments matters more than judging their choices.", character: "bhishma" },
    ],
  },
  {
    id: 10,
    question: "You've been working toward something for years. Someone else gets there first — and they're less qualified. You...",
    answers: [
      { id: "10a", text: "Keep going. What's owed to you will find its way to you, or it won't — but you don't stop.", character: "karna" },
      { id: "10b", text: "Reframe. This is information about the game, not a verdict on your worth.", character: "krishna" },
      { id: "10c", text: "Spiral briefly, then refocus — after you've given yourself time to actually feel it.", character: "arjuna" },
      { id: "10d", text: "Speak up. The injustice deserves to be named, even if it costs you.", character: "draupadi" },
      { id: "10e", text: "Accept it. The process gave them the role. Working inside that reality is what the role requires.", character: "bhishma" },
    ],
  },
  {
    id: 11,
    question: "When you love someone, your version of love looks most like...",
    subtitle: "Not the version you aspire to. The version that actually shows up.",
    answers: [
      { id: "11a", text: "Showing up, no matter what. Consistently, quietly, without keeping score.", character: "karna" },
      { id: "11b", text: "Creating the conditions for them to be their best self — even when they don't see what that is yet.", character: "krishna" },
      { id: "11c", text: "Being present and skilled in the moments that matter, even when I struggle to say the words.", character: "arjuna" },
      { id: "11d", text: "Speaking the truth they need to hear, because that is more loving than comfort.", character: "draupadi" },
      { id: "11e", text: "Reliability. Being the person they can always count on, whatever the cost to me.", character: "bhishma" },
    ],
  },
  {
    id: 12,
    question: "You are in a room where something wrong is happening. You have the power to stop it. You...",
    answers: [
      { id: "12a", text: "Want to, but the loyalty I owe the people in the room holds me in place.", character: "karna" },
      { id: "12b", text: "Calculate what intervention actually changes things versus what just makes me feel better.", character: "krishna" },
      { id: "12c", text: "Feel the wrongness acutely but freeze — and hate myself for it later.", character: "arjuna" },
      { id: "12d", text: "Act. This is exactly what power is for.", character: "draupadi" },
      { id: "12e", text: "Say something measured and then defer to the process. Not my role to override the room.", character: "bhishma" },
    ],
  },
  {
    id: 13,
    question: "What does failure feel like for you?",
    subtitle: "The private experience, not the public one.",
    answers: [
      { id: "13a", text: "Like the world confirming what it always thought of me. So I don't let it show.", character: "karna" },
      { id: "13b", text: "Like useful data. Something to work with, not something to be worked over by.", character: "krishna" },
      { id: "13c", text: "Like a verdict. I know it's not, but it takes time to separate those things.", character: "arjuna" },
      { id: "13d", text: "Like fuel. Failure makes me more determined, not less.", character: "draupadi" },
      { id: "13e", text: "Like a deviation from standard. I analyse it, correct course, and continue.", character: "bhishma" },
    ],
  },
  {
    id: 14,
    question: "You've held onto something — a grudge, a grief, a goal — longer than most people would. Why?",
    answers: [
      { id: "14a", text: "Because letting go felt like admitting what they did to me was acceptable.", character: "karna" },
      { id: "14b", text: "Because I was waiting for the right moment. Timing is the whole game.", character: "krishna" },
      { id: "14c", text: "I'm not sure. I think I'm still figuring out what I'm actually holding and why.", character: "arjuna" },
      { id: "14d", text: "Because it wasn't resolved. I don't release things that aren't finished.", character: "draupadi" },
      { id: "14e", text: "Because it was a commitment. You honour commitments. That is what they are for.", character: "bhishma" },
    ],
  },
  {
    id: 15,
    question: "The version of yourself you are most at peace with is...",
    subtitle: "Not who you want to be. Who you are when you stop pretending.",
    answers: [
      { id: "15a", text: "The one who kept their word even when it cost everything.", character: "karna" },
      { id: "15b", text: "The one who saw clearly and acted from that clarity, without needing the credit.", character: "krishna" },
      { id: "15c", text: "The one who found the courage they thought they didn't have — even if it came late.", character: "arjuna" },
      { id: "15d", text: "The one who said what needed to be said and refused to be diminished.", character: "draupadi" },
      { id: "15e", text: "The one who held the line, across decades, without complaint.", character: "bhishma" },
    ],
  },
];

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length; // 15
