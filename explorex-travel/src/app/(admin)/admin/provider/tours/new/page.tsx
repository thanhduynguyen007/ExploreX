import { TourForm } from "@/components/forms/tour-form";
import { ProviderPageHeader } from "@/components/provider/provider-ui";
import { getProviderAdminAccess } from "@/lib/auth/provider-admin";
import { listTourGroups } from "@/services/tour-group.service";
import { getNextTourId } from "@/services/tour.service";

export default async function ProviderAdminNewTourPage() {
  await getProviderAdminAccess();
  const [tourGroups, nextTourId] = await Promise.all([listTourGroups(), getNextTourId()]);

  return (
    <div className="space-y-6">
      <ProviderPageHeader
        eyebrow="Tạo tour"
        title="Tạo tour mới"
        description="Bạn có thể lưu tour ở trạng thái bản nháp, chuyển sang chờ duyệt hoặc ẩn tour trong phạm vi các trạng thái mà provider được phép thao tác."
      />

      <TourForm
        mode="create"
        endpoint="/api/admin/provider/tours"
        redirectTo="/admin/provider/tours"
        cancelHref="/admin/provider/tours"
        submitLabel="Tạo tour"
        tourGroups={tourGroups.map((item) => ({
          maNhomTour: item.maNhomTour,
          tenNhomTour: item.tenNhomTour,
        }))}
        initialValues={{
          maTour: nextTourId,
          maNhomTour: tourGroups[0]?.maNhomTour ?? "",
          tenTour: "",
          moTa: "",
          thoiLuong: "",
          sLKhachToiDa: 20,
          trangThai: "DRAFT",
          loaiTour: "",
          hinhAnh: "",
        }}
      />
    </div>
  );
}
