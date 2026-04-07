import { TourGroupForm } from "@/components/forms/tour-group-form";
import { getNextTourGroupId } from "@/services/tour-group.service";

export default async function AdminNewTourGroupPage() {
  const nextTourGroupId = await getNextTourGroupId();

  return (
    <div className="space-y-7">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Tạo danh mục</h2>
      </section>

      <TourGroupForm mode="create" initialValue={{ maNhomTour: nextTourGroupId, tenNhomTour: "", moTaTour: "", trangThai: "ACTIVE" }} />
    </div>
  );
}
