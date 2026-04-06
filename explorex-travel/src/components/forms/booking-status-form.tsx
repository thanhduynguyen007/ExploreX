"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { updateBookingStatusSchema } from "@/lib/validations/booking";

type BookingStatusFormProps = {
  endpoint: string;
  initialValues: {
    trangThaiDatTour: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    trangThaiThanhToan: "UNPAID" | "PAID" | "REFUNDED";
    ghiChu: string;
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

const bookingStatusOptions: DropdownOption[] = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const paymentStatusOptions: DropdownOption[] = [
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
];

export const BookingStatusForm = ({ endpoint, initialValues }: BookingStatusFormProps) => {
  const router = useRouter();
  const [trangThaiDatTour, setTrangThaiDatTour] = useState(initialValues.trangThaiDatTour);
  const [trangThaiThanhToan, setTrangThaiThanhToan] = useState(initialValues.trangThaiThanhToan);
  const [ghiChu, setGhiChu] = useState(initialValues.ghiChu);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    let payload: unknown;
    try {
      payload = await updateBookingStatusSchema.validate(
        { trangThaiDatTour, trangThaiThanhToan, ghiChu },
        { abortEarly: false, stripUnknown: true },
      );
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu cập nhật booking không hợp lệ");
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
      toast.error(result.message ?? "Không thể cập nhật đơn đặt tour");
      return;
    }

    toast.success("Cập nhật đơn đặt tour thành công");
    router.refresh();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[22px] border border-[#d9d9d9] bg-white px-5 py-7 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:px-6 md:py-6"
    >
      <div className="space-y-5">
        <div>
          <h3 className="text-[20px] font-bold text-[#202224]">Cập nhật trạng thái đơn</h3>
          <p className="mt-2 text-[14px] text-[#6b7280]">Các ràng buộc chuyển trạng thái và cập nhật chỗ ngồi vẫn được kiểm tra ở backend.</p>
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Trạng thái đặt tour</label>
          <FormDropdown
            value={trangThaiDatTour}
            options={bookingStatusOptions}
            placeholder="-- Chọn trạng thái đơn --"
            onChange={(value) => setTrangThaiDatTour(value as typeof trangThaiDatTour)}
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-semibold text-[#606060]">Trạng thái thanh toán</label>
          <FormDropdown
            value={trangThaiThanhToan}
            options={paymentStatusOptions}
            placeholder="-- Chọn trạng thái thanh toán --"
            onChange={(value) => setTrangThaiThanhToan(value as typeof trangThaiThanhToan)}
          />
        </div>

        <div>
          <label htmlFor="ghiChu" className="mb-2 block text-[14px] font-semibold text-[#606060]">
            Ghi chú
          </label>
          <textarea
            id="ghiChu"
            value={ghiChu}
            onChange={(event) => setGhiChu(event.target.value)}
            className="min-h-[140px] w-full rounded-[6px] border border-[#d9d9d9] bg-[#f7f8fc] px-4 py-3 text-[14px] font-semibold text-[#202224] outline-none transition placeholder:font-medium placeholder:text-[#8f8f8f] focus:border-[#a8c0ff]"
            placeholder="Ghi chú xử lý booking"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[42px] min-w-[196px] items-center justify-center rounded-[10px] bg-[#5d8cf4] px-10 py-3 text-[16px] font-bold text-white shadow-[0_14px_30px_rgba(93,140,244,0.28)] transition hover:bg-[#4f7fe8] disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : "Lưu cập nhật"}
        </button>
      </div>
    </form>
  );
};
