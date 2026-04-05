import { TourGroupForm } from "@/components/forms/tour-group-form";
import { getTourGroupById } from "@/services/tour-group.service";

type AdminEditTourGroupPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function AdminEditTourGroupPage({ params }: AdminEditTourGroupPageProps) {
  const { groupId } = await params;
  const tourGroup = await getTourGroupById(groupId);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">Chỉnh sửa danh mục</h2>
        <p className="mt-2 text-sm text-slate-500">
          Cập nhật thông tin hiển thị và trạng thái cho danh mục <span className="font-medium text-slate-700">{tourGroup.tenNhomTour}</span>.
        </p>
      </section>

      <TourGroupForm mode="edit" initialValue={tourGroup} />
    </div>
  );
}
