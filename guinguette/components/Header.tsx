"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {

  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link href="/" className="font-semibold text-lg">
          Guinguette
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-sm">
          <Link href="/planning">Planning</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/reservation">Réserver</Link>
          <Link href="/equipe">Équipe</Link>
        </nav>

        {/* Burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-xl"
        >
          ☰
        </button>

      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 px-6 py-4 flex flex-col gap-4 text-sm">

          <Link href="/planning" onClick={() => setOpen(false)}>
            Planning
          </Link>

          <Link href="/menu" onClick={() => setOpen(false)}>
            Menu
          </Link>

          <Link href="/reservation" onClick={() => setOpen(false)}>
            Réserver
          </Link>

          <Link href="/equipe" onClick={() => setOpen(false)}>
            Équipe
          </Link>

        </div>
      )}

    </header>
  );
}