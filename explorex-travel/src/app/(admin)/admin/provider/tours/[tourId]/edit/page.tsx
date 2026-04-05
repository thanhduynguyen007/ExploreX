import { redirect } from "next/navigation";

import { TourForm } from "@/components/forms/tour-form";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { listTourGroups } from "@/services/tour-group.service";
import { getProviderProfileByUserId, getTourDetail } from "@/services/tour.service";

export default async function ProviderAdminEditTourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id);
  const { tourId } = await params;
  const [tour, tourGroups] = await Promise.all([
    getTourDetail(tourId, { maNhaCungCap: provider.maNhaCungCap }),
    listTourGroups(),
  ]);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title={`Chỉnh sửa tour ${tour.maTour}`}
        description="Mọi thao tác cập nhật đều đi qua API có kiểm tra role và ownership ở backend. Frontend chỉ hỗ trợ nhập liệu."
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
