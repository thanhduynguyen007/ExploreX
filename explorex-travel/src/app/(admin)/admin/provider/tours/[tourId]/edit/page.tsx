import { TourForm } from "@/components/forms/tour-form";
import { ProviderPageHeader } from "@/components/provider/provider-ui";
import { getProviderAdminAccess } from "@/lib/auth/provider-admin";
import { listTourGroups } from "@/services/tour-group.service";
import { getTourDetail } from "@/services/tour.service";

export default async function ProviderAdminEditTourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { provider } = await getProviderAdminAccess();
  const { tourId } = await params;
  const [tour, tourGroups] = await Promise.all([
    getTourDetail(tourId, { maNhaCungCap: provider.maNhaCungCap }),
    listTourGroups(),
  ]);

  return (
    <div className="space-y-6">
      <ProviderPageHeader
        eyebrow="Chỉnh sửa tour"
        title={`Cập nhật ${tour.maTour}`}
        description="Bạn có thể chỉnh nội dung tour của chính mình. Nếu tour đang hiển thị công khai, form sẽ đưa trạng thái về bản nháp để bạn chỉnh sửa an toàn rồi gửi duyệt lại."
      />

      <TourForm
        mode="edit"
        endpoint={`/api/admin/provider/tours/${tour.maTour}`}
        redirectTo="/admin/provider/tours"
        cancelHref={`/admin/provider/tours/${tour.maTour}`}
        submitLabel="Lưu thay đổi"
        tourGroups={tourGroups.map((item) => ({
          maNhomTour: item.maNhomTour,
          tenNhomTour: item.tenNhomTour,
        }))}
        initialValues={{
          maTour: tour.maTour,
          maNhomTour: tour.maNhomTour,
          tenTour: tour.tenTour,
          moTa: tour.moTa ?? "",
          thoiLuong: tour.thoiLuong ?? "",
          sLKhachToiDa: tour.sLKhachToiDa ?? 1,
          trangThai: tour.trangThai === "PUBLISHED" || tour.trangThai === "INACTIVE" ? "DRAFT" : tour.trangThai,
          loaiTour: tour.loaiTour ?? "",
          hinhAnh: tour.hinhAnh ?? "",
        }}
      />
    </div>
  );
}
