import { TourGroupForm } from "@/components/forms/tour-group-form";

export default function AdminNewTourGroupPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">Thêm danh mục</h2>
        <p className="mt-2 text-sm text-slate-500">Tạo danh mục tour mới theo đúng cấu trúc quản trị của hệ thống.</p>
      </section>

      <TourGroupForm mode="create" />
    </div>
  );
}
