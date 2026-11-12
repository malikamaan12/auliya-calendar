# Auliya Calendar & Sunni Companion Platform

A cross-platform **Sunni (Ahl-e-Sunnat wal Jama'at / Barelvi)** and **Hanafi Madhhab** digital sanctuary built with **Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion**.

## Key Features (All 9 PRD Modules)

1. **Zero-Bounce Apple-Bento Dashboard & *Rafiq* Companion (`/`)**
   - Live Hanafi Azan & Custom Jamaat countdown, 3 Daily Completion Rings (*Salah*, *Ilm & Quran*, *Sunnah & Dhikr*), Merciful *Qaza* Streak Shield, inline Smart *Tasbih*, and Hijri *Urs* spotlight with `±2` *Hilal* adjustment.
   - Progressive Guest-to-Account sync modal (Apple, Google, Email OTP) with zero upfront login wall.
2. **Auliya Allah Encyclopedia, *Shajrah* & 360° *Ziyarat* (`/auliya`)**
   - Multi-script search, *Tazkirah*, *Karamat*, authored *Malfuzat* & books, interactive `@xyflow/react` *Shajrah-e-Tayyibah* lineage graph, face-free 360° architectural *Ziyarat* with hotspots & *Adab-e-Ziyarat*, global *Mazar* coordinates, and Family *Barsi* / *Fatiha* log.
3. **Hanafi Azan & Custom Jamaat Timing Engine (`/prayer`)**
   - Offline-first `adhan` (`Madhab.Hanafi` / *Mithlayn* Asr), Relative Offset vs. Fixed Masjid Clock modes with seasonal conflict alerts, Qibla compass, *Ishraq/Chasht/Dahwa-e-Kubra*, and the 3 Hanafi *Makruh Tahrimi* windows.
4. **Holy Quran Suite — *Kanzul Iman* (`/quran`)**
   - Indo-Pak & Uthmani scripts, 4-language *Kanzul Iman* translations (Urdu, English, Roman Urdu, Hindi), *Khazain-ul-Irfan* Tafsir drawer, 14 Hanafi *Sajda-e-Tilawat* logger, and verse-synced audio with Hifz loop & sleep timer.
5. **Hadith, Sunnah & *Bahar-e-Shariat* Fiqh (`/fiqh`)**
   - Searchable *Bahar-e-Shariat* decision cards, graded Hadith with Sunni commentary, and Masnoon Sunnah playbooks.
6. **Smart *Tasbih*, Sunnah Matrix & *Qaza-e-Umri* (`/tasbih`)**
   - Tactile haptic *Tasbih* studio (*Durood-e-Razawiyya*, *Tasbih-e-Fatima*, *Durood-e-Taj*, *Durood-e-Ghausia*), Daily Sunnah Habit Matrix, and *Qaza-e-Umri* ledger.
7. **Hanafi Silver-First Zakat Calculator (`/zakat`)**
   - `612.36g` (`52.5 tola`) Silver & `87.48g` (`7.5 tola`) Gold Nisab with Hanafi *Dhamm*, karat purity (`24K`–`18K`), liabilities deduction, Hijri *Hawl* tracker, and `AES-256-GCM` client-side encryption.
8. **15-Tier *Sahib-e-Ilm* Sunni Trivia (`/quiz`)**
   - *Millionaire*-style 15-tier ladder with Safe Checkpoints (5, 10, 15), 4 lifelines (`50:50`, `Ishara`, `Ijma' Poll`, `Tabdeeli`), and verified Proof Cards.
9. **Headless Admin CMS Studio (`/admin`)**
   - Zod-validated Auliya builder, FIDO2 two-step scholarly approval gate (`Draft -> Scholarly Verification -> Published`), and immutable audit log.

## Getting Started

```bash
npm install
npm run dev
```

For production:

```bash
npm run build
npm run start
```

## Security & Integrity

- `SHA-256` sacred text verification & `AES-256-GCM` client-side Zakat encryption (`src/lib/crypto-integrity.ts`).
- Strict HTTP security headers configured in `next.config.ts`.
- Server-side Zod validation on API routes (`/api/health`, `/api/auliya`, `/api/quiz/verify`).
