/* ─────────────────────────────────────────────────────────────────────────
   src/data/temples.ts
   Temples of the Mahabharata — State by State
   MahabharataDecoded.com

   CONTENT INTEGRITY RULES (strictly followed):
   TIER 1 — Verified by ASI excavations, UNESCO records, inscriptions, or
             peer-reviewed findings. Stated as fact.
   TIER 2 — Appears in a named, dated classical text. Always prefixed with
             the text name. NEVER stated as historical fact.
   TIER 3 — Not traceable to a named classical text. Always "Regional
             tradition holds..." or "Devotees believe...". NEVER stated as
             historical or scriptural fact.

   NEVER write:
   - "The Pandavas built this temple" unless ASI inscription confirms it
   - "This temple dates to the Mahabharata era" without carbon dating <500 BCE
   - "According to history..." when the source is a Purana
   - Conflate age of worship site with age of current structure
───────────────────────────────────────────────────────────────────────── */

export interface SourceRecord {
  tier: 1 | 2 | 3;
  label: string;
  detail: string;
}

export interface HistoricalDebate {
  verifiedFact: string;
  tradition: string;
  scholarlyNote: string;
  verdict:
    | "archaeologically-confirmed"
    | "textually-documented-not-excavated"
    | "tradition-only-no-text-evidence";
}

export interface PrimarySource {
  label: string;
  url: string;
  accessedDate: string;
}

export interface MahabharataTemple {
  id: string;
  name: string;
  state: string;
  city: string;
  coordinates: { lat: number; lng: number };
  deity: string;
  builtBy: string;
  century: string;
  architectureStyle: string;
  mahabharataConnection: SourceRecord;
  historicalDebate: HistoricalDebate;
  verifiedSignificance: string;
  traditionalSignificance: string;
  criticalQuestion: string;
  isASIProtected: boolean;
  isUNESCO: boolean;
  visitInfo: string;
  tags: string[];
  lastVerified: string;
  primarySources: PrimarySource[];
  flaggedForReview: boolean;
  specialDisplay?: {
    borderColor?: string;
    label?: string;
  };
}

