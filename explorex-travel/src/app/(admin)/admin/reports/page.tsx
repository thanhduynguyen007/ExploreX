import { AdminRevenueChart } from "@/components/charts/admin-revenue-chart";
import { getAdminReportSummary } from "@/services/report.service";

const bookingStatusMap: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Chờ xử lý", className: "bg-[#fff4de] text-[#d97706]" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-[#d7f4ef] text-[#00b69b]" },
  COMPLETED: { label: "Hoàn thành", className: "bg-[#e0ecff] text-[#3b82f6]" },
  CANCELLED: { label: "Đã hủy", className: "bg-[#ffe1df] text-[#ef3826]" },
};

const tourStatusMap: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Bản nháp", className: "bg-[#fff4de] text-[#d97706]" },
  PENDING_REVIEW: { label: "Chờ duyệt", className: "bg-[#efe7ff] text-[#7c3aed]" },
  PUBLISHED: { label: "Đang hiển thị", className: "bg-[#d7f4ef] text-[#00b69b]" },
  HIDDEN: { label: "Đang ẩn", className: "bg-[#e5e7eb] text-[#4b5563]" },
  INACTIVE: { label: "Ngừng khai thác", className: "bg-[#ffe1df] text-[#ef3826]" },
};

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "amber" | "green" | "slate";
}) {
  const toneMap = {
    blue: "bg-[#edf4ff] text-[#4880ff]",
    amber: "bg-[#fff5db] text-[#ffbf43]",
    green: "bg-[#dcfce7] text-[#00b69b]",
    slate: "bg-[#eef2f7] text-[#5b6472]",
  };

  return (
    <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
      <div className="flex items-center gap-4">
        <div className={`flex size-[56px] items-center justify-center rounded-full ${toneMap[tone]}`}>
          <span className="text-[18px] font-bold">•</span>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#202224]">{label}</p>
          <p className="mt-1 text-[34px] font-bold leading-none tracking-[-0.02em] text-[#202224]">{value}</p>
        </div>
      </div>
    </article>
  );
}

export default async function AdminReportsPage() {
  const summary = await getAdminReportSummary();
  const maxRevenue = Math.max(...summary.revenueTrend.map((item) => item.totalRevenue), 1);
  const chartData = summary.revenueTrend.map((item) => ({
    ...item,
    percent: Math.round((item.totalRevenue / maxRevenue) * 100),
  }));

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Báo cáo hệ thống</h2>
        <p className="mt-2 text-[15px] text-[#6b7280]">
          Tổng hợp doanh thu, đơn đặt tour, hiệu suất nhà cung cấp và chất lượng tour từ dữ liệu thật trong schema hiện tại.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-4">
        <MetricCard label="Doanh thu" value={formatCurrency(summary.totalRevenue)} tone="green" />
        <MetricCard label="Đơn hàng" value={summary.totalBookings.toLocaleString("vi-VN")} tone="amber" />
        <MetricCard label="Tour" value={summary.totalTours.toLocaleString("vi-VN")} tone="blue" />
        <MetricCard label="Nhà cung cấp" value={summary.totalProviders.toLocaleString("vi-VN")} tone="slate" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-[20px] bg-white px-6 py-6 shadow-[0_20px_45px_rgba(226,232,240,0.6)]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[22px] font-bold text-[#202224]">Xu hướng doanh thu 7 ngày</h3>
            <div className="rounded-[4px] border border-[#d5d5d5] bg-[#fcfdfd] px-3 py-1.5 text-xs font-semibold text-[rgba(43,48,52,0.4)]">
              Cập nhật gần nhất
            </div>
          </div>

          <div className="mt-5 rounded-[18px] bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_100%)] px-2 py-2">
            <AdminRevenueChart data={chartData} />
          </div>
        </article>

        <article className="rounded-[20px] bg-white px-6 py-6 shadow-[0_20px_45px_rgba(226,232,240,0.6)]">
          <h3 className="text-[22px] font-bold text-[#202224]">Tổng quan chất lượng</h3>

          <div className="mt-5 space-y-4">
            <div className="rounded-[16px] border border-[#edf1f6] bg-[#fafcff] px-5 py-4">
              <p className="text-[13px] font-semibold text-[#7b8190]">Điểm đánh giá trung bình toàn hệ thống</p>
              <p className="mt-2 text-[32px] font-bold text-[#202224]">{summary.avgRating?.toFixed(1) ?? "0.0"} / 5</p>
            </div>

            <div className="space-y-3">
              {summary.bookingStatuses.map((item) => {
                const status = bookingStatusMap[item.trangThai ?? ""] ?? {
                  label: item.trangThai ?? "Không rõ",
                  className: "bg-slate-100 text-slate-600",
                };

                return (
                  <div key={`booking-${item.trangThai}`} className="flex items-center justify-between rounded-[14px] border border-[#edf1f6] px-4 py-3">
                    <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
                    <span className="text-[15px] font-bold text-[#202224]">{item.total}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="overflow-hidden rounded-[20px] bg-white shadow-[0_20px_45px_rgba(226,232,240,0.6)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h3 className="text-[22px] font-bold text-[#202224]">Top nhà cung cấp</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-[14px] text-[#202224]">
              <thead className="bg-[#fcfdfd]">
                <tr className="border-b border-[#eceef2]">
                  <th className="px-4 py-4 text-left font-extrabold">Nhà cung cấp</th>
                  <th className="px-4 py-4 text-left font-extrabold">Tour</th>
                  <th className="px-4 py-4 text-left font-extrabold">Đơn</th>
                  <th className="px-4 py-4 text-left font-extrabold">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {summary.topProviders.map((provider) => (
                  <tr key={provider.maNhaCungCap} className="border-b border-[#eceef2] last:border-b-0">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#202224]">{provider.tenNhaCungCap ?? provider.maNhaCungCap}</p>
                      <p className="mt-1 text-[12px] text-[#6b7280]">{provider.maNhaCungCap}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold">{provider.totalTours}</td>
                    <td className="px-4 py-4 font-semibold">{provider.totalBookings}</td>
                    <td className="px-4 py-4 font-semibold">{formatCurrency(provider.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="overflow-hidden rounded-[20px] bg-white shadow-[0_20px_45px_rgba(226,232,240,0.6)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h3 className="text-[22px] font-bold text-[#202224]">Top tour theo booking</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-[14px] text-[#202224]">
              <thead className="bg-[#fcfdfd]">
                <tr className="border-b border-[#eceef2]">
                  <th className="px-4 py-4 text-left font-extrabold">Tour</th>
                  <th className="px-4 py-4 text-left font-extrabold">Booking</th>
                  <th className="px-4 py-4 text-left font-extrabold">Doanh thu</th>
                  <th className="px-4 py-4 text-left font-extrabold">Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {summary.topTours.map((tour) => (
                  <tr key={tour.maTour} className="border-b border-[#eceef2] last:border-b-0">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#202224]">{tour.tenTour ?? tour.maTour}</p>
                      <p className="mt-1 text-[12px] text-[#6b7280]">{tour.tenNhaCungCap ?? "Chưa cập nhật nhà cung cấp"}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold">{tour.totalBookings}</td>
                    <td className="px-4 py-4 font-semibold">{formatCurrency(tour.totalRevenue)}</td>
                    <td className="px-4 py-4 font-semibold">{tour.avgRating?.toFixed(1) ?? "0.0"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="rounded-[20px] bg-white px-6 py-6 shadow-[0_20px_45px_rgba(226,232,240,0.6)]">
        <h3 className="text-[22px] font-bold text-[#202224]">Phân bố trạng thái tour</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {summary.tourStatuses.map((item) => {
            const status = tourStatusMap[item.trangThai ?? ""] ?? {
              label: item.trangThai ?? "Không rõ",
              className: "bg-slate-100 text-slate-600",
            };

            return (
              <article key={`tour-${item.trangThai}`} className="rounded-[16px] border border-[#edf1f6] bg-[#fafcff] px-5 py-4">
                <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
                <p className="mt-4 text-[28px] font-bold text-[#202224]">{item.total}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
