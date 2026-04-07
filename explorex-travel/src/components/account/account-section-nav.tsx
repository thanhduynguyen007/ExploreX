"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/account/profile", label: "Hồ sơ" },
  { href: "/account/bookings", label: "Đơn đặt tour" },
  { href: "/account/reviews", label: "Đánh giá của tôi" },
];

export const AccountSectionNav = () => {
  const pathname = usePathname();

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Trang cá nhân</p>
          <h2 className="mt-2 text-xl font-extrabold text-stone-900">Thông tin và lịch sử của bạn</h2>
          <p className="mt-2 text-sm leading-7 text-stone-500">
            Đây là khu vực hỗ trợ cá nhân trong website, không phải màn quản trị hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-orange-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.22)]"
                    : "border border-stone-200 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
