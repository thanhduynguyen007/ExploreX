"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AuthField, AuthFormNote, AuthShell, authInputClassName } from "@/components/forms/auth-shell";
import { loginSchema } from "@/lib/validations/auth";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("admin@explorex.local");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await loginSchema.validate({ email, password }, { abortEarly: true });
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu đăng nhập không hợp lệ.");
      return;
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.message ?? "Đăng nhập thất bại.");
      return;
    }

    toast.success("Đăng nhập thành công.");
    router.push(payload.redirectTo);
    router.refresh();
  };

  return (
    <AuthShell
      eyebrow="Auth"
      title="Đăng nhập để tiếp tục hành trình của bạn"
      description="Đăng nhập bằng tài khoản đã có để theo dõi đơn đặt tour, quản lý hồ sơ khách hàng hoặc truy cập khu vực đối tác và quản trị theo đúng vai trò trong hệ thống."
      highlights={["Điều hướng theo role", "Cookie httpOnly an toàn", "Bám đúng schema người dùng"]}
      formTitle="Đăng nhập"
      formDescription="Sử dụng email và mật khẩu của bạn. Hệ thống sẽ điều hướng đúng khu vực theo vai trò hiện tại."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Chưa có tài khoản?{" "}
            <Link href="/register/customer" className="font-bold text-orange-600 transition hover:text-orange-500">
              Đăng ký khách hàng
            </Link>
          </span>
          <Link href="/register/provider" className="font-bold text-stone-700 transition hover:text-orange-500">
            Đăng ký đối tác
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField label="Email">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={authInputClassName}
            placeholder="ban@explorex.local"
          />
        </AuthField>

        <AuthField label="Mật khẩu">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={authInputClassName}
            placeholder="Nhập mật khẩu"
          />
        </AuthField>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[54px] w-full items-center justify-center rounded-[18px] bg-orange-500 px-4 text-sm font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        <AuthFormNote>
          <p className="font-bold text-stone-800">Tài khoản demo</p>
          <p>Admin: admin@explorex.local / Admin@123</p>
          <p>Provider: provider@explorex.local / Provider@123</p>
          <p>Customer: customer@explorex.local / Customer@123</p>
        </AuthFormNote>
      </form>
    </AuthShell>
  );
};
