"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="maLichTour" className="mb-2 block text-sm font-medium text-stone-700">
            Mã lịch
          </label>
          <input
            id="maLichTour"
            value={maLichTour}
            readOnly
            disabled={mode === "edit"}
            className="w-full rounded-2xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-700 outline-none disabled:cursor-not-allowed"
          />
          {mode === "create" ? <p className="mt-2 text-xs text-stone-500">Mã được hệ thống tự sinh theo thứ tự lịch khởi hành.</p> : null}
        </div>

        <div>
          <label htmlFor="maTour" className="mb-2 block text-sm font-medium text-stone-700">
            Tour
          </label>
          <select
            id="maTour"
            value={maTour}
            onChange={(event) => setMaTour(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          >
            {tours.map((tour) => (
              <option key={tour.maTour} value={tour.maTour}>
                {tour.tenTour}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="ngayBatDau" className="mb-2 block text-sm font-medium text-stone-700">
            Ngày khởi hành
          </label>
          <input
            id="ngayBatDau"
            type="datetime-local"
            value={ngayBatDau}
            onChange={(event) => setNgayBatDau(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          />
        </div>
        <div>
          <label htmlFor="giaTour" className="mb-2 block text-sm font-medium text-stone-700">
            Giá tour
          </label>
          <input
            id="giaTour"
            type="number"
            min={0}
            value={giaTour}
            onChange={(event) => setGiaTour(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
            placeholder="1890000"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label htmlFor="tongChoNgoi" className="mb-2 block text-sm font-medium text-stone-700">
            Tổng số chỗ
          </label>
          <input
            id="tongChoNgoi"
            type="number"
            min={1}
            value={tongChoNgoi}
            onChange={(event) => setTongChoNgoi(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          />
        </div>
        <div>
          <label htmlFor="soChoTrong" className="mb-2 block text-sm font-medium text-stone-700">
            Số chỗ trống
          </label>
          <input
            id="soChoTrong"
            type="number"
            min={0}
            value={soChoTrong}
            onChange={(event) => setSoChoTrong(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          />
        </div>
        <div>
          <label htmlFor="trangThai" className="mb-2 block text-sm font-medium text-stone-700">
            Trạng thái
          </label>
          <select
            id="trangThai"
            value={trangThai}
            onChange={(event) => setTrangThai(event.target.value as "OPEN" | "FULL" | "CLOSED" | "CANCELLED")}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          >
            <option value="OPEN">Mở bán</option>
            <option value="FULL">Đã đầy</option>
            <option value="CLOSED">Đóng bán</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Quay lại
        </Link>
      </div>
    </form>
  );
};
