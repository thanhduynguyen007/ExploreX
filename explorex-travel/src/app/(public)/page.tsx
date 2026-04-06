import Link from "next/link";

import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { isDatabaseUnavailableError } from "@/lib/db/mysql";
import { listTourGroups } from "@/services/tour-group.service";
import { listPublicTours } from "@/services/tour.service";
import type { TourGroup } from "@/types/tour-group";
import type { PublicTourSummary } from "@/types/tour";

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

  const featuredTours = tours.slice(0, 3);
  const featuredDestinations = tours.slice(0, 4);

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="Du lịch trong nước"
        title="Khám phá các điểm đến nổi bật và đặt tour nội địa trên ExploreX Travel."
        description={
          dbUnavailable
            ? "MySQL hiện chưa kết nối được, nên trang đang hiển thị giao diện an toàn mà không tải dữ liệu tour."
            : "Website công khai đã được nối dữ liệu thật từ MySQL, hiển thị tour công khai, lịch khởi hành và đánh giá thực tế để khách hàng dễ lựa chọn."
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard title="Tour công khai" description={`${tours.length} tour đang sẵn sàng cho khách hàng xem chi tiết và theo dõi lịch khởi hành.`} />
        <InfoCard title="Nhóm tour" description={`${groups.length} nhóm tour đang hỗ trợ phân loại như văn hóa, sinh thái, nghỉ dưỡng và gia đình.`} />
        <InfoCard
          title="Dữ liệu thật"
          description={
            dbUnavailable
              ? "MySQL đang tạm không phản hồi tại 127.0.0.1:3306. Hãy bật XAMPP/MySQL để tải dữ liệu thật."
              : "Trang chủ, danh sách tour và chi tiết tour đều đọc từ MySQL thay vì nội dung placeholder."
          }
        />
      </section>

      {dbUnavailable ? (
        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900 shadow-sm">
          Không thể kết nối MySQL tại `127.0.0.1:3306`. Trang public vẫn hoạt động ở chế độ an toàn, nhưng danh sách tour và nhóm tour sẽ trống cho tới khi database được bật lại.
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">Điểm đến nổi bật trong nước</h2>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              Ưu tiên các hành trình nội địa, đặc biệt là khu vực miền Tây và các trải nghiệm văn hóa bản địa.
            </p>
          </div>
          <Link href="/tours" className="text-sm font-semibold text-amber-700 hover:text-amber-900">
            Xem tất cả tour
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredDestinations.map((tour) => (
            <article key={tour.maTour} className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{tour.tenNhomTour ?? "Tour nội địa"}</p>
              <h3 className="mt-3 text-lg font-semibold text-stone-900">{tour.tenTour}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{tour.moTa ?? "Hành trình được tuyển chọn cho khách yêu du lịch trong nước."}</p>
              <p className="mt-4 text-sm font-medium text-stone-800">Từ {formatCurrency(tour.minGiaTour)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {featuredTours.map((tour) => (
          <article key={tour.maTour} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">{tour.loaiTour ?? "Du lịch nội địa"}</p>
            <h3 className="mt-3 text-xl font-semibold text-stone-900">{tour.tenTour}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">{tour.moTa ?? "Tour đang mở bán trên hệ thống."}</p>
            <div className="mt-5 space-y-2 text-sm text-stone-700">
              <p>Nhà cung cấp: {tour.tenNhaCungCap ?? "Chưa cập nhật"}</p>
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
        ))}
      </section>
    </div>
  );
}
