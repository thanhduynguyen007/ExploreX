import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";

export const dynamic = "force-dynamic";

const items = [
  { href: "/account/profile", label: "Thông tin tài khoản" },
  { href: "/account/bookings", label: "Lịch sử đặt tour" },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:flex-row">
      <AppSidebar title="Tài khoản khách hàng" items={items} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
