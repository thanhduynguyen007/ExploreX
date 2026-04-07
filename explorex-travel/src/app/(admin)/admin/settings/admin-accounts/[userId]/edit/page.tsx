import { notFound } from "next/navigation";

import { RevokeAdminAccessButton } from "@/components/admin/revoke-admin-access-button";
import { AdminAccountForm } from "@/components/forms/admin-account-form";
import { ApiRequestError } from "@/lib/auth/guards";
import { getAdminAccountById } from "@/services/admin-account.service";

export default async function EditAdminAccountPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  try {
    const account = await getAdminAccountById(userId);

    return (
      <div className="space-y-6">
        <section>
          <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Chỉnh sửa tài khoản quản trị</h2>
          <p className="mt-2 text-[15px] text-[#6b7280]">
            Cập nhật thông tin tài khoản đang có quyền truy cập khu vực quản trị.
          </p>
        </section>

        <AdminAccountForm
          mode="edit"
          endpoint={`/api/admin/settings/admin-accounts/${account.maNguoiDung}`}
          redirectTo="/admin/settings/admin-accounts"
          cancelHref="/admin/settings/admin-accounts"
          submitLabel="Cập nhật"
          initialValues={{
            maNguoiDung: account.maNguoiDung,
            tenNguoiDung: account.tenNguoiDung ?? "",
            email: account.email ?? "",
            trangThaiTaiKhoan: account.trangThaiTaiKhoan ?? "ACTIVE",
            chucVu: account.chucVu,
            quyenHan: account.quyenHan,
          }}
        />

        <section className="rounded-[20px] border border-[#f3d0cb] bg-[#fff7f5] p-5 shadow-[0_16px_36px_rgba(239,56,38,0.06)]">
          <h3 className="text-[18px] font-bold text-[#202224]">Thu hồi quyền quản trị</h3>
          <p className="mt-2 max-w-3xl text-[14px] leading-7 text-[#6b7280]">
            Dùng thao tác này khi tài khoản không còn cần truy cập khu vực quản trị. Hệ thống sẽ giữ lại tài khoản đăng nhập, nhưng gỡ quyền quản trị hiện tại.
          </p>
          <div className="mt-4">
            <RevokeAdminAccessButton userId={account.maNguoiDung} />
          </div>
        </section>
      </div>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
