"use client";

import Link from "next/link";
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
};

const SidebarIcon = ({ path }: { path?: string }) => {
  if (!path) {
    return <span className="size-4 rounded-full border border-current/40" />;
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AppSidebar = ({ title, items, brand, subtitle }: AppSidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:min-h-screen lg:w-[226px]">
      <div className="px-3 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-slate-900">{brand ?? title}</span>
        </div>
        <p className="mt-2 text-xs font-medium text-slate-400">{subtitle ?? title}</p>
      </div>

      <nav className="mt-2 flex flex-col gap-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[#3b82f6] text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              ].join(" ")}
            >
              <SidebarIcon path={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
