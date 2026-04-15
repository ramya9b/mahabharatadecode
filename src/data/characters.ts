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
  imageKey: "karna" | "krishna" | "arjuna" | "draupadi" | "bhishma";
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
    accentHex: "#D4AF37",
    accentRgb: "212,175,55",
    parva: "Karna Parva",
    weapon: "Vasavi Shakti",
    alliance: "Kaurava",
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
    stats: [
      { label: "Warrior Skill", value: 100 },
      { label: "Wisdom", value: 95 },
      { label: "Loyalty", value: 100 },
      { label: "Sacrifice", value: 98 },
      { label: "Dharma", value: 60 },
    ],
  },
];

export const getCharacterById = (id: string): Character | undefined =>
  characters.find((c) => c.id === id);
