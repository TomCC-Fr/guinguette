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

export default function CapacityBlock() {
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    if (!open) return;

    fetch("/api/admin/capacity")
      .then((res) => res.json())
      .then(setRules);
  }, [open]);

  function updateCapacity(id: number, value: number) {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, max_capacity: value } : r
      )
    );
  }

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

  return (
    <div className="bg-stone-50 p-6 rounded-2xl">

      {/* HEADER */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center cursor-pointer"
      >
        <h2 className="text-lg font-semibold">
          Gestion des capacités
        </h2>
        <span>{open ? "▲" : "▼"}</span>
      </div>

      {/* CONTENT */}
      {open && (
        <div className="mt-6 space-y-4">

          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="border px-3 py-2 w-full"
          >
            {DAYS.map((d, i) => (
              <option key={i} value={i}>
                {d}
              </option>
            ))}
          </select>

          {rules
            .filter((r) => r.day_of_week === selectedDay)
            .map((rule) => (
              <div
                key={rule.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <span className="font-medium">
                  {rule.service}
                </span>

                <div className="flex gap-3">
                  <input
                    type="number"
                    value={rule.max_capacity}
                    onChange={(e) =>
                      updateCapacity(rule.id, Number(e.target.value))
                    }
                    className="border px-2 py-1 w-20"
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
      )}
    </div>
  );
}