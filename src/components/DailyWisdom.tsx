import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Sloka {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  meaning_te: string;
  source: string;
  slug: string;
}

const SLOKAS: Sloka[] = [
  {
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
    transliteration: "Karmaṇy evādhikāraste mā phaleṣu kadācana",
    meaning: "You have the right to act. You do not have the right to the outcome of that action.",
    meaning_te: "కర్మ చేయడం మీ హక్కు. ఆ కర్మ ఫలం మీ హక్కు కాదు.",
    source: "Bhagavad Gita 2.47",
    slug: "gita-verse-two-forty-seven",
  },
  {
    sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्",
    transliteration: "Śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt",
    meaning: "Your own path walked imperfectly is better than another's path walked perfectly.",
    meaning_te: "మీ స్వంత మార్గం తప్పటడుగులతో నడిచినా — వేరొకరి మార్గం కంటే శ్రేష్ఠమైనది.",
    source: "Bhagavad Gita 3.35",
    slug: "dharma-beyond-rules",
  },
  {
    sanskrit: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः",
    transliteration: "Nainaṃ chindanti śastrāṇi nainaṃ dahati pāvakaḥ",
    meaning: "No weapon can cut this. No fire can burn this. The self that you truly are is beyond all destruction.",
    meaning_te: "ఏ ఆయుధమూ దీన్ని ఛేదించలేదు. ఏ అగ్నీ దీన్ని దహించలేదు. నువ్వు నిజంగా ఏమిటో — అది శాశ్వతం.",
    source: "Bhagavad Gita 2.23",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्",
    transliteration: "Uddhared ātmanātmānaṃ nātmānam avasādayet",
    meaning: "Lift yourself by your own effort. Do not pull yourself down. You are your own best friend and your own worst enemy.",
    meaning_te: "నువ్వే నిన్ను పైకి లేపుకో. నువ్వే నిన్ను కూల్చుకోకు. నీకు నువ్వే మిత్రుడివి — నీకు నువ్వే శత్రుడివి.",
    source: "Bhagavad Gita 6.5",
    slug: "krishna-leadership-secrets",
  },
  {
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज",
    transliteration: "Sarvadharmān parityajya mām ekaṃ śaraṇaṃ vraja",
    meaning: "Let go of every path you have been trying to walk. Come to me exactly as you are. I will release you from all that weighs on you.",
    meaning_te: "అన్ని మార్గాలనూ వదిలేయి. ఉన్నపళంగా నా దగ్గరకు రా. నేను నిన్ను అన్నిటి నుండి విడిపిస్తాను.",
    source: "Bhagavad Gita 18.66",
    slug: "dharma-beyond-rules",
  },
  {
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय",
    transliteration: "Yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya",
    meaning: "Stand rooted in the present. Act without clinging to results. That steadiness — that is yoga.",
    meaning_te: "స్థిరంగా నిలుచో. అతుక్కోకుండా చేయి. ఆ స్థిరత్వమే యోగం.",
    source: "Bhagavad Gita 2.48",
    slug: "bhagavad-gita-lessons-workplace-stress",
  },
  {
    sanskrit: "समो‌ऽहं सर्वभूतेषु न मे द्वेष्यो‌ऽस्ति न प्रियः",
    transliteration: "Samo'haṃ sarvabhūteṣu na me dveṣyo'sti na priyaḥ",
    meaning: "I am equal toward all beings. None is hateful to me, none especially dear. Those who seek me with devotion — I am in them, and they are in me.",
    meaning_te: "నేను అందరిపట్ల సమంగా ఉన్నాను. నాకు ఎవరూ ద్వేష్యుడు కాదు. భక్తితో నన్ను కోరేవారిలో నేను ఉన్నాను.",
    source: "Bhagavad Gita 9.29",
    slug: "krishna-detachment-action",
  },
  {
    sanskrit: "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः",
    transliteration: "Krodhād bhavati sammohaḥ sammohāt smṛtivibhramaḥ",
    meaning: "From anger comes confusion. From confusion, the memory fails. When memory fails, the power to reason is lost. When reasoning is lost, everything is lost.",
    meaning_te: "కోపం నుండి మోహం పుడుతుంది. మోహం నుండి జ్ఞాపకం చెడుతుంది. జ్ఞాపకం చెడితే వివేకం నశిస్తుంది. వివేకం నశిస్తే అన్నీ పోతాయి.",
    source: "Bhagavad Gita 2.63",
    slug: "mahabharata-lessons-on-anger",
  },
  {
    sanskrit: "दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः",
    transliteration: "Duḥkheṣv anudvignamanāḥ sukheṣu vigataspṛhaḥ",
    meaning: "Undisturbed in sorrow. Without craving in happiness. Free from fear, anger, and attachment. That steadiness of mind — that is what wisdom looks like.",
    meaning_te: "దుఃఖంలో కలవరపడకపోవడం. సుఖంలో ఆసక్తి లేకపోవడం. భయం, కోపం, అనురాగం లేకపోవడం — అదే స్థిరప్రజ్ఞ.",
    source: "Bhagavad Gita 2.56",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "अनित्यमसुखं लोकमिमं प्राप्य भजस्व माम्",
    transliteration: "Anityam asukhaṃ lokam imaṃ prāpya bhajasva mām",
    meaning: "This world is impermanent and full of suffering. Having arrived here, turn toward what does not pass away.",
    meaning_te: "ఈ లోకం అశాశ్వతమైనది, సుఖంలేనిది. ఇక్కడ పుట్టిన తర్వాత — శాశ్వతమైన దాన్ని కోరుకో.",
    source: "Bhagavad Gita 9.33",
    slug: "dharma-beyond-rules",
  },
  {
    sanskrit: "मनःप्रसादः सौम्यत्वं मौनमात्मविनिग्रहः",
    transliteration: "Manaḥprasādaḥ saumyatvaṃ maunam ātmavinigrahaḥ",
    meaning: "A peaceful mind, gentleness of spirit, silence when words would harm, control of oneself — this is the discipline of the mind.",
    meaning_te: "మనసు ప్రశాంతత, సౌమ్యత, అవసరంలేని మాటలు మాట్లాడకపోవడం, ఆత్మనిగ్రహం — ఇవే మానసిక తపస్సు.",
    source: "Bhagavad Gita 17.16",
    slug: "bhagavad-gita-lessons-workplace-stress",
  },
  {
    sanskrit: "विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि",
    transliteration: "Vidyāvinayasampanne brāhmaṇe gavi hastini",
    meaning: "The wise see the same self in the learned, in the humble, in the cow, in the elephant, in the dog. That vision — the same everywhere — is true wisdom.",
    meaning_te: "జ్ఞాని విద్వాంసుడిలో, వినయంగలవాడిలో, ఆవులో, ఏనుగులో — అందరిలో ఒకే ఆత్మను చూస్తాడు. అదే నిజమైన జ్ఞానం.",
    source: "Bhagavad Gita 5.18",
    slug: "krishna-leadership-secrets",
  },
  {
    sanskrit: "नास्ति बुद्धिरयुक्तस्य न चायुक्तस्य भावना",
    transliteration: "Nāsti buddhir ayuktasya na cāyuktasya bhāvanā",
    meaning: "For one whose mind is scattered, there is no wisdom. For one with no wisdom, there is no peace. For one with no peace — how can there be happiness?",
    meaning_te: "చంచలమైన మనసుకు వివేకం ఉండదు. వివేకం లేనివాడికి ఏకాగ్రత ఉండదు. ఏకాగ్రత లేనివాడికి శాంతి ఎక్కడ?",
    source: "Bhagavad Gita 2.66",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "इन्द्रियाणां हि चरतां यन्मनोऽनुविधीयते",
    transliteration: "Indriyāṇāṃ hi caratāṃ yan mano'nuvidhīyate",
    meaning: "When the mind follows the wandering senses, it carries wisdom away the way a strong wind carries a boat off its course.",
    meaning_te: "మనసు ఇంద్రియాల వెంట పరిగెత్తినప్పుడు — బలమైన గాలి పడవను తోసేసినట్లు జ్ఞానం మునిగిపోతుంది.",
    source: "Bhagavad Gita 2.67",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत",
    transliteration: "Yadā yadā hi dharmasya glānir bhavati bhārata",
    meaning: "Whenever righteousness declines and disorder rises — at that time, I come into being. In every age, the work of restoring what matters begins again.",
    meaning_te: "ఎప్పుడైనా ధర్మం క్షీణించినప్పుడు, అధర్మం పెరిగినప్పుడు — ఆ సమయంలో నేను అవతరిస్తాను.",
    source: "Bhagavad Gita 4.7",
    slug: "who-caused-mahabharata-war",
  },
  {
    sanskrit: "परित्राणाय साधूनां विनाशाय च दुष्कृताम्",
    transliteration: "Paritrāṇāya sādhūnāṃ vināśāya ca duṣkṛtām",
    meaning: "To protect the good, to end what causes harm, to restore what has been broken — this is why I take form, age after age.",
    meaning_te: "సాధువులను రక్షించడానికి, దుష్టులను నశింపజేయడానికి, ధర్మాన్ని నిలబెట్టడానికి — యుగయుగాలలో నేను పుడుతాను.",
    source: "Bhagavad Gita 4.8",
    slug: "who-caused-mahabharata-war",
  },
  {
    sanskrit: "न जायते म्रियते वा कदाचित्",
    transliteration: "Na jāyate mriyate vā kadācit",
    meaning: "This self was never born. It will never die. It has not come into being, nor will it cease. It is ancient, eternal, unborn, and undying.",
    meaning_te: "ఈ ఆత్మ ఎప్పుడూ పుట్టలేదు, ఎప్పుడూ చనిపోదు. ఇది పురాతనమైనది, శాశ్వతమైనది, అజన్మ, అమర్త్యమైనది.",
    source: "Bhagavad Gita 2.20",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "वासांसि जीर्णानि यथा विहाय",
    transliteration: "Vāsāṃsi jīrṇāni yathā vihāya",
    meaning: "Just as a person discards worn-out clothes and puts on new ones, the self discards worn-out bodies and enters new ones. Grieve not for what is shed.",
    meaning_te: "చిరిగిన వస్త్రాలను వదిలి కొత్తవి ధరించినట్లు — ఆత్మ జీర్ణమైన శరీరాన్ని వదిలి కొత్తదాన్ని పొందుతుంది.",
    source: "Bhagavad Gita 2.22",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "हतो वा प्राप्स्यसि स्वर्गं जित्वा वा भोक्ष्यसे महीम्",
    transliteration: "Hato vā prāpsyasi svargaṃ jitvā vā bhokṣyase mahīm",
    meaning: "If you fall in this right action, you gain what is beyond this world. If you succeed, you enjoy what is in it. Either way — rise and act.",
    meaning_te: "పడిపోతే స్వర్గం పొందుతావు. గెలిస్తే భూమిని అనుభవిస్తావు. ఏ విధంగా చూసినా — లే, యుద్ధం చేయి.",
    source: "Bhagavad Gita 2.37",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ",
    transliteration: "Sukhaduḥkhe same kṛtvā lābhālābhau jayājayau",
    meaning: "Hold joy and sorrow equal. Hold gain and loss equal. Hold victory and defeat equal. Then go into battle. That equanimity — that is your armor.",
    meaning_te: "సుఖదుఃఖాలు సమంగా చూడు. లాభనష్టాలు సమంగా చూడు. జయాపజయాలు సమంగా చూడు — అప్పుడు యుద్ధానికి దిగు.",
    source: "Bhagavad Gita 2.38",
    slug: "bhagavad-gita-lessons-workplace-stress",
  },
  {
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते",
    transliteration: "Dhyāyato viṣayān puṃsaḥ saṅgas teṣūpajāyate",
    meaning: "Thinking constantly of the objects of the senses, attachment forms. From attachment, desire. From desire, anger. From anger, the whole collapse begins.",
    meaning_te: "విషయాలను నిరంతరం తలుస్తే అనురాగం పుడుతుంది. అనురాగం నుండి కోరిక. కోరిక నుండి కోపం. కోపం నుండి పతనం.",
    source: "Bhagavad Gita 2.62",
    slug: "mahabharata-lessons-on-anger",
  },
  {
    sanskrit: "अव्यक्तादीनि भूतानि व्यक्तमध्यानि भारत",
    transliteration: "Avyaktādīni bhūtāni vyaktamadhyāni bhārata",
    meaning: "All beings come from the unmanifest. They are manifest in the middle. They return to the unmanifest at the end. What then is there to grieve?",
    meaning_te: "అన్ని జీవులూ అవ్యక్తం నుండి వస్తాయి. మధ్యలో వ్యక్తమవుతాయి. చివరికి అవ్యక్తంలోకే వెళ్తాయి. అప్పుడు దేనిగురించి దుఃఖం?",
    source: "Bhagavad Gita 2.28",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "नेहाभिक्रमनाशोऽस्ति प्रत्यवायो न विद्यते",
    transliteration: "Nehābhikramanāśo'sti pratyavāyo na vidyate",
    meaning: "On this path, no effort is ever wasted. No step taken is ever lost. Even a little of this practice saves you from great danger.",
    meaning_te: "ఈ మార్గంలో ఏ ప్రయత్నమూ వృథా కాదు. ఏ అడుగూ పోదు. కొంచెం సాధన చేసినా — గొప్ప భయం నుండి రక్షిస్తుంది.",
    source: "Bhagavad Gita 2.40",
    slug: "bhagavad-gita-lessons-workplace-stress",
  },
  {
    sanskrit: "बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते",
    transliteration: "Bahūnāṃ janmanām ante jñānavān māṃ prapadyate",
    meaning: "After many lifetimes of searching, the person of wisdom finally arrives — recognizing that everything that exists is the divine itself. That understanding is rare beyond measure.",
    meaning_te: "అనేక జన్మల తర్వాత జ్ఞాని నా దగ్గరకు చేరుతాడు — సర్వమూ వాసుదేవుడే అని తెలుసుకొని. అటువంటి మహాత్ముడు చాలా అరుదు.",
    source: "Bhagavad Gita 7.19",
    slug: "krishna-leadership-secrets",
  },
  {
    sanskrit: "अहं सर्वस्य प्रभवो मत्तः सर्वं प्रवर्तते",
    transliteration: "Ahaṃ sarvasya prabhavo mattaḥ sarvaṃ pravartate",
    meaning: "I am the origin of everything. Everything proceeds from me. Knowing this, the wise worship me with their whole being.",
    meaning_te: "నేనే సర్వస్య మూలం. నా నుండే సర్వమూ ప్రవర్తిస్తుంది. ఇది తెలుసుకున్న జ్ఞానులు నన్నే భజిస్తారు.",
    source: "Bhagavad Gita 10.8",
    slug: "krishna-leadership-secrets",
  },
  {
    sanskrit: "मयि सर्वाणि कर्माणि संन्यस्याध्यात्मचेतसा",
    transliteration: "Mayi sarvāṇi karmāṇi saṃnyasyādhyātmacetasā",
    meaning: "Surrender every action to me. Act from the deepest place in yourself — not from fear, not from desire, but from clear awareness. Then fight.",
    meaning_te: "అన్ని కర్మలను నాకు అర్పించు. ఆశ లేకుండా, అహంకారం లేకుండా, జ్వరం లేకుండా — యుద్ధం చేయి.",
    source: "Bhagavad Gita 3.30",
    slug: "krishna-detachment-action",
  },
  {
    sanskrit: "ये यथा मां प्रपद्यन्ते तांस्तथैव भजाम्यहम्",
    transliteration: "Ye yathā māṃ prapadyante tāṃs tathaiva bhajāmy aham",
    meaning: "In whatever way people seek me — that is the way I meet them. Every path that genuinely reaches toward the truth is my path.",
    meaning_te: "ఎవరు ఏ విధంగా నన్ను చేరుకుంటారో — ఆ విధంగానే నేను వారికి అనుగ్రహిస్తాను. అన్ని మార్గాలూ నా మార్గాలే.",
    source: "Bhagavad Gita 4.11",
    slug: "dharma-beyond-rules",
  },
  {
    sanskrit: "न कर्तृत्वं न कर्माणि लोकस्य सृजति प्रभुः",
    transliteration: "Na kartṛtvaṃ na karmāṇi lokasya sṛjati prabhuḥ",
    meaning: "The divine does not create the doership of people, nor their actions, nor the connection between action and result. That all arises from the nature of things itself.",
    meaning_te: "భగవంతుడు మనుషుల కర్తృత్వాన్ని, వారి కర్మలను, వాటి ఫలాలను సృష్టించడు. అది ప్రకృతి చేస్తుంది.",
    source: "Bhagavad Gita 5.14",
    slug: "dharma-beyond-rules",
  },
  {
    sanskrit: "ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः",
    transliteration: "Brahmaṇy ādhāya karmāṇi saṅgaṃ tyaktvā karoti yaḥ",
    meaning: "The one who acts — offering every action to the greater whole, without clinging — is not touched by the stain of that action. Like a lotus untouched by water.",
    meaning_te: "అన్ని కర్మలను బ్రహ్మకు అర్పించి, అనురాగం వదిలి చేసేవాడు — నీటిలో తామరలా పాపంచే అంటడు.",
    source: "Bhagavad Gita 5.10",
    slug: "krishna-detachment-action",
  },
  {
    sanskrit: "स्पर्शान्कृत्वा बहिर्बाह्यांश्चक्षुश्चैवान्तरे भ्रुवोः",
    transliteration: "Sparśān kṛtvā bahir bāhyāṃś cakṣuś caivāntare bhruvoḥ",
    meaning: "Keep the outer world outside. Focus the inner gaze at the point between the brows. Make the breath even. The one who lives this way — that is the one who is truly free.",
    meaning_te: "బాహ్య స్పర్శలను బయటే ఉంచు. దృష్టిని భ్రుకుటి మధ్యన నిలుపు. శ్వాసను సమం చేయి — ఇలా జీవించేవాడే నిజంగా స్వతంత్రుడు.",
    source: "Bhagavad Gita 5.27",
    slug: "bhagavad-gita-lessons-workplace-stress",
  },
  {
    sanskrit: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः",
    transliteration: "Yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanurdharaḥ",
    meaning: "Wherever there is the master of yoga — and wherever there is one who holds their bow with skill and purpose — there will be prosperity, victory, power, and wisdom.",
    meaning_te: "యోగేశ్వరుడైన కృష్ణుడు ఉన్నచోట, ధనుర్ధారియైన అర్జునుడు ఉన్నచోట — అక్కడ విజయం, సంపద, నీతి అన్నీ ఉంటాయి.",
    source: "Bhagavad Gita 18.78",
    slug: "arjuna-karna-the-real-rivalry",
  },
  {
    sanskrit: "अहिंसा सत्यमक्रोधस्त्यागः शान्तिरपैशुनम्",
    transliteration: "Ahiṃsā satyam akrodhas tyāgaḥ śāntir apaiśunam",
    meaning: "Non-harm. Truth. Freedom from anger. Generosity. Stillness. Refusing to speak ill of others. These are the marks of one who is moving toward the light.",
    meaning_te: "అహింస, సత్యం, కోపం లేకపోవడం, త్యాగం, శాంతి, పరుల దోషాలు చెప్పకపోవడం — ఇవి దైవీ సంపదకు చిహ్నాలు.",
    source: "Bhagavad Gita 16.2",
    slug: "dharma-beyond-rules",
  },
  {
    sanskrit: "दम्भो दर्पोऽभिमानश्च क्रोधः पारुष्यमेव च",
    transliteration: "Dambho darpo'bhimānaś ca krodhaḥ pāruṣyam eva ca",
    meaning: "Pretense. Arrogance. Conceit. Anger. Harshness. These are the signs of one moving toward darkness. Recognizing them in yourself is the beginning of honesty.",
    meaning_te: "డంభం, గర్వం, అహంకారం, కోపం, కఠినత్వం — ఇవి ఆసురీ సంపదకు చిహ్నాలు. వీటిని మనలో గుర్తించడమే నిజాయితీకి నాంది.",
    source: "Bhagavad Gita 16.4",
    slug: "mahabharata-lessons-on-anger",
  },
  {
    sanskrit: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः",
    transliteration: "Trividhaṃ narakasyedaṃ dvāraṃ nāśanam ātmanaḥ",
    meaning: "There are three doors to self-destruction: lust, anger, and greed. Abandon all three. They are the enemies waiting inside you.",
    meaning_te: "ఆత్మను నాశనం చేసే మూడు ద్వారాలు — కామం, క్రోధం, లోభం. ఈ మూడింటిని వదిలేయి. ఇవే మీ అంతశ్శత్రువులు.",
    source: "Bhagavad Gita 16.21",
    slug: "mahabharata-lessons-on-anger",
  },
  {
    sanskrit: "श्रद्धावान्लभते ज्ञानं तत्परः संयतेन्द्रियः",
    transliteration: "Śraddhāvāṃl labhate jñānaṃ tatparaḥ saṃyatendriyaḥ",
    meaning: "The one who has faith, who is dedicated to the truth, whose senses are under their command — that person finds wisdom. And having found it, reaches peace without delay.",
    meaning_te: "శ్రద్ధగలవాడు, జ్ఞానంపై ఆసక్తిగలవాడు, ఇంద్రియాలను అదుపులో పెట్టుకున్నవాడు — జ్ఞానాన్ని పొందుతాడు. జ్ఞానం పొందిన వెంటనే శాంతి వస్తుంది.",
    source: "Bhagavad Gita 4.39",
    slug: "bhagavad-gita-lessons-workplace-stress",
  },
  {
    sanskrit: "ज्ञानं ते‌ऽहं सविज्ञानमिदं वक्ष्याम्यशेषतः",
    transliteration: "Jñānaṃ te'haṃ savijñānam idaṃ vakṣyāmy aśeṣataḥ",
    meaning: "I will tell you, completely and without holding back, the knowledge joined with direct experience. Once you know this — nothing more will remain to be known.",
    meaning_te: "జ్ఞానాన్ని విజ్ఞానంతో సహా పూర్తిగా చెప్తాను. దీన్ని తెలుసుకున్న తర్వాత తెలుసుకోవలసినది మరేదీ ఉండదు.",
    source: "Bhagavad Gita 7.2",
    slug: "krishna-leadership-secrets",
  },
  {
    sanskrit: "इमं विवस्वते योगं प्रोक्तवानहमव्ययम्",
    transliteration: "Imaṃ vivasvate yogaṃ proktavān aham avyayam",
    meaning: "This teaching is ancient. I gave it first to the sun, who gave it to his son, and so it passed down through the ages. When it was lost, I came again to speak it.",
    meaning_te: "ఈ యోగాన్ని మొదట సూర్యునికి చెప్పాను. అతను మనువుకు, మనువు ఇక్ష్వాకుకు చెప్పారు. ఇలా కాలానుక్రమంలో వచ్చింది.",
    source: "Bhagavad Gita 4.1",
    slug: "krishna-leadership-secrets",
  },
  {
    sanskrit: "सक्ताः कर्मण्यविद्वांसो यथा कुर्वन्ति भारत",
    transliteration: "Saktāḥ karmaṇy avidvāṃso yathā kurvanti bhārata",
    meaning: "The uninformed act with attachment to the results of their action. The wise should act without that attachment — but with equal energy — for the sake of the world holding together.",
    meaning_te: "అజ్ఞానులు ఫలాసక్తితో కర్మ చేస్తారు. జ్ఞాని అదే శ్రద్ధతో, ఫలాసక్తి లేకుండా చేయాలి — లోకకళ్యాణం కోసం.",
    source: "Bhagavad Gita 3.25",
    slug: "krishna-detachment-action",
  },
  {
    sanskrit: "यज्ञशिष्टाशिनः सन्तो मुच्यन्ते सर्वकिल्बिषैः",
    transliteration: "Yajñaśiṣṭāśinaḥ santo mucyante sarvakilbiṣaiḥ",
    meaning: "Those who eat only what remains after their offering — they are freed of all wrong. Those who cook only for themselves eat wrongdoing.",
    meaning_te: "యజ్ఞం తర్వాత మిగిలినది తినేవారు పాపం నుండి విముక్తులవుతారు. కేవలం తమకోసమే వండుకునేవారు పాపమే తింటున్నారు.",
    source: "Bhagavad Gita 3.13",
    slug: "dharma-beyond-rules",
  },
  {
    sanskrit: "स्वभावजेन कौन्तेय निबद्धः स्वेन कर्मणा",
    transliteration: "Svabhāvajena kaunteya nibaddhaḥ svena karmaṇā",
    meaning: "Every person is bound by the actions that arise from their own nature. What you are drawn to do — that is where your work lies. You cannot escape yourself.",
    meaning_te: "ప్రతి మనిషీ తన స్వభావం నుండి పుట్టే కర్మకు కట్టుబడి ఉంటాడు. నీ స్వభావం నిన్ను పిలుస్తుంది — దాన్ని తప్పించుకోలేవు.",
    source: "Bhagavad Gita 18.60",
    slug: "dharma-beyond-rules",
  },
  {
    sanskrit: "कच्चिदेतच्छ्रुतं पार्थ त्वयैकाग्रेण चेतसा",
    transliteration: "Kaccid etac chrutaṃ pārtha tvayaikāgreṇa cetasā",
    meaning: "Has this been heard by you, Arjuna, with a focused mind? Has the confusion born of your grief and ignorance been dissolved?",
    meaning_te: "అర్జునా, ఇది ఏకాగ్రమైన మనసుతో విన్నావా? నీ మోహం నశించిందా?",
    source: "Bhagavad Gita 18.72",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "नष्टो मोहः स्मृतिर्लब्धा त्वत्प्रसादान्मयाच्युत",
    transliteration: "Naṣṭo mohaḥ smṛtir labdhā tvat prasādān mayācyuta",
    meaning: "My confusion is gone. My memory is restored. By your grace, I stand firm. My doubts have dissolved. I will act as you have said.",
    meaning_te: "నా మోహం నశించింది. జ్ఞాపకం తిరిగి వచ్చింది. నీ కృపతో స్థిరంగా నిలిచాను. నా సందేహాలు తొలగాయి. నీవు చెప్పినట్లే చేస్తాను.",
    source: "Bhagavad Gita 18.73",
    slug: "arjuna-confusion-moment-of-doubt",
  },
  {
    sanskrit: "मत्कर्मकृन्मत्परमो मद्भक्तः सङ्गवर्जितः",
    transliteration: "Matkarmakṛn matparamo madbhaktaḥ saṅgavarjitaḥ",
    meaning: "One who acts for me, who holds me as the highest, who is devoted without clinging, who is at peace with every being — that person comes to me.",
    meaning_te: "నా కోసం కర్మ చేసేవాడు, నన్నే పరమగతిగా భావించేవాడు, అనురాగం లేకుండా భక్తి చేసేవాడు — నా దగ్గరకు చేరుతాడు.",
    source: "Bhagavad Gita 11.55",
    slug: "krishna-detachment-action",
  },
  {
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते",
    transliteration: "Ananyāś cintayanto māṃ ye janāḥ paryupāsate",
    meaning: "Those who think of me without turning elsewhere — who keep me as their constant ground — I carry what they need and preserve what they already have.",
    meaning_te: "అనన్యభావంతో నన్ను ధ్యానించేవారికి — వారికి కావలసినది ఇస్తాను, ఉన్నది కాపాడతాను.",
    source: "Bhagavad Gita 9.22",
    slug: "krishna-detachment-action",
  },
  {
    sanskrit: "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति",
    transliteration: "Patraṃ puṣpaṃ phalaṃ toyaṃ yo me bhaktyā prayacchati",
    meaning: "A leaf, a flower, a fruit, water — whoever offers me even these small things with genuine devotion, I accept that offering completely.",
    meaning_te: "ఒక ఆకు, ఒక పువ్వు, ఒక పండు, నీళ్ళు — ఏదైనా భక్తితో అర్పించేవాడిది నేను స్వీకరిస్తాను.",
    source: "Bhagavad Gita 9.26",
    slug: "krishna-leadership-secrets",
  },
  {
    sanskrit: "मनुष्याणां सहस्रेषु कश्चिद्यतति सिद्धये",
    transliteration: "Manuṣyāṇāṃ sahasreṣu kaścid yatati siddhaye",
    meaning: "Among thousands of people, perhaps one strives for perfection. Among those who strive, perhaps one truly knows me. That one is rare beyond measure.",
    meaning_te: "వేలాది మనుషులలో ఒకరు సిద్ధికోసం ప్రయత్నిస్తారు. ప్రయత్నించేవారిలో ఒకరు నన్ను తెలుసుకుంటారు. అటువంటివారు చాలా అరుదు.",
    source: "Bhagavad Gita 7.3",
    slug: "krishna-leadership-secrets",
  },
  {
    sanskrit: "सर्वस्य चाहं हृदि सन्निविष्टो",
    transliteration: "Sarvasya cāhaṃ hṛdi sanniviṣṭo",
    meaning: "I am seated in the heart of every being. Memory, knowledge, and the removal of doubt — all of this comes from me.",
    meaning_te: "నేను అందరి హృదయంలో నిలిచి ఉన్నాను. జ్ఞాపకం, జ్ఞానం, సందేహాల నివారణ — అన్నీ నా నుండే వస్తాయి.",
    source: "Bhagavad Gita 15.15",
    slug: "krishna-leadership-secrets",
  },
  {
    sanskrit: "असक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः",
    transliteration: "Asakto hy ācaran karma param āpnoti pūruṣaḥ",
    meaning: "Acting without attachment — the person who does this achieves what is highest. Janaka and the great ones showed this was possible. Act, and do not turn away from the world.",
    meaning_te: "అనాసక్తితో కర్మ చేసే మనిషి పరమాన్ని పొందుతాడు. జనకుడు మొదలైన మహానుభావులు ఇదే చేశారు. కర్మ చేయి — లోకాన్ని వదలకు.",
    source: "Bhagavad Gita 3.19",
    slug: "krishna-detachment-action",
  },
  {
    sanskrit: "यं हि न व्यथयन्त्येते पुरुषं पुरुषर्षभ",
    transliteration: "Yaṃ hi na vyathayanty ete puruṣaṃ puruṣarṣabha",
    meaning: "The one who is not shaken by these — pleasure and pain, heat and cold, honor and dishonor — that person is ready. They are fit for what is undying.",
    meaning_te: "సుఖదుఃఖాలు, శీతోష్ణాలు, గౌరవాపమానాలు — వీటిచే కలవరపడనివాడు అమర్త్యతకు అర్హుడు.",
    source: "Bhagavad Gita 2.15",
    slug: "bhagavad-gita-lessons-workplace-stress",
  },
];

/* Pick a random sloka — used on first load and on refresh */
function getRandomSloka(exclude?: number): number {
  let idx = Math.floor(Math.random() * SLOKAS.length);
  if (exclude !== undefined && SLOKAS.length > 1) {
    while (idx === exclude) {
      idx = Math.floor(Math.random() * SLOKAS.length);
    }
  }
  return idx;
}

const DailyWisdom = () => {
  const { t } = useTranslation();
  const [currentIdx, setCurrentIdx] = useState<number>(() => {
    /* On first load use day-of-week so it feels consistent within a day */
    return new Date().getDay() % SLOKAS.length;
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setCurrentIdx(prev => getRandomSloka(prev));
      setRefreshing(false);
    }, 300);
  }, []);

  const sloka = SLOKAS[currentIdx];

  return (
    <section id="wisdom" className="section-padding">
      <div className="max-w-2xl mx-auto text-center">
        <div className="section-header">
          <span className="section-label">{t("home.shloka.eyebrow")}</span>
          <h2 className="section-title">{t("home.shloka.title")}</h2>
        </div>

        <div
          className="glass-card p-10 md:p-16 animate-pulse-glow relative"
          style={{
            opacity: refreshing ? 0.4 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
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
            className="text-foreground text-base md:text-lg leading-relaxed mb-4 italic"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {sloka.meaning}
          </p>

          {/* Telugu meaning */}
          <p
            className="text-foreground/75 text-base leading-relaxed mb-6"
            style={{ fontFamily: "'Noto Serif Telugu', serif", fontSize: "clamp(15px, 1.7vw, 17px)" }}
          >
            {sloka.meaning_te}
          </p>

          {/* Source */}
          <span className="text-primary/50 text-[11px] tracking-[0.25em] uppercase">
            — {sloka.source}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 text-primary text-[12px] tracking-[0.18em] uppercase font-heading hover:opacity-80 transition-opacity disabled:opacity-40"
            aria-label="Show a different sloka"
          >
            <RefreshCw
              size={13}
              className={refreshing ? "animate-spin" : ""}
            />
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
          {currentIdx + 1} of {SLOKAS.length} slokas
        </p>
      </div>
    </section>
  );
};

export default DailyWisdom;
