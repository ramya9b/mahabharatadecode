/* ─────────────────────────────────────────────
   MahabharataDecoded — Unified Data Model
   No YouTube. Named story sections. CMS-ready.
───────────────────────────────────────────── */

export interface StoryBlock {
  section: "introduction" | "background" | "turningPoint";
  label: string;
  paragraphs: string[];
}

export interface KeyLesson {
  icon: string;
  title: string;
  description: string;
  accent?: "gold" | "crimson" | "teal";
}

export interface ModernConnection {
  context: string;
  insight: string;
  example: string;
}

export interface ContentBlock {
  type: "paragraph" | "heading" | "quote" | "lesson" | "divider";
  text: string;
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  summary: string;
  category: "Characters" | "Life Lessons" | "Slokas" | "Philosophy";
  character?: string;
  readTime: number;
  publishDate: string;
  featured?: boolean;
  imageKey: "karna" | "krishna" | "arjuna" | "draupadi" | "bhishma" | "hero";
  image: string;
  storyBlocks: StoryBlock[];
  content: ContentBlock[];
  keyLessons?: KeyLesson[];
  modernConnections?: ModernConnection[];
  lifeLessons: string[];
  pullQuote?: string;
  authorNote?: string;
  reelHook?: { hook: string; supporting: string };
  relatedSlugs?: string[];
  sloka?: { sanskrit: string; transliteration: string; translation: string };
  metaTitle?: string;
  metaDescription?: string;
}

export const articles: Article[] = [

  /* ══════════════ KARNA ══════════════ */
  {
    slug: "karna-loyalty-vs-self-respect",
    title: "Karna: The Man Who Chose Honour Over Everything",
    subtitle: "He knew exactly what he was giving up. He gave it away anyway.",
    description:
      "A warrior of unmatched skill, born to royalty yet raised in poverty. Karna's life is the Mahabharata's most devastating meditation on loyalty, identity, and the price of a promise kept past its purpose.",
    summary:
      "He was offered the world — and turned it down. Karna's loyalty cost him everything, and his self-respect let him smile while losing it.",
    category: "Characters",
    character: "Karna",
    readTime: 7,
    publishDate: "April 10, 2026",
    featured: true,
    imageKey: "karna",
    image: "",
    metaTitle: "Karna: Loyalty vs Self-Respect | Mahabharata Lessons",
    metaDescription:
      "Karna knew the truth about his birth, was offered a kingdom — and still chose loyalty. Discover the life lesson hidden in his impossible choice.",
    pullQuote:
      "He knew the truth. He knew the cost. He chose anyway. That is not weakness — it is the most terrifying form of integrity.",
    authorNote:
      "This article draws from the Karna Parva, the Udyoga Parva, and Vyasa's Mahabharata. The philosophical analysis reflects classical Vedantic interpretation alongside modern psychological reading.",
    reelHook: {
      hook: "Krishna offered Karna a kingdom. Karna said no. Here's the reason that will change how you see every loyalty in your life.",
      supporting:
        "He wasn't blind. He wasn't foolish. He was the most self-aware man in the entire epic — and he chose to lose anyway.",
    },
    relatedSlugs: ["krishna-leadership-secrets", "bhishma-terrible-oath"],
    storyBlocks: [
      {
        section: "introduction",
        label: "Introduction",
        paragraphs: [
          "There is a kind of person who does not flinch when the world asks them the hardest question it knows how to ask.",
          "Karna was that person.",
          "He was born to a queen, raised by a charioteer, and denied entry into every room his talent deserved. He built himself from nothing — and in doing so, became someone who could not be bought back.",
        ],
      },
      {
        section: "background",
        label: "Background",
        paragraphs: [
          "The world first met Karna as a disruption. He arrived at the Rangabhoomi — the princes' tournament — and matched Arjuna arrow for arrow, feat for feat.",
          "Then someone asked his name. Then his lineage. Sutaputra. Charioteer's son.",
          "The crowd laughed. Kripa disqualified him. Draupadi turned away. In that moment of collective humiliation, one person stepped forward: Duryodhana, who crowned him King of Anga before anyone could object.",
          "That single act of recognition became the chain Karna would wear his entire life — and never try to remove.",
        ],
      },
      {
        section: "turningPoint",
        label: "The Turning Point",
        paragraphs: [
          "On the eve of the Kurukshetra war, Krishna came to Karna alone.",
          "He told him the truth: You are Kunti's firstborn. You are the eldest Pandava. The throne, Draupadi, the world's love — all of it is yours. Just cross the line.",
          "Karna sat with the truth for a long moment. Then he said: I know. And I cannot.",
          "He had pledged himself to Duryodhana when no one else would stand with him. To walk away now — toward victory, toward recognition, toward the birthright that had been stolen from him — would be to become someone he did not recognise.",
          "He chose to lose the war. He chose to keep himself.",
        ],
      },
    ],
    content: [
      {
        type: "paragraph",
        text: "There is a moment in the Mahabharata that stops you cold. It comes before the war of Kurukshetra. Krishna — who knows everything, who has been planning this moment for a lifetime — visits Karna in private and reveals the truth hidden since birth: Karna is the firstborn son of Kunti, making him not just a Pandava, but the eldest of them all.",
      },
      {
        type: "paragraph",
        text: "In one conversation, Krishna offers Karna a kingdom, Draupadi as a wife, the loyalty of five brothers, and the acknowledgment of the world. Everything Karna had ever been denied — healed in a single breath.",
      },
      {
        type: "quote",
        text: "Only a king may challenge a king. Tell me your father's name, charioteer's son.",
      },
      {
        type: "heading",
        text: "The Armour He Could Not Remove",
      },
      {
        type: "paragraph",
        text: "Karna was born with Kavach and Kundala — divine armour fused to his skin that made him nearly invincible. Yet Indra, disguised as a brahmin, came to ask for them as charity. Karna knew it was a trap. He gave the armour away with a smile — because to refuse would have been to stop being himself.",
      },
      {
        type: "quote",
        text: "I was given a kingdom when I had nothing. To abandon that king now, when he needs me most, would be the greatest adharma I could commit.",
      },
      {
        type: "lesson",
        text: "The Mahabharata does not present Karna's curses as unjust. They are the consequence of choices made under pressure. Every shortcut Karna took came back to him at the worst possible moment. The epic asks: can the means really be separated from the ends?",
      },
      {
        type: "heading",
        text: "What He Chose Not to Be",
      },
      {
        type: "paragraph",
        text: "After the war, when the surviving Pandavas learned who Karna truly was, Yudhishthira wept. But Karna had known. He had protected his mother's secret, choosing to live within the identity he'd been given rather than claim the one he was owed. This was his greatest act of self-sacrifice. And his most devastating choice.",
      },
    ],
    keyLessons: [
      {
        icon: "⚖️",
        title: "Loyalty vs Truth",
        description:
          "Karna's tragedy is choosing loyalty to a person over loyalty to dharma. Loyalty is only noble when the cause it serves is just.",
        accent: "gold",
      },
      {
        icon: "🪞",
        title: "Identity Beyond Origin",
        description:
          "Born a charioteer's son, Karna refused to be defined by where he came from. His self-worth was forged in action, not ancestry.",
        accent: "crimson",
      },
      {
        icon: "🎯",
        title: "Decisions Under Pressure",
        description:
          "Twice Karna was offered the truth that could have saved him. His decision was not cowardice — it was a calculated sacrifice of self for principle.",
        accent: "gold",
      },
      {
        icon: "🤝",
        title: "The Weight of Gratitude",
        description:
          "Be careful whose kindness you accept — it may one day ask a terrible price. Gratitude is sacred, but it has an expiry date.",
        accent: "teal",
      },
      {
        icon: "✨",
        title: "Dignity in Defeat",
        description:
          "Karna died stripped of his divine armour, yet with his character entirely intact. There is a kind of victory in how you lose.",
        accent: "gold",
      },
      {
        icon: "🌊",
        title: "Generosity as Identity",
        description:
          "For Karna, to stop giving would have been to stop being himself. He gave away the very thing keeping him alive — because that was who he was.",
        accent: "crimson",
      },
    ],
    modernConnections: [
      {
        context: "In Your Career",
        insight:
          "How many of us stay in toxic workplaces because of loyalty to a manager who gave us our first break? Karna's story asks: at what point does gratitude become self-betrayal?",
        example:
          "You were hired by a visionary leader who believed in you. Over time, the culture has become toxic and the direction is wrong — and you know it. But you stay, because leaving feels like betrayal. This is Karna's dilemma in a boardroom.",
      },
      {
        context: "In Your Relationships",
        insight:
          "We often stay loyal to relationships that have long stopped serving our growth — not because we lack courage to leave, but because we cannot bear to dishonour the person who once stood up for us.",
        example:
          "A friendship born in your most vulnerable moment. Now that friend asks you to be present for choices you know are wrong. What do you owe them — and when does that debt expire?",
      },
      {
        context: "In Personal Growth",
        insight:
          "Some of us learn who we truly are only after we've made the choices that define us. Karna received the truth — and chose to live within the identity he'd been given rather than claim the one he was owed.",
        example:
          "You've been living inside an identity others handed you. What happens when you finally learn that the story you've been living was never really yours?",
      },
    ],
    lifeLessons: [
      "Loyalty must be guided by wisdom, not just emotion",
      "Your origin doesn't define your worth — your actions do",
      "True friendship stands even when the world turns away",
      "Knowing the truth and choosing to ignore it is still a choice",
      "Generosity without discernment is its own kind of weakness",
      "Dignity in defeat is its own form of victory",
    ],
    sloka: {
      sanskrit:
        "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
      transliteration:
        "Karmanye vadhikaraste ma phaleshu kadachana,\nma karmaphalaheturbhur ma te sango'stvakarmanee",
      translation:
        "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results, and never be attached to not doing your duty.",
    },
  },

  /* ══════════════ KRISHNA ══════════════ */
  {
    slug: "krishna-leadership-secrets",
    title: "Krishna: The Leader Who Never Needed the Throne",
    subtitle:
      "He had the power to win the war alone. He chose to guide someone else to victory instead.",
    description:
      "Krishna never swung a sword in the war. Yet without him, Dharma could not have won. His leadership secrets are the most misunderstood — and most needed — lessons in the entire epic.",
    summary:
      "He had ten million warriors and chose not to use them. Krishna's leadership secret was knowing exactly which power not to deploy — and when silence is the strategy.",
    category: "Life Lessons",
    character: "Krishna",
    readTime: 6,
    publishDate: "April 8, 2026",
    imageKey: "krishna",
    image: "",
    metaTitle: "Krishna's Leadership Secrets | Life Lessons from Mahabharata",
    metaDescription:
      "Krishna never took the throne, never swung a sword, and still changed the outcome of the greatest war ever fought. His leadership secrets are lessons every modern leader needs.",
    pullQuote:
      "He offered the same thing to both sides. One man chose power. The other chose wisdom. The Mahabharata spent eighteen days showing us which choice was wiser.",
    reelHook: {
      hook: "Duryodhana chose ten million warriors. Arjuna chose one unarmed man. Eighteen days later, we found out who made the right call.",
      supporting:
        "Krishna's greatest leadership lesson wasn't in the Gita. It was in who he chose to be before he said a single word.",
    },
    relatedSlugs: ["arjuna-confusion-moment-of-doubt", "dharma-beyond-rules"],
    storyBlocks: [
      {
        section: "introduction",
        label: "Introduction",
        paragraphs: [
          "The most powerful figure in the Mahabharata never once drew a weapon in the war.",
          "He drove a chariot. He asked questions. He waited.",
          "And through those three acts alone, he shaped the destiny of an entire civilisation.",
        ],
      },
      {
        section: "background",
        label: "Background",
        paragraphs: [
          "Krishna came to the Kuru court as the Pandavas' peace ambassador — not as a warrior, not as a king, not as the divine being his closest allies knew him to be.",
          "He asked Duryodhana for five villages. Just five — one for each Pandava. The price of peace.",
          "Duryodhana refused. He said he would not give as much land as a needle could pierce.",
          "Krishna said nothing more. He simply allowed Duryodhana to reveal, in front of every king and elder assembled, exactly who he was. That silence was the strategy.",
        ],
      },
      {
        section: "turningPoint",
        label: "The Turning Point",
        paragraphs: [
          "On the first morning of Kurukshetra, Arjuna's bow dropped from his hands.",
          "Most leaders would have told him to get up and fight. Krishna sat down with him.",
          "For eighteen chapters of the Bhagavad Gita, he did not command Arjuna to act. He asked Arjuna to think — about dharma, about identity, about what the soul truly is.",
          "By the end, Arjuna picked up his bow himself.",
          "That is the difference between a manager and a leader. One gives orders. The other creates understanding.",
        ],
      },
    ],
    content: [
      {
        type: "paragraph",
        text: "Before Kurukshetra, both Arjuna and Duryodhana came to Krishna for help. Duryodhana arrived first and sat near Krishna's head. Arjuna arrived later and stood near his feet. When Krishna opened his eyes, he saw Arjuna first — and gave him the first choice.",
      },
      {
        type: "quote",
        text: "A person reveals their character not in crisis, but in the smallest moments when they believe no one is watching closely enough to judge them.",
      },
      {
        type: "heading",
        text: "Why He Chose the Charioteer's Role",
      },
      {
        type: "paragraph",
        text: "Duryodhana chose Krishna's entire Narayani Sena — ten million warriors. Arjuna chose Krishna himself as an unarmed charioteer. The strategic asymmetry of this choice is still studied today. But the deeper point is simpler: one man chose visible power, the other chose invisible wisdom.",
      },
      {
        type: "lesson",
        text: "The best leaders don't simply pursue winning. They pursue the conditions under which the right things can happen — and they become indispensable not through force, but through clarity.",
      },
      {
        type: "heading",
        text: "The Strategy of Revelation",
      },
      {
        type: "paragraph",
        text: "Krishna's most misunderstood power is not strength — it's illumination. He doesn't manipulate events so much as he makes the moral stakes so clear that each person's choice becomes a declaration of who they are. Duryodhana's refusal of five villages wasn't the moment he chose evil. It was the moment he showed everyone else what he had always been.",
      },
    ],
    keyLessons: [
      {
        icon: "🎯",
        title: "Strategy Over Strength",
        description:
          "Krishna had ten million warriors and chose not to use them. The most powerful move is often knowing which power not to deploy.",
        accent: "gold",
      },
      {
        icon: "🕊️",
        title: "Silence as Strategy",
        description:
          "At Hastinapura, Krishna did not argue, threaten, or plead. He offered five villages and let Duryodhana reveal himself by refusing.",
        accent: "teal",
      },
      {
        icon: "🌅",
        title: "Clarity Is a Weapon",
        description:
          "Krishna made the moral stakes unmistakably clear at every turning point. Leaders who think clearly make the choices of others visible.",
        accent: "gold",
      },
      {
        icon: "👂",
        title: "Ask Before You Command",
        description:
          "When Arjuna broke down, Krishna asked questions that led Arjuna to his own answer. The best leaders don't give people answers — they create conditions for people to find them.",
        accent: "teal",
      },
      {
        icon: "🏆",
        title: "Serve the Purpose, Not the Applause",
        description:
          "Krishna's entire role was invisible by design. No sword, no crown, no individual glory. Only outcome. Real leadership asks: am I here to be seen, or to be useful?",
        accent: "crimson",
      },
    ],
    modernConnections: [
      {
        context: "In Your Career",
        insight:
          "You are the smartest person in the room — and everyone knows it. The question Krishna asks is: are you using that intelligence to shine, or to make others more capable than they'd be without you?",
        example:
          "The best managers in history are remembered not for what they did, but for who they built. Consider: what is the most powerful thing you could do in your next meeting that doesn't involve speaking first?",
      },
      {
        context: "In Your Workplace",
        insight:
          "There's a meeting happening right now where the most senior person talks the most. Krishna almost never spoke first. He waited, listened, and let the situation reveal itself before responding.",
        example:
          "Consider what changes in your next conversation if your first instinct is silence, not solution. Not passive silence — the active silence of a person who is watching clearly before acting.",
      },
      {
        context: "In Your Relationships",
        insight:
          "When someone you love is falling apart, the instinct is to fix it. Krishna sat with Arjuna's grief for eighteen chapters before saying a word. Sometimes the most powerful thing you can offer is the space to hear themselves think.",
        example:
          "The next time someone comes to you in crisis, try asking one question instead of giving one answer. Then wait. See what they find in the silence you created for them.",
      },
    ],
    lifeLessons: [
      "True leadership serves a purpose greater than self",
      "Sometimes the greatest power is the power of restraint",
      "Clarity of vision is worth more than any weapon",
      "The right guide at the right moment changes everything",
      "Never confuse position with power",
      "Ask before you command — understanding beats obedience",
    ],
    sloka: {
      sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत",
      transliteration: "Yada yada hi dharmasya glanir bhavati bharata",
      translation:
        "Whenever there is a decline in righteousness and a rise in unrighteousness, at that time I manifest myself on earth.",
    },
  },

  /* ══════════════ ARJUNA ══════════════ */
  {
    slug: "arjuna-confusion-moment-of-doubt",
    title: "Arjuna's Confusion: Why the Greatest Warrior Broke First",
    subtitle:
      "He had trained his entire life for this moment. And when it arrived, he sat down and wept.",
    description:
      "The Bhagavad Gita was not born in a temple. It was born on a battlefield, from a man who could not lift his own bow. Arjuna's breakdown didn't weaken the Mahabharata — it became its soul.",
    summary:
      "On the most important day of his life, the world's greatest archer put down his bow. His breakdown didn't weaken the Mahabharata — it became its soul.",
    category: "Life Lessons",
    character: "Arjuna",
    readTime: 5,
    publishDate: "April 6, 2026",
    imageKey: "arjuna",
    image: "",
    metaTitle: "Arjuna's Confusion & Self-Doubt | Life Lessons from Mahabharata",
    metaDescription:
      "Arjuna was the most skilled warrior alive — and he froze. Discover what his moment of doubt reveals about your own moments of paralysis, and how the Gita was born from breakdown, not brilliance.",
    pullQuote:
      "The greatest spiritual text in Indian civilization was born not from clarity but from confusion — not from strength, but from the courage to admit collapse.",
    reelHook: {
      hook: "The Bhagavad Gita was not written in a temple. It was spoken on a battlefield, to a man who was crying on the floor of his chariot.",
      supporting:
        "Your confusion is not a sign that you're lost. It might be the exact condition required for the most important realisation of your life.",
    },
    relatedSlugs: [
      "krishna-leadership-secrets",
      "gita-verse-two-forty-seven",
    ],
    storyBlocks: [
      {
        section: "introduction",
        label: "Introduction",
        paragraphs: [
          "We celebrate Arjuna for his skill, his discipline, his legendary focus.",
          "We rarely sit with the fact that on the single most important day of his life, all of that deserted him.",
          "And that in that desertion — the greatest wisdom in human history was waiting.",
        ],
      },
      {
        section: "background",
        label: "Background",
        paragraphs: [
          "Arjuna had earned his place on that battlefield.",
          "He was the student who famously saw only the eye of the fish when all others saw the fish, the branch, the tree, the sky. He trained under Dronacharya. He received weapons from the gods. He faced divine trials and emerged whole.",
          "He was not there because of inheritance. He was there because of thirty years of absolute, unbroken commitment to his craft.",
          "And on the morning of Kurukshetra, his chariot was drawn between the two armies — and he looked at the faces across the field.",
        ],
      },
      {
        section: "turningPoint",
        label: "The Turning Point",
        paragraphs: [
          "His grandfather Bhishma. His teacher Drona. His cousins. Men who had eaten at the same tables, told the same stories around the same fires.",
          "I cannot do this, he said. What victory is worth this?",
          "His bow — the divine Gandiva — fell from his hands. He sat down. He could not stand.",
          "What came next is not what you would expect. Krishna did not tell him to get up. He sat down beside him. And he began to ask questions.",
          "The Bhagavad Gita began not in a moment of courage — but in a moment of grief. That is the detail we tend to rush past. And it is the most important detail in the entire text.",
        ],
      },
    ],
    content: [
      {
        type: "paragraph",
        text: "Arjuna had stood on hundreds of battlefields. He had faced gods, demons, and the greatest warriors of his age. He had never once hesitated. But when he looked at the faces arrayed against him — his guru Dronacharya, his grand-uncle Bhishma, his cousins — his famous bow Gandiva slipped from his fingers.",
      },
      {
        type: "quote",
        text: "Of what use is victory if it means killing these — my own teachers, my own kin? I would rather beg in the streets than rule a kingdom built on their corpses.",
      },
      {
        type: "heading",
        text: "Why the Greatest Warrior Broke First",
      },
      {
        type: "paragraph",
        text: "There is a reason the Gita happens to Arjuna and not to someone like Bhima. Arjuna was the most conscious of the Pandavas — the most reflective, the most attuned to the complexity of what he was about to do. His crisis was not weakness. It was the natural consequence of a man who truly grasped the weight of his actions.",
      },
      {
        type: "heading",
        text: "The Gift of Paralysis",
      },
      {
        type: "paragraph",
        text: "Krishna does not immediately tell Arjuna to fight. He lets him speak. He lets the grief come out fully. And then he does something unusual — he smiles. Not with cruelty but with recognition. He has seen this before, in every soul that has ever stood at the threshold of a transformation they could not see their way through.",
      },
      {
        type: "lesson",
        text: "The next time you are paralysed by a decision — when every option feels like a betrayal of something you love — consider that you may be standing exactly where Arjuna stood. Not at the end of something, but at the beginning of a deeper understanding.",
      },
    ],
    keyLessons: [
      {
        icon: "🏹",
        title: "Doubt Is the Beginning",
        description:
          "Arjuna's paralysis qualified him for wisdom — it didn't disqualify him. You cannot receive deep truth when you are certain. Doubt opens what certainty closes.",
        accent: "gold",
      },
      {
        icon: "⚔️",
        title: "The Real Battle Is Internal",
        description:
          "Arjuna's real war was never with the Kauravas. It was with his own fear of loss, his grief about what doing the right thing would cost him.",
        accent: "crimson",
      },
      {
        icon: "🙏",
        title: "Asking for Help Is Strength",
        description:
          "In his lowest moment, Arjuna said: teach me, I don't know what's right anymore. That sentence gave the world the Bhagavad Gita.",
        accent: "gold",
      },
      {
        icon: "⏳",
        title: "You Are Allowed to Not Be Ready",
        description:
          "Arjuna had prepared his entire life and still wasn't ready when the moment came. Readiness is not a state you achieve — it's a process you keep returning to.",
        accent: "teal",
      },
      {
        icon: "🌅",
        title: "Clarity Comes After the Fall",
        description:
          "Not before it. Not during it. Arjuna had the breakdown first — and through it, arrived somewhere he never could have reached by the normal road.",
        accent: "gold",
      },
    ],
    modernConnections: [
      {
        context: "In Your Career",
        insight:
          "You have been building toward a moment your whole professional life — a presentation, a launch, a conversation that changes everything. And when it arrives, you freeze. Arjuna's message: the freeze is part of the process.",
        example:
          "Sit with it. Ask the questions it's asking you. Then rise. Your preparation is not gone — it's just waiting for your grief to finish speaking.",
      },
      {
        context: "In Your Relationships",
        insight:
          "There is a conversation you have been avoiding — with a parent, a partner, a version of yourself. You've rehearsed it a thousand times. And every time the moment arrives, you find a reason to walk away.",
        example:
          "Arjuna put down his bow at the edge of the battlefield. But he picked it up again. The question is not whether you're ready. It's whether you're willing.",
      },
      {
        context: "In Personal Growth",
        insight:
          "Every major transformation is preceded by profound confusion. The person you are becoming cannot be seen from where you are standing. Your confusion is not a detour from your path — it is the path.",
        example:
          "Arjuna could not see past the grief of that morning. By the afternoon, he had received the most complete philosophical education in history. Where is your morning of grief pointing you?",
      },
    ],
    lifeLessons: [
      "Doubt is not weakness — it is the beginning of wisdom",
      "Love and duty are not opposites; wisdom reconciles them",
      "The hardest battles are never fought on physical battlefields",
      "Paralysis is a call to seek clarity, not to retreat",
      "Asking for help is not weakness — it is the precondition for growth",
      "Clarity comes after the fall, not before it",
    ],
    sloka: {
      sanskrit: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः",
      transliteration: "Nainam chhindanti shastrani nainam dahati pavakah",
      translation:
        "Weapons cannot cut the soul, fire cannot burn it, water cannot wet it, and wind cannot dry it.",
    },
  },

  /* ══════════════ DRAUPADI ══════════════ */
  {
    slug: "draupadi-fire-and-dignity",
    title: "Draupadi: The Fire That Would Not Go Out",
    subtitle: "The queen who held five husbands to account",
    description:
      "Disrobed in a court full of kings, betrayed by the men sworn to protect her — and yet Draupadi stood taller than any of them. Her story is the spine of the Mahabharata.",
    summary:
      "She had one question. One devastating question. And no one in that court — not Bhishma, not Drona — could answer it.",
    category: "Characters",
    character: "Draupadi",
    readTime: 10,
    publishDate: "April 4, 2026",
    imageKey: "draupadi",
    image: "",
    metaTitle: "Draupadi: Strength & Resilience | Mahabharata Characters",
    metaDescription:
      "Draupadi was betrayed in a court full of kings. She asked one question no one could answer. Discover how her dignity changed the course of the epic.",
    pullQuote:
      "She had one question. One devastating question. And no one — not Bhishma, not Drona, not the scholars of dharma — could answer it.",
    relatedSlugs: ["karna-loyalty-vs-self-respect", "bhishma-terrible-oath"],
    storyBlocks: [
      {
        section: "introduction",
        label: "Introduction",
        paragraphs: [
          "There is a moment in the Mahabharata that is impossible to read without feeling something shift inside you.",
          "A queen is dragged by her hair into a court full of kings. She has been staked in a game of dice by the man sworn to protect her.",
          "And in the silence of her humiliation, she asks a question that no one in that room has the courage to answer.",
        ],
      },
      {
        section: "background",
        label: "Background",
        paragraphs: [
          "Draupadi was born from fire — literally. She emerged from a sacred ritual pyre alongside her brother Dhrishtadyumna, her birth itself an act of cosmic purpose.",
          "She chose Arjuna at her swayamvara through the most difficult archery feat devised. She married five brothers — not by choice, but by a mother's careless word that could not be unsaid.",
          "She was a queen of unprecedented brilliance who never had a single day in which all five of her husbands chose her over their ambitions, their duties, or their failures.",
        ],
      },
      {
        section: "turningPoint",
        label: "The Turning Point",
        paragraphs: [
          "Yudhishthira lost her in a game of dice. The Kaurava prince Dushasana dragged her by her hair into the royal court.",
          "She had one question: Was I staked before or after Yudhishthira had already lost himself? If he had no rights over himself, how could he stake me?",
          "The question echoed through the court and no one could answer it. Not Bhishma. Not Drona. Not Vidura. They lowered their eyes.",
          "Because she was right. And because she was right and they still did nothing, the war became inevitable.",
        ],
      },
    ],
    content: [
      {
        type: "quote",
        text: "Tell me — was I staked before or after Yudhishthira had already lost himself? If he had no rights over himself, how could he stake me?",
      },
      {
        type: "paragraph",
        text: "The Mahabharata does not present Draupadi as a passive sufferer. She refuses to let her husbands forget what was done to her. During their forest exile, when Yudhishthira counselled acceptance and patience, Draupadi would not let the memory dissolve into philosophy.",
      },
      {
        type: "lesson",
        text: "Draupadi teaches us that there is a difference between forgiveness and forgetting. You can refuse to be defined by what was done to you while still insisting that it was wrong and that it matters.",
      },
    ],
    keyLessons: [
      {
        icon: "👑",
        title: "Dignity Is Claimed, Not Given",
        description:
          "No one in that court gave Draupadi her dignity back. She claimed it herself — with one question that no one could refute.",
        accent: "gold",
      },
      {
        icon: "🔥",
        title: "The System That Fails You Is Still Your Responsibility to Challenge",
        description:
          "Every elder in that court knew it was wrong. Draupadi was the only one who said so. Silence in the face of injustice is its own form of participation.",
        accent: "crimson",
      },
      {
        icon: "❓",
        title: "A Single Question Can Change History",
        description:
          "Draupadi's question did not just expose a legal loophole. It exposed the moral bankruptcy of an entire system — and made a war inevitable.",
        accent: "gold",
      },
      {
        icon: "🌿",
        title: "Endurance Is Not Acceptance",
        description:
          "Draupadi endured thirteen years of exile. She never once accepted that it was deserved. Enduring what you cannot change is not the same as agreeing with it.",
        accent: "teal",
      },
    ],
    modernConnections: [
      {
        context: "In Your Career",
        insight:
          "There is a moment in every professional life when a rule is used against you that was never designed to protect you. Draupadi's move was not to protest — it was to ask the question that exposed the rule's own contradiction.",
        example:
          "When the system fails you, the most powerful thing you can do is ask it to explain itself. Not angrily. Precisely. The question that reveals the flaw is more powerful than the protest that merely expresses it.",
      },
      {
        context: "In Your Relationships",
        insight:
          "How many of us have stayed silent when someone we love acted against us — because speaking would have required the people around us to take a side they weren't prepared to take?",
        example:
          "Draupadi spoke in a room full of people who were hoping she wouldn't. Your truth will also be inconvenient to someone. Speak it anyway.",
      },
    ],
    lifeLessons: [
      "Dignity is not given to you — it is claimed by you",
      "A single voice asking the right question can change history",
      "Never mistake endurance for acceptance",
      "The system that fails you is still your responsibility to challenge",
    ],
  },

  /* ══════════════ BHISHMA ══════════════ */
  {
    slug: "bhishma-terrible-oath",
    title: "Bhishma's Oath: The Sacrifice That Became a Prison",
    subtitle: "When self-denial becomes the greatest indulgence",
    description:
      "He gave up a throne and a wife to secure his father's happiness. Centuries later, he died defending the very injustice his sacrifice had made possible.",
    summary:
      "His oath was made in love. But by making it absolute, he removed his own moral agency — and became a weapon in the hands of whoever held the throne.",
    category: "Characters",
    character: "Bhishma",
    readTime: 9,
    publishDate: "April 2, 2026",
    imageKey: "bhishma",
    image: "",
    metaTitle: "Bhishma's Vow: When Sacrifice Becomes a Cage | Mahabharata",
    metaDescription:
      "Bhishma gave up everything out of love — and his sacrifice enabled every injustice that followed. The most cautionary story in the Mahabharata about unconditional loyalty.",
    pullQuote:
      "His oath was made in love. But by making it absolute — by removing his own moral agency — he became a weapon in the hands of whoever held the throne.",
    relatedSlugs: ["karna-loyalty-vs-self-respect", "draupadi-fire-and-dignity"],
    storyBlocks: [
      {
        section: "introduction",
        label: "Introduction",
        paragraphs: [
          "Devavrata was the greatest warrior of his age. The son of Ganga herself, trained by Parashurama, heir to the throne of Hastinapura.",
          "He gave all of it up. Not under compulsion. Not in defeat.",
          "He gave it up to make a fisherman feel comfortable about giving his daughter to an old king.",
        ],
      },
      {
        section: "background",
        label: "Background",
        paragraphs: [
          "The vow Devavrata took was so extreme, so total in its renunciation, that the gods themselves named him Bhishma — he of the terrible oath.",
          "He would never marry, never father children, and would serve whoever sat on the throne of Hastinapura — regardless of their worthiness.",
          "In one act of love for his father, Bhishma removed himself as a moral agent from his own life. He would not choose. He would only serve.",
        ],
      },
      {
        section: "turningPoint",
        label: "The Turning Point",
        paragraphs: [
          "Decades later, Bhishma sat in the court of Hastinapura while Draupadi was being disrobed.",
          "He could have stood up. He could have spoken the word that would have ended it. He was the most powerful man in that room.",
          "Instead he said: I cannot speak against the king I am sworn to serve. The question of dharma is too subtle for me to answer.",
          "The Mahabharata does not let Bhishma hide behind subtlety. His silence was a choice. And it was the most consequential choice in the entire epic.",
        ],
      },
    ],
    content: [
      {
        type: "quote",
        text: "A man can have great power and great goodness and still, through a single misplaced commitment, become an instrument of great harm.",
      },
      {
        type: "lesson",
        text: "When you make a commitment, build in a mechanism for reconsideration. An oath that cannot be broken becomes a cage. The Mahabharata asks: who does your loyalty ultimately serve?",
      },
    ],
    keyLessons: [
      {
        icon: "🔒",
        title: "Unconditional Loyalty Is Not Virtue",
        description:
          "Loyalty that cannot evaluate the worthiness of its object is not devotion — it is abdication of moral responsibility.",
        accent: "crimson",
      },
      {
        icon: "⏳",
        title: "Not Every Oath Deserves to Be Kept Indefinitely",
        description:
          "Bhishma's oath was noble when made. It became monstrous over time, as the throne it served became corrupt. Wisdom requires knowing when to release what you once committed to.",
        accent: "gold",
      },
      {
        icon: "🎭",
        title: "Silence in the Face of Injustice Is a Choice",
        description:
          "Bhishma did not act against Draupadi — he simply did nothing. The Mahabharata treats his silence as one of the great moral failures of the epic.",
        accent: "crimson",
      },
    ],
    modernConnections: [
      {
        context: "In Your Career",
        insight:
          "Have you ever stayed silent in a meeting when you knew something wrong was happening — because speaking would have complicated your position? Bhishma was the most powerful person in that room. He chose institutional loyalty over moral clarity.",
        example:
          "The question is not whether you have the power to speak. Bhishma clearly did. The question is whether you have built your identity so deeply around a role that the role now speaks for you.",
      },
    ],
    lifeLessons: [
      "Not every oath deserves to be kept indefinitely",
      "Loyalty without ongoing moral evaluation becomes complicity",
      "Silence in the face of injustice is itself a choice",
      "Wisdom requires knowing when to release what you once committed to",
    ],
  },

  /* ══════════════ DHARMA ══════════════ */
  {
    slug: "dharma-beyond-rules",
    title: "Dharma Is Not a Rulebook — It Is a Compass",
    subtitle: "The most misunderstood concept in Indian philosophy",
    description:
      "Everyone in the Mahabharata claims to be acting according to dharma. And yet they destroy each other. What does this tell us about the nature of righteous action?",
    summary:
      "Everyone invoked dharma. Everyone destroyed each other. The Mahabharata's most urgent lesson is about the difference between following rules and living with wisdom.",
    category: "Life Lessons",
    readTime: 6,
    publishDate: "March 30, 2026",
    imageKey: "hero",
    image: "",
    pullQuote:
      "Dharma is what holds the world together. But what holds dharma together is wisdom — not rules.",
    relatedSlugs: [
      "krishna-leadership-secrets",
      "arjuna-confusion-moment-of-doubt",
    ],
    storyBlocks: [
      {
        section: "introduction",
        label: "Introduction",
        paragraphs: [
          "The word dharma appears thousands of times in the Mahabharata. Every major character invokes it. They all claim it.",
          "And yet their interpretations of it lead to one of the most catastrophic events in mythological history.",
          "How can one concept produce such radically different — and mutually destructive — conclusions?",
        ],
      },
      {
        section: "background",
        label: "Background",
        paragraphs: [
          "The answer lies in a fundamental misreading of what dharma is. It is not a list of rules. It is closer to a gravitational field — a natural tendency toward order and rightness that each person must navigate relative to their own nature, position, and circumstance.",
          "This is why the Sanskrit term svadharma — one's own dharma — is so crucial. The dharma of a warrior is different from the dharma of a teacher. The dharma of a king in peace differs from his dharma in war.",
          "Rigid dharma — dharma applied without contextual wisdom — becomes the most dangerous force in the epic.",
        ],
      },
      {
        section: "turningPoint",
        label: "The Turning Point",
        paragraphs: [
          "Yudhishthira is titled Dharmaraja — King of Dharma. And yet his rigid adherence to rules caused enormous harm.",
          "He staked his wife in a gambling game because refusing to play would have been 'un-kingly.' He told a technical truth about Ashwatthama that helped kill his own guru.",
          "His dharma was real. But it was brittle — it broke under pressure because it had not been tempered by wisdom.",
        ],
      },
    ],
    content: [
      {
        type: "quote",
        text: "Dharma is what holds the world together. But what holds dharma together is wisdom — not rules.",
      },
      {
        type: "lesson",
        text: "Before you invoke a principle to justify an action, ask: does this principle serve the purpose for which it was created? Dharma is not the shield you hold up to avoid difficult choices. It is the inner knowing that points you toward the difficult choice you must make.",
      },
    ],
    keyLessons: [
      {
        icon: "🧭",
        title: "Dharma Is Contextual, Not Absolute",
        description:
          "The same action can be dharmic for one person and adharmic for another, depending on who they are and what they face. There is no universal rulebook.",
        accent: "gold",
      },
      {
        icon: "🌱",
        title: "Knowing Yourself Is the Prerequisite",
        description:
          "You cannot perform your dharma without knowing who you are. Self-knowledge is not a luxury — it is the foundation of right action.",
        accent: "teal",
      },
    ],
    lifeLessons: [
      "Dharma is contextual, not absolute",
      "Rules without wisdom produce the most dangerous kind of righteousness",
      "Self-knowledge is the prerequisite for right action",
    ],
    sloka: {
      sanskrit: "धर्मो रक्षति रक्षितः",
      transliteration: "Dharmo rakshati rakshitah",
      translation: "Dharma protects those who protect dharma.",
    },
  },

  /* ══════════════ GITA 2.47 ══════════════ */
  {
    slug: "gita-verse-two-forty-seven",
    title: "The Most Misquoted Verse in Human History",
    subtitle: "What 2.47 of the Bhagavad Gita actually means",
    description:
      "\"You have a right to perform your duties but not to the fruits\" — nine words used to justify everything from indifference to extraordinary heroism. Here is what Krishna actually meant.",
    summary:
      "Nine words. Thousands of years of misquotation. The verse that has been used to justify everything — and what it actually says about how to act in the world.",
    category: "Slokas",
    readTime: 5,
    publishDate: "March 28, 2026",
    imageKey: "krishna",
    image: "",
    pullQuote:
      "Excellence is what happens when ego stops managing the performance.",
    relatedSlugs: [
      "arjuna-confusion-moment-of-doubt",
      "krishna-leadership-secrets",
    ],
    storyBlocks: [
      {
        section: "introduction",
        label: "Introduction",
        paragraphs: [
          "This verse has been used to justify passivity. It has also been used to justify recklessness.",
          "Both readings miss the point entirely.",
          "Krishna is speaking to a warrior paralysed by excessive concern about outcomes. The verse is not a philosophy of indifference. It is a remedy for paralysis.",
        ],
      },
      {
        section: "background",
        label: "Understanding the Verse",
        paragraphs: [
          "The Sanskrit word used for 'right' — adhikara — is closer to 'jurisdiction' or 'domain.' Your domain is the action. The fruit belongs to a larger web of causation that includes your actions but is not limited to them.",
          "Recognising this is not pessimism. It is a kind of cosmic realism that paradoxically produces better outcomes — because actions taken without ego-contamination are simply better actions.",
        ],
      },
      {
        section: "turningPoint",
        label: "What It Actually Means",
        paragraphs: [
          "The surgeon performing a complex operation cannot afford to think about her fee, her reputation, or even the patient's gratitude. She must be fully present to the task.",
          "That presence — complete absorption in the quality of the action itself — is what Krishna is pointing to. The ego's investment in outcome is the very thing that degrades the quality of action.",
          "Detachment from outcome is not indifference. It is the precondition for excellence.",
        ],
      },
    ],
    content: [
      {
        type: "quote",
        text: "Excellence is what happens when ego stops managing the performance.",
      },
      {
        type: "lesson",
        text: "Try this: for one week, measure yourself only by the quality of effort you brought to each task — not by the results. Notice what changes in how you show up.",
      },
    ],
    keyLessons: [
      {
        icon: "🎯",
        title: "Detachment Enables Excellence",
        description:
          "The surgeon, the athlete, the parent at their best — none of them are thinking about the outcome in the moment. They are entirely present to the action.",
        accent: "gold",
      },
      {
        icon: "🌊",
        title: "Your Domain Is the Action",
        description:
          "The fruit belongs to a web of causation larger than you. Recognising this is not giving up — it is aligning yourself with reality.",
        accent: "teal",
      },
    ],
    lifeLessons: [
      "Detachment from outcomes is not indifference — it is liberation",
      "Quality of action rises when ego is removed from results",
      "The present moment of action is where meaning lives",
    ],
    sloka: {
      sanskrit:
        "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
      transliteration:
        "Karmanye vadhikaraste ma phaleshu kadachana,\nma karmaphalaheturbhur ma te sango'stvakarmanee",
      translation:
        "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    },
  },

  /* ══════════════ VIDURA ══════════════ */
  {
    slug: "silence-of-vidura",
    title: "Vidura: The Wise Man Who Was Never Listened To",
    subtitle: "Truth-telling in a court of comfortable lies",
    description:
      "He warned Dhritarashtra before every catastrophe. He saw the war coming decades before it arrived. He was ignored every time. Vidura's story is the tragedy of wisdom without power.",
    summary:
      "He predicted every disaster. He was ignored every time. Vidura's story is the Mahabharata's most urgent lesson about the price of speaking truth in a room that has already decided.",
    category: "Philosophy",
    readTime: 7,
    publishDate: "March 25, 2026",
    imageKey: "hero",
    image: "",
    pullQuote:
      "A blind king who gives his blind love to a wrongful son — what counsel can reach him? Wisdom is wasted on the heart that has already decided.",
    relatedSlugs: ["bhishma-terrible-oath", "dharma-beyond-rules"],
    storyBlocks: [
      {
        section: "introduction",
        label: "Introduction",
        paragraphs: [
          "Vidura was the son of Vyasa, brother to Dhritarashtra and Pandu, and widely acknowledged as the wisest man in Hastinapura.",
          "He had no political ambitions. He had no army. What he had was the unnerving ability to see clearly and the moral courage to say what he saw.",
          "He was ignored every single time.",
        ],
      },
      {
        section: "background",
        label: "Background",
        paragraphs: [
          "He told Dhritarashtra that raising Duryodhana as the crown prince would lead to the destruction of the Kuru dynasty. He was ignored.",
          "He pleaded against the dice game. He was overruled. He argued against the war itself, right until the armies were drawn up.",
          "He was thanked for his counsel and dismissed.",
        ],
      },
      {
        section: "turningPoint",
        label: "The Turning Point",
        paragraphs: [
          "The Mahabharata does not present Vidura's ineffectiveness as a failure of his wisdom. His advice was correct. The destruction he predicted happened exactly as he said it would.",
          "His failure was structural. He was advising a man who lacked the courage to hear what Vidura was saying — because hearing it would have required acting against his most basic attachment: the love for his eldest son.",
          "Vidura's response to this failure is instructive. He did not stop advising. He did not become cynical. He stayed, spoke his truth, accepted that it was not received, and chose the path of non-cooperation with injustice.",
        ],
      },
    ],
    content: [
      {
        type: "quote",
        text: "A blind king who gives his blind love to a wrongful son — what counsel can reach him? Wisdom is wasted on the heart that has already decided.",
      },
      {
        type: "lesson",
        text: "Your job is to see clearly and speak honestly. What people do with what you say belongs to them. Vidura did not fail because he was ignored. He succeeded at the only thing genuinely in his control: being a witness to truth.",
      },
    ],
    keyLessons: [
      {
        icon: "🗣️",
        title: "Speaking Truth Is Your Responsibility",
        description:
          "Being heard is not always in your control. The obligation to speak truth is separate from the power to make it land.",
        accent: "gold",
      },
      {
        icon: "🏛️",
        title: "Proximity to Power Is Not Endorsement",
        description:
          "Vidura stayed in Hastinapura without endorsing its corruption. He modelled a third path: present, honest, and uncommitted to the outcome.",
        accent: "teal",
      },
    ],
    lifeLessons: [
      "Speaking truth is your responsibility; being heard is not always in your control",
      "True wisdom seeks to prevent suffering, not to win arguments",
      "Staying to witness is its own form of moral action",
    ],
  },

  /* ══════════════ KARNA — TRAGIC HERO ══════════════ */
  {
    slug: "karna-tragic-hero-world-literature",
    title: "Why Karna Is the Most Tragic Hero in All of World Literature",
    subtitle: "He knew the truth about who he was. He buried it. And smiled while doing it.",
    description:
      "Born to a queen, thrown into a river, raised by a charioteer — Karna never got a fair start. But what makes him the most tragic hero in all of world literature is not what happened to him. It is what he chose to do with it.",
    summary:
      "Karna had every reason to be bitter. He had every reason to switch sides. He did neither. This is the story of the man who lost everything — and never once asked the universe why.",
    category: "Characters",
    character: "Karna",
    readTime: 9,
    publishDate: "May 21, 2026",
    featured: false,
    imageKey: "karna",
    image: "",
    metaTitle: "Why Karna Is the Most Tragic Hero in World Literature | MahabharataDecoded",
    metaDescription:
      "Karna was abandoned at birth, humiliated in public, cursed three times, and offered a kingdom — and still chose to lose. Here is why his story hits harder than any other in world literature.",
    pullQuote:
      "He was not broken by what the world did to him. He was broken by what he chose not to do about it.",
    authorNote:
      "This article draws from the Karna Parva, Adi Parva, Udyoga Parva, and Drona Parva of Vyasa's Mahabharata. Karna's three curses are sourced from the Brahma curse in Adi Parva, the Parashurama curse in Udyoga Parva, and the Earth curse from a Brahmin in Karna Parva.",
    reelHook: {
      hook: "Karna was the firstborn Pandava. He could have been king. He chose to die on the other side. Here is the reason.",
      supporting:
        "He was not loyal because he was naive. He was loyal because he decided that keeping his word mattered more than winning.",
    },
    relatedSlugs: ["karna-loyalty-vs-self-respect", "arjuna-confusion-moment-of-doubt", "bhishma-terrible-oath"],
    storyBlocks: [
      {
        section: "introduction",
        label: "A Hero Unlike Any Other",
        paragraphs: [
          "Most tragic heroes are destroyed by a flaw they cannot control.",
          "Karna is destroyed by a virtue he refused to let go of.",
          "That is what makes him different. That is what makes him unforgettable. And that is why — three thousand years after Vyasa wrote him — people still argue about him at dinner tables, in comment sections, and in college classrooms across the world.",
        ],
      },
      {
        section: "background",
        label: "Born at the Worst Possible Time",
        paragraphs: [
          "Kunti was a teenager when she got her powers. A sage named Durvasa gave her a mantra that could call any god to her. Being young and curious, she tested it. She called Surya, the sun god.",
          "Nine months later, Karna was born.",
          "He came into the world with golden armour fused to his chest and earrings attached to his ears. He was literally born glowing. And Kunti, terrified of the shame and the questions, put him in a box and floated him down the river.",
          "He was picked up by a charioteer named Adhiratha and his wife Radha. They loved him completely. He grew up in their home, calling himself Radheya — son of Radha.",
          "But the world never forgot where he came from. Or rather, the world never let him forget where they thought he came from.",
        ],
      },
      {
        section: "turningPoint",
        label: "The Night Everything Could Have Changed",
        paragraphs: [
          "The night before the Kurukshetra war, Krishna came to Karna alone.",
          "No armies. No witnesses. Just two men sitting together in the dark.",
          "Krishna told him everything. Your real mother is Kunti. Your brothers are the Pandavas. You are the eldest. Cross over. The war ends tomorrow. The throne is yours.",
          "Karna listened to every word.",
          "Then he said: I know. And I cannot do it.",
          "He had known for a long time, actually. Kunti herself had come to him earlier and told him the truth, begging him not to fight. He made her a promise: he would not kill any of the Pandavas except Arjuna. She would still have five sons when this was over.",
          "But he could not leave Duryodhana. Not now. Not after everything.",
          "He went back to his camp. He prepared for the war. And he never told anyone what Krishna had offered him.",
        ],
      },
    ],
    content: [
      {
        type: "paragraph",
        text: "Let us start at the beginning — because the beginning of Karna's story is one of the cruellest in all of literature.",
      },
      {
        type: "heading",
        text: "The Moment He Was Abandoned",
      },
      {
        type: "paragraph",
        text: "He did not choose to be born. He did not choose his mother. He did not choose to be put in a basket and floated down a river like he was something to be gotten rid of. He was a newborn baby, and the first thing the world did to him was throw him away.",
      },
      {
        type: "paragraph",
        text: "This matters because Karna never forgot it — not consciously, but in the way it shaped every choice he made afterward. He grew up knowing, at some deep level, that identity could be taken from you. That the world would always ask: who is your father? Where do you come from? And if your answer wasn't good enough, the doors would close.",
      },
      {
        type: "paragraph",
        text: "The charioteer family that raised him loved him deeply. He had a good life, a real home, parents who were proud of him. But Karna was extraordinary in ways that his birth family could never fully contain. He was a natural warrior. He trained obsessively. He wanted to be the best archer in the world — and he had the talent to actually become it.",
      },
      {
        type: "heading",
        text: "The Day the World Laughed at Him",
      },
      {
        type: "paragraph",
        text: "The Rangabhoomi tournament is one of those scenes in the Mahabharata that is hard to read without your chest tightening.",
      },
      {
        type: "paragraph",
        text: "The Kuru princes are showing off their skills. Arjuna performs brilliantly. The crowd goes wild. And then, from the back, Karna walks in and matches every single thing Arjuna just did. Arrow for arrow. Feat for feat. Sometimes better.",
      },
      {
        type: "quote",
        text: "Only a king may challenge a king. Tell me your father's name, charioteer's son.",
      },
      {
        type: "paragraph",
        text: "The entire stadium heard it. The laughter that followed. Draupadi turned her face away. The Pandavas relaxed. The Kaurava princes smirked. A whole arena full of people decided, in that one moment, that a man's talent meant nothing if his blood wasn't right.",
      },
      {
        type: "paragraph",
        text: "Duryodhana stood up.",
      },
      {
        type: "paragraph",
        text: "He walked to Karna, took off his own crown, and made him the King of Anga on the spot. Right there, in front of everyone. A full kingdom, handed over, because one person in that whole crowd decided to see the man instead of his surname.",
      },
      {
        type: "paragraph",
        text: "This is the moment that locked Karna's fate. Not a curse. Not a prophecy. A moment of kindness from the wrong person, given for possibly the wrong reasons — but experienced by Karna as the realest, most sincere thing anyone had ever done for him.",
      },
      {
        type: "heading",
        text: "The Three Curses That Sealed His End",
      },
      {
        type: "paragraph",
        text: "If you wanted to engineer the guaranteed death of the world's greatest warrior, this is how you would do it. You would make sure that every advantage he had would vanish exactly when he needed it most.",
      },
      {
        type: "lesson",
        text: "Curse One — Parashurama: Karna trained under the great Parashurama by lying about his caste. He said he was a Brahmin. Parashurama only taught Brahmins. During one session, a worm burrowed into Karna's thigh while Parashurama slept on his lap. Karna did not flinch, because waking his teacher would be disrespectful. When Parashurama woke to blood, he understood immediately — no Brahmin could endure pain like that. Only a warrior. He cursed Karna: the knowledge of the Brahmastra weapon would vanish from his memory at the moment he needed it most.",
      },
      {
        type: "lesson",
        text: "Curse Two — A Brahmin's grief: Karna's chariot wheel once crushed a calf belonging to a Brahmin. The Brahmin, mad with grief, cursed him: your chariot wheel will sink into the earth during battle, leaving you helpless. A strange, specific curse that sounds almost accidental. It was the one that killed him.",
      },
      {
        type: "lesson",
        text: "Curse Three — Indra's disguise: Indra, king of the gods and Arjuna's father, came to Karna disguised as a beggar and asked for the divine armour fused to his chest. Everyone knew Karna never refused anyone who came asking. Indra counted on this. Karna knew it was a trap. He gave the armour anyway — because stopping would have meant becoming someone who could refuse a beggar. In return, Indra gave him a single divine weapon, the Vasavi Shakti, that could kill anyone. One use only.",
      },
      {
        type: "paragraph",
        text: "Three curses. Three wounds. Each one targeting something different — his mind, his ground, his body. And here is what makes it devastating: in every case, Karna knew what was happening and went ahead anyway.",
      },
      {
        type: "heading",
        text: "The Night Krishna Offered Him Everything",
      },
      {
        type: "paragraph",
        text: "People talk about this scene as if Karna made a mistake. He didn't. He made a decision.",
      },
      {
        type: "paragraph",
        text: "When Krishna laid out everything — the throne, the brothers, the wife, the recognition — Karna sat with it quietly. He thought about Duryodhana, who had stood up for him in that stadium when no one else did. He thought about thirteen years of friendship, of being treated as an equal, of a kingdom given freely.",
      },
      {
        type: "paragraph",
        text: "Then he told Krishna something that has echoed for three thousand years:",
      },
      {
        type: "quote",
        text: "I was given a kingdom when I had nothing. To abandon that king now, when he needs me most, would be the greatest adharma I could commit. I know what I am giving up. I know what is waiting for me. I choose this anyway.",
      },
      {
        type: "paragraph",
        text: "This is not the speech of a naive man. This is the speech of someone who has looked clearly at the cost, counted every single thing on both sides, and made a choice with complete awareness.",
      },
      {
        type: "paragraph",
        text: "That is not a flaw. That is a kind of terrifying integrity.",
      },
      {
        type: "heading",
        text: "His Death — and What It Actually Means",
      },
      {
        type: "paragraph",
        text: "Karna died exactly the way the curses promised he would.",
      },
      {
        type: "paragraph",
        text: "During his final battle with Arjuna, his chariot wheel sank into the earth. He jumped down to free it — unarmed, mid-battle. He called out to Arjuna: wait. A warrior does not attack an unarmed man. Give me a moment.",
      },
      {
        type: "paragraph",
        text: "And Krishna, watching from Arjuna's chariot, told Arjuna to shoot.",
      },
      {
        type: "paragraph",
        text: "This is the most controversial moment in the entire epic. Arjuna hesitated. Krishna did not. He reminded Arjuna of every humiliation Karna had participated in — Draupadi's disrobing, Abhimanyu's unfair death. He pushed Arjuna to fire.",
      },
      {
        type: "paragraph",
        text: "Karna died with his hands in the dirt, trying to free a wheel.",
      },
      {
        type: "paragraph",
        text: "And even Arjuna, his lifelong rival, felt sick about it.",
      },
      {
        type: "heading",
        text: "Why We Still Cannot Stop Talking About Him",
      },
      {
        type: "paragraph",
        text: "Here is the honest answer: Karna stays with us because he represents something we all privately fear about ourselves.",
      },
      {
        type: "paragraph",
        text: "He is the question: what if I am loyal to the wrong side? What if the people I have given my best years to are not the good guys? What if the identity I have built my whole life around is the wrong one — and I only find out when it is too late to change?",
      },
      {
        type: "paragraph",
        text: "Most of us will never fight a war. But most of us have stayed in a job, a friendship, or a relationship longer than we should have — because someone was kind to us once when the world wasn't, and we could not bring ourselves to leave.",
      },
      {
        type: "paragraph",
        text: "Karna is every person who ever chose integrity over outcome. Who ever said: I know what this is going to cost me. I am choosing it anyway.",
      },
      {
        type: "paragraph",
        text: "The Greeks gave us Achilles — rageful, brilliant, undone by pride. The English gave us Hamlet — thoughtful, paralysed, undone by doubt. Shakespeare gave us Macbeth — ambitious, undone by wanting too much.",
      },
      {
        type: "paragraph",
        text: "India gave us Karna. Undone by loyalty. By the refusal to dishonour a friend. By the simple, devastating act of keeping his word.",
      },
      {
        type: "paragraph",
        text: "There is no villain in that. There is only a man who decided that how he lived mattered more than whether he survived.",
      },
      {
        type: "paragraph",
        text: "Three thousand years later, we are still sitting with the question he left behind: was he right?",
      },
    ],
    keyLessons: [
      {
        icon: "🌊",
        title: "Kindness at the Right Moment Changes Everything",
        description:
          "One person standing up for you when the world laughs can become the anchor of your entire life. Be careful who you accept that kindness from — and be someone who offers it freely.",
        accent: "gold",
      },
      {
        icon: "⚖️",
        title: "Loyalty Has an Expiry Date",
        description:
          "Karna's tragedy is not that he was loyal. It is that he could not ask himself: has this loyalty been earned by who this person is now, or by who they were to me then?",
        accent: "crimson",
      },
      {
        icon: "🎯",
        title: "Knowing the Cost and Choosing Anyway",
        description:
          "Karna was not naive. He made his choices with full information. That is both his greatness and his downfall — and it asks us: are we choosing our paths consciously, or just drifting?",
        accent: "gold",
      },
      {
        icon: "🪞",
        title: "Identity Is Not What You Were Born Into",
        description:
          "He was thrown into a river. He became a king. The world tried to define him by his origin. He defined himself by his actions. That lesson alone is worth the whole story.",
        accent: "teal",
      },
      {
        icon: "✨",
        title: "How You Lose Matters As Much As Whether You Win",
        description:
          "Karna died with his character completely intact. His enemies respected him. His killer felt ashamed. There is a kind of victory in that which no battlefield can give you.",
        accent: "gold",
      },
    ],
    modernConnections: [
      {
        context: "In Your Career",
        insight:
          "Have you stayed in a job or on a team that you knew was going the wrong direction — because someone gave you your first break there, and leaving felt like betrayal? That is exactly Karna's dilemma. Gratitude is real. But gratitude cannot be a life sentence.",
        example:
          "Your first manager believed in you when no one else did. Now they are leading a project you know is unethical. You stay silent, because you owe them. Karna stayed silent too. The Mahabharata shows us where that silence leads.",
      },
      {
        context: "In Your Relationships",
        insight:
          "Some of the people we are most loyal to are people who were kind to us during our most vulnerable moments. That kindness is real. But it does not mean those people are always right — or that staying loyal to them is always the right thing.",
        example:
          "A friend who stood by you during your worst year. Now they are doing something you know is wrong and they want your support. What do you owe them? Karna knew exactly what he owed Duryodhana. He paid it with his life.",
      },
      {
        context: "On Self-Worth",
        insight:
          "Karna spent his whole life proving that where you come from does not define what you are worth. He succeeded completely — and still could not escape the identity the world had decided to give him. The lesson is not that self-worth doesn't matter. It is that the world is slow to change its mind.",
        example:
          "You have worked twice as hard as everyone else to prove yourself in a room where people already decided who you are. Karna did this his entire life. He never stopped. Neither should you.",
      },
    ],
    lifeLessons: [
      "Gratitude is sacred — but it cannot be a life sentence",
      "The world will try to define you by your origin; define yourself by your choices",
      "Knowing the cost of a decision and choosing it anyway is not weakness — it is a different kind of strength",
      "How you lose tells people more about you than how you win",
      "One person standing up for you at the right moment can change your entire life — be that person for someone",
      "Loyalty must be examined regularly, not just inherited from a moment of kindness",
    ],
    sloka: {
      sanskrit:
        "नायं हन्ति न हन्यते।",
      transliteration:
        "Nayam hanti na hanyate",
      translation:
        "The soul is never born, nor does it die. It is eternal. — Bhagavad Gita 2.19. Karna's body fell. His story never did.",
    },
  },

];

/* ─────────────────── Helpers ─────────────────── */
export const getFeaturedArticle = (): Article =>
  articles.find((a) => a.featured) ?? articles[0];

export const getArticlesByCategory = (category: string): Article[] =>
  category === "All" ? articles : articles.filter((a) => a.category === category);

export const getArticleBySlug = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);

export const getRelatedArticles = (article: Article): Article[] => {
  if (article.relatedSlugs?.length) {
    const found = article.relatedSlugs
      .map((s) => articles.find((a) => a.slug === s))
      .filter(Boolean) as Article[];
    if (found.length >= 2) return found.slice(0, 3);
  }
  return articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3)
    .concat(
      articles.filter(
        (a) => a.slug !== article.slug && a.category !== article.category
      )
    )
    .slice(0, 3);
};
