import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ── 7 slokas — one per day of the week ──
   All are from the Bhagavad Gita, public domain.
   Sanskrit is standard transliteration.
   English meaning is original writing — not copied from any book.
   Day 0 = Sunday, Day 1 = Monday ... Day 6 = Saturday            */
const DAILY_SLOKAS = [
  {
    /* Sunday */
    sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्",
    transliteration: "Śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt",
    meaning: "Your own path, even walked imperfectly, is better than another's path walked perfectly.",
    meaning_te: "మీ స్వంత మార్గం — తప్పటడుగులు వేసినా — వేరొకరి మార్గం కంటే శ్రేష్ఠమైనది.",
    source: "Bhagavad Gita 3.35",
    slug: "dharma-beyond-rules",
  },
  {
    /* Monday */
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
    transliteration: "Karmaṇy evādhikāraste mā phaleṣu kadācana",
    meaning: "You have the right to act. You do not have the right to the outcome of that action.",
    meaning_te: "కర్మ చేయడం మీ హక్కు. ఆ కర్మ ఫలం మీ హక్కు కాదు.",
    source: "Bhagavad Gita 2.47",
    slug: "gita-verse-two-forty-seven",
  },
  {
    /* Tuesday */
    sanskrit: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः",
    transliteration: "Nainaṃ chindanti śastrāṇi nainaṃ dahati pāvakaḥ",
    meaning: "No weapon can cut this. No fire can burn this. The self that you are is beyond all destruction.",
    meaning_te: "ఏ ఆయుధమూ దీన్ని ఛేదించలేదు. ఏ అగ్నీ దీన్ని దహించలేదు. నువ్వు ఏమిటో — అది శాశ్వతం.",
    source: "Bhagavad Gita 2.23",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    /* Wednesday */
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय",
    transliteration: "Yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya",
    meaning: "Stand firm in the present. Act without clinging. Let go of the outcome.",
    meaning_te: "స్థిరంగా నిలుచో. అతుక్కోకుండా చేయి. ఫలాన్ని వదిలేయి.",
    source: "Bhagavad Gita 2.48",
    slug: "bhagavad-gita-lessons-workplace-stress",
  },
  {
    /* Thursday */
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्",
    transliteration: "Uddhared ātmanātmānaṃ nātmānam avasādayet",
    meaning: "Lift yourself by your own self. Do not pull yourself down. You are your own friend and your own enemy.",
    meaning_te: "నువ్వే నిన్ను పైకి లేపుకో. నువ్వే నిన్ను కూల్చుకోకు. నీకు నువ్వే మిత్రుడివి — నీకు నువ్వే శత్రుడివి.",
    source: "Bhagavad Gita 6.5",
    slug: "krishna-leadership-secrets",
  },
  {
    /* Friday */
    sanskrit: "समो‌ऽहं सर्वभूतेषु न मे द्वेष्यो‌ऽस्ति न प्रियः",
    transliteration: "Samo'haṃ sarvabhūteṣu na me dveṣyo'sti na priyaḥ",
    meaning: "I am equal to all beings. None is hateful to me, none is dear. Those who seek me with devotion — I am in them, and they are in me.",
    meaning_te: "నేను అందరిపట్ల సమంగా ఉన్నాను. నాకు ఎవరూ ద్వేష్యుడు కాదు, ఎవరూ ప్రియుడు కాదు. భక్తితో నన్ను కోరేవారిలో నేను ఉన్నాను.",
    source: "Bhagavad Gita 9.29",
    slug: "krishna-detachment-action",
  },
  {
    /* Saturday */
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज",
    transliteration: "Sarvadharmān parityajya mām ekaṃ śaraṇaṃ vraja",
    meaning: "Let go of all the paths you have been trying to follow. Come to me as you are. I will free you from all that weighs on you.",
    meaning_te: "అన్ని మార్గాలనూ వదిలేయి. ఉన్నపళంగా నా దగ్గరకు రా. నేను నిన్ను అన్నిటి నుండి విడిపిస్తాను.",
    source: "Bhagavad Gita 18.66",
    slug: "dharma-beyond-rules",
  },
];

/* Get today's sloka based on day of week — changes every day automatically */
function getTodaysSloka() {
  const day = new Date().getDay(); // 0 = Sunday ... 6 = Saturday
  return DAILY_SLOKAS[day];
}

const DailyWisdom = () => {
  const { t } = useTranslation();
  const sloka = getTodaysSloka();

  return (
    <section id="wisdom" className="section-padding">
      <div className="max-w-2xl mx-auto text-center">
        <div className="section-header">
          <span className="section-label">{t("home.shloka.eyebrow")}</span>
          <h2 className="section-title">{t("home.shloka.title")}</h2>
        </div>

        <div className="glass-card p-10 md:p-16 animate-pulse-glow relative">
          {/* Corner decorations */}
          <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-primary/30 rounded-tl-lg" />
          <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-primary/30 rounded-tr-lg" />
          <div className="absolute bottom-5 left-5 w-8 h-8 border-b border-l border-primary/30 rounded-bl-lg" />
          <div className="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-primary/30 rounded-br-lg" />

          {/* Sanskrit */}
          <p
            className="font-heading text-xl md:text-2xl text-primary leading-relaxed mb-3"
            style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
          >
            {sloka.sanskrit}
          </p>

          {/* Transliteration */}
          <p
            className="text-muted-foreground text-sm mb-6 italic"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.03em" }}
          >
            {sloka.transliteration}
          </p>

          <div className="w-12 h-px bg-primary/30 mx-auto mb-6" />

          {/* English meaning */}
          <p
            className="text-foreground text-base md:text-lg leading-relaxed mb-3 italic"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {sloka.meaning}
          </p>

          {/* Telugu meaning */}
          <p
            className="text-foreground/70 text-base leading-relaxed mb-6"
            style={{ fontFamily: "'Noto Serif Telugu', serif", fontSize: "clamp(15px, 1.7vw, 17px)" }}
          >
            {sloka.meaning_te}
          </p>

          {/* Source */}
          <span className="text-primary/50 text-[11px] tracking-[0.25em] uppercase">
            — {sloka.source}
          </span>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <Link
            to={`/blog/${sloka.slug}`}
            className="inline-flex items-center gap-2 text-primary text-[12px] tracking-[0.18em] uppercase font-heading hover:opacity-80 transition-opacity"
          >
            {t("home.shloka.read_commentary")}
            <ArrowRight size={13} className="opacity-70" />
          </Link>
          <span className="hidden sm:inline text-muted-foreground/40">·</span>
          <Link
            to="/wisdom"
            className="inline-flex items-center gap-2 text-muted-foreground text-[12px] tracking-[0.18em] uppercase font-heading hover:text-primary transition-colors"
          >
            {t("home.shloka.browse_all")}
            <ArrowRight size={13} className="opacity-70" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DailyWisdom;
