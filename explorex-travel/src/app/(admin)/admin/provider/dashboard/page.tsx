import { redirect } from "next/navigation";

import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { getProviderDashboardSummary } from "@/services/dashboard.service";

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

export default async function ProviderAdminDashboardPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const summary = await getProviderDashboardSummary(user.id);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title="Tổng quan hoạt động"
        description={`Đối tác ${summary.provider.tenNhaCungCap ?? summary.provider.maNhaCungCap} chỉ thấy dữ liệu thuộc phạm vi của chính mình trong /admin.`}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          title="Tour"
          description={`Tổng ${summary.totalTours} tour. Chờ duyệt: ${summary.pendingTours}, bản nháp: ${summary.draftTours}, đang ẩn: ${summary.hiddenTours}.`}
        />
        <InfoCard
          title="Booking"
          description={`Tổng ${summary.totalBookings} đơn. Chờ xử lý: ${summary.pendingBookings}, đã xác nhận: ${summary.confirmedBookings}, đã hoàn thành: ${summary.completedBookings}.`}
        />
        <InfoCard
          title="Lịch sắp khởi hành"
          description={`Hiện có ${summary.upcomingSchedules.length} lịch sắp tới cần theo dõi.`}
        />
        <InfoCard
          title="Doanh thu"
          description={`Doanh thu từ booking hợp lệ của đối tác hiện là ${summary.totalRevenue.toLocaleString("vi-VN")} đ.`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Lịch khởi hành sắp tới</h2>
          <div className="mt-4 space-y-3">
            {summary.upcomingSchedules.map((schedule) => (
              <div key={schedule.maLichTour} className="rounded-2xl border border-stone-200 px-4 py-3">
                <p className="font-medium text-stone-900">{schedule.tenTour ?? schedule.maLichTour}</p>
                <p className="mt-1 text-sm text-stone-500">
                  {formatDateTime(schedule.ngayBatDau)} | {schedule.soChoTrong ?? 0} chỗ trống | {schedule.trangThai}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Đánh giá tour</h2>
          <div className="mt-4 space-y-3">
            {summary.topRatedTours.map((tour) => (
              <div key={tour.maTour} className="rounded-2xl border border-stone-200 px-4 py-3">
                <p className="font-medium text-stone-900">{tour.tenTour ?? tour.maTour}</p>
                <p className="mt-1 text-sm text-stone-500">
                  {tour.avgRating ? `${Number(tour.avgRating).toFixed(1)}/5` : "Chưa có đánh giá"} | {tour.totalReviews} lượt
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
