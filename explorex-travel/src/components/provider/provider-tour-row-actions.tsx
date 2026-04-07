"use client";

import Link from "next/link";

export function ProviderTourRowActions({ tourId }: { tourId: string }) {
  return (
    <div className="flex items-center gap-3 text-[#202224]">
      <Link
        href={`/admin/provider/tours/${tourId}`}
        className="inline-flex size-9 items-center justify-center rounded-[10px] border border-[#e4e7ec] bg-white transition hover:border-[#c9d3e5] hover:bg-[#f8fbff]"
        aria-label="Xem chi tiết tour"
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

      <Link
        href={`/admin/provider/tours/${tourId}/edit`}
        className="inline-flex size-9 items-center justify-center rounded-[10px] border border-[#e4e7ec] bg-white transition hover:border-[#c9d3e5] hover:bg-[#f8fbff]"
        aria-label="Chỉnh sửa tour"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
          <path
            d="M4 20h4l10-10-4-4L4 16v4Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="m12 6 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
