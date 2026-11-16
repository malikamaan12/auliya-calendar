import type {
  TaharahMethodGuide,
  SalahPostureStep,
  SpecialPrayerBlueprint,
  SalahRulingItem,
} from "./fiqh-types";

export const TAHARAH_METHODS: TaharahMethodGuide[] = [
  {
    id: "wudu",
    title: "Method of Wudu (Ablution)",
    urduTitle: "طریقۂ وضو (حنفی)",
    subtitle:
      "Complete Sunnah & Fard method of ritual ablution before Salah, Quran recitation, and Tawaf according to Bahar-e-Shariat.",
    faraid: [
      "1. Washing the entire face once — vertically from the normal hairline of the forehead down to beneath the chin, and horizontally from one earlobe to the other (water must reach the skin beneath a thin beard, and wash the outer surface of a thick beard).",
      "2. Washing both arms including the elbows once — ensuring no spot on the fingers, knuckles, wrists, or elbows remains dry.",
      "3. Performing Masah (wiping with wet hands) over at least one-fourth (1/4) of the head once.",
      "4. Washing both feet including both ankle bones once — ensuring water reaches between the toes and under the heels.",
    ],
    sunanSteps: [
      {
        stepNum: 1,
        title: "Niyyah (Intention) & Elevated Qibla-Facing Seat",
        ruling: "Sunnah",
        detail:
          "Sit in a clean, elevated place facing the Qibla and make the firm intention in the heart to attain purity for the pleasure of Allah Almighty and for offering Salah.",
        arabicDua: "نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ وَاسْتِبَاحَةِ الصَّلَاةِ",
        transliteration: "Nawaytul-wudu'a li-raf'il-hadathi wa istibahat-is-salah.",
        translation:
          "I intend to perform Wudu to remove ritual impurity and make Salah permissible.",
      },
      {
        stepNum: 2,
        title: "Reciting Tasmiyah (Bismillah)",
        ruling: "Sunnah",
        detail:
          "Begin Wudu by praising Allah Almighty and invoking blessings; reciting Bismillah before washing the hands makes the angels record good deeds throughout the ablution.",
        arabicDua: "بِسْمِ اللَّهِ الْعَظِيمِ وَالْحَمْدُ لِلَّهِ عَلَى دِينِ الْإِسْلَامِ",
        transliteration: "Bismillahil-'Azim wal-hamdu lillahi 'ala dinil-Islam.",
        translation:
          "In the Name of Allah, the Magnificent, and all praise belongs to Allah for the religion of Islam.",
      },
      {
        stepNum: 3,
        title: "Washing Both Hands up to the Wrists (3 Times)",
        ruling: "Sunnah",
        detail:
          "Wash the right hand up to and including the wrist three times, then the left hand up to the wrist three times, performing Khilal (interlacing fingers) and moving any tight rings so water reaches beneath them.",
      },
      {
        stepNum: 4,
        title: "Using the Miswak (Tooth-Stick)",
        ruling: "Sunnah",
        detail:
          "Clean the teeth horizontally and along the gums with a soft Miswak (such as Peelu/Arak or Olive wood) held in the right hand — starting on the right upper and lower teeth, then the left. Salah with Miswak excels Salah without Miswak seventyfold.",
      },
      {
        stepNum: 5,
        title: "Madmadah — Rinsing the Mouth (3 Times)",
        ruling: "Sunnah",
        detail:
          "Take fresh water with the right hand three times and swirl it thoroughly across all corners of the mouth. If not fasting, gargle gently toward the throat.",
      },
      {
        stepNum: 6,
        title: "Istinshaq & Istinthar — Rinsing the Nose (3 Times)",
        ruling: "Sunnah",
        detail:
          "Sniff fresh water gently into the nostrils using the right hand three times up to the soft cartilage (without drawing it high if fasting), then blow it out and clean the nostrils using the thumb and little finger of the left hand.",
      },
      {
        stepNum: 7,
        title: "Washing the Entire Face (3 Times) & Beard Khilal",
        ruling: "Fard",
        detail:
          "Washing once is Fard; washing three times thoroughly is Sunnah. Pour water gently from the top of the forehead hairline down below the chin and from earlobe to earlobe, including the bayad (space between beard and ear). For brothers with a thick beard (where skin does not show), wash the outer hair and run wet fingers upward from underneath the chin (Khilal) after the third wash.",
      },
      {
        stepNum: 8,
        title: "Washing Right & Left Arms Including Elbows (3 Times)",
        ruling: "Fard",
        detail:
          "Washing each arm including the elbow once is Fard; washing three times starting from the fingertips down past the elbow (right arm first, then left arm) is Sunnah.",
      },
      {
        stepNum: 9,
        title: "Masah of the Whole Head, Ears & Nape (Once)",
        ruling: "Fard",
        detail:
          "Wiping one-fourth of the head is Fard; wiping the entire head (Isti'ab) once is Sunnah Mu'akkadah. Wet both hands (shaking off excess drops), join three fingers (middle, ring, little) of both hands at the front hairline, draw them back to the nape, draw the palms forward along the sides back to the forehead, wipe inside the ears with the index fingers, wipe behind the ears with the thumbs, and gently stroke the nape of the neck (Gardan ka Masah) with the backs of the fingers (never wipe the front throat, which is Bid'ah/Makruh).",
      },
      {
        stepNum: 10,
        title: "Washing Right & Left Feet Including Ankles (3 Times) + Toe Khilal",
        ruling: "Fard",
        detail:
          "Washing each foot including both ankle bones once is Fard; washing three times starting with the right foot is Sunnah. Perform Khilal between the toes using the little finger of the left hand — beginning from the little toe of the right foot across to the little toe of the left foot.",
      },
      {
        stepNum: 11,
        title: "Drinking Leftover Wudu Water Upright & Reciting Kalimah + Dua",
        ruling: "Mustahabb",
        detail:
          "Stand facing the Qibla (if safe to drink leftover clean vessel water, drink a sip standing as a cure, like Zamzam), raise the gaze slightly skyward, and recite Kalimah Shahadah followed by the Prophetic Dua of Tirmidhi — through which all eight gates of Paradise are opened.",
        arabicDua:
          "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ ۝ اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
        transliteration:
          "Ash-hadu an la ilaha illallahu wahdahu la sharika lahu, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh. Allahummaj'alni minat-tawwabina waj'alni minal-mutatahhirin.",
        translation:
          "I bear witness that there is no deity worthy of worship except Allah alone, without partner, and I bear witness that Muhammad ﷺ is His servant and Messenger. O Allah! Make me among the oft-repentant and make me among those who purify themselves.",
      },
    ],
    nullifiers: [
      "Anything exiting from the front or rear private passages (urine, stool, wind, prostatic fluid/Madhi, Wadi, worms, or stones).",
      "Blood, pus, or yellow serous fluid emerging from a wound or blister and flowing beyond the point of exit onto an area that requires washing in Wudu or Ghusl.",
      "Mouthful vomit (Qay' mil'al-fam — an amount that cannot be held inside the mouth without difficulty) consisting of food, water, bile, or clotted blood. (Pure phlegm/balgham does not break Wudu).",
      "Blood emerging in saliva if the blood equals or exceeds the saliva (indicated by redness rather than faint yellowness).",
      "Sleeping while lying down, leaning on one's side/hip, or resting against a support such that if the support were removed one would fall.",
      "Loss of consciousness through fainting, intoxication, seizure, or insanity (even briefly).",
      "Qahqahah (audible laughter heard by neighbors) by a sane adult inside a complete Salah that contains Ruku and Sujood — this nullifies BOTH the Salah and the Wudu in Hanafi Fiqh (though not in Salat al-Janazah or Sajda-e-Tilawat).",
      "Mubasharah Fahishah — direct naked skin-to-skin contact of private organs with desire.",
    ],
    source:
      "Bahar-e-Shariat, Vol. 1, Part 2 (Wudu ka Bayan); Al-Hidayah; Nur al-Idah; Fatawa Razawiyya, Vol. 1–2.",
  },
  {
    id: "ghusl",
    title: "Method of Ghusl (Ritual Bath)",
    urduTitle: "طریقۂ غسل (حنفی)",
    subtitle:
      "Full ritual purification from Hadas-e-Akbar (major ritual impurity) as codified in Bahar-e-Shariat, along with Sunnah etiquette for Jumu'ah and Eidain.",
    faraid: [
      "1. Madmadah (Rinsing the mouth thoroughly) — ensuring water reaches every inner surface of the mouth, gums, between teeth, and up to the start of the throat (gargling if not fasting).",
      "2. Istinshaq (Rinsing the nostrils thoroughly) — drawing water gently up to the soft cartilage/bridge of the nose so no dried mucus blocks water from reaching the inner skin.",
      "3. Washing the entire external body once — pouring water from the crown of the head to the soles of the feet so that not even the breadth of a single hair remains dry (including inside the navel, skin folds, earring holes, beneath foreskin/nails, and braided hair roots for sisters if water reaches the scalp).",
    ],
    sunanSteps: [
      {
        stepNum: 1,
        title: "Niyyah in the Heart & Washing Both Hands (3 Times)",
        ruling: "Sunnah",
        detail:
          "Make the firm intention in the heart to purify oneself from Janabah/major impurity for Allah's pleasure (do not utter words aloud while uncovered inside a washroom). Wash both hands up to the wrists three times.",
      },
      {
        stepNum: 2,
        title: "Washing Private Parts & Removing Any Physical Impurity (Najasah)",
        ruling: "Sunnah",
        detail:
          "Wash the private area thoroughly with the left hand even if no visible impurity is present, then wash away any physical impurity (Najasah Haqiqiyyah) found anywhere on the body and wash the hands afterward with soap or earth.",
      },
      {
        stepNum: 3,
        title: "Performing Complete Wudu",
        ruling: "Sunnah",
        detail:
          "Perform a full Sunnah Wudu just as for Salah — ensuring thorough mouth-rinsing (Fard #1 of Ghusl) and nose-rinsing (Fard #2 of Ghusl). If standing on a surface where used water pools around the feet, delay washing the feet until the very end of Ghusl.",
      },
      {
        stepNum: 4,
        title: "Rubbing Water Slightly Over the Body Like Oil",
        ruling: "Mustahabb",
        detail:
          "Pass wet hands across the limbs first so water spreads smoothly and reaches every crease without wastage (Israf).",
      },
      {
        stepNum: 5,
        title: "Pouring Water Over the Head (3 Times)",
        ruling: "Fard",
        detail:
          "Pour water thoroughly over the head three times, rubbing the scalp and hair roots. Note from Bahar-e-Shariat: Brothers must wet every strand and root of braided or long hair; sisters with tightly braided hair only need water to thoroughly reach the entire scalp/roots without undoing clean braids (unless braids are so matted that water cannot reach the scalp).",
      },
      {
        stepNum: 6,
        title: "Pouring Water Over the Right Shoulder, Then Left Shoulder (3 Times Each)",
        ruling: "Fard",
        detail:
          "Pour water three times over the right shoulder down the right side, then three times over the left shoulder down the left side, rubbing gently with the hands across armpits, behind knees, navel, ear folds, and earring perforations so not a hair's breadth stays dry.",
      },
      {
        stepNum: 7,
        title: "Stepping Aside & Washing Both Feet",
        ruling: "Fard",
        detail:
          "Step aside to a clean spot (if water had pooled earlier) and wash the right and left feet including ankles and between toes. Note: A valid Ghusl automatically includes Wudu — no separate Wudu is needed afterward for Salah unless a nullifier of Wudu occurs.",
      },
    ],
    nullifiers: [
      "State 1 Requiring Fard Ghusl — Inzal: Emission of semen (Mani) that separates from its origin with sexual pleasure/spurt, whether awake or in a wet dream (Ihtilam) upon seeing wetness after waking.",
      "State 2 Requiring Fard Ghusl — Jima' (Iltiqa al-Khitanayn): Penetration of the glans (Hashafah) in marital intercourse, even if no ejaculation occurs (Ghusl becomes Fard on both spouses).",
      "State 3 Requiring Fard Ghusl — Completion of Hayd (Menstruation): Cessation of menstrual bleeding (minimum 3 days/72 hours, maximum 10 days/240 hours in Hanafi Fiqh).",
      "State 4 Requiring Fard Ghusl — Completion of Nifas (Postnatal Bleeding): Cessation of bleeding after childbirth (no minimum limit; maximum 40 days in Hanafi Fiqh).",
      "Important Barrier Warning: Waterproof barriers such as nail polish, acrylic nails, superglue, thick paint, dried dough, or solid wax prevent Fard #3 from being fulfilled and render both Ghusl and Wudu invalid (natural henna/mehndi stain without a crust does not block water).",
    ],
    source:
      "Bahar-e-Shariat, Vol. 1, Part 2 (Ghusl ka Bayan); Al-Durr al-Mukhtar; Radd al-Muhtar; Fatawa Razawiyya, Vol. 1.",
  },
  {
    id: "tayammum",
    title: "Method of Tayammum (Dry Purification)",
    urduTitle: "طریقۂ تیمم (حنفی)",
    subtitle:
      "Merciful Shariah substitute for BOTH Wudu and Ghusl using pure earth-genus surfaces (Jins al-Ard) when water is genuinely unavailable or medically harmful.",
    faraid: [
      "1. Niyyah (Specific Intention) — Unlike Wudu and Ghusl (where intention is Sunnah), Niyyah is FARD in Tayammum! One must intend attaining purity from ritual impurity or permitting Salah at the time of striking the hands on pure earth.",
      "2. First Strike (Zarb-e-Awwal) & Wiping the Entire Face — Striking both palms on pure earth/stone/dust and wiping the entire face (forehead hairline to beneath chin, earlobe to earlobe) so no spot remains unwiped.",
      "3. Second Strike (Zarb-e-Thani) & Wiping Both Arms Including Elbows — Striking both palms a second time on pure earth and wiping the entire right arm including the elbow, then the entire left arm including the elbow (removing rings/bangles so skin underneath is wiped).",
    ],
    sunanSteps: [
      {
        stepNum: 1,
        title: "Verify Valid Shar'i Excuse ('Uzr) & Make Fard Niyyah",
        ruling: "Fard",
        detail:
          "Confirm a valid Hanafi excuse: (a) Water is absent within 1 Shar'i mile (~1.85 km / 4,000 steps) in all directions after reasonable search, (b) using water will cause illness, worsen an active wound/disease, or delay recovery according to reliable medical experience, (c) extreme freezing cold where no means to warm water exists and grave harm/death is feared, or (d) an enemy/wild beast blocks access to water. Form explicit Niyyah for Salah/Taharah.",
        arabicDua: "نَوَيْتُ التَّيَمُّمَ لِرَفْعِ الْحَدَثِ وَاسْتِبَاحَةِ الصَّلَاةِ",
        transliteration: "Nawaytut-tayammuma li-raf'il-hadathi wa istibahat-is-salah.",
        translation:
          "I intend to perform Tayammum to remove ritual impurity and make Salah permissible.",
      },
      {
        stepNum: 2,
        title: "Recite Bismillah & Select Pure Jins al-Ard (Earth-Genus Surface)",
        ruling: "Sunnah",
        detail:
          "Say Bismillahir-Rahmanir-Rahim. In Hanafi Fiqh (Imam Abu Hanifah & Imam Muhammad), Tayammum is valid on anything of the genus of earth (Jins al-Ard) that neither burns into ash nor melts/softens in fire — such as clean soil, sand, stone, limestone, marble, unpainted clay brick, plaster/gypsum, or clean natural dust settled on an object. (Invalid on wood, metal, glass, plastic, carpet, cloth, or glossy synthetic paint unless thick natural dust rises from it).",
      },
      {
        stepNum: 3,
        title: "First Strike — Dust Off Excess & Wipe Entire Face",
        ruling: "Fard",
        detail:
          "Place both open palms with fingers spread onto the pure earth surface, move them slightly back and forth, lift them, tap the bases of the thumbs together gently to shake off excess dust, and wipe the entire face thoroughly from hairline to chin and earlobe to earlobe (including eyebrows, eyelids, nose creases, and lips).",
      },
      {
        stepNum: 4,
        title: "Second Strike — Wipe Right & Left Arms Including Elbows",
        ruling: "Fard",
        detail:
          "Strike both open palms on the pure earth surface a second time, shake off excess dust, and use the four fingers of the left hand to wipe the outer right forearm from fingertips to past the elbow, then draw the left palm back along the inner right arm up to the wrist (wiping inner right thumb with inner left thumb). Repeat symmetrically with the right hand wiping the entire left arm including the elbow, and perform finger Khilal.",
      },
      {
        stepNum: 5,
        title: "Beard Khilal (If Applicable) & Pray Unlimited Prayers Until Nullified",
        ruling: "Sunnah",
        detail:
          "Pass fingers gently through the beard. Note: In Hanafi Fiqh, one single Tayammum suffices for BOTH major (Ghusl) and minor (Wudu) impurity, can be performed BEFORE the prayer time enters, and remains valid for as many Fard and Nafl prayers as desired until a nullifier occurs.",
      },
    ],
    nullifiers: [
      "Every act or bodily discharge that nullifies Wudu also nullifies Tayammum (or if Tayammum was made for Ghusl, every state requiring Ghusl re-obligates Ghusl/Tayammum).",
      "Ability to use water (Qudrah 'ala isti'mal al-ma'): Finding sufficient clean water within reach, or recovery from the illness/cold that prevented using water, immediately ends Tayammum.",
      "Passing by water within reach while forgetting one had it in luggage (consult Bahar-e-Shariat details on traveler's search duty).",
      "Note: If a person validly prayed Salah with Tayammum and later finds water after finishing Salah (even within the prayer time), that completed Salah does NOT need to be repeated!",
    ],
    source:
      "Bahar-e-Shariat, Vol. 1, Part 2 (Tayammum ka Bayan); Al-Hidayah; Fatawa Alamgiri; Fatawa Razawiyya, Vol. 3.",
  },
];

export const SALAH_POSTURE_STEPS: SalahPostureStep[] = [
  {
    stepNumber: 1,
    id: "niyyah-qibla",
    phase: "Opening & Qiyam",
    title: "Niyyah (Intention) & Facing the Qibla",
    arabicTitle: "النِّيَّةُ وَاسْتِقْبَالُ الْقِبْلَةِ",
    ruling: "Shart (Condition)",
    gazeTarget: "Place of Sajdah (prostration spot on the prayer mat)",
    brothersPosture:
      "Stand upright with calm dignity facing the Ka'bah directly, feet parallel with roughly four fingers' width between them (neither wide apart nor heels pressed tightly together). Ensure Satr-e-'Awrah is fully covered from navel to below the knees (ankles uncovered above shoes, trousers/tehband not hanging below ankles out of pride, and shoulders covered).",
    sistersPosture:
      "Stand upright with complete modesty facing the Ka'bah, feet kept close together. Ensure the entire body is covered in loose, non-transparent garments except the face, both palms (front & back up to wrists), and both feet up to the ankles (covering wrists and hair/neck completely inside the dupatta/jilbab).",
    recitation: {
      label: "Sample Heart & Tongue Niyyah (e.g., 2 Rak'at Fard Fajr)",
      arabic:
        "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى رَكْعَتَيْ صَلَاةِ الْفَجْرِ فَرْضُ اللَّهِ تَعَالَى مُتَوَجِّهًا إِلَى جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      transliteration:
        "Nawaytu an usalliya lillahi Ta'ala rak'atay salatil-Fajri fardullahi Ta'ala mutawajjihan ila jihatil-Ka'batish-Sharifah.",
      english:
        "I intend to pray for Allah Almighty two Rak'ahs of Fard Fajr prayer, facing the noble Ka'bah. (If praying behind an Imam, add: iqtadaytu bi-hadhal-Imam — 'I follow this Imam').",
      urdu: "نیت کی میں نے دو رکعت نماز فجر فرض واسطے اللہ تعالیٰ کے، منہ میرا کعبہ شریف کی طرف (امام کے پیچھے ہوں تو: پیچھے اس امام کے)۔",
    },
    fiqhTip:
      "Firm awareness in the heart of which Fard/Wajib Salah you are praying is the actual Shart; uttering it gently with the tongue in Arabic, Urdu, or your own language is Mustahabb to help gather focus (Hudur-e-Qalb) right before Takbir-e-Tahrima.",
  },
  {
    stepNumber: 2,
    id: "takbir-tahrima",
    phase: "Opening & Qiyam",
    title: "Takbir-e-Tahrima (Opening Consecrating Takbir)",
    arabicTitle: "تَكْبِيرَةُ التَّحْرِيمَةِ",
    ruling: "Fard (Rukn)",
    gazeTarget: "Place of Sajdah (do not tilt the head upward during Takbir)",
    brothersPosture:
      "Without bowing the head, raise both hands outside any cloak so that the tips of both thumbs touch the soft earlobes (Narmah-e-Gosh), fingers remain in their natural spacing (neither rigidly stiff nor clamped shut), and both palms face the Qibla — then pronounce 'Allahu Akbar' clearly enough to hear oneself.",
    sistersPosture:
      "Keeping both hands concealed INSIDE the head-covering/dupatta (chador), raise both hands gently up to shoulder/chest level (Hadhwa al-Mankibayn) with fingers naturally together and both palms facing the Qibla — whispering 'Allahu Akbar' softly so only your own ears hear.",
    recitation: {
      label: "Takbir-e-Tahrima",
      arabic: "اَللّٰهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      english: "Allah is the Greatest.",
      urdu: "اللہ سب سے بڑا ہے۔",
    },
    fiqhTip:
      "Do NOT elongate the 'A' of Allah ('Aaaallahu') or the 'ba' of Akbar ('Akbaaaar') — elongating either changes the Arabic into an interrogative or plural noun and invalidates Salah in Hanafi Fiqh! Fold the hands immediately upon completing 'Akbar' without dropping them to the sides first.",
  },
  {
    stepNumber: 3,
    id: "qiyam-thana",
    phase: "Opening & Qiyam",
    title: "Qiyam (Standing) & Reciting Thana",
    arabicTitle: "الْقِيَامُ وَالثَّنَاءُ",
    ruling: "Sunnah Mu'akkadah",
    gazeTarget: "Place of Sajdah",
    brothersPosture:
      "Place the palm of the right hand over the back of the left wrist BELOW THE NAVEL (Taht as-Surrah): form a ring (Halqah) with the right thumb and right little finger clasping the left wrist, while extending the remaining three middle fingers straight along the left forearm.",
    sistersPosture:
      "Place the palm of the right hand gently over the back of the left hand ON THE CHEST (beneath the collarbone / over the bosom) WITHOUT forming a thumb-and-pinky ring around the wrist — keeping elbows tucked modestly close to the sides.",
    recitation: {
      label: "Thana (Opening Glorification)",
      arabic:
        "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلٰهَ غَيْرُكَ",
      transliteration:
        "Subhanakallahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk.",
      english:
        "Glory be to You, O Allah, and Praise be to You; blessed is Your Name, exalted is Your Majesty, and there is no deity worthy of worship besides You.",
      urdu: "پاک ہے تو اے اللہ! اور تیری ہی حمد کے ساتھ، اور بابرکت ہے تیرا نام، اور بلند ہے تیری شان، اور تیرے سوا کوئی معبود نہیں۔",
    },
    fiqhTip:
      "Standing upright (Qiyam) itself is Fard in Fard & Wajib prayers when able, while tying the hands and reciting Thana silently in the 1st Rak'ah is Sunnah Mu'akkadah for Imam, Munfarid (individual), AND Muqtadi (unless the Imam has already started audible Qira'ah).",
  },
  {
    stepNumber: 4,
    id: "taawwudh-tasmiyah",
    phase: "Opening & Qiyam",
    title: "Ta'awwudh & Tasmiyah",
    arabicTitle: "التَّعَوُّذُ وَالتَّسْمِيَةُ",
    ruling: "Sunnah Mu'akkadah",
    gazeTarget: "Place of Sajdah",
    brothersPosture:
      "Remain calmly in Qiyam with hands clasped below the navel, reciting silently so your own ears can perceive the letters.",
    sistersPosture:
      "Remain calmly in Qiyam with right hand resting over left hand on the chest, reciting silently.",
    recitation: {
      label: "Ta'awwudh & Tasmiyah",
      arabic:
        "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ ۝ بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ",
      transliteration:
        "A'udhu billahi minash-shaytanir-rajim. Bismillahir-Rahmanir-Rahim.",
      english:
        "I seek refuge in Allah from Satan, the accursed. In the Name of Allah, the Most Compassionate, the Most Merciful.",
      urdu: "میں اللہ کی پناہ مانگتا ہوں شیطان مردود سے۔ اللہ کے نام سے شروع جو نہایت مہربان رحم والا ہے۔",
    },
    fiqhTip:
      "Hanafi Ruling (Bahar-e-Shariat): Ta'awwudh is recited ONLY in the 1st Rak'ah before Qira'ah, while Tasmiyah (Bismillah) is recited silently at the start of EVERY Rak'ah before Surah Al-Fatihah. Note: A Muqtadi praying behind an Imam does NOT recite Ta'awwudh, Tasmiyah, Fatihah, or a Surah!",
  },
  {
    stepNumber: 5,
    id: "surah-fatihah",
    phase: "Opening & Qiyam",
    title: "Recitation of Surah Al-Fatihah & Quiet Amin",
    arabicTitle: "قِرَاءَةُ سُورَةِ الْفَاتِحَةِ",
    ruling: "Wajib",
    gazeTarget: "Place of Sajdah",
    brothersPosture:
      "Stand still in Qiyam without swaying. If praying alone (Munfarid), recite quietly (Sirri) in Dhuhr/Asr and may choose quiet or audible in Fajr/Maghrib/Isha. If praying behind an Imam (Muqtadi), remain completely silent and listen attentively.",
    sistersPosture:
      "Stand still in Qiyam with hands on the chest. Sisters ALWAYS recite quietly (Sirri — audible only to themselves) in all prayers so no non-Mahram could ever hear their voice; if behind an Imam, remain silent.",
    recitation: {
      label: "Surah Al-Fatihah + Quiet Amin",
      arabic:
        "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝ (آمِينَ)",
      transliteration:
        "Al-hamdu lillahi Rabbil-'alamin. Ar-Rahmanir-Rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-ladhina an'amta 'alayhim ghayril-maghdubi 'alayhim wa lad-dallin. (Amin)",
      english:
        "All praise belongs to Allah, Lord of all worlds, the Most Compassionate, the Most Merciful, Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us upon the Straight Path — the path of those whom You have blessed, not of those who incurred wrath, nor of those who went astray. (O Allah, accept!)",
      urdu: "سب خوبیاں اللہ کو جو مالِک سارے جہان والوں کا، بہت مہربان رحمت والا، روزِ جزا کا مالک۔ ہم تجھی کو پوجیں اور تجھی سے مدد چاہیں۔ ہمیں سیدھا راستہ چلا، راستہ اُن کا جن پر تُو نے احسان کیا، نہ اُن کا جن پر غضب ہوا اور نہ بہکے ہوؤں کا۔ (آمین)",
    },
    fiqhTip:
      "Core Hanafi Principle: Absolute Qira'ah (at least 1 long or 3 short verses) is Fard, while specifically reciting Surah Al-Fatihah is WAJIB upon the Imam and Munfarid. Behind an Imam (whether Sirri or Jahri prayer), the Imam's recitation suffices for the follower ('Man kana lahu Imamun fa-qira'atul-Imami lahu qira'ah') — so the Muqtadi listens silently and says 'Amin' quietly (Sirran), NEVER shouting Amin aloud!",
  },
  {
    stepNumber: 6,
    id: "damima-surah",
    phase: "Opening & Qiyam",
    title: "Damima — Joining a Surah or 3 Short Verses",
    arabicTitle: "ضَمُّ السُّورَةِ (الْقِرَاءَةُ)",
    ruling: "Wajib",
    gazeTarget: "Place of Sajdah",
    brothersPosture:
      "Remain calm in Qiyam with hands tied below the navel, pronouncing Arabic letters from their proper Makharij without rushing.",
    sistersPosture:
      "Remain calm in Qiyam with hands resting on the chest, reciting softly with clear Tajwid.",
    recitation: {
      label: "Surah Al-Kawthar & Surah Al-Ikhlas (Examples for 1st & 2nd Rak'ah)",
      arabic:
        "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ ۝ — قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      transliteration:
        "Inna a'taynaka al-Kawthar. Fa-salli li-Rabbika wanhar. Inna shani'aka huwal-abtar. — Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
      english:
        "Indeed, We have granted you Al-Kawthar (Abundance). So pray to your Lord and sacrifice. Indeed, your enemy is the one cut off. — Say: He is Allah, the One. Allah, the Self-Sufficient Master. He neither begets nor was He begotten, nor is there anyone equal to Him.",
      urdu: "بیشک ہم نے تمہیں کوثر عطا فرمایا، تو اپنے رب کے لیے نماز پڑھو اور قربانی کرو، بیشک تمہارا دشمن ہی بے نشان ہے۔ — تم فرماؤ: وہ اللہ ایک ہے، اللہ بے نیاز ہے، نہ اس نے کسی کو جنا اور نہ وہ جنا گیا، اور نہ کوئی اس کے جوڑ کا ہے۔",
    },
    fiqhTip:
      "Damima (joining a complete Surah, or 1 long verse equal to 3 short verses, or 3 short verses) after Fatihah is WAJIB in the first two Rak'ahs of every Fard prayer, and in ALL Rak'ahs of Witr, Sunnah, and Nafl prayers. Observe Tartib (Quranic order): do not recite an earlier Surah in the 2nd Rak'ah after a later Surah in the 1st Rak'ah (e.g., recite Al-Kawthar in 1st, Al-Ikhlas in 2nd).",
  },
  {
    stepNumber: 7,
    id: "ruku-bowing",
    phase: "Ruku & Qaumah",
    title: "Ruku' — Bowing in Reverence",
    arabicTitle: "الرُّكُوعُ",
    ruling: "Fard (Rukn)",
    gazeTarget: "Between the tops of both feet (Pusht-e-Qadam)",
    brothersPosture:
      "Saying 'Allahu Akbar' while moving (Takbir-e-Intiqal, without raising hands), bow to a full 90-degree flat angle so the head, neck, and back form a straight horizontal plane (if a cup of water were placed on the back, it would remain steady). Grasp both knees firmly with fingers spread apart (Farij al-Asabi'), keep legs straight, and hold elbows away from the ribs/sides.",
    sistersPosture:
      "Saying 'Allahu Akbar' gently, bow ONLY enough for the fingertips/palms to reach the knees (do NOT flatten the back to 90 degrees like men). Place both hands lightly on the knees with fingers kept close together (WITHOUT spreading them or gripping the kneecaps), knees slightly bent, and keep arms/elbows tucked closely against the sides of the body.",
    recitation: {
      label: "Tasbih of Ruku' (3, 5, or 7 Times — Odd Number)",
      arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
      transliteration: "Subhana Rabbiyal-'Azim",
      english: "Glory be to my Lord, the Magnificent.",
      urdu: "پاک ہے میرا رب بڑی عظمت والا۔",
    },
    fiqhTip:
      "Bowing until the hands can reach the knees is Fard; pausing calmly in Ruku' for at least the duration of one 'Subhanallah' (Ta'dil-e-Arkan) is WAJIB in Hanafi Fiqh (missing Ta'dil-e-Arkan necessitates Sajda-e-Sahw or repeating the prayer), and reciting 'Subhana Rabbiyal-'Azim' at least 3 times is Sunnah.",
  },
  {
    stepNumber: 8,
    id: "qaumah-standing",
    phase: "Ruku & Qaumah",
    title: "Qaumah — Rising Upright from Ruku'",
    arabicTitle: "الْقَوْمَةُ",
    ruling: "Wajib",
    gazeTarget: "Place of Sajdah",
    brothersPosture:
      "Rise smoothly until the spine is completely upright and every vertebra settles into place, letting both arms hang naturally straight down at the sides (do NOT re-tie the hands after Ruku'). Pause calmly before descending to Sajdah.",
    sistersPosture:
      "Rise smoothly until standing completely straight with arms resting naturally and modestly down along the sides inside the outer covering, pausing calmly before descending to Sajdah.",
    recitation: {
      label: "Tasmi' & Tahmid in Qaumah",
      arabic:
        "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ",
      transliteration:
        "Sami'allahu liman hamidah. Rabbana wa lakal-hamd.",
      english:
        "Allah hears the one who praises Him. O our Lord, and to You belongs all praise!",
      urdu: "اللہ نے سن لیا جس نے اس کی تعریف کی۔ اے ہمارے رب! اور تیرے ہی لیے سب تعریف ہے۔",
    },
    fiqhTip:
      "Hanafi Distribution (Bahar-e-Shariat): An Imam says ONLY 'Sami'allahu liman hamidah' aloud while rising; the Muqtadi says ONLY 'Allahumma Rabbana wa lakal-hamd' (or 'Rabbana lakal-hamd') quietly; and a Munfarid (praying alone) recites BOTH! Warning: Rushing straight down into Sajdah without standing fully upright in Qaumah omits a Wajib!",
  },
  
  {
    stepNumber: 9,
    id: "first-sajdah",
    phase: "Sujood & Jalsah",
    title: "First Sajdah — Prostration upon Seven Bones",
    arabicTitle: "السَّجْدَةُ الْأُولَىٰ",
    ruling: "Fard (Rukn)",
    gazeTarget: "Tip and sides of the nose (Narmah-e-Bini)",
    brothersPosture:
      "Saying 'Allahu Akbar' without raising hands, descend in Hanafi Sunnah sequence: BOTH KNEES first → BOTH HANDS → NOSE → FOREHEAD firmly on the ground (feeling the firmness of the ground with forehead & nose bone). Place palms flat near the ears with fingers joined pointing toward Qibla. Keep the belly raised clearly off the thighs, elbows lifted completely off the ground (laying forearms on the floor like a beast is Makruh Tahrimi for men!) and away from the ribs, and keep BOTH FEET upright with the pads of the toes bent firmly facing the Qibla.",
    sistersPosture:
      "Saying 'Allahu Akbar', descend gently knees → hands → nose → forehead, adopting a compact, concealed prostration (Inzimam): rest the stomach against both thighs, tuck the upper arms closely against the ribs, rest BOTH FOREARMS flat along the ground (unlike men), and bring both feet out modestly toward the right side rather than propping the body high.",
    recitation: {
      label: "Tasbih of Sajdah (3, 5, or 7 Times — Odd Number)",
      arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
      transliteration: "Subhana Rabbiyal-A'la",
      english: "Glory be to my Lord, the Most High.",
      urdu: "پاک ہے میرا رب سب سے بلند۔",
    },
    fiqhTip:
      "Bahar-e-Shariat Vital Ruling: Resting the forehead firmly is Fard, joining the hard bridge of the nose with it is Wajib, AND keeping at least ONE TOE of each foot pressed to the ground facing Qibla is FARD (keeping three toes of each foot is Wajib)! If both feet lift off the floor for the entire Sajdah, the Sajdah is INVALID!",
  },
  {
    stepNumber: 10,
    id: "jalsah-between-sujood",
    phase: "Sujood & Jalsah",
    title: "Jalsah — Sitting Calmly Between Two Sajdahs",
    arabicTitle: "الْجَلْسَةُ بَيْنَ السَّجْدَتَيْنِ",
    ruling: "Wajib",
    gazeTarget: "Into the lap (Goad / Hijr)",
    brothersPosture:
      "Saying 'Allahu Akbar', lift forehead first → nose → hands → sit completely upright in Iftirash: flatten the left foot and sit squarely upon it, while keeping the right foot vertical with its toes bent toward the Qibla. Rest both palms flat on the thighs near the knees with fingers facing Qibla.",
    sistersPosture:
      "Saying 'Allahu Akbar', rise from Sajdah and sit in Tawarruk: rest the left hip directly on the prayer mat while drawing both legs/feet out modestly to the right side, placing both hands flat on the thighs with fingers kept together.",
    recitation: {
      label: "Masnoon Dua in Jalsah",
      arabic:
        "اَللّٰهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَعَافِنِي وَاهْدِنِي وَارْزُقْنِي",
      transliteration:
        "Allahummaghfir li warhamni wa 'afini wahdini warzuqni.",
      english:
        "O Allah! Forgive me, have mercy on me, grant me well-being, guide me, and provide for me.",
      urdu: "اے اللہ! مجھے بخش دے، مجھ پر رحم فرما، مجھے عافیت دے، مجھے ہدایت عطا فرما اور مجھے رزق نصیب فرما۔",
    },
    fiqhTip:
      "Sitting completely upright with stillness (Ta'dil-e-Arkan for at least the span of 'Subhanallah') between the two prostrations is WAJIB; merely lifting the head partway and pecking back down invalidates the Wajib and necessitates Sajda-e-Sahw.",
  },
  {
    stepNumber: 11,
    id: "second-sajdah",
    phase: "Sujood & Jalsah",
    title: "Second Sajdah — Completing the Rak'ah's Prostrations",
    arabicTitle: "السَّجْدَةُ الثَّانِيَةُ",
    ruling: "Fard (Rukn)",
    gazeTarget: "Tip and sides of the nose",
    brothersPosture:
      "Saying 'Allahu Akbar', descend into the second Sajdah in the exact same dignified posture: forehead and nose firmly planted, palms by the ears with joined fingers facing Qibla, elbows raised off the floor and away from sides, belly separated from thighs, and toes of both feet pressed toward Qibla.",
    sistersPosture:
      "Saying 'Allahu Akbar', descend into the second Sajdah in the same compact, modest posture: forehead and nose planted, belly touching thighs, forearms resting on the mat tucked close to the sides.",
    recitation: {
      label: "Tasbih of Second Sajdah (At Least 3 Times)",
      arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
      transliteration: "Subhana Rabbiyal-A'la",
      english: "Glory be to my Lord, the Most High.",
      urdu: "پاک ہے میرا رب سب سے بلند۔",
    },
    fiqhTip:
      "Every Rak'ah has TWO Fard Sajdahs — omitting the second Sajdah leaves the Rak'ah incomplete.",
  },
  {
    stepNumber: 12,
    id: "rising-second-rakah",
    phase: "Sujood & Jalsah",
    title: "Rising for the Second Rak'ah",
    arabicTitle: "الْقِيَامُ إِلَى الرَّكْعَةِ الثَّانِيَةِ",
    ruling: "Fard (Rukn)",
    gazeTarget: "Place of Sajdah",
    brothersPosture:
      "Saying 'Allahu Akbar', lift in exact reverse order of descent: FOREHEAD first → NOSE → HANDS onto knees → KNEES off the ground, rising smoothly on the balls of the feet by pressing one's own thighs/knees WITHOUT leaning palms on the floor (unless elderly, injured, or overweight) and without pausing for an extra sitting (Jalsat al-Istirahah is not Sunnah in Hanafi Fiqh when healthy). Immediately tie hands below the navel.",
    sistersPosture:
      "Saying 'Allahu Akbar', lift forehead → nose → hands → knees smoothly without leaning heavily on the floor unless needed due to weakness, stand straight facing Qibla, and place the right hand over the left hand on the chest.",
    recitation: {
      label: "Start of 2nd Rak'ah: Tasmiyah + Fatihah + Surah",
      arabic: "بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ",
      transliteration: "Bismillahir-Rahmanir-Rahim (followed by Surah Al-Fatihah & another Surah)",
      english:
        "In the Name of Allah, the Most Compassionate, the Most Merciful — then recite Surah Al-Fatihah and a second Surah, followed by Ruku', Qaumah, and two Sajdahs.",
      urdu: "بسم اللہ الرحمٰن الرحیم پڑھ کر سورۂ فاتحہ اور دوسری سورت ملائیں (ثناء اور تعوذ دوسری رکعت میں نہیں پڑھے جاتے)، پھر رکوع، قومہ اور دو سجدے ادا کریں۔",
    },
    fiqhTip:
      "In the 2nd Rak'ah, do NOT recite Thana or Ta'awwudh — begin directly with silent Bismillah, Surah Al-Fatihah, and a second Surah (slightly shorter than or equal to the 1st Rak'ah's Surah in Fajr/Dhuhr).",
  },
  {
    stepNumber: 13,
    id: "qadah-tashahhud",
    phase: "Qa'dah & Tashahhud",
    title: "Qa'dah & Tashahhud (At-Tahiyyat) + Shahadah Finger Rule",
    arabicTitle: "الْقَعْدَةُ وَالتَّشَهُّدُ (التَّحِيَّاتُ)",
    ruling: "Fard (Rukn)",
    gazeTarget: "Into the lap (moving slightly to the right index finger during Isharah)",
    brothersPosture:
      "Sit in IFTIRASH: flatten the left foot horizontally and sit upon it, keeping the right foot vertical with toes bent toward Qibla. Rest both hands on the thighs near the knees with fingers naturally facing Qibla. HANAFI SHAHADAH RULE: As you approach 'Ash-hadu an LA ILAHA', fold the ring and little fingers of the right hand into the palm, join the tip of the middle finger with the tip of the thumb to form a ring (Halqah), and RAISE ONLY THE RIGHT INDEX FINGER at 'LA' (negation) WITHOUT wiggling or circling it; then LOWER it flat at 'ILLALLAH' (affirmation), relaxing all fingers straight onto the thigh until the end of Salah.",
    sistersPosture:
      "Sit in TAWARRUK: rest the left hip comfortably on the ground and extend both legs/feet modestly out to the right side underneath the jilbab/chador, keeping thighs pressed closely together and hands flat on the thighs. Perform the exact same Hanafi Shahadah Isharah at 'La ilaha' (forming thumb-middle finger ring, raising index finger cleanly at 'La ilaha', lowering at 'illallah' without wiggling).",
    recitation: {
      label: "Tashahhud (At-Tahiyyat — Abdullah ibn Mas'ud's Narration)",
      arabic:
        "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
      transliteration:
        "At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu 'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ash-hadu an la ilaha illallahu wa ash-hadu anna Muhammadan 'abduhu wa rasuluh.",
      english:
        "All verbal devotions, bodily prayers, and pure financial offerings belong to Allah. Peace be upon you, O Prophet ﷺ, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad ﷺ is His servant and Messenger.",
      urdu: "تمام قولی، بدنی اور مالی عبادتیں اللہ ہی کے لیے ہیں۔ سلام ہو آپ پر اے نبی ﷺ اور اللہ کی رحمت اور اس کی برکتیں۔ سلام ہو ہم پر اور اللہ کے نیک بندوں پر۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور میں گواہی دیتا ہوں کہ محمد ﷺ اس کے بندے اور رسول ہیں۔",
    },
    fiqhTip:
      "Crucial Distinction: Sitting in Qa'dah Ula (after 2nd Rak'ah in a 3- or 4-Rak'ah prayer) is WAJIB — in Fard, Witr, and Sunnah Mu'akkadah, stand up IMMEDIATELY upon finishing 'abduhu wa rasuluh' without adding a single word of Durood (adding 'Allahumma salli 'ala Muhammad' in Qa'dah Ula of Fard/Witr/Sunnah Mu'akkadah necessitates Sajda-e-Sahw!). Sitting in Qa'dah Akhirah (final sitting for the duration of Tashahhud) is FARD (Rukn), while reciting Tashahhud itself in both sittings is WAJIB.",
  },
  {
    stepNumber: 14,
    id: "durood-ibrahimi",
    phase: "Qa'dah & Tashahhud",
    title: "Durood-e-Ibrahimi in Qa'dah Akhirah (Final Sitting)",
    arabicTitle: "الصَّلَاةُ الْإِبْرَاهِيمِيَّةُ",
    ruling: "Sunnah Mu'akkadah",
    gazeTarget: "Into the lap",
    brothersPosture:
      "Remain seated calmly in Iftirash with both palms resting naturally flat on the thighs, fingers pointing toward Qibla.",
    sistersPosture:
      "Remain seated calmly in Tawarruk (on left hip, both feet to the right) with hands resting gently on the thighs.",
    recitation: {
      label: "Durood-e-Ibrahimi",
      arabic:
        "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ ۝ اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
      transliteration:
        "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidum-Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammadin kama barakta 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidum-Majid.",
      english:
        "O Allah! Shower blessings upon Muhammad ﷺ and upon the family of Muhammad ﷺ, just as You showered blessings upon Ibrahim (peace be upon him) and upon the family of Ibrahim; indeed, You are Praiseworthy, Glorious. O Allah! Bestow barakah upon Muhammad ﷺ and upon the family of Muhammad ﷺ, just as You bestowed barakah upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy, Glorious.",
      urdu: "اے اللہ! رحمت بھیج محمد ﷺ پر اور آلِ محمد ﷺ پر جس طرح تو نے رحمت بھیجی ابراہیم علیہ السلام پر اور آلِ ابراہیم پر، بیشک تو تعریف والا بزرگی والا ہے۔ اے اللہ! برکت نازل فرما محمد ﷺ پر اور آلِ محمد ﷺ پر جس طرح تو نے برکت نازل فرمائی ابراہیم علیہ السلام پر اور آلِ ابراہیم پر، بیشک تو تعریف والا بزرگی والا ہے۔",
    },
    fiqhTip:
      "Reciting Durood-e-Ibrahimi after Tashahhud in the final sitting of every Salah (and also in the 2nd Rak'ah sitting of 4-Rak'ah Sunnah Ghayr Mu'akkadah & Nafl) is Sunnah Mu'akkadah.",
  },
  {
    stepNumber: 15,
    id: "dua-masura",
    phase: "Qa'dah & Tashahhud",
    title: "Dua-e-Masura Before Salam",
    arabicTitle: "الدُّعَاءُ الْمَأْثُورُ قَبْلَ السَّلَامِ",
    ruling: "Mustahabb",
    gazeTarget: "Into the lap",
    brothersPosture:
      "Remain seated in Iftirash with calm humility of heart before ending the prayer.",
    sistersPosture:
      "Remain seated in Tawarruk with calm humility and concentration.",
    recitation: {
      label: "Dua-e-Masura (Taught to Sayyiduna Abu Bakr Siddiq رضي الله عنه + Quranic Dua)",
      arabic:
        "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ ۝ (أَوْ: رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ)",
      transliteration:
        "Allahumma inni zalamtu nafsi zulman kathiran wa la yaghfirudh-dhunuba illa Anta, faghfir li maghfiratan min 'indika warhamni, innaka Antal-Ghafurur-Rahim. (Or: Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.)",
      english:
        "O Allah! Indeed, I have wronged my soul greatly, and none forgives sins except You; so grant me forgiveness from Your Presence and have mercy upon me — indeed, You are the Oft-Forgiving, Most Merciful. (Or: O our Lord! Grant us good in this world and good in the Hereafter, and save us from the torment of the Fire.)",
      urdu: "اے اللہ! بیشک میں نے اپنی جان پر بہت ظلم کیا اور تیرے سوا کوئی گناہ نہیں بخشتا، پس اپنی خاص بخشش سے مجھے بخش دے اور مجھ پر رحم فرما، بیشک تو ہی بخشنے والا مہربان ہے۔ (یا: اے ہمارے رب! ہمیں دنیا میں بھلائی عطا فرما اور آخرت میں بھلائی عطا فرما اور ہمیں دوزخ کے عذاب سے بچا۔)",
    },
    fiqhTip:
      "Hanafi Fiqh Rule: Inside Salah, one may ONLY supplicate in Arabic using Duas from the Quran or Hadith that resemble hereafter/ukhrawi supplications (not mundane human requests like 'O Allah give me such-and-such money/job/spouse', nor in English/Urdu — doing so invalidates Salah!).",
  },
  {
    stepNumber: 16,
    id: "salam-conclusion",
    phase: "Salam & Conclusion",
    title: "Turning Salam Right & Left + Post-Salah Masnoon Adhkar",
    arabicTitle: "التَّسْلِيمُ وَالْأَذْكَارُ الْمَسْنُونَةُ",
    ruling: "Wajib",
    gazeTarget: "Right shoulder on 1st Salam, then left shoulder on 2nd Salam",
    brothersPosture:
      "Turn the head cleanly to the right so the right cheek could be seen from behind while looking at the right shoulder and saying 'As-salamu 'alaykum wa rahmatullah'; then turn cleanly to the left looking at the left shoulder and saying 'As-salamu 'alaykum wa rahmatullah'. Intend greeting the angels (Kiraman Katibin & guardians), the Imam (if directly ahead), and fellow believers on each side.",
    sistersPosture:
      "Turn the head gently to the right looking at the right shoulder and whispering 'As-salamu 'alaykum wa rahmatullah', then turn gently to the left looking at the left shoulder and whispering 'As-salamu 'alaykum wa rahmatullah', maintaining full covering.",
    recitation: {
      label: "Salam & Immediate Post-Salah Masnoon Dhikr",
      arabic:
        "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ (يَمِينًا وَشِمَالًا) ۝ أَسْتَغْفِرُ اللَّهَ (٣ مَرَّاتٍ) ۝ اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
      transliteration:
        "As-salamu 'alaykum wa rahmatullah (right & left). — Astaghfirullah (3x). Allahumma Antas-Salamu wa minkas-salamu, tabarakta ya Dhal-Jalali wal-Ikram.",
      english:
        "Peace be upon you and the mercy of Allah (right & left). — I seek forgiveness from Allah (3x). O Allah! You are Peace and from You comes peace; blessed are You, O Possessor of Majesty and Honor.",
      urdu: "تم پر سلامتی ہو اور اللہ کی رحمت (دائیں اور بائیں)۔ — میں اللہ سے بخشش مانگتا ہوں (۳ بار)۔ اے اللہ! تو ہی سلامتی دینے والا ہے اور تیری ہی طرف سے سلامتی ہے، تو بڑی برکت والا ہے اے جلال اور عزت والے۔",
    },
    fiqhTip:
      "Exiting Salah by one's deliberate action (Khuruj bi-Sun'ihi) is Fard, while uttering the word 'As-salam' both right and left is WAJIB in Hanafi Fiqh. Note from Bahar-e-Shariat: When Fard Salah is followed by Sunnah Ba'diyyah (Dhuhr, Maghrib, Isha, Jumu'ah), recite only the short Dua ('Allahumma Antas-Salam...') and stand promptly for Sunnahs without long delay; perform Tasbih-e-Fatimah (33x Subhanallah, 33x Alhamdulillah, 34x Allahu Akbar), Ayat al-Kursi, and lengthy collective Dua AFTER completing the Sunnahs!",
  },
];

