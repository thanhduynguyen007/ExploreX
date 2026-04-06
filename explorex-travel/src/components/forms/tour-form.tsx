"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { TOUR_STATUSES } from "@/lib/constants/statuses";
import {
  createTourByAdminSchema,
  createTourByProviderSchema,
  providerEditableTourStatuses,
  updateTourByAdminSchema,
  updateTourByProviderSchema,
} from "@/lib/validations/tour";

type TourGroupOption = {
  maNhomTour: string;
  tenNhomTour: string;
};

type ProviderOption = {
  maNhaCungCap: string;
  tenNhaCungCap: string | null;
};

type TourFormProps = {
  mode: "create" | "edit";
  scope?: "provider" | "admin";
  endpoint: string;
  redirectTo: string;
  cancelHref: string;
  submitLabel: string;
  tourGroups: TourGroupOption[];
  providerOptions?: ProviderOption[];
  initialValues?: {
    maTour?: string;
    maNhaCungCap?: string;
    maNhomTour: string;
    tenTour: string;
    moTa: string;
    thoiLuong: string;
    sLKhachToiDa: number;
    trangThai: string;
    loaiTour: string;
    hinhAnh: string;
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

const tourStatusLabels: Record<string, string> = {
  DRAFT: "Bản nháp",
  PENDING_REVIEW: "Chờ duyệt",
  PUBLISHED: "Đang hiển thị",
  HIDDEN: "Đang ẩn",
  INACTIVE: "Ngừng khai thác",
};

const createSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 254);

export const TourForm = ({
  mode,
  scope = "provider",
  endpoint,
  redirectTo,
  cancelHref,
  submitLabel,
  tourGroups,
  providerOptions = [],
  initialValues,
}: TourFormProps) => {
  const router = useRouter();
  const [maTour, setMaTour] = useState(initialValues?.maTour ?? "");
  const [maNhaCungCap, setMaNhaCungCap] = useState(initialValues?.maNhaCungCap ?? providerOptions[0]?.maNhaCungCap ?? "");
  const [maNhomTour, setMaNhomTour] = useState(initialValues?.maNhomTour ?? tourGroups[0]?.maNhomTour ?? "");
  const [tenTour, setTenTour] = useState(initialValues?.tenTour ?? "");
  const [moTa, setMoTa] = useState(initialValues?.moTa ?? "");
  const [thoiLuong, setThoiLuong] = useState(initialValues?.thoiLuong ?? "");
  const [sLKhachToiDa, setSLKhachToiDa] = useState(String(initialValues?.sLKhachToiDa ?? 20));
  const [trangThai, setTrangThai] = useState(initialValues?.trangThai ?? "DRAFT");
  const [loaiTour, setLoaiTour] = useState(initialValues?.loaiTour ?? "");
  const [hinhAnh, setHinhAnh] = useState(initialValues?.hinhAnh ?? "");
  const [loading, setLoading] = useState(false);
  const isAdmin = scope === "admin";

  const statusOptions = useMemo<DropdownOption[]>(
    () =>
      (isAdmin ? TOUR_STATUSES : providerEditableTourStatuses).map((status) => ({
        value: status,
        label: tourStatusLabels[status] ?? status,
      })),
    [isAdmin],
  );

  const groupOptions = useMemo<DropdownOption[]>(
    () =>
      tourGroups.map((item) => ({
        value: item.maNhomTour,
        label: item.tenNhomTour,
      })),
    [tourGroups],
  );

  const providerDropdownOptions = useMemo<DropdownOption[]>(
    () =>
      providerOptions.map((item) => ({
        value: item.maNhaCungCap,
        label: item.tenNhaCungCap ?? item.maNhaCungCap,
      })),
    [providerOptions],
  );

  const schema = useMemo(() => {
    if (isAdmin) {
      return mode === "create" ? createTourByAdminSchema : updateTourByAdminSchema;
    }

    return mode === "create" ? createTourByProviderSchema : updateTourByProviderSchema;
  }, [isAdmin, mode]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const nextTourId = mode === "create" ? maTour.trim() || createSlug(tenTour) : initialValues?.maTour ?? maTour;

    const rawPayload = {
      ...(mode === "create" ? { maTour: nextTourId } : {}),
      ...(isAdmin ? { maNhaCungCap } : {}),
      maNhomTour,
      tenTour,
      moTa,
      thoiLuong,
      sLKhachToiDa,
      trangThai,
      loaiTour,
      hinhAnh,
    };

    let payload: unknown;
    try {
      payload = await schema.validate(rawPayload, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu tour không hợp lệ");
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
      toast.error(result.message ?? "Không thể lưu tour");
      return;
    }

    toast.success(mode === "create" ? "Tạo tour thành công" : "Cập nhật tour thành công");
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
          <label htmlFor="tenTour" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Tên tour
          </label>
          <input
            id="tenTour"
            value={tenTour}
            onChange={(event) => setTenTour(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
            placeholder="Khám phá Cần Thơ 2 ngày 1 đêm"
          />
        </div>

        <div>
          <label htmlFor="maTour" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Mã tour
          </label>
          <input
            id="maTour"
            value={maTour}
            onChange={(event) => setMaTour(event.target.value)}
            disabled={mode === "edit"}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff] disabled:cursor-not-allowed disabled:bg-[#eff1f6] disabled:text-[#9aa3b2]"
            placeholder="tour-can-tho-2n1d"
          />
        </div>

        {isAdmin ? (
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Nhà cung cấp</label>
            <FormDropdown
              value={maNhaCungCap}
              placeholder="-- Chọn nhà cung cấp --"
              options={providerDropdownOptions}
              onChange={setMaNhaCungCap}
            />
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Danh mục</label>
          <FormDropdown value={maNhomTour} placeholder="-- Chọn danh mục --" options={groupOptions} onChange={setMaNhomTour} />
        </div>

        <div>
          <label htmlFor="loaiTour" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Loại tour
          </label>
          <input
            id="loaiTour"
            value={loaiTour}
            onChange={(event) => setLoaiTour(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
            placeholder="Du lịch nội địa"
          />
        </div>

        <div>
          <label htmlFor="thoiLuong" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Thời lượng
          </label>
          <input
            id="thoiLuong"
            value={thoiLuong}
            onChange={(event) => setThoiLuong(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
            placeholder="2 ngày 1 đêm"
          />
        </div>

        <div>
          <label htmlFor="sLKhachToiDa" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Số khách tối đa
          </label>
          <input
            id="sLKhachToiDa"
            type="number"
            min="1"
            value={sLKhachToiDa}
            onChange={(event) => setSLKhachToiDa(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
            placeholder="20"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Trạng thái</label>
          <FormDropdown value={trangThai} placeholder="-- Chọn trạng thái --" options={statusOptions} onChange={setTrangThai} />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="hinhAnh" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Ảnh đại diện
          </label>
          <div className="grid gap-4 lg:grid-cols-[1.35fr_240px]">
            <input
              id="hinhAnh"
              value={hinhAnh}
              onChange={(event) => setHinhAnh(event.target.value)}
              className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
              placeholder="https://example.com/can-tho.jpg"
            />

            <div className="overflow-hidden rounded-[10px] border border-[#d9d9d9] bg-[#f7f8fc]">
              {hinhAnh.trim() ? (
                <img src={hinhAnh} alt="Xem trước ảnh tour" className="h-[120px] w-full object-cover" />
              ) : (
                <div className="flex h-[120px] items-center justify-center text-center text-[13px] font-semibold text-[#8f8f8f]">
                  Chưa có ảnh xem trước
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="moTa" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Mô tả
          </label>
          <textarea
            id="moTa"
            value={moTa}
            onChange={(event) => setMoTa(event.target.value)}
            className="min-h-[144px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 py-3 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
            placeholder="Mô tả ngắn gọn về hành trình, trải nghiệm nổi bật và điểm đến."
          />
        </div>
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
};
