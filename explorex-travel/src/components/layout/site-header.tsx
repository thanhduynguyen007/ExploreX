import Link from "next/link";

import { env } from "@/lib/env";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Tour du lịch" },
  { href: "/register/customer", label: "Đăng ký" },
  { href: "/account/bookings", label: "Tài khoản" },
  { href: "/login", label: "Đăng nhập" },
];

export const SiteHeader = () => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
            {env.appName}
          </Link>
          <p className="mt-1 text-sm text-stone-500">Nền tảng đặt tour du lịch nội địa</p>
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-stone-950">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
