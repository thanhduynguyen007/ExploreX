import { notFound } from "next/navigation";

import { PublicTourDetailView } from "@/components/public/public-tour-detail-view";
import { isDatabaseUnavailableError } from "@/lib/db/mysql";
import { listReviews } from "@/services/review.service";
import { getPublicTourDetail } from "@/services/tour.service";

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

    return <PublicTourDetailView reviews={reviews} tour={tour} />;
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return (
        <div className="space-y-8">
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900 shadow-sm">
            Không thể kết nối MySQL tại `127.0.0.1:3306`. Hãy bật database rồi tải lại trang chi tiết tour.
          </section>
        </div>
      );
    }

    notFound();
  }
}
