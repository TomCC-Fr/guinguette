"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isReservationPage = pathname.startsWith("/reservation");

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 text-stone-800`}
      >
        {/* ✅ HEADER UNIQUEMENT SI PAS RESERVATION */}
        {!isReservationPage && <Header />}

        {/* CONTENU */}
        <main className="min-h-[70vh]">
          <PageTransition>{children}</PageTransition>
        </main>

        {/* ✅ FOOTER UNIQUEMENT SI PAS RESERVATION */}
        {!isReservationPage && (
          <footer className="bg-stone-900 text-stone-200 mt-20">
            <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-sm">

              <div className="space-y-3">
                <p className="font-semibold text-white">
                  Guinguette du Père Chapuis
                </p>
                <p>
                  1 parc des vallées<br />
                  49140 Seiches-sur-le-Loir
                </p>
                <a href="tel:+33600000000" className="hover:underline">
                  02 41 93 39 00
                </a>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-white">Horaires</p>
                <div className="space-y-1 text-stone-300">
                  <p>Mardi à Jeudi : 11h00 – 22h</p>
                  <p>Vendredi & Samedi : 11h00 – 23h</p>
                  <p>Dimanche : 11h00 – 17h</p>
                  <p className="text-stone-400">Fermé le lundi</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-white">Suivez-nous</p>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/guinguetteperechapuis/"
                    target="_blank"
                    className="hover:underline"
                  >
                    Instagram
                  </a>

                  <a
                    href="https://www.facebook.com/guinguetteduperechapuis"
                    target="_blank"
                    className="hover:underline"
                  >
                    Facebook
                  </a>
                </div>

                <p className="text-xs text-stone-400 mt-4">
                  © {new Date().getFullYear()} – Tous droits réservés
                </p>
              </div>

            </div>
          </footer>
        )}
      </body>
    </html>
  );
}