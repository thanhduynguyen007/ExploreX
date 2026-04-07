"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { TOUR_STATUSES } from "@/lib/constants/statuses";
import { updateTourReviewByAdminSchema } from "@/lib/validations/tour";

type TourReviewFormProps = {
  endpoint: string;
  cancelHref: string;
  initialStatus: string;
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
                key={`tour-review-${option.value}`}
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

const statusOptions: DropdownOption[] = TOUR_STATUSES.map((status) => ({
  value: status,
  label: tourStatusLabels[status] ?? status,
}));

export const TourReviewForm = ({ endpoint, cancelHref, initialStatus }: TourReviewFormProps) => {
  const router = useRouter();
  const [trangThai, setTrangThai] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    let payload: unknown;
    try {
      payload = await updateTourReviewByAdminSchema.validate({ trangThai }, { abortEarly: true, stripUnknown: true });
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Trạng thái tour không hợp lệ");
      return;
    }

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({ message: "Đã xảy ra lỗi máy chủ." }));
    setLoading(false);

    if (!response.ok) {
      toast.error(result.message ?? "Không thể cập nhật trạng thái tour");
      return;
    }

    toast.success("Cập nhật trạng thái tour thành công");
    router.push(cancelHref);
    router.refresh();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[22px] border border-[#d9d9d9] bg-white px-5 py-7 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:px-9 md:py-9"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-[20px] font-bold text-[#202224]">Duyệt trạng thái tour</h3>
          <p className="mt-2 text-[14px] leading-7 text-[#6b7280]">
            Ở màn này admin chỉ được thay đổi trạng thái hiển thị của tour. Nội dung tour do nhà cung cấp tự chịu trách nhiệm cập nhật.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Trạng thái</label>
          <FormDropdown value={trangThai} options={statusOptions} placeholder="-- Chọn trạng thái --" onChange={setTrangThai} />
        </div>

        <div className="flex flex-col items-center gap-5 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-[40px] min-w-[196px] items-center justify-center rounded-[10px] bg-[#5d8cf4] px-10 py-3 text-[18px] font-bold text-white shadow-[0_14px_30px_rgba(93,140,244,0.28)] transition hover:bg-[#4f7fe8] disabled:opacity-60"
          >
            {loading ? "Đang lưu..." : "Cập nhật trạng thái"}
          </button>

          <Link href={cancelHref} className="text-[14px] font-bold text-[#5a8cff] underline underline-offset-2">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </form>
  );
};
