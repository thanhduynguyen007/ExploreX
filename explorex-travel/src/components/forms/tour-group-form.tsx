"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { tourGroupSchema, updateTourGroupSchema } from "@/lib/validations/tour-group";
import type { TourGroup } from "@/types/tour-group";

type TourGroupFormProps = {
  mode?: "create" | "edit";
  initialValue?: TourGroup;
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

const statusOptions: DropdownOption[] = [
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Tạm ẩn" },
];

const createSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50);

export const TourGroupForm = ({ mode = "create", initialValue }: TourGroupFormProps) => {
  const router = useRouter();
  const [maNhomTour, setMaNhomTour] = useState(initialValue?.maNhomTour ?? "");
  const [tenNhomTour, setTenNhomTour] = useState(initialValue?.tenNhomTour ?? "");
  const [moTaTour, setMoTaTour] = useState(initialValue?.moTaTour ?? "");
  const [trangThai, setTrangThai] = useState<TourGroup["trangThai"]>(initialValue?.trangThai ?? "ACTIVE");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isEdit = mode === "edit";

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const nextGroupId = isEdit ? maNhomTour : createSlug(tenNhomTour);

    if (!nextGroupId) {
      setLoading(false);
      toast.error("Tên danh mục chưa đủ để tạo mã danh mục hợp lệ");
      return;
    }

    try {
      if (isEdit) {
        await updateTourGroupSchema.validate({ tenNhomTour, moTaTour, trangThai }, { abortEarly: true });
      } else {
        await tourGroupSchema.validate({ maNhomTour: nextGroupId, tenNhomTour, moTaTour, trangThai }, { abortEarly: true });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu nhóm tour không hợp lệ");
      return;
    }

    const response = await fetch(isEdit ? `/api/admin/tour-groups/${maNhomTour}` : "/api/admin/tour-groups", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEdit ? { tenNhomTour, moTaTour, trangThai } : { maNhomTour: nextGroupId, tenNhomTour, moTaTour, trangThai }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.message ?? "Không thể tạo nhóm tour");
      return;
    }

    toast.success(isEdit ? "Cập nhật danh mục thành công" : "Tạo nhóm tour thành công");

    if (isEdit) {
      router.push("/admin/tour-groups");
      router.refresh();
      return;
    }

    setMaNhomTour("");
    setTenNhomTour("");
    setMoTaTour("");
    setTrangThai("ACTIVE");
    setDisplayOrder("1");
    setImagePreview(null);
    router.push("/admin/tour-groups");
    router.refresh();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[22px] border border-[#d9d9d9] bg-white px-5 py-7 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:px-9 md:py-9"
    >
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <div>
          <label htmlFor="tenNhomTour" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Tên danh mục
          </label>
          <input
            id="tenNhomTour"
            value={tenNhomTour}
            onChange={(event) => setTenNhomTour(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
            placeholder="Danh mục 2"
          />
        </div>

        <div>
          <label htmlFor="displayOrder" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Vị trí
          </label>
          <input
            id="displayOrder"
            type="number"
            min="1"
            step="1"
            value={displayOrder}
            onChange={(event) => setDisplayOrder(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
            placeholder="1"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Trạng thái</label>
          <FormDropdown value={trangThai} placeholder="Hoạt động" options={statusOptions} onChange={(value) => setTrangThai(value as TourGroup["trangThai"])} />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Ảnh đại diện</label>
          <div className="relative inline-flex">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-[106px] w-[108px] items-center justify-center overflow-hidden rounded-[4px] border border-[#d9d9d9] bg-[#f7f8fc] text-[#202224] transition hover:border-[#b9cfff]"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Ảnh đại diện danh mục" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[52px] font-light leading-none">+</span>
              )}
            </button>
            {imagePreview ? (
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-[#f8485e] text-[12px] font-bold text-white"
                aria-label="Xóa ảnh đại diện"
              >
                x
              </button>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                const nextUrl = URL.createObjectURL(file);
                setImagePreview((current) => {
                  if (current) {
                    URL.revokeObjectURL(current);
                  }

                  return nextUrl;
                });
                event.target.value = "";
              }}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="moTaTour" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Mô tả
          </label>
          <textarea
            id="moTaTour"
            value={moTaTour}
            onChange={(event) => setMoTaTour(event.target.value)}
            className="min-h-[114px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 py-3 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
            placeholder="Mô tả danh mục 2..."
          />
        </div>
      </div>

      <input type="hidden" value={maNhomTour} readOnly />

      <div className="mt-6 flex flex-col items-center gap-5 md:mt-8">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[40px] min-w-[196px] items-center justify-center rounded-[10px] bg-[#5d8cf4] px-10 py-3 text-[18px] font-bold text-white shadow-[0_14px_30px_rgba(93,140,244,0.28)] transition hover:bg-[#4f7fe8] disabled:opacity-60"
        >
          {loading ? (isEdit ? "Đang lưu..." : "Đang tạo...") : isEdit ? "Lưu thay đổi" : "Tạo mới"}
        </button>

        <Link href="/admin/tour-groups" className="text-[14px] font-bold text-[#5a8cff] underline underline-offset-2">
          Quay lại danh sách
        </Link>
      </div>
    </form>
  );
};
