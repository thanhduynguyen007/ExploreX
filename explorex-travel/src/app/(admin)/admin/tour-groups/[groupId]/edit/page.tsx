import { TourGroupForm } from "@/components/forms/tour-group-form";
import { getTourGroupById } from "@/services/tour-group.service";

type AdminEditTourGroupPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function AdminEditTourGroupPage({ params }: AdminEditTourGroupPageProps) {
  const { groupId } = await params;
  const tourGroup = await getTourGroupById(groupId);

  return (
    <div className="space-y-7">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Chỉnh sửa danh mục</h2>
      </section>

      <TourGroupForm mode="edit" initialValue={tourGroup} />
    </div>
  );
}
