import Link from "next/link";

import { BookingStatusForm } from "@/components/forms/booking-status-form";
import { getBookingDetail } from "@/services/booking.service";

const bookingStatusMap: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Chờ xử lý", className: "bg-[#fff4de] text-[#d97706]" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-[#d7f4ef] text-[#00b69b]" },
  COMPLETED: { label: "Hoàn thành", className: "bg-[#e0ecff] text-[#3b82f6]" },
  CANCELLED: { label: "Đã hủy", className: "bg-[#ffe1df] text-[#ef3826]" },
};

const paymentStatusMap: Record<string, { label: string; className: string }> = {
  UNPAID: { label: "Chưa thanh toán", className: "bg-[#fff4de] text-[#d97706]" },
  PAID: { label: "Đã thanh toán", className: "bg-[#d7f4ef] text-[#00b69b]" },
  REFUNDED: { label: "Đã hoàn tiền", className: "bg-[#e5e7eb] text-[#4b5563]" },
};

const formatDateTime = (value: string | Date | null | undefined) => {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("vi-VN");
};

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
      <p className="text-[13px] font-semibold text-[#7b8190]">{label}</p>
      <p className="mt-2 text-[16px] font-bold leading-7 text-[#202224]">{value}</p>
    </article>
  );
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBookingDetail(bookingId);
  const bookingStatus = bookingStatusMap[booking.trangThaiDatTour] ?? {
    label: booking.trangThaiDatTour,
    className: "bg-slate-100 text-slate-600",
  };
  const paymentStatus = paymentStatusMap[booking.trangThaiThanhToan] ?? {
    label: booking.trangThaiThanhToan,
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5a8cff]">
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Quay lại danh sách
          </Link>
          <div>
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">{booking.maDatTour}</h2>
            <p className="mt-2 text-[15px] text-[#6b7280]">Theo dõi chi tiết đơn đặt tour và cập nhật trạng thái xử lý theo nghiệp vụ hiện tại.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex rounded-[8px] px-4 py-2 text-[13px] font-bold ${bookingStatus.className}`}>{bookingStatus.label}</span>
          <span className={`inline-flex rounded-[8px] px-4 py-2 text-[13px] font-bold ${paymentStatus.className}`}>{paymentStatus.label}</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard label="Khách hàng" value={booking.tenNguoiDung ?? booking.maNguoiDung} />
        <DetailCard label="Tour" value={booking.tenTour ?? booking.maLichTour} />
        <DetailCard label="Số người" value={`${booking.soNguoi ?? 0} khách`} />
        <DetailCard label="Tổng tiền" value={`${booking.tongTien?.toLocaleString("vi-VN") ?? "0"} đ`} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h3 className="text-[20px] font-bold text-[#202224]">Thông tin đơn hàng</h3>
          </div>

          <dl className="grid gap-5 px-6 py-6 md:grid-cols-2">
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Mã lịch tour</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{booking.maLichTour}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Nhà cung cấp</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{booking.tenNhaCungCap ?? booking.maNhaCungCap ?? "Chưa cập nhật"}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Ngày đặt</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{formatDateTime(booking.ngayDat)}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Ngày khởi hành</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{formatDateTime(booking.ngayBatDau)}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[13px] font-semibold text-[#7b8190]">Ghi chú</dt>
              <dd className="mt-2 text-[15px] leading-8 text-[#202224]">{booking.ghiChu ?? "Không có ghi chú."}</dd>
            </div>
          </dl>
        </section>

        <BookingStatusForm
          endpoint={`/api/admin/bookings/${booking.maDatTour}`}
          initialValues={{
            trangThaiDatTour: booking.trangThaiDatTour,
            trangThaiThanhToan: booking.trangThaiThanhToan,
            ghiChu: booking.ghiChu ?? "",
          }}
        />
      </div>
    </div>
  );
}
