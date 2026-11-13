export interface QuizQuestion {
  id: string;
  tier: number; // 1..15
  category: "Aqaid & Seerah" | "Quran & Kanzul Iman" | "Lives of the Auliya" | "Hanafi Fiqh";
  question: string;
  options: [string, string, string, string];
  correctIdx: 0 | 1 | 2 | 3;
  isharaHint: string;
  communityPoll: [number, number, number, number];
  proofExplanation: string;
  proofLink: string;
  proofLinkLabel: string;
}

export const QUIZ_CATEGORIES: QuizQuestion["category"][] = [
  "Aqaid & Seerah",
  "Quran & Kanzul Iman",
  "Lives of the Auliya",
  "Hanafi Fiqh",
];

export const TIER_REWARDS = [
  100, 200, 300, 500, 1000, // Safe Tier 5
  2000, 4000, 8000, 16000, 32000, // Safe Tier 10
  64000, 125000, 250000, 500000, 1000000, // Safe Tier 15 (Sahib-e-Ilm)
];

export const SAFE_TIERS = [4, 9, 14]; // 0-indexed: Tiers 5, 10, 15

export const QUIZ_BANK: QuizQuestion[] = [
  // ---- TIER 1 ----
  {
    id: "q-1a",
    tier: 1,
    category: "Aqaid & Seerah",
    question: "How many daily Fard prayers are obligatory upon every adult Muslim?",
    options: ["Three", "Five", "Seven", "Four"],
    correctIdx: 1,
    isharaHint: "Gifted during the blessed night of Al-Isra wal-Mi'raj.",
    communityPoll: [2, 94, 1, 3],
    proofExplanation: "Five daily Fard prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) were prescribed on the Night of Mi'raj.",
    proofLink: "/prayer",
    proofLinkLabel: "View Hanafi Prayer Timings",
  },
  {
    id: "q-1b",
    tier: 1,
    category: "Aqaid & Seerah",
    question: "On which blessed Hijri date is Eid Milad-un-Nabi ﷺ celebrated?",
    options: ["10 Muharram", "12 Rabi' al-Awwal", "27 Rajab", "15 Sha'ban"],
    correctIdx: 1,
    isharaHint: "It falls in the third Islamic month, Rabi' al-Awwal.",
    communityPoll: [3, 92, 3, 2],
    proofExplanation: "The Holy Prophet Muhammad ﷺ was born in Makkah on Monday, 12 Rabi' al-Awwal.",
    proofLink: "/auliya",
    proofLinkLabel: "View Hijri Sacred Dates",
  },

  // ---- TIER 2 ----
  {
    id: "q-2a",
    tier: 2,
    category: "Quran & Kanzul Iman",
    question: "Who authored the renowned Sunni Urdu Quran translation 'Kanzul Iman'?",
    options: [
      "Imam Ahmad Raza Khan Barelvi",
      "Shaikh Abdul Qadir Jilani",
      "Khwaja Moinuddin Chishti",
      "Data Ganj Bakhsh",
    ],
    correctIdx: 0,
    isharaHint: "He is celebrated as Ala Hazrat, the Mujaddid of Bareilly Sharif.",
    communityPoll: [91, 4, 3, 2],
    proofExplanation: "Ala Hazrat Imam Ahmad Raza Khan Barelvi (رحمة الله عليه) completed Kanzul Iman in 1911 CE (1330 AH).",
    proofLink: "/quran",
    proofLinkLabel: "Read Kanzul Iman",
  },
  {
    id: "q-2b",
    tier: 2,
    category: "Quran & Kanzul Iman",
    question: "Which Surah is known as 'Umm al-Kitab' (The Mother of the Book) and recited in every Rak'ah?",
    options: ["Surah Al-Ikhlas", "Surah Al-Fatihah", "Surah Ya-Sin", "Surah Al-Baqarah"],
    correctIdx: 1,
    isharaHint: "It is the opening Surah of the Holy Quran with 7 verses.",
    communityPoll: [4, 91, 3, 2],
    proofExplanation: "Surah Al-Fatihah is called Umm al-Kitab and As-Sab' al-Mathani (The Seven Oft-Repeated Verses).",
    proofLink: "/quran",
    proofLinkLabel: "Open Kanzul Iman Reader",
  },

  // ---- TIER 3 ----
  {
    id: "q-3a",
    tier: 3,
    category: "Lives of the Auliya",
    question: "On which Hijri date is Bari Gyarhvi Sharif (Urs of Ghaus-e-Azam) commemorated?",
    options: ["6 Rajab", "25 Safar", "11 Rabi' al-Thani", "12 Rabi' al-Awwal"],
    correctIdx: 2,
    isharaHint: "The name 'Gyarhvi' literally refers to the 11th day.",
    communityPoll: [6, 3, 88, 3],
    proofExplanation: "Sayyiduna Shaykh Abdul Qadir Jilani (رضي الله عنه) passed away on 11 Rabi' al-Thani 561 AH in Baghdad.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Ghaus-e-Azam Profile",
  },
  {
    id: "q-3b",
    tier: 3,
    category: "Lives of the Auliya",
    question: "Which title is universally given to Sayyiduna Shaykh Abdul Qadir Jilani (رضي الله عنه)?",
    options: ["Gharib Nawaz", "Ghaus-e-Azam", "Data Ganj Bakhsh", "Ganj Shakar"],
    correctIdx: 1,
    isharaHint: "It means 'The Greatest Helper' in the Qadri Silsila.",
    communityPoll: [5, 89, 4, 2],
    proofExplanation: "Shaykh Abdul Qadir Jilani is honored as Ghaus-e-Azam and Muhiyyuddin (Reviver of the Faith).",
    proofLink: "/auliya",
    proofLinkLabel: "View Qadri Shajrah",
  },

  // ---- TIER 4 ----
  {
    id: "q-4a",
    tier: 4,
    category: "Hanafi Fiqh",
    question: "In Hanafi Fiqh, how many Fara'id (obligatory acts) are there in Wudu?",
    options: ["Three", "Four", "Six", "Seven"],
    correctIdx: 1,
    isharaHint: "Mentioned directly in Surah Al-Ma'idah 5:6 (face, arms, 1/4 head Masah, feet).",
    communityPoll: [8, 84, 6, 2],
    proofExplanation: "Bahar-e-Shariat Vol. 1 lists 4 Fara'id of Wudu: washing face, arms to elbows, 1/4 head Masah, and feet to ankles.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Bahar-e-Shariat Card",
  },
  {
    id: "q-4b",
    tier: 4,
    category: "Hanafi Fiqh",
    question: "How many Fara'id (obligatory acts) are there in Ghusl according to Hanafi Fiqh?",
    options: ["Two", "Three", "Five", "Four"],
    correctIdx: 1,
    isharaHint: "Rinsing the mouth, rinsing the nose to the soft bone, and washing the entire body.",
    communityPoll: [5, 85, 4, 6],
    proofExplanation: "Bahar-e-Shariat Vol. 1 specifies 3 Fara'id of Ghusl: Madmadah (mouth), Istinshaq (nose), and washing the whole body.",
    proofLink: "/fiqh",
    proofLinkLabel: "Review Hanafi Taharah",
  },

  // ---- TIER 5 (Safe Checkpoint 1) ----
  {
    id: "q-5a",
    tier: 5,
    category: "Lives of the Auliya",
    question: "Which city is the resting sanctuary of Sultan-ul-Hind Khwaja Moinuddin Chishti?",
    options: ["Lahore Sharif", "Ajmer Sharif", "Baghdad Sharif", "Sirhind Sharif"],
    correctIdx: 1,
    isharaHint: "Known as Chhati Sharif on 6 Rajab in Rajasthan, India.",
    communityPoll: [4, 92, 2, 2],
    proofExplanation: "Khwaja Gharib Nawaz (رحمة الله عليه) rests in Ajmer Sharif, where Chhati Sharif is observed on 6 Rajab.",
    proofLink: "/auliya",
    proofLinkLabel: "Visit Ajmer 360° Ziyarat",
  },
  {
    id: "q-5b",
    tier: 5,
    category: "Aqaid & Seerah",
    question: "Which blessed night is observed on 15 Sha'ban for seeking forgiveness and mercy?",
    options: ["Shab-e-Mi'raj", "Shab-e-Bara'at", "Shab-e-Qadr", "Laylat-ul-Ja'izah"],
    correctIdx: 1,
    isharaHint: "Literally 'The Night of Freedom/Salvation', two weeks before Ramadan.",
    communityPoll: [6, 87, 5, 2],
    proofExplanation: "Hadith in Ibn Majah and Tirmidhi highlight the immense mercy of Allah on the 15th night of Sha'ban (Shab-e-Bara'at).",
    proofLink: "/tasbih",
    proofLinkLabel: "Open Nightly Dhikr",
  },

  // ---- TIER 6 ----
  {
    id: "q-6a",
    tier: 6,
    category: "Hanafi Fiqh",
    question: "According to the Hanafi Madhhab, when does the Asr prayer window begin?",
    options: [
      "When shadow equals 1x object height (Mithl Awwal)",
      "When shadow equals 2x object height plus zenith shadow (Mithlayn)",
      "30 minutes after Dhuhr",
      "At solar zenith",
    ],
    correctIdx: 1,
    isharaHint: "Imam Abu Hanifa (رضي الله عنه) rules Mithlayn (twice the shadow).",
    communityPoll: [14, 81, 3, 2],
    proofExplanation: "Hanafi prayer engines lock to Madhab.Hanafi (Mithlayn) for Asr start time.",
    proofLink: "/prayer",
    proofLinkLabel: "Inspect Hanafi Asr Math",
  },
  {
    id: "q-6b",
    tier: 6,
    category: "Hanafi Fiqh",
    question: "In Hanafi Fiqh, what is the ruling on the 3 Rak'ahs of Witr prayer after Isha?",
    options: ["Nafl", "Sunnah Ghayr Mu'akkadah", "Wajib", "Fard Ayn"],
    correctIdx: 2,
    isharaHint: "Higher than Sunnah Mu'akkadah and obligatory to make up if missed.",
    communityPoll: [4, 9, 80, 7],
    proofExplanation: "Imam Abu Hanifa rules Witr (3 Rak'ahs with one Salam and Dua-e-Qunoot before Ruku in the 3rd) as Wajib.",
    proofLink: "/tasbih",
    proofLinkLabel: "Track Qaza-e-Umri (incl. Witr)",
  },

  // ---- TIER 7 ----
  {
    id: "q-7a",
    tier: 7,
    category: "Quran & Kanzul Iman",
    question: "How many Sajda-e-Tilawat verses are Wajib in the Holy Quran according to Hanafi Fiqh?",
    options: ["15", "14", "11", "12"],
    correctIdx: 1,
    isharaHint: "Surah Al-Hajj has only ONE Hanafi Sajda (22:18), excluding 22:77.",
    communityPoll: [18, 74, 5, 3],
    proofExplanation: "Hanafi fiqh affirms exactly 14 Sajda-e-Tilawat verses, including 84:21 and 96:19, excluding Shafi'i-only 22:77.",
    proofLink: "/quran",
    proofLinkLabel: "View 14 Hanafi Sajdas",
  },
  {
    id: "q-7b",
    tier: 7,
    category: "Quran & Kanzul Iman",
    question: "Which Surah in the Holy Quran contains two Bismillahs (one at the start, one in Ayah 30)?",
    options: ["Surah At-Tawbah", "Surah An-Naml", "Surah Al-Kahf", "Surah Ar-Rahman"],
    correctIdx: 1,
    isharaHint: "It appears in the letter of Prophet Sulayman (عليه السلام) to Bilqis.",
    communityPoll: [8, 79, 7, 6],
    proofExplanation: "Surah An-Naml (Chapter 27) begins with Bismillah and includes it again in Ayah 27:30, balancing Surah At-Tawbah.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Quran Reader",
  },

  // ---- TIER 8 ----
  {
    id: "q-8a",
    tier: 8,
    category: "Hanafi Fiqh",
    question: "What is the classical Hanafi Silver Nisab threshold in grams?",
    options: ["87.48 grams", "612.36 grams (52.5 tola)", "500 grams", "400 grams"],
    correctIdx: 1,
    isharaHint: "Hanafi Dhamm prioritizes Silver Nisab when mixed assets or cash are held.",
    communityPoll: [15, 78, 4, 3],
    proofExplanation: "52.5 tola of silver equals 612.36 grams; Gold Nisab is 7.5 tola (87.48g).",
    proofLink: "/zakat",
    proofLinkLabel: "Open Hanafi Zakat Calculator",
  },
  {
    id: "q-8b",
    tier: 8,
    category: "Hanafi Fiqh",
    question: "In Hanafi Fiqh, is Zakat due on personal gold and silver jewelry worn regularly by women?",
    options: [
      "No, never",
      "Yes, if it reaches Nisab (alone or combined with cash/silver)",
      "Only on silver, not gold",
      "Only once in a lifetime",
    ],
    correctIdx: 1,
    isharaHint: "Unlike the Shafi'i view, Hanafi Fiqh treats gold/silver bullion and jewelry alike.",
    communityPoll: [16, 76, 5, 3],
    proofExplanation: "In the Hanafi school, all owned gold and silver (worn or stored) is Zakatable when total wealth meets Nisab for a Hawl.",
    proofLink: "/zakat",
    proofLinkLabel: "Calculate Gold & Silver Zakat",
  },

  // ---- TIER 9 ----
  {
    id: "q-9a",
    tier: 9,
    category: "Lives of the Auliya",
    question: "Who authored 'Kashf al-Mahjub', the earliest comprehensive Persian manual on Sunni Tasawwuf?",
    options: [
      "Data Ganj Bakhsh Syed Ali Hujwiri",
      "Khwaja Banda Nawaz",
      "Mujaddid Alf Thani",
      "Imam Ghazali",
    ],
    correctIdx: 0,
    isharaHint: "His shrine is Data Darbar in Lahore Sharif.",
    communityPoll: [79, 6, 7, 8],
    proofExplanation: "Sayyid Ali Hujwiri (Data Ganj Bakhsh) authored Kashf al-Mahjub in Lahore in the 5th Hijri century.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Data Ganj Bakhsh Bio",
  },
  {
    id: "q-9b",
    tier: 9,
    category: "Lives of the Auliya",
    question: "Which great Sufi master of Pakpattan Sharif was the Pir-o-Murshid of Hazrat Nizamuddin Auliya?",
    options: [
      "Baba Fariduddin Ganj Shakar",
      "Khwaja Qutbuddin Bakhtiyar Kaki",
      "Shaykh Bahauddin Zakariya",
      "Makhdoom Sabir Kaliyari",
    ],
    correctIdx: 0,
    isharaHint: "His Urs is famously commemorated in Muharram (5 Muharram) at Bahishti Darwaza.",
    communityPoll: [77, 11, 6, 6],
    proofExplanation: "Hazrat Baba Fariduddin Mas'ud Ganj Shakar (رحمة الله عليه) was the Khalifa of Khwaja Bakhtiyar Kaki and Murshid of Mahbub-e-Ilahi.",
    proofLink: "/auliya",
    proofLinkLabel: "Trace Chishti Shajrah",
  },

  // ---- TIER 10 (Safe Checkpoint 2) ----
  {
    id: "q-10a",
    tier: 10,
    category: "Hanafi Fiqh",
    question: "Which scholar authored the 18-volume Hanafi encyclopedia 'Bahar-e-Shariat'?",
    options: [
      "Sadr-ush-Shariah Mufti Amjad Ali Aazmi",
      "Shaikh Ahmad Sirhindi",
      "Shah Waliullah Dehlawi",
      "Allama Taftazani",
    ],
    correctIdx: 0,
    isharaHint: "He was a premier Khalifa of Ala Hazrat Imam Ahmad Raza Khan.",
    communityPoll: [82, 7, 6, 5],
    proofExplanation: "Sadr-ush-Shariah Allama Mufti Amjad Ali Aazmi (رحمة الله عليه) compiled Bahar-e-Shariat under Ala Hazrat's guidance.",
    proofLink: "/fiqh",
    proofLinkLabel: "Browse Bahar-e-Shariat",
  },
  {
    id: "q-10b",
    tier: 10,
    category: "Aqaid & Seerah",
    question: "What is the Sunni Ahl-e-Sunnat belief regarding the Noble Companions (Sahabah-e-Kiram رضي الله عنهم)?",
    options: [
      "All Sahabah are trustworthy (Udool) and worthy of love and respect",
      "Only the 4 Caliphs are respected",
      "Only Muhajirun are honored",
      "Their status is debated",
    ],
    correctIdx: 0,
    isharaHint: "Quran 9:100 & 48:29 praise both Muhajirun and Ansar with Allah's pleasure.",
    communityPoll: [89, 5, 3, 3],
    proofExplanation: "Ahl-e-Sunnat wal Jama'at holds every Sahabi in deep reverence, led by the Khulafa-e-Rashideen in order of virtue.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Aqaid Reference",
  },

  // ---- TIER 11 ----
  {
    id: "q-11a",
    tier: 11,
    category: "Aqaid & Seerah",
    question: "Which Surah is recommended by Hadith to be recited every night for protection in the grave?",
    options: ["Surah Al-Waqiah", "Surah Al-Mulk", "Surah Al-Kahf", "Surah Al-Muzzammil"],
    correctIdx: 1,
    isharaHint: "It has 30 verses and begins with 'Tabarakallazi Biyadihil-Mulk'.",
    communityPoll: [10, 81, 6, 3],
    proofExplanation: "Jami' at-Tirmidhi (#2891) records that Surah Al-Mulk intercedes for its reciter until forgiven.",
    proofLink: "/quran",
    proofLinkLabel: "Open Surah Al-Mulk Player",
  },
  {
    id: "q-11b",
    tier: 11,
    category: "Quran & Kanzul Iman",
    question: "Which Surah is Sunnah to recite on Fridays for spiritual light between two Jumu'ahs?",
    options: ["Surah Al-Kahf", "Surah Al-Hashr", "Surah As-Sajdah", "Surah Qaf"],
    correctIdx: 0,
    isharaHint: "It contains the story of the Sleepers of the Cave and Prophet Musa & Khidr.",
    communityPoll: [86, 5, 6, 3],
    proofExplanation: "Mustadrak al-Hakim & Sunan al-Bayhaqi record that reciting Surah Al-Kahf on Friday illuminates the believer until the next Friday.",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Al-Kahf",
  },

  // ---- TIER 12 ----
  {
    id: "q-12a",
    tier: 12,
    category: "Hanafi Fiqh",
    question: "In Hanafi Fiqh, what is 'Dahwa-e-Kubra'?",
    options: [
      "The midpoint between Subh Sadiq (Fajr) and Sunset",
      "Solar noon (Zawal)",
      "Time of Ishraq",
      "Last third of the night",
    ],
    correctIdx: 0,
    isharaHint: "It is the Hanafi deadline for making a Nafl or Ramadan Niyyah during the day.",
    communityPoll: [68, 22, 6, 4],
    proofExplanation: "Dahwa-e-Kubra is half of the Shar'i day (Subh Sadiq to Sunset), before which daytime fasting Niyyah is valid.",
    proofLink: "/prayer",
    proofLinkLabel: "See Dahwa-e-Kubra Today",
  },
  {
    id: "q-12b",
    tier: 12,
    category: "Hanafi Fiqh",
    question: "Which three times of the day are 'Makruh Tahrimi' for offering Salah or Sajda-e-Tilawat?",
    options: [
      "Sunrise (+20m), Istiwa/Zawal, and Sunset (-20m)",
      "After Fajr until Dhuhr",
      "Between Dhuhr and Asr",
      "After Isha until Tahajjud",
    ],
    correctIdx: 0,
    isharaHint: "Recorded in Sahih Muslim from Uqbah ibn Amir (رضي الله عنه).",
    communityPoll: [83, 7, 5, 5],
    proofExplanation: "Salah and Sajda-e-Tilawat are Makruh Tahrimi for ~20m after sunrise, during midday Istiwa, and ~20m before sunset (except that day's Asr).",
    proofLink: "/prayer",
    proofLinkLabel: "View Live Makruh Windows",
  },

  // ---- TIER 13 ----
  {
    id: "q-13a",
    tier: 13,
    category: "Lives of the Auliya",
    question: "Which Chishti master of Gulbarga Sharif authored 'Jawami' al-Kalim' and pioneered Dakhni prose?",
    options: [
      "Khwaja Banda Nawaz Gesu Daraz",
      "Baba Farid Ganj Shakar",
      "Khwaja Qutbuddin Bakhtiyar Kaki",
      "Makhdoom Ashraf Jahangir Simnani",
    ],
    correctIdx: 0,
    isharaHint: "His Urs is held 15–17 Dhu al-Qi'dah in Gulbarga.",
    communityPoll: [76, 8, 9, 7],
    proofExplanation: "Khwaja Banda Nawaz Gesu Daraz (رحمة الله عليه) illuminated the Deccan from Gulbarga Sharif.",
    proofLink: "/auliya",
    proofLinkLabel: "View Banda Nawaz Profile",
  },
  {
    id: "q-13b",
    tier: 13,
    category: "Lives of the Auliya",
    question: "Who is celebrated as 'Mujaddid Alf Thani' (Renewer of the Second Millennium) in the Naqshbandi Silsila?",
    options: [
      "Imam Ahmad Raza Khan",
      "Shaykh Ahmad Sirhindi",
      "Shah Abdul Aziz",
      "Makhdoom Ali Mahimi",
    ],
    correctIdx: 1,
    isharaHint: "He authored 'Maktubat-e-Imam Rabbani' and rests in Sirhind Sharif.",
    communityPoll: [14, 78, 5, 3],
    proofExplanation: "Hazrat Shaykh Ahmad Faruqi Sirhindi (رحمة الله عليه) revived orthodoxy in the 11th Hijri century through his Maktubat.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Auliya Directory",
  },

  // ---- TIER 14 ----
  {
    id: "q-14a",
    tier: 14,
    category: "Quran & Kanzul Iman",
    question: "Who authored 'Khazain-ul-Irfan', the classic Sunni Tafsir margin accompanying Kanzul Iman?",
    options: [
      "Sadr-ul-Afadil Allama Naeemuddin Muradabadi",
      "Mufti Ahmad Yar Khan Naeemi",
      "Allama Ghulam Rasool Saeedi",
      "Pir Karam Shah al-Azhari",
    ],
    correctIdx: 0,
    isharaHint: "He founded Jamia Naeemia Muradabad.",
    communityPoll: [74, 14, 7, 5],
    proofExplanation: "Allama Syed Naeemuddin Muradabadi (رحمة الله عليه) authored Khazain-ul-Irfan as a concise Tafsir to Kanzul Iman.",
    proofLink: "/quran",
    proofLinkLabel: "Open Khazain-ul-Irfan Drawer",
  },
  {
    id: "q-14b",
    tier: 14,
    category: "Quran & Kanzul Iman",
    question: "Who authored the famous 11-volume Sunni commentary 'Tafsir Noor-ul-Irfan' & 'Tafsir Naeemi'?",
    options: [
      "Hakim-ul-Ummat Mufti Ahmad Yar Khan Naeemi",
      "Allama Abdul Mustafa Azami",
      "Mufti Jalaluddin Amjadi",
      "Allama Arshad-ul-Qadri",
    ],
    correctIdx: 0,
    isharaHint: "His resting place is in Gujrat, Pakistan, and he also wrote Mir'at-ul-Manajih on Mishkat.",
    communityPoll: [77, 10, 7, 6],
    proofExplanation: "Mufti Ahmad Yar Khan Naeemi (رحمة الله عليه) authored Noor-ul-Irfan (concise) and Tafsir Naeemi (detailed) on Kanzul Iman.",
    proofLink: "/quran",
    proofLinkLabel: "Open Kanzul Iman & Tafsir",
  },

  // ---- TIER 15 (Grand Crown) ----
  {
    id: "q-15a",
    tier: 15,
    category: "Hanafi Fiqh",
    question: "In Hanafi Fiqh, how are descendants of Banu Hashim (Sadat) honored financially instead of receiving Zakat?",
    options: [
      "With Hadiya (honorable gift) & Nafl Sadaqah",
      "With Zakat al-Fitr only",
      "With Kaffarah only",
      "With half Zakat",
    ],
    correctIdx: 0,
    isharaHint: "Zakat is the 'impurity of people's wealth' and is not permissible for the Noble Household.",
    communityPoll: [85, 8, 4, 3],
    proofExplanation: "Bahar-e-Shariat confirms Zakat cannot be given to Banu Hashim (Sadat); they are honored with Hadiya gifts.",
    proofLink: "/zakat",
    proofLinkLabel: "Review Masarif al-Zakat",
  },
  {
    id: "q-15b",
    tier: 15,
    category: "Aqaid & Seerah",
    question: "Which monumental 30-volume Hanafi fatwa encyclopedia was authored by Ala Hazrat Imam Ahmad Raza Khan?",
    options: [
      "Fatawa-e-Alamgiri",
      "Fatawa-e-Razawiyya (Al-Ataya al-Nabawiyya fil-Fatawa al-Razawiyya)",
      "Radd al-Muhtar (Shami)",
      "Al-Hidayah",
    ],
    correctIdx: 1,
    isharaHint: "It is named after his own blessed name, Raza.",
    communityPoll: [8, 86, 4, 2],
    proofExplanation: "Fatawa-e-Razawiyya spans 30 volumes and over 21,000 pages of deep Hanafi jurisprudence, astronomy, and Tafsir.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Hanafi Fiqh Studio",
  },
];

