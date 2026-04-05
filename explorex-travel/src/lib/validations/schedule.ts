import * as yup from "yup";

import { SCHEDULE_STATUSES } from "@/lib/constants/statuses";

const normalizeNumber = (value: number, originalValue: unknown) => {
  if (originalValue === "" || originalValue === null || originalValue === undefined) {
    return Number.NaN;
  }

  return value;
};

const scheduleShape = {
  maTour: yup.string().trim().required("Tour là bắt buộc").max(254, "Mã tour quá dài"),
  ngayBatDau: yup
    .string()
    .trim()
    .required("Ngày khởi hành là bắt buộc")
    .test("valid-datetime", "Ngày khởi hành không hợp lệ", (value) => Boolean(value && !Number.isNaN(Date.parse(value)))),
  tongChoNgoi: yup
    .number()
    .transform(normalizeNumber)
    .typeError("Tổng số chỗ phải là số")
    .integer("Tổng số chỗ phải là số nguyên")
    .min(1, "Tổng số chỗ phải lớn hơn 0")
    .required("Tổng số chỗ là bắt buộc"),
  soChoTrong: yup
    .number()
    .transform(normalizeNumber)
    .typeError("Số chỗ trống phải là số")
    .integer("Số chỗ trống phải là số nguyên")
    .min(0, "Số chỗ trống không được âm")
    .required("Số chỗ trống là bắt buộc"),
  trangThai: yup.mixed<(typeof SCHEDULE_STATUSES)[number]>().oneOf(SCHEDULE_STATUSES, "Trạng thái lịch không hợp lệ").default("OPEN"),
  giaTour: yup
    .number()
    .transform(normalizeNumber)
    .typeError("Giá tour phải là số")
    .min(0, "Giá tour không được âm")
    .required("Giá tour là bắt buộc"),
};

export const createScheduleSchema = yup
  .object({
    maLichTour: yup.string().trim().required("Mã lịch tour là bắt buộc").max(254, "Mã lịch tour quá dài"),
    ...scheduleShape,
  })
  .required()
  .test(
    "seats-valid-create",
    "Số chỗ trống không được lớn hơn tổng số chỗ",
    (value) => (value ? value.soChoTrong <= value.tongChoNgoi : false),
  );

export const updateScheduleSchema = yup
  .object(scheduleShape)
  .required()
  .test(
    "seats-valid-update",
    "Số chỗ trống không được lớn hơn tổng số chỗ",
    (value) => (value ? value.soChoTrong <= value.tongChoNgoi : false),
  );

export type CreateScheduleInput = yup.InferType<typeof createScheduleSchema>;
export type UpdateScheduleInput = yup.InferType<typeof updateScheduleSchema>;
