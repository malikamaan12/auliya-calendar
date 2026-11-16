"use client";

import { assetUrl } from "./assets";

export type HadithBookCategory =
  | "Sihah Sittah (Six Canonical Books)"
  | "Muwatta & Hanafi Musnad"
  | "Arba'in & Hadith Qudsi";

export interface HadithBookMeta {
  id: string;
  title: string;
  arabicTitle: string;
  urduTitle: string;
  compiler: string;
  eraHijri: string;
  category: HadithBookCategory;
  totalHadiths: number;
  totalSections: number;
  hasUrduEdition: boolean;
  isBuiltInAnthology?: boolean;
  engEdition?: string;
  araEdition?: string;
  urdEdition?: string;
  sunniIntro: string;
}

export const HADITH_BOOKS: HadithBookMeta[] = [
  {
    id: "sunni-anthology",
    title: "Sunni Hanafi Anthology (Musnad & Mishkat)",
    arabicTitle: "المنتخب من المسند والمشكاة",
    urduTitle: "منتخب مسند امام اعظم و مشکوٰۃ المصابیح",
    compiler: "Imam Abu Hanifa, Imam Khatib Tabrizi & Classical Muhaddithin",
    eraHijri: "150–741 AH",
    category: "Muwatta & Hanafi Musnad",
    totalHadiths: 30,
    totalSections: 8,
    hasUrduEdition: true,
    isBuiltInAnthology: true,
    sunniIntro:
      "Curated offline collection of foundational Sunni Hadiths with Arabic, English, Urdu, and Ahl-e-Sunnat Hanafi-Maturidi commentary from Mir'at-ul-Manajih, Ashi'at-ul-Lama'at, and Umdat al-Qari.",
  },
  {
    id: "bukhari",
    title: "Sahih al-Bukhari",
    arabicTitle: "صحيح البخاري",
    urduTitle: "صحیح البخاری",
    compiler: "Imam Muhammad ibn Isma'il al-Bukhari",
    eraHijri: "194–256 AH",
    category: "Sihah Sittah (Six Canonical Books)",
    totalHadiths: 7589,
    totalSections: 97,
    hasUrduEdition: true,
    engEdition: "eng-bukhari",
    araEdition: "ara-bukhari",
    urdEdition: "urd-bukhari",
    sunniIntro:
      "Al-Jami' al-Musnad as-Sahih — universally revered as the most authentic book after the Holy Quran; expounded in the monumental Hanafi commentary Umdat al-Qari by Imam Badruddin al-'Ayni.",
  },
  {
    id: "muslim",
    title: "Sahih Muslim",
    arabicTitle: "صحيح مسلم",
    urduTitle: "صحیح مسلم",
    compiler: "Imam Muslim ibn al-Hajjaj an-Naysaburi",
    eraHijri: "204–261 AH",
    category: "Sihah Sittah (Six Canonical Books)",
    totalHadiths: 7563,
    totalSections: 57,
    hasUrduEdition: true,
    engEdition: "eng-muslim",
    araEdition: "ara-muslim",
    urdEdition: "urd-muslim",
    sunniIntro:
      "Renowned for its unrivalled arrangement of Mutaba'at and Shawahid chains in a single place; commented upon by Imam an-Nawawi and Allama Ghulam Rasool Saeedi (Sharh Sahih Muslim).",
  },
  {
    id: "tirmidhi",
    title: "Jami' at-Tirmidhi",
    arabicTitle: "جامع الترمذي",
    urduTitle: "جامع الترمذی",
    compiler: "Imam Abu 'Isa Muhammad ibn 'Isa at-Tirmidhi",
    eraHijri: "209–279 AH",
    category: "Sihah Sittah (Six Canonical Books)",
    totalHadiths: 3998,
    totalSections: 49,
    hasUrduEdition: true,
    engEdition: "eng-tirmidhi",
    araEdition: "ara-tirmidhi",
    urdEdition: "urd-tirmidhi",
    sunniIntro:
      "Celebrated as Jami' & Sunan simultaneously because Imam at-Tirmidhi records the practice of the Sahabah and the juristic schools including Imam Abu Hanifa and the Kufan Fuqaha.",
  },
  {
    id: "abudawud",
    title: "Sunan Abi Dawud",
    arabicTitle: "سنن أبي داود",
    urduTitle: "سنن ابی داؤد",
    compiler: "Imam Abu Dawud Sulayman ibn al-Ash'ath as-Sijistani",
    eraHijri: "202–275 AH",
    category: "Sihah Sittah (Six Canonical Books)",
    totalHadiths: 5274,
    totalSections: 43,
    hasUrduEdition: true,
    engEdition: "eng-abudawud",
    araEdition: "ara-abudawud",
    urdEdition: "urd-abudawud",
    sunniIntro:
      "The premier Sunan compilation focused specifically on Ahkam (legal rulings of Taharah, Salah, Zakat, Sawm, Nikah, and Mu'amalat), selected from 500,000 narrations.",
  },
  {
    id: "nasai",
    title: "Sunan an-Nasa'i",
    arabicTitle: "سنن النسائي",
    urduTitle: "سنن النسائی",
    compiler: "Imam Ahmad ibn Shu'ayb an-Nasa'i",
    eraHijri: "215–303 AH",
    category: "Sihah Sittah (Six Canonical Books)",
    totalHadiths: 5765,
    totalSections: 51,
    hasUrduEdition: true,
    engEdition: "eng-nasai",
    araEdition: "ara-nasai",
    urdEdition: "urd-nasai",
    sunniIntro:
      "Al-Mujtaba min as-Sunan — praised by classical Muhaddithin for having the strictest narrator conditions among the four Sunan works and subtle fiqhi chapter headings.",
  },
  {
    id: "ibnmajah",
    title: "Sunan Ibn Majah",
    arabicTitle: "سنن ابن ماجه",
    urduTitle: "سنن ابن ماجہ",
    compiler: "Imam Muhammad ibn Yazid Ibn Majah al-Qazwini",
    eraHijri: "209–273 AH",
    category: "Sihah Sittah (Six Canonical Books)",
    totalHadiths: 4343,
    totalSections: 38,
    hasUrduEdition: true,
    engEdition: "eng-ibnmajah",
    araEdition: "ara-ibnmajah",
    urdEdition: "urd-ibnmajah",
    sunniIntro:
      "Completes the Sihah Sittah with concise, non-repetitive chapters beginning with following the Sunnah and preserving over 1,300 valuable Zawa'id narrations.",
  },
  {
    id: "malik",
    title: "Muwatta Imam Malik",
    arabicTitle: "موطأ الإمام مالك",
    urduTitle: "موطا امام مالک",
    compiler: "Imam Malik ibn Anas (also transmitted by Imam Muhammad ash-Shaybani)",
    eraHijri: "93–179 AH",
    category: "Muwatta & Hanafi Musnad",
    totalHadiths: 1858,
    totalSections: 61,
    hasUrduEdition: true,
    engEdition: "eng-malik",
    araEdition: "ara-malik",
    urdEdition: "urd-malik",
    sunniIntro:
      "One of the earliest extant Hadith-Fiqh codices from Madinah Munawwarah; notably transmitted with Hanafi juristic commentary by Imam Abu Hanifa's premier student, Imam Muhammad ash-Shaybani.",
  },
  {
    id: "nawawi",
    title: "Arba'in an-Nawawi (40 Hadith)",
    arabicTitle: "الأربعون النووية",
    urduTitle: "اربعین نووی",
    compiler: "Imam Yahya ibn Sharaf an-Nawawi",
    eraHijri: "631–676 AH",
    category: "Arba'in & Hadith Qudsi",
    totalHadiths: 42,
    totalSections: 1,
    hasUrduEdition: false,
    engEdition: "eng-nawawi",
    araEdition: "ara-nawawi",
    sunniIntro:
      "42 foundational Jawami' al-Kalim (comprehensive Prophetic maxims) upon each of which a quarter or third of sacred Sacred Law and Ihsan revolves.",
  },
  {
    id: "qudsi",
    title: "40 Hadith Qudsi",
    arabicTitle: "الأحاديث القدسية الأربعون",
    urduTitle: "اربعین احادیث قدسیہ",
    compiler: "Selected from Sihah Sittah & Muwatta",
    eraHijri: "Classical Compilation",
    category: "Arba'in & Hadith Qudsi",
    totalHadiths: 40,
    totalSections: 1,
    hasUrduEdition: false,
    engEdition: "eng-qudsi",
    araEdition: "ara-qudsi",
    sunniIntro:
      "Forty sacred narrations in which the Holy Prophet ﷺ relates the direct meaning from Allah Almighty regarding Divine Mercy, Tawbah, Dhikr, and Wilayah.",
  },
  {
    id: "dehlawi",
    title: "40 Hadith of Shah Waliullah Dehlawi",
    arabicTitle: "الأربعون للشاه ولي الله الدهلوي",
    urduTitle: "چہل حدیث شاہ ولی اللہ محدث دہلوی",
    compiler: "Shah Waliullah Muhaddith Dehlawi",
    eraHijri: "1114–1176 AH",
    category: "Arba'in & Hadith Qudsi",
    totalHadiths: 40,
    totalSections: 1,
    hasUrduEdition: false,
    engEdition: "eng-dehlawi",
    araEdition: "ara-dehlawi",
    sunniIntro:
      "Concise, easy-to-memorize Prophetic supplications and moral maxims transmitted through an unbroken Subcontinent Hadith chain back to Sayyiduna Ali al-Murtada (رضي الله عنه).",
  },
];

