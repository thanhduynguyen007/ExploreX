import { BookingStatusForm } from "@/components/forms/booking-status-form";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
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

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBookingDetail(bookingId);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title={`Chi tiết booking ${booking.maDatTour}`}
        description="Admin có thể cập nhật trạng thái đơn và thanh toán. Logic chống overbooking và cập nhật chỗ được xử lý ở backend."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Khách hàng" description={booking.tenNguoiDung ?? booking.maNguoiDung} />
        <InfoCard title="Tour" description={booking.tenTour ?? booking.maLichTour} />
        <InfoCard title="Số người" description={`${booking.soNguoi ?? 0} khách`} />
        <InfoCard title="Tổng tiền" description={`${booking.tongTien?.toLocaleString("vi-VN") ?? "0"} đ`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
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
            <div>
              <dt className="text-sm font-medium text-stone-500">Trạng thái đặt tour</dt>
              <dd className="mt-1 text-sm text-stone-800">{booking.trangThaiDatTour}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-stone-500">Trạng thái thanh toán</dt>
              <dd className="mt-1 text-sm text-stone-800">{booking.trangThaiThanhToan}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-stone-500">Ghi chú</dt>
              <dd className="mt-1 text-sm leading-7 text-stone-800">{booking.ghiChu ?? "Không có ghi chú."}</dd>
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
