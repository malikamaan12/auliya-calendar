import type { Metadata, Viewport } from "next";
import { Inter, Amiri, Noto_Sans_Devanagari, Gulzar } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const gulzar = Gulzar({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-gulzar",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Auliya Calendar & Sunni Companion | Ahl-e-Sunnat & Hanafi Platform",
  description:
    "Cross-platform Sunni (Ahl-e-Sunnat wal Jama'at) & Hanafi digital sanctuary featuring Auliya Allah encyclopedia, Shajrah lineage graphs, 360° Ziyarat, Hanafi Azan & custom Jamaat timings, Kanzul Iman Quran, Bahar-e-Shariat Fiqh, Smart Tasbih, Zakat Calculator, and Sahib-e-Ilm Trivia.",
  manifest: "/manifest.json",
  applicationName: "Auliya Calendar",
  appleWebApp: { capable: true, title: "Auliya Calendar", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`dark ${inter.variable} ${amiri.variable} ${gulzar.variable} ${devanagari.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
