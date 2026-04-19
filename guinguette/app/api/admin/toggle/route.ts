import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { id, processed } = await req.json();

  await supabase
    .from("reservations")
    .update({ processed })
    .eq("id", id);

  const { error } = await supabase
    .from("reservations")
    .update({ processed })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}