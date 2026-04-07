import { UserFilterBar } from "@/components/admin/user-filter-bar";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { listAdminUsers } from "@/services/user.service";

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

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string }>;
}) {
  const params = await searchParams;
  const users = await listAdminUsers();

  const keyword = params.q?.trim().toLowerCase() ?? "";
  const roleFilter = params.role?.trim() ?? "";
  const statusFilter = params.status?.trim() ?? "";

  const filteredUsers = users.filter((user) => {
    const haystack = [
      user.maNguoiDung,
      user.tenNguoiDung ?? "",
      user.email ?? "",
      user.soDienThoai ?? "",
      user.diaChi ?? "",
      user.maNhaCungCap ?? "",
      user.tenNhaCungCap ?? "",
      user.loaiDichVu ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = keyword.length === 0 || haystack.includes(keyword);
    const matchesRole = roleFilter.length === 0 || user.role === roleFilter;
    const matchesStatus = statusFilter.length === 0 || (user.trangThaiTaiKhoan ?? "") === statusFilter;

    return matchesKeyword && matchesRole && matchesStatus;
  });

  const uniqueStatuses = Array.from(new Set(users.map((user) => user.trangThaiTaiKhoan).filter(Boolean))).sort();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Quản lý người dùng</h2>
        <p className="mt-2 text-[15px] text-[#6b7280]">
          Vai trò được đọc trực tiếp từ <span className="font-semibold text-[#202224]">nguoidung.role</span>, còn thông tin mở rộng lấy từ các bảng <span className="font-semibold text-[#202224]">admin</span>, <span className="font-semibold text-[#202224]">khachhang</span> và <span className="font-semibold text-[#202224]">nhacungcaptour</span>.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-4">
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Tổng người dùng</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{users.length}</p>
        </article>
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Admin</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{users.filter((user) => user.role === "ADMIN").length}</p>
        </article>
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Nhà cung cấp</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{users.filter((user) => user.role === "PROVIDER").length}</p>
        </article>
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Khách hàng</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{users.filter((user) => user.role === "CUSTOMER").length}</p>
        </article>
      </section>

      <UserFilterBar
        initialKeyword={params.q ?? ""}
        initialRole={roleFilter}
        initialStatus={statusFilter}
        roleOptions={[
          { value: "", label: "Tất cả vai trò" },
          ...Object.entries(roleMap).map(([value, item]) => ({
            value,
            label: item.label,
          })),
        ]}
        statusOptions={[
          { value: "", label: "Tất cả trạng thái" },
          ...uniqueStatuses.map((status) => ({
            value: status!,
            label: statusMap[status!]?.label ?? status!,
          })),
        ]}
      />

      <section className="overflow-hidden rounded-[14px] border border-[#d5d5d5] bg-white shadow-[0_16px_40px_rgba(226,232,240,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1220px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-4 py-4 text-left font-extrabold">Người dùng</th>
                <th className="px-4 py-4 text-left font-extrabold">Vai trò</th>
                <th className="px-4 py-4 text-left font-extrabold">Liên hệ</th>
                <th className="px-4 py-4 text-left font-extrabold">Thống kê</th>
                <th className="px-4 py-4 text-left font-extrabold">Trạng thái</th>
                <th className="px-4 py-4 text-left font-extrabold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Không có người dùng phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const role = roleMap[user.role] ?? {
                    label: user.role,
                    className: "bg-slate-100 text-slate-600",
                  };
                  const status = statusMap[user.trangThaiTaiKhoan ?? ""] ?? {
                    label: user.trangThaiTaiKhoan ?? "Chưa cập nhật",
                    className: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <tr key={user.maNguoiDung} className="border-b border-[#eceef2] last:border-b-0">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#202224]">{user.tenNguoiDung ?? user.maNguoiDung}</p>
                        <p className="mt-1 text-[12px] text-[#6b7280]">{user.maNguoiDung}</p>
                        {user.role === "PROVIDER" && user.tenNhaCungCap ? (
                          <p className="mt-1 text-[12px] text-[#6b7280]">{user.tenNhaCungCap}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${role.className}`}>{role.label}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#202224]">{user.email ?? "Chưa cập nhật email"}</p>
                        <p className="mt-1 text-[12px] text-[#6b7280]">{user.soDienThoai ?? "Chưa cập nhật SĐT"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[13px] text-[#4b5563]">
                          <span className="font-bold text-[#202224]">{user.totalBookings}</span> booking
                        </p>
                        <p className="mt-1 text-[13px] text-[#4b5563]">
                          <span className="font-bold text-[#202224]">{user.totalReviews}</span> đánh giá
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
                      </td>
                      <td className="px-4 py-4">
                        <UserRowActions userId={user.maNguoiDung} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3 text-[14px] text-[rgba(32,34,36,0.6)] md:flex-row md:items-center md:justify-between">
        <p>
          Hiển thị {filteredUsers.length === 0 ? 0 : 1} - {filteredUsers.length} của {users.length}
        </p>
        <div className="inline-flex items-center rounded-[8px] border border-[#d5d5d5] bg-[#fafbfd] px-4 py-2 text-[#202224]/60">
          Trang 1
        </div>
      </section>
    </div>
  );
}
