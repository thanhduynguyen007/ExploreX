import {
  ProviderMetricCard,
  ProviderPageHeader,
  ProviderSection,
  ProviderStatusBadge,
  formatCurrency,
  formatDateTime,
  formatRating,
} from "@/components/provider/provider-ui";
import { getProviderAdminAccess } from "@/lib/auth/provider-admin";
import { getAdminProviderDetail } from "@/services/provider.service";
import { getProviderDashboardSummary } from "@/services/dashboard.service";

export default async function ProviderAdminDashboardPage() {
  const { user, provider: providerProfile } = await getProviderAdminAccess({ allowPending: true });
  if (providerProfile.trangThaiHopTac !== "APPROVED") {
    const provider = await getAdminProviderDetail(providerProfile.maNhaCungCap);

    return (
      <div className="space-y-6">
        <ProviderPageHeader
          eyebrow="Khu vực đối tác"
          title={provider.tenNhaCungCap ?? provider.maNhaCungCap}
          description="Tài khoản đối tác đã đăng nhập thành công nhưng hiện chưa được phê duyệt để thao tác tour, lịch khởi hành, booking và báo cáo."
          action={<ProviderStatusBadge status={provider.trangThaiHopTac} kind="provider" />}
        />

        <ProviderSection title="Trạng thái phê duyệt" description="Khi admin chuyển hồ sơ sang Đã duyệt, toàn bộ menu quản trị đối tác sẽ được mở trở lại.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ProviderMetricCard title="Mã đối tác" value={provider.maNhaCungCap} description={`Tài khoản liên kết: ${provider.maNguoiDung}`} />
            <ProviderMetricCard title="Trạng thái" value={provider.trangThaiHopTac ?? "Chưa cập nhật"} description="Hồ sơ này đang chờ admin xem xét hoặc đã bị khóa thao tác." />
            <ProviderMetricCard title="Email liên hệ" value={provider.email ?? user.email} description="Thông tin này lấy trực tiếp từ hồ sơ nhà cung cấp hiện tại." />
            <ProviderMetricCard title="Loại dịch vụ" value={provider.loaiDichVu ?? "Chưa cập nhật"} description="Bạn có thể vào trang hồ sơ để rà lại thông tin đã đăng ký." />
          </div>

          <div className="mt-6 rounded-[18px] border border-[#ffe1b3] bg-[#fffaf0] px-5 py-4 text-[14px] leading-7 text-[#8a5a00]">
            Bạn vẫn xem được hồ sơ đối tác và trạng thái hiện tại. Các chức năng vận hành chỉ được mở khi trạng thái chuyển sang <span className="font-bold">Đã duyệt</span>.
          </div>
        </ProviderSection>
      </div>
    );
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
