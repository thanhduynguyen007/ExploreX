"use client";

import { useState } from "react";
import { toast } from "sonner";

export function BookingVnpayButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/me/bookings/${bookingId}/vnpay`, {
        method: "POST",
      });

      const payload = await response.json().catch(() => ({ message: "Không thể tạo phiên thanh toán." }));

      if (!response.ok || !payload.paymentUrl) {
        toast.error(payload.message ?? "Không thể chuyển sang VNPAY demo.");
        setLoading(false);
        return;
      }

      window.location.href = payload.paymentUrl;
    } catch {
      toast.error("Không thể kết nối đến cổng thanh toán demo.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className="inline-flex items-center rounded-full bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Đang chuyển sang VNPAY..." : "Thanh toán VNPAY demo"}
    </button>
  );
}
