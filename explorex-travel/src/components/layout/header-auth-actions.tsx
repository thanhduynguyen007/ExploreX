"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const HeaderLogoutButton = ({
  className,
}: {
  className?: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);

    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    setLoading(false);

    if (!response.ok) {
      toast.error("Không thể đăng xuất lúc này.");
      return;
    }

    toast.success("Đã đăng xuất.");
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className={`${className ?? ""} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
};
