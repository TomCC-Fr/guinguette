"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FEATURES } from "@/lib/features";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function linkClass(path: string) {
    return `px-4 py-2 rounded-xl transition ${
      pathname === path
        ? "bg-stone-900/90 text-white"
        : "hover:bg-stone-100"
    }`;
  }

  return (
    <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold"
          onClick={() => setOpen(false)}
        >
          La guinguette du Père Chapuis
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-2 text-sm">

          <Link href="/" className={linkClass("/")}>
            Accueil
          </Link>

          {/* RESERVATION */}
          {FEATURES.RESERVATION && (
            <Link href="/reservation" className={linkClass("/reservation")}>
              Réserver
            </Link>
          )}

          {/* PLANNING */}
          {FEATURES.PLANNING && (
            <Link href="/planning" className={linkClass("/planning")}>
              Evenements
            </Link>
          )}

          {/* MENU */}
          {FEATURES.MENU && (
            <Link href="/menu" className={linkClass("/menu")}>
              La carte
            </Link>
          )}

          {/* EQUIPE */}
          {FEATURES.EQUIPE && (
            <Link href="/equipe" className={linkClass("/equipe")}>
              Équipe
            </Link>
          )}

          {/* INFOS */}
          {FEATURES.INFOS && (
            <Link href="/infos" className={linkClass("/infos")}>
              Infos
            </Link>
          )}

        </nav>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl px-2"
        >
          {open ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-white px-6 py-6 flex flex-col gap-3 text-base">

          <Link
            href="/"
            className={linkClass("/")}
            onClick={() => setOpen(false)}
          >
            Accueil
          </Link>

          {FEATURES.RESERVATION && (
            <Link
              href="/reservation"
              className={linkClass("/reservation")}
              onClick={() => setOpen(false)}
            >
              Réserver
            </Link>
          )}

          {FEATURES.PLANNING && (
            <Link
              href="/planning"
              className={linkClass("/planning")}
              onClick={() => setOpen(false)}
            >
              Evenements
            </Link>
          )}

          {FEATURES.MENU && (
            <Link
              href="/menu"
              className={linkClass("/menu")}
              onClick={() => setOpen(false)}
            >
              La carte
            </Link>
          )}

          {FEATURES.EQUIPE && (
            <Link
              href="/equipe"
              className={linkClass("/equipe")}
              onClick={() => setOpen(false)}
            >
              Équipe
            </Link>
          )}

          {FEATURES.INFOS && (
            <Link
              href="/infos"
              className={linkClass("/infos")}
              onClick={() => setOpen(false)}
            >
              Infos
            </Link>
          )}

        </div>
      )}
    </header>
  );
}