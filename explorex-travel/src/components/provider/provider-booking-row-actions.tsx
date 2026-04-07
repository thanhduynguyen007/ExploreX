"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ProviderBookingRowActionsProps = {
  bookingId: string;
  bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  note?: string | null;
};

export function ProviderBookingRowActions({
  bookingId,
  bookingStatus,
  paymentStatus,
  note,
}: ProviderBookingRowActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const canCancel = bookingStatus !== "CANCELLED";

  const handleCancel = async () => {
    const confirmed = window.confirm(`Hủy đơn ${bookingId}? Thao tác này sẽ chuyển trạng thái đơn sang "Đã hủy".`);
    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/provider/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trangThaiDatTour: "CANCELLED",
          trangThaiThanhToan: paymentStatus,
          ghiChu: note ?? "",
        }),
      });

      const result = await response.json().catch(() => ({ message: "Đã xảy ra lỗi máy chủ." }));

      if (!response.ok) {
        toast.error(result.message ?? "Không thể hủy đơn đặt tour");
        return;
      }

      toast.success("Đã chuyển đơn sang trạng thái hủy");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 text-[#202224]">
      <Link
        href={`/admin/provider/bookings/${bookingId}`}
        className="inline-flex size-9 items-center justify-center rounded-[10px] border border-[#e4e7ec] bg-white transition hover:border-[#c9d3e5] hover:bg-[#f8fbff]"
        aria-label="Xem chi tiết đơn đặt tour"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
          <path
            d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </Link>

      {canCancel ? (
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="inline-flex size-9 items-center justify-center rounded-[10px] border border-[#ffd8d4] bg-[#fff5f4] text-[#ef3826] transition hover:bg-[#ffe8e5] disabled:opacity-60"
          aria-label="Hủy đơn đặt tour"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
