"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProcessButton from "./ProcessButton";
import CancelButton from "./CancelButton";

function CommentCell({ text }: { text?: string }) {
  const [open, setOpen] = useState(false);

  if (!text) {
    return <span className="text-stone-400">-</span>;
  }

  const isLong = text.length > 40;

  return (
    <div className="text-xs text-stone-600">
      {!isLong ? (
        text
      ) : (
        <>
          <span>
            {open ? text : text.slice(0, 40) + "..."}
          </span>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="ml-2 text-blue-600 underline"
          >
            {open ? "Réduire" : "Voir"}
          </button>
        </>
      )}
    </div>
  );
}

export default function EditableRow({
  reservation,
}: any) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    ...reservation,
    commentaire: reservation.commentaire || "",
  });

  const cancelled = Boolean(reservation.cancelled);
  const processed = Boolean(reservation.processed);

  // =========================
  // SAVE
  // =========================
  async function save() {
    const res = await fetch("/api/admin/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Erreur lors de la sauvegarde");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  // =========================
  // RESEND EMAIL
  // =========================
  async function resendEmail() {
    const res = await fetch(
      "/api/admin/resend-email",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id: reservation.id,
        }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Erreur email");
      return;
    }

    alert("Email renvoyé ✅");
  }

  // =========================
  // MODE EDITION
  // =========================
  if (editing && !cancelled) {
    return (
      <tr className="border-t bg-amber-100">
        {/* CHECK */}
        <td></td>

        {/* HEURE */}
        <td className="p-2">
          <input
            value={form.heure}
            onChange={(e) =>
              setForm({
                ...form,
                heure: e.target.value,
              })
            }
            className="border px-2 py-1 rounded w-full"
          />
        </td>

        {/* SERVICE */}
        <td></td>

        {/* NOM */}
        <td className="p-2">
          <input
            value={form.nom}
            onChange={(e) =>
              setForm({
                ...form,
                nom: e.target.value,
              })
            }
            className="border px-2 py-1 rounded w-full"
          />
        </td>

        {/* PERSONNES */}
        <td className="p-2">
          <input
            type="number"
            value={form.personnes}
            onChange={(e) =>
              setForm({
                ...form,
                personnes: Number(
                  e.target.value
                ),
              })
            }
            className="border px-2 py-1 rounded w-full"
          />
        </td>

        {/* TELEPHONE */}
        <td className="p-2">
          <input
            value={form.telephone || ""}
            onChange={(e) =>
              setForm({
                ...form,
                telephone:
                  e.target.value,
              })
            }
            className="border px-2 py-1 rounded w-full"
          />
        </td>

        {/* COMMENTAIRE */}
        <td className="p-2">
          <textarea
            value={form.commentaire}
            onChange={(e) =>
              setForm({
                ...form,
                commentaire:
                  e.target.value,
              })
            }
            className="border rounded px-2 py-1 w-full text-sm resize-none"
            rows={2}
          />
        </td>

        {/* ACTIONS */}
        <td className="p-2 flex gap-2">
          <button
            onClick={save}
            className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition"
          >
            Sauver
          </button>

          <button
            onClick={() =>
              setEditing(false)
            }
            className="bg-stone-200 px-3 py-1 rounded hover:bg-stone-300 transition"
          >
            Annuler
          </button>
        </td>
      </tr>
    );
  }

  // =========================
  // STYLE LIGNE
  // =========================
  let rowStyle =
    "hover:bg-stone-50";

  if (cancelled) {
    rowStyle =
      "bg-red-50 text-stone-400 line-through";
  } else if (processed) {
    rowStyle = "bg-emerald-50";
  }

  // =========================
  // MODE NORMAL
  // =========================
  return (
    <tr
      className={`border-t transition ${rowStyle}`}
    >
      {/* CHECK */}
      <td className="p-3">
        <ProcessButton
          id={reservation.id}
          processed={processed}
          cancelled={cancelled}
        />
      </td>

      {/* HEURE */}
      <td className="p-3 font-medium">
        {reservation.heure}
      </td>

      {/* SERVICE */}
      <td className="p-3">
        {reservation.service ===
        "MIDI"
          ? "🌞 MIDI"
          : "🌙 SOIR"}
      </td>

      {/* NOM */}
      <td className="p-3 font-semibold">
        {reservation.nom}
      </td>

      {/* PERSONNES */}
      <td className="p-3">
        {reservation.personnes}
      </td>

      {/* TELEPHONE */}
      <td className="p-3">
        {reservation.telephone ||
          "-"}
      </td>

      {/* COMMENTAIRE */}
      <td className="p-3 max-w-[250px]">
        <CommentCell
          text={
            reservation.commentaire
          }
        />
      </td>

      {/* ACTIONS */}
      <td className="p-3 flex gap-2">
        <button
          disabled={cancelled}
          onClick={() =>
            setEditing(true)
          }
          className={`px-3 py-1 rounded text-sm border transition ${
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

        <button
          disabled={cancelled}
          onClick={resendEmail}
          className={`px-3 py-1 rounded text-sm transition ${
            cancelled
              ? "bg-stone-200 text-stone-500 cursor-not-allowed"
              : "bg-stone-900 text-white hover:bg-blue-700"
          }`}
        >
          📧 Mail
        </button>

      </td>
    </tr>
  );
}