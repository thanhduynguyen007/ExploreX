import { TourForm } from "@/components/forms/tour-form";
import { listTourGroups } from "@/services/tour-group.service";
import { getNextTourId, listProviders } from "@/services/tour.service";

export default async function AdminNewTourPage() {
  const [tourGroups, providers, nextTourId] = await Promise.all([listTourGroups(), listProviders(), getNextTourId()]);

  return (
    <div className="space-y-7">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Tạo tour</h2>
      </section>

      <TourForm
        mode="create"
        scope="admin"
        endpoint="/api/admin/tours"
        redirectTo="/admin/tours"
        cancelHref="/admin/tours"
        submitLabel="Tạo mới"
        tourGroups={tourGroups.map((item) => ({
          maNhomTour: item.maNhomTour,
          tenNhomTour: item.tenNhomTour,
        }))}
        providerOptions={providers.map((item) => ({
          maNhaCungCap: item.maNhaCungCap,
          tenNhaCungCap: item.tenNhaCungCap,
        }))}
        initialValues={{
          maTour: nextTourId,
          maNhomTour: tourGroups[0]?.maNhomTour ?? "",
          maNhaCungCap: providers[0]?.maNhaCungCap ?? "",
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
