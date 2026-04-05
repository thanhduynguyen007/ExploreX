import { PageHero } from "@/components/ui/page-hero";
import { listReviews } from "@/services/review.service";

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

export default async function AdminReviewsPage() {
  const reviews = await listReviews();

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title="Quản lý đánh giá"
        description="Admin theo dõi toàn bộ đánh giá thật từ database để kiểm soát nội dung và chất lượng dịch vụ."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Danh sách đánh giá</h2>
            <p className="mt-1 text-sm text-stone-500">Chỉ các booking hoàn thành mới được tạo đánh giá hợp lệ.</p>
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
                    Chưa có đánh giá nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.maDanhGia}>
                    <td className="px-4 py-3 font-medium text-stone-800">{review.maDanhGia}</td>
                    <td className="px-4 py-3 text-stone-700">{review.tenNguoiDung ?? review.maNguoiDung}</td>
                    <td className="px-4 py-3 text-stone-700">
                      <p className="font-medium text-stone-900">{review.tenTour ?? review.maTour}</p>
                      <p className="mt-1 text-xs text-stone-500">{review.tenNhaCungCap ?? review.maNhaCungCap}</p>
                    </td>
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
