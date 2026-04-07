import { ScheduleFilterBar } from "@/components/admin/schedule-filter-bar";
import { SCHEDULE_STATUSES } from "@/lib/constants/statuses";
import { listSchedules } from "@/services/schedule.service";
import { listProviders, listTours } from "@/services/tour.service";

const statusMap: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Mở bán", className: "bg-[#d7f4ef] text-[#00b69b]" },
  FULL: { label: "Đã đầy", className: "bg-[#fff4de] text-[#d97706]" },
  CLOSED: { label: "Đóng bán", className: "bg-[#e5e7eb] text-[#4b5563]" },
  CANCELLED: { label: "Đã hủy", className: "bg-[#ffe1df] text-[#ef3826]" },
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

const formatCurrency = (value: number | null | undefined) => `${(value ?? 0).toLocaleString("vi-VN")} đ`;

export default async function AdminSchedulesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; tour?: string; provider?: string }>;
}) {
  const params = await searchParams;
  const [schedules, tours, providers] = await Promise.all([listSchedules(), listTours(), listProviders()]);

  const keyword = params.q?.trim().toLowerCase() ?? "";
  const statusFilter = params.status?.trim() ?? "";
  const tourFilter = params.tour?.trim() ?? "";
  const providerFilter = params.provider?.trim() ?? "";

  const filteredSchedules = schedules.filter((schedule) => {
    const haystack = [
      schedule.maLichTour,
      schedule.maTour,
      schedule.tenTour ?? "",
      schedule.tenNhaCungCap ?? "",
      schedule.maNhaCungCap ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = keyword.length === 0 || haystack.includes(keyword);
    const matchesStatus = statusFilter.length === 0 || schedule.trangThai === statusFilter;
    const matchesTour = tourFilter.length === 0 || schedule.maTour === tourFilter;
    const matchesProvider = providerFilter.length === 0 || (schedule.maNhaCungCap ?? "") === providerFilter;

    return matchesKeyword && matchesStatus && matchesTour && matchesProvider;
  });

  const now = Date.now();
  const openCount = schedules.filter((schedule) => schedule.trangThai === "OPEN").length;
  const fullCount = schedules.filter((schedule) => schedule.trangThai === "FULL").length;
  const upcomingCount = schedules.filter((schedule) => {
    if (!schedule.ngayBatDau) {
      return false;
    }

    const date = schedule.ngayBatDau instanceof Date ? schedule.ngayBatDau : new Date(schedule.ngayBatDau);
    return !Number.isNaN(date.getTime()) && date.getTime() >= now;
  }).length;
  const totalSeats = schedules.reduce((sum, schedule) => sum + Number(schedule.tongChoNgoi ?? 0), 0);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Quản lý lịch khởi hành</h2>
        <p className="mt-2 text-[15px] text-[#6b7280]">
          Theo dõi lịch khởi hành từ bảng <span className="font-semibold text-[#202224]">lichtour</span>, bao gồm ngày đi, giá tour, số chỗ và trạng thái mở bán.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-4">
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Tổng lịch</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{schedules.length}</p>
        </article>
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Mở bán</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{openCount}</p>
        </article>
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Đã đầy / sắp chạy</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{fullCount} / {upcomingCount}</p>
        </article>
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Tổng chỗ</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{totalSeats.toLocaleString("vi-VN")}</p>
        </article>
      </section>

      <ScheduleFilterBar
        initialKeyword={params.q ?? ""}
        initialStatus={statusFilter}
        initialTour={tourFilter}
        initialProvider={providerFilter}
        statusOptions={[
          { value: "", label: "Tất cả trạng thái" },
          ...SCHEDULE_STATUSES.map((status) => ({
            value: status,
            label: statusMap[status]?.label ?? status,
          })),
        ]}
        tourOptions={[
          { value: "", label: "Tất cả tour" },
          ...tours.map((tour) => ({
            value: tour.maTour,
            label: tour.tenTour ?? tour.maTour,
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
                <th className="px-4 py-4 text-left font-extrabold">Mã lịch</th>
                <th className="px-4 py-4 text-left font-extrabold">Tour</th>
                <th className="px-4 py-4 text-left font-extrabold">Nhà cung cấp</th>
                <th className="px-4 py-4 text-left font-extrabold">Ngày khởi hành</th>
                <th className="px-4 py-4 text-left font-extrabold">Số chỗ</th>
                <th className="px-4 py-4 text-left font-extrabold">Giá tour</th>
                <th className="px-4 py-4 text-left font-extrabold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Không có lịch khởi hành phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule) => {
                  const status = statusMap[schedule.trangThai] ?? {
                    label: schedule.trangThai,
                    className: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <tr key={schedule.maLichTour} className="border-b border-[#eceef2] last:border-b-0">
                      <td className="px-4 py-4 font-semibold">{schedule.maLichTour}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#202224]">{schedule.tenTour ?? schedule.maTour}</p>
                        <p className="mt-1 text-[12px] text-[#6b7280]">{schedule.maTour}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#202224]">{schedule.tenNhaCungCap ?? schedule.maNhaCungCap ?? "Chưa cập nhật"}</p>
                        <p className="mt-1 text-[12px] text-[#6b7280]">{schedule.maNhaCungCap ?? "Chưa cập nhật"}</p>
                      </td>
                      <td className="px-4 py-4 font-semibold opacity-90">{formatDateTime(schedule.ngayBatDau)}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#202224]">
                          {schedule.soChoTrong ?? 0}/{schedule.tongChoNgoi ?? 0}
                        </p>
                        <p className="mt-1 text-[12px] text-[#6b7280]">Chỗ trống / tổng chỗ</p>
                      </td>
                      <td className="px-4 py-4 font-semibold opacity-90">{formatCurrency(schedule.giaTour)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
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
          Hiển thị {filteredSchedules.length === 0 ? 0 : 1} - {filteredSchedules.length} của {schedules.length}
        </p>
        <div className="inline-flex items-center rounded-[8px] border border-[#d5d5d5] bg-[#fafbfd] px-4 py-2 text-[#202224]/60">
          Trang 1
        </div>
      </section>
    </div>
  );
}
