/* ─────────────────────────────────────────────
   StoryTeller Characters — 25 Major Characters
   Used by /storyteller page
───────────────────────────────────────────── */

export type CharacterGroup =
  | "pandavas"
  | "kauravas"
  | "women"
  | "warriors"
  | "divine"
  | "kings";

export interface StoryPrompt {
  label: string;
  request: string;
  mood: "epic" | "tragic" | "devotional" | "philosophical" | "war";
}

export interface StoryCharacter {
  id: string;
  name: string;
  title: string;
  group: CharacterGroup;
  hook: string;          // one-line emotional hook shown on card
  accentHex: string;
  icon: string;          // emoji icon
  prompts: StoryPrompt[];
}

/* i18n keys for group labels — resolve via t() at the call site.
   The localized strings live under "storyteller.group_*" in each locale. */
export const GROUP_LABEL_KEYS: Record<CharacterGroup, string> = {
  pandavas:  "storyteller.group_pandavas",
  kauravas:  "storyteller.group_kauravas",
  women:     "storyteller.group_women",
  warriors:  "storyteller.group_warriors",
  divine:    "storyteller.group_divine",
  kings:     "storyteller.group_kings",
};

/* @deprecated — kept as fallback; new code should use GROUP_LABEL_KEYS + t() */
export const GROUP_LABELS: Record<CharacterGroup, string> = {
  pandavas: "Pandavas",
  kauravas: "Kauravas",
  women: "Women",
  warriors: "Warriors",
  divine: "Divine & Sages",
  kings: "Kings & Fathers",
};

export const GROUP_COLORS: Record<CharacterGroup, string> = {
  pandavas:  "#1E8449",
  kauravas:  "#C0392B",
  women:     "#8E44AD",
  warriors:  "#6B2D8F",
  divine:    "#2471A3",
  kings:     "#784212",
};

