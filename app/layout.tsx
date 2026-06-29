import type { Metadata } from "next";
import { Oswald, Nunito, Geist_Mono } from "next/font/google";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
        className={`${oswald.variable} ${nunito.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "oklch(0.99 0.008 80)", color: "oklch(0.15 0.02 60)" }}
      >
        {/* ── HEADER ── */}
        <Header />

        {/* ── CONTENU ── */}
        <main className="min-h-[70vh]">
          <PageTransition>{children}</PageTransition>
        </main>

        {/* ── FOOTER ── */}
        <footer style={{ backgroundColor: "oklch(0.93 0.01 80)", borderTop: "1px solid oklch(0.88 0.01 80)" }}>

          {/* Trait décoratif vert sauge */}
          <div className="w-full h-[2px] bg-[oklch(0.58_0.13_148)]" />

          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-12">

            {/* ── IDENTITÉ ── */}
            <div className="space-y-4">
              <p className="font-display text-base uppercase tracking-widest"
                style={{ color: "oklch(0.15 0.02 60)" }}>
                La Guinguette<br />du Père Chapuis
              </p>
              <div className="w-8 h-[2px] bg-[oklch(0.58_0.13_148)] rounded-full" />
              <address className="not-italic font-body text-sm leading-relaxed space-y-1"
                style={{ color: "oklch(0.45 0.02 60)" }}>
                <p>1 parc des vallées</p>
                <p>49140 Seiches-sur-le-Loir</p>
              </address>
              <a
                href="tel:+33241933900"
                className="inline-block font-body text-sm hover:text-[oklch(0.58_0.13_148)] transition-colors duration-200"
                style={{ color: "oklch(0.35 0.02 60)" }}
              >
                02 41 93 39 00
              </a>
            </div>

            {/* ── HORAIRES ── */}
            <div className="space-y-4">
              <p className="font-display text-base uppercase tracking-widest"
                style={{ color: "oklch(0.15 0.02 60)" }}>
                Horaires
              </p>
              <div className="w-8 h-[2px] bg-[oklch(0.58_0.13_148)] rounded-full" />
              <div className="font-body text-sm space-y-2" style={{ color: "oklch(0.45 0.02 60)" }}>
                <div className="flex justify-between gap-6">
                  <span>Mardi – Jeudi</span>
                  <span style={{ color: "oklch(0.25 0.02 60)" }}>11h00 – 22h00</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span>Vendredi – Samedi</span>
                  <span style={{ color: "oklch(0.25 0.02 60)" }}>11h00 – 23h00</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span>Dimanche</span>
                  <span style={{ color: "oklch(0.25 0.02 60)" }}>11h00 – 17h00</span>
                </div>
                <div className="flex justify-between gap-6 pt-1 border-t"
                  style={{ borderColor: "oklch(0.85 0.01 80)" }}>
                  <span style={{ color: "oklch(0.65 0.02 60)" }}>Lundi</span>
                  <span style={{ color: "oklch(0.65 0.02 60)" }}>Fermé</span>
                </div>
              </div>
            </div>

            {/* ── RÉSEAUX ── */}
            <div className="space-y-4">
              <p className="font-display text-base uppercase tracking-widest"
                style={{ color: "oklch(0.15 0.02 60)" }}>
                Suivez-nous
              </p>
              <div className="w-8 h-[2px] bg-[oklch(0.58_0.13_148)] rounded-full" />
              <div className="flex flex-col gap-3">
                <a
                  href="[instagram.com](https://www.instagram.com/guinguetteperechapuis/)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-body text-sm hover:text-[oklch(0.58_0.13_148)] transition-colors duration-200 group"
                  style={{ color: "oklch(0.45 0.02 60)" }}
                >
                  <svg className="w-5 h-5 group-hover:text-[oklch(0.58_0.13_148)] transition-colors duration-200"
                    style={{ color: "oklch(0.65 0.02 60)" }}
                    fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
                <a
                  href="[facebook.com](https://www.facebook.com/guinguetteduperechapuis)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-body text-sm hover:text-[oklch(0.58_0.13_148)] transition-colors duration-200 group"
                  style={{ color: "oklch(0.45 0.02 60)" }}
                >
                  <svg className="w-5 h-5 group-hover:text-[oklch(0.58_0.13_148)] transition-colors duration-200"
                    style={{ color: "oklch(0.65 0.02 60)" }}
                    fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="py-5 text-center" style={{ borderTop: "1px solid oklch(0.88 0.01 80)" }}>
            <p className="font-body text-xs tracking-wide" style={{ color: "oklch(0.65 0.02 60)" }}>
              © {new Date().getFullYear()} La Guinguette du Père Chapuis — Tous droits réservés
            </p>
          </div>

        </footer>
      </body>
    </html>
  );
}
