import ReservationClient from "./ReservationClient";
import { redirect } from "next/navigation";
import { FEATURES } from "@/lib/features";

if (!FEATURES.RESERVATION) {
  redirect("/");
}

export const dynamic = "force-dynamic";

export default function ReservationPage({
  searchParams,
}: {
  searchParams: { date?: string; service?: string };
}) {
  return <ReservationClient initialParams={searchParams} />;
}