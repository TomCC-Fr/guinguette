import { supabasePublic } from "@/lib/supabase-public";
import Link from "next/link";
import { Suspense } from "react";
import AnimatedMenuContent from "./AnimatedMenuContent";
import { redirect } from "next/navigation";
import { FEATURES } from "@/lib/features";

export const dynamic = "force-dynamic";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const selectedType = params?.type === "DRINK" ? "DRINK" : "FOOD";
  const supabase = supabasePublic;

  const { data: categories } = await supabase
    .from("menu_categories")
    .select(`id, name, position, type, menu_items (id, name, description, price, position)`)
    .eq("type", selectedType)
    .order("position", { ascending: true });

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name, description, website")
    .order("name", { ascending: true });

  if (!FEATURES.MENU) redirect("/");

  return (
    <div className="min-h-screen py-24 px-6" style={{ backgroundColor: "oklch(0.99 0.008 80)" }}>
      <div className="max-w-6xl mx-auto space-y-16">

        {/* ── EN-TÊTE ── */}
        <div className="text-center space-y-4">
          <p className="font-body text-xs uppercase tracking-[0.3em]"
            style={{ color: "oklch(0.58 0.13 148)" }}>
            Menu
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold uppercase tracking-wider"
            style={{ color: "oklch(0.15 0.02 60)" }}>
            La carte
          </h1>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
            <div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.13_148)]" />
            <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
          </div>
        </div>

        {/* ── SWITCH ── */}
        <div className="flex justify-center gap-3">
          {[
            { href: "/menu?type=FOOD", type: "FOOD", label: "🍽️ Restauration" },
            { href: "/menu?type=DRINK", type: "DRINK", label: "🍷 Boissons" },
          ].map((item) => (
            <Link key={item.type} href={item.href}
              className="px-6 py-2.5 text-sm font-body font-semibold rounded-full transition-all duration-200"
              style={{
                backgroundColor: selectedType === item.type ? "oklch(0.58 0.13 148)" : "oklch(0.97 0.008 80)",
                border: selectedType === item.type ? "1px solid oklch(0.58 0.13 148)" : "1px solid oklch(0.88 0.01 80)",
                color: selectedType === item.type ? "white" : "oklch(0.45 0.02 60)",
              }}>
              {item.label}
            </Link>
          ))}
        </div>

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
