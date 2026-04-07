import Link from "next/link";
import { notFound } from "next/navigation";

import { ApiRequestError } from "@/lib/auth/guards";
import { getAdminUserDetail } from "@/services/user.service";

const roleMap: Record<string, { label: string; className: string }> = {
  ADMIN: { label: "Admin", className: "bg-[#efe7ff] text-[#7c3aed]" },
  PROVIDER: { label: "Nhà cung cấp", className: "bg-[#e0ecff] text-[#3b82f6]" },
  CUSTOMER: { label: "Khách hàng", className: "bg-[#d7f4ef] text-[#00b69b]" },
};

const statusMap: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Đang hoạt động", className: "bg-[#d7f4ef] text-[#00b69b]" },
  PENDING: { label: "Chờ kích hoạt", className: "bg-[#fff4de] text-[#d97706]" },
  SUSPENDED: { label: "Tạm dừng", className: "bg-[#e5e7eb] text-[#4b5563]" },
  DISABLED: { label: "Vô hiệu hóa", className: "bg-[#ffe1df] text-[#ef3826]" },
  INACTIVE: { label: "Ngưng hoạt động", className: "bg-[#ffe1df] text-[#ef3826]" },
  LOCKED: { label: "Đã khóa", className: "bg-[#fff4de] text-[#d97706]" },
};

const bookingStatusMap: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Chờ xử lý", className: "bg-[#fff4de] text-[#d97706]" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-[#d7f4ef] text-[#00b69b]" },
  COMPLETED: { label: "Hoàn thành", className: "bg-[#e0ecff] text-[#3b82f6]" },
  CANCELLED: { label: "Đã hủy", className: "bg-[#ffe1df] text-[#ef3826]" },
};

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
      <p className="text-[13px] font-semibold text-[#7b8190]">{label}</p>
      <p className="mt-2 text-[16px] font-bold leading-7 text-[#202224]">{value}</p>
    </article>
  );
}

const formatCurrency = (value: number | null | undefined) => `${(value ?? 0).toLocaleString("vi-VN")} đ`;

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

