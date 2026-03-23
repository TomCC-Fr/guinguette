import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const MAX_CAPACITY = {
  MIDI: 20,
  SOIR: 40,
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { nom, email, telephone, date, service, heure, personnes } = body;

    const normalizedService = service?.toUpperCase();

    // Validation
    if (!nom || !email || !date || !normalizedService || !heure || !personnes) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    // 🔎 Lecture du total en base
    const result = await supabase.rpc("total_personnes_service", {
      p_date: date,
      p_service: normalizedService,
    });

    console.log("RPC RESULT COMPLET:");
    console.log(JSON.stringify(result, null, 2));

    const totalActuel = result.data;
    const fetchError = result.error;

    if (fetchError) {
      console.error(fetchError);
      return NextResponse.json(
        { error: "Erreur vérification capacité" },
        { status: 500 }
      );
    }

    const total = Number(totalActuel) || 0;
    const capaciteMax =
      MAX_CAPACITY[normalizedService as "MIDI" | "SOIR"];

    console.log("Total actuel:", total);
    console.log("Demande:", personnes);

    // 🚫 Blocage
    if (total + Number(personnes) > capaciteMax) {
      return NextResponse.json(
        { error: "Service complet" },
        { status: 400 }
      );
    }

    // ✅ Insert
    const { error: insertError } = await supabase
      .from("reservations")
      .insert([
        {
          nom,
          email,
          telephone,
          date,
          service: normalizedService,
          heure,
          personnes,
        },
      ]);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { error: "Erreur base de données" },
        { status: 500 }
      );
    }

    // 📧 Email client
    await resend.emails.send({
      from: "Guinguette <onboarding@resend.dev>",
      to: email,
      subject: "Demande reçue 🍷",
      html: `
        <h2>Merci pour votre réservation</h2>
        <ul>
          <li>Date : ${date}</li>
          <li>Service : ${normalizedService}</li>
          <li>Heure : ${heure}</li>
          <li>Personnes : ${personnes}</li>
        </ul>
      `,
    });

    // 📧 Email interne
    await resend.emails.send({
      from: "Guinguette <onboarding@resend.dev>",
      to: "thomas.couzon@gmail.com",
      subject: "Nouvelle réservation",
      html: `
        <h2>Nouvelle réservation</h2>
        <ul>
          <li>${nom}</li>
          <li>Date : ${date}</li>
          <li>Service : ${normalizedService}</li>
          <li>Heure : ${heure}</li>
          <li>Personnes : ${personnes}</li>
        </ul>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
