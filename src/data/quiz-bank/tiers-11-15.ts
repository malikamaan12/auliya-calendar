import { QuizQuestion } from "../quiz-types";

export const TIERS_11_TO_15: QuizQuestion[] = [
  // ============================================================================
  // TIER 11 — Classical Hanafi Jurists, Tafsirs, Surah Virtues & Early Awliya
  // ============================================================================
  {
    id: "q-t11-01",
    tier: 11,
    category: "Aqaid & Seerah",
    question:
      "Which expedition of Rajab 9 AH was called 'Ghazwat al-Usrah' (The Expedition of Hardship), for which Sayyiduna Uthman ibn Affan (رضي الله عنه) generously equipped the Muslim army?",
    options: [
      "The Expedition of Hunayn",
      "The Expedition of Mu'tah",
      "The Expedition of Tabuk",
      "The Expedition of Khaybar",
    ],
    correctIdx: 2,
    isharaHint:
      "Undertaken toward the northern Byzantine frontier during intense summer heat and drought; referenced in Surah At-Tawbah 9:117.",
    communityPoll: [9, 10, 74, 7],
    proofExplanation:
      "Jami' at-Tirmidhi (#3700) records that Sayyiduna Uthman donated hundreds of equipped camels and 1,000 gold dinars for Jaysh al-Usrah at Tabuk, prompting the Prophet ﷺ to declare that nothing would harm Uthman thereafter.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Seerah & Aqaid References",
  },
  {
    id: "q-t11-02",
    tier: 11,
    category: "Quran & Kanzul Iman",
    question:
      "Which concise Sunni Quran commentary was begun by Imam Jalaluddin al-Mahalli (d. 864 AH) and completed in forty days by his student Imam Jalaluddin as-Suyuti (d. 911 AH)?",
    options: [
      "Anwar at-Tanzil wa Asrar at-Ta'wil",
      "Tafsir al-Jalalayn",
      "Madarik at-Tanzil wa Haqa'iq at-Ta'wil",
      "Lubab at-Ta'wil fi Ma'ani at-Tanzil",
    ],
    correctIdx: 1,
    isharaHint:
      "Its famous title literally means 'The Commentary of the Two Jalals' and is taught across classical Dars-e-Nizami seminaries.",
    communityPoll: [10, 75, 8, 7],
    proofExplanation:
      "Imam Jalaluddin al-Mahalli wrote the exegesis from Surah Al-Kahf to An-Nas plus Al-Fatihah, and Imam Jalaluddin as-Suyuti completed Surah Al-Baqarah through Al-Isra to form Tafsir al-Jalalayn.",
    proofLink: "/quran",
    proofLinkLabel: "Open Kanzul Iman & Tafsir Reader",
  },
  {
    id: "q-t11-03",
    tier: 11,
    category: "Lives of the Auliya",
    question:
      "Whom did the Holy Prophet ﷺ praise in Sahih Muslim as 'the best of the Tabi'in', instructing Sayyiduna Umar ibn al-Khattab (رضي الله عنه) to request his supplication because of his devotion to his mother?",
    options: [
      "Sayyiduna Uwais al-Qarani",
      "Khwaja Hasan al-Basri",
      "Sayyiduna Sa'id ibn al-Musayyib",
      "Hazrat Ma'ruf al-Karkhi",
    ],
    correctIdx: 0,
    isharaHint:
      "He hailed from the clan of Qaran in Murad (Yemen) and loved the Prophet ﷺ deeply without ever being able to travel to Madinah during his lifetime.",
    communityPoll: [76, 11, 8, 5],
    proofExplanation:
      "Sahih Muslim (#2542) narrates from Sayyiduna Umar that the Messenger of Allah ﷺ foretold the arrival of Uwais ibn Amir of Yemen, whose filial piety kept him caring for his aged mother.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Early Awliya Lineage",
  },
  {
    id: "q-t11-04",
    tier: 11,
    category: "Hanafi Fiqh",
    question:
      "When classical Hanafi texts cite the consensus or dissent of 'as-Sahibayn' (The Two Companions of Imam Abu Hanifa), which two premier Mujtahid jurists are meant?",
    options: [
      "Imam Zufar ibn al-Hudhayl and Imam Hasan ibn Ziyad",
      "Imam Abu Ja'far at-Tahawi and Imam Abu al-Hasan al-Karkhi",
      "Qadi Abu Yusuf and Imam Zufar ibn al-Hudhayl",
      "Qadi Abu Yusuf and Imam Muhammad ibn al-Hasan ash-Shaybani",
    ],
    correctIdx: 3,
    isharaHint:
      "One served as the first Qadi al-Qudat in Baghdad and authored Kitab al-Kharaj; the other compiled the six books of Zahir ar-Riwayah.",
    communityPoll: [8, 6, 12, 74],
    proofExplanation:
      "In Hanafi terminology (Radd al-Muhtar & Bahar-e-Shariat), 'as-Sahibayn' refers to Imam Abu Yusuf Ya'qub al-Ansari (d. 182 AH) and Imam Muhammad ash-Shaybani (d. 189 AH), while Imam Abu Hanifa and Abu Yusuf together are termed 'ash-Shaykhayn'.",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Hanafi Juristic Lineage",
  },
  {
    id: "q-t11-05",
    tier: 11,
    category: "Aqaid & Seerah",
    question:
      "Which 4th-century Hijri Hanafi theologian of Samarkand (d. 333 AH) authored 'Kitab at-Tawhid' and 'Ta'wilat Ahl as-Sunnah', systematizing the Sunni doctrinal school followed by Hanafis worldwide?",
    options: [
      "Imam Abu al-Qasim al-Qushayri",
      "Imam Abu Mansur al-Maturidi",
      "Imam Abu Bakr al-Baqillani",
      "Imam Abd al-Qahir al-Baghdadi",
    ],
    correctIdx: 1,
    isharaHint:
      "Honored as 'Imam al-Huda', he stands alongside Imam Abu al-Hasan al-Ash'ari as one of the two recognized Imams of Ahl-e-Sunnat Kalam.",
    communityPoll: [8, 73, 10, 9],
    proofExplanation:
      "Imam Abu Mansur Muhammad ibn Muhammad al-Maturidi as-Samarkandi (d. 333 AH) articulated the theological methodology transmitted from Imam Abu Hanifa, forming one of the two orthodox pillars of Ahl-e-Sunnat wal-Jama'at.",
    proofLink: "/fiqh",
    proofLinkLabel: "Review Sunni Aqaid Foundations",
  },
  {
    id: "q-t11-06",
    tier: 11,
    category: "Quran & Kanzul Iman",
    question:
      "Which classical Sunni scholar authored 'Mafatih al-Ghayb' (widely celebrated as At-Tafsir al-Kabir), while Qadi Nasiruddin al-Baydawi authored 'Anwar at-Tanzil' and Imam at-Tabari authored 'Jami' al-Bayan'?",
    options: [
      "Imam Abu Abdullah al-Qurtubi",
      "Imam Abu al-Barakat an-Nasafi",
      "Imam Abu Hayyan al-Andalusi",
      "Imam Fakhruddin ar-Razi",
    ],
    correctIdx: 3,
    isharaHint:
      "Born in Rayy and laid to rest in Herat in 606 AH, he marshaled rational and scriptural proofs to refute Mu'tazili and philosophical doubts.",
    communityPoll: [11, 9, 8, 72],
    proofExplanation:
      "Imam Fakhruddin Muhammad ibn Umar ar-Razi (d. 606 AH) authored Mafatih al-Ghayb (At-Tafsir al-Kabir), a cornerstone theological source frequently referenced in Kanzul Iman commentaries.",
    proofLink: "/quran",
    proofLinkLabel: "Browse Classical Tafsir Notes",
  },
  {
    id: "q-t11-07",
    tier: 11,
    category: "Lives of the Auliya",
    question:
      "Which early prince of Balkh (d. 162 AH) abdicated his royal throne after hearing a heavenly admonition during a hunt, studied with Imam Abu Hanifa, and became an early pillar of the Chishti spiritual chain?",
    options: [
      "Hazrat Bishr al-Hafi",
      "Hazrat Dawud at-Ta'i",
      "Sultan Ibrahim ibn Adham",
      "Hazrat Abu Bakr ash-Shibli",
    ],
    correctIdx: 2,
    isharaHint:
      "When an unseen voice called out, 'Was it for this that you were created, O Ibrahim?', he traded his royal robes for a shepherd's woolen cloak.",
    communityPoll: [9, 8, 75, 8],
    proofExplanation:
      "Sultan-ut-Tarikin Ibrahim ibn Adham al-Balkhi (d. 162 AH) renounced kingship for ascetic devotion and stands in the early Chishti Shajrah between Fudayl ibn Iyad and Khwaja Abu Ishaq Shami.",
    proofLink: "/auliya",
    proofLinkLabel: "View Chishti Spiritual Shajrah",
  },
  {
    id: "q-t11-08",
    tier: 11,
    category: "Hanafi Fiqh",
    question:
      "Which jurist compiled the six primary canonical books of 'Zahir ar-Riwayah' (Al-Asl/Al-Mabsut, Al-Jami' as-Saghir, Al-Jami' al-Kabir, As-Siyar as-Saghir, As-Siyar al-Kabir, and Az-Ziyadat)?",
    options: [
      "Imam Muhammad ibn al-Hasan ash-Shaybani",
      "Imam Ahmad ibn Muhammad al-Quduri",
      "Imam Shams al-A'immah as-Sarakhsi",
      "Imam Zufar ibn al-Hudhayl",
    ],
    correctIdx: 0,
    isharaHint:
      "He studied first under Imam Abu Hanifa, completed his training under Qadi Abu Yusuf, and also transmitted the Muwatta of Imam Malik.",
    communityPoll: [71, 11, 11, 7],
    proofExplanation:
      "Imam Muhammad ibn al-Hasan ash-Shaybani (132–189 AH) authored all six books of Zahir ar-Riwayah (al-Usul), which represent the highest tier of legal authority in the Hanafi Madhhab.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Hanafi Usul & Texts",
  },
  {
    id: "q-t11-09",
    tier: 11,
    category: "Aqaid & Seerah",
    question:
      "Which foundational Sunni creed text opens by declaring: 'This is an exposition of the creed of Ahl as-Sunnah wal-Jama'ah according to the school of the jurists of the religion: Abu Hanifa, Abu Yusuf, and Muhammad ash-Shaybani'?",
    options: [
      "Sharh al-Mawaqif",
      "Al-Ibanah 'an Usul ad-Diyanah",
      "Al-Aqidah an-Nasafiyyah",
      "Al-Aqidah at-Tahawiyyah",
    ],
    correctIdx: 3,
    isharaHint:
      "Authored in Egypt by the great Hanafi Hadith master and jurist Imam Abu Ja'far Ahmad ibn Muhammad (239–321 AH).",
    communityPoll: [7, 10, 13, 70],
    proofExplanation:
      "Imam Abu Ja'far at-Tahawi (d. 321 AH), nephew of al-Muzani who embraced the Hanafi school, composed Al-Aqidah at-Tahawiyyah as a universally accepted summary of orthodox Sunni creed.",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Classical Sunni Aqaid",
  },
  {
    id: "q-t11-10",
    tier: 11,
    category: "Quran & Kanzul Iman",
    question:
      "Which encyclopedic 19th-century Baghdad Tafsir—harmonizing Arabic rhetoric, Hanafi jurisprudence, Sunni theology, and Sufi allusions (Isharat)—was authored by Mufti Shihabuddin Mahmud al-Alusi (d. 1270 AH)?",
    options: [
      "Ruh al-Ma'ani",
      "Al-Jami' li-Ahkam al-Quran",
      "Irshad al-'Aql as-Salim",
      "Ghara'ib al-Quran wa Ragha'ib al-Furqan",
    ],
    correctIdx: 0,
    isharaHint:
      "Its full title is 'Ruh al-Ma'ani fi Tafsir al-Quran al-'Azim was-Sab' al-Mathani', and Ala Hazrat frequently praised and cited it.",
    communityPoll: [69, 12, 10, 9],
    proofExplanation:
      "Allama Shihabuddin Mahmud al-Alusi al-Baghdadi al-Hanafi (1217–1270 AH) completed Ruh al-Ma'ani in thirty parts, synthesizing classical Sunni Tafsir with subtle spiritual insights.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Tafsir Scholarship",
  },
  {
    id: "q-t11-11",
    tier: 11,
    category: "Lives of the Auliya",
    question:
      "Which 3rd-century Hijri master of Baghdad (d. 297 AH) was titled 'Sayyid at-Ta'ifah' (Leader of the Sufi Community) and famously declared: 'This path of ours is strictly bound by the Book and the Sunnah'?",
    options: [
      "Sultan al-Arifin Bayazid Bastami",
      "Sayyiduna Junayd al-Baghdadi",
      "Hazrat Habib al-Ajami",
      "Hazrat Sahl ibn Abdullah at-Tustari",
    ],
    correctIdx: 1,
    isharaHint:
      "Trained in fiqh by Abu Thawr and in Tasawwuf by his maternal uncle Sari as-Saqati, he stands at Generation 6 of the Qadri Shajrah.",
    communityPoll: [14, 72, 7, 7],
    proofExplanation:
      "Imam Abu al-Qasim al-Junayd al-Baghdadi (d. 297 AH) anchored sober Sunni Tasawwuf upon strict adherence to the Quran and Sunnah, as recorded in Ar-Risalah al-Qushayriyyah and Kashf al-Mahjub.",
    proofLink: "/auliya",
    proofLinkLabel: "Inspect Qadri Shajrah Chain",
  },
  {
    id: "q-t11-12",
    tier: 11,
    category: "Hanafi Fiqh",
    question:
      "Who authored 'Al-Hidayah', the celebrated Hanafi legal commentary written upon his own foundational Mukhtasar 'Bidayat al-Mubtadi' (which combined Mukhtasar al-Quduri and Al-Jami' as-Saghir)?",
    options: [
      "Imam Abu al-Husayn Ahmad al-Quduri",
      "Imam Kamaluddin ibn al-Humam",
      "Imam Burhanuddin Ali ibn Abi Bakr al-Marghinani",
      "Imam Ala'uddin Abu Bakr al-Kasani",
    ],
    correctIdx: 2,
    isharaHint:
      "He hailed from Farghana (Transoxiana, d. 593 AH) and observed a continuous fast for thirteen years while composing this masterwork.",
    communityPoll: [12, 9, 71, 8],
    proofExplanation:
      "Shaykh al-Islam Burhanuddin al-Marghinani (d. 593 AH) authored Al-Hidayah fi Sharh Bidayat al-Mubtadi, which remains the central pillar of higher Hanafi legal instruction worldwide.",
    proofLink: "/fiqh",
    proofLinkLabel: "Browse Hanafi Fiqh Classics",
  },
  {
    id: "q-t11-13",
    tier: 11,
    category: "Aqaid & Seerah",
    question:
      "When the persecuted Companions migrated to Abyssinia, which two Qurayshi envoys were dispatched to King Ashamah an-Najashi to demand their return before Sayyiduna Ja'far at-Tayyar recited Surah Maryam?",
    options: [
      "Amr ibn al-As and Abdullah ibn Abi Rabi'ah",
      "Abu Sufyan ibn Harb and Ikrimah ibn Abi Jahl",
      "Suhayl ibn Amr and Safwan ibn Umayyah",
      "Walid ibn al-Mughirah and Utbah ibn Rabi'ah",
    ],
    correctIdx: 0,
    isharaHint:
      "Both men later embraced Islam; one later became famous as the Muslim commander who opened Egypt during Sayyiduna Umar's Caliphate.",
    communityPoll: [68, 13, 11, 8],
    proofExplanation:
      "Musnad Ahmad (#1740) and Ibn Hisham's Sirah record from Ummul Mu'minin Umm Salamah (رضي الله عنها) that Quraysh sent Amr ibn al-As and Abdullah ibn Abi Rabi'ah, whose plea failed when Najashi wept upon hearing Surah Maryam.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Prophetic Seerah Chronicles",
  },
  {
    id: "q-t11-14",
    tier: 11,
    category: "Quran & Kanzul Iman",
    question:
      "According to the Hadith narrated by Sayyiduna Abdullah ibn Mas'ud (رضي الله عنه) in Imam al-Bayhaqi's 'Shu'ab al-Iman', reciting which Surah every night safeguards a believer from ever being afflicted by poverty (Faqah)?",
    options: [
      "Surah Ad-Dukhan",
      "Surah Al-Muzzammil",
      "Surah Al-Waqi'ah",
      "Surah An-Naba'",
    ],
    correctIdx: 2,
    isharaHint:
      "It is the 56th Surah of the Holy Quran, dividing humanity in the Hereafter into Ashab al-Maymanah, Ashab al-Mash'amah, and As-Sabiqun.",
    communityPoll: [9, 10, 74, 7],
    proofExplanation:
      "Imam al-Bayhaqi in Shu'ab al-Iman (#2498) records that Sayyiduna Ibn Mas'ud instructed his daughters to recite Surah Al-Waqi'ah nightly because he heard the Messenger of Allah ﷺ promise protection from destitution to its regular reciter.",
    proofLink: "/quran",
    proofLinkLabel: "Recite Surah Al-Waqi'ah",
  },
  {
    id: "q-t11-15",
    tier: 11,
    category: "Lives of the Auliya",
    question:
      "Which Khurasani saint and Hadith narrator of Bukhari and Muslim (d. 187 AH), revered as 'Abid al-Haramayn', repented instantaneously upon hearing a night reciter chant Surah Al-Hadid 57:16?",
    options: [
      "Hazrat Malik ibn Dinar",
      "Sultan Bayazid Bastami",
      "Hazrat Habib al-Ajami",
      "Hazrat Fudayl ibn Iyad",
    ],
    correctIdx: 3,
    isharaHint:
      "Hearing 'Has the time not come for those who believe that their hearts should humble themselves to the remembrance of Allah?', he wept, 'Yes, O Lord, the time has come!'",
    communityPoll: [10, 11, 9, 70],
    proofExplanation:
      "Hazrat Abu Ali al-Fudayl ibn Iyad at-Tamimi (d. 187 AH) transformed from his youth into the 'Worshipper of the Two Sanctuaries', counseling Caliph Harun ar-Rashid and transmitting authentic Hadiths.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Tazkirah of Early Saints",
  },
  {
    id: "q-t11-16",
    tier: 11,
    category: "Hanafi Fiqh",
    question:
      "Which concise Hanafi legal matn (text), counted among the most authoritative 'Mutun Mu'tabarah' by later Hanafi verifiers, was authored by Imam Hafizuddin Abu al-Barakat an-Nasafi (d. 710 AH)?",
    options: [
      "Nur al-Idah wa Najat al-Arwah",
      "Kanz ad-Daqa'iq",
      "Multaqa al-Abhur",
      "Al-Mukhtar lil-Fatwa",
    ],
    correctIdx: 1,
    isharaHint:
      "Its title means 'Treasure of Subtleties', and it inspired major commentaries such as Az-Zayla'i's Tabyin al-Haqa'iq and Ibn Nujaym's Al-Bahr ar-Ra'iq.",
    communityPoll: [11, 70, 10, 9],
    proofExplanation:
      "Imam Abu al-Barakat Abdullah ibn Ahmad an-Nasafi (d. 710 AH)—who also wrote Tafsir Madarik at-Tanzil and Manar al-Anwar—distilled Kanz ad-Daqa'iq as one of the supreme relied-upon Hanafi legal texts.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Relied-Upon Hanafi Mutun",
  },
  {
    id: "q-t11-17",
    tier: 11,
    category: "Aqaid & Seerah",
    question:
      "Which classic creedal text transmitted from Imam al-A'zam Abu Hanifa (رضي الله عنه)—later expounded in an authoritative commentary by Mulla Ali al-Qari—affirms Sunni doctrine on Divine Attributes, Qadar, and Prophetic honor?",
    options: [
      "Kitab al-Kharaj",
      "Al-Fiqh al-Akbar",
      "Qut al-Qulub",
      "Minhaj al-Abidin",
    ],
    correctIdx: 1,
    isharaHint:
      "Imam Abu Hanifa distinguished theology ('the Greater Understanding') from practical branch rulings ('al-Fiqh al-Asghar').",
    communityPoll: [7, 75, 9, 9],
    proofExplanation:
      "Al-Fiqh al-Akbar by Imam Abu Hanifa Nu'man ibn Thabit (80–150 AH) is one of Islam's earliest written creeds, comprehensively explained by Mulla Ali al-Qari in Minah ar-Rawd al-Azhar.",
    proofLink: "/fiqh",
    proofLinkLabel: "View Al-Fiqh al-Akbar Principles",
  },
  {
    id: "q-t11-18",
    tier: 11,
    category: "Quran & Kanzul Iman",
    question:
      "According to Jami' at-Tirmidhi (#2922), if a believer says 'A'udhu billahis-Sami'il-'Alim minash-shaytanir-rajim' thrice at morning and recites the final three verses of which Surah, Allah appoints 70,000 angels to pray for him until evening?",
    options: [
      "Surah Al-Mulk",
      "Surah As-Sajdah",
      "Surah Al-Fath",
      "Surah Al-Hashr",
    ],
    correctIdx: 3,
    isharaHint:
      "Those closing verses (59:22–24) begin with 'Huwallahul-ladhi la ilaha illa Huwa 'Alimul-ghaybi wash-shahadah' and enumerate over a dozen Beautiful Names of Allah.",
    communityPoll: [9, 8, 11, 72],
    proofExplanation:
      "Narrated by Sayyiduna Ma'qil ibn Yasar (رضي الله عنه) in Jami' at-Tirmidhi (#2922), reciting the last three verses of Surah Al-Hashr brings the du'a of 70,000 angels and the rank of martyrdom if one passes away that day; similarly Tirmidhi (#2888) praises Surah Ad-Dukhan at night.",
    proofLink: "/tasbih",
    proofLinkLabel: "Practice Morning & Evening Wird",
  },
  {
    id: "q-t11-19",
    tier: 11,
    category: "Lives of the Auliya",
    question:
      "Which revered female saint of Basra (d. 185 AH), contemporary with the students of Khwaja Hasan al-Basri, became timelessly renowned in Sunni Tasawwuf for her discourses on pure, selfless Divine Love (Mahabbah Ilahiyyah)?",
    options: [
      "Sayyidah Nafisah at-Tahirah of Cairo",
      "Hazrat Bibi Pak Daman of Lahore",
      "Hazrat Rabi'a al-Adawiyyah al-Qaysiyyah",
      "Hazrat Mu'adhah bint Abdullah al-Adawiyyah",
    ],
    correctIdx: 2,
    isharaHint:
      "Her night munajat famously expressed worshipping Allah out of pure longing for His Eternal Countenance rather than mere transaction.",
    communityPoll: [9, 7, 76, 8],
    proofExplanation:
      "Hazrat Rabi'a bint Isma'il al-Adawiyyah of Basra (d. 185 AH) is honored by Imam al-Ghazali in Ihya' 'Ulum ad-Din and Data Ganj Bakhsh as an archetype of sincere, unalloyed devotion to Allah.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Lives of the Early Awliya",
  },
  {
    id: "q-t11-20",
    tier: 11,
    category: "Hanafi Fiqh",
    question:
      "Which earliest senior companion of Imam Abu Hanifa (110–158 AH) was praised by the Imam himself with the words 'The sharpest of my companions in Qiyas (analogical reasoning) is he'?",
    options: [
      "Imam Zufar ibn al-Hudhayl al-Anbari",
      "Imam Abu al-Layth as-Samarqandi",
      "Imam Asad ibn Amr al-Bajali",
      "Imam Abu Bakr al-Jassas",
    ],
    correctIdx: 0,
    isharaHint:
      "Originally trained in Hadith before mastering Fiqh under Imam Abu Hanifa in Kufa, he passed away in Basra before both Qadi Abu Yusuf and Imam Muhammad.",
    communityPoll: [68, 12, 9, 11],
    proofExplanation:
      "Imam Zufar ibn al-Hudhayl (110–158 AH) ranked alongside Abu Yusuf and Muhammad among Imam Abu Hanifa's foremost mujtahid disciples, and in roughly seventeen select legal issues (such as certain rulings on Kafa'ah and Zakat) later Hanafi fatwa even favored his view.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Hanafi Mujtahid Tabaqat",
  },

  // ============================================================================
  // TIER 12 — Hanafi Astronomy & Salah, Mustalah al-Hadith, Burdah & Dala'il
  // ============================================================================
  {
    id: "q-t12-01",
    tier: 12,
    category: "Aqaid & Seerah",
    question:
      "What is the formal original Arabic title of Imam Sharafuddin al-Busiri's (d. 696 AH) immortal ode in praise of the Beloved Prophet ﷺ, universally known as 'Qasidah al-Burdah'?",
    options: [
      "Banat Su'ad fi Madh Rasulillah",
      "Umm al-Qura fi Madh Khayr al-Wara",
      "Al-Kawakib ad-Durriyyah fi Madh Khayr al-Bariyyah",
      "Simt ad-Durar fi Akhbar Mawlid Khayr al-Bashar",
    ],
    correctIdx: 2,
    isharaHint:
      "Its formal title translates to 'The Celestial Pearly Stars in Praise of the Best of Creation', whereas 'Banat Su'ad' was composed earlier by Ka'b ibn Zuhayr (رضي الله عنه).",
    communityPoll: [12, 10, 69, 9],
    proofExplanation:
      "Imam Muhammad ibn Sa'id al-Busiri (608–696 AH) titled his 160-couplet masterpiece Al-Kawakib ad-Durriyyah fi Madh Khayr al-Bariyyah; 'Umm al-Qura' is his other famous poem, Al-Qasidah al-Hamziyyah.",
    proofLink: "/tasbih",
    proofLinkLabel: "Open Salawat & Devotional Wird",
  },
  {
    id: "q-t12-02",
    tier: 12,
    category: "Quran & Kanzul Iman",
    question:
      "Which verse of the Holy Quran establishes the astronomical boundary of Suhoor and Fajr with the command: 'And eat and drink until the white thread of dawn becomes distinct to you from the black thread'?",
    options: [
      "Surah Al-Baqarah 2:183",
      "Surah Al-Baqarah 2:187",
      "Surah Al-Isra 17:78",
      "Surah Al-Muzzammil 73:20",
    ],
    correctIdx: 1,
    isharaHint:
      "Revealed in the comprehensive Ramadan fasting passage of Surah Al-Baqarah, four verses after the opening prescription of Sawm.",
    communityPoll: [14, 71, 9, 6],
    proofExplanation:
      "Surah Al-Baqarah 2:187 ('hatta yatabayyana lakumul-khaytul-abyadu minal-khaytil-aswadi minal-fajr') proves that Suhoor ends and Fajr begins at the horizontal spread of true dawn (Subh Sadiq).",
    proofLink: "/prayer",
    proofLinkLabel: "Check Subh Sadiq & Prayer Engine",
  },
  {
    id: "q-t12-03",
    tier: 12,
    category: "Lives of the Auliya",
    question:
      "How did Imam Sharafuddin al-Busiri's ode receive the name 'Al-Burdah' (The Mantle) while he lay afflicted with half-body paralysis in Egypt?",
    options: [
      "Sultan Qalawun gifted him a Yemeni cloak upon its first public recitation",
      "He composed it beside the sacred chamber in Madinah wearing green wool",
      "Physicians wrapped him in warm linen after seven days of Salawat",
      "He beheld the Holy Prophet ﷺ in a dream wiping his paralyzed side and draping his blessed mantle over him, awakening completely healed",
    ],
    correctIdx: 3,
    isharaHint:
      "Commentators such as Ibn Hajar al-Haytami and Mulla Ali al-Qari recount that a righteous dervish met him that very morning asking for the poem before al-Busiri had told anyone.",
    communityPoll: [9, 10, 9, 72],
    proofExplanation:
      "As documented by Mulla Ali al-Qari in Az-Zubdah fi Sharh al-Burdah, Imam al-Busiri saw the Messenger of Allah ﷺ pass his blessed hand over him and cast a mantle upon him, curing his paralysis instantaneously.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Devotional Legacy of Awliya",
  },
  {
    id: "q-t12-04",
    tier: 12,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi astronomical fiqh (Bahar-e-Shariat, Part 3), how does 'Subh Kadhib' (false dawn) differ optically and legally from 'Subh Sadiq' (true dawn)?",
    options: [
      "Subh Kadhib spreads horizontally across the horizon and ends Isha while Suhoor continues",
      "Subh Kadhib rises vertically like a wolf's tail before fading into darkness and neither ends Isha/Suhoor nor begins Fajr, whereas Subh Sadiq spreads horizontally along the horizon",
      "Subh Kadhib appears twenty minutes after sunrise during the Makruh Tahrimi window",
      "Subh Kadhib invalidates Witr prayer while making Nafl prayers obligatory",
    ],
    correctIdx: 1,
    isharaHint:
      "Classical texts call false dawn 'dhanab as-sirhan' (the wolf's tail) because zodiacal light shoots upward vertically rather than widening across the eastern horizon.",
    communityPoll: [13, 68, 10, 9],
    proofExplanation:
      "Hadith in Sahih Muslim (#1094) and Hanafi manuals (Radd al-Muhtar & Bahar-e-Shariat) affirm that vertical Subh Kadhib prohibits neither food for the fasting person nor Isha prayer, whereas horizontal Subh Sadiq initiates both Sawm and Fajr.",
    proofLink: "/prayer",
    proofLinkLabel: "Inspect Hanafi Dawn Timings",
  },
  {
    id: "q-t12-05",
    tier: 12,
    category: "Aqaid & Seerah",
    question:
      "In Mustalah al-Hadith (as codified by Hafiz Ibn Hajar al-Asqalani in 'Nukhbat al-Fikar'), what defines an 'Aziz' Hadith in terms of narrator count across its chain (Isnad)?",
    options: [
      "No fewer than two narrators transmit it at every single tier of the chain",
      "Only one solitary narrator transmits it at the Companion or Tabi'i tier",
      "At least ten narrators transmit it in every generation without exception",
      "A Tabi'i narrates directly from the Prophet ﷺ while omitting the Companion",
    ],
    correctIdx: 0,
    isharaHint:
      "Below Mashhur (three or more at every tier) and above Gharib/Fard (which drops to one narrator at any tier).",
    communityPoll: [65, 14, 12, 9],
    proofExplanation:
      "In Nukhbat al-Fikar and Nuzhat an-Nazar, 'Aziz' requires that no tier in the Isnad has fewer than two narrators—illustrated by the Bukhari & Muslim Hadith 'None of you truly believes until I am dearer to him than his father and his child'.",
    proofLink: "/fiqh",
    proofLinkLabel: "Review Mustalah al-Hadith",
  },
  {
    id: "q-t12-06",
    tier: 12,
    category: "Quran & Kanzul Iman",
    question:
      "In Surah Al-Isra 17:78 ('Aqimis-salata li-dulukish-shamsi ila ghasaqil-layli wa qur'anal-fajr'), how do Kanzul Iman and Khazain-ul-Irfan explain the prayer times encompassed in this single verse?",
    options: [
      "Only the two Eid prayers and Friday Jumu'ah after solar zenith",
      "Only Tahajjud and Ishraq prayers during winter nights",
      "Solar eclipse prayer at midday and lunar eclipse prayer at midnight",
      "All five Fard prayers: Dhuhr and Asr from solar decline (Duluk/Zawal), Maghrib and Isha into night's darkness (Ghasaq), and Fajr ('Qur'an al-Fajr')",
    ],
    correctIdx: 3,
    isharaHint:
      "'Duluk ash-shams' denotes the sun's decline past the meridian (Istiwa/Zawal), marking the opening of Dhuhr.",
    communityPoll: [8, 9, 12, 71],
    proofExplanation:
      "Allama Naeemuddin Muradabadi in Khazain-ul-Irfan under 17:78 notes from Ibn Abbas and Ibn Umar (رضي الله عنهم) that 'duluk ash-shams' begins at Zawal (Dhuhr and Asr), 'ghasaq al-layl' covers Maghrib and Isha, and 'Qur'an al-Fajr' signifies Fajr Salah.",
    proofLink: "/prayer",
    proofLinkLabel: "View Five Daily Hanafi Windows",
  },
  {
    id: "q-t12-07",
    tier: 12,
    category: "Lives of the Auliya",
    question:
      "Which Baghdad saint (d. 253 AH)—disciple of Ma'ruf al-Karkhi and maternal uncle of Junayd al-Baghdadi—wept in repentance for thirty years after once saying 'Alhamdulillah' upon hearing his own shop survived a bazaar fire that struck his neighbors?",
    options: [
      "Hazrat Sari as-Saqati",
      "Hazrat Abu Hafs al-Haddad",
      "Hazrat Harith al-Muhasibi",
      "Hazrat Bishr ibn al-Harith",
    ],
    correctIdx: 0,
    isharaHint:
      "He reproached his own soul for feeling a moment's relief for private property while fellow Muslims suffered loss in the market.",
    communityPoll: [67, 11, 12, 10],
    proofExplanation:
      "Imam al-Qushayri and Imam al-Ghazali record this famous account of Hazrat Sari ibn al-Mughallis as-Saqati (d. 253 AH) as the pinnacle of altruistic brotherhood (Ithar) and vigilance over the heart.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Qadri Masters Tazkirah",
  },
  {
    id: "q-t12-08",
    tier: 12,
    category: "Hanafi Fiqh",
    question:
      "Regarding the end of Maghrib and entry of Isha, how does Imam Abu Hanifa's definition of 'ash-Shafaq' (twilight) differ from that of Sahibayn (Imam Abu Yusuf and Imam Muhammad)?",
    options: [
      "Imam Abu Hanifa defines Shafaq as red glow, whereas Sahibayn extend it until astronomical midnight",
      "Imam Abu Hanifa fixes Maghrib at exactly forty minutes year-round regardless of latitude",
      "Imam Abu Hanifa defines Shafaq as the white glow (ash-Shafaq al-Abyad) lingering after the red glow fades, whereas Sahibayn define it as the red glow (ash-Shafaq al-Ahmar)",
      "Both Imam Abu Hanifa and Sahibayn equate Shafaq with the rising of the full moon",
    ],
    correctIdx: 2,
    isharaHint:
      "Under Imam al-A'zam's cautious primary position (~18° solar depression), Isha begins slightly later than under Sahibayn's ~15° red-twilight threshold.",
    communityPoll: [14, 7, 66, 13],
    proofExplanation:
      "Al-Hidayah, Radd al-Muhtar, and Bahar-e-Shariat (Part 3) detail that Imam Abu Hanifa defines Shafaq as al-Bayad (the white horizon glow after redness vanishes), which is the cautious Zahir ar-Riwayah standard.",
    proofLink: "/prayer",
    proofLinkLabel: "Compare Maghrib & Isha Angles",
  },
  {
    id: "q-t12-09",
    tier: 12,
    category: "Aqaid & Seerah",
    question:
      "In Hanafi Usul al-Hadith (Usul ash-Shashi & Nur al-Anwar), what is the legal authority of a 'Mursal' Hadith transmitted directly from the Prophet ﷺ by a trustworthy Tabi'i of the praised early generations?",
    options: [
      "It is categorically rejected as unverified in all chapters of law",
      "It may be cited only for historical biographies, never for Halal and Haram",
      "It is valid only when narrated exclusively by Sa'id ibn al-Musayyib",
      "It is accepted unconditionally as an authoritative legal proof (Hujjah) in deriving Shari'ah rulings",
    ],
    correctIdx: 3,
    isharaHint:
      "Imam Abu Hanifa and Imam Malik both held that when an upright Tabi'i says 'The Messenger of Allah ﷺ said...', his integrity vouches for the omitted link.",
    communityPoll: [9, 15, 12, 64],
    proofExplanation:
      "Unlike Imam ash-Shafi'i's conditional restriction on Mursal reports, Hanafi Usul accepts the Mursal of reliable Tabi'in and Taba' at-Tabi'in (such as Ibrahim an-Nakha'i and Hasan al-Basri) as binding legal evidence.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Hanafi Usul al-Hadith",
  },
  {
    id: "q-t12-10",
    tier: 12,
    category: "Quran & Kanzul Iman",
    question:
      "In Surah Al-Inshiqaq 84:16 ('Fala uqsimu bish-shafaq'), how does Ala Hazrat's Kanzul Iman translate the Divine oath by 'ash-Shafaq'?",
    options: [
      "So I swear by the twilight glow of the evening ('To mujhe qasam hai sham ki shafaq ki')",
      "So I swear by the cool breeze before daybreak",
      "So I swear by the midday brilliance of the sun",
      "So I swear by the shooting stars of the heavens",
    ],
    correctIdx: 0,
    isharaHint:
      "Followed immediately in verses 84:17–18 by 'And by the night and all that it gathers in, and by the moon when it grows full'.",
    communityPoll: [72, 10, 9, 9],
    proofExplanation:
      "Kanzul Iman renders Surah Al-Inshiqaq 84:16 as 'To mujhe qasam hai sham ki shafaq ki', highlighting the evening horizon glow after sunset before complete nightfall.",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Al-Inshiqaq in Kanzul Iman",
  },
  {
    id: "q-t12-11",
    tier: 12,
    category: "Lives of the Auliya",
    question:
      "Which 7th-century Hijri founder of the Shadhili spiritual order (593–656 AH) received and composed the renowned protective litany 'Hizb al-Bahr' while crossing the Red Sea en route to Hajj?",
    options: [
      "Shaykh Ahmad al-Kabir ar-Rifa'i",
      "Shaykh Najmuddin Kubra",
      "Shaykh Abu al-Hasan Ali ash-Shadhili",
      "Shaykh Abdul Wahhab ash-Sha'rani",
    ],
    correctIdx: 2,
    isharaHint:
      "Born in Ghumarah (Morocco) and laid to rest at Humaythara in Upper Egypt, he was also the spiritual grand-master of Imam al-Busiri's teacher Abu al-Abbas al-Mursi.",
    communityPoll: [11, 9, 68, 12],
    proofExplanation:
      "Sayyiduna Shaykh Abu al-Hasan ash-Shadhili (d. 656 AH) composed Hizb al-Bahr through Prophetic inspiration on the Red Sea; Sunni scholars including Shah Waliullah and Ala Hazrat transmitted Ijazah for its recitation.",
    proofLink: "/tasbih",
    proofLinkLabel: "Explore Classical Awrad & Litanies",
  },
  {
    id: "q-t12-12",
    tier: 12,
    category: "Hanafi Fiqh",
    question:
      "How does the Hanafi Madhhab structure Salat al-Kusuf (solar eclipse prayer) and Salat al-Khusuf (lunar eclipse prayer) in contrast to the Shafi'i school?",
    options: [
      "Both prayers feature two Ruku's per Rak'ah and two formal Khutbahs like Eid",
      "Solar eclipse prayer is four Wajib Rak'ahs, while lunar eclipse prayer is Makruh",
      "Lunar eclipse is prayed in congregation at the Jami' Masjid, while solar eclipse is prayed alone",
      "Both have a single Ruku' and two Sujud per Rak'ah without a Khutbah; Kusuf is Sunnah in congregation, whereas Khusuf is prayed individually at home",
    ],
    correctIdx: 3,
    isharaHint:
      "Hanafi fiqh acts upon the Hadith narrations describing two standard Rak'ahs with prolonged recitation and earnest Du'a until the sun clears.",
    communityPoll: [15, 7, 10, 68],
    proofExplanation:
      "Bahar-e-Shariat (Part 4) and Al-Hidayah specify that Hanafi Kusuf is two Rak'ahs with one Ruku' per Rak'ah in Jama'ah (without Khutbah), Khusuf is prayed individually at home, and in Istisqa (seeking rain) Imam Abu Hanifa emphasized collective Du'a and Istighfar while Sahibayn added two congregational Rak'ahs.",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Special Prayers in Bahar-e-Shariat",
  },
  {
    id: "q-t12-13",
    tier: 12,
    category: "Aqaid & Seerah",
    question:
      "Which 9th-century Hijri Moroccan Hasani Sayyid and Shadhili master (d. 870 AH) compiled 'Dala'il al-Khayrat', organizing Salawat upon the Holy Prophet ﷺ into daily Hizb readings from Monday to Monday?",
    options: [
      "Shaykh Ahmad Zarruq al-Fasi",
      "Imam Muhammad ibn Sulayman al-Jazuli",
      "Qadi Iyad ibn Musa al-Yahsubi",
      "Shaykh Yusuf ibn Isma'il an-Nabhani",
    ],
    correctIdx: 1,
    isharaHint:
      "One of the 'Seven Saints of Marrakesh', he compiled this treasury of Durood templates from authentic Hadith and the invocations of earlier Awliya.",
    communityPoll: [10, 70, 11, 9],
    proofExplanation:
      "Imam Abu Abdullah Muhammad ibn Sulayman al-Jazuli (d. 870 AH / 1465 CE) authored Dala'il al-Khayrat wa Shawariq al-Anwar, which became the most widely recited manual of Durood Sharif across the Sunni world.",
    proofLink: "/tasbih",
    proofLinkLabel: "Recite Daily Durood & Salawat",
  },
  {
    id: "q-t12-14",
    tier: 12,
    category: "Quran & Kanzul Iman",
    question:
      "Which Makkan Surah initially obligated standing in night prayer (Qiyam al-Layl) for half the night or a fraction more or less while reciting the Quran with measured Tartil, before its closing verse lightened that strict obligation for the Ummah?",
    options: [
      "Surah Al-Muddaththir",
      "Surah Al-Inshirah",
      "Surah Al-Muzzammil",
      "Surah Al-Layl",
    ],
    correctIdx: 2,
    isharaHint:
      "Its fourth verse commands 'wa rattilil-Qur'ana tartila', and its lengthy twentieth verse was revealed a year later.",
    communityPoll: [12, 7, 71, 10],
    proofExplanation:
      "Surah Al-Muzzammil (73:1–4, 73:20) instituted Qiyam al-Layl and Tartil; Sahih Muslim (#746) from Sayyidah Aishah (رضي الله عنها) explains that verse 73:20 commuted nightly Qiyam for the Ummah from Fard into exalted Nafl/Sunnah (Tahajjud).",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Al-Muzzammil & Virtues",
  },
  {
    id: "q-t12-15",
    tier: 12,
    category: "Lives of the Auliya",
    question:
      "Which Suhrawardi master of Baghdad (539–632 AH) authored 'Awarif al-Ma'arif', the classical Arabic manual of Sufi ethics and Khanqah discipline taught personally by Baba Farid Ganj Shakar and Hazrat Nizamuddin Auliya?",
    options: [
      "Shaykh Abu an-Najib Abdul Qadir as-Suhrawardi",
      "Shaykh Shihabuddin Abu Hafs Umar as-Suhrawardi",
      "Shaykh Bahauddin Zakariya Multani",
      "Shaykh Rukn-e-Alam Abu al-Fath",
    ],
    correctIdx: 1,
    isharaHint:
      "He was the nephew and spiritual successor of Shaykh Abu an-Najib as-Suhrawardi and the direct Murshid of Shaykh Bahauddin Zakariya Multani.",
    communityPoll: [14, 66, 12, 8],
    proofExplanation:
      "Shaykh-ush-Shuyukh Shihabuddin Umar as-Suhrawardi (d. 632 AH) penned Awarif al-Ma'arif, grounding every etiquette of the Khanqah, Suhbah, and Wudu/Salah devotion directly in Prophetic Hadith.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Suhrawardi & Chishti Masters",
  },
  {
    id: "q-t12-16",
    tier: 12,
    category: "Hanafi Fiqh",
    question:
      "Using the exact Hanafi formula for 'Dahwa-e-Kubra' (midpoint of the Shar'i day, before which a daytime Ramadan or Nafl fast Niyyah is valid), if Subh Sadiq is at 05:00 AM and Sunset is at 06:20 PM, when does Dahwa-e-Kubra occur?",
    options: [
      "11:40 AM",
      "12:00 PM",
      "12:10 PM",
      "11:10 AM",
    ],
    correctIdx: 0,
    isharaHint:
      "Compute half of the total interval from Subh Sadiq (NOT Sunrise) to Sunset: 05:00 to 18:20 is 13 hours 20 minutes (800 minutes).",
    communityPoll: [64, 11, 17, 8],
    proofExplanation:
      "In Fatawa Razawiyya and Bahar-e-Shariat (Part 5), Nisf an-Nahar ash-Shar'i (Dahwa-e-Kubra) is halfway from Subh Sadiq to Sunset: 05:00 AM + 6 hours 40 minutes = 11:40 AM (confusing it with Sunrise-to-Sunset is a common error).",
    proofLink: "/prayer",
    proofLinkLabel: "Check Live Dahwa-e-Kubra Calculator",
  },
  {
    id: "q-t12-17",
    tier: 12,
    category: "Aqaid & Seerah",
    question:
      "In Hanafi Usul al-Fiqh (Usul al-Bazdawi & Nur al-Anwar), why is 'Khabar al-Mashhur' placed in a distinct intermediate rank above ordinary Ahad reports and below Mutawatir?",
    options: [
      "Because it was narrated by forty Companions at Badr and never written down",
      "Because it requires no chain of transmission if quoted by poets",
      "Because it originated as Ahad in the Companion era, became universally accepted and widespread in the 2nd and 3rd centuries, and yields tranquil certainty (Ilm Tuma'ninah) capable of qualifying general Quranic texts",
      "Because it applies exclusively to stories of earlier nations and abrogated laws",
    ],
    correctIdx: 2,
    isharaHint:
      "Classic Hanafi examples include the Hadiths on wiping over leather socks (Khuffayn) and requiring three consecutive fasts in oath expiation.",
    communityPoll: [9, 8, 65, 18],
    proofExplanation:
      "Hanafi Usul uniquely establishes Mashhur as a middle tier between Mutawatir and Khabar al-Wahid, imparting Ilm at-Tuma'ninah and permitting Takhsis al-'Amm and Ziyadah 'ala an-Nass.",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Hanafi Epistemology",
  },
  {
    id: "q-t12-18",
    tier: 12,
    category: "Quran & Kanzul Iman",
    question:
      "According to classical Sunni scholars (Imam as-Suyuti and Mulla Ali al-Qari), what decisive criterion distinguishes the Holy Quran from a 'Hadith Qudsi'?",
    options: [
      "Hadith Qudsi was revealed only in dreams, whereas the Quran was revealed only by day",
      "The Quran's exact Arabic wording and meaning are both miraculously revealed (Mu'jiz), Mutawatir, and recited in Salah, whereas Hadith Qudsi conveys a meaning attributed to Allah without miraculous challenge or validity as Salah Qira'ah",
      "Hadith Qudsi is superior in legal rank to Mutawatir verses of the Quran",
      "The Quran contains only legal rulings, whereas Hadith Qudsi contains only parables",
    ],
    correctIdx: 1,
    isharaHint:
      "Consider both I'jaz (inimitability of exact wording) and Ta'abbud bi-Tilawatihi (worship through reciting it as Qira'ah inside Salah).",
    communityPoll: [8, 70, 9, 13],
    proofExplanation:
      "In Al-Itqan and Mirqat al-Mafatih, the Holy Quran is Allah's inimitable speech in exact wording and meaning Whose recitation constitutes Salah Qira'ah, whereas Hadith Qudsi transmits a Divine meaning narrated by the Prophet ﷺ outside the Mushaf.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Ulum al-Quran Notes",
  },
  {
    id: "q-t12-19",
    tier: 12,
    category: "Lives of the Auliya",
    question:
      "Which early Baghdad saint (d. 200 AH) accepted Islam at the hands of Imam Ali ar-Rida, served as Murshid to Sari as-Saqati, and had his sanctuary praised by Ibrahim al-Harbi as 'proven panacea (at-Tiryaq al-Mujarrab)' for accepted Du'a?",
    options: [
      "Hazrat Ma'ruf al-Karkhi",
      "Hazrat Abu Turab an-Nakhshabi",
      "Hazrat Ruwaym ibn Ahmad",
      "Hazrat Mansur ibn Ammar",
    ],
    correctIdx: 0,
    isharaHint:
      "Named after the Karkh quarter on the western bank of Baghdad, he links Imam Ali ar-Rida and Dawud at-Ta'i to Sari as-Saqati in the Qadri chain.",
    communityPoll: [67, 11, 10, 12],
    proofExplanation:
      "Khatib al-Baghdadi in Tarikh Baghdad and Ibn al-Jawzi in Sifat as-Safwah record the towering station of Hazrat Ma'ruf al-Karkhi (d. 200 AH) and Ibrahim al-Harbi's famous statement regarding blessings experienced at his grave.",
    proofLink: "/auliya",
    proofLinkLabel: "Trace Baghdad Qadri Sanctuary",
  },
  {
    id: "q-t12-20",
    tier: 12,
    category: "Hanafi Fiqh",
    question:
      "In Salat at-Tasbih (300 glorifications across four Rak'ahs, 75 per Rak'ah), which distribution per Rak'ah transmitted from Imam Abdullah ibn al-Mubarak in Jami' at-Tirmidhi (#481) is preferred by Hanafi jurists in Radd al-Muhtar and Bahar-e-Shariat?",
    options: [
      "25 before Fatiha, 25 in Ruku', and 25 in the second Sajdah only",
      "10 after Thana, 15 in Ruku', 15 in Qawmah, 15 in first Sajdah, and 20 in Tashahhud",
      "15 after Surah, 10 in Ruku', 10 in Qawmah, 10 in first Sajdah, 10 in Jalsah, 10 in second Sajdah, and 10 sitting after second Sajdah",
      "15 after Thana before Fatiha, 10 after Surah, 10 in Ruku', 10 in Qawmah, 10 in first Sajdah, 10 in Jalsah, and 10 in second Sajdah",
    ],
    correctIdx: 3,
    isharaHint:
      "Ibn Abidin notes that starting with 15 right after Thana avoids adding an extra sitting (Jalsat al-Istirahah) after the second Sajdah.",
    communityPoll: [8, 10, 18, 64],
    proofExplanation:
      "Both Hadith methods (Abu Dawud #1297 & Tirmidhi #481) are valid in Bahar-e-Shariat (Part 4), while Hanafi verifiers prefer Ibn al-Mubarak's sequence (15 + 10 + 10 + 10 + 10 + 10 + 10 = 75 per Rak'ah) because it conforms seamlessly to standard Hanafi Salah postures.",
    proofLink: "/tasbih",
    proofLinkLabel: "Count Tasbih & Salat at-Tasbih Guide",
  },

  // ============================================================================
  // TIER 13 — Subcontinent & Global Awliya Legacy & Hanafi Mu'amalat / Nikah / Waqf
  // ============================================================================
  {
    id: "q-t13-01",
    tier: 13,
    category: "Aqaid & Seerah",
    question:
      "Which Sunni theologian and freedom fighter (1212–1278 AH) authored 'Tahqiq al-Fatwa fi Ibtal at-Taghwa' affirming Prophetic Shafa'ah, endorsed the 1857 Delhi Fatwa, and wrote 'Ath-Thawrah al-Hindiyyah' on cloth strips during exile in Kala Pani (Andaman)?",
    options: [
      "Allama Bahr-ul-Uloom Abdul Ali Farangi Mahalli",
      "Mujahid-e-Azam Allama Fazl-e-Haq Khairabadi",
      "Maulana Kifayat Ali Kafi Moradabadi",
      "Allama Abdul Hakim Sialkoti",
    ],
    correctIdx: 1,
    isharaHint:
      "A master of rational sciences and Sunni Kalam from Awadh, he refused to compromise his testimony on Prophetic dignity before the colonial tribunal and attained martyrdom in Andaman in 1861 CE.",
    communityPoll: [11, 66, 13, 10],
    proofExplanation:
      "Allama Fazl-e-Haq Khairabadi (1797–1861 CE) defended Ahl-e-Sunnat doctrine on Shafa'ah in Tahqiq al-Fatwa and chronicled colonial oppression in Arabic from Cellular Jail in Ath-Thawrah al-Hindiyyah.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Subcontinent Scholarly Heritage",
  },
  {
    id: "q-t13-02",
    tier: 13,
    category: "Quran & Kanzul Iman",
    question:
      "Which 15th-century saint and jurist resting at Mahim Sharif (Mumbai) authored the celebrated Arabic Quran commentary 'Tabsir ar-Rahman wa Taysir al-Mannan', linking every Surah semantically through the Divine Name 'Ar-Rahman'?",
    options: [
      "Qutb-e-Konkan Hazrat Makhdoom Ali Mahimi",
      "Qadir Wali Hazrat Shahul Hameed Nagori",
      "Hazrat Shaykh Zainuddin Dawud Shirazi",
      "Hazrat Sayyid Muhammad Gesu Daraz",
    ],
    correctIdx: 0,
    isharaHint:
      "Lived 776–835 AH (1372–1431 CE) on the western Konkan coast; his annual Urs in Mumbai draws devotees and state honors to this day.",
    communityPoll: [65, 13, 11, 11],
    proofExplanation:
      "Hazrat Makhdoom Faqih Ali ibn Ahmad al-Mahimi (d. 835 AH) authored Tabsir ar-Rahman wa Taysir al-Mannan (famous as Tafsir-e-Mahimi or Tafsir ar-Rahman), one of India's earliest complete Arabic Tafsirs.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Classical Tafsir Heritage",
  },
  {
    id: "q-t13-03",
    tier: 13,
    category: "Lives of the Auliya",
    question:
      "Which ruler of Simnan abdicated his royal crown to enter the discipleship of Shaykh Ala-ul-Haq Pandawi in Bengal before settling at Kichaucha Sharif, with his encyclopedic Sufi discourses preserved as 'Lata'if-e-Ashrafi'?",
    options: [
      "Hazrat Makhdoom Jahanian Jahangasht of Uch Sharif",
      "Hazrat Shah Mina of Lucknow",
      "Sultan-ut-Tarikin Makhdoom Sayyid Ashraf Jahangir Simnani",
      "Hazrat Sharafuddin Yahya Maneri of Bihar Sharif",
    ],
    correctIdx: 2,
    isharaHint:
      "His Urs is commemorated on 28 Muharram at Kichaucha Sharif (Ambedkar Nagar, UP), and Nizam Yamani compiled his Malfuzat into Lata'if-e-Ashrafi.",
    communityPoll: [12, 9, 67, 12],
    proofExplanation:
      "Ghaus-ul-Alam Makhdoom Sayyid Ashraf Jahangir Simnani (d. 808 AH) renounced the throne of Simnan, traveled widely with Mir Sayyid Ali Hamadani, and established the Ashrafi Chishti center at Kichaucha Sharif.",
    proofLink: "/auliya",
    proofLinkLabel: "View Chishti Ashrafi Legacy",
  },
  {
    id: "q-t13-04",
    tier: 13,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Fiqh (Bahar-e-Shariat, Part 7), what are the essential pillars (Arkan) of Nikah and the mandatory witness threshold (Nisab ash-Shahadah) for its validity?",
    options: [
      "Written registration and guardian signature before four adult male witnesses",
      "Immediate cash delivery of Mahr and a Friday sermon before one male and one female witness",
      "Offer (Ijab) and Acceptance (Qabul) in a single sitting (Ittihad al-Majlis), heard simultaneously by at least two sane adult Muslim men, or one Muslim man and two Muslim women",
      "Public Walimah banquet and mutual gift exchange witnessed by any two neighbors",
    ],
    correctIdx: 2,
    isharaHint:
      "In Hanafi law, if only one man and one woman witness the Ijab and Qabul, or if the witnesses hear the two parties separately rather than together, the Nikah does not contract.",
    communityPoll: [10, 11, 68, 11],
    proofExplanation:
      "Al-Hidayah and Bahar-e-Shariat (Kitab an-Nikah) establish that Nikah consists of Ijab and Qabul in one majlis, conditioned upon simultaneous hearing by two free, sane, adult Muslim men or one Muslim man and two Muslim women.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Kitab an-Nikah Rulings",
  },
  {
    id: "q-t13-05",
    tier: 13,
    category: "Aqaid & Seerah",
    question:
      "Which Chishti Nizami scholar-saint (1275–1356 AH) authored 'Sayf-e-Chishtiyyai' and 'Shams al-Hidayah' defending Khatm-e-Nubuwwat and the physical ascension and future descent of Prophet Isa (عليه السلام)?",
    options: [
      "Khwaja Ghulam Farid of Kot Mithan",
      "Khwaja Qamaruddin Sialvi",
      "Tajdar-e-Golra Pir Sayyid Mehr Ali Shah Golravi",
      "Amir-e-Millat Pir Jama'at Ali Shah Alipuri",
    ],
    correctIdx: 2,
    isharaHint:
      "In August 1900 CE he traveled to Lahore at the unanimous acclaim of Sunni and Muslim scholars to uphold the finality of Prophethood.",
    communityPoll: [10, 11, 68, 11],
    proofExplanation:
      "Hazrat Pir Sayyid Mehr Ali Shah of Golra Sharif (1859–1937 CE) penned Shams al-Hidayah (1900) and Sayf-e-Chishtiyyai (1902), dismantling false claims to prophethood through Quran, Mutawatir Hadith, and Arabic philology.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Golra Sharif Scholarship",
  },
  {
    id: "q-t13-06",
    tier: 13,
    category: "Quran & Kanzul Iman",
    question:
      "Which concise Persian treatise by Shah Waliullah Muhaddith Dehlawi (1114–1176 AH) classified Quranic subject matter into 'Al-Ulum al-Khamsah' (The Five Sciences) and became a staple of Usul at-Tafsir study?",
    options: [
      "Fath ar-Rahman bi-Tarjamat al-Quran",
      "Al-Budur al-Bazighah",
      "Izalat al-Khafa' 'an Khilafat al-Khulafa'",
      "Al-Fawz al-Kabir fi Usul at-Tafsir",
    ],
    correctIdx: 3,
    isharaHint:
      "Its five thematic pillars cover Ahkam (rulings), Mukhasamah (dialectic), reminder of Divine favors, reminder of historical days, and reminder of death and the Hereafter.",
    communityPoll: [14, 9, 13, 64],
    proofExplanation:
      "Shah Waliullah Dehlawi (d. 1176 AH) authored Al-Fawz al-Kabir fi Usul at-Tafsir to clarify the five core Quranic sciences, occasions of revelation, and subtle rules of Quranic style.",
    proofLink: "/quran",
    proofLinkLabel: "Review Usul at-Tafsir Classics",
  },
  {
    id: "q-t13-07",
    tier: 13,
    category: "Lives of the Auliya",
    question:
      "Who was the direct Pir-o-Murshid of Sultan-ul-Deccan Khwaja Banda Nawaz Sayyid Muhammad Husayni Gesu Daraz (رحمة الله عليه) in Delhi before Banda Nawaz journeyed to Gulbarga Sharif in 803 AH?",
    options: [
      "Khwaja Nasiruddin Mahmud Chiragh Dehlavi",
      "Shaykh Burhanuddin Gharib of Khuldabad",
      "Hazrat Amir Khusrau Dehlavi",
      "Shaykh Nizamuddin Aurangabadi",
    ],
    correctIdx: 0,
    isharaHint:
      "Known as 'The Lamp of Delhi' (d. 757 AH), he was the chief Khalifa of Mahboob-e-Ilahi Hazrat Nizamuddin Auliya.",
    communityPoll: [66, 13, 12, 9],
    proofExplanation:
      "Khwaja Banda Nawaz Gesu Daraz (721–825 AH) took Bay'at in 736 AH with Khwaja Nasiruddin Mahmud Chiragh Dehlavi (d. 757 AH), carrying the Chishti torch from Delhi to Gulbarga Sharif where Jawami' al-Kalim recorded his discourses.",
    proofLink: "/auliya",
    proofLinkLabel: "Open Khwaja Banda Nawaz Profile",
  },
  {
    id: "q-t13-08",
    tier: 13,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi family law, what is the minimum valid Shar'i Mahr, and how are 'Mahr Mu'ajjal', 'Mahr Muwajjal', and 'Mahr al-Mithl' defined?",
    options: [
      "Minimum Mahr is 3 Dirhams; Mu'ajjal is deferred until death while Mahr al-Mithl is benchmarked on her maternal aunts",
      "Minimum Mahr is 10 Dirhams of silver (~30.618g); Mu'ajjal is prompt, Muwajjal is deferred to an agreed term/dissolution, and Mahr al-Mithl is benchmarked on female peers of her father's family",
      "Hanafi law sets no minimum Mahr; Mu'ajjal is optional charity and Mahr al-Mithl equals 200 Dirhams in all cases",
      "Minimum Mahr is 7.5 tola of gold; Muwajjal is payable before the Nikah sermon",
    ],
    correctIdx: 1,
    isharaHint:
      "Based on the Hadith 'La mahra aqalla min 'asharati darahim' (Sunan ad-Daraqutni & Bayhaqi); note the Arabic difference between 'Ayn (prompt) and Hamza/Waw (deferred).",
    communityPoll: [12, 63, 15, 10],
    proofExplanation:
      "Al-Hidayah and Bahar-e-Shariat (Part 7) fix the minimum Hanafi Mahr at 10 Dirhams of silver (2 tola 7.5 masha ≈ 30.618g), distinguish prompt Mu'ajjal from deferred Mu'ajjal/Muwajjal, and measure Mahr al-Mithl by her paternal female relatives.",
    proofLink: "/fiqh",
    proofLinkLabel: "Review Hanafi Mahr Rulings",
  },
  {
    id: "q-t13-09",
    tier: 13,
    category: "Aqaid & Seerah",
    question:
      "Which conciliatory Urdu treatise was penned in Makkah Mukarramah by the Chishti Sabiri master Haji Imdadullah Muhajir Makki (d. 1317 AH), upholding traditional Sunni practices such as Milad Sharif with Qiyam, Isal-e-Thawab (Fatihah), and Urs?",
    options: [
      "Faisla Haft Mas'ala",
      "Taqwiyat-ul-Iman",
      "Sirat-e-Mustaqim",
      "Majalis-ul-Abrar",
    ],
    correctIdx: 0,
    isharaHint:
      "Its title translates to 'Decision on the Seven Issues', in which the revered Murshid personally attested that he stood in Qiyam during Mawlid Sharif out of spiritual delight.",
    communityPoll: [67, 9, 12, 12],
    proofExplanation:
      "Hazrat Haji Imdadullah Muhajir Makki (1233–1317 AH) authored Faisla Haft Mas'ala in Makkah, defending traditional Sunni devotions—Milad with Qiyam, Fatihah/Isal-e-Thawab, and Urs—against harsh sectarian polemics.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Sunni Devotional Proofs",
  },
  {
    id: "q-t13-10",
    tier: 13,
    category: "Quran & Kanzul Iman",
    question:
      "Which Naqshbandi Mujaddidi jurist (d. 1225 AH), author of the popular fiqh manual 'Ma La Budda Minhu', compiled the ten-volume Arabic Sunni commentary 'At-Tafsir al-Mazhari' named after his Murshid Mirza Mazhar Jan-e-Janan?",
    options: [
      "Shah Abdul Aziz Muhaddith Dehlawi",
      "Shah Ghulam Ali Mujaddidi Dehlawi",
      "Qadi Thanaullah Panipati",
      "Allama Tajuddin al-Fakahani",
    ],
    correctIdx: 2,
    isharaHint:
      "Hailing from Panipat and trained in Hadith by Shah Waliullah and in Tasawwuf by Mirza Mazhar Jan-e-Janan Shahid, he blended Hanafi fiqh with Naqshbandi insights.",
    communityPoll: [15, 11, 64, 10],
    proofExplanation:
      "Qadi Thanaullah Usmani Panipati (d. 1225 AH / 1810 CE) authored At-Tafsir al-Mazhari across ten volumes, naming it in loving tribute to his spiritual master Shamsuddin Habibullah Mirza Mazhar Jan-e-Janan.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Hanafi Tafsir Works",
  },
  {
    id: "q-t13-11",
    tier: 13,
    category: "Lives of the Auliya",
    question:
      "Under which pioneering Naqshbandi master in Delhi (971–1012 AH) did Shaykh Ahmad Faruqi Sirhindi (Mujaddid Alf Thani) receive Bay'at and exalted Khilafah before spearheading spiritual renewal from Sirhind Sharif?",
    options: [
      "Khwaja Ubaydullah Ahrar of Samarkand",
      "Khwaja Muhammad Ma'sum Sirhindi",
      "Hazrat Shah Kalimullah Jahanabadi",
      "Khwaja Raziuddin Muhammad Baqi Billah",
    ],
    correctIdx: 3,
    isharaHint:
      "Born in Kabul and laid to rest in Delhi in 1012 AH at age forty, he introduced the Central Asian Naqshbandi order into Hindustan.",
    communityPoll: [12, 13, 8, 67],
    proofExplanation:
      "Khwaja Muhammad Baqi Billah (d. 1012 AH) initiated Shaykh Ahmad Sirhindi in Delhi in 1008 AH and swiftly recognized his extraordinary spiritual rank as Mujaddid Alf Thani.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Naqshbandi Spiritual Chain",
  },
  {
    id: "q-t13-12",
    tier: 13,
    category: "Hanafi Fiqh",
    question:
      "According to the relied-upon Fatwa position of Sahibayn in the Hanafi Madhhab (Al-Hidayah & Bahar-e-Shariat, Part 7), what nursing age window and quantity establish foster-kinship prohibition (Hurmat-e-Rada'at)?",
    options: [
      "Within two lunar years (24 months) per the Fatwa view (while Imam Abu Hanifa stated 30 months), and even a single swallow of milk reaching the infant's stomach suffices",
      "Within two lunar years, but only after five separate, fully satisfying suckling sessions",
      "Up to five full solar years, provided the infant is weaned solely on that nurse's milk",
      "Only during the first forty days after birth, requiring three consecutive days of nursing",
    ],
    correctIdx: 0,
    isharaHint:
      "Unlike the Shafi'i stipulation of five distinct sucklings, Hanafi law applies the absolute generality of Quran 4:23 ('wa ummahatukumul-lati arda'nakum').",
    communityPoll: [62, 19, 11, 8],
    proofExplanation:
      "Bahar-e-Shariat (Part 7) states that the Hanafi Fatwa follows Sahibayn's limit of two lunar years based on Surah Al-Baqarah 2:233 (with precautionary avoidance up to 2.5 years per Imam Abu Hanifa), and a single drop/swallow reaching the stomach establishes Rada'ah.",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Rada'ah Rules in Bahar-e-Shariat",
  },
  {
    id: "q-t13-13",
    tier: 13,
    category: "Aqaid & Seerah",
    question:
      "In his three-volume 'Maktubat-e-Imam Rabbani' (536 epistles), what doctrinal framework did Mujaddid Alf Thani Shaykh Ahmad Sirhindi articulate to safeguard orthodox Sunni creed from pantheistic misinterpretations?",
    options: [
      "Hulul wal-Ittihad (ontic fusion of Creator and creation)",
      "I'tizal al-'Aql (primacy of speculative reason over revelation)",
      "Irja' al-'Amal (detaching outward law completely from sainthood)",
      "Wahdat ash-Shuhud (Unity of Witnessing, affirming Creator-creation distinction and subordinating every mystical state to the Prophetic Shari'ah)",
    ],
    correctIdx: 3,
    isharaHint:
      "He emphasized that the highest station of nearness is 'Abdiyyah (perfected servanthood following the Sunnah), above transient ecstatic intoxication (Sukr).",
    communityPoll: [10, 11, 13, 66],
    proofExplanation:
      "Shaykh Ahmad Faruqi Sirhindi (971–1034 AH) formulated Wahdat ash-Shuhud across his three-volume Maktubat, establishing that spiritual unveiling must always be judged by the Quran, Sunnah, and consensus of Sunni theologians.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Maktubat-e-Imam Rabbani Legacy",
  },
  {
    id: "q-t13-14",
    tier: 13,
    category: "Quran & Kanzul Iman",
    question:
      "In Surah Al-Baqarah 2:275, how does Kanzul Iman render the foundational legal decree refuting those who claimed 'trade is just like usury (Riba)'?",
    options: [
      "And Allah permitted both trade and modest commercial interest by mutual consent",
      "And Allah has made trade lawful and has made usury unlawful ('Aur Allah ne halal kiya bai' ko aur haram kiya sood ko')",
      "And Allah restricted trade exclusively to barter of agricultural grain",
      "And Allah deferred the prohibition of usury solely to compound loans",
    ],
    correctIdx: 1,
    isharaHint:
      "This concise four-word Arabic clause ('wa ahallallahul-bay'a wa harramar-riba') anchors Kitab al-Buyu' across Islamic commercial jurisprudence.",
    communityPoll: [9, 68, 11, 12],
    proofExplanation:
      "Surah Al-Baqarah 2:275 ('Aur Allah ne halal kiya bai' ko aur haram kiya sood ko' in Kanzul Iman) draws an absolute Shar'i boundary between lawful risk-bearing commerce (Bay') and unlawful usurious increment (Riba).",
    proofLink: "/zakat",
    proofLinkLabel: "Explore Halal Wealth & Zakat Rules",
  },
  {
    id: "q-t13-15",
    tier: 13,
    category: "Lives of the Auliya",
    question:
      "Which Qadri-Chishti master of Punjab (1859–1937 CE), deeply versed in Ibn Arabi and Rumi, composed the beloved Punjabi Na'at couplet 'Kithe Mehr Ali Kithe Teri Sana, Gustakh Akhin Kithe Ja Ariyan'?",
    options: [
      "Hazrat Sultan Bahu of Jhang",
      "Hazrat Pir Sayyid Mehr Ali Shah of Golra Sharif",
      "Mian Muhammad Bakhsh of Khari Sharif",
      "Khwaja Ghulam Farid of Chachran Sharif",
    ],
    correctIdx: 1,
    isharaHint:
      "The poet's own blessed name appears inside the first hemistich, collected in his poetic diwan Mir'at al-'Irfan.",
    communityPoll: [12, 67, 11, 10],
    proofExplanation:
      "Pir Sayyid Mehr Ali Shah Golravi (رحمة الله عليه) composed 'Aj Sik Mitran Di Wadheri Ae' after beholding the Holy Prophet ﷺ, expressing profound humility at the threshold of Madinah Munawwarah.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Awliya Poetry & Malfuzat",
  },
  {
    id: "q-t13-16",
    tier: 13,
    category: "Hanafi Fiqh",
    question:
      "On whose juristic position is the binding Hanafi Fatwa issued in 'Kitab al-Waqf', rendering a charitable Waqf permanently irrevocable and transferring the property into 'the implied ownership of Allah' (Hukm Milkillah)?",
    options: [
      "Imam Zufar alone, requiring annual renewal by the state treasury",
      "Imam Abu Hanifa's initial view that non-mosque Waqf remains revocable unless tied to a bequest or judicial decree",
      "Sahibayn (Imam Abu Yusuf and Imam Muhammad), whose view of permanent irrevocability upon declaration/delivery is the enacted Fatwa of the Hanafi school",
      "Imam Malik's rule permitting temporary Waqf that reverts to the donor after one year",
    ],
    correctIdx: 2,
    isharaHint:
      "When Qadi Abu Yusuf accompanied Caliph Harun ar-Rashid to Madinah and witnessed the ancient endowments of the Sahabah alongside Umar's Khaybar Hadith, he declared Waqf binding by mere utterance.",
    communityPoll: [9, 17, 63, 11],
    proofExplanation:
      "Al-Hidayah, Radd al-Muhtar, and Bahar-e-Shariat (Part 10) affirm that the Hanafi Fatwa follows Sahibayn: once a valid Waqf is declared, the founder's ownership ceases forever ('la yuba'u wa la yuhabu wa la yurath') and its benefit belongs to Allah's servants.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Hanafi Waqf Jurisprudence",
  },
  {
    id: "q-t13-17",
    tier: 13,
    category: "Aqaid & Seerah",
    question:
      "Which Arabic magnum opus by Shah Waliullah Muhaddith Dehlawi (1703–1762 CE) expounds the inner wisdoms and moral philosophy of Shari'ah rulings ('Asrar ash-Shari'ah') alongside Hadith and Sunni theology?",
    options: [
      "Al-Insaf fi Bayan Asbab al-Ikhtilaf",
      "Hujjatullah al-Balighah",
      "Al-Qawl al-Jamil fi Bayan Sawa' as-Sabil",
      "Qurrat al-'Aynayn fi Tafdil ash-Shaykhayn",
    ],
    correctIdx: 1,
    isharaHint:
      "Its title derives from Surah Al-An'am 6:149 ('Qul fa-lillahil-hujjatul-balighah' — 'Say: With Allah alone rests the conclusive proof').",
    communityPoll: [12, 65, 11, 12],
    proofExplanation:
      "Shah Waliullah Dehlawi's Hujjatullah al-Balighah stands among the foremost Sunni works illuminating the rational, spiritual, and social wisdoms underlying Islamic creed, worship, and ethics.",
    proofLink: "/fiqh",
    proofLinkLabel: "Browse Hadith & Hikmat Classics",
  },
  {
    id: "q-t13-18",
    tier: 13,
    category: "Quran & Kanzul Iman",
    question:
      "Which Sunni scholar of Amethi (1047–1130 AH, tutor to Emperor Aurangzeb Alamgir and author of 'Nur al-Anwar') wrote 'At-Tafsirat al-Ahmadiyyah fi Bayan al-Ayat ash-Shar'iyyah' on the ~500 legal verses of the Quran?",
    options: [
      "Mulla Nizamuddin Muhammad Sihalvi",
      "Allama Muhibbullah Bihari",
      "Qadi Mubarak Gopamawi",
      "Mulla Ahmad Jiwan Amethawi",
    ],
    correctIdx: 3,
    isharaHint:
      "Possessed of legendary memory since childhood, he named 'At-Tafsirat al-Ahmadiyyah' after his own first name, Ahmad.",
    communityPoll: [14, 10, 11, 65],
    proofExplanation:
      "Shaykh Ahmad ibn Abi Sa'id, famous as Mulla Jiwan Amethawi (d. 1130 AH), authored both Nur al-Anwar (in Hanafi Usul) and At-Tafsirat al-Ahmadiyyah extracting Hanafi fiqh from the Ayat al-Ahkam.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Ayat al-Ahkam Scholarship",
  },
  {
    id: "q-t13-19",
    tier: 13,
    category: "Lives of the Auliya",
    question:
      "Which manual of Chishti Sabiri spiritual exercises—detailing Dhikr-e-Jahri, Pas-e-Anfas, and Muraqabah—was authored by Hazrat Haji Imdadullah Muhajir Makki (رحمة الله عليه)?",
    options: [
      "Kashf al-Mahjub",
      "Maktubat-e-Sadi",
      "Awarif al-Ma'arif",
      "Zia al-Qulub",
    ],
    correctIdx: 3,
    isharaHint:
      "Its title means 'Illumination of the Hearts', written originally in Persian as a practical guide for seekers across Chishti, Qadri, Naqshbandi, and Suhrawardi methods.",
    communityPoll: [10, 12, 12, 66],
    proofExplanation:
      "Hazrat Haji Imdadullah Muhajir Makki (d. 1317 AH, resting in Jannat al-Mu'alla, Makkah) penned Zia al-Qulub as a concise masterwork of Sunni Tasawwuf, spiritual purification, and meditative remembrance.",
    proofLink: "/tasbih",
    proofLinkLabel: "Practice Daily Dhikr & Muraqabah",
  },
  {
    id: "q-t13-20",
    tier: 13,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Mu'amalat (Al-Hidayah & Bahar-e-Shariat), what defines 'Mudarabah', and what are the two combined juristic causes ('Illah) of 'Riba al-Fadl' in commodity exchanges?",
    options: [
      "Mudarabah pairs one party's capital (Rabb al-Mal) with another's labor (Mudarib) for agreed profit percentages while non-negligent capital loss falls on the investor; Riba al-Fadl's Hanafi 'Illah is unity of genus (Jins) plus measurement by volume or weight (Qadr: Kayli or Wazni)",
      "Mudarabah guarantees a fixed monthly return regardless of profit; Riba al-Fadl's Hanafi 'Illah is edibility (Tu'm) alone",
      "Mudarabah requires equal capital from both partners; Riba al-Fadl applies to real estate and livestock sold by unit count",
      "Mudarabah makes the working manager liable for all market losses; Riba al-Fadl prohibits spot sale of wheat for barley in unequal amounts",
    ],
    correctIdx: 0,
    isharaHint:
      "Notice the classic difference between Hanafi and Shafi'i fiqh: Hanafis anchor Riba al-Fadl in Qadr (Kayl or Wazn) plus Jins, not edibility (Tu'm).",
    communityPoll: [61, 16, 11, 12],
    proofExplanation:
      "In Mukhtasar al-Quduri and Bahar-e-Shariat (Parts 11 & 13), Mudarabah shares profit by percentage (never a fixed sum) with capital risk on Rabb al-Mal, while Riba al-Fadl arises when both Qadr (volume/weight) and Jins unite.",
    proofLink: "/zakat",
    proofLinkLabel: "Review Hanafi Commercial & Wealth Rules",
  },

  // ============================================================================
  // TIER 14 — Kanzul Iman & Sunni Commentaries, Hanafi Usul & Seven Qira'at
  // ============================================================================
  {
    id: "q-t14-01",
    tier: 14,
    category: "Aqaid & Seerah",
    question:
      "Which pioneering Hadith master of Delhi (958–1052 AH) authored both the four-volume Persian Mishkat commentary 'Ashi'at-ul-Lama'at' and the classic Seerah encyclopedia 'Madarij-un-Nubuwwat'?",
    options: [
      "Shah Abdul Aziz Muhaddith Dehlawi",
      "Mulla Ali ibn Sultan Muhammad al-Qari",
      "Shaykh Abdul Haq Muhaddith Dehlavi",
      "Allama Abdur Rauf al-Munawi",
    ],
    correctIdx: 2,
    isharaHint:
      "Honored as 'Shaykh-ul-Muhaqqiqin', he studied Hadith and Qadri Tasawwuf in Makkah before returning to establish systematic Hadith teaching in Hindustan.",
    communityPoll: [13, 14, 62, 11],
    proofExplanation:
      "Hazrat Shaykh Abdul Haq Muhaddith Dehlavi Qadri (1551–1642 CE) authored Ashi'at-ul-Lama'at (Persian) and Lama'at at-Tanqih (Arabic) on Mishkat al-Masabih alongside Madarij-un-Nubuwwat in Prophetic biography.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Sunni Hadith Commentaries",
  },
  {
    id: "q-t14-02",
    tier: 14,
    category: "Quran & Kanzul Iman",
    question:
      "How does Ala Hazrat Imam Ahmad Raza Khan's 'Kanzul Iman' render Surah Ad-Duha 93:7 ('Wa wajadaka dallan fa-hada') in harmony with classical Sunni Tafsir to uphold Prophetic infallibility ('Ismah)?",
    options: [
      "And He found you wandering in the valleys of Makkah, so He pointed out the trail",
      "And He found you unacquainted with earlier chronicles, so He narrated history",
      "And He found you seeking mercantile trade in Syria, so He granted prosperity",
      "And He found you immersed in His Love, so He gave way unto Himself ('Aur tumhein apni mahabbat mein gum paya to apni taraf rah di')",
    ],
    correctIdx: 3,
    isharaHint:
      "Imam ar-Razi in Mafatih al-Ghayb and Shihab al-Khafaji explain this noble sense of intense, all-consuming Divine love—protecting the sanctity of Nubuwwat from literalist mistranslation.",
    communityPoll: [10, 12, 13, 65],
    proofExplanation:
      "Kanzul Iman translates Surah Ad-Duha 93:7 with exquisite theological precision ('Aur tumhein apni mahabbat mein gum paya to apni taraf rah di'), grounded in classical exegesis (Razi, Khafaji, and Khazain-ul-Irfan).",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Ad-Duha in Kanzul Iman",
  },
  {
    id: "q-t14-03",
    tier: 14,
    category: "Lives of the Auliya",
    question:
      "Where is the blessed resting sanctuary (Mazar Sharif) of Sadr-ush-Shariah Allama Mufti Amjad Ali Aazmi (1882–1948 CE), author of 'Bahar-e-Shariat', whose annual Urs is commemorated on 2 Dhu al-Qi'dah?",
    options: [
      "Bareilly Sharif, Uttar Pradesh",
      "Ghosi (Mau District), Uttar Pradesh",
      "Marehra Sharif (Etah District), Uttar Pradesh",
      "Muradabad, Uttar Pradesh",
    ],
    correctIdx: 1,
    isharaHint:
      "He breathed his last in Bombay while departing for Hajj in 1367 AH and was carried by train to his ancestral hometown in eastern Uttar Pradesh.",
    communityPoll: [16, 61, 12, 11],
    proofExplanation:
      "Sadr-ush-Shariah Badr-ut-Tariqah Mufti Amjad Ali Aazmi (رحمة الله عليه) passed away on 2 Dhu al-Qi'dah 1367 AH (1948 CE) and rests in his hometown of Ghosi, Mau District, Uttar Pradesh.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Razavi & Qadri Scholars",
  },
  {
    id: "q-t14-04",
    tier: 14,
    category: "Hanafi Fiqh",
    question:
      "How is the complete 20-part (Hissay) structure of 'Bahar-e-Shariat' organized between the authorship of Sadr-ush-Shariah Mufti Amjad Ali Aazmi and its completion after his passing?",
    options: [
      "Parts 1 to 10 were written by Ala Hazrat, and Parts 11 to 20 by Sadr-ush-Shariah",
      "All 20 parts were completed in 1911 CE before Kanzul Iman was penned",
      "Parts 1 to 5 cover Fiqh while Parts 6 to 20 consist solely of Arabic poetry",
      "Sadr-ush-Shariah personally authored Parts 1 through 17 (from Sunni Aqaid to Mu'amalat), and his senior disciples compiled Parts 18 through 20 (culminating in Kitab al-Fara'id) using his methodology",
    ],
    correctIdx: 3,
    isharaHint:
      "Bound typically into three comprehensive volumes, Part 1 establishes Aqaid, Parts 2–6 cover Ibadat, Parts 7–17 cover family/social/commercial law, and Parts 18–20 complete the remaining chapters up to Inheritance.",
    communityPoll: [11, 14, 15, 60],
    proofExplanation:
      "Sadr-ush-Shariah personally completed 17 parts of Bahar-e-Shariat before his Wisal in 1367 AH, and his qualified disciples faithfully compiled Parts 18–20 from authentic Hanafi Fatawa to fulfill his 20-part plan.",
    proofLink: "/fiqh",
    proofLinkLabel: "Browse Bahar-e-Shariat Structure",
  },
  {
    id: "q-t14-05",
    tier: 14,
    category: "Aqaid & Seerah",
    question:
      "Which eight-volume Urdu commentary on 'Mishkat al-Masabih' was authored by Hakim-ul-Ummat Mufti Ahmad Yar Khan Naeemi (1906–1971 CE), harmonizing Hadith proofs with Hanafi jurisprudence and Sunni Aqaid?",
    options: [
      "Mir'at-ul-Manajih Sharh Mishkat-ul-Masabih",
      "Mirqat al-Mafatih Sharh Mishkat al-Masabih",
      "Mazahir-e-Haq",
      "Fayd al-Qadir Sharh al-Jami' as-Saghir",
    ],
    correctIdx: 0,
    isharaHint:
      "Note the subtle title distinction: Mulla Ali al-Qari's Arabic commentary is 'Mirqat', whereas Mufti Ahmad Yar Khan Naeemi's Urdu commentary is 'Mir'at-ul-Manajih'.",
    communityPoll: [64, 12, 14, 10],
    proofExplanation:
      "Hakim-ul-Ummat Mufti Ahmad Yar Khan Naeemi (رحمة الله عليه)—author of Ja'a al-Haq and Noor-ul-Irfan—penned Mir'at-ul-Manajih in eight volumes as a comprehensive Urdu Sunni Hanafi exposition of Mishkat.",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Hadith & Fiqh Proofs",
  },
  {
    id: "q-t14-06",
    tier: 14,
    category: "Quran & Kanzul Iman",
    question:
      "Which canonical Qira'at transmission (Riwayah) is printed in the overwhelming majority of Mushafs across the Muslim world today, and who were its Kufan Imam and his two canonical transmitters (Rawis)?",
    options: [
      "Warsh 'an Nafi' of Madinah (transmitted via Warsh and Qalun)",
      "Hafs 'an 'Asim of Kufa (from Imam 'Asim ibn Abi an-Najud, whose two canonical Rawis are Hafs ibn Sulayman and Shu'bah ibn 'Ayyash)",
      "Al-Bazzi 'an Ibn Kathir of Makkah (transmitted via al-Bazzi and Qunbul)",
      "Ad-Duri 'an Abi 'Amr of Basra (transmitted via ad-Duri and as-Susi)",
    ],
    correctIdx: 1,
    isharaHint:
      "Imam 'Asim al-Kufi (d. 127 AH) learned Qira'at from Abu Abdur Rahman as-Sulami, who learned directly from Sayyiduna Ali and Sayyiduna Uthman (رضي الله عنهما), and also taught Imam Abu Hanifa.",
    communityPoll: [14, 65, 11, 10],
    proofExplanation:
      "Riwayat Hafs 'an 'Asim (transmitted by Hafs ibn Sulayman, d. 180 AH, alongside 'Asim's other canonical transmitter Shu'bah ibn 'Ayyash, d. 193 AH) carries an unbroken Mutawatir chain to the Holy Prophet ﷺ.",
    proofLink: "/quran",
    proofLinkLabel: "Open Mushaf & Kanzul Iman Audio",
  },
  {
    id: "q-t14-07",
    tier: 14,
    category: "Lives of the Auliya",
    question:
      "Which Qadri-Shadhili saint of Makkah Mukarramah (d. 1001 AH, successor of Shaykh Ali al-Muttaqi, compiler of 'Kanz al-'Ummal') trained Shaykh Abdul Haq Muhaddith Dehlavi in Hadith and Tasawwuf?",
    options: [
      "Hazrat Miyan Mir Qadri of Lahore",
      "Shaykh Ahmad al-Qushashi of Madinah",
      "Shaykh Abdul Wahhab al-Muttaqi",
      "Shaykh Tajuddin Sambhali",
    ],
    correctIdx: 2,
    isharaHint:
      "Shaykh Abdul Haq memorialized his blessed discourses and spiritual counsels in his biography Zad al-Muttaqin fi Suluk Tariq al-Yaqin.",
    communityPoll: [13, 14, 59, 14],
    proofExplanation:
      "Hazrat Shaykh Abdul Wahhab al-Muttaqi al-Makki (d. 1001 AH) nurtured Shaykh Abdul Haq Muhaddith Dehlavi in the Haram Sharif and directed him back to Delhi to spread Prophetic Hadith and orthodox Sunni spirituality.",
    proofLink: "/auliya",
    proofLinkLabel: "Trace Qadri Muhaddith Lineage",
  },
  {
    id: "q-t14-08",
    tier: 14,
    category: "Hanafi Fiqh",
    question:
      "How does Hanafi Usul al-Fiqh uniquely distinguish 'Fard' from 'Wajib' in terms of scriptural proof (Dalil) and theological consequence?",
    options: [
      "Fard is established solely by consensus, whereas Wajib is established solely by custom",
      "Fard is established by a definitive proof free of doubt in transmission and meaning (Dalil Qat'i) so denying it is Kufr, whereas Wajib is established by a preponderant probabilistic proof (Dalil Zanni) making it obligatory in action ('Amali) though denying it is misguidance rather than Kufr",
      "Fard and Wajib are complete synonyms in every chapter of Hanafi Usul",
      "Wajib carries greater reward than Fard, while omitting Fard requires no makeup (Qada)",
    ],
    correctIdx: 1,
    isharaHint:
      "Consider why Witr prayer, Sadaqat al-Fitr, and Udhiyah (Qurbani) are termed 'Fard 'Amali' (Wajib) in Nur al-Anwar and Bahar-e-Shariat.",
    communityPoll: [12, 63, 14, 11],
    proofExplanation:
      "Unlike the Shafi'i school where Fard and Wajib are largely synonymous, Hanafi Usul reserves Fard for Qat'i ath-Thubut wa Qat'i ad-Dalalah proofs and designates Zanni-established obligations (such as Witr) as Wajib.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Fard vs Wajib in Usul al-Fiqh",
  },
  {
    id: "q-t14-09",
    tier: 14,
    category: "Aqaid & Seerah",
    question:
      "Which Chishti scholar of Bhera Sharif (1918–1998 CE) authored both the five-volume Urdu Quran commentary 'Zia-ul-Quran' and the acclaimed seven-volume Seerah 'Zia-un-Nabi'?",
    options: [
      "Allama Abdul Mustafa Azami",
      "Allama Arshad-ul-Qadri",
      "Mufti Muhammad Waqaruddin Qadri",
      "Diya-ul-Ummat Justice Pir Muhammad Karam Shah al-Azhari",
    ],
    correctIdx: 3,
    isharaHint:
      "Educated at Al-Azhar University in Cairo and spiritual heir of the Chishti Sabiri/Nizami shrine at Bhera Sharif, both of his monumental works begin with the word 'Zia' (Light).",
    communityPoll: [12, 11, 13, 64],
    proofExplanation:
      "Justice Pir Muhammad Karam Shah al-Azhari (رحمة الله عليه) completed Tafsir Zia-ul-Quran in 5 volumes over nineteen years and Zia-un-Nabi in 7 volumes, blending classical Arabic sources with eloquent Urdu.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Sunni Tafsir & Seerah Works",
  },
  {
    id: "q-t14-10",
    tier: 14,
    category: "Quran & Kanzul Iman",
    question:
      "Who are the Seven Canonical Reciters ('Al-Qurra' as-Sab'ah') documented by Imam Ibn Mujahid (d. 324 AH) and versified in Imam ash-Shatibi's 'Hirz al-Amani (ash-Shatibiyyah)'?",
    options: [
      "Abu Ja'far, Ya'qub al-Hadrami, Khalaf al-Bazzar, Al-A'mash, Ibn Muhaysin, Al-Yazidi, and Hasan al-Basri",
      "Qalun, Warsh, Al-Bazzi, Qunbul, Hafs, Shu'bah, and As-Susi",
      "Nafi' (Madinah), Ibn Kathir (Makkah), Abu 'Amr (Basra), Ibn 'Amir (Damascus), and 'Asim, Hamzah, and al-Kisa'i (all three of Kufa)",
      "Ubayy ibn Ka'b, Abdullah ibn Mas'ud, Zayd ibn Thabit, Abu Musa al-Ash'ari, Mu'adh ibn Jabal, Abu ad-Darda, and Ibn Abbas",
    ],
    correctIdx: 2,
    isharaHint:
      "One represented Madinah, one Makkah, one Basra, one Damascus, and three hailed from Kufa (the last of whom, al-Kisa'i, also studied under Imam Abu Hanifa and Imam Muhammad).",
    communityPoll: [15, 9, 62, 14],
    proofExplanation:
      "The Seven Mutawatir Qurra' codified in ash-Shatibiyyah are Nafi' al-Madani, Ibn Kathir al-Makki, Abu 'Amr al-Basri, Ibn 'Amir ash-Shami, 'Asim al-Kufi, Hamzah az-Zayyat, and Ali ibn Hamzah al-Kisa'i (complemented by Abu Ja'far, Ya'qub, and Khalaf to complete the Ten).",
    proofLink: "/quran",
    proofLinkLabel: "Study Sciences of Canonical Qira'at",
  },
  {
    id: "q-t14-11",
    tier: 14,
    category: "Lives of the Auliya",
    question:
      "Which historic assembly was convened in Sha'ban 1343 AH (March 1925) at Muradabad by Sadr-ul-Afadil Allama Syed Naeemuddin Muradabadi—author of 'Khazain-ul-Irfan' and 'Kitab-ul-Aqaid'—to unite Sunni scholars nationwide?",
    options: [
      "The First All India Sunni Conference at Jamia Naeemia, Muradabad",
      "The Nadwatul Ulama Convocation at Lucknow",
      "The Majlis-e-Ahrar Session at Amritsar",
      "The Muhammadan Educational Conference at Aligarh",
    ],
    correctIdx: 0,
    isharaHint:
      "Attended by hundreds of leading Mashaykh and Muftis of Ahl-e-Sunnat at the seminary founded by Sadr-ul-Afadil himself.",
    communityPoll: [61, 14, 13, 12],
    proofExplanation:
      "Sadr-ul-Afadil Allama Syed Muhammad Naeemuddin Muradabadi (1887–1948 CE), premier Khalifa of Ala Hazrat and exegete of Khazain-ul-Irfan, convened the First All India Sunni Conference at Muradabad in 1925.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Sadr-ul-Afadil Biography",
  },
  {
    id: "q-t14-12",
    tier: 14,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Usul al-Fiqh (Al-Mabsut of as-Sarakhsi & Usul al-Bazdawi), what is the true juristic meaning of 'Istihsan' (juristic preference)?",
    options: [
      "Setting aside scriptural evidence whenever personal taste prefers convenience",
      "Adopting rulings randomly from any school without examining legal causes",
      "Setting aside an apparent analogy (Qiyas Jali) in favor of a stronger, subtler analogy (Qiyas Khafi), or excepting an issue from general analogy due to a specific scriptural text (Nass), Ijma' (e.g., Istisna'), or necessity (Darurah)",
      "Replacing Mutawatir Hadiths with poetic proverbs in commercial disputes",
    ],
    correctIdx: 2,
    isharaHint:
      "Imam as-Sarakhsi explains that Istihsan is actually 'acting upon the stronger of two Shar'i proofs'—such as upholding Salam and Istisna' contracts or ruling that forgetful eating does not break a fast.",
    communityPoll: [11, 13, 60, 16],
    proofExplanation:
      "In Hanafi Usul, Istihsan is never unguided opinion; it denotes preferring a stronger proof (Athari text, Ijma', Darurah, or Qiyas Khafi with stronger legal effect) over mechanical Qiyas Jali.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Istihsan in Hanafi Usul",
  },
  {
    id: "q-t14-13",
    tier: 14,
    category: "Aqaid & Seerah",
    question:
      "Which prolific contemporary Sunni Hadith master of Karachi (1937–2016 CE) authored the 12-volume 'Tibyan-ul-Quran' alongside the 7-volume 'Sharh Sahih Muslim' and 16-volume 'Ni'mat al-Bari fi Sharh Sahih al-Bukhari'?",
    options: [
      "Ghazali-e-Zaman Allama Syed Ahmad Saeed Kazmi",
      "Shaykh-ul-Hadith Allama Ghulam Rasool Saeedi",
      "Sharih-e-Bukhari Mufti Sharif-ul-Haq Amjadi",
      "Allama Faiz Ahmad Owaisi",
    ],
    correctIdx: 1,
    isharaHint:
      "Serving for decades as Shaykh-ul-Hadith at Darul Uloom Naeemia in Karachi, he produced over forty volumes of fully cited Urdu Tafsir and Sahihayn commentary.",
    communityPoll: [14, 62, 13, 11],
    proofExplanation:
      "Allama Ghulam Rasool Saeedi (رحمة الله عليه) enriched modern Sunni scholarship with Tibyan-ul-Quran (12 vols), Sharh Sahih Muslim (7 vols), and Ni'mat al-Bari (16 vols), citing classical Hadith and Hanafi authorities exhaustively.",
    proofLink: "/quran",
    proofLinkLabel: "Browse Tibyan-ul-Quran & Hadith",
  },
  {
    id: "q-t14-14",
    tier: 14,
    category: "Quran & Kanzul Iman",
    question:
      "How does Hakim-ul-Ummat Mufti Ahmad Yar Khan Naeemi's concise 'Noor-ul-Irfan' differ in scope from his encyclopedic 'Tafsir Naeemi'?",
    options: [
      "Noor-ul-Irfan covers all 30 Paras as a complete marginal Tafsir on Kanzul Iman, whereas Mufti Ahmad Yar Khan Naeemi personally completed the first 11 volumes (11 Paras) of the expansive Tafsir Naeemi before his Wisal in 1391 AH",
      "Noor-ul-Irfan covers only Para 30, whereas Tafsir Naeemi covers only Surah Al-Baqarah",
      "Noor-ul-Irfan was written in Arabic, whereas Tafsir Naeemi was written in Persian",
      "Both works are identical one-volume glossaries without juristic or spiritual notes",
    ],
    correctIdx: 0,
    isharaHint:
      "He passed away on 3 Ramadan 1391 AH (1971 CE) in Gujrat after reaching the eleventh Para in Tafsir Naeemi, which his scholarly successors later continued.",
    communityPoll: [58, 13, 15, 14],
    proofExplanation:
      "Mufti Ahmad Yar Khan Naeemi authored Hashiyah Noor-ul-Irfan across the entire 30 Paras of Kanzul Iman and completed 11 rich volumes (Paras 1–11) of Tafsir Naeemi during his lifetime.",
    proofLink: "/quran",
    proofLinkLabel: "Open Kanzul Iman & Noor-ul-Irfan",
  },
  {
    id: "q-t14-15",
    tier: 14,
    category: "Lives of the Auliya",
    question:
      "Which Qadri Barkati saint of Marehra Sharif (1209–1296 AH) initiated Ala Hazrat Imam Ahmad Raza Khan in 1294 AH and immediately bestowed full Khilafah and Ijazah upon him at first sight?",
    options: [
      "Sultan-ul-Ashiqin Sayyid Shah Barakatullah Marehravi",
      "Taj-ul-Ulama Sayyid Shah Awlad-e-Rasool Muhammad Miyan",
      "Sayyid Shah Aale Ahmad Achhe Miyan",
      "Khatam al-Akabir Sayyid Shah Aale Rasool Marehravi",
    ],
    correctIdx: 3,
    isharaHint:
      "When the 22-year-old Imam Ahmad Raza arrived with his father Maulana Naqi Ali Khan, the revered Shaykh remarked that he had been waiting to present this trust before Allah.",
    communityPoll: [14, 13, 12, 61],
    proofExplanation:
      "Hazrat Sayyid Shah Aale Rasool Ahmad Marehravi (d. 18 Dhu al-Hijjah 1296 AH) conferred Bay'at and comprehensive Qadri Barkati Khilafah upon Ala Hazrat on his very first day in Marehra Sharif.",
    proofLink: "/auliya",
    proofLinkLabel: "View Barkatiyyah Qadri Shajrah",
  },
  {
    id: "q-t14-16",
    tier: 14,
    category: "Hanafi Fiqh",
    question:
      "Which classical Hanafi maxim in Ibn Nujaym's 'Al-Ashbah wan-Naza'ir' and Ibn Abidin's 'Nashr al-'Urf' defines the binding legal force of sound custom ('Urf Sahih) when it contravenes no Shar'i text?",
    options: [
      "'Al-'Adatu Muhakkamah' and 'Al-Ma'rufu 'Urfan kal-Mashruti Shartan' (Custom is an arbiter, and what is established by sound custom is like an explicitly stipulated condition)",
      "'Al-'Urfu Yansakhul-Kitab' (Custom abrogates explicit Quranic prohibitions)",
      "'La Hujjata lil-'Urf fi al-Mu'amalat' (Custom carries no weight in contracts or currency)",
      "'Al-'Adatu Tuqaddamu 'ala an-Nass al-Qat'i' (Custom overrides definitive revelation)",
    ],
    correctIdx: 0,
    isharaHint:
      "Only 'Urf Sahih (custom compatible with Shari'ah) is recognized; any 'Urf Fasid (such as usury or unlawful rituals) is rejected outright.",
    communityPoll: [63, 11, 14, 12],
    proofExplanation:
      "Ibn Nujaym and Ibn Abidin demonstrate that in matters left unspecified by text—such as currency usage, market delivery norms, and dowry payment customs—sound 'Urf serves as a decisive legal arbiter.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Qawa'id Fiqhiyyah Maxims",
  },
  {
    id: "q-t14-17",
    tier: 14,
    category: "Aqaid & Seerah",
    question:
      "Why did Sadr-ush-Shariah Mufti Amjad Ali Aazmi dedicate the entire first part (Hissa Awwal) of 'Bahar-e-Shariat' to 'Aqaid-e-Sahiha' before commencing Taharah and Salah in Part 2?",
    options: [
      "Because orthodox Sunni creed (Iman & Aqaid) is the foundational precondition (Asl/Shart) without which outward acts of worship hold no validity or acceptance in the Hereafter",
      "Because Part 1 was translated from an unrelated history book after his passing",
      "Because Hanafi fiqh considers ritual purity optional for theologians",
      "Because Aqaid rulings vary from city to city based on local custom",
    ],
    correctIdx: 0,
    isharaHint:
      "Just as Salah is invalid without Taharah, all righteous deeds depend upon pure Iman aligned with Ahl-e-Sunnat wal-Jama'at.",
    communityPoll: [65, 11, 12, 12],
    proofExplanation:
      "Bahar-e-Shariat (Part 1) opens by summarizing pure Sunni creed on Allah, Prophethood, Sahabah, Awliya, and Eschatology so every believer rectifies Iman first before learning branch rulings (Furu').",
    proofLink: "/fiqh",
    proofLinkLabel: "Open Bahar-e-Shariat Part 1",
  },
  {
    id: "q-t14-18",
    tier: 14,
    category: "Quran & Kanzul Iman",
    question:
      "Which canonical Mutawatir Qira'at transmission from Imam Nafi' al-Madani (d. 169 AH) serves as the standard recited Mushaf across Morocco, Algeria, Mauritania, and West Africa, alongside 'Qalun 'an Nafi'' in Libya?",
    options: [
      "As-Susi 'an Abi 'Amr al-Basri",
      "Qunbul 'an Ibn Kathir al-Makki",
      "Khalaf 'an Hamzah al-Kufi",
      "Warsh 'an Nafi' al-Madani",
    ],
    correctIdx: 3,
    isharaHint:
      "Transmitted by Uthman ibn Sa'id al-Misri (d. 197 AH), whom his teacher Imam Nafi' in Madinah nicknamed 'Warsh' because of his radiant complexion.",
    communityPoll: [14, 13, 14, 59],
    proofExplanation:
      "Riwayat Warsh 'an Nafi' and Riwayat Qalun 'an Nafi' preserve the Mutawatir Madinan recitation taught by Imam Nafi' ibn Abdur Rahman in Masjid an-Nabawi and remain standard across the Maghrib.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Global Mutawatir Qira'at",
  },
  {
    id: "q-t14-19",
    tier: 14,
    category: "Lives of the Auliya",
    question:
      "Which authoritative Persian biographical compendium of over 250 Sufi saints of Hindustan (from Khwaja Gharib Nawaz to the 10th Hijri century) was authored by Shaykh Abdul Haq Muhaddith Dehlavi?",
    options: [
      "Siyar al-Auliya",
      "Akhbar al-Akhyar fi Asrar al-Abrar",
      "Safinat al-Auliya",
      "Mir'at al-Asrar",
    ],
    correctIdx: 1,
    isharaHint:
      "Prized by historians and Hadith scholars alike for its critical rigor; whereas 'Siyar al-Auliya' was written centuries earlier by Mir Khwurd on early Chishti masters.",
    communityPoll: [16, 60, 12, 12],
    proofExplanation:
      "Akhbar al-Akhyar fi Asrar al-Abrar by Shaykh Abdul Haq Muhaddith Dehlavi (d. 1052 AH) stands as the most reliable classical Tazkirah of Qadri, Chishti, Suhrawardi, and Shattari saints of South Asia.",
    proofLink: "/auliya",
    proofLinkLabel: "Browse Auliya Tazkirah Directory",
  },
  {
    id: "q-t14-20",
    tier: 14,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Usul al-Fiqh (Nur al-Anwar & at-Talwih), what are the four pillars (Arkan) of a valid 'Qiyas', and what epistemic rank does explicit 'Ijma' as-Sahabah' (unanimous consensus of the Companions) hold?",
    options: [
      "Two pillars (Text and Opinion); Ijma' as-Sahabah is merely advisory",
      "Three pillars (Narrator, Judge, and Custom); Ijma' yields weak conjecture",
      "Four pillars: Asl (root case), Far' (branch case), Hukm al-Asl (original ruling), and 'Illah (shared effective cause); explicit Ijma' as-Sahabah is a definitive proof (Hujjah Qat'iyyah) imparting certainty like a decisive text",
      "Five pillars including state decree; Ijma' is restricted solely to residents of Kufa",
    ],
    correctIdx: 2,
    isharaHint:
      "In Mulla Jiwan's Nur al-Anwar, the supreme tier of Ijma' is unanimous explicit agreement of the Companions, denying which is unlawful just like denying a decisive text.",
    communityPoll: [13, 14, 58, 15],
    proofExplanation:
      "Hanafi Usul defines Qiyas via Asl, Far', Hukm al-Asl, and 'Illah Mushtarakah, while ranking explicit Ijma' of the Sahabah as a Qat'i proof (and also recognizing tacit consensus, Ijma' Sukuti, as valid proof).",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Ijma' & Qiyas in Hanafi Usul",
  },

  // ============================================================================
  // TIER 15 — Grand Crown Sahib-e-Ilm Mastery
  // ============================================================================
  {
    id: "q-t15-01",
    tier: 15,
    category: "Aqaid & Seerah",
    question:
      "During Ala Hazrat's second Hajj in 1323–1324 AH (1905–1906 CE), under what celebrated title were the thirty-three signed endorsements (Taqrizat) of the senior Sunni Muftis and Ulama of Makkah and Madinah on his treatise 'Al-Mu'tamad al-Mustanad' published?",
    options: [
      "Ad-Dawlah al-Makkiyyah bil-Maddah al-Ghaybiyyah",
      "Husam al-Haramayn 'ala Manhar al-Kufr wal-Mayn",
      "Subhan as-Subbuh 'an 'Ayb Kadhib Maqbuh",
      "Al-Amn wal-'Ula li-Na'iti al-Mustafa",
    ],
    correctIdx: 1,
    isharaHint:
      "Its Arabic title means 'The Sword of the Two Sanctuaries', compiling twenty scholarly verifications from Makkah Mukarramah and thirteen from Madinah Munawwarah.",
    communityPoll: [16, 61, 12, 11],
    proofExplanation:
      "Husam al-Haramayn (1324 AH / 1906 CE) preserves the signed endorsements of thirty-three Haramayn scholars—including Shaykh Muhammad Sa'id Babusayl and Shaykh Salih Kamal—upholding the sacred honor of Allah and His Beloved Messenger ﷺ.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Ala Hazrat's Haramayn Works",
  },
  {
    id: "q-t15-02",
    tier: 15,
    category: "Quran & Kanzul Iman",
    question:
      "Which encyclopedic 80-chapter (80 Naw') masterwork on the Sciences of the Quran—synthesizing Asbab an-Nuzul, Qira'at, Nasikh wal-Mansukh, I'jaz, and Tafsir methodology—was authored by Imam Jalaluddin as-Suyuti (d. 911 AH)?",
    options: [
      "Al-Burhan fi 'Ulum al-Quran",
      "Manahil al-'Irfan fi 'Ulum al-Quran",
      "At-Tahbir fi 'Ilm at-Tafsir",
      "Al-Itqan fi 'Ulum al-Quran",
    ],
    correctIdx: 3,
    isharaHint:
      "Imam az-Zarkashi earlier wrote 'Al-Burhan' in 47 chapters, and Imam as-Suyuti first wrote the shorter 'At-Tahbir' before crowning the field with this 80-discipline classic.",
    communityPoll: [16, 12, 13, 59],
    proofExplanation:
      "Hafiz Jalaluddin as-Suyuti (849–911 AH) authored Al-Itqan fi 'Ulum al-Quran across eighty comprehensive chapters, serving as the definitive reference on Quranic sciences for five centuries.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Ulum al-Quran Encyclopedia",
  },
  {
    id: "q-t15-03",
    tier: 15,
    category: "Lives of the Auliya",
    question:
      "Which acclaimed poetic diwan of Ala Hazrat Imam Ahmad Raza Khan contains the 171-couplet 'Mustafa Jan-e-Rahmat Pe Lakhon Salam' alongside 'Lam Ya'ti Naziruka fi Nazarin', and which four languages appear in his devotional verse?",
    options: [
      "Saman-e-Bakhshish; composed solely in Urdu and Persian",
      "Zauq-e-Na'at; composed in Urdu and Turkish",
      "Hadaiq-e-Bakhshish; featuring compositions across Urdu, Arabic, Persian, and Hindi/Braj idioms",
      "Qabala-e-Bakhshish; composed exclusively in classical Persian",
    ],
    correctIdx: 2,
    isharaHint:
      "Note the classic poem 'Lam Ya'ti Naziruka fi Nazarin' itself seamlessly weaves four languages across its couplets; 'Saman-e-Bakhshish' is by Mufti-e-Azam Hind and 'Zauq-e-Na'at' by Maulana Hasan Raza Khan.",
    communityPoll: [12, 15, 62, 11],
    proofExplanation:
      "Hadaiq-e-Bakhshish ('Gardens of Salvation') gathers Ala Hazrat's sublime Na'at, Salaam-e-Razavi, and Manqabat in Urdu, Arabic, Persian, and Hindi idioms, marrying strict Shari'ah precision with ardent love of the Prophet ﷺ.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Hadaiq-e-Bakhshish & Salaam",
  },
  {
    id: "q-t15-04",
    tier: 15,
    category: "Hanafi Fiqh",
    question:
      "Allama Ibn Abidin ash-Shami's 'Radd al-Muhtar' (Fatawa Shami)—upon which Ala Hazrat penned his critical Arabic super-gloss 'Jadd al-Mumtar'—is written directly as a Hashiyah on which commentary and root matn?",
    options: [
      "'Ad-Durr al-Mukhtar' by Allama Ala'uddin al-Haskafi (d. 1088 AH), which itself comments upon 'Tanwir al-Absar' by Shaykh Shamsuddin at-Timurtashi (d. 1004 AH)",
      "'Fath al-Qadir' by Kamaluddin ibn al-Humam on al-Marghinani's 'Al-Hidayah'",
      "'Al-Bahr ar-Ra'iq' by Zaynuddin Ibn Nujaym on an-Nasafi's 'Kanz ad-Daqa'iq'",
      "'Maraqi al-Falah' by Hasan ash-Shurunbulali on his own 'Nur al-Idah'",
    ],
    correctIdx: 0,
    isharaHint:
      "Remember the famous four-tier late Hanafi chain: Timurtashi (Tanwir al-Absar) → Haskafi (Durr al-Mukhtar) → Ibn Abidin (Radd al-Muhtar) → Imam Ahmad Raza (Jadd al-Mumtar).",
    communityPoll: [57, 15, 16, 12],
    proofExplanation:
      "Khatimat al-Muhaqqiqin Allama Sayyid Muhammad Amin Ibn Abidin (1198–1252 AH) authored Radd al-Muhtar 'ala ad-Durr al-Mukhtar (on at-Timurtashi's Tanwir al-Absar), the supreme arbiter of late Hanafi Fatwa.",
    proofLink: "/fiqh",
    proofLinkLabel: "Inspect Late Hanafi Fatwa Chain",
  },
  {
    id: "q-t15-05",
    tier: 15,
    category: "Aqaid & Seerah",
    question:
      "In Jami' at-Tirmidhi (#3578, graded Hasan Sahih), Sunan Ibn Majah (#1385), and at-Tabarani's Mu'jam (graded Sahih), which Companion narrated the blind man's cure through the Prophetic Du'a of Tawassul ('Allahumma inni as'aluka wa atawajjahu ilayka bi-Nabiyyika Muhammadin Nabiyyir-Rahmah, Ya Muhammadu inni tawajjahtu bika ila Rabbi...')?",
    options: [
      "Sayyiduna Abu Hurayrah (رضي الله عنه)",
      "Sayyiduna Jabir ibn Abdullah (رضي الله عنه)",
      "Sayyiduna Uthman ibn Hunayf (رضي الله عنه)",
      "Sayyiduna Mu'adh ibn Jabal (رضي الله عنه)",
    ],
    correctIdx: 2,
    isharaHint:
      "Imam at-Tabarani in Al-Mu'jam as-Saghir & al-Kabir also records with a Sahih chain that this same Ansar Companion taught this exact Du'a to a petitioner during the Caliphate of Sayyiduna Uthman ibn Affan (رضي الله عنه).",
    communityPoll: [14, 15, 58, 13],
    proofExplanation:
      "Sayyiduna Uthman ibn Hunayf (رضي الله عنه) narrated this authentic Hadith in Tirmidhi (#3578), Ibn Majah (#1385), Mustadrak al-Hakim, and Tabarani, forming an unshakeable Sunni proof for Tawassul and Nida ('Ya Muhammad').",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Classical Tawassul Proofs",
  },
  {
    id: "q-t15-06",
    tier: 15,
    category: "Quran & Kanzul Iman",
    question:
      "In Surah Al-Ahzab 33:40 ('Walakin Rasulallahi wa Khatam an-Nabiyyin'), how do the canonical Qira'at readings 'Khatim' (with Kasrah by six Qurra') and 'Khatam' (with Fathah by Imam 'Asim) establish Khatm-e-Nubuwwat according to classical Tafsir and Ala Hazrat's 'Al-Mubin'?",
    options: [
      "Both Mutawatir readings conclusively signify 'the Seal and Absolute Last of the Prophets'—with whom the series of Prophets is forever closed—refuting any distortion that leaves room for a subsequent prophet",
      "Only the Fathah reading is Mutawatir, whereas the Kasrah reading is irregular",
      "'Khatam' permits non-law-bearing ('zilli' or 'buruzi') prophets after the revelation of the Quran",
      "The verse applied exclusively to adopted sons in Madinah without doctrinal generality",
    ],
    correctIdx: 0,
    isharaHint:
      "Whether read with Fathah ('the seal stamped at the end of a vessel/document so nothing enters after') or Kasrah ('the one who seals and concludes them'), Arabic lexicons like Lisan al-'Arab equate both to 'Akhiruhum'.",
    communityPoll: [60, 14, 14, 12],
    proofExplanation:
      "Imam Ibn Kathir, Qadi Iyad, Allama al-Alusi (Ruh al-Ma'ani), and Ala Hazrat affirm that Quran 33:40 in both canonical readings decisively proves that no prophet of any kind can ever arise after Sayyiduna Muhammad ﷺ.",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Al-Ahzab 33:40 Tafsir",
  },
  {
    id: "q-t15-07",
    tier: 15,
    category: "Lives of the Auliya",
    question:
      "Under which renowned Naqshbandi Mujaddidi master in Damascus did Allama Sayyid Muhammad Amin Ibn Abidin ash-Shami (author of 'Radd al-Muhtar', d. 1252 AH) take spiritual Bay'at and compose 'Sall al-Husam al-Hindi' in his defense?",
    options: [
      "Shaykh Abd al-Ghani an-Nabulusi",
      "Shaykh Bahauddin Naqshband Bukhari",
      "Shaykh Ahmad Ziyauddin Gumushkhanawi",
      "Mawlana Diya'uddin Khalid al-Baghdadi ash-Shahrazuri",
    ],
    correctIdx: 3,
    isharaHint:
      "Trained in Delhi under Shah Ghulam Ali Dehlawi before illuminating Baghdad and Damascus (d. 1242 AH), he founded the Khalidi branch of the Naqshbandi order.",
    communityPoll: [17, 14, 13, 56],
    proofExplanation:
      "Allama Ibn Abidin ash-Shami was a devoted disciple of Mawlana Khalid al-Baghdadi an-Naqshbandi (d. 1242 AH), exemplifying the classical Sunni unity of rigorous Hanafi Fiqh and orthodox Tasawwuf.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Naqshbandi & Hanafi Masters",
  },
  {
    id: "q-t15-08",
    tier: 15,
    category: "Hanafi Fiqh",
    question:
      "Compiled c. 1075–1083 AH by a syndicate of over forty eminent Hanafi jurists led by Shaykh Nizam Burhanpuri under Emperor Aurangzeb Alamgir, what characterizes 'Al-Fatawa al-Hindiyyah' (Fatawa-e-Alamgiri)?",
    options: [
      "It blends rulings from all four Sunni Madhhabs into an eclectic state code",
      "It systematically codifies relied-upon Zahir ar-Riwayah and authoritative Hanafi Fatwa rulings verbatim from authenticated classical texts across every chapter of law",
      "It was composed in rhymed Persian couplets without citing earlier legal sources",
      "It restricts its scope solely to criminal penalties and land revenue",
    ],
    correctIdx: 1,
    isharaHint:
      "Outside the Subcontinent (in Egypt, Sham, and Hijaz) it was printed alongside Fatawa Qadikhan under the title 'Al-Fatawa al-Hindiyyah fi Madhhab al-Imam al-A'zam Abi Hanifa an-Nu'man'.",
    communityPoll: [13, 59, 14, 14],
    proofExplanation:
      "Fatawa-e-Alamgiri (Al-Fatawa al-Hindiyyah) stands alongside Radd al-Muhtar and Fatawa-e-Razawiyya as one of the most trusted, source-verified encyclopedias of pure Hanafi jurisprudence.",
    proofLink: "/fiqh",
    proofLinkLabel: "Browse Fatawa-e-Alamgiri & Classics",
  },
  {
    id: "q-t15-09",
    tier: 15,
    category: "Aqaid & Seerah",
    question:
      "According to Mutawatir Hadiths in Sahih al-Bukhari (#4712) and Sahih Muslim (#193), what is 'ash-Shafa'ah al-'Uzma' (The Greatest Intercession) corresponding to 'al-Maqam al-Mahmud' in Surah Al-Isra 17:79?",
    options: [
      "When humanity stands in distress on the Plain of Mahshar and turns successively to Adam, Nuh, Ibrahim, Musa, and Isa (عليهم السلام)—each directing them onward—until Sayyiduna Muhammad ﷺ declares 'Ana laha' ('I am appointed for it'), prostrates beneath the Throne, and is told: 'O Muhammad, raise your head; ask and you shall be given, intercede and your intercession shall be accepted'",
      "An intercession shared identically by every martyr and scholar before resurrection",
      "Exemption of earlier nations from gathering on the Day of Judgment",
      "Intercession restricted solely to elevating ranks inside Paradise after Reckoning",
    ],
    correctIdx: 0,
    isharaHint:
      "Every time we recite the Sunnah Du'a after the Azan ('wab'ath-hu Maqaman Mahmudanilladhi wa'adtah'), we ask Allah to manifest this supreme universal station of the Beloved ﷺ.",
    communityPoll: [63, 12, 13, 12],
    proofExplanation:
      "Sahih al-Bukhari and Sahih Muslim establish ash-Shafa'ah al-'Uzma as the exclusive Maqam Mahmud of the Holy Prophet ﷺ, praised by all first and last generations when he initiates relief on Judgment Day.",
    proofLink: "/prayer",
    proofLinkLabel: "Review Post-Azan Du'a & Maqam Mahmud",
  },
  {
    id: "q-t15-10",
    tier: 15,
    category: "Quran & Kanzul Iman",
    question:
      "In 'Ilm al-Fara'id' (Islamic Inheritance Law), which exact six fractional fixed shares ('al-Furud al-Muqaddarah') are explicitly stipulated in Surah An-Nisa 4:11–12?",
    options: [
      "1/2, 1/3, 1/5, 1/7, 1/9, and 1/10",
      "1/2, 1/4, 3/4, 1/5, 2/5, and 1/12",
      "1/2 (Nisf), 1/4 (Rub'), 1/8 (Thumun), 2/3 (Thuluthan), 1/3 (Thuluth), and 1/6 (Sudus)",
      "1/3, 2/3, 1/4, 3/8, 1/6, and 5/6",
    ],
    correctIdx: 2,
    isharaHint:
      "In Sirajuddin as-Sajawandi's 'As-Sirajiyyah', scholars memorize them by two halving progressions: 'One-half, its half, and half of its half; two-thirds, its half, and half of its half'.",
    communityPoll: [12, 15, 58, 15],
    proofExplanation:
      "Surah An-Nisa 4:11–12 explicitly reveals the six fixed Quranic inheritance shares—1/2, 1/4, 1/8, 2/3, 1/3, and 1/6—expounded in As-Sirajiyyah and Bahar-e-Shariat Part 20.",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Ilm al-Fara'id (Mirath)",
  },
  {
    id: "q-t15-11",
    tier: 15,
    category: "Lives of the Auliya",
    question:
      "Which 9th-century Hijri polymath and Shadhili Sufi of Cairo (849–911 AH), widely revered as the Mujaddid of the 9th Islamic century, authored over 500 works including 'Al-Khasa'is al-Kubra' and 'Al-Hawi lil-Fatawi' (containing 'Husn al-Maqsid fi 'Amal al-Mawlid')?",
    options: [
      "Imam Shihabuddin Ibn Hajar al-Haytami",
      "Imam Jalaluddin Abdur Rahman as-Suyuti",
      "Imam Shamsuddin as-Sakhawi",
      "Shaykh al-Islam Zakariyya al-Ansari",
    ],
    correctIdx: 1,
    isharaHint:
      "Born in Cairo to a scholarly family from Asyut, he combined mastery of Hadith, Tafsir, and Fiqh with profound Prophetic devotion and spiritual unveiling.",
    communityPoll: [15, 60, 13, 12],
    proofExplanation:
      "Imam Jalaluddin as-Suyuti (d. 911 AH) authored Al-Khasa'is al-Kubra on Prophetic miracles and Al-Hawi lil-Fatawi affirming the merit of celebrating Mawlid an-Nabi ﷺ with gratitude, charity, and recitation.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Mujaddidun & Mawlid Proofs",
  },
  {
    id: "q-t15-12",
    tier: 15,
    category: "Hanafi Fiqh",
    question:
      "In 'Al-Ashbah wan-Naza'ir', Allama Zaynuddin Ibn Nujaym al-Misri (d. 970 AH) anchors Islamic law upon universal legal maxims. Which set accurately states the five universal 'Al-Qawa'id al-Khams al-Kubra' included in his first section?",
    options: [
      "Taharah, Salah, Zakat, Sawm, and Hajj",
      "Ijab, Qabul, Milk, Qabd, and Khiyar ash-Shart",
      "Qiyas, Istihsan, Istishab, Maslahah Mursalah, and Sadd adh-Dhara'i'",
      "(1) Matters are judged by their purposes (al-Umuru bi-Maqasidiha), (2) Certainty is not dispelled by doubt (al-Yaqinu la Yazulu bish-Shakk), (3) Hardship brings ease (al-Mashaqqatu Tajlibu at-Taysir), (4) Harm is eliminated (ad-Dararu Yuzal), and (5) Custom is an arbiter (al-'Adatu Muhakkamah)",
    ],
    correctIdx: 3,
    isharaHint:
      "Ibn Nujaym placed a sixth introductory maxim ('La Thawaba illa bin-Niyyah') alongside these five overarching principles later codified as Articles 2, 4, 17, 20, and 36 of the Ottoman Majallah.",
    communityPoll: [11, 14, 17, 58],
    proofExplanation:
      "Ibn Nujaym's Al-Ashbah wan-Naza'ir (later commented upon by Imam Ahmad al-Hamawi in Ghamz 'Uyun al-Basa'ir) demonstrated how thousands of Hanafi branch rulings flow coherently from these universal maxims.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Al-Ashbah wan-Naza'ir Maxims",
  },
  {
    id: "q-t15-13",
    tier: 15,
    category: "Aqaid & Seerah",
    question:
      "Which revered Shafi'i Hadith master of Damascus (631–676 AH / 1233–1277 CE), despite living only forty-five lunar years, authored 'Riyad as-Salihin', 'Al-Arba'un', 'Al-Adhkar', and 'Al-Minhaj fi Sharh Sahih Muslim'?",
    options: [
      "Shaykh al-Islam Taqiuddin as-Subki",
      "Imam Ibn Daqiq al-'Id",
      "Hafiz Shamsuddin adh-Dhahabi",
      "Muhyiddin Imam Abu Zakariyya Yahya ibn Sharaf an-Nawawi",
    ],
    correctIdx: 3,
    isharaHint:
      "Born in the village of Nawa south of Damascus, his sincerity and asceticism made Riyad as-Salihin one of the most beloved Hadith collections in mosques across every Madhhab.",
    communityPoll: [13, 12, 14, 61],
    proofExplanation:
      "Shaykh al-Islam Muhyiddin Imam Yahya ibn Sharaf an-Nawawi (d. 676 AH) compiled Riyad as-Salihin ('Gardens of the Righteous') from authentic Hadiths on Iman, sincerity, ethics, and Prophetic Sunnah.",
    proofLink: "/tasbih",
    proofLinkLabel: "Explore Prophetic Adhkar & Sunnah",
  },
  {
    id: "q-t15-14",
    tier: 15,
    category: "Quran & Kanzul Iman",
    question:
      "In Surah Al-Fath 48:9 ('Li-tu'minu billahi wa Rasulihi wa tu'azziruhu wa tuwaqqiruhu wa tusabbihuhu bukratan wa asila'), how does Kanzul Iman resolve the three consecutive '-hu' pronouns to safeguard both Tawhid and Ta'zim-e-Risalat?",
    options: [
      "It refers all three pronouns exclusively to the treaty of Hudaybiyyah",
      "It renders 'tu'azziruhu wa tuwaqqiruhu' as honoring and revering the Messenger ﷺ, and explicitly shifts 'wa tusabbihuhu' to glorifying Allah morning and evening ('Aur Rasool ki ta'zeem o tauqeer karo, aur subah o sham Allah ki paki bolo')",
      "It translates all three verbs with an ambiguous pronoun without distinguishing Allah from His Messenger ﷺ",
      "It applies all three clauses to the angels descending at Bay'at ar-Ridwan",
    ],
    correctIdx: 1,
    isharaHint:
      "If translated carelessly in Urdu with a uniform 'uski', a reader might think 'tasbih' (glorification reserved for Allah) refers to creation or fail to give the Prophet ﷺ his commanded reverence.",
    communityPoll: [13, 62, 12, 13],
    proofExplanation:
      "Following classical Tafsir (at-Tabari, ar-Razi, al-Baydawi, and Khazain-ul-Irfan), Kanzul Iman masterfully disambiguates the pronouns of Surah Al-Fath 48:9 so reverence of the Prophet ﷺ and worshipful Tasbih of Allah each shine clearly.",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Al-Fath in Kanzul Iman",
  },
  {
    id: "q-t15-15",
    tier: 15,
    category: "Lives of the Auliya",
    question:
      "At what precise sacred moment on Friday, 25 Safar 1340 AH (28 October 1921 CE), did Ala Hazrat Imam Ahmad Raza Khan pass into the mercy of Allah in Bareilly Sharif after dictating his 'Wasaya Sharif'?",
    options: [
      "At 2:38 PM during the Friday Jumu'ah Azan, at the exact instant the Mu'adhdhin proclaimed 'Hayya 'alal-Falah' ('Come unto Success')",
      "Shortly after Maghrib on the night of 12 Rabi' al-Awwal",
      "At Subh Sadiq on the morning of 11 Rabi' al-Thani",
      "During Duha prayer on the Day of 'Arafah",
    ],
    correctIdx: 0,
    isharaHint:
      "Remarkably, four months earlier he had extracted the exact Hijri year of his passing (1340) via Abjad calculation from Surah Ad-Dahr 76:15 ('Wa yutafu 'alayhim bi-aniyatin min fiddatin wa akwabin').",
    communityPoll: [59, 13, 15, 13],
    proofExplanation:
      "Maulana Zafaruddin Bihari in Hayat-e-Ala Hazrat records that Imam Ahmad Raza Khan (1272–1340 AH) breathed his last on Friday, 25 Safar 1340 AH precisely as 'Hayya 'alal-Falah' echoed in the Jumu'ah call to prayer.",
    proofLink: "/auliya",
    proofLinkLabel: "Visit Urs-e-Razavi Profile",
  },
  {
    id: "q-t15-16",
    tier: 15,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Fiqh (Al-Hidayah, Radd al-Muhtar, and Bahar-e-Shariat Part 5), which exact five clans constitute 'Banu Hashim'—for whom Wajib Sadaqah (Zakat, Fitrah, Kaffarah, and Nadhr) is prohibited out of honor, while Hadiya and Nafl Sadaqah are meritorious?",
    options: [
      "Only the direct Hasani and Husayni Sayyids excluding all other Hashimites",
      "All clans of Quraysh including Banu Umayyah, Banu Taym, and Banu 'Adi",
      "Al-e-'Ali, Al-e-'Aqil, Al-e-Ja'far, Al-e-'Abbas, and Al-e-Harith ibn 'Abd al-Muttalib",
      "Only Hashimite scholars residing permanently within Makkah and Madinah",
    ],
    correctIdx: 2,
    isharaHint:
      "Based on the Sahih Muslim Hadith (#1072) 'Indeed these Sadaqat are merely the impurities of people's wealth, and they are not lawful for Muhammad nor for the family of Muhammad ﷺ', encompassing three sons of Abu Talib plus two uncles/cousins.",
    communityPoll: [19, 13, 55, 13],
    proofExplanation:
      "Al-Hidayah and Bahar-e-Shariat (Kitab az-Zakat) specify the five noble lineages of Banu Hashim—the descendants of Ali, Aqil, Ja'far, Abbas, and Harith ibn Abd al-Muttalib (رضي الله عنهم)—who are honored with Hadiya gifts rather than Zakat.",
    proofLink: "/zakat",
    proofLinkLabel: "Review Banu Hashim & Masarif Rules",
  },
  {
    id: "q-t15-17",
    tier: 15,
    category: "Aqaid & Seerah",
    question:
      "Alongside the decisive text of Surah Al-Ahzab 33:40, what is the Hadith transmission rank of 'Khatm-e-Nubuwwat' across Sunni creed manuals (Qadi Iyad's Ash-Shifa, Mulla Ali al-Qari's Sharh al-Fiqh al-Akbar, and Bahar-e-Shariat)?",
    options: [
      "Khabar al-Gharib transmitted by a single Companion",
      "Mutawatir (transmitted by over thirty to forty Companions in over two hundred authentic Hadiths such as 'La Nabiyya Ba'di', rendering any claim to new prophethood—legislative, non-legislative, zilli, or buruzi—unanimous Kufr)",
      "Mursal transmitted only in second-century Kufa",
      "Mashhur applicable only to previous nations",
    ],
    correctIdx: 1,
    isharaHint:
      "From the Battle of Yamamah under Sayyiduna Abu Bakr as-Siddiq (رضي الله عنه) onward, the entire Ummah held unanimous Ijma' against every claimant to prophethood.",
    communityPoll: [12, 63, 13, 12],
    proofExplanation:
      "Qadi Iyad in Ash-Shifa and Sunni theologians affirm that Khatm-e-Nubuwwat is established simultaneously by Qat'i Quranic text (33:40), Mutawatir Hadith ('La Nabiyya Ba'di'), and unbroken Ijma' of the Sahabah.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Khatm-e-Nubuwwat Creed",
  },
  {
    id: "q-t15-18",
    tier: 15,
    category: "Quran & Kanzul Iman",
    question:
      "In Hanafi 'Ilm al-Fara'id' based on Surah An-Nisa 4:11–12, if a woman passes away leaving behind only her Husband (Quranic share 1/2 = 3/6) and Two Full Sisters (Quranic share 2/3 = 4/6), how is the estate distributed under the rule of ''Awl'?",
    options: [
      "The base denominator 6 increases by 'Awl to 7, so the Husband receives 3/7 and the Two Full Sisters share 4/7 (2/7 each)",
      "The Husband takes his full 1/2 first, leaving the Two Full Sisters only the remaining 1/2",
      "The Two Full Sisters take their full 2/3 first, leaving the Husband 1/3",
      "All fixed shares are canceled and the estate is divided into three equal thirds",
    ],
    correctIdx: 0,
    isharaHint:
      "This exact case was the very first historical 'Awl judgment during the Caliphate of Sayyiduna Umar ibn al-Khattab (رضي الله عنه), reducing every fixed share proportionally by raising the denominator from 6 to 3 + 4 = 7.",
    communityPoll: [54, 18, 15, 13],
    proofExplanation:
      "In As-Sirajiyyah and Bahar-e-Shariat (Part 20), when fixed Furud exceed unity (3/6 + 4/6 = 7/6), 'Awl raises the denominator from 6 to 7 so every Quranic heir shares proportionally (3/7 to the Husband, 4/7 to the Two Full Sisters); conversely, when shares sum to less than 1 with no 'Asabah, Hanafi law applies 'Radd' to non-spouse blood Quranic heirs.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore 'Awl & Radd in Mirath",
  },
  {
    id: "q-t15-19",
    tier: 15,
    category: "Lives of the Auliya",
    question:
      "Which 10th-century Hijri Egyptian Hanafi verifier and Shadhili Sufi of Cairo (926–970 AH)—a spiritual companion of Imam Abdul Wahhab ash-Sha'rani—authored both 'Al-Bahr ar-Ra'iq' and 'Al-Ashbah wan-Naza'ir'?",
    options: [
      "Allama Ala'uddin Muhammad al-Haskafi",
      "Allama Abu al-Ikhlas Hasan ash-Shurunbulali",
      "Allama Zaynuddin ibn Ibrahim, known as Ibn Nujaym al-Misri",
      "Mulla Khusraw Muhammad ibn Faramurz",
    ],
    correctIdx: 2,
    isharaHint:
      "Praised by ash-Sha'rani for ten years of spotless Sufi companionship and Hajj together, he rests near the shrine of Sayyidah Sukaynah in Cairo.",
    communityPoll: [16, 15, 56, 13],
    proofExplanation:
      "Allama Zaynuddin Ibn Nujaym al-Misri (d. 970 AH) united Shadhili spiritual refinement with encyclopedic Hanafi mastery, authoring Al-Bahr ar-Ra'iq (8 vols on Kanz ad-Daqa'iq) and Al-Ashbah wan-Naza'ir.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Scholar-Saints of Cairo",
  },
  {
    id: "q-t15-20",
    tier: 15,
    category: "Hanafi Fiqh",
    question:
      "In the modern critical edition of Ala Hazrat's 'Fatawa-e-Razawiyya' (30 volumes, over 21,600 pages), how many independent research monographs ('Rasa'il') are embedded alongside its ~6,847 Fatwas, and what literary hallmark distinguishes many of its responsa?",
    options: [
      "12 monographs covering only Taharah; written exclusively in colloquial Urdu",
      "40 monographs translated from Ottoman Turkish; omitting mathematical sciences",
      "99 monographs restricted to inheritance tables; avoiding Arabic or Persian replies",
      "206 independent monographs spanning Fiqh, Tafsir, Hadith, Kalam, Mirath, logarithms, and spherical astronomy—frequently answering Arabic, Persian, or poetic queries in matching Arabic, Persian, or rhymed verse",
    ],
    correctIdx: 3,
    isharaHint:
      "Volume 1 alone spans over a thousand pages on water purity and flow geometry, and Raza Foundation (Lahore) expanded the original 12 folio volumes into the fully indexed 30-volume edition.",
    communityPoll: [15, 14, 14, 57],
    proofExplanation:
      "Al-'Ataya an-Nabawiyyah fil-Fatawa ar-Razawiyyah spans 30 volumes (21,656 pages, 6,847 Q&As, and 206 standalone Rasa'il), prompting Haramayn and Azhari scholars to hail Imam Ahmad Raza Khan as Mujaddid of the 14th Hijri century.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Fatawa-e-Razawiyya Legacy",
  },
];
