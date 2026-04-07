import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { getSessionUser } from "@/lib/auth/session";
import { getProviderProfileByUserId } from "@/services/tour.service";

export const dynamic = "force-dynamic";

const items = [
  {
    href: "/admin/provider/dashboard",
    label: "Tổng quan đối tác",
    icon: "M4 12h16M12 4v16",
  },
  {
    href: "/admin/provider/profile",
    label: "Thông tin đối tác",
    icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0",
  },
  {
    href: "/admin/provider/tours",
    label: "Quản lý tour",
    icon: "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Zm0 0h14a2 2 0 0 0 2-2V9",
  },
  {
    href: "/admin/provider/schedules",
    label: "Lịch khởi hành",
    icon: "M8 3v3M16 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z",
  },
  {
    href: "/admin/provider/bookings",
    label: "Đơn đặt tour",
    icon: "M7 7h10M7 12h10M7 17h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z",
  },
  {
    href: "/admin/provider/reviews",
    label: "Đánh giá",
    icon: "m12 3 2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 18.77 6.2 21.87l1.11-6.47L2.6 10.82l6.49-.94L12 3Z",
  },
  {
    href: "/admin/provider/reports",
    label: "Báo cáo",
    icon: "M5 19V9M12 19V5M19 19v-8",
  },
];

export default async function ProviderAdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#f5f6fa]" aria-hidden="true" />
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AppSidebar brand="28Partner" title="Khu vực đối tác" subtitle="Điều hành tour" items={items} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[#e7eaee] bg-white px-6 py-4 lg:px-8">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#9aa3b2]">Khu vực đối tác</p>
              <h1 className="mt-1 text-[18px] font-bold tracking-[-0.02em] text-[#202224]">
                {provider.tenNhaCungCap ?? provider.maNhaCungCap}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-bold text-[#4880ff]">
                Provider
              </span>
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,_#2563eb,_#0b1f4d)] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.15)]">
                  {(provider.tenNhaCungCap ?? "P").slice(0, 1).toUpperCase()}
                </div>
                <div className="text-right leading-tight">
                  <p className="text-[14px] font-bold text-[#202224]">{user.name}</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#606060]">{provider.maNhaCungCap}</p>
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
