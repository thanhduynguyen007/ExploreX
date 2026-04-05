"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
      await loginSchema.validate(
        { email, password },
        {
          abortEarly: true,
        },
      );
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu đăng nhập không hợp lệ");
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
      toast.error(payload.message ?? "Đăng nhập thất bại");
      return;
    }

    toast.success("Đăng nhập thành công");
    router.push(payload.redirectTo);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          placeholder="ban@explorex.local"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-700">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          placeholder="Nhập mật khẩu"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
      >
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </button>
      <div className="rounded-2xl bg-stone-50 p-4 text-xs leading-6 text-stone-600">
        <p className="font-semibold text-stone-800">Tài khoản demo</p>
        <p>Admin: admin@explorex.local / Admin@123</p>
        <p>Provider: provider@explorex.local / Provider@123</p>
        <p>Customer: customer@explorex.local / Customer@123</p>
      </div>
    </form>
  );
};
