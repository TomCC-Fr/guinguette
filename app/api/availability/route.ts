import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getDayOfWeek(dateString: string) {
  return new Date(dateString).getDay();
}

export async function GET(req: Request) {
  const supabase = supabaseAdmin;

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Missing date" },
      { status: 400 }
    );
  }

  const safeDate = date.split("T")[0];
  const dayOfWeek = getDayOfWeek(date);

  try {
    // =========================
    // 🟢 PÉRIODE
    // =========================
    const { data: periods } = await supabase
      .from("opening_periods")
      .select("*")
      .eq("is_active", true);

    if (periods?.length) {
      const inPeriod = periods.some(
        (p) => safeDate >= p.start_date && safeDate <= p.end_date
      );

      if (!inPeriod) {
        return NextResponse.json({
          isOpen: false,
          services: { MIDI: false, SOIR: false },
        });
      }
    }

    // =========================
    // 🔁 HEBDO
    // =========================
    const { data: weekly } = await supabase
      .from("weekly_opening_rules")
      .select("*")
      .eq("day_of_week", dayOfWeek);

    const services = {
      MIDI: false,
      SOIR: false,
    };

    weekly?.forEach((w) => {
      if (w.service === "MIDI" && w.is_open) services.MIDI = true;
      if (w.service === "SOIR" && w.is_open) services.SOIR = true;
    });

    // =========================
    // ⚡ EXCEPTIONS (priorité)
    // =========================
    const { data: exceptions } = await supabase
      .from("closure_exceptions")
      .select("*")
      .eq("date", safeDate);

    exceptions?.forEach((e) => {
      if (e.service === null && e.is_closed) {
        services.MIDI = false;
        services.SOIR = false;
      }

      if (e.service && e.is_closed) {
        services[e.service as "MIDI" | "SOIR"] = false;
      }
    });

    const isOpen = services.MIDI || services.SOIR;

    return NextResponse.json({ isOpen, services });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { isOpen: false, services: { MIDI: false, SOIR: false } }
    );
  }
}