import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");
  const service = searchParams.get("service"); // MIDI / SOIR / null

  if (!date) {
    return NextResponse.json({ error: "Date requise" }, { status: 400 });
  }

  const supabase = await createClient();

  let query = supabase
    .from("reservations")
    .select("*")
    .eq("date", date)
    .eq("cancelled", false)
    .order("service", { ascending: true })
    .order("heure", { ascending: true });

  if (service) {
    query = query.eq("service", service);
  }

  const { data: reservations, error } = await query;

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ reservations });
}
