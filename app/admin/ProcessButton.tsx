"use client";

import { useRouter } from "next/navigation";

export default function ProcessButton({
  id,
  processed,
  cancelled,
}: {
  id: string;
  processed: boolean;
  cancelled: boolean;
}) {
  const router = useRouter();

  async function toggle() {
    if (cancelled) return;

    await fetch("/api/admin/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        processed: !processed,
      }),
    });

    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={cancelled}
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        border: "1px solid #444",
        backgroundColor: cancelled
          ? "#e5e5e5"
          : processed
          ? "#059669"
          : "white",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: cancelled ? "not-allowed" : "pointer",
      }}
    >
      {processed ? "✓" : ""}
    </button>
  );
}
