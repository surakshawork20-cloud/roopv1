"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

export function CancelBookingButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function cancel() {
    if (!confirm("Cancel this booking?")) return;
    setLoading(true);
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    router.refresh();
  }
  return (
    <button
      onClick={cancel}
      disabled={loading}
      className="text-xs text-rose hover:text-rose/70 inline-flex items-center gap-1"
    >
      {loading ? <Loader2 className="animate-spin" size={10} /> : <X size={10} />} Cancel
    </button>
  );
}
