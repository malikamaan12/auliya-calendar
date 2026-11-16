export interface ZiyaratHotspot {
  id: string;
  xPct: number;
  yPct: number;
  title: string;
  description: string;
  adabNote: string;
}

export interface BookChapter {
  title: string;
  content: string;
}

export interface AuthoredBook {
  title: string;
  arabicOrUrduTitle: string;
  genre: string;
  language?: string;
  yearOrEra?: string;
  summary: string;
  excerpt: string;
  chapters?: BookChapter[];
}

export interface LifeMilestone {
  yearHijri: string;
  title: string;
  detail: string;
}

export interface ShrineGalleryItem {
  id: string;
  title: string;
  caption: string;
  architecturalStyle: string;
  era: string;
  imageUrl: string;
  focalPoint: string; // CSS object-position for curated framing
}

export interface AuliyaVideoEntry {
  id: string;
  title: string;
  duration: string;
  category: "Documentary" | "360° Ziyarat Tour" | "Malfuzat & Teachings" | "Urs & Qasida";
  description: string;
  narrationScript: string[];
  chapters: { time: string; label: string; summary: string }[];
}

export interface ShajrahNodeItem {
  generation: number;
  name: string;
  title: string;
  era: string;
}

export interface AuliyaProfile {
  id: string;
  slug: string;
  name: string;
  urduName: string;
  arabicName: string;
  alqab: string[];
  silsila: "Qadri" | "Chishti" | "Naqshbandi" | "Suhrawardi" | "Razavi";
  wiladatHijri: string;
  wisalHijri: string;
  ursMonth: number;
  ursDay: number;
  ursLabel: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  shrineImage: string;
  shortSummary: string;
  fullTazkirah: string;
  earlyLifeAndEducation?: string;
  spiritualLineageAndTraining?: string;
  reformAndLegacy?: string;
  lifeTimeline?: LifeMilestone[];
  goldenSayings?: string[];
  dailyWird?: {
    title: string;
    arabic: string;
    transliteration: string;
    translation: string;
    recommendedCount: number;
  };
  architecturalDetails?: {
    style: string;
    eraBuilt: string;
    patronage: string;
    keyFeatures: string[];
    visitingHours: string;
    nearestLandmark: string;
  };
  gallery?: ShrineGalleryItem[];
  videos?: AuliyaVideoEntry[];
  shajrahChain?: ShajrahNodeItem[];
  karamat: string[];
  adabZiyarat: string[];
  hotspots: ZiyaratHotspot[];
  books: AuthoredBook[];
  murshidId?: string;
  khulafaNames: string[];
  status: "Published" | "Scholarly Verification" | "Draft";
}

/** Resolve public image paths so they work both locally and under GitHub Pages `/auliya-calendar` basePath. */
export function resolvePublicAssetUrl(src: string): string {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  if (typeof window !== "undefined") {
    const isGhPagesPath = window.location.pathname.startsWith("/auliya-calendar");
    if (isGhPagesPath && src.startsWith("/") && !src.startsWith("/auliya-calendar/")) {
      return `/auliya-calendar${src}`;
    }
  }
  return src;
}

