import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

function formatImagePath(fileName: string | null) {
  if (!fileName) return null;

  // encode les espaces et caractères spéciaux
  const encoded = encodeURIComponent(fileName);

  return `/events/${encoded}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const service = searchParams.get("service");

  if (!date || !service) {
    return NextResponse.json(null);
  }

  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, image_file, youtube_url, spotify_url, heure_debut")
    .eq("date", date)
    .eq("service", service)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(null);
  }

  const formatted = {
    id: data.id,
    title: data.title,
    description: data.description,

    // ✅ FIX ICI
    image_url: formatImagePath(data.image_file),

    start_time: data.heure_debut,
    youtube_url: data.youtube_url,
    music_url: data.spotify_url,
  };

  return NextResponse.json(formatted);
}