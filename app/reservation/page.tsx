"use client";

import Script from "next/script";

export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      <h1 className="text-2xl font-semibold mb-8">
        Réserver une table
      </h1>

      {/* SCRIPT */}
      <Script
        src="https://ordertab.menu/laguingetteduperechapuis/widget"
        strategy="afterInteractive"
      />

      {/* @ts-ignore */}
      <bt-booking-widget />

      <p className="text-sm text-stone-500 mt-6 text-center">
        Si le module ne s'affiche pas, contactez-nous au 02 41 93 39 00 📞
      </p>

    </div>
  );
}