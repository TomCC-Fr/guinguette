import { createServerClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FEATURES } from "@/lib/features";

export const dynamic = "force-dynamic";

export default async function PlanningPage() {
  const supabase = await createServerClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  const today = new Date().toISOString().split("T")[0];
  const upcoming = events?.filter((e) => e.date >= today) || [];
  const past     = events?.filter((e) => e.date < today)  || [];

  if (!FEATURES.PLANNING) redirect("/");

  const typeBadgeStyles: Record<string, { bg: string; text: string }> = {
    Concert: { bg: "oklch(0.95 0.08 80)",  text: "oklch(0.45 0.12 60)"  },
    Cinéma:  { bg: "oklch(0.93 0.01 80)",  text: "oklch(0.35 0.02 60)"  },
    Sport:   { bg: "oklch(0.92 0.05 148)", text: "oklch(0.30 0.10 148)" },
    Autre:   { bg: "oklch(0.93 0.01 80)",  text: "oklch(0.45 0.02 60)"  },
  };

  const borderAccentColor: Record<string, string> = {
    Concert: "oklch(0.70 0.15 70)",
    Cinéma:  "oklch(0.70 0.02 60)",
    Sport:   "oklch(0.58 0.13 148)",
    Autre:   "oklch(0.80 0.01 80)",
  };

  function formatTime(time: string | null) {
    if (!time) return "";
    return time.slice(0, 5);
  }

  return (
    <div className="min-h-screen py-24 px-6" style={{ backgroundColor: "oklch(0.99 0.008 80)" }}>
      <div className="max-w-6xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-20 text-center space-y-4">
          <p className="font-body text-xs uppercase tracking-[0.3em]"
            style={{ color: "oklch(0.58 0.13 148)" }}>
            Agenda
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold uppercase tracking-wider"
            style={{ color: "oklch(0.15 0.02 60)" }}>
            Calendrier des événements
          </h1>
          <p className="font-body max-w-lg mx-auto" style={{ color: "oklch(0.45 0.02 60)" }}>
            Concerts, cinéma en plein air, sport et soirées à la guinguette.
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
            <div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.13_148)]" />
            <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
          </div>
        </div>

        {/* ── PROCHAINS ÉVÉNEMENTS ── */}
        <section className="space-y-24">
          <h2 className="font-display text-xl uppercase tracking-widest"
            style={{ color: "oklch(0.55 0.02 60)" }}>
            Prochains événements
          </h2>

          {upcoming.length === 0 && (
            <p className="font-body italic" style={{ color: "oklch(0.60 0.02 60)" }}>
              Aucun événement programmé pour le moment.
            </p>
          )}

          {upcoming.map((event, index) => {
            const isReversed  = index % 2 !== 0;
            const dateObj     = new Date(event.date);
            const weekday     = dateObj.toLocaleDateString("fr-FR", { weekday: "long" }).toUpperCase();
            const day         = dateObj.getDate();
            const month       = dateObj.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();
            const year        = dateObj.getFullYear();
            const badge       = typeBadgeStyles[event.type]  || typeBadgeStyles["Autre"];
            const borderColor = borderAccentColor[event.type] || borderAccentColor["Autre"];

            return (
              <div key={event.id}
                className={`grid md:grid-cols-2 gap-12 items-center ${isReversed ? "md:[&>*:first-child]:order-2" : ""}`}>

                {/* IMAGE */}
                <div className="relative overflow-hidden rounded-2xl group shadow-sm">
                  {event.image_file ? (
                    <Image
                      src={`/events/${event.image_file}`}
                      alt={event.title}
                      width={900} height={600}
                      className="w-full h-56 md:h-[400px] object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-56 md:h-[400px] rounded-2xl"
                      style={{ backgroundColor: "oklch(0.94 0.01 80)" }} />
                  )}
                  {event.type && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: badge.bg, color: badge.text }}>
                      {event.type}
                    </span>
                  )}
                </div>

                {/* CONTENU */}
                <div className="flex gap-6 items-start">
                  <div className="text-center min-w-[70px] pt-1">
                    <div className="font-display text-[10px] tracking-[0.2em]"
                      style={{ color: "oklch(0.60 0.02 60)" }}>
                      {weekday.slice(0, 3)}
                    </div>
                    <div className="font-display text-5xl font-bold leading-none my-1"
                      style={{ color: "oklch(0.15 0.02 60)" }}>
                      {day}
                    </div>
                    <div className="font-display text-xs tracking-wider"
                      style={{ color: "oklch(0.58 0.13 148)" }}>
                      {month}
                    </div>
                    <div className="font-body text-xs mt-1"
                      style={{ color: "oklch(0.65 0.02 60)" }}>
                      {year}
                    </div>
                  </div>

                  <div className="pl-6 flex-1 space-y-4"
                    style={{ borderLeft: `2px solid ${borderColor}` }}>
                    <p className="font-body text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>
                      {event.service === "MIDI" && "Service du midi 🌞"}
                      {event.service === "SOIR" && "Service du soir 🌙"}
                      {event.service === "ALL"  && "Midi 🌞 & Soir 🌙"}
                      {event.heure_debut && <span style={{ color: "oklch(0.35 0.02 60)" }}> – à partir de {formatTime(event.heure_debut)}</span>}
                    </p>

                    <h3 className="font-display text-2xl md:text-3xl font-semibold uppercase tracking-wide leading-tight"
                      style={{ color: "oklch(0.15 0.02 60)" }}>
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="font-body text-sm leading-relaxed"
                        style={{ color: "oklch(0.45 0.02 60)" }}>
                        {event.description}
                      </p>
                    )}

                    <div className="flex gap-4 text-sm items-center">
                      {event.youtube_url && (
                        <a href={event.youtube_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-body transition-colors duration-200 hover:text-red-500"
                          style={{ color: "oklch(0.55 0.02 60)" }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          YouTube
                        </a>
                      )}
                      {event.spotify_url && (
                        <a href={event.spotify_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-body hover:text-[oklch(0.58_0.13_148)] transition-colors duration-200"
                          style={{ color: "oklch(0.55 0.02 60)" }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                          Spotify
                        </a>
                      )}
                    </div>

                    <Link href={`/reservation?date=${event.date}&event=${encodeURIComponent(event.title)}&service=${event.service}`}>
                      <Button size="sm"
                        className="mt-2 rounded-full px-6 text-white font-body font-semibold border-0 active:scale-95 transition-all duration-200"
                        style={{ backgroundColor: "oklch(0.58 0.13 148)" }}>
                        Je veux venir 🍽️
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* ── ÉVÉNEMENTS PASSÉS ── */}
        {past.length > 0 && (
          <section className="mt-32 space-y-10">
            <h2 className="font-display text-xl uppercase tracking-widest"
              style={{ color: "oklch(0.65 0.02 60)" }}>
              Événements passés
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.map((event) => (
                <div key={event.id} className="p-5 rounded-xl space-y-2"
                  style={{ backgroundColor: "oklch(0.95 0.01 80)", border: "1px solid oklch(0.90 0.01 80)" }}>
                  <p className="font-body text-xs" style={{ color: "oklch(0.65 0.02 60)" }}>
                    {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <h3 className="font-display text-base uppercase tracking-wide"
                    style={{ color: "oklch(0.45 0.02 60)" }}>
                    {event.title}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
