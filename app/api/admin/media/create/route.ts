import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    album_id,
    type,
    url,
    caption,
  } = body;

  const { error } = await supabaseAdmin
    .from("event_media")
    .insert([
      {
        album_id,
        type,
        url,
        caption,
      },
    ]);

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur création média" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}