import { redirect } from "next/navigation";

import {
  ProviderMetricCard,
  ProviderPageHeader,
  ProviderSection,
  ProviderStatusBadge,
  formatCurrency,
  formatDateTime,
  formatRating,
} from "@/components/provider/provider-ui";
import { getSessionUser } from "@/lib/auth/session";
import { getProviderDashboardSummary } from "@/services/dashboard.service";

export default async function ProviderAdminDashboardPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const summary = await getProviderDashboardSummary(user.id);

  return (
    <div className="space-y-6">
      <ProviderPageHeader
        eyebrow="Tổng quan đối tác"
        title={summary.provider.tenNhaCungCap ?? summary.provider.maNhaCungCap}
        description="Theo dõi nhanh số tour đang vận hành, lịch khởi hành sắp tới, booking mới và doanh thu hợp lệ chỉ trong phạm vi nhà cung cấp của bạn."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProviderMetricCard
          title="Tour"
          value={String(summary.totalTours)}
          description={`Bản nháp ${summary.draftTours}, chờ duyệt ${summary.pendingTours}, đang ẩn ${summary.hiddenTours}.`}
        />
        <ProviderMetricCard
          title="Đơn đặt"
          value={String(summary.totalBookings)}
          description={`Chờ xử lý ${summary.pendingBookings}, đã xác nhận ${summary.confirmedBookings}, hoàn thành ${summary.completedBookings}.`}
        />
        <ProviderMetricCard title="Doanh thu" value={formatCurrency(summary.totalRevenue)} description="Tính trên booking đã xác nhận hoặc hoàn thành." />
        <ProviderMetricCard title="Điểm đánh giá" value={formatRating(summary.topRatedTours[0]?.avgRating ?? null)} description="Điểm cao nhất từ các tour hiện có của bạn." />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ProviderSection title="Lịch khởi hành sắp tới" description="Các lịch gần nhất cần theo dõi chỗ trống và trạng thái mở bán.">
          <div className="space-y-3">
            {summary.upcomingSchedules.length === 0 ? (
              <p className="text-sm text-[#6b7280]">Chưa có lịch khởi hành sắp tới.</p>
            ) : (
              summary.upcomingSchedules.map((schedule) => (
                <article key={schedule.maLichTour} className="rounded-[16px] border border-[#edf1f6] bg-[#fafcff] px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[15px] font-bold text-[#202224]">{schedule.tenTour ?? schedule.maLichTour}</p>
                      <p className="mt-1 text-[13px] text-[#6b7280]">{formatDateTime(schedule.ngayBatDau)}</p>
                    </div>
                    <ProviderStatusBadge status={schedule.trangThai} kind="schedule" />
                  </div>
                  <p className="mt-3 text-[13px] text-[#606060]">Còn {schedule.soChoTrong ?? 0} chỗ trống.</p>
                </article>
              ))
            )}
          </div>
        </ProviderSection>

        <ProviderSection title="Tour được đánh giá cao" description="Những tour có phản hồi tốt nhất để bạn tiếp tục tối ưu nội dung và lịch bán.">
          <div className="space-y-3">
            {summary.topRatedTours.length === 0 ? (
              <p className="text-sm text-[#6b7280]">Chưa có dữ liệu đánh giá.</p>
            ) : (
              summary.topRatedTours.map((tour) => (
                <article key={tour.maTour} className="rounded-[16px] border border-[#edf1f6] bg-[#fafcff] px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[15px] font-bold text-[#202224]">{tour.tenTour ?? tour.maTour}</p>
                      <p className="mt-1 text-[13px] text-[#6b7280]">{tour.totalReviews} lượt đánh giá</p>
                    </div>
                    <span className="inline-flex rounded-[8px] bg-[#fff4de] px-3 py-1 text-xs font-bold text-[#d97706]">
                      {formatRating(tour.avgRating)}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </ProviderSection>
      </div>
    </div>
  );
}
