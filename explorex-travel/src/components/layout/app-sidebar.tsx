"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type AppSidebarItem = {
  href: string;
  label: string;
  icon?: string;
};

type AppSidebarProps = {
  title: string;
  items: AppSidebarItem[];
  brand?: string;
  subtitle?: string;
  footer?: ReactNode;
};

const SidebarIcon = ({ path }: { path?: string }) => {
  if (!path) {
    return <span className="size-[18px] rounded-full border border-current/40" />;
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AppSidebar = ({ title, items, brand, subtitle, footer }: AppSidebarProps) => {
  const pathname = usePathname();
  const primaryItems = items.slice(0, 5);
  const secondaryItems = items.slice(5);

  const renderLink = (item: AppSidebarItem) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={[
          "relative flex items-center gap-3 rounded-[8px] px-4 py-[11px] text-[14px] font-semibold tracking-[0.01em] transition",
          isActive ? "bg-[#4880ff] text-white shadow-[0_10px_24px_rgba(72,128,255,0.24)]" : "text-[#202224] hover:bg-[#f4f7fb]",
        ].join(" ")}
      >
        {isActive ? <span className="absolute -left-3 top-0 h-full w-[6px] rounded-r-[4px] bg-[#4880ff]" aria-hidden="true" /> : null}
        <span className={`inline-flex shrink-0 items-center justify-center ${isActive ? "text-white" : "text-[#202224]"}`}>
          <SidebarIcon path={item.icon} />
        </span>
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-full shrink-0 self-stretch border-r border-[#e7eaee] bg-white lg:w-[240px]">
      <div className="border-b border-[#eef1f4] px-8 pb-5 pt-5">
        <div className="text-[0] font-extrabold leading-none tracking-[-0.03em]">
          <span className="text-[28px] text-[#4880ff]">28</span>
          <span className="text-[28px] text-[#202224]">{brand ?? title}</span>
        </div>
        <p className="mt-2 text-[12px] font-semibold text-[#9aa3b2]">{subtitle ?? title}</p>
      </div>

      <div className="flex min-h-[calc(100vh-92px)] flex-col px-4 py-4">
        <nav className="space-y-[6px]">{primaryItems.map(renderLink)}</nav>

        {secondaryItems.length > 0 ? (
          <>
            <div className="my-5 border-t border-[#eef1f4]" />
            <nav className="space-y-[6px]">{secondaryItems.map(renderLink)}</nav>
          </>
        ) : null}

        {footer ? <div className="mt-auto border-t border-[#eef1f4] pt-4">{footer}</div> : null}
      </div>
    </aside>
  );
};
