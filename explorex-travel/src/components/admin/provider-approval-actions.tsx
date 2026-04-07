"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ProviderApprovalActionsProps = {
  providerId: string;
  currentStatus: string | null;
};

const baseButtonClassName =
  "inline-flex min-h-[38px] items-center justify-center rounded-[10px] border px-3 py-2 text-[13px] font-bold transition disabled:cursor-not-allowed disabled:opacity-60";

export function ProviderApprovalActions({
  providerId,
  currentStatus,
}: ProviderApprovalActionsProps) {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const onUpdate = async (trangThaiHopTac: "APPROVED" | "REJECTED" | "SUSPENDED") => {
    setLoadingStatus(trangThaiHopTac);

    try {
      const response = await fetch(`/api/admin/providers/${providerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trangThaiHopTac }),
      });

      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        toast.error(result?.message ?? "Không thể cập nhật trạng thái nhà cung cấp.");
        return;
      }

      toast.success(result?.message ?? "Đã cập nhật trạng thái nhà cung cấp.");
      router.refresh();
    } finally {
      setLoadingStatus(null);
    }
  };

  const actions =
    currentStatus === "APPROVED"
      ? [{ value: "SUSPENDED" as const, label: "Tạm dừng", className: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100" }]
      : [
          { value: "APPROVED" as const, label: "Duyệt", className: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
          { value: "REJECTED" as const, label: "Từ chối", className: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" },
        ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => (
        <button
          key={action.value}
          type="button"
          onClick={() => onUpdate(action.value)}
          disabled={loadingStatus !== null}
          className={`${baseButtonClassName} ${action.className}`}
        >
          {loadingStatus === action.value ? "Đang lưu..." : action.label}
        </button>
      ))}
    </div>
  );
}
