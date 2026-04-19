import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddReservationForm from "./AddReservationForm";
import EditableRow from "./EditableRow";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; service?: string }>;
}) {
  const supabase = await createClient();

  // 🔐 Vérification session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 🔎 Filtres
  const params = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = params?.date ?? today;
  const selectedService = params?.service || "";

  let query = supabase.from("reservations").select("*");

  if (selectedDate) query = query.eq("date", selectedDate);
  if (selectedService) query = query.eq("service", selectedService);

  const { data: reservations, error } = await query
    .order("date", { ascending: true })
    .order("heure", { ascending: true });

  if (error) {
    console.error("Erreur Supabase:", error);
  }

  const total =
    reservations?.reduce(
      (sum, r) =>
        r.cancelled ? sum : sum + Number(r.personnes),
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        <AddReservationForm defaultDate={selectedDate} />

        <div className="bg-stone-50 p-6 rounded-2xl">
          <form method="GET" className="flex flex-wrap gap-6 items-end">

            <div>
              <label className="block text-sm text-stone-500 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                defaultValue={selectedDate}
                className="border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-500 mb-1">
                Service
              </label>
              <select
                name="service"
                defaultValue={selectedService}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Tous</option>
                <option value="MIDI">MIDI</option>
                <option value="SOIR">SOIR</option>
              </select>
            </div>

            <button className="bg-stone-800 text-white px-5 py-2 rounded-lg">
              Filtrer
            </button>

            <Link
              href={`/admin?date=${today}`}
              className="text-sm text-stone-500 underline"
            >
              Réinitialiser
            </Link>

            <a
              href={`/api/admin/print/pdf?date=${selectedDate}&service=${selectedService}`}
              target="_blank"
              className="bg-stone-900 text-white px-5 py-2 rounded-lg"
            >
              🖨 Imprimer
            </a>

          </form>
        </div>

        <div className="bg-stone-50 p-6 rounded-2xl">
          <p className="text-sm text-stone-500">
            Total couverts (hors annulées)
          </p>
          <p className="text-2xl font-semibold">
            {total}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-100 text-stone-600">
              <tr>
                <th className="p-3 text-left">✔</th>
                <th className="p-3 text-left">Heure</th>
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Pers.</th>
                <th className="p-3 text-left">Téléphone</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reservations?.length ? (
                reservations.map((r) => (
                  <EditableRow key={r.id} reservation={r} />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-stone-400">
                    Aucune réservation
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}