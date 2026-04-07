"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { createBookingSchema } from "@/lib/validations/booking";
import type { AuthUser } from "@/types/auth";
import type { PublicTourDetail } from "@/types/tour";

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) {
    return "Liên hệ";
  }

  return `${Number(value).toLocaleString("vi-VN")} đ`;
};

const formatDate = (value: string | Date | null) => {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("vi-VN");
};

const createBookingId = () => `dt-${Date.now()}`;

export const PublicBookingForm = ({
  tour,
  user,
}: {
  tour: PublicTourDetail;
  user: AuthUser | null;
}) => {
  const router = useRouter();
  const openSchedules = tour.schedules.filter((schedule) => schedule.trangThai === "OPEN");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(openSchedules[0]?.maLichTour ?? tour.schedules[0]?.maLichTour ?? "");
  const [guestCount, setGuestCount] = useState(1);
  const [ghiChu, setGhiChu] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedSchedule = useMemo(
    () => tour.schedules.find((schedule) => schedule.maLichTour === selectedScheduleId) ?? tour.schedules[0] ?? null,
    [selectedScheduleId, tour.schedules],
  );

  const maxGuests = Math.max(1, selectedSchedule?.soChoTrong ?? 1);
  const normalizedGuestCount = Math.min(Math.max(1, guestCount), maxGuests);
  const estimatedTotal = (selectedSchedule?.giaTour ?? 0) * normalizedGuestCount;
  const canBook = selectedSchedule?.trangThai === "OPEN" && (selectedSchedule?.soChoTrong ?? 0) > 0;
  const isCustomer = user?.role === "CUSTOMER";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isCustomer) {
      toast.error("Bạn cần đăng nhập bằng tài khoản khách hàng để đặt tour.");
      return;
    }

    setLoading(true);

    let payload: unknown;
    try {
      payload = await createBookingSchema.validate(
        {
          maDatTour: createBookingId(),
          maLichTour: selectedScheduleId,
          soNguoi: normalizedGuestCount,
          ghiChu,
        },
        { abortEarly: false, stripUnknown: true },
      );
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Thông tin đặt tour không hợp lệ");
      return;
    }

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({ message: "Đã xảy ra lỗi máy chủ." }));
    setLoading(false);

    if (!response.ok) {
      toast.error(result.message ?? "Không thể tạo đơn đặt tour");
      return;
    }

    toast.success("Đặt tour thành công. Đơn của bạn đang chờ xác nhận.");
    router.push(`/account/bookings/${result.item.maDatTour}`);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="schedule" className="mb-2 block text-sm font-bold text-stone-900">
          Chọn lịch khởi hành
        </label>
        <select
          id="schedule"
          value={selectedScheduleId}
          onChange={(event) => setSelectedScheduleId(event.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 outline-none transition focus:border-orange-400"
        >
          {tour.schedules.map((schedule) => (
            <option key={schedule.maLichTour} value={schedule.maLichTour}>
              {schedule.maLichTour} | {formatDate(schedule.ngayBatDau)} | {formatCurrency(schedule.giaTour)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-stone-900">Số lượng hành khách</p>
        <div className="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-3">
          <div>
            <div className="text-sm font-semibold text-stone-900">Số khách</div>
            <div className="text-xs text-orange-500">
              Còn {selectedSchedule?.soChoTrong ?? 0} chỗ | {formatCurrency(selectedSchedule?.giaTour ?? tour.minGiaTour)}
            </div>
          </div>
          <div className="flex items-center overflow-hidden rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => setGuestCount((current) => Math.max(1, current - 1))}
              className="flex h-9 w-9 items-center justify-center text-lg text-stone-500"
            >
              −
            </button>
            <span className="flex h-9 min-w-10 items-center justify-center border-x border-stone-200 px-3 text-sm font-bold text-stone-900">
              {normalizedGuestCount}
            </span>
            <button
              type="button"
              onClick={() => setGuestCount((current) => Math.min(maxGuests, current + 1))}
              className="flex h-9 w-9 items-center justify-center text-lg text-stone-500"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="ghiChu" className="mb-2 block text-sm font-bold text-stone-900">
          Ghi chú
        </label>
        <textarea
          id="ghiChu"
          value={ghiChu}
          onChange={(event) => setGhiChu(event.target.value)}
          className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 outline-none transition focus:border-orange-400"
          placeholder="Nhập yêu cầu thêm nếu cần."
        />
      </div>

      <div className="rounded-2xl bg-stone-50 px-4 py-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-stone-500">Ngày khởi hành</span>
          <span className="font-semibold text-stone-900">{formatDate(selectedSchedule?.ngayBatDau ?? tour.nextNgayBatDau)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-stone-500">Trạng thái</span>
          <span className="font-semibold text-stone-900">{selectedSchedule?.trangThai ?? "Chưa cập nhật"}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-stone-900">Tổng tạm tính</span>
          <span className="text-2xl font-black text-orange-500">{formatCurrency(estimatedTotal)}</span>
        </div>
      </div>

      {!user ? (
        <div className="space-y-3">
          <Link href="/login" className="flex w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white">
            Đăng nhập để đặt tour
          </Link>
          <Link
            href="/account/bookings"
            className="flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-700"
          >
            Xem đơn đặt tour
          </Link>
        </div>
      ) : !isCustomer ? (
        <div className="space-y-3">
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            Chỉ tài khoản khách hàng mới có thể tạo đơn đặt tour từ khu vực công khai.
          </p>
          <Link
            href="/account/bookings"
            className="flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-700"
          >
            Xem đơn đặt tour
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading || !canBook}
            className="flex w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang tạo đơn..." : "Xác nhận đặt tour"}
          </button>
          <Link
            href="/account/bookings"
            className="flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-700"
          >
            Xem đơn đặt tour
          </Link>
        </div>
      )}
    </form>
  );
};
