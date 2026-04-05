import type { Metadata } from "next";

import { ToastProvider } from "@/components/providers/toast-provider";

import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ExploreX Travel",
  description: "Nền tảng quản lý và đặt tour du lịch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
