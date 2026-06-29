"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FEATURES } from "@/lib/features";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function linkClass(path: string) {
    const isActive = pathname === path;
    return [
      "relative px-1 py-2 text-sm font-body font-medium tracking-wide transition-colors duration-200",
      isActive
        ? "text-[oklch(0.15_0.02_60)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[oklch(0.58_0.13_148)] after:rounded-full"
        : "text-[oklch(0.45_0.02_60)] hover:text-[oklch(0.15_0.02_60)]",
    ].join(" ");
  }

  return (
    <header className="w-full sticky top-0 z-50"
      style={{ backgroundColor: "oklch(0.99 0.008 80)", borderBottom: "1px solid oklch(0.90 0.01 80)" }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-8">

        {/* ── Logo ── */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-base md:text-lg font-semibold tracking-widest uppercase whitespace-nowrap transition-colors duration-200 hover:text-[oklch(0.58_0.13_148)]"
          style={{ color: "oklch(0.15 0.02 60)" }}
        >
          La guinguette du Père Chapuis
        </Link>

        {/* ── Navigation desktop ── */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={linkClass("/")}>Accueil</Link>

          {FEATURES.PLANNING && (
            <Link href="/planning" className={linkClass("/planning")}>Événements</Link>
          )}
          {FEATURES.MENU && (
            <Link href="/menu" className={linkClass("/menu")}>La carte</Link>
          )}
          {FEATURES.EQUIPE && (
            <Link href="/equipe" className={linkClass("/equipe")}>Équipe</Link>
          )}
          {FEATURES.INFOS && (
            <Link href="/infos" className={linkClass("/infos")}>Infos</Link>
          )}

          {/* CTA Réserver */}
          {FEATURES.RESERVATION && (
            <Link
              href="/reservation"
              className="ml-2 inline-flex items-center px-5 py-2 rounded-full text-white text-sm font-body font-semibold tracking-wide active:scale-95 transition-all duration-200"
              style={{ backgroundColor: "oklch(0.58 0.13 148)" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "oklch(0.52 0.13 148)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "oklch(0.58 0.13 148)")}
            >
              Réserver
            </Link>
          )}
        </nav>

        {/* ── Burger mobile ── */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px]"
        >
          <span className={`block h-[2px] w-6 rounded-full transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`}
            style={{ backgroundColor: "oklch(0.15 0.02 60)" }} />
          <span className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`}
            style={{ backgroundColor: "oklch(0.15 0.02 60)" }} />
          <span className={`block h-[2px] w-6 rounded-full transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`}
            style={{ backgroundColor: "oklch(0.15 0.02 60)" }} />
        </button>

      </div>

      {/* ── Menu mobile ── */}
      <div
        className={`md:hidden fixed inset-0 top-[73px] z-40 flex flex-col px-8 py-10 gap-2 transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "oklch(0.99 0.008 80)" }}
      >
        {[
          { href: "/", label: "Accueil", show: true },
          { href: "/planning", label: "Événements", show: FEATURES.PLANNING },
          { href: "/menu", label: "La carte", show: FEATURES.MENU },
          { href: "/equipe", label: "Équipe", show: FEATURES.EQUIPE },
          { href: "/infos", label: "Infos", show: FEATURES.INFOS },
        ].filter(l => l.show).map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="font-display text-3xl uppercase tracking-wider py-4 hover:text-[oklch(0.58_0.13_148)] transition-colors"
            style={{ color: "oklch(0.15 0.02 60)", borderBottom: "1px solid oklch(0.90 0.01 80)" }}
          >
            {link.label}
          </Link>
        ))}

        {FEATURES.RESERVATION && (
          <Link
            href="/reservation"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-center px-6 py-4 rounded-full text-white font-display text-xl uppercase tracking-wider active:scale-95 transition-all duration-200"
            style={{ backgroundColor: "oklch(0.58 0.13 148)" }}
          >
            Réserver
          </Link>
        )}
      </div>
    </header>
  );
}
