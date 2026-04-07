import Link from "next/link";

import { env } from "@/lib/env";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Tour trong nước" },
  { href: "/register/customer", label: "Đăng ký" },
  { href: "/account/bookings", label: "Tài khoản" },
];

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
  </svg>
);

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <path d="M3 9.5a2.5 2.5 0 0 0 0 5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3.5a2.5 2.5 0 0 1 0-5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3.5Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7v10" strokeLinecap="round" strokeDasharray="2 2" />
  </svg>
);

const PlaneLogo = ({ mobile = false }: { mobile?: boolean }) => (
  <Link href="/" className="flex items-center gap-2.5">
    <div
      className={`${mobile ? "h-8 w-8 text-sm" : "h-10 w-10 text-lg"} flex items-center justify-center rounded-full bg-[conic-gradient(from_210deg,#3b82f6_0deg,#3b82f6_180deg,#f97316_180deg,#f97316_360deg)] text-white shadow-sm`}
    >
      ✈
    </div>
    <div className={mobile ? "text-sm font-black tracking-tight text-orange-500" : ""}>
      <div className={mobile ? "" : "text-lg font-extrabold tracking-tight text-orange-500"}>{mobile ? "ExplorEX" : env.appName}</div>
      {!mobile ? <p className="text-xs text-stone-500">Nền tảng đặt tour trong nước</p> : null}
    </div>
  </Link>
);

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-orange-500 text-white md:block">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-2 text-xs font-medium md:text-sm">
          <span>0123.456.789</span>
          <span>contact@explorextravel.vn</span>
          <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
        </div>
      </div>

      <div className="border-b border-stone-200 bg-white/95 shadow-[0_1px_8px_rgba(0,0,0,0.06)] backdrop-blur">
        <div className="mx-auto hidden w-full max-w-6xl items-center justify-between gap-6 px-6 py-4 lg:flex">
          <PlaneLogo />

          <nav className="flex items-center gap-7 text-sm font-semibold text-stone-700">
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
        </div>

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:hidden">
          <details className="group relative">
            <summary className="list-none rounded-full p-2 text-stone-800">
              <MenuIcon />
            </summary>
            <div className="absolute left-0 top-full mt-3 w-56 rounded-2xl border border-stone-200 bg-white p-3 shadow-xl">
              <nav className="flex flex-col gap-1 text-sm font-semibold text-stone-700">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 transition hover:bg-orange-50 hover:text-orange-600">
                    {item.label}
                  </Link>
                ))}
                <Link href="/login" className="rounded-xl px-3 py-2 transition hover:bg-orange-50 hover:text-orange-600">
                  Đăng nhập
                </Link>
              </nav>
            </div>
          </details>

          <PlaneLogo mobile />

          <Link href="/account/bookings" className="relative rounded-full p-2 text-stone-800">
            <TicketIcon />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-extrabold text-white">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
