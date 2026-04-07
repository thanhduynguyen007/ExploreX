import { redirect } from "next/navigation";

import { CustomerProfileForm } from "@/components/forms/customer-profile-form";
import { getSessionUser } from "@/lib/auth/session";
import { getCustomerProfile } from "@/services/user.service";

export default async function AccountProfilePage() {
  const user = await getSessionUser();
  if (!user || user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const profile = await getCustomerProfile(user.id);

  return (
    <div className="space-y-6">
      <section className="relative flex min-h-[210px] items-end overflow-hidden rounded-[2rem] bg-[linear-gradient(to_right,rgba(70,30,120,0.8),rgba(180,70,20,0.5)),url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&h=420&fit=crop&auto=format')] bg-cover bg-center px-6 py-8 md:min-h-[240px] md:px-10">
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">Khách hàng ExploreX</p>
          <h1 className="mt-3 max-w-4xl text-2xl font-black leading-tight text-white md:text-4xl">Hồ sơ cá nhân</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90 md:text-base">
            Cập nhật thông tin liên hệ đang dùng cho đặt tour, xác nhận đơn và theo dõi hành trình của bạn trên website.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5 rounded-2xl bg-white p-5 shadow-sm md:p-6">
          <div className="rounded-2xl bg-[linear-gradient(160deg,#fed7aa_0%,#fdba74_45%,#fb923c_100%)] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Thông tin chủ tài khoản</p>
            <h2 className="mt-3 text-2xl font-black">{profile.tenNguoiDung ?? "Khách hàng ExploreX"}</h2>
            <p className="mt-2 text-sm leading-7 text-white/90">{profile.email ?? "Chưa cập nhật email"}</p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Mã tài khoản</p>
              <p className="mt-2 text-base font-bold text-stone-900">{profile.maNguoiDung}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Số điện thoại</p>
              <p className="mt-2 text-base font-bold text-stone-900">{profile.soDienThoai ?? "Chưa cập nhật"}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Địa chỉ</p>
              <p className="mt-2 text-sm leading-7 text-stone-700">{profile.diaChi ?? "Chưa cập nhật địa chỉ liên hệ."}</p>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-orange-500">Thông tin liên hệ</h2>
              <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">Mã tài khoản: {profile.maNguoiDung}</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Những dữ liệu này được dùng trong quá trình đặt tour và liên hệ xác nhận đơn. Vui lòng giữ thông tin luôn chính xác trước khi thanh toán hoặc chờ nhân viên liên hệ.
            </p>
            <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-2xl bg-stone-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Trạng thái tài khoản</p>
                <p className="mt-2 text-base font-bold text-stone-900">{profile.trangThaiTaiKhoan ?? "Chưa cập nhật"}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Email đăng nhập</p>
                <p className="mt-2 text-base font-bold text-stone-900">{profile.email ?? "Chưa cập nhật"}</p>
              </div>
            </div>
          </section>

          <CustomerProfileForm profile={profile} />
        </div>
      </section>
    </div>
  );
}
