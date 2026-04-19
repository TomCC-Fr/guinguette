import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

const supabase = await createServerClient();

function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  return date.getDay();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date manquante" }, { status: 400 });
  }

  const dayOfWeek = getDayOfWeek(date);

  // =========================
  // 🟢 PÉRIODE
  // =========================
  const { data: periods } = await supabase
    .from("opening_periods")
    .select("*")
    .eq("is_active", true);

  let isInPeriod = true;

  if (periods && periods.length > 0) {
    isInPeriod = periods.some(
      (p) => date >= p.start_date && date <= p.end_date
    );
  }

  if (!isInPeriod) {
    return NextResponse.json({
      isOpen: false,
      services: { MIDI: false, SOIR: false },
    });
  }

  // =========================
  // 🔁 RÈGLES HEBDO
  // =========================
  const { data: weekly } = await supabase
    .from("weekly_opening_rules")
    .select("*")
    .eq("day_of_week", dayOfWeek);

  let services = {
    MIDI: true,
    SOIR: true,
  };

  if (weekly && weekly.length > 0) {
    weekly.forEach((rule) => {
      services[rule.service as "MIDI" | "SOIR"] = rule.is_open;
    });
  }

  // =========================
  // ⚡ EXCEPTIONS
  // =========================
  const { data: exceptions } = await supabase
    .from("closure_exceptions")
    .select("*")
    .eq("date", date);

  if (exceptions && exceptions.length > 0) {
    exceptions.forEach((e) => {
      if (e.service === null) {
        services.MIDI = !e.is_closed;
        services.SOIR = !e.is_closed;
      } else {
        services[e.service as "MIDI" | "SOIR"] = !e.is_closed;
      }
    });
  }

  const isOpen = services.MIDI || services.SOIR;

  return NextResponse.json({
    isOpen,
    services,
  });
}