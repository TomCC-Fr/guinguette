"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AddReservationForm({
  defaultDate,
}: {
  defaultDate: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
    nom: "",
    telephone: "",
    date: defaultDate,
    service: "SOIR",
    heure: "19:30", // valeur par défaut
    personnes: 2,
    });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/admin/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpen(false);
    router.refresh();
  }

  return (
    <div className="bg-stone-50 rounded-2xl p-6">

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <span className="font-semibold text-lg">
          ➕ Ajouter une réservation
        </span>

        <ChevronDown
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="mt-6 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid md:grid-cols-3 gap-4">

              <input
                placeholder="Nom"
                required
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, nom: e.target.value })
                }
              />

              <input
                placeholder="Téléphone"
                required
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, telephone: e.target.value })
                }
              />

              <input
                type="date"
                value={form.date}
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />

              <select
                className="border rounded px-3 py-2"
                value={form.service}
                onChange={(e) => {
                    const newService = e.target.value;
                    setForm({
                    ...form,
                    service: newService,
                    heure: newService === "MIDI" ? "12:30" : "19:30",
                    });
                }}
                >
                <option value="MIDI">MIDI</option>
                <option value="SOIR">SOIR</option>
                </select>

              <input
                placeholder="Heure (ex: 19:30)"
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, heure: e.target.value })
                }
              />
                <input
                value={form.heure}
                placeholder="Heure"
                className="border rounded px-3 py-2"
                onChange={(e) =>
                    setForm({ ...form, heure: e.target.value })
                }
                />

              <input
                type="number"
                placeholder="Personnes"
                min={1}
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, personnes: Number(e.target.value) })
                }
              />

            </div>

            <button className="bg-emerald-700 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition">
              Ajouter
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
