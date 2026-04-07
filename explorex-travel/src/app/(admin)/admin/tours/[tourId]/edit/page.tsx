import { TourReviewForm } from "@/components/forms/tour-review-form";
import { getTourDetail } from "@/services/tour.service";

export default async function AdminEditTourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;
  const tour = await getTourDetail(tourId);

  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Duyệt tour đối tác</h2>
        <p className="max-w-3xl text-[15px] leading-8 text-[#6b7280]">
          Admin chỉ duyệt trạng thái công khai của tour <span className="font-semibold text-[#202224]">{tour.maTour}</span>. Nội dung chi tiết,
          mô tả và hình ảnh do nhà cung cấp tự quản lý.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
          <p className="text-[13px] font-semibold text-[#7b8190]">Mã tour</p>
          <p className="mt-2 text-[16px] font-bold text-[#202224]">{tour.maTour}</p>
        </article>
        <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
          <p className="text-[13px] font-semibold text-[#7b8190]">Tên tour</p>
          <p className="mt-2 text-[16px] font-bold text-[#202224]">{tour.tenTour}</p>
        </article>
        <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
          <p className="text-[13px] font-semibold text-[#7b8190]">Nhà cung cấp</p>
          <p className="mt-2 text-[16px] font-bold text-[#202224]">{tour.tenNhaCungCap ?? tour.maNhaCungCap}</p>
        </article>
        <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
          <p className="text-[13px] font-semibold text-[#7b8190]">Danh mục</p>
          <p className="mt-2 text-[16px] font-bold text-[#202224]">{tour.tenNhomTour ?? tour.maNhomTour}</p>
        </article>
      </section>

      <TourReviewForm endpoint={`/api/admin/tours/${tour.maTour}`} cancelHref="/admin/tours" initialStatus={tour.trangThai} />
    </div>
  );
}
