"use client";

import Script from "next/script";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10">

      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-black transition text-sm"
        >
          <ArrowLeft size={16} />
          Retour à la guinguette
        </Link>
      </div>

      <div className="max-w-4xl mx-auto text-center">

        <h1 className="text-2xl md:text-3xl font-semibold mb-10">
          Réserver une table
        </h1>

        {/* SCRIPT */}
        <Script
          src="https://ordertab.menu/laguingetteduperechapuis/widget"
          strategy="afterInteractive"
        />

        {/* @ts-ignore */}
        <bt-booking-widget />

        <p className="text-sm text-stone-500 mt-6">
          Si le module ne s'affiche pas, contactez-nous au 02 41 93 39 00 📞
        </p>

      </div>
    </div>
  );
}