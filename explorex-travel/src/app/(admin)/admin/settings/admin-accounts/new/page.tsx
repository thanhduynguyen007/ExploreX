import { AdminAccountForm } from "@/components/forms/admin-account-form";
import { getNextAdminAccountId } from "@/services/admin-account.service";

export default async function NewAdminAccountPage() {
  const nextAdminAccountId = await getNextAdminAccountId();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Tạo tài khoản quản trị</h2>
        <p className="mt-2 text-[15px] text-[#6b7280]">
          Thiết lập thông tin cho tài khoản mới được phép truy cập khu vực quản trị.
        </p>
      </section>

      <AdminAccountForm
        mode="create"
        endpoint="/api/admin/settings/admin-accounts"
        redirectTo="/admin/settings/admin-accounts"
        cancelHref="/admin/settings/admin-accounts"
        submitLabel="Tạo mới"
        initialValues={{
          maNguoiDung: nextAdminAccountId,
          tenNguoiDung: "",
          email: "",
          trangThaiTaiKhoan: "ACTIVE",
          quyenHan: "FULL_ACCESS",
        }}
      />
    </div>
  );
}
