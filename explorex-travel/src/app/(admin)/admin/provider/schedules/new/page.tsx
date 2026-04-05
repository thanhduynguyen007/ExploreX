import { redirect } from "next/navigation";

import { ScheduleForm } from "@/components/forms/schedule-form";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { getProviderProfileByUserId, listTours } from "@/services/tour.service";

export default async function ProviderAdminNewSchedulePage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id);
  const tours = await listTours({ maNhaCungCap: provider.maNhaCungCap });

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title="Thêm lịch khởi hành"
        description="Form này phục vụ test luồng backend tạo lịch thật, bao gồm giá tour, số chỗ và ngày khởi hành."
      />

      <ScheduleForm
        mode="create"
        endpoint="/api/admin/provider/schedules"
        redirectTo="/admin/provider/schedules"
        cancelHref="/admin/provider/schedules"
        submitLabel="Tạo lịch khởi hành"
        tours={tours.map((tour) => ({
          maTour: tour.maTour,
          tenTour: tour.tenTour,
        }))}
      />
    </div>
  );
}
