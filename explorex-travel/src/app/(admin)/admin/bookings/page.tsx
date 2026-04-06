import { BookingFilterBar } from "@/components/admin/booking-filter-bar";
import { BookingRowActions } from "@/components/admin/booking-row-actions";
import { BOOKING_STATUSES, PAYMENT_STATUSES } from "@/lib/constants/statuses";
import { listBookings } from "@/services/booking.service";
import { listProviders } from "@/services/tour.service";

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

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; bookingStatus?: string; paymentStatus?: string; provider?: string }>;
}) {
  const params = await searchParams;
  const [bookings, providers] = await Promise.all([listBookings(), listProviders()]);

  const keyword = params.q?.trim().toLowerCase() ?? "";
  const bookingStatusFilter = params.bookingStatus?.trim() ?? "";
  const paymentStatusFilter = params.paymentStatus?.trim() ?? "";
  const providerFilter = params.provider?.trim() ?? "";

  const filteredBookings = bookings.filter((booking) => {
    const haystack = [
      booking.maDatTour,
      booking.tenNguoiDung ?? "",
      booking.email ?? "",
      booking.tenTour ?? "",
      booking.tenNhaCungCap ?? "",
      booking.maNguoiDung,
      booking.maLichTour,
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = keyword.length === 0 || haystack.includes(keyword);
    const matchesBookingStatus = bookingStatusFilter.length === 0 || booking.trangThaiDatTour === bookingStatusFilter;
    const matchesPaymentStatus = paymentStatusFilter.length === 0 || booking.trangThaiThanhToan === paymentStatusFilter;
    const matchesProvider = providerFilter.length === 0 || booking.maNhaCungCap === providerFilter;

    return matchesKeyword && matchesBookingStatus && matchesPaymentStatus && matchesProvider;
  });

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Quản lý đơn hàng</h2>
      </section>

      <BookingFilterBar
        initialKeyword={params.q ?? ""}
        initialBookingStatus={bookingStatusFilter}
        initialPaymentStatus={paymentStatusFilter}
        initialProvider={providerFilter}
        bookingStatusOptions={[
          { value: "", label: "Tất cả trạng thái đơn" },
          ...BOOKING_STATUSES.map((status) => ({
            value: status,
            label: bookingStatusMap[status]?.label ?? status,
          })),
        ]}
        paymentStatusOptions={[
          { value: "", label: "Tất cả thanh toán" },
          ...PAYMENT_STATUSES.map((status) => ({
            value: status,
            label: paymentStatusMap[status]?.label ?? status,
          })),
        ]}
        providerOptions={[
          { value: "", label: "Tất cả nhà cung cấp" },
          ...providers.map((provider) => ({
            value: provider.maNhaCungCap,
            label: provider.tenNhaCungCap ?? provider.maNhaCungCap,
          })),
        ]}
      />

      <section className="overflow-hidden rounded-[14px] border border-[#d5d5d5] bg-white shadow-[0_16px_40px_rgba(226,232,240,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1240px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-3 py-4 text-left font-extrabold">Mã đơn</th>
                <th className="px-3 py-4 text-left font-extrabold">Khách hàng</th>
                <th className="px-3 py-4 text-left font-extrabold">Tour</th>
                <th className="px-3 py-4 text-left font-extrabold">Ngày đặt</th>
                <th className="px-3 py-4 text-left font-extrabold">Số người</th>
                <th className="px-3 py-4 text-left font-extrabold">Tổng tiền</th>
                <th className="px-3 py-4 text-left font-extrabold">Trạng thái</th>
                <th className="px-3 py-4 text-left font-extrabold">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Không có đơn hàng phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const bookingStatus = bookingStatusMap[booking.trangThaiDatTour] ?? {
                    label: booking.trangThaiDatTour,
                    className: "bg-slate-100 text-slate-600",
                  };
                  const paymentStatus = paymentStatusMap[booking.trangThaiThanhToan] ?? {
                    label: booking.trangThaiThanhToan,
                    className: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <tr key={booking.maDatTour} className="border-b border-[#eceef2] last:border-b-0">
                      <td className="px-3 py-4 font-semibold opacity-90">{booking.maDatTour}</td>
                      <td className="px-3 py-4">
                        <p className="text-[14px] font-semibold text-[#202224]">{booking.tenNguoiDung ?? booking.maNguoiDung}</p>
                        <p className="text-[12px] text-[#6b7280]">{booking.email ?? "Chưa có email"}</p>
                      </td>
                      <td className="px-3 py-4">
                        <p className="text-[14px] font-semibold text-[#202224]">{booking.tenTour ?? booking.maLichTour}</p>
                        <p className="text-[12px] text-[#6b7280]">{booking.tenNhaCungCap ?? booking.maNhaCungCap ?? "Chưa cập nhật"}</p>
                      </td>
                      <td className="px-3 py-4 font-semibold opacity-90">{formatDateTime(booking.ngayDat)}</td>
                      <td className="px-3 py-4 font-semibold opacity-90">{booking.soNguoi ?? 0}</td>
                      <td className="px-3 py-4 font-semibold opacity-90">{booking.tongTien?.toLocaleString("vi-VN") ?? "0"} đ</td>
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex w-fit rounded-[4.5px] px-3 py-1 text-xs font-bold ${bookingStatus.className}`}>
                            {bookingStatus.label}
                          </span>
                          <span className={`inline-flex w-fit rounded-[4.5px] px-3 py-1 text-xs font-bold ${paymentStatus.className}`}>
                            {paymentStatus.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <BookingRowActions
                          bookingId={booking.maDatTour}
                          bookingStatus={booking.trangThaiDatTour}
                          paymentStatus={booking.trangThaiThanhToan}
                          note={booking.ghiChu ?? ""}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3 text-[14px] text-[rgba(32,34,36,0.6)] md:flex-row md:items-center md:justify-between">
        <p>
          Hiển thị {filteredBookings.length === 0 ? 0 : 1} - {filteredBookings.length} của {bookings.length}
        </p>
        <div className="inline-flex items-center rounded-[8px] border border-[#d5d5d5] bg-[#fafbfd] px-4 py-2 text-[#202224]/60">
          Trang 1
        </div>
      </section>
    </div>
  );
}
