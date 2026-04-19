import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const body = await req.json();

  const { id, ...fields } = body;

  const { error } = await supabase
    .from("reservations")
    .update(fields)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
