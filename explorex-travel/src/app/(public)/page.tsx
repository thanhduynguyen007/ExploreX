import Link from "next/link";

import { HomePromoCarousel } from "@/components/public/home-promo-carousel";
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

  const promoTours = (tours.slice(0, 3).length > 0 ? tours.slice(0, 3) : tours.slice(0, 8)).map((tour, index) => ({
    maTour: tour.maTour,
    tenTour: tour.tenTour,
    tenNhomTour: tour.tenNhomTour,
    nextNgayBatDau: tour.nextNgayBatDau,
    image: getTourImage(tour, index),
  }));
  const featuredTours = tours.slice(0, 8);
  const popularGroups = groups.slice(0, 6);

  return (
    <div className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden">
      <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 overflow-hidden rounded-l-xl shadow-lg lg:flex lg:flex-col">
        <span className="flex h-10 w-10 items-center justify-center bg-blue-600 text-xs font-bold text-white">f</span>
        <span className="flex h-10 w-10 items-center justify-center bg-pink-500 text-xs font-bold text-white">◎</span>
        <span className="flex h-10 w-10 items-center justify-center bg-green-500 text-xs font-bold text-white">✆</span>
        <span className="flex h-10 w-10 items-center justify-center bg-red-500 text-xs font-bold text-white">▶</span>
      </div>

      <section className="relative overflow-hidden bg-[linear-gradient(170deg,#b8dff0_0%,#9fd4e8_20%,#aad9bc_55%,#cceacc_100%)]">
        <div className="absolute -left-24 top-14 h-52 w-52 rounded-full bg-white/20 blur-3xl md:top-20 md:h-64 md:w-64" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl md:h-72 md:w-72" />

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-10 text-center md:px-6 md:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-600 md:text-sm md:tracking-[0.35em]">
              Du lịch trong nước
            </p>
            <h1 className="mt-3 text-[28px] font-black leading-[1.2] text-orange-500 md:mt-4 md:text-5xl">
              Đi nơi đâu bạn muốn
              <br />
              cùng ExploreX Travel
            </h1>
            <p className="mx-auto mt-3 max-w-2xl px-1 text-[13px] leading-6 text-stone-700 md:mt-4 md:px-0 md:text-base md:leading-7">
              Khám phá tour nội địa được quản lý bằng dữ liệu thật từ hệ thống, xem lịch khởi hành gần nhất, giá mở bán và đánh giá trước khi đặt.
            </p>
          </div>

          <form
            action="/tours"
            className="mt-6 w-full max-w-3xl rounded-2xl bg-stone-800/80 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur md:mt-8 md:p-5"
          >
            <input
              type="text"
              name="q"
              placeholder="Bạn muốn đi đâu?"
              className="w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
            />
            <div className="mt-2.5 grid gap-2.5 md:mt-3 md:grid-cols-[1fr_1fr_auto] md:gap-3">
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
            <div className="mt-4 w-full max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm leading-6 text-amber-900 md:mt-5 md:px-5 md:py-4 md:leading-7">
              MySQL hiện chưa kết nối được nên trang chủ đang hiển thị giao diện an toàn. Khi bật database lại, danh sách tour và lịch khởi hành sẽ được nạp từ dữ liệu thật.
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-8 md:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="flex items-end justify-between gap-4">
            <div className="w-full">
              <h2 className="text-center text-2xl font-extrabold leading-tight text-orange-500 md:text-left md:text-3xl">
                Khuyến Mại Bùng Nổ
                <span className="md:hidden">
                  <br />
                  Đánh Tan Nóng Bức
                </span>
              </h2>
              <p className="mt-2 hidden text-sm text-stone-500 md:block">
                Chọn nhanh những hành trình đang được quan tâm nhất trên hệ thống.
              </p>
            </div>
            <Link href="/tours" className="hidden text-sm font-semibold text-orange-500 md:inline-flex">
              Xem tất cả
            </Link>
          </div>

          <div className="mt-5 hidden gap-4 md:grid md:grid-cols-3 md:mt-6">
            {promoTours.map((tour) => (
              <Link
                key={tour.maTour}
                href={`/tours/${tour.maTour}`}
                className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="relative">
                  <img src={tour.image} alt={tour.tenTour} className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
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

          <HomePromoCarousel items={promoTours} />
        </div>
      </section>

      <section className="bg-white pb-5 md:pb-6">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
            {popularGroups.map((group) => (
              <Link
                key={group.maNhomTour}
                href={`/tours?group=${group.maNhomTour}`}
                className="rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:border-orange-400 hover:bg-orange-100 md:px-4 md:text-sm"
              >
                {group.tenNhomTour}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-8 md:py-12">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-extrabold text-orange-500 md:text-3xl">Tour Du Lịch</h2>
          <p className="mt-2 text-center text-xs leading-6 text-stone-500 md:mt-3 md:text-sm md:leading-7">
            Danh sách đang đọc từ bảng tour và lịch khởi hành mở bán trong database hiện tại.
          </p>

          {featuredTours.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-stone-200 bg-white px-5 py-8 text-center text-sm leading-7 text-stone-600 shadow-sm md:mt-8 md:px-6 md:py-10">
              {dbUnavailable ? "Chưa thể tải tour vì database đang ngoại tuyến." : "Hiện chưa có tour công khai nào để hiển thị."}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {featuredTours.map((tour, index) => (
                <article key={tour.maTour} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                  <div className="relative">
                    <img src={getTourImage(tour, index)} alt={tour.tenTour} className="h-28 w-full object-cover sm:h-36 md:h-44" />
                    <div className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-1 text-[9px] font-extrabold text-white md:left-3 md:top-3 md:px-3 md:text-[11px]">
                      {tour.loaiTour ?? "TOUR HOT"}
                    </div>
                  </div>

                  <div className="p-3 md:p-4">
                    <h3 className="min-h-12 text-[12px] font-bold leading-5 text-stone-900 md:text-sm md:leading-6">{tour.tenTour}</h3>
                    <p className="mt-1.5 text-base font-black text-orange-500 md:mt-2 md:text-lg">{formatCurrency(tour.minGiaTour)}</p>

                    <div className="mt-2.5 space-y-1 text-[10px] leading-5 text-stone-500 md:mt-3 md:space-y-1.5 md:text-xs md:leading-6">
                      <p>Mã tour: {tour.maTour}</p>
                      <p>Ngày KH: {formatDate(tour.nextNgayBatDau)}</p>
                      <p>TG: {tour.thoiLuong ?? "Đang cập nhật"}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 md:mt-4 md:gap-3">
                      <div className="text-[10px] text-stone-500 md:text-xs">
                        <span className="text-amber-500">★★★★★</span>
                        <span className="ml-1">({formatRating(tour.avgRating, tour.totalReviews)})</span>
                      </div>
                      <div className="rounded-md bg-orange-500 px-2 py-1 text-[9px] font-bold text-white md:px-2.5 md:text-[11px]">
                        {tour.nextSoChoTrong ?? 0}
                      </div>
                    </div>

                    <Link
                      href={`/tours/${tour.maTour}`}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 transition hover:border-orange-500 hover:bg-orange-100 md:mt-4 md:px-4 md:py-2.5 md:text-sm"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-6 text-center md:mt-8">
            <Link
              href="/tours"
              className="inline-flex rounded-xl border-2 border-orange-500 bg-white px-7 py-2.5 text-sm font-bold text-orange-500 transition hover:bg-orange-500 hover:text-white md:px-8 md:py-3"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-8 md:py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-5 px-4 md:flex-row md:items-center md:gap-6 md:px-6">
          <div className="max-w-md text-white">
            <h2 className="text-xl font-extrabold leading-tight md:text-2xl">Đăng ký ngay để không bỏ lỡ các chương trình mới</h2>
            <p className="mt-2 text-sm leading-6 text-orange-50 md:leading-7">
              Nhận thông tin mở bán tour mới, ưu đãi nội địa và cập nhật lịch khởi hành sớm nhất từ ExploreX Travel.
            </p>
          </div>

          <form action="/register/customer" className="flex w-full max-w-xl flex-col gap-2.5 overflow-hidden md:flex-row md:gap-0">
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn..."
              className="rounded-xl bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 md:rounded-r-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-stone-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-stone-800 md:rounded-l-none"
            >
              Đăng ký ngay
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
