import Link from "next/link";
import { redirect } from "next/navigation";

import { BookingStatusForm } from "@/components/forms/booking-status-form";
import {
  ProviderStatusBadge,
  formatCurrency,
  formatDateTime,
} from "@/components/provider/provider-ui";
import { getSessionUser } from "@/lib/auth/session";
import { getBookingDetail } from "@/services/booking.service";
import { getProviderProfileByUserId } from "@/services/tour.service";

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
      <p className="text-[13px] font-semibold text-[#7b8190]">{label}</p>
      <p className="mt-2 text-[16px] font-bold leading-7 text-[#202224]">{value}</p>
    </article>
  );
}

export default async function ProviderAdminBookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id);
  const { bookingId } = await params;
  const booking = await getBookingDetail(bookingId, { maNhaCungCap: provider.maNhaCungCap });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link href="/admin/provider/bookings" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5a8cff]">
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Quay lại danh sách
          </Link>
          <div>
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">{booking.maDatTour}</h2>
            <p className="mt-2 text-[15px] text-[#6b7280]">
              Theo dõi chi tiết đơn đặt tour và cập nhật trạng thái xử lý trong đúng phạm vi booking thuộc nhà cung cấp hiện tại.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ProviderStatusBadge status={booking.trangThaiDatTour} kind="booking" />
          <ProviderStatusBadge status={booking.trangThaiThanhToan} kind="payment" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard label="Khách hàng" value={booking.tenNguoiDung ?? booking.maNguoiDung} />
        <DetailCard label="Tour" value={booking.tenTour ?? booking.maLichTour} />
        <DetailCard label="Số người" value={`${booking.soNguoi ?? 0} khách`} />
        <DetailCard label="Tổng tiền" value={formatCurrency(booking.tongTien)} />
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
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{provider.tenNhaCungCap ?? provider.maNhaCungCap}</dd>
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
          endpoint={`/api/admin/provider/bookings/${booking.maDatTour}`}
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
