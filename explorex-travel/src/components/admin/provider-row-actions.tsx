import Link from "next/link";

import { ProviderApprovalActions } from "@/components/admin/provider-approval-actions";

export function ProviderRowActions({
  providerId,
  currentStatus,
}: {
  providerId: string;
  currentStatus: string | null;
}) {
  return (
    <div className="flex items-center gap-3 text-[#202224]">
      <Link
        href={`/admin/providers/${providerId}`}
        className="inline-flex size-9 items-center justify-center rounded-[10px] border border-[#e4e7ec] bg-white transition hover:border-[#c9d3e5] hover:bg-[#f8fbff]"
        aria-label="Xem chi tiết nhà cung cấp"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
          <path
            d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </Link>
      {currentStatus ? <ProviderApprovalActions providerId={providerId} currentStatus={currentStatus} /> : null}
    </div>
  );
}
