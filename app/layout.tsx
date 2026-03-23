import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guinguette du Loir | Seiches-sur-le-Loir",
  description:
    "Guinguette traditionnelle au bord du Loir à Seiches-sur-le-Loir. Réservations, événements, ambiance chaleureuse.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 text-stone-800`}
      >
        {/* ✅ HEADER UNIQUE */}
        <Header />

        {/* CONTENU */}
        <main className="min-h-[70vh]">
          <PageTransition>{children}</PageTransition>
        </main>

        {/* FOOTER */}
        <footer className="bg-stone-900 text-stone-200 py-10 text-center mt-20">
          <p className="font-semibold">Guinguette du Père Chapuis</p>
          <p className="text-sm mt-2">
            1 parc des vallées – 49140 Seiches-sur-le-Loir
          </p>
          <p className="text-sm mt-1">
            © {new Date().getFullYear()} – Tous droits réservés
          </p>
        </footer>
      </body>
    </html>
  );
}