export const AULIYA_DATA: AuliyaProfile[] = [
  {
    id: "ghaus-e-azam",
    slug: "shaikh-abdul-qadir-jilani",
    name: "Shaikh Abdul Qadir Jilani",
    urduName: "غوثِ اعظم شیخ عبد القادر جیلانی",
    arabicName: "الشيخ عبد القادر الجيلاني",
    alqab: ["Ghaus-e-Azam", "Muhyiddin", "Pir-e-Piran", "Sultan-ul-Auliya", "Al-Baz al-Ashhab"],
    silsila: "Qadri",
    wiladatHijri: "1 Ramadan 470 AH (1077 CE)",
    wisalHijri: "11 Rabi' al-Thani 561 AH (1166 CE)",
    ursMonth: 4,
    ursDay: 11,
    ursLabel: "Bari Gyarhvi Sharif (11 Rabi' al-Thani)",
    city: "Baghdad Sharif",
    country: "Iraq",
    lat: 33.3374,
    lng: 44.4009,
    shrineImage: "/images/shrines/baghdad.jpg",
    shortSummary:
      "Reviver of the Faith (Muhyiddin) and Imam of the Qadriyah spiritual order, whose blessed Urs is commemorated on the 11th of Rabi' al-Thani (Gyarhvi Sharif).",
    fullTazkirah:
      "Sayyiduna Shaykh Muhyiddin Abdul Qadir al-Jilani (رضي الله عنه) was born in Jilan in 470 AH with Hasani and Husayni Prophetic lineage. Arriving in Baghdad at age eighteen, he mastered Hadith, Tafsir, Usul, and Jurisprudence under the greatest scholars of his age before spending twenty-five years in spiritual solitude and Mujahadah. At the Bab al-Azaj seminary, up to seventy thousand seekers gathered at his assemblies, where hundreds of scribes recorded his discourses that revived pure Sunni creed and sincere repentance.",
    earlyLifeAndEducation:
      "Born on 1st Ramadan 470 AH in Na'if, Jilan, to Sayyid Abu Salih Musa Zangi Dost and Sayyidah Ummul Khayr Fatimah. From infancy he fasted during Ramadan. At eighteen he traveled to Baghdad and studied Fiqh, Hadith, and Arabic literature under Shaykh Abu Sa'id al-Mukharrimi, Ibn Aqil, and Abu Zakariyya at-Tabrizi.",
    spiritualLineageAndTraining:
      "Received the blessed Khirqah of spiritual succession from Qadi Abu Sa'id al-Mukharrimi and spiritual companionship from Shaykh Hammad ad-Dabbas. After completing twenty-five years of rigorous spiritual purification, he saw the Noble Prophet ﷺ in a luminous vision commanding him to speak to the people for their guidance.",
    reformAndLegacy:
      "Expanded the Madrasah of Bab al-Azaj in 528 AH into the premier center of Sunni scholarship and Tazkiyah in Baghdad. His disciples carried the Qadriyah order across the Levant, Egypt, North and West Africa, Yemen, Anatolia, and the Indian Subcontinent.",
    lifeTimeline: [
      {
        yearHijri: "1 Ramadan 470 AH",
        title: "Blessed Birth (Wiladat) in Jilan",
        detail: "Born into the noble Hasani-Husayni household of Sayyid Abu Salih Musa Zangi Dost.",
      },
      {
        yearHijri: "488 AH",
        title: "Arrival in Baghdad & Mastery of Sacred Sciences",
        detail: "Traveled to Baghdad at age 18; truthful encounter with highway robbers led to their collective repentance.",
      },
      {
        yearHijri: "521 AH",
        title: "First Public Discourse at Bab al-Azaj",
        detail: "Began public preaching and Ifta after receiving spiritual permission; crowds overflowed into the outskirts of Baghdad.",
      },
      {
        yearHijri: "528 AH",
        title: "Expansion of the Qadriyah Seminary & Ribat",
        detail: "Established the grand seminary and hospice serving scholars, orphans, and travelers.",
      },
      {
        yearHijri: "11 Rabi' al-Thani 561 AH",
        title: "Blessed Union (Wisal) in Baghdad",
        detail: "Returned to the Mercy of Allah at age 91; commemorated globally as Bari Gyarhvi Sharif.",
      },
    ],
    goldenSayings: [
      "Truthfulness (Sidq) is the foundation of all spiritual stations; never abandon truth even if you fear for your life.",
      "Be with Allah as though creation does not exist, and serve creation without expectation from your ego.",
      "Do not complain of your Lord to creation; place your need before the One Who holds the keys of the heavens and the earth.",
    ],
    dailyWird: {
      title: "Khatm-e-Ghausiyyah & Nida-e-Qadri",
      arabic: "يَا غِيَاثَ الْمُسْتَغِيثِينَ أَغِثْنَا • صَلَّى اللّٰهُ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَّآلِهٖ وَسَلَّمَ",
      transliteration: "Ya Ghiyathal-Mustaghithina Aghithna • Sallallahu 'ala Sayyidina Muhammadin wa Alihi wa Sallam",
      translation: "O Succor of those who seek help, grant us relief! May Allah bless our Master Muhammad ﷺ and his family.",
      recommendedCount: 111,
    },
    architecturalDetails: {
      style: "Abbasid-Ottoman Seljuk Sacred Complex with Iznik & Kashani Tilework",
      eraBuilt: "6th Century AH (561 AH), expanded by Sultan Suleiman the Magnificent (941 AH)",
      patronage: "Abbasid Caliphate & Ottoman Imperial Waqf",
      keyFeatures: [
        "Iconic Golden & Turquoise Dome over the Mazar-e-Aqdas",
        "Vast Bab al-Shaykh Marble Courtyard with Three Historic Minarets",
        "Qadiriyyah Manuscript Library housing over 80,000 rare Arabic & Persian codices",
        "Grand Hanafi & Qadri Prayer Hall and Daily Langar Kitchen",
      ],
      visitingHours: "Daily from Fajr until Isha (Special Khatm after Asr & Thursday evenings)",
      nearestLandmark: "Bab al-Shaykh (Rusafa District), East Bank of the Tigris River, Baghdad",
    },
    gallery: [
      {
        id: "baghdad-gal-1",
        title: "Golden Sanctuary Dome & Bab al-Shaykh Courtyard",
        caption: "Panoramic twilight view of the Hazrat Sheikh Abdul Qadir Gilani Shrine complex in Rusafa, Baghdad.",
        architecturalStyle: "Abbasid & Ottoman Sacred Architecture",
        era: "561 AH – 941 AH",
        imageUrl: "/images/shrines/baghdad.jpg",
        focalPoint: "50% 40%",
      },
      {
        id: "baghdad-gal-2",
        title: "Turquoise Calligraphic Iwan & Arches",
        caption: "Intricate cobalt and gold Quranic Thuluth inscriptions framing the entrance to the inner Rawdah.",
        architecturalStyle: "Kashani & Iznik Ceramic Mosaic",
        era: "10th Century AH Renovation",
        imageUrl: "/images/shrines/baghdad.jpg",
        focalPoint: "80% 55%",
      },
      {
        id: "baghdad-gal-3",
        title: "Minaret of the Madrasah & Library Wing",
        caption: "Historic minaret rising above the Bab al-Azaj seminary and Qadiriyyah manuscript repository.",
        architecturalStyle: "Baghdadi Brick & Muqarnas",
        era: "6th Century AH",
        imageUrl: "/images/shrines/baghdad.jpg",
        focalPoint: "20% 30%",
      },
    ],
    videos: [
      {
        id: "vid-ghaus-1",
        title: "Sacred Architecture & History of Dargah Ghaus-e-Azam (Baghdad Sharif)",
        duration: "06:40",
        category: "Documentary",
        description: "Guided architectural and historical documentary exploring Bab al-Azaj, the Qadiriyyah Library, and the life of Sultan-ul-Auliya.",
        narrationScript: [
          "Welcome to Bab al-Shaykh on the eastern bank of the Tigris in Baghdad—the resting sanctuary of Sayyiduna Shaykh Abdul Qadir al-Jilani.",
          "Here at the Madrasah of Bab al-Azaj, the Reviver of the Faith delivered the seventy-eight discourses of Futuh al-Ghayb and Al-Fath ar-Rabbani.",
          "Across nine centuries, the Qadiriyyah Library and Langar have served scholars, pilgrims, and the needy without interruption.",
        ],
        chapters: [
          { time: "00:00", label: "Jilan to Baghdad", summary: "Early life, Prophetic Hasani-Husayni lineage, and arrival in Baghdad in 488 AH." },
          { time: "02:15", label: "Bab al-Azaj Seminary", summary: "How Shaykh Abu Sa'id al-Mukharrimi's seminary became the center of Sunni revival." },
          { time: "04:30", label: "Architectural Sanctuary & Library", summary: "Tour of the courtyard, golden dome, and 80,000-manuscript Qadiriyyah library." },
        ],
      },
      {
        id: "vid-ghaus-2",
        title: "Counsels from Futuh al-Ghayb & Ghunyat-ut-Talibin",
        duration: "05:15",
        category: "Malfuzat & Teachings",
        description: "Key spiritual lessons on Tawakkul, adherence to the Sunnah, and purifying the heart.",
        narrationScript: [
          "In Futuh al-Ghayb, Sayyiduna Ghaus-e-Azam teaches that three things are indispensable for every believer: keeping the commandments of Allah, abstaining from the forbidden, and contentment with Divine decree.",
          "Every spiritual state that is not testified to by the Shari'ah of Sayyiduna Muhammad ﷺ is rejected.",
        ],
        chapters: [
          { time: "00:00", label: "Three Pillars of the Believer", summary: "Commandments, prohibitions, and Rida bil-Qada." },
          { time: "02:40", label: "Sincerity (Ikhlas)", summary: "Purifying action from ostentation and ego." },
        ],
      },
    ],
    shajrahChain: [
      { generation: 1, name: "Sayyiduna Muhammad ﷺ", title: "Khatam-un-Nabiyyin", era: "Prophetic Era" },
      { generation: 2, name: "Sayyiduna Ali ibn Abi Talib (رضي الله عنه)", title: "Amir al-Mu'minin", era: "40 AH" },
      { generation: 3, name: "Imam Husayn ibn Ali & Hasan al-Basri", title: "Ahl al-Bayt & Tabi'in", era: "61–110 AH" },
      { generation: 4, name: "Habib al-Ajami & Dawud at-Ta'i", title: "Masters of Baghdad & Basra", era: "156–165 AH" },
      { generation: 5, name: "Ma'ruf al-Karkhi & Sari as-Saqati", title: "Pillars of Baghdad", era: "200–253 AH" },
      { generation: 6, name: "Sayyidat-ut-Ta'ifah Junayd al-Baghdadi", title: "Imam of Sober Tasawwuf", era: "297 AH" },
      { generation: 7, name: "Shaykh Abu Bakr ash-Shibli & Abul Fadl at-Tamimi", title: "Qadri Masters", era: "334–425 AH" },
      { generation: 8, name: "Qadi Abu Sa'id Mubarak al-Mukharrimi", title: "Shaykh of Bab al-Azaj", era: "513 AH" },
      { generation: 9, name: "Ghaus-e-Azam Shaykh Abdul Qadir Jilani", title: "Sultan-ul-Auliya & Imam of Qadriyah", era: "470–561 AH" },
    ],
    karamat: [
      "Spoke the truth to highway robbers as a youth because of his mother's covenant—leading the entire band to sincere repentance.",
      "Proclaimed 'Qadami hadhihi ala raqabati kulli waliyyillah' by Divine command, acknowledged by saints across the East and West.",
      "Revived spiritual certainty in Baghdad through his Futuh al-Ghayb and Al-Fath ar-Rabbani gatherings.",
    ],
    adabZiyarat: [
      "Enter with Wudu, lowered gaze, and sincere Salawat upon the Noble Prophet ﷺ.",
      "Offer two rak'at Tahiyyat-ul-Masjid (outside Makruh windows) and recite Surah Yasin or Al-Fatihah for Isal-e-Sawab.",
      "Maintain hushed reverence inside the courtyard and face the Qibla when making Dua.",
    ],
    hotspots: [
      {
        id: "baghdad-dome",
        xPct: 58,
        yPct: 30,
        title: "Al-Qubbah al-Khadra & Golden Dome",
        description: "The iconic golden dome marking the resting sanctuary of Ghaus-e-Azam in Bab al-Shaykh, Baghdad.",
        adabNote: "Recite 'Assalamu Alaikum Ya Ghaus-e-Azam' with humility.",
      },
      {
        id: "baghdad-courtyard",
        xPct: 35,
        yPct: 68,
        title: "Bab al-Shaykh Marble Courtyard",
        description: "Historic courtyard where scholars and pilgrims gather for Khatm-e-Qadriyah and Gyarhvi Sharif.",
        adabNote: "Keep pathways clear for elders and worshippers.",
      },
      {
        id: "baghdad-arch",
        xPct: 76,
        yPct: 48,
        title: "Calligraphic Iwan Archway",
        description: "Turquoise and cobalt geometric tilework inscribed with Quranic verses and Qadri litanies.",
        adabNote: "Reflect on the sacred calligraphy in silence.",
      },
    ],
    books: [
      {
        title: "Ghunyat-ut-Talibin",
        arabicOrUrduTitle: "غنية الطالبين",
        genre: "Sunni Aqaid, Fiqh & Tasawwuf",
        language: "Arabic (with Urdu & English translations)",
        yearOrEra: "6th Century AH",
        summary: "Comprehensive manual of Sunni creed, worship etiquette, sacred months, and spiritual discipline.",
        excerpt: "The foundation of every spiritual station is adherence to the Book of Allah and the Sunnah of His Messenger ﷺ.",
        chapters: [
          {
            title: "Chapter 1: Entering Islam & Upholding Pure Sunni Creed",
            content:
              "Know that true faith combines affirmation of the heart, testimony of the tongue, and action with the limbs in accordance with the Way of Ahl al-Sunnah wal-Jama'ah. The seeker must first learn the obligatory rulings of purification, Salah, fasting, and lawful livelihood.",
          },
          {
            title: "Chapter 2: Etiquette of the Seeker (Adab al-Murid)",
            content:
              "The disciple must guard the five prayers in congregation, honor parents and scholars, maintain lowered gaze, and serve the poor without pride.",
          },
        ],
      },
      {
        title: "Futuh al-Ghayb (Revelations of the Unseen)",
        arabicOrUrduTitle: "فتوح الغيب",
        genre: "78 Spiritual Discourses",
        language: "Arabic",
        yearOrEra: "Compiled by Shaykh Abdur Razzaq Jilani",
        summary: "Timeless counsel on reliance upon Allah (Tawakkul), sincerity, and overcoming the ego (Nafs).",
        excerpt: "Be with Allah as if creation does not exist, and be with creation without expectation from your ego.",
        chapters: [
          {
            title: "Discourse 1: Three Indispensable Duties of the Believer",
            content:
              "Three things are indispensable for a believer in all states: (1) keeping the commandments of Allah, (2) abstaining from all that is forbidden, and (3) being pleased with the decree of the Almighty.",
          },
          {
            title: "Discourse 17: On True Reliance (Tawakkul)",
            content:
              "When the heart is purified of attachment to worldly causes and recognizes the Creator behind every means, tranquility descends upon the soul.",
          },
        ],
      },
      {
        title: "Al-Fath ar-Rabbani",
        arabicOrUrduTitle: "الفتح الرباني والفيض الرحماني",
        genre: "62 Sermons in Baghdad (545–546 AH)",
        language: "Arabic",
        yearOrEra: "545–546 AH",
        summary: "Sixty-two public sermons delivered at the Bab al-Azaj ribat on repentance, Zuhd, and love of Allah.",
        excerpt: "Cleanse your heart with tears of sincere repentance before the night of your departure arrives.",
        chapters: [
          {
            title: "Majlis 1: Guarding the Heart & Tongue",
            content:
              "A little action accompanied by sincerity and adherence to the Sunnah outweighs mountains of heedless deeds.",
          },
        ],
      },
    ],
    khulafaNames: [
      "Shaikh Abdur Razzaq Jilani",
      "Shaikh Abdul Aziz Jilani",
      "Shaikh Ali bin Hiti",
      "Shaikh Shihabuddin Suhrawardi",
      "Shaikh Abu Madyan al-Ghawth",
    ],
    status: "Published",
  },
  {
    id: "khwaja-moinuddin",
    slug: "khwaja-moinuddin-chishti",
    name: "Khwaja Moinuddin Chishti",
    urduName: "خواجہ معین الدین چشتی اجمیری",
    arabicName: "الخواجة معين الدين الجشتي",
    alqab: ["Sultan-ul-Hind", "Gharib Nawaz", "Ata-e-Rasool", "Hind-al-Wali", "Khwaja-e-Ajmer"],
    silsila: "Chishti",
    wiladatHijri: "14 Rajab 536 AH (1142 CE)",
    wisalHijri: "6 Rajab 633 AH (1236 CE)",
    ursMonth: 7,
    ursDay: 6,
    ursLabel: "Chhati Sharif (6 Rajab)",
    city: "Ajmer Sharif",
    country: "India",
    lat: 26.4561,
    lng: 74.6281,
    shrineImage: "/images/shrines/ajmer.jpg",
    shortSummary:
      "Sultan-ul-Hind and spiritual sovereign of the Chishti order in South Asia, renowned for compassion toward the poor (Gharib Nawaz) and Chhati Sharif.",
    fullTazkirah:
      "Khwaja Moinuddin Hasan Chishti Sanjari (رحمة الله عليه) was born in Sijistan in 536 AH, memorized the Quran in his youth, and studied in Samarkand and Bukhara. He accompanied his Murshid Khwaja Usman Harooni for twenty years of rigorous spiritual travel across Baghdad, Makkah, and Madinah. Blessed at the Rawdah-e-Aqdas with the glad tidings to illuminate Hindustan, he settled in Ajmer Sharif around 587 AH, where his ocean-like generosity, Langar, and noble character drew millions into the fold of Islam.",
    earlyLifeAndEducation:
      "Born in Sanjar (Sistan) into a noble Sayyid family tracing back to Imam Hasan and Imam Husayn (رضي الله عنهما). At age fifteen he sold his inherited orchard and watermill, distributed the proceeds to the poor, and traveled to Samarkand and Bukhara to master Quran, Hadith, and Fiqh.",
    spiritualLineageAndTraining:
      "Took Bay'at at the hands of Khwaja Usman Harooni in Haroon, serving him for twenty years and receiving the sacred Chishti Khilafat. Met Sayyiduna Ghaus-e-Azam in Baghdad and performed Chilla at Data Darbar in Lahore before arriving in Ajmer.",
    reformAndLegacy:
      "Established the Chishti order across South Asia through his illustrious Khulafa—Khwaja Qutbuddin Bakhtiyar Kaki in Delhi and Shaikh Hamiduddin Nagauri in Rajasthan—making service to humanity (Khidmat-e-Khalq) the hallmark of Chishti spirituality.",
    lifeTimeline: [
      {
        yearHijri: "14 Rajab 536 AH",
        title: "Birth in Sanjar, Sijistan",
        detail: "Born into a pious Sayyid household known for hospitality and devotion.",
      },
      {
        yearHijri: "551 AH",
        title: "Journey to Samarkand & Bukhara",
        detail: "Memorized the Holy Quran and mastered outward sciences of Shari'ah.",
      },
      {
        yearHijri: "562 AH",
        title: "Bay'at with Khwaja Usman Harooni",
        detail: "Entered the Chishti silsila and began twenty years of spiritual travel across the Islamic world.",
      },
      {
        yearHijri: "587 AH",
        title: "Arrival in Ajmer Sharif",
        detail: "Established the Khanqah at Ana Sagar, transforming hearts through humility and Langar.",
      },
      {
        yearHijri: "6 Rajab 633 AH",
        title: "Blessed Wisal in Ajmer Sharif",
        detail: "Passed into Divine union after Isha prayer; commemorated every month on Chhati Sharif and annually from 1–6 Rajab.",
      },
    ],
    goldenSayings: [
      "The noblest form of worship is to relieve the distress of the afflicted, fulfill the need of the helpless, and feed the hungry.",
      "Develop river-like generosity, sun-like affection, and earth-like hospitality.",
      "He is a true lover of Allah who welcomes trials with patience and serves creation with humility.",
    ],
    dailyWird: {
      title: "Tasbih-e-Chishtiyyah & Salawat",
      arabic: "يَا مُعِينُ يَا اللّٰهُ • اللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَّعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ",
      transliteration: "Ya Mu'inu Ya Allah • Allahumma Salli 'ala Sayyidina Muhammadin wa 'ala Ali Sayyidina Muhammad",
      translation: "O Helper, O Allah! O Allah, send blessings upon our Master Muhammad ﷺ and his family.",
      recommendedCount: 100,
    },
    architecturalDetails: {
      style: "Indo-Islamic Khalji & Mughal White Marble Architecture",
      eraBuilt: "7th–10th Century AH (Expanded by Sultan Ghiyasuddin Khalji, Akbar & Shah Jahan)",
      patronage: "Malwa Sultanate & Mughal Imperial Endowment",
      keyFeatures: [
        "Radiant White Marble Dome crowned with a Golden Lotus Kalash",
        "75-Foot Buland Darwaza & Nizam Gate Main Portals",
        "Shahjahani White Marble Jama Masjid & Begami Dalan",
        "Chhoti Deg & Bari Deg (Historic Cauldrons cooking vegetarian Langar for thousands daily)",
      ],
      visitingHours: "4:00 AM (Fajr) to 10:00 PM (Roshni Dua 15 minutes before Maghrib)",
      nearestLandmark: "Dargah Bazar, foot of Taragarh Hill, Ajmer, Rajasthan",
    },
    gallery: [
      {
        id: "ajmer-gal-1",
        title: "White Marble Sanctum Dome of Gharib Nawaz",
        caption: "The luminous white marble dome crowned with gold over the Mazar-e-Aqdas in Ajmer Sharif.",
        architecturalStyle: "Indo-Islamic White Marble & Gold",
        era: "939 AH / 1532 CE",
        imageUrl: "/images/shrines/ajmer.jpg",
        focalPoint: "50% 35%",
      },
      {
        id: "ajmer-gal-2",
        title: "Begami Dalan & Pietra Dura Colonnade",
        caption: "Carved marble arches and floral inlay portico surrounding the main sanctum.",
        architecturalStyle: "Mughal Marble Colonnade",
        era: "1053 AH / 1643 CE",
        imageUrl: "/images/shrines/ajmer.jpg",
        focalPoint: "25% 55%",
      },
      {
        id: "ajmer-gal-3",
        title: "Sahne-e-Dargah & Roshni Courtyard",
        caption: "Evening twilight gathering for the traditional Roshni Dua before Maghrib Azan.",
        architecturalStyle: "Indo-Persian Courtyard",
        era: "10th Century AH",
        imageUrl: "/images/shrines/ajmer.jpg",
        focalPoint: "75% 50%",
      },
    ],
    videos: [
      {
        id: "vid-ajmer-1",
        title: "Ajmer Sharif: Life, Teachings & Sanctuary of Sultan-ul-Hind",
        duration: "07:10",
        category: "Documentary",
        description: "Explore the spiritual journey of Khwaja Moinuddin Chishti from Sanjar and Madinah to Ajmer, including the history of the Buland Darwaza and Langar.",
        narrationScript: [
          "Nestled beneath the Aravalli hills of Rajasthan stands the white marble sanctuary of Sultan-ul-Hind Khwaja Moinuddin Hasan Chishti.",
          "Trained for twenty years by Khwaja Usman Harooni, Gharib Nawaz taught that feeding the hungry and comforting the broken-hearted is the essence of devotion.",
          "Every evening before Maghrib, the Roshni ceremony illuminates the sanctuary as pilgrims recite Durood and Fatiha.",
        ],
        chapters: [
          { time: "00:00", label: "Sanjar to Madinah", summary: "Early scholarship and the glad tidings at the Prophetic Rawdah." },
          { time: "02:30", label: "The Chishti Ethos of Service", summary: "River-like generosity, sun-like affection, and earth-like hospitality." },
          { time: "05:00", label: "Buland Darwaza, Degs & Shahjahani Masjid", summary: "Architectural walk through the Ajmer Dargah complex." },
        ],
      },
    ],
    shajrahChain: [
      { generation: 1, name: "Sayyiduna Muhammad ﷺ", title: "Khatam-un-Nabiyyin", era: "Prophetic Era" },
      { generation: 2, name: "Sayyiduna Ali ibn Abi Talib (رضي الله عنه)", title: "Amir al-Mu'minin", era: "40 AH" },
      { generation: 3, name: "Khwaja Hasan al-Basri", title: "Crown of the Tabi'in", era: "110 AH" },
      { generation: 4, name: "Khwaja Abdul Wahid bin Zayd & Fudayl ibn Iyad", title: "Early Masters of Zuhd", era: "177–187 AH" },
      { generation: 5, name: "Sultan Ibrahim bin Adham al-Balkhi", title: "Renunciant King of Balkh", era: "162 AH" },
      { generation: 6, name: "Khwaja Abu Ishaq Shami Chishti", title: "Founder of the Chishti Title in Chisht", era: "329 AH" },
      { generation: 7, name: "Khwaja Mawdud Chishti & Haji Sharif Zindani", title: "Masters of Chisht", era: "527–612 AH" },
      { generation: 8, name: "Khwaja Usman Harooni", title: "Murshid of Sultan-ul-Hind", era: "617 AH" },
      { generation: 9, name: "Sultan-ul-Hind Khwaja Moinuddin Chishti", title: "Gharib Nawaz of Ajmer Sharif", era: "536–633 AH" },
    ],
    karamat: [
      "Transformed the hearts of thousands in Ajmer through exemplary humility, Langar (free community kitchen), and gentle character.",
      "Authored the famous Ruba'i 'Shah Ast Husayn, Badshah Ast Husayn' affirming Ahl-e-Bayt devotion.",
    ],
    adabZiyarat: [
      "Enter through Buland Darwaza with Wudu and send Salawat upon Sayyiduna Muhammad ﷺ.",
      "Pray for the poor and contribute to Langar-e-Gharib Nawaz as Sadaqah.",
    ],
    hotspots: [
      {
        id: "ajmer-dome",
        xPct: 50,
        yPct: 32,
        title: "White Marble Sanctum Dome",
        description: "The radiant white marble dome crowned with a golden finial over the Mazar-e-Aqdas.",
        adabNote: "Recite Surah Al-Fatihah and 3x Surah Al-Ikhlas for Isal-e-Sawab.",
      },
      {
        id: "ajmer-arches",
        xPct: 22,
        yPct: 55,
        title: "Begami Dalan Carved Arches",
        description: "Intricate Mughal-era marble arches surrounding the tranquil Sahne-e-Dargah.",
        adabNote: "Observe quiet Dhikr and avoid loud conversation.",
      },
      {
        id: "ajmer-langar",
        xPct: 78,
        yPct: 62,
        title: "Historic Bari Deg & Langar Khana",
        description: "Centuries-old community kitchen where food is prepared and distributed to all visitors.",
        adabNote: "Give Sadaqah and feed the poor in the spirit of Gharib Nawaz.",
      },
    ],
    books: [
      {
        title: "Anis al-Arwah",
        arabicOrUrduTitle: "أنيس الأرواح",
        genre: "Malfuzat (28 Assemblies)",
        language: "Persian (with Urdu & English translations)",
        yearOrEra: "6th Century AH",
        summary: "Twenty-eight recorded spiritual discourses of his Murshid, Khwaja Usman Harooni.",
        excerpt: "True devotion is to bring comfort to a broken heart and feed the hungry.",
        chapters: [
          {
            title: "Majlis 1: Sincerity in Repentance & Guarding the Tongue",
            content:
              "Khwaja Usman Harooni stated that whoever guards their tongue from backbiting and fills their hours with remembrance of Allah is granted light in the heart.",
          },
          {
            title: "Majlis 14: The Virtue of Serving the Needy",
            content:
              "No supererogatory act brings a servant closer to Divine Mercy faster than feeding the hungry and lifting the burden of the sorrowful.",
          },
        ],
      },
      {
        title: "Ganj al-Asrar (Treasure of Mysteries)",
        arabicOrUrduTitle: "گنج الاسرار",
        genre: "Epistle on Shari'ah & Tariqah",
        language: "Persian",
        yearOrEra: "7th Century AH",
        summary: "Treatise compiled for spiritual instruction on Gnosis (Ma'rifat), Salah, and Prophetic love.",
        excerpt: "Without complete obedience to the Shari'ah, no traveler reaches even the first stage of the Path.",
        chapters: [
          {
            title: "Section 1: The Inner Reality of Taharah & Salah",
            content:
              "Outward purification is washing the limbs with clean water; inward purification is cleansing the heart from envy, pride, and love of the world.",
          },
        ],
      },
    ],
    murshidId: "ghaus-e-azam",
    khulafaNames: [
      "Khwaja Qutbuddin Bakhtiyar Kaki",
      "Shaikh Hamiduddin Suwali Nagauri",
      "Khwaja Fakhruddin Chishti",
    ],
    status: "Published",
  },
  {
    id: "ala-hazrat",
    slug: "imam-ahmad-raza-khan-barelvi",
    name: "Imam Ahmad Raza Khan Barelvi",
    urduName: "اعلیٰ حضرت امام احمد رضا خان بریلوی",
    arabicName: "الإمام أحمد رضا خان البريلوي",
    alqab: ["Ala Hazrat", "Mujaddid of 14th Century AH", "Imam-e-Ahl-e-Sunnat", "Fazil-e-Barelvi", "Hasaan-ul-Hind"],
    silsila: "Razavi",
    wiladatHijri: "10 Shawwal 1272 AH (14 June 1856 CE)",
    wisalHijri: "25 Safar 1340 AH (28 October 1921 CE)",
    ursMonth: 2,
    ursDay: 25,
    ursLabel: "Urs-e-Razavi (25 Safar)",
    city: "Bareilly Sharif",
    country: "India",
    lat: 28.3563,
    lng: 79.4126,
    shrineImage: "/images/shrines/bareilly.jpg",
    shortSummary:
      "Reviver of the 14th Hijri century, towering Hanafi jurist, polymath, and author of Kanzul Iman, Fatawa Razawiyya, and Hadaiq-e-Bakhshish.",
    fullTazkirah:
      "Imam Ahmad Raza Khan Qadri Barkati Barelvi (رحمة الله عليه) completed the entire Dars-e-Nizami curriculum and began issuing juristic Fatawa at age thirteen years and ten months. Mastering over fifty Islamic and rational sciences—including Hanafi Fiqh, Hadith, Tafsir, Ilm-ul-Tawqit (astronomy/prayer timekeeping), and mathematics—he authored over 1,000 treatises and the monumental 30-volume Fatawa Razawiyya, while his Kanzul Iman translation and Hadaiq-e-Bakhshish poetry ignited deep reverence for the Beloved Prophet ﷺ across the Sunni world.",
    earlyLifeAndEducation:
      "Born in Mohalla Jasoli, Bareilly Sharif, on 10 Shawwal 1272 AH. Educated primarily by his erudite father Mawlana Naqi Ali Khan (author of Surur al-Qulub), he displayed extraordinary memory and juristic precision from childhood, writing his first Arabic-Persian fatwa on milk-kinship in 1286 AH.",
    spiritualLineageAndTraining:
      "In 1294 AH, accompanied by his father, he traveled to Marehra Sharif and took Bay'at in the Qadri-Barkati order at the hands of Sayyid Shah Aale Rasool Marehravi, who granted him immediate Ijazah and Khilafat across all spiritual orders, further refined under Sayyid Abul Husayn Ahmad-e-Noori.",
    reformAndLegacy:
      "Founded Manzar-e-Islam in Bareilly Sharif in 1322 AH (1904 CE), training generations of jurists and scholars including Sadr-ush-Shariah Mufti Amjad Ali Aazmi (author of Bahar-e-Shariat), Hujjat-ul-Islam Hamid Raza Khan, and Mufti-e-Azam Mustafa Raza Khan.",
    lifeTimeline: [
      {
        yearHijri: "10 Shawwal 1272 AH",
        title: "Birth in Bareilly Sharif",
        detail: "Born at Mohalla Jasoli; given the chronogrammatic name 'Al-Mukhtar' (1272).",
      },
      {
        yearHijri: "14 Sha'ban 1286 AH",
        title: "Graduation & First Juristic Fatwa at Age 13",
        detail: "Issued his first formal Hanafi fatwa under the supervision of his father Mawlana Naqi Ali Khan.",
      },
      {
        yearHijri: "1294 AH",
        title: "Bay'at & Khilafat at Marehra Sharif",
        detail: "Received Qadri-Barkati Khilafat from Sayyid Shah Aale Rasool Marehravi.",
      },
      {
        yearHijri: "1323 AH (1905–1906 CE)",
        title: "Second Hajj & Acclaim in Makkah & Madinah",
        detail: "Wrote Al-Dawlat al-Makkiyyah in Makkah within hours without reference books; hailed by Haramain scholars as Mujaddid.",
      },
      {
        yearHijri: "1330 AH (1911 CE)",
        title: "Completion of Kanzul Iman",
        detail: "Dictated the revered Urdu translation of the Holy Quran preserving Divine Majesty and Prophetic honor.",
      },
      {
        yearHijri: "25 Safar 1340 AH",
        title: "Blessed Wisal during Friday Jumu'ah Azan",
        detail: "Passed away in Bareilly Sharif at 2:38 PM exactly as the Mu'adhin proclaimed 'Hayya alal-Falah'.",
      },
    ],
    goldenSayings: [
      "Love for the Messenger of Allah ﷺ is the very soul of Iman; when reverence departs, nothing of faith remains.",
      "Acquire comprehensive knowledge of Hanafi Fiqh so that your worship, trade, and character conform to the Shari'ah.",
      "Do not waste a single breath without knowledge, remembrance, or service to the Ummah of Sayyiduna Mustafa ﷺ.",
    ],
    dailyWird: {
      title: "Durood-e-Razawiyya",
      arabic: "صَلَّى اللّٰهُ عَلَى النَّبِيِّ الْاُمِّيِّ وَاٰلِهٖ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ صَلٰوةً وَّسَلَامًا عَلَيْكَ يَا رَسُوْلَ اللّٰهِ",
      transliteration: "Sallallahu 'alan-Nabiyyil-Ummiyyi wa Alihi Sallallahu 'alayhi wa sallam, Salatan wa Salaman 'alayka Ya Rasulallah",
      translation: "May Allah send blessings upon the Unlettered Prophet and his family; Peace and Blessings be upon you, O Messenger of Allah ﷺ.",
      recommendedCount: 100,
    },
    architecturalDetails: {
      style: "Rohilkhandi Indo-Islamic Emerald & White Marble Sanctuary",
      eraBuilt: "1340 AH / 1921 CE (Expanded throughout the 20th Century)",
      patronage: "Dargah-e-Ala Hazrat Waqf & Sunni Community Endowment",
      keyFeatures: [
        "Iconic Ribbed White & Emerald Dome inscribed with Salat-o-Salam",
        "Raza Jama Masjid & Darul Uloom Manzar-e-Islam Seminary",
        "Markazi Darul Ifta Bareilly Sharif (Continuous Hanafi Fatwa Center since 1286 AH)",
        "Razavi Research Library housing Ala Hazrat's original handwritten manuscripts",
      ],
      visitingHours: "Daily from Fajr until late Isha (Special Salat-o-Salam after Jumu'ah)",
      nearestLandmark: "Mohalla Saudagran, Bareilly Sharif, Uttar Pradesh",
    },
    gallery: [
      {
        id: "bareilly-gal-1",
        title: "Dargah-e-Ala Hazrat Dome & Portal",
        caption: "The illuminated white and emerald dome of Dargah-e-Ala Hazrat in Mohalla Saudagran, Bareilly Sharif.",
        architecturalStyle: "Rohilkhandi Indo-Islamic",
        era: "14th Century AH",
        imageUrl: "/images/shrines/bareilly.jpg",
        focalPoint: "50% 40%",
      },
      {
        id: "bareilly-gal-2",
        title: "Raza Masjid Minarets & Courtyard",
        caption: "Twin minarets overlooking the courtyard where scholars and students gather for Dars-e-Hadith and Salat-o-Salam.",
        architecturalStyle: "North Indian Mosque Architecture",
        era: "1322–1340 AH",
        imageUrl: "/images/shrines/bareilly.jpg",
        focalPoint: "30% 25%",
      },
    ],
    videos: [
      {
        id: "vid-razavi-1",
        title: "Scholarly Legacy of Imam Ahmad Raza Khan: Kanzul Iman & Fatawa Razawiyya",
        duration: "08:05",
        category: "Documentary",
        description: "In-depth documentary on how Ala Hazrat authored 1,000+ works across 50 sciences and established Darul Uloom Manzar-e-Islam.",
        narrationScript: [
          "In Bareilly Sharif, Imam Ahmad Raza Khan dedicated over fifty-four years to writing juristic verdicts, astronomical treatises, and devotional poetry.",
          "His thirty-volume Fatawa Razawiyya remains one of the most comprehensive encyclopedias of Hanafi jurisprudence ever compiled.",
          "His Urdu translation Kanzul Iman and the verses of Mustafa Jaan-e-Rehmat continue to echo across mosques worldwide.",
        ],
        chapters: [
          { time: "00:00", label: "Early Mastery at Age 13", summary: "Education under Mawlana Naqi Ali Khan and first fatwa in 1286 AH." },
          { time: "03:10", label: "Fatawa Razawiyya & Ilm-ul-Tawqit", summary: "Contributions to Hanafi Fiqh and astronomical prayer time calculation." },
          { time: "05:45", label: "Kanzul Iman & Hadaiq-e-Bakhshish", summary: "Preserving Prophetic reverence in translation and poetry." },
        ],
      },
    ],
    shajrahChain: [
      { generation: 1, name: "Sayyiduna Muhammad ﷺ", title: "Khatam-un-Nabiyyin", era: "Prophetic Era" },
      { generation: 2, name: "Sayyiduna Ali ibn Abi Talib (رضي الله عنه)", title: "Amir al-Mu'minin", era: "40 AH" },
      { generation: 3, name: "Ghaus-e-Azam Shaykh Abdul Qadir Jilani", title: "Imam of the Qadriyah", era: "561 AH" },
      { generation: 4, name: "Sayyid Abdul Wahhab & Sayyid Abdur Razzaq Jilani", title: "Baghdad Qadri Masters", era: "603 AH" },
      { generation: 5, name: "Sayyid Shah Barakatullah Marehravi", title: "Founder of the Barkatiyyah Branch", era: "1142 AH" },
      { generation: 6, name: "Sayyid Shah Aale Ahmad Achhe Miyan", title: "Qutb of Marehra Sharif", era: "1235 AH" },
      { generation: 7, name: "Sayyid Shah Aale Rasool Marehravi", title: "Murshid of Ala Hazrat", era: "1296 AH" },
      { generation: 8, name: "Imam Ahmad Raza Khan Qadri Barelvi", title: "Ala Hazrat & Mujaddid of 14th Century AH", era: "1272–1340 AH" },
    ],
    karamat: [
      "Completed his Urdu translation Kanzul Iman with unmatched precision preserving the honor of Allah and His Messenger ﷺ.",
      "Composed 'Mustafa Jaan-e-Rehmat Pe Lakhon Salam'—recited daily in Sunni gatherings worldwide.",
    ],
    adabZiyarat: [
      "Recite Salat-o-Salam ('Mustafa Jaan-e-Rehmat Pe Lakhon Salam') with reverence.",
      "Study Hanafi Fiqh and uphold the love of the Prophet ﷺ in daily conduct.",
    ],
    hotspots: [
      {
        id: "bareilly-arch",
        xPct: 50,
        yPct: 48,
        title: "Dargah-e-Ala Hazrat Main Portal",
        description: "Emerald and white marble portal inscribed with 'Ya Nabi Salam Alayka'.",
        adabNote: "Offer Durood-e-Razawiyya before entering.",
      },
      {
        id: "bareilly-minars",
        xPct: 35,
        yPct: 24,
        title: "Raza Jama Masjid Minarets",
        description: "Twin minarets overlooking the historic Bareilly Sharif complex.",
        adabNote: "Check Hanafi Azan & Jamaat timings in the Prayer tab.",
      },
      {
        id: "bareilly-ifta",
        xPct: 72,
        yPct: 58,
        title: "Markazi Darul Ifta & Manuscript Wing",
        description: "Historic fatwa research chamber where Fatawa Razawiyya was compiled.",
        adabNote: "Pray for increase in beneficial sacred knowledge (Rabbi zidni 'ilma).",
      },
    ],
    books: [
      {
        title: "Kanzul Iman fi Tarjuma-til-Quran",
        arabicOrUrduTitle: "کنز الایمان فی ترجمۃ القرآن",
        genre: "Quran Translation",
        language: "Urdu (translated into English, Hindi, Bengali, Dutch, Turkish)",
        yearOrEra: "1330 AH / 1911 CE",
        summary: "The premier Sunni Urdu translation of the Holy Quran, faithful to classical Tafsir and Prophetic reverence.",
        excerpt: "Translated with utmost care for Divine Majesty, Prophetic etiquette, and Hanafi-Maturidi creed.",
        chapters: [
          {
            title: "Methodology of Kanzul Iman",
            content:
              "Unlike literalist word-for-word renderings that strip idiom and context, Kanzul Iman translates the intended meaning verified by classical Tafsir authorities such as Tafsir al-Jalalayn, Baydawi, and Ruh al-Bayan.",
          },
        ],
      },
      {
        title: "Fatawa Razawiyya (Al-Ataya an-Nabawiyyah fil-Fatawa ar-Radawiyyah)",
        arabicOrUrduTitle: "فتاویٰ رضویہ (۳۰ جلدیں)",
        genre: "Hanafi Jurisprudence Encyclopedia",
        language: "Urdu, Arabic & Persian",
        yearOrEra: "1286–1340 AH (30 Volumes, ~22,000 Pages)",
        summary: "Encyclopedic Hanafi legal rulings across Taharah, Salah, Zakat, Sawm, Hajj, Nikah, Waqf, and Aqaid.",
        excerpt: "Exhaustive textual proofs from Radd al-Muhtar, Fatawa Alamgiri, Hidaya, and classical Hanafi mutun.",
        chapters: [
          {
            title: "Kitab at-Taharah & Kitab as-Salah (Volumes 1–8)",
            content:
              "Covers the precise juristic rulings of water purity, Wudu, Ghusl, Hanafi prayer times (Mithlayn Asr, Subh Sadiq), Jamaat conditions, and Sajda-e-Sahw.",
          },
        ],
      },
      {
        title: "Hadaiq-e-Bakhshish",
        arabicOrUrduTitle: "حدائقِ بخشش",
        genre: "Devotional Naat & Salaam Diwan",
        language: "Urdu, Persian & Arabic",
        yearOrEra: "1325 AH",
        summary: "Celebrated anthology of Prophetic praise (Naat), Salaam, and Manqabat of Sayyiduna Ghaus-e-Azam.",
        excerpt: "Mustafa Jaan-e-Rehmat pe lakhon Salaam, Sham'a-e-Bazm-e-Hidayat pe lakhon Salaam.",
        chapters: [
          {
            title: "Salaam-e-Razavi",
            content:
              "Recited standing in reverence across Sunni mosques worldwide, praising the blessed attributes, miracles, and companions of the Final Messenger ﷺ.",
          },
        ],
      },
    ],
    murshidId: "ghaus-e-azam",
    khulafaNames: [
      "Hujjat-ul-Islam Hamid Raza Khan",
      "Mufti-e-Azam Mustafa Raza Khan",
      "Sadr-ush-Shariah Mufti Amjad Ali Aazmi (Author of Bahar-e-Shariat)",
      "Muballigh-e-Islam Abdul Aleem Siddiqi",
      "Burhan-e-Millat Burhanul Haq Jabalpuri",
    ],
    status: "Published",
  },
  {
    id: "banda-nawaz",
    slug: "khwaja-banda-nawaz-gesu-daraz",
    name: "Khwaja Banda Nawaz Gesu Daraz",
    urduName: "خواجہ بندہ نواز گیسو دراز",
    arabicName: "الخواجة بندا نواز كيسو دراز",
    alqab: ["Banda Nawaz", "Gesu Daraz", "Sultan-ul-Deccan", "Sayyid Muhammad al-Husayni"],
    silsila: "Chishti",
    wiladatHijri: "4 Rajab 721 AH (1321 CE)",
    wisalHijri: "16 Dhu al-Qi'dah 825 AH (1422 CE)",
    ursMonth: 11,
    ursDay: 16,
    ursLabel: "Urs Gulbarga Sharif (15–17 Dhu al-Qi'dah)",
    city: "Gulbarga Sharif",
    country: "India",
    lat: 17.3297,
    lng: 76.8343,
    shrineImage: "/images/shrines/ajmer.jpg",
    shortSummary:
      "Great Chishti master of the Deccan and disciple of Khwaja Nasiruddin Chiragh Dehlavi, author of over a hundred works in Arabic, Persian, and Dakhni.",
    fullTazkirah:
      "Sayyid Muhammad bin Yusuf al-Husayni (رحمة الله عليه), celebrated as Khwaja Banda Nawaz Gesu Daraz, was born in Delhi in 721 AH and trained under Khwaja Nasiruddin Mahmud Chiragh Dehlavi. After guiding seekers in Delhi for decades, he migrated south to Gulbarga Sharif in the Deccan at age eighty, where his Khanqah became the foremost seat of Chishti spirituality, Hanafi scholarship, and Dakhni literature.",
    earlyLifeAndEducation:
      "Born in Delhi on 4 Rajab 721 AH into a Husayni Sayyid lineage. Traveled briefly to Daulatabad in childhood before returning to Delhi to master Fiqh, Usul, Hadith, and Kalam.",
    spiritualLineageAndTraining:
      "Took Bay'at with Khwaja Nasiruddin Chiragh Dehlavi on 16 Rajab 736 AH and received his supreme Chishti Khilafat.",
    reformAndLegacy:
      "Authored over 105 books and treatises in Arabic, Persian, and Dakhni, harmonizing classical Tasawwuf with strict Hanafi-Maturidi creed across Southern India.",
    lifeTimeline: [
      { yearHijri: "4 Rajab 721 AH", title: "Birth in Delhi", detail: "Born into the Husayni Sayyid family of Sayyid Yusuf Husayni." },
      { yearHijri: "736 AH", title: "Bay'at with Chiragh Dehlavi", detail: "Entered the Chishti order under Khwaja Nasiruddin Mahmud." },
      { yearHijri: "803 AH", title: "Arrival in Gulbarga Sharif", detail: "Welcomed in the Deccan where he established his grand Khanqah and seminary." },
      { yearHijri: "16 Dhu al-Qi'dah 825 AH", title: "Blessed Wisal at Age 104", detail: "Laid to rest in the grand Bahmani-style Rauza in Gulbarga Sharif." },
    ],
    goldenSayings: [
      "The Tariqah never departs from the Shari'ah even by a hair's breadth.",
      "Keep your outward conduct bound to the Sunnah and your inward gaze fixed upon the pleasure of Allah.",
    ],
    dailyWird: {
      title: "Durood & Istighfar-e-Chishtiyyah",
      arabic: "أَسْتَغْفِرُ اللّٰهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَّأَتُوبُ إِلَيْهِ",
      transliteration: "Astaghfirullaha Rabbi min kulli dhanbin wa atubu ilayh",
      translation: "I seek forgiveness from Allah my Lord for every sin and turn to Him in repentance.",
      recommendedCount: 100,
    },
    architecturalDetails: {
      style: "Bahmani Deccan Indo-Persian Monumental Dome & Archways",
      eraBuilt: "825 AH / 1422 CE (Expanded in 1640 CE)",
      patronage: "Bahmani Sultanate Endowment",
      keyFeatures: [
        "Monumental Two-Tiered Bahmani Dome with Brass Finial",
        "Painted Persian & Arabic Calligraphic Ceiling Vaults",
        "Khwaja Banda Nawaz Library containing 10,000+ rare manuscripts",
      ],
      visitingHours: "Daily 5:00 AM to 10:00 PM",
      nearestLandmark: "Rauza Buzurg, Kalaburagi (Gulbarga), Karnataka",
    },
    gallery: [
      {
        id: "gulbarga-gal-1",
        title: "Rauza-e-Buzurg Bahmani Sanctuary",
        caption: "The grand Deccan courtyard and white dome of Dargah Khwaja Banda Nawaz in Gulbarga Sharif.",
        architecturalStyle: "Bahmani Deccan Architecture",
        era: "9th Century AH",
        imageUrl: "/images/shrines/ajmer.jpg",
        focalPoint: "55% 42%",
      },
    ],
    videos: [
      {
        id: "vid-gulbarga-1",
        title: "Khwaja Banda Nawaz Gesu Daraz: Torchbearer of Chishti Scholarship in the Deccan",
        duration: "06:15",
        category: "Documentary",
        description: "Chronicles the journey of Sayyid Muhammad al-Husayni from Delhi to Gulbarga Sharif and his literary legacy.",
        narrationScript: [
          "From the courts of Delhi to the heart of the Deccan in Gulbarga Sharif, Khwaja Banda Nawaz Gesu Daraz carried the lamp of Khwaja Nasiruddin Chiragh Dehlavi.",
          "Living over a century, he authored commentaries on Mashariq al-Anwar, Adab al-Muridin, and Jawami' al-Kalim.",
        ],
        chapters: [
          { time: "00:00", label: "Discipleship under Chiragh Dehlavi", summary: "Years of scholarship and spiritual service in Delhi." },
          { time: "03:20", label: "Sanctuary of Gulbarga Sharif", summary: "Establishment of the Deccan Khanqah and manuscript library." },
        ],
      },
    ],
    shajrahChain: [
      { generation: 1, name: "Sayyiduna Muhammad ﷺ", title: "Khatam-un-Nabiyyin", era: "Prophetic Era" },
      { generation: 2, name: "Sayyiduna Ali ibn Abi Talib (رضي الله عنه)", title: "Amir al-Mu'minin", era: "40 AH" },
      { generation: 3, name: "Khwaja Moinuddin Chishti", title: "Sultan-ul-Hind", era: "633 AH" },
      { generation: 4, name: "Khwaja Qutbuddin Bakhtiyar Kaki", title: "Qutb-ul-Aqtab of Delhi", era: "633 AH" },
      { generation: 5, name: "Baba Fariduddin Ganj Shakar", title: "Shaykh-ul-Islam of Pakpattan", era: "664 AH" },
      { generation: 6, name: "Hazrat Nizamuddin Auliya", title: "Mahboob-e-Ilahi", era: "725 AH" },
      { generation: 7, name: "Khwaja Nasiruddin Mahmud Chiragh Dehlavi", title: "Chiragh-e-Dehli", era: "757 AH" },
      { generation: 8, name: "Khwaja Banda Nawaz Gesu Daraz", title: "Sultan-ul-Deccan", era: "721–825 AH" },
    ],
    karamat: [
      "Authored Jawami' al-Kalim and Khatimah, guiding scholars and commoners alike in Deccan.",
      "Earned the loving title 'Gesu Daraz' from his Murshid Khwaja Nasiruddin Chiragh Dehlavi for his selfless devotion when carrying his Shaykh's palanquin.",
    ],
    adabZiyarat: [
      "Approach the Rauza with humility and recite Surah Yasin for the blessed Shaykh.",
      "Visit the historic library and reflect on his teachings uniting Shari'ah and Tariqah.",
    ],
    hotspots: [
      {
        id: "gulbarga-dome",
        xPct: 50,
        yPct: 34,
        title: "Bahmani Grand Dome of Rauza-e-Buzurg",
        description: "The monumental dome housing the resting place of Khwaja Banda Nawaz in Gulbarga Sharif.",
        adabNote: "Recite Surah Al-Fatihah and Durood Sharif.",
      },
      {
        id: "gulbarga-arch",
        xPct: 30,
        yPct: 58,
        title: "Kaman & Madrasah Courtyard",
        description: "Historic stone archways leading to the seminary and manuscript library.",
        adabNote: "Maintain quiet reverence in the courtyard.",
      },
    ],
    books: [
      {
        title: "Jawami' al-Kalim",
        arabicOrUrduTitle: "جوامع الکلم",
        genre: "Malfuzat",
        language: "Persian",
        yearOrEra: "802 AH",
        summary: "Discourses on spiritual states, Shari'ah adherence, and service to humanity.",
        excerpt: "The Tariqah never departs from the Shari'ah even by a hair's breadth.",
        chapters: [
          {
            title: "On the Harmony of Shari'ah and Haqiqah",
            content:
              "Every inward state is tested against the outward command of the Prophet ﷺ; whatever contradicts the Sunnah is an illusion of the ego.",
          },
        ],
      },
    ],
    murshidId: "nizamuddin-auliya",
    khulafaNames: ["Sayyid Shah Akbar Husayni", "Sayyid Shah Asghar Husayni"],
    status: "Published",
  },
  {
    id: "nizamuddin-auliya",
    slug: "nizamuddin-auliya",
    name: "Hazrat Nizamuddin Auliya",
    urduName: "حضرت نظام الدین اولیاء محبوبِ الٰہی",
    arabicName: "نظام الدين أولياء",
    alqab: ["Mahboob-e-Ilahi", "Sultan-ul-Mashaikh", "Zari Zard Bakhsh"],
    silsila: "Chishti",
    wiladatHijri: "27 Safar 636 AH (1238 CE)",
    wisalHijri: "18 Rabi' al-Thani 725 AH (1325 CE)",
    ursMonth: 4,
    ursDay: 18,
    ursLabel: "Urs Mahboob-e-Ilahi (18 Rabi' al-Thani)",
    city: "Delhi Sharif",
    country: "India",
    lat: 28.5912,
    lng: 77.2419,
    shrineImage: "/images/shrines/ajmer.jpg",
    shortSummary:
      "Sultan-ul-Mashaikh of Delhi, spiritual successor of Baba Farid Ganj Shakar, and mentor to Amir Khusrau and Khwaja Nasiruddin Chiragh.",
    fullTazkirah:
      "Shaykh Nizamuddin Muhammad Badayuni (رحمة الله عليه) was born in Badayun and raised by his pious mother Bibi Zulekha. After mastering Hadith (Mashariq al-Anwar) and Hanafi Fiqh in Delhi, he traveled to Ajodhan (Pakpattan) to take Bay'at with Baba Fariduddin Ganj Shakar. Returning to Ghiyaspur in Delhi, his Khanqah fed thousands daily while he remained fasting, teaching that bringing solace to a wounded heart is the highest path to Divine nearness.",
    earlyLifeAndEducation:
      "Born in Badayun in 636 AH; studied Hadith and Hanafi Jurisprudence in Delhi under Mawlana Kamaluddin Zahid and Shamsul Mulk.",
    spiritualLineageAndTraining:
      "Received the supreme Chishti Khilafat from Baba Fariduddin Mas'ud Ganj Shakar in Ajodhan.",
    reformAndLegacy:
      "His discourses, recorded in Fawa'id al-Fu'ad by Amir Hasan Sijzi, shaped centuries of Islamic ethics and spiritual literature across Hindustan.",
    lifeTimeline: [
      { yearHijri: "27 Safar 636 AH", title: "Birth in Badayun", detail: "Raised with deep reliance on Allah by his saintly mother Bibi Zulekha." },
      { yearHijri: "655 AH", title: "Bay'at with Baba Farid in Ajodhan", detail: "Welcomed by Baba Farid with the verse welcoming the new moon." },
      { yearHijri: "664 AH", title: "Establishment of the Ghiyaspur Khanqah in Delhi", detail: "Opened the doors of spiritual instruction and community Langar to all." },
      { yearHijri: "18 Rabi' al-Thani 725 AH", title: "Blessed Wisal in Delhi", detail: "Distributed all possessions to the poor before departing this world before sunrise." },
    ],
    goldenSayings: [
      "Ta'at-e-Muta'addi (worship whose benefit reaches others, like feeding the hungry and comforting the sad) surpasses worship confined to oneself.",
      "Forgive the one who wrongs you, and wish good for all creation.",
    ],
    dailyWird: {
      title: "Tasbih-e-Mahboob-e-Ilahi",
      arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهٖ سُبْحَانَ اللّٰهِ الْعَظِيمِ وَبِحَمْدِهٖ أَسْتَغْفِرُ اللّٰهَ",
      transliteration: "SubhanAllahi wa bihamdihi SubhanAllahil-'Azimi wa bihamdihi Astaghfirullah",
      translation: "Glory be to Allah and praise be to Him; Glory be to Allah the Supreme and praise be to Him; I seek Allah's forgiveness.",
      recommendedCount: 100,
    },
    architecturalDetails: {
      style: "Sultanate & Mughal Fluted White Marble Dome & Red Sandstone Khilji Mosque",
      eraBuilt: "725 AH / 1325 CE (Dome rebuilt in marble 970 AH)",
      patronage: "Khalji & Mughal Endowments",
      keyFeatures: [
        "Fluted White Marble Dome with Mother-of-Pearl Canopy",
        "Adjacent Jama'at Khana Masjid (Red Sandstone Khalji Mosque)",
        "Nizamuddin Baoli (Historic Stepwell blessed by the Shaykh)",
        "Resting Enclosure of Hazrat Amir Khusrau in the Forecourt",
      ],
      visitingHours: "Daily 5:00 AM to 10:00 PM",
      nearestLandmark: "Nizamuddin West, New Delhi",
    },
    gallery: [
      {
        id: "nizam-gal-1",
        title: "Marble Jali & Fluted Dome of Mahboob-e-Ilahi",
        caption: "Intricate marble lattice screens (jali) and fluted dome at Dargah Hazrat Nizamuddin Auliya, Delhi.",
        architecturalStyle: "Sultanate-Mughal Marble Sanctuary",
        era: "8th–10th Century AH",
        imageUrl: "/images/shrines/ajmer.jpg",
        focalPoint: "45% 40%",
      },
    ],
    videos: [
      {
        id: "vid-nizam-1",
        title: "Fawa'id al-Fu'ad & the Khanqah of Hazrat Nizamuddin Auliya",
        duration: "06:30",
        category: "Documentary",
        description: "How Sultan-ul-Mashaikh transformed Delhi through compassion, Hadith scholarship, and Langar.",
        narrationScript: [
          "At Ghiyaspur on the banks of the Yamuna, Hazrat Nizamuddin Auliya fasted continuously while his kitchen fed thousands of visitors every day.",
          "His discourses in Fawa'id al-Fu'ad emphasize sincerity, forgiveness, and serving the distressed.",
        ],
        chapters: [
          { time: "00:00", label: "Badayun to Ajodhan", summary: "Upbringing under Bibi Zulekha and training under Baba Farid." },
          { time: "03:15", label: "Teachings of Fawa'id al-Fu'ad", summary: "Why service to humanity excels solitary supererogatory acts." },
        ],
      },
    ],
    shajrahChain: [
      { generation: 1, name: "Sayyiduna Muhammad ﷺ", title: "Khatam-un-Nabiyyin", era: "Prophetic Era" },
      { generation: 2, name: "Sayyiduna Ali ibn Abi Talib (رضي الله عنه)", title: "Amir al-Mu'minin", era: "40 AH" },
      { generation: 3, name: "Khwaja Usman Harooni", title: "Chishti Master", era: "617 AH" },
      { generation: 4, name: "Khwaja Moinuddin Chishti", title: "Sultan-ul-Hind", era: "633 AH" },
      { generation: 5, name: "Khwaja Qutbuddin Bakhtiyar Kaki", title: "Qutb of Delhi", era: "633 AH" },
      { generation: 6, name: "Baba Fariduddin Mas'ud Ganj Shakar", title: "Ganj-e-Shakar of Pakpattan", era: "664 AH" },
      { generation: 7, name: "Hazrat Nizamuddin Auliya", title: "Mahboob-e-Ilahi", era: "636–725 AH" },
    ],
    karamat: [
      "Mentored Amir Khusrau and Khwaja Nasiruddin Chiragh, spreading Chishti compassion across North India and the Deccan.",
      "Blessed the Nizamuddin Baoli stepwell when lamps were denied to its builders, turning its water into a source of relief.",
    ],
    adabZiyarat: [
      "Pay respects first at the enclosure of his devoted disciple Hazrat Amir Khusrau in the outer courtyard.",
      "Maintain silence in the marble veranda and offer Fatiha and Durood Sharif.",
    ],
    hotspots: [
      {
        id: "nizam-dome",
        xPct: 52,
        yPct: 33,
        title: "Fluted Marble Dome of Mahboob-e-Ilahi",
        description: "The white marble sanctum crowned with a golden finial in Ghiyaspur, Delhi.",
        adabNote: "Recite Surah Al-Fatihah and Durood Sharif.",
      },
      {
        id: "nizam-masjid",
        xPct: 24,
        yPct: 50,
        title: "Jama'at Khana Red Sandstone Masjid",
        description: "14th-century Khalji mosque immediately west of the sanctum where the Shaykh prayed in congregation.",
        adabNote: "Offer 2 Rak'at Tahiyyat-ul-Masjid outside Makruh windows.",
      },
    ],
    books: [
      {
        title: "Fawa'id al-Fu'ad (Morals for the Heart)",
        arabicOrUrduTitle: "فوائد الفؤاد",
        genre: "Malfuzat (188 Assemblies, 707–722 AH)",
        language: "Persian (with Urdu & English translations)",
        yearOrEra: "707–722 AH",
        summary: "Spiritual discourses compiled over fifteen years by Amir Hasan Ala Sijzi and personally reviewed by the Shaykh.",
        excerpt: "Ta'at-e-Muta'addi (service that benefits others) is superior to solitary worship.",
        chapters: [
          {
            title: "Part 1: On Sincerity, Repentance & Forgiveness",
            content:
              "True repentance consists of three things: remorse in the heart for past neglect, immediate abandonment of the sin, and firm resolve never to return to it while compensating any rights owed to people.",
          },
        ],
      },
    ],
    murshidId: "khwaja-moinuddin",
    khulafaNames: [
      "Khwaja Nasiruddin Mahmud Chiragh Dehlavi",
      "Hazrat Amir Khusrau Dehlavi",
      "Shaykh Burhanuddin Gharib (Khuldabad)",
      "Shaykh Akhi Siraj Aina-e-Hind (Bengal)",
    ],
    status: "Published",
  },
  {
    id: "mujaddid-alf-thani",
    slug: "mujaddid-alf-thani",
    name: "Imam Rabbani Mujaddid Alf Thani",
    urduName: "امام ربانی مجدد الف ثانی شیخ احمد سرہندی",
    arabicName: "الإمام الرباني مجدد الألف الثاني",
    alqab: ["Mujaddid Alf Thani", "Imam Rabbani", "Qayyum-e-Zaman", "Badruddin Sirhindi"],
    silsila: "Naqshbandi",
    wiladatHijri: "14 Shawwal 971 AH (1564 CE)",
    wisalHijri: "28 Safar 1034 AH (1624 CE)",
    ursMonth: 2,
    ursDay: 28,
    ursLabel: "Urs Mujaddid Alf Thani (28 Safar)",
    city: "Sirhind Sharif",
    country: "India",
    lat: 30.6435,
    lng: 76.3842,
    shrineImage: "/images/shrines/bareilly.jpg",
    shortSummary:
      "Renewer of the Second Islamic Millennium and pillar of the Naqshbandi-Mujaddidi order, author of Maktubat-e-Imam Rabbani.",
    fullTazkirah:
      "Shaykh Ahmad Faruqi Sirhindi (رحمة الله عليه), descendant of Sayyiduna Umar al-Faruq (رضي الله عنه), was born in Sirhind in 971 AH. After mastering Hadith, Tafsir, and Kalam in Sialkot and Agra, he took Bay'at in Delhi with Khwaja Baqi Billah, attaining the highest peaks of Naqshbandi Wilayat in just over two months. At the turn of the second Islamic millennium (1000 AH), he stood like a fortress against syncretic innovations, authoring 536 luminous epistles (Maktubat) that restored the supremacy of the Prophetic Sunnah and Sunni Hanafi-Maturidi creed.",
    earlyLifeAndEducation:
      "Born in Sirhind in 971 AH; memorized the Quran early and studied rational and transmitted sciences under his father Shaykh Abdul Ahad Faruqi and Mawlana Kamal Kashmiri in Sialkot.",
    spiritualLineageAndTraining:
      "Already holding Chishti, Qadri, and Suhrawardi Ijazah from his father, he met Khwaja Muhammad Baqi Billah in Delhi in 1008 AH and received the supreme Naqshbandi Khilafat.",
    reformAndLegacy:
      "His Maktubat-e-Imam Rabbani reformed the Mughal court and scholars alike, establishing the Naqshbandi-Mujaddidi branch that spread across Central Asia, Ottoman lands, Syria, and South Asia.",
    lifeTimeline: [
      { yearHijri: "14 Shawwal 971 AH", title: "Birth in Sirhind Sharif", detail: "Born into the Faruqi lineage tracing back to Sayyiduna Umar ibn al-Khattab." },
      { yearHijri: "1008 AH", title: "Naqshbandi Bay'at with Khwaja Baqi Billah", detail: "Attained Nisbat-e-Naqshbandiyyah and supreme Khilafat in Delhi." },
      { yearHijri: "1028 AH", title: "Steadfastness at Gwalior Fort", detail: "Refused prostration to the royal throne, transforming Gwalior Fort into a sanctuary of guidance." },
      { yearHijri: "28 Safar 1034 AH", title: "Blessed Wisal in Sirhind Sharif", detail: "Laid to rest at Rauza Sharif, Sirhind." },
    ],
    goldenSayings: [
      "Reviving a single neglected Sunnah of Sayyiduna Muhammad ﷺ is superior to a thousand years of self-invented austerity.",
      "The Shari'ah has three parts: Knowledge ('Ilm), Action ('Amal), and Sincerity (Ikhlas); unless all three are realized, the Shari'ah is not fulfilled.",
    ],
    dailyWird: {
      title: "Dhikr-e-Qalbi & Durood-e-Mujaddidiyyah",
      arabic: "اللّٰهُ حَاضِرِي اللّٰهُ نَاظِرِي اللّٰهُ مَعِي • اللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَّبَارِكْ وَسَلِّمْ",
      transliteration: "Allahu Hadiri, Allahu Naziri, Allahu Ma'i • Allahumma Salli 'ala Sayyidina Muhammadin wa Barik wa Sallim",
      translation: "Allah is my Witness, Allah watches over me, Allah is with me.",
      recommendedCount: 100,
    },
    architecturalDetails: {
      style: "Mughal-Punjab Domed Sanctuary & Brick-Marble Complex (Rauza Sharif)",
      eraBuilt: "1034 AH / 1624 CE",
      patronage: "Naqshbandi-Mujaddidi Waqf",
      keyFeatures: [
        "Main White-Domed Sanctuary of Rauza Sharif",
        "Mazar of Khwaja Muhammad Ma'sum (Urwat-ul-Wuthqa) nearby",
        "Historic Mosque & Naqshbandi Muraqabah Hall",
      ],
      visitingHours: "Daily from Fajr until Isha",
      nearestLandmark: "Rauza Sharif, Fatehgarh Sahib, Sirhind, Punjab",
    },
    gallery: [
      {
        id: "sirhind-gal-1",
        title: "Rauza Sharif Sanctuary in Sirhind",
        caption: "The tranquil courtyard and dome of Imam Rabbani Mujaddid Alf Thani at Rauza Sharif, Sirhind.",
        architecturalStyle: "Mughal-Naqshbandi Sanctuary",
        era: "11th Century AH",
        imageUrl: "/images/shrines/bareilly.jpg",
        focalPoint: "50% 45%",
      },
    ],
    videos: [
      {
        id: "vid-sirhind-1",
        title: "Renewer of the Second Millennium: Maktubat of Imam Rabbani",
        duration: "07:00",
        category: "Documentary",
        description: "How Shaykh Ahmad Sirhindi revived the Sunnah and clarified Sunni creed through his 536 letters.",
        narrationScript: [
          "At the dawn of the second Islamic millennium, Shaykh Ahmad Faruqi Sirhindi wrote letters to scholars, governors, and seekers across the empire.",
          "His three volumes of Maktubat demonstrate that true Tasawwuf is the servant of the Shari'ah and produces steadfastness upon the Sunnah.",
        ],
        chapters: [
          { time: "00:00", label: "Lineage from Sayyiduna Umar al-Faruq", summary: "Early education in Sirhind and Sialkot." },
          { time: "03:30", label: "The 536 Epistles (Maktubat)", summary: "Uniting Shari'ah, Tariqah, and Haqiqah." },
        ],
      },
    ],
    shajrahChain: [
      { generation: 1, name: "Sayyiduna Muhammad ﷺ", title: "Khatam-un-Nabiyyin", era: "Prophetic Era" },
      { generation: 2, name: "Sayyiduna Abu Bakr as-Siddiq (رضي الله عنه)", title: "Khalifat-ur-Rasul", era: "13 AH" },
      { generation: 3, name: "Sayyiduna Salman al-Farisi & Qasim ibn Muhammad", title: "Companions & Tabi'in", era: "35–107 AH" },
      { generation: 4, name: "Imam Ja'far as-Sadiq & Bayazid al-Bistami", title: "Early Masters of the Golden Chain", era: "148–261 AH" },
      { generation: 5, name: "Khwaja Abdul Khaliq al-Ghujdawani", title: "Codifier of the 8 Naqshbandi Principles", era: "575 AH" },
      { generation: 6, name: "Shah Baha'uddin Naqshband Bukhari", title: "Imam of the Naqshbandiyyah", era: "791 AH" },
      { generation: 7, name: "Khwaja Ubaydullah Ahrar & Khwaja Baqi Billah", title: "Transmitters to Hindustan", era: "895–1012 AH" },
      { generation: 8, name: "Imam Rabbani Mujaddid Alf Thani Shaykh Ahmad Sirhindi", title: "Renewer of the 2nd Millennium", era: "971–1034 AH" },
    ],
    karamat: [
      "Steadfastly upheld Prophetic Sunnah even through imprisonment at Gwalior Fort, guiding prisoners and guards alike to repentance.",
      "Authored 536 letters (Maktubat) that remain studied in Arabic, Persian, Ottoman Turkish, and Urdu madrasahs worldwide.",
    ],
    adabZiyarat: [
      "Recite silent Naqshbandi Khatm-e-Khwajagan and Durood Sharif.",
      "Guard the Sunnah in dress, prayer, and character when visiting Rauza Sharif.",
    ],
    hotspots: [
      {
        id: "sirhind-dome",
        xPct: 50,
        yPct: 38,
        title: "Rauza Sharif Central Dome",
        description: "The resting sanctuary of Imam Rabbani Shaykh Ahmad Faruqi Sirhindi.",
        adabNote: "Offer silent Dhikr-e-Qalbi, Surah Al-Fatihah, and 11x Surah Al-Ikhlas.",
      },
      {
        id: "sirhind-masjid",
        xPct: 28,
        yPct: 55,
        title: "Rauza Sharif Mosque & Muraqabah Veranda",
        description: "Historic prayer hall where Naqshbandi circles of Muraqabah and Hadith study are held.",
        adabNote: "Observe complete silence and inward attentiveness.",
      },
    ],
    books: [
      {
        title: "Maktubat-e-Imam Rabbani (3 Volumes, 536 Letters)",
        arabicOrUrduTitle: "مکتوباتِ امام ربانی",
        genre: "Epistles on Creed, Sunnah & Tasawwuf",
        language: "Persian (translated into Arabic by Shaykh Muhammad Murad al-Makki & Urdu)",
        yearOrEra: "1008–1034 AH",
        summary: "Three volumes of letters clarifying Ahl-e-Sunnat Aqaid, Wahdat ash-Shuhud, and the primacy of the Sunnah.",
        excerpt: "All spiritual states are subservient to following the Sunnah of Sayyiduna Muhammad ﷺ.",
        chapters: [
          {
            title: "Volume 1, Letter 36: On Knowledge, Action, and Sincerity",
            content:
              "The Shari'ah guarantees all felicity in this world and the Hereafter. Tasawwuf and Tariqah are not independent of the Shari'ah; rather, they serve to perfect its third pillar—sincerity (Ikhlas).",
          },
        ],
      },
      {
        title: "Ithbat an-Nubuwwah",
        arabicOrUrduTitle: "إثبات النبوة",
        genre: "Theology (Ilm al-Kalam)",
        language: "Arabic",
        yearOrEra: "10th Century AH",
        summary: "Early Arabic treatise proving the necessity of Prophethood and the finality of Sayyiduna Muhammad ﷺ.",
        excerpt: "Human intellect without Prophetic revelation is like an eye without sunlight.",
        chapters: [
          {
            title: "Chapter 1: Why Intellect Needs Revelation",
            content:
              "Just as the healthiest eye cannot see colors in total darkness until the sun rises, the sharpest intellect cannot know the unseen realities of the Hereafter without the light of Prophethood.",
          },
        ],
      },
    ],
    murshidId: "ghaus-e-azam",
    khulafaNames: [
      "Khwaja Muhammad Ma'sum (Urwat-ul-Wuthqa)",
      "Khwaja Muhammad Sa'id (Khazin-ur-Rahmat)",
      "Shaikh Adam Banuri",
      "Mir Muhammad Nu'man",
    ],
    status: "Published",
  },
  {
    id: "data-ganj-bakhsh",
    slug: "data-ganj-bakhsh-hujwiri",
    name: "Data Ganj Bakhsh Syed Ali Hujwiri",
    urduName: "داتا گنج بخش سید علی ہجویری",
    arabicName: "أبو الحسن علي بن عثمان الهجويري",
    alqab: ["Data Ganj Bakhsh", "Ganj Bakhsh Faiz-e-Alam", "Makhdoom-ul-Auliya", "Abul Hasan al-Hujwiri"],
    silsila: "Qadri",
    wiladatHijri: "400 AH (1009 CE)",
    wisalHijri: "20 Safar 465 AH (1072 CE)",
    ursMonth: 2,
    ursDay: 20,
    ursLabel: "Urs Data Darbar (20 Safar)",
    city: "Lahore Sharif",
    country: "Pakistan",
    lat: 31.5763,
    lng: 74.3046,
    shrineImage: "/images/shrines/baghdad.jpg",
    shortSummary:
      "Patron saint of Lahore and author of Kashf al-Mahjub, the earliest comprehensive Persian treatise on Sunni Tasawwuf.",
    fullTazkirah:
      "Sayyid Abul Hasan Ali bin Uthman al-Jullabi al-Hujwiri (رحمة الله عليه) was born in Ghazni around 400 AH. A Hanafi jurist and spiritual disciple of Shaykh Abul Fadl Muhammad bin al-Hasan al-Khuttali in the Junaydi line, he traveled across Syria, Iraq, Khurasan, and Transoxiana meeting over three hundred Sufi masters before being directed by his Murshid to settle in Lahore. There he built a mosque aligning the Qibla accurately for the scholars of Lahore and authored Kashf al-Mahjub—the foundational manual of orthodox Sunni Sufism.",
    earlyLifeAndEducation:
      "Born in the neighborhoods of Jullab and Hujwir in Ghazni (Afghanistan); mastered Hanafi Fiqh, Kalam, and Hadith under Shaykh Abul Abbas Ahmad al-Ashqani.",
    spiritualLineageAndTraining:
      "Initiated by Shaykh Abul Fadl al-Khuttali (whose chain reaches Junayd al-Baghdadi) and also benefited from Shaykh Abul Qasim al-Gurgani.",
    reformAndLegacy:
      "His sanctuary in Lahore (Data Darbar) became the spiritual gateway of South Asia; Khwaja Moinuddin Chishti performed a forty-day Chilla at his shrine and proclaimed him 'Ganj Bakhsh, Faiz-e-Alam, Mazhar-e-Noor-e-Khuda'.",
    lifeTimeline: [
      { yearHijri: "400 AH", title: "Birth in Hujwir & Jullab, Ghazni", detail: "Born into a pious Hasani Sayyid household." },
      { yearHijri: "420–430 AH", title: "Journeys Across Damascus, Baghdad & Khurasan", detail: "Met over 300 Sufi masters and studied Hanafi jurisprudence." },
      { yearHijri: "431 AH", title: "Arrival in Lahore by Command of His Shaykh", detail: "Established his mosque and Khanqah outside Bhati Gate, Lahore." },
      { yearHijri: "450 AH", title: "Authorship of Kashf al-Mahjub", detail: "Wrote the premier Persian encyclopedia of Sunni Tasawwuf in response to Abu Sa'id al-Hujwiri's questions." },
      { yearHijri: "20 Safar 465 AH", title: "Blessed Wisal in Lahore Sharif", detail: "Laid to rest beside the mosque he built in Lahore." },
    ],
    goldenSayings: [
      "All of Sufism is etiquette (Adab): for every time, every state, and every station there is a fitting etiquette.",
      "Knowledge without action is a body without a spirit, and action without knowledge is a form without life.",
    ],
    dailyWird: {
      title: "Tasbih & Salawat at Data Darbar",
      arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ الْمَلِكُ الْحَقُّ الْمُبِينُ • مُحَمَّدٌ رَّسُولُ اللّٰهِ صَادِقُ الْوَعْدِ الْأَمِينُ",
      transliteration: "La ilaha illallahul-Malikul-Haqqul-Mubin • Muhammadur-Rasulullahi Sadiqul-Wa'dil-Amin",
      translation: "There is none worthy of worship except Allah, the Sovereign, the Clear Truth; Muhammad ﷺ is the Messenger of Allah, true to his promise and trustworthy.",
      recommendedCount: 100,
    },
    architecturalDetails: {
      style: "Ghaznavid-Mughal & Modern White Marble Complex",
      eraBuilt: "465 AH / 1072 CE (Expanded by Sultan Ibrahim Ghaznavi & 20th-century marble complex)",
      patronage: "Ghaznavid Endowment & Auqaf Punjab",
      keyFeatures: [
        "White Marble Domed Mausoleum of Data Ganj Bakhsh",
        "Chilla Gah of Khwaja Moinuddin Chishti overlooking the courtyard",
        "Grand Data Darbar Jamia Masjid (accommodating 50,000+ worshippers)",
        "24-Hour Sama' & Quran Recitation Veranda and Community Langar",
      ],
      visitingHours: "Open 24 Hours Daily",
      nearestLandmark: "Bhati Gate, Lahore, Punjab",
    },
    gallery: [
      {
        id: "lahore-gal-1",
        title: "Data Darbar Sanctuary & Courtyard",
        caption: "The illuminated sanctuary and grand courtyard of Hazrat Data Ganj Bakhsh Ali Hujwiri in Lahore.",
        architecturalStyle: "Ghaznavid-Mughal Marble Sanctuary",
        era: "5th Century AH",
        imageUrl: "/images/shrines/baghdad.jpg",
        focalPoint: "45% 45%",
      },
    ],
    videos: [
      {
        id: "vid-lahore-1",
        title: "Kashf al-Mahjub & the Legacy of Data Ganj Bakhsh in Lahore",
        duration: "06:45",
        category: "Documentary",
        description: "Explores how Sayyid Ali Hujwiri authored Kashf al-Mahjub from memory in Lahore and laid the foundations of Tasawwuf in South Asia.",
        narrationScript: [
          "Arriving in Lahore in the fifth century Hijri, Sayyid Ali bin Uthman al-Hujwiri built a mosque and began teaching Quran, Hanafi Fiqh, and spiritual ethics.",
          "Though his books had been left behind in Ghazni, he composed Kashf al-Mahjub in Lahore—proving that authentic Sufism is inseparable from the Shari'ah.",
        ],
        chapters: [
          { time: "00:00", label: "Ghazni to Lahore", summary: "Travels across the Muslim world and arrival in Lahore." },
          { time: "03:20", label: "The Eleven Veils in Kashf al-Mahjub", summary: "How unveiling of Gnosis, Salah, Zakat, and Hajj transforms the seeker." },
        ],
      },
    ],
    shajrahChain: [
      { generation: 1, name: "Sayyiduna Muhammad ﷺ", title: "Khatam-un-Nabiyyin", era: "Prophetic Era" },
      { generation: 2, name: "Sayyiduna Ali ibn Abi Talib (رضي الله عنه)", title: "Amir al-Mu'minin", era: "40 AH" },
      { generation: 3, name: "Imam Hasan al-Basri & Dawud at-Ta'i", title: "Early Masters", era: "110–165 AH" },
      { generation: 4, name: "Sayyidat-ut-Ta'ifah Junayd al-Baghdadi", title: "Imam of Baghdad", era: "297 AH" },
      { generation: 5, name: "Shaykh Abu Bakr ash-Shibli & Abul Hasan al-Husri", title: "Junaydi Masters", era: "334–371 AH" },
      { generation: 6, name: "Shaykh Abul Fadl Muhammad al-Khuttali", title: "Murshid of Data Ganj Bakhsh", era: "450 AH" },
      { generation: 7, name: "Data Ganj Bakhsh Sayyid Ali Hujwiri", title: "Author of Kashf al-Mahjub & Patron of Lahore", era: "400–465 AH" },
    ],
    karamat: [
      "Wrote Kashf al-Mahjub without his personal library in Lahore, purely from illumined memory and scholarship.",
      "Established the Qibla direction of his mosque in Lahore with miraculous accuracy verified by scholars.",
    ],
    adabZiyarat: [
      "Offer Durood Sharif and recite Surah Al-Fatihah and Surah Al-Ikhlas.",
      "Visit the Chilla-Gah of Khwaja Moinuddin Chishti adjacent to the main sanctuary.",
    ],
    hotspots: [
      {
        id: "lahore-dome",
        xPct: 56,
        yPct: 32,
        title: "Mazar-e-Aqdas of Data Ganj Bakhsh",
        description: "The central domed chamber housing the blessed resting place of Sayyid Ali Hujwiri.",
        adabNote: "Recite 'Ganj Bakhsh Faiz-e-Alam Mazhar-e-Noor-e-Khuda' and offer Fatiha.",
      },
      {
        id: "lahore-chilla",
        xPct: 28,
        yPct: 58,
        title: "Chilla-Gah of Khwaja Gharib Nawaz",
        description: "Elevated meditation chamber where Khwaja Moinuddin Chishti spent 40 days in seclusion.",
        adabNote: "Engage in quiet Dhikr and Salawat.",
      },
    ],
    books: [
      {
        title: "Kashf al-Mahjub (Unveiling of the Veiled)",
        arabicOrUrduTitle: "کشف المحجوب",
        genre: "Classical Sunni Tasawwuf & Biographies of Saints",
        language: "Persian (translated into Urdu, Arabic & English by R.A. Nicholson)",
        yearOrEra: "Mid-5th Century AH",
        summary: "Foundational manual on Sunni Sufism, Adab, biographies of the Sahabah, Ahl al-Bayt, Imams (including Imam Abu Hanifa), and the lifting of 11 spiritual veils.",
        excerpt: "Sufism is pure etiquette (Adab) in every moment, state, and station.",
        chapters: [
          {
            title: "Chapter on Imam Abu Hanifa (رحمة الله عليه) as a Master of Tasawwuf",
            content:
              "Sayyid Ali Hujwiri places Imam-e-Azam Abu Hanifa at the forefront of the jurists who combined outward mastery of the Shari'ah with night-long devotion, asceticism, and spiritual insight.",
          },
          {
            title: "Uncovering the First Veil: Gnosis of Allah (Ma'rifat)",
            content:
              "Sound gnosis of Allah begins with affirming His Oneness and Attributes free from anthropomorphism, followed by humble submission to His commands.",
          },
        ],
      },
    ],
    khulafaNames: ["Rai Raju (Shaykh Hindi)", "Khwaja Moinuddin Chishti (Faidh-e-Uwaisi at Data Darbar)"],
    status: "Published",
  },
];
