import { supabasePublic } from "@/lib/supabase-public";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;

  const selectedType =
    params?.type === "DRINK" ? "DRINK" : "FOOD";

  const supabase = supabasePublic;

  // 🔎 Récupération catégories filtrées par type
  const { data: categories, error } = await supabase
    .from("menu_categories")
    .select(`
      id,
      name,
      position,
      type,
      menu_items (
        id,
        name,
        description,
        price,
        position
      )
    `)
    .eq("type", selectedType)
    .order("position", { ascending: true });

  if (error) {
    console.error("Erreur récupération menu:", error);
  }

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* ================= SWITCH ================= */}
        <div className="flex justify-center gap-4">

          <Link
            href="/menu?type=FOOD"
            className={`px-6 py-2 rounded-full border transition
              ${
                selectedType === "FOOD"
                  ? "bg-stone-900 text-white border-stone-900"
                  : "border-stone-300 hover:border-stone-500"
              }
            `}
          >
            🍽 Restauration
          </Link>

          <Link
            href="/menu?type=DRINK"
            className={`px-6 py-2 rounded-full border transition
              ${
                selectedType === "DRINK"
                  ? "bg-stone-900 text-white border-stone-900"
                  : "border-stone-300 hover:border-stone-500"
              }
            `}
          >
            🍷 Boissons
          </Link>

        </div>

        {/* ================= TITRE ================= */}
        <h1 className="text-4xl font-semibold text-center">
          {selectedType === "FOOD"
            ? "🍽 Notre carte"
            : "🍷 Carte des boissons"}
        </h1>

        {/* ================= MENU ================= */}
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">

          {categories?.map((category) => (
            <section key={category.id} className="space-y-6">

              <h2 className="text-2xl font-semibold border-b border-stone-200 pb-2">
                {category.name}
              </h2>

              <div className="space-y-4">
                {category.menu_items
                  ?.sort((a, b) => a.position - b.position)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="group flex justify-between items-start py-2 border-b border-stone-100"
                    >
                      <div className="space-y-1">
                        <h3 className="font-medium transition-all duration-200 group-hover:font-semibold group-hover:text-stone-900">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="text-sm text-stone-500 transition-all duration-200 group-hover:text-stone-700">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {item.price && (
                        <div className="font-medium whitespace-nowrap transition-transform duration-200 group-hover:scale-110">
                          {Number(item.price).toFixed(2)} €
                        </div>
                      )}
                    </div>
                  ))}
              </div>

            </section>
          ))}

        </div>

      </div>
    </div>
  );
}
