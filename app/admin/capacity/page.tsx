"use client";

import { useEffect, useState } from "react";

type Rule = {
  id: number;
  day_of_week: number;
  service: "MIDI" | "SOIR";
  max_capacity: number;
};

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export default function CapacityAdminPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    fetch("/api/admin/capacity")
      .then((res) => res.json())
      .then((data) => {
        setRules(data);
        setLoading(false);
      });
  }, []);

  // =========================
  // UPDATE VALUE
  // =========================
  function updateCapacity(id: number, value: number) {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, max_capacity: value } : r
      )
    );
  }

  // =========================
  // SAVE
  // =========================
  async function save(rule: Rule) {
    await fetch("/api/admin/capacity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rule),
    });

    alert("Sauvegardé ✅");
  }

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-6">
      <h1 className="text-2xl font-semibold">
        Capacités par service
      </h1>

      {rules.map((rule) => (
        <div
          key={rule.id}
          className="border rounded p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-medium">
              {DAYS[rule.day_of_week]} - {rule.service}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={rule.max_capacity}
              onChange={(e) =>
                updateCapacity(rule.id, Number(e.target.value))
              }
              className="border px-3 py-1 w-24"
            />

            <button
              onClick={() => save(rule)}
              className="bg-stone-900 text-white px-3 py-1 rounded"
            >
              Sauver
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}