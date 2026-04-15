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
    accentHex: "#D4AF37",
    accentRgb: "212,175,55",
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
   8 questions × 5 answers each = 40 total answers
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
];

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length; // 8