export interface FastestFingerChallenge {
  id: string;
  prompt: string;
  items: string[]; // scrambled display order
  correctOrder: number[]; // indices into items in exact sequence
  explanation: string;
}

export const FASTEST_FINGER_BANK: FastestFingerChallenge[] = [
  {
    id: "ff-1",
    prompt: "Arrange the Four Rightly-Guided Caliphs (Khulafa-e-Rashideen رضي الله عنهم) in chronological order of their Khilafah:",
    items: [
      "Sayyiduna Ali ibn Abi Talib",
      "Sayyiduna Abu Bakr as-Siddiq",
      "Sayyiduna Uthman ibn Affan",
      "Sayyiduna Umar ibn al-Khattab",
    ],
    correctOrder: [1, 3, 2, 0],
    explanation: "The Khulafa-e-Rashideen followed in order: Abu Bakr (11–13 AH), Umar (13–23 AH), Uthman (23–35 AH), and Ali (35–40 AH).",
  },
  {
    id: "ff-2",
    prompt: "Arrange the 4 Fara'id of Wudu (Surah Al-Ma'idah 5:6) in their standard sequence:",
    items: [
      "Washing both feet including ankles",
      "Washing both arms including elbows",
      "Washing the face",
      "Masah of 1/4th of the head",
    ],
    correctOrder: [2, 1, 3, 0],
    explanation: "Quran 5:6 lists the sequence: wash the face, wash the arms to the elbows, wipe (Masah) the head, and wash the feet to the ankles.",
  },
  {
    id: "ff-3",
    prompt: "Arrange these 4 Sacred Hijri Months / Dates in calendar order from Muharram onwards:",
    items: [
      "Laylat-ul-Qadr (Ramadan)",
      "Eid Milad-un-Nabi ﷺ (Rabi' al-Awwal)",
      "Yawm-e-Ashura (Muharram)",
      "Shab-e-Mi'raj (Rajab)",
    ],
    correctOrder: [2, 1, 3, 0],
    explanation: "Muharram (1st month) → Rabi' al-Awwal (3rd) → Rajab (7th) → Ramadan (9th).",
  },
];
