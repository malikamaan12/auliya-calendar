import { QuizQuestion } from "../quiz-types";

export const TIERS_6_TO_10: QuizQuestion[] = [
  // ============================================================================
  // TIER 6 — 20 Questions (q-t6-01 .. q-t6-20)
  // ============================================================================

  // ---- Tier 6: Aqaid & Seerah (5) ----
  {
    id: "q-t6-01",
    tier: 6,
    category: "Aqaid & Seerah",
    question:
      "Which noble paternal uncle of the Holy Prophet ﷺ was martyred in the Battle of Uhud (3 AH) and honored as 'Sayyid ash-Shuhada' (Leader of the Martyrs)?",
    options: [
      "Sayyiduna Abbas ibn Abdul-Muttalib",
      "Sayyiduna Hamzah ibn Abdul-Muttalib",
      "Sayyiduna Ja'far ibn Abi Talib",
      "Sayyiduna Mus'ab ibn Umayr",
    ],
    correctIdx: 1,
    isharaHint:
      "He was also known as 'Asadullah wa Asadu Rasulihi' (The Lion of Allah and His Messenger) and rests at the foot of Mount Uhud.",
    communityPoll: [7, 83, 6, 4],
    proofExplanation:
      "Sayyiduna Hamzah ibn Abdul-Muttalib (رضي الله عنه) was martyred at Uhud in Shawwal 3 AH; the Prophet ﷺ titled him Sayyid ash-Shuhada (Mustadrak al-Hakim).",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Sacred Seerah Dates",
  },
  {
    id: "q-t6-02",
    tier: 6,
    category: "Aqaid & Seerah",
    question:
      "During the Battle of Al-Khandaq (5 AH), which Companion proposed digging a defensive trench along the northern approach of Madinah Munawwarah?",
    options: [
      "Sayyiduna Salman al-Farsi",
      "Sayyiduna Hudhayfah ibn al-Yaman",
      "Sayyiduna Sa'd ibn Mu'adh",
      "Sayyiduna Ammar ibn Yasir",
    ],
    correctIdx: 0,
    isharaHint:
      "Originating from Persia, he drew upon defensive siege engineering unfamiliar to Arabian cavalry.",
    communityPoll: [84, 6, 5, 5],
    proofExplanation:
      "Sayyiduna Salman al-Farsi (رضي الله عنه) advised digging the trench in Shawwal 5 AH against the 10,000-strong Confederate coalition (Surah Al-Ahzab 33:9–22).",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Seerah & Aqaid Notes",
  },
  {
    id: "q-t6-03",
    tier: 6,
    category: "Aqaid & Seerah",
    question:
      "At Hudaybiyyah (6 AH), rumors of which envoy's martyrdom in Makkah led 1,400 Companions to pledge allegiance under the tree in Bay'at al-Ridwan?",
    options: [
      "Sayyiduna Umar ibn al-Khattab",
      "Sayyiduna Talhah ibn Ubaydullah",
      "Sayyiduna Uthman ibn Affan",
      "Sayyiduna Zubayr ibn al-Awwam",
    ],
    correctIdx: 2,
    isharaHint:
      "During that pledge, the Holy Prophet ﷺ placed his own blessed hand on behalf of this absent son-in-law.",
    communityPoll: [8, 5, 81, 6],
    proofExplanation:
      "Surah Al-Fath (48:18) expresses Allah's pleasure with the believers who pledged under the tree at Hudaybiyyah when Sayyiduna Uthman (رضي الله عنه) was detained in Makkah.",
    proofLink: "/quran",
    proofLinkLabel: "Open Kanzul Iman Reader",
  },
  {
    id: "q-t6-04",
    tier: 6,
    category: "Aqaid & Seerah",
    question:
      "In which Hijri year and month did the Peaceful Conquest of Makkah (Fath Makkah) take place, followed days later in Shawwal by the Battle of Hunayn?",
    options: [
      "Muharram 7 AH, right after Khaybar",
      "Shawwal 6 AH, after Hudaybiyyah",
      "Rajab 9 AH, before Tabuk",
      "Ramadan 8 AH, with general amnesty",
    ],
    correctIdx: 3,
    isharaHint:
      "The Prophet ﷺ entered Makkah with 10,000 Companions during the blessed month of fasting in the eighth year of Hijrah.",
    communityPoll: [6, 5, 7, 82],
    proofExplanation:
      "Fath Makkah occurred in Ramadan 8 AH when the Prophet ﷺ cleansed the Ka'bah of 360 idols and granted amnesty, followed by the Battle of Hunayn in Shawwal 8 AH (Quran 9:25).",
    proofLink: "/auliya",
    proofLinkLabel: "View Hijri Sacred Calendar",
  },
  {
    id: "q-t6-05",
    tier: 6,
    category: "Aqaid & Seerah",
    question:
      "After the victory at Khaybar (7 AH), which later expedition in Rajab 9 AH saw Sayyiduna Uthman equip 'Jaysh al-Usrah' with hundreds of camels and 1,000 gold dinars?",
    options: [
      "The Expedition of Tabuk",
      "The Expedition of Mu'tah",
      "The Expedition of Badr al-Akhirah",
      "The Expedition of Dhat ar-Riqa'",
    ],
    correctIdx: 0,
    isharaHint:
      "It was the farthest northern expedition led personally by the Prophet ﷺ toward the Byzantine frontier during intense summer heat.",
    communityPoll: [79, 10, 6, 5],
    proofExplanation:
      "Jami' at-Tirmidhi (#3700) records that when Sayyiduna Uthman (رضي الله عنه) poured 1,000 gold dinars into the Prophet's ﷺ lap for Tabuk in 9 AH, he declared: 'Nothing Uthman does after today will harm him.'",
    proofLink: "/zakat",
    proofLinkLabel: "Explore Charity & Infaq",
  },

  // ---- Tier 6: Quran & Kanzul Iman (5) ----
  {
    id: "q-t6-06",
    tier: 6,
    category: "Quran & Kanzul Iman",
    question:
      "According to Surah Al-Kahf (18:25), how long did the Sleepers of the Cave (Ashab al-Kahf) remain asleep in their sanctuary by Allah's command?",
    options: [
      "One hundred solar years exactly",
      "Forty lunar years and forty nights",
      "Three hundred years, and add nine",
      "Seventy generations of their townsfolk",
    ],
    correctIdx: 2,
    isharaHint:
      "Classical Sunni exegetes explain that 300 solar years correspond precisely to 309 lunar years.",
    communityPoll: [8, 5, 82, 5],
    proofExplanation:
      "Surah Al-Kahf (18:25) states: 'And they remained in their cave three hundred years, and add nine'—miraculously reconciling solar and lunar calendars as noted in Khazain-ul-Irfan.",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Al-Kahf in Kanzul Iman",
  },
  {
    id: "q-t6-07",
    tier: 6,
    category: "Quran & Kanzul Iman",
    question:
      "In the parable of the Two Gardens in Surah Al-Kahf (18:39), what phrase was the wealthy owner urged to recite upon entering his orchard to attribute all blessing to Allah?",
    options: [
      "Inna lillahi wa inna ilayhi raji'un",
      "Ma sha' Allahu la quwwata illa billah",
      "Hasbunallahu wa ni'mal-Wakil",
      "La ilaha illa Anta Subhanaka",
    ],
    correctIdx: 1,
    isharaHint:
      "It pairs 'Whatever Allah wills' with the declaration that there is no strength except through Allah.",
    communityPoll: [7, 80, 8, 5],
    proofExplanation:
      "Surah Al-Kahf (18:39) teaches believers to say 'Ma sha' Allahu la quwwata illa billah' upon seeing blessings in wealth, family, or property to ward off arrogance and loss.",
    proofLink: "/tasbih",
    proofLinkLabel: "Practice Daily Sunnah Adhkar",
  },
  {
    id: "q-t6-08",
    tier: 6,
    category: "Quran & Kanzul Iman",
    question:
      "Where did Prophet Musa (عليه السلام) and his young attendant Yusha' ibn Nun meet Sayyiduna Khidr (عليه السلام), who was gifted with Ilm-e-Ladunni in Surah Al-Kahf (18:60–65)?",
    options: [
      "Beside the blessed olive tree in Wadi Tuwa",
      "Near the ancient watering well of Madyan",
      "Upon the summit of Mount Judi",
      "At Majma' al-Bahrayn (the junction of the two seas)",
    ],
    correctIdx: 3,
    isharaHint:
      "Their miraculous sign of the meeting place was where their salted fish came back to life and slipped into the waters.",
    communityPoll: [6, 5, 5, 84],
    proofExplanation:
      "Surah Al-Kahf (18:60–65) narrates Prophet Musa's journey to Majma' al-Bahrayn to meet Allah's chosen servant Khidr (عليه السلام), upon whom Allah bestowed special mercy and divine knowledge.",
    proofLink: "/quran",
    proofLinkLabel: "Study Surah Al-Kahf Tafsir",
  },
  {
    id: "q-t6-09",
    tier: 6,
    category: "Quran & Kanzul Iman",
    question:
      "In Surah Al-Kahf (18:82), why did Sayyiduna Khidr (عليه السلام) straighten a collapsing wall without payment in a town whose people had refused them hospitality?",
    options: [
      "It concealed a treasure belonging to two orphan boys of a righteous father",
      "It enclosed the courtyard of an ancient place of prayer",
      "It held back floodwaters threatening neighboring farms",
      "It marked the resting place of an earlier Israelite prophet",
    ],
    correctIdx: 0,
    isharaHint:
      "Allah preserved the inheritance of two young children because of the piety of their deceased father.",
    communityPoll: [81, 8, 6, 5],
    proofExplanation:
      "Surah Al-Kahf (18:82) reveals that beneath the wall lay a buried treasure for two orphan boys whose father had been righteous, so their Lord willed they reach maturity and uncover it.",
    proofLink: "/quran",
    proofLinkLabel: "Open Kanzul Iman Reader",
  },
  {
    id: "q-t6-10",
    tier: 6,
    category: "Quran & Kanzul Iman",
    question:
      "According to Surah Al-Kahf (18:96), which two metals did the righteous king Dhul-Qarnayn fuse together to construct the barrier holding back Ya'juj and Ma'juj?",
    options: [
      "Carved basalt blocks sealed with molten lead",
      "Heavy bronze plates reinforced with silver",
      "Blocks of iron coated with molten copper",
      "Hewn limestone boulders bound with bitumen",
    ],
    correctIdx: 2,
    isharaHint:
      "Once the iron blocks glowed like fire between the two mountain cliffs, he asked for 'Qitr' to pour over them.",
    communityPoll: [9, 6, 79, 6],
    proofExplanation:
      "In Surah Al-Kahf (18:96–97), Dhul-Qarnayn stacked iron blocks (Zubar al-Hadid), heated them with bellows until fiery, and poured molten copper (Qitr) over them so Ya'juj and Ma'juj could neither scale nor pierce it.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Surah Al-Kahf Verses",
  },

  // ---- Tier 6: Lives of the Auliya (5) ----
  {
    id: "q-t6-11",
    tier: 6,
    category: "Lives of the Auliya",
    question:
      "Who was the premier Khalifa of Khwaja Moinuddin Chishti Ajmeri whose blessed sanctuary in Mehrauli (Delhi Sharif) became the spiritual heart of the Delhi Sultanate?",
    options: [
      "Shaykh Hamiduddin Suwali Nagauri",
      "Khwaja Qutbuddin Bakhtiyar Kaki",
      "Hazrat Amir Khusrau Dehlavi",
      "Khwaja Baqi Billah Berang",
    ],
    correctIdx: 1,
    isharaHint:
      "Born in Ush (Fergana), he was the Pir-o-Murshid of Baba Fariduddin Mas'ud Ganj Shakar.",
    communityPoll: [6, 83, 7, 4],
    proofExplanation:
      "Hazrat Khwaja Qutbuddin Bakhtiyar Kaki Ushi (رحمة الله عليه, wisal 14 Rabi' al-Awwal 633 AH) succeeded Gharib Nawaz in Delhi Sharif and trained Baba Farid Ganj Shakar.",
    proofLink: "/auliya",
    proofLinkLabel: "Trace the Chishti Shajrah",
  },
  {
    id: "q-t6-12",
    tier: 6,
    category: "Lives of the Auliya",
    question:
      "Which pious ruler of Delhi fulfilled the strict spiritual conditions in Khwaja Qutbuddin Bakhtiyar Kaki's will—including never missing Takbir-e-Ula or Asr Sunnahs—and led his Janazah?",
    options: [
      "Sultan Ghiyasuddin Balban",
      "Sultan Alauddin Khalji",
      "Sultan Firuz Shah Tughlaq",
      "Sultan Shamsuddin Iltutmish",
    ],
    correctIdx: 3,
    isharaHint:
      "He also commissioned the Qutb Minar completion and Hauz-e-Shamsi reservoir in devotion to the saint.",
    communityPoll: [9, 6, 7, 78],
    proofExplanation:
      "Sultan Shamsuddin Iltutmish stepped forward humbly in 633 AH when no one else met all four conditions of steadfast piety stipulated in Khwaja Bakhtiyar Kaki's Wasiyyat.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Chishti Masters",
  },
  {
    id: "q-t6-13",
    tier: 6,
    category: "Lives of the Auliya",
    question:
      "Hazrat Makhdoom Alauddin Ali Ahmad 'Sabir Pak' of Kaliyar Sharif—fountainhead of the Chishti-Sabiri Silsila—was the nephew and Khalifa of which saint?",
    options: [
      "Baba Fariduddin Mas'ud Ganj Shakar",
      "Hazrat Nizamuddin Auliya",
      "Khwaja Usman Harooni",
      "Khwaja Banda Nawaz Gesu Daraz",
    ],
    correctIdx: 0,
    isharaHint:
      "His maternal uncle and Murshid rests in Pakpattan Sharif and placed him in charge of the public Langar.",
    communityPoll: [80, 9, 5, 6],
    proofExplanation:
      "Hazrat Makhdoom Alauddin Ali Ahmad Sabir Kaliyari (رحمة الله عليه, wisal 13 Rabi' al-Awwal 690 AH) was trained in Pakpattan by his maternal uncle Baba Farid Ganj Shakar.",
    proofLink: "/auliya",
    proofLinkLabel: "Browse Auliya Biographies",
  },
  {
    id: "q-t6-14",
    tier: 6,
    category: "Lives of the Auliya",
    question:
      "Why did Baba Farid Ganj Shakar bestow the title 'Sabir' (The Patient One) upon Hazrat Alauddin Ali Ahmad of Kaliyar Sharif?",
    options: [
      "He walked barefoot from Herat to Makkah seven times in silence",
      "He copied forty complete manuscripts of the Quran by candlelight",
      "He distributed Langar food for years while fasting without eating a morsel from it",
      "He taught Hadith continuously for fifty years in Roorkee",
    ],
    correctIdx: 2,
    isharaHint:
      "Without explicit permission to eat from the hospice kitchen, he sustained himself on wild forest leaves while feeding thousands.",
    communityPoll: [6, 5, 81, 8],
    proofExplanation:
      "For twelve years Hazrat Ali Ahmad oversaw Baba Farid's Langar in Pakpattan without taking a single grain for himself; marveling at his Adab and endurance, Baba Farid proclaimed: 'Ali Ahmad is Sabir!'",
    proofLink: "/auliya",
    proofLinkLabel: "Read Lives of the Auliya",
  },
  {
    id: "q-t6-15",
    tier: 6,
    category: "Lives of the Auliya",
    question:
      "Which Chishti master, honored as 'Roshan Chiragh-e-Dehli' (wisal 18 Ramadan 757 AH), succeeded Hazrat Nizamuddin Auliya in Delhi and trained Khwaja Banda Nawaz Gesu Daraz?",
    options: [
      "Shaykh Burhanuddin Gharib",
      "Khwaja Nasiruddin Mahmud Chiragh Dehlavi",
      "Khwaja Amir Hasan Ala Sijzi",
      "Shaykh Akhi Siraj Aina-e-Hind",
    ],
    correctIdx: 1,
    isharaHint:
      "Originally from Awadh, his discourses were recorded by Hamid Qalandar in 'Khayr al-Majalis'.",
    communityPoll: [7, 79, 8, 6],
    proofExplanation:
      "Hazrat Khwaja Nasiruddin Mahmud Chiragh-e-Dehlavi (رحمة الله عليه) upheld the Chishti-Nizami banner in Delhi under severe trials and conferred Khilafat upon Khwaja Banda Nawaz Gesu Daraz.",
    proofLink: "/auliya",
    proofLinkLabel: "View Chishti Spiritual Lineage",
  },

  // ---- Tier 6: Hanafi Fiqh (5) ----
  {
    id: "q-t6-16",
    tier: 6,
    category: "Hanafi Fiqh",
    question:
      "According to Imam-e-Azam Abu Hanifa (رضي الله عنه) and Bahar-e-Shariat, when does Dhuhr end and the time for Asr Salah begin?",
    options: [
      "When an object's shadow reaches once its height plus the noon shadow (Mithl Awwal)",
      "Exactly midway between solar zenith (Zawal) and sunset",
      "Forty-five minutes after Dhuhr congregational prayer",
      "When an object's shadow reaches twice its height plus the noon shadow (Mithlayn)",
    ],
    correctIdx: 3,
    isharaHint:
      "The Arabic dual term 'Mithlayn' refers to two full lengths of the object beyond its midday zenith shadow (Fay' al-Zawal).",
    communityPoll: [12, 4, 3, 81],
    proofExplanation:
      "In the authoritative Fetwa of Imam Abu Hanifa (Bahar-e-Shariat Vol. 1, Part 3; Fatawa Razawiyya), Asr enters only at Mithlayn—twice an object's height plus its Zawal shadow.",
    proofLink: "/prayer",
    proofLinkLabel: "Check Live Hanafi Asr Window",
  },
  {
    id: "q-t6-17",
    tier: 6,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Fiqh, how does omitting a Wajib act of Salah (such as Surah Al-Fatihah or Qa'dah Ula) forgetfully differ from omitting it intentionally?",
    options: [
      "Forgetful omission is rectified by Sajda-e-Sahw, whereas intentional omission makes repeating the Salah Wajib",
      "Sajda-e-Sahw fully compensates both forgetful and intentional omissions",
      "Intentional omission requires three Sajdahs while forgetful omission requires two",
      "Neither requires Sajda-e-Sahw as long as all Fara'id of Salah are completed",
    ],
    correctIdx: 0,
    isharaHint:
      "'Sahw' literally means forgetfulness; deliberate neglect of a Wajib leaves the prayer deficient (Wajib al-I'adah).",
    communityPoll: [78, 12, 5, 5],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 4) explains that Sajda-e-Sahw is Wajib when a Wajib act is left or delayed out of forgetfulness; if left deliberately, the worshipper is sinful and repeating the Salah is Wajib.",
    proofLink: "/fiqh",
    proofLinkLabel: "Review Sajda-e-Sahw Rulings",
  },
  {
    id: "q-t6-18",
    tier: 6,
    category: "Hanafi Fiqh",
    question:
      "What is the authentic Hanafi procedure for performing Sajda-e-Sahw in the final sitting (Qa'dah Akhirah)?",
    options: [
      "Perform two Sajdahs immediately upon sitting before reciting At-Tahiyyat",
      "Recite At-Tahiyyat, turn one Salam to the right, perform two Sajdahs, then recite At-Tahiyyat, Durood, and Dua before both Salams",
      "Complete At-Tahiyyat, Durood, and both Salams, then perform one Sajdah without sitting again",
      "Recite At-Tahiyyat and Durood, perform two Sajdahs without Salam, and exit with Salam immediately",
    ],
    correctIdx: 1,
    isharaHint:
      "In Hanafi Fiqh, a single Salam to the right precedes the two prostrations, and Tashahhud plus Durood are completed afterward.",
    communityPoll: [8, 80, 6, 6],
    proofExplanation:
      "As detailed in Bahar-e-Shariat (Vol. 1, Part 4), in Qa'dah Akhirah one recites At-Tahiyyat, says Salam to the right side, performs two Sajdahs, sits to recite At-Tahiyyat, Durood-e-Ibrahimi, and Dua, and concludes with both Salams.",
    proofLink: "/fiqh",
    proofLinkLabel: "Open Bahar-e-Shariat Guide",
  },
  {
    id: "q-t6-19",
    tier: 6,
    category: "Hanafi Fiqh",
    question:
      "How is the Wajib three-Rak'ah Witr prayer structured in the Hanafi Madhhab?",
    options: [
      "Two Rak'ahs concluded with Salam, followed by one separate Rak'ah",
      "Three continuous Rak'ahs with no intermediate sitting in the second Rak'ah",
      "Three Rak'ahs with Qa'dah Ula in the second Rak'ah (At-Tahiyyat only) and a single Salam at the end of the third",
      "One single Rak'ah offered directly after the two Sunnahs of Isha",
    ],
    correctIdx: 2,
    isharaHint:
      "Its sitting structure mirrors the three Fard Rak'ahs of Maghrib, with Qira'at in all three Rak'ahs.",
    communityPoll: [9, 6, 82, 3],
    proofExplanation:
      "Imam Abu Hanifa rules Witr as Wajib consisting of 3 Rak'ahs like Maghrib—sitting for At-Tahiyyat in the 2nd Rak'ah without Salam, reciting Fatihah and a Surah in all 3 Rak'ahs, and ending with Salam after the 3rd.",
    proofLink: "/prayer",
    proofLinkLabel: "View Isha & Witr Guidance",
  },
  {
    id: "q-t6-20",
    tier: 6,
    category: "Hanafi Fiqh",
    question:
      "In the third Rak'ah of Hanafi Witr Salah, when is Dua-e-Qunoot recited, and what must one do if they forget it and bow into Ruku?",
    options: [
      "After rising from Ruku; if forgotten, stand silently for ten seconds before Sajdah",
      "Before Surah Al-Fatihah in the third Rak'ah; if forgotten, repeat the prayer",
      "During the final sitting after Durood; no Sajda-e-Sahw is required if missed",
      "After Qira'at before Ruku (with Takbir); if forgotten until Ruku, do not return to Qiyam—perform Sajda-e-Sahw at the end",
    ],
    correctIdx: 3,
    isharaHint:
      "Once the back bends into Ruku (a Fard pillar), one does not break Ruku to return for a Wajib.",
    communityPoll: [10, 4, 4, 82],
    proofExplanation:
      "In Hanafi Fiqh, after completing Qira'at in the 3rd Rak'ah of Witr, one raises hands to the ears saying Allahu Akbar and recites Dua-e-Qunoot before Ruku; if remembered in Ruku, one stays in Ruku and offers Sajda-e-Sahw.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Witr & Qunoot Rulings",
  },

  // ============================================================================
  // TIER 7 — 20 Questions (q-t7-01 .. q-t7-20)
  // ============================================================================

  // ---- Tier 7: Aqaid & Seerah (5) ----
  {
    id: "q-t7-01",
    tier: 7,
    category: "Aqaid & Seerah",
    question:
      "What is the foundational creed of Ahl-e-Sunnat wal-Jama'at regarding the Holy Quran as Kalamullah (the Speech of Allah)?",
    options: [
      "It is the eternal, uncreated Speech of Allah (Ghayr Makhluq), divinely guarded from all alteration",
      "It was brought into existence as a created attribute at the start of revelation",
      "Only its inner meanings are from Allah while its wording was composed later",
      "Its preservation relied solely upon stone and parchment copies",
    ],
    correctIdx: 0,
    isharaHint:
      "Both Imam Abu Hanifa in Al-Fiqh al-Akbar and Imam Ahmad ibn Hanbal upheld that Allah's Speech is uncreated.",
    communityPoll: [82, 8, 6, 4],
    proofExplanation:
      "Bahar-e-Shariat (Part 1, Aqaid) and Al-Aqidah at-Tahawiyyah affirm that the Holy Quran is Kalamullah Ghayr Makhluq (the uncreated Speech of Allah) and Allah Himself guarantees its preservation (Quran 15:9).",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Sunni Aqaid Tenets",
  },
  {
    id: "q-t7-02",
    tier: 7,
    category: "Aqaid & Seerah",
    question:
      "In the sciences of Seerah and Ulum al-Quran, what is the standard criterion distinguishing a Makki Surah from a Madani Surah?",
    options: [
      "Short poetic Surahs are Makki, while all lengthy Surahs are Madani",
      "Surahs revealed before the Hijrah are Makki, and those revealed after the Hijrah are Madani—even if revealed in Makkah",
      "Surahs revealed solely inside Masjid al-Haram are Makki and all others are Madani",
      "Surahs addressing mankind are Madani and Surahs addressing believers are Makki",
    ],
    correctIdx: 1,
    isharaHint:
      "The dividing line is chronological—marked by the Prophet's ﷺ blessed migration (Hijrah), rather than geography alone.",
    communityPoll: [9, 77, 8, 6],
    proofExplanation:
      "Classical scholars define Makki revelation as what descended prior to the Hijrah (~13 years) and Madani revelation as what descended after the Hijrah (~10 years), including verses revealed during Fath Makkah and Hajjat al-Wada'.",
    proofLink: "/quran",
    proofLinkLabel: "Browse Makki & Madani Surahs",
  },
  {
    id: "q-t7-03",
    tier: 7,
    category: "Aqaid & Seerah",
    question:
      "During the Hijrah to Madinah in Rabi' al-Awwal 1 AH, after staying at Quba, where did the Holy Prophet ﷺ lead his very first Friday (Jumu'ah) congregation?",
    options: [
      "Inside Masjid al-Qiblatayn in northern Madinah",
      "At the well of Bi'r Ruma",
      "In Wadi Ranuna among the tribe of Banu Salim ibn Awf",
      "Inside the courtyard of Sayyiduna Abu Ayyub al-Ansari's home",
    ],
    correctIdx: 2,
    isharaHint:
      "Masjid al-Jumu'ah stands today on that blessed spot between Quba and Masjid an-Nabawi.",
    communityPoll: [10, 4, 75, 11],
    proofExplanation:
      "Departing Quba on Friday morning in 1 AH, Dhuhr overtook the Prophet ﷺ in Wadi Ranuna among Banu Salim ibn Awf, where he delivered the first Khutbah and led Jumu'ah Salah (Sirat Ibn Hisham).",
    proofLink: "/prayer",
    proofLinkLabel: "View Friday Sunnahs & Timings",
  },
  {
    id: "q-t7-04",
    tier: 7,
    category: "Aqaid & Seerah",
    question:
      "Toward which sanctuary did the Prophet ﷺ and the Companions face in Salah for ~16–17 months in Madinah before Surah Al-Baqarah (2:144) turned the Qiblah to the Holy Ka'bah?",
    options: [
      "Masjid Quba in southern Madinah",
      "Mount Hira (Jabal an-Nur)",
      "Mount Tur in Sinai",
      "Bait al-Maqdis (Masjid al-Aqsa) in Jerusalem",
    ],
    correctIdx: 3,
    isharaHint:
      "Known in Islamic tradition as 'Qiblat al-Ula' (the First Qiblah) and the destination of Al-Isra.",
    communityPoll: [6, 5, 6, 83],
    proofExplanation:
      "Sahih al-Bukhari (#399) records that the Muslims prayed toward Bait al-Maqdis for sixteen or seventeen months in Madinah until Allah revealed Surah Al-Baqarah (2:144), turning their faces toward Masjid al-Haram.",
    proofLink: "/prayer",
    proofLinkLabel: "Open Qibla Compass",
  },
  {
    id: "q-t7-05",
    tier: 7,
    category: "Aqaid & Seerah",
    question:
      "Which Rightly-Guided Caliph is honored as 'Jami' al-Quran' for dispatching standardized master codices of the Mushaf (copied from the Suhuf kept with Sayyidah Hafsah) across the Muslim provinces?",
    options: [
      "Sayyiduna Uthman ibn Affan",
      "Sayyiduna Abu Bakr as-Siddiq",
      "Sayyiduna Umar ibn al-Khattab",
      "Sayyiduna Ali ibn Abi Talib",
    ],
    correctIdx: 0,
    isharaHint:
      "To this day, printed copies of the Holy Quran follow 'Rasm al-Uthmani' named after his blessed Caliphate (~25 AH).",
    communityPoll: [79, 12, 5, 4],
    proofExplanation:
      "While the initial Suhuf compilation occurred under Sayyiduna Abu Bakr (رضي الله عنه), Sayyiduna Uthman Dhun-Nurayn (رضي الله عنه) appointed Zayd ibn Thabit's committee to unite the Ummah upon the Uthmani Mushaf (Sahih al-Bukhari #4987).",
    proofLink: "/quran",
    proofLinkLabel: "Open Uthmani Mushaf Reader",
  },

  // ---- Tier 7: Quran & Kanzul Iman (5) ----
  {
    id: "q-t7-06",
    tier: 7,
    category: "Quran & Kanzul Iman",
    question:
      "Alongside 30 Juz (Paras) and 114 Surahs, into how many traditional Manzils (stages) did the Companions group the Holy Quran for a weekly seven-day Khatm (remembered by 'Fami Bi-Shawqin')?",
    options: [
      "Five Manzils",
      "Seven Manzils",
      "Ten Manzils",
      "Twelve Manzils",
    ],
    correctIdx: 1,
    isharaHint:
      "The seven letters of 'F-M-Y B-Sh-W-Q' mark the starting Surahs: Al-Fatihah, Al-Ma'idah, Yunus, Bani Isra'il, Ash-Shu'ara, As-Saffat, and Qaf.",
    communityPoll: [7, 78, 10, 5],
    proofExplanation:
      "Sunan Abi Dawud (#1393) and Sunan Ibn Majah record that the Sahabah divided the 114 Surahs into 7 Manzils so one reading a Manzil per day completes the entire Quran every week.",
    proofLink: "/quran",
    proofLinkLabel: "Track Quran Reading Progress",
  },
  {
    id: "q-t7-07",
    tier: 7,
    category: "Quran & Kanzul Iman",
    question:
      "Out of the 114 Surahs of the Holy Quran, what is the predominant scholarly count of Makki Surahs versus Madani Surahs, and which are the longest and shortest Surahs?",
    options: [
      "70 Makki & 44 Madani; longest is Al-Imran, shortest is Al-Ikhlas",
      "90 Makki & 24 Madani; longest is An-Nisa, shortest is Al-Asr",
      "86 Makki & 28 Madani; longest is Al-Baqarah (286 Ayahs), shortest is Al-Kawthar (3 Ayahs)",
      "57 Makki & 57 Madani; longest is Al-A'raf, shortest is An-Nasr",
    ],
    correctIdx: 2,
    isharaHint:
      "Roughly three-quarters of the Surahs are Makki, while Surah 2 spans nearly 2.5 Juz and Surah 108 has just 3 verses.",
    communityPoll: [8, 7, 79, 6],
    proofExplanation:
      "Standard Mushaf scholarship enumerates 86 Makki Surahs and 28 Madani Surahs (totaling 114), with Surah Al-Baqarah (286 verses) as the longest and Surah Al-Kawthar (3 verses) as the shortest.",
    proofLink: "/quran",
    proofLinkLabel: "Explore All 114 Surahs",
  },
  {
    id: "q-t7-08",
    tier: 7,
    category: "Quran & Kanzul Iman",
    question:
      "Why does Hanafi Fiqh count exactly 14 Wajib verses of Sajda-e-Tilawat in the Holy Quran rather than 15?",
    options: [
      "Hanafi Fiqh excludes Surah Al-Alaq (96:19) and Surah Al-Inshiqaq (84:21)",
      "Hanafi Fiqh omits Surah An-Najm (53:62) as a Makki recommendation only",
      "Hanafi Fiqh combines the two Sajdahs of Surah Al-A'raf and Surah Ar-Ra'd",
      "Hanafi Fiqh affirms Sad (38:24) and treats the second verse in Surah Al-Hajj (22:77) as regular Salah prostration",
    ],
    correctIdx: 3,
    isharaHint:
      "Surah Al-Hajj (22:77) pairs 'Irka'u wasjudu' (bow in Ruku and prostrate), which Hanafi Imams interpret as Salah rather than Tilawat.",
    communityPoll: [9, 6, 8, 77],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 4) specifies 14 Wajib Sajda-e-Tilawat verses—including Surah Sad (38:24), Al-Inshiqaq (84:21), and Al-Alaq (96:19)—while Surah Al-Hajj has only one Tilawat Sajdah at 22:18, excluding 22:77.",
    proofLink: "/quran",
    proofLinkLabel: "View 14 Hanafi Sajdah Verses",
  },
  {
    id: "q-t7-09",
    tier: 7,
    category: "Quran & Kanzul Iman",
    question:
      "Which Surah of the Holy Quran does not open with Bismillahir-Rahmanir-Rahim, and which Surah restores the total count to 114 Bismillahs by including it inside Ayah 30?",
    options: [
      "Surah At-Tawbah omits it; Surah An-Naml includes a second Bismillah in Prophet Sulayman's letter",
      "Surah Al-Anfal omits it; Surah Saba includes a second Bismillah in Dawud's praise",
      "Surah Muhammad omits it; Surah Maryam includes a second Bismillah",
      "Surah At-Tawbah omits it; Surah Al-Kahf includes a second Bismillah",
    ],
    correctIdx: 0,
    isharaHint:
      "Surah 9 descended with stern warning to treaty-breakers, while Surah 27 quotes the royal letter sent to Bilqis, Queen of Sheba.",
    communityPoll: [83, 6, 4, 7],
    proofExplanation:
      "Surah At-Tawbah (Chapter 9) has no opening Basmalah (as reported from Sayyiduna Ali and Ibn Abbas in Tirmidhi #3086), while Surah An-Naml (27:30) contains Bismillahir-Rahmanir-Rahim inside Prophet Sulayman's letter.",
    proofLink: "/quran",
    proofLinkLabel: "Read Kanzul Iman Translation",
  },
  {
    id: "q-t7-10",
    tier: 7,
    category: "Quran & Kanzul Iman",
    question:
      "How many Surahs of the Holy Quran open with Huruf Muqatta'at (disjointed mystic letters such as Alif-Lam-Mim, Ha-Mim, Ta-Sin, and Nun)?",
    options: [
      "Fourteen Surahs",
      "Twenty-nine Surahs",
      "Nineteen Surahs",
      "Thirty-three Surahs",
    ],
    correctIdx: 1,
    isharaHint:
      "They are formed from 14 distinct Arabic letters (half the alphabet), spanning 29 Surahs from Al-Baqarah (2) to Al-Qalam (68).",
    communityPoll: [14, 73, 8, 5],
    proofExplanation:
      "Exactly 29 Surahs begin with Huruf Muqatta'at across 14 unique letters; Sunni Tafsir works like Khazain-ul-Irfan describe them as divine secrets between Allah and His Beloved Messenger ﷺ.",
    proofLink: "/quran",
    proofLinkLabel: "Explore Quranic Sciences",
  },

  // ---- Tier 7: Lives of the Auliya (5) ----
  {
    id: "q-t7-11",
    tier: 7,
    category: "Lives of the Auliya",
    question:
      "Which 8th-century Hijri saint of Qasr-e-Arifan near Bukhara (wisal 3 Rabi' al-Awwal 791 AH) gave his blessed name to the Naqshbandi Silsila and emphasized silent Dhikr-e-Khafi?",
    options: [
      "Khwaja Abdul Khaliq Ghujdawani",
      "Shaykh Najmuddin Kubra",
      "Khwaja Shah Bahauddin Naqshband Bukhari",
      "Khwaja Ubaydullah Ahrar",
    ],
    correctIdx: 2,
    isharaHint:
      "His title 'Naqshband' signifies one who engraves the Divine Name 'Allah' indelibly upon the seeker's heart.",
    communityPoll: [9, 5, 81, 5],
    proofExplanation:
      "Hazrat Khwaja Shah Muhammad Bahauddin Naqshband Bukhari (رحمة الله عليه, 718–791 AH) crystallized the Naqshbandi path upon strict adherence to the Sunnah and silent remembrance of the heart.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Naqshbandi Lineage",
  },
  {
    id: "q-t7-12",
    tier: 7,
    category: "Lives of the Auliya",
    question:
      "Through which Companion does the primary Golden Chain (Silsilat adh-Dhahab / Siddiqiyyah) of the Naqshbandi Silsila trace its immediate spiritual transmission from the Holy Prophet ﷺ?",
    options: [
      "Sayyiduna Umar ibn al-Khattab",
      "Sayyiduna Uthman ibn Affan",
      "Sayyiduna Abdullah ibn Mas'ud",
      "Sayyiduna Abu Bakr as-Siddiq",
    ],
    correctIdx: 3,
    isharaHint:
      "He accompanied the Prophet ﷺ in Ghar-e-Thawr (Surah At-Tawbah 9:40), where silent heart-to-heart Dhikr was imparted.",
    communityPoll: [6, 5, 6, 83],
    proofExplanation:
      "While Qadri, Chishti, and Suhrawardi chains run primarily through Sayyiduna Ali (رضي الله عنه), the Naqshbandi Silsila uniquely traces its primary early link through Sayyiduna Abu Bakr as-Siddiq (رضي الله عنه) to Salman al-Farsi and Imam Ja'far as-Sadiq.",
    proofLink: "/auliya",
    proofLinkLabel: "View Spiritual Shajrahs",
  },
  {
    id: "q-t7-13",
    tier: 7,
    category: "Lives of the Auliya",
    question:
      "Which 6th/7th-century Hijri master of Baghdad (539–632 AH) consolidated the Suhrawardi Silsila globally and conferred spiritual Khilafat upon Shaykh Bahauddin Zakariya of Multan?",
    options: [
      "Shaykh Shihabuddin Umar as-Suhrawardi",
      "Shaykh Ahmad al-Kabir ar-Rifa'i",
      "Shaykh Abul-Hasan ash-Shadhili",
      "Shaykh Abu Madyan al-Ghawth",
    ],
    correctIdx: 0,
    isharaHint:
      "Trained by his paternal uncle Shaykh Abu an-Najib as-Suhrawardi in Baghdad, he was respected by Ghaus-e-Azam in his youth.",
    communityPoll: [78, 8, 8, 6],
    proofExplanation:
      "Shaykh-ush-Shuyukh Shihabuddin Abu Hafs Umar as-Suhrawardi (رحمة الله عليه) organized the Suhrawardi order from Baghdad and dispatched illumined Khulafa across Iraq, Persia, and Hind.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Suhrawardi Biographies",
  },
  {
    id: "q-t7-14",
    tier: 7,
    category: "Lives of the Auliya",
    question:
      "Which towering Suhrawardi saint (wisal 7 Safar 661 AH) established a world-renowned Khanqah and seminary in Multan Sharif after receiving Khilafat in Baghdad in just seventeen days?",
    options: [
      "Makhdoom Jahaniyan Jahangasht",
      "Shaykh Bahauddin Zakariya Multani",
      "Sayyid Jalaluddin Surkh-Posh Bukhari",
      "Shaykh Sadruddin Qunawi",
    ],
    correctIdx: 1,
    isharaHint:
      "When older disciples wondered at his rapid elevation, Shaykh Shihabuddin Suhrawardi remarked that he arrived as 'dry seasoned wood ready to catch flame'.",
    communityPoll: [8, 79, 8, 5],
    proofExplanation:
      "Shaykh-ul-Islam Bahauddin Zakariya Multani (رحمة الله عليه, 566–661 AH), a Hafiz of seven Qira'ats, established the premier Suhrawardi spiritual center of South Asia in Multan Sharif.",
    proofLink: "/auliya",
    proofLinkLabel: "Visit Auliya Directory",
  },
  {
    id: "q-t7-15",
    tier: 7,
    category: "Lives of the Auliya",
    question:
      "Hazrat Shaykh Ruknuddin Abul-Fath—celebrated as 'Shah Rukn-e-Alam' (wisal 735 AH), whose iconic octagonal domed shrine crowns Multan—was the grandson and successor of whom?",
    options: [
      "Data Ganj Bakhsh Syed Ali Hujwiri",
      "Baba Fariduddin Ganj Shakar",
      "Shaykh Bahauddin Zakariya Multani",
      "Khwaja Qutbuddin Bakhtiyar Kaki",
    ],
    correctIdx: 2,
    isharaHint:
      "His father was Shaykh Sadruddin Arif, the eldest son and Khalifa of Multan's Suhrawardi founder.",
    communityPoll: [7, 8, 77, 8],
    proofExplanation:
      "Hazrat Shah Rukn-e-Alam (رحمة الله عليه) was the son of Shaykh Sadruddin Arif and grandson of Shaykh Bahauddin Zakariya Multani; his Tughlaq-era mausoleum in Multan is a masterpiece of Islamic sacred architecture.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Multan & South Asian Saints",
  },

  // ---- Tier 7: Hanafi Fiqh (5) ----
  {
    id: "q-t7-16",
    tier: 7,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Fiqh (Bahar-e-Shariat), besides Dhuhr time, city/town (Misr), and public entry (Idhn-e-Aam), what are the Khutbah and minimum congregation conditions for a valid Jumu'ah Salah?",
    options: [
      "At least forty permanent adult male residents and Khutbah after the two Rak'ahs",
      "At least twelve male residents and two Khutbahs delivered before solar noon",
      "At least seven scholars present and Qunoot recited in the second Rak'ah",
      "Arabic Khutbah before Salah within Dhuhr time, and at least three adult men besides the Imam",
    ],
    correctIdx: 3,
    isharaHint:
      "Unlike the Shafi'i requirement of 40 and Maliki requirement of 12, Imam Abu Hanifa stipulates 3 male followers besides the Imam.",
    communityPoll: [14, 6, 4, 76],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 4) lists six conditions for the validity of Jumu'ah, including delivering the Khutbah before Salah after Zawal and a Jama'at of at least three men besides the Imam.",
    proofLink: "/fiqh",
    proofLinkLabel: "Review Hanafi Jumu'ah Conditions",
  },
  {
    id: "q-t7-17",
    tier: 7,
    category: "Hanafi Fiqh",
    question:
      "According to Hanafi Fiqh, what is the ruling once the Imam steps out to the Minbar for the Friday (Jumu'ah) Khutbah?",
    options: [
      "Complete silence and attentive listening become obligatory; both talking and starting Nafl/Sunnah Salah are prohibited",
      "Latecomers should pray two quick Rak'ahs of Tahiyyat al-Masjid while the Imam speaks",
      "Quiet Dhikr on the tongue and replying aloud to Salam remain permissible",
      "Silence is required only during Quranic verses, not during Arabic admonitions",
    ],
    correctIdx: 0,
    isharaHint:
      "Even commanding good verbally ('Be quiet!') to one's neighbor during the Khutbah is forbidden by Hadith.",
    communityPoll: [80, 11, 5, 4],
    proofExplanation:
      "In Hanafi Fiqh (Bahar-e-Shariat Vol. 1, Part 4), as soon as the Imam rises for the Khutbah, starting any prayer or speaking—even returning Salam verbally—becomes impermissible; listening silently is Fard.",
    proofLink: "/prayer",
    proofLinkLabel: "Read Friday Jumu'ah Etiquette",
  },
  {
    id: "q-t7-18",
    tier: 7,
    category: "Hanafi Fiqh",
    question:
      "What is the juristic ruling on Eid al-Fitr and Eid al-Adha Salah in the Hanafi Madhhab (for those upon whom Jumu'ah is Fard), and when is its valid window?",
    options: [
      "Sunnah Mu'akkadah offered with Azan and Iqamah from Fajr until Asr",
      "Wajib (without Azan or Iqamah), from ~20 minutes after sunrise until just before Zawal (midday)",
      "Fard Kifayah offered individually or in congregation anytime on Eid day",
      "Fard Ayn offered immediately as the sun's upper rim appears at sunrise",
    ],
    correctIdx: 1,
    isharaHint:
      "It has neither Azan nor Iqamah, and its Khutbah is Sunnah delivered AFTER the two Rak'ahs.",
    communityPoll: [11, 78, 7, 4],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 4) states that Eidain Salah is Wajib upon those on whom Jumu'ah is Fard, offered without Azan/Iqamah from ~20 minutes post-sunrise (once Tulu' karahat ends) up to Istiwa/Zawal.",
    proofLink: "/prayer",
    proofLinkLabel: "Check Solar & Makruh Windows",
  },
  {
    id: "q-t7-19",
    tier: 7,
    category: "Hanafi Fiqh",
    question:
      "How are the 6 extra Wajib Takbirs (Takbirat-e-Zawa'id) performed across the two Rak'ahs of Eid Salah in the Hanafi Madhhab?",
    options: [
      "Seven extra Takbirs before Fatihah in the first Rak'ah and five in the second Rak'ah",
      "Six extra Takbirs consecutively in the first Rak'ah before Surah Al-Fatihah",
      "Three extra Takbirs in the first Rak'ah after Thana before Fatihah, and three in the second Rak'ah after Qira'at before Ruku",
      "Three extra Takbirs after Qira'at in the first Rak'ah, and three before Fatihah in the second",
    ],
    correctIdx: 2,
    isharaHint:
      "Hands are raised to the ears for all 6 extra Takbirs: 3 before recitation in Rak'ah 1, and 3 after recitation in Rak'ah 2.",
    communityPoll: [10, 5, 79, 6],
    proofExplanation:
      "In Hanafi Eid Salah (Bahar-e-Shariat Vol. 1, Part 4), 3 extra Wajib Takbirs are said after Thana before Qira'at in the 1st Rak'ah, and 3 extra Wajib Takbirs are said after Qira'at just before the Ruku Takbir in the 2nd Rak'ah.",
    proofLink: "/fiqh",
    proofLinkLabel: "Open Hanafi Salah & Eid Guide",
  },
  {
    id: "q-t7-20",
    tier: 7,
    category: "Hanafi Fiqh",
    question:
      "What is the Hanafi ruling on Salat al-Janazah (the Funeral Prayer), and what are its two Fard pillars (Arkan)?",
    options: [
      "Sunnah Mu'akkadah; its pillars are two Rak'ahs and two Sajdahs",
      "Wajib upon relatives only; its pillars are Surah Al-Fatihah and Salam",
      "Fard Ayn upon every town resident; its pillars are five Takbirs and Ruku",
      "Fard Kifayah; its two pillars are saying four Takbirs (without Ruku or Sajdah) and Qiyam (standing)",
    ],
    correctIdx: 3,
    isharaHint:
      "If some Muslims in a community perform it, all are absolved; if all neglect it while knowing, everyone shares sin.",
    communityPoll: [5, 5, 8, 82],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 4, Janazah) confirms Salat al-Janazah is Fard Kifayah with two Fara'id (pillars): four Takbirs and Qiyam (standing), while Thana, Durood, and Dua for the deceased are Sunnah Mu'akkadah.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Bahar-e-Shariat Janazah Masail",
  },

  // ============================================================================
  // TIER 8 — 20 Questions (q-t8-01 .. q-t8-20)
  // ============================================================================

  // ---- Tier 8: Aqaid & Seerah (5) ----
  {
    id: "q-t8-01",
    tier: 8,
    category: "Aqaid & Seerah",
    question:
      "Which two canonical Hadith collections are revered across Ahl-e-Sunnat wal-Jama'at as 'As-Sahihayn'—the two most authentic books after the Book of Allah?",
    options: [
      "Sahih al-Bukhari and Sahih Muslim",
      "Muwatta Imam Malik and Musnad Imam Ahmad",
      "Jami' at-Tirmidhi and Sunan Abi Dawud",
      "Sahih Ibn Hibban and Mustadrak al-Hakim",
    ],
    correctIdx: 0,
    isharaHint:
      "Compiled by Imam Muhammad ibn Isma'il al-Bukhari (d. 256 AH) and his student Imam Muslim ibn al-Hajjaj an-Naysaburi (d. 261 AH).",
    communityPoll: [84, 7, 6, 3],
    proofExplanation:
      "Sunni Hadith scholars hold unanimous consensus that Sahih al-Bukhari and Sahih Muslim (As-Sahihayn) rank as the soundest compiled works after the Holy Quran.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Authentic Hadith Collection",
  },
  {
    id: "q-t8-02",
    tier: 8,
    category: "Aqaid & Seerah",
    question:
      "Alongside Sahih al-Bukhari and Sahih Muslim, which four works complete the six canonical Hadith collections known as 'Sihah Sittah' (Kutub as-Sittah)?",
    options: [
      "Musannaf Abd ar-Razzaq, Sunan ad-Darimi, Muwatta Malik, and Musnad Bazzar",
      "Sunan Abi Dawud, Jami' at-Tirmidhi, Sunan an-Nasa'i, and Sunan Ibn Majah",
      "Sunan al-Bayhaqi, Sunan ad-Daraqutni, Mu'jam at-Tabarani, and Mishkat",
      "Musnad Abu Ya'la, Sahih Ibn Khuzaymah, Shamail Tirmidhi, and Riyad as-Salihin",
    ],
    correctIdx: 1,
    isharaHint:
      "All four compilers lived in the blessed 3rd century Hijri and organized Prophetic traditions by chapters of Fiqh.",
    communityPoll: [6, 80, 9, 5],
    proofExplanation:
      "The Sihah Sittah comprise Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud (d. 275 AH), Jami' at-Tirmidhi (d. 279 AH), Sunan an-Nasa'i (d. 303 AH), and Sunan Ibn Majah (d. 273 AH).",
    proofLink: "/fiqh",
    proofLinkLabel: "Browse Hadith & Sunnah Studio",
  },
  {
    id: "q-t8-03",
    tier: 8,
    category: "Aqaid & Seerah",
    question:
      "Why does Imam-e-Azam Abu Hanifa Nu'man ibn Thabit (80–150 AH, رضي الله عنه) hold the noble rank of a Tabi'i among the Four Sunni Imams, with his Hadith chains preserved in 'Musnad Imam Abu Hanifa'?",
    options: [
      "He migrated directly from Makkah to Madinah in the first decade of Hijrah",
      "He studied directly under Imam Bukhari and Imam Muslim in Baghdad",
      "He was blessed to behold Sahabah in his youth—such as Sayyiduna Anas ibn Malik in Kufa—in the state of Iman",
      "He compiled the six canonical books of Sihah Sittah in a single volume",
    ],
    correctIdx: 2,
    isharaHint:
      "A Tabi'i is a believer who met one or more Companions of the Prophet ﷺ with faith and passed away upon Islam.",
    communityPoll: [5, 6, 78, 11],
    proofExplanation:
      "Born in 80 AH, Imam Abu Hanifa (رضي الله عنه) saw Sayyiduna Anas ibn Malik (d. 93 AH) and other Sahabah, giving him the unique rank of Tabi'i among the Four Imams; his Hadith narrations are preserved in Kitab al-Athar and over 15 compilations of Musnad Abi Hanifa.",
    proofLink: "/fiqh",
    proofLinkLabel: "Learn About Hanafi Heritage",
  },
  {
    id: "q-t8-04",
    tier: 8,
    category: "Aqaid & Seerah",
    question:
      "Which noble Companion—blessed by a Prophetic miracle upon his cloak so he never forgot a word he heard—transmitted 5,374 Hadiths, more than any other Sahabi?",
    options: [
      "Sayyiduna Abdullah ibn Umar",
      "Sayyiduna Anas ibn Malik",
      "Sayyiduna Jabir ibn Abdullah",
      "Sayyiduna Abu Hurayrah (Abdur-Rahman ibn Sakhr)",
    ],
    correctIdx: 3,
    isharaHint:
      "Devoting his life among Ashab as-Suffah in Masjid an-Nabawi, his Kunyah means 'Father of the Little Kitten'.",
    communityPoll: [7, 6, 4, 83],
    proofExplanation:
      "Sahih al-Bukhari (#119) records how the Prophet ﷺ blessed the cloak of Sayyiduna Abu Hurayrah (رضي الله عنه), who wrapped it to his chest and never forgot a Hadith thereafter, transmitting 5,374 narrations.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Hadith Narrations",
  },
  {
    id: "q-t8-05",
    tier: 8,
    category: "Aqaid & Seerah",
    question:
      "In which Hijri year in Madinah Munawwarah were the obligatory Ramadan fast (Sawm) and Sadaqat al-Fitr formally instituted, shortly before the Battle of Badr?",
    options: [
      "Second year of Hijrah (2 AH)",
      "Fifth year of Hijrah (5 AH)",
      "Eighth year of Hijrah (8 AH)",
      "Ninth year of Hijrah (9 AH)",
    ],
    correctIdx: 0,
    isharaHint:
      "It was the same pivotal Madani year that witnessed the change of Qiblah, the Battle of Badr in Ramadan, and the very first Eid al-Fitr.",
    communityPoll: [76, 10, 7, 7],
    proofExplanation:
      "Fasting the month of Ramadan and paying Sadaqat al-Fitr were enjoined in Sha'ban 2 AH (with Zakat obligations detailed progressively in 2 AH and 9 AH); the Holy Prophet ﷺ observed nine Ramadans in Madinah.",
    proofLink: "/zakat",
    proofLinkLabel: "Open Zakat & Fitrana Tools",
  },

  // ---- Tier 8: Quran & Kanzul Iman (5) ----
  {
    id: "q-t8-06",
    tier: 8,
    category: "Quran & Kanzul Iman",
    question:
      "How many eligible categories of Zakat recipients (Masarif al-Zakat) are explicitly defined by Allah Almighty in Surah At-Tawbah (9:60), starting with Al-Fuqara and Al-Masakin?",
    options: [
      "Five categories",
      "Eight categories",
      "Seven categories",
      "Ten categories",
    ],
    correctIdx: 1,
    isharaHint:
      "'Innamas-Sadaqatu lil-Fuqara'i wal-Masakini...' enumerates the exact eligible heads of Zakat expenditure.",
    communityPoll: [7, 79, 9, 5],
    proofExplanation:
      "Surah At-Tawbah (9:60) specifies 8 Masarif: the poor (Fuqara), needy (Masakin), appointed collectors, reconciliation of hearts (subsequently abrogated after Islam's strength), freeing captives, debtors (Gharimin), in Allah's cause, and stranded travelers (Ibn as-Sabil).",
    proofLink: "/zakat",
    proofLinkLabel: "Review 8 Masarif al-Zakat",
  },
  {
    id: "q-t8-07",
    tier: 8,
    category: "Quran & Kanzul Iman",
    question:
      "In Surah Al-Baqarah (2:187), what is meant by distinguishing the 'white thread' (Al-Khayt al-Abyad) from the 'black thread' (Al-Khayt al-Aswad) at the cutoff of Suhoor?",
    options: [
      "Holding two dyed woolen threads indoors by lamplight",
      "Waiting until full golden sunlight spreads across the rooftops",
      "The horizontal light of true dawn (Subh Sadiq) becoming distinct from the darkness of night",
      "Sighting the setting of the morning star after Fajr congregation",
    ],
    correctIdx: 2,
    isharaHint:
      "The verse itself adds clarifying words: 'minal-Fajr' (of the dawn)—explained by the Prophet ﷺ to Adi ibn Hatim (رضي الله عنه).",
    communityPoll: [6, 6, 82, 6],
    proofExplanation:
      "Sahih al-Bukhari (#1916) and Kanzul Iman confirm that Surah Al-Baqarah (2:187) refers to the whiteness of true dawn (Subh Sadiq) separating from the blackness of night, marking the exact end of Suhoor and start of Fajr.",
    proofLink: "/prayer",
    proofLinkLabel: "View Subh Sadiq / Suhoor Cutoff",
  },
  {
    id: "q-t8-08",
    tier: 8,
    category: "Quran & Kanzul Iman",
    question:
      "With what spiritual purpose does Allah conclude the verse prescribing Sawm in Surah Al-Baqarah (2:183): 'O believers! Fasting has been made obligatory upon you as it was upon those before you...'?",
    options: [
      "So that you may count the lunar months accurately",
      "So that you may experience physical endurance in travel",
      "So that your worldly provisions may multiply tenfold",
      "So that you may attain Taqwa (piety and God-consciousness)",
    ],
    correctIdx: 3,
    isharaHint:
      "The Arabic closing is 'la'allakum tattaqun'—rendered in Kanzul Iman as 'so that you may guard against evil / become pious'.",
    communityPoll: [5, 5, 6, 84],
    proofExplanation:
      "Surah Al-Baqarah (2:183) culminates with 'la'allakum tattaqun'—identifying Taqwa (guarding the heart, eyes, tongue, and limbs for Allah's sake) as the inner fruit of fasting.",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Al-Baqarah in Kanzul Iman",
  },
  {
    id: "q-t8-09",
    tier: 8,
    category: "Quran & Kanzul Iman",
    question:
      "Which Quranic passage sternly warns those who hoard gold and silver ('yaknizuna adh-dhahaba wal-fiddah') without paying its Zakat that it will be heated in Hellfire to brand their foreheads, flanks, and backs?",
    options: [
      "Surah At-Tawbah, Verses 34–35",
      "Surah Al-Kahf, Verses 46–47",
      "Surah Al-Mulk, Verses 10–11",
      "Surah An-Naml, Verses 20–21",
    ],
    correctIdx: 0,
    isharaHint:
      "Hadith explains that any wealth on which obligatory Zakat has been duly paid is no longer counted as condemned 'Kanz' (hoarding).",
    communityPoll: [75, 10, 8, 7],
    proofExplanation:
      "Surah At-Tawbah (9:34–35) delivers this severe warning regarding un-Zakated gold and silver; Sunan Abi Dawud (#1564) clarifies that once Zakat is paid on gold/silver, it is purified and no longer 'Kanz'.",
    proofLink: "/zakat",
    proofLinkLabel: "Calculate Gold & Silver Zakat",
  },
  {
    id: "q-t8-10",
    tier: 8,
    category: "Quran & Kanzul Iman",
    question:
      "Surah Al-An'am (6:141) commands: 'And give its due on the day of its harvest.' Based on this and Prophetic Hadith, what are the two Hanafi Ushr rates on agricultural crops?",
    options: [
      "2.5% on rain-fed land and 1.25% on artificially irrigated land",
      "10% (full Ushr) on naturally rain/river-fed land, and 5% (Nisf Ushr) on land irrigated with labor/expense",
      "20% (Khums) on all orchards and 10% on wheat and barley",
      "5% uniformly on every harvest after waiting one full lunar year (Hawl)",
    ],
    correctIdx: 1,
    isharaHint:
      "'Ushr' literally means 'one-tenth' (10%), halved to 'one-twentieth' (5%) when the farmer bears irrigation costs; unlike cash Zakat, Ushr does not require a Hawl.",
    communityPoll: [14, 74, 6, 6],
    proofExplanation:
      "Sahih al-Bukhari (#1483) and Bahar-e-Shariat (Vol. 1, Part 5) establish 10% (Ushr) on crops watered naturally by rain or streams, and 5% (Nisf Ushr) on crops watered via wells, buckets, or mechanical irrigation.",
    proofLink: "/zakat",
    proofLinkLabel: "Explore Zakat & Ushr Rulings",
  },

  // ---- Tier 8: Lives of the Auliya (5) ----
  {
    id: "q-t8-11",
    tier: 8,
    category: "Lives of the Auliya",
    question:
      "Which 11th-century Hijri Qadri-Sarwari saint of Jhang (Punjab, wisal 1102 AH) authored 'Ain-ul-Faqr' in Persian and the beloved Punjabi mystical quatrains 'Abyat-e-Bahu' ending each line with 'Hoo'?",
    options: [
      "Baba Bulleh Shah Qadri",
      "Mian Muhammad Bakhsh",
      "Hazrat Sultan Bahu",
      "Khwaja Ghulam Farid",
    ],
    correctIdx: 2,
    isharaHint:
      "His resting sanctuary is at Garh Maharaja (Jhang), and his poetry compares the believer's heart to a garden blooming with Tawhid.",
    communityPoll: [9, 6, 80, 5],
    proofExplanation:
      "Hazrat Sultan-ul-Arifin Sultan Bahu (رحمة الله عليه, 1039–1102 AH) spread the Sarwari-Qadri spiritual path across Punjab and authored over a hundred Persian works alongside Abyat-e-Bahu.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Qadri Saints",
  },
  {
    id: "q-t8-12",
    tier: 8,
    category: "Lives of the Auliya",
    question:
      "Which illustrious Qadri saint—born in Sehwan Sharif (957 AH) and resting in Lahore Sharif (wisal 7 Rabi' al-Awwal 1045 AH)—was renowned across the Mughal era for ascetic detachment and compassion?",
    options: [
      "Shaykh Tahir Bandagi Lahori",
      "Pir Meher Ali Shah Golrawi",
      "Shah Inayat Qadri Shattari",
      "Hazrat Mian Mir Bala Pir Lahori",
    ],
    correctIdx: 3,
    isharaHint:
      "A direct descendant of Sayyiduna Umar al-Faruq (رضي الله عنه) and disciple of Shaykh Khidr Siwastani, his sprawling marble shrine graces Mian Mir in Lahore.",
    communityPoll: [6, 8, 6, 80],
    proofExplanation:
      "Hazrat Shaykh Mir Muhammad 'Mian Mir' Qadri Lahori (رحمة الله عليه, 957–1045 AH) illuminated Lahore with pure Qadri spirituality, humility, and independence from worldly courts.",
    proofLink: "/auliya",
    proofLinkLabel: "Browse Qadri Lineage",
  },
  {
    id: "q-t8-13",
    tier: 8,
    category: "Lives of the Auliya",
    question:
      "Which 12th-century Hijri Qadri master of Bansa Sharif (Barabanki, wisal 6 Shawwal 1136 AH) founded the Qadri-Razzaqi branch and served as Murshid to Mulla Nizamuddin (founder of Dars-e-Nizami)?",
    options: [
      "Hazrat Sayyid Shah Abdul Razzaq Bansawi",
      "Shaykh Abdul Haq Muhaddith Dehlavi",
      "Sayyid Shah Fazlur-Rahman Ganj Muradabadi",
      "Haji Waris Ali Shah Dewa",
    ],
    correctIdx: 0,
    isharaHint:
      "The great scholars of Farangi Mahal in Lucknow held devoted allegiance to his threshold in Bansa Sharif.",
    communityPoll: [73, 12, 8, 7],
    proofExplanation:
      "Qutb-ul-Aqtab Sayyiduna Shah Abdul Razzaq of Bansa Sharif (رحمة الله عليه, d. 1136 AH) united deep Qadri wilayat with Sunni scholarship, guiding Mulla Nizamuddin Sihalwi and generations of Ulama.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Qadri Tazkirahs",
  },
  {
    id: "q-t8-14",
    tier: 8,
    category: "Lives of the Auliya",
    question:
      "At which blessed Qadri-Barkati sanctuary—founded by Sayyiduna Shah Barkatullah Marehravi—did Ala Hazrat Imam Ahmad Raza Khan take Bay'at and receive Khilafat in 1294 AH from Sayyid Shah Ale Rasul?",
    options: [
      "Kichaucha Sharif (Ambedkar Nagar)",
      "Marehra Sharif (Etah, Uttar Pradesh)",
      "Phulwari Sharif (Bihar)",
      "Badaun Sharif (Uttar Pradesh)",
    ],
    correctIdx: 1,
    isharaHint:
      "Known as Khanqah-e-Barkatiyya, its seven luminous Sayyid masters are celebrated in Ala Hazrat's Qadri-Razavi Shajrah.",
    communityPoll: [10, 79, 6, 5],
    proofExplanation:
      "In 1294 AH (1877 CE), Ala Hazrat traveled with his father Allama Naqi Ali Khan to Khanqah-e-Barkatiyya in Marehra Sharif, where Sayyiduna Shah Ale Rasul Marehravi (رحمة الله عليه) immediately bestowed Bay'at and Khilafat upon him.",
    proofLink: "/auliya",
    proofLinkLabel: "View Razavi & Qadri Shajrah",
  },
  {
    id: "q-t8-15",
    tier: 8,
    category: "Lives of the Auliya",
    question:
      "Which 9th/10th-century Hijri direct descendant of Ghaus-e-Azam—migrating from Aleppo (Halab) and resting in Uch Sharif (wisal 923 AH)—is celebrated as a pioneer of the Qadri Silsila in South Asia?",
    options: [
      "Makhdoom Lal Shahbaz Qalandar",
      "Khwaja Khwand Mahmud Naqshbandi",
      "Sayyid Muhammad Ghaus Jilani Bala Pir (Uch Sharif)",
      "Shaykh Hamiduddin Hakim",
    ],
    correctIdx: 2,
    isharaHint:
      "Called 'Thani Ghaus-e-Azam' in Punjab and Sindh, he settled at Uch Gilaniyan in 887 AH.",
    communityPoll: [10, 6, 74, 10],
    proofExplanation:
      "Hazrat Sayyid Muhammad Ghaus Jilani Halabi of Uch Sharif (رحمة الله عليه, d. 923 AH) firmly planted the Qadri Silsila in Multan, Uch, and Lahore, from which countless Qadri branches flourished across Hind.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Auliya Sanctuary Map",
  },

  // ---- Tier 8: Hanafi Fiqh (5) ----
  {
    id: "q-t8-16",
    tier: 8,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Fiqh (Bahar-e-Shariat), what are the exact Gold and Silver Nisab thresholds, standard Zakat rate after one lunar year (Hawl), and ruling on personal worn gold/silver jewelry?",
    options: [
      "Gold 100g, Silver 700g, 2.5% rate; regularly worn jewelry is exempt",
      "Gold 50g, Silver 500g, 5% rate; only gold bars are Zakatable",
      "Gold 85g, Silver 595g, 2.5% rate; jewelry is Zakatable only once in a lifetime",
      "Gold 7.5 tola (87.48g), Silver 52.5 tola (612.36g), 2.5% rate; worn gold/silver jewelry is Zakatable",
    ],
    correctIdx: 3,
    isharaHint:
      "In Hanafi Dhamm, cash or mixed assets are benchmarked against the 52.5-tola Silver Nisab to maximize benefit for the Fuqara.",
    communityPoll: [9, 3, 9, 79],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 5) sets Gold Nisab at 7.5 tola (87.48g) and Silver Nisab at 52.5 tola (612.36g), with 2.5% (1/40th) due after a full Hawl—including all owned gold and silver jewelry whether stored or worn.",
    proofLink: "/zakat",
    proofLinkLabel: "Open Hanafi Zakat Calculator",
  },
  {
    id: "q-t8-17",
    tier: 8,
    category: "Hanafi Fiqh",
    question:
      "What is the Hanafi ruling on Sadaqat al-Fitr at Subh Sadiq of Eid al-Fitr, does its Nisab require a year's passage (Hawl), and what is its classical wheat measure?",
    options: [
      "Wajib upon every free Muslim owning Nisab beyond basic needs (no Hawl required); half a Sa' of wheat (~1.92–2 kg) or its value",
      "Sunnah Ghayr Mu'akkadah only if wealth was held for a full Hawl; one Mudd of wheat",
      "Fard only upon heads of households who performed Hajj; five kilograms of wheat",
      "Wajib only on productive trade inventory; two full Sa' of wheat per adult",
    ],
    correctIdx: 0,
    isharaHint:
      "A father also pays it on behalf of his minor children, and in Hanafi Fiqh giving its cash market value is valid and often more helpful to the poor.",
    communityPoll: [77, 10, 6, 7],
    proofExplanation:
      "In Hanafi Fiqh (Bahar-e-Shariat Vol. 1, Part 5), Sadaqat al-Fitr becomes Wajib at Subh Sadiq of 1 Shawwal upon anyone owning Nisab surplus to Hawa'ij Asliyyah (even without growth or Hawl), at 0.5 Sa' of wheat/flour or 1 Sa' of dates/barley/raisins (or cash value).",
    proofLink: "/zakat",
    proofLinkLabel: "Calculate Sadaqat al-Fitr",
  },
  {
    id: "q-t8-18",
    tier: 8,
    category: "Hanafi Fiqh",
    question:
      "According to Bahar-e-Shariat, when does invalidating a Ramadan fast obligate BOTH Qaza and Kaffarah (fasting 60 consecutive days, or feeding 60 Masakin if unable) rather than Qaza alone?",
    options: [
      "Whenever someone eats or drinks out of pure forgetfulness during Ramadan",
      "When an adult resident intentionally consumes nourishment/medicine or has marital relations in an on-time Ramadan fast without Shar'i excuse",
      "When water accidentally slips down the throat while rinsing the mouth in Wudu",
      "When a missed Ramadan fast from a previous year is broken during its Qaza",
    ],
    correctIdx: 1,
    isharaHint:
      "Pure forgetfulness does not break the fast at all, and accidental Wudu slippage requires Qaza alone without the 60-day Kaffarah.",
    communityPoll: [8, 78, 9, 5],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 5, Kitab as-Sawm) explains that Qaza + Kaffarah applies only when an on-time (Ada) Ramadan fast begun with night Niyyah is deliberately broken by nourishment, medicine, or intimacy without valid excuse.",
    proofLink: "/fiqh",
    proofLinkLabel: "Review Hanafi Roza Rulings",
  },
  {
    id: "q-t8-19",
    tier: 8,
    category: "Hanafi Fiqh",
    question:
      "Who qualifies as a 'Shaikh Fani' permitted to give Fidyah instead of fasting in Hanafi Fiqh, and what is the ruling if a sick person pays Fidyah and later regains health?",
    options: [
      "Any busy worker or traveler; their Fidyah permanently replaces Qaza even after travel ends",
      "Anyone with a seasonal flu; they never need to fast those days after recovery",
      "Only someone of extreme old age or irreversible illness with no hope of recovery; if health returns, Qaza becomes obligatory",
      "Expectant or nursing mothers; Fidyah suffices for them without ever making up missed fasts",
    ],
    correctIdx: 2,
    isharaHint:
      "Fidyah is valid only when inability to fast in any season of life is permanent; temporary illness, travel, pregnancy, or nursing require Qaza when able.",
    communityPoll: [6, 5, 79, 10],
    proofExplanation:
      "In Hanafi Fiqh (Bahar-e-Shariat Vol. 1, Part 5), Fidyah (equivalent to one Sadaqat al-Fitr per fast) is exclusively for a Shaikh Fani incapable of fasting permanently; if strength ever returns, prior Fidyah becomes Nafl Sadaqah and Qaza is Fard.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Sawm & Fidyah Masail",
  },
  {
    id: "q-t8-20",
    tier: 8,
    category: "Hanafi Fiqh",
    question:
      "What is the Hanafi ruling on the Masnoon I'tikaf of the last Ashra (ten days) of Ramadan, and when must the Mu'takif enter the Masjid?",
    options: [
      "Nafl Mustahabb; enter after Fajr Salah on the 21st morning of Ramadan",
      "Fard Ayn on every adult; enter after Tarawih on the 20th night",
      "Wajib on the Imam alone; enter at Dhuhr on the 19th of Ramadan",
      "Sunnah Mu'akkadah alal-Kifayah; enter the Masjid before sunset on the 20th of Ramadan",
    ],
    correctIdx: 3,
    isharaHint:
      "In the Hijri calendar, the 21st night of Ramadan begins at Maghrib (sunset) of the 20th day.",
    communityPoll: [12, 4, 3, 81],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 5) states that last-Ashra Ramadan I'tikaf is Sunnah Mu'akkadah alal-Kifayah (communal Sunnah), and the Mu'takif must be inside the Masjid boundary before sunset on 20 Ramadan until the Eid moon is confirmed.",
    proofLink: "/prayer",
    proofLinkLabel: "Check Maghrib & Ramadan Timings",
  },

  // ============================================================================
  // TIER 9 — 20 Questions (q-t9-01 .. q-t9-20)
  // ============================================================================

  // ---- Tier 9: Aqaid & Seerah (5) ----
  {
    id: "q-t9-01",
    tier: 9,
    category: "Aqaid & Seerah",
    question:
      "According to Ahl-e-Sunnat wal-Jama'at Aqaid, in what state did the Holy Prophet ﷺ experience Al-Isra wal-Mi'raj, and what transpired at Bait al-Maqdis before ascending the heavens?",
    options: [
      "Awake in both blessed physical body and soul, where he led all the Prophets (عليهم السلام) in Salah as Imam al-Anbiya",
      "Solely in a sleeping dream vision while remaining in Umm Hani's house in Makkah",
      "In spirit alone from Makkah to Jerusalem without entering Masjid al-Aqsa",
      "Over a forty-day overland caravan journey accompanied by Sayyiduna Abu Bakr",
    ],
    correctIdx: 0,
    isharaHint:
      "Had it been merely a dream, the Quraysh disbelievers would never have reacted with astonishment when he described Masjid al-Aqsa and their caravans.",
    communityPoll: [82, 9, 6, 3],
    proofExplanation:
      "Bahar-e-Shariat (Part 1, Aqaid) and Al-Aqidah at-Tahawiyyah establish that Al-Isra (to Bait al-Maqdis, where he led all Prophets in prayer) and Al-Mi'raj (above the heavens) occurred awake in physical body and soul in a portion of a night.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Sunni Aqaid on Mi'raj",
  },
  {
    id: "q-t9-02",
    tier: 9,
    category: "Aqaid & Seerah",
    question:
      "On the Night of Mi'raj in the seventh heaven, which celestial sanctuary—aligned above the Ka'bah and entered daily by 70,000 angels who never return—was Prophet Ibrahim (عليه السلام) leaning against before Sidrat al-Muntaha?",
    options: [
      "Hawd al-Kawthar",
      "Al-Bait al-Ma'mur (The Oft-Frequented House)",
      "Jannat al-Firdaws Gate",
      "Maqam-e-Mahmud",
    ],
    correctIdx: 1,
    isharaHint:
      "Just as Prophet Ibrahim built the earthly Ka'bah in Makkah, his lofty station in the seventh heaven rests against the angels' Ka'bah.",
    communityPoll: [7, 79, 8, 6],
    proofExplanation:
      "Sahih al-Bukhari (#3207) and Sahih Muslim (#162) narrate that the Prophet ﷺ saw Prophet Ibrahim (عليه السلام) leaning his back against Al-Bait al-Ma'mur, entered each day by 70,000 new angels, before ascending to Sidrat al-Muntaha.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Shab-e-Mi'raj Significance",
  },
  {
    id: "q-t9-03",
    tier: 9,
    category: "Aqaid & Seerah",
    question:
      "Which two eminent Companions were honored by the Holy Prophet ﷺ with the titles 'Saifullah' (The Drawn Sword of Allah) and 'Amin hadhihil-Ummah' (The Trustworthy Custodian of this Ummah)?",
    options: [
      "Sayyiduna Zubayr ibn al-Awwam and Sayyiduna Sa'd ibn Abi Waqqas",
      "Sayyiduna Talhah ibn Ubaydullah and Sayyiduna Mu'adh ibn Jabal",
      "Sayyiduna Khalid ibn al-Walid and Sayyiduna Abu Ubaidah ibn al-Jarrah",
      "Sayyiduna Amr ibn al-As and Sayyiduna Zayd ibn Harithah",
    ],
    correctIdx: 2,
    isharaHint:
      "The first received his title when rescuing the Muslim army at Mu'tah (8 AH); the second is among the Asharah Mubashsharah.",
    communityPoll: [8, 6, 80, 6],
    proofExplanation:
      "Sahih al-Bukhari (#3757 & #3744) records the Prophet ﷺ naming Sayyiduna Khalid ibn al-Walid 'Saifullah' during the Battle of Mu'tah and declaring Sayyiduna Abu Ubaidah Amir ibn al-Jarrah 'Amin hadhihil-Ummah'.",
    proofLink: "/fiqh",
    proofLinkLabel: "Study Merits of the Sahabah",
  },
  {
    id: "q-t9-04",
    tier: 9,
    category: "Aqaid & Seerah",
    question:
      "Which cousin of the Prophet ﷺ earned the titles 'Hibr al-Ummah' (Scholar of the Ummah) and 'Tarjuman al-Quran', and of whom did the Prophet ﷺ say, 'Salman minna Ahl al-Bayt'?",
    options: [
      "Sayyiduna Ja'far at-Tayyar; spoken regarding Sayyiduna Bilal al-Habashi",
      "Sayyiduna Abdullah ibn Mas'ud; spoken regarding Sayyiduna Suhayb ar-Rumi",
      "Sayyiduna Ubayy ibn Ka'b; spoken regarding Sayyiduna Abu Dharr al-Ghifari",
      "Sayyiduna Abdullah ibn Abbas; spoken regarding Sayyiduna Salman al-Farsi",
    ],
    correctIdx: 3,
    isharaHint:
      "The Prophet ﷺ prayed for his young cousin: 'O Allah, grant him deep understanding in Deen and teach him Ta'wil (Tafsir).'",
    communityPoll: [6, 8, 5, 81],
    proofExplanation:
      "Sahih al-Bukhari (#75) records the Prophet's ﷺ special Dua for Sayyiduna Abdullah ibn Abbas (رضي الله عنهما), making him Hibr al-Ummah; and at Khandaq, when Muhajirun and Ansar both claimed Salman al-Farsi, the Prophet ﷺ honored him: 'Salman is from us, Ahl al-Bayt' (Mustadrak al-Hakim).",
    proofLink: "/quran",
    proofLinkLabel: "Open Tafsir & Kanzul Iman",
  },
  {
    id: "q-t9-05",
    tier: 9,
    category: "Aqaid & Seerah",
    question:
      "Which Ansari Companion—honored as 'Sha'ir ar-Rasul' (Poet of the Messenger ﷺ)—had a pulpit placed for him in Masjid an-Nabawi and received the Prophetic prayer: 'O Allah, aid him with Ruh al-Qudus (Jibril)'?",
    options: [
      "Sayyiduna Hassan ibn Thabit",
      "Sayyiduna Ka'b ibn Malik",
      "Sayyiduna Abdullah ibn Rawahah",
      "Sayyiduna Labid ibn Rabi'ah",
    ],
    correctIdx: 0,
    isharaHint:
      "His immortal verses praising the Holy Prophet ﷺ ('Wa ahsanu minka lam tara qattu ayni...') remain recited across Sunni gatherings worldwide.",
    communityPoll: [79, 9, 8, 4],
    proofExplanation:
      "Sahih al-Bukhari (#453) and Sahih Muslim (#2485) record the Prophet ﷺ praying for Sayyiduna Hassan ibn Thabit (رضي الله عنه) to be supported by Angel Jibril (Ruh al-Qudus) whenever he defended the Prophet's ﷺ honor in poetry.",
    proofLink: "/tasbih",
    proofLinkLabel: "Explore Salawat & Na'at Heritage",
  },

  // ---- Tier 9: Quran & Kanzul Iman (5) ----
  {
    id: "q-t9-06",
    tier: 9,
    category: "Quran & Kanzul Iman",
    question:
      "Which two Surahs of the Holy Quran explicitly describe the two stages of Al-Isra wal-Mi'raj—from Masjid al-Haram to Masjid al-Aqsa in one, and the vision at Sidrat al-Muntaha ('Ma zaghal-basaru wa ma tagha') in the other?",
    options: [
      "Surah Al-Fath (48) and Surah Al-Mulk (67)",
      "Surah Al-Isra / Bani Isra'il (17) and Surah An-Najm (53)",
      "Surah Ya-Sin (36) and Surah Ar-Rahman (55)",
      "Surah Maryam (19) and Surah Al-Waqi'ah (56)",
    ],
    correctIdx: 1,
    isharaHint:
      "Chapter 17 opens with 'Subhanallazi asra bi-abdihi laylan...', while Chapter 53 ('The Star') recounts Sidrat al-Muntaha in verses 13–18.",
    communityPoll: [6, 81, 7, 6],
    proofExplanation:
      "Surah Al-Isra (17:1) proclaims the Night Journey to Masjid al-Aqsa whose surroundings Allah blessed, and Surah An-Najm (53:8–18) depicts the heavenly closeness ('Qaba Qawsayni aw Adna') and Sidrat al-Muntaha.",
    proofLink: "/quran",
    proofLinkLabel: "Read Kanzul Iman Verses",
  },
  {
    id: "q-t9-07",
    tier: 9,
    category: "Quran & Kanzul Iman",
    question:
      "In which Makki Surah does Allah swear consecutive oaths by Mount Tur, an Inscribed Book on unfolded parchment, and 'Wal-Baytil-Ma'mur' (the Oft-Frequented Celestial House)?",
    options: [
      "Surah Adh-Dhariyat (Chapter 51)",
      "Surah Al-Qamar (Chapter 54)",
      "Surah At-Tur (Chapter 52)",
      "Surah Al-Buruj (Chapter 85)",
    ],
    correctIdx: 2,
    isharaHint:
      "The Surah takes its name directly from its very first word, 'Wat-Tur' (52:1), followed by 'Wal-Baytil-Ma'mur' in Ayah 4.",
    communityPoll: [9, 7, 76, 8],
    proofExplanation:
      "Surah At-Tur (52:1–4) swears by Mount Tur, Kitabin Mastur, and Al-Bait al-Ma'mur—the celestial sanctuary in the seventh heaven witnessed by the Prophet ﷺ on the Night of Mi'raj.",
    proofLink: "/quran",
    proofLinkLabel: "Open Surah Index",
  },
  {
    id: "q-t9-08",
    tier: 9,
    category: "Quran & Kanzul Iman",
    question:
      "Surah Al-Baqarah (2:158) declares: 'Indeed, As-Safa and Al-Marwah are among the Sha'a'ir (Sacred Symbols) of Allah.' Whose devoted search for water is honored in the seven circuits of Sa'i between these two hills?",
    options: [
      "Sayyidah Sarah (سلام الله عليها)",
      "Sayyidah Maryam bint Imran (سلام الله عليها)",
      "Sayyidah Asiyah (سلام الله عليها)",
      "Sayyidah Hajar / Hajirah (سلام الله عليها), mother of Prophet Isma'il",
    ],
    correctIdx: 3,
    isharaHint:
      "Following her patient striving seven times between Safa and Marwah, Angel Jibril struck the earth and Zamzam gushed forth.",
    communityPoll: [7, 5, 5, 83],
    proofExplanation:
      "Sahih al-Bukhari (#3364) narrates that Sayyidah Hajar (سلام الله عليها) hastened seven times between Safa and Marwah seeking water for infant Prophet Isma'il (عليه السلام), which Allah immortalized as the rite of Sa'i (Quran 2:158).",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Al-Baqarah 2:158",
  },
  {
    id: "q-t9-09",
    tier: 9,
    category: "Quran & Kanzul Iman",
    question:
      "When Surah Al-Baqarah (2:198) commands Hajj pilgrims: 'Then when you depart from Arafat, remember Allah at Al-Mash'ar al-Haram,' to which sacred Hajj station does Al-Mash'ar al-Haram refer?",
    options: [
      "Muzdalifah (between Arafat and Mina)",
      "Maqam-e-Ibrahim beside the Ka'bah",
      "Masjid al-Khayf in Mina",
      "Miqat Dhul-Hulayfah (Abyar Ali)",
    ],
    correctIdx: 0,
    isharaHint:
      "Pilgrims proceed there right after sunset on 9 Dhu al-Hijjah, spend the night in Dhikr, and perform Wuquf after Fajr on 10 Dhu al-Hijjah.",
    communityPoll: [74, 11, 9, 6],
    proofExplanation:
      "In Sunni Tafsir (Khazain-ul-Irfan on Quran 2:198) and Hanafi Fiqh, Al-Mash'ar al-Haram refers to Muzdalifah (specifically Mount Quzah and the entire plain of Muzdalifah except Wadi Muhassir), where Wuquf after Fajr of 10 Dhu al-Hijjah is Wajib.",
    proofLink: "/quran",
    proofLinkLabel: "Study Hajj Verses in Kanzul Iman",
  },
  {
    id: "q-t9-10",
    tier: 9,
    category: "Quran & Kanzul Iman",
    question:
      "Regarding sacrificial animals (Qurbani / Budn), Surah Al-Hajj (22:37) proclaims: 'Neither their flesh nor their blood ever reaches Allah...'—what does the verse affirm DOES reach Allah?",
    options: [
      "The monetary value of the animal's hide and wool",
      "Rather, it is Taqwa (sincerity and piety) from you that reaches Him",
      "Only the public announcement of the donor's lineage",
      "The number of guests invited to the Eid banquet",
    ],
    correctIdx: 1,
    isharaHint:
      "'Walakin yanaluhut-Taqwa minkum'—sincere devotion of the heart transforms the outward rite into accepted worship.",
    communityPoll: [5, 84, 5, 6],
    proofExplanation:
      "Surah Al-Hajj (22:37) teaches: 'Neither their meat nor their blood reaches Allah, rather it is piety (Taqwa) from you that reaches Him'—underscoring pure Niyyah in Udhiyah/Qurbani.",
    proofLink: "/quran",
    proofLinkLabel: "Open Kanzul Iman Reader",
  },

  // ---- Tier 9: Lives of the Auliya (5) ----
  {
    id: "q-t9-11",
    tier: 9,
    category: "Lives of the Auliya",
    question:
      "Which 5th-century Hijri saint of Lahore Sharif authored 'Kashf al-Mahjub' (Unveiling of the Veiled), the earliest comprehensive Persian treatise harmonizing orthodox Sunni Shari'ah and Tasawwuf?",
    options: [
      "Shaykh Fariduddin Attar Nishapuri",
      "Imam Abul-Qasim al-Qushayri",
      "Data Ganj Bakhsh Sayyid Ali ibn Uthman al-Hujwiri",
      "Khwaja Abdullah Ansari Harawi",
    ],
    correctIdx: 2,
    isharaHint:
      "Khwaja Gharib Nawaz performed Chilla at his blessed shrine in Lahore and proclaimed him 'Ganj Bakhsh, Faiz-e-Alam, Mazhar-e-Nur-e-Khuda'.",
    communityPoll: [7, 6, 81, 6],
    proofExplanation:
      "Hazrat Sayyid Ali ibn Uthman al-Jullabi al-Hujwiri, Data Ganj Bakhsh (رحمة الله عليه, wisal 20 Safar 465 AH), composed Kashf al-Mahjub in Lahore to answer a seeker's questions on Aqaid, Adab, and the 12 classical Sufi schools.",
    proofLink: "/auliya",
    proofLinkLabel: "Read Data Ganj Bakhsh Profile",
  },
  {
    id: "q-t9-12",
    tier: 9,
    category: "Lives of the Auliya",
    question:
      "How many spiritual discourses (Maqalat) comprise 'Futuh al-Ghaib' (Revelations of the Unseen), bequeathed by Ghaus-e-Azam Shaykh Abdul Qadir Jilani (رضي الله عنه) on Tawakkul, Ridha, and purifying the ego?",
    options: [
      "Forty discourses",
      "Sixty-three discourses",
      "One hundred and one discourses",
      "Seventy-eight discourses",
    ],
    correctIdx: 3,
    isharaHint:
      "Passed down with a sacred Wasiyyat to his son Shaykh Sharafuddin Isa, whereas his larger 'Al-Fath ar-Rabbani' contains 62 public Majalis.",
    communityPoll: [12, 9, 8, 71],
    proofExplanation:
      "Futuh al-Ghaib consists of 78 concise, transformative discourses delivered by Sultan-ul-Auliya Shaykh Abdul Qadir Jilani (رضي الله عنه) on stripping away heedlessness, upholding Shari'ah commands, and trusting solely in Allah.",
    proofLink: "/auliya",
    proofLinkLabel: "Open Ghaus-e-Azam Bookshelf",
  },
  {
    id: "q-t9-13",
    tier: 9,
    category: "Lives of the Auliya",
    question:
      "Which encyclopedic Arabic work by Shaykh Abdul Qadir Jilani (رضي الله عنه)—whose full title means 'Sufficient Provision for Seekers of the Path of Truth'—covers Sunni creed, sacred months/nights, Adab, and Tasawwuf?",
    options: [
      "Al-Ghunya li-Talibi Tariq al-Haqq (Ghunyat al-Talibin)",
      "Ihya Ulum ad-Din",
      "Qut al-Qulub",
      "Ar-Risalah al-Qushayriyyah",
    ],
    correctIdx: 0,
    isharaHint:
      "Popularly known across South Asia simply as 'Ghunya-tut-Talibin'.",
    communityPoll: [79, 10, 5, 6],
    proofExplanation:
      "Shaykh Abdul Qadir Jilani (رضي الله عنه) authored Ghunyat al-Talibin to guide sincere Muslims in worship, manners, virtuous nights (including Rajab, Sha'ban, Ramadan, and Eidain), and the path of the Salihin.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Ghunyat al-Talibin Excerpts",
  },
  {
    id: "q-t9-14",
    tier: 9,
    category: "Lives of the Auliya",
    question:
      "Who authored 'Awarif al-Ma'arif', the 63-chapter Arabic classic on Khanqah discipline, spiritual states (Ahwal), and Prophetic character that became a core curriculum text for both Suhrawardi and Chishti masters?",
    options: [
      "Shaykh Muhyiddin Ibn Arabi",
      "Shaykh Shihabuddin Umar as-Suhrawardi",
      "Imam Abu Hamid al-Ghazali",
      "Shaykh Abu Talib al-Makki",
    ],
    correctIdx: 1,
    isharaHint:
      "Baba Farid Ganj Shakar personally taught this Baghdadi Suhrawardi master's book to Hazrat Nizamuddin Auliya in Pakpattan.",
    communityPoll: [9, 75, 11, 5],
    proofExplanation:
      "Shaykh Shihabuddin Umar as-Suhrawardi (رحمة الله عليه, d. 632 AH) penned Awarif al-Ma'arif in Baghdad; its grounded synthesis of Hadith and Tasawwuf made it a foundational manual in Chishti and Suhrawardi Khanqahs alike.",
    proofLink: "/auliya",
    proofLinkLabel: "Browse Classical Sufi Treatises",
  },
  {
    id: "q-t9-15",
    tier: 9,
    category: "Lives of the Auliya",
    question:
      "Which celebrated Persian Malfuzat volume—compiled by the poet Khwaja Amir Hasan Ala Sijzi—chronicles fifteen years of assemblies (707–722 AH) of Mahbub-e-Ilahi Hazrat Nizamuddin Auliya?",
    options: [
      "Anis al-Arwah",
      "Khayr al-Majalis",
      "Fawa'id al-Fu'ad (Morals for the Heart)",
      "Siyar al-Auliya",
    ],
    correctIdx: 2,
    isharaHint:
      "Even Amir Khusrau reportedly wished all his own poetic Diwans could be exchanged for the honor of having compiled this book for their shared Murshid.",
    communityPoll: [9, 8, 76, 7],
    proofExplanation:
      "Fawa'id al-Fu'ad was faithfully recorded between 707 and 722 AH by Amir Hasan Sijzi and personally reviewed by Hazrat Nizamuddin Auliya (رحمة الله عليه) in Delhi Sharif.",
    proofLink: "/auliya",
    proofLinkLabel: "View Hazrat Nizamuddin Auliya Bio",
  },

  // ---- Tier 9: Hanafi Fiqh (5) ----
  {
    id: "q-t9-16",
    tier: 9,
    category: "Hanafi Fiqh",
    question:
      "Between the three forms of Hajj—Ifrad, Tamattu', and Qiran—how is Hajj al-Qiran performed, and which of the three is most virtuous (Afdal) according to Imam Abu Hanifa (رضي الله عنه)?",
    options: [
      "Ifrad combines Umrah and Hajj with two Ihrams, and Ifrad is most virtuous in Hanafi Fiqh",
      "Tamattu' omits Umrah completely, and Tamattu' is most virtuous in Hanafi Fiqh",
      "Qiran releases Ihram after Umrah until 8 Dhu al-Hijjah, while Ifrad is most virtuous",
      "Qiran combines Umrah and Hajj within one continuous Ihram, and Qiran is most virtuous in Hanafi Fiqh",
    ],
    correctIdx: 3,
    isharaHint:
      "In Hanafi Fiqh, ranking of virtue is Qiran first, then Tamattu', then Ifrad—and both Qarin and Mutamatti' (non-Makkan Afaqi) offer Dam-e-Shukr.",
    communityPoll: [10, 4, 12, 74],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 6, Kitab al-Hajj) establishes that Hajj al-Qiran (entering one Ihram from Miqat for both Umrah and Hajj without exiting Ihram in between) is Afdal in the Hanafi Madhhab, followed by Tamattu' and Ifrad.",
    proofLink: "/fiqh",
    proofLinkLabel: "Review Hanafi Hajj Rulings",
  },
  {
    id: "q-t9-17",
    tier: 9,
    category: "Hanafi Fiqh",
    question:
      "According to Bahar-e-Shariat, what are the THREE Fara'id (pillars) of Hajj without which Hajj cannot be valid (and cannot be compensated merely by offering Dam)?",
    options: [
      "Ihram (with intention & Talbiyah), Wuquf-e-Arafah, and Tawaf al-Ziyarah",
      "Ihram, Sa'i between Safa and Marwah, and Rami al-Jamarat at Mina",
      "Wuquf-e-Arafah, Wuquf-e-Muzdalifah, and Halq (shaving the head)",
      "Tawaf al-Qudum, Wuquf-e-Arafah, and Tawaf al-Wada' (Farewell Tawaf)",
    ],
    correctIdx: 0,
    isharaHint:
      "Ihram is the conditional Fard, while staying at Arafah (between Zawal of 9th and dawn of 10th) and the 10th–12th Tawaf al-Ifadah/Ziyarah are the two core Rukns.",
    communityPoll: [78, 10, 7, 5],
    proofExplanation:
      "In Hanafi Fiqh (Bahar-e-Shariat Vol. 1, Part 6), Hajj has 3 Fara'id: Ihram (Shart), Wuquf-e-Arafah (even a moment from Zawal of 9 Dhu al-Hijjah to Subh Sadiq of 10 Dhu al-Hijjah), and Tawaf al-Ziyarah.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Fara'id & Wajibat of Hajj",
  },
  {
    id: "q-t9-18",
    tier: 9,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Fiqh, what is the status of crossing the Miqat in Ihram, Wuquf-e-Muzdalifah, Rami al-Jamarat, Sa'i between Safa & Marwah, and Halq/Taqsir, and what is required if one is omitted without excuse?",
    options: [
      "All are Sunnah Mustahabbah; omitting them carries no penalty or expiation",
      "All are Wajibat of Hajj; omitting one does not void Hajj itself, but makes offering a Dam (sacrifice inside the Haram) Wajib",
      "All are Fara'id; omitting any single one completely invalidates the Hajj",
      "All are Nafl acts whose omission is repaired by two Rak'ahs of Sajda-e-Sahw",
    ],
    correctIdx: 1,
    isharaHint:
      "Unlike Shafi'i Fiqh where Sa'i is a Rukn (Fard), Hanafi Fiqh classifies Sa'i, Muzdalifah, Rami, Halq/Taqsir, and Tawaf al-Sadr as Wajibat.",
    communityPoll: [6, 76, 14, 4],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 6) classifies Miqat Ihram, Wuquf-e-Muzdalifah, Rami, Halq/Taqsir (inside the Haram during Days of Nahr), Sa'i, and Tawaf al-Wada' (for Afaqi) as Wajibat; leaving a Wajib without excuse obligates Dam.",
    proofLink: "/fiqh",
    proofLinkLabel: "Open Hanafi Fiqh Studio",
  },
  {
    id: "q-t9-19",
    tier: 9,
    category: "Hanafi Fiqh",
    question:
      "In the Hanafi Madhhab—which normally prohibits combining two Fard prayers in one prayer time—where and how is 'Jam' Baynas-Salatayn' (true combining) Wajib during Hajj?",
    options: [
      "Combining Fajr and Dhuhr at Mina on 8 Dhu al-Hijjah",
      "Combining Asr and Maghrib at Arafat before sunset",
      "Combining Maghrib and Isha at Isha time in Muzdalifah (night of 10 Dhu al-Hijjah) with one Azan and one Iqamah",
      "Combining Dhuhr, Asr, and Maghrib while traveling on any highway",
    ],
    correctIdx: 2,
    isharaHint:
      "At Arafat, Dhuhr and Asr are combined at Dhuhr time only for congregants behind the Sultan/Imam of Hajj, whereas delaying Maghrib to Isha time at Muzdalifah applies to every pilgrim.",
    communityPoll: [5, 11, 75, 9],
    proofExplanation:
      "In Hanafi Fiqh (Bahar-e-Shariat Vol. 1, Part 6), on the night of 10 Dhu al-Hijjah pilgrims do not pray Maghrib on the road from Arafat, but delay and combine Maghrib + Isha at Isha time in Muzdalifah with one Azan and one Iqamah.",
    proofLink: "/prayer",
    proofLinkLabel: "View Hanafi Prayer Windows",
  },
  {
    id: "q-t9-20",
    tier: 9,
    category: "Hanafi Fiqh",
    question:
      "Upon whom is Qurbani (Udhiyah) Wajib during 10–12 Dhu al-Hijjah in Hanafi Fiqh, and how many shares are permissible in cattle/buffalo or camel versus a goat/sheep?",
    options: [
      "Sunnah Mu'akkadah on every household collectively; 10 shares in a camel and 5 in a cow",
      "Wajib even on Shar'i travelers (Musafirs); 3 shares in a goat and 7 in a cow",
      "Fard once in a lifetime like Hajj; 7 shares in both sheep and cattle",
      "Wajib individually on every sane, adult, resident (Muqim) Muslim owning Nisab; 1 share in a goat/sheep and up to 7 shares in a cow/buffalo or camel",
    ],
    correctIdx: 3,
    isharaHint:
      "Unlike Zakat, Qurbani Nisab does NOT require a full lunar year (Hawl)—and Qurbani is waived for a Shar'i Musafir.",
    communityPoll: [10, 4, 5, 81],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 3, Part 15, Udhiyah) states Qurbani is Wajib individually (not one per whole household) on every sane, adult, Muqim Muslim owning Nisab between dawn of 10th and sunset of 12th Dhu al-Hijjah; sheep/goats (1 yr) count as 1 share, cattle/buffalo (2 yrs) and camels (5 yrs) up to 7 shares.",
    proofLink: "/zakat",
    proofLinkLabel: "Check Nisab Thresholds",
  },

  // ============================================================================
  // TIER 10 — 20 Questions (q-t10-01 .. q-t10-20) — SAFE CHECKPOINT 2
  // ============================================================================

  // ---- Tier 10: Aqaid & Seerah (5) ----
  {
    id: "q-t10-01",
    tier: 10,
    category: "Aqaid & Seerah",
    question:
      "Which two great 3rd/4th-century Hijri Imams codified the orthodox theological creed (Ilm al-Kalam) of Ahl-e-Sunnat wal-Jama'at across the Hanafi, Shafi'i, and Maliki traditions?",
    options: [
      "Imam Abu Mansur al-Maturidi and Imam Abul-Hasan al-Ash'ari",
      "Imam Ibn Hazm az-Zahiri and Imam Dawud az-Zahiri",
      "Imam Wasil ibn Ata and Imam Amr ibn Ubayd",
      "Imam Ibn Jarir at-Tabari and Imam al-Layth ibn Sa'd",
    ],
    correctIdx: 0,
    isharaHint:
      "One taught in Samarkand following Imam Abu Hanifa's theological treatises, while the other championed Sunni creed in Basra and Baghdad.",
    communityPoll: [78, 8, 6, 8],
    proofExplanation:
      "Throughout Islamic history, Ahl-e-Sunnat wal-Jama'at is represented in theology by the Maturidi school (Imam Abu Mansur al-Maturidi, d. 333 AH) and the Ash'ari school (Imam Abul-Hasan al-Ash'ari, d. 324 AH), harmonious in core Sunni doctrine.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Hanafi-Maturidi Aqaid",
  },
  {
    id: "q-t10-02",
    tier: 10,
    category: "Aqaid & Seerah",
    question:
      "Which 3rd/4th-century Egyptian Hanafi Hadith master (239–321 AH) authored 'Al-Aqidah at-Tahawiyyah', opening it as an exposition of the creed of Imam Abu Hanifa, Imam Abu Yusuf, and Imam Muhammad?",
    options: [
      "Imam Badruddin al-Ayni",
      "Imam Abu Ja'far Ahmad ibn Muhammad at-Tahawi",
      "Imam Kamaluddin Ibn al-Humam",
      "Imam Shams al-A'immah as-Sarakhsi",
    ],
    correctIdx: 1,
    isharaHint:
      "He also authored 'Sharh Ma'ani al-Athar' demonstrating the rigorous Hadith proofs of Hanafi jurisprudence.",
    communityPoll: [9, 76, 8, 7],
    proofExplanation:
      "Imam Abu Ja'far at-Tahawi (رحمة الله عليه) penned Al-Aqidah at-Tahawiyyah in Egypt as a universally accepted creedal summary of Ahl as-Sunnah wal-Jama'ah upon the way of Imam Abu Hanifa and his two Sahibayn.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Classical Sunni Aqaid",
  },
  {
    id: "q-t10-03",
    tier: 10,
    category: "Aqaid & Seerah",
    question:
      "On 9 Dhu al-Hijjah 10 AH during Hajjat al-Wada' (the Farewell Pilgrimage), where did the Holy Prophet ﷺ deliver his historic Khutbat al-Wada' to over 100,000 Companions, abolishing Riba and Jahiliyyah blood feuds?",
    options: [
      "Inside Masjid an-Nabawi prior to departing Madinah",
      "At Hudaybiyyah beside the tree of Bay'at al-Ridwan",
      "In Wadi Uranah on the plain of Arafat, mounted upon his she-camel Al-Qaswa",
      "Upon the summit of Mount Safa immediately after Umrah",
    ],
    correctIdx: 2,
    isharaHint:
      "Delivered just past midday before combining Dhuhr and Asr for Wuquf-e-Arafah, with Rabi'ah ibn Umayyah repeating each sentence aloud to the vast gathering.",
    communityPoll: [6, 5, 79, 10],
    proofExplanation:
      "Sahih Muslim (#1218, Hadith of Jabir رضي الله عنه) recounts that on 9 Dhu al-Hijjah 10 AH in Wadi Uranah at Arafat, the Prophet ﷺ declared the inviolable sanctity of Muslim life, wealth, and honor, abolished pre-Islamic usury, and commended rights of women and adherence to Allah's Book.",
    proofLink: "/auliya",
    proofLinkLabel: "View Sacred Dhu al-Hijjah Dates",
  },
  {
    id: "q-t10-04",
    tier: 10,
    category: "Aqaid & Seerah",
    question:
      "Which verse of Surah Al-Ma'idah was revealed on Friday afternoon at Arafah during Hajjat al-Wada' (10 AH), prompting Sayyiduna Umar (رضي الله عنه) to note that it descended on two Eids (Jumu'ah and Arafah)?",
    options: [
      "Surah Al-Ma'idah 5:6 on the four obligations of Wudu and Tayammum",
      "Surah Al-Ma'idah 5:35 commanding believers to seek Wasilah unto Allah",
      "Surah Al-Ma'idah 5:55 affirming Wilayat of Allah and His Messenger",
      "Surah Al-Ma'idah 5:3: 'Today I have perfected your religion for you and completed My favor upon you'",
    ],
    correctIdx: 3,
    isharaHint:
      "'Al-yawma akmaltu lakum dinakum wa atmamtu alaykum ni'mati wa raditu lakumul-Islama dina.'",
    communityPoll: [6, 8, 5, 81],
    proofExplanation:
      "Sahih al-Bukhari (#45) narrates from Sayyiduna Umar ibn al-Khattab (رضي الله عنه) that he knew the exact place and hour Surah Al-Ma'idah (5:3) descended upon the Prophet ﷺ while standing at Arafah on a Friday.",
    proofLink: "/quran",
    proofLinkLabel: "Read Surah Al-Ma'idah in Kanzul Iman",
  },
  {
    id: "q-t10-05",
    tier: 10,
    category: "Aqaid & Seerah",
    question:
      "Which Hadith Imam compiled 'Ash-Shama'il al-Muhammadiyyah' (Shamail-e-Tirmidhi) in 56 chapters dedicated to the blessed countenance, Muhr-e-Nubuwwat, attire, fragrance, worship, and noble character of the Prophet ﷺ?",
    options: [
      "Imam Abu Isa Muhammad ibn Isa at-Tirmidhi",
      "Qadi Iyad al-Yahsubi",
      "Imam Jalaluddin as-Suyuti",
      "Imam Yusuf ibn Isma'il an-Nabhani",
    ],
    correctIdx: 0,
    isharaHint:
      "Author of one of the Sihah Sittah from Tirmidh (Transoxiana, d. 279 AH), whose 415 narrations bring the reader into the luminous presence of Mustafa ﷺ.",
    communityPoll: [80, 11, 5, 4],
    proofExplanation:
      "Imam Abu Isa at-Tirmidhi (رحمة الله عليه) compiled Ash-Shama'il al-Muhammadiyyah in 56 chapters, treasured across Sunni seminaries and homes as the premier Hadith portrait of the Beloved Prophet ﷺ.",
    proofLink: "/tasbih",
    proofLinkLabel: "Send Salawat Upon the Prophet ﷺ",
  },

  // ---- Tier 10: Quran & Kanzul Iman (5) ----
  {
    id: "q-t10-06",
    tier: 10,
    category: "Quran & Kanzul Iman",
    question:
      "In the rules of Tajweed, when a Noon Sakinah (نْ) or Tanween is immediately followed by the letter Ba (ب)—as in 'Min Ba'di' (مِنْ بَعْدِ)—which rule applies?",
    options: [
      "Izhar-e-Halqi (pronouncing Noon clearly from the tongue tip without Ghunnah)",
      "Iqlab (converting the Noon sound into a concealed Meem with nasal Ghunnah)",
      "Idgham Bila Ghunnah (merging completely without any nasalization)",
      "Madd Lazim (stretching the vowel for six full counts)",
    ],
    correctIdx: 1,
    isharaHint:
      "Often marked in Mushafs by a tiny superscript Meem (م) above the Noon Sakinah before the labial letter Ba.",
    communityPoll: [9, 75, 11, 5],
    proofExplanation:
      "In Tajweed, Ba (ب) is the sole letter of Iqlab: whenever Noon Sakinah or Tanween precedes Ba, it turns into a hidden Meem accompanied by two counts of Ghunnah.",
    proofLink: "/quran",
    proofLinkLabel: "Practice Tajweed in Quran Reader",
  },
  {
    id: "q-t10-07",
    tier: 10,
    category: "Quran & Kanzul Iman",
    question:
      "In Tajweed of Noon Sakinah and Tanween, which rule governs the six throat letters (ء هـ ع ح غ خ), and which rule governs the six letters of the mnemonic 'Yarmaloon' (يَرْمَلُونَ)?",
    options: [
      "Throat letters trigger Idgham; 'Yarmaloon' triggers Izhar",
      "Throat letters trigger Ikhfa; 'Yarmaloon' triggers Qalqalah",
      "Throat letters trigger Izhar-e-Halqi (clear pronunciation); 'Yarmaloon' triggers Idgham (merging)",
      "Both groups trigger Iqlab with a four-harakah Madd",
    ],
    correctIdx: 2,
    isharaHint:
      "Within 'Yarmaloon', 'Yanmoo' (ي ن م و) merges WITH Ghunnah, whereas Lam and Ra (ل ر) merge WITHOUT Ghunnah.",
    communityPoll: [10, 6, 76, 8],
    proofExplanation:
      "After Noon Sakinah or Tanween, the 6 throat letters (Huruf-e-Halqi) require Izhar (clear articulation without added Ghunnah), while the 6 letters of Yarmaloon require Idgham (with Ghunnah in ي ن م و, and without Ghunnah in ل ر).",
    proofLink: "/quran",
    proofLinkLabel: "Open Audio Tilawat & Mushaf",
  },
  {
    id: "q-t10-08",
    tier: 10,
    category: "Quran & Kanzul Iman",
    question:
      "After accounting for 6 letters of Izhar, 6 letters of Idgham, and 1 letter of Iqlab, how many Arabic letters remain for 'Ikhfa-e-Haqiqi' (nasal concealment with Ghunnah)?",
    options: [
      "Ten letters",
      "Twelve letters",
      "Eighteen letters",
      "Fifteen letters",
    ],
    correctIdx: 3,
    isharaHint:
      "Subtract 6 + 6 + 1 = 13 from the 28 consonant letters of the Arabic alphabet (excluding pure Alif Maddiyyah).",
    communityPoll: [9, 12, 7, 72],
    proofExplanation:
      "Ikhfa-e-Haqiqi applies before the remaining 15 letters (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك), articulated between Izhar and Idgham with two harakahs of light or heavy Ghunnah matching the following letter.",
    proofLink: "/quran",
    proofLinkLabel: "Listen to Recitation in Quran Studio",
  },
  {
    id: "q-t10-09",
    tier: 10,
    category: "Quran & Kanzul Iman",
    question:
      "Which classical five-letter Arabic phrase gathers all five letters of 'Qalqalah' (echoing rebound when pronounced with Sukoon, as in 'Qul Huwallahu Ahad')?",
    options: [
      "Qutbu Jaddin (قُطْبُ جَدٍّ — ق ط ب ج د)",
      "Khussa Daghtin Qiz (خُصَّ ضَغْطٍ قِظْ)",
      "Huroof-e-Leen (و ي)",
      "Saktah Latifah (س ك ت)",
    ],
    correctIdx: 0,
    isharaHint:
      "Notice the final letters of the first four verses of Surah Al-Ikhlas (د) and Surah Al-Falaq (ق، ب، د).",
    communityPoll: [78, 11, 6, 5],
    proofExplanation:
      "Imam Ibn al-Jazari collected the five Qalqalah letters in 'Qutbu Jaddin' (ق ط ب ج د); when vowelless (Sakin), especially on stopping (Qalqalah Kubra), they produce a crisp echoing release without adding a vowel.",
    proofLink: "/quran",
    proofLinkLabel: "Recite Surah Al-Ikhlas & Al-Falaq",
  },
  {
    id: "q-t10-10",
    tier: 10,
    category: "Quran & Kanzul Iman",
    question:
      "In Tajweed, what is the rule called when a Madd letter (ا و ي) is followed by a Hamzah (ء) within the SAME single word—such as 'Ja'a' (جَاءَ) or 'As-Sama'' (السَّمَاءِ)?",
    options: [
      "Madd Tabi'i / Asli (Natural 2-count elongation)",
      "Madd Wajib Muttasil (Connected Obligatory Elongation of 4–5 counts)",
      "Madd Ja'iz Munfasil (Detached Permissible Elongation across two words)",
      "Madd 'Iwad (Substitute 2-count stop on Fathatayn)",
    ],
    correctIdx: 1,
    isharaHint:
      "'Muttasil' means connected inside one word (making stretching Wajib), whereas 'Munfasil' occurs when the Madd ends one word and Hamzah starts the next.",
    communityPoll: [9, 71, 15, 5],
    proofExplanation:
      "When a Madd letter and Hamzah meet inside one word (e.g., السَّمَاءِ or سُوءَ), it is Madd Wajib Muttasil, stretched obligatorily to 4–5 harakahs in the transmission of Hafs 'an Asim.",
    proofLink: "/quran",
    proofLinkLabel: "Open Kanzul Iman & Audio Player",
  },

  // ---- Tier 10: Lives of the Auliya (5) ----
  {
    id: "q-t10-11",
    tier: 10,
    category: "Lives of the Auliya",
    question:
      "Where is the resting sanctuary (Mazar Sharif) of Sadr-ush-Shariah, Badr-ut-Tariqah Allama Mufti Muhammad Amjad Ali Aazmi (wisal 2 Dhu al-Qi'dah 1367 AH / 1948 CE), author of Bahar-e-Shariat?",
    options: [
      "Muradabad Sharif (Uttar Pradesh)",
      "Pilibhit Sharif (Uttar Pradesh)",
      "Ghosi Sharif (Mau, Uttar Pradesh)",
      "Mubarakpur (Azamgarh, Uttar Pradesh)",
    ],
    correctIdx: 2,
    isharaHint:
      "His ancestral town in Mau district (formerly Azamgarh region) hosts his annual Urs on 2 Dhu al-Qi'dah.",
    communityPoll: [10, 6, 73, 11],
    proofExplanation:
      "Sadr-ush-Shariah Mufti Amjad Ali Aazmi (رحمة الله عليه, 1296–1367 AH), chief Qazi and premier Khalifa of Ala Hazrat, passed away en route to Hajj in 1367 AH and was laid to rest in his hometown of Ghosi Sharif.",
    proofLink: "/fiqh",
    proofLinkLabel: "Browse Bahar-e-Shariat Compendium",
  },
  {
    id: "q-t10-12",
    tier: 10,
    category: "Lives of the Auliya",
    question:
      "How many parts (Hissay) of the monumental Hanafi encyclopedia 'Bahar-e-Shariat' did Sadr-ush-Shariah personally author—opening Part 1 with Aqaid-e-Ahl-e-Sunnat—before his disciples completed the remaining 3 parts?",
    options: [
      "Ten parts out of thirteen",
      "Twelve parts out of fifteen",
      "Fourteen parts out of seventeen",
      "Seventeen parts personally authored (with Parts 18–20 completed to make 20 parts)",
    ],
    correctIdx: 3,
    isharaHint:
      "He pledged to compile 20 parts covering every chapter of Al-Hidayah and Durr al-Mukhtar in accessible Urdu; he completed 17 before his Wisal.",
    communityPoll: [8, 10, 12, 70],
    proofExplanation:
      "Under Ala Hazrat's encouragement, Sadr-ush-Shariah Mufti Amjad Ali Aazmi (رحمة الله عليه) personally penned Parts 1–17 of Bahar-e-Shariat (reviewed initially by Ala Hazrat himself), and his learned disciples completed Parts 18–20.",
    proofLink: "/fiqh",
    proofLinkLabel: "Explore Bahar-e-Shariat Chapters",
  },
  {
    id: "q-t10-13",
    tier: 10,
    category: "Lives of the Auliya",
    question:
      "Which 4th-century Hijri Hanafi Imam of Samarkand—honored as 'Imam al-Huda' (wisal 333 AH)—authored 'Kitab at-Tawhid' and 'Ta'wilat Ahl as-Sunnah' to champion orthodox Sunni creed?",
    options: [
      "Imam Abu Mansur Muhammad al-Maturidi",
      "Imam Abul-Mu'in an-Nasafi",
      "Imam Najmuddin Umar an-Nasafi",
      "Imam Burhanuddin al-Marghinani",
    ],
    correctIdx: 0,
    isharaHint:
      "Resting in Chokardiza in Samarkand, his theological school forms the creedal backbone of the Hanafi world.",
    communityPoll: [79, 8, 7, 6],
    proofExplanation:
      "Imam al-Huda Abu Mansur al-Maturidi as-Samarqandi (رحمة الله عليه, d. 333 AH) authored Kitab at-Tawhid and the Quranic commentary Ta'wilat Ahl as-Sunnah, refuting heterodox sects through revelation and sound reason.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Hanafi-Maturidi Heritage",
  },
  {
    id: "q-t10-14",
    tier: 10,
    category: "Lives of the Auliya",
    question:
      "Which younger son and spiritual successor of Ala Hazrat—revered worldwide as 'Huzoor Mufti-e-Azam-e-Hind' (1310–1402 AH, Bareilly Sharif)—issued thousands of Fatawa and authored the poetic Diwan 'Saman-e-Bakhshish'?",
    options: [
      "Hujjat-ul-Islam Allama Hamid Raza Khan",
      "Huzoor Mufti-e-Azam Allama Mustafa Raza Khan Qadri",
      "Tajush-Shariah Allama Akhtar Raza Khan Azhari",
      "Mufassir-e-Azam Allama Ibrahim Raza Khan",
    ],
    correctIdx: 1,
    isharaHint:
      "Born in 1310 AH with glad tidings from Marehra Sharif, his Urs is commemorated on 14 Muharram in Bareilly Sharif.",
    communityPoll: [10, 77, 9, 4],
    proofExplanation:
      "Huzoor Mufti-e-Azam-e-Hind Shaykh Mustafa Raza Khan Qadri Barakati (رحمة الله عليه, 1892–1981 CE) guided millions in Taqwa and Hanafi Ifta for over six decades and composed Saman-e-Bakhshish.",
    proofLink: "/auliya",
    proofLinkLabel: "View Bareilly Sharif Sanctuary",
  },
  {
    id: "q-t10-15",
    tier: 10,
    category: "Lives of the Auliya",
    question:
      "Which royal ruler of Simnan (Iran) renounced his crown to take Chishti Bay'at under Shaykh Ala-ul-Haq Pandawi in Bengal and rests at Kichaucha Sharif (wisal 28 Muharram 808 AH), leaving behind 'Lata'if-e-Ashrafi'?",
    options: [
      "Hazrat Ibrahim ibn Adham Balkhi",
      "Makhdoom Sharafuddin Ahmad Yahya Maneri",
      "Sultan-ut-Tarikin Makhdoom Sayyid Ashraf Jahangir Simnani",
      "Hazrat Shah Mina Lakhnawi",
    ],
    correctIdx: 2,
    isharaHint:
      "Founder of the Ashrafi Chishti-Qadri spiritual order in Kichaucha Sharif, whose discourses were compiled by Nizam Yamani.",
    communityPoll: [9, 8, 76, 7],
    proofExplanation:
      "Hazrat Makhdoom Sultan Sayyid Ashraf Jahangir Simnani (رحمة الله عليه, d. 808 AH) abdicated the throne of Simnan upon a spiritual sign from Sayyiduna Khidr, trained in Pandua (Bengal), and illuminated Kichaucha Sharif.",
    proofLink: "/auliya",
    proofLinkLabel: "Explore Auliya Directory",
  },

  // ---- Tier 10: Hanafi Fiqh (5) ----
  {
    id: "q-t10-16",
    tier: 10,
    category: "Hanafi Fiqh",
    question:
      "In Hanafi Fiqh (Bahar-e-Shariat), who is a 'Sahib-e-Tartib' obligated to pray missed Qaza before the current Ada Salah, and what are the three situations that waive Tartib?",
    options: [
      "Anyone with fewer than 30 missed prayers; waived only during travel or sickness",
      "Anyone who has never missed a Jumu'ah; waived only on the two days of Eid",
      "Anyone with 10 or fewer missed prayers; waived only if praying behind an Imam",
      "Anyone owing fewer than 6 missed Fard/Witr prayers; Tartib is waived by forgetfulness, narrow prayer time, or missed prayers reaching 6+",
    ],
    correctIdx: 3,
    isharaHint:
      "Six prayers equal one full day-and-night cycle of the 5 Fard prayers plus Wajib Witr (or 6 Fard prayers); below 6, sequence (Tartib) is Fard.",
    communityPoll: [10, 5, 11, 74],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 4, Qaza) defines Sahib-e-Tartib as one who has fewer than 6 missed prayers (including Witr) due; Tartib drops in three cases: forgetting the Qaza, fear of the current Ada time expiring (Tang-e-Waqt), or missed prayers reaching 6.",
    proofLink: "/tasbih",
    proofLinkLabel: "Open Qaza-e-Umri Tracker",
  },
  {
    id: "q-t10-17",
    tier: 10,
    category: "Hanafi Fiqh",
    question:
      "When fulfilling extensive past missed prayers (Qaza-e-Umri) in Hanafi Fiqh, how many daily Rak'ahs are obligatory to make up per missed day, and how is Niyyah made when exact dates are unknown?",
    options: [
      "20 Rak'ahs per day (17 Fard + 3 Wajib Witr), intending 'the first (or last) missed Fajr/Dhuhr/etc. due upon me', avoiding the 3 Makruh windows",
      "17 Rak'ahs of Fard only (Witr has no Qaza), offered exclusively right after Jumu'ah on the last Friday of Ramadan",
      "32 Rak'ahs including all Sunnah Mu'akkadah prayers, valid even during sunrise and Zawal",
      "2 Rak'ahs of general Nafl repentance per missed week without specifying prayer names",
    ],
    correctIdx: 0,
    isharaHint:
      "Every missed Fard and Wajib Witr remains a binding debt until individually prayed; there is no single 'Kaffarah Salah' on Jumu'at-ul-Wida that erases years of Qaza.",
    communityPoll: [75, 14, 7, 4],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 4) and Fatawa Razawiyya emphasize that each day's Qaza-e-Umri consists of 20 Rak'ahs (2 Fajr + 4 Dhuhr + 4 Asr + 3 Maghrib + 4 Isha + 3 Witr), intended as 'the first missed [prayer] upon me' at any non-Makruh time.",
    proofLink: "/tasbih",
    proofLinkLabel: "Manage Qaza-e-Umri Ledger",
  },
  {
    id: "q-t10-18",
    tier: 10,
    category: "Hanafi Fiqh",
    question:
      "Under Hanafi Fiqh, what classical journey threshold (Masafat-e-Safar) makes a traveler a Shar'i Musafir, and what minimum intended stay at one place makes him a Muqim (resident)?",
    options: [
      "Setting out for 16 Shar'i miles (~25 km); intending to stay 4 full days makes one Muqim",
      "Setting out for 3 Manzils / 48 Shar'i miles (~77.25 km; 57.5 English miles in Bahar-e-Shariat); intending a continuous 15-day stay at one place makes one Muqim",
      "Setting out for 100 Farsakhs (~500 km); intending a 40-day stay makes one Muqim",
      "Any journey lasting past Maghrib; intending a 3-day stay makes one Muqim",
    ],
    correctIdx: 1,
    isharaHint:
      "Unlike the 4-day Shafi'i rule, Imam Abu Hanifa stipulates a 15-day continuous intention of Iqamah at a single town/city.",
    communityPoll: [12, 76, 5, 7],
    proofExplanation:
      "In Hanafi Fiqh, once a traveler exits town boundaries intending three Manzils / 48 Shar'i miles (~77.25 km in common reckoning; calculated as 57.5 English miles / ~92.5 km in Bahar-e-Shariat Vol. 1, Part 4), Qasr applies unless intending a 15-day stay in one place.",
    proofLink: "/prayer",
    proofLinkLabel: "View Travel & Prayer Guidance",
  },
  {
    id: "q-t10-19",
    tier: 10,
    category: "Hanafi Fiqh",
    question:
      "For a Shar'i Musafir in Hanafi Fiqh, what is the ruling on Qasr for Dhuhr, Asr, and Isha when praying alone, and what must a Musafir do when joining a resident (Muqim) Imam in an on-time 4-Rak'ah Fard prayer?",
    options: [
      "Qasr is optional (Rukhsah); praying 4 Rak'ahs alone is more rewarding than 2",
      "Fajr, Maghrib, and Witr are also halved, even behind a resident Imam",
      "Shortening 4-Rak'ah Fard prayers to 2 Rak'ahs alone is Wajib (Fajr 2, Maghrib 3, Witr 3 stay unchanged), but behind a Muqim Imam in Ada time he must pray all 4 Rak'ahs",
      "A Musafir is forbidden from praying behind a Muqim Imam and must pray 2 Rak'ahs separately",
    ],
    correctIdx: 2,
    isharaHint:
      "In Hanafi Fiqh, Allah's concession of 2 Rak'ahs for a traveler is obligatory ('Azimah/Wajib), yet following a Muqim Imam in Ada time elevates the follower's duty back to 4.",
    communityPoll: [14, 4, 74, 8],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 4, Salat al-Musafir) rules that Qasr (2 Rak'ahs for Dhuhr, Asr, Isha) is Wajib upon a Musafir praying alone—deliberately praying 4 without sitting at the 2nd invalidates Fard—while following a Muqim Imam in Ada time obligates completing 4 Rak'ahs.",
    proofLink: "/fiqh",
    proofLinkLabel: "Read Musafir & Qasr Masail",
  },
  {
    id: "q-t10-20",
    tier: 10,
    category: "Hanafi Fiqh",
    question:
      "According to Bahar-e-Shariat, among upright Sunni Muslim men of sound creed (where no sovereign/appointed Imam is fixed), who holds first priority for Imamat, and when does a latecomer (Masbuq) catch a Rak'ah?",
    options: [
      "The oldest person by age comes first; a Masbuq catches the Rak'ah if he joins before the second Sajdah",
      "The wealthiest donor comes first; a Masbuq catches the Rak'ah only if he hears Surah Al-Fatihah",
      "The loudest voice comes first; a Masbuq catches the Rak'ah if he joins during Qaumah after Ruku",
      "The most knowledgeable in rulings of Salah & Taharah (with sound Tajweed) comes first; a Masbuq catches the Rak'ah by joining the Imam in Ruku",
    ],
    correctIdx: 3,
    isharaHint:
      "Priority order in Hanafi Fiqh is: A'lam (most learned in Salah fiqh) → Aqra' (best Tajweed reciter) → Awra' (most pious) → Asann (eldest); and 'Idrak ar-Ruku' counts as catching the Rak'ah.",
    communityPoll: [9, 3, 8, 80],
    proofExplanation:
      "Bahar-e-Shariat (Vol. 1, Part 3, Imamat) places the A'lam (most learned in Taharah/Salah laws with valid Qira'at and Sunni Aqaid) ahead of Aqra', Awra', and Asann; and a Masbuq who joins Takbir-e-Tahrimah standing and shares even a moment of Ruku with the Imam catches that Rak'ah.",
    proofLink: "/fiqh",
    proofLinkLabel: "Review Hanafi Imamat & Jama'at Rules",
  },
];
