import type { ReactNode } from "react";
import { Be_Vietnam_Pro } from "next/font/google";

import { AccountSectionNav } from "@/components/account/account-section-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const dynamic = "force-dynamic";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${beVietnamPro.className} min-h-screen bg-white`}>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8">
        <div className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden bg-stone-100">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
            <AccountSectionNav />
            <div>{children}</div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
