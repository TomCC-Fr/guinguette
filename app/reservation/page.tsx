"use client";

import Script from "next/script";

export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
          Réserver une table
        </h1>

        {/* ✅ Script chargé proprement */}
        <Script
          src="https://ordertab.menu/laguingetteduperechapuis/widget"
          strategy="afterInteractive"
        />

        {/* ✅ Widget */}
        <div className="w-full">
          {/* @ts-ignore */}
          <bt-booking-widget />
        </div>

        {/* fallback */}
        <p className="text-center text-sm text-stone-500 mt-6">
          Si le module ne s'affiche pas, contactez-nous au 02 41 93 39 00 ☎️
        </p>

      </div>
    </div>
  );
}