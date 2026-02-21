import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const { error } = await supabase
    .from("reservations")
    .insert({
      nom: body.nom,
      telephone: body.telephone,
      date: body.date,
      service: body.service,
      heure: body.heure,
      personnes: body.personnes,
      processed: true, // admin = déjà traité
    });

  if (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
