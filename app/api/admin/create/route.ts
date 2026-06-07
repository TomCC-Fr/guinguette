import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getDayOfWeek(dateString: string) {
  return new Date(dateString).getDay();
}

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

    const normalizedService = service?.toUpperCase();

    // =========================
    // VALIDATION
    // =========================
    if (
      !nom ||
      !date ||
      !normalizedService ||
      !heure ||
      !personnes
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const dayOfWeek = getDayOfWeek(date);
    const safeDate = date.split("T")[0];

    // =========================
    // CHECK PÉRIODE
    // =========================
    const { data: periods } = await supabaseAdmin
      .from("opening_periods")
      .select("*")
      .eq("is_active", true);

    if (periods?.length) {
      const isInPeriod = periods.some(
        (p) =>
          safeDate >= p.start_date &&
          safeDate <= p.end_date
      );

      if (!isInPeriod) {
        return NextResponse.json(
          {
            error:
              "Établissement fermé à cette date",
          },
          { status: 400 }
        );
      }
    }

    // =========================
    // EXCEPTIONS
    // =========================
    const { data: exceptions } = await supabaseAdmin
      .from("closure_exceptions")
      .select("*")
      .eq("date", safeDate);

    const match = exceptions?.find(
      (e) =>
        e.service === null ||
        e.service === normalizedService
    );

    if (match?.is_closed) {
      return NextResponse.json(
        {
          error:
            "Ce service est exceptionnellement fermé",
        },
        { status: 400 }
      );
    }

    // =========================
    // HEBDO
    // =========================
    const { data: weekly } = await supabaseAdmin
      .from("weekly_opening_rules")
      .select("is_open")
      .eq("day_of_week", dayOfWeek)
      .eq("service", normalizedService)
      .maybeSingle();

    if (!weekly?.is_open) {
      return NextResponse.json(
        {
          error: "Service non disponible",
        },
        { status: 400 }
      );
    }

    // =========================
    // CAPACITÉ TOTALE SERVICE
    // =========================
    const { data: totalServiceData } =
      await supabaseAdmin.rpc(
        "total_personnes_service",
        {
          p_date: date,
          p_service: normalizedService,
        }
      );

    const totalService =
      Number(totalServiceData) || 0;

    const { data: globalCapacity } =
      await supabaseAdmin
        .from("capacity_rules")
        .select("max_capacity")
        .eq("day_of_week", dayOfWeek)
        .eq("service", normalizedService)
        .maybeSingle();

    if (
      globalCapacity?.max_capacity &&
      totalService + Number(personnes) >
        globalCapacity.max_capacity
    ) {
      return NextResponse.json(
        {
          error:
            "Service complet. Impossible d'ajouter cette réservation.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CAPACITÉ CRÉNEAU
    // =========================
    const { data: totalSlotData } =
      await supabaseAdmin.rpc(
        "total_personnes_creneau",
        {
          p_date: date,
          p_service: normalizedService,
          p_heure: heure,
        }
      );

    const totalSlot =
      Number(totalSlotData) || 0;

    const { data: slotCapacity } =
      await supabaseAdmin
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

    if (
      totalSlot + Number(personnes) >
      maxSlot
    ) {
      return NextResponse.json(
        {
          error:
            "Créneau complet. Impossible d'ajouter cette réservation.",
        },
        { status: 400 }
      );
    }

    // =========================
    // INSERT
    // =========================
    const { error } = await supabaseAdmin
      .from("reservations")
      .insert([
        {
          nom,
          email: email || null,
          telephone: telephone || null,
          date,
          service: normalizedService,
          heure,
          personnes,
          commentaire,
        },
      ]);

    if (error) {
      console.error(
        "❌ INSERT ERROR:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Erreur base de données",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(
      "❌ SERVER ERROR:",
      err
    );

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}