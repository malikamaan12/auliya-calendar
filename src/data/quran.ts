export interface QuranAyah {
  id: string;
  surahNum: number;
  surahName: string;
  surahArabic: string;
  ayahNum: number;
  arabicIndoPak: string;
  arabicUthmani: string;
  transliteration: string;
  kanzulImanUrdu: string;
  kanzulImanEnglish: string;
  kanzulImanRomanUrdu: string;
  kanzulImanHindi: string;
  khazainUlIrfanNote: string;
  hanafiSajda: boolean;
  shafiiOnlySajdaNote?: string;
  audioUrl: string;
  sha256: string;
}

export const QURAN_AYAHS: QuranAyah[] = [
  {
    id: "1:1",
    surahNum: 1,
    surahName: "Al-Fatihah",
    surahArabic: "الفاتحة",
    ayahNum: 1,
    arabicIndoPak: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    arabicUthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    transliteration: "Bismillāhir-Raḥmānir-Raḥīm",
    kanzulImanUrdu: "اللہ کے نام سے شروع جو بہت مہربان رحمت والا",
    kanzulImanEnglish: "Allah — beginning with the name of — the Most Gracious, the Most Merciful.",
    kanzulImanRomanUrdu: "Allah ke naam se shuru jo bahut meharban rehmat wala.",
    kanzulImanHindi: "अल्लाह के नाम से शुरू जो बहुत मेहरबान रहमत वाला।",
    khazainUlIrfanNote: "Khazain-ul-Irfan: Every blessed act begins with Allah's Greatest Name (Ism-e-Zat) and attributes of all-encompassing Mercy.",
    hanafiSajda: false,
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
    sha256: "kanzul-iman-001-001-verified",
  },
  {
    id: "1:2",
    surahNum: 1,
    surahName: "Al-Fatihah",
    surahArabic: "الفاتحة",
    ayahNum: 2,
    arabicIndoPak: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ",
    arabicUthmani: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
    transliteration: "Al-ḥamdu lillāhi Rabbil-‘ālamīn",
    kanzulImanUrdu: "سب خوبیاں اللہ کو جو مالک سارے جہان والوں کا",
    kanzulImanEnglish: "All praise is due to Allah, the Lord of the entire creation.",
    kanzulImanRomanUrdu: "Sab khoobiyan Allah ko jo Malik saare jahan walon ka.",
    kanzulImanHindi: "सब ख़ूबियाँ अल्लाह को जो मालिक सारे जहान वालों का।",
    khazainUlIrfanNote: "Khazain-ul-Irfan: All true praise belongs exclusively to Allah, Sustainer of all worlds—physical and spiritual.",
    hanafiSajda: false,
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
    sha256: "kanzul-iman-001-002-verified",
  },
  {
    id: "18:28",
    surahNum: 18,
    surahName: "Al-Kahf (Friday Sunnah)",
    surahArabic: "الكهف",
    ayahNum: 28,
    arabicIndoPak: "وَاصْبِرْ نَفْسَكَ مَعَ الَّذِيْنَ يَدْعُوْنَ رَبَّهُمْ بِالْغَدٰوةِ وَالْعَشِيِّ يُرِيْدُوْنَ وَجْهَهٗ",
    arabicUthmani: "وَٱصْبِرْ نَفْسَكَ مَعَ ٱلَّذِينَ يَدْعُونَ رَبَّهُم بِٱلْغَدَوٰةِ وَٱلْعَشِىِّ يُرِيدُونَ وَجْهَهُۥ",
    transliteration: "Waṣbir nafsaka ma‘allaḏīna yad‘ūna Rabbahum bil-ġadāti wal-‘ašiyyi yurīdūna wajhah",
    kanzulImanUrdu: "اور اپنی جان کو ان کے ساتھ مانوس رکھو جو صبح و شام اپنے رب کو پکارتے ہیں اس کی رضا چاہتے ہوئے",
    kanzulImanEnglish: "And keep yourself attached to those who call upon their Lord morning and evening, seeking His pleasure.",
    kanzulImanRomanUrdu: "Aur apni jaan ko un ke saath manoos rakho jo subah o shaam apne Rab ko pukarte hain Us ki raza chahte hue.",
    kanzulImanHindi: "और अपनी जान को उनके साथ मानूस रखो जो सुबह व शाम अपने रब को पुकारते हैं उसकी रज़ा चाहते हुए।",
    khazainUlIrfanNote: "Khazain-ul-Irfan: Direct Quranic proof for keeping the company of the pious (Suhbat-e-Salihin & Auliya Allah).",
    hanafiSajda: false,
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/018028.mp3",
    sha256: "kanzul-iman-018-028-verified",
  },
  {
    id: "67:1",
    surahNum: 67,
    surahName: "Al-Mulk (Nightly Sunnah)",
    surahArabic: "الملك",
    ayahNum: 1,
    arabicIndoPak: "تَبٰرَكَ الَّذِيْ بِيَدِهِ الْمُلْكُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ",
    arabicUthmani: "تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
    transliteration: "Tabārakallaḏī biyadihil-mulku wa Huwa ‘alā kulli šay’in Qadīr",
    kanzulImanUrdu: "بڑی برکت والا ہے وہ جس کے دستِ قدرت میں ساری بادشاہی ہے اور وہ ہر چیز پر قادر ہے",
    kanzulImanEnglish: "Most Blessed is He in Whose control is the entire Sovereignty, and He is Able to do all things.",
    kanzulImanRomanUrdu: "Badi barkat wala hai Woh jis ke dast-e-qudrat mein saari badshahi hai aur Woh har cheez par Qadir hai.",
    kanzulImanHindi: "बड़ी बरकत वाला है वह जिसके दस्त-ए-क़ुदरत में सारी बादशाही है और वह हर चीज़ पर क़ादिर है।",
    khazainUlIrfanNote: "Khazain-ul-Irfan: Reciting Surah Al-Mulk nightly protects from the punishment of the grave (Tirmidhi).",
    hanafiSajda: false,
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067001.mp3",
    sha256: "kanzul-iman-067-001-verified",
  },
  {
    id: "84:21",
    surahNum: 84,
    surahName: "Al-Inshiqaq",
    surahArabic: "الانشقاق",
    ayahNum: 21,
    arabicIndoPak: "وَاِذَا قُرِئَ عَلَيْهِمُ الْقُرْاٰنُ لَا يَسْجُدُوْنَ ۩",
    arabicUthmani: "وَإِذَا قُرِئَ عَلَيْهِمُ ٱلْقُرْءَانُ لَا يَسْجُدُونَ ۩",
    transliteration: "Wa iḏā quri’a ‘alayhimul-Qur’ānu lā yasjudūn",
    kanzulImanUrdu: "اور جب ان کے سامنے قرآن پڑھا جائے سجدہ نہیں کرتے",
    kanzulImanEnglish: "And when the Quran is recited to them, they do not fall in prostration.",
    kanzulImanRomanUrdu: "Aur jab un ke samne Quran padha jaye sajda nahi karte.",
    kanzulImanHindi: "और जब उनके सामने क़ुरआन पढ़ा जाए सजदा नहीं करते।",
    khazainUlIrfanNote: "Hanafi Fiqh (Bahar-e-Shariat): Sajda-e-Tilawat is Wajib here (#13 of the 14 Hanafi Sajdas).",
    hanafiSajda: true,
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/084021.mp3",
    sha256: "kanzul-iman-084-021-verified",
  },
  {
    id: "96:19",
    surahNum: 96,
    surahName: "Al-Alaq",
    surahArabic: "العلق",
    ayahNum: 19,
    arabicIndoPak: "كَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِبْ ۩",
    arabicUthmani: "كَلَّا لَا تُطِعْهُ وَٱسْجُدْ وَٱقْتَرِب ۩",
    transliteration: "Kallā lā tuṭi‘hu wasjud waqtarib",
    kanzulImanUrdu: "ہرگز اس کا کہا نہ مانو اور سجدہ کرو اور ہم سے قریب ہو",
    kanzulImanEnglish: "Never obey him; and prostrate yourself, and come close to Us!",
    kanzulImanRomanUrdu: "Hargiz us ka kaha na mano aur sajda karo aur Hum se qareeb ho.",
    kanzulImanHindi: "हरगिज़ उसका कहा न मानो और सजदा करो और हमसे क़रीब हो।",
    khazainUlIrfanNote: "Hanafi Fiqh: The 14th and final Wajib Sajda-e-Tilawat in the Holy Quran.",
    hanafiSajda: true,
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/096019.mp3",
    sha256: "kanzul-iman-096-019-verified",
  },
  {
    id: "22:77",
    surahNum: 22,
    surahName: "Al-Hajj",
    surahArabic: "الحج",
    ayahNum: 77,
    arabicIndoPak: "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوا ارْكَعُوْا وَاسْجُدُوْا وَاعْبُدُوْا رَبَّكُمْ",
    arabicUthmani: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱرْكَعُوا۟ وَٱسْجُدُوا۟ وَٱعْبُدُوا۟ رَبَّكُمْ",
    transliteration: "Yā ayyuhallaḏīna āmanurka‘ū wasjudū wa‘budū Rabbakum",
    kanzulImanUrdu: "اے ایمان والو رکوع اور سجدہ کرو اور اپنے رب کی بندگی کرو",
    kanzulImanEnglish: "O believers! Bow down (in Ruku) and prostrate (in Sajdah) and worship your Lord.",
    kanzulImanRomanUrdu: "Aye Iman walo ruku aur sajda karo aur apne Rab ki bandagi karo.",
    kanzulImanHindi: "ऐ ईमान वालो रुकू और सजदा करो और अपने रब की बंदगी करो।",
    khazainUlIrfanNote: "Note: In Hanafi Madhhab, the 2nd Sajda of Surah Al-Hajj (22:77) is NOT a Sajda-e-Tilawat (only 22:18 is Wajib). Some Shafi'i Mushafs mark 22:77.",
    hanafiSajda: false,
    shafiiOnlySajdaNote: "Excluded from the 14 Hanafi Sajdas (Shafi'i-only marker; Hanafi Sajda in Al-Hajj is at 22:18).",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/022077.mp3",
    sha256: "kanzul-iman-022-077-verified",
  },
];

export const HANAFI_14_SAJDAS = [
  "7:206 (Al-A'raf)",
  "13:15 (Ar-Ra'd)",
  "16:50 (An-Nahl)",
  "17:109 (Al-Isra)",
  "19:58 (Maryam)",
  "22:18 (Al-Hajj — 1st only)",
  "25:60 (Al-Furqan)",
  "27:26 (An-Naml)",
  "32:15 (As-Sajdah)",
  "38:24 (Sad)",
  "41:38 (Fussilat)",
  "53:62 (An-Najm)",
  "84:21 (Al-Inshiqaq)",
  "96:19 (Al-Alaq)",
];

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface HanafiSajdaItem {
  ref: string;
  surahNum: number;
  ayahNum: number;
  label: string;
}

export const HANAFI_SAJDA_ITEMS: HanafiSajdaItem[] = [
  { ref: "7:206", surahNum: 7, ayahNum: 206, label: "7:206 (Al-A'raf)" },
  { ref: "13:15", surahNum: 13, ayahNum: 15, label: "13:15 (Ar-Ra'd)" },
  { ref: "16:50", surahNum: 16, ayahNum: 50, label: "16:50 (An-Nahl)" },
  { ref: "17:109", surahNum: 17, ayahNum: 109, label: "17:109 (Al-Isra)" },
  { ref: "19:58", surahNum: 19, ayahNum: 58, label: "19:58 (Maryam)" },
  { ref: "22:18", surahNum: 22, ayahNum: 18, label: "22:18 (Al-Hajj — 1st only)" },
  { ref: "25:60", surahNum: 25, ayahNum: 60, label: "25:60 (Al-Furqan)" },
  { ref: "27:26", surahNum: 27, ayahNum: 26, label: "27:26 (An-Naml)" },
  { ref: "32:15", surahNum: 32, ayahNum: 15, label: "32:15 (As-Sajdah)" },
  { ref: "38:24", surahNum: 38, ayahNum: 24, label: "38:24 (Sad)" },
  { ref: "41:38", surahNum: 41, ayahNum: 38, label: "41:38 (Fussilat)" },
  { ref: "53:62", surahNum: 53, ayahNum: 62, label: "53:62 (An-Najm)" },
  { ref: "84:21", surahNum: 84, ayahNum: 21, label: "84:21 (Al-Inshiqaq)" },
  { ref: "96:19", surahNum: 96, ayahNum: 19, label: "96:19 (Al-Alaq)" },
];

export const HANAFI_SAJDA_REFS = new Set(HANAFI_SAJDA_ITEMS.map((s) => s.ref));

export function getEveryAyahUrl(surahNum: number, ayahNum: number): string {
  const s = String(surahNum).padStart(3, "0");
  const a = String(ayahNum).padStart(3, "0");
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
}

export const SURAH_LIST: SurahMeta[] = [
  {
    "number": 1,
    "name": "سُورَةُ ٱلْفَاتِحَةِ",
    "englishName": "Al-Faatiha",
    "englishNameTranslation": "The Opening",
    "numberOfAyahs": 7,
    "revelationType": "Meccan"
  },
  {
    "number": 2,
    "name": "سُورَةُ البَقَرَةِ",
    "englishName": "Al-Baqara",
    "englishNameTranslation": "The Cow",
    "numberOfAyahs": 286,
    "revelationType": "Medinan"
  },
  {
    "number": 3,
    "name": "سُورَةُ آلِ عِمۡرَانَ",
    "englishName": "Aal-i-Imraan",
    "englishNameTranslation": "The Family of Imraan",
    "numberOfAyahs": 200,
    "revelationType": "Medinan"
  },
  {
    "number": 4,
    "name": "سُورَةُ النِّسَاءِ",
    "englishName": "An-Nisaa",
    "englishNameTranslation": "The Women",
    "numberOfAyahs": 176,
    "revelationType": "Medinan"
  },
  {
    "number": 5,
    "name": "سُورَةُ المَائـِدَةِ",
    "englishName": "Al-Maaida",
    "englishNameTranslation": "The Table",
    "numberOfAyahs": 120,
    "revelationType": "Medinan"
  },
  {
    "number": 6,
    "name": "سُورَةُ الأَنۡعَامِ",
    "englishName": "Al-An'aam",
    "englishNameTranslation": "The Cattle",
    "numberOfAyahs": 165,
    "revelationType": "Meccan"
  },
  {
    "number": 7,
    "name": "سُورَةُ الأَعۡرَافِ",
    "englishName": "Al-A'raaf",
    "englishNameTranslation": "The Heights",
    "numberOfAyahs": 206,
    "revelationType": "Meccan"
  },
  {
    "number": 8,
    "name": "سُورَةُ الأَنفَالِ",
    "englishName": "Al-Anfaal",
    "englishNameTranslation": "The Spoils of War",
    "numberOfAyahs": 75,
    "revelationType": "Medinan"
  },
  {
    "number": 9,
    "name": "سُورَةُ التَّوۡبَةِ",
    "englishName": "At-Tawba",
    "englishNameTranslation": "The Repentance",
    "numberOfAyahs": 129,
    "revelationType": "Medinan"
  },
  {
    "number": 10,
    "name": "سُورَةُ يُونُسَ",
    "englishName": "Yunus",
    "englishNameTranslation": "Jonas",
    "numberOfAyahs": 109,
    "revelationType": "Meccan"
  },
  {
    "number": 11,
    "name": "سُورَةُ هُودٍ",
    "englishName": "Hud",
    "englishNameTranslation": "Hud",
    "numberOfAyahs": 123,
    "revelationType": "Meccan"
  },
  {
    "number": 12,
    "name": "سُورَةُ يُوسُفَ",
    "englishName": "Yusuf",
    "englishNameTranslation": "Joseph",
    "numberOfAyahs": 111,
    "revelationType": "Meccan"
  },
  {
    "number": 13,
    "name": "سُورَةُ الرَّعۡدِ",
    "englishName": "Ar-Ra'd",
    "englishNameTranslation": "The Thunder",
    "numberOfAyahs": 43,
    "revelationType": "Medinan"
  },
  {
    "number": 14,
    "name": "سُورَةُ إِبۡرَاهِيمَ",
    "englishName": "Ibrahim",
    "englishNameTranslation": "Abraham",
    "numberOfAyahs": 52,
    "revelationType": "Meccan"
  },
  {
    "number": 15,
    "name": "سُورَةُ الحِجۡرِ",
    "englishName": "Al-Hijr",
    "englishNameTranslation": "The Rock",
    "numberOfAyahs": 99,
    "revelationType": "Meccan"
  },
  {
    "number": 16,
    "name": "سُورَةُ النَّحۡلِ",
    "englishName": "An-Nahl",
    "englishNameTranslation": "The Bee",
    "numberOfAyahs": 128,
    "revelationType": "Meccan"
  },
  {
    "number": 17,
    "name": "سُورَةُ الإِسۡرَاءِ",
    "englishName": "Al-Israa",
    "englishNameTranslation": "The Night Journey",
    "numberOfAyahs": 111,
    "revelationType": "Meccan"
  },
  {
    "number": 18,
    "name": "سُورَةُ الكَهۡفِ",
    "englishName": "Al-Kahf",
    "englishNameTranslation": "The Cave",
    "numberOfAyahs": 110,
    "revelationType": "Meccan"
  },
  {
    "number": 19,
    "name": "سُورَةُ مَرۡيَمَ",
    "englishName": "Maryam",
    "englishNameTranslation": "Mary",
    "numberOfAyahs": 98,
    "revelationType": "Meccan"
  },
  {
    "number": 20,
    "name": "سُورَةُ طه",
    "englishName": "Taa-Haa",
    "englishNameTranslation": "Taa-Haa",
    "numberOfAyahs": 135,
    "revelationType": "Meccan"
  },
  {
    "number": 21,
    "name": "سُورَةُ الأَنبِيَاءِ",
    "englishName": "Al-Anbiyaa",
    "englishNameTranslation": "The Prophets",
    "numberOfAyahs": 112,
    "revelationType": "Meccan"
  },
  {
    "number": 22,
    "name": "سُورَةُ الحَجِّ",
    "englishName": "Al-Hajj",
    "englishNameTranslation": "The Pilgrimage",
    "numberOfAyahs": 78,
    "revelationType": "Medinan"
  },
  {
    "number": 23,
    "name": "سُورَةُ المُؤۡمِنُونَ",
    "englishName": "Al-Muminoon",
    "englishNameTranslation": "The Believers",
    "numberOfAyahs": 118,
    "revelationType": "Meccan"
  },
  {
    "number": 24,
    "name": "سُورَةُ النُّورِ",
    "englishName": "An-Noor",
    "englishNameTranslation": "The Light",
    "numberOfAyahs": 64,
    "revelationType": "Medinan"
  },
  {
    "number": 25,
    "name": "سُورَةُ الفُرۡقَانِ",
    "englishName": "Al-Furqaan",
    "englishNameTranslation": "The Criterion",
    "numberOfAyahs": 77,
    "revelationType": "Meccan"
  },
  {
    "number": 26,
    "name": "سُورَةُ الشُّعَرَاءِ",
    "englishName": "Ash-Shu'araa",
    "englishNameTranslation": "The Poets",
    "numberOfAyahs": 227,
    "revelationType": "Meccan"
  },
  {
    "number": 27,
    "name": "سُورَةُ النَّمۡلِ",
    "englishName": "An-Naml",
    "englishNameTranslation": "The Ant",
    "numberOfAyahs": 93,
    "revelationType": "Meccan"
  },
  {
    "number": 28,
    "name": "سُورَةُ القَصَصِ",
    "englishName": "Al-Qasas",
    "englishNameTranslation": "The Stories",
    "numberOfAyahs": 88,
    "revelationType": "Meccan"
  },
  {
    "number": 29,
    "name": "سُورَةُ العَنكَبُوتِ",
    "englishName": "Al-Ankaboot",
    "englishNameTranslation": "The Spider",
    "numberOfAyahs": 69,
    "revelationType": "Meccan"
  },
  {
    "number": 30,
    "name": "سُورَةُ الرُّومِ",
    "englishName": "Ar-Room",
    "englishNameTranslation": "The Romans",
    "numberOfAyahs": 60,
    "revelationType": "Meccan"
  },
  {
    "number": 31,
    "name": "سُورَةُ لُقۡمَانَ",
    "englishName": "Luqman",
    "englishNameTranslation": "Luqman",
    "numberOfAyahs": 34,
    "revelationType": "Meccan"
  },
  {
    "number": 32,
    "name": "سُورَةُ السَّجۡدَةِ",
    "englishName": "As-Sajda",
    "englishNameTranslation": "The Prostration",
    "numberOfAyahs": 30,
    "revelationType": "Meccan"
  },
  {
    "number": 33,
    "name": "سُورَةُ الأَحۡزَابِ",
    "englishName": "Al-Ahzaab",
    "englishNameTranslation": "The Clans",
    "numberOfAyahs": 73,
    "revelationType": "Medinan"
  },
  {
    "number": 34,
    "name": "سُورَةُ سَبَإٍ",
    "englishName": "Saba",
    "englishNameTranslation": "Sheba",
    "numberOfAyahs": 54,
    "revelationType": "Meccan"
  },
  {
    "number": 35,
    "name": "سُورَةُ فَاطِرٍ",
    "englishName": "Faatir",
    "englishNameTranslation": "The Originator",
    "numberOfAyahs": 45,
    "revelationType": "Meccan"
  },
  {
    "number": 36,
    "name": "سُورَةُ يسٓ",
    "englishName": "Yaseen",
    "englishNameTranslation": "Yaseen",
    "numberOfAyahs": 83,
    "revelationType": "Meccan"
  },
  {
    "number": 37,
    "name": "سُورَةُ الصَّافَّاتِ",
    "englishName": "As-Saaffaat",
    "englishNameTranslation": "Those drawn up in Ranks",
    "numberOfAyahs": 182,
    "revelationType": "Meccan"
  },
  {
    "number": 38,
    "name": "سُورَةُ صٓ",
    "englishName": "Saad",
    "englishNameTranslation": "The letter Saad",
    "numberOfAyahs": 88,
    "revelationType": "Meccan"
  },
  {
    "number": 39,
    "name": "سُورَةُ الزُّمَرِ",
    "englishName": "Az-Zumar",
    "englishNameTranslation": "The Groups",
    "numberOfAyahs": 75,
    "revelationType": "Meccan"
  },
  {
    "number": 40,
    "name": "سُورَةُ غَافِرٍ",
    "englishName": "Ghafir",
    "englishNameTranslation": "The Forgiver",
    "numberOfAyahs": 85,
    "revelationType": "Meccan"
  },
  {
    "number": 41,
    "name": "سُورَةُ فُصِّلَتۡ",
    "englishName": "Fussilat",
    "englishNameTranslation": "Explained in detail",
    "numberOfAyahs": 54,
    "revelationType": "Meccan"
  },
  {
    "number": 42,
    "name": "سُورَةُ الشُّورَىٰ",
    "englishName": "Ash-Shura",
    "englishNameTranslation": "Consultation",
    "numberOfAyahs": 53,
    "revelationType": "Meccan"
  },
  {
    "number": 43,
    "name": "سُورَةُ الزُّخۡرُفِ",
    "englishName": "Az-Zukhruf",
    "englishNameTranslation": "Ornaments of gold",
    "numberOfAyahs": 89,
    "revelationType": "Meccan"
  },
  {
    "number": 44,
    "name": "سُورَةُ الدُّخَانِ",
    "englishName": "Ad-Dukhaan",
    "englishNameTranslation": "The Smoke",
    "numberOfAyahs": 59,
    "revelationType": "Meccan"
  },
  {
    "number": 45,
    "name": "سُورَةُ الجَاثِيَةِ",
    "englishName": "Al-Jaathiya",
    "englishNameTranslation": "Crouching",
    "numberOfAyahs": 37,
    "revelationType": "Meccan"
  },
  {
    "number": 46,
    "name": "سُورَةُ الأَحۡقَافِ",
    "englishName": "Al-Ahqaf",
    "englishNameTranslation": "The Dunes",
    "numberOfAyahs": 35,
    "revelationType": "Meccan"
  },
  {
    "number": 47,
    "name": "سُورَةُ مُحَمَّدٍ",
    "englishName": "Muhammad",
    "englishNameTranslation": "Muhammad",
    "numberOfAyahs": 38,
    "revelationType": "Medinan"
  },
  {
    "number": 48,
    "name": "سُورَةُ الفَتۡحِ",
    "englishName": "Al-Fath",
    "englishNameTranslation": "The Victory",
    "numberOfAyahs": 29,
    "revelationType": "Medinan"
  },
  {
    "number": 49,
    "name": "سُورَةُ الحُجُرَاتِ",
    "englishName": "Al-Hujuraat",
    "englishNameTranslation": "The Inner Apartments",
    "numberOfAyahs": 18,
    "revelationType": "Medinan"
  },
  {
    "number": 50,
    "name": "سُورَةُ قٓ",
    "englishName": "Qaaf",
    "englishNameTranslation": "The letter Qaaf",
    "numberOfAyahs": 45,
    "revelationType": "Meccan"
  },
  {
    "number": 51,
    "name": "سُورَةُ الذَّارِيَاتِ",
    "englishName": "Adh-Dhaariyat",
    "englishNameTranslation": "The Winnowing Winds",
    "numberOfAyahs": 60,
    "revelationType": "Meccan"
  },
  {
    "number": 52,
    "name": "سُورَةُ الطُّورِ",
    "englishName": "At-Tur",
    "englishNameTranslation": "The Mount",
    "numberOfAyahs": 49,
    "revelationType": "Meccan"
  },
  {
    "number": 53,
    "name": "سُورَةُ النَّجۡمِ",
    "englishName": "An-Najm",
    "englishNameTranslation": "The Star",
    "numberOfAyahs": 62,
    "revelationType": "Meccan"
  },
  {
    "number": 54,
    "name": "سُورَةُ القَمَرِ",
    "englishName": "Al-Qamar",
    "englishNameTranslation": "The Moon",
    "numberOfAyahs": 55,
    "revelationType": "Meccan"
  },
  {
    "number": 55,
    "name": "سُورَةُ الرَّحۡمَٰن",
    "englishName": "Ar-Rahmaan",
    "englishNameTranslation": "The Beneficent",
    "numberOfAyahs": 78,
    "revelationType": "Medinan"
  },
  {
    "number": 56,
    "name": "سُورَةُ الوَاقِعَةِ",
    "englishName": "Al-Waaqia",
    "englishNameTranslation": "The Inevitable",
    "numberOfAyahs": 96,
    "revelationType": "Meccan"
  },
  {
    "number": 57,
    "name": "سُورَةُ الحَدِيدِ",
    "englishName": "Al-Hadid",
    "englishNameTranslation": "The Iron",
    "numberOfAyahs": 29,
    "revelationType": "Medinan"
  },
  {
    "number": 58,
    "name": "سُورَةُ المُجَادلَةِ",
    "englishName": "Al-Mujaadila",
    "englishNameTranslation": "The Pleading Woman",
    "numberOfAyahs": 22,
    "revelationType": "Medinan"
  },
  {
    "number": 59,
    "name": "سُورَةُ الحَشۡرِ",
    "englishName": "Al-Hashr",
    "englishNameTranslation": "The Exile",
    "numberOfAyahs": 24,
    "revelationType": "Medinan"
  },
  {
    "number": 60,
    "name": "سُورَةُ المُمۡتَحنَةِ",
    "englishName": "Al-Mumtahana",
    "englishNameTranslation": "She that is to be examined",
    "numberOfAyahs": 13,
    "revelationType": "Medinan"
  },
  {
    "number": 61,
    "name": "سُورَةُ الصَّفِّ",
    "englishName": "As-Saff",
    "englishNameTranslation": "The Ranks",
    "numberOfAyahs": 14,
    "revelationType": "Medinan"
  },
  {
    "number": 62,
    "name": "سُورَةُ الجُمُعَةِ",
    "englishName": "Al-Jumu'a",
    "englishNameTranslation": "Friday",
    "numberOfAyahs": 11,
    "revelationType": "Medinan"
  },
  {
    "number": 63,
    "name": "سُورَةُ المُنَافِقُونَ",
    "englishName": "Al-Munaafiqoon",
    "englishNameTranslation": "The Hypocrites",
    "numberOfAyahs": 11,
    "revelationType": "Medinan"
  },
  {
    "number": 64,
    "name": "سُورَةُ التَّغَابُنِ",
    "englishName": "At-Taghaabun",
    "englishNameTranslation": "Mutual Disillusion",
    "numberOfAyahs": 18,
    "revelationType": "Medinan"
  },
  {
    "number": 65,
    "name": "سُورَةُ الطَّلَاقِ",
    "englishName": "At-Talaaq",
    "englishNameTranslation": "Divorce",
    "numberOfAyahs": 12,
    "revelationType": "Medinan"
  },
  {
    "number": 66,
    "name": "سُورَةُ التَّحۡرِيمِ",
    "englishName": "At-Tahrim",
    "englishNameTranslation": "The Prohibition",
    "numberOfAyahs": 12,
    "revelationType": "Medinan"
  },
  {
    "number": 67,
    "name": "سُورَةُ المُلۡكِ",
    "englishName": "Al-Mulk",
    "englishNameTranslation": "The Sovereignty",
    "numberOfAyahs": 30,
    "revelationType": "Meccan"
  },
  {
    "number": 68,
    "name": "سُورَةُ القَلَمِ",
    "englishName": "Al-Qalam",
    "englishNameTranslation": "The Pen",
    "numberOfAyahs": 52,
    "revelationType": "Meccan"
  },
  {
    "number": 69,
    "name": "سُورَةُ الحَاقَّةِ",
    "englishName": "Al-Haaqqa",
    "englishNameTranslation": "The Reality",
    "numberOfAyahs": 52,
    "revelationType": "Meccan"
  },
  {
    "number": 70,
    "name": "سُورَةُ المَعَارِجِ",
    "englishName": "Al-Ma'aarij",
    "englishNameTranslation": "The Ascending Stairways",
    "numberOfAyahs": 44,
    "revelationType": "Meccan"
  },
  {
    "number": 71,
    "name": "سُورَةُ نُوحٍ",
    "englishName": "Nooh",
    "englishNameTranslation": "Noah",
    "numberOfAyahs": 28,
    "revelationType": "Meccan"
  },
  {
    "number": 72,
    "name": "سُورَةُ الجِنِّ",
    "englishName": "Al-Jinn",
    "englishNameTranslation": "The Jinn",
    "numberOfAyahs": 28,
    "revelationType": "Meccan"
  },
  {
    "number": 73,
    "name": "سُورَةُ المُزَّمِّلِ",
    "englishName": "Al-Muzzammil",
    "englishNameTranslation": "The Enshrouded One",
    "numberOfAyahs": 20,
    "revelationType": "Meccan"
  },
  {
    "number": 74,
    "name": "سُورَةُ المُدَّثِّرِ",
    "englishName": "Al-Muddaththir",
    "englishNameTranslation": "The Cloaked One",
    "numberOfAyahs": 56,
    "revelationType": "Meccan"
  },
  {
    "number": 75,
    "name": "سُورَةُ القِيَامَةِ",
    "englishName": "Al-Qiyaama",
    "englishNameTranslation": "The Resurrection",
    "numberOfAyahs": 40,
    "revelationType": "Meccan"
  },
  {
    "number": 76,
    "name": "سُورَةُ الإِنسَانِ",
    "englishName": "Al-Insaan",
    "englishNameTranslation": "Man",
    "numberOfAyahs": 31,
    "revelationType": "Medinan"
  },
  {
    "number": 77,
    "name": "سُورَةُ المُرۡسَلَاتِ",
    "englishName": "Al-Mursalaat",
    "englishNameTranslation": "The Emissaries",
    "numberOfAyahs": 50,
    "revelationType": "Meccan"
  },
  {
    "number": 78,
    "name": "سُورَةُ النَّبَإِ",
    "englishName": "An-Naba",
    "englishNameTranslation": "The Announcement",
    "numberOfAyahs": 40,
    "revelationType": "Meccan"
  },
  {
    "number": 79,
    "name": "سُورَةُ النَّازِعَاتِ",
    "englishName": "An-Naazi'aat",
    "englishNameTranslation": "Those who drag forth",
    "numberOfAyahs": 46,
    "revelationType": "Meccan"
  },
  {
    "number": 80,
    "name": "سُورَةُ عَبَسَ",
    "englishName": "Abasa",
    "englishNameTranslation": "He frowned",
    "numberOfAyahs": 42,
    "revelationType": "Meccan"
  },
  {
    "number": 81,
    "name": "سُورَةُ التَّكۡوِيرِ",
    "englishName": "At-Takwir",
    "englishNameTranslation": "The Overthrowing",
    "numberOfAyahs": 29,
    "revelationType": "Meccan"
  },
  {
    "number": 82,
    "name": "سُورَةُ الانفِطَارِ",
    "englishName": "Al-Infitaar",
    "englishNameTranslation": "The Cleaving",
    "numberOfAyahs": 19,
    "revelationType": "Meccan"
  },
  {
    "number": 83,
    "name": "سُورَةُ المُطَفِّفِينَ",
    "englishName": "Al-Mutaffifin",
    "englishNameTranslation": "Defrauding",
    "numberOfAyahs": 36,
    "revelationType": "Meccan"
  },
  {
    "number": 84,
    "name": "سُورَةُ الانشِقَاقِ",
    "englishName": "Al-Inshiqaaq",
    "englishNameTranslation": "The Splitting Open",
    "numberOfAyahs": 25,
    "revelationType": "Meccan"
  },
  {
    "number": 85,
    "name": "سُورَةُ البُرُوجِ",
    "englishName": "Al-Burooj",
    "englishNameTranslation": "The Constellations",
    "numberOfAyahs": 22,
    "revelationType": "Meccan"
  },
  {
    "number": 86,
    "name": "سُورَةُ الطَّارِقِ",
    "englishName": "At-Taariq",
    "englishNameTranslation": "The Morning Star",
    "numberOfAyahs": 17,
    "revelationType": "Meccan"
  },
  {
    "number": 87,
    "name": "سُورَةُ الأَعۡلَىٰ",
    "englishName": "Al-A'laa",
    "englishNameTranslation": "The Most High",
    "numberOfAyahs": 19,
    "revelationType": "Meccan"
  },
  {
    "number": 88,
    "name": "سُورَةُ الغَاشِيَةِ",
    "englishName": "Al-Ghaashiya",
    "englishNameTranslation": "The Overwhelming",
    "numberOfAyahs": 26,
    "revelationType": "Meccan"
  },
  {
    "number": 89,
    "name": "سُورَةُ الفَجۡرِ",
    "englishName": "Al-Fajr",
    "englishNameTranslation": "The Dawn",
    "numberOfAyahs": 30,
    "revelationType": "Meccan"
  },
  {
    "number": 90,
    "name": "سُورَةُ البَلَدِ",
    "englishName": "Al-Balad",
    "englishNameTranslation": "The City",
    "numberOfAyahs": 20,
    "revelationType": "Meccan"
  },
  {
    "number": 91,
    "name": "سُورَةُ الشَّمۡسِ",
    "englishName": "Ash-Shams",
    "englishNameTranslation": "The Sun",
    "numberOfAyahs": 15,
    "revelationType": "Meccan"
  },
  {
    "number": 92,
    "name": "سُورَةُ اللَّيۡلِ",
    "englishName": "Al-Lail",
    "englishNameTranslation": "The Night",
    "numberOfAyahs": 21,
    "revelationType": "Meccan"
  },
  {
    "number": 93,
    "name": "سُورَةُ الضُّحَىٰ",
    "englishName": "Ad-Dhuhaa",
    "englishNameTranslation": "The Morning Hours",
    "numberOfAyahs": 11,
    "revelationType": "Meccan"
  },
  {
    "number": 94,
    "name": "سُورَةُ الشَّرۡحِ",
    "englishName": "Ash-Sharh",
    "englishNameTranslation": "The Consolation",
    "numberOfAyahs": 8,
    "revelationType": "Meccan"
  },
  {
    "number": 95,
    "name": "سُورَةُ التِّينِ",
    "englishName": "At-Tin",
    "englishNameTranslation": "The Fig",
    "numberOfAyahs": 8,
    "revelationType": "Meccan"
  },
  {
    "number": 96,
    "name": "سُورَةُ العَلَقِ",
    "englishName": "Al-Alaq",
    "englishNameTranslation": "The Clot",
    "numberOfAyahs": 19,
    "revelationType": "Meccan"
  },
  {
    "number": 97,
    "name": "سُورَةُ القَدۡرِ",
    "englishName": "Al-Qadr",
    "englishNameTranslation": "The Power, Fate",
    "numberOfAyahs": 5,
    "revelationType": "Meccan"
  },
  {
    "number": 98,
    "name": "سُورَةُ البَيِّنَةِ",
    "englishName": "Al-Bayyina",
    "englishNameTranslation": "The Evidence",
    "numberOfAyahs": 8,
    "revelationType": "Medinan"
  },
  {
    "number": 99,
    "name": "سُورَةُ الزَّلۡزَلَةِ",
    "englishName": "Az-Zalzala",
    "englishNameTranslation": "The Earthquake",
    "numberOfAyahs": 8,
    "revelationType": "Medinan"
  },
  {
    "number": 100,
    "name": "سُورَةُ العَادِيَاتِ",
    "englishName": "Al-Aadiyaat",
    "englishNameTranslation": "The Chargers",
    "numberOfAyahs": 11,
    "revelationType": "Meccan"
  },
  {
    "number": 101,
    "name": "سُورَةُ القَارِعَةِ",
    "englishName": "Al-Qaari'a",
    "englishNameTranslation": "The Calamity",
    "numberOfAyahs": 11,
    "revelationType": "Meccan"
  },
  {
    "number": 102,
    "name": "سُورَةُ التَّكَاثُرِ",
    "englishName": "At-Takaathur",
    "englishNameTranslation": "Competition",
    "numberOfAyahs": 8,
    "revelationType": "Meccan"
  },
  {
    "number": 103,
    "name": "سُورَةُ العَصۡرِ",
    "englishName": "Al-Asr",
    "englishNameTranslation": "The Declining Day, Epoch",
    "numberOfAyahs": 3,
    "revelationType": "Meccan"
  },
  {
    "number": 104,
    "name": "سُورَةُ الهُمَزَةِ",
    "englishName": "Al-Humaza",
    "englishNameTranslation": "The Traducer",
    "numberOfAyahs": 9,
    "revelationType": "Meccan"
  },
  {
    "number": 105,
    "name": "سُورَةُ الفِيلِ",
    "englishName": "Al-Fil",
    "englishNameTranslation": "The Elephant",
    "numberOfAyahs": 5,
    "revelationType": "Meccan"
  },
  {
    "number": 106,
    "name": "سُورَةُ قُرَيۡشٍ",
    "englishName": "Quraish",
    "englishNameTranslation": "Quraysh",
    "numberOfAyahs": 4,
    "revelationType": "Meccan"
  },
  {
    "number": 107,
    "name": "سُورَةُ المَاعُونِ",
    "englishName": "Al-Maa'un",
    "englishNameTranslation": "Almsgiving",
    "numberOfAyahs": 7,
    "revelationType": "Meccan"
  },
  {
    "number": 108,
    "name": "سُورَةُ الكَوۡثَرِ",
    "englishName": "Al-Kawthar",
    "englishNameTranslation": "Abundance",
    "numberOfAyahs": 3,
    "revelationType": "Meccan"
  },
  {
    "number": 109,
    "name": "سُورَةُ الكَافِرُونَ",
    "englishName": "Al-Kaafiroon",
    "englishNameTranslation": "The Disbelievers",
    "numberOfAyahs": 6,
    "revelationType": "Meccan"
  },
  {
    "number": 110,
    "name": "سُورَةُ النَّصۡرِ",
    "englishName": "An-Nasr",
    "englishNameTranslation": "Divine Support",
    "numberOfAyahs": 3,
    "revelationType": "Medinan"
  },
  {
    "number": 111,
    "name": "سُورَةُ المَسَدِ",
    "englishName": "Al-Masad",
    "englishNameTranslation": "The Palm Fibre",
    "numberOfAyahs": 5,
    "revelationType": "Meccan"
  },
  {
    "number": 112,
    "name": "سُورَةُ الإِخۡلَاصِ",
    "englishName": "Al-Ikhlaas",
    "englishNameTranslation": "Sincerity",
    "numberOfAyahs": 4,
    "revelationType": "Meccan"
  },
  {
    "number": 113,
    "name": "سُورَةُ الفَلَقِ",
    "englishName": "Al-Falaq",
    "englishNameTranslation": "The Dawn",
    "numberOfAyahs": 5,
    "revelationType": "Meccan"
  },
  {
    "number": 114,
    "name": "سُورَةُ النَّاسِ",
    "englishName": "An-Naas",
    "englishNameTranslation": "Mankind",
    "numberOfAyahs": 6,
    "revelationType": "Meccan"
  }
];
