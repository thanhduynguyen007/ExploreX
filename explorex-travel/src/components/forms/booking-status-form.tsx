"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Cập nhật trạng thái đơn</h2>
      <div>
        <label htmlFor="trangThaiDatTour" className="mb-2 block text-sm font-medium text-stone-700">
          Trạng thái đặt tour
        </label>
        <select
          id="trangThaiDatTour"
          value={trangThaiDatTour}
          onChange={(event) => setTrangThaiDatTour(event.target.value as typeof trangThaiDatTour)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
        >
          <option value="PENDING">Chờ xử lý</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="COMPLETED">Đã hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>
      <div>
        <label htmlFor="trangThaiThanhToan" className="mb-2 block text-sm font-medium text-stone-700">
          Trạng thái thanh toán
        </label>
        <select
          id="trangThaiThanhToan"
          value={trangThaiThanhToan}
          onChange={(event) => setTrangThaiThanhToan(event.target.value as typeof trangThaiThanhToan)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
        >
          <option value="UNPAID">Chưa thanh toán</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="REFUNDED">Đã hoàn tiền</option>
        </select>
      </div>
      <div>
        <label htmlFor="ghiChu" className="mb-2 block text-sm font-medium text-stone-700">
          Ghi chú
        </label>
        <textarea
          id="ghiChu"
          value={ghiChu}
          onChange={(event) => setGhiChu(event.target.value)}
          className="min-h-28 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          placeholder="Ghi chú xử lý booking"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
      >
        {loading ? "Đang lưu..." : "Lưu cập nhật"}
      </button>
    </form>
  );
};
