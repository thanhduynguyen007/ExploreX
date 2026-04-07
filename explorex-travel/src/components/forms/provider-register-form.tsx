"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AuthField, AuthFormNote, AuthShell, authInputClassName, authTextareaClassName } from "@/components/forms/auth-shell";
import { providerRegisterSchema } from "@/lib/validations/auth";

export const ProviderRegisterForm = () => {
  const router = useRouter();
  const [tenNguoiDung, setTenNguoiDung] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tenNhaCungCap, setTenNhaCungCap] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [loaiDichVu, setLoaiDichVu] = useState("");
  const [thongTinNhaCungCap, setThongTinNhaCungCap] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const body = {
      tenNguoiDung,
      email,
      password,
      confirmPassword,
      tenNhaCungCap,
      soDienThoai,
      diaChi,
      loaiDichVu,
      thongTinNhaCungCap,
    };

    try {
      await providerRegisterSchema.validate(body, { abortEarly: true });
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu đăng ký không hợp lệ.");
      return;
    }

    const response = await fetch("/api/auth/register/provider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.message ?? "Không thể gửi hồ sơ đối tác.");
      return;
    }

    toast.success(payload.message ?? "Hồ sơ đối tác đã được gửi.");
    router.push(payload.redirectTo ?? "/login");
    router.refresh();
  };

  return (
    <AuthShell
      eyebrow="Partner"
      title="Đăng ký hồ sơ đối tác theo đúng schema hiện tại"
      description="Form này tạo tài khoản người dùng với role PROVIDER và hồ sơ nhà cung cấp trong bảng nhacungcaptour. Trạng thái hợp tác sẽ được khởi tạo là chờ duyệt."
      highlights={["Tạo role PROVIDER", "Sinh mã NCC tự động", "Khởi tạo trạng thái PENDING"]}
      formTitle="Đăng ký đối tác"
      formDescription="Điền thông tin doanh nghiệp hoặc đơn vị cung cấp tour để gửi hồ sơ lên hệ thống."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-bold text-orange-600 transition hover:text-orange-500">
              Đăng nhập ngay
            </Link>
          </span>
          <Link href="/register/customer" className="font-bold text-stone-700 transition hover:text-orange-500">
            Đăng ký khách hàng
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField label="Người đại diện">
            <input value={tenNguoiDung} onChange={(event) => setTenNguoiDung(event.target.value)} className={authInputClassName} placeholder="Nguyễn Văn B" />
          </AuthField>
          <AuthField label="Tên đối tác / nhà cung cấp">
            <input value={tenNhaCungCap} onChange={(event) => setTenNhaCungCap(event.target.value)} className={authInputClassName} placeholder="Mekong Discovery" />
          </AuthField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField label="Email đăng nhập">
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className={authInputClassName} placeholder="partner@example.com" />
          </AuthField>
          <AuthField label="Số điện thoại">
            <input value={soDienThoai} onChange={(event) => setSoDienThoai(event.target.value)} className={authInputClassName} placeholder="0901234567" />
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
          <AuthField label="Địa chỉ">
            <input value={diaChi} onChange={(event) => setDiaChi(event.target.value)} className={authInputClassName} placeholder="Cần Thơ" />
          </AuthField>
          <AuthField label="Loại dịch vụ">
            <input value={loaiDichVu} onChange={(event) => setLoaiDichVu(event.target.value)} className={authInputClassName} placeholder="Tour nội địa" />
          </AuthField>
        </div>

        <AuthField label="Thông tin giới thiệu">
          <textarea
            value={thongTinNhaCungCap}
            onChange={(event) => setThongTinNhaCungCap(event.target.value)}
            rows={4}
            className={authTextareaClassName}
            placeholder="Mô tả ngắn về dịch vụ, khu vực hoạt động hoặc thế mạnh của đối tác"
          />
        </AuthField>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[54px] w-full items-center justify-center rounded-[18px] bg-orange-500 px-4 text-sm font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Đang gửi hồ sơ..." : "Gửi hồ sơ đối tác"}
        </button>

        <AuthFormNote>
          Hồ sơ sẽ tạo tài khoản người dùng và nhà cung cấp theo schema hiện tại. Trạng thái hợp tác được khởi tạo là <span className="font-bold text-stone-800">PENDING</span> để admin theo dõi.
        </AuthFormNote>
      </form>
    </AuthShell>
  );
};
