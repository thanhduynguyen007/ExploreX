"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { TourGroup } from "@/types/tour-group";
import type { PublicTourSummary } from "@/types/tour";

const PAGE_SIZE = 12;

type ToursBrowserProps = {
  dbUnavailable: boolean;
  groups: TourGroup[];
  initialFilters: {
    q?: string;
    group?: string;
    date?: string;
    price?: string;
    seats?: string;
    sort?: string;
    page?: string;
  };
  tours: PublicTourSummary[];
};

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

const getIsoDate = (value: string | Date | null) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
};

const getTourImage = (tour: PublicTourSummary, index: number) => {
  if (tour.hinhAnh && tour.hinhAnh.trim().length > 0) {
    return tour.hinhAnh;
  }

  const fallbacks = [
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&h=560&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&h=560&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=560&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=900&h=560&fit=crop&auto=format",
  ];

  return fallbacks[index % fallbacks.length];
};

const getRatingLabel = (value: number | null, totalReviews: number) => {
  if (value === null || totalReviews === 0) {
    return "Chưa có";
  }

  return `${Number(value).toFixed(1)} (${totalReviews})`;
};

const withinPriceRange = (tour: PublicTourSummary, priceRange?: string) => {
  if (!priceRange || tour.minGiaTour === null) {
    return true;
  }

  if (priceRange === "under-3000000") {
    return tour.minGiaTour < 3000000;
  }

  if (priceRange === "3000000-7000000") {
    return tour.minGiaTour >= 3000000 && tour.minGiaTour <= 7000000;
  }

  if (priceRange === "above-7000000") {
    return tour.minGiaTour > 7000000;
  }

  return true;
};

const compareBySort = (a: PublicTourSummary, b: PublicTourSummary, sort?: string) => {
  const priceA = a.minGiaTour ?? Number.MAX_SAFE_INTEGER;
  const priceB = b.minGiaTour ?? Number.MAX_SAFE_INTEGER;
  const dateA = a.nextNgayBatDau ? new Date(a.nextNgayBatDau).getTime() : Number.MAX_SAFE_INTEGER;
  const dateB = b.nextNgayBatDau ? new Date(b.nextNgayBatDau).getTime() : Number.MAX_SAFE_INTEGER;

  if (sort === "price-asc") {
    return priceA - priceB || dateA - dateB;
  }

  if (sort === "price-desc") {
    return priceB - priceA || dateA - dateB;
  }

  if (sort === "reviews") {
    return b.totalReviews - a.totalReviews || dateA - dateB;
  }

  return dateA - dateB || a.tenTour.localeCompare(b.tenTour, "vi");
};

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query.length > 0 ? `?${query}` : "";
};

export function ToursBrowser({ dbUnavailable, groups, initialFilters, tours }: ToursBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState({
    q: initialFilters.q ?? "",
    group: initialFilters.group ?? "",
    date: initialFilters.date ?? "",
    price: initialFilters.price ?? "",
    seats: initialFilters.seats ?? "",
  });

  useEffect(() => {
    setDraftFilters({
      q: initialFilters.q ?? "",
      group: initialFilters.group ?? "",
      date: initialFilters.date ?? "",
      price: initialFilters.price ?? "",
      seats: initialFilters.seats ?? "",
    });
    setDrawerOpen(false);
  }, [initialFilters.date, initialFilters.group, initialFilters.page, initialFilters.price, initialFilters.q, initialFilters.seats, initialFilters.sort]);

  const sort = initialFilters.sort ?? "date";
  const requestedPage = Math.max(1, Number(initialFilters.page ?? "1") || 1);
  const minSeats = Number(initialFilters.seats ?? "0") || 0;

  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) => (initialFilters.date ? getIsoDate(tour.nextNgayBatDau) === initialFilters.date : true))
      .filter((tour) => withinPriceRange(tour, initialFilters.price))
      .filter((tour) => (minSeats > 0 ? (tour.nextSoChoTrong ?? 0) >= minSeats : true))
      .sort((a, b) => compareBySort(a, b, sort));
  }, [initialFilters.date, initialFilters.price, minSeats, sort, tours]);

  const totalTours = filteredTours.length;
  const totalPages = Math.max(1, Math.ceil(totalTours / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedTours = filteredTours.slice(startIndex, startIndex + PAGE_SIZE);
  const pageStart = Math.max(1, currentPage - 2);
  const pageEnd = Math.min(totalPages, pageStart + 4);
  const visiblePages = Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => pageStart + index);

  const baseQuery = {
    q: initialFilters.q,
    group: initialFilters.group,
    date: initialFilters.date,
    price: initialFilters.price,
    seats: initialFilters.seats,
  };

  const navigate = (params: Record<string, string | undefined>) => {
    router.push(`${pathname}${buildQueryString(params)}`);
  };

  const applyFilters = () => {
    navigate({
      q: draftFilters.q || undefined,
      group: draftFilters.group || undefined,
      date: draftFilters.date || undefined,
      price: draftFilters.price || undefined,
      seats: draftFilters.seats || undefined,
      sort,
      page: undefined,
    });
  };

  const FilterFields = (
    <>
      <div>
        <label htmlFor="tour-keyword" className="mb-2 block text-sm font-semibold text-stone-800">
          Từ khóa
        </label>
        <input
          id="tour-keyword"
          type="text"
          value={draftFilters.q}
          onChange={(event) => setDraftFilters((current) => ({ ...current, q: event.target.value }))}
          placeholder="Tên tour, mô tả..."
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-700 outline-none transition focus:border-orange-400"
        />
      </div>

      <div>
        <label htmlFor="tour-group" className="mb-2 block text-sm font-semibold text-stone-800">
          Danh mục
        </label>
        <select
          id="tour-group"
          value={draftFilters.group}
          onChange={(event) => setDraftFilters((current) => ({ ...current, group: event.target.value }))}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none transition focus:border-orange-400"
        >
          <option value="">Tất cả danh mục</option>
          {groups.map((group) => (
            <option key={group.maNhomTour} value={group.maNhomTour}>
              {group.tenNhomTour}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tour-date" className="mb-2 block text-sm font-semibold text-stone-800">
          Ngày khởi hành
        </label>
        <input
          id="tour-date"
          type="date"
          value={draftFilters.date}
          onChange={(event) => setDraftFilters((current) => ({ ...current, date: event.target.value }))}
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-700 outline-none transition focus:border-orange-400"
        />
      </div>

      <div>
        <label htmlFor="tour-seats" className="mb-2 block text-sm font-semibold text-stone-800">
          Số chỗ trống tối thiểu
        </label>
        <select
          id="tour-seats"
          value={draftFilters.seats}
          onChange={(event) => setDraftFilters((current) => ({ ...current, seats: event.target.value }))}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none transition focus:border-orange-400"
        >
          <option value="">Không giới hạn</option>
          <option value="1">Từ 1 chỗ</option>
          <option value="5">Từ 5 chỗ</option>
          <option value="10">Từ 10 chỗ</option>
        </select>
      </div>

      <div>
        <label htmlFor="tour-price" className="mb-2 block text-sm font-semibold text-stone-800">
          Mức giá
        </label>
        <select
          id="tour-price"
          value={draftFilters.price}
          onChange={(event) => setDraftFilters((current) => ({ ...current, price: event.target.value }))}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none transition focus:border-orange-400"
        >
          <option value="">Tất cả mức giá</option>
          <option value="under-3000000">Dưới 3 triệu</option>
          <option value="3000000-7000000">Từ 3 đến 7 triệu</option>
          <option value="above-7000000">Trên 7 triệu</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden bg-stone-100">
      <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 overflow-hidden rounded-l-xl shadow-lg lg:flex lg:flex-col">
        <span className="flex h-10 w-10 items-center justify-center bg-blue-600 text-xs font-bold text-white">f</span>
        <span className="flex h-10 w-10 items-center justify-center bg-pink-500 text-xs font-bold text-white">◎</span>
        <span className="flex h-10 w-10 items-center justify-center bg-green-500 text-xs font-bold text-white">✆</span>
        <span className="flex h-10 w-10 items-center justify-center bg-red-500 text-xs font-bold text-white">▶</span>
      </div>

      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Đóng bộ lọc"
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          />
          <div className="fixed right-0 top-0 z-50 flex h-screen w-[88%] max-w-sm flex-col bg-white shadow-2xl lg:hidden">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <h2 className="text-base font-extrabold text-stone-900">Bộ Lọc</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} className="text-sm font-semibold text-stone-500">
                Đóng
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">{FilterFields}</div>
            <div className="border-t border-stone-200 px-5 py-4">
              <button
                type="button"
                onClick={applyFilters}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"
              >
                Áp Dụng
              </button>
            </div>
          </div>
        </>
      ) : null}

      <section className="relative flex min-h-[180px] items-end overflow-hidden bg-[linear-gradient(to_right,rgba(80,40,120,0.72),rgba(180,80,30,0.55)),url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&h=420&fit=crop&auto=format')] bg-cover bg-center px-6 py-8 md:min-h-[220px] md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-3xl font-black text-white md:text-4xl">Tour Trong Nước</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-white/90">
            <Link href="/" className="transition hover:text-white">
              Trang Chủ
            </Link>
            <span>»</span>
            <span>Tour Trong Nước</span>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row lg:items-start">
        <aside className="hidden w-[260px] flex-none rounded-2xl bg-white p-5 shadow-sm lg:block">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900">Bộ Lọc</h2>
            <span className="text-sm text-orange-500">▼</span>
          </div>
          <div className="space-y-4">
            {FilterFields}
            <button
              type="button"
              onClick={applyFilters}
              className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Áp Dụng
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <h2 className="text-3xl font-black text-orange-500">Tour Trong Nước</h2>
          <p className="mt-2 text-sm leading-7 text-stone-500">
            Danh sách tour công khai được lấy trực tiếp từ database, hỗ trợ lọc theo danh mục, ngày khởi hành, mức giá, số chỗ còn và sắp xếp theo nhu cầu.
          </p>

          {dbUnavailable ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
              Không thể kết nối MySQL tại 127.0.0.1:3306. Trang vẫn hiển thị giao diện an toàn nhưng chưa tải được danh sách tour.
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl bg-white px-4 py-4 shadow-sm md:px-5">
            <div className="hidden flex-wrap items-center justify-between gap-3 md:flex">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-stone-700">
                <span className="font-semibold text-stone-900">Sắp xếp:</span>
                <button
                  type="button"
                  onClick={() => navigate({ ...baseQuery, sort: "price-asc", page: undefined })}
                  className={`transition ${sort === "price-asc" ? "font-bold text-orange-500" : "hover:text-orange-500"}`}
                >
                  Giá tăng dần ▲
                </button>
                <span className="text-stone-300">|</span>
                <button
                  type="button"
                  onClick={() => navigate({ ...baseQuery, sort: "price-desc", page: undefined })}
                  className={`transition ${sort === "price-desc" ? "font-bold text-orange-500" : "hover:text-orange-500"}`}
                >
                  Giá giảm dần ▼
                </button>
                <span className="text-stone-300">|</span>
                <button
                  type="button"
                  onClick={() => navigate({ ...baseQuery, sort: "reviews", page: undefined })}
                  className={`transition ${sort === "reviews" ? "font-bold text-orange-500" : "hover:text-orange-500"}`}
                >
                  Xem Nhiều
                </button>
              </div>
              <div className="text-sm font-semibold text-stone-800">
                Tất cả: <span className="text-orange-500">{totalTours} Tour</span>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate({ ...baseQuery, sort: "price-asc", page: undefined })}
                    className={`rounded-full border px-3 py-2 text-xs font-bold ${
                      sort === "price-asc" ? "border-orange-500 bg-orange-500 text-white" : "border-stone-200 bg-white text-stone-700"
                    }`}
                  >
                    Giá tăng ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate({ ...baseQuery, sort: "price-desc", page: undefined })}
                    className={`rounded-full border px-3 py-2 text-xs font-bold ${
                      sort === "price-desc" ? "border-orange-500 bg-orange-500 text-white" : "border-stone-200 bg-white text-stone-700"
                    }`}
                  >
                    Giá giảm ▼
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700"
                >
                  Bộ Lọc ▼
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="font-semibold text-stone-800">
                  Tất cả <span className="text-orange-500">{totalTours}</span> Tour
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ ...baseQuery, sort: "reviews", page: undefined })}
                  className={`font-semibold ${sort === "reviews" ? "text-orange-500" : "text-stone-700"}`}
                >
                  Xem Nhiều
                </button>
              </div>
            </div>
          </div>

          {paginatedTours.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white px-6 py-10 text-center text-sm leading-7 text-stone-600 shadow-sm">
              {dbUnavailable ? "Chưa thể tải dữ liệu tour vì database đang ngoại tuyến." : "Không tìm thấy tour phù hợp với bộ lọc hiện tại."}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-5 xl:grid-cols-3">
              {paginatedTours.map((tour, index) => (
                <Link key={tour.maTour} href={`/tours/${tour.maTour}`} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                  <div className="relative">
                    <img src={getTourImage(tour, index)} alt={tour.tenTour} className="h-32 w-full object-cover sm:h-44 md:h-52" />
                    <div className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-1 text-[9px] font-extrabold text-white md:left-3 md:top-3 md:px-3 md:text-[11px]">
                      {tour.loaiTour ?? "TOUR HOT"}
                    </div>
                  </div>

                  <div className="p-3 md:p-4">
                    <h3 className="min-h-12 text-[12px] font-bold leading-5 text-stone-900 md:text-sm md:leading-6">{tour.tenTour}</h3>
                    <p className="mt-1.5 text-base font-black text-orange-500 md:mt-2 md:text-lg">{formatCurrency(tour.minGiaTour)}</p>

                    <div className="mt-2.5 space-y-1 text-[10px] leading-5 text-stone-500 md:mt-3 md:space-y-1.5 md:text-xs md:leading-6">
                      <p>Mã Tour: {tour.maTour}</p>
                      <p>Ngày Khởi Hành: {formatDate(tour.nextNgayBatDau)}</p>
                      <p>Thời Gian: {tour.thoiLuong ?? "Đang cập nhật"}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 md:mt-4 md:gap-3">
                      <div className="text-[10px] text-stone-500 md:text-xs">
                        <span className="text-amber-500">★★★★★</span>
                        <span className="ml-1">({getRatingLabel(tour.avgRating, tour.totalReviews)})</span>
                      </div>
                      <div className="rounded-md bg-orange-500 px-2 py-1 text-[9px] font-bold text-white md:px-2.5 md:text-[11px]">
                        {tour.nextSoChoTrong ?? 0}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-2 md:justify-end">
            <button
              type="button"
              onClick={() => navigate({ ...baseQuery, sort, page: String(Math.max(1, currentPage - 1)) })}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-sm text-stone-600 transition hover:border-orange-400 hover:text-orange-500"
            >
              ‹
            </button>
            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => navigate({ ...baseQuery, sort, page: String(pageNumber) })}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                  pageNumber === currentPage
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-stone-200 bg-white text-stone-700 hover:border-orange-400 hover:text-orange-500"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate({ ...baseQuery, sort, page: String(Math.min(totalPages, currentPage + 1)) })}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-sm text-stone-600 transition hover:border-orange-400 hover:text-orange-500"
            >
              ›
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
