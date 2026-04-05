import { redirect } from "next/navigation";

import { TourForm } from "@/components/forms/tour-form";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { listTourGroups } from "@/services/tour-group.service";
import { getProviderProfileByUserId } from "@/services/tour.service";

export default async function ProviderAdminNewTourPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  await getProviderProfileByUserId(user.id);
  const tourGroups = await listTourGroups();

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title="Tạo tour mới"
        description="Form này đủ để test luồng backend tạo tour thật. Tour sau khi tạo có thể để bản nháp hoặc chuyển sang chờ duyệt."
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
      />
    </div>
  );
}
