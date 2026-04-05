import { AdminRevenueChart } from "@/components/charts/admin-revenue-chart";
import { getAdminDashboardSummary } from "@/services/dashboard.service";

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

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

const statusLabelMap: Record<string, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const statusClassMap: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

function DashboardMetricCard({
  label,
  value,
  helper,
  iconPath,
  iconBackground,
}: {
  label: string;
  value: string;
  helper: string;
  iconPath: string;
  iconBackground: string;
}) {
  return (
    <article className="rounded-2xl bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-4">
        <div className={`flex size-12 items-center justify-center rounded-2xl ${iconBackground}`}>
          <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
            <path d={iconPath} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-[28px] font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{helper}</p>
        </div>
      </div>
    </article>
  );
}

export default async function AdminDashboardPage() {
  const summary = await getAdminDashboardSummary();
  const maxRevenue = Math.max(...summary.revenueTrend.map((item) => item.totalRevenue ?? 0), 1);
  const revenueChartData = summary.revenueTrend.map((item) => ({
    period: item.period,
    totalRevenue: item.totalRevenue ?? 0,
    totalBookings: item.totalBookings,
    percent: Math.round(((item.totalRevenue ?? 0) / maxRevenue) * 100),
  }));

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">Tổng quan</h2>
        <p className="mt-2 text-sm text-slate-500">
          Theo dõi hoạt động tour, đơn đặt, người dùng và doanh thu trên dữ liệu thật của hệ thống.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardMetricCard
          label="Người dùng"
          value={summary.totalUsers.toLocaleString("vi-VN")}
          helper={`${summary.totalCustomers} khách hàng, ${summary.totalProviders} đối tác`}
          iconPath="M16 19a4 4 0 0 0-8 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          iconBackground="bg-violet-100 text-violet-600"
        />
        <DashboardMetricCard
          label="Đơn hàng"
          value={summary.totalBookings.toLocaleString("vi-VN")}
          helper={`${summary.pendingBookings} chờ xử lý, ${summary.confirmedBookings} đã xác nhận`}
          iconPath="M7 7h10M7 12h10M7 17h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          iconBackground="bg-amber-100 text-amber-600"
        />
        <DashboardMetricCard
          label="Doanh thu"
          value={formatCurrency(summary.totalRevenue)}
          helper={`${summary.completedBookings} đơn hoàn thành, ${summary.cancelledBookings} đơn hủy`}
          iconPath="M5 12l4 4L19 6M19 12v7H5V5h8"
          iconBackground="bg-emerald-100 text-emerald-600"
        />
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">Biểu đồ doanh thu</h3>
            <p className="mt-1 text-sm text-slate-500">Doanh thu 7 ngày gần nhất từ các đơn đã xác nhận hoặc hoàn thành.</p>
          </div>
          <div className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">7 ngày gần nhất</div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-4">
          <AdminRevenueChart data={revenueChartData} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">Đơn hàng mới</h3>
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
              {summary.recentBookings.length} đơn gần nhất
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <th className="px-4 py-2">Mã</th>
                  <th className="px-4 py-2">Khách hàng</th>
                  <th className="px-4 py-2">Tour</th>
                  <th className="px-4 py-2">Thanh toán</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2">Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentBookings.map((booking) => (
                  <tr key={booking.maDatTour} className="text-sm text-slate-600">
                    <td className="rounded-l-2xl bg-slate-50 px-4 py-4 font-semibold text-blue-600">{booking.maDatTour}</td>
                    <td className="bg-slate-50 px-4 py-4">
                      <p className="font-medium text-slate-900">{booking.tenNguoiDung ?? "Khách hàng"}</p>
                      <p className="mt-1 text-xs text-slate-500">{booking.soNguoi ?? 0} người</p>
                    </td>
                    <td className="bg-slate-50 px-4 py-4">
                      <p className="font-medium text-slate-900">{booking.tenTour ?? "Tour đang cập nhật"}</p>
                    </td>
                    <td className="bg-slate-50 px-4 py-4">
                      <p className="font-medium text-slate-900">{formatCurrency(booking.tongTien ?? 0)}</p>
                      <p className="mt-1 text-xs text-slate-500">Tự tính từ backend</p>
                    </td>
                    <td className="bg-slate-50 px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusClassMap[booking.trangThaiDatTour ?? ""] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {statusLabelMap[booking.trangThaiDatTour ?? ""] ?? (booking.trangThaiDatTour ?? "Không rõ")}
                      </span>
                    </td>
                    <td className="rounded-r-2xl bg-slate-50 px-4 py-4 text-xs text-slate-500">{formatDateTime(booking.ngayDat)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">Top tour được đặt nhiều</h3>
            <div className="mt-4 space-y-3">
              {summary.topTours.map((tour, index) => (
                <div key={tour.maTour} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-sm font-semibold text-blue-600">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{tour.tenTour ?? tour.maTour}</p>
                      <p className="text-xs text-slate-500">Booking hợp lệ</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{tour.totalBookings}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">Lịch khởi hành sắp tới</h3>
            <div className="mt-4 space-y-3">
              {summary.upcomingSchedules.map((schedule) => (
                <div key={schedule.maLichTour} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{schedule.tenTour ?? schedule.maLichTour}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDateTime(schedule.ngayBatDau)}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {schedule.soChoTrong ?? 0} chỗ trống • {schedule.trangThai ?? "Chưa cập nhật"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">Nhà cung cấp doanh thu cao</h3>
          <div className="mt-4 space-y-3">
            {summary.topProviders.map((provider) => (
              <div key={provider.maNhaCungCap} className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">{provider.tenNhaCungCap ?? provider.maNhaCungCap}</p>
                <p className="mt-1 text-sm text-slate-500">{formatCurrency(provider.revenue ?? 0)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">Điểm đánh giá trung bình</h3>
          <div className="mt-4 space-y-3">
            {summary.topRatedTours.map((tour) => (
              <div key={tour.maTour} className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">{tour.tenTour ?? tour.maTour}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {tour.avgRating ? `${Number(tour.avgRating).toFixed(1)}/5` : "Chưa có đánh giá"} • {tour.totalReviews} lượt
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
