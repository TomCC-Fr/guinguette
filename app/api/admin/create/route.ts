import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nom,
      email,
      telephone,
      date,
      service,
      heure,
      personnes,
    } = body;

    const supabase = createServerClient();

    const { error } = await supabase
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
        },
      ]);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erreur base de données" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
