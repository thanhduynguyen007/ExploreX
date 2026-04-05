import { PageHero } from "@/components/ui/page-hero";
import { listSchedules } from "@/services/schedule.service";

export default async function AdminSchedulesPage() {
  const schedules = await listSchedules();
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
        eyebrow="Admin"
        title="Quản lý lịch khởi hành"
        description="Admin xem toàn bộ lịch khởi hành thật từ MySQL để kiểm tra giá, số chỗ và trạng thái mở bán."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Danh sách lịch</h2>
            <p className="mt-1 text-sm text-stone-500">Dữ liệu hiện tại là nền để bước sau nối booking và chống overbooking.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Tổng lịch: {schedules.length}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã lịch</th>
                <th className="px-4 py-3 font-semibold">Tour</th>
                <th className="px-4 py-3 font-semibold">Ngày khởi hành</th>
                <th className="px-4 py-3 font-semibold">Chỗ trống</th>
                <th className="px-4 py-3 font-semibold">Giá</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-stone-500">
                    Chưa có lịch khởi hành nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.maLichTour}>
                    <td className="px-4 py-3 font-medium text-stone-800">{schedule.maLichTour}</td>
                    <td className="px-4 py-3 text-stone-700">
                      <p className="font-medium text-stone-900">{schedule.tenTour ?? schedule.maTour}</p>
                      <p className="mt-1 text-xs text-stone-500">{schedule.tenNhaCungCap ?? schedule.maNhaCungCap}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{formatDateTime(schedule.ngayBatDau)}</td>
                    <td className="px-4 py-3 text-stone-700">
                      {schedule.soChoTrong ?? 0}/{schedule.tongChoNgoi ?? 0}
                    </td>
                    <td className="px-4 py-3 text-stone-700">{schedule.giaTour?.toLocaleString("vi-VN") ?? "0"} đ</td>
                    <td className="px-4 py-3 text-stone-700">{schedule.trangThai}</td>
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
