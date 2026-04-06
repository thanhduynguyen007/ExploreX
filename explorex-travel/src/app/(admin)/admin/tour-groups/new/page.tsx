import { TourGroupForm } from "@/components/forms/tour-group-form";

export default async function AdminNewTourGroupPage() {
  return (
    <div className="space-y-7">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Tạo danh mục</h2>
      </section>

      <TourGroupForm mode="create" />
    </div>
  );
}
