"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type TourGroupRowActionsProps = {
  groupId: string;
};

export function TourGroupRowActions({ groupId }: TourGroupRowActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa danh mục này không?");
    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/tour-groups/${groupId}`, {
        method: "DELETE",
      });
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.message ?? "Không thể xóa danh mục");
        return;
      }

      toast.success("Xóa danh mục thành công");
      router.refresh();
    } catch {
      toast.error("Không thể xóa danh mục");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/tour-groups/${groupId}/edit`}
        className="inline-flex size-8 items-center justify-center rounded-[8px] border border-[#d5d5d5] bg-white text-[#6b7280] transition hover:bg-slate-50 hover:text-[#202224]"
        aria-label="Chỉnh sửa danh mục"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
          <path
            d="M4 20h4l10.5-10.5-4-4L4 16v4Zm9.5-13.5 4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex size-8 items-center justify-center rounded-[8px] border border-[#d5d5d5] bg-white text-[#ef4444] transition hover:bg-rose-50 disabled:opacity-60"
        aria-label="Xóa danh mục"
      >
        {loading ? (
          <span className="size-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
            <path
              d="M5 7h14M10 11v6M14 11v6M8 7l1-2h6l1 2m-9 0 1 11h8l1-11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
