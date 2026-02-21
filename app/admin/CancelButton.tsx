"use client";

import { useRouter } from "next/navigation";

export default function CancelButton({
  id,
  cancelled,
}: {
  id: string;
  cancelled: boolean;
}) {
  const router = useRouter();

  async function toggle() {
    await fetch("/api/admin/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        cancelled: !cancelled,
      }),
    });

    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "1px solid",
        borderColor: cancelled ? "#059669" : "#dc2626",
        backgroundColor: cancelled ? "#059669" : "#dc2626",
        color: "white",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {cancelled ? "Réactiver" : "Annuler"}
    </button>
  );
}
