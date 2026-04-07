import Link from "next/link";

import { isDatabaseUnavailableError } from "@/lib/db/mysql";
import { listTourGroups } from "@/services/tour-group.service";
import { listPublicTours } from "@/services/tour.service";
import type { TourGroup } from "@/types/tour-group";
import type { PublicTourSummary } from "@/types/tour";

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) {
    return "Liên hệ";
  }

  return `${Number(value).toLocaleString("vi-VN")} đ`;
};

const formatDate = (value: string | Date | null) => {
  if (!value) {
    return "Chưa mở bán";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("vi-VN");
};

const formatRating = (value: number | null, totalReviews: number) => {
  if (value === null || totalReviews === 0) {
    return "Chưa có";
  }

  return `${Number(value).toFixed(1)} (${totalReviews})`;
};

const getTourImage = (tour: PublicTourSummary, index: number) => {
  if (tour.hinhAnh && tour.hinhAnh.trim().length > 0) {
    return tour.hinhAnh;
  }

  const fallbacks = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=900&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&h=600&fit=crop&auto=format",
  ];

  return fallbacks[index % fallbacks.length];
};

export default async function HomePage() {
  let tours: PublicTourSummary[] = [];
  let groups: TourGroup[] = [];
  let dbUnavailable = false;

  try {
    [tours, groups] = await Promise.all([listPublicTours(), listTourGroups()]);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    dbUnavailable = true;
  }

  const promoTours = tours.slice(0, 3);
  const featuredTours = tours.slice(0, 8);
  const popularGroups = groups.slice(0, 6);

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
      <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 overflow-hidden rounded-l-xl shadow-lg lg:flex lg:flex-col">
        <span className="flex h-10 w-10 items-center justify-center bg-blue-600 text-xs font-bold text-white">f</span>
        <span className="flex h-10 w-10 items-center justify-center bg-pink-500 text-xs font-bold text-white">◎</span>
        <span className="flex h-10 w-10 items-center justify-center bg-green-500 text-xs font-bold text-white">✆</span>
        <span className="flex h-10 w-10 items-center justify-center bg-red-500 text-xs font-bold text-white">▶</span>
      </div>

      <section className="relative overflow-hidden bg-[linear-gradient(170deg,#b8dff0_0%,#9fd4e8_20%,#aad9bc_55%,#cceacc_100%)]">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-16 text-center md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Du lịch trong nước</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-orange-500 md:text-5xl">
              Đi nơi đâu bạn muốn
              <br />
              cùng ExploreX Travel
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-700 md:text-base">
              Khám phá tour nội địa được quản lý bằng dữ liệu thật từ hệ thống, xem lịch khởi hành gần nhất, giá mở bán và đánh giá của khách hàng trước khi đặt.
            </p>
          </div>

          <form
            action="/tours"
            className="mt-8 w-full max-w-3xl rounded-2xl bg-stone-800/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur md:p-5"
          >
            <input
              type="text"
              name="q"
              placeholder="Bạn muốn đi đâu?"
              className="w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
            />
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <select
                name="group"
                defaultValue=""
                className="rounded-xl border-0 bg-white px-4 py-3 text-sm text-stone-700 outline-none"
              >
                <option value="">Tất cả danh mục</option>
                {groups.map((group) => (
                  <option key={group.maNhomTour} value={group.maNhomTour}>
                    {group.tenNhomTour}
                  </option>
                ))}
              </select>
              <input
                value={`${tours.length} tour đang mở bán`}
                readOnly
                className="rounded-xl border-0 bg-white px-4 py-3 text-sm text-stone-500 outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {dbUnavailable ? (
            <div className="mt-5 w-full max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-left text-sm leading-7 text-amber-900">
              MySQL hiện chưa kết nối được nên trang chủ đang hiển thị giao diện an toàn. Khi bật database lại, danh sách tour và lịch khởi hành sẽ được nạp từ dữ liệu thật.
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-orange-500 md:text-left">Khuyến Mại Bùng Nổ</h2>
              <p className="mt-2 text-sm text-stone-500">Chọn nhanh những hành trình đang được quan tâm nhất trên hệ thống.</p>
            </div>
            <Link href="/tours" className="hidden text-sm font-semibold text-orange-500 md:inline-flex">
              Xem tất cả
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(promoTours.length > 0 ? promoTours : featuredTours).slice(0, 3).map((tour, index) => (
              <Link
                key={tour.maTour}
                href={`/tours/${tour.maTour}`}
                className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="relative">
                  <img src={getTourImage(tour, index)} alt={tour.tenTour} className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-orange-600">
                    {tour.tenNhomTour ?? "Ưu đãi nổi bật"}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="min-h-14 text-lg font-bold leading-7 text-stone-900">{tour.tenTour}</h3>
                  <p className="mt-2 text-sm text-stone-500">Khởi hành gần nhất: {formatDate(tour.nextNgayBatDau)}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {[0, 1, 2].map((item) => (
              <span key={item} className={`h-2.5 w-2.5 rounded-full ${item === 0 ? "bg-orange-500" : "bg-stone-300"}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-6">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {popularGroups.map((group) => (
              <Link
                key={group.maNhomTour}
                href={`/tours?group=${group.maNhomTour}`}
                className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:border-orange-400 hover:bg-orange-100"
              >
                {group.tenNhomTour}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-12">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-orange-500">Tour Du Lịch</h2>
          <p className="mt-3 text-center text-sm leading-7 text-stone-500">
            Danh sách dưới đây đang đọc từ bảng tour và lịch khởi hành đang mở bán trong database hiện tại.
          </p>

          {featuredTours.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-stone-200 bg-white px-6 py-10 text-center text-sm leading-7 text-stone-600 shadow-sm">
              {dbUnavailable ? "Chưa thể tải tour vì database đang ngoại tuyến." : "Hiện chưa có tour công khai nào để hiển thị."}
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {featuredTours.map((tour, index) => (
                <article key={tour.maTour} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                  <div className="relative">
                    <img src={getTourImage(tour, index)} alt={tour.tenTour} className="h-44 w-full object-cover" />
                    <div className="absolute left-3 top-3 rounded-md bg-orange-500 px-3 py-1 text-[11px] font-extrabold text-white">
                      {tour.loaiTour ?? "TOUR HOT"}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="min-h-12 text-sm font-bold leading-6 text-stone-900">{tour.tenTour}</h3>
                    <p className="mt-2 text-lg font-black text-orange-500">{formatCurrency(tour.minGiaTour)}</p>

                    <div className="mt-3 space-y-1.5 text-xs leading-6 text-stone-500">
                      <p>Mã tour: {tour.maTour}</p>
                      <p>Ngày khởi hành: {formatDate(tour.nextNgayBatDau)}</p>
                      <p>Thời gian: {tour.thoiLuong ?? "Đang cập nhật"}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-xs text-stone-500">
                        <span className="text-amber-500">★★★★★</span>
                        <span className="ml-1">({formatRating(tour.avgRating, tour.totalReviews)})</span>
                      </div>
                      <div className="rounded-md bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-white">
                        Còn {tour.nextSoChoTrong ?? 0} chỗ
                      </div>
                    </div>

                    <Link
                      href={`/tours/${tour.maTour}`}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-600 transition hover:border-orange-500 hover:bg-orange-100"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/tours"
              className="inline-flex rounded-xl border-2 border-orange-500 bg-white px-8 py-3 text-sm font-bold text-orange-500 transition hover:bg-orange-500 hover:text-white"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div className="max-w-md text-white">
            <h2 className="text-2xl font-extrabold leading-tight">Đăng ký ngay để không bỏ lỡ các chương trình mới</h2>
            <p className="mt-2 text-sm leading-7 text-orange-50">
              Nhận thông tin mở bán tour mới, ưu đãi nội địa và cập nhật lịch khởi hành sớm nhất từ ExploreX Travel.
            </p>
          </div>

          <form action="/register/customer" className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-lg sm:flex-row">
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn..."
              className="flex-1 px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
            />
            <button type="submit" className="bg-stone-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-stone-800">
              Đăng ký ngay
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
