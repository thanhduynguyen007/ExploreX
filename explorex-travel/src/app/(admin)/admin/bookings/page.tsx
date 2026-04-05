import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { listBookings } from "@/services/booking.service";

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

export default async function AdminBookingsPage() {
  const bookings = await listBookings();

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title="Quản lý đặt tour"
        description="Admin xem toàn bộ booking để kiểm tra trạng thái đặt tour, thanh toán và các ràng buộc nghiệp vụ."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Danh sách booking</h2>
            <p className="mt-1 text-sm text-stone-500">Bước này đã nối dữ liệu thật từ bảng `dattour`.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Tổng đơn: {bookings.length}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã đơn</th>
                <th className="px-4 py-3 font-semibold">Khách hàng</th>
                <th className="px-4 py-3 font-semibold">Tour</th>
                <th className="px-4 py-3 font-semibold">Ngày đặt</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-stone-500">
                    Chưa có booking nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.maDatTour}>
                    <td className="px-4 py-3 font-medium text-stone-800">{booking.maDatTour}</td>
                    <td className="px-4 py-3 text-stone-700">
                      <p className="font-medium text-stone-900">{booking.tenNguoiDung ?? booking.maNguoiDung}</p>
                      <p className="mt-1 text-xs text-stone-500">{booking.email ?? "Chưa có email"}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      <p className="font-medium text-stone-900">{booking.tenTour ?? booking.maLichTour}</p>
                      <p className="mt-1 text-xs text-stone-500">{booking.tenNhaCungCap ?? booking.maNhaCungCap}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{formatDateTime(booking.ngayDat)}</td>
                    <td className="px-4 py-3 text-stone-700">
                      <p>{booking.trangThaiDatTour}</p>
                      <p className="mt-1 text-xs text-stone-500">{booking.trangThaiThanhToan}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/bookings/${booking.maDatTour}`} className="text-sm font-semibold text-amber-700 hover:text-amber-900">
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
