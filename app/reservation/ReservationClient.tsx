"use client";

import { useState, useEffect } from "react";
import { Youtube, Music } from "lucide-react";

export default function ReservationClient({
  initialParams,
}: {
  initialParams: { date?: string; service?: string };
}) {
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<string | null>(
    initialParams?.service || null
  );
  const [selectedDate, setSelectedDate] = useState(
    initialParams?.date || ""
  );
  const [eventData, setEventData] = useState<any | null>(null);

  const today = new Date().toISOString().split("T")[0];

  /* ===============================
     FETCH EVENT SELON DATE + SERVICE
  =============================== */
  useEffect(() => {
    if (!selectedDate || !service) {
      setEventData(null);
      return;
    }

    async function fetchEvent() {
      const res = await fetch(
        `/api/events-by-date?date=${selectedDate}&service=${service}`
      );

      if (!res.ok) {
        setEventData(null);
        return;
      }

      const data = await res.json();
      setEventData(data);
    }

    fetchEvent();
  }, [selectedDate, service]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      nom: formData.get("nom"),
      email: formData.get("email"),
      telephone: formData.get("telephone"),
      date: selectedDate,
      service: formData.get("service"),
      heure: formData.get("heure"),
      personnes: formData.get("personnes"),
    };

    const response = await fetch("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (response.ok) {
      alert("Demande envoyée 🍷");
      form.reset();
      setSelectedDate("");
      setService(null);
      setEventData(null);
    } else {
      alert("Erreur lors de la réservation");
    }
  }

  function generateTimes(start: string, end: string) {
    const times: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    while (h < endH || (h === endH && m <= endM)) {
      times.push(
        `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`
      );
      m += 15;
      if (m === 60) {
        m = 0;
        h++;
      }
    }
    return times;
  }

  const midiTimes = generateTimes("11:45", "13:00");
  const soirTimes = generateTimes("19:00", "21:00");

  const availableTimes =
    service === "MIDI"
      ? midiTimes
      : service === "SOIR"
      ? soirTimes
      : [];

  function formatTime(time: string) {
    if (!time) return "";
    return time.slice(0, 5);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-24">

        <h1 className="text-3xl font-semibold mb-12">
          Réserver une table du côté restauration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nom + Téléphone */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-stone-500">Nom</label>
              <input
                name="nom"
                required
                className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:outline-none focus:border-stone-800 transition"
              />
            </div>

            <div>
              <label className="text-sm text-stone-500">Téléphone</label>
              <input
                name="telephone"
                required
                className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:outline-none focus:border-stone-800 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-stone-500">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:outline-none focus:border-stone-800 transition"
            />
          </div>

          {/* Date + Service */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-stone-500">Date</label>
              <input
                type="date"
                required
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:outline-none focus:border-stone-800 transition"
              />
            </div>

            <div>
              <label className="text-sm text-stone-500 block mb-2">
                Service
              </label>

              <div className="flex gap-3">
                {["MIDI", "SOIR"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setService(s)}
                    className={`px-4 py-1 rounded-full text-sm border transition
                      ${
                        service === s
                          ? "bg-stone-800 text-white border-stone-800"
                          : "border-stone-300 hover:border-stone-500"
                      }
                    `}
                  >
                    {s === "MIDI" ? "🌞 Midi" : "🌙 Soir"}
                  </button>
                ))}
              </div>

              <input type="hidden" name="service" value={service || ""} required />
            </div>
          </div>

          {/* Heure + Personnes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-stone-500">
                Heure d’arrivée
              </label>
              <select
                name="heure"
                required
                disabled={!service}
                className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:outline-none focus:border-stone-800 transition"
              >
                <option value="">
                  {service
                    ? "Choisir une heure"
                    : "Choisissez d'abord un service"}
                </option>

                {availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-stone-500">
                Nombre de personnes
              </label>
              <input
                type="number"
                name="personnes"
                min={1}
                max={20}
                required
                className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:outline-none focus:border-stone-800 transition"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="mt-4 bg-stone-900 text-white px-8 py-3 rounded-full hover:bg-stone-700 transition"
          >
            {loading ? "Envoi..." : "Envoyer la demande"}
          </button>
        </form>

        {/* ÉVÉNEMENT */}
        {eventData && (
          <div className="mt-10 border-t border-stone-200 pt-8">

            <p className="text-xs uppercase tracking-wider text-stone-500 mb-4">
              Pendant ce service
            </p>

            <div className="flex gap-5 items-start">

              {eventData.image_file && (
                <img
                  src={`/events/${eventData.image_file}`}
                  alt={eventData.title}
                  className="w-20 h-20 object-cover rounded-full border border-stone-200"
                />
              )}

              <div className="space-y-2">

                <h3 className="text-base font-semibold">
                  {eventData.title}
                  {eventData.heure_debut && (
                    <span className="text-stone-500 font-normal">
                      {" "}
                      – à partir de {formatTime(eventData.heure_debut)}
                    </span>
                  )}
                </h3>

                {eventData.description && (
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {eventData.description}
                  </p>
                )}

                <div className="flex gap-5 text-sm">
                  {eventData.spotify_url && (
                    <a
                      href={eventData.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition"
                    >
                      <Music size={14} />
                      Spotify
                    </a>
                  )}

                  {eventData.youtube_url && (
                    <a
                      href={eventData.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                    >
                      <Youtube size={14} />
                      YouTube
                    </a>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}