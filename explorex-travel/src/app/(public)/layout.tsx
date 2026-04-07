import type { ReactNode } from "react";
import { Be_Vietnam_Pro } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const dynamic = "force-dynamic";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${beVietnamPro.className} min-h-screen bg-white`}>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
