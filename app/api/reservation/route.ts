import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_PHONE = "02 41 93 39 00";
const MAX_ONLINE = 10;

function getDayOfWeek(dateString: string) {
  return new Date(dateString).getDay();
}

export async function POST(request: Request) {
  const supabase = supabaseAdmin;

  try {
    const body = await request.json();

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

    const normalizedService = service?.toUpperCase();

    // =========================
    // 🔒 VALIDATION
    // =========================
    if (!nom || !email || !date || !normalizedService || !heure || !personnes) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    if (Number(personnes) > MAX_ONLINE) {
      return NextResponse.json(
        {
          error: `Pour les groupes de plus de ${MAX_ONLINE} personnes, merci de nous appeler au ${CONTACT_PHONE}`,
        },
        { status: 400 }
      );
    }

    const dayOfWeek = getDayOfWeek(date);
    const safeDate = date.split("T")[0];

    // =========================
    // 🟢 1. CHECK PÉRIODE
    // =========================
    const { data: periods } = await supabase
      .from("opening_periods")
      .select("*")
      .eq("is_active", true);

    if (periods?.length) {
      const isInPeriod = periods.some(
        (p) => safeDate >= p.start_date && safeDate <= p.end_date
      );

      if (!isInPeriod) {
        return NextResponse.json(
          { error: "Établissement fermé à cette date" },
          { status: 400 }
        );
      }
    }

    // =========================
    // ⚡ 2. EXCEPTIONS (PRIORITÉ)
    // =========================
    const { data: exceptions } = await supabase
      .from("closure_exceptions")
      .select("*")
      .eq("date", safeDate);

    const match = exceptions?.find(
      (e) => e.service === null || e.service === normalizedService
    );

    if (match?.is_closed) {
      return NextResponse.json(
        { error: "Ce service est exceptionnellement fermé" },
        { status: 400 }
      );
    }

    // =========================
    // 🔁 3. HEBDO
    // =========================
    const { data: weekly } = await supabase
      .from("weekly_opening_rules")
      .select("is_open")
      .eq("day_of_week", dayOfWeek)
      .eq("service", normalizedService)
      .maybeSingle();

    if (!weekly?.is_open) {
      return NextResponse.json(
        { error: "Service non disponible" },
        { status: 400 }
      );
    }

    // =========================
    // 🔎 4. TOTAL SERVICE (PRIORITÉ)
    // =========================
    const { data: totalServiceData, error: serviceError } =
      await supabase.rpc("total_personnes_service", {
        p_date: date,
        p_service: normalizedService,
      });

    if (serviceError) {
      console.error(serviceError);
      return NextResponse.json({ error: "Erreur calcul" }, { status: 500 });
    }

    const totalService = Number(totalServiceData) || 0;

    const { data: globalCapacity } = await supabase
      .from("capacity_rules")
      .select("max_capacity")
      .eq("day_of_week", dayOfWeek)
      .eq("service", normalizedService)
      .maybeSingle();

    if (
      globalCapacity?.max_capacity &&
      totalService + Number(personnes) > globalCapacity.max_capacity
    ) {
      return NextResponse.json(
        {
          error: `Service complet.\n\nAppelez-nous au ${CONTACT_PHONE}`,
        },
        { status: 400 }
      );
    }

    // =========================
    // 🔎 5. TOTAL CRÉNEAU
    // =========================
    const { data: totalSlotData, error: slotError } =
      await supabase.rpc("total_personnes_creneau", {
        p_date: date,
        p_service: normalizedService,
        p_heure: heure,
      });

    if (slotError) {
      console.error(slotError);
      return NextResponse.json({ error: "Erreur calcul" }, { status: 500 });
    }

    const totalSlot = Number(totalSlotData) || 0;

    const { data: slotCapacity } = await supabase
      .from("capacity_time_slots")
      .select("max_capacity")
      .eq("day_of_week", dayOfWeek)
      .eq("service", normalizedService)
      .eq("time", heure)
      .maybeSingle();

    const maxSlot =
      slotCapacity?.max_capacity ??
      globalCapacity?.max_capacity ??
      0;

    if (totalSlot + Number(personnes) > maxSlot) {
      return NextResponse.json(
        {
          error: `Créneau complet.\n\nAppelez-nous au ${CONTACT_PHONE}`,
        },
        { status: 400 }
      );
    }

    // =========================
    // 💾 INSERT
    // =========================
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
          commentaire,
        },
      ]);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { error: "Erreur base de données" },
        { status: 500 }
      );
    }

    // =========================
    // 📧 EMAIL INTERNE
    // =========================
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
          <li>Email : ${email}</li>
          <li>Téléphone : ${telephone}</li>
          <li>Commentaire : ${commentaire || "-"}</li>
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