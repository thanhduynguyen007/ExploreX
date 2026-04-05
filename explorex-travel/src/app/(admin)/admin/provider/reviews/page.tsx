import { redirect } from "next/navigation";

import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { listReviewsForProvider } from "@/services/review.service";

const formatDateTime = (value: string | Date | null | undefined) => {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("vi-VN");
};

export default async function ProviderAdminReviewsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const reviews = await listReviewsForProvider(user.id);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title="Đánh giá tour"
        description="Đối tác chỉ xem được đánh giá thuộc các tour của mình. Backend tiếp tục lọc theo ownership."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Đánh giá của khách hàng</h2>
            <p className="mt-1 text-sm text-stone-500">Dữ liệu lấy trực tiếp từ bảng `danhgia` đã chuẩn hóa.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Tổng đánh giá: {reviews.length}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã đánh giá</th>
                <th className="px-4 py-3 font-semibold">Khách hàng</th>
                <th className="px-4 py-3 font-semibold">Tour</th>
                <th className="px-4 py-3 font-semibold">Số sao</th>
                <th className="px-4 py-3 font-semibold">Ngày đánh giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-stone-500">
                    Chưa có đánh giá nào cho tour của bạn.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.maDanhGia}>
                    <td className="px-4 py-3 font-medium text-stone-800">{review.maDanhGia}</td>
                    <td className="px-4 py-3 text-stone-700">{review.tenNguoiDung ?? review.maNguoiDung}</td>
                    <td className="px-4 py-3 text-stone-700">{review.tenTour ?? review.maTour}</td>
                    <td className="px-4 py-3 text-stone-700">{review.soSao ?? 0}/5</td>
                    <td className="px-4 py-3 text-stone-700">{formatDateTime(review.ngayDanhGia)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
