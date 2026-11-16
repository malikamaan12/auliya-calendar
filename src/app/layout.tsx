import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Amiri, Noto_Sans_Devanagari, Gulzar } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
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
  title: "Quran & Sunni Companion | Auliya Calendar",
  description:
    "Complete 604-page Quran Mushaf with Kanzul Iman translation, Hanafi prayer times, Qibla compass, Tasbih counter, Auliya Allah Urs calendar, and Sunni Fiqh companion.",
  manifest: "/manifest.json",
  applicationName: "Quran & Sunni Companion",
  appleWebApp: { capable: true, title: "Quran Companion", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#040C23",
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
      className={`dark ${poppins.variable} ${inter.variable} ${amiri.variable} ${gulzar.variable} ${devanagari.variable} h-full antialiased`}
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
