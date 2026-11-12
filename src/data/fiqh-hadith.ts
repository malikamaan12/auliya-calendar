export interface FiqhMasalah {
  id: string;
  category: "Wudu & Ghusl" | "Salah & Jamaat" | "Sajda-e-Sahw" | "Roza & Zakat" | "Aqaid";
  title: string;
  source: string;
  summary: string;
  steps: string[];
  deepLink: string;
}

export interface HadithItem {
  id: string;
  collection: string;
  refNumber: string;
  arabic: string;
  english: string;
  urdu: string;
  sunniNote: string;
}

export interface SunnahPlaybook {
  id: string;
  title: string;
  arabicDua: string;
  transliteration: string;
  meaning: string;
  steps: string[];
}

export interface TasbihLitany {
  id: string;
  name: string;
  arabic: string;
  transliteration: string;
  translation: string;
  fazilat: string;
  defaultTarget: number;
  recommendedWindow: string;
}

export const BAHAR_E_SHARIAT_MASAIL: FiqhMasalah[] = [
  {
    id: "wudu-faraid",
    category: "Wudu & Ghusl",
    title: "Four Fara'id of Wudu (Hanafi)",
    source: "Bahar-e-Shariat, Vol. 1, Part 2",
    summary: "Without these 4 obligatory acts, Wudu is invalid in Hanafi Fiqh.",
    steps: [
      "1. Washing the entire face (hairline to below the chin, ear-lobe to ear-lobe).",
      "2. Washing both arms including the elbows.",
      "3. Masah (wiping with wet hands) of at least one-fourth of the head.",
      "4. Washing both feet including the ankles.",
    ],
    deepLink: "/prayer",
  },
  {
    id: "asr-mithlayn",
    category: "Salah & Jamaat",
    title: "Hanafi Asr Entry (Mithlayn) & Makruh Windows",
    source: "Bahar-e-Shariat, Vol. 1, Part 3; Fatawa Razawiyya",
    summary: "In Hanafi jurisprudence, Asr enters when an object's shadow reaches twice its height plus the zenith shadow.",
    steps: [
      "Do not offer any Salah or Sajda-e-Tilawat during the 3 Makruh Tahrimi windows: (a) 20 mins post-sunrise, (b) Istiwa/Zawal, (c) 20 mins pre-sunset.",
      "Only that day's Asr may be offered during sunset yellowing if delayed—though delaying without excuse is sinful.",
    ],
    deepLink: "/prayer",
  },
  {
    id: "sajda-sahw",
    category: "Sajda-e-Sahw",
    title: "When is Sajda-e-Sahw (Prostration of Forgetfulness) Wajib?",
    source: "Bahar-e-Shariat, Vol. 1, Part 4",
    summary: "If a Wajib act of Salah is missed or delayed forgetfully, Sajda-e-Sahw repairs the prayer.",
    steps: [
      "Complete Tashahhud (At-Tahiyyat) in the final sitting.",
      "Turn Salam to the right side only, then perform two Sajdahs with Takbir.",
      "Recite Tashahhud, Durood-e-Ibrahimi, and Dua again, then conclude with both Salams.",
    ],
    deepLink: "/quiz",
  },
  {
    id: "zakat-dhamm",
    category: "Roza & Zakat",
    title: "Hanafi Silver-First Nisab & Dhamm (Combining Assets)",
    source: "Bahar-e-Shariat, Vol. 1, Part 5 (Kitab al-Zakat)",
    summary: "When a Muslim owns cash, trade stock, silver, or mixed gold + cash, Hanafi fiqh combines them against the Silver Nisab (612.36g / 52.5 tola).",
    steps: [
      "Gold & silver jewelry (even worn daily) is zakatable in Hanafi fiqh.",
      "Deduct immediate due debts, then pay 2.5% on net zakatable wealth after 1 lunar year (Hawl).",
      "Note: Sadat (descendants of Banu Hashim) are honored with Hadiya gifts, not Zakat.",
    ],
    deepLink: "/zakat",
  },
];

export const HADITH_COLLECTION: HadithItem[] = [
  {
    id: "bukhari-1",
    collection: "Sahih al-Bukhari",
    refNumber: "Hadith #1",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "Actions are judged only by intentions, and every person shall have what they intended.",
    urdu: "اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔",
    sunniNote: "Hanafi-Maturidi Note: Sincere Niyyah elevates everyday Sunnah habits (eating, sleeping, earning halal) into rewarded Ibadah.",
  },
  {
    id: "tirmidhi-mulk",
    collection: "Jami' at-Tirmidhi",
    refNumber: "Hadith #2891",
    arabic: "إِنَّ سُورَةً مِنَ الْقُرْآنِ ثَلَاثُونَ آيَةً شَفَعَتْ لِرَجُلٍ حَتَّى غُفِرَ لَهُ وَهِيَ سُورَةُ تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ",
    english: "Indeed, there is a Surah in the Quran of thirty verses that interceded for a man until he was forgiven; it is Surah Tabarakallazi Biyadihil-Mulk.",
    urdu: "قرآن مجید میں تیس آیات کی ایک سورت ہے جس نے ایک شخص کی شفاعت کی یہاں تک کہ اس کی مغفرت ہو گئی، اور وہ سورۃ الملک ہے۔",
    sunniNote: "Sunni Practice: Recite or listen to Surah Al-Mulk every night before sleep.",
  },
  {
    id: "mishkat-awliya",
    collection: "Sahih al-Bukhari (Mishkat)",
    refNumber: "Hadith #6502 (Hadith Qudsi)",
    arabic: "مَنْ عَادَى لِي وَلِيًّا فَقَدْ آذَنْتُهُ بِالْحَرْبِ",
    english: "Allah Almighty declares: 'Whoever shows enmity to a Wali (friend) of Mine, I declare war against him.'",
    urdu: "اللہ تعالیٰ فرماتا ہے: جس نے میرے کسی ولی سے دشمنی رکھی، میں اس سے اعلانِ جنگ کرتا ہوں۔",
    sunniNote: "Ahl-e-Sunnat Creed: Reverence and love for the Auliya Allah draws one nearer to Divine mercy.",
  },
];

export const SUNNAH_PLAYBOOKS: SunnahPlaybook[] = [
  {
    id: "sunnah-wudu",
    title: "Masnoon Wudu & Miswak",
    arabicDua: "بِسْمِ اللّٰهِ وَالْحَمْدُ لِلّٰهِ",
    transliteration: "Bismillahi wal-Hamdulillah",
    meaning: "In the name of Allah, and all praise belongs to Allah.",
    steps: ["Use Miswak before Wudu (70x reward in Salah)", "Wash each limb 3 times", "Recite Kalima Shahadah looking skyward afterward"],
  },
  {
    id: "sunnah-jumuah",
    title: "Friday (Jumu'ah) Sunnah Playbook",
    arabicDua: "اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْاُمِّيِّ",
    transliteration: "Allahumma Salli ala Sayyidina Muhammadin-in-Nabiyyil-Ummiyyi",
    meaning: "O Allah, send abundant peace and blessings upon our Master Muhammad ﷺ.",
    steps: ["Ghusl & clean white attire", "Recite Surah Al-Kahf", "Abundant Durood-e-Pak (especially after Asr)", "Reach Masjid early before Khutbah"],
  },
  {
    id: "sunnah-sleep",
    title: "Nightly Sleep Sunnahs",
    arabicDua: "بِاسْمِكَ اللّٰهُمَّ أَمُوْتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma Amutu wa Ahya",
    meaning: "In Your Name, O Allah, I die (sleep) and I live (wake).",
    steps: ["Sleep in state of Wudu on right side", "Recite Surah Al-Mulk & Ayat-ul-Kursi", "Complete Tasbih-e-Fatima (33-33-34)"],
  },
];

export const TASBIH_LITANIES: TasbihLitany[] = [
  {
    id: "durood-razawiyya",
    name: "Durood-e-Razawiyya",
    arabic: "صَلَّى اللّٰهُ عَلَى النَّبِيِّ الْاُمِّيِّ وَاٰلِهٖ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ صَلٰوةً وَّسَلَامًا عَلَيْكَ يَا رَسُوْلَ اللّٰهِ",
    transliteration: "Sallallahu alan-Nabiyyil-Ummiyyi wa Alihi Sallallahu alayhi wa sallam, Salatan wa Salaman alayka Ya Rasulallah",
    translation: "May Allah send blessings upon the Unlettered Prophet and his family; Peace and Blessings be upon you, O Messenger of Allah ﷺ.",
    fazilat: "Reciting 100 times after Jumu'ah brings immense spiritual nearness and barakah.",
    defaultTarget: 100,
    recommendedWindow: "Friday & Morning",
  },
  {
    id: "tasbih-fatima",
    name: "Tasbih-e-Fatima (33-33-34)",
    arabic: "سُبْحَانَ اللّٰهِ • اَلْحَمْدُ لِلّٰهِ • اَللّٰهُ اَكْبَرُ",
    transliteration: "SubhanAllah (33) • Alhamdulillah (33) • Allahu Akbar (34)",
    translation: "Glory be to Allah • All praise is for Allah • Allah is the Greatest.",
    fazilat: "Taught by the Prophet ﷺ to Sayyidah Fatimah (رضي الله عنها); sins are forgiven like sea foam after every Fard Salah.",
    defaultTarget: 100,
    recommendedWindow: "Post-Fard Salah",
  },
  {
    id: "durood-taj",
    name: "Durood-e-Taj (Opening)",
    arabic: "اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ صَاحِبِ التَّاجِ وَالْمِعْرَاجِ وَالْبُرَاقِ وَالْعَلَمِ",
    transliteration: "Allahumma Salli ala Sayyidina wa Mawlana Muhammadin Sahib-it-Taji wal-Mi'raji wal-Buraqi wal-Alam",
    translation: "O Allah, send blessings upon our Master Muhammad ﷺ, Possessor of the Crown, the Ascension, the Buraq, and the Banner.",
    fazilat: "Renowned Sunni Salawat for tranquility of heart and spiritual protection.",
    defaultTarget: 33,
    recommendedWindow: "Evening & Tahajjud",
  },
  {
    id: "durood-ghausia",
    name: "Durood-e-Ghausia",
    arabic: "اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ مَّعْدِنِ الْجُوْدِ وَالْكَرَمِ وَاٰلِهٖ وَبَارِكْ وَسَلِّمْ",
    transliteration: "Allahumma Salli ala Sayyidina Muhammadin Ma'din-il-Judi wal-Karami wa Alihi wa Barik wa Sallim",
    translation: "O Allah, send blessings upon our Master Muhammad ﷺ, the Mine of Generosity and Nobility.",
    fazilat: "Frequently recited in Qadri litanies and on the 11th of each Hijri month (Gyarhvi Sharif).",
    defaultTarget: 111,
    recommendedWindow: "Gyarhvi Sharif / Daily",
  },
  {
    id: "istighfar",
    name: "Sayyid al-Istighfar / Astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللّٰهَ الْعَظِيْمَ الَّذِيْ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوْمُ وَأَتُوْبُ إِلَيْهِ",
    transliteration: "Astaghfirullahal-Azimallazi la ilaha illa Huwal-Hayyul-Qayyumu wa atubu ilayh",
    translation: "I seek forgiveness from Allah the Almighty, besides whom there is no deity, the Ever-Living, the Sustainer, and I repent to Him.",
    fazilat: "Opens doors of sustenance, mercy, and spiritual clarity.",
    defaultTarget: 100,
    recommendedWindow: "Anytime",
  },
];
