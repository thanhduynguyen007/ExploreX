import Link from "next/link";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Tour trong nước" },
  { href: "/login", label: "Đăng nhập" },
  { href: "/register/customer", label: "Liên hệ" },
];

export const SiteFooter = () => {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-stone-700 md:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-orange-500">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">f</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">t</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">◎</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">▶</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 border-t border-stone-200 pt-5 text-center md:mt-5 md:flex-row md:justify-between md:text-left">
          <div className="order-2 text-xs text-stone-500 md:order-1 md:text-sm">© 2026 ExploreX Travel. All rights reserved.</div>

          <div className="order-1 flex flex-col items-center gap-2 md:order-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[conic-gradient(from_210deg,#3b82f6_0deg,#3b82f6_180deg,#f97316_180deg,#f97316_360deg)] text-lg text-white">
              ✈
            </span>
            <span className="text-sm font-black text-orange-500">ExploreX Travel</span>
          </div>

          <div className="order-3 flex flex-wrap justify-center gap-4 text-xs text-stone-500 md:text-sm">
            <Link href="/register/customer" className="transition hover:text-orange-500">
              Điều khoản dịch vụ
            </Link>
            <Link href="/register/customer" className="transition hover:text-orange-500">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
