import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { getProviderProfileByUserId } from "@/services/tour.service";
import { listSchedules } from "@/services/schedule.service";

export default async function ProviderAdminSchedulesPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id);
  const schedules = await listSchedules({ maNhaCungCap: provider.maNhaCungCap });
  const formatDateTime = (value: string | Date | null) => {
    if (!value) {
      return "Chưa cập nhật";
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title="Lịch khởi hành"
        description="Đối tác chỉ nhìn thấy lịch thuộc tour của mình. Backend giữ kiểm tra ownership ở mọi API tạo và cập nhật."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Lịch của {provider.tenNhaCungCap ?? provider.maNhaCungCap}</h2>
            <p className="mt-1 text-sm text-stone-500">Bước này đã nối thật với bảng `lichtour` trong MySQL.</p>
          </div>
          <Link
            href="/admin/provider/schedules/new"
            className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Thêm lịch mới
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã lịch</th>
                <th className="px-4 py-3 font-semibold">Tour</th>
                <th className="px-4 py-3 font-semibold">Ngày khởi hành</th>
                <th className="px-4 py-3 font-semibold">Chỗ trống</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-stone-500">
                    Bạn chưa có lịch khởi hành nào. Hãy tạo lịch sau khi đã có tour.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.maLichTour}>
                    <td className="px-4 py-3 font-medium text-stone-800">{schedule.maLichTour}</td>
                    <td className="px-4 py-3 text-stone-700">{schedule.tenTour ?? schedule.maTour}</td>
                    <td className="px-4 py-3 text-stone-700">{formatDateTime(schedule.ngayBatDau)}</td>
                    <td className="px-4 py-3 text-stone-700">
                      {schedule.soChoTrong ?? 0}/{schedule.tongChoNgoi ?? 0}
                    </td>
                    <td className="px-4 py-3 text-stone-700">{schedule.trangThai}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/provider/schedules/${schedule.maLichTour}/edit`}
                        className="text-sm font-semibold text-stone-700 hover:text-stone-950"
                      >
                        Sửa
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
