import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// =========================
// GET
// =========================
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("capacity_rules")
    .select("*")
    .order("day_of_week");

  if (error) {
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data);
}

// =========================
// POST (UPDATE)
// =========================
export async function POST(req: Request) {
  const body = await req.json();

  const { id, max_capacity } = body;

  const { error } = await supabaseAdmin
    .from("capacity_rules")
    .update({ max_capacity })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Erreur update" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}