import Link from "next/link";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Tour trong nước" },
  { href: "/login", label: "Đăng nhập" },
  { href: "/register/customer", label: "Đăng ký khách hàng" },
];

export const SiteFooter = () => {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 border-b border-stone-200 px-6 py-6">
        <nav className="flex flex-wrap gap-5 text-sm font-medium text-stone-700">
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

      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 text-sm text-stone-500">
        <p>© 2026 ExploreX Travel. All rights reserved.</p>
        <div className="flex items-center gap-2 font-extrabold text-orange-500">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs text-white">✈</span>
          <span>ExploreX Travel</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/register/customer" className="transition hover:text-orange-500">
            Điều khoản dịch vụ
          </Link>
          <Link href="/register/customer" className="transition hover:text-orange-500">
            Chính sách bảo mật
          </Link>
        </div>
      </div>
    </footer>
  );
};
