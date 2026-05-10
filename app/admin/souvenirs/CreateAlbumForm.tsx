"use client";

  return (
    <div className="bg-stone-50 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        ➕ Nouvel album
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          required
          placeholder="Titre"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="border rounded-lg px-3 py-2 w-full"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="border rounded-lg px-3 py-2 w-full"
        />

        <input
          type="date"
          value={form.event_date}
          onChange={(e) =>
            setForm({
              ...form,
              event_date: e.target.value,
            })
          }
          className="border rounded-lg px-3 py-2"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm({
                ...form,
                published: e.target.checked,
              })
            }
          />

          Publier immédiatement
        </label>

        <button
          disabled={loading}
          className="bg-stone-900 text-white px-5 py-2 rounded-lg"
        >
          {loading ? "Création..." : "Créer l'album"}
        </button>

      </form>
    </div>
  );
}
