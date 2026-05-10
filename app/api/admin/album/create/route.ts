import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    title,
    description,
    event_date,
    published,
  } = body;

  const { error } = await supabaseAdmin
    .from("event_albums")
    .insert([
      {
        title,
        description,
        event_date,
        published,
      },
    ]);

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur création album" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}