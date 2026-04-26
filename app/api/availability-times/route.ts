import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getDayOfWeek(dateString: string) {
  return new Date(dateString).getDay();
}

function generateTimes(start: string, end: string) {
  const times: string[] = [];
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  while (h < endH || (h === endH && m <= endM)) {
    times.push(
      `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`
    );
    m += 15;
    if (m === 60) {
      m = 0;
      h++;
    }
  }
  return times;
}

export async function GET(req: Request) {
  const supabase = supabaseAdmin;

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const service = searchParams.get("service")?.toUpperCase();

  if (!date || !service) {
    return NextResponse.json([]);
  }

  const dayOfWeek = getDayOfWeek(date);

  const times =
    service === "MIDI"
      ? generateTimes("11:45", "13:00")
      : generateTimes("19:00", "21:00");

  const slots = [];

  for (const time of times) {
    const { data: totalData } = await supabase.rpc(
      "total_personnes_creneau",
      {
        p_date: date,
        p_service: service,
        p_heure: time,
      }
    );

    const total = Number(totalData) || 0;

    const { data: slotCapacity } = await supabase
      .from("capacity_time_slots")
      .select("max_capacity")
      .eq("day_of_week", dayOfWeek)
      .eq("service", service)
      .eq("time", time)
      .maybeSingle();

    const { data: globalCapacity } = await supabase
      .from("capacity_rules")
      .select("max_capacity")
      .eq("day_of_week", dayOfWeek)
      .eq("service", service)
      .maybeSingle();

    const max =
      slotCapacity?.max_capacity ??
      globalCapacity?.max_capacity ??
      0;

    slots.push({
      time,
      available: total < max,
    });
  }

  return NextResponse.json(slots);
}