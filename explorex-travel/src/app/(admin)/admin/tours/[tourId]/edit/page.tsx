import { TourForm } from "@/components/forms/tour-form";
import { listTourGroups } from "@/services/tour-group.service";
import { getTourDetail, listProviders } from "@/services/tour.service";

export default async function AdminEditTourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;
  const [tour, tourGroups, providers] = await Promise.all([getTourDetail(tourId), listTourGroups(), listProviders()]);

  return (
    <div className="space-y-7">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Chỉnh sửa tour</h2>
      </section>

      <TourForm
        mode="edit"
        scope="admin"
        endpoint={`/api/admin/tours/${tour.maTour}`}
        redirectTo="/admin/tours"
        cancelHref="/admin/tours"
        submitLabel="Lưu thay đổi"
        tourGroups={tourGroups.map((item) => ({
          maNhomTour: item.maNhomTour,
          tenNhomTour: item.tenNhomTour,
        }))}
        providerOptions={providers.map((item) => ({
          maNhaCungCap: item.maNhaCungCap,
          tenNhaCungCap: item.tenNhaCungCap,
        }))}
        initialValues={{
          maTour: tour.maTour,
          maNhaCungCap: tour.maNhaCungCap,
          maNhomTour: tour.maNhomTour,
          tenTour: tour.tenTour,
          moTa: tour.moTa ?? "",
          thoiLuong: tour.thoiLuong ?? "",
          sLKhachToiDa: tour.sLKhachToiDa ?? 1,
          trangThai: tour.trangThai,
          loaiTour: tour.loaiTour ?? "",
          hinhAnh: tour.hinhAnh ?? "",
        }}
      />
    </div>
  );
}
