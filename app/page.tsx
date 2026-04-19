import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createServerClient } from "@/lib/supabase-server";

const supabase = createServerClient();
import { ALERT_BANNER } from "@/lib/features";

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
      {/* ================= BANDEAU ALERTE ================= */}
      {ALERT_BANNER.enabled && (
        <div className="bg-emerald-900 text-white text-center py-2 text-l tracking-wide">
          {ALERT_BANNER.message}
        </div>
      )}

      {/* HERO */}
      <section className="relative h-[70vh] md:h-[80vh] w-full">

        <Image
          src="/guinguette/Guinguette1_HD.png"
          alt="Bienvenue à la guinguette du Père Chapuis"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-3xl md:text-5xl font-semibold mb-6">
            La guinguette du Père Chapuis
          </h1>

          <p className="text-base md:text-lg mb-8 max-w-xl">
            On met l'accent sur la qualité dans le verre et dans l'assiette. 
    
          </p>

          <Link
            href="/reservation"
            className="bg-white text-stone-800 px-6 py-3 rounded-xl hover:bg-stone-100 transition"
          >
            Je veux venir manger à la guinguette
          </Link>
        </div>

      </section>

      {/* PROCHAIN ÉVÉNEMENT */}
      {nextEvent && (
        <section className="py-20 md:py-32 bg-stone-50 border-t border-stone-200">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* IMAGE */}
            {nextEvent.image_file && (
              <div className="relative overflow-hidden rounded-2xl group">
                <Image
                  src={`/events/${nextEvent.image_file}`}
                  alt={nextEvent.title}
                  width={1200}
                  height={800}
                  className="w-full h-52 md:h-[450px] object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            )}

            {/* CONTENU */}
            <div className="space-y-6">

              <p className="text-sm uppercase tracking-wider text-stone-500">
                Prochain événement
              </p>

              <div className="space-y-2">
                <p className="text-l uppercase tracking-wider text-stone-500">
                  {new Date(nextEvent.date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                  })}
                </p>

                <div className="flex items-end gap-4">
                  <div className="text-4xl md:text-5xl font-semibold">
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

              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
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
                  A mon tour de réserver 🍽️
                </Button>
              </Link>

              <div className="pt-6">
                <Link
                  href="/planning"
                  className="text-sm text-stone-500 hover:text-stone-800 transition"
                >
                  Voir tous les évenements →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
