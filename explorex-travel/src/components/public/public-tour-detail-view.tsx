"use client";

import Link from "next/link";
import { useState } from "react";

import { PublicBookingForm } from "@/components/forms/public-booking-form";
import type { AuthUser } from "@/types/auth";
import type { Review } from "@/types/review";
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

const getGalleryImages = (tour: PublicTourDetail) => {
  const primaryImage =
    tour.hinhAnh && tour.hinhAnh.trim().length > 0
      ? tour.hinhAnh
      : "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&h=560&fit=crop&auto=format";

  return [primaryImage];
};

const getReviewLabel = (tour: PublicTourDetail) => {
  if (tour.avgRating === null || tour.totalReviews === 0) {
    return "Chưa có đánh giá";
  }

  return `${Number(tour.avgRating).toFixed(1)}/5 (${tour.totalReviews} đánh giá)`;
};

const getScheduleStatusLabel = (status: string | null) => {
  if (status === "OPEN") {
    return "Đang mở bán";
  }

  if (status === "FULL") {
    return "Đã hết chỗ";
  }

  if (status === "CLOSED") {
    return "Đã đóng";
  }

  return status ?? "Chưa cập nhật";
};

export function PublicTourDetailView({
  reviews,
  tour,
  user,
}: {
  reviews: Review[];
  tour: PublicTourDetail;
  user: AuthUser | null;
}) {
  const galleryImages = getGalleryImages(tour);
  const [activeImage, setActiveImage] = useState(0);
  const roundedStars = Math.max(0, Math.min(5, Math.round(tour.avgRating ?? 0)));

  return (
    <div className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden bg-stone-100">
      <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 overflow-hidden rounded-l-xl shadow-lg lg:flex lg:flex-col">
        <span className="flex h-10 w-10 items-center justify-center bg-blue-600 text-xs font-bold text-white">f</span>
        <span className="flex h-10 w-10 items-center justify-center bg-pink-500 text-xs font-bold text-white">◎</span>
        <span className="flex h-10 w-10 items-center justify-center bg-green-500 text-xs font-bold text-white">✆</span>
        <span className="flex h-10 w-10 items-center justify-center bg-red-500 text-xs font-bold text-white">▶</span>
      </div>

      <section className="relative flex min-h-[210px] items-end overflow-hidden bg-[linear-gradient(to_right,rgba(70,30,120,0.8),rgba(180,70,20,0.5)),url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&h=420&fit=crop&auto=format')] bg-cover bg-center px-6 py-8 md:min-h-[240px] md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="max-w-4xl text-2xl font-black leading-tight text-white md:text-3xl">{tour.tenTour}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/90">
            <Link href="/" className="transition hover:text-white">
              Trang Chủ
            </Link>
            <span>»</span>
            <Link href="/tours" className="transition hover:text-white">
              Tour Trong Nước
            </Link>
            <span>»</span>
            <span>{tour.tenNhomTour ?? "Chi tiết tour"}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img src={galleryImages[activeImage] ?? galleryImages[0]} alt={tour.tenTour} className="h-[260px] w-full object-cover md:h-[420px]" />
          </div>

          {galleryImages.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2 md:gap-3">
              {galleryImages.slice(0, 4).map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-xl border-2 ${index === activeImage ? "border-orange-500" : "border-transparent"}`}
                >
                  <img src={image} alt={`${tour.tenTour} ${index + 1}`} className="h-18 w-full object-cover md:h-20" />
                </button>
              ))}
            </div>
          ) : null}

          <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-extrabold text-orange-500">Thông Tin Tour</h2>
            <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-2xl bg-stone-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Mã tour</p>
                <p className="mt-2 text-base font-bold text-stone-900">{tour.maTour}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Nhà cung cấp</p>
                <p className="mt-2 text-base font-bold text-stone-900">{tour.tenNhaCungCap ?? "Chưa cập nhật"}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Thời lượng</p>
                <p className="mt-2 text-base font-bold text-stone-900">{tour.thoiLuong ?? "Chưa cập nhật"}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Đánh giá</p>
                <p className="mt-2 text-base font-bold text-stone-900">{getReviewLabel(tour)}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-stone-50 p-5">
              <p className="text-sm leading-8 text-stone-700">
                {tour.moTa ?? "Thông tin mô tả chi tiết của tour đang được nhà cung cấp cập nhật trên hệ thống."}
              </p>
            </div>
          </section>

          <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-orange-500">Lịch Khởi Hành</h2>
              <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">{tour.schedules.length} lịch</span>
            </div>

            <div className="mt-5 space-y-5">
              {tour.schedules.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 px-4 py-5 text-sm text-stone-600">Hiện chưa có lịch khởi hành nào cho tour này.</div>
              ) : (
                tour.schedules.map((schedule, index) => (
                  <article key={schedule.maLichTour} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                    <div className="flex flex-col gap-2 bg-orange-500 px-4 py-3 text-white md:flex-row md:items-center md:justify-between">
                      <div className="text-sm font-extrabold md:text-base">
                        Lịch {index + 1} | {schedule.maLichTour}
                      </div>
                      <div className="text-sm font-semibold">{formatDate(schedule.ngayBatDau)}</div>
                    </div>
                    <div className="grid gap-4 p-4 text-sm md:grid-cols-2 md:p-5">
                      <div className="rounded-2xl bg-stone-50 px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Giá tour</p>
                        <p className="mt-2 text-base font-bold text-stone-900">{formatCurrency(schedule.giaTour)}</p>
                      </div>
                      <div className="rounded-2xl bg-stone-50 px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Trạng thái</p>
                        <p className="mt-2 text-base font-bold text-stone-900">{getScheduleStatusLabel(schedule.trangThai)}</p>
                      </div>
                      <div className="rounded-2xl bg-stone-50 px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Số chỗ còn</p>
                        <p className="mt-2 text-base font-bold text-stone-900">{schedule.soChoTrong ?? 0}</p>
                      </div>
                      <div className="rounded-2xl bg-stone-50 px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Tổng số chỗ</p>
                        <p className="mt-2 text-base font-bold text-stone-900">{schedule.tongChoNgoi ?? 0}</p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-extrabold text-orange-500">Đánh Giá Khách Hàng</h2>
            <div className="mt-5 space-y-4">
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 px-4 py-5 text-sm text-stone-600">Tour này chưa có đánh giá nào.</div>
              ) : (
                reviews.map((review) => (
                  <article key={review.maDanhGia} className="rounded-2xl border border-stone-200 px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-stone-900">{review.tenNguoiDung ?? review.maNguoiDung}</p>
                      <p className="text-sm text-stone-500">
                        {review.soSao ?? 0}/5 | {formatDate(review.ngayDanhGia)}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-stone-700">{review.binhLuan ?? "Không có bình luận."}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="w-full rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.09)] lg:sticky lg:top-24 lg:w-[340px] lg:flex-none">
          <div className="flex gap-3 border-b border-stone-200 pb-4">
            <img src={galleryImages[0]} alt={tour.tenTour} className="h-20 w-24 rounded-xl object-cover" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold leading-6 text-stone-900">{tour.tenTour}</h3>
              <p className="mt-2 text-sm text-amber-500">{roundedStars > 0 ? "★".repeat(roundedStars) : "Chưa có"}</p>
              <p className="mt-1 text-xs font-semibold text-orange-500">{getReviewLabel(tour)}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-stone-500">Mã tour:</span>
              <span className="font-semibold text-stone-900">{tour.maTour}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-stone-500">Thời gian:</span>
              <span className="font-semibold text-stone-900">{tour.thoiLuong ?? "Chưa cập nhật"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-stone-500">Danh mục:</span>
              <span className="font-semibold text-stone-900">{tour.tenNhomTour ?? "Chưa cập nhật"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-stone-500">Ngày gần nhất:</span>
              <span className="font-semibold text-stone-900">{formatDate(tour.nextNgayBatDau)}</span>
            </div>
          </div>

          <hr className="my-4 border-stone-200" />

          <PublicBookingForm tour={tour} user={user} />
        </aside>
      </div>
    </div>
  );
}
