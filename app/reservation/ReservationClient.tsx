"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const MAX_ONLINE = 10;

export default function ReservationClient({
  initialParams,
}: {
  initialParams: { date?: string; service?: string };
}) {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<string | null>(
    initialParams?.service || null
  );
  const [selectedDate, setSelectedDate] = useState(
    initialParams?.date || ""
  );
  const [selectedTime, setSelectedTime] = useState("");

  const [personnes, setPersonnes] = useState(2);

  const [availability, setAvailability] = useState<any>(null);
  const [timeSlots, setTimeSlots] = useState<
    { time: string; available: boolean }[]
  >([]);

  const [eventData, setEventData] = useState<any>(null);

  // ✅ NOUVEAU
  const [isServiceFull, setIsServiceFull] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // =========================
  // 🔥 SYNC URL
  // =========================
  useEffect(() => {
    const date = searchParams.get("date");
    const serviceParam = searchParams.get("service");

    if (date) setSelectedDate(date);
    if (serviceParam) setService(serviceParam);
  }, [searchParams]);

  // =========================
  // 🔎 AVAILABILITY
  // =========================
  useEffect(() => {
    if (!selectedDate) return;

    async function fetchAvailability() {
      const res = await fetch(`/api/availability?date=${selectedDate}`);
      const data = await res.json();

      setAvailability(data);

      if (
        service &&
        data?.services &&
        data.services[service] === false
      ) {
        setService(null);
        setSelectedTime("");
      }
    }

    fetchAvailability();
  }, [selectedDate]);

  // =========================
  // 🕒 CRÉNEAUX
  // =========================
  useEffect(() => {
    if (!selectedDate || !service) {
      setTimeSlots([]);
      return;
    }

    async function fetchTimes() {
      const res = await fetch(
        `/api/availability-times?date=${selectedDate}&service=${service}`
      );

      const data = await res.json();
      setTimeSlots(data);
    }

    fetchTimes();
  }, [selectedDate, service]);

  // =========================
  // 🔴 SERVICE COMPLET (NOUVEAU)
  // =========================
  useEffect(() => {
    if (!selectedDate || !service) {
      setIsServiceFull(false);
      return;
    }

    async function checkFull() {
      const res = await fetch(
        `/api/service-full?date=${selectedDate}&service=${service}`
      );

      if (!res.ok) return;

      const data = await res.json();
      setIsServiceFull(data.isFull);
    }

    checkFull();
  }, [selectedDate, service]);

  // =========================
  // 🎉 EVENT
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

      if (!res.ok) return;

      const data = await res.json();
      setEventData(data);
    }

    fetchEvent();
  }, [selectedDate, service]);

  // =========================
  // 📨 SUBMIT
  // =========================
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (personnes > MAX_ONLINE) {
      alert(
        "Pour les groupes de plus de 10 personnes, merci de nous appeler."
      );
      return;
    }

    if (isServiceFull) {
      alert(
        "Service complet. Merci de nous contacter au 02 41 93 39 00."
      );
      return;
    }

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
      commentaire: formData.get("commentaire"),
    };

    const res = await fetch("/api/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    setLoading(false);

    if (res.ok) {
      alert("Réservation envoyée 🍷");
      form.reset();
      setSelectedDate("");
      setService(null);
      setSelectedTime("");
      setPersonnes(2);
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-2xl md:text-3xl font-semibold mb-10">
          Je veux réserver une table :
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid md:grid-cols-2 gap-6">
            <input name="nom" placeholder="Nom" required className="border-b py-2" />
            <input name="telephone" placeholder="Téléphone" required className="border-b py-2" />
          </div>

          <input type="email" name="email" placeholder="Email" required className="border-b py-2 w-full" />

          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            className="border-b py-2"
          />

          {availability && !availability.isOpen && (
            <p className="text-red-600 text-sm">
              Établissement fermé ce jour
            </p>
          )}

          <div className="flex gap-3">
            {["MIDI", "SOIR"].map((s) => {
              const disabled = availability?.services?.[s] === false;

              return (
                <button
                  key={s}
                  type="button"
                  disabled={disabled}
                  onClick={() => setService(s)}
                  className={`px-4 py-2 rounded-full border ${
                    service === s ? "bg-black text-white" : ""
                  } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          {/* 🔴 MESSAGE SERVICE COMPLET */}
          {isServiceFull && (
            <p className="text-red-600 text-sm">
              Réservation en ligne non disponible pour ce service,
              veuillez nous contacter au 02 41 93 39 00
            </p>
          )}

          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!service || isServiceFull}
            required
            className="border-b py-2 w-full"
          >
            <option value="">Choisir une heure</option>

            {timeSlots.map((slot) => (
              <option
                key={slot.time}
                value={slot.time}
                disabled={!slot.available}
              >
                {slot.available
                  ? slot.time
                  : `❌ ${slot.time} (complet)`}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="personnes"
            min={1}
            max={20}
            value={personnes}
            onChange={(e) => setPersonnes(Number(e.target.value))}
            required
            className="border-b py-2 w-full"
          />

          {personnes > MAX_ONLINE && (
            <p className="text-amber-600 text-sm">
              Groupes de +10 → appelez-nous
            </p>
          )}

          <textarea
            name="commentaire"
            placeholder="Commentaire"
            className="border rounded px-3 py-2 w-full"
          />

          <button
            disabled={loading || isServiceFull}
            className="bg-black text-white px-6 py-3 rounded-full w-full disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Réserver"}
          </button>

        </form>

        {/* EVENT */}
        {eventData && (
          <div className="mt-10 border-t pt-6">
            <h3 className="font-semibold text-lg">
              {eventData.title}
            </h3>
            <p className="text-sm text-gray-600">
              {eventData.description}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}