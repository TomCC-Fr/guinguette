import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getDayOfWeek(dateString: string) {
  return new Date(dateString).getDay();
}

export async function GET(req: Request) {
  const supabase = supabaseAdmin;

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const service = searchParams.get("service")?.toUpperCase();

  if (!date || !service) {
    return NextResponse.json({ isFull: false });
  }

  const dayOfWeek = getDayOfWeek(date);

  try {
    // 🔎 TOTAL SERVICE
    const { data: totalData } = await supabase.rpc(
      "total_personnes_service",
      {
        p_date: date,
        p_service: service,
      }
    );

    const total = Number(totalData) || 0;

    // 🔁 CAPACITÉ
    const { data: capacity } = await supabase
      .from("capacity_rules")
      .select("max_capacity")
      .eq("day_of_week", dayOfWeek)
      .eq("service", service)
      .maybeSingle();

    const max = capacity?.max_capacity ?? 0;

    return NextResponse.json({
      isFull: max > 0 && total >= max,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ isFull: false });
  }
}