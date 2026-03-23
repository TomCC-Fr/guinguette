import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Youtube, Music } from "lucide-react";
import { redirect } from "next/navigation";
import { FEATURES } from "@/lib/features";

export const dynamic = "force-dynamic";

export default async function PlanningPage() {
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  const today = new Date().toISOString().split("T")[0];

  const upcoming = events?.filter((e) => e.date >= today) || [];
  const past = events?.filter((e) => e.date < today) || [];

  const typeStyles: Record<string, string> = {
    Concert: "bg-amber-100 text-amber-700 border-amber-300",
    Cinéma: "bg-stone-200 text-stone-700 border-stone-400",
    Sport: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Autre: "bg-stone-100 text-stone-500 border-stone-300",
  };

function formatTime(time: string | null) {
  if (!time) return "";
  return time.slice(0, 5); // "20:30:00" → "20:30"
}
if (!FEATURES.PLANNING) {
  redirect("/");
}

  return (
    <div className="min-h-screen bg-neutral-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Planning des événements
          </h1>
          <p className="mt-4 text-stone-600">
            Concerts, cinéma en plein air, sport et soirées à la guinguette.
          </p>
        </div>

        {/* PROCHAINS ÉVÉNEMENTS */}
        <section className="space-y-20">
          <h2 className="text-2xl font-semibold">
            Prochains événements
          </h2>

          {upcoming.length === 0 && (
            <p className="text-stone-500">
              Aucun événement programmé pour le moment.
            </p>
          )}

          {upcoming.map((event, index) => {
          const isReversed = index % 2 !== 0;

          const borderColors: Record<string, string> = {
            Concert: "border-amber-500",
            Cinéma: "border-stone-700",
            Sport: "border-emerald-600",
            Autre: "border-stone-400",
          };

          const dateObj = new Date(event.date);
          const weekday = dateObj
            .toLocaleDateString("fr-FR", { weekday: "short" })
            .toUpperCase();
          const day = dateObj.getDate();
          const month = dateObj
            .toLocaleDateString("fr-FR", { month: "short" })
            .toUpperCase();
          const year = dateObj.getFullYear();

          return (
            <div
              key={event.id}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                isReversed ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative overflow-hidden rounded-2xl group">
                {event.image_file ? (
                  <Image
                    src={`/events/${event.image_file}`}
                    alt={event.title}
                    width={900}
                    height={600}
                    className="w-full h-44 md:h-[380px] object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-44 md:h-[380px] bg-stone-50 border border-stone-200 rounded-2xl" />
                )}

              </div>
              {/* CONTENU */}
              <div className="flex gap-6">

                {/* DATE GRAPHIQUE */}
                <div className="text-center min-w-[90px]">
                  <div className="text-xs tracking-wider text-stone-400">
                    {weekday}
                  </div>

                  <div className="text-3xl font-semibold">
                    {day}
                  </div>

                  <div className="text-xs tracking-wider text-stone-500">
                    {month}
                  </div>

                  <div className="text-xs text-stone-400">
                    {year}
                  </div>
                </div>

                {/* BLOC TEXTE */}
                <div className={`pl-6 border-l-4 ${
                  borderColors[event.type] || borderColors["Autre"]
                } space-y-4`}>

                  {/* SERVICE + HEURE */}
                  <p className="text-sm text-stone-500">
                    {event.service === "MIDI" && "Service du midi 🌞"}
                    {event.service === "SOIR" && "Service du soir 🌙"}
                    {event.service === "ALL" && "Midi 🌞 & Soir 🌙"}

                    {event.heure_debut && (
                      <span className="text-stone-600">
                        {" "}
                        – à partir de {event.heure_debut.slice(0, 5)}
                      </span>
                    )}
                  </p>

                  {/* TITRE */}
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {event.title}
                  </h3>

                  {/* DESCRIPTION */}
                  {event.description && (
                    <p className="text-stone-700 leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  {/* LIENS */}
                  <div className="flex gap-6 text-sm items-center">
                    {event.youtube_url && (
                      <a
                        href={event.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                      >
                        YouTube
                      </a>
                    )}

                    {event.spotify_url && (
                      <a
                        href={event.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition"
                      >
                        Spotify
                      </a>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/reservation?date=${event.date}&event=${encodeURIComponent(event.title)}&service=${event.service}`}
                  >
                    <Button size="sm" className="mt-2">
                      Réserver 🍽️
                    </Button>
                  </Link>

                </div>
              </div>
            </div>
          );
          })}
        </section>

        {/* PASSÉS */}
        {past.length > 0 && (
          <section className="mt-32 space-y-10">
            <h2 className="text-2xl font-semibold text-stone-600">
              Événements passés
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {past.map((event) => (
                <div
                  key={event.id}
                  className="p-6 border border-stone-200 rounded-xl bg-white/60"
                >
                  <p className="text-sm text-stone-500">
                    {new Date(event.date).toLocaleDateString("fr-FR")}
                  </p>

                  <h3 className="text-lg font-semibold mt-2">
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