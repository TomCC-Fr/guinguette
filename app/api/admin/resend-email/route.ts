import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_PHONE = "02 41 93 39 00";

export async function POST(req: Request) {
  const supabase = await createServerClient();

  const { id } = await req.json();

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Réservation introuvable" },
      { status: 404 }
    );
  }

  if (!data.email) {
    return NextResponse.json(
      { error: "Pas d'email client" },
      { status: 400 }
    );
  }

  try {
    await resend.emails.send({
      from:"La Guinguette du Père Chapuis <reservation@guinguetteduperechapuis.fr>",
      to: data.email,
      subject: "Guinguette du Père Chapuis - Confirmation de votre réservation 🍷",
      html: `
        <h2>Votre réservation est bien enregistrée</h2>

        <p>Bonjour ${data.nom},</p>

        <p>Nous avons bien reçu votre demande de réservation :</p>

        <ul>
          <li><strong>Date :</strong> ${data.date}</li>
          <li><strong>Service :</strong> ${data.service}</li>
          <li><strong>Heure :</strong> ${data.heure}</li>
          <li><strong>Nombre de personnes :</strong> ${data.personnes}</li>
        </ul>

        ${
          data.commentaire
            ? `<p><strong>Commentaire :</strong> ${data.commentaire}</p>`
             : ""
        }

        <p>🍷 Nous avons hâte de vous accueillir à la guinguette !</p>

        <p>
          Pour toute modification, veuillez nous contacter au ${CONTACT_PHONE}.
        </p>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "Erreur envoi email" },
      { status: 500 }
    );
  }
}