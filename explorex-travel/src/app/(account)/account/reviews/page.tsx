import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { listReviews } from "@/services/review.service";

const formatDate = (value: string | Date | null | undefined) => {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("vi-VN");
};

export default async function AccountReviewsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const reviews = await listReviews({ maNguoiDung: user.id });

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Tài khoản"
        title="Đánh giá của tôi"
        description="Theo dõi các nhận xét bạn đã gửi cho tour đã hoàn thành, gồm số sao, nội dung và thời điểm đánh giá."
      />

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Lịch sử đánh giá</h2>
            <p className="mt-1 text-sm text-stone-500">Danh sách này chỉ hiển thị dữ liệu thuộc tài khoản khách hàng hiện tại.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">Tổng đánh giá: {reviews.length}</div>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 px-4 py-6 text-sm text-stone-500">
            Bạn chưa gửi đánh giá nào. Sau khi tour hoàn thành, bạn có thể vào chi tiết đơn hoặc màn tạo đánh giá để gửi nhận xét.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <article key={review.maDanhGia} className="rounded-2xl border border-stone-200 px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">{review.tenTour ?? review.maTour ?? "Tour không xác định"}</h3>
                    <p className="mt-1 text-sm text-stone-500">Mã đánh giá: {review.maDanhGia}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-700">{review.soSao ?? 0}/5 sao</p>
                    <p className="mt-1 text-xs text-stone-500">{formatDate(review.ngayDanhGia)}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-7 text-stone-700">{review.binhLuan ?? "Không có bình luận."}</p>

                {review.maTour ? (
                  <div className="mt-4">
                    <Link href={`/tours/${review.maTour}`} className="text-sm font-semibold text-amber-700 hover:text-amber-900">
                      Xem lại tour
                    </Link>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
