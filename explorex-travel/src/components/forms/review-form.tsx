"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createReviewSchema } from "@/lib/validations/review";

type ReviewFormProps = {
  tourId: string;
  initialReviewId: string;
  eligibleBookings: Array<{ maDatTour: string }>;
};

export const ReviewForm = ({ tourId, initialReviewId, eligibleBookings }: ReviewFormProps) => {
  const router = useRouter();
  const [maDanhGia] = useState(initialReviewId);
  const [maDatTour, setMaDatTour] = useState(eligibleBookings[0]?.maDatTour ?? "");
  const [soSao, setSoSao] = useState("5");
  const [binhLuan, setBinhLuan] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    let payload: unknown;
    try {
      payload = await createReviewSchema.validate(
        { maDanhGia, maDatTour, soSao, binhLuan },
        { abortEarly: false, stripUnknown: true },
      );
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu đánh giá không hợp lệ");
      return;
    }

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({ message: "Đã xảy ra lỗi máy chủ." }));
    setLoading(false);

    if (!response.ok) {
      toast.error(result.message ?? "Không thể gửi đánh giá");
      return;
    }

    toast.success("Gửi đánh giá thành công");
    router.push("/account/bookings");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Tạo đánh giá cho tour {tourId}</h2>
      <div>
        <label htmlFor="maDanhGia" className="mb-2 block text-sm font-medium text-stone-700">
          Mã đánh giá
        </label>
        <input
          id="maDanhGia"
          value={maDanhGia}
          readOnly
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
        />
        <p className="mt-2 text-xs text-stone-500">Mã đánh giá được hệ thống tự sinh theo quy tắc quản trị.</p>
      </div>
      <div>
        <label htmlFor="maDatTour" className="mb-2 block text-sm font-medium text-stone-700">
          Đơn hoàn thành
        </label>
        <select
          id="maDatTour"
          value={maDatTour}
          onChange={(event) => setMaDatTour(event.target.value)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
        >
          {eligibleBookings.map((booking) => (
            <option key={booking.maDatTour} value={booking.maDatTour}>
              {booking.maDatTour}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="soSao" className="mb-2 block text-sm font-medium text-stone-700">
          Số sao
        </label>
        <select
          id="soSao"
          value={soSao}
          onChange={(event) => setSoSao(event.target.value)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
        >
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>
      <div>
        <label htmlFor="binhLuan" className="mb-2 block text-sm font-medium text-stone-700">
          Bình luận
        </label>
        <textarea
          id="binhLuan"
          value={binhLuan}
          onChange={(event) => setBinhLuan(event.target.value)}
          className="min-h-28 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          placeholder="Chia sẻ trải nghiệm thực tế của bạn."
        />
      </div>
      <button
        type="submit"
        disabled={loading || eligibleBookings.length === 0}
        className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </form>
  );
};
