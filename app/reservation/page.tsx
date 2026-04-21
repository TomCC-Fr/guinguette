"use client";

import Script from "next/script";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">

      <h1 className="text-3xl font-semibold mb-6">
        Réserver une table
      </h1>

      <iframe
        src="https://ordertab.menu/laguingetteduperechapuis/bookings"
        className="w-full max-w-4xl h-[700px] rounded-xl border"
      />

      <p className="text-sm text-gray-500 mt-6">
        Si problème, appelez-nous au 02 41 93 39 00 📞
      </p>
    </div>
  );
}