"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AdminAccountRowActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Xóa tài khoản quản trị ${userId}?`);
    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/settings/admin-accounts/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({ message: "Đã xảy ra lỗi máy chủ." }));

      if (!response.ok) {
        toast.error(result.message ?? "Không thể xóa tài khoản quản trị");
        return;
      }

      toast.success("Đã xóa tài khoản quản trị");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 text-[#202224]">
      <Link
        href={`/admin/settings/admin-accounts/${userId}/edit`}
        className="inline-flex size-9 items-center justify-center rounded-[10px] border border-[#e4e7ec] bg-white transition hover:border-[#c9d3e5] hover:bg-[#f8fbff]"
        aria-label="Chỉnh sửa tài khoản quản trị"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
          <path
            d="m4 20 4.5-1 9-9a2.12 2.12 0 1 0-3-3l-9 9L4 20Zm0 0 1-4.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex size-9 items-center justify-center rounded-[10px] border border-[#ffd8d4] bg-[#fff5f4] text-[#ef3826] transition hover:bg-[#ffe8e5] disabled:opacity-60"
        aria-label="Xóa tài khoản quản trị"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
