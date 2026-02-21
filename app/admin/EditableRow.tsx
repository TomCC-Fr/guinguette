"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProcessButton from "./ProcessButton";
import CancelButton from "./CancelButton";

export default function EditableRow({ reservation }: any) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(reservation);

  const cancelled = Boolean(reservation.cancelled);
  const processed = Boolean(reservation.processed);

  async function save() {
    await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setEditing(false);
    router.refresh();
  }

  // =========================
  // MODE EDITION
  // =========================
  if (editing && !cancelled) {
    return (
      <tr className="border-t bg-amber-50">
        <td></td>
        <td className="p-2">
          <input
            value={form.heure}
            onChange={(e) =>
              setForm({ ...form, heure: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
        </td>
        <td></td>
        <td className="p-2">
          <input
            value={form.nom}
            onChange={(e) =>
              setForm({ ...form, nom: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
        </td>
        <td className="p-2">
          <input
            type="number"
            value={form.personnes}
            onChange={(e) =>
              setForm({
                ...form,
                personnes: Number(e.target.value),
              })
            }
            className="border px-2 py-1 rounded w-full"
          />
        </td>
        <td className="p-2">
          <input
            value={form.telephone}
            onChange={(e) =>
              setForm({
                ...form,
                telephone: e.target.value,
              })
            }
            className="border px-2 py-1 rounded w-full"
          />
        </td>
        <td className="p-2 flex gap-2">
          <button
            onClick={save}
            className="bg-emerald-600 text-white px-3 py-1 rounded"
          >
            Sauver
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-stone-200 px-3 py-1 rounded"
          >
            Annuler
          </button>
        </td>
      </tr>
    );
  }

  // =========================
  // MODE NORMAL
  // =========================
  return (
    <tr
      className={`border-t ${
        cancelled ? "bg-red-50 text-stone-400" : ""
      }`}
    >
      {/* ✔ */}
      <td className="p-3">
        <ProcessButton
          id={reservation.id}
          processed={Boolean(reservation.processed)}
          cancelled={Boolean(reservation.cancelled)}
        />
      </td>

      {/* Heure */}
      <td className="p-3">{reservation.heure}</td>

      {/* Service */}
      <td className="p-3">
        {reservation.service === "MIDI"
          ? "🌞 MIDI"
          : "🌙 SOIR"}
      </td>

      {/* Nom */}
      <td className="p-3 font-medium">
        {reservation.nom}
      </td>

      {/* Personnes */}
      <td className="p-3">{reservation.personnes}</td>

      {/* Téléphone */}
      <td className="p-3">{reservation.telephone}</td>

      {/* Actions */}
      <td className="p-3 flex gap-2">
        <button
          disabled={cancelled}
          onClick={() => setEditing(true)}
          className={`px-3 py-1 rounded text-sm border
            ${
              cancelled
                ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                : "bg-white hover:bg-stone-100"
            }`}
        >
          Modifier
        </button>

        <CancelButton
          id={reservation.id}
          cancelled={cancelled}
        />
      </td>
    </tr>
  );
}
