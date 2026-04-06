import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/ui/page-hero";
import { isDatabaseUnavailableError } from "@/lib/db/mysql";
import { listReviews } from "@/services/review.service";
import { getPublicTourDetail } from "@/services/tour.service";

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) {
    return "Liên hệ để cập nhật";
  }

  return `${value.toLocaleString("vi-VN")} đ`;
};

const formatDateTime = (value: string | Date | null) => {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("vi-VN");
};

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;

  try {
    const [tour, reviews] = await Promise.all([
      getPublicTourDetail(tourId),
      listReviews({ maTour: tourId }),
    ]);

    return (
      <div className="space-y-8">
        <PageHero
          eyebrow={tour.tenNhomTour ?? "Tour chi tiết"}
          title={tour.tenTour}
          description={tour.moTa ?? "Thông tin chi tiết tour, lịch khởi hành, nhà cung cấp và đánh giá khách hàng."}
        />

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900">Thông tin tour</h2>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-stone-500">Nhà cung cấp</dt>
                <dd className="mt-1 text-sm text-stone-800">{tour.tenNhaCungCap ?? "Chưa cập nhật"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500">Loại tour</dt>
                <dd className="mt-1 text-sm text-stone-800">{tour.loaiTour ?? "Chưa cập nhật"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500">Thời lượng</dt>
                <dd className="mt-1 text-sm text-stone-800">{tour.thoiLuong ?? "Chưa cập nhật"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500">Sức chứa tối đa</dt>
                <dd className="mt-1 text-sm text-stone-800">{tour.sLKhachToiDa ?? 0} khách</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500">Giá từ</dt>
                <dd className="mt-1 text-sm text-stone-800">{formatCurrency(tour.minGiaTour)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-stone-500">Đánh giá trung bình</dt>
                <dd className="mt-1 text-sm text-stone-800">
                  {tour.avgRating ? `${Number(tour.avgRating).toFixed(1)}/5` : "Chưa có"} ({tour.totalReviews} lượt)
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-stone-950 p-6 text-stone-100 shadow-sm">
            <h2 className="text-xl font-semibold">Đặt tour và theo dõi</h2>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              Luồng booking đã hoạt động ở backend. Bước tiếp theo sẽ bổ sung form đặt tour tối thiểu cho khách hàng ngay trên website công khai.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400">
                Đăng nhập để đặt tour
              </Link>
              <Link href="/account/bookings" className="rounded-2xl border border-stone-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-900">
                Xem đơn đặt tour
              </Link>
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">Lịch khởi hành</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">Danh sách lịch được đọc trực tiếp từ bảng `lichtour` theo tour công khai.</p>
            </div>
            <span className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {tour.schedules.length} lịch
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead className="bg-stone-50 text-left text-stone-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã lịch</th>
                  <th className="px-4 py-3 font-semibold">Ngày khởi hành</th>
                  <th className="px-4 py-3 font-semibold">Chỗ trống</th>
                  <th className="px-4 py-3 font-semibold">Giá</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {tour.schedules.map((schedule) => (
                  <tr key={schedule.maLichTour}>
                    <td className="px-4 py-3 font-medium text-stone-800">{schedule.maLichTour}</td>
                    <td className="px-4 py-3 text-stone-700">{formatDateTime(schedule.ngayBatDau)}</td>
                    <td className="px-4 py-3 text-stone-700">
                      {schedule.soChoTrong ?? 0}/{schedule.tongChoNgoi ?? 0}
                    </td>
                    <td className="px-4 py-3 text-stone-700">{formatCurrency(schedule.giaTour)}</td>
                    <td className="px-4 py-3 text-stone-700">{schedule.trangThai ?? "Chưa cập nhật"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-900">Đánh giá khách hàng</h2>
          <div className="mt-5 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm leading-7 text-stone-600">Tour này chưa có đánh giá nào.</p>
            ) : (
              reviews.map((review) => (
                <article key={review.maDanhGia} className="rounded-2xl border border-stone-200 px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-stone-900">{review.tenNguoiDung ?? review.maNguoiDung}</p>
                    <p className="text-sm text-stone-500">
                      {review.soSao ?? 0}/5 | {formatDateTime(review.ngayDanhGia)}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-700">{review.binhLuan ?? "Không có bình luận."}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return (
        <div className="space-y-8">
          <PageHero
            eyebrow="Tour chi tiết"
            title="Tạm thời chưa tải được dữ liệu tour"
            description="MySQL hiện chưa kết nối được, nên trang chi tiết chưa thể đọc dữ liệu từ database."
          />
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900 shadow-sm">
            Không thể kết nối MySQL tại `127.0.0.1:3306`. Hãy bật database rồi tải lại trang.
          </section>
        </div>
      );
    }

    notFound();
  }
}