export const storyCharacters: StoryCharacter[] = [

  /* ── PANDAVAS ── */
  {
    id: "yudhishthira",
    name: "Yudhishthira",
    title: "King of Righteousness",
    group: "pandavas",
    hook: "The righteous king who gambled everything",
    accentHex: "#1E8449",
    icon: "👑",
    prompts: [
      { label: "The Dice Game", request: "Tell me about Yudhishthira's fateful game of dice — why did the most righteous man make such a catastrophic mistake?", mood: "tragic" },
      { label: "12 Years of Exile", request: "Tell me how Yudhishthira led his brothers through 12 years of forest exile with dignity and wisdom", mood: "philosophical" },
      { label: "The Final Test", request: "Tell me about Yudhishthira's final test at the gates of heaven — his greatest moment of character", mood: "philosophical" },
      { label: "His Dharma", request: "Tell me how Yudhishthira always chose truth even when it cost him everything", mood: "devotional" },
    ],
  },
  {
    id: "bhima",
    name: "Bhima",
    title: "The Mighty Protector",
    group: "pandavas",
    hook: "The most powerful warrior who never broke a vow",
    accentHex: "#27AE60",
    icon: "💪",
    prompts: [
      { label: "The Vow of Vengeance", request: "Tell me about Bhima's oath to drink Dushasana's blood after Draupadi's humiliation — how he kept it", mood: "war" },
      { label: "Killing Duryodhana", request: "Tell me about the final battle between Bhima and Duryodhana — the clash that ended the Kaurava line", mood: "epic" },
      { label: "Bhima and Hanuman", request: "Tell me about Bhima's encounter with Hanuman in the forest — the lesson in humility", mood: "devotional" },
      { label: "His Love for Draupadi", request: "Tell me how Bhima was the most devoted of all five husbands to Draupadi", mood: "devotional" },
    ],
  },
  {
    id: "arjuna",
    name: "Arjuna",
    title: "The Supreme Archer",
    group: "pandavas",
    hook: "The greatest archer who doubted himself at the crucial moment",
    accentHex: "#4CAF50",
    icon: "🏹",
    prompts: [
      { label: "Bhagavad Gita", request: "Tell me about Arjuna's crisis of doubt before the war — and how Krishna's words transformed him", mood: "philosophical" },
      { label: "Draupadi's Swayamvara", request: "Tell me how Arjuna won Draupadi's hand with the impossible archery feat", mood: "epic" },
      { label: "Arjuna vs Karna", request: "Tell me about the lifelong rivalry between Arjuna and Karna — from their first meeting to their final duel", mood: "war" },
      { label: "Training Under Drona", request: "Tell me how Arjuna became the greatest archer through devotion and sacrifice", mood: "devotional" },
    ],
  },
  {
    id: "nakula",
    name: "Nakula",
    title: "The Most Handsome Warrior",
    group: "pandavas",
    hook: "The most handsome of the five — whose humility was his greatest weapon",
    accentHex: "#52BE80",
    icon: "🛡️",
    prompts: [
      { label: "Nakula's Humility", request: "Tell me about Nakula's quality of humility despite being considered the most handsome man in the world", mood: "philosophical" },
      { label: "Disguise in Virata", request: "Tell me how Nakula disguised himself during the year of hiding in King Virata's kingdom", mood: "epic" },
      { label: "His Devotion to Yudhishthira", request: "Tell me how Nakula's loyalty to his eldest brother was unwavering through all hardships", mood: "devotional" },
    ],
  },
  {
    id: "sahadeva",
    name: "Sahadeva",
    title: "The All-Knowing",
    group: "pandavas",
    hook: "He knew the war would happen — but destiny sealed his lips",
    accentHex: "#82E0AA",
    icon: "🔮",
    prompts: [
      { label: "The Burden of Knowledge", request: "Tell me about Sahadeva who knew the future — including the war — but could not speak of it due to a curse", mood: "tragic" },
      { label: "His Astrology Gift", request: "Tell me how Sahadeva was the greatest astrologer of his time and what he saw in the stars before Kurukshetra", mood: "philosophical" },
      { label: "Silent Strength", request: "Tell me about Sahadeva's quiet courage — how he fought with dignity despite carrying the greatest burden", mood: "devotional" },
    ],
  },

  /* ── KAURAVAS ── */
  {
    id: "duryodhana",
    name: "Duryodhana",
    title: "The Ambitious Prince",
    group: "kauravas",
    hook: "He chose war over five villages — and lost a kingdom",
    accentHex: "#C0392B",
    icon: "🔱",
    prompts: [
      { label: "Why He Refused Peace", request: "Tell me why Duryodhana refused Krishna's peace offer and chose war — what drove this decision?", mood: "philosophical" },
      { label: "His Friendship with Karna", request: "Tell me about the bond between Duryodhana and Karna — the most loyal friendship in the epic", mood: "devotional" },
      { label: "Last Day of War", request: "Tell me about Duryodhana's final hours — alone, defeated, yet unbowed", mood: "tragic" },
      { label: "Was He a Villain?", request: "Tell me Duryodhana's side of the story — was he truly evil or simply a man betrayed by envy?", mood: "philosophical" },
    ],
  },
  {
    id: "dushasana",
    name: "Dushasana",
    title: "The Cruel Prince",
    group: "kauravas",
    hook: "His act of cruelty sealed the fate of an entire dynasty",
    accentHex: "#E74C3C",
    icon: "⚡",
    prompts: [
      { label: "Draupadi's Humiliation", request: "Tell me about the darkest moment in the Mahabharata — when Dushasana dragged Draupadi into the sabha", mood: "tragic" },
      { label: "Bhima's Vow", request: "Tell me about Bhima's terrifying vow against Dushasana — and how it was fulfilled on the battlefield", mood: "war" },
      { label: "His Downfall", request: "Tell me how Dushasana met his end on the 16th day of Kurukshetra — the fulfillment of Bhima's oath", mood: "epic" },
    ],
  },
  {
    id: "shakuni",
    name: "Shakuni",
    title: "The Master Manipulator",
    group: "kauravas",
    hook: "He rigged the dice — and his revenge destroyed two kingdoms",
    accentHex: "#922B21",
    icon: "🎲",
    prompts: [
      { label: "Why Shakuni Wanted War", request: "Tell me Shakuni's true motivation — his revenge for what was done to his sister Gandhari and the Gandhara kingdom", mood: "tragic" },
      { label: "The Loaded Dice", request: "Tell me how Shakuni rigged the dice game — the cunning strategy behind the greatest con in history", mood: "epic" },
      { label: "His Death", request: "Tell me how Shakuni finally met his end at the hands of Sahadeva on the last day of war", mood: "war" },
    ],
  },

  /* ── WOMEN ── */
  {
    id: "draupadi",
    name: "Draupadi",
    title: "The Fire-Born Queen",
    group: "women",
    hook: "Born from fire — her humiliation ignited the greatest war",
    accentHex: "#8E44AD",
    icon: "🔥",
    prompts: [
      { label: "Her Humiliation", request: "Tell me about Draupadi's disrobing in the Kaurava court — the moment that made the Mahabharata war inevitable", mood: "tragic" },
      { label: "Born from Fire", request: "Tell me the story of Draupadi's miraculous birth from the sacrificial fire of King Drupada", mood: "epic" },
      { label: "Five Husbands", request: "Tell me how Draupadi came to have five husbands and how she balanced this extraordinary life", mood: "philosophical" },
      { label: "Her Vow", request: "Tell me about Draupadi's vow to leave her hair unbound until it was washed with Dushasana's blood", mood: "war" },
    ],
  },
  {
    id: "kunti",
    name: "Kunti",
    title: "The Mother of Heroes",
    group: "women",
    hook: "She carried the greatest secret — Karna was her firstborn son",
    accentHex: "#9B59B6",
    icon: "🌸",
    prompts: [
      { label: "The Secret of Karna", request: "Tell me about Kunti's greatest secret — that Karna was her firstborn son, abandoned on the river", mood: "tragic" },
      { label: "Her Boon", request: "Tell me how young Kunti accidentally summoned the sun god Surya and the impossible choice she faced", mood: "epic" },
      { label: "Meeting Karna", request: "Tell me about Kunti's secret meeting with Karna before the war — what she asked and what he replied", mood: "tragic" },
      { label: "Her Sacrifice", request: "Tell me about all that Kunti sacrificed as a mother — her choices and their consequences", mood: "devotional" },
    ],
  },
  {
    id: "gandhari",
    name: "Gandhari",
    title: "The Blindfolded Queen",
    group: "women",
    hook: "She blindfolded herself for her husband — and cursed Krishna for her sons",
    accentHex: "#A569BD",
    icon: "🌑",
    prompts: [
      { label: "The Blindfold", request: "Tell me why Gandhari chose to blindfold herself upon marriage and what this sacrifice meant", mood: "devotional" },
      { label: "Her Curse on Krishna", request: "Tell me about Gandhari's devastating curse on Krishna after the war — and how it came true", mood: "tragic" },
      { label: "Mother of 100 Sons", request: "Tell me the extraordinary story of how Gandhari gave birth to 100 sons", mood: "epic" },
      { label: "Her Grief", request: "Tell me about Gandhari's grief after losing all 100 sons in the war she tried to prevent", mood: "tragic" },
    ],
  },
  {
    id: "subhadra",
    name: "Subhadra",
    title: "Krishna's Sister, Arjuna's Love",
    group: "women",
    hook: "Her love for Arjuna crossed every boundary of caste and custom",
    accentHex: "#BB8FCE",
    icon: "🌼",
    prompts: [
      { label: "Elopement with Arjuna", request: "Tell me how Arjuna eloped with Subhadra on Krishna's advice — the great love story of the epic", mood: "epic" },
      { label: "Mother of Abhimanyu", request: "Tell me how Subhadra raised Abhimanyu and the legend of him learning war tactics in the womb", mood: "devotional" },
      { label: "Her Loss", request: "Tell me about Subhadra's grief when Abhimanyu died in the Chakravyuha — a mother's unbearable sorrow", mood: "tragic" },
    ],
  },
  {
    id: "hidimbi",
    name: "Hidimbi",
    title: "The Rakshasi Who Loved",
    group: "women",
    hook: "A demon woman who chose love over her own brother",
    accentHex: "#D7BDE2",
    icon: "🌿",
    prompts: [
      { label: "Love for Bhima", request: "Tell me how Hidimbi, a Rakshasi sent to kill the Pandavas, fell in love with Bhima instead", mood: "epic" },
      { label: "Ghatotkacha's Birth", request: "Tell me about the birth of Ghatotkacha — son of Bhima and Hidimbi — and his extraordinary powers", mood: "devotional" },
      { label: "Her Sacrifice", request: "Tell me how Hidimbi gave up her own happiness to let Bhima fulfill his dharma", mood: "tragic" },
    ],
  },

  /* ── WARRIORS ── */
  {
    id: "karna",
    name: "Karna",
    title: "The Tragic Hero",
    group: "warriors",
    hook: "Born a king, raised a charioteer's son — betrayed by fate itself",
    accentHex: "#6B2D8F",
    icon: "⚔️",
    prompts: [
      { label: "His Birth", request: "Tell me about Karna's miraculous birth and why his mother Kunti abandoned him on the river", mood: "tragic" },
      { label: "Parashurama's Curse", request: "Tell me about the curse Parashurama placed on Karna — the lie that sealed his fate", mood: "tragic" },
      { label: "Karna vs Arjuna", request: "Tell me about the final duel between Karna and Arjuna — the greatest archery battle in history", mood: "war" },
      { label: "His Generosity", request: "Tell me about Karna's legendary generosity — how he gave away his divine armour and earrings", mood: "devotional" },
      { label: "His Last Day", request: "Tell me about Karna's final hours on the battlefield and his dignified death", mood: "tragic" },
    ],
  },
  {
    id: "bhishma",
    name: "Bhishma",
    title: "The Grand Patriarch",
    group: "warriors",
    hook: "His oath of celibacy saved a king — and destroyed generations",
    accentHex: "#7986CB",
    icon: "🏔️",
    prompts: [
      { label: "The Terrible Oath", request: "Tell me about Bhishma's terrible oath of celibacy — why he made it and what it cost him", mood: "tragic" },
      { label: "On the Bed of Arrows", request: "Tell me about Bhishma lying on his bed of arrows, imparting wisdom to Yudhishthira as he waited to die", mood: "philosophical" },
      { label: "Why He Fought for Kauravas", request: "Tell me why Bhishma, who loved the Pandavas, chose to fight for the Kauravas", mood: "philosophical" },
      { label: "His Defeat by Shikhandi", request: "Tell me the tragic story of how Bhishma fell — and who truly defeated him", mood: "war" },
    ],
  },
  {
    id: "drona",
    name: "Drona",
    title: "The Guru of Both Sides",
    group: "warriors",
    hook: "He taught both armies — then had to choose a side",
    accentHex: "#F0A500",
    icon: "🎯",
    prompts: [
      { label: "Eklavya's Thumb", request: "Tell me about Drona and Eklavya — the most controversial episode involving a guru and his student", mood: "tragic" },
      { label: "His Love for Arjuna", request: "Tell me why Drona favoured Arjuna above all students — and how this shaped history", mood: "devotional" },
      { label: "His Death", request: "Tell me how Drona was deceived into laying down his weapons and how he died", mood: "war" },
      { label: "Teacher vs Duty", request: "Tell me about Drona's impossible position — fighting against his own students on Kurukshetra", mood: "philosophical" },
    ],
  },
  {
    id: "ashwatthama",
    name: "Ashwatthama",
    title: "The Cursed Immortal",
    group: "warriors",
    hook: "He committed the greatest sin — and was cursed to walk the earth forever",
    accentHex: "#E67E22",
    icon: "💀",
    prompts: [
      { label: "The Night Massacre", request: "Tell me about Ashwatthama's night attack on the Pandava camp — the darkest act of the entire war", mood: "war" },
      { label: "The Brahmastra", request: "Tell me about Ashwatthama's unleashing of the Brahmastra weapon — and the catastrophic consequences", mood: "epic" },
      { label: "The Eternal Curse", request: "Tell me about the curse Krishna placed on Ashwatthama — to wander the earth in pain forever", mood: "tragic" },
      { label: "His Immortality", request: "Tell me the legend that Ashwatthama still walks the earth today — what it means for us", mood: "philosophical" },
    ],
  },
  {
    id: "abhimanyu",
    name: "Abhimanyu",
    title: "The Young Hero",
    group: "warriors",
    hook: "He learned to enter the deadliest formation in the womb — but not how to exit",
    accentHex: "#F1C40F",
    icon: "🌟",
    prompts: [
      { label: "Learning in the Womb", request: "Tell me about Abhimanyu learning the Chakravyuha formation while still in Subhadra's womb", mood: "epic" },
      { label: "Trapped in Chakravyuha", request: "Tell me about Abhimanyu's heroic last stand inside the Chakravyuha — surrounded and alone", mood: "war" },
      { label: "Arjuna's Grief", request: "Tell me about Arjuna's devastating grief when he learned his son was killed unfairly", mood: "tragic" },
      { label: "His Courage", request: "Tell me how a 16-year-old boy fought an entire army alone and never surrendered", mood: "epic" },
    ],
  },

  /* ── DIVINE & SAGES ── */
  {
    id: "krishna",
    name: "Krishna",
    title: "The Divine Strategist",
    group: "divine",
    hook: "He never raised a weapon — yet he determined the outcome of the war",
    accentHex: "#2471A3",
    icon: "🪷",
    prompts: [
      { label: "Bhagavad Gita", request: "Tell me what Krishna revealed to Arjuna on the battlefield of Kurukshetra — the eternal wisdom of the Gita", mood: "philosophical" },
      { label: "Peace Mission", request: "Tell me about Krishna's failed peace mission to Hastinapura — and the moment war became inevitable", mood: "epic" },
      { label: "Vishwarupa", request: "Tell me about Krishna revealing his cosmic form Vishwarupa to Arjuna — the most awe-inspiring moment", mood: "devotional" },
      { label: "Sudama Story", request: "Tell me about Krishna and his poor friend Sudama — the most beautiful story of divine friendship", mood: "devotional" },
      { label: "His Strategy", request: "Tell me how Krishna guided the Pandavas to victory through wisdom rather than weapons", mood: "philosophical" },
    ],
  },
  {
    id: "hanuman",
    name: "Hanuman",
    title: "The Eternal Devotee",
    group: "divine",
    hook: "He sat on Arjuna's flag — blessing every arrow fired in righteousness",
    accentHex: "#F39C12",
    icon: "🙏",
    prompts: [
      { label: "Meeting Bhima", request: "Tell me about Hanuman's encounter with Bhima in the forest — teaching the proud warrior true strength", mood: "devotional" },
      { label: "On Arjuna's Chariot", request: "Tell me why Hanuman chose to sit on Arjuna's flag during the Kurukshetra war and what his presence meant", mood: "devotional" },
      { label: "His Divine Power", request: "Tell me about Hanuman's presence in the Mahabharata — the bridge between Ramayana and Mahabharata ages", mood: "philosophical" },
    ],
  },
  {
    id: "vyasa",
    name: "Vyasa",
    title: "The Author of the Epic",
    group: "divine",
    hook: "He was born in the Mahabharata — and wrote it while living it",
    accentHex: "#1F618D",
    icon: "📜",
    prompts: [
      { label: "Why He Wrote It", request: "Tell me why Veda Vyasa composed the Mahabharata — its purpose and the message he wanted to leave humanity", mood: "philosophical" },
      { label: "Born in the Story", request: "Tell me the extraordinary story of Vyasa's birth and his role as both character and author of the epic", mood: "epic" },
      { label: "Dictating to Ganesha", request: "Tell me the story of Vyasa dictating the Mahabharata to Ganesha and the conditions they set", mood: "devotional" },
    ],
  },
  {
    id: "vidura",
    name: "Vidura",
    title: "The Wisest Man",
    group: "divine",
    hook: "He spoke truth to power — and was always ignored until it was too late",
    accentHex: "#2E86C1",
    icon: "⚖️",
    prompts: [
      { label: "Vidura Niti", request: "Tell me about Vidura Niti — the timeless wisdom Vidura gave Dhritarashtra before the war", mood: "philosophical" },
      { label: "Warning the King", request: "Tell me how Vidura warned Dhritarashtra about the consequences of supporting Duryodhana's injustice", mood: "philosophical" },
      { label: "His Dharma", request: "Tell me how Vidura remained dharmic when everyone around him chose convenience over righteousness", mood: "devotional" },
    ],
  },

  /* ── KINGS & FATHERS ── */
  {
    id: "dhritarashtra",
    name: "Dhritarashtra",
    title: "The Blind King",
    group: "kings",
    hook: "His love for his son blinded him more than his eyes ever did",
    accentHex: "#784212",
    icon: "👁️",
    prompts: [
      { label: "His Fatal Love", request: "Tell me how Dhritarashtra's blind love for Duryodhana made him complicit in every injustice", mood: "tragic" },
      { label: "After the War", request: "Tell me how Dhritarashtra and Gandhari spent their final years after losing everything in the war", mood: "tragic" },
      { label: "His Grief", request: "Tell me about the moment Dhritarashtra learned all 100 of his sons were dead — a father's ultimate grief", mood: "tragic" },
    ],
  },
  {
    id: "drupada",
    name: "Drupada",
    title: "The Vengeful King",
    group: "kings",
    hook: "He spent decades plotting revenge against his childhood friend turned enemy",
    accentHex: "#935116",
    icon: "⚡",
    prompts: [
      { label: "Drona's Humiliation", request: "Tell me about Drona humiliating Drupada — the incident that set the entire war in motion", mood: "tragic" },
      { label: "Creating Draupadi", request: "Tell me how Drupada performed the great fire sacrifice specifically to create warriors who could kill Drona", mood: "epic" },
      { label: "His Revenge", request: "Tell me how Drupada's lifelong plan for revenge played out — and whether it was worth it", mood: "philosophical" },
    ],
  },
  {
    id: "parashurama",
    name: "Parashurama",
    title: "The Warrior Sage",
    group: "divine",
    hook: "He trained both Karna and Bhishma — then cursed the one he loved most",
    accentHex: "#239B56",
    icon: "🪓",
    prompts: [
      { label: "Teaching Karna", request: "Tell me about Parashurama teaching Karna — and the terrible discovery that led to Karna's curse", mood: "tragic" },
      { label: "His Vow Against Kshatriyas", request: "Tell me why Parashurama vowed to destroy the Kshatriya warrior class 21 times over", mood: "epic" },
      { label: "Clash with Bhishma", request: "Tell me about the epic battle between Parashurama and Bhishma — master versus student", mood: "war" },
    ],
  },
];

export function getCharactersByGroup(group: CharacterGroup): StoryCharacter[] {
  return storyCharacters.filter((c) => c.group === group);
}

export function getCharacterById(id: string): StoryCharacter | undefined {
  return storyCharacters.find((c) => c.id === id);
}
