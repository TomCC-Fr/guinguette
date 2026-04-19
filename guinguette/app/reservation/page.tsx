import ReservationClient from "./ReservationClient";

export const dynamic = "force-dynamic";

export default function ReservationPage({
  searchParams,
}: {
  searchParams: { date?: string; service?: string };
}) {
  return <ReservationClient initialParams={searchParams} />;
}