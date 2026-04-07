import type { ReactNode } from "react";

type StatusKind = "provider" | "tour" | "schedule" | "booking" | "payment" | "account";

const providerStatusStyles: Record<string, { label: string; className: string }> = {
  APPROVED: { label: "Đã duyệt", className: "bg-[#d7f4ef] text-[#00b69b]" },
  PENDING: { label: "Chờ duyệt", className: "bg-[#fff4de] text-[#d97706]" },
  REJECTED: { label: "Từ chối", className: "bg-[#ffe1df] text-[#ef3826]" },
};

const tourStatusStyles: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Bản nháp", className: "bg-[#fff4de] text-[#d97706]" },
  PENDING_REVIEW: { label: "Chờ duyệt", className: "bg-[#efe7ff] text-[#7c3aed]" },
  PUBLISHED: { label: "Đang hiển thị", className: "bg-[#d7f4ef] text-[#00b69b]" },
  HIDDEN: { label: "Đang ẩn", className: "bg-[#e5e7eb] text-[#4b5563]" },
  INACTIVE: { label: "Ngừng khai thác", className: "bg-[#ffe1df] text-[#ef3826]" },
};

const scheduleStatusStyles: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Mở bán", className: "bg-[#d7f4ef] text-[#00b69b]" },
  FULL: { label: "Đã đầy", className: "bg-[#fff4de] text-[#d97706]" },
  CLOSED: { label: "Đóng", className: "bg-[#e5e7eb] text-[#4b5563]" },
  CANCELLED: { label: "Đã hủy", className: "bg-[#ffe1df] text-[#ef3826]" },
};

const bookingStatusStyles: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Chờ xử lý", className: "bg-[#fff4de] text-[#d97706]" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-[#d7f4ef] text-[#00b69b]" },
  COMPLETED: { label: "Đã hoàn thành", className: "bg-[#e0f2fe] text-[#0369a1]" },
  CANCELLED: { label: "Đã hủy", className: "bg-[#ffe1df] text-[#ef3826]" },
};

const paymentStatusStyles: Record<string, { label: string; className: string }> = {
  UNPAID: { label: "Chưa thanh toán", className: "bg-[#fff4de] text-[#d97706]" },
  PAID: { label: "Đã thanh toán", className: "bg-[#d7f4ef] text-[#00b69b]" },
  REFUNDED: { label: "Đã hoàn tiền", className: "bg-[#e0f2fe] text-[#0369a1]" },
};

const accountStatusStyles: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Đang hoạt động", className: "bg-[#d7f4ef] text-[#00b69b]" },
  PENDING: { label: "Chờ kích hoạt", className: "bg-[#fff4de] text-[#d97706]" },
  SUSPENDED: { label: "Tạm khóa", className: "bg-[#ffe1df] text-[#ef3826]" },
  DISABLED: { label: "Ngừng sử dụng", className: "bg-[#e5e7eb] text-[#4b5563]" },
};

export const formatDateTime = (value: string | Date | null | undefined) => {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("vi-VN");
};

export const formatCurrency = (value: number | null | undefined) => `${Number(value ?? 0).toLocaleString("vi-VN")} đ`;

export const formatRating = (value: number | string | null | undefined) => {
  if (value == null || value === "") {
    return "Chưa có đánh giá";
  }

  const numericValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return "Chưa có đánh giá";
  }

  return `${numericValue.toFixed(1)}/5`;
};

export function ProviderSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 border-b border-[#edf1f6] px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#202224]">{title}</h2>
          {description ? <p className="mt-2 text-[14px] leading-7 text-[#6b7280]">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

export function ProviderMetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9aa3b2]">{title}</p>
      <p className="mt-3 text-[28px] font-bold tracking-[-0.03em] text-[#202224]">{value}</p>
      <p className="mt-2 text-[13px] leading-6 text-[#6b7280]">{description}</p>
    </article>
  );
}

const statusStylesByKind: Record<StatusKind, Record<string, { label: string; className: string }>> = {
  provider: providerStatusStyles,
  tour: tourStatusStyles,
  schedule: scheduleStatusStyles,
  booking: bookingStatusStyles,
  payment: paymentStatusStyles,
  account: accountStatusStyles,
};

export function ProviderStatusBadge({
  status,
  kind = "tour",
}: {
  status: string | null | undefined;
  kind?: StatusKind;
}) {
  const normalized = status ?? "";
  const item = statusStylesByKind[kind][normalized] ?? {
    label: normalized || "Chưa cập nhật",
    className: "bg-slate-100 text-slate-600",
  };

  return <span className={`inline-flex w-fit rounded-[4.5px] px-3 py-1 text-xs font-bold ${item.className}`}>{item.label}</span>;
}

export function ProviderPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#9aa3b2]">{eyebrow}</p>
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">{title}</h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-8 text-[#6b7280]">{description}</p>
        </div>
      </div>
      {action}
    </section>
  );
}
