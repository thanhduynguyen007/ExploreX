import Link from "next/link";
import { notFound } from "next/navigation";

import { ApiRequestError } from "@/lib/auth/guards";
import { getAdminProviderDetail } from "@/services/provider.service";

const statusMap: Record<string, { label: string; className: string }> = {
  APPROVED: { label: "Đã duyệt", className: "bg-[#d7f4ef] text-[#00b69b]" },
  PENDING: { label: "Chờ duyệt", className: "bg-[#fff4de] text-[#d97706]" },
  REJECTED: { label: "Từ chối", className: "bg-[#ffe1df] text-[#ef3826]" },
  SUSPENDED: { label: "Tạm dừng", className: "bg-[#e5e7eb] text-[#4b5563]" },
};

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

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
      <p className="text-[13px] font-semibold text-[#7b8190]">{label}</p>
      <p className="mt-2 text-[16px] font-bold leading-7 text-[#202224]">{value}</p>
    </article>
  );
}

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")} đ`;

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

export default async function AdminProviderDetailPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = await params;
  let provider;

  try {
    provider = await getAdminProviderDetail(providerId);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const status = statusMap[provider.trangThaiHopTac ?? ""] ?? {
    label: provider.trangThaiHopTac ?? "Chưa cập nhật",
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link href="/admin/providers" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5a8cff]">
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Quay lại danh sách
          </Link>
          <div>
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">{provider.tenNhaCungCap ?? provider.maNhaCungCap}</h2>
            <p className="mt-2 text-[15px] text-[#6b7280]">
              Theo dõi hồ sơ nhà cung cấp từ dữ liệu thật trong bảng <span className="font-semibold text-[#202224]">nhacungcaptour</span>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex rounded-[8px] px-4 py-2 text-[13px] font-bold ${status.className}`}>{status.label}</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard label="Mã nhà cung cấp" value={provider.maNhaCungCap} />
        <DetailCard label="Loại dịch vụ" value={provider.loaiDichVu ?? "Chưa cập nhật"} />
        <DetailCard label="Tổng tour" value={`${provider.totalTours} tour`} />
        <DetailCard label="Tổng đơn hàng" value={`${provider.totalBookings} đơn`} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailCard label="Tour đang hiển thị" value={`${provider.publishedTours} tour`} />
        <DetailCard label="Doanh thu" value={formatCurrency(provider.totalRevenue)} />
        <DetailCard label="Đánh giá trung bình" value={`${provider.avgRating?.toFixed(1) ?? "0.0"} / 5`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="overflow-hidden rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h3 className="text-[20px] font-bold text-[#202224]">Thông tin nhà cung cấp</h3>
          </div>

          <div className="grid gap-5 px-6 py-6">
            <div>
              <p className="text-[13px] font-semibold text-[#7b8190]">Tên nhà cung cấp</p>
              <p className="mt-2 text-[15px] font-semibold text-[#202224]">{provider.tenNhaCungCap ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#7b8190]">Địa chỉ</p>
              <p className="mt-2 text-[15px] leading-8 text-[#202224]">{provider.diaChi ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#7b8190]">Mô tả</p>
              <p className="mt-2 text-[15px] leading-8 text-[#202224]">{provider.thongTinNhaCungCap ?? "Chưa có mô tả cho nhà cung cấp này."}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#7b8190]">Tổng đánh giá</p>
              <p className="mt-2 text-[15px] font-semibold text-[#202224]">{provider.totalReviews} đánh giá</p>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h3 className="text-[20px] font-bold text-[#202224]">Tour gần đây</h3>
          </div>

          <div className="divide-y divide-[#edf1f6] px-6">
            {provider.recentTours.length === 0 ? (
              <p className="py-10 text-sm text-[#6b7280]">Nhà cung cấp này chưa có tour nào.</p>
            ) : (
              provider.recentTours.map((tour) => {
                const tourStatus = tourStatusMap[tour.trangThai ?? ""] ?? {
                  label: tour.trangThai ?? "Chưa cập nhật",
                  className: "bg-slate-100 text-slate-600",
                };

                return (
                  <div key={tour.maTour} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[15px] font-semibold text-[#202224]">{tour.tenTour ?? tour.maTour}</p>
                      <p className="mt-1 text-[13px] text-[#6b7280]">
                        {tour.maTour} • {tour.tenNhomTour ?? "Chưa cập nhật danh mục"}
                      </p>
                    </div>
                    <span className={`inline-flex w-fit rounded-[4.5px] px-3 py-1 text-xs font-bold ${tourStatus.className}`}>{tourStatus.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
        <div className="border-b border-[#edf1f6] px-6 py-5">
          <h3 className="text-[20px] font-bold text-[#202224]">Đơn hàng gần đây</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-4 py-4 text-left font-extrabold">Mã đơn</th>
                <th className="px-4 py-4 text-left font-extrabold">Tour</th>
                <th className="px-4 py-4 text-left font-extrabold">Ngày đặt</th>
                <th className="px-4 py-4 text-left font-extrabold">Tổng tiền</th>
                <th className="px-4 py-4 text-left font-extrabold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {provider.recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Nhà cung cấp này chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                provider.recentBookings.map((booking) => {
                  const bookingStatus = bookingStatusMap[booking.trangThaiDatTour ?? ""] ?? {
                    label: booking.trangThaiDatTour ?? "Chưa cập nhật",
                    className: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <tr key={booking.maDatTour} className="border-b border-[#eceef2] last:border-b-0">
                      <td className="px-4 py-4 font-semibold">{booking.maDatTour}</td>
                      <td className="px-4 py-4 font-semibold">{booking.tenTour ?? "Chưa cập nhật"}</td>
                      <td className="px-4 py-4 font-semibold opacity-90">{formatDateTime(booking.ngayDat)}</td>
                      <td className="px-4 py-4 font-semibold opacity-90">{formatCurrency(booking.tongTien ?? 0)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${bookingStatus.className}`}>{bookingStatus.label}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
