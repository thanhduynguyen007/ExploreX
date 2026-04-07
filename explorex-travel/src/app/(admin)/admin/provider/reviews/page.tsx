import { redirect } from "next/navigation";

import {
  ProviderMetricCard,
  ProviderPageHeader,
  ProviderSection,
  formatDateTime,
  formatRating,
} from "@/components/provider/provider-ui";
import { getSessionUser } from "@/lib/auth/session";
import { listReviewsForProvider } from "@/services/review.service";

export default async function ProviderAdminReviewsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const reviews = await listReviewsForProvider(user.id);
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, item) => sum + Number(item.soSao ?? 0), 0) / reviews.length : null;
  const fiveStarCount = reviews.filter((item) => Number(item.soSao ?? 0) === 5).length;
  const lowRatingCount = reviews.filter((item) => Number(item.soSao ?? 0) <= 2).length;

  return (
    <div className="space-y-6">
      <ProviderPageHeader
        eyebrow="Đánh giá"
        title="Phản hồi từ khách hàng"
        description="Danh sách này chỉ hiển thị đánh giá thuộc các tour của nhà cung cấp hiện tại. Dữ liệu được lọc ownership ngay từ service."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProviderMetricCard title="Tổng đánh giá" value={String(reviews.length)} description="Toàn bộ phản hồi từ khách hàng." />
        <ProviderMetricCard title="Điểm trung bình" value={formatRating(avgRating)} description="Điểm trung bình trên toàn bộ tour." />
        <ProviderMetricCard title="5 sao" value={String(fiveStarCount)} description="Số đánh giá rất hài lòng." />
        <ProviderMetricCard title="Thấp điểm" value={String(lowRatingCount)} description="Đánh giá 1-2 sao cần xử lý thêm." />
      </section>

      <ProviderSection title="Danh sách đánh giá" description="Bạn có thể dùng khu này để theo dõi tour nào đang nhận phản hồi tốt hoặc chưa tốt.">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-3 py-4 text-left font-extrabold">Mã đánh giá</th>
                <th className="px-3 py-4 text-left font-extrabold">Khách hàng</th>
                <th className="px-3 py-4 text-left font-extrabold">Tour</th>
                <th className="px-3 py-4 text-left font-extrabold">Số sao</th>
                <th className="px-3 py-4 text-left font-extrabold">Bình luận</th>
                <th className="px-3 py-4 text-left font-extrabold">Ngày đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Chưa có đánh giá nào cho các tour của bạn.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.maDanhGia} className="border-b border-[#eceef2] last:border-b-0">
                    <td className="px-3 py-4 font-semibold">{review.maDanhGia}</td>
                    <td className="px-3 py-4">{review.tenNguoiDung ?? review.maNguoiDung}</td>
                    <td className="px-3 py-4">{review.tenTour ?? review.maTour}</td>
                    <td className="px-3 py-4">
                      <span className="inline-flex rounded-[8px] bg-[#fff4de] px-3 py-1 text-xs font-bold text-[#d97706]">
                        {Number(review.soSao ?? 0)}/5
                      </span>
                    </td>
                    <td className="px-3 py-4 text-[#606060]">{review.binhLuan ?? "Không có bình luận"}</td>
                    <td className="px-3 py-4 text-[#606060]">{formatDateTime(review.ngayDanhGia)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ProviderSection>
    </div>
  );
}
