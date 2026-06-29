"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const MAX_ONLINE = 12;

export default function ReservationClient({
  initialParams,
}: {
  initialParams: { date?: string; service?: string };
}) {
  const searchParams = useSearchParams();

  const [loading, setLoading]             = useState(false);
  const [service, setService]             = useState<string | null>(initialParams?.service || null);
  const [selectedDate, setSelectedDate]   = useState(initialParams?.date || "");
  const [selectedTime, setSelectedTime]   = useState("");
  const [personnes, setPersonnes]         = useState(2);
  const [availability, setAvailability]   = useState<any>(null);
  const [timeSlots, setTimeSlots]         = useState<{ time: string; available: boolean }[]>([]);
  const [eventData, setEventData]         = useState<any>(null);
  const [isServiceFull, setIsServiceFull] = useState(false);
  const [sameDayClosed, setSameDayClosed] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const showFestivalMessage =
    selectedDate >= "2026-06-26" && selectedDate <= "2026-06-28";

  const isFridayDinner =
    service === "SOIR" && selectedDate && new Date(selectedDate).getDay() === 5;

  useEffect(() => {
    const date = searchParams.get("date");
    const serviceParam = searchParams.get("service");
    if (date) setSelectedDate(date);
    if (serviceParam) setService(serviceParam);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedDate || !service) { setSameDayClosed(false); return; }
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const todayStr = new Date().toISOString().split("T")[0];
    if (selectedDate !== todayStr) { setSameDayClosed(false); return; }
    if (service === "MIDI" && currentMinutes >= 11 * 60) { setSameDayClosed(true); return; }
    if (service === "SOIR" && currentMinutes >= 17 * 60) { setSameDayClosed(true); return; }
    setSameDayClosed(false);
  }, [selectedDate, service]);

  useEffect(() => {
    if (!selectedDate) return;
    async function fetchAvailability() {
      const res = await fetch(`/api/availability?date=${selectedDate}`);
      const data = await res.json();
      setAvailability(data);
      if (service && data?.services && data.services[service] === false) {
        setService(null); setSelectedTime("");
      }
    }
    fetchAvailability();
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate || !service) { setTimeSlots([]); return; }
    async function fetchTimes() {
      const res = await fetch(`/api/availability-times?date=${selectedDate}&service=${service}`);
      const data = await res.json();
      setTimeSlots(data);
    }
    fetchTimes();
  }, [selectedDate, service]);

  useEffect(() => {
    if (!selectedDate || !service) { setIsServiceFull(false); return; }
    async function checkFull() {
      const res = await fetch(`/api/service-full?date=${selectedDate}&service=${service}`);
      if (!res.ok) return;
      const data = await res.json();
      setIsServiceFull(data.isFull);
    }
    checkFull();
  }, [selectedDate, service]);

  useEffect(() => {
    if (!selectedDate || !service) { setEventData(null); return; }
    async function fetchEvent() {
      const res = await fetch(`/api/events-by-date?date=${selectedDate}&service=${service}`);
      if (!res.ok) return;
      const data = await res.json();
      setEventData(data);
    }
    fetchEvent();
  }, [selectedDate, service]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (personnes > MAX_ONLINE) { alert("Pour les groupes de plus de 12 personnes, merci de nous appeler."); return; }
    if (isServiceFull) { alert("Service complet. Merci de nous contacter au 02 41 93 39 00."); return; }
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      nom: formData.get("nom"), email: formData.get("email"),
      telephone: formData.get("telephone"), date: selectedDate,
      service, heure: selectedTime, personnes: formData.get("personnes"),
      commentaire: formData.get("commentaire"),
    };
    const res = await fetch("/api/reservation", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setLoading(false);
    if (res.ok) {
      alert("Réservation envoyée 🍷");
      form.reset(); setSelectedDate(""); setService(null); setSelectedTime(""); setPersonnes(2);
    } else { alert(result.error); }
  }

  const inputClass = [
    "w-full rounded-xl px-4 py-3 font-body text-sm",
    "focus:outline-none transition-colors duration-200",
  ].join(" ");

  const inputStyle = {
    backgroundColor: "oklch(0.97 0.008 80)",
    border: "1px solid oklch(0.88 0.01 80)",
    color: "oklch(0.15 0.02 60)",
  };

  return (
    <div className="min-h-screen py-24 px-6" style={{ backgroundColor: "oklch(0.99 0.008 80)" }}>
      <div className="max-w-2xl mx-auto">

        {/* ── EN-TÊTE ── */}
        <div className="mb-12 space-y-4">
          <p className="font-body text-xs uppercase tracking-[0.3em]"
            style={{ color: "oklch(0.58 0.13 148)" }}>
            Réservation
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold uppercase tracking-wider"
            style={{ color: "oklch(0.15 0.02 60)" }}>
            Réserver une table
          </h1>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
            <div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.13_148)]" />
            <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid md:grid-cols-2 gap-4">
            <input name="nom" placeholder="Nom" required className={inputClass} style={inputStyle} />
            <input name="telephone" placeholder="Téléphone" required className={inputClass} style={inputStyle} />
          </div>

          <input type="email" name="email" placeholder="Email" required className={inputClass} style={inputStyle} />

          <input type="date" min={today} value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required className={inputClass} style={inputStyle} />

          {availability && !availability.isOpen && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: "oklch(0.95 0.05 25)", border: "1px solid oklch(0.85 0.08 25)" }}>
              <p className="font-body text-sm" style={{ color: "oklch(0.45 0.12 25)" }}>
                ⛔ Établissement fermé ce jour.
              </p>
            </div>
          )}

          {/* ── MIDI / SOIR ── */}
          <div className="flex gap-3">
            {["MIDI", "SOIR"].map((s) => {
              const disabled = availability?.services?.[s] === false;
              const isActive = service === s;
              return (
                <button key={s} type="button" disabled={disabled}
                  onClick={() => setService(s)}
                  className="px-6 py-2.5 rounded-full font-body text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isActive ? "oklch(0.58 0.13 148)" : "oklch(0.97 0.008 80)",
                    border: isActive ? "1px solid oklch(0.58 0.13 148)" : "1px solid oklch(0.88 0.01 80)",
                    color: isActive ? "white" : "oklch(0.45 0.02 60)",
                  }}>
                  {s === "MIDI" ? "🌞 Midi" : "🌙 Soir"}
                </button>
              );
            })}
          </div>

          {isServiceFull && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: "oklch(0.95 0.05 25)", border: "1px solid oklch(0.85 0.08 25)" }}>
              <p className="font-body text-sm" style={{ color: "oklch(0.45 0.12 25)" }}>
                🔴 Réservation en ligne non disponible.{" "}
                <a href="tel:+33241933900" className="underline">02 41 93 39 00</a>
              </p>
            </div>
          )}

          {sameDayClosed && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: "oklch(0.97 0.06 80)", border: "1px solid oklch(0.88 0.08 75)" }}>
              <p className="font-body text-sm" style={{ color: "oklch(0.40 0.10 65)" }}>
                ⏰ Réservations closes pour ce service.{" "}
                <a href="tel:+33241933900" className="underline">02 41 93 39 00</a>
              </p>
            </div>
          )}

          {showFestivalMessage && (
            <div className="rounded-xl px-4 py-4 space-y-2"
              style={{ backgroundColor: "oklch(0.97 0.06 80)", border: "1px solid oklch(0.88 0.08 75)" }}>
              <p className="font-display text-sm uppercase tracking-wide" style={{ color: "oklch(0.40 0.10 65)" }}>
                📢 Information importante
              </p>
              <p className="font-body text-sm leading-relaxed" style={{ color: "oklch(0.45 0.08 65)" }}>
                En raison des fortes chaleurs récentes et une avarie de matériel,{" "}
                <strong>pas de soirée moules-frites et la carte est exceptionnellement remaniée ce week-end</strong>{" "}
                mais nous conservons plusieurs choix à la carte.
              </p>
              <p className="font-body text-sm" style={{ color: "oklch(0.55 0.06 65)" }}>
                Pour en savoir plus :{" "}
                <a href="tel:+33241933900" className="underline">02 41 93 39 00</a>
              </p>
            </div>
          )}

          {isFridayDinner && (
            <div className="rounded-xl px-4 py-4 space-y-2"
              style={{ backgroundColor: "oklch(0.95 0.04 148)", border: "1px solid oklch(0.85 0.07 148)" }}>
              <p className="font-display text-sm uppercase tracking-wide"
                style={{ color: "oklch(0.35 0.10 148)" }}>
                🍽️ Soirée Moules-Frites
              </p>
              <p className="font-body text-sm leading-relaxed" style={{ color: "oklch(0.40 0.08 148)" }}>
                Le vendredi soir, la guinguette vous propose sa traditionnelle soirée{" "}
                <strong>Moules-Frites</strong>. Une alternative est disponible (bavette ou plat végétarien).
              </p>
            </div>
          )}

          <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!service || isServiceFull || sameDayClosed}
            required className={inputClass + " cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"}
            style={inputStyle}>
            <option value="">Choisir une heure</option>
            {timeSlots.map((slot) => (
              <option key={slot.time} value={slot.time} disabled={!slot.available}>
                {slot.available ? slot.time : `❌ ${slot.time} (complet)`}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            <input type="number" name="personnes" min={1} max={20} value={personnes}
              onChange={(e) => setPersonnes(Number(e.target.value))}
              required placeholder="Nombre de personnes"
              className={inputClass} style={inputStyle} />
            {personnes > MAX_ONLINE && (
              <div className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: "oklch(0.97 0.06 80)", border: "1px solid oklch(0.88 0.08 75)" }}>
                <p className="font-body text-sm" style={{ color: "oklch(0.40 0.10 65)" }}>
                  👥 Groupes de plus de 12 —{" "}
                  <a href="tel:+33241933900" className="underline">02 41 93 39 00</a>
                </p>
              </div>
            )}
          </div>

          <textarea name="commentaire" placeholder="Commentaire (allergies, occasions spéciales…)"
            rows={3}
            className={inputClass + " resize-none"} style={inputStyle} />

          <button type="submit"
            disabled={loading || isServiceFull || sameDayClosed}
            className="w-full py-4 rounded-full text-white font-body font-semibold text-sm tracking-wide active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            style={{ backgroundColor: "oklch(0.58 0.13 148)" }}>
            {loading ? "Envoi en cours…" : "Confirmer ma réservation"}
          </button>

        </form>

        {eventData && (
          <div className="mt-10 pt-8 space-y-2"
            style={{ borderTop: "1px solid oklch(0.88 0.01 80)" }}>
            <p className="font-body text-xs uppercase tracking-[0.2em]"
              style={{ color: "oklch(0.58 0.13 148)" }}>
              Événement ce soir
            </p>
            <h3 className="font-display text-xl uppercase tracking-wide"
              style={{ color: "oklch(0.15 0.02 60)" }}>
              {eventData.title}
            </h3>
            {eventData.description && (
              <p className="font-body text-sm leading-relaxed"
                style={{ color: "oklch(0.45 0.02 60)" }}>
                {eventData.description}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
