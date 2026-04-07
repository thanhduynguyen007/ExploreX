"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { updateCustomerProfileSchema } from "@/lib/validations/profile";
import type { CustomerProfile } from "@/types/user";

export const CustomerProfileForm = ({ profile }: { profile: CustomerProfile }) => {
  const router = useRouter();
  const [tenNguoiDung, setTenNguoiDung] = useState(profile.tenNguoiDung ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [diaChi, setDiaChi] = useState(profile.diaChi ?? "");
  const [soDienThoai, setSoDienThoai] = useState(profile.soDienThoai ?? "");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    let payload: unknown;
    try {
      payload = await updateCustomerProfileSchema.validate(
        { tenNguoiDung, email, diaChi, soDienThoai },
        { abortEarly: false, stripUnknown: true },
      );
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Thông tin tài khoản không hợp lệ");
      return;
    }

    const response = await fetch("/api/me/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({ message: "Đã xảy ra lỗi máy chủ." }));
    setLoading(false);

    if (!response.ok) {
      toast.error(result.message ?? "Không thể cập nhật hồ sơ");
      return;
    }

    toast.success("Cập nhật thông tin tài khoản thành công");
    router.refresh();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm md:p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="tenNguoiDung" className="mb-2 block text-sm font-semibold text-stone-700">
            Họ và tên
          </label>
          <input
            id="tenNguoiDung"
            value={tenNguoiDung}
            onChange={(event) => setTenNguoiDung(event.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-stone-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
            placeholder="ban@example.com"
          />
        </div>

        <div>
          <label htmlFor="soDienThoai" className="mb-2 block text-sm font-semibold text-stone-700">
            Số điện thoại
          </label>
          <input
            id="soDienThoai"
            value={soDienThoai}
            onChange={(event) => setSoDienThoai(event.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
            placeholder="09xxxxxxxx"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="diaChi" className="mb-2 block text-sm font-semibold text-stone-700">
            Địa chỉ
          </label>
          <textarea
            id="diaChi"
            value={diaChi}
            onChange={(event) => setDiaChi(event.target.value)}
            className="min-h-28 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
            placeholder="Nhập địa chỉ liên hệ"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[linear-gradient(135deg,#fff7ed_0%,#fffbeb_100%)] px-4 py-4">
        <p className="text-sm text-stone-600">
          Trạng thái tài khoản: <span className="font-semibold text-stone-900">{profile.trangThaiTaiKhoan ?? "Chưa cập nhật"}</span>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
};
