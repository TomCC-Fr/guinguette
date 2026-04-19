import { supabasePublic } from "@/lib/supabase-public";
import Link from "next/link";
import { Suspense } from "react";
import AnimatedMenuContent from "./AnimatedMenuContent";

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

  // ================= MENU =================
  const { data: categories } = await supabase
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

  // ================= SUPPLIERS =================
  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name, description, website")
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen bg-white py-14 px-6">
      <div className="max-w-6xl mx-auto space-y-14">

        {/* SWITCH */}
        <div className="flex justify-center gap-3">

          <Link
            href="/menu?type=FOOD"
            className={`px-5 py-1.5 text-sm rounded-full border transition
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
            className={`px-5 py-1.5 text-sm rounded-full border transition
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

        {/* CONTENU ANIMÉ */}
        <Suspense>
          <AnimatedMenuContent
            categories={categories || []}
            suppliers={suppliers || []}
            selectedType={selectedType}
          />
        </Suspense>

      </div>
    </div>
  );
}