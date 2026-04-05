import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { getTourDetail } from "@/services/tour.service";

export default async function AdminTourDetailPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;
  const tour = await getTourDetail(tourId);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title={tour.tenTour}
        description="Admin xem dữ liệu tour thật từ MySQL và có thể dùng API quản trị để duyệt, cập nhật hoặc ẩn tour."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Mã tour" description={tour.maTour} />
        <InfoCard title="Nhóm tour" description={tour.tenNhomTour ?? tour.maNhomTour} />
        <InfoCard title="Nhà cung cấp" description={tour.tenNhaCungCap ?? tour.maNhaCungCap} />
        <InfoCard title="Trạng thái" description={tour.trangThai} />
      </div>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Thông tin chi tiết</h2>
        <dl className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-stone-500">Loại tour</dt>
            <dd className="mt-1 text-sm text-stone-800">{tour.loaiTour ?? "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">Thời lượng</dt>
            <dd className="mt-1 text-sm text-stone-800">{tour.thoiLuong ?? "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">Số khách tối đa</dt>
            <dd className="mt-1 text-sm text-stone-800">{tour.sLKhachToiDa ?? 0} khách</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">Hình ảnh</dt>
            <dd className="mt-1 break-all text-sm text-stone-800">{tour.hinhAnh ?? "Chưa cập nhật"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-stone-500">Mô tả</dt>
            <dd className="mt-1 text-sm leading-7 text-stone-800">{tour.moTa ?? "Chưa có mô tả cho tour này."}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
