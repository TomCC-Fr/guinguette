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

  const today = new Date().toISOString().split("T")[0];

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

    setLoading(false);

    if (response.ok) {
      alert("Réservation envoyée 🍷");

      form.reset();
      setSelectedDate("");
      setService(null);
      setSelectedTime("");
      setEventData(null);
    } else {
      alert("Erreur lors de la réservation");
    }
  }

  function formatTime(time: string) {
    if (!time) return "";
    return time.slice(0, 5);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-2xl md:text-3xl font-semibold mb-10">
          Réserver une table
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* NOM + TEL */}
          <div className="grid md:grid-cols-2 gap-6">
            <input name="nom" placeholder="Nom de la réservation" required className="border-b py-2" />
            <input name="telephone" placeholder="Téléphone" required className="border-b py-2" />
          </div>

          {/* EMAIL + TOOLTIP */}
          <div className="relative group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="border-b py-2 w-full"
            />

            {/* Tooltip desktop */}
            <div className="hidden md:block absolute left-0 top-full mt-2 text-xs text-stone-500 opacity-0 group-hover:opacity-100 transition">
              Vous recevrez une confirmation de réservation par email
            </div>

            {/* Message mobile (focus) */}
            <p className="md:hidden text-xs text-stone-500 mt-1">
              Vous recevrez une confirmation de réservation par email
            </p>
          </div>

          {/* DATE + SERVICE */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="date"
              required
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-b py-2"
            />

            <div className="flex gap-3">
              {["MIDI", "SOIR"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setService(s)}
                  className={`px-4 py-2 rounded-full border text-sm ${
                    service === s
                      ? "bg-stone-900 text-white"
                      : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* HEURE */}
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

          {/* PERSONNES */}
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

        {/* EVENT */}
        {eventData && (
          <div className="mt-10 border-t pt-6">
            <h3 className="font-semibold mb-2">{eventData.title}</h3>
            {eventData.description && (
              <p className="text-sm text-stone-600">
                {eventData.description}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}