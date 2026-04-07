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

export default async function ProviderAdminProfilePage() {
  const { user, provider: providerProfile } = await getProviderAdminAccess({ allowPending: true });
  const provider = await getAdminProviderDetail(providerProfile.maNhaCungCap);

  return (
    <div className="space-y-6">
      <ProviderPageHeader
        eyebrow="Thông tin đối tác"
        title={provider.tenNhaCungCap ?? provider.maNhaCungCap}
        description="Hồ sơ đối tác được hiển thị từ bảng nhà cung cấp và tài khoản đăng nhập hiện tại, không dùng dữ liệu giả lập ngoài schema."
        action={<ProviderStatusBadge status={provider.trangThaiHopTac} kind="provider" />}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProviderMetricCard title="Mã đối tác" value={provider.maNhaCungCap} description={`Tài khoản liên kết: ${provider.maNguoiDung}`} />
        <ProviderMetricCard title="Doanh thu" value={formatCurrency(provider.totalRevenue)} description={`Từ ${provider.totalBookings} booking đã phát sinh.`} />
        <ProviderMetricCard title="Tour đang có" value={String(provider.totalTours)} description={`${provider.publishedTours} tour đang hiển thị công khai.`} />
        <ProviderMetricCard title="Đánh giá" value={formatRating(provider.avgRating)} description={`${provider.totalReviews} lượt phản hồi từ khách hàng.`} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ProviderSection title="Thông tin hồ sơ" description="Các trường này bám trực tiếp vào bảng nhà cung cấp và tài khoản người dùng.">
          <dl className="grid gap-5 md:grid-cols-2">
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Tên đăng nhập hiển thị</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{user.name}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Email tài khoản</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{user.email}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Email liên hệ</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{provider.email ?? "Chưa cập nhật"}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Số điện thoại</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{provider.soDienThoai ?? "Chưa cập nhật"}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Địa chỉ</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{provider.diaChi ?? "Chưa cập nhật"}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-semibold text-[#7b8190]">Loại dịch vụ</dt>
              <dd className="mt-2 text-[15px] font-semibold text-[#202224]">{provider.loaiDichVu ?? "Chưa cập nhật"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[13px] font-semibold text-[#7b8190]">Mô tả nhà cung cấp</dt>
              <dd className="mt-2 text-[15px] leading-8 text-[#202224]">{provider.thongTinNhaCungCap ?? "Chưa cập nhật thông tin giới thiệu."}</dd>
            </div>
          </dl>
        </ProviderSection>

        <div className="space-y-6">
          <ProviderSection title="Tour gần đây">
            <div className="space-y-3">
              {provider.recentTours.length === 0 ? (
                <p className="text-sm text-[#6b7280]">Chưa có tour nào.</p>
              ) : (
                provider.recentTours.map((tour) => (
                  <article key={tour.maTour} className="rounded-[16px] border border-[#edf1f6] bg-[#fafcff] px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[15px] font-bold text-[#202224]">{tour.tenTour ?? tour.maTour}</p>
                        <p className="mt-1 text-[13px] text-[#6b7280]">{tour.tenNhomTour ?? "Chưa cập nhật danh mục"}</p>
                      </div>
                      <ProviderStatusBadge status={tour.trangThai} kind="tour" />
                    </div>
                  </article>
                ))
              )}
            </div>
          </ProviderSection>

          <ProviderSection title="Booking gần đây">
            <div className="space-y-3">
              {provider.recentBookings.length === 0 ? (
                <p className="text-sm text-[#6b7280]">Chưa có booking nào.</p>
              ) : (
                provider.recentBookings.map((booking) => (
                  <article key={booking.maDatTour} className="rounded-[16px] border border-[#edf1f6] bg-[#fafcff] px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[15px] font-bold text-[#202224]">{booking.maDatTour}</p>
                        <p className="mt-1 text-[13px] text-[#6b7280]">{booking.tenTour ?? "Chưa cập nhật tour"}</p>
                        <p className="mt-2 text-[13px] text-[#606060]">{formatDateTime(booking.ngayDat)}</p>
                      </div>
                      <div className="text-right">
                        <ProviderStatusBadge status={booking.trangThaiDatTour} kind="booking" />
                        <p className="mt-2 text-[13px] font-semibold text-[#202224]">{formatCurrency(booking.tongTien)}</p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </ProviderSection>
        </div>
      </div>
    </div>
  );
}
