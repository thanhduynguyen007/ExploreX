import { redirect } from "next/navigation";

import { ReviewForm } from "@/components/forms/review-form";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { getEligibleCompletedBookingsForReview } from "@/services/review.service";

export default async function AccountCreateReviewPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const { tourId } = await params;
  const eligibleBookings = await getEligibleCompletedBookingsForReview(user.id, tourId);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Tài khoản"
        title={`Đánh giá tour ${tourId}`}
        description="Khách hàng chỉ có thể đánh giá sau khi đơn đặt tour đã hoàn thành. Kiểm tra này được thực thi ở backend."
      />

      {eligibleBookings.length === 0 ? (
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Chưa đủ điều kiện đánh giá</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Bạn chưa có đơn đặt tour hoàn thành nào chưa đánh giá cho tour này.
          </p>
        </section>
      ) : (
        <ReviewForm
          tourId={tourId}
          eligibleBookings={eligibleBookings.map((item) => ({
            maDatTour: item.maDatTour,
          }))}
        />
      )}
    </div>
  );
}
