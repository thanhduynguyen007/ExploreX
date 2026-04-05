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
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/tour-groups/${groupId}/edit`}
        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
      >
        Chỉnh sửa
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
      >
        {loading ? "Đang xóa..." : "Xóa"}
      </button>
    </div>
  );
}
