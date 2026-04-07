import Link from "next/link";

import { ProviderScheduleRowActions } from "@/components/provider/provider-schedule-row-actions";
import {
  ProviderMetricCard,
  ProviderPageHeader,
  ProviderSection,
  ProviderStatusBadge,
  formatCurrency,
  formatDateTime,
} from "@/components/provider/provider-ui";
import { getProviderAdminAccess } from "@/lib/auth/provider-admin";
import { listSchedules } from "@/services/schedule.service";

export default async function ProviderAdminSchedulesPage() {
  const { provider } = await getProviderAdminAccess();
  const schedules = await listSchedules({ maNhaCungCap: provider.maNhaCungCap });

  const openCount = schedules.filter((item) => item.trangThai === "OPEN").length;
  const fullCount = schedules.filter((item) => item.trangThai === "FULL").length;
  const totalSeats = schedules.reduce((sum, item) => sum + Number(item.tongChoNgoi ?? 0), 0);

  return (
    <div className="space-y-6">
      <ProviderPageHeader
        eyebrow="Lịch khởi hành"
        title={`Lịch của ${provider.tenNhaCungCap ?? provider.maNhaCungCap}`}
        description="Các lịch khởi hành ở đây chỉ thuộc tour của bạn. Khi booking được xác nhận hoặc hủy, số chỗ sẽ được backend cập nhật tự động."
        action={
          <Link
            href="/admin/provider/schedules/new"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] bg-[#4880ff] px-5 py-3 text-[14px] font-bold text-white shadow-[0_12px_26px_rgba(72,128,255,0.25)] transition hover:bg-[#3f74e8]"
          >
            + Thêm lịch mới
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProviderMetricCard title="Tổng lịch" value={String(schedules.length)} description="Tất cả lịch khởi hành của bạn." />
        <ProviderMetricCard title="Mở bán" value={String(openCount)} description="Lịch đang cho phép nhận booking mới." />
        <ProviderMetricCard title="Đã đầy" value={String(fullCount)} description="Lịch không còn chỗ trống." />
        <ProviderMetricCard title="Tổng chỗ" value={String(totalSeats)} description="Tổng số ghế đang mở trên toàn bộ lịch." />
      </section>

      <ProviderSection title="Danh sách lịch khởi hành">
        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-3 py-4 text-left font-extrabold">Mã lịch</th>
                <th className="px-3 py-4 text-left font-extrabold">Tour</th>
                <th className="px-3 py-4 text-left font-extrabold">Ngày khởi hành</th>
                <th className="px-3 py-4 text-left font-extrabold">Chỗ trống</th>
                <th className="px-3 py-4 text-left font-extrabold">Giá tour</th>
                <th className="px-3 py-4 text-left font-extrabold">Trạng thái</th>
                <th className="px-3 py-4 text-left font-extrabold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Bạn chưa có lịch khởi hành nào. Hãy tạo lịch sau khi đã có tour.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.maLichTour} className="border-b border-[#eceef2] last:border-b-0">
                    <td className="px-3 py-4 font-semibold">{schedule.maLichTour}</td>
                    <td className="px-3 py-4">{schedule.tenTour ?? schedule.maTour}</td>
                    <td className="px-3 py-4 text-[#606060]">{formatDateTime(schedule.ngayBatDau)}</td>
                    <td className="px-3 py-4">
                      {schedule.soChoTrong ?? 0}/{schedule.tongChoNgoi ?? 0}
                    </td>
                    <td className="px-3 py-4 font-semibold">{formatCurrency(schedule.giaTour)}</td>
                    <td className="px-3 py-4">
                      <ProviderStatusBadge status={schedule.trangThai} kind="schedule" />
                    </td>
                    <td className="px-3 py-4">
                      <ProviderScheduleRowActions scheduleId={schedule.maLichTour} />
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
