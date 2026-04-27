import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
      commentaire,
    } = body;

    // ✅ validation minimale (email + téléphone NON obligatoires)
    if (!nom || !date || !service || !heure || !personnes) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("reservations")
      .insert([
        {
          nom,
          email: email || null,           // ✅ propre si vide
          telephone: telephone || null,   // ✅ propre si vide
          date,
          service,
          heure,
          personnes,
          commentaire,
        },
      ]);

    if (error) {
      console.error("❌ INSERT ERROR:", error);
      return NextResponse.json(
        { error: "Erreur base de données" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}