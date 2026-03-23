import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json();

  const {
    nom,
    email,
    telephone,
    date,
    service,
    heure,
    personnes
  } = body;

  const { error } = await supabaseAdmin
    .from("reservations")
    .insert([
      {
        nom,
        email,
        telephone,
        date,
        service,
        heure,
        personnes,
        processed: false,
        cancelled: false
      }
    ]);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}