"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AuthField, AuthFormNote, AuthShell, authInputClassName } from "@/components/forms/auth-shell";
import { customerRegisterSchema } from "@/lib/validations/auth";

export const CustomerRegisterForm = () => {
  const router = useRouter();
  const [tenNguoiDung, setTenNguoiDung] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const body = { tenNguoiDung, email, password, confirmPassword, soDienThoai, diaChi };

    try {
      await customerRegisterSchema.validate(body, { abortEarly: true });
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu đăng ký không hợp lệ.");
      return;
    }

    const response = await fetch("/api/auth/register/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.message ?? "Không thể tạo tài khoản.");
      return;
    }

    toast.success("Tạo tài khoản thành công.");
    router.push(payload.redirectTo);
    router.refresh();
  };

  return (
    <AuthShell
      formTitle="Đăng ký khách hàng"
      formDescription="Hoàn tất biểu mẫu bên dưới để bắt đầu."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-orange-600 transition hover:text-orange-500">
              Đăng nhập
            </Link>
          </span>
          <Link href="/register/provider" className="font-semibold text-stone-700 transition hover:text-orange-500">
            Tôi là đối tác
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField label="Họ và tên">
            <input value={tenNguoiDung} onChange={(event) => setTenNguoiDung(event.target.value)} className={authInputClassName} placeholder="Nguyễn Văn A" />
          </AuthField>
          <AuthField label="Email">
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className={authInputClassName} placeholder="ban@example.com" />
          </AuthField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField label="Mật khẩu">
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className={authInputClassName} placeholder="Tối thiểu 6 ký tự" />
          </AuthField>
          <AuthField label="Xác nhận mật khẩu">
            <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" className={authInputClassName} placeholder="Nhập lại mật khẩu" />
          </AuthField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField label="Số điện thoại">
            <input value={soDienThoai} onChange={(event) => setSoDienThoai(event.target.value)} className={authInputClassName} placeholder="0901234567" />
          </AuthField>
          <AuthField label="Địa chỉ">
            <input value={diaChi} onChange={(event) => setDiaChi(event.target.value)} className={authInputClassName} placeholder="Quận 1, TP. Hồ Chí Minh" />
          </AuthField>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[54px] w-full items-center justify-center rounded-[18px] bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>
      </form>
    </AuthShell>
  );
};