export const SPECIAL_PRAYER_BLUEPRINTS: SpecialPrayerBlueprint[] = [
  {
    id: "fajr-2-fard",
    category: "Daily Fard",
    title: "2 Rak'at Fard (Fajr & General 2-Rak'at Blueprint)",
    arabicTitle: "صَلَاةُ الْفَجْرِ (رَكْعَتَا الْفَرْضِ)",
    rakatsSummary: "2 Sunnah Mu'akkadah (strongest Sunnah) + 2 Fard = 4 Total Rak'ahs",
    ruling: "Fard 'Ayn (Individual Obligation)",
    timeWindow:
      "From Subh Sadiq (true dawn, 18° astronomical depression) until just before the upper rim of the sun appears at Sunrise.",
    overview:
      "Fajr consists of 2 Rak'ahs of emphasized Sunnah Mu'akkadah (nearly Wajib in strength) followed by 2 Rak'ahs of Fard. This 2-Rak'at blueprint also serves as the foundational structure for any 2-Rak'at Sunnah or Nafl prayer.",
    rakatByRakat: [
      {
        heading: "Pre-Fard: 2 Rak'at Sunnah Mu'akkadah of Fajr",
        instructions:
          "Pray 2 Rak'ahs individually before the Fard congregation (ideally reciting Surah Al-Kafirun in the 1st Rak'ah and Surah Al-Ikhlas in the 2nd Rak'ah). No other Nafl prayer is permitted after Subh Sadiq enters before Fajr Fard except these 2 Sunnahs.",
      },
      {
        heading: "1st Rak'ah (Fard)",
        instructions:
          "Form Niyyah for 2 Rak'at Fard Fajr → Takbir-e-Tahrima ('Allahu Akbar') → Fold hands & recite Thana silently → If Munfarid/Imam: Ta'awwudh, Tasmiyah, Surah Al-Fatihah, quiet 'Amin', and a longer Surah (Tiwal al-Mufassal, e.g., Al-Hujurat to Al-Buruj, or any Surah; audible/Jahri for Imam) → If Muqtadi behind Imam: remain silent after Thana and listen attentively to the Imam's Qira'ah → Perform Ruku' (3x Subhana Rabbiyal-'Azim), Qaumah, First Sajdah, Jalsah, and Second Sajdah.",
      },
      {
        heading: "2nd Rak'ah (Fard) & Final Sitting",
        instructions:
          "Rise with 'Allahu Akbar' to Qiyam → If Munfarid/Imam: recite silent Tasmiyah, Surah Al-Fatihah, quiet 'Amin', and a second Surah (slightly shorter than the 1st Rak'ah) → If Muqtadi: listen silently → Perform Ruku', Qaumah, and two Sajdahs → Sit in Qa'dah Akhirah: recite Tashahhud (At-Tahiyyat with Shahadah finger Isharah), Durood-e-Ibrahimi, and Dua-e-Masura → Turn Salam right and left.",
      },
    ],
    hanafiNotes: [
      "Isfar (Mustahabb Fajr Window): For brothers praying in Jama'ah, starting Fajr when dawn brightness spreads enough that faces are recognizable — while leaving ample time to repeat Salah with Taharah if needed before sunrise — is Mustahabb in Hanafi Fiqh (except at Muzdalifah during Hajj).",
      "No Nafl After Fajr Until Sunrise + 20 Mins: After praying Fajr Fard, Nafl Salah is Makruh until ~20 minutes after sunrise (Ishraq), though missed Qada Fard prayers may still be prayed before sunrise begins.",
      "Missed Fajr Sunnah Rule: If Fajr Sunnahs were missed alongside Fajr Fard, make up BOTH together after sunrise (before Zawal) on that same day; if ONLY the 2 Sunnahs were missed while Fard was prayed in Jama'ah, wait until Ishraq (20 mins post-sunrise) if wishing to pray them.",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 3 & Part 4; Al-Hidayah; Radd al-Muhtar.",
  },
  {
    id: "fard-4-rakat",
    category: "Daily Fard",
    title: "4 Rak'at Fard (Dhuhr, Asr & Isha — Munfarid vs. Muqtadi)",
    arabicTitle: "الْفَرْضُ الرُّبَاعِيُّ (الظُّهْرُ وَالْعَصْرُ وَالْعِشَاءُ)",
    rakatsSummary:
      "Dhuhr: 4 Sunnah + 4 Fard + 2 Sunnah + 2 Nafl | Asr: 4 Sunnah Ghayr Mu'akkadah + 4 Fard | Isha: 4 Sunnah Ghayr Mu'akkadah + 4 Fard + 2 Sunnah + 2 Nafl + 3 Witr + 2 Nafl",
    ruling: "Fard 'Ayn (4 Rak'ahs Fard in Residence; shortened to 2 Rak'ahs Qasr for Shar'i Musafir)",
    timeWindow:
      "Dhuhr: Post-Zawal until Mithlayn (2x shadow + zenith shadow). Asr: From Mithlayn until Sunset (delaying into sunset yellowing without excuse is Makruh Tahrimi). Isha: After disappearance of Shafaq Abyad (white twilight, Imams' Sahibayn vs Abu Hanifah) until Subh Sadiq (first 1/3 night Mustahabb, past midnight Makruh).",
    overview:
      "In all 4-Rak'at Fard prayers, Surah Damima is recited ONLY in the first two Rak'ahs, Qa'dah Ula ends strictly at 'abduhu wa rasuluh', and ONLY Surah Al-Fatihah (without any added Surah) is recited silently in the 3rd and 4th Rak'ahs.",
    rakatByRakat: [
      {
        heading: "1st & 2nd Rak'ahs (With Surah Damima)",
        instructions:
          "1st Rak'ah: Niyyah → Takbir-e-Tahrima → Thana → (Munfarid/Imam: Ta'awwudh, Bismillah, Fatihah + Surah; silent in Dhuhr/Asr, audible for Imam in Isha; Muqtadi listens/stands silently) → Ruku', Qaumah, two Sajdahs. 2nd Rak'ah: Rise with Takbir → (Munfarid/Imam: Bismillah, Fatihah + 2nd Surah; Muqtadi silent) → Ruku', Qaumah, two Sajdahs.",
      },
      {
        heading: "Qa'dah Ula (First Sitting After 2nd Rak'ah — Wajib)",
        instructions:
          "Sit calmly and recite ONLY Tashahhud (At-Tahiyyat) up to 'wa ash-hadu anna Muhammadan 'abduhu wa rasuluh'. Stand up IMMEDIATELY with 'Allahu Akbar' for the 3rd Rak'ah — do NOT recite Durood-e-Ibrahimi here! (Forgetfully reciting up to 'Allahumma salli 'ala Muhammad' makes Sajda-e-Sahw Wajib).",
      },
      {
        heading: "3rd & 4th Rak'ahs (Fatihah Only — Silent for All)",
        instructions:
          "In BOTH the 3rd and 4th Rak'ahs, tie the hands and recite silent Bismillah + Surah Al-Fatihah ONLY (Sunnah) — do NOT join a Surah (even an Imam recites silently in 3rd & 4th Rak'ahs of Isha, while Muqtadis stand silently without reciting anything!). Complete Ruku', Qaumah, and two Sajdahs in each Rak'ah.",
      },
      {
        heading: "Qa'dah Akhirah (Final Sitting After 4th Rak'ah — Fard)",
        instructions:
          "Sit and recite Tashahhud (At-Tahiyyat), full Durood-e-Ibrahimi, and Dua-e-Masura, then conclude with Salam to the right and left.",
      },
    ],
    hanafiNotes: [
      "Muqtadi Behind Imam: Whether the prayer is Jahri (Fajr, Maghrib, Isha) or Sirri (Dhuhr, Asr), a follower (Muqtadi) in Hanafi Fiqh NEVER recites Fatihah or a Surah behind the Imam — he recites Thana in the 1st Rak'ah, All Takbirs, Tasbihat of Ruku/Sujood, Tahmid ('Rabbana wa lakal-hamd'), At-Tahiyyat, Durood, Dua, and Salam.",
      "Forgetfully Adding a Surah in 3rd/4th Rak'ah of Fard: Does NOT require Sajda-e-Sahw (unlike delaying standing from Qa'dah Ula), though deliberately omitting Fatihah in 3rd/4th Rak'ah is contrary to Sunnah.",
      "No Nafl After Asr Fard: Just like post-Fajr, offering Nafl Salah after praying Asr Fard until Maghrib is prohibited/Makruh.",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 3 (Namaz ka Tariqa); Al-Lubab; Nur al-Idah.",
  },
  {
    id: "maghrib-3-fard",
    category: "Daily Fard",
    title: "3 Rak'at Fard (Maghrib)",
    arabicTitle: "صَلَاةُ الْمَغْرِبِ (ثَلَاثُ رَكَعَاتِ الْفَرْضِ)",
    rakatsSummary: "3 Fard + 2 Sunnah Mu'akkadah + 2 Nafl (plus 6 Rak'ahs Awwabin Mustahabb)",
    ruling: "Fard 'Ayn (Never shortened even in Qasr travel!)",
    timeWindow:
      "Immediately after complete Sunset until disappearance of twilight (Shafaq). Hastening Maghrib right after Azan without long gap is Mustahabb.",
    overview:
      "Maghrib Fard is uniquely 3 Rak'ahs (the Witr of the daytime) and is never shortened during travel. It features audible recitation by the Imam in the first 2 Rak'ahs, Qa'dah Ula after the 2nd Rak'ah, silent Fatihah-only in the 3rd Rak'ah, and Qa'dah Akhirah after the 3rd Rak'ah.",
    rakatByRakat: [
      {
        heading: "1st & 2nd Rak'ahs (Qisar al-Mufassal Surahs)",
        instructions:
          "Perform 2 Rak'ahs with Thana in the 1st Rak'ah, Fatihah + short Surahs (Qisar al-Mufassal, from Surah Al-Bayyinah/Az-Zalzalah down to An-Nas — audible for Imam, optional audible/silent for Munfarid, silent listening for Muqtadi), Ruku', Qaumah, and two Sajdahs each.",
      },
      {
        heading: "Qa'dah Ula (After 2nd Rak'ah — Wajib)",
        instructions:
          "Sit and recite ONLY At-Tahiyyat up to 'abduhu wa rasuluh', then immediately rise with 'Allahu Akbar' for the 3rd Rak'ah.",
      },
      {
        heading: "3rd Rak'ah & Qa'dah Akhirah",
        instructions:
          "Stand silently, recite Bismillah + Surah Al-Fatihah ONLY (silent even for Imam; Muqtadi remains silent without Qira'ah), perform Ruku', Qaumah, and two Sajdahs, then sit for Qa'dah Akhirah: recite At-Tahiyyat, Durood-e-Ibrahimi, Dua-e-Masura, and turn Salam right and left.",
      },
    ],
    hanafiNotes: [
      "No Pre-Maghrib Nafl Delay: In Hanafi Fiqh, one does not delay Maghrib Iqamah to pray 2 Rak'ahs between Azan and Iqamah; pray the 3 Fard promptly after Azan (pausing only the span of 3 verses/short step).",
      "Salat al-Awwabin: After Maghrib's 3 Fard, praying 6 Rak'ahs (including the 2 Sunnah Mu'akkadah + 4 Nafl in sets of 2) without worldly talk in between earns the reward of 12 years of worship (Tirmidhi / Bahar-e-Shariat).",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 3 & Part 4; Fatawa Razawiyya, Vol. 5.",
  },
  {
    id: "sunnah-muakkadah-4",
    category: "Sunnah & Wajib",
    title: "4 Rak'at Sunnah Mu'akkadah (Pre-Dhuhr & Jumu'ah)",
    arabicTitle: "الْأَرْبَعُ السُّنَنُ الْمُؤَكَّدَةُ",
    rakatsSummary: "4 Rak'ahs prayed with ONE single Salam at the end of the 4th Rak'ah",
    ruling: "Sunnah Mu'akkadah (Habitually leaving without excuse is sinful & blameworthy)",
    timeWindow:
      "Before Dhuhr Fard (4 Rak'ahs), Before Jumu'ah Khutbah (4 Rak'ahs Qabliyyah), and After Jumu'ah Fard (4 + 2 Rak'ahs Ba'diyyah).",
    overview:
      "Unlike 4-Rak'at Fard, ALL FOUR Rak'ahs of Sunnah Mu'akkadah require Surah Al-Fatihah PLUS a joined Surah (Damima)! Yet like Fard, its Qa'dah Ula (2nd Rak'ah sitting) stops strictly at At-Tahiyyat without Durood or Thana upon rising.",
    rakatByRakat: [
      {
        heading: "1st & 2nd Rak'ahs",
        instructions:
          "Pray 2 normal silent Rak'ahs: 1st Rak'ah with Niyyah, Takbir, Thana, Ta'awwudh, Bismillah, Fatihah + Surah; 2nd Rak'ah with Bismillah, Fatihah + Surah.",
      },
      {
        heading: "Qa'dah Ula (After 2nd Rak'ah — Strictly At-Tahiyyat Only!)",
        instructions:
          "Sit and recite ONLY At-Tahiyyat up to 'abduhu wa rasuluh'. Do NOT recite Durood-e-Ibrahimi or Dua here! (If Durood is recited forgetfully, Sajda-e-Sahw becomes Wajib!). Immediately stand up saying 'Allahu Akbar'.",
      },
      {
        heading: "3rd & 4th Rak'ahs (WITH Bismillah + Fatihah + Surah!)",
        instructions:
          "Do NOT recite Thana or Ta'awwudh at the start of the 3rd Rak'ah. Instead, begin directly with Bismillah + Surah Al-Fatihah + A SURAH in the 3rd Rak'ah, AND Bismillah + Surah Al-Fatihah + A SURAH in the 4th Rak'ah! Conclude the 4th Rak'ah with Qa'dah Akhirah (At-Tahiyyat, Durood-e-Ibrahimi, Dua-e-Masura) and Salam.",
      },
    ],
    hanafiNotes: [
      "Key Difference vs. Fard: In 4-Rak'at Fard, no Surah is joined in the 3rd & 4th Rak'ahs; in 4-Rak'at Sunnah Mu'akkadah, joining a Surah in the 3rd & 4th Rak'ahs is WAJIB!",
      "If Pre-Dhuhr 4 Sunnahs Are Missed Before Jama'ah: Join the Dhuhr Fard Jama'ah first, pray the 2 post-Dhuhr Sunnahs, and THEN pray the missed 4 pre-Dhuhr Sunnahs within Dhuhr time (Bahar-e-Shariat).",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 4 (Sunan wa Nawafil ka Bayan); Radd al-Muhtar.",
  },
  {
    id: "sunnah-ghayr-muakkadah-4",
    category: "Sunnah & Wajib",
    title: "4 Rak'at Sunnah Ghayr Mu'akkadah & Nafl (Pre-Asr & Pre-Isha)",
    arabicTitle: "الْأَرْبَعُ السُّنَنُ غَيْرُ الْمُؤَكَّدَةِ وَالنَّوَافِلُ",
    rakatsSummary: "4 Rak'ahs with ONE Salam (treated internally as two full pairs of 2 Rak'ahs)",
    ruling: "Sunnah Ghayr Mu'akkadah / Mustahabb (Immense reward when prayed; becomes Wajib to complete once started!)",
    timeWindow:
      "Before Asr Fard ('May Allah have mercy on one who prays 4 Rak'ahs before Asr' — Tirmidhi), Before Isha Fard (4 Rak'ahs), and daytime 4-Rak'ah Nafl prayers.",
    overview:
      "In Hanafi Fiqh, every pair of Rak'ahs in Sunnah Ghayr Mu'akkadah and Nafl is an independent unit (Shaf'ah Mustaqillah). Therefore, in Qa'dah Ula you DO recite Durood-e-Ibrahimi and Dua, AND when rising for the 3rd Rak'ah you begin anew with Thana & Ta'awwudh!",
    rakatByRakat: [
      {
        heading: "1st & 2nd Rak'ahs",
        instructions:
          "1st Rak'ah: Niyyah, Takbir, Thana, Ta'awwudh, Bismillah, Fatihah + Surah. 2nd Rak'ah: Bismillah, Fatihah + Surah.",
      },
      {
        heading: "Qa'dah Ula (After 2nd Rak'ah — FULL Tashahhud + Durood + Dua!)",
        instructions:
          "Sit and recite At-Tahiyyat, THEN also recite full Durood-e-Ibrahimi AND Dua-e-Masura (without turning Salam!), then rise saying 'Allahu Akbar' for the 3rd Rak'ah.",
      },
      {
        heading: "3rd & 4th Rak'ahs (Re-opening with Thana + Ta'awwudh!)",
        instructions:
          "Upon standing for the 3rd Rak'ah, recite Thana ('Subhanakallahumma...'), Ta'awwudh, Bismillah, Fatihah + Surah! In the 4th Rak'ah, recite Bismillah, Fatihah + Surah, then complete Qa'dah Akhirah (At-Tahiyyat, Durood-e-Ibrahimi, Dua-e-Masura) and turn Salam right and left.",
      },
    ],
    hanafiNotes: [
      "Crucial Contrast Table in Bahar-e-Shariat: Memorize this golden contrast — Sunnah Mu'akkadah Qa'dah Ula = At-Tahiyyat ONLY; Sunnah Ghayr Mu'akkadah / Nafl Qa'dah Ula = At-Tahiyyat + Durood + Dua + Thana in 3rd Rak'ah!",
      "Rule on Breaking Nafl: Once you begin any Nafl or Sunnah Ghayr Mu'akkadah with Takbir-e-Tahrima, completing it becomes WAJIB in Hanafi Fiqh; if invalidated, Qada of 2 Rak'ahs (or 4 if invalidated after sitting in Qa'dah Ula) becomes Wajib.",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 4 (Sunan Ghayr Mu'akkadah); Al-Durr al-Mukhtar.",
  },
  {
    id: "witr-wajib-3",
    category: "Sunnah & Wajib",
    title: "3 Rak'at Wajib Witr (Hanafi Method with Dua-e-Qunoot)",
    arabicTitle: "صَلَاةُ الْوِتْرِ (ثَلَاثُ رَكَعَاتٍ وَاجِبَةٍ)",
    rakatsSummary: "3 Continuous Rak'ahs with Two Sittings, ONE Salam at the end, & Takbir-e-Qunoot in 3rd Rak'ah",
    ruling: "Wajib (Necessary — missing Witr requires Qada even years later!)",
    timeWindow:
      "After praying Isha Fard until Subh Sadiq (if confident of waking for Tahajjud, delaying Witr to the last third of the night is Afdal; otherwise pray Witr right after Isha Sunnahs before sleeping).",
    overview:
      "In the Hanafi school (established by Mutawatir practice from the Prophet ﷺ and Sayyiduna 'Abdullah ibn Mas'ud, 'Ali, and 'Umar رضي الله عنهم), Witr is strictly 3 continuous Rak'ahs like Maghrib (only ONE Salam at the end of the 3rd Rak'ah), with Surah Damima in ALL THREE Rak'ahs and Takbir + Dua-e-Qunoot BEFORE Ruku' in the 3rd Rak'ah.",
    rakatByRakat: [
      {
        heading: "1st & 2nd Rak'ahs + Qa'dah Ula",
        instructions:
          "Form Niyyah for 3 Rak'at Wajib Witr → Pray 1st Rak'ah (Thana, Ta'awwudh, Bismillah, Fatihah + Surah — Sunnah is Surah Al-A'la) and 2nd Rak'ah (Bismillah, Fatihah + Surah — Sunnah is Surah Al-Kafirun) → Sit in Qa'dah Ula and recite ONLY At-Tahiyyat up to 'abduhu wa rasuluh', then stand immediately with 'Allahu Akbar'.",
      },
      {
        heading: "3rd Rak'ah: Fatihah + Surah + Takbir-e-Qunoot BEFORE Ruku'",
        instructions:
          "Recite Bismillah, Surah Al-Fatihah, and a 3rd Surah (Sunnah is Surah Al-Ikhlas). THEN, BEFORE bowing into Ruku', RAISE BOTH HANDS just like Takbir-e-Tahrima (brothers to earlobes; sisters inside head-covering to shoulders) while saying 'Allahu Akbar' (Takbir-e-Qunoot), RE-TIE YOUR HANDS (below navel for brothers, on chest for sisters), and silently recite Dua-e-Qunoot!",
      },
      {
        heading: "Completing 3rd Rak'ah & Final Salam",
        instructions:
          "After finishing Dua-e-Qunoot, say 'Allahu Akbar' (without raising hands) and go into Ruku', rise to Qaumah, perform two Sajdahs, sit in Qa'dah Akhirah (At-Tahiyyat, Durood-e-Ibrahimi, Dua-e-Masura), and conclude with Salam right and left.",
      },
    ],
    keyRecitation: {
      title: "Dua-e-Qunoot (Complete Hanafi Text)",
      arabic:
        "اَللّٰهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ، وَنَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ ۝ اَللّٰهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ، وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ، وَنَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ، إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ",
      transliteration:
        "Allahumma inna nasta'inuka wa nastaghfiruka wa nu'minu bika wa natawakkalu 'alayka wa nuthni 'alaykal-khayr, wa nashkuruka wa la nakfuruka, wa nakhla'u wa natruku man yafjuruk. Allahumma iyyaka na'budu wa laka nusalli wa nasjudu, wa ilayka nas'a wa nahfidu, wa narju rahmataka wa nakhsha 'adhabaka, inna 'adhabaka bil-kuffari mulhiq.",
      english:
        "O Allah! Indeed we seek Your help, ask Your forgiveness, believe in You, place our trust in You, and praise You with all goodness. We thank You and are never ungrateful to You, and we disown and forsake whoever disobeys You. O Allah! You alone we worship, for You we pray and prostrate, toward You we strive and hasten; we hope for Your mercy and fear Your punishment — indeed, Your punishment is sure to overtake the disbelievers.",
      urdu: "اے اللہ! ہم تجھ ہی سے مدد مانگتے ہیں اور تجھ سے بخشش چاہتے ہیں، تجھ پر ایمان رکھتے ہیں، تجھ پر بھروسہ کرتے ہیں اور تیری اچھی تعریف کرتے ہیں، تیرا شکر ادا کرتے ہیں اور تیری ناشکری نہیں کرتے، اور جو تیری نافرمانی کرے اس سے الگ ہوتے اور اسے چھوڑتے ہیں۔ اے اللہ! ہم تیری ہی عبادت کرتے ہیں اور تیرے ہی لیے نماز پڑھتے اور سجدہ کرتے ہیں، تیری ہی طرف دوڑتے اور لپکتے ہیں، تیری رحمت کی امید رکھتے ہیں اور تیرے عذاب سے ڈرتے ہیں، بیشک تیرا عذاب کافروں کو پہنچنے والا ہے۔",
    },
    hanafiNotes: [
      "What If One Has Not Yet Memorized Dua-e-Qunoot? Until memorized, recite 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar' once, or 'Allahummaghfir li' three times — while actively memorizing Dua-e-Qunoot.",
      "Forgetfully Going to Ruku' Without Qunoot: Do NOT return from Ruku' to Qiyam; complete the prayer and perform Sajda-e-Sahw at the end because Qunoot & Takbir-e-Qunoot are Wajib!",
      "Ramadan Jama'ah Only: Witr is prayed in congregation ONLY during the blessed nights of Ramadan after Tarawih; outside Ramadan, praying Witr with Jama'ah is Makruh.",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 4 (Witr ka Bayan); Sharh Ma'ani al-Athar; Fatawa Razawiyya, Vol. 7.",
  },
  
  {
    id: "jumuah-prayer",
    category: "Congregational & Eid",
    title: "Salat al-Jumu'ah (Friday Congregational Prayer)",
    arabicTitle: "صَلَاةُ الْجُمُعَةِ",
    rakatsSummary: "4 Sunnah Qabliyyah + Arabic Khutbah + 2 Fard (Jama'ah) + 4 Sunnah + 2 Sunnah Ba'diyyah = 12 Rak'ahs (+ 2 Nafl)",
    ruling: "Fard 'Ayn (Stronger than Dhuhr for resident free healthy adult males)",
    timeWindow:
      "Exact same window as Dhuhr (after Zawal until Mithlayn). If the time exits during Jumu'ah, the prayer becomes invalid and Dhuhr Qada must be prayed!",
    overview:
      "Jumu'ah replaces Dhuhr on Friday with a solemn congregation preceded by two Arabic Khutbahs. Bahar-e-Shariat details 6 conditions for Jumu'ah's validity (Misr/town, Sultan/authorized Imam, Dhuhr time, Khutbah before Salah, Jama'ah of at least 3 male followers besides the Imam, and Idhn-e-'Am/public permission).",
    rakatByRakat: [
      {
        heading: "1. Pre-Khutbah: 4 Rak'at Sunnah Mu'akkadah (Qabliyyah)",
        instructions:
          "Perform Ghusl, wear clean clothes & 'Itr, use Miswak, arrive early, and pray 4 Rak'ahs Sunnah Mu'akkadah BEFORE the Second Azan (Azan-e-Khutbah in front of the Minbar). Once the Khatib steps onto the Minbar for the Khutbah, ALL Nafl/Sunnah prayers, speech, Dhikr on tongue, and even replying to Salam become HARAM / Impermissible!",
      },
      {
        heading: "2. Listening to the Two Arabic Khutbahs (Wajib Silence)",
        instructions:
          "Sit facing the Khatib (ideally in Iftirash like Qa'dah of Salah), keeping complete outer and inner silence. Do not talk, gesture, check your phone, or even say 'Quiet!' to someone talking during the Khutbah.",
      },
      {
        heading: "3. 2 Rak'at Fard of Jumu'ah Behind the Imam",
        instructions:
          "Form Niyyah for 2 Rak'at Fard Jumu'ah behind the Imam → Takbir-e-Tahrima → Recite Thana silently, then remain completely silent listening to the Imam's audible Fatihah & Surahs (Sunnah Surahs: Al-Jumu'ah & Al-Munafiqun, or Al-A'la & Al-Ghashiyah) in both Rak'ahs → Complete Ruku', Sujood, Qa'dah Akhirah, and Salam with the Imam.",
      },
      {
        heading: "4. Post-Fard: 4 Sunnah Mu'akkadah + 2 Sunnah Mu'akkadah (+ 2 Nafl)",
        instructions:
          "In Hanafi Fiqh (combining the narrations of Sayyiduna Ibn Mas'ud & Sayyiduna Ibn 'Umar رضي الله عنهم, as preferred by Imam Abu Yusuf and taught in Bahar-e-Shariat), pray 4 Rak'ahs Sunnah Mu'akkadah with one Salam, followed by 2 Rak'ahs Sunnah Mu'akkadah with one Salam (plus 2 optional Nafl).",
      },
    ],
    hanafiNotes: [
      "Sisters, Sick & Travelers: Jumu'ah is not Fard upon sisters, travelers, or the housebound sick — sisters pray 4 Rak'ahs Dhuhr cleanly at home after the city's Jumu'ah concludes.",
      "Joining Late (Masbuq) in Jumu'ah: In Hanafi Fiqh, even if a latecomer catches the Imam in Qa'dah (Tashahhud) BEFORE Salam, he has caught Jumu'ah and stands after the Imam's Salam to complete ONLY 2 Rak'ahs!",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 4 (Jumu'ah ka Bayan); Fatawa Razawiyya, Vol. 8.",
  },
  {
    id: "eidain-prayer",
    category: "Congregational & Eid",
    title: "Salat al-Eidain (Eid al-Fitr & Eid al-Adha — 6 Extra Wajib Takbirs)",
    arabicTitle: "صَلَاةُ الْعِيدَيْنِ (بِتَكْبِيرَاتِ الزَّوَائِدِ السِّتِّ)",
    rakatsSummary: "2 Rak'ahs Wajib in Jama'ah (No Azan, No Iqamah) with 6 Extra Wajib Takbirs + Post-Salah Khutbah",
    ruling: "Wajib (Upon every person on whom Jumu'ah is Fard)",
    timeWindow:
      "From Ishraq (~20 minutes after Sunrise when the sun rises a spear's height) until just before Istiwa/Zawal (Midday).",
    overview:
      "Hanafi Salat al-Eidain features SIX EXTRA WAJIB TAKBIRS (3 BEFORE Qira'ah in the 1st Rak'ah, and 3 AFTER Qira'ah just before Ruku' in the 2nd Rak'ah), followed by two celebratory Arabic Khutbahs AFTER the prayer!",
    rakatByRakat: [
      {
        heading: "1st Rak'ah: 3 Extra Takbirs BEFORE Qira'ah (Drop Drop Tie!)",
        instructions:
          "1) Niyyah ('2 Rak'at Wajib of Eid al-Fitr / Eid al-Adha with 6 Extra Wajib Takbirs behind this Imam') → 2) Takbir-e-Tahrima ('Allahu Akbar', raise hands & TIE HANDS, recite Thana silently) → 3) Extra Takbir #1: Raise hands with Imam saying 'Allahu Akbar' and DROP HANDS straight down at sides (pause 3x Subhanallah) → 4) Extra Takbir #2: Raise hands saying 'Allahu Akbar' and DROP HANDS to sides → 5) Extra Takbir #3: Raise hands saying 'Allahu Akbar' and TIE HANDS below navel! → 6) Listen silently to Imam's audible Fatihah + Surah, then perform Ruku' & two Sajdahs.",
      },
      {
        heading: "2nd Rak'ah: 3 Extra Takbirs AFTER Qira'ah + 4th Takbir into Ruku'!",
        instructions:
          "1) Rise with Imam for 2nd Rak'ah, tie hands, and listen silently FIRST to the Imam's audible Fatihah + Surah! → 2) After Qira'ah finishes, Extra Takbir #4: Raise hands saying 'Allahu Akbar' and DROP HANDS to sides → 3) Extra Takbir #5: Raise hands saying 'Allahu Akbar' and DROP HANDS to sides → 4) Extra Takbir #6: Raise hands saying 'Allahu Akbar' and DROP HANDS to sides (do NOT re-tie!) → 5) Immediately on the NEXT Takbir (Takbir of Ruku', WITHOUT raising hands!), bow directly into Ruku'! → 6) Complete Qaumah, two Sajdahs, Qa'dah Akhirah, and Salam.",
      },
      {
        heading: "Post-Salah: Listening to the Eid Khutbah (Wajib!)",
        instructions:
          "Unlike Jumu'ah, the two Eid Khutbahs are delivered AFTER the 2 Rak'ahs of Eid Salah. Remain seated quietly and listen attentively until the Imam finishes — walking out during the Eid Khutbah violates a Wajib!",
      },
    ],
    hanafiNotes: [
      "Easy Memory Rule ('Drop-Drop-Tie' vs 'Drop-Drop-Drop-Bow'): Whenever an action of standing/reciting follows a Takbir (like after the 3rd Extra Takbir in Rak'ah 1), TIE the hands; whenever NO standing recitation follows (Takbirs 1 & 2 of Rak'ah 1, and all 3 Extra Takbirs of Rak'ah 2 right before Ruku'), DROP the hands to the sides!",
      "Sunnah Contrast Between the Two Eids: On Eid al-Fitr, eat an odd number of dates BEFORE leaving for Eidgah and recite Takbirat softly; on Eid al-Adha, delay eating until AFTER Salah (ideally eating first from your Qurbani meat) and recite Takbir-e-Tashriq aloud on the way! Note: Missed Eid Salah has NO individual Qada.",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 4 (Eidain ka Bayan); Al-Hidayah; Fatawa Razawiyya, Vol. 8.",
  },
  {
    id: "tarawih-tahajjud",
    category: "Congregational & Eid",
    title: "Salat at-Tarawih (20 Rak'ahs) & Salat at-Tahajjud",
    arabicTitle: "صَلَاةُ التَّرَاوِيحِ وَصَلَاةُ التَّهَجُّدِ",
    rakatsSummary: "Tarawih: 20 Rak'ahs (10 Pairs of 2) in Ramadan | Tahajjud: 2 to 8 (or 12) Rak'ahs in Last Third of Night",
    ruling: "Tarawih: Sunnah Mu'akkadah (for BOTH Brothers & Sisters!) | Tahajjud: Sunnah / Most Virtuous Nafl after Fard",
    timeWindow:
      "Tarawih: Every night of Ramadan after Isha Fard (and its 2 Sunnahs) until Subh Sadiq (before or after Witr, though before Witr is Sunnah). Tahajjud: After waking from sleep following Isha, ideally in the final third of the night before Subh Sadiq.",
    overview:
      "By the unbroken consensus (Ijma') of the Sahabah from the era of Sayyiduna 'Umar al-Faruq رضي الله عنه and the four Sunni Madhhabs, Tarawih is 20 Rak'ahs prayed in 10 sets of 2 Rak'ahs with a brief rest (Tarwihah) after every 4 Rak'ahs. Tahajjud is the crown of night devotion of the Auliya and righteous.",
    rakatByRakat: [
      {
        heading: "Salat at-Tarawih Structure (10 × 2 Rak'ahs + Tarwihah)",
        instructions:
          "After praying 4 Fard and 2 Sunnah Mu'akkadah of Isha, pray 20 Rak'ahs in pairs of 2 (turning Salam at the end of EVERY 2nd Rak'ah — brothers in Masjid Jama'ah with Khatm al-Quran once being Sunnah; sisters individually at home). After every 4 Rak'ahs (2 Salams), sit peacefully for the duration of 4 Rak'ahs reciting Tasbih-e-Tarawih ('Subhana Dhil-Mulki wal-Malakut...') or Durood Sharif. After completing all 20 Rak'ahs, pray 3 Rak'ahs Wajib Witr IN JAMA'AH (during Ramadan only).",
      },
      {
        heading: "Salat at-Tahajjud Structure (2 to 8+ Rak'ahs in Pairs)",
        instructions:
          "Sleep after Isha, wake in the blessed final third of the night, clean the teeth with Miswak, perform fresh Wudu, and pray at least 2 Rak'ahs up to 8 (the most frequent Prophetic count) or 12 Rak'ahs in sets of 2 (or sets of 4). Prolong Qiyam, Qira'ah, Ruku', and Sajdah, then pour out heartfelt Duas during the pre-dawn hour of divine descent of mercy (Sahar) before Subh Sadiq.",
      },
    ],
    keyRecitation: {
      title: "Tasbih-e-Tarawih (Recited During Rest After Every 4 Rak'ahs)",
      arabic:
        "سُبْحَانَ ذِي الْمُلْكِ وَالْمَلَكُوتِ، سُبْحَانَ ذِي الْعِزَّةِ وَالْعَظَمَةِ وَالْهَيْبَةِ وَالْقُدْرَةِ وَالْكِبْرِيَاءِ وَالْجَبَرُوتِ، سُبْحَانَ الْمَلِكِ الْحَيِّ الَّذِي لَا يَنَامُ وَلَا يَمُوتُ، سُبُّوحٌ قُدُّوسٌ رَبُّنَا وَرَبُّ الْمَلَائِكَةِ وَالرُّوحِ",
      transliteration:
        "Subhana Dhil-Mulki wal-Malakut, Subhana Dhil-'Izzati wal-'Azamati wal-Haybati wal-Qudrati wal-Kibriya'i wal-Jabarut, Subhanal-Malikil-Hayyil-ladhi la yanamu wa la yamut, Subbuhun Quddusun Rabbuna wa Rabbul-mala'ikati war-Ruh.",
      english:
        "Glory be to the Possessor of earthly sovereignty and heavenly dominion; Glory be to the Possessor of Honor, Magnificence, Awe, Omnipotence, Majesty, and Might; Glory be to the Ever-Living Sovereign Who neither sleeps nor dies — All-Glorious, All-Holy, our Lord and the Lord of the angels and the Spirit (Jibril).",
      urdu: "پاک ہے وہ ذات جو زمین و آسمان کی بادشاہی والی ہے، پاک ہے وہ ذات جو عزت، عظمت، ہیبت، قدرت، بڑائی اور دبدبے والی ہے، پاک ہے وہ زندہ بادشاہ جو نہ سوتا ہے اور نہ مرتا ہے، نہایت پاک اور مقدس ہے ہمارا رب اور فرشتوں اور روح الامین کا رب۔",
    },
    hanafiNotes: [
      "20 Rak'ahs Sunni Heritage: Leaving after 8 Rak'ahs opposes the Ijma' of the Sahabah and all four Sunni schools (Hanafi, Maliki, Shafi'i, Hanbali); Masjid al-Haram and Masjid an-Nabawi have maintained 20 Rak'ahs across the centuries.",
      "Witr & Tahajjud Rule: Do NOT pray Witr twice in one night ('La witran fi laylah'). If you already prayed Witr before sleeping and still wake up for Tahajjud, simply pray Tahajjud Nafls — your earlier Witr stands valid and does not need to be repeated!",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 4 (Tarawih & Nawafil ka Bayan); Fatawa Razawiyya, Vol. 7.",
  },
  {
    id: "janazah-prayer",
    category: "Janazah & Special Nafl",
    title: "Salat al-Janazah (Funeral Prayer — 4 Standing Takbirs)",
    arabicTitle: "صَلَاةُ الْجَنَازَةِ",
    rakatsSummary: "Standing Only (2 Fara'id: 4 Takbirs + Qiyam) — NO Ruku', NO Sajdah, NO Qa'dah",
    ruling: "Fard Kifayah (Communal Obligation — if none perform it, the entire community is sinful)",
    timeWindow:
      "Anytime once the deceased Muslim is bathed & shrouded, EXCEPT during the 3 exact moments of Sunrise, Istiwa/Zawal, and Sunset (if the bier arrives beforehand, it may even be prayed after Fajr/Asr).",
    overview:
      "Salat al-Janazah is a solemn collective intercession for the deceased believer consisting solely of standing (Qiyam) with FOUR Takbirs and ending with Salam. Hands are raised ONLY on the 1st Takbir in Hanafi Fiqh!",
    rakatByRakat: [
      {
        heading: "1st Takbir (Raise Hands Once!) + Extended Janazah Thana",
        instructions:
          "Stand in odd-numbered rows behind the Imam (Imam stands aligned with the deceased's chest). Form Niyyah ('4 Takbirs Salat al-Janazah Fard Kifayah, worship for Allah, Durood upon the Prophet ﷺ, Dua for this deceased believer, behind this Imam'). On the 1st 'Allahu Akbar', RAISE HANDS to earlobes, tie hands below navel, and silently recite Thana INCLUDING the Janazah phrase 'WA JALLA THANA'UKA': 'Subhanakallahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, WA JALLA THANA'UKA, wa la ilaha ghayruk.'",
      },
      {
        heading: "2nd Takbir (Keep Hands Tied!) + Durood-e-Ibrahimi",
        instructions:
          "Say the 2nd 'Allahu Akbar' WITHOUT raising the hands (keep them tied below the navel!), and silently recite full Durood-e-Ibrahimi just as in Salah.",
      },
      {
        heading: "3rd Takbir (Keep Hands Tied!) + Supplication for the Deceased",
        instructions:
          "Say the 3rd 'Allahu Akbar' WITHOUT raising the hands, and silently recite the Masnoon Adult Janazah Dua (for any adult male or female). If the deceased is a minor boy (Na-Baligh لڑکا), recite: 'Allahummaj'alhu lana faratan waj'alhu lana ajran wa dhukhran, waj'alhu lana shafi'an wa mushaffa'a.' If a minor girl (Na-Baligh لڑکی), change pronouns to feminine ('Allahummaj'alha lana faratan waj'alha lana ajran wa dhukhran, waj'alha lana shafi'atan wa mushaffa'ah').",
      },
      {
        heading: "4th Takbir + Turning Salam Right & Left",
        instructions:
          "Say the 4th 'Allahu Akbar' WITHOUT raising the hands, UNTIE/DROP BOTH HANDS down to the sides (or release each hand with its respective Salam), and immediately follow the Imam in turning Salam right ('As-salamu 'alaykum wa rahmatullah') and left ('As-salamu 'alaykum wa rahmatullah') without adding any further Dua after the 4th Takbir.",
      },
    ],
    keyRecitation: {
      title: "Masnoon Janazah Dua for Adult Male & Female",
      arabic:
        "اَللّٰهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا وَصَغِيرِنَا وَكَبِيرِنَا وَذَكَرِنَا وَأُنْثَانَا ۝ اَللّٰهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الْإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الْإِيمَانِ",
      transliteration:
        "Allahummaghfir li-hayyina wa mayyitina wa shahidina wa gha'ibina wa saghirina wa kabirina wa dhakarina wa unthana. Allahumma man ahyaytahu minna fa-ahyihi 'alal-Islam, wa man tawaffaytahu minna fa-tawaffahu 'alal-Iman.",
      english:
        "O Allah! Forgive our living and our dead, those present among us and those absent, our young and our old, our males and our females. O Allah! Whomever among us You keep alive, keep him alive upon Islam; and whomever among us You cause to pass away, cause him to pass away upon Iman (faith).",
      urdu: "اے اللہ! ہمارے زندوں اور ہمارے مردوں، ہمارے حاضروں اور ہمارے غائبوں، ہمارے چھوٹوں اور ہمارے بڑوں، ہمارے مردوں اور ہماری عورتوں کی مغفرت فرما۔ اے اللہ! ہم میں سے جسے تو زندہ رکھے اسے اسلام پر زندہ رکھ، اور ہم میں سے جسے تو وفات دے اسے ایمان پر وفات دے۔",
    },
    hanafiNotes: [
      "Shoe Warning on Paved Ground: If standing with shoes on, ensure both your shoes AND the ground under them are pure; otherwise step out of your shoes and stand atop the clean upper surface of the detached shoes!",
      "Sunni Practice of Post-Dafn Dua & Talqin: In Hanafi Fiqh, one does NOT raise hands for collective Dua right after Janazah Salam while the bier waits (delaying burial), whereas making collective Dua, Fatiha, and Talqin at the graveside AFTER burial (Dafn) is Mustahabb and proven from Hadith & Bahar-e-Shariat.",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 4 (Namaz-e-Janazah ka Bayan); Fatawa Razawiyya, Vol. 9.",
  },
  {
    id: "istikharah-prayer",
    category: "Janazah & Special Nafl",
    title: "Salat al-Istikharah (Seeking Divine Guidance in Permissible Matters)",
    arabicTitle: "صَلَاةُ الِاسْتِخَارَةِ",
    rakatsSummary: "2 Rak'ahs Nafl Individually + Prophetic Dua of Istikharah AFTER Salam",
    ruling: "Sunnah / Mustahabb (Sayyiduna Jabir رضي الله عنه: 'The Prophet ﷺ taught us Istikharah in all matters just as he taught us a Surah of the Quran' — Sahih al-Bukhari)",
    timeWindow:
      "Any permissible time outside the 3 Makruh windows (before sleeping at night in Tahajjud/Isha window is widely practiced and serene).",
    overview:
      "Whenever facing an important permissible decision (marriage, career, travel, home, business — never for whether to do a Fard or leave a Haram, which are already decided!), a believer personally prays 2 Rak'ahs Nafl and recites the Prophetic Dua with sincere Tawakkul.",
    rakatByRakat: [
      {
        heading: "1st & 2nd Rak'ahs (2 Rak'ahs Nafl)",
        instructions:
          "Perform fresh Wudu and pray 2 Rak'ahs Nafl with Niyyah of Salat al-Istikharah. Mustahabb Surahs (Bahar-e-Shariat / Radd al-Muhtar): recite Surah Al-Kafirun after Fatihah in the 1st Rak'ah, and Surah Al-Ikhlas after Fatihah in the 2nd Rak'ah. Complete Salam as normal.",
      },
      {
        heading: "Post-Salam: Praise Allah, Send Durood, & Recite Dua-e-Istikharah",
        instructions:
          "Sit facing the Qibla with Wudu, begin and end the supplication with Hamd (praise of Allah) and Durood Sharif, and recite the Prophetic Dua of Istikharah attentively. When reaching the two occurrences of 'hadhal-amra' ('this matter'), bring your specific need/decision clearly into your heart (or name it).",
      },
    ],
    keyRecitation: {
      title: "Prophetic Dua of Istikharah (Sahih al-Bukhari #1162)",
      arabic:
        "اَللّٰهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ ۝ اَللّٰهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هٰذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هٰذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ",
      transliteration:
        "Allahumma inni astakhiruka bi-'ilmika, wa astaqdiruka bi-qudratika, wa as'aluka min fadlikal-'azim; fa-innaka taqdiru wa la aqdiru, wa ta'lamu wa la a'lamu, wa Anta 'Allamul-ghuyub. Allahumma in kunta ta'lamu anna hadhal-amra khayrun li fi dini wa ma'ashi wa 'aqibati amri faqdurhu li wa yassirhu li thumma barik li fih; wa in kunta ta'lamu anna hadhal-amra sharrun li fi dini wa ma'ashi wa 'aqibati amri fasrifhu 'anni wasrifni 'anhu, waqdur liyal-khayra haythu kana thumma ardini bih.",
      english:
        "O Allah! Indeed I seek goodness through Your All-Encompassing Knowledge, and I seek ability through Your Omnipotence, and I ask You from Your immense bounty — for surely You have power while I have none, You know all while I do not know, and You are the Knower of the unseen. O Allah! If You know that this matter is good for me in my religion, my livelihood, and the ultimate outcome of my affair, then decree it for me, make it easy for me, and bless me in it. And if You know that this matter is harmful for me in my religion, my livelihood, and the ultimate outcome of my affair, then turn it away from me and turn me away from it, decree goodness for me wherever it may be, and make my heart content with it.",
      urdu: "اے اللہ! میں تیرے علم کے ذریعے تجھ سے بھلائی مانگتا ہوں، اور تیری قدرت کے ذریعے تجھ سے طاقت مانگتا ہوں، اور تیرے عظیم فضل کا سوال کرتا ہوں، کیونکہ تو قدرت رکھتا ہے اور میں قدرت نہیں رکھتا، تو جانتا ہے اور میں نہیں جانتا، اور تو غیبوں کا خوب جاننے والا ہے۔ اے اللہ! اگر تیرے علم میں یہ کام میرے دین، میری معاش اور میرے انجامِ کار کے حق میں بہتر ہے تو اسے میرے مقدر میں فرما دے، میرے لیے آسان کر دے اور اس میں برکت عطا فرما؛ اور اگر تیرے علم میں یہ کام میرے دین، میری معاش اور میرے انجامِ کار کے حق میں برا ہے تو اسے مجھ سے پھیر دے اور مجھے اس سے پھیر دے، اور میرے لیے بھلائی مقدر فرما جہاں کہیں بھی ہو، پھر مجھے اس پر راضی کر دے۔",
    },
    hanafiNotes: [
      "Seeing a Dream Is NOT Required! Bahar-e-Shariat & Radd al-Muhtar clarify: you do NOT have to see a dream or colors (white/green vs black/red, though peaceful openness of chest — Inshirah as-Sadr — and ease of means are good signs). Rather, doing Istikharah up to 7 times if undecided (Anas's narration in Ibn as-Sunni) and proceeding upon sound Mashwarah (consultation) brings Allah's decreed khayr.",
      "Do It Yourself: Doing Istikharah personally is the Prophetic Sunnah — just as a person takes medicine themselves rather than asking someone else to swallow it on their behalf!",
    ],
    source: "Bahar-e-Shariat, Vol. 1, Part 4 (Salat al-Istikharah); Sahih al-Bukhari; Radd al-Muhtar.",
  },
  {
    id: "salat-at-tasbih",
    category: "Janazah & Special Nafl",
    title: "Salat at-Tasbih (4 Rak'ahs — 300 Glorifications, Hanafi Method)",
    arabicTitle: "صَلَاةُ التَّسْبِيحِ (ثَلَاثُمِائَةِ تَسْبِيحَةٍ)",
    rakatsSummary: "4 Rak'ahs Nafl = 75 Tasbihat per Rak'ah × 4 = 300 Total Tasbihat (15-10-10-10-10-10-10 Method)",
    ruling: "Mustahabb / Greatly Rewarded Sunnah (Taught by the Prophet ﷺ to his uncle Sayyiduna 'Abbas رضي الله عنه for forgiveness of past & recent, small & major sins — Abu Dawud, Tirmidhi)",
    timeWindow:
      "Anytime outside Makruh windows (before Zawal/Dhuhr, on Friday, Shab-e-Barat, Shab-e-Qadr, or at least once daily / weekly / monthly / yearly / once in a lifetime!).",
    overview:
      "Two authentic methods exist in Hadith; Hanafi jurists (Bahar-e-Shariat & Radd al-Muhtar) adopt the narration of Imam 'Abdullah ibn al-Mubarak (Jami' at-Tirmidhi #481) because it matches standard Hanafi Salah postures WITHOUT inserting an extra sitting after the 2nd Sajdah! Every Rak'ah distributes 75 Tasbihat cleanly as: 15 + 10 + 10 + 10 + 10 + 10 + 10 = 75.",
    rakatByRakat: [
      {
        heading: "Exact 75-Count Distribution Inside EACH Rak'ah (15-10-10-10-10-10-10)",
        instructions:
          "1) AFTER Thana & BEFORE Ta'awwudh/Fatihah: Recite Tasbih 15 TIMES → 2) Recite Fatihah + Surah, then BEFORE bowing to Ruku': Recite Tasbih 10 TIMES (running total: 25) → 3) In RUKU' (after 3x Subhana Rabbiyal-'Azim): Recite Tasbih 10 TIMES (total: 35) → 4) Standing in QAUMAH (after Sami'allahu liman hamidah, Rabbana wa lakal-hamd): Recite Tasbih 10 TIMES (total: 45) → 5) In FIRST SAJDAH (after 3x Subhana Rabbiyal-A'la): Recite Tasbih 10 TIMES (total: 55) → 6) Sitting in JALSAH between Sajdahs: Recite Tasbih 10 TIMES (total: 65) → 7) In SECOND SAJDAH (after 3x Subhana Rabbiyal-A'la): Recite Tasbih 10 TIMES (total: 75!). Then rise directly to the next Rak'ah (or sit for Qa'dah after 2nd & 4th Rak'ah WITHOUT adding Tasbihat in Qa'dah!).",
      },
      {
        heading: "Repeating Across All 4 Rak'ahs (75 × 4 = 300)",
        instructions:
          "Since Salat at-Tasbih is 4 Rak'ahs Nafl, sit in Qa'dah Ula after the 2nd Rak'ah (reciting At-Tahiyyat + Durood + Dua), then stand for the 3rd Rak'ah starting again with Thana → 15x Tasbih → Fatihah + Surah → 10x Tasbih, and repeat the exact 75-count sequence in the 3rd and 4th Rak'ahs (150 + 150 = 300 total Tasbihat), finishing with Qa'dah Akhirah and Salam.",
      },
    ],
    keyRecitation: {
      title: "The Glorification Formula of Salat at-Tasbih (Third Kalimah)",
      arabic:
        "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
      transliteration:
        "Subhanallahi wal-hamdu lillahi wa la ilaha illallahu wallahu Akbar.",
      english:
        "Glory be to Allah, all praise belongs to Allah, there is no deity worthy of worship except Allah, and Allah is the Greatest.",
      urdu: "اللہ پاک ہے، اور سب تعریف اللہ ہی کے لیے ہے، اور اللہ کے سوا کوئی معبود نہیں، اور اللہ سب سے بڑا ہے۔",
    },
    hanafiNotes: [
      "How to Keep Count Without Breaking Khushu' (Bahar-e-Shariat): Do NOT count on a rosary/tasbih bead-string or flex/tap your fingers noticeably in Salah! Count mentally in the heart; if needed to avoid losing track, press each fingertip very lightly in place where your hand already rests (e.g., on the knees in Ruku' or on the mat in Sajdah).",
      "Forgot Some Tasbihat in One Posture? Make up the missed count in the NEXT long posture (not in Qaumah or Jalsah, which are short postures; e.g., if missed in Ruku', make them up inside the First Sajdah).",
    ],
    source:
      "Bahar-e-Shariat, Vol. 1, Part 4 (Salat at-Tasbih ka Bayan); Jami' at-Tirmidhi #481 ('Abdullah ibn al-Mubarak); Radd al-Muhtar.",
  },
];

export const SALAH_ARCHITECTURE_MATRIX: SalahRulingItem[] = [
  // ---- 6 SHARA'IT (PRE-CONDITIONS OF SALAH — 6 ITEMS) ----
  {
    id: "shart-1-taharah",
    group: "6 Shara'it (Pre-Conditions)",
    title: "1. Taharah — Purity of Body, Garments & Prayer Spot",
    detail:
      "The worshipper's body must be free of Hadath-e-Akbar (requiring Ghusl) and Hadath-e-Asghar (requiring Wudu), AND the body, worn clothes, and exact spots where feet, knees, hands, nose, and forehead rest must be free of Najasah Ghalizah exceeding a Dirham's measure (~5.94 cm² liquid / ~4.37g solid) or Najasah Khafifah reaching 1/4 of a limb/garment.",
    consequenceIfMissed:
      "Salah does NOT even begin / is completely INVALID (Batil) and must be performed anew after attaining full purity.",
  },
  {
    id: "shart-2-satr-awrah",
    group: "6 Shara'it (Pre-Conditions)",
    title: "2. Satr-e-'Awrah — Proper Covering of the Body",
    detail:
      "Brothers must cover from beneath the navel down to and INCLUDING both kneecaps in opaque fabric. Free adult sisters must cover the entire body (including hair hanging down, ears, neck, forearms/wrists, and shins/ankles) in non-transparent fabric EXCEPT the face, both palms (front & back), and both feet below the ankles.",
    consequenceIfMissed:
      "Salah is INVALID from the start if 1/4 or more of any 'Awrah limb (e.g., 1/4 of a knee, thigh, shin, ear, or scalp hair) is uncovered; if exposed mid-prayer for the duration of 3x Subhanallah, Salah breaks.",
  },
  {
    id: "shart-3-istiqbal-qibla",
    group: "6 Shara'it (Pre-Conditions)",
    title: "3. Istiqbal-e-Qibla — Facing the Sacred Ka'bah",
    detail:
      "Those in Makkah seeing the Ka'bah must face its exact structure ('Ayn al-Ka'bah); everyone distant must face its direction (Jihat al-Ka'bah, within the 45° arc to left/right so the chest remains aligned toward Qibla), except when legitimately excused (fear of enemy/beast or praying Nafl riding outside city limits).",
    consequenceIfMissed:
      "Salah is INVALID if prayed facing away from Qibla without valid Shar'i investigation (Taharrri); turning the chest away mid-prayer nullifies Salah.",
  },
  {
    id: "shart-4-waqt",
    group: "6 Shara'it (Pre-Conditions)",
    title: "4. Waqt — Entry of the Prescribed Prayer Window",
    detail:
      "The specific time of that Fard/Wajib Salah must have entered, AND the worshipper must have knowledge/predominant certainty that the time has entered (if someone prays doubting whether time entered, Salah is invalid even if it later turns out time had entered!).",
    consequenceIfMissed:
      "Performing a Fard prayer even one minute before its Waqt enters does NOT count as that Fard (it becomes Nafl only, and the Fard remains obligatory once time enters).",
  },
  {
    id: "shart-5-niyyah",
    group: "6 Shara'it (Pre-Conditions)",
    title: "5. Niyyah — Specific Heart Intention Connected to Takbir",
    detail:
      "Firm resolve in the heart specifying WHICH Fard or Wajib prayer is being offered (e.g., today's Dhuhr Fard, Witr Wajib, or a missed Qada; for Nafl/Sunnah, absolute intention of Salah suffices), uninterrupted by worldly distraction between Niyyah and Takbir-e-Tahrima. A Muqtadi must also intend following the Imam.",
    consequenceIfMissed:
      "Without heart Niyyah (or without specifying which Fard/Wajib), the prayer is INVALID and does not discharge the obligation.",
  },
  {
    id: "shart-6-takbir-tahrima",
    group: "6 Shara'it (Pre-Conditions)",
    title: "6. Takbir-e-Tahrima — Opening Consecrating Takbir While Standing",
    detail:
      "Pronouncing Allah's exalted Name (specifically 'Allahu Akbar' as Wajib) loud enough to hear oneself in normal quiet surroundings while standing upright — called 'Tahrima' because it makes eating, drinking, speech, and non-prayer actions forbidden (Haram) until Salam. (In Hanafi classification, it stands at the threshold as the 6th Shart closely joined to the 6 inner Arkan).",
    consequenceIfMissed:
      "The worshipper has NOT entered Salah at all! If a Muqtadi bows into Ruku' while finishing 'Akbar', his Takbir did not occur in Qiyam and his Salah never started.",
  },

  // ---- 6 FARA'ID (INNER PILLARS / ARKAN OF SALAH — 6 ITEMS) ----
  {
    id: "fard-1-qiyam",
    group: "6 Fara'id (Inner Pillars)",
    title: "1. Qiyam — Standing Upright in All Fard & Wajib Prayers",
    detail:
      "Standing straight on one's feet (so that if arms were extended down they would not reach the knees) throughout Qira'ah in every Rak'ah of Fard, Witr, Eidain, and Fajr Sunnahs whenever physically able without unbearable pain or verified medical worsening.",
    consequenceIfMissed:
      "Sitting in Fard/Wajib Salah when able to stand (even by leaning on a wall or staff!) renders the Salah completely INVALID (Batil) — Sajda-e-Sahw CANNOT compensate for a missed Fard!",
  },
  {
    id: "fard-2-qiraah",
    group: "6 Fara'id (Inner Pillars)",
    title: "2. Qira'ah — Reciting the Noble Quran",
    detail:
      "Pronouncing Arabic Quranic words with tongue movement loud enough to hear oneself: minimum Fard quantity (Imam Abu Hanifah, finalized upon Sahibayn's measure in Fatwa) is ONE long verse or THREE short verses in at least two Rak'ahs of 3/4-Rak'at Fard, in BOTH Rak'ahs of 2-Rak'at Fard, and in ALL Rak'ahs of Witr, Sunnah, and Nafl. (For a Muqtadi, the Imam's Qira'ah fulfills this Fard).",
    consequenceIfMissed:
      "Salah is completely INVALID (Fasid/Batil) if the Fard minimum Qira'ah is omitted or recited only mentally in the heart without moving tongue and lips!",
  },
  {
    id: "fard-3-ruku",
    group: "6 Fara'id (Inner Pillars)",
    title: "3. Ruku' — Bowing Once in Every Rak'ah",
    detail:
      "Bowing the torso forward once in every Rak'ah after Qira'ah to at least the angle where extended hands reach the kneecaps.",
    consequenceIfMissed:
      "Omitting Ruku' in any Rak'ah invalidates that Rak'ah (and invalidates the entire Salah if not rectified before exiting); Sajda-e-Sahw alone cannot replace a missed Ruku'.",
  },
  {
    id: "fard-4-sujood",
    group: "6 Fara'id (Inner Pillars)",
    title: "4. Sujood — Two Prostrations in Every Rak'ah",
    detail:
      "Performing TWO Sajdahs in every Rak'ah by placing the forehead firmly on a stable surface (neither elevated more than half a forearm / 12 fingers higher than the feet without crowding excuse, nor sinking endlessly into soft cotton/sponge without feeling firmness) while keeping at least ONE TOE of each foot pressed to the ground.",
    consequenceIfMissed:
      "Missing even one of the two Sajdahs, failing to feel ground firmness on the forehead, or lifting BOTH feet completely off the ground for the entire Sajdah renders the Sajdah and Salah INVALID!",
  },
  {
    id: "fard-5-qadah-akhirah",
    group: "6 Fara'id (Inner Pillars)",
    title: "5. Qa'dah Akhirah — Final Sitting for the Span of Tashahhud",
    detail:
      "Sitting upright at the completion of all Rak'ahs (after the 2nd Rak'ah in Fajr/Jumu'ah, 3rd in Maghrib/Witr, 4th in Dhuhr/Asr/Isha) for at least the duration required to recite 'At-Tahiyyatu...' up to '...abduhu wa rasuluh'.",
    consequenceIfMissed:
      "Exiting Salah without sitting in Qa'dah Akhirah for the span of Tashahhud renders the entire Salah INVALID.",
  },
  {
    id: "fard-6-khuruj-bisunihi",
    group: "6 Fara'id (Inner Pillars)",
    title: "6. Khuruj bi-Sun'ihi — Exiting Salah by Deliberate Act (& Tartib of Pillars)",
    detail:
      "Per Imam Abu Hanifah & Bahar-e-Shariat, exiting Salah after Qa'dah Akhirah through one's own intentional act (specifically with the Wajib words of Salam; whereas involuntary wind breaking after Tashahhud does not fulfill Khuruj bi-Sun'ihi without renewed Wudu & Salam!), alongside maintaining Fard sequence (Qiyam before Ruku', Ruku' before Sujood).",
    consequenceIfMissed:
      "If involuntary Hadath occurs after Tashahhud before deliberate exit, one must perform immediate Wudu without speaking and turn Salam, otherwise Salah becomes invalid.",
  },

  // ---- 14 WAJIBAT OF SALAH (14 ITEMS) ----
  {
    id: "wajib-1-lafz-allahu-akbar",
    group: "14 Wajibat of Salah",
    title: "1. Opening Specifically with the Words 'Allahu Akbar'",
    detail:
      "While entering Salah with any pure Arabic praise of Allah (like 'Allahu A'zam' or 'Subhanallah') technically satisfies the bare Fard in Imam Abu Hanifah's view, specifically uttering 'Allahu Akbar' is WAJIB.",
    consequenceIfMissed:
      "If omitted forgetfully, Sajda-e-Sahw becomes Wajib; if omitted deliberately, repeating the Salah (I'adah) is Wajib and leaving it is sinful (Makruh Tahrimi).",
  },
  {
    id: "wajib-2-surah-fatihah",
    group: "14 Wajibat of Salah",
    title: "2. Reciting Complete Surah Al-Fatihah (All 7 Verses)",
    detail:
      "Reciting every verse of Surah Al-Fatihah in the first two Rak'ahs of Fard and in every Rak'ah of Witr, Sunnah, and Nafl (for Imam and Munfarid).",
    consequenceIfMissed:
      "Omitting Surah Al-Fatihah or even a single verse of it forgetfully makes Sajda-e-Sahw Wajib; omitting it deliberately makes repeating Salah Wajib.",
  },
  {
    id: "wajib-3-damima-surah",
    group: "14 Wajibat of Salah",
    title: "3. Damima — Joining a Surah (or 1 Long / 3 Short Verses) After Fatihah",
    detail:
      "Adding at least one complete short Surah (like Surah Al-Kawthar), or one long verse equivalent to three short verses, or three short verses after Surah Al-Fatihah.",
    consequenceIfMissed:
      "Forgetfully bowing into Ruku' right after Fatihah without a Surah: if remembered IN Ruku', stand back up, recite the Surah, RE-PERFORM Ruku', and do Sajda-e-Sahw at the end! If remembered after rising from Ruku', continue and perform Sajda-e-Sahw.",
  },
  {
    id: "wajib-4-taayyun-qiraah",
    group: "14 Wajibat of Salah",
    title: "4. Assigning Fatihah & Damima to the First Two Rak'ahs of Fard",
    detail:
      "Restricting the obligatory Fatihah + Surah pairing specifically to the 1st and 2nd Rak'ahs of 3- and 4-Rak'at Fard prayers (rather than leaving one empty and shifting it to the 3rd or 4th Rak'ah).",
    consequenceIfMissed:
      "Forgetfully omitting Qira'ah/Damima in 1st or 2nd Rak'ah necessitates Sajda-e-Sahw; deliberate omission requires repeating the Salah.",
  },
  {
    id: "wajib-5-tartib-fatihah-surah",
    group: "14 Wajibat of Salah",
    title: "5. Reciting Surah Al-Fatihah BEFORE the Joined Surah",
    detail:
      "Observing the Prophetic sequence of reciting all of Surah Al-Fatihah first and only then reciting the joined Surah, without inserting extraneous speech/pause.",
    consequenceIfMissed:
      "If someone forgetfully recites a Surah before Fatihah, they must recite Fatihah, repeat the Surah, and perform Sajda-e-Sahw at the end.",
  },
  {
    id: "wajib-6-tadil-arkan",
    group: "14 Wajibat of Salah",
    title: "6. Ta'dil-e-Arkan — Calm Stillness in Every Posture",
    detail:
      "Allowing every limb and joint to settle completely motionless for at least the duration of one 'Subhanallah' inside Ruku', Qaumah, First Sajdah, Jalsah, and Second Sajdah.",
    consequenceIfMissed:
      "Rushing/pecking without stillness omits a major Wajib: if forgetful, Sajda-e-Sahw is Wajib; if deliberate, repeating the entire Salah (Wajib al-I'adah) is obligatory in the authoritative Fatwa of Imam Abu Yusuf & Bahar-e-Shariat!",
  },
  {
    id: "wajib-7-qaumah-jalsah",
    group: "14 Wajibat of Salah",
    title: "7. Performing Qaumah (Upright After Ruku') & Jalsah (Upright Between Sajdahs)",
    detail:
      "Standing completely straight after Ruku' before going down to Sajdah (Qaumah), and sitting completely upright between the first and second Sajdahs (Jalsah).",
    consequenceIfMissed:
      "Dropping from Ruku' straight into Sajdah or barely lifting the forehead off the mat between Sajdahs omits a Wajib — necessitating Sajda-e-Sahw (if forgetful) or repeating Salah (if deliberate).",
  },
  {
    id: "wajib-8-nose-in-sajdah",
    group: "14 Wajibat of Salah",
    title: "8. Placing the Hard Bridge of the Nose & Three Toes per Foot in Sajdah",
    detail:
      "Pressing the hard bone of the nose firmly alongside the forehead in every Sajdah (without valid excuse on the nose), and pressing at least three toes of each foot toward the Qibla.",
    consequenceIfMissed:
      "Prostrating on the forehead alone while keeping the nose lifted off the ground without excuse omits a Wajib (Makruh Tahrimi / Wajib al-I'adah if deliberate; Sajda-e-Sahw if forgetful).",
  },
  {
    id: "wajib-9-qadah-ula",
    group: "14 Wajibat of Salah",
    title: "9. Qa'dah Ula — Sitting After the 2nd Rak'ah & Rising Promptly",
    detail:
      "Sitting after the 2nd Rak'ah in every 3- or 4-Rak'ah Salah, AND standing immediately after 'abduhu wa rasuluh' in Fard, Witr, and Sunnah Mu'akkadah without adding Durood.",
    consequenceIfMissed:
      "Standing straight to the 3rd Rak'ah forgetfully: if knees have NOT yet straightened (closer to sitting), sit back down with NO Sajda-e-Sahw; once closer to standing, DO NOT sit back down — continue the 3rd Rak'ah and perform Sajda-e-Sahw at the end!",
  },
  {
    id: "wajib-10-tashahhud-both",
    group: "14 Wajibat of Salah",
    title: "10. Reciting Complete Tashahhud (At-Tahiyyat) in Every Sitting",
    detail:
      "Reciting the entire text of At-Tahiyyat in Qa'dah Ula AND in Qa'dah Akhirah (note: sitting itself in Qa'dah Akhirah is Fard, while reciting the words of Tashahhud is Wajib).",
    consequenceIfMissed:
      "Forgetfully omitting all or even part of Tashahhud in either sitting makes Sajda-e-Sahw Wajib.",
  },
  {
    id: "wajib-11-jahr-wa-ikhfa",
    group: "14 Wajibat of Salah",
    title: "11. Observing Jahr (Audible) & Ikhfa/Sirr (Silent) Recitation Correctly",
    detail:
      "It is Wajib upon the Imam to recite audibly (Jahr) in Fajr, Jumu'ah, Eidain, Tarawih, Ramadan Witr, and the first 2 Rak'ahs of Maghrib & Isha, and Wajib upon BOTH Imam and Munfarid to recite silently (Sirr) in Dhuhr, Asr, daytime Sunnahs/Nafls, and the 3rd/4th Rak'ahs of Maghrib & Isha.",
    consequenceIfMissed:
      "If an Imam forgetfully recites aloud (3 short verses or 1 long verse) in a silent prayer like Dhuhr/Asr — OR recites silently that amount in an audible prayer like Fajr/Maghrib/Isha — Sajda-e-Sahw becomes Wajib!",
  },
  {
    id: "wajib-12-insat-muqtadi",
    group: "14 Wajibat of Salah",
    title: "12. Complete Silence & Listening (Insat) by the Muqtadi Behind Imam",
    detail:
      "Remaining completely silent from Qira'ah (neither Fatihah nor Surah) whenever praying behind an Imam, in both audible and silent prayers, in obedience to Quran 7:204 ('When the Quran is recited, listen to it and be silent').",
    consequenceIfMissed:
      "Reciting Fatihah or Quran behind the Imam in Hanafi Fiqh is Makruh Tahrimi (gravely sinful, though it does not necessitate Sajda-e-Sahw upon the Muqtadi).",
  },
  {
    id: "wajib-13-qunoot-eid-takbirs",
    group: "14 Wajibat of Salah",
    title: "13. Dua-e-Qunoot & Takbir in Witr + 6 Extra Takbirs in Eidain (+ Sajda-e-Tilawat)",
    detail:
      "Saying Takbir-e-Qunoot and reciting Qunoot before Ruku' in the 3rd Rak'ah of Witr; saying the 6 Extra Takbirs (and 2nd-Rak'ah Ruku' Takbir) in Eidain; and performing Sajda-e-Tilawat inside Salah whenever an Ayah of Sajdah is recited.",
    consequenceIfMissed:
      "Forgetfully omitting Qunoot, Takbir-e-Qunoot, or any of the Extra Eid Takbirs makes Sajda-e-Sahw Wajib (in huge Eid/Jumu'ah crowds, Imams leave Sajda-e-Sahw only if mass confusion/fitnah is feared).",
  },
  {
    id: "wajib-14-lafz-assalam",
    group: "14 Wajibat of Salah",
    title: "14. Exiting Specifically with 'As-Salam' Right & Left + Sequence of Repeated Acts",
    detail:
      "Concluding Salah by uttering the word 'As-salam' twice (turning right, then left — saying 'wa rahmatullah' is Sunnah), and performing both Sajdahs of each Rak'ah in proper sequence without delaying any Rukn.",
    consequenceIfMissed:
      "Exiting Salah deliberately with another act instead of 'As-salam' violates a Wajib and necessitates repeating the Salah (Wajib al-I'adah); delaying a Rukn forgetfully necessitates Sajda-e-Sahw.",
  },

  // ---- 5 KEY SUNAN OF SALAH (5 ITEMS) ----
  {
    id: "sunnah-1-raf-yadayn-tahrima",
    group: "Key Sunan of Salah",
    title: "1. Raising Hands at Takbir-e-Tahrima Only & Tying Hands Properly",
    detail:
      "Raising hands for Takbir-e-Tahrima (brothers: thumbs to earlobes; sisters: inside dupatta to shoulders — without Raf' al-Yadayn before/after Ruku' in Hanafi Fiqh!), then tying hands immediately (brothers: below navel with thumb-pinky ring; sisters: right palm over left on chest).",
    consequenceIfMissed:
      "Salah remains valid and NO Sajda-e-Sahw is done for omitting a Sunnah, though deliberately abandoning Sunnah Mu'akkadah habits incurs blame and deprivation of Prophetic intercession/reward.",
  },
  {
    id: "sunnah-2-thana-taawwudh-tasmiyah",
    group: "Key Sunan of Salah",
    title: "2. Reciting Thana, Ta'awwudh, Tasmiyah & Quiet 'Amin'",
    detail:
      "Silently reciting Thana and Ta'awwudh in the 1st Rak'ah, silent Bismillah at the start of every Rak'ah before Fatihah, and saying 'Amin' quietly (Sirran, never loud!) after 'wa lad-dallin'.",
    consequenceIfMissed:
      "Salah is valid and NO Sajda-e-Sahw is performed (doing Sajda-e-Sahw for a missed Sunnah like Thana is itself wrong!), though reward is diminished if left deliberately.",
  },
  {
    id: "sunnah-3-takbirat-intiqal",
    group: "Key Sunan of Salah",
    title: "3. Transitional Takbirs, Tasmi'/Tahmid & 3x Tasbihat in Ruku' & Sujood",
    detail:
      "Saying 'Allahu Akbar' during every posture transition, saying 'Sami'allahu liman hamidah' / 'Rabbana wa lakal-hamd' in Qaumah, and reciting 'Subhana Rabbiyal-'Azim' (Ruku') and 'Subhana Rabbiyal-A'la' (Sajdah) at least 3 times each.",
    consequenceIfMissed:
      "Salah remains valid without Sajda-e-Sahw (so long as Wajib stillness/Ta'dil-e-Arkan was observed), though habitual omission is blameworthy.",
  },
  {
    id: "sunnah-4-sunnah-sitting-shahadah",
    group: "Key Sunan of Salah",
    title: "4. Sunnah Sitting Posture (Iftirash / Tawarruk) & Shahadah Finger Isharah",
    detail:
      "Brothers sitting on the flattened left foot with right foot upright (toes toward Qibla); sisters sitting on the left hip with both feet to the right; and raising the right index finger (with thumb-middle finger ring) cleanly at 'La ilaha' and lowering it at 'illallah'.",
    consequenceIfMissed:
      "Salah remains valid without Sajda-e-Sahw, though departing from Sunnah postures without excuse (such as sitting cross-legged in Fard without knee pain) reduces Sunnah perfection.",
  },
  {
    id: "sunnah-5-durood-ibrahimi-dua",
    group: "Key Sunan of Salah",
    title: "5. Durood-e-Ibrahimi & Dua-e-Masura in Qa'dah Akhirah",
    detail:
      "Reciting full Durood-e-Ibrahimi (Sunnah Mu'akkadah) followed by a Quranic/Hadith Arabic Dua resembling Akhirah supplications before turning Salam right and left.",
    consequenceIfMissed:
      "Salah is valid without Sajda-e-Sahw, though intentionally abandoning Durood-e-Ibrahimi in Qa'dah Akhirah is strongly censured.",
  },

  // ---- 5 MUFSIDAT (NULLIFIERS OF SALAH — 5 ITEMS) ----
  {
    id: "mufsid-1-kalam",
    group: "Mufsidat (Nullifiers of Salah)",
    title: "1. Kalam — Uttering Any Human Speech (Even Mistakenly or Forgetfully!)",
    detail:
      "Speaking even a single two-letter word of human conversation — whether intentionally, out of forgetfulness, or by slip of the tongue! This includes replying 'Wa 'alaykumus-salam' verbally (or by handshake), saying 'Yarhamukallah' to someone who sneezes, saying 'Inna lillahi...' or 'Alhamdulillah' in reaction to outside worldly news, or correcting someone OTHER than one's own Imam.",
    consequenceIfMissed:
      "Salah is IMMEDIATELY NULLIFIED (Fasid) and must be restarted from Takbir-e-Tahrima!",
  },
  {
    id: "mufsid-2-amal-kathir",
    group: "Mufsidat (Nullifiers of Salah)",
    title: "2. 'Amal-e-Kathir — Excessive Non-Prayer Physical Action",
    detail:
      "Performing any physical act outside Salah's actions requiring BOTH hands (such as tying a turban/pajama drawstring or buttoning with two hands), OR three consecutive unnecessary movements in a single Rukn, OR any action such that an observer from afar would have no doubt the person is NOT in Salah (e.g., typing on/checking a phone!).",
    consequenceIfMissed:
      "Salah is IMMEDIATELY NULLIFIED (Fasid) and must be performed anew.",
  },
  {
    id: "mufsid-3-turning-chest-qibla",
    group: "Mufsidat (Nullifiers of Salah)",
    title: "3. Turning Chest Away from Qibla, Walking Past 2 Rows, or Eating & Drinking",
    detail:
      "Turning the chest away from the 45° Qibla arc without excuse; walking continuously the span of two rows at once; OR swallowing even a sesame-seed bit of food/sweetness brought from outside (or chewing 3x, or swallowing food stuck between teeth if equal to or larger than a chickpea/Chana).",
    consequenceIfMissed:
      "Salah is IMMEDIATELY NULLIFIED (Fasid) and must be restarted from the beginning.",
  },
  {
    id: "mufsid-4-lahn-jali-dua-dunya",
    group: "Mufsidat (Nullifiers of Salah)",
    title: "4. Meaning-Corrupting Recitation Error, Reading From Mushaf, or Worldly Dua",
    detail:
      "Committing Lahn-e-Jali that corrupts/contradicts belief or introduces non-Quranic words; reading directly off a physical Mushaf/phone screen in Salah (per Imam Abu Hanifah's authoritative ruling: learning from an external object breaks Salah!); OR making Dua in any non-Arabic language or asking Allah in Arabic for mundane worldly things men ask one another ('give me £1000 / marry me to so-and-so').",
    consequenceIfMissed:
      "Salah is IMMEDIATELY NULLIFIED (Fasid) according to Imam Abu Hanifah & Bahar-e-Shariat and must be repeated.",
  },
  {
    id: "mufsid-5-hadath-awrah-qahqahah",
    group: "Mufsidat (Nullifiers of Salah)",
    title: "5. Loss of Wudu, Exposure of 'Awrah (3x Subhanallah), Moaning, or Qahqahah",
    detail:
      "Deliberate Wudu-breaking act (or involuntary Hadath if not renewed immediately under strict Bina conditions — restarting anew is always safer/Afdal!); uncovering 1/4 of an 'Awrah limb for the span of 3x Subhanallah; moaning 'Ah'/'Uff' or weeping with sound over worldly pain/grief (weeping from fear of Allah/Jannah/Jahannam does NOT break Salah!); or Qahqahah (audible laughter).",
    consequenceIfMissed:
      "Salah is IMMEDIATELY NULLIFIED — and in the case of Qahqahah inside a Ruku'/Sujood prayer, BOTH Salah AND Wudu are nullified!",
  },
];
