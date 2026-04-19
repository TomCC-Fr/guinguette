import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

// 📞 NUMÉRO À MODIFIER
const CONTACT_PHONE = "02 41 93 39 00";

function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  return date.getDay(); // 0 = dimanche
}

export async function POST(request: Request) {
  const supabase = supabaseAdmin;

  try {
    const body = await request.json();

    const { nom, email, telephone, date, service, heure, personnes } = body;

    const normalizedService = service?.toUpperCase();
    console.log("SERVICE RECU:", service);
    console.log("SERVICE NORMALIZED:", normalizedService);
    // =========================
    // VALIDATION
    // =========================
    if (!nom || !email || !date || !normalizedService || !heure || !personnes) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    const dayOfWeek = getDayOfWeek(date);

    // =========================
    // 🟢 1. CHECK PÉRIODE
    // =========================
    const { data: periods, error: periodError } = await supabase
      .from("opening_periods")
      .select("*")
      .eq("is_active", true);

    if (periodError) {
      console.error("Period error:", periodError);
      return NextResponse.json(
        {
          error: `Une erreur innatendue est survenue.\nVeuillez nous contacter au ${CONTACT_PHONE} pour procéder à la réservation`,
        },
        { status: 500 }
      );
    }

    if (periods && periods.length > 0) {
      const isInPeriod = periods.some(
        (p) => date >= p.start_date && date <= p.end_date
      );

      if (!isInPeriod) {
        return NextResponse.json(
          { error: "La guinguette du père Chapuis est fermée à cette date" },
          { status: 400 }
        );
      }
    }

    // =========================
    // ⚡ 2. CHECK EXCEPTIONS
    // =========================
    const { data: exceptions, error: exceptionError } = await supabase
      .from("closure_exceptions")
      .select("*")
      .eq("date", date);

    if (exceptionError) {
      console.error("Exception error:", exceptionError);
      return NextResponse.json(
        {
          error: `Une erreur innatendue est survenue.\n\nVeuillez nous contacter au ${CONTACT_PHONE} pour procéder à la réservation`,
        },
        { status: 500 }
      );
    }

    if (exceptions && exceptions.length > 0) {
      const match = exceptions.find(
        (e) => e.service === null || e.service === normalizedService
      );

      if (match) {
        if (match.is_closed) {
          return NextResponse.json(
            { error: "Ce service est exceptionnellement fermé" },
            { status: 400 }
          );
        }
      }
    }

    // =========================
    // 🔁 3. CHECK HEBDO
    // =========================
    const { data: weekly, error: weeklyError } = await supabase
      .from("weekly_opening_rules")
      .select("*")
      .eq("day_of_week", dayOfWeek)
      .eq("service", normalizedService);

    if (weeklyError) {
      console.error("Weekly error:", weeklyError);
      return NextResponse.json(
        {
          error: `Une erreur innatendue est survenue.\n\nVeuillez nous contacter au ${CONTACT_PHONE} pour procéder à la réservation`,
        },
        { status: 500 }
      );
    }

    if (weekly && weekly.length > 0) {
      const rule = weekly[0];

      if (!rule.is_open) {
        return NextResponse.json(
          { error: "Ce service n'est pas assuré" },
          { status: 400 }
        );
      }
    }

    // =========================
    // 🔎 4. TOTAL RÉSERVÉ
    // =========================
    const result = await supabase.rpc("total_personnes_service", {
      p_date: date,
      p_service: normalizedService,
    });

    if (result.error) {
      console.error("RPC error:", result.error);
      return NextResponse.json(
        {
          error: `Une erreur innatendue est survenue.\n\nVeuillez nous contacter au ${CONTACT_PHONE} pour procéder à la réservation`,
        },
        { status: 500 }
      );
    }

    const total = Number(result.data) || 0;

    // =========================
    // 🔁 5. CAPACITÉ
    // =========================
    const { data: capacityData, error: capacityError } = await supabase
      .from("capacity_rules")
      .select("*")
      .eq("day_of_week", dayOfWeek)
      .eq("service", normalizedService);

    if (capacityError) {
      console.error("Capacity error:", capacityError);
      return NextResponse.json(
        {
          error: `Une erreur innatendue est survenue.\n\nVeuillez nous contacter au ${CONTACT_PHONE} pour procéder à la réservation`,
        },
        { status: 500 }
      );
    }

    if (!capacityData || capacityData.length === 0) {
      return NextResponse.json(
        {
          error: `Réservation indisponible en ligne.\n\nVeuillez nous contacter au ${CONTACT_PHONE} pour procéder à la réservation`,
        },
        { status: 400 }
      );
    }

    const capaciteMax = capacityData[0].max_capacity;

    if (total + Number(personnes) > capaciteMax) {
      return NextResponse.json(
        {
          error: `Réservation indisponible en ligne.\n\nVeuillez nous contacter au ${CONTACT_PHONE} pour procéder à la réservation`,
        },
        { status: 400 }
      );
    }

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
        {
          error: `Une erreur innatendue est survenue.\n\nVeuillez nous contacter au ${CONTACT_PHONE} pour procéder à la réservation`,
        },
        { status: 500 }
      );
    }

//    const emailClientResult = await resend.emails.send({
//      from: "Guinguette <onboarding@resend.dev>",
//      to: "thomas.couzon@gmail.com",
//      subject: "Demande de réservation reçue 🍽️🍷",
//      html: `
//        <h2>Merci pour votre réservation. Ne pas répondre à ce mail, pour toute demande veuillez nous appeler au 02 41 93 39 00</h2>
//        <ul>
//          <li>Date : ${date}</li>
//          <li>Service : ${normalizedService}</li>
//          <li>Heure : ${heure}</li>
//          <li>Personnes : ${personnes}</li>
//        </ul>
//      `,
//    });

    const emailInternalResult = await resend.emails.send({
      from: "Guinguette <onboarding@resend.dev>",
      to: "thomas.couzon@gmail.com",
      subject: "Nouvelle réservation reçue :",
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
      {
        error: `Une erreur innatendue est survenue.\n\nVeuillez nous contacter au ${CONTACT_PHONE} pour procéder à la réservation`,
      },
      { status: 500 }
    );
  }
}