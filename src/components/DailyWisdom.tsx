import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

type Theme = "all" | "karma" | "dharma" | "identity" | "relationships" | "anger" | "wisdom" | "devotion";

interface Sloka {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  meaning_te: string;
  source: string;
  slug: string;
  theme: Theme;
}

const THEME_LABELS: Record<Theme, string> = {
  all:           "All",
  karma:         "Karma",
  dharma:        "Dharma",
  identity:      "Identity",
  relationships: "Relationships",
  anger:         "Anger",
  wisdom:        "Wisdom",
  devotion:      "Devotion",
};

const SLOKAS: Sloka[] = [
  {
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
    transliteration: "Karmaṇy evādhikāraste mā phaleṣu kadācana",
    meaning: "You have the right to act. You do not have the right to the outcome of that action.",
    meaning_te: "కర్మ చేయడం మీ హక్కు. ఆ కర్మ ఫలం మీ హక్కు కాదు.",
    source: "Bhagavad Gita 2.47", slug: "gita-verse-two-forty-seven", theme: "karma",
  },
  {
    sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्",
    transliteration: "Śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt",
    meaning: "Your own path walked imperfectly is better than another's path walked perfectly.",
    meaning_te: "మీ స్వంత మార్గం తప్పటడుగులతో నడిచినా — వేరొకరి మార్గం కంటే శ్రేష్ఠమైనది.",
    source: "Bhagavad Gita 3.35", slug: "dharma-beyond-rules", theme: "dharma",
  },
  {
    sanskrit: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः",
    transliteration: "Nainaṃ chindanti śastrāṇi nainaṃ dahati pāvakaḥ",
    meaning: "No weapon can cut the self. No fire can burn it. It is beyond all destruction.",
    meaning_te: "ఏ ఆయుధమూ ఆత్మను ఛేదించలేదు. ఏ అగ్నీ దాన్ని దహించలేదు. అది శాశ్వతం.",
    source: "Bhagavad Gita 2.23", slug: "arjuna-confusion-moment-of-doubt", theme: "identity",
  },
  {
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्",
    transliteration: "Uddhared ātmanātmānaṃ nātmānam avasādayet",
    meaning: "Lift yourself by your own effort. Do not pull yourself down. You are your own best friend and your own worst enemy.",
    meaning_te: "నువ్వే నిన్ను పైకి లేపుకో. నువ్వే నిన్ను కూల్చుకోకు. నీకు నువ్వే మిత్రుడివి — నీకు నువ్వే శత్రుడివి.",
    source: "Bhagavad Gita 6.5", slug: "krishna-leadership-secrets", theme: "identity",
  },
  {
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज",
    transliteration: "Sarvadharmān parityajya mām ekaṃ śaraṇaṃ vraja",
    meaning: "Let go of every path you have been trying to walk. Come to me exactly as you are. I will release you from all that weighs on you.",
    meaning_te: "అన్ని మార్గాలనూ వదిలేయి. ఉన్నపళంగా నా దగ్గరకు రా. నేను నిన్ను అన్నిటి నుండి విడిపిస్తాను.",
    source: "Bhagavad Gita 18.66", slug: "dharma-beyond-rules", theme: "dharma",
  },
  {
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय",
    transliteration: "Yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya",
    meaning: "Stand rooted in the present. Act without clinging to results. That steadiness is yoga.",
    meaning_te: "స్థిరంగా నిలుచో. అతుక్కోకుండా చేయి. ఆ స్థిరత్వమే యోగం.",
    source: "Bhagavad Gita 2.48", slug: "bhagavad-gita-lessons-workplace-stress", theme: "karma",
  },
  {
    sanskrit: "समो‌ऽहं सर्वभूतेषु न मे द्वेष्यो‌ऽस्ति न प्रियः",
    transliteration: "Samo'haṃ sarvabhūteṣu na me dveṣyo'sti na priyaḥ",
    meaning: "I am equal toward all beings. None is hateful to me, none especially dear. Those who seek me with devotion — I am in them.",
    meaning_te: "నేను అందరిపట్ల సమంగా ఉన్నాను. భక్తితో నన్ను కోరేవారిలో నేను ఉన్నాను.",
    source: "Bhagavad Gita 9.29", slug: "krishna-detachment-action", theme: "devotion",
  },
  {
    sanskrit: "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः",
    transliteration: "Krodhād bhavati sammohaḥ sammohāt smṛtivibhramaḥ",
    meaning: "From anger comes confusion. From confusion, memory fails. When memory fails, reasoning is lost. When reasoning is lost, everything is lost.",
    meaning_te: "కోపం నుండి మోహం. మోహం నుండి జ్ఞాపకం చెడుతుంది. జ్ఞాపకం చెడితే వివేకం నశిస్తుంది. అన్నీ పోతాయి.",
    source: "Bhagavad Gita 2.63", slug: "mahabharata-lessons-on-anger", theme: "anger",
  },
  {
    sanskrit: "दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः",
    transliteration: "Duḥkheṣv anudvignamanāḥ sukheṣu vigataspṛhaḥ",
    meaning: "Undisturbed in sorrow. Without craving in happiness. Free from fear, anger, and attachment. That is wisdom.",
    meaning_te: "దుఃఖంలో కలవరపడకపోవడం. సుఖంలో ఆసక్తి లేకపోవడం. భయం, కోపం లేకపోవడం — అదే స్థిరప్రజ్ఞ.",
    source: "Bhagavad Gita 2.56", slug: "arjuna-confusion-moment-of-doubt", theme: "wisdom",
  },
  {
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत",
    transliteration: "Yadā yadā hi dharmasya glānir bhavati bhārata",
    meaning: "Whenever righteousness declines and disorder rises — at that time, I come into being to restore what matters.",
    meaning_te: "ఎప్పుడైనా ధర్మం క్షీణించినప్పుడు, అధర్మం పెరిగినప్పుడు — ఆ సమయంలో నేను అవతరిస్తాను.",
    source: "Bhagavad Gita 4.7", slug: "who-caused-mahabharata-war", theme: "dharma",
  },
  {
    sanskrit: "परित्राणाय साधूनां विनाशाय च दुष्कृताम्",
    transliteration: "Paritrāṇāya sādhūnāṃ vināśāya ca duṣkṛtām",
    meaning: "To protect the good, to end what causes harm, to restore what has been broken — this is why I take form, age after age.",
    meaning_te: "సాధువులను రక్షించడానికి, దుష్టులను నశింపజేయడానికి, ధర్మాన్ని నిలబెట్టడానికి — యుగయుగాలలో నేను పుడుతాను.",
    source: "Bhagavad Gita 4.8", slug: "who-caused-mahabharata-war", theme: "dharma",
  },
  {
    sanskrit: "न जायते म्रियते वा कदाचित्",
    transliteration: "Na jāyate mriyate vā kadācit",
    meaning: "This self was never born. It will never die. It is ancient, eternal, unborn, and undying.",
    meaning_te: "ఈ ఆత్మ ఎప్పుడూ పుట్టలేదు, ఎప్పుడూ చనిపోదు. ఇది పురాతనమైనది, శాశ్వతమైనది.",
    source: "Bhagavad Gita 2.20", slug: "arjuna-confusion-moment-of-doubt", theme: "identity",
  },
  {
    sanskrit: "वासांसि जीर्णानि यथा विहाय",
    transliteration: "Vāsāṃsi jīrṇāni yathā vihāya",
    meaning: "Just as a person discards worn-out clothes for new ones, the self discards worn-out bodies. Grieve not for what is shed.",
    meaning_te: "చిరిగిన వస్త్రాలను వదిలి కొత్తవి ధరించినట్లు — ఆత్మ జీర్ణమైన శరీరాన్ని వదిలి కొత్తదాన్ని పొందుతుంది.",
    source: "Bhagavad Gita 2.22", slug: "arjuna-confusion-moment-of-doubt", theme: "identity",
  },
  {
    sanskrit: "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ",
    transliteration: "Sukhaduḥkhe same kṛtvā lābhālābhau jayājayau",
    meaning: "Hold joy and sorrow equal. Hold gain and loss equal. Hold victory and defeat equal. Then act. That equanimity is your armor.",
    meaning_te: "సుఖదుఃఖాలు సమంగా చూడు. లాభనష్టాలు సమంగా చూడు. జయాపజయాలు సమంగా చూడు — అప్పుడు చేయి.",
    source: "Bhagavad Gita 2.38", slug: "bhagavad-gita-lessons-workplace-stress", theme: "karma",
  },
  {
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते",
    transliteration: "Dhyāyato viṣayān puṃsaḥ saṅgas teṣūpajāyate",
    meaning: "Thinking constantly of sense objects, attachment forms. From attachment, desire. From desire, anger. From anger, the whole collapse begins.",
    meaning_te: "విషయాలను నిరంతరం తలుస్తే అనురాగం పుడుతుంది. అనురాగం నుండి కోరిక. కోరిక నుండి కోపం. కోపం నుండి పతనం.",
    source: "Bhagavad Gita 2.62", slug: "mahabharata-lessons-on-anger", theme: "anger",
  },
  {
    sanskrit: "विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि",
    transliteration: "Vidyāvinayasampanne brāhmaṇe gavi hastini",
    meaning: "The wise see the same self in the learned, in the humble, in the cow, in the elephant, in the dog. That vision — equal everywhere — is true wisdom.",
    meaning_te: "జ్ఞాని విద్వాంసుడిలో, వినయంగలవాడిలో, ఆవులో, ఏనుగులో — అందరిలో ఒకే ఆత్మను చూస్తాడు.",
    source: "Bhagavad Gita 5.18", slug: "krishna-leadership-secrets", theme: "wisdom",
  },
  {
    sanskrit: "नेहाभिक्रमनाशोऽस्ति प्रत्यवायो न विद्यते",
    transliteration: "Nehābhikramanāśo'sti pratyavāyo na vidyate",
    meaning: "On this path, no effort is ever wasted. No step taken is ever lost. Even a little of this practice saves you from great danger.",
    meaning_te: "ఈ మార్గంలో ఏ ప్రయత్నమూ వృథా కాదు. ఏ అడుగూ పోదు. కొంచెం సాధన చేసినా గొప్ప భయం నుండి రక్షిస్తుంది.",
    source: "Bhagavad Gita 2.40", slug: "bhagavad-gita-lessons-workplace-stress", theme: "karma",
  },
  {
    sanskrit: "बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते",
    transliteration: "Bahūnāṃ janmanām ante jñānavān māṃ prapadyate",
    meaning: "After many lifetimes of searching, the person of wisdom finally arrives — recognizing that everything that exists is the divine itself.",
    meaning_te: "అనేక జన్మల తర్వాత జ్ఞాని నా దగ్గరకు చేరుతాడు — సర్వమూ వాసుదేవుడే అని తెలుసుకొని.",
    source: "Bhagavad Gita 7.19", slug: "krishna-leadership-secrets", theme: "wisdom",
  },
  {
    sanskrit: "मयि सर्वाणि कर्माणि संन्यस्याध्यात्मचेतसा",
    transliteration: "Mayi sarvāṇi karmāṇi saṃnyasyādhyātmacetasā",
    meaning: "Surrender every action to the greater whole. Act not from fear or desire, but from clear awareness. Then go.",
    meaning_te: "అన్ని కర్మలను నాకు అర్పించు. ఆశ లేకుండా, అహంకారం లేకుండా — యుద్ధం చేయి.",
    source: "Bhagavad Gita 3.30", slug: "krishna-detachment-action", theme: "karma",
  },
  {
    sanskrit: "ये यथा मां प्रपद्यन्ते तांस्तथैव भजाम्यहम्",
    transliteration: "Ye yathā māṃ prapadyante tāṃs tathaiva bhajāmy aham",
    meaning: "In whatever way people seek me — that is exactly how I meet them. Every genuine path toward truth is my path.",
    meaning_te: "ఎవరు ఏ విధంగా నన్ను చేరుకుంటారో — ఆ విధంగానే నేను వారికి అనుగ్రహిస్తాను. అన్ని మార్గాలూ నా మార్గాలే.",
    source: "Bhagavad Gita 4.11", slug: "dharma-beyond-rules", theme: "devotion",
  },
  {
    sanskrit: "अहिंसा सत्यमक्रोधस्त्यागः शान्तिरपैशुनम्",
    transliteration: "Ahiṃsā satyam akrodhas tyāgaḥ śāntir apaiśunam",
    meaning: "Non-harm. Truth. Freedom from anger. Generosity. Stillness. Refusing to speak ill of others. These are the marks of one moving toward the light.",
    meaning_te: "అహింస, సత్యం, కోపం లేకపోవడం, త్యాగం, శాంతి, పరుల దోషాలు చెప్పకపోవడం — ఇవి దైవీ సంపదకు చిహ్నాలు.",
    source: "Bhagavad Gita 16.2", slug: "dharma-beyond-rules", theme: "dharma",
  },
  {
    sanskrit: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः",
    transliteration: "Trividhaṃ narakasyedaṃ dvāraṃ nāśanam ātmanaḥ",
    meaning: "There are three doors to self-destruction: lust, anger, and greed. Abandon all three. They are the enemies waiting inside you.",
    meaning_te: "ఆత్మను నాశనం చేసే మూడు ద్వారాలు — కామం, క్రోధం, లోభం. ఈ మూడింటిని వదిలేయి. ఇవే మీ అంతశ్శత్రువులు.",
    source: "Bhagavad Gita 16.21", slug: "mahabharata-lessons-on-anger", theme: "anger",
  },
  {
    sanskrit: "श्रद्धावान्लभते ज्ञानं तत्परः संयतेन्द्रियः",
    transliteration: "Śraddhāvāṃl labhate jñānaṃ tatparaḥ saṃyatendriyaḥ",
    meaning: "The one who has faith, who is dedicated, whose senses are under command — that person finds wisdom and reaches peace without delay.",
    meaning_te: "శ్రద్ధగలవాడు, జ్ఞానంపై ఆసక్తిగలవాడు, ఇంద్రియాలను అదుపులో పెట్టుకున్నవాడు — జ్ఞానాన్ని పొందుతాడు.",
    source: "Bhagavad Gita 4.39", slug: "bhagavad-gita-lessons-workplace-stress", theme: "wisdom",
  },
  {
    sanskrit: "अव्यक्तादीनि भूतानि व्यक्तमध्यानि भारत",
    transliteration: "Avyaktādīni bhūtāni vyaktamadhyāni bhārata",
    meaning: "All beings come from the unmanifest. They are manifest in the middle. They return to the unmanifest. What then is there to grieve?",
    meaning_te: "అన్ని జీవులూ అవ్యక్తం నుండి వస్తాయి. మధ్యలో వ్యక్తమవుతాయి. చివరికి అవ్యక్తంలోకే వెళ్తాయి. దేనిగురించి దుఃఖం?",
    source: "Bhagavad Gita 2.28", slug: "arjuna-confusion-moment-of-doubt", theme: "identity",
  },
  {
    sanskrit: "मनःप्रसादः सौम्यत्वं मौनमात्मविनिग्रहः",
    transliteration: "Manaḥprasādaḥ saumyatvaṃ maunam ātmavinigrahaḥ",
    meaning: "A peaceful mind, gentleness of spirit, silence when words would harm, control of oneself — this is the discipline of the mind.",
    meaning_te: "మనసు ప్రశాంతత, సౌమ్యత, అవసరంలేని మాటలు మాట్లాడకపోవడం, ఆత్మనిగ్రహం — ఇవే మానసిక తపస్సు.",
    source: "Bhagavad Gita 17.16", slug: "bhagavad-gita-lessons-workplace-stress", theme: "wisdom",
  },
  {
    sanskrit: "सक्ताः कर्मण्यविद्वांसो यथा कुर्वन्ति भारत",
    transliteration: "Saktāḥ karmaṇy avidvāṃso yathā kurvanti bhārata",
    meaning: "The uninformed act with attachment. The wise should act without that attachment — but with equal energy — for the sake of holding the world together.",
    meaning_te: "అజ్ఞానులు ఫలాసక్తితో కర్మ చేస్తారు. జ్ఞాని అదే శ్రద్ధతో, ఫలాసక్తి లేకుండా చేయాలి — లోకకళ్యాణం కోసం.",
    source: "Bhagavad Gita 3.25", slug: "krishna-detachment-action", theme: "karma",
  },
  {
    sanskrit: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः",
    transliteration: "Yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanurdharaḥ",
    meaning: "Wherever there is the master of yoga and the one who holds their bow with purpose — there will be prosperity, victory, and wisdom.",
    meaning_te: "యోగేశ్వరుడైన కృష్ణుడు ఉన్నచోట, ధనుర్ధారియైన అర్జునుడు ఉన్నచోట — అక్కడ విజయం, సంపద, నీతి ఉంటాయి.",
    source: "Bhagavad Gita 18.78", slug: "arjuna-karna-the-real-rivalry", theme: "dharma",
  },
  {
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते",
    transliteration: "Ananyāś cintayanto māṃ ye janāḥ paryupāsate",
    meaning: "Those who think of me without turning elsewhere — I carry what they need and preserve what they already have.",
    meaning_te: "అనన్యభావంతో నన్ను ధ్యానించేవారికి — వారికి కావలసినది ఇస్తాను, ఉన్నది కాపాడతాను.",
    source: "Bhagavad Gita 9.22", slug: "krishna-detachment-action", theme: "devotion",
  },
  {
    sanskrit: "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति",
    transliteration: "Patraṃ puṣpaṃ phalaṃ toyaṃ yo me bhaktyā prayacchati",
    meaning: "A leaf, a flower, a fruit, water — whoever offers even these small things with genuine devotion, I accept that offering completely.",
    meaning_te: "ఒక ఆకు, ఒక పువ్వు, ఒక పండు, నీళ్ళు — ఏదైనా భక్తితో అర్పించేవాడిది నేను స్వీకరిస్తాను.",
    source: "Bhagavad Gita 9.26", slug: "krishna-leadership-secrets", theme: "devotion",
  },
  {
    sanskrit: "मनुष्याणां सहस्रेषु कश्चिद्यतति सिद्धये",
    transliteration: "Manuṣyāṇāṃ sahasreṣu kaścid yatati siddhaye",
    meaning: "Among thousands, perhaps one strives for perfection. Among those who strive, perhaps one truly knows the divine. That one is rare beyond measure.",
    meaning_te: "వేలాది మనుషులలో ఒకరు సిద్ధికోసం ప్రయత్నిస్తారు. ప్రయత్నించేవారిలో ఒకరు నన్ను తెలుసుకుంటారు. అటువంటివారు చాలా అరుదు.",
    source: "Bhagavad Gita 7.3", slug: "krishna-leadership-secrets", theme: "wisdom",
  },
  {
    sanskrit: "सर्वस्य चाहं हृदि सन्निविष्टो",
    transliteration: "Sarvasya cāhaṃ hṛdi sanniviṣṭo",
    meaning: "I am seated in the heart of every being. Memory, knowledge, and the removal of doubt — all of this comes from me.",
    meaning_te: "నేను అందరి హృదయంలో నిలిచి ఉన్నాను. జ్ఞాపకం, జ్ఞానం, సందేహాల నివారణ — అన్నీ నా నుండే వస్తాయి.",
    source: "Bhagavad Gita 15.15", slug: "krishna-leadership-secrets", theme: "devotion",
  },
  {
    sanskrit: "असक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः",
    transliteration: "Asakto hy ācaran karma param āpnoti pūruṣaḥ",
    meaning: "Acting without attachment — the person who does this achieves what is highest. The great ones showed this was possible. Act, and do not turn away from the world.",
    meaning_te: "అనాసక్తితో కర్మ చేసే మనిషి పరమాన్ని పొందుతాడు. జనకుడు మొదలైన మహానుభావులు ఇదే చేశారు.",
    source: "Bhagavad Gita 3.19", slug: "krishna-detachment-action", theme: "karma",
  },
  {
    sanskrit: "नास्ति बुद्धिरयुक्तस्य न चायुक्तस्य भावना",
    transliteration: "Nāsti buddhir ayuktasya na cāyuktasya bhāvanā",
    meaning: "For one whose mind is scattered, there is no wisdom. For one with no wisdom, there is no peace. For one with no peace — how can there be happiness?",
    meaning_te: "చంచలమైన మనసుకు వివేకం ఉండదు. వివేకం లేనివాడికి శాంతి ఎక్కడ? శాంతి లేనివాడికి సుఖం ఎక్కడ?",
    source: "Bhagavad Gita 2.66", slug: "arjuna-confusion-moment-of-doubt", theme: "wisdom",
  },
  {
    sanskrit: "यं हि न व्यथयन्त्येते पुरुषं पुरुषर्षभ",
    transliteration: "Yaṃ hi na vyathayanty ete puruṣaṃ puruṣarṣabha",
    meaning: "The one who is not shaken by pleasure and pain, heat and cold, honor and dishonor — that person is ready. They are fit for what is undying.",
    meaning_te: "సుఖదుఃఖాలు, శీతోష్ణాలు, గౌరవాపమానాలు — వీటిచే కలవరపడనివాడు అమర్త్యతకు అర్హుడు.",
    source: "Bhagavad Gita 2.15", slug: "bhagavad-gita-lessons-workplace-stress", theme: "identity",
  },
  {
    sanskrit: "ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः",
    transliteration: "Brahmaṇy ādhāya karmāṇi saṅgaṃ tyaktvā karoti yaḥ",
    meaning: "The one who acts — offering every action to the greater whole, without clinging — is not touched by wrongdoing. Like a lotus untouched by water.",
    meaning_te: "అన్ని కర్మలను బ్రహ్మకు అర్పించి, అనురాగం వదిలి చేసేవాడు — నీటిలో తామరలా పాపంచే అంటడు.",
    source: "Bhagavad Gita 5.10", slug: "krishna-detachment-action", theme: "karma",
  },
  {
    sanskrit: "नष्टो मोहः स्मृतिर्लब्धा त्वत्प्रसादान्मयाच्युत",
    transliteration: "Naṣṭo mohaḥ smṛtir labdhā tvat prasādān mayācyuta",
    meaning: "My confusion is gone. My memory is restored. By your grace, I stand firm. My doubts have dissolved. I will act as you have said.",
    meaning_te: "నా మోహం నశించింది. జ్ఞాపకం తిరిగి వచ్చింది. నీ కృపతో స్థిరంగా నిలిచాను. నీవు చెప్పినట్లే చేస్తాను.",
    source: "Bhagavad Gita 18.73", slug: "arjuna-confusion-moment-of-doubt", theme: "identity",
  },
  {
    sanskrit: "स्वभावजेन कौन्तेय निबद्धः स्वेन कर्मणा",
    transliteration: "Svabhāvajena kaunteya nibaddhaḥ svena karmaṇā",
    meaning: "Every person is bound by actions that arise from their own nature. What you are drawn to do — that is where your work lies. You cannot escape yourself.",
    meaning_te: "ప్రతి మనిషీ తన స్వభావం నుండి పుట్టే కర్మకు కట్టుబడి ఉంటాడు. నీ స్వభావం నిన్ను పిలుస్తుంది — దాన్ని తప్పించుకోలేవు.",
    source: "Bhagavad Gita 18.60", slug: "dharma-beyond-rules", theme: "dharma",
  },
  {
    sanskrit: "दम्भो दर्पोऽभिमानश्च क्रोधः पारुष्यमेव च",
    transliteration: "Dambho darpo'bhimānaś ca krodhaḥ pāruṣyam eva ca",
    meaning: "Pretense. Arrogance. Conceit. Anger. Harshness. Recognizing these in yourself is the beginning of genuine honesty.",
    meaning_te: "డంభం, గర్వం, అహంకారం, కోపం, కఠినత్వం — వీటిని మనలో గుర్తించడమే నిజాయితీకి నాంది.",
    source: "Bhagavad Gita 16.4", slug: "mahabharata-lessons-on-anger", theme: "anger",
  },
  {
    sanskrit: "हतो वा प्राप्स्यसि स्वर्गं जित्वा वा भोक्ष्यसे महीम्",
    transliteration: "Hato vā prāpsyasi svargaṃ jitvā vā bhokṣyase mahīm",
    meaning: "If you fall in this right action, you gain what is beyond this world. If you succeed, you enjoy what is in it. Either way — rise and act.",
    meaning_te: "పడిపోతే స్వర్గం పొందుతావు. గెలిస్తే భూమిని అనుభవిస్తావు. ఏ విధంగా చూసినా — లే, యుద్ధం చేయి.",
    source: "Bhagavad Gita 2.37", slug: "arjuna-confusion-moment-of-doubt", theme: "karma",
  },
  {
    sanskrit: "अहं सर्वस्य प्रभवो मत्तः सर्वं प्रवर्तते",
    transliteration: "Ahaṃ sarvasya prabhavo mattaḥ sarvaṃ pravartate",
    meaning: "I am the origin of everything. Everything proceeds from me. Knowing this, the wise worship with their whole being.",
    meaning_te: "నేనే సర్వస్య మూలం. నా నుండే సర్వమూ ప్రవర్తిస్తుంది. ఇది తెలుసుకున్న జ్ఞానులు నన్నే భజిస్తారు.",
    source: "Bhagavad Gita 10.8", slug: "krishna-leadership-secrets", theme: "devotion",
  },
  {
    sanskrit: "क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते",
    transliteration: "Klaibyaṃ mā sma gamaḥ pārtha naitat tvayy upapadyate",
    meaning: "Do not yield to weakness, Arjuna. It does not befit you. Shake off this faintheartedness. Rise.",
    meaning_te: "అర్జునా, నపుంసకత్వాన్ని పొందకు. అది నీకు తగదు. ఈ హృదయదౌర్బల్యాన్ని విడిచి లే.",
    source: "Bhagavad Gita 2.3", slug: "arjuna-confusion-moment-of-doubt", theme: "identity",
  },
  {
    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः",
    transliteration: "Mātrāsparśās tu kaunteya śītoṣṇasukhaduḥkhadāḥ",
    meaning: "Contact with sense objects gives rise to cold and heat, pleasure and pain. These come and go — they are impermanent. Bear them, Arjuna.",
    meaning_te: "ఇంద్రియ స్పర్శలు శీతోష్ణాలను, సుఖదుఃఖాలను కలిగిస్తాయి. అవి వచ్చిపోతాయి — అశాశ్వతమైనవి. వాటిని సహించు.",
    source: "Bhagavad Gita 2.14", slug: "bhagavad-gita-lessons-workplace-stress", theme: "wisdom",
  },
  {
    sanskrit: "यो मां पश्यति सर्वत्र सर्वं च मयि पश्यति",
    transliteration: "Yo māṃ paśyati sarvatra sarvaṃ ca mayi paśyati",
    meaning: "One who sees me everywhere and sees everything in me — I am never lost to that person, and that person is never lost to me.",
    meaning_te: "ఎవరు నన్ను అన్నిచోట్లా చూస్తారో, అన్నిటిలో నన్ను చూస్తారో — వారు నాకు కోల్పోరు, నేను వారికి కోల్పోను.",
    source: "Bhagavad Gita 6.30", slug: "krishna-detachment-action", theme: "devotion",
  },
  {
    sanskrit: "समं सर्वेषु भूतेषु तिष्ठन्तं परमेश्वरम्",
    transliteration: "Samaṃ sarveṣu bhūteṣu tiṣṭhantaṃ parameśvaram",
    meaning: "The one who sees the supreme equally present in every being — who does not harm any living creature by the self — reaches the highest destination.",
    meaning_te: "అన్ని జీవులలో పరమేశ్వరుని సమంగా చూసేవాడు — ఆత్మచే ఆత్మను హింసించుకోకుండా — పరమగతిని పొందుతాడు.",
    source: "Bhagavad Gita 13.28", slug: "krishna-leadership-secrets", theme: "relationships",
  },
  {
    sanskrit: "उदारः सर्व एवैते ज्ञानी त्वात्मैव मे मतम्",
    transliteration: "Udāraḥ sarva evaite jñānī tv ātmaiva me matam",
    meaning: "All devotees are noble. But the one of wisdom — that person is my very self. For they are established in me as their only destination.",
    meaning_te: "అందరూ మహానుభావులే. కానీ జ్ఞాని నాకు ఆత్మతో సమానం. ఎందుకంటే అతడు నన్నే ఆశ్రయంగా పొందాడు.",
    source: "Bhagavad Gita 7.18", slug: "krishna-leadership-secrets", theme: "wisdom",
  },
  {
    sanskrit: "न द्वेष्ट्यकुशलं कर्म कुशले नानुषज्जते",
    transliteration: "Na dveṣṭy akuśalaṃ karma kuśale nānuṣajjate",
    meaning: "One who neither hates difficult work nor clings to pleasant work — who has let go of attachment — that person is said to be established in purity.",
    meaning_te: "కష్టమైన కర్మను ద్వేషించకపోవడం, సుఖంగలదానిలో అతుక్కోకపోవడం — అనురాగం వదిలినవాడు సత్వగుణసంపన్నుడు.",
    source: "Bhagavad Gita 18.10", slug: "krishna-detachment-action", theme: "karma",
  },
  {
    sanskrit: "प्रजहाति यदा कामान्सर्वान्पार्थ मनोगतान्",
    transliteration: "Prajahāti yadā kāmān sarvān pārtha manogatān",
    meaning: "When a person completely lets go of all desires of the mind — content within the self by the self alone — that person is called steadily wise.",
    meaning_te: "మనసులోని అన్ని కోరికలనూ వదిలేసినప్పుడు — ఆత్మలో ఆత్మద్వారా సంతుష్టుడైనప్పుడు — అతడు స్థిరప్రజ్ఞుడు.",
    source: "Bhagavad Gita 2.55", slug: "arjuna-confusion-moment-of-doubt", theme: "wisdom",
  },
  {
    sanskrit: "बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः",
    transliteration: "Bandhur ātmātmanas tasya yenātmaivātmanā jitaḥ",
    meaning: "For the one who has mastered the self — the self is the friend. For the one who has not — the self is the enemy that acts like a foe.",
    meaning_te: "ఆత్మను జయించినవాడికి ఆత్మే మిత్రుడు. ఆత్మను జయించనివాడికి ఆత్మే శత్రువులా వ్యవహరిస్తుంది.",
    source: "Bhagavad Gita 6.6", slug: "krishna-leadership-secrets", theme: "identity",
  },
  {
    sanskrit: "इमं विवस्वते योगं प्रोक्तवानहमव्ययम्",
    transliteration: "Imaṃ vivasvate yogaṃ proktavān aham avyayam",
    meaning: "This teaching is ancient. I gave it first to the sun, who passed it down through the ages. When it was lost to time, I came again to speak it.",
    meaning_te: "ఈ యోగాన్ని మొదట సూర్యునికి చెప్పాను. అతను మనువుకు చెప్పాడు. ఇలా యుగాల గుండా వచ్చింది.",
    source: "Bhagavad Gita 4.1", slug: "krishna-leadership-secrets", theme: "wisdom",
  },
  {
    sanskrit: "मत्कर्मकृन्मत्परमो मद्भक्तः सङ्गवर्जितः",
    transliteration: "Matkarmakṛn matparamo madbhaktaḥ saṅgavarjitaḥ",
    meaning: "One who acts for me, who holds me as the highest, who is devoted without clinging, who is at peace with every being — that person comes to me.",
    meaning_te: "నా కోసం కర్మ చేసేవాడు, నన్నే పరమగతిగా భావించేవాడు, అనురాగం లేకుండా భక్తి చేసేవాడు — నా దగ్గరకు చేరుతాడు.",
    source: "Bhagavad Gita 11.55", slug: "krishna-detachment-action", theme: "devotion",
  },
  {
    sanskrit: "सर्वभूतहिते रताः",
    transliteration: "Sarvabhūtahite ratāḥ",
    meaning: "Devoted to the welfare of all beings — this simple phrase marks those who have understood what the Gita is actually asking.",
    meaning_te: "అన్ని జీవుల మేలును కోరుతూ జీవించేవారు — గీత నిజంగా అడిగేది ఇదే అని అర్థం చేసుకున్నవారు.",
    source: "Bhagavad Gita 12.4", slug: "krishna-leadership-secrets", theme: "relationships",
  },
];

function getRandomSloka(exclude?: number): number {
  let idx = Math.floor(Math.random() * SLOKAS.length);
  if (exclude !== undefined && SLOKAS.length > 1) {
    while (idx === exclude) idx = Math.floor(Math.random() * SLOKAS.length);
  }
  return idx;
}

const DailyWisdom = () => {
  const { t } = useTranslation();
  const [activeTheme, setActiveTheme] = useState<Theme>("all");
  const [currentIdx, setCurrentIdx] = useState<number>(() => new Date().getDay() % SLOKAS.length);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = activeTheme === "all"
    ? SLOKAS
    : SLOKAS.filter(s => s.theme === activeTheme);

  const sloka = filtered[currentIdx % filtered.length] ?? SLOKAS[0];

  const handleTheme = useCallback((theme: Theme) => {
    setActiveTheme(theme);
    setCurrentIdx(0);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setCurrentIdx(prev => {
        let next = Math.floor(Math.random() * filtered.length);
        while (next === prev % filtered.length && filtered.length > 1) {
          next = Math.floor(Math.random() * filtered.length);
        }
        return next;
      });
      setRefreshing(false);
    }, 300);
  }, [filtered]);

  const themes = (Object.keys(THEME_LABELS) as Theme[]);

  return (
    <section id="wisdom" className="section-padding">
      <div className="max-w-2xl mx-auto text-center">
        <div className="section-header">
          <span className="section-label">{t("home.shloka.eyebrow")}</span>
          <h2 className="section-title">{t("home.shloka.title")}</h2>
        </div>

        {/* Theme filter pills */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-8"
          role="group"
          aria-label="Filter slokas by theme"
        >
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => handleTheme(theme)}
              className="px-4 py-1.5 rounded-full text-[11px] tracking-[0.15em] uppercase font-heading transition-all duration-200"
              style={{
                fontFamily: "'Cinzel', serif",
                background: activeTheme === theme
                  ? "hsl(var(--primary))"
                  : "rgba(212,175,55,0.06)",
                color: activeTheme === theme
                  ? "hsl(var(--primary-foreground))"
                  : "rgba(212,175,55,0.7)",
                border: activeTheme === theme
                  ? "1px solid transparent"
                  : "1px solid rgba(212,175,55,0.2)",
              }}
            >
              {THEME_LABELS[theme]}
              {theme !== "all" && (
                <span style={{ opacity: 0.5, marginLeft: "4px" }}>
                  {SLOKAS.filter(s => s.theme === theme).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sloka card */}
        <div
          className="glass-card p-10 md:p-16 animate-pulse-glow relative"
          style={{ opacity: refreshing ? 0.4 : 1, transition: "opacity 0.3s ease" }}
        >
          <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-primary/30 rounded-tl-lg" />
          <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-primary/30 rounded-tr-lg" />
          <div className="absolute bottom-5 left-5 w-8 h-8 border-b border-l border-primary/30 rounded-bl-lg" />
          <div className="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-primary/30 rounded-br-lg" />

          {/* Theme badge */}
          <span
            className="inline-block mb-4 px-3 py-1 rounded-full text-[9px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: "'Cinzel', serif",
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.2)",
              color: "rgba(212,175,55,0.7)",
            }}
          >
            {THEME_LABELS[sloka.theme]}
          </span>

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

          {/* English */}
          <p
            className="text-foreground text-base md:text-lg leading-relaxed mb-4 italic"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {sloka.meaning}
          </p>

          {/* Telugu */}
          <p
            className="text-foreground/75 text-base leading-relaxed mb-6"
            style={{ fontFamily: "'Noto Serif Telugu', serif", fontSize: "clamp(15px, 1.7vw, 17px)" }}
          >
            {sloka.meaning_te}
          </p>

          <span className="text-primary/50 text-[11px] tracking-[0.25em] uppercase">
            — {sloka.source}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
          <button
            onClick={handleRefresh}
            disabled={refreshing || filtered.length <= 1}
            className="inline-flex items-center gap-2 text-primary text-[12px] tracking-[0.18em] uppercase font-heading hover:opacity-80 transition-opacity disabled:opacity-30"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Another Sloka
          </button>
          <span className="hidden sm:inline text-muted-foreground/40">·</span>
          <Link
            to={`/blog/${sloka.slug}`}
            className="inline-flex items-center gap-2 text-muted-foreground text-[12px] tracking-[0.18em] uppercase font-heading hover:text-primary transition-colors"
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

        {/* Counter */}
        <p
          className="mt-4 text-muted-foreground/40 text-[11px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {filtered.length} sloka{filtered.length !== 1 ? "s" : ""} in {THEME_LABELS[activeTheme]}
        </p>
      </div>
    </section>
  );
};

export default DailyWisdom;