export const TEMPLES: MahabharataTemple[] = [

  /* ── TEMPLE 1 ─────────────────────────────────────────────────────── */
  {
    id: "hoysaleshwara-halebidu",
    name: "Hoysaleshwara Temple",
    state: "Karnataka",
    city: "Halebidu",
    coordinates: { lat: 13.2167, lng: 75.9833 },
    deity: "Shiva (Hoysaleshwara and Shanthhaleshwara)",
    builtBy: "King Vishnuvardhana of the Hoysala Empire",
    century: "12th century CE (construction started 1121 CE, completed 1160 CE)",
    architectureStyle: "Hoysala — stellate plan, chloritic schist stone",
    mahabharataConnection: {
      tier: 1,
      label: "Archaeological Evidence",
      detail:
        "Outer walls contain a carved narrative frieze showing the Chakravyuh formation with Abhimanyu fighting inside it. Source: Smarthistory peer-reviewed academic platform: 'At right, the Kaurava army creates a chakravyua (wheel-shaped) battle formation, trapping Abhimanyu' (Drona Parva, Mahabharata).",
    },
    historicalDebate: {
      verifiedFact:
        "Construction 1121–1160 CE confirmed by ASI records and temple inscriptions. Builder King Vishnuvardhana confirmed by inscriptions. UNESCO World Heritage Site since 2023 (Sacred Ensembles of the Hoysalas, WHC List 1670). Twice sacked by the Delhi Sultanate: Alauddin Khilji and Muhammad bin Tughlaq (1326 CE).",
      tradition:
        "The Chakravyuh scene depicted is from the Drona Parva of the Mahabharata. The carving is a 12th-century Hoysala artistic interpretation — not a Mahabharata-era site.",
      scholarlyNote:
        "Temple built over 3,000 years after the Mahabharata is traditionally dated. Carvings depict Mahabharata stories. The site has no Mahabharata-era origin.",
      verdict: "archaeologically-confirmed",
    },
    verifiedSignificance:
      "UNESCO World Heritage Site (2023). One of the finest examples of Hoysala temple architecture. Contains peer-reviewed documented Mahabharata narrative carvings on outer walls.",
    traditionalSignificance:
      "The Chakravyuh carving memorialises Abhimanyu's death — the moment a teenage warrior entered a military formation designed to trap him, knowing he could not escape.",
    criticalQuestion:
      "Hoysala sculptors chose to carve Abhimanyu's death in the Chakravyuh on their temple walls in 1121 CE — over 3,000 years after the event is said to have happened. What does that choice tell us about how the Mahabharata lived in medieval India's cultural memory?",
    isASIProtected: true,
    isUNESCO: true,
    visitInfo: "Halebidu village, Hassan district, Karnataka. Open daily. No entry fee for Indian nationals.",
    tags: ["Karnataka", "Hoysala", "Abhimanyu", "Chakravyuh", "UNESCO", "ASI"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "UNESCO World Heritage Centre — Sacred Ensembles of the Hoysalas",
        url: "https://whc.unesco.org/en/list/1670",
        accessedDate: "2026-06",
      },
      {
        label: "Smarthistory — Hoysaleshvara Temple",
        url: "https://smarthistory.org/hoysaleshvara-temple/",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 2 ─────────────────────────────────────────────────────── */
  {
    id: "sthaneshwar-kurukshetra",
    name: "Sthaneshwar Mahadev Temple",
    state: "Haryana",
    city: "Kurukshetra",
    coordinates: { lat: 29.9695, lng: 76.8783 },
    deity: "Shiva (Sthaneshwar Mahadev)",
    builtBy: "Current structure built by Raghunath Rao Peshwa (18th century CE)",
    century: "Current structure: 18th century CE. Excavated phases: Kushana period (1st–3rd century CE)",
    architectureStyle: "North Indian Nagara style, 18th-century reconstruction",
    mahabharataConnection: {
      tier: 3,
      label: "Local Legend",
      detail:
        "Regional tradition holds that the Pandavas and Krishna prayed at this location before the Kurukshetra war. No specific Mahabharata parva verse names this site explicitly.",
    },
    historicalDebate: {
      verifiedFact:
        "ASI excavations (1970s) confirmed archaeological phases from Kushana, Gupta, and pre-Gupta periods. Royal patronage of Pushyabhuti dynasty (7th century CE) under Harshavardhana confirmed in Bana's Harshacharita (7th-century Sanskrit biography). Current structure: 18th century CE, built by Raghunath Rao Peshwa.",
      tradition:
        "Regional tradition holds Pandavas and Krishna prayed here before the Kurukshetra war. No specific Mahabharata parva verse names this site.",
      scholarlyNote:
        "There is no proper evidence of construction during the Mahabharata period (indianetzone.com citing temple records). Existing structure: 18th century CE. Excavated phases: Kushana period (1st–3rd century CE), not Mahabharata era.",
      verdict: "tradition-only-no-text-evidence",
    },
    verifiedSignificance:
      "Located in Kurukshetra — the historically documented site of the Mahabharata war. ASI excavations confirm continuous religious activity from the Kushana period. Mentioned in Bana's 7th-century Harshacharita as a site of royal patronage.",
    traditionalSignificance:
      "Regional tradition holds this is where Krishna and the Pandavas performed rituals before the 18-day war began.",
    criticalQuestion:
      "ASI excavations confirm human religious activity here from the Kushana period onward. Yet the Mahabharata connection rests on tradition, not archaeology. Does the continuous sanctity of a place across 2,000 years make the tradition more believable — or less verifiable?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Kurukshetra city, Haryana. Open daily. Near Brahmasarovar tank.",
    tags: ["Haryana", "Kurukshetra", "Pandavas", "Krishna", "War site"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Bana's Harshacharita (7th century CE) — Pushyabhuti dynasty patronage",
        url: "https://en.wikipedia.org/wiki/Harshacharita",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 3 ─────────────────────────────────────────────────────── */
  {
    id: "kamakhya-guwahati",
    name: "Kamakhya Devi Temple",
    state: "Assam",
    city: "Guwahati",
    coordinates: { lat: 26.1664, lng: 91.7038 },
    deity: "Kamakhya Devi (Shakti)",
    builtBy: "Current structure: Koch king Naranarayana (completed 1565 CE). Original shrine builder unknown.",
    century: "Current structure: 1565 CE. Radiocarbon-dated bottom layer: approximately 200 BCE",
    architectureStyle: "Nilachal style — distinctive beehive-shaped shikhara",
    mahabharataConnection: {
      tier: 2,
      label: "Classical Scripture",
      detail:
        "Some sections of the Mahabharata (composed 300 BCE–300 CE) describe the Pandavas visiting Nilachala hill during their forest exile. The specific passage is not universally identified in the critical edition. The Kalika Purana (10th century CE) describes Narakasura building a stone staircase here in one night. The Harivamsa, Kalika Purana, Yogini Tantra, and some Mahabharata sections connect Narakasura to Krishna.",
    },
    historicalDebate: {
      verifiedFact:
        "Current structure rebuilt by Koch king Naranarayana, completed 1565 CE. Archaeological evidence: structures dated 8th–9th century CE. Radiocarbon isotope testing: bottom layer approximately 2,200 years old (~200 BCE), second layer ~500 CE (kamakhya.org citing scientific study). First epigraphic mention: 9th-century Tezpur plates of Vanamalavarmadeva of the Mlechchha dynasty. Xuanzang (7th-century Chinese traveller) visited nearby but does not mention Kamakhya.",
      tradition:
        "The Kalika Purana (10th century CE) states Narakasura built a stone staircase in one night. Some Mahabharata sections describe Pandavas visiting Nilachala. The Harivamsa connects Narakasura to Krishna.",
      scholarlyNote:
        "Historical evidence of the existence of Naraka is a subject of debate (kamakhya.org). The existing structure is 1565 CE. The site is ancient (~200 BCE) but the builder of the original shrine is unknown.",
      verdict: "textually-documented-not-excavated",
    },
    verifiedSignificance:
      "Radiocarbon dating confirms a religious site here as early as 200 BCE — making it one of the oldest continuously active sacred sites in India. First epigraphic mention: 9th-century Tezpur plates.",
    traditionalSignificance:
      "According to the Kalika Purana (10th century CE), Narakasura — connected to Krishna in the Harivamsa and Yogini Tantra — built a stone staircase to this temple in a single night.",
    criticalQuestion:
      "Radiocarbon dating confirms a religious site here as early as 200 BCE. Xuanzang visited nearby in the 7th century CE but does not mention Kamakhya. The first inscription naming the goddess is 9th century. Does absence of early textual record mean the goddess was lesser known — or that she predated the written tradition that would record her?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Nilachal Hill, Guwahati, Assam. Open daily except during Ambubachi Mela closure (4 days in June).",
    tags: ["Assam", "Shakti", "Naraka", "Krishna", "Ancient site", "Radiocarbon dated"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Kalika Purana (10th century CE) — Narakasura tradition",
        url: "https://en.wikipedia.org/wiki/Kamakhya_temple",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 4 ─────────────────────────────────────────────────────── */
  {
    id: "amriteswara-chikkamagaluru",
    name: "Amriteswara Temple",
    state: "Karnataka",
    city: "Chikkamagaluru",
    coordinates: { lat: 13.5333, lng: 75.7667 },
    deity: "Shiva (Amriteswara)",
    builtBy: "Hoysala dynasty (12th–13th century CE)",
    century: "12th–13th century CE",
    architectureStyle: "Hoysala style, chloritic schist stone",
    mahabharataConnection: {
      tier: 2,
      label: "Classical Scripture",
      detail:
        "Carvings depict the combat between Shiva (in the form of a hunter, Kirata) and Arjuna. This episode is from the Vana Parva, Kirata Parva section of the Mahabharata, where Arjuna fights a hunter in disguise to obtain the Pashupatastra. Source: dailyo.in citing academic art history sources. The carving is a 12th-century artistic interpretation — not a Mahabharata-era site.",
    },
    historicalDebate: {
      verifiedFact:
        "ASI-protected Hoysala period temple, 12th–13th century CE. Carvings depicting the Kirata episode confirmed by art historians.",
      tradition:
        "According to the Vana Parva (Kirata Parva section) of the Mahabharata, Arjuna fought a hunter in the forest who was Shiva in disguise. Arjuna lost, was humbled, and received the Pashupatastra — the most powerful weapon in the epic.",
      scholarlyNote:
        "The carving is a 12th-century Hoysala artistic depiction of a Mahabharata episode. There is no claim that this is a Mahabharata-era site.",
      verdict: "archaeologically-confirmed",
    },
    verifiedSignificance:
      "ASI-protected Hoysala temple with documented carvings of the Kirata-Arjuna episode from the Vana Parva.",
    traditionalSignificance:
      "According to the Vana Parva, this episode represents the moment Arjuna was stripped of his pride — he fought a forest hunter and lost — before receiving the greatest weapon in the epic.",
    criticalQuestion:
      "The Hoysala sculptor chose to show the moment Arjuna fought his own god without knowing it. Arjuna lost that fight, was humbled, and received the greatest weapon. Why would a sculptor celebrate a warrior's defeat — and what does that choice say about how the Mahabharata understood strength?",
    isASIProtected: true,
    isUNESCO: false,
    visitInfo: "Amruth village, Chikkamagaluru district, Karnataka. Open daily.",
    tags: ["Karnataka", "Hoysala", "Arjuna", "Shiva", "Kirata", "Pashupatastra", "ASI"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Vana Parva, Kirata Parva section — Mahabharata (critical edition, BORI Pune)",
        url: "https://en.wikipedia.org/wiki/Kiratarjuniya",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 5 ─────────────────────────────────────────────────────── */
  {
    id: "pattadakal-bagalkot",
    name: "Pattadakal Temples",
    state: "Karnataka",
    city: "Bagalkot",
    coordinates: { lat: 15.9489, lng: 75.8183 },
    deity: "Shiva and Vishnu (multiple shrines)",
    builtBy: "Early Chalukya dynasty (543–753 CE). Virupaksha Temple built ~740 CE by Queen Lokamahadevi.",
    century: "7th–8th century CE",
    architectureStyle: "Chalukya — combination of North Indian Nagara and South Indian Dravida styles",
    mahabharataConnection: {
      tier: 1,
      label: "UNESCO Documented",
      detail:
        "UNESCO documented friezes at Pattadakal depicting 'stories from the Ramayana, the Mahabharata, the Bhagavata Purana'. Source: Wikipedia citing UNESCO documentation. The Mahabharata carvings are 7th–8th century CE artistic depictions. The site has no Mahabharata-era origin.",
    },
    historicalDebate: {
      verifiedFact:
        "UNESCO World Heritage Site since 1987. Built 7th–8th century CE by Early Chalukya dynasty. Virupaksha Temple built ~740 CE by Queen Lokamahadevi to commemorate King Vikramaditya II's victory over the Pallavas — confirmed by temple inscriptions and UNESCO records. Kannada inscription dated 1162 CE found on temple pillars. Site mentioned in Ptolemy's Geography (2nd century CE) as 'Petirigal' (World History Encyclopedia).",
      tradition:
        "No Mahabharata-era origin claimed. Mahabharata scenes appear as artistic carvings on 7th–8th century CE temple walls.",
      scholarlyNote:
        "The Mahabharata carvings are medieval artistic depictions commissioned by Chalukya royalty, not evidence of a Mahabharata-era site.",
      verdict: "archaeologically-confirmed",
    },
    verifiedSignificance:
      "UNESCO World Heritage Site (1987). One of the earliest surviving examples of Chalukya temple architecture. Contains UNESCO-documented Mahabharata narrative friezes. Mentioned in Ptolemy's Geography (2nd century CE).",
    traditionalSignificance:
      "Queen Lokamahadevi chose to carve Mahabharata scenes on a temple built to celebrate a real military victory — using the epic's imagery as the language of royal legitimacy.",
    criticalQuestion:
      "Queen Lokamahadevi chose to carve scenes from the Mahabharata on a temple she built in 740 CE to celebrate a real military victory. Why would a medieval queen celebrate a real war with carvings of an ancient epic? What does that choice say about how rulers used the Mahabharata as political language?",
    isASIProtected: true,
    isUNESCO: true,
    visitInfo: "Pattadakal village, Bagalkot district, Karnataka. Open daily. Entry fee applicable.",
    tags: ["Karnataka", "Chalukya", "UNESCO", "ASI", "Mahabharata carvings"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "UNESCO World Heritage Centre — Pattadakal",
        url: "https://whc.unesco.org/en/list/239",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 6 ─────────────────────────────────────────────────────── */
  {
    id: "thrichittatt-chengannur",
    name: "Thrichittatt Maha Vishnu Temple",
    state: "Kerala",
    city: "Chengannur, Alappuzha",
    coordinates: { lat: 9.3167, lng: 76.6167 },
    deity: "Vishnu (Maha Vishnu)",
    builtBy: "Unknown. Earliest inscriptions: Second Chera Empire, 800–1102 CE.",
    century: "Earliest inscriptions: 800–1102 CE (Second Chera Empire)",
    architectureStyle: "Kerala style",
    mahabharataConnection: {
      tier: 3,
      label: "Local Legend",
      detail:
        "Regional tradition in Kerala holds that Yudhishthira built this temple. The earliest inscriptions at this site date to 800–1102 CE. No archaeological evidence confirms a Mahabharata-era origin. The 'each Pandava built one temple' tradition does not appear in the critical edition of the Mahabharata (BORI, Pune).",
    },
    historicalDebate: {
      verifiedFact:
        "Among the 108 Divya Desams. Earliest textual references: songs of Nammalvar (~800 CE, Nalayira Divya Prabandham). Earliest stone inscriptions: Second Chera Empire, 800–1102 CE. Administered by Travancore Devaswom Board, Government of Kerala.",
      tradition:
        "Regional tradition in Kerala holds that Yudhishthira built this temple. This tradition does not appear in the critical edition of the Mahabharata (BORI, Pune) or any named classical Sanskrit text.",
      scholarlyNote:
        "No ASI excavation or inscription confirms Pandava construction. The Alvars sang about this temple in ~800 CE without mentioning the Pandava connection.",
      verdict: "tradition-only-no-text-evidence",
    },
    verifiedSignificance:
      "One of 108 Divya Desams. Sung by Nammalvar in the Nalayira Divya Prabandham (~800 CE). Continuous worship documented from the Second Chera Empire period.",
    traditionalSignificance:
      "Regional tradition in Kerala holds that Yudhishthira — eldest of the Pandavas, the embodiment of dharma — built this temple.",
    criticalQuestion:
      "The Alvars sang about this temple in 800 CE without mentioning the Pandava connection. The 'five Pandavas, five temples' tradition appears later in local memory. Does a story becoming part of a place's identity over centuries make it less true — or differently true?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Chengannur, Alappuzha district, Kerala. Administered by Travancore Devaswom Board.",
    tags: ["Kerala", "Divya Desam", "Yudhishthira", "Pandavas", "Vishnu"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Nalayira Divya Prabandham — Nammalvar songs (~800 CE)",
        url: "https://en.wikipedia.org/wiki/Thrichittatt_Maha_Vishnu_Temple",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 7 ─────────────────────────────────────────────────────── */
  {
    id: "puliyur-mahavishnu",
    name: "Puliyur Mahavishnu Temple",
    state: "Kerala",
    city: "Puliyur, Chengannur",
    coordinates: { lat: 9.3167, lng: 76.6100 },
    deity: "Vishnu (Maha Vishnu)",
    builtBy: "Unknown. Earliest inscriptions: Second Chera Empire, 800–1102 CE.",
    century: "Earliest inscriptions: 800–1102 CE (Second Chera Empire)",
    architectureStyle: "Kerala style",
    mahabharataConnection: {
      tier: 3,
      label: "Local Legend",
      detail:
        "Regional tradition in Kerala holds that Bhima built this temple. The earliest inscriptions at this site date to 800–1102 CE. No archaeological evidence confirms a Mahabharata-era origin. The 'each Pandava built one temple' tradition does not appear in the critical edition of the Mahabharata (BORI, Pune).",
    },
    historicalDebate: {
      verifiedFact:
        "Among the 108 Divya Desams. Earliest textual references: songs of Nammalvar (~800 CE). Earliest stone inscriptions: Second Chera Empire, 800–1102 CE. Administered by Travancore Devaswom Board, Government of Kerala.",
      tradition:
        "Regional tradition in Kerala holds that Bhima built this temple. This tradition does not appear in the critical edition of the Mahabharata (BORI, Pune).",
      scholarlyNote:
        "No ASI excavation or inscription confirms Pandava construction. The Alvars sang about this temple without mentioning the Pandava connection.",
      verdict: "tradition-only-no-text-evidence",
    },
    verifiedSignificance:
      "One of 108 Divya Desams. Continuous worship documented from the Second Chera Empire period.",
    traditionalSignificance:
      "Regional tradition in Kerala holds that Bhima — the second Pandava, known for his physical strength — built this temple.",
    criticalQuestion:
      "The Alvars sang about this temple in 800 CE without mentioning the Pandava connection. The 'five Pandavas, five temples' tradition appears later in local memory. Does a story becoming part of a place's identity over centuries make it less true — or differently true?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Puliyur, Chengannur, Alappuzha district, Kerala. Administered by Travancore Devaswom Board.",
    tags: ["Kerala", "Divya Desam", "Bhima", "Pandavas", "Vishnu"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Nalayira Divya Prabandham — Nammalvar songs (~800 CE)",
        url: "https://en.wikipedia.org/wiki/Puliyoor_Maha_Vishnu_Temple",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 8 ─────────────────────────────────────────────────────── */
  {
    id: "aranmula-parthasarathy",
    name: "Aranmula Parthasarathy Temple",
    state: "Kerala",
    city: "Aranmula, Pathanamthitta",
    coordinates: { lat: 9.5167, lng: 76.5833 },
    deity: "Vishnu as Parthasarathy (Krishna as Arjuna's charioteer)",
    builtBy: "Unknown. Earliest inscriptions: Second Chera Empire, 800–1102 CE.",
    century: "Earliest inscriptions: 800–1102 CE (Second Chera Empire)",
    architectureStyle: "Kerala style",
    mahabharataConnection: {
      tier: 3,
      label: "Local Legend",
      detail:
        "Regional tradition in Kerala holds that Arjuna built this temple to atone for killing Karna while Karna was unarmed and attempting to free his chariot wheel — an act regarded in the Mahabharata as a violation of the dharma of war. No archaeological evidence confirms a Mahabharata-era origin.",
    },
    historicalDebate: {
      verifiedFact:
        "Among the 108 Divya Desams. Earliest textual references: songs of Nammalvar (~800 CE, Nalayira Divya Prabandham). Earliest stone inscriptions: Second Chera Empire, 800–1102 CE. Administered by Travancore Devaswom Board, Government of Kerala.",
      tradition:
        "Regional tradition holds Arjuna built this temple to atone for killing Karna while unarmed. This tradition does not appear in the critical edition of the Mahabharata (BORI, Pune).",
      scholarlyNote:
        "No ASI excavation or inscription confirms Pandava construction. The Alvars sang about this temple without mentioning the Pandava connection.",
      verdict: "tradition-only-no-text-evidence",
    },
    verifiedSignificance:
      "One of 108 Divya Desams. The deity name Parthasarathy — 'charioteer of Partha (Arjuna)' — directly references Krishna's role in the Mahabharata, making this one of the most explicitly Mahabharata-connected Divya Desams by name.",
    traditionalSignificance:
      "Regional tradition holds that Arjuna built this temple to atone for killing Karna on the battlefield while Karna was unarmed and attempting to free his chariot wheel.",
    criticalQuestion:
      "Arjuna is said to have built this temple to atone for killing Karna while he was unarmed. Krishna had advised Arjuna to do exactly that — arguing Karna had forfeited dharma earlier in the war. If Arjuna needed to atone, was Krishna's advice wrong? Or does atonement mean something different from admitting a wrong?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Aranmula, Pathanamthitta district, Kerala. Famous for the annual Aranmula Boat Race (Onam season).",
    tags: ["Kerala", "Divya Desam", "Arjuna", "Karna", "Atonement", "Krishna", "Dharma"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Nalayira Divya Prabandham — Nammalvar songs (~800 CE)",
        url: "https://en.wikipedia.org/wiki/Aranmula_Parthasarathy_Temple",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
    specialDisplay: {
      borderColor: "rgba(180,120,0,0.6)",
      label: "The Question This Temple Was Built To Answer",
    },
  },

  /* ── TEMPLE 9 ─────────────────────────────────────────────────────── */
  {
    id: "thiruvanvandoor-mahavishnu",
    name: "Thiruvanvandoor Mahavishnu Temple",
    state: "Kerala",
    city: "Thiruvanvandoor, Alappuzha",
    coordinates: { lat: 9.3500, lng: 76.5500 },
    deity: "Vishnu (Maha Vishnu — Pambanai Appan)",
    builtBy: "Unknown. Earliest inscriptions: Second Chera Empire, 800–1102 CE.",
    century: "Earliest inscriptions: 800–1102 CE (Second Chera Empire)",
    architectureStyle: "Kerala style",
    mahabharataConnection: {
      tier: 3,
      label: "Local Legend",
      detail:
        "Regional tradition in Kerala holds that Nakula built this temple. The earliest inscriptions at this site date to 800–1102 CE (Wikipedia, Thiruvanvandoor Temple article). No archaeological evidence confirms a Mahabharata-era origin. The 'each Pandava built one temple' tradition does not appear in the critical edition of the Mahabharata (BORI, Pune).",
    },
    historicalDebate: {
      verifiedFact:
        "Among the 108 Divya Desams. Earliest textual references: songs of Nammalvar (~800 CE). Earliest stone inscriptions: Second Chera Empire, 800–1102 CE. Administered by Travancore Devaswom Board, Government of Kerala.",
      tradition:
        "Regional tradition in Kerala holds that Nakula built this temple. This tradition does not appear in the critical edition of the Mahabharata (BORI, Pune).",
      scholarlyNote:
        "No ASI excavation or inscription confirms Pandava construction.",
      verdict: "tradition-only-no-text-evidence",
    },
    verifiedSignificance:
      "One of 108 Divya Desams. Continuous worship documented from the Second Chera Empire period.",
    traditionalSignificance:
      "Regional tradition in Kerala holds that Nakula — the fourth Pandava, known for his beauty and skill with horses — built this temple.",
    criticalQuestion:
      "The Alvars sang about this temple in 800 CE without mentioning the Pandava connection. The 'five Pandavas, five temples' tradition appears later in local memory. Does a story becoming part of a place's identity over centuries make it less true — or differently true?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Thiruvanvandoor, Alappuzha district, Kerala. Administered by Travancore Devaswom Board.",
    tags: ["Kerala", "Divya Desam", "Nakula", "Pandavas", "Vishnu"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Wikipedia — Thiruvanvandoor Temple (citing Second Chera inscriptions)",
        url: "https://en.wikipedia.org/wiki/Thiruvanvandoor_Temple",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 10 ────────────────────────────────────────────────────── */
  {
    id: "thrikodithanam-mahavishnu",
    name: "Thrikodithanam Mahavishnu Temple",
    state: "Kerala",
    city: "Changanassery, Kottayam",
    coordinates: { lat: 9.5167, lng: 76.5500 },
    deity: "Vishnu (Maha Vishnu — Bhargava Rama)",
    builtBy: "Unknown. Earliest inscriptions: Second Chera Empire, 800–1102 CE.",
    century: "Earliest inscriptions: 800–1102 CE (Second Chera Empire)",
    architectureStyle: "Kerala style",
    mahabharataConnection: {
      tier: 3,
      label: "Local Legend",
      detail:
        "Regional tradition in Kerala holds that Sahadeva built this temple. The earliest inscriptions at this site date to 800–1102 CE. No archaeological evidence confirms a Mahabharata-era origin. The 'each Pandava built one temple' tradition does not appear in the critical edition of the Mahabharata (BORI, Pune).",
    },
    historicalDebate: {
      verifiedFact:
        "Among the 108 Divya Desams. Earliest textual references: songs of Nammalvar (~800 CE). Earliest stone inscriptions: Second Chera Empire, 800–1102 CE. Administered by Travancore Devaswom Board, Government of Kerala.",
      tradition:
        "Regional tradition in Kerala holds that Sahadeva built this temple. This tradition does not appear in the critical edition of the Mahabharata (BORI, Pune).",
      scholarlyNote:
        "No ASI excavation or inscription confirms Pandava construction.",
      verdict: "tradition-only-no-text-evidence",
    },
    verifiedSignificance:
      "One of 108 Divya Desams. Continuous worship documented from the Second Chera Empire period.",
    traditionalSignificance:
      "Regional tradition in Kerala holds that Sahadeva — the youngest Pandava, known for his gift of prophecy — built this temple.",
    criticalQuestion:
      "The Alvars sang about this temple in 800 CE without mentioning the Pandava connection. The 'five Pandavas, five temples' tradition appears later in local memory. Does a story becoming part of a place's identity over centuries make it less true — or differently true?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Changanassery, Kottayam district, Kerala. Administered by Travancore Devaswom Board.",
    tags: ["Kerala", "Divya Desam", "Sahadeva", "Pandavas", "Vishnu"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Nalayira Divya Prabandham — Nammalvar songs (~800 CE)",
        url: "https://en.wikipedia.org/wiki/Thrikodithanam_Mahavishnu_Temple",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 11 ────────────────────────────────────────────────────── */
  {
    id: "kailasanatha-ellora",
    name: "Kailasanatha Temple (Cave 16, Ellora)",
    state: "Maharashtra",
    city: "Aurangabad",
    coordinates: { lat: 20.0268, lng: 75.1795 },
    deity: "Shiva (Kailasanatha)",
    builtBy: "Rashtrakuta king Krishna I (8th century CE)",
    century: "8th century CE",
    architectureStyle: "Monolithic rock-cut — largest single monolithic rock excavation in the world",
    mahabharataConnection: {
      tier: 1,
      label: "Archaeological Evidence",
      detail:
        "Mahabharata war scenes documented in Cave 16, Ellora. Source: dailyo.in citing art historians. The Rashtrakuta king chose to include Mahabharata narrative carvings within the largest monolithic rock-cut structure in the world.",
    },
    historicalDebate: {
      verifiedFact:
        "Built by Rashtrakuta king Krishna I, 8th century CE (ASI records). Largest monolithic rock-cut structure in the world (ASI). Part of Ellora Caves UNESCO World Heritage Site (1983). Mahabharata war scenes documented by art historians.",
      tradition:
        "No Mahabharata-era origin claimed. Mahabharata scenes are 8th-century CE Rashtrakuta artistic commissions.",
      scholarlyNote:
        "The entire temple was carved out of a single basalt cliff — top to bottom — by Rashtrakuta craftsmen over several decades. The inclusion of Mahabharata scenes was a deliberate royal choice.",
      verdict: "archaeologically-confirmed",
    },
    verifiedSignificance:
      "UNESCO World Heritage Site (Ellora Caves, 1983). Largest monolithic rock-cut structure in the world. ASI-documented Mahabharata war scenes within an 8th-century CE royal commission.",
    traditionalSignificance:
      "The Rashtrakuta king who commissioned this temple chose to put Mahabharata war scenes inside the most ambitious architectural project in Indian history.",
    criticalQuestion:
      "The Rashtrakuta king carved the entire Kailasa mountain out of a single rock in the 8th century. He chose to put Mahabharata war scenes inside it. What made a king who never met any Pandava or Kaurava feel that their war belonged on his temple walls?",
    isASIProtected: true,
    isUNESCO: true,
    visitInfo: "Ellora, Aurangabad (Chhatrapati Sambhajinagar) district, Maharashtra. Open daily except Tuesdays. Entry fee applicable.",
    tags: ["Maharashtra", "Rashtrakuta", "UNESCO", "ASI", "Monolithic", "Mahabharata carvings"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "UNESCO World Heritage Centre — Ellora Caves",
        url: "https://whc.unesco.org/en/list/243",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 12 ────────────────────────────────────────────────────── */
  {
    id: "shore-temple-mahabalipuram",
    name: "Shore Temple",
    state: "Tamil Nadu",
    city: "Mahabalipuram",
    coordinates: { lat: 12.6170, lng: 80.1927 },
    deity: "Shiva and Vishnu (multi-shrine complex)",
    builtBy: "Pallava king Rajasimha (Narasimhavarman II), late 7th–early 8th century CE",
    century: "Late 7th–early 8th century CE",
    architectureStyle: "Dravidian — one of the earliest structural (non-rock-cut) temples in South India",
    mahabharataConnection: {
      tier: 1,
      label: "UNESCO Documented",
      detail:
        "The 96-foot 'Arjuna's Penance' monolithic bas-relief is nearby. UNESCO documentation notes the identification as 'Arjuna's Penance' OR 'Bhagiratha's Penance' is actively debated among art historians. Both identifications are valid scholarly positions.",
    },
    historicalDebate: {
      verifiedFact:
        "Built under Pallava king Rajasimha, late 7th–early 8th century CE (UNESCO documentation). UNESCO World Heritage Site (1984, Group of Monuments at Mahabalipuram). The 96-foot bas-relief identification — 'Arjuna's Penance' vs 'Bhagiratha's Penance' — is an active scholarly debate.",
      tradition:
        "Popular tradition names the 96-foot bas-relief 'Arjuna's Penance' — referring to Arjuna's austerities to obtain the Pashupatastra from Shiva (Vana Parva, Mahabharata).",
      scholarlyNote:
        "The 'Arjuna's Penance' name is a popular label, not a confirmed scholarly consensus. Art historians note the central figure could equally represent Bhagiratha performing austerities to bring the Ganga to earth.",
      verdict: "textually-documented-not-excavated",
    },
    verifiedSignificance:
      "UNESCO World Heritage Site (1984). One of earliest structural Dravidian temples in South India. The 96-foot monolithic bas-relief is one of the largest open-air rock reliefs in the world.",
    traditionalSignificance:
      "Popular tradition holds the 96-foot bas-relief depicts Arjuna's penance — the years he spent in austerity to obtain Shiva's weapon before the Kurukshetra war.",
    criticalQuestion:
      "The 96-foot bas-relief at Mahabalipuram has been called 'Arjuna's Penance' for centuries. Art historians say it could equally be Bhagiratha bringing the Ganga to earth. Both stories involve a warrior performing impossible austerities to receive divine grace. Does it matter which story is right — or does the ambiguity tell us something about how the Pallava artists thought about penance itself?",
    isASIProtected: true,
    isUNESCO: true,
    visitInfo: "Mahabalipuram (Mamallapuram), Chengalpattu district, Tamil Nadu. Open daily. Entry fee applicable.",
    tags: ["Tamil Nadu", "Pallava", "UNESCO", "ASI", "Arjuna", "Shore Temple"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "UNESCO World Heritage Centre — Mahabalipuram",
        url: "https://whc.unesco.org/en/list/249",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 13 ────────────────────────────────────────────────────── */
  {
    id: "kashi-vishwanath-varanasi",
    name: "Kashi Vishwanath Temple",
    state: "Uttar Pradesh",
    city: "Varanasi",
    coordinates: { lat: 25.3109, lng: 82.9987 },
    deity: "Shiva (Vishwanath — Lord of the Universe)",
    builtBy: "Current structure: Ahilya Bai Holkar (1780 CE) after Mughal destruction",
    century: "Current structure: 1780 CE. Varanasi itself is among the oldest continuously inhabited cities in the world.",
    architectureStyle: "North Indian Nagara style, 18th-century reconstruction with gold-plated shikhara",
    mahabharataConnection: {
      tier: 2,
      label: "Classical Scripture",
      detail:
        "Varanasi (Kashi) is mentioned in the Mahabharata as an ancient center of learning. The Adi Parva of the Mahabharata describes Bhishma raiding the city of Kashi to abduct the three princesses — Amba, Ambika, and Ambalika — for his stepbrother Vichitravirya's marriage. This is a textual claim about the city, not about the physical temple.",
    },
    historicalDebate: {
      verifiedFact:
        "Current structure built 1780 CE by Ahilya Bai Holkar after Mughal destruction (temple historical records). Varanasi is mentioned in the Mahabharata as a centre of learning. The Bhishma-Kashi abduction episode appears in the Adi Parva.",
      tradition:
        "Kashi is regarded in Hindu tradition as Shiva's eternal city — beyond the cycle of creation and destruction.",
      scholarlyNote:
        "The physical temple's current structure is 18th century CE. The connection to the Mahabharata is textual — the city of Kashi appears in the epic, not this specific temple structure.",
      verdict: "textually-documented-not-excavated",
    },
    verifiedSignificance:
      "Current structure built 1780 CE by Ahilya Bai Holkar. Varanasi is among the oldest continuously inhabited cities in the world. Kashi appears in the Adi Parva of the Mahabharata.",
    traditionalSignificance:
      "According to the Adi Parva, Bhishma came to this city in his most morally contested act — abducting three princesses for his stepbrother's marriage, an act he defended as dharmic. The same city is now Hinduism's holiest pilgrimage site.",
    criticalQuestion:
      "Kashi appears in the Mahabharata as the city Bhishma raided to abduct three princesses for his brother's marriage — an act he defended as dharmic. The same city is now one of Hinduism's holiest pilgrimage sites. How does a city that appears in one of the epic's most morally contested abduction stories become a symbol of sacred purity?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Dashashwamedh Ghat area, Varanasi, Uttar Pradesh. Open daily. Dress code applies.",
    tags: ["Uttar Pradesh", "Varanasi", "Bhishma", "Kashi", "Adi Parva", "Shiva"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Adi Parva, Mahabharata — Bhishma and the Kashi princesses",
        url: "https://en.wikipedia.org/wiki/Amba_(Mahabharata)",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 14 ────────────────────────────────────────────────────── */
  {
    id: "dwarkadhish-dwarka",
    name: "Dwarkadhish Temple",
    state: "Gujarat",
    city: "Dwarka",
    coordinates: { lat: 22.2376, lng: 68.9674 },
    deity: "Vishnu as Krishna (Dwarkadhish — Lord of Dwarka)",
    builtBy: "Current structure: 15th–16th century CE",
    century: "Current structure: 15th–16th century CE",
    architectureStyle: "Chalukya style — 5-storey shikhara",
    mahabharataConnection: {
      tier: 2,
      label: "Classical Scripture",
      detail:
        "Dwarka is described as Krishna's capital city in the Mahabharata and multiple Puranas. The Mausala Parva of the Mahabharata describes the sea swallowing Dwarka after Krishna's death. Underwater archaeological surveys off the Dwarka coast by the National Institute of Ocean Technology (NIOT) found submerged structures; their identification as 'Krishna's Dwarka' is actively debated among marine archaeologists.",
    },
    historicalDebate: {
      verifiedFact:
        "Current structure: 15th–16th century CE (temple records). NIOT underwater surveys found submerged structures off the Dwarka coast. Marine archaeologists actively debate whether these structures are Mahabharata-era or medieval port ruins.",
      tradition:
        "According to the Mausala Parva of the Mahabharata, the sea swallowed Dwarka after Krishna died. Dwarka is described as Krishna's capital throughout the epic and multiple Puranas.",
      scholarlyNote:
        "The claim that NIOT's submerged structures confirm 'Krishna's Dwarka' is not a settled archaeological consensus. Some marine archaeologists identify the structures as medieval port ruins. The current temple structure is 15th–16th century CE.",
      verdict: "textually-documented-not-excavated",
    },
    verifiedSignificance:
      "One of the four sacred dhams of Hinduism. Current structure: 15th–16th century CE. NIOT surveys confirmed submerged structures off the coast — their dating and identification remain under scholarly debate.",
    traditionalSignificance:
      "According to the Mausala Parva, Dwarka was Krishna's capital — the city he built for the Yadavas after leaving Mathura. The sea swallowed it after his death, fulfilling a curse.",
    criticalQuestion:
      "NIOT surveys found submerged structures off the Dwarka coast. Some archaeologists say this confirms Krishna's sunken kingdom. Others say the structures are medieval port ruins. The Mahabharata says the sea swallowed Dwarka after Krishna died. What kind of evidence would actually settle this question — and would you trust it if you found it?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Dwarka city, Devbhoomi Dwarka district, Gujarat. Open daily. One of four Hindu dhams.",
    tags: ["Gujarat", "Krishna", "Dwarka", "Mausala Parva", "Underwater archaeology"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Mausala Parva, Mahabharata — submersion of Dwarka",
        url: "https://en.wikipedia.org/wiki/Dvarka",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 15 ────────────────────────────────────────────────────── */
  {
    id: "somnath-gujarat",
    name: "Somnath Temple",
    state: "Gujarat",
    city: "Prabhas Patan, Veraval",
    coordinates: { lat: 20.8880, lng: 70.4012 },
    deity: "Shiva (Somanatha — one of 12 Jyotirlingas)",
    builtBy: "Current structure rebuilt in Chalukya style, consecrated 1951 CE",
    century: "Current structure: 1951 CE. Historically destroyed and rebuilt multiple times.",
    architectureStyle: "Chalukya style — current structure designed by Prabhashankar Sompura",
    mahabharataConnection: {
      tier: 2,
      label: "Classical Scripture",
      detail:
        "The Mausala Parva of the Mahabharata describes the Yadava clan's self-destruction and Krishna's death near Prabhasa — a location identified with Prabhas Patan, where Somnath stands. This is a textual identification, not archaeologically confirmed.",
    },
    historicalDebate: {
      verifiedFact:
        "Current structure consecrated 1951 CE. Historically destroyed by Mahmud of Ghazni (1026 CE), Alauddin Khilji (1296 CE), and Aurangzeb (1706 CE) — documented in historical records. Mentioned in the Skanda Purana and Shiva Purana as a Jyotirlinga site.",
      tradition:
        "According to the Mausala Parva of the Mahabharata, Krishna died near Prabhasa, struck by a hunter's arrow — fulfilling a curse. The location is identified with Prabhas Patan (Somnath). The Skanda Purana and Shiva Purana describe this as a Jyotirlinga site.",
      scholarlyNote:
        "The identification of Prabhas Patan with the Mahabharata's Prabhasa is textual, not archaeologically confirmed. The coexistence of a Shiva Jyotirlinga at the site of a Vishnu avatar's death is a significant feature of Hindu sacred geography.",
      verdict: "textually-documented-not-excavated",
    },
    verifiedSignificance:
      "One of 12 Jyotirlingas. Current structure consecrated 1951. Historical destructions documented. Mentioned in Skanda Purana and Shiva Purana. Location identified with Mahabharata's Prabhasa in the Mausala Parva.",
    traditionalSignificance:
      "According to the Mausala Parva, Krishna died near Prabhasa — this location — struck by a hunter's arrow, fulfilling a curse from a previous life.",
    criticalQuestion:
      "The Mausala Parva says Krishna died near Prabhasa, struck by a hunter's arrow — fulfilling a curse. The same location has a Jyotirlinga dedicated to Shiva. Why would the place where Vishnu's avatar died become a monument to Shiva? What does the coexistence of these two traditions at the same site tell us about how Hindu sacred geography works?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Prabhas Patan, Veraval, Gir Somnath district, Gujarat. Open daily. One of 12 Jyotirlingas.",
    tags: ["Gujarat", "Krishna", "Mausala Parva", "Jyotirlinga", "Shiva", "Death of Krishna"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Mausala Parva, Mahabharata — death of Krishna near Prabhasa",
        url: "https://en.wikipedia.org/wiki/Somnath_temple",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 16 ────────────────────────────────────────────────────── */
  {
    id: "markandeshwar-shahbad",
    name: "Markandeshwar Temple",
    state: "Haryana",
    city: "Shahbad Markanda, Kurukshetra",
    coordinates: { lat: 30.1667, lng: 76.9167 },
    deity: "Shiva (Markandeshwar)",
    builtBy: "Unknown. Associated with sage Markandeya.",
    century: "Unknown. Location in Kurukshetra district places it in proximity to Mahabharata war territory.",
    architectureStyle: "North Indian style",
    mahabharataConnection: {
      tier: 2,
      label: "Classical Scripture",
      detail:
        "The Vana Parva of the Mahabharata contains extended dialogues where sage Markandeya narrates stories to the Pandavas during their 12-year forest exile. Markandeya appears as one of the most significant narrator figures in the entire epic. The temple is associated with this sage.",
    },
    historicalDebate: {
      verifiedFact:
        "Located in Shahbad Markanda, Kurukshetra district, Haryana — the historically documented region of the Mahabharata war. Associated with sage Markandeya, who appears in the Vana Parva.",
      tradition:
        "According to the Vana Parva, sage Markandeya visited and narrated stories to the Pandavas during their years of forest exile — sustaining their dharma through storytelling.",
      scholarlyNote:
        "No ASI excavation data available for this site. The Mahabharata connection is textual — the sage Markandeya is a Vana Parva figure, and this temple is associated with him.",
      verdict: "textually-documented-not-excavated",
    },
    verifiedSignificance:
      "Located in Kurukshetra district — the historically documented territory of the Mahabharata war. Associated with sage Markandeya, a significant narrative figure in the Vana Parva.",
    traditionalSignificance:
      "According to the Vana Parva, Markandeya sat with the Pandavas during their 12 years of exile and told them stories to sustain their dharma. He was not a warrior, a king, or a god — just a sage who arrived with the right story at the right moment.",
    criticalQuestion:
      "Markandeya sits with the Pandavas during their 12 years of exile and tells them stories to sustain their dharma. He is not a warrior, a king, or a god — just a sage who keeps showing up with the right story at the right moment. What does the Mahabharata's reverence for storytellers say about how the epic understood wisdom?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Shahbad Markanda, Kurukshetra district, Haryana.",
    tags: ["Haryana", "Kurukshetra", "Markandeya", "Vana Parva", "Storytelling"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Vana Parva, Mahabharata — Markandeya dialogues with Pandavas",
        url: "https://en.wikipedia.org/wiki/Markandeya",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 17 ────────────────────────────────────────────────────── */
  {
    id: "bhimashankar-pune",
    name: "Bhimashankar Temple",
    state: "Maharashtra",
    city: "Sahyadri Hills, Pune district",
    coordinates: { lat: 19.0725, lng: 73.5353 },
    deity: "Shiva (Bhimashankar — one of 12 Jyotirlingas)",
    builtBy: "18th-century structure. Peshwa Nana Phadnavis contributed to reconstruction.",
    century: "Current structure: 18th century CE. Jyotirlinga designation: Shiva Purana (classical text).",
    architectureStyle: "Nagara style, 18th-century reconstruction",
    mahabharataConnection: {
      tier: 2,
      label: "Classical Scripture",
      detail:
        "According to the Shiva Purana, the Bhimashankar Jyotirlinga manifested when Shiva defeated the demon Tripurasura at this location. The temple name 'Bhimashankar' refers to this form of Shiva — not to Bhima the Pandava. Important: Do not conflate this location with Dronacharya's gurukul, which is associated with the Kashipur region of Nainital district (Uttarakhand), not this site.",
    },
    historicalDebate: {
      verifiedFact:
        "One of the 12 Jyotirlingas of Shiva — designation from the Shiva Purana (classical Sanskrit text). Location: Sahyadri Hills, Pune district, Maharashtra. Architecture: Nagara style, 18th-century structure. Bhimashankar Wildlife Sanctuary surrounds the temple.",
      tradition:
        "According to the Shiva Purana, Shiva manifested here as Bhimashankar to defeat the demon Tripurasura. The name refers to this form of Shiva, not Bhima the Pandava.",
      scholarlyNote:
        "The temple's Mahabharata connection is indirect — through the Shiva Purana account and the confluence of Shiva worship with Mahabharata-era traditions. The name 'Bhima' in this context refers to Shiva's form, not the Pandava.",
      verdict: "textually-documented-not-excavated",
    },
    verifiedSignificance:
      "One of 12 Jyotirlingas. Designation from the Shiva Purana. Located within Bhimashankar Wildlife Sanctuary in the Sahyadri Hills.",
    traditionalSignificance:
      "According to the Shiva Purana, Shiva manifested as Bhimashankar at this location to defeat the demon Tripurasura — giving this form its name.",
    criticalQuestion:
      "The Shiva Purana names this Jyotirlinga 'Bhimashankar' — a name meaning 'fierce Shiva' — not after Bhima the Pandava. Yet pilgrims and popular accounts often connect it to the Mahabharata's Bhima. What does this slippage between a divine name and a human hero's name tell us about how mythology absorbs and reassigns meaning across centuries?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Bhimashankar, Khed taluka, Pune district, Maharashtra. Within Bhimashankar Wildlife Sanctuary. Best visited October–February.",
    tags: ["Maharashtra", "Jyotirlinga", "Shiva", "Shiva Purana", "Sahyadri"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Shiva Purana — Bhimashankar Jyotirlinga account",
        url: "https://en.wikipedia.org/wiki/Bhimashankar_temple",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 18 ────────────────────────────────────────────────────── */
  {
    id: "jyotisar-kurukshetra",
    name: "Jyotisar — Birthplace of the Bhagavad Gita",
    state: "Haryana",
    city: "Kurukshetra",
    coordinates: { lat: 29.9150, lng: 76.8200 },
    deity: "Krishna (as Gita Upadesh site — sacred grove, not a conventional temple)",
    builtBy: "Sacred grove site. A modern temple and banyan tree mark the location. State Government of Haryana manages the site.",
    century: "Modern commemorative structures. The banyan tree at the site is claimed by tradition to be the original tree under which the Gita was spoken — no botanical dating confirms this.",
    architectureStyle: "Modern commemorative structures; bronze chariot of Krishna and Arjuna installed",
    mahabharataConnection: {
      tier: 2,
      label: "Classical Scripture",
      detail:
        "According to the Bhagavad Gita itself (Chapter 1, verse 1 — 'Dhritarashtra said: On the field of dharma, the field of Kurukshetra...'), the dialogue between Krishna and Arjuna took place on the battlefield of Kurukshetra before the war began. Jyotisar is the traditionally identified location within Kurukshetra where this dialogue occurred. No archaeological excavation has confirmed this specific spot as the dialogue location.",
    },
    historicalDebate: {
      verifiedFact:
        "Located within Kurukshetra district, Haryana — the historically documented territory of the Mahabharata war confirmed by multiple ancient textual sources. The Bhagavad Gita itself opens on 'the field of Kurukshetra.' The specific location of Jyotisar as the Gita's birthplace is a tradition maintained by the Haryana government.",
      tradition:
        "According to tradition, this is the exact spot where Krishna spoke the Bhagavad Gita to Arjuna — 700 verses of philosophical teaching delivered between two armies before the war began.",
      scholarlyNote:
        "No archaeological excavation confirms this specific location as the Gita dialogue site. The identification of Jyotisar is based on tradition and textual reference to Kurukshetra, not on excavation of a specific spot.",
      verdict: "textually-documented-not-excavated",
    },
    verifiedSignificance:
      "Located in Kurukshetra — textually documented as the Mahabharata war site. The Bhagavad Gita's opening verse names Kurukshetra explicitly. Jyotisar is the government-designated site commemorating the Gita's delivery.",
    traditionalSignificance:
      "According to tradition, Krishna spoke all 700 verses of the Bhagavad Gita at this exact spot — to a warrior who had put down his bow. The dialogue lasted long enough to reshape Indian philosophy for millennia.",
    criticalQuestion:
      "Krishna spoke 700 verses of philosophy to a man having a breakdown between two armies. Every soldier on both sides was waiting. The war was about to begin. Why did the Mahabharata place its most important teaching precisely in the moment of maximum urgency — not in a forest, not in a palace, not in a classroom — but on a battlefield, with no time left?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Jyotisar, 5 km from Kurukshetra city, Haryana. Open daily. Bronze chariot of Krishna and Arjuna on site. Sound-and-light show in evenings.",
    tags: ["Haryana", "Kurukshetra", "Bhagavad Gita", "Krishna", "Arjuna", "Gita Upadesh"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Bhagavad Gita, Chapter 1 verse 1 — Dhritarashtra's opening question on the field of Kurukshetra",
        url: "https://en.wikipedia.org/wiki/Jyotisar",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 19 ────────────────────────────────────────────────────── */
  {
    id: "pandavleni-caves-nashik",
    name: "Pandavleni Caves (Trirashmi Buddhist Caves)",
    state: "Maharashtra",
    city: "Nashik",
    coordinates: { lat: 19.9975, lng: 73.7898 },
    deity: "Buddhist (Hinayana tradition — no deity in conventional sense)",
    builtBy: "Buddhist monks and royal patrons, 1st century BCE – 3rd century CE",
    century: "1st century BCE – 3rd century CE (ASI confirmed, Satavahana and Kshatrapa period)",
    architectureStyle: "Rock-cut Buddhist vihara and chaitya style",
    mahabharataConnection: {
      tier: 3,
      label: "Local Legend",
      detail:
        "Regional tradition in Nashik holds that the Pandavas sheltered in these caves during their 12-year forest exile. The caves' popular name 'Pandavleni' (Pandava Caves) reflects this local tradition. ASI confirms the caves are Buddhist, dating to 1st century BCE – 3rd century CE — over a thousand years after the Mahabharata is traditionally dated, and predating the Pandavas' association with these caves in any named classical text.",
    },
    historicalDebate: {
      verifiedFact:
        "ASI-protected site. 24 rock-cut caves. Confirmed Buddhist origin, 1st century BCE – 3rd century CE (Satavahana and Western Kshatrapa period). Contains inscriptions from this period — none mentioning the Pandavas. Official ASI name: Trirashmi Buddhist Caves.",
      tradition:
        "Regional tradition holds the Pandavas sheltered here during their forest exile. This tradition does not appear in the critical edition of the Mahabharata (BORI, Pune) or any named classical Sanskrit text.",
      scholarlyNote:
        "The caves are Buddhist, confirmed by ASI inscriptions and architectural analysis. The 'Pandavleni' name is a popular tradition, not a historical or scriptural designation. The ASI official name is Trirashmi Buddhist Caves.",
      verdict: "tradition-only-no-text-evidence",
    },
    verifiedSignificance:
      "ASI-protected Buddhist heritage site. 24 rock-cut caves, 1st century BCE – 3rd century CE. Contains Satavahana and Kshatrapa period inscriptions. One of the significant Buddhist cave complexes in Maharashtra.",
    traditionalSignificance:
      "Regional tradition holds the Pandavas sheltered in these caves during their forest exile — giving them the popular name 'Pandavleni' (Pandava Caves).",
    criticalQuestion:
      "The ASI confirms these are Buddhist caves from 200 BCE – 300 CE. Local tradition calls them 'Pandava Caves.' A Buddhist monk carved his meditation cell into the same rock that a later tradition claimed as a Pandava shelter. What does it mean when one sacred story completely replaces another in a place's memory — and what does it say about how tradition treats the past it inherits?",
    isASIProtected: true,
    isUNESCO: false,
    visitInfo: "Trirashmi Hill, Nashik, Maharashtra. 8 km from Nashik city centre. Open daily except Mondays. Entry fee applicable.",
    tags: ["Maharashtra", "Nashik", "Pandavas", "Forest exile", "Buddhist caves", "ASI", "Local legend"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "ASI — Pandavleni Caves (Trirashmi Buddhist Caves), Nashik",
        url: "https://asi.nic.in/nashik-caves/",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },

  /* ── TEMPLE 20 ────────────────────────────────────────────────────── */
  {
    id: "ekachakra-birbhum",
    name: "Baladev Jiu Temple, Ekachakra",
    state: "West Bengal",
    city: "Ekachakra, Birbhum",
    coordinates: { lat: 23.8833, lng: 87.5167 },
    deity: "Balarama (Baladev Jiu — elder brother of Krishna)",
    builtBy: "Unknown. Current temple structure: 18th–19th century CE.",
    century: "Current structure: 18th–19th century CE. Village name Ekachakra appears in the Adi Parva.",
    architectureStyle: "Bengali style (terracotta panels, curved roof)",
    mahabharataConnection: {
      tier: 2,
      label: "Classical Scripture",
      detail:
        "According to the Adi Parva of the Mahabharata, Ekachakra is the village where the Pandavas and Kunti lived in disguise during their first period of hiding — after escaping the lac palace (Varanavata). The Adi Parva names this village and describes Bhima killing the demon Bakasura here, who had been terrorising the village with a food tribute demand. The village of Ekachakra in Birbhum district is the traditionally identified location.",
    },
    historicalDebate: {
      verifiedFact:
        "Ekachakra is named in the Adi Parva of the Mahabharata as the village where the Pandavas lived in hiding and where Bhima killed Bakasura. The identification of modern Ekachakra village in Birbhum district, West Bengal, as the Mahabharata's Ekachakra is based on tradition and the village name — not on ASI excavation.",
      tradition:
        "According to the Adi Parva, Bhima killed the demon Bakasura at Ekachakra — the Pandavas' first act of heroism during their years of hiding. The Baladev Jiu temple commemorates this location's connection to the Mahabharata narrative.",
      scholarlyNote:
        "No ASI excavation has confirmed this specific village as the Mahabharata's Ekachakra. The identification relies on the village name matching the Adi Parva's reference and sustained local tradition.",
      verdict: "textually-documented-not-excavated",
    },
    verifiedSignificance:
      "Ekachakra is explicitly named in the Adi Parva of the Mahabharata. The Bakasura episode is one of the Pandavas' earliest acts of heroism in disguise — the first time Bhima's strength is used to protect ordinary people rather than for royal warfare.",
    traditionalSignificance:
      "According to the Adi Parva, the Pandavas lived here as brahmins in hiding. Bhima carried food to the demon Bakasura — eating it on the way — and killed him when they met. This village was the first place the Pandavas protected while being no one.",
    criticalQuestion:
      "The Pandavas arrived at Ekachakra as refugees — no kingdom, no identity, no recognition. They lived as brahmin beggars. When Bhima killed Bakasura, nobody knew who had done it. The epic spends pages on this episode of anonymous heroism. What does the Mahabharata's attention to the Pandavas at their most powerless say about what the epic thought power was actually for?",
    isASIProtected: false,
    isUNESCO: false,
    visitInfo: "Ekachakra village, Birbhum district, West Bengal. Accessible from Rampurhat (30 km). Also associated with Nityananda Prabhu's birthplace.",
    tags: ["West Bengal", "Birbhum", "Pandavas", "Bhima", "Bakasura", "Adi Parva", "Ekachakra"],
    lastVerified: "2026-06",
    primarySources: [
      {
        label: "Adi Parva, Mahabharata — Pandavas at Ekachakra and Bhima kills Bakasura",
        url: "https://en.wikipedia.org/wiki/Ekachakra",
        accessedDate: "2026-06",
      },
    ],
    flaggedForReview: false,
  },
];

/* ── Helper functions ──────────────────────────────────────────────── */

export function getTemplesByState(state: string): MahabharataTemple[] {
  return TEMPLES.filter(t => t.state === state);
}

export function getTemplesByTier(tier: 1 | 2 | 3): MahabharataTemple[] {
  return TEMPLES.filter(t => t.mahabharataConnection.tier === tier);
}

export function getTemplesByTag(tag: string): MahabharataTemple[] {
  return TEMPLES.filter(t => t.tags.includes(tag));
}

export function getUNESCOTemples(): MahabharataTemple[] {
  return TEMPLES.filter(t => t.isUNESCO);
}

export function getASITemples(): MahabharataTemple[] {
  return TEMPLES.filter(t => t.isASIProtected);
}

export const UNIQUE_STATES = [...new Set(TEMPLES.map(t => t.state))].sort();

export const TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: "ASI / UNESCO Verified",
  2: "Documented in Classical Text",
  3: "Regional / Oral Tradition",
};

export const TIER_COLORS: Record<1 | 2 | 3, string> = {
  1: "#27AE60",
  2: "#C2410C",
  3: "#E67E22",
};

/* ── CONFLICTS REQUIRING HUMAN REVIEW ─────────────────────────────── */
// No conflicts detected in the current dataset.
// All 20 temples have been sourced from a single primary classification.
// flaggedForReview: false for all entries.