function StarRating({ value }: { value: number | null }) {
  const rating = Math.max(0, Math.min(5, Number(value ?? 0)));

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;
        return (
          <svg key={index} viewBox="0 0 20 20" fill={filled ? "#ffb648" : "none"} className="size-4" aria-hidden="true">
            <path
              d="m10 2.2 2.38 4.82 5.32.77-3.85 3.75.9 5.3L10 14.35 5.25 16.84l.9-5.3L2.3 7.8l5.32-.77L10 2.2Z"
              stroke={filled ? "#ffb648" : "#d1d5db"}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  let user;

  try {
    user = await getAdminUserDetail(userId);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const role = roleMap[user.role] ?? {
    label: user.role,
    className: "bg-slate-100 text-slate-600",
  };
  const status = statusMap[user.trangThaiTaiKhoan ?? ""] ?? {
    label: user.trangThaiTaiKhoan ?? "Chưa cập nhật",
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link href="/admin/users" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5a8cff]">
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Quay lại danh sách
          </Link>
          <div>
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">{user.tenNguoiDung ?? user.maNguoiDung}</h2>
            <p className="mt-2 text-[15px] text-[#6b7280]">
              Hồ sơ người dùng lấy từ <span className="font-semibold text-[#202224]">nguoidung</span> và các bảng vai trò chuẩn trong tài liệu.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex rounded-[8px] px-4 py-2 text-[13px] font-bold ${role.className}`}>{role.label}</span>
          <span className={`inline-flex rounded-[8px] px-4 py-2 text-[13px] font-bold ${status.className}`}>{status.label}</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard label="Mã người dùng" value={user.maNguoiDung} />
        <DetailCard label="Email" value={user.email ?? "Chưa cập nhật"} />
        <DetailCard label="Vai trò" value={role.label} />
        <DetailCard label="Số booking" value={`${user.totalBookings} booking`} />
        <DetailCard label="Số đánh giá" value={`${user.totalReviews} đánh giá`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="overflow-hidden rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h3 className="text-[20px] font-bold text-[#202224]">Thông tin tài khoản</h3>
          </div>

          <div className="grid gap-5 px-6 py-6">
            <div>
              <p className="text-[13px] font-semibold text-[#7b8190]">Họ tên</p>
              <p className="mt-2 text-[15px] font-semibold text-[#202224]">{user.tenNguoiDung ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#7b8190]">Số điện thoại</p>
              <p className="mt-2 text-[15px] font-semibold text-[#202224]">{user.soDienThoai ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#7b8190]">Địa chỉ</p>
              <p className="mt-2 text-[15px] leading-8 text-[#202224]">{user.diaChi ?? "Chưa cập nhật"}</p>
            </div>
            {user.role === "ADMIN" ? (
              <div>
                <p className="text-[13px] font-semibold text-[#7b8190]">Chức vụ / Quyền hạn</p>
                <p className="mt-2 text-[15px] leading-8 text-[#202224]">
                  {user.chucVu ?? "Chưa cập nhật"}{user.quyenHan ? ` • ${user.quyenHan}` : ""}
                </p>
              </div>
            ) : null}
            {user.role === "PROVIDER" ? (
              <>
                <div>
                  <p className="text-[13px] font-semibold text-[#7b8190]">Mã nhà cung cấp</p>
                  <p className="mt-2 text-[15px] font-semibold text-[#202224]">{user.maNhaCungCap ?? "Chưa cập nhật"}</p>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#7b8190]">Hồ sơ nhà cung cấp</p>
                  <p className="mt-2 text-[15px] leading-8 text-[#202224]">
                    {user.tenNhaCungCap ?? "Chưa cập nhật"}{user.loaiDichVu ? ` • ${user.loaiDichVu}` : ""}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#7b8190]">Trạng thái hợp tác</p>
                  <p className="mt-2 text-[15px] font-semibold text-[#202224]">{user.trangThaiHopTac ?? "Chưa cập nhật"}</p>
                </div>
              </>
            ) : null}
            <div className="rounded-[14px] border border-[#edf1f6] bg-[#fafcff] px-4 py-4 text-[13px] leading-6 text-[#4b5563]">
              Ghi chú: vai trò chính được đọc trực tiếp từ <span className="font-semibold text-[#202224]">nguoidung.role</span>; các bảng nghiệp vụ chỉ bổ sung dữ liệu mở rộng.
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h3 className="text-[20px] font-bold text-[#202224]">Booking gần đây</h3>
          </div>

          <div className="divide-y divide-[#edf1f6] px-6">
            {user.recentBookings.length === 0 ? (
              <p className="py-10 text-sm text-[#6b7280]">Người dùng này chưa có booking nào.</p>
            ) : (
              user.recentBookings.map((booking) => {
                const bookingStatus = bookingStatusMap[booking.trangThaiDatTour ?? ""] ?? {
                  label: booking.trangThaiDatTour ?? "Chưa cập nhật",
                  className: "bg-slate-100 text-slate-600",
                };

                return (
                  <div key={booking.maDatTour} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[15px] font-semibold text-[#202224]">{booking.tenTour ?? booking.maDatTour}</p>
                      <p className="mt-1 text-[13px] text-[#6b7280]">
                        {booking.maDatTour} • {formatDateTime(booking.ngayDat)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-bold text-[#202224]">{formatCurrency(booking.tongTien)}</span>
                      <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${bookingStatus.className}`}>{bookingStatus.label}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
        <div className="border-b border-[#edf1f6] px-6 py-5">
          <h3 className="text-[20px] font-bold text-[#202224]">Đánh giá gần đây</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-4 py-4 text-left font-extrabold">Mã đánh giá</th>
                <th className="px-4 py-4 text-left font-extrabold">Tour</th>
                <th className="px-4 py-4 text-left font-extrabold">Số sao</th>
                <th className="px-4 py-4 text-left font-extrabold">Bình luận</th>
                <th className="px-4 py-4 text-left font-extrabold">Ngày đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {user.recentReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Người dùng này chưa có đánh giá nào.
                  </td>
                </tr>
              ) : (
                user.recentReviews.map((review) => (
                  <tr key={review.maDanhGia} className="border-b border-[#eceef2] last:border-b-0">
                    <td className="px-4 py-4 font-semibold">{review.maDanhGia}</td>
                    <td className="px-4 py-4 font-semibold">{review.tenTour ?? "Chưa cập nhật"}</td>
                    <td className="px-4 py-4">
                      <StarRating value={review.soSao} />
                    </td>
                    <td className="px-4 py-4 text-[13px] leading-6 text-[#4b5563]">{review.binhLuan ?? "Không có bình luận."}</td>
                    <td className="px-4 py-4 font-semibold opacity-90">{formatDateTime(review.ngayDanhGia)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
