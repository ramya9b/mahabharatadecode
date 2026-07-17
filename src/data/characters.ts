export interface CharacterTrait {
  label: string;
  icon: string;
}

export interface CharacterStat {
  label: string;
  value: number; // 0–100
}

export interface Character {
  id: string;
  name: string;
  title: string;
  archetype: "Warrior" | "Divine" | "Royalty" | "Elder";
  imageKey: "karna" | "krishna" | "arjuna" | "draupadi" | "bhishma" | "yudhishthira" | "duryodhana" | "abhimanyu" | "gandhari";
  epithets: string[];
  traits: CharacterTrait[];
  bio: string[];
  quote: string;
  quoteSource: string;
  lesson: string;
  articleSlug: string;
  accentHex: string;
  accentRgb: string;
  stats: CharacterStat[];
  parva: string; // which book/parva their story peaks in
  weapon?: string;
  alliance: "Pandava" | "Kaurava" | "Divine" | "Both";
  /** Shown on the character profile page — what resonating with this character says about you */
  personalityInsight?: string;
}

export const characters: Character[] = [
  {
    id: "karna",
    name: "Karna",
    title: "The Tragic Hero",
    archetype: "Warrior",
    imageKey: "karna",
    epithets: ["Surya Putra", "Radheya", "Daanveer Karna", "Vaikartana"],
    traits: [
      { label: "Loyalty", icon: "🤝" },
      { label: "Generosity", icon: "🌊" },
      { label: "Honour", icon: "⚔️" },
      { label: "Courage", icon: "🔥" },
    ],
    bio: [
      "Born to a queen, abandoned on a river, raised by a charioteer — Karna's life began as a story of stolen destiny. He possessed divine armour at birth and trained under Parashurama, the greatest weapons master who ever lived.",
      "When the world denied him entry because of his lineage, Duryodhana alone crowned him King of Anga. From that moment, Karna's loyalty became absolute — and ultimately, his undoing.",
    ],
    quote:
      "I was given a kingdom when I had nothing. To abandon that king now, when he needs me most, would be the greatest adharma I could commit.",
    quoteSource: "Udyoga Parva",
    lesson:
      "Loyalty is only noble when the cause it serves is just. Self-worth is forged through action, not ancestry — but blind gratitude can chain even the greatest soul.",
    articleSlug: "karna-loyalty-vs-self-respect",
    accentHex: "#22C55E",
    accentRgb: "34,197,94",
    parva: "Karna Parva",
    weapon: "Vasavi Shakti",
    alliance: "Kaurava",
    personalityInsight: "You are someone who keeps their word even when the world gives you every reason not to. Your loyalty runs deeper than strategy — which makes you the most trusted person in any room, and occasionally the most betrayed. You don't give your commitment lightly. But once given, it is unconditional. You understand, at a cellular level, what it means to be seen by the right person at the right moment — and you never forget it. The cost of this is that you sometimes stay in situations past the point where staying serves you, because leaving feels like a betrayal of who you are.",
    stats: [
      { label: "Warrior Skill", value: 98 },
      { label: "Wisdom", value: 72 },
      { label: "Loyalty", value: 100 },
      { label: "Sacrifice", value: 95 },
      { label: "Dharma", value: 65 },
    ],
  },
  {
    id: "krishna",
    name: "Krishna",
    title: "The Divine Strategist",
    archetype: "Divine",
    imageKey: "krishna",
    epithets: ["Govinda", "Madhava", "Keshava", "Vasudeva", "Giridhari"],
    traits: [
      { label: "Wisdom", icon: "🌅" },
      { label: "Strategy", icon: "🎯" },
      { label: "Compassion", icon: "💛" },
      { label: "Vision", icon: "✨" },
    ],
    bio: [
      "The eighth avatar of Vishnu, Krishna never drew a weapon during the eighteen days of Kurukshetra. His chariot carried no army, only a flute player who had put down his instrument to become the universe's greatest strategist.",
      "At the court of Hastinapura, he asked for five villages as the price of peace. When Duryodhana refused, Krishna said nothing more — and let the refusal speak for itself. That silence was the strategy.",
    ],
    quote:
      "A person reveals their character not in crisis, but in the smallest moments when they believe no one is watching closely enough to judge them.",
    quoteSource: "Udyoga Parva",
    lesson:
      "True leadership serves a purpose greater than the self. The most powerful leader is the one who makes others capable — not the one who does everything alone.",
    articleSlug: "krishna-leadership-secrets",
    accentHex: "#4A90D9",
    accentRgb: "74,144,217",
    parva: "Bhagavad Gita / Udyoga Parva",
    weapon: "Sudarshana Chakra",
    alliance: "Divine",
    personalityInsight: "You see the larger picture when everyone else is reacting to the immediate moment. People around you often don't realise how much you're doing — because the best of your work is invisible. You guide rather than command, illuminate rather than instruct. Your power lies not in what you do but in the conditions you create for the right things to happen. The risk in this mode is that you can become so focused on the outcome that people experience you as strategic rather than present. The Gita is also a reminder addressed to you: that you are allowed to be fully here, not just usefully here.",
    stats: [
      { label: "Warrior Skill", value: 100 },
      { label: "Wisdom", value: 100 },
      { label: "Loyalty", value: 88 },
      { label: "Sacrifice", value: 85 },
      { label: "Dharma", value: 100 },
    ],
  },
  {
    id: "arjuna",
    name: "Arjuna",
    title: "The Supreme Archer",
    archetype: "Warrior",
    imageKey: "arjuna",
    epithets: ["Dhananjaya", "Partha", "Kiriti", "Savyasachi", "Bibhatsu"],
    traits: [
      { label: "Mastery", icon: "🏹" },
      { label: "Devotion", icon: "🙏" },
      { label: "Focus", icon: "👁️" },
      { label: "Courage", icon: "⚡" },
    ],
    bio: [
      "Trained by Dronacharya, blessed by Indra, armed by the fire god, and guided by Krishna — Arjuna was the finest archer who ever lived. He saw only the eye of the fish when all others saw the fish, the branch, the tree, the sky.",
      "On the morning of Kurukshetra, the greatest warrior in the world put down his bow and sat on the floor of his chariot. In that breakdown, the Bhagavad Gita was born.",
    ],
    quote:
      "Of what use is victory if it means killing these — my own teachers, my own kin? I would rather beg in the streets than rule a kingdom built on their corpses.",
    quoteSource: "Bhagavad Gita 1.32–35",
    lesson:
      "Doubt is not weakness — it is the beginning of wisdom. The most profound understanding you will ever receive will come through your deepest confusion, not your greatest confidence.",
    articleSlug: "arjuna-confusion-moment-of-doubt",
    accentHex: "#4CAF50",
    accentRgb: "76,175,80",
    parva: "Bhishma Parva / Drona Parva",
    weapon: "Gandiva (divine bow)",
    alliance: "Pandava",
    personalityInsight: "You feel things deeply before you act — and sometimes the depth of feeling slows the action in ways that frustrate you and the people who depend on you. Your doubt is not weakness. It is the sign of someone for whom the stakes are real. You have a gift for mastery, and a recurring fear that mastery won't be enough. The moment Arjuna drops his bow is the moment that makes him worth following — because it is the moment he stops performing courage and starts actually finding it. That is what you do, too. Slowly, then completely.",
    stats: [
      { label: "Warrior Skill", value: 97 },
      { label: "Wisdom", value: 85 },
      { label: "Loyalty", value: 90 },
      { label: "Sacrifice", value: 78 },
      { label: "Dharma", value: 82 },
    ],
  },
  {
    id: "draupadi",
    name: "Draupadi",
    title: "The Fire-Born Queen",
    archetype: "Royalty",
    imageKey: "draupadi",
    epithets: ["Panchali", "Yajnaseni", "Krishnaa", "Mahabhagi", "Sairandhri"],
    traits: [
      { label: "Dignity", icon: "👑" },
      { label: "Resilience", icon: "🔥" },
      { label: "Justice", icon: "⚖️" },
      { label: "Strength", icon: "💎" },
    ],
    bio: [
      "Born from sacred fire during a yajna, Draupadi arrived in the world already destined to shake the foundations of the Kuru dynasty. She chose Arjuna at her swayamvara — and became wife to five brothers by a single careless word.",
      "When she was staked in a gambling game and dragged into the court of Hastinapura, she asked one question that no Bhishma, no Drona, no Vidura could answer. That question made a war inevitable.",
    ],
    quote:
      "Tell me — was I staked before or after Yudhishthira had already lost himself? If he had no rights over himself, how could he stake me?",
    quoteSource: "Sabha Parva",
    lesson:
      "Dignity is not given to you — it is claimed by you. One question spoken at exactly the right moment can change the course of history. Never mistake endurance for acceptance.",
    articleSlug: "draupadi-fire-and-dignity",
    accentHex: "#E53935",
    accentRgb: "229,57,53",
    parva: "Sabha Parva / Vana Parva",
    alliance: "Pandava",
    personalityInsight: "You speak the truth others won't say, even when — especially when — the room would prefer you stayed quiet. Your dignity is not something you perform. It is something you live. You ask the questions no one else dares to ask, because you understand that silence is also a choice — and usually the wrong one. The cost of this is real: you are often the person who holds the emotional weight of the situations you walk into. You carry more than you were asked to. What Draupadi shows is that this is not a flaw to fix. It is the thing that makes you the most important person in any room.",
    stats: [
      { label: "Warrior Skill", value: 40 },
      { label: "Wisdom", value: 90 },
      { label: "Loyalty", value: 85 },
      { label: "Sacrifice", value: 92 },
      { label: "Dharma", value: 94 },
    ],
  },
  {
    id: "bhishma",
    name: "Bhishma",
    title: "The Grand Patriarch",
    archetype: "Elder",
    imageKey: "bhishma",
    epithets: ["Devavrata", "Pitamaha", "Gangaputra", "Shantanava", "Bhishma Pitamah"],
    traits: [
      { label: "Sacrifice", icon: "🕯️" },
      { label: "Honour", icon: "🛡️" },
      { label: "Strength", icon: "⚔️" },
      { label: "Discipline", icon: "🌿" },
    ],
    bio: [
      "Son of the goddess Ganga, trained by Parashurama, heir to the greatest throne in India — Devavrata gave up everything. His birthright, his right to marry, his right to father children. All surrendered in a single moment to make his father happy.",
      "The vow was so absolute that the gods themselves renamed him Bhishma — he of the terrible oath. He became the most powerful man in Hastinapura, and the most powerless. He served whoever sat on the throne, regardless of their worthiness.",
    ],
    quote:
      "A man can have great power and great goodness and still, through a single misplaced commitment, become an instrument of great harm.",
    quoteSource: "Shanti Parva",
    lesson:
      "An oath that cannot be broken becomes a cage. Loyalty without ongoing moral evaluation becomes complicity. The greatest sacrifice can create the conditions for the greatest suffering.",
    articleSlug: "bhishma-terrible-oath",
    accentHex: "#7986CB",
    accentRgb: "121,134,203",
    parva: "Bhishma Parva / Shanti Parva",
    weapon: "Divine bow + arrows",
    alliance: "Kaurava",
    personalityInsight: "Your commitments are sacred to you — sometimes to a fault. You are the person people rely on because you have never broken your word, and because of that reliability you have become load-bearing in ways you did not fully choose. The qualities that make you extraordinary are the same ones that occasionally make you complicit in outcomes you never intended. The hardest question the Mahabharata asks of you is not whether you are loyal — it is whether the thing you are loyal to still deserves it. You know the answer. The question is whether you will act on it.",
    stats: [
      { label: "Warrior Skill", value: 100 },
      { label: "Wisdom", value: 95 },
      { label: "Loyalty", value: 100 },
      { label: "Sacrifice", value: 98 },
      { label: "Dharma", value: 60 },
    ],
  },

  {
    id: "yudhishthira",
    name: "Yudhishthira",
    title: "The Dharma King",
    archetype: "Royalty",
    imageKey: "yudhishthira",
    epithets: ["Dharmaraja", "Ajatashatru", "Bharata", "Pandava"],
    traits: [
      { label: "Truth", icon: "⚖️" },
      { label: "Compassion", icon: "🕊️" },
      { label: "Patience", icon: "🌿" },
      { label: "Restraint", icon: "🧘" },
    ],
    bio: [
      "Yudhishthira was the eldest Pandava, son of Dharma himself, and the most truthful man in the epic — so truthful that his chariot never fully touched the ground. He ruled with compassion, spoke without deception, and bore the weight of his family's suffering with a patience that bordered on the inhuman.",
      "Yet this same man sat at a dice table and could not stop. He wagered his kingdom, his brothers, himself, and Draupadi — knowing the game was fixed. The Mahabharata holds both truths simultaneously: he was the most righteous man alive, and the most catastrophically compulsive. Neither truth cancels the other.",
    ],
    quote:
      "I do not grieve for the kingdom, or for my brothers, or for myself. I grieve for Draupadi — who has suffered through no fault of her own.",
    quoteSource: "Vana Parva",
    lesson:
      "Righteousness is not the absence of flaws — it is the commitment to keep trying despite them. Yudhishthira shows that a person can be genuinely good and genuinely broken in the same breath.",
    articleSlug: "yudhishthira-gambling-addiction",
    accentHex: "#4CAF50",
    accentRgb: "76,175,80",
    parva: "Sabha Parva / Shanti Parva",
    weapon: "Spear",
    alliance: "Pandava",
    personalityInsight: "You hold yourself to a standard that most people would find exhausting — and you hold others to it too, which is both your greatest strength and the source of most of your friction. You have a deep, genuine commitment to doing what is right. You also have a pattern that runs underneath the righteousness, something that pulls you toward a particular kind of risk or avoidance when the pressure gets high enough. Yudhishthira's teaching is not that dharmic people are invincible. It is that even the most committed person carries a compulsion they have not fully examined — and that the compulsion, left unexamined, has a radius that falls on everyone around them.",
    stats: [
      { label: "Warrior Skill", value: 72 },
      { label: "Wisdom", value: 90 },
      { label: "Loyalty", value: 85 },
      { label: "Sacrifice", value: 88 },
      { label: "Dharma", value: 98 },
    ],
  },

  {
    id: "duryodhana",
    name: "Duryodhana",
    title: "The Wounded King",
    archetype: "Warrior",
    imageKey: "duryodhana",
    epithets: ["Suyodhana", "Kurupati", "Kaurava"],
    traits: [
      { label: "Courage", icon: "⚔️" },
      { label: "Pride", icon: "👑" },
      { label: "Loyalty", icon: "🤝" },
      { label: "Ambition", icon: "🔥" },
    ],
    bio: [
      "Duryodhana is remembered as the Mahabharata's villain — but the text is more honest than that. His claim to the throne was not baseless. His resentment had real origins. His friendship with Karna was genuine. His courage in battle was unquestionable, and his death — alone on a lake, fighting without flinching — was given more dignity by the text than most heroes receive.",
      "What destroyed him was not his anger but what he did with it. He had Vidura's wisdom available at every turn. He chose Shakuni. For thirty years he fed a wound that could have been examined instead — and by Kurukshetra, the wound and the man had become inseparable.",
    ],
    quote:
      "I have lived as a king should live and will die as a warrior should die. I have no grief in this.",
    quoteSource: "Shalya Parva",
    lesson:
      "A real wound does not automatically justify the response you give it. Courage and correct judgment are not the same quality — and confusing them is its own kind of catastrophe.",
    articleSlug: "duryodhana-why-he-was-not-wrong",
    accentHex: "#E53935",
    accentRgb: "229,57,53",
    parva: "Sabha Parva / Shalya Parva",
    weapon: "Mace (Gada)",
    alliance: "Kaurava",
    personalityInsight: "You have been genuinely wronged — and the anger that came from it was legitimate. The question Duryodhana asks you is what you have done with that anger since. You are loyal, probably to a fault. You do not forgive easily, because forgetting feels like agreeing that what happened was acceptable. Your courage is real. What you are working on — what Duryodhana never managed to work on — is the gap between your legitimate wound and the decisions you are making from inside it. Examined anger is a very different thing from fed anger. You already know which one you are running on right now.",
    stats: [
      { label: "Warrior Skill", value: 94 },
      { label: "Wisdom", value: 45 },
      { label: "Loyalty", value: 88 },
      { label: "Sacrifice", value: 70 },
      { label: "Dharma", value: 30 },
    ],
  },

  {
    id: "abhimanyu",
    name: "Abhimanyu",
    title: "The Unfinished Hero",
    archetype: "Warrior",
    imageKey: "abhimanyu",
    epithets: ["Saubhadra", "Arjuni", "Phalguniputra"],
    traits: [
      { label: "Courage", icon: "🔥" },
      { label: "Skill", icon: "🏹" },
      { label: "Honour", icon: "⚔️" },
      { label: "Youth", icon: "🌱" },
    ],
    bio: [
      "Abhimanyu learned the secret of the Chakravyuha — the Mahabharata's most deadly military formation — while still in his mother's womb. He learned how to enter it. She fell asleep before Arjuna finished. He never learned how to exit.",
      "At sixteen, he was sent into that formation alone. The plan depended on others following. Jayadratha blocked them. Abhimanyu fought alone for hours — wounding Drona, Karna, and Duryodhana — until six Kaurava commanders attacked him simultaneously, violating every rule of honourable combat. He fought them with a chariot wheel at the end. He did not surrender.",
    ],
    quote:
      "I will go where no other will go today. I know how to enter. I trust that you will follow.",
    quoteSource: "Drona Parva",
    lesson:
      "Knowing how to begin something is not the same as being prepared to complete it. The gap between capability and preparation is where the most avoidable losses happen — and they fall on the person who went in trusting others to cover the part they did not know.",
    articleSlug: "abhimanyu-born-knowing-too-much",
    accentHex: "#FF9800",
    accentRgb: "255,152,0",
    parva: "Drona Parva",
    weapon: "Bow and chariot wheel",
    alliance: "Pandava",
    personalityInsight: "You have exceptional ability and you know it — not from arrogance, but from having tested yourself and found the results consistent. What you are still learning is the difference between what you can begin and what you can complete alone. You have a tendency to enter situations with full commitment before checking whether the support structure around you is as committed as you are. Abhimanyu's lesson is not about courage — you have that. It is about the honest assessment of dependencies: who needs to show up for this to work, and what is your plan if they don't? That question, asked before entry rather than after, is the thing that changes everything.",
    stats: [
      { label: "Warrior Skill", value: 96 },
      { label: "Wisdom", value: 62 },
      { label: "Loyalty", value: 90 },
      { label: "Sacrifice", value: 100 },
      { label: "Dharma", value: 85 },
    ],
  },

  {
    id: "gandhari",
    name: "Gandhari",
    title: "The Blindfolded Queen",
    archetype: "Royalty",
    imageKey: "gandhari",
    epithets: ["Gandharini", "Dhritarashtra-patni", "Saubali"],
    traits: [
      { label: "Devotion", icon: "🙏" },
      { label: "Restraint", icon: "🌿" },
      { label: "Grief", icon: "💔" },
      { label: "Power", icon: "✨" },
    ],
    bio: [
      "On the morning of her wedding, Gandhari bound cloth over her eyes. She would share her husband's blindness. She would not use sight he did not have. For seventy years she kept the blindfold on — and for seventy years, everything that happened at Kurukshetra happened while she stood beside Dhritarashtra and said nothing that actually changed anything.",
      "The Mahabharata does not criticise her love. It asks harder questions: whether solidarity that disables your greatest capacity is love or self-protection. She had more influence over Dhritarashtra than anyone. She had the perception to see what he could not. She chose not to use either. Then, after the war, she unleashed seventy years of accumulated power in a single curse on Krishna — devastating, misdirected, and too late.",
    ],
    quote:
      "I have kept my eyes closed for seventy years. Now that I open them, I wish I could close them again.",
    quoteSource: "Stri Parva",
    lesson:
      "Solidarity that disables your greatest capacity may be protecting you as much as it is protecting them. What you choose not to see does not disappear — it accumulates, with interest, until it can no longer be held.",
    articleSlug: "gandhari-blindfold-choice",
    accentHex: "#9C27B0",
    accentRgb: "156,39,176",
    parva: "Stri Parva",
    weapon: "None — her power was austerity",
    alliance: "Kaurava",
    personalityInsight: "You are deeply loyal and you express that loyalty through restraint — through what you choose not to say, not to demand, not to notice. This makes you someone people feel safe with. It also means that your genuine perceptions, the ones that could change things, often stay inside you rather than reaching the people who need them. Gandhari had more power than anyone in Hastinapura. She chose, for seventy years, not to fully use it — and called that devotion. The question she asks you is gentler than it sounds: is the thing you are holding back actually protecting the relationship, or is it protecting you from the discomfort of being fully seen and fully heard?",
    stats: [
      { label: "Warrior Skill", value: 10 },
      { label: "Wisdom", value: 88 },
      { label: "Loyalty", value: 95 },
      { label: "Sacrifice", value: 97 },
      { label: "Dharma", value: 72 },
    ],
  },
];

export const getCharacterById = (id: string): Character | undefined =>
  characters.find((c) => c.id === id);
