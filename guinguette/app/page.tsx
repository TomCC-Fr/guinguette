import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default async function HomePage() {

  const today = new Date().toISOString().split("T")[0];

  const { data: nextEvent } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(1)
    .single();

  return (
    <div>

      {/* HERO */}
      <section className="relative h-[80vh] w-full">

        <Image
          src="/guinguette/Guinguette1_HD.png"
          alt="Bienvenue à la guinguette du Père Chapuis"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-5xl font-semibold mb-6">
            Bienvenue à la guinguette du Père Chapuis
          </h1>

          <p className="text-lg mb-8 max-w-xl">
            Une parenthèse conviviale au bord du Loir,
            à Seiches-sur-le-Loir.
          </p>

          <Link
            href="/reservation"
            className="bg-white text-stone-800 px-6 py-3 rounded-xl hover:bg-stone-100 transition"
          >
            Réserver une table
          </Link>
        </div>

      </section>

      {/* PROCHAIN ÉVÉNEMENT */}
      {nextEvent && (
        <section className="py-32 bg-stone-50 border-t border-stone-200">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

            {/* IMAGE */}
            {nextEvent.image_file && (
              <div className="relative overflow-hidden rounded-2xl group">
                <Image
                  src={`/events/${nextEvent.image_file}`}
                  alt={nextEvent.title}
                  width={1200}
                  height={800}
                  className="w-full h-[450px] object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            )}

            {/* CONTENU */}
            <div className="space-y-6">

              <p className="text-sm uppercase tracking-wider text-stone-500">
                Prochain événement
              </p>

              {/* DATE GRAPHIQUE */}
              <div className="space-y-2">
                <p className="text-l uppercase tracking-wider text-stone-500">
                  {new Date(nextEvent.date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                  })}
                </p>

                <div className="flex items-end gap-4">
                  <div className="text-5xl font-semibold">
                    {new Date(nextEvent.date).getDate()}
                  </div>

                  <div className="text-l text-stone-500">
                    {new Date(nextEvent.date).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight">
                {nextEvent.title}
              </h2>

              <p className="text-stone-600">
                {nextEvent.service === "MIDI" && "Service du midi 🌞"}
                {nextEvent.service === "SOIR" && "Service du soir 🌙"}
                {nextEvent.service === "ALL" && "Midi 🌞 & Soir 🌙"}

                {nextEvent.heure_debut && (
                  <> – à partir de {nextEvent.heure_debut.slice(0, 5)}</>
                )}
              </p>

              <Link
                href={`/reservation?date=${nextEvent.date}&event=${encodeURIComponent(nextEvent.title)}&service=${nextEvent.service}`}
              >
                <Button className="mt-2">
                  Réserver 🍽️
                </Button>
              </Link>

              <div className="pt-6">
                <Link
                  href="/planning"
                  className="text-sm text-stone-500 hover:text-stone-800 transition"
                >
                  Voir tout le planning →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
