const bookingStatusStyles: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Chờ xác nhận", className: "bg-[#fff4de] text-[#d97706]" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-[#d7f4ef] text-[#00b69b]" },
  COMPLETED: { label: "Đã hoàn thành", className: "bg-[#e0f2fe] text-[#0369a1]" },
  CANCELLED: { label: "Đã hủy", className: "bg-[#ffe1df] text-[#ef3826]" },
};

const paymentStatusStyles: Record<string, { label: string; className: string }> = {
  UNPAID: { label: "Chưa thanh toán", className: "bg-[#fff4de] text-[#d97706]" },
  PAID: { label: "Đã thanh toán", className: "bg-[#d7f4ef] text-[#00b69b]" },
  REFUNDED: { label: "Đã hoàn tiền", className: "bg-[#e0f2fe] text-[#0369a1]" },
};

const statusStylesByKind = {
  booking: bookingStatusStyles,
  payment: paymentStatusStyles,
};

export function BookingStatusBadge({
  status,
  kind,
}: {
  status: string | null | undefined;
  kind: keyof typeof statusStylesByKind;
}) {
  const normalized = status ?? "";
  const item = statusStylesByKind[kind][normalized] ?? {
    label: normalized || "Chưa cập nhật",
    className: "bg-stone-100 text-stone-600",
  };

  return <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${item.className}`}>{item.label}</span>;
}
