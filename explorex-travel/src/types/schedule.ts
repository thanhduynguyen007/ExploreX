import type { SCHEDULE_STATUSES } from "@/lib/constants/statuses";

export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number];

export type Schedule = {
  maLichTour: string;
  maTour: string;
  maNhaCungCap?: string | null;
  maNguoiDung?: string | null;
  tenTour?: string | null;
  tenNhaCungCap?: string | null;
  ngayBatDau: string | Date | null;
  soChoTrong: number | null;
  tongChoNgoi: number | null;
  trangThai: ScheduleStatus;
  giaTour: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};
