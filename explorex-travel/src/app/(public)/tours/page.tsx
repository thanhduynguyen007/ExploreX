import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { listTourGroups } from "@/services/tour-group.service";
import { listPublicTours } from "@/services/tour.service";

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) {
    return "Liên hệ để cập nhật";
  }

  return `${value.toLocaleString("vi-VN")} đ`;
};

const formatDateTime = (value: string | Date | null) => {
  if (!value) {
    return "Chưa có lịch mở bán";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("vi-VN");
};

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; group?: string }>;
}) {
  const params = await searchParams;
  const keyword = params.q?.trim() || undefined;
  const maNhomTour = params.group?.trim() || undefined;

  const [tours, groups] = await Promise.all([
    listPublicTours({ keyword, maNhomTour }),
    listTourGroups(),
  ]);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Public"
        title="Danh sách tour"
        description="Trang công khai đã đọc dữ liệu tour thật từ MySQL, hỗ trợ lọc theo nhóm tour và tìm nhanh theo từ khóa."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_auto]">
          <input
            type="text"
            name="q"
            defaultValue={keyword ?? ""}
            placeholder="Tìm theo tên tour, mô tả, nhóm tour..."
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          />
          <select
            name="group"
            defaultValue={maNhomTour ?? ""}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          >
            <option value="">Tất cả nhóm tour</option>
            {groups.map((group) => (
              <option key={group.maNhomTour} value={group.maNhomTour}>
                {group.tenNhomTour}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Tìm tour
          </button>
        </form>
      </section>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {tours.length === 0 ? (
          <article className="rounded-3xl border border-stone-200 bg-white p-6 text-sm leading-7 text-stone-600 shadow-sm lg:col-span-2 xl:col-span-3">
            Không tìm thấy tour công khai phù hợp với bộ lọc hiện tại.
          </article>
        ) : (
          tours.map((tour) => (
            <article key={tour.maTour} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{tour.tenNhomTour ?? "Tour công khai"}</p>
              <h2 className="mt-3 text-xl font-semibold text-stone-900">{tour.tenTour}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{tour.moTa ?? "Thông tin tour đang được cập nhật."}</p>
              <div className="mt-5 space-y-2 text-sm text-stone-700">
                <p>Loại tour: {tour.loaiTour ?? "Chưa cập nhật"}</p>
                <p>Thời lượng: {tour.thoiLuong ?? "Chưa cập nhật"}</p>
                <p>Khởi hành gần nhất: {formatDateTime(tour.nextNgayBatDau)}</p>
                <p>Đánh giá: {tour.avgRating ? `${Number(tour.avgRating).toFixed(1)}/5` : "Chưa có"} ({tour.totalReviews} lượt)</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-base font-semibold text-stone-900">Từ {formatCurrency(tour.minGiaTour)}</span>
                <Link href={`/tours/${tour.maTour}`} className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700">
                  Xem chi tiết
                </Link>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
