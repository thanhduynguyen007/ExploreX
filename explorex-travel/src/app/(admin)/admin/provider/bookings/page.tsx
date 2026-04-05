import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { listBookings } from "@/services/booking.service";
import { getProviderProfileByUserId } from "@/services/tour.service";

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

export default async function ProviderAdminBookingsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id);
  const bookings = await listBookings({ maNhaCungCap: provider.maNhaCungCap });

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title="Đơn đặt tour"
        description="Danh sách đơn đặt tour thuộc phạm vi đối tác. Backend đã lọc theo ownership ở cấp service và API."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Đơn thuộc đối tác của bạn</h2>
            <p className="mt-1 text-sm text-stone-500">Bạn chỉ thấy booking của tour do mình sở hữu.</p>
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
                    Chưa có booking nào thuộc tour của bạn.
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
                    <td className="px-4 py-3 text-stone-700">{booking.tenTour ?? booking.maLichTour}</td>
                    <td className="px-4 py-3 text-stone-700">{formatDateTime(booking.ngayDat)}</td>
                    <td className="px-4 py-3 text-stone-700">
                      <p>{booking.trangThaiDatTour}</p>
                      <p className="mt-1 text-xs text-stone-500">{booking.trangThaiThanhToan}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/provider/bookings/${booking.maDatTour}`}
                        className="text-sm font-semibold text-amber-700 hover:text-amber-900"
                      >
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
