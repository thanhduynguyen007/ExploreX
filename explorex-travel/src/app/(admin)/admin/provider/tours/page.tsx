import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { getProviderProfileByUserId, listTours } from "@/services/tour.service";

export default async function ProviderAdminToursPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id);
  const tours = await listTours({ maNhaCungCap: provider.maNhaCungCap });

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title="Quản lý tour"
        description="Danh sách này chỉ hiển thị tour thuộc nhà cung cấp đang đăng nhập. Backend tiếp tục kiểm tra quyền sở hữu ở API trước mọi thao tác."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Tour của {provider.tenNhaCungCap ?? provider.maNhaCungCap}</h2>
            <p className="mt-1 text-sm text-stone-500">Đối tác chỉ thấy và sửa dữ liệu thuộc phạm vi của chính mình.</p>
          </div>
          <Link
            href="/admin/provider/tours/new"
            className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Tạo tour mới
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã tour</th>
                <th className="px-4 py-3 font-semibold">Tên tour</th>
                <th className="px-4 py-3 font-semibold">Nhóm</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-stone-500">
                    Bạn chưa có tour nào. Hãy tạo tour đầu tiên để tiếp tục các bước lịch khởi hành và booking.
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour.maTour}>
                    <td className="px-4 py-3 font-medium text-stone-800">{tour.maTour}</td>
                    <td className="px-4 py-3 text-stone-700">
                      <p className="font-medium text-stone-900">{tour.tenTour}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        {tour.thoiLuong ?? "Chưa cập nhật"} | {tour.sLKhachToiDa ?? 0} khách tối đa
                      </p>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{tour.tenNhomTour ?? tour.maNhomTour}</td>
                    <td className="px-4 py-3 text-stone-700">{tour.trangThai}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link href={`/admin/provider/tours/${tour.maTour}`} className="text-sm font-semibold text-amber-700 hover:text-amber-900">
                          Xem
                        </Link>
                        <Link
                          href={`/admin/provider/tours/${tour.maTour}/edit`}
                          className="text-sm font-semibold text-stone-700 hover:text-stone-950"
                        >
                          Sửa
                        </Link>
                      </div>
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
