import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";

export const dynamic = "force-dynamic";

const items = [
  { href: "/admin/provider/dashboard", label: "Tổng quan đối tác" },
  { href: "/admin/provider/profile", label: "Thông tin đối tác" },
  { href: "/admin/provider/tours", label: "Quản lý tour" },
  { href: "/admin/provider/schedules", label: "Lịch khởi hành" },
  { href: "/admin/provider/bookings", label: "Đơn đặt tour" },
  { href: "/admin/provider/reviews", label: "Đánh giá" },
  { href: "/admin/provider/reports", label: "Báo cáo" },
];

export default function ProviderAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <AppSidebar title="Khu vực đối tác" items={items} />
      <section className="flex-1">{children}</section>
    </div>
  );
}
