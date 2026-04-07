"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ValidationError } from "yup";

import { adminAccountCreateSchema, adminAccountUpdateSchema } from "@/lib/validations/admin-account";

type AdminAccountFormProps = {
  mode: "create" | "edit";
  endpoint: string;
  redirectTo: string;
  cancelHref: string;
  submitLabel: string;
  initialValues?: {
    maNguoiDung?: string;
    tenNguoiDung?: string;
    email?: string;
    trangThaiTaiKhoan?: string;
    chucVu?: string | null;
    quyenHan?: string | null;
  };
};

type DropdownOption = {
  value: string;
  label: string;
};

function useOutsideClose<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose]);

  return ref;
}

function FormDropdown({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: DropdownOption[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose<HTMLDivElement>(() => setOpen(false));
  const selected = options.find((option) => option.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-[54px] w-full items-center justify-between rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.02)]"
      >
        <span className={`truncate text-[14px] ${selected ? "font-semibold text-[#202224]" : "font-medium text-[#8f8f8f]"}`}>
          {selected?.label ?? placeholder}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`ml-3 size-4 shrink-0 text-[#a0a0a0] transition ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[10px] border border-[#d9d9d9] bg-white py-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={`${placeholder}-${option.value || "empty"}`}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-4 py-3 text-left text-[14px] transition ${
                  active ? "bg-[#edf4ff] font-bold text-[#4880ff]" : "font-semibold text-[#202224] hover:bg-[#f7f9fc]"
                }`}
              >
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const accountStatusOptions: DropdownOption[] = [
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "PENDING", label: "Chờ kích hoạt" },
  { value: "SUSPENDED", label: "Tạm dừng" },
  { value: "DISABLED", label: "Vô hiệu hóa" },
];

const adminPermissionOptions: DropdownOption[] = [{ value: "FULL_ACCESS", label: "Toàn quyền hệ thống" }];

const resolveOptionValue = (value: string | null | undefined, options: DropdownOption[], fallback: string) => {
  if (!value) {
    return fallback;
  }

  return options.some((option) => option.value === value) ? value : fallback;
};

export function AdminAccountForm({
  mode,
  endpoint,
  redirectTo,
  cancelHref,
  submitLabel,
  initialValues,
}: AdminAccountFormProps) {
  const router = useRouter();
  const [maNguoiDung, setMaNguoiDung] = useState(initialValues?.maNguoiDung ?? "");
  const [tenNguoiDung, setTenNguoiDung] = useState(initialValues?.tenNguoiDung ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [trangThaiTaiKhoan, setTrangThaiTaiKhoan] = useState(
    resolveOptionValue(initialValues?.trangThaiTaiKhoan, accountStatusOptions, "ACTIVE"),
  );
  const [password, setPassword] = useState("");
  const [chucVu, setChucVu] = useState(initialValues?.chucVu ?? "");
  const [quyenHan, setQuyenHan] = useState(resolveOptionValue(initialValues?.quyenHan, adminPermissionOptions, "FULL_ACCESS"));
  const [loading, setLoading] = useState(false);
  const isGeneratedUserId = mode === "create";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const rawPayload = {
      ...(mode === "create" ? { maNguoiDung } : {}),
      tenNguoiDung,
      email,
      trangThaiTaiKhoan: resolveOptionValue(trangThaiTaiKhoan, accountStatusOptions, "ACTIVE"),
      ...(mode === "create" || password.trim().length > 0 ? { password } : {}),
      chucVu,
      quyenHan: resolveOptionValue(quyenHan, adminPermissionOptions, "FULL_ACCESS"),
    };

    let payload: unknown;
    try {
      payload = await (mode === "create" ? adminAccountCreateSchema : adminAccountUpdateSchema).validate(rawPayload, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      setLoading(false);

      if (error instanceof ValidationError) {
        toast.error(error.errors[0] ?? "Dữ liệu tài khoản quản trị không hợp lệ");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Dữ liệu tài khoản quản trị không hợp lệ");
      return;
    }

    const response = await fetch(endpoint, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({ message: "Đã xảy ra lỗi máy chủ." }));
    setLoading(false);

    if (!response.ok) {
      toast.error(result.message ?? "Không thể lưu tài khoản quản trị");
      return;
    }

    toast.success(mode === "create" ? "Tạo tài khoản quản trị thành công" : "Cập nhật tài khoản quản trị thành công");
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[22px] border border-[#d9d9d9] bg-white px-5 py-7 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:px-9 md:py-9"
    >
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <div>
          <label htmlFor="maNguoiDung" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Mã người dùng
          </label>
          <input
            id="maNguoiDung"
            value={maNguoiDung}
            onChange={(event) => setMaNguoiDung(event.target.value)}
            readOnly={isGeneratedUserId}
            disabled={mode === "edit"}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] read-only:cursor-default read-only:bg-[#eff1f6] disabled:cursor-not-allowed disabled:bg-[#eff1f6] disabled:text-[#9aa3b2]"
            placeholder="admin-002"
          />
          {isGeneratedUserId ? (
            <p className="mt-2 text-[12px] text-[#6b7280]">Mã được hệ thống tự sinh theo thứ tự tài khoản quản trị.</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="tenNguoiDung" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Tên người dùng
          </label>
          <input
            id="tenNguoiDung"
            value={tenNguoiDung}
            onChange={(event) => setTenNguoiDung(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f]"
            placeholder="Nguyễn Văn A"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f]"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Trạng thái tài khoản</label>
          <FormDropdown
            value={trangThaiTaiKhoan}
            placeholder="Chọn trạng thái tài khoản"
            options={accountStatusOptions}
            onChange={setTrangThaiTaiKhoan}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-x-6 gap-y-5 md:grid-cols-2">
        <div>
          <label htmlFor="password" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            {mode === "create" ? "Mật khẩu" : "Mật khẩu mới"}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f]"
            placeholder={mode === "create" ? "Tối thiểu 6 ký tự" : "Để trống nếu không đổi"}
          />
        </div>

        <div>
          <label htmlFor="chucVu" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Chức vụ
          </label>
          <input
            id="chucVu"
            value={chucVu}
            onChange={(event) => setChucVu(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f]"
            placeholder="System Admin"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Quyền hạn</label>
        <FormDropdown
          value={quyenHan}
          placeholder="Chọn quyền hạn"
          options={adminPermissionOptions}
          onChange={setQuyenHan}
        />
      </div>

      <div className="mt-6 flex flex-col items-center gap-5 md:mt-8">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[40px] min-w-[196px] items-center justify-center rounded-[10px] bg-[#5d8cf4] px-10 py-3 text-[18px] font-bold text-white shadow-[0_14px_30px_rgba(93,140,244,0.28)] transition hover:bg-[#4f7fe8] disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : submitLabel}
        </button>
        <Link href={cancelHref} className="text-[14px] font-bold text-[#5a8cff] underline underline-offset-2">
          Quay lại danh sách
        </Link>
      </div>
    </form>
  );
}
