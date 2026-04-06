import { ReviewFilterBar } from "@/components/admin/review-filter-bar";
import { listProviders } from "@/services/tour.service";
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

function StarRating({ value }: { value: number | null }) {
  const rating = Math.max(0, Math.min(5, Number(value ?? 0)));

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;
        return (
          <svg key={index} viewBox="0 0 20 20" fill={filled ? "#ffb648" : "none"} className="size-4" aria-hidden="true">
            <path
              d="m10 2.2 2.38 4.82 5.32.77-3.85 3.75.9 5.3L10 14.35 5.25 16.84l.9-5.3L2.3 7.8l5.32-.77L10 2.2Z"
              stroke={filled ? "#ffb648" : "#d1d5db"}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
      <span className="ml-2 text-[13px] font-bold text-[#202224]">{rating}/5</span>
    </div>
  );
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rating?: string; provider?: string }>;
}) {
  const params = await searchParams;
  const [reviews, providers] = await Promise.all([listReviews(), listProviders()]);

  const keyword = params.q?.trim().toLowerCase() ?? "";
  const ratingFilter = params.rating?.trim() ?? "";
  const providerFilter = params.provider?.trim() ?? "";

  const filteredReviews = reviews.filter((review) => {
    const haystack = [
      review.maDanhGia,
      review.tenNguoiDung ?? "",
      review.maNguoiDung,
      review.tenTour ?? "",
      review.tenNhaCungCap ?? "",
      review.binhLuan ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = keyword.length === 0 || haystack.includes(keyword);
    const matchesRating = ratingFilter.length === 0 || String(review.soSao ?? 0) === ratingFilter;
    const matchesProvider = providerFilter.length === 0 || (review.maNhaCungCap ?? "") === providerFilter;

    return matchesKeyword && matchesRating && matchesProvider;
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0 ? 0 : reviews.reduce((sum, review) => sum + Number(review.soSao ?? 0), 0) / totalReviews;
  const fiveStarCount = reviews.filter((review) => Number(review.soSao ?? 0) === 5).length;
  const lowRatingCount = reviews.filter((review) => Number(review.soSao ?? 0) <= 2).length;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Quản lý đánh giá</h2>
        <p className="mt-2 text-[15px] text-[#6b7280]">
          Theo dõi toàn bộ đánh giá hợp lệ từ bảng <span className="font-semibold text-[#202224]">danhgia</span> và các liên kết tour, nhà cung cấp, khách hàng.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-4">
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Tổng đánh giá</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{totalReviews}</p>
        </article>
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Điểm trung bình</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{averageRating.toFixed(1)}</p>
        </article>
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">5 sao</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{fiveStarCount}</p>
        </article>
        <article className="rounded-[14px] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(226,232,240,0.55)]">
          <p className="text-[15px] font-semibold text-[#202224]">Đánh giá thấp</p>
          <p className="mt-2 text-[34px] font-bold leading-none text-[#202224]">{lowRatingCount}</p>
        </article>
      </section>

      <ReviewFilterBar
        initialKeyword={params.q ?? ""}
        initialRating={ratingFilter}
        initialProvider={providerFilter}
        ratingOptions={[
          { value: "", label: "Tất cả số sao" },
          { value: "5", label: "5 sao" },
          { value: "4", label: "4 sao" },
          { value: "3", label: "3 sao" },
          { value: "2", label: "2 sao" },
          { value: "1", label: "1 sao" },
        ]}
        providerOptions={[
          { value: "", label: "Tất cả nhà cung cấp" },
          ...providers.map((provider) => ({
            value: provider.maNhaCungCap,
            label: provider.tenNhaCungCap ?? provider.maNhaCungCap,
          })),
        ]}
      />

      <section className="overflow-hidden rounded-[14px] border border-[#d5d5d5] bg-white shadow-[0_16px_40px_rgba(226,232,240,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-4 py-4 text-left font-extrabold">Mã đánh giá</th>
                <th className="px-4 py-4 text-left font-extrabold">Khách hàng</th>
                <th className="px-4 py-4 text-left font-extrabold">Tour</th>
                <th className="px-4 py-4 text-left font-extrabold">Đánh giá</th>
                <th className="px-4 py-4 text-left font-extrabold">Bình luận</th>
                <th className="px-4 py-4 text-left font-extrabold">Ngày đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Không có đánh giá phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.maDanhGia} className="border-b border-[#eceef2] last:border-b-0">
                    <td className="px-4 py-4 font-semibold">{review.maDanhGia}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#202224]">{review.tenNguoiDung ?? review.maNguoiDung}</p>
                      <p className="mt-1 text-[12px] text-[#6b7280]">{review.maNguoiDung}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#202224]">{review.tenTour ?? review.maTour}</p>
                      <p className="mt-1 text-[12px] text-[#6b7280]">{review.tenNhaCungCap ?? review.maNhaCungCap ?? "Chưa cập nhật"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StarRating value={review.soSao} />
                    </td>
                    <td className="px-4 py-4 text-[13px] leading-6 text-[#4b5563]">
                      <p className="line-clamp-3">{review.binhLuan ?? "Không có bình luận."}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold opacity-90">{formatDateTime(review.ngayDanhGia)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3 text-[14px] text-[rgba(32,34,36,0.6)] md:flex-row md:items-center md:justify-between">
        <p>
          Hiển thị {filteredReviews.length === 0 ? 0 : 1} - {filteredReviews.length} của {reviews.length}
        </p>
        <div className="inline-flex items-center rounded-[8px] border border-[#d5d5d5] bg-[#fafbfd] px-4 py-2 text-[#202224]/60">
          Trang 1
        </div>
      </section>
    </div>
  );
}
