import { redirect } from "next/navigation";

import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { getBookingDetail } from "@/services/booking.service";

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

export default async function AccountBookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const { bookingId } = await params;
  const booking = await getBookingDetail(bookingId, { maNguoiDung: user.id });

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Tài khoản"
        title={`Chi tiết đơn đặt ${booking.maDatTour}`}
        description="Khách hàng chỉ xem được đơn của chính mình. Mọi kiểm tra ownership đều được backend thực hiện."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Tour" description={booking.tenTour ?? booking.maLichTour} />
        <InfoCard title="Số người" description={`${booking.soNguoi ?? 0} khách`} />
        <InfoCard title="Tổng tiền" description={`${booking.tongTien?.toLocaleString("vi-VN") ?? "0"} đ`} />
        <InfoCard title="Trạng thái" description={`${booking.trangThaiDatTour} / ${booking.trangThaiThanhToan}`} />
      </div>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Thông tin đơn</h2>
        <dl className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-stone-500">Ngày đặt</dt>
            <dd className="mt-1 text-sm text-stone-800">{formatDateTime(booking.ngayDat)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">Ngày khởi hành</dt>
            <dd className="mt-1 text-sm text-stone-800">{formatDateTime(booking.ngayBatDau)}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-stone-500">Ghi chú</dt>
            <dd className="mt-1 text-sm leading-7 text-stone-800">{booking.ghiChu ?? "Không có ghi chú."}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
