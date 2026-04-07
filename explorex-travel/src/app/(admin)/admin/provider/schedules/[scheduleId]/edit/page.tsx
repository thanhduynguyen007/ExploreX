import { redirect } from "next/navigation";

import { ScheduleForm } from "@/components/forms/schedule-form";
import { ProviderPageHeader } from "@/components/provider/provider-ui";
import { getSessionUser } from "@/lib/auth/session";
import { getProviderProfileByUserId, listTours } from "@/services/tour.service";
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
      <ProviderPageHeader
        eyebrow="Chỉnh sửa lịch"
        title={`Cập nhật ${schedule.maLichTour}`}
        description="Lịch khởi hành chỉ được phép chuyển giữa các tour thuộc cùng provider. Mọi cập nhật sai phạm vi sẽ bị backend chặn."
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
