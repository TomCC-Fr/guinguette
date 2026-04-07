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
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [availability, setAvailability] = useState<{
    isOpen: boolean;
    services: { MIDI: boolean; SOIR: boolean };
  } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // =========================
  // 🔎 AVAILABILITY
  // =========================
  useEffect(() => {
    if (!selectedDate) {
      setAvailability(null);
      return;
    }

    async function fetchAvailability() {
      const res = await fetch(
        `/api/availability?date=${selectedDate}`
      );

      if (!res.ok) {
        setAvailability(null);
        return;
      }

      const data = await res.json();
      setAvailability(data);

      if (service && !data.services[service as "MIDI" | "SOIR"]) {
        setService(null);
      }
    }

    fetchAvailability();
  }, [selectedDate]);

  // =========================
  // 🎉 EVENTS
  // =========================
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

  useEffect(() => {
    if (service === "MIDI") setSelectedTime("12:30");
    if (service === "SOIR") setSelectedTime("19:30");
  }, [service]);

  function formatTime(time?: string) {
    if (!time) return "";
    return time.slice(0, 5);
  }

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
      service,
      heure: selectedTime,
      personnes: formData.get("personnes"),
    };

    const response = await fetch("/api/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setLoading(false);

    if (response.ok) {
      alert("Réservation envoyée 🍷");

      form.reset();
      setSelectedDate("");
      setService(null);
      setSelectedTime("");
      setEventData(null);
      setAvailability(null);
    } else {
      // 🔥 gestion intelligente des erreurs
      if (result.error === "Service complet") {
        alert(
          "Ce service est complet.\n\nAppelez-nous au 06 XX XX XX XX pour voir les disponibilités restantes ☎️"
        );
      } else {
        alert(result.error || "Erreur lors de la réservation");
      }
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-2xl md:text-3xl font-semibold mb-10">
          Réserver une table
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            <input name="nom" placeholder="Nom de la réservation" required className="border-b py-2" />
            <input name="telephone" placeholder="Téléphone" required className="border-b py-2" />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="border-b py-2 w-full"
          />

          <input
            type="date"
            required
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-b py-2"
          />

          {availability && !availability.isOpen && (
            <p className="text-red-600 text-sm">
              Guinguette fermée ce jour
            </p>
          )}

          <div className="flex gap-3">
            {["MIDI", "SOIR"].map((s) => {
              const isAvailable =
                availability?.services?.[s as "MIDI" | "SOIR"] ?? true;

              return (
                <button
                  key={s}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setService(s)}
                  className={`px-4 py-2 rounded-full border text-sm ${
                    service === s
                      ? "bg-stone-900 text-white"
                      : ""
                  } ${!isAvailable ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <select
            required
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!service}
            className="border-b py-2 w-full"
          >
            <option value="">
              {service ? "Choisir une heure" : "Choisissez un service"}
            </option>

            {availableTimes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="personnes"
            min={1}
            max={20}
            placeholder="Nombre de personnes"
            required
            className="border-b py-2 w-full"
          />

          <button
            disabled={loading}
            className="bg-stone-900 text-white px-6 py-3 rounded-full w-full"
          >
            {loading ? "Envoi..." : "Réserver"}
          </button>
        </form>

        {/* 🎉 EVENT COMPLET RESTAURÉ */}
        {eventData && (
          <div className="mt-10 border-t pt-6">

            <div className="flex flex-col md:flex-row gap-6 items-start">

              {/* IMAGE */}
              {eventData.image_url && (
                <img
                  src={eventData.image_url}
                  alt={eventData.title}
                  className="w-full md:w-48 h-40 object-cover rounded-lg flex-shrink-0"
                />
              )}

              {/* CONTENU */}
              <div className="space-y-2">

                <h3 className="font-semibold text-lg">
                  {eventData.title}
                </h3>

                {eventData.start_time && (
                  <p className="text-sm text-stone-600">
                    Début : {eventData.start_time.slice(0, 5)}
                  </p>
                )}

                {eventData.description && (
                  <p className="text-sm text-stone-600">
                    {eventData.description}
                  </p>
                )}

                <div className="flex gap-4 pt-2">
                  {eventData.youtube_url && (
                    <a href={eventData.youtube_url} target="_blank">
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}

                  {eventData.music_url && (
                    <a href={eventData.music_url} target="_blank">
                      <Music className="w-5 h-5" />
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