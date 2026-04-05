import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { listTours } from "@/services/tour.service";

export default async function AdminToursPage() {
  const tours = await listTours();

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title="Quản lý tour"
        description="Trang này đọc dữ liệu tour trực tiếp từ MySQL, giúp admin theo dõi toàn bộ tour và nhà cung cấp đang sở hữu."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Danh sách tour</h2>
            <p className="mt-1 text-sm text-stone-500">Admin có thể kiểm tra trạng thái, nhóm tour và đơn vị cung cấp.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Tổng tour: {tours.length}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã tour</th>
                <th className="px-4 py-3 font-semibold">Thông tin tour</th>
                <th className="px-4 py-3 font-semibold">Nhà cung cấp</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-stone-500">
                    Chưa có tour nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour.maTour}>
                    <td className="px-4 py-3 font-medium text-stone-800">{tour.maTour}</td>
                    <td className="px-4 py-3 text-stone-700">
                      <p className="font-medium text-stone-900">{tour.tenTour}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        Nhóm: {tour.tenNhomTour ?? tour.maNhomTour} | Thời lượng: {tour.thoiLuong ?? "Chưa cập nhật"} |
                        Sức chứa: {tour.sLKhachToiDa ?? 0} khách
                      </p>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{tour.tenNhaCungCap ?? tour.maNhaCungCap}</td>
                    <td className="px-4 py-3 text-stone-700">{tour.trangThai}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/tours/${tour.maTour}`} className="text-sm font-semibold text-amber-700 hover:text-amber-900">
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
