// components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FEATURES } from "@/lib/features";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lien nav standard — souligné vert sauge si actif
  function linkClass(path: string) {
    const isActive = pathname === path;
    return [
      "relative px-1 py-2 text-sm font-body font-medium tracking-wide transition-colors duration-200",
      isActive
        ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[oklch(0.58_0.13_148)] after:rounded-full"
        : "text-stone-400 hover:text-white",
    ].join(" ");
  }

  return (
    <header className="w-full bg-[oklch(0.10_0.00_0)] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-8">

        {/* ── Logo ── */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-base md:text-lg font-semibold tracking-widest uppercase text-white whitespace-nowrap hover:text-[oklch(0.58_0.13_148)] transition-colors duration-200"
        >
          La guinguette du Père Chapuis
        </Link>

        {/* ── Navigation desktop ── */}
        <nav className="hidden md:flex items-center gap-6">

          <Link href="/" className={linkClass("/")}>
            Accueil
          </Link>

          {FEATURES.PLANNING && (
            <Link href="/planning" className={linkClass("/planning")}>
              Événements
            </Link>
          )}

          {FEATURES.MENU && (
            <Link href="/menu" className={linkClass("/menu")}>
              La carte
            </Link>
          )}

          {FEATURES.EQUIPE && (
            <Link href="/equipe" className={linkClass("/equipe")}>
              Équipe
            </Link>
          )}

          {FEATURES.INFOS && (
            <Link href="/infos" className={linkClass("/infos")}>
              Infos
            </Link>
          )}

          {/* CTA Réserver — toujours visible en dernier */}
          {FEATURES.RESERVATION && (
            <Link
              href="/reservation"
              className="ml-2 inline-flex items-center px-5 py-2 rounded-full bg-[oklch(0.58_0.13_148)] text-white text-sm font-body font-semibold tracking-wide hover:bg-[oklch(0.52_0.13_148)] active:scale-95 transition-all duration-200"
            >
              Réserver
            </Link>
          )}

        </nav>

        {/* ── Burger mobile ── */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] group"
        >
          <span
            className={`block h-[2px] w-6 bg-white rounded-full transition-all duration-300 origin-center ${
              open ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-6 bg-white rounded-full transition-all duration-300 ${
              open ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-6 bg-white rounded-full transition-all duration-300 origin-center ${
              open ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>

      </div>

      {/* ── Menu mobile plein écran ── */}
      <div
        className={`md:hidden fixed inset-0 top-[73px] bg-[oklch(0.10_0.00_0)] z-40 flex flex-col px-8 py-10 gap-2 transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-3xl uppercase tracking-wider text-white py-4 border-b border-white/10 hover:text-[oklch(0.58_0.13_148)] transition-colors"
        >
          Accueil
        </Link>

        {FEATURES.PLANNING && (
          <Link
            href="/planning"
            onClick={() => setOpen(false)}
            className="font-display text-3xl uppercase tracking-wider text-white py-4 border-b border-white/10 hover:text-[oklch(0.58_0.13_148)] transition-colors"
          >
            Événements
          </Link>
        )}

        {FEATURES.MENU && (
          <Link
            href="/menu"
            onClick={() => setOpen(false)}
            className="font-display text-3xl uppercase tracking-wider text-white py-4 border-b border-white/10 hover:text-[oklch(0.58_0.13_148)] transition-colors"
          >
            La carte
          </Link>
        )}

        {FEATURES.EQUIPE && (
          <Link
            href="/equipe"
            onClick={() => setOpen(false)}
            className="font-display text-3xl uppercase tracking-wider text-white py-4 border-b border-white/10 hover:text-[oklch(0.58_0.13_148)] transition-colors"
          >
            Équipe
          </Link>
        )}

        {FEATURES.INFOS && (
          <Link
            href="/infos"
            onClick={() => setOpen(false)}
            className="font-display text-3xl uppercase tracking-wider text-white py-4 border-b border-white/10 hover:text-[oklch(0.58_0.13_148)] transition-colors"
          >
            Infos
          </Link>
        )}

        {/* CTA Réserver mobile */}
        {FEATURES.RESERVATION && (
          <Link
            href="/reservation"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-center px-6 py-4 rounded-full bg-[oklch(0.58_0.13_148)] text-white font-display text-xl uppercase tracking-wider hover:bg-[oklch(0.52_0.13_148)] active:scale-95 transition-all duration-200"
          >
            Réserver
          </Link>
        )}
      </div>

    </header>
  );
}