export interface HadithSectionMeta {
  num: number;
  title: string;
  first: number;
  last: number;
  count: number;
}

export type HadithCatalogMap = Record<
  string,
  {
    totalHadiths: number;
    sections: HadithSectionMeta[];
  }
>;

export interface RemoteHadithGrade {
  name: string;
  grade: string;
}

export interface UnifiedHadithRecord {
  uid: string;
  bookId: string;
  bookTitle: string;
  sectionNum: number;
  sectionTitle: string;
  hadithNumber: number;
  arabicNumber?: number;
  arabic: string;
  english: string;
  urdu: string;
  primaryGrade: string;
  grades: RemoteHadithGrade[];
  sunniNote?: string;
  narratorHint?: string;
}

interface RawApiHadith {
  hadithnumber: number;
  arabicnumber?: number;
  text: string;
  grades?: RemoteHadithGrade[];
  reference?: { book: number; hadith: number };
}

interface RawApiEditionResponse {
  metadata?: {
    name?: string;
    section?: Record<string, string>;
    sections?: Record<string, string>;
  };
  hadiths?: RawApiHadith[];
}

const CDN_BASES = [
  "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions",
  "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions",
];

let catalogCache: HadithCatalogMap | null = null;
const sectionCache = new Map<string, UnifiedHadithRecord[]>();
const fullBookEngCache = new Map<string, RawApiEditionResponse>();

