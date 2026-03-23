"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-semibold text-lg">
          Guinguette
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-8 text-sm">
          <Link href="/planning">Planning</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/reservation">Réserver</Link>
          <Link href="/equipe">Équipe</Link>
        </nav>

        {/* Burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          {open ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-white px-6 py-6 flex flex-col gap-6 text-base">

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