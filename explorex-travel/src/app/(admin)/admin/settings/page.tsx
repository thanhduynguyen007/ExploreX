import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Cài đặt chung</h2>
        <p className="mt-2 text-[15px] text-[#6b7280]">
          Quản lý các thiết lập dành cho khu vực quản trị của hệ thống.
        </p>
      </section>

      <section>
        <Link
          href="/admin/settings/admin-accounts"
          className="block rounded-[20px] border border-[#d9d9d9] bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.04)] transition hover:border-[#b9cfff]"
        >
          <h3 className="text-[20px] font-bold text-[#202224]">Tài khoản quản trị</h3>
          <p className="mt-2 text-[14px] leading-7 text-[#6b7280]">
            Thêm mới, cập nhật hoặc thu hồi quyền truy cập quản trị cho từng tài khoản.
          </p>
        </Link>
      </section>
    </div>
  );
}
