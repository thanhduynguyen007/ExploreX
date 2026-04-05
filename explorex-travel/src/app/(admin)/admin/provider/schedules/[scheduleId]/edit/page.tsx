import { redirect } from "next/navigation";

import { ScheduleForm } from "@/components/forms/schedule-form";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { listTours, getProviderProfileByUserId } from "@/services/tour.service";
import { getScheduleDetail } from "@/services/schedule.service";

const toDateTimeLocalValue = (value: string | Date | null) => {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export default async function ProviderAdminEditSchedulePage({
  params,
}: {
  params: Promise<{ scheduleId: string }>;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id);
  const { scheduleId } = await params;
  const [schedule, tours] = await Promise.all([
    getScheduleDetail(scheduleId, { maNhaCungCap: provider.maNhaCungCap }),
    listTours({ maNhaCungCap: provider.maNhaCungCap }),
  ]);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title={`Chỉnh sửa lịch ${schedule.maLichTour}`}
        description="Lịch khởi hành được ràng buộc với tour thuộc quyền sở hữu của đối tác. Backend sẽ chặn mọi trường hợp sửa sai phạm vi."
      />

      <ScheduleForm
        mode="edit"
        endpoint={`/api/admin/provider/schedules/${schedule.maLichTour}`}
        redirectTo="/admin/provider/schedules"
        cancelHref="/admin/provider/schedules"
        submitLabel="Lưu thay đổi"
        tours={tours.map((tour) => ({
          maTour: tour.maTour,
          tenTour: tour.tenTour,
        }))}
        initialValues={{
          maLichTour: schedule.maLichTour,
          maTour: schedule.maTour,
          ngayBatDau: toDateTimeLocalValue(schedule.ngayBatDau),
          soChoTrong: schedule.soChoTrong ?? 0,
          tongChoNgoi: schedule.tongChoNgoi ?? 0,
          trangThai: schedule.trangThai,
          giaTour: schedule.giaTour ?? 0,
        }}
      />
    </div>
  );
}
