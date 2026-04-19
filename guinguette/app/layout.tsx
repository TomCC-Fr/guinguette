import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
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
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              La guinguette du Père Chapuis
            </Link>

            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="hover:text-amber-600 transition-colors">
                Accueil
              </Link>

              <Link
                href="/reservation"
                className="bg-stone-800 text-white px-4 py-1.5 rounded-xl hover:bg-stone-700 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Réserver
              </Link>

              <Link
                href="/planning"
                className="hover:text-amber-600 transition-colors"
              >
                Planning
              </Link>

              <Link
                href="/menu"
                className="hover:text-stone-600 transition-colors"
              >
                La carte
              </Link>

              <Link
                href="/equipe"
                className="hover:text-amber-600 transition-colors"
              >
                Équipe
              </Link>

              <Link
                href="/infos"
                className="hover:text-amber-600 transition-colors"
              >
                Infos
              </Link>
            </nav>
          </div>
        </header>

        {/* CONTENU AVEC TRANSITION */}
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