export async function loadHadithCatalog(): Promise<HadithCatalogMap> {
  if (catalogCache) return catalogCache;
  const res = await fetch(assetUrl("/data/hadith-catalog.json"));
  if (!res.ok) throw new Error("Unable to load Hadith catalog");
  const json = (await res.json()) as HadithCatalogMap;
  catalogCache = json;
  return json;
}

async function fetchJsonWithFallback<T>(relativePath: string): Promise<T> {
  let lastErr: unknown = null;
  for (const base of CDN_BASES) {
    try {
      const res = await fetch(`${base}/${relativePath}`);
      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error(`Failed fetching ${relativePath}`);
}

function summarizeGrade(
  bookId: string,
  grades?: RemoteHadithGrade[]
): string {
  if (bookId === "bukhari" || bookId === "muslim") return "Sahih (Agreed Canon)";
  if (bookId === "qudsi") return "Hadith Qudsi";
  if (bookId === "nawawi" || bookId === "dehlawi") return "Sahih / Canonical";
  if (!grades || grades.length === 0) return "Classical Narration";
  const sahih = grades.find((g) => /sahih/i.test(g.grade));
  if (sahih) return sahih.grade;
  const hasan = grades.find((g) => /hasan/i.test(g.grade));
  if (hasan) return hasan.grade;
  return grades[0].grade || "Recorded";
}

function extractNarrator(englishText: string): string | undefined {
  const m = englishText.match(
    /^(?:Narrated\s+|It was narrated (?:from|that)\s+|It is narrated on the authority of\s+)([^:]{3,60}):/i
  );
  if (m && m[1]) return m[1].trim();
  const m2 = englishText.match(/^([A-Z][A-Za-z\s`'’-]{2,45})\s+narrated\s+that/i);
  if (m2 && m2[1]) return m2[1].trim();
  return undefined;
}

export async function fetchBookSectionHadiths(
  book: HadithBookMeta,
  sectionNum: number,
  sectionTitle: string
): Promise<UnifiedHadithRecord[]> {
  if (!book.engEdition || !book.araEdition) return [];
  const cacheKey = `${book.id}::sec::${sectionNum}`;
  const cached = sectionCache.get(cacheKey);
  if (cached) return cached;

  const [engData, araData, urdData] = await Promise.all([
    fetchJsonWithFallback<RawApiEditionResponse>(
      `${book.engEdition}/sections/${sectionNum}.min.json`
    ),
    fetchJsonWithFallback<RawApiEditionResponse>(
      `${book.araEdition}/sections/${sectionNum}.min.json`
    ).catch(() => ({ hadiths: [] } as RawApiEditionResponse)),
    book.urdEdition
      ? fetchJsonWithFallback<RawApiEditionResponse>(
          `${book.urdEdition}/sections/${sectionNum}.min.json`
        ).catch(() => ({ hadiths: [] } as RawApiEditionResponse))
      : Promise.resolve({ hadiths: [] } as RawApiEditionResponse),
  ]);

  const araMap = new Map<number, string>();
  for (const h of araData.hadiths || []) {
    araMap.set(h.hadithnumber, h.text || "");
  }
  const urdMap = new Map<number, string>();
  for (const h of urdData.hadiths || []) {
    urdMap.set(h.hadithnumber, h.text || "");
  }

  const unified: UnifiedHadithRecord[] = (engData.hadiths || [])
    .filter((h) => (h.text && h.text.trim()) || araMap.get(h.hadithnumber))
    .map((h) => ({
      uid: `${book.id}-${h.hadithnumber}`,
      bookId: book.id,
      bookTitle: book.title,
      sectionNum,
      sectionTitle,
      hadithNumber: h.hadithnumber,
      arabicNumber: h.arabicnumber,
      arabic: araMap.get(h.hadithnumber) || "",
      english: h.text || "",
      urdu: urdMap.get(h.hadithnumber) || "",
      primaryGrade: summarizeGrade(book.id, h.grades),
      grades: h.grades || [],
      narratorHint: extractNarrator(h.text || ""),
    }));

  sectionCache.set(cacheKey, unified);
  return unified;
}

export async function fetchSingleHadithByNumber(
  book: HadithBookMeta,
  hadithNum: number,
  catalog?: HadithCatalogMap | null
): Promise<UnifiedHadithRecord | null> {
  if (!book.engEdition || !book.araEdition) return null;

  const [engData, araData, urdData] = await Promise.all([
    fetchJsonWithFallback<RawApiEditionResponse>(
      `${book.engEdition}/${hadithNum}.min.json`
    ),
    fetchJsonWithFallback<RawApiEditionResponse>(
      `${book.araEdition}/${hadithNum}.min.json`
    ).catch(() => ({ hadiths: [] } as RawApiEditionResponse)),
    book.urdEdition
      ? fetchJsonWithFallback<RawApiEditionResponse>(
          `${book.urdEdition}/${hadithNum}.min.json`
        ).catch(() => ({ hadiths: [] } as RawApiEditionResponse))
      : Promise.resolve({ hadiths: [] } as RawApiEditionResponse),
  ]);

  const h = engData.hadiths?.[0];
  if (!h) return null;
  const secNum = h.reference?.book || 1;
  const secTitle =
    catalog?.[book.id]?.sections.find((s) => s.num === secNum)?.title ||
    `Book ${secNum}`;

  return {
    uid: `${book.id}-${h.hadithnumber}`,
    bookId: book.id,
    bookTitle: book.title,
    sectionNum: secNum,
    sectionTitle: secTitle,
    hadithNumber: h.hadithnumber,
    arabicNumber: h.arabicnumber,
    arabic: araData.hadiths?.[0]?.text || "",
    english: h.text || "",
    urdu: urdData.hadiths?.[0]?.text || "",
    primaryGrade: summarizeGrade(book.id, h.grades),
    grades: h.grades || [],
    narratorHint: extractNarrator(h.text || ""),
  };
}

/**
 * Full-book search across ALL thousands of Hadiths in a selected canonical book,
 * plus instant hydration of Arabic/Urdu for the top results.
 */
export async function searchFullHadithBook(
  book: HadithBookMeta,
  query: string,
  gradeFilter: "All" | "Sahih" | "Hasan",
  limit = 30
): Promise<{ totalMatches: number; items: UnifiedHadithRecord[] }> {
  if (!book.engEdition) return { totalMatches: 0, items: [] };
  const q = query.trim().toLowerCase();
  if (!q) return { totalMatches: 0, items: [] };

  let fullEng = fullBookEngCache.get(book.id);
  if (!fullEng) {
    fullEng = await fetchJsonWithFallback<RawApiEditionResponse>(
      `${book.engEdition}.min.json`
    );
    fullBookEngCache.set(book.id, fullEng);
  }

  const sectionsMap = fullEng.metadata?.sections || {};
  const matchedRaw: RawApiHadith[] = [];

  for (const h of fullEng.hadiths || []) {
    if (!h.text) continue;
    const gSummary = summarizeGrade(book.id, h.grades);
    if (gradeFilter === "Sahih" && !/sahih/i.test(gSummary)) continue;
    if (gradeFilter === "Hasan" && !/hasan/i.test(gSummary)) continue;

    const secKey = String(h.reference?.book || "");
    const secName = (sectionsMap[secKey] || "").toLowerCase();
    if (
      h.text.toLowerCase().includes(q) ||
      secName.includes(q) ||
      String(h.hadithnumber) === q
    ) {
      matchedRaw.push(h);
    }
  }

  const topSlice = matchedRaw.slice(0, limit);

  // Hydrate Arabic & Urdu in parallel for top 12 visible hits using individual lightweight JSONs
  const hydrated = await Promise.all(
    topSlice.map(async (h, idx) => {
      const secNum = h.reference?.book || 1;
      const secTitle = sectionsMap[String(secNum)] || `Section ${secNum}`;
      let arabic = "";
      let urdu = "";
      if (idx < 12 && book.araEdition) {
        const [araRes, urdRes] = await Promise.all([
          fetchJsonWithFallback<RawApiEditionResponse>(
            `${book.araEdition}/${h.hadithnumber}.min.json`
          ).catch(() => null),
          book.urdEdition
            ? fetchJsonWithFallback<RawApiEditionResponse>(
                `${book.urdEdition}/${h.hadithnumber}.min.json`
              ).catch(() => null)
            : Promise.resolve(null),
        ]);
        arabic = araRes?.hadiths?.[0]?.text || "";
        urdu = urdRes?.hadiths?.[0]?.text || "";
      }

      return {
        uid: `${book.id}-${h.hadithnumber}`,
        bookId: book.id,
        bookTitle: book.title,
        sectionNum: secNum,
        sectionTitle: secTitle,
        hadithNumber: h.hadithnumber,
        arabicNumber: h.arabicnumber,
        arabic,
        english: h.text || "",
        urdu,
        primaryGrade: summarizeGrade(book.id, h.grades),
        grades: h.grades || [],
        narratorHint: extractNarrator(h.text || ""),
      } satisfies UnifiedHadithRecord;
    })
  );

  return {
    totalMatches: matchedRaw.length,
    items: hydrated,
  };
}

const BOOKMARKS_KEY = "auliya_fiqh_hadith_bookmarks_v1";

export function loadLibraryBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLibraryBookmarks(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}
