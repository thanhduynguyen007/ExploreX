import type { BOOKING_STATUSES, PAYMENT_STATUSES } from "@/lib/constants/statuses";

export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type Booking = {
  maDatTour: string;
  maLichTour: string;
  maTour?: string | null;
  maNguoiDung: string;
  maNhaCungCap?: string | null;
  tenNguoiDung?: string | null;
  email?: string | null;
  tenTour?: string | null;
  tenNhaCungCap?: string | null;
  ngayBatDau?: string | Date | null;
  ngayDat: string | Date | null;
  soNguoi: number | null;
  tongTien: number | null;
  trangThaiThanhToan: PaymentStatus;
  trangThaiDatTour: BookingStatus;
  ghiChu?: string | null;
};
