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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    date: defaultDate,
    service: "SOIR",
    heure: "19:30",
    personnes: 2,
    commentaire: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/admin/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert("Erreur : " + result.error);
      return;
    }

    // reset
    setForm({
      nom: "",
      email: "",
      telephone: "",
      date: defaultDate,
      service: "SOIR",
      heure: "19:30",
      personnes: 2,
      commentaire: "",
    });

    setOpen(false);

    router.refresh();

    alert("Réservation ajoutée ✅");
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
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid md:grid-cols-3 gap-4">

              <input
                placeholder="Nom"
                required
                value={form.nom}
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, nom: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email (optionnel)"
                value={form.email}
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                placeholder="Téléphone (optionnel)"
                value={form.telephone}
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
                type="time"
                value={form.heure}
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, heure: e.target.value })
                }
              />

              <input
                type="number"
                min={1}
                value={form.personnes}
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({
                    ...form,
                    personnes: Number(e.target.value),
                  })
                }
              />

            </div>

            {/* ✅ COMMENTAIRE CORRIGÉ */}
            <textarea
              placeholder="Commentaire (allergies, anniversaire...)"
              value={form.commentaire}
              onChange={(e) =>
                setForm({ ...form, commentaire: e.target.value })
              }
              maxLength={300}
              rows={2}
              className="border rounded px-3 py-2 w-full text-sm resize-none"
            />

            <button
              disabled={loading}
              className="bg-emerald-700 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition"
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}