import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const service = searchParams.get("service");

  if (!date || !service) {
    return NextResponse.json(null);
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, image_file, youtube_url, spotify_url, heure_debut")
    .eq("date", date)
    .eq("service", service)
    .maybeSingle();

  if (error) {
    return NextResponse.json(null);
  }

  return NextResponse.json(data);
}