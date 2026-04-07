"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ValidationError } from "yup";

import { createScheduleSchema, updateScheduleSchema } from "@/lib/validations/schedule";

type ScheduleFormProps = {
  mode: "create" | "edit";
  endpoint: string;
  redirectTo: string;
  cancelHref: string;
  submitLabel: string;
  tours: Array<{ maTour: string; tenTour: string }>;
  initialValues?: {
    maLichTour?: string;
    maTour?: string;
    ngayBatDau?: string;
    soChoTrong?: number;
    tongChoNgoi?: number;
    trangThai?: "OPEN" | "FULL" | "CLOSED" | "CANCELLED";
    giaTour?: number;
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

const scheduleStatusOptions: DropdownOption[] = [
  { value: "OPEN", label: "Mở bán" },
  { value: "FULL", label: "Đã đầy" },
  { value: "CLOSED", label: "Đóng bán" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export const ScheduleForm = ({
  mode,
  endpoint,
  redirectTo,
  cancelHref,
  submitLabel,
  tours,
  initialValues,
}: ScheduleFormProps) => {
  const router = useRouter();
  const [maLichTour] = useState(initialValues?.maLichTour ?? "");
  const [maTour, setMaTour] = useState(initialValues?.maTour ?? tours[0]?.maTour ?? "");
  const [ngayBatDau, setNgayBatDau] = useState(initialValues?.ngayBatDau ?? "");
  const [soChoTrong, setSoChoTrong] = useState(String(initialValues?.soChoTrong ?? 0));
  const [tongChoNgoi, setTongChoNgoi] = useState(String(initialValues?.tongChoNgoi ?? 0));
  const [trangThai, setTrangThai] = useState<"OPEN" | "FULL" | "CLOSED" | "CANCELLED">(initialValues?.trangThai ?? "OPEN");
  const [giaTour, setGiaTour] = useState(String(initialValues?.giaTour ?? 0));
  const [loading, setLoading] = useState(false);

  const tourOptions = useMemo<DropdownOption[]>(
    () =>
      tours.map((tour) => ({
        value: tour.maTour,
        label: `${tour.maTour} - ${tour.tenTour}`,
      })),
    [tours],
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const rawPayload = {
      ...(mode === "create" ? { maLichTour } : {}),
      maTour,
      ngayBatDau,
      soChoTrong,
      tongChoNgoi,
      trangThai,
      giaTour,
    };

    let payload: unknown;
    try {
      payload = await (mode === "create" ? createScheduleSchema : updateScheduleSchema).validate(rawPayload, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      setLoading(false);

      if (error instanceof ValidationError) {
        toast.error(error.errors[0] ?? "Dữ liệu lịch khởi hành không hợp lệ");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Dữ liệu lịch khởi hành không hợp lệ");
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
      toast.error(result.message ?? "Không thể lưu lịch khởi hành");
      return;
    }

    toast.success(mode === "create" ? "Tạo lịch khởi hành thành công" : "Cập nhật lịch khởi hành thành công");
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
          <label htmlFor="maLichTour" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Mã lịch
          </label>
          <input
            id="maLichTour"
            value={maLichTour}
            readOnly
            disabled={mode === "edit"}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#eff1f6] px-4 text-[14px] font-semibold text-[#202224] outline-none disabled:cursor-not-allowed disabled:text-[#9aa3b2]"
          />
          {mode === "create" ? <p className="mt-2 text-[12px] text-[#6b7280]">Mã được hệ thống tự sinh theo thứ tự lịch khởi hành.</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Tour</label>
          <FormDropdown value={maTour} placeholder="-- Chọn tour --" options={tourOptions} onChange={setMaTour} />
        </div>

        <div>
          <label htmlFor="ngayBatDau" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Ngày khởi hành
          </label>
          <input
            id="ngayBatDau"
            type="datetime-local"
            value={ngayBatDau}
            onChange={(event) => setNgayBatDau(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition focus:border-[#a8c0ff]"
          />
        </div>

        <div>
          <label htmlFor="giaTour" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Giá tour
          </label>
          <input
            id="giaTour"
            type="number"
            min={0}
            value={giaTour}
            onChange={(event) => setGiaTour(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition focus:border-[#a8c0ff]"
            placeholder="1890000"
          />
        </div>

        <div>
          <label htmlFor="tongChoNgoi" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Tổng số chỗ
          </label>
          <input
            id="tongChoNgoi"
            type="number"
            min={1}
            value={tongChoNgoi}
            onChange={(event) => setTongChoNgoi(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition focus:border-[#a8c0ff]"
          />
        </div>

        <div>
          <label htmlFor="soChoTrong" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Số chỗ trống
          </label>
          <input
            id="soChoTrong"
            type="number"
            min={0}
            value={soChoTrong}
            onChange={(event) => setSoChoTrong(event.target.value)}
            className="h-[54px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 text-[14px] font-semibold text-[#202224] outline-none transition focus:border-[#a8c0ff]"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Trạng thái</label>
          <FormDropdown value={trangThai} placeholder="-- Chọn trạng thái --" options={scheduleStatusOptions} onChange={(value) => setTrangThai(value as typeof trangThai)} />
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
