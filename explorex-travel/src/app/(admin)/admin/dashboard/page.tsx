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

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (value: string | Date | null | undefined) => {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("vi-VN");
};

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

const statusLabelMap: Record<string, string> = {
  PENDING: "Khởi tạo",
  CONFIRMED: "Đã duyệt",
  COMPLETED: "Đã duyệt",
  CANCELLED: "Đã hủy",
};

const statusClassMap: Record<string, string> = {
  PENDING: "bg-[#fff3e8] text-[#ff9f43]",
  CONFIRMED: "bg-[#dcfce7] text-[#00b69b]",
  COMPLETED: "bg-[#dcfce7] text-[#00b69b]",
  CANCELLED: "bg-[#ffe5e5] text-[#ef3826]",
};

function MetricCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "violet" | "amber" | "green";
  icon: React.ReactNode;
}) {
  const toneClassMap = {
    violet: "bg-[#eeebff] text-[#8f88ff]",
    amber: "bg-[#fff5db] text-[#ffbf43]",
    green: "bg-[#dcfce7] text-[#64d4a3]",
  };

  return (
    <article className="rounded-[14px] bg-white px-7 py-6 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
      <div className="flex items-center gap-5">
        <div className={`flex size-[60px] items-center justify-center rounded-full ${toneClassMap[tone]}`}>{icon}</div>
        <div>
          <p className="text-base font-semibold text-[#202224]">{label}</p>
          <p className="mt-1 text-[38px] font-bold leading-none tracking-[-0.02em] text-[#202224]">{value}</p>
        </div>
      </div>
    </article>
  );
}

function ScenicThumbnail({ seed }: { seed: string }) {
  const palette = [
    "from-[#2f7cf6] via-[#6ba6ff] to-[#d5edff]",
    "from-[#0f766e] via-[#34d399] to-[#d1fae5]",
    "from-[#0f172a] via-[#1d4ed8] to-[#60a5fa]",
  ];
  const index = seed.length % palette.length;

  return (
    <div className={`relative h-[52px] w-[54px] overflow-hidden rounded-[6px] bg-gradient-to-br ${palette[index]}`}>
      <div className="absolute inset-x-0 bottom-0 h-5 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.3)_100%)]" />
      <div className="absolute left-2 top-2 size-4 rounded-full bg-white/30" />
      <div className="absolute bottom-2 left-2 right-2 h-3 rounded-full bg-white/30" />
    </div>
  );
}

function BookingStatusBadge({ status }: { status: string | null }) {
  const normalized = status ?? "";

  return (
    <span
      className={`inline-flex min-w-[66px] justify-center rounded-[4.5px] px-3 py-1 text-xs font-bold ${
        statusClassMap[normalized] ?? "bg-slate-100 text-slate-500"
      }`}
    >
      {statusLabelMap[normalized] ?? (status ?? "Không rõ")}
    </span>
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
  const recentBookings = summary.recentBookings.slice(0, 3);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Tổng quan</h2>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <MetricCard
          label="Người dùng"
          value={summary.totalUsers.toLocaleString("vi-VN")}
          tone="violet"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden="true">
              <path
                d="M16.5 18.5a4.5 4.5 0 0 0-9 0m9-8a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0Zm4 8a3.5 3.5 0 0 0-3-3.46m1.5-4.04a2.75 2.75 0 1 0-2.76-4.76"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <MetricCard
          label="Đơn hàng"
          value={summary.totalBookings.toLocaleString("vi-VN")}
          tone="amber"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden="true">
              <path
                d="M12 3 4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3Zm0 0v9m7.5-4.8L12 12 4.5 7.2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <MetricCard
          label="Doanh thu"
          value={formatCurrency(summary.totalRevenue)}
          tone="green"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden="true">
              <path
                d="M5 18V6m0 12h14M8 14l3-3 2.5 2.5L19 8"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </section>

      <section className="rounded-[20px] bg-white px-6 py-6 shadow-[0_20px_45px_rgba(226,232,240,0.6)]">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-[22px] font-bold text-[#202224]">Biểu đồ doanh thu</h3>
          <div className="rounded-[4px] border border-[#d5d5d5] bg-[#fcfdfd] px-3 py-1.5 text-xs font-semibold text-[rgba(43,48,52,0.4)]">
            11/2024
          </div>
        </div>

        <div className="mt-5 rounded-[18px] bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_100%)] px-2 py-2">
          <AdminRevenueChart data={revenueChartData} />
        </div>
      </section>

      <section className="rounded-[20px] bg-white px-6 py-6 shadow-[0_20px_45px_rgba(226,232,240,0.6)]">
        <h3 className="text-[22px] font-bold text-[#202224]">Đơn hàng mới</h3>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[1080px] w-full border-separate border-spacing-y-0 text-sm text-[#202224]">
            <thead>
              <tr className="rounded-[12px] bg-[#f1f4f9] text-left text-[14px] font-bold">
                <th className="rounded-l-[12px] px-4 py-4">Mã</th>
                <th className="px-4 py-4">Thông tin khách</th>
                <th className="px-4 py-4">Danh sách tour</th>
                <th className="px-4 py-4">Thanh toán</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="rounded-r-[12px] px-4 py-4 text-right">Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking, index) => (
                <tr key={booking.maDatTour}>
                  <td colSpan={6} className={index === 0 ? "pt-2" : "border-t border-[#eef1f6] pt-4"}>
                    <div className="grid grid-cols-[1.1fr_1.8fr_2.5fr_2fr_1fr_1.1fr] items-start gap-4 px-4 py-3">
                      <div className="pt-8 text-[14px] font-bold text-[#4880ff]">{booking.maDatTour}</div>

                      <div className="pt-7 text-[14px] font-semibold leading-6 text-[rgba(32,34,36,0.8)]">
                        <p>Họ tên: {booking.tenNguoiDung ?? "Khách hàng"}</p>
                        <p>SĐT: 0123456789</p>
                        <p>Ghi chú: Test...</p>
                      </div>

                      <div className="space-y-3">
                        {[0, 1].map((itemIndex) => (
                          <div key={`${booking.maDatTour}-${itemIndex}`} className="grid grid-cols-[54px_1fr] gap-3">
                            <ScenicThumbnail seed={`${booking.maDatTour}-${itemIndex}`} />
                            <div className="text-[12px] font-semibold leading-5 text-[rgba(32,34,36,0.8)]">
                              <p className="text-[14px] text-[#202224]">{booking.tenTour ?? "Tour đang cập nhật"}</p>
                              <p>Người lớn: {booking.soNguoi ?? 0} x 1.500.000đ</p>
                              <p>Trẻ em: 2 x 1.300.000đ</p>
                              <p>Em bé: 2 x 1.000.000đ</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 text-[14px] font-semibold leading-6 text-[rgba(32,34,36,0.8)]">
                        <p>Tổng tiền: {formatCurrency(booking.tongTien ?? 0)}</p>
                        <p>Giảm: 400.000đ</p>
                        <p>Mã giảm: TOURMUAHE2024</p>
                        <p>Thanh toán: {formatCurrency(Math.max((booking.tongTien ?? 0) - 400000, 0))}</p>
                        <p>PTTT: Ví Momo</p>
                        <p>TTTT: Đã thanh toán</p>
                      </div>

                      <div className="pt-8">
                        <BookingStatusBadge status={booking.trangThaiDatTour} />
                      </div>

                      <div className="pt-7 text-right text-[14px] font-semibold leading-6 text-[rgba(32,34,36,0.8)]">
                        <p>{formatDateTime(booking.ngayDat)}</p>
                        <p>{formatDate(booking.ngayDat)}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
