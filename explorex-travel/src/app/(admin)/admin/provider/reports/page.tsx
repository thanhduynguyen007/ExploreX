import { redirect } from "next/navigation";

import {
  ProviderMetricCard,
  ProviderPageHeader,
  ProviderSection,
  ProviderStatusBadge,
  formatCurrency,
  formatRating,
} from "@/components/provider/provider-ui";
import { getSessionUser } from "@/lib/auth/session";
import { getProviderReportSummary } from "@/services/report.service";

export default async function ProviderAdminReportsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const summary = await getProviderReportSummary(user.id);

  return (
    <div className="space-y-6">
      <ProviderPageHeader
        eyebrow="Báo cáo"
        title="Hiệu quả kinh doanh"
        description="Tổng hợp doanh thu, phân bố trạng thái booking, trạng thái tour và các tour hiệu quả nhất trong phạm vi nhà cung cấp hiện tại."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProviderMetricCard title="Doanh thu" value={formatCurrency(summary.totalRevenue)} description="Tính từ booking đã xác nhận hoặc hoàn thành." />
        <ProviderMetricCard title="Tổng booking" value={String(summary.totalBookings)} description="Tất cả đơn gắn với các lịch của bạn." />
        <ProviderMetricCard title="Tổng tour" value={String(summary.totalTours)} description="Số tour thuộc nhà cung cấp hiện tại." />
        <ProviderMetricCard title="Điểm trung bình" value={formatRating(summary.avgRating)} description="Điểm trung bình trên toàn bộ tour của bạn." />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ProviderSection title="Phân bố trạng thái booking">
          <div className="space-y-3">
            {summary.bookingStatuses.length === 0 ? (
              <p className="text-sm text-[#6b7280]">Chưa có dữ liệu booking.</p>
            ) : (
              summary.bookingStatuses.map((item) => (
                <div key={`booking-${item.trangThai}`} className="flex items-center justify-between rounded-[14px] border border-[#edf1f6] px-4 py-3">
                  <ProviderStatusBadge status={item.trangThai} kind="booking" />
                  <span className="text-[15px] font-bold text-[#202224]">{item.total}</span>
                </div>
              ))
            )}
          </div>
        </ProviderSection>

        <ProviderSection title="Phân bố trạng thái tour">
          <div className="space-y-3">
            {summary.tourStatuses.length === 0 ? (
              <p className="text-sm text-[#6b7280]">Chưa có dữ liệu tour.</p>
            ) : (
              summary.tourStatuses.map((item) => (
                <div key={`tour-${item.trangThai}`} className="flex items-center justify-between rounded-[14px] border border-[#edf1f6] px-4 py-3">
                  <ProviderStatusBadge status={item.trangThai} kind="tour" />
                  <span className="text-[15px] font-bold text-[#202224]">{item.total}</span>
                </div>
              ))
            )}
          </div>
        </ProviderSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ProviderSection title="Doanh thu 7 ngày gần nhất" description="Theo ngày đặt tour, giúp nhìn nhanh nhịp bán hàng gần đây.">
          <div className="space-y-3">
            {summary.revenueTrend.length === 0 ? (
              <p className="text-sm text-[#6b7280]">Chưa có dữ liệu doanh thu gần đây.</p>
            ) : (
              summary.revenueTrend.map((item) => (
                <div key={item.period} className="grid grid-cols-[90px_1fr_auto] items-center gap-4 rounded-[14px] border border-[#edf1f6] px-4 py-3">
                  <span className="text-[13px] font-semibold text-[#606060]">{item.period}</span>
                  <div className="h-2 rounded-full bg-[#eef4ff]">
                    <div
                      className="h-2 rounded-full bg-[#4880ff]"
                      style={{
                        width: `${Math.max(10, (item.totalRevenue / Math.max(...summary.revenueTrend.map((row) => row.totalRevenue), 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[13px] font-bold text-[#202224]">{formatCurrency(item.totalRevenue)}</span>
                </div>
              ))
            )}
          </div>
        </ProviderSection>

        <ProviderSection title="Top tour theo booking">
          <div className="space-y-3">
            {summary.topTours.length === 0 ? (
              <p className="text-sm text-[#6b7280]">Chưa có tour đủ dữ liệu để xếp hạng.</p>
            ) : (
              summary.topTours.map((tour) => (
                <article key={tour.maTour} className="rounded-[16px] border border-[#edf1f6] bg-[#fafcff] px-4 py-4">
                  <p className="text-[15px] font-bold text-[#202224]">{tour.tenTour ?? tour.maTour}</p>
                  <p className="mt-2 text-[13px] text-[#606060]">{tour.totalBookings} booking</p>
                  <p className="mt-1 text-[13px] text-[#606060]">Doanh thu {formatCurrency(tour.totalRevenue)}</p>
                  <p className="mt-1 text-[13px] text-[#606060]">Đánh giá {formatRating(tour.avgRating)}</p>
                </article>
              ))
            )}
          </div>
        </ProviderSection>
      </div>
    </div>
  );
}
