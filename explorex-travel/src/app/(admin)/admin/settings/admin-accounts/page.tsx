import Link from "next/link";

import { AdminAccountRowActions } from "@/components/admin/admin-account-row-actions";
import { listAdminAccounts } from "@/services/admin-account.service";

const statusMap: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Đang hoạt động", className: "bg-[#d7f4ef] text-[#00b69b]" },
  PENDING: { label: "Chờ kích hoạt", className: "bg-[#fff4de] text-[#d97706]" },
  SUSPENDED: { label: "Tạm dừng", className: "bg-[#e5e7eb] text-[#4b5563]" },
  DISABLED: { label: "Vô hiệu hóa", className: "bg-[#ffe1df] text-[#ef3826]" },
  INACTIVE: { label: "Ngưng hoạt động", className: "bg-[#ffe1df] text-[#ef3826]" },
  LOCKED: { label: "Đã khóa", className: "bg-[#fff4de] text-[#d97706]" },
};

export default async function AdminAccountsPage() {
  const accounts = await listAdminAccounts();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Tài khoản quản trị</h2>
          <p className="mt-2 text-[15px] text-[#6b7280]">
            Quản lý danh sách tài khoản có quyền truy cập khu vực quản trị.
          </p>
        </div>

        <Link
          href="/admin/settings/admin-accounts/new"
          className="inline-flex min-h-[50px] items-center justify-center rounded-[14px] bg-[#4880ff] px-9 py-3 text-[14px] font-bold text-white shadow-[0_12px_30px_rgba(72,128,255,0.28)] transition hover:bg-[#3f74e8]"
        >
          + Tạo mới
        </Link>
      </section>

      <section className="overflow-hidden rounded-[14px] border border-[#d5d5d5] bg-white shadow-[0_16px_40px_rgba(226,232,240,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-4 py-4 text-left font-extrabold">Tài khoản</th>
                <th className="px-4 py-4 text-left font-extrabold">Chức vụ</th>
                <th className="px-4 py-4 text-left font-extrabold">Quyền hạn</th>
                <th className="px-4 py-4 text-left font-extrabold">Trạng thái</th>
                <th className="px-4 py-4 text-left font-extrabold">Liên đới dữ liệu</th>
                <th className="px-4 py-4 text-left font-extrabold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Chưa có tài khoản quản trị nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                accounts.map((account) => {
                  const status = statusMap[account.trangThaiTaiKhoan ?? ""] ?? {
                    label: account.trangThaiTaiKhoan ?? "Chưa cập nhật",
                    className: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <tr key={account.maNguoiDung} className="border-b border-[#eceef2] last:border-b-0">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#202224]">{account.tenNguoiDung ?? account.maNguoiDung}</p>
                        <p className="mt-1 text-[12px] text-[#6b7280]">{account.email ?? "Chưa cập nhật email"}</p>
                        <p className="mt-1 text-[12px] text-[#6b7280]">{account.maNguoiDung}</p>
                      </td>
                      <td className="px-4 py-4 font-semibold">{account.chucVu ?? "Chưa cập nhật"}</td>
                      <td className="px-4 py-4 text-[13px] leading-6 text-[#4b5563]">{account.quyenHan ?? "Chưa cập nhật"}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
                      </td>
                      <td className="px-4 py-4 text-[13px] text-[#4b5563]">
                        {account.isCustomer || account.totalBookings > 0 || account.totalReviews > 0
                          ? "Đang gắn dữ liệu khách hàng, không cho xóa"
                          : "Có thể xóa"}
                      </td>
                      <td className="px-4 py-4">
                        <AdminAccountRowActions userId={account.maNguoiDung} />
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
