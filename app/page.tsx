import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createServerClient } from "@/lib/supabase-server";
import { ALERT_BANNER } from "@/lib/features";

export default async function HomePage() {
  const supabase = await createServerClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: nextEvent } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(1)
    .single();

  return (
    <div style={{ backgroundColor: "oklch(0.99 0.008 80)" }}>

      {/* ── BANDEAU ALERTE ── */}
      {ALERT_BANNER.enabled && (
        <div className="text-white text-center py-2.5 text-sm font-body font-medium tracking-wide"
          style={{ backgroundColor: "oklch(0.58 0.13 148)" }}>
          {ALERT_BANNER.message}
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative h-[85vh] md:h-screen w-full">
        <Image
          src="/guinguette/Guinguette1_HD.png"
          alt="Bienvenue à la guinguette du Père Chapuis"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] mb-4"
            style={{ color: "oklch(0.85 0.10 148)" }}>
            Seiches-sur-le-Loir · Bord du Loir
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold uppercase tracking-wider mb-6 max-w-3xl leading-tight text-white">
            La guinguette du Père Chapuis
          </h1>
          <p className="font-body text-base md:text-lg mb-10 max-w-lg leading-relaxed text-white/80">
            On met l'accent sur la qualité dans le verre et dans l'assiette.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/reservation"
              className="inline-flex items-center px-8 py-3.5 rounded-full text-white font-body font-semibold text-sm tracking-wide active:scale-95 transition-all duration-200"
              style={{ backgroundColor: "oklch(0.58 0.13 148)" }}
            >
              Réserver une table
            </Link>
            <Link
              href="/planning"
              className="inline-flex items-center px-8 py-3.5 rounded-full border border-white/50 text-white font-body font-semibold text-sm tracking-wide hover:bg-white/10 active:scale-95 transition-all duration-200"
            >
              Voir les événements
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="font-body text-xs tracking-widest uppercase">Découvrir</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── PROCHAIN ÉVÉNEMENT ── */}
      {nextEvent && (
        <section className="py-20 md:py-32" style={{ backgroundColor: "oklch(0.96 0.01 80)", borderTop: "1px solid oklch(0.90 0.01 80)" }}>
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">

            {nextEvent.image_file && (
              <div className="relative overflow-hidden rounded-2xl group shadow-sm">
                <Image
                  src={`/events/${nextEvent.image_file}`}
                  alt={nextEvent.title}
                  width={1200}
                  height={800}
                  className="w-full h-64 md:h-[480px] object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
            )}

            <div className="space-y-6">
              {/* Badge */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-widest"
                style={{ backgroundColor: "oklch(0.92 0.05 148)", color: "oklch(0.30 0.10 148)" }}>
                Prochain événement
              </span>

              {/* Date */}
              <div className="space-y-1">
                <p className="font-display text-sm uppercase tracking-[0.2em]"
                  style={{ color: "oklch(0.55 0.02 60)" }}>
                  {new Date(nextEvent.date).toLocaleDateString("fr-FR", { weekday: "long" })}
                </p>
                <div className="flex items-end gap-4">
                  <span className="font-display text-6xl md:text-7xl font-bold leading-none"
                    style={{ color: "oklch(0.15 0.02 60)" }}>
                    {new Date(nextEvent.date).getDate()}
                  </span>
                  <span className="font-body text-base pb-2"
                    style={{ color: "oklch(0.55 0.02 60)" }}>
                    {new Date(nextEvent.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Séparateur */}
              <div className="w-12 h-[2px] rounded-full bg-[oklch(0.58_0.13_148)]" />

              {/* Titre */}
              <h2 className="font-display text-3xl md:text-4xl font-semibold uppercase tracking-wide leading-tight"
                style={{ color: "oklch(0.15 0.02 60)" }}>
                {nextEvent.title}
              </h2>

              {/* Service */}
              <p className="font-body text-sm" style={{ color: "oklch(0.45 0.02 60)" }}>
                {nextEvent.service === "MIDI" && "Service du midi 🌞"}
                {nextEvent.service === "SOIR" && "Service du soir 🌙"}
                {nextEvent.service === "ALL"  && "Midi 🌞 & Soir 🌙"}
                {nextEvent.heure_debut && <> – à partir de {nextEvent.heure_debut.slice(0, 5)}</>}
              </p>

              {/* CTA */}
              <Link href={`/reservation?date=${nextEvent.date}&event=${encodeURIComponent(nextEvent.title)}&service=${nextEvent.service}`}>
                <Button className="mt-2 rounded-full px-8 py-3 text-white font-body font-semibold text-sm tracking-wide border-0 active:scale-95 transition-all duration-200"
                  style={{ backgroundColor: "oklch(0.58 0.13 148)" }}>
                  À mon tour de réserver 🍽️
                </Button>
              </Link>

              <div className="pt-2">
                <Link href="/planning" className="font-body text-sm hover:underline transition-colors duration-200"
                  style={{ color: "oklch(0.58 0.13 148)" }}>
                  Voir tous les événements →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
