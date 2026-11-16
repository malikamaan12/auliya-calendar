export type DuaActionCategory =
  | "Waking & Sleeping"
  | "Home & Travel"
  | "Wudu & Masjid"
  | "Food & Sustenance"
  | "Protection & Relief"
  | "Forgiveness & Parents"
  | "Knowledge & Success"
  | "Morning & Evening";

export type SuggestedWaqtTag =
  | "fajr"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha"
  | "tahajjud"
  | "jumuah"
  | "anytime";

export interface DuaWordChip {
  arabic: string;
  translit: string;
  meaning: string;
}

export interface DuaEntry {
  id: string;
  title: string;
  actionTrigger: string;
  actionCategory: DuaActionCategory;
  suggestedWaqt: SuggestedWaqtTag[];
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  virtue: string;
  recommendedCount: number;
  wordBreakdown: DuaWordChip[];
}

export interface CustomChecklistItem {
  id: string;
  label: string;
  subtitle: string;
  category: "Morning" | "Salah" | "Evening" | "Sunnah";
  isCustom?: boolean;
}

export interface SavedTasbihSession {
  id: string;
  litanyId: string;
  litanyName: string;
  arabic: string;
  count: number;
  target: number;
  note: string;
  savedAtIso: string;
}

export interface DhikrReminderConfig {
  id: string;
  label: string;
  litanyId: string;
  time24h: string; // e.g. "06:30" or "21:30"
  enabled: boolean;
  lastTriggeredDate?: string;
}

export const DUA_ACTION_CATEGORIES: DuaActionCategory[] = [
  "Waking & Sleeping",
  "Home & Travel",
  "Wudu & Masjid",
  "Food & Sustenance",
  "Protection & Relief",
  "Forgiveness & Parents",
  "Knowledge & Success",
  "Morning & Evening",
];

export const DEFAULT_CHECKLIST_ITEMS: CustomChecklistItem[] = [
  {
    id: "miswak",
    label: "Miswak before Wudu & Salah",
    subtitle: "Multiplies prayer reward 70x in Sunni Hadith",
    category: "Salah",
  },
  {
    id: "morning_adhkar",
    label: "Morning Adhkar & Sayyidul Istighfar after Fajr",
    subtitle: "Divine protection from dawn until evening",
    category: "Morning",
  },
  {
    id: "ishraq",
    label: "Salat al-Ishraq / Duha (2–4 Rak'at)",
    subtitle: "20 minutes after sunrise until pre-Zawal",
    category: "Morning",
  },
  {
    id: "tasbih_fatima",
    label: "Tasbih-e-Fatima (33x SubhanAllah, 33x Alhamdulillah, 34x Allahu Akbar)",
    subtitle: "After every Fard Salah & before sleep",
    category: "Salah",
  },
  {
    id: "evening_durood",
    label: "100x Durood-e-Pak (Salawat upon the Prophet ﷺ)",
    subtitle: "Especially blessed after Asr & on Jumu'ah",
    category: "Evening",
  },
  {
    id: "surah_mulk",
    label: "Recite Surah Al-Mulk before Sleep",
    subtitle: "Intercedes & protects in the grave (Tirmidhi #2891)",
    category: "Evening",
  },
  {
    id: "tahajjud",
    label: "Tahajjud Prayer in the Last Third of Night",
    subtitle: "2 to 8 Rak'at Nafl before Subh Sadiq",
    category: "Sunnah",
  },
];

export const DAILY_DUAS_LIBRARY: DuaEntry[] = [
  {
    id: "dua-sayyidul-istighfar",
    title: "Sayyidul Istighfar (Chief of Prayers for Forgiveness)",
    actionTrigger: "Morning & Evening Forgiveness",
    actionCategory: "Morning & Evening",
    suggestedWaqt: ["fajr", "asr", "maghrib"],
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration:
      "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u laka bidhanbi faghfir li, fa innahu la yaghfirudh-dhunuba illa Anta.",
    translation:
      "O Allah, You are my Lord, there is none worthy of worship except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I confess my sin, so forgive me—for verily none forgives sins except You.",
    reference: "Sahih al-Bukhari #6306",
    virtue:
      "Whoever recites this with conviction in the morning and passes away before evening enters Paradise; and whoever recites it in the evening with conviction and passes away before morning enters Paradise.",
    recommendedCount: 3,
    wordBreakdown: [
      { arabic: "أَنْتَ رَبِّي", translit: "Anta Rabbi", meaning: "You are my Lord" },
      { arabic: "خَلَقْتَنِي", translit: "Khalaqtani", meaning: "You created me" },
      { arabic: "وَأَنَا عَبْدُكَ", translit: "Wa ana 'abduka", meaning: "And I am Your servant" },
      { arabic: "أَبُوءُ لَكَ بِنِعْمَتِكَ", translit: "Abu'u laka bini'matika", meaning: "I acknowledge Your grace" },
      { arabic: "فَاغْفِرْ لِي", translit: "Faghfir li", meaning: "So forgive me" },
    ],
  },
  {
    id: "dua-waking-up",
    title: "Dua Upon Waking Up from Sleep",
    actionTrigger: "When Waking Up",
    actionCategory: "Waking & Sleeping",
    suggestedWaqt: ["fajr", "tahajjud"],
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration:
      "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    translation:
      "All praise belongs to Allah Who gave us life after having taken it from us (in sleep), and unto Him is the resurrection.",
    reference: "Sahih al-Bukhari #6312",
    virtue: "Begins the believer's day with gratitude and remembrance of the Hereafter.",
    recommendedCount: 1,
    wordBreakdown: [
      { arabic: "الْحَمْدُ لِلَّهِ", translit: "Alhamdulillah", meaning: "All praise is for Allah" },
      { arabic: "أَحْيَانَا", translit: "Ahyana", meaning: "Who gave us life" },
      { arabic: "بَعْدَ مَا أَمَاتَنَا", translit: "Ba'da ma amatana", meaning: "After causing us to sleep" },
      { arabic: "وَإِلَيْهِ النُّشُورُ", translit: "Wa ilayhin-nushur", meaning: "And to Him is resurrection" },
    ],
  },
  {
    id: "dua-before-sleep",
    title: "Dua Before Sleeping at Night",
    actionTrigger: "Before Sleeping",
    actionCategory: "Waking & Sleeping",
    suggestedWaqt: ["isha"],
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya.",
    translation: "In Your Name, O Allah, I die (enter sleep) and I live (wake).",
    reference: "Sahih al-Bukhari #6324",
    virtue: "Entrusts the soul to Allah's care throughout the night.",
    recommendedCount: 3,
    wordBreakdown: [
      { arabic: "بِاسْمِكَ", translit: "Bismika", meaning: "In Your Name" },
      { arabic: "اللَّهُمَّ", translit: "Allahumma", meaning: "O Allah" },
      { arabic: "أَمُوتُ", translit: "Amutu", meaning: "I die (sleep)" },
      { arabic: "وَأَحْيَا", translit: "Wa ahya", meaning: "And I live" },
    ],
  },
  {
    id: "dua-leaving-home",
    title: "Dua When Stepping Out of the Home",
    actionTrigger: "Leaving Home",
    actionCategory: "Home & Travel",
    suggestedWaqt: ["fajr", "dhuhr", "anytime"],
    arabic:
      "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration:
      "Bismillahi, tawakkaltu 'alallahi, wa la hawla wa la quwwata illa billah.",
    translation:
      "In the Name of Allah; I place my trust in Allah, and there is no power and no strength except through Allah.",
    reference: "Sunan Abu Dawud #5095, Jami' at-Tirmidhi #3426",
    virtue:
      "The angels proclaim: 'You are guided, sufficed, and protected,' and Satan steps aside from your path.",
    recommendedCount: 3,
    wordBreakdown: [
      { arabic: "بِسْمِ اللَّهِ", translit: "Bismillahi", meaning: "In the Name of Allah" },
      { arabic: "تَوَكَّلْتُ عَلَى اللَّهِ", translit: "Tawakkaltu 'alallah", meaning: "I trust in Allah" },
      { arabic: "لَا حَوْلَ وَلَا قُوَّةَ", translit: "La hawla wa la quwwata", meaning: "No power nor might" },
      { arabic: "إِلَّا بِاللَّهِ", translit: "Illa billah", meaning: "Except with Allah" },
    ],
  },
  {
    id: "dua-entering-home",
    title: "Dua When Entering the Home",
    actionTrigger: "Entering Home",
    actionCategory: "Home & Travel",
    suggestedWaqt: ["asr", "maghrib", "isha", "anytime"],
    arabic:
      "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration:
      "Bismillahi walajna, wa bismillahi kharajna, wa 'alallahi Rabbina tawakkalna.",
    translation:
      "In the Name of Allah we enter, in the Name of Allah we leave, and upon Allah our Lord we rely.",
    reference: "Sunan Abu Dawud #5096",
    virtue: "Brings barakah into the household and prevents Shaytan from lodging within the home.",
    recommendedCount: 1,
    wordBreakdown: [
      { arabic: "وَلَجْنَا", translit: "Walajna", meaning: "We enter" },
      { arabic: "خَرَجْنَا", translit: "Kharajna", meaning: "We exit" },
      { arabic: "رَبِّنَا", translit: "Rabbina", meaning: "Our Lord" },
      { arabic: "تَوَكَّلْنَا", translit: "Tawakkalna", meaning: "We place our trust" },
    ],
  },
  {
    id: "dua-entering-masjid",
    title: "Dua When Entering & Leaving the Masjid",
    actionTrigger: "Entering the Masjid",
    actionCategory: "Wudu & Masjid",
    suggestedWaqt: ["fajr", "dhuhr", "asr", "maghrib", "isha", "jumuah"],
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahumma-ftah li abwaba rahmatik.",
    translation: "O Allah, open for me the gates of Your Mercy.",
    reference: "Sahih Muslim #713",
    virtue: "Step in with the right foot after sending Salawat upon the Prophet ﷺ.",
    recommendedCount: 3,
    wordBreakdown: [
      { arabic: "اللَّهُمَّ", translit: "Allahumma", meaning: "O Allah" },
      { arabic: "افْتَحْ لِي", translit: "Iftah li", meaning: "Open for me" },
      { arabic: "أَبْوَابَ", translit: "Abwaba", meaning: "The doors/gates" },
      { arabic: "رَحْمَتِكَ", translit: "Rahmatik", meaning: "Of Your Mercy" },
    ],
  },
  {
    id: "dua-after-wudu",
    title: "Dua Immediately After Completing Wudu",
    actionTrigger: "Completing Wudu",
    actionCategory: "Wudu & Masjid",
    suggestedWaqt: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
    arabic:
      "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    transliteration:
      "Ashhadu an la ilaha illallahu wahdahu la sharika lahu wa ashhadu anna Muhammadan 'abduhu wa Rasuluh. Allahummaj'alni minat-tawwabina waj'alni minal-mutatahhirin.",
    translation:
      "I bear witness that none is worthy of worship except Allah alone, without partner, and I bear witness that Muhammad ﷺ is His servant and Messenger. O Allah, make me among the oft-repentant and make me among those who purify themselves.",
    reference: "Sahih Muslim #234, Jami' at-Tirmidhi #55",
    virtue: "All eight gates of Paradise are opened for the one who recites this after Wudu.",
    recommendedCount: 1,
    wordBreakdown: [
      { arabic: "أَشْهَدُ", translit: "Ashhadu", meaning: "I testify" },
      { arabic: "اجْعَلْنِي", translit: "Ij'alni", meaning: "Make me" },
      { arabic: "التَّوَّابِينَ", translit: "At-Tawwabin", meaning: "Those who repent often" },
      { arabic: "الْمُتَطَهِّرِينَ", translit: "Al-Mutatahhirin", meaning: "Those who keep pure" },
    ],
  },
  {
    id: "dua-after-eating",
    title: "Dua After Finishing Food or Drink",
    actionTrigger: "After Finishing a Meal",
    actionCategory: "Food & Sustenance",
    suggestedWaqt: ["dhuhr", "maghrib", "isha", "anytime"],
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration:
      "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.",
    translation:
      "All praise is due to Allah Who fed me this and provided it for me without any power or strength on my part.",
    reference: "Jami' at-Tirmidhi #3458, Sunan Abu Dawud #4023",
    virtue: "Whoever recites this after eating has their previous minor sins forgiven.",
    recommendedCount: 1,
    wordBreakdown: [
      { arabic: "أَطْعَمَنِي هَذَا", translit: "At'amani hadha", meaning: "Fed me this meal" },
      { arabic: "وَرَزَقَنِيهِ", translit: "Wa razaqanihi", meaning: "And provided it to me" },
      { arabic: "مِنْ غَيْرِ حَوْلٍ مِنِّي", translit: "Min ghayri hawlin minni", meaning: "Without power from me" },
    ],
  },
  {
    id: "dua-rizq-debt",
    title: "Prophetic Dua for Halal Sustenance (Rizq) & Freedom from Debt",
    actionTrigger: "Seeking Rizq & Paying Debt",
    actionCategory: "Food & Sustenance",
    suggestedWaqt: ["fajr", "dhuhr", "jumuah", "anytime"],
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    transliteration:
      "Allahummak-fini bihalalika 'an haramika, wa aghnini bifadlika 'amman siwak.",
    translation:
      "O Allah, suffice me with what You have made lawful so that I have no need of what You have made unlawful, and make me independent by Your bounty of all those besides You.",
    reference: "Jami' at-Tirmidhi #3563 (Taught by Sayyiduna Ali رضي الله عنه)",
    virtue:
      "Even if a believer carries a debt as heavy as Mount Sabir, Allah will help settle it through this supplication.",
    recommendedCount: 7,
    wordBreakdown: [
      { arabic: "اكْفِنِي", translit: "Ikfini", meaning: "Suffice me" },
      { arabic: "بِحَلَالِكَ", translit: "Bihalalika", meaning: "With Your lawful provision" },
      { arabic: "وَأَغْنِنِي", translit: "Wa aghnini", meaning: "And enrich me" },
      { arabic: "بِفَضْلِكَ", translit: "Bifadlika", meaning: "By Your grace" },
    ],
  },
  {
    id: "dua-anxiety-distress",
    title: "Dua for Relief from Anxiety, Grief & Hardship (Ayat-e-Karima & Prophetic Refuge)",
    actionTrigger: "During Anxiety, Grief & Stress",
    actionCategory: "Protection & Relief",
    suggestedWaqt: ["asr", "maghrib", "tahajjud", "anytime"],
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration:
      "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.",
    translation:
      "O Allah, I seek refuge in You from anxiety and sorrow, from weakness and laziness, from miserliness and cowardice, and from the burden of debt and being overpowered by men.",
    reference: "Sahih al-Bukhari #6369",
    virtue: "The Messenger of Allah ﷺ recited this frequently to uplift the heart and remove heaviness.",
    recommendedCount: 7,
    wordBreakdown: [
      { arabic: "الْهَمِّ وَالْحَزَنِ", translit: "Al-hammi wal-hazan", meaning: "Worry and grief" },
      { arabic: "الْعَجْزِ وَالْكَسَلِ", translit: "Al-'ajzi wal-kasal", meaning: "Helplessness and laziness" },
      { arabic: "ضَلَعِ الدَّيْنِ", translit: "Dala'id-dayn", meaning: "Crushing burden of debt" },
    ],
  },
  {
    id: "dua-protection-harm",
    title: "Morning & Evening Shield Against All Sudden Harm",
    actionTrigger: "Morning & Evening Protection",
    actionCategory: "Protection & Relief",
    suggestedWaqt: ["fajr", "maghrib"],
    arabic:
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
    translation:
      "In the Name of Allah, with Whose Name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.",
    reference: "Sunan Abu Dawud #5088, Jami' at-Tirmidhi #3388",
    virtue: "Reciting 3 times every morning and evening protects from sudden calamity.",
    recommendedCount: 3,
    wordBreakdown: [
      { arabic: "لَا يَضُرُّ", translit: "La yadurru", meaning: "Nothing can harm" },
      { arabic: "مَعَ اسْمِهِ", translit: "Ma'asmihi", meaning: "With His Name" },
      { arabic: "فِي الْأَرْضِ وَلَا فِي السَّمَاءِ", translit: "Fil-ardi wa la fis-sama'", meaning: "On earth nor in heaven" },
      { arabic: "السَّمِيعُ الْعَلِيمُ", translit: "As-Sami'ul-'Alim", meaning: "The All-Hearing, All-Knowing" },
    ],
  },
  {
    id: "dua-knowledge-study",
    title: "Quranic & Prophetic Dua for Beneficial Knowledge, Memory & Clarity",
    actionTrigger: "Before Studying, Work or Speaking",
    actionCategory: "Knowledge & Success",
    suggestedWaqt: ["fajr", "dhuhr", "anytime"],
    arabic:
      "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي • رَبِّ زِدْنِي عِلْمًا",
    transliteration:
      "Rabbish-rah li sadri wa yassir li amri wahlul 'uqdatan min lisani yafqahu qawli. Rabbi zidni 'ilma.",
    translation:
      "My Lord, expand for me my breast, ease for me my task, and untie the knot from my tongue that they may understand my speech. My Lord, increase me in knowledge.",
    reference: "Surah Ta-Ha 20:25–28 & 20:114",
    virtue: "Grants composure, sharp comprehension, and barakah in sacred and worldly study.",
    recommendedCount: 7,
    wordBreakdown: [
      { arabic: "اشْرَحْ لِي صَدْرِي", translit: "Ishrah li sadri", meaning: "Expand my chest/heart" },
      { arabic: "وَيَسِّرْ لِي أَمْرِي", translit: "Wa yassir li amri", meaning: "And make my task easy" },
      { arabic: "رَبِّ زِدْنِي عِلْمًا", translit: "Rabbi zidni 'ilma", meaning: "My Lord, increase me in knowledge" },
    ],
  },
  {
    id: "dua-parents-mercy",
    title: "Quranic Dua for Parents & Believing Family",
    actionTrigger: "Praying for Parents & Family",
    actionCategory: "Forgiveness & Parents",
    suggestedWaqt: ["fajr", "dhuhr", "asr", "maghrib", "isha", "tahajjud", "jumuah"],
    arabic:
      "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا • رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    transliteration:
      "Rabbir-hamhuma kama rabbayani saghira. Rabbanagh-fir li wa liwalidayya wa lil-mu'minina yawma yaqumul-hisab.",
    translation:
      "My Lord, have mercy upon them both as they brought me up when I was small. Our Lord, forgive me, my parents, and the believers on the Day the Reckoning is established.",
    reference: "Surah Al-Isra 17:24 & Surah Ibrahim 14:41",
    virtue: "Continues elevating the ranks of one's parents perpetually as Sadaqah Jariyah.",
    recommendedCount: 3,
    wordBreakdown: [
      { arabic: "ارْحَمْهُمَا", translit: "Irhamhuma", meaning: "Have mercy on them both" },
      { arabic: "كَمَا رَبَّيَانِي", translit: "Kama rabbayani", meaning: "As they nurtured me" },
      { arabic: "صَغِيرًا", translit: "Saghira", meaning: "When I was young" },
      { arabic: "وَلِوَالِدَيَّ", translit: "Wa liwalidayya", meaning: "And for my parents" },
    ],
  },
  {
    id: "dua-travel-journey",
    title: "Dua When Boarding a Vehicle or Starting a Journey",
    actionTrigger: "Boarding a Vehicle / Travel",
    actionCategory: "Home & Travel",
    suggestedWaqt: ["anytime"],
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration:
      "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinina wa inna ila Rabbina lamunqalibun.",
    translation:
      "Glory be to Him Who has subjected this to us, and we could never have subdued it by our own efforts; and surely to our Lord we shall return.",
    reference: "Surah Az-Zukhruf 43:13–14, Sahih Muslim #1342",
    virtue: "Protects travelers across land, sea, and air until they return safely.",
    recommendedCount: 1,
    wordBreakdown: [
      { arabic: "سَخَّرَ لَنَا هَذَا", translit: "Sakhkhara lana hadha", meaning: "Subjected this transport to us" },
      { arabic: "مُقْرِنِينَ", translit: "Muqrinin", meaning: "Capable of controlling it alone" },
      { arabic: "لَمُنْقَلِبُونَ", translit: "Lamunqalibun", meaning: "Surely returning to our Lord" },
    ],
  },
];
