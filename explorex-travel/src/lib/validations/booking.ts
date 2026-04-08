import * as yup from "yup";

import { BOOKING_STATUSES, PAYMENT_STATUSES } from "@/lib/constants/statuses";

export const PAYMENT_METHODS = ["OFFLINE", "VNPAY"] as const;

const normalizeNumber = (value: number, originalValue: unknown) => {
  if (originalValue === "" || originalValue === null || originalValue === undefined) {
    return Number.NaN;
  }

  return value;
};

export const createBookingSchema = yup
  .object({
    maDatTour: yup.string().trim().required("Mã đặt tour là bắt buộc").max(254, "Mã đặt tour quá dài"),
    maLichTour: yup.string().trim().required("Lịch khởi hành là bắt buộc").max(254, "Mã lịch quá dài"),
    soNguoi: yup
      .number()
      .transform(normalizeNumber)
      .typeError("Số người phải là số")
      .integer("Số người phải là số nguyên")
      .min(1, "Số người phải lớn hơn 0")
      .required("Số người là bắt buộc"),
    ghiChu: yup.string().trim().nullable().default(""),
    paymentMethod: yup
      .mixed<(typeof PAYMENT_METHODS)[number]>()
      .oneOf(PAYMENT_METHODS, "Phương thức thanh toán không hợp lệ")
      .default("OFFLINE")
      .required(),
  })
  .required();

export const updateBookingStatusSchema = yup
  .object({
    trangThaiDatTour: yup.mixed<(typeof BOOKING_STATUSES)[number]>().oneOf(BOOKING_STATUSES, "Trạng thái đặt tour không hợp lệ").required(),
    trangThaiThanhToan: yup
      .mixed<(typeof PAYMENT_STATUSES)[number]>()
      .oneOf(PAYMENT_STATUSES, "Trạng thái thanh toán không hợp lệ")
      .required(),
    ghiChu: yup.string().trim().nullable().default(""),
  })
  .required();

export type CreateBookingInput = yup.InferType<typeof createBookingSchema>;
export type UpdateBookingStatusInput = yup.InferType<typeof updateBookingStatusSchema>;
