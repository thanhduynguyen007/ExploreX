import { ProviderBookingRowActions } from "@/components/provider/provider-booking-row-actions";
import {
  ProviderMetricCard,
  ProviderPageHeader,
  ProviderSection,
  ProviderStatusBadge,
  formatCurrency,
  formatDateTime,
} from "@/components/provider/provider-ui";
import { getProviderAdminAccess } from "@/lib/auth/provider-admin";
import { listBookings } from "@/services/booking.service";

export default async function ProviderAdminBookingsPage() {
  const { provider } = await getProviderAdminAccess();
  const bookings = await listBookings({ maNhaCungCap: provider.maNhaCungCap });

  const pendingCount = bookings.filter((item) => item.trangThaiDatTour === "PENDING").length;
  const confirmedCount = bookings.filter((item) => item.trangThaiDatTour === "CONFIRMED").length;
  const completedCount = bookings.filter((item) => item.trangThaiDatTour === "COMPLETED").length;
  const totalRevenue = bookings
    .filter((item) => item.trangThaiDatTour === "CONFIRMED" || item.trangThaiDatTour === "COMPLETED")
    .reduce((sum, item) => sum + Number(item.tongTien ?? 0), 0);

  return (
    <div className="space-y-6">
      <ProviderPageHeader
        eyebrow="Đơn đặt tour"
        title="Quản lý booking"
        description="Nhà cung cấp chỉ nhìn thấy các booking thuộc tour của chính mình. Mọi cập nhật trạng thái vẫn được backend kiểm tra ownership."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProviderMetricCard title="Tổng đơn" value={String(bookings.length)} description="Toàn bộ booking gắn với tour của bạn." />
        <ProviderMetricCard title="Chờ xử lý" value={String(pendingCount)} description="Các đơn đang cần xác nhận hoặc hủy." />
        <ProviderMetricCard title="Đã xác nhận" value={String(confirmedCount)} description="Booking đang giữ chỗ cho lịch khởi hành." />
        <ProviderMetricCard title="Doanh thu hợp lệ" value={formatCurrency(totalRevenue)} description={`${completedCount} đơn đã hoàn thành.`} />
      </section>

      <ProviderSection title="Danh sách booking" description="Theo dõi nhanh khách đặt, tour đặt, trạng thái booking và trạng thái thanh toán.">
        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-3 py-4 text-left font-extrabold">Mã đơn</th>
                <th className="px-3 py-4 text-left font-extrabold">Khách hàng</th>
                <th className="px-3 py-4 text-left font-extrabold">Tour</th>
                <th className="px-3 py-4 text-left font-extrabold">Ngày đặt</th>
                <th className="px-3 py-4 text-left font-extrabold">Tổng tiền</th>
                <th className="px-3 py-4 text-left font-extrabold">Trạng thái</th>
                <th className="px-3 py-4 text-left font-extrabold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Chưa có booking nào thuộc tour của bạn.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.maDatTour} className="border-b border-[#eceef2] last:border-b-0">
                    <td className="px-3 py-4 font-semibold">{booking.maDatTour}</td>
                    <td className="px-3 py-4">
                      <p className="font-semibold text-[#202224]">{booking.tenNguoiDung ?? booking.maNguoiDung}</p>
                      <p className="mt-1 text-[12px] text-[#6b7280]">{booking.email ?? "Chưa có email"}</p>
                    </td>
                    <td className="px-3 py-4">{booking.tenTour ?? booking.maLichTour}</td>
                    <td className="px-3 py-4 text-[#606060]">{formatDateTime(booking.ngayDat)}</td>
                    <td className="px-3 py-4 font-semibold">{formatCurrency(booking.tongTien)}</td>
                    <td className="px-3 py-4">
                      <div className="flex flex-col gap-2">
                        <ProviderStatusBadge status={booking.trangThaiDatTour} kind="booking" />
                        <ProviderStatusBadge status={booking.trangThaiThanhToan} kind="payment" />
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <ProviderBookingRowActions
                        bookingId={booking.maDatTour}
                        bookingStatus={booking.trangThaiDatTour}
                        paymentStatus={booking.trangThaiThanhToan}
                        note={booking.ghiChu ?? ""}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ProviderSection>
    </div>
  );
}
