export interface ZiyaratHotspot {
  id: string;
  xPct: number;
  yPct: number;
  title: string;
  description: string;
  adabNote: string;
}

export interface AuthoredBook {
  title: string;
  arabicOrUrduTitle: string;
  genre: string;
  summary: string;
  excerpt: string;
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
  karamat: string[];
  adabZiyarat: string[];
  hotspots: ZiyaratHotspot[];
  books: AuthoredBook[];
  murshidId?: string;
  khulafaNames: string[];
  status: "Published" | "Scholarly Verification" | "Draft";
}

export const AULIYA_DATA: AuliyaProfile[] = [
  {
    id: "ghaus-e-azam",
    slug: "shaikh-abdul-qadir-jilani",
    name: "Shaikh Abdul Qadir Jilani",
    urduName: "غوثِ اعظم شیخ عبد القادر جیلانی",
    arabicName: "الشيخ عبد القادر الجيلاني",
    alqab: ["Ghaus-e-Azam", "Muhyiddin", "Pir-e-Piran", "Sultan-ul-Auliya"],
    silsila: "Qadri",
    wiladatHijri: "1 Ramadan 470 AH",
    wisalHijri: "11 Rabi' al-Thani 561 AH",
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
      "Sayyiduna Shaykh Muhyiddin Abdul Qadir al-Jilani (رضي الله عنه) was born in Jilan in 470 AH and arrived in Baghdad at age eighteen to master Hanbali and Shafi'i jurisprudence, Hadith, and spiritual purification. At the Bab al-Azaj seminary, thousands gathered to hear his discourses that softened hardened hearts and revived Sunnah.",
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
        summary: "Comprehensive manual of Sunni creed, worship etiquette, and spiritual discipline.",
        excerpt: "The foundation of every spiritual station is adherence to the Book of Allah and the Sunnah of His Messenger ﷺ.",
      },
      {
        title: "Futuh al-Ghayb",
        arabicOrUrduTitle: "فتوح الغيب",
        genre: "78 Spiritual Discourses",
        summary: "Timeless counsel on reliance upon Allah (Tawakkul), sincerity, and overcoming the ego (Nafs).",
        excerpt: "Be with Allah as if creation does not exist, and be with creation without expectation from your ego.",
      },
    ],
    khulafaNames: ["Shaikh Abdur Razzaq Jilani", "Shaikh Ali bin Hiti", "Shaikh Shihabuddin Suhrawardi"],
    status: "Published",
  },
  {
    id: "khwaja-moinuddin",
    slug: "khwaja-moinuddin-chishti",
    name: "Khwaja Moinuddin Chishti",
    urduName: "خواجہ معین الدین چشتی اجمیری",
    arabicName: "الخواجة معين الدين الجشتي",
    alqab: ["Sultan-ul-Hind", "Gharib Nawaz", "Ata-e-Rasool", "Hind-al-Wali"],
    silsila: "Chishti",
    wiladatHijri: "14 Rajab 536 AH",
    wisalHijri: "6 Rajab 633 AH",
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
      "Khwaja Moinuddin Hasan Chishti (رحمة الله عليه) was born in Sijistan and received spiritual Khilafat from Khwaja Usman Harooni. Guided to Madinah Munawwarah and blessed with the command to illuminate Hindustan, he settled in Ajmer Sharif where millions found Islam through his mercy and selfless service.",
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
    ],
    books: [
      {
        title: "Anis al-Arwah",
        arabicOrUrduTitle: "أنيس الأرواح",
        genre: "Malfuzat",
        summary: "Recorded spiritual discourses of his Murshid, Khwaja Usman Harooni.",
        excerpt: "True devotion is to bring comfort to a broken heart and feed the hungry.",
      },
    ],
    murshidId: "ghaus-e-azam",
    khulafaNames: ["Khwaja Qutbuddin Bakhtiyar Kaki", "Shaikh Hamiduddin Nagauri"],
    status: "Published",
  },
  {
    id: "ala-hazrat",
    slug: "imam-ahmad-raza-khan-barelvi",
    name: "Imam Ahmad Raza Khan Barelvi",
    urduName: "اعلیٰ حضرت امام احمد رضا خان بریلوی",
    arabicName: "الإمام أحمد رضا خان البريلوي",
    alqab: ["Ala Hazrat", "Mujaddid of 14th Century AH", "Imam-e-Ahl-e-Sunnat", "Fazil-e-Barelvi"],
    silsila: "Razavi",
    wiladatHijri: "10 Shawwal 1272 AH",
    wisalHijri: "25 Safar 1340 AH",
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
      "Imam Ahmad Raza Khan Qadri Barkati Barelvi (رحمة الله عليه) mastered over fifty Islamic and rational sciences, issuing thousands of juristic verdicts in the 30-volume Fatawa Razawiyya. His Urdu Quran translation Kanzul Iman stands as the gold standard of Sunni reverence for the Divine Majesty and Prophetic honor.",
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
    ],
    books: [
      {
        title: "Kanzul Iman fi Tarjuma-til-Quran",
        arabicOrUrduTitle: "کنز الایمان",
        genre: "Quran Translation",
        summary: "The premier Sunni-Barelvi Urdu translation of the Holy Quran.",
        excerpt: "Translated with utmost care for Prophetic etiquette and Hanafi-Maturidi creed.",
      },
      {
        title: "Fatawa Razawiyya (30 Volumes)",
        arabicOrUrduTitle: "فتاویٰ رضویہ",
        genre: "Hanafi Jurisprudence",
        summary: "Encyclopedic Hanafi legal rulings across Ibadat, Mu'amalat, and Aqaid.",
        excerpt: "Exhaustive textual proofs from classical Hanafi mutun and shuruh.",
      },
    ],
    murshidId: "ghaus-e-azam",
    khulafaNames: ["Hujjat-ul-Islam Hamid Raza Khan", "Mufti-e-Azam Mustafa Raza Khan", "Sadr-ush-Shariah Amjad Ali Aazmi"],
    status: "Published",
  },
  {
    id: "banda-nawaz",
    slug: "khwaja-banda-nawaz-gesu-daraz",
    name: "Khwaja Banda Nawaz Gesu Daraz",
    urduName: "خواجہ بندہ نواز گیسو دراز",
    arabicName: "الخواجة بندا نواز كيسو دراز",
    alqab: ["Banda Nawaz", "Gesu Daraz", "Sultan-ul-Deccan"],
    silsila: "Chishti",
    wiladatHijri: "4 Rajab 721 AH",
    wisalHijri: "16 Dhu al-Qi'dah 825 AH",
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
      "Sayyid Muhammad al-Husayni (رحمة الله عليه), celebrated as Khwaja Banda Nawaz Gesu Daraz, illuminated the Deccan from Gulbarga Sharif, authoring foundational commentaries on Tafsir, Fiqh, and Tasawwuf while pioneering Dakhni Urdu prose.",
    karamat: [
      "Authored Jawami' al-Kalim and Khatimah, guiding scholars and commoners alike in Deccan.",
    ],
    adabZiyarat: [
      "Approach the Rauza with humility and recite Surah Yasin for the blessed Shaykh.",
    ],
    hotspots: [],
    books: [
      {
        title: "Jawami' al-Kalim",
        arabicOrUrduTitle: "جوامع الکلم",
        genre: "Malfuzat",
        summary: "Discourses on spiritual states, Shari'ah adherence, and service to humanity.",
        excerpt: "The Tariqah never departs from the Shari'ah even by a hair's breadth.",
      },
    ],
    murshidId: "nizamuddin-auliya",
    khulafaNames: ["Shah Akbar Husayni"],
    status: "Published",
  },
  {
    id: "nizamuddin-auliya",
    slug: "nizamuddin-auliya",
    name: "Hazrat Nizamuddin Auliya",
    urduName: "حضرت نظام الدین اولیاء محبوبِ الٰہی",
    arabicName: "نظام الدين أولياء",
    alqab: ["Mahboob-e-Ilahi", "Sultan-ul-Mashaikh"],
    silsila: "Chishti",
    wiladatHijri: "27 Safar 636 AH",
    wisalHijri: "18 Rabi' al-Thani 725 AH",
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
      "Shaykh Nizamuddin Muhammad Badayuni (رحمة الله عليه) established the spiritual heart of Delhi at Ghiyaspur, teaching that bringing joy to a grieving heart surpasses supererogatory worship.",
    karamat: ["Mentored Amir Khusrau and spread Chishti compassion across North India."],
    adabZiyarat: ["Maintain silence in the marble enclosure and offer Fatiha."],
    hotspots: [],
    books: [
      {
        title: "Fawa'id al-Fu'ad",
        arabicOrUrduTitle: "فوائد الفؤاد",
        genre: "Malfuzat",
        summary: "Spiritual discourses compiled by Amir Hasan Sijzi.",
        excerpt: "Ta'at-e-Muta'addi (service that benefits others) is superior to solitary worship.",
      },
    ],
    murshidId: "khwaja-moinuddin",
    khulafaNames: ["Khwaja Nasiruddin Chiragh Dehlavi", "Amir Khusrau"],
    status: "Published",
  },
  {
    id: "mujaddid-alf-thani",
    slug: "mujaddid-alf-thani",
    name: "Imam Rabbani Mujaddid Alf Thani",
    urduName: "امام ربانی مجدد الف ثانی",
    arabicName: "الإمام الرباني مجدد الألف الثاني",
    alqab: ["Mujaddid Alf Thani", "Imam Rabbani", "Qayyum-e-Zaman"],
    silsila: "Naqshbandi",
    wiladatHijri: "14 Shawwal 971 AH",
    wisalHijri: "28 Safar 1034 AH",
    ursMonth: 2,
    ursDay: 28,
    ursLabel: "Urs Mujaddid Alf Thani (28 Safar)",
    city: "Sirhind Sharif",
    country: "India",
    lat: 30.6435,
    lng: 76.3842,
    shrineImage: "/images/shrines/bareilly.jpg",
    shortSummary:
      "Renewer of the Second Millennium and pillar of the Naqshbandi-Mujaddidi order, author of Maktubat-e-Imam Rabbani.",
    fullTazkirah:
      "Shaykh Ahmad Faruqi Sirhindi (رحمة الله عليه) defended pure Sunni Ahl-e-Sunnat doctrine and Sunnah revival during the Mughal era, leaving behind 536 luminous letters (Maktubat) uniting Shari'ah and Tariqah.",
    karamat: ["Steadfastly upheld Prophetic Sunnah even through imprisonment at Gwalior Fort."],
    adabZiyarat: ["Recite silent Naqshbandi Khatm-e-Khwajagan and Durood Sharif."],
    hotspots: [],
    books: [
      {
        title: "Maktubat-e-Imam Rabbani",
        arabicOrUrduTitle: "مکتوباتِ امام ربانی",
        genre: "Epistles on Creed & Tasawwuf",
        summary: "Three volumes of letters clarifying Wahdat ash-Shuhud and Sunnah.",
        excerpt: "All spiritual states are subservient to following the Sunnah of Sayyiduna Muhammad ﷺ.",
      },
    ],
    murshidId: "ghaus-e-azam",
    khulafaNames: ["Khwaja Muhammad Ma'sum", "Shaikh Adam Banuri"],
    status: "Published",
  },
  {
    id: "data-ganj-bakhsh",
    slug: "data-ganj-bakhsh-hujwiri",
    name: "Data Ganj Bakhsh Syed Ali Hujwiri",
    urduName: "داتا گنج بخش سید علی ہجویری",
    arabicName: "علي الهجويري",
    alqab: ["Data Ganj Bakhsh", "Ganj Bakhsh Faiz-e-Alam"],
    silsila: "Qadri",
    wiladatHijri: "400 AH",
    wisalHijri: "20 Safar 465 AH",
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
      "Sayyid Ali bin Uthman al-Hujwiri (رحمة الله عليه) traveled across Khurasan and Baghdad before settling in Lahore, where his Kashf al-Mahjub became an enduring light for seekers of Allah.",
    karamat: ["Wrote Kashf al-Mahjub without a library in Lahore, purely from illumined memory."],
    adabZiyarat: ["Offer Durood Sharif and recite Surah Al-Mulk or Al-Fatihah."],
    hotspots: [],
    books: [
      {
        title: "Kashf al-Mahjub",
        arabicOrUrduTitle: "کشف المحجوب",
        genre: "Classical Tasawwuf",
        summary: "Foundational manual on Sunni Sufism, Adab, and biographies of early saints.",
        excerpt: "Sufism is pure etiquette (Adab) in every moment, state, and station.",
      },
    ],
    khulafaNames: ["Khwaja Moinuddin Chishti (spiritual tribute)"],
    status: "Published",
  },
];
