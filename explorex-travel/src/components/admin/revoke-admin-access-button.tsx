"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function RevokeAdminAccessButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRevoke = async () => {
    const confirmed = window.confirm(`Thu hồi quyền quản trị của tài khoản ${userId}?`);
    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/settings/admin-accounts/${userId}`, {
        method: "PATCH",
      });

      const result = await response.json().catch(() => ({ message: "Đã xảy ra lỗi máy chủ." }));

      if (!response.ok) {
        toast.error(result.message ?? "Không thể thu hồi quyền quản trị");
        return;
      }

      toast.success("Đã thu hồi quyền quản trị");
      router.push("/admin/settings/admin-accounts");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRevoke}
      disabled={loading}
      className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] border border-[#ef3826] px-5 py-3 text-[14px] font-bold text-[#ef3826] transition hover:bg-[#fff0ee] disabled:opacity-60"
    >
      {loading ? "Đang xử lý..." : "Thu hồi quyền quản trị"}
    </button>
  );
}
