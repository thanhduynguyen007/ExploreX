"use client";

import Link from "next/link";

export function ProviderScheduleRowActions({ scheduleId }: { scheduleId: string }) {
  return (
    <div className="flex items-center gap-3 text-[#202224]">
      <Link
        href={`/admin/provider/schedules/${scheduleId}/edit`}
        className="inline-flex size-9 items-center justify-center rounded-[10px] border border-[#e4e7ec] bg-white transition hover:border-[#c9d3e5] hover:bg-[#f8fbff]"
        aria-label="Chỉnh sửa lịch khởi hành"
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
