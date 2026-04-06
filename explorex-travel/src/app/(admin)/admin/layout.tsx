"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";

export const dynamic = "force-dynamic";

const items = [
  {
    href: "/admin/dashboard",
    label: "Tổng quan",
    icon: "M4 12h16M12 4v16",
  },
  {
    href: "/admin/tour-groups",
    label: "Quản lý danh mục",
    icon: "M4 7h16M4 12h16M4 17h10",
  },
  {
    href: "/admin/tours",
    label: "Quản lý tour",
    icon: "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Zm0 0h14a2 2 0 0 0 2-2V9",
  },
  {
    href: "/admin/bookings",
    label: "Quản lý đơn hàng",
    icon: "M7 7h10M7 12h10M7 17h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z",
  },
  {
    href: "/admin/users",
    label: "Quản lý người dùng",
    icon: "M16 19a4 4 0 0 0-8 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  },
  {
    href: "/admin/providers",
    label: "Nhà cung cấp",
    icon: "M3 21h18M5 21V8l7-5 7 5v13M9 13h6",
  },
  {
    href: "/admin/reviews",
    label: "Đánh giá",
    icon: "m12 3 2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 18.77 6.2 21.87l1.11-6.47L2.6 10.82l6.49-.94L12 3Z",
  },
  {
    href: "/admin/reports",
    label: "Báo cáo",
    icon: "M5 19V9M12 19V5M19 19v-8",
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isProviderArea = pathname.startsWith("/admin/provider");

  if (isProviderArea) {
    return <div className="min-h-screen bg-[#f5f7fb] px-6 py-6">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AppSidebar brand="28Admin" title="Quản trị hệ thống" subtitle="Bảng điều khiển" items={items} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[#e7eaee] bg-white px-6 py-4 lg:px-8">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#9aa3b2]">Hệ thống quản trị</p>
              <h1 className="mt-1 text-[18px] font-bold tracking-[-0.02em] text-[#202224]">ExploreX Travel Admin</h1>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative flex size-10 items-center justify-center rounded-full bg-[#f5f6fa] text-[#606060]">
                <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                  <path
                    d="M14.86 17H9.14a2 2 0 0 1-1.96-2.4l.6-3A5 5 0 0 1 12 7a5 5 0 0 1 4.22 4.6l.6 3A2 2 0 0 1 14.86 17ZM12 20a2 2 0 0 0 1.94-1.5h-3.88A2 2 0 0 0 12 20Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="absolute -right-0.5 top-0 inline-flex min-h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#ff4d6d] px-1 text-[10px] font-bold text-white">
                  6
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,_#2563eb,_#0b1f4d)] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.15)]">
                  A
                </div>
                <div className="text-right leading-tight">
                  <p className="text-[14px] font-bold text-[#202224]">Lê Văn A</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#606060]">Admin</p>
                </div>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-6 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
