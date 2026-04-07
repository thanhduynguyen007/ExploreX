import Link from "next/link";

import { env } from "@/lib/env";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Tour trong nước" },
  { href: "/register/customer", label: "Đăng ký" },
  { href: "/account/bookings", label: "Tài khoản" },
];

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-orange-500 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-2 text-xs font-medium md:text-sm">
          <span>0123.456.789</span>
          <span>contact@explorextravel.vn</span>
          <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
        </div>
      </div>

      <div className="border-b border-stone-200 bg-white/95 shadow-[0_1px_8px_rgba(0,0,0,0.06)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[conic-gradient(from_210deg,#3b82f6_0deg,#3b82f6_180deg,#f97316_180deg,#f97316_360deg)] text-lg text-white shadow-sm">
              ✈
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-orange-500">{env.appName}</div>
              <p className="text-xs text-stone-500">Nền tảng đặt tour trong nước</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-stone-700 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-orange-500">
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-full border border-orange-200 px-4 py-2 text-orange-600 transition hover:border-orange-500 hover:bg-orange-50"
            >
              Đăng nhập
            </Link>
          </nav>

          <Link href="/login" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white lg:hidden">
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
};
