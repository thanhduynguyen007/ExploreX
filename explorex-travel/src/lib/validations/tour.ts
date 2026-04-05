import * as yup from "yup";

import { TOUR_STATUSES } from "@/lib/constants/statuses";

const baseTourSchema = {
  maNhomTour: yup.string().trim().required("Nhóm tour là bắt buộc").max(254, "Mã nhóm tour quá dài"),
  tenTour: yup.string().trim().required("Tên tour là bắt buộc").max(254, "Tên tour quá dài"),
  moTa: yup.string().trim().nullable().default(""),
  thoiLuong: yup.string().trim().required("Thời lượng tour là bắt buộc").max(254, "Thời lượng quá dài"),
  sLKhachToiDa: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || originalValue === undefined) {
        return Number.NaN;
      }

      return value;
    })
    .typeError("Số lượng khách tối đa phải là số")
    .integer("Số lượng khách tối đa phải là số nguyên")
    .min(1, "Số lượng khách tối đa phải lớn hơn 0")
    .required("Số lượng khách tối đa là bắt buộc"),
  loaiTour: yup.string().trim().required("Loại tour là bắt buộc").max(254, "Loại tour quá dài"),
  hinhAnh: yup.string().trim().nullable().default(""),
};

export const providerEditableTourStatuses = ["DRAFT", "PENDING_REVIEW", "HIDDEN"] as const;

export const createTourByProviderSchema = yup
  .object({
    maTour: yup.string().trim().required("Mã tour là bắt buộc").max(254, "Mã tour quá dài"),
    ...baseTourSchema,
    trangThai: yup
      .mixed<(typeof providerEditableTourStatuses)[number]>()
      .oneOf(providerEditableTourStatuses, "Trạng thái tour không hợp lệ")
      .default("DRAFT"),
  })
  .required();

export const updateTourByProviderSchema = yup
  .object({
    ...baseTourSchema,
    trangThai: yup
      .mixed<(typeof providerEditableTourStatuses)[number]>()
      .oneOf(providerEditableTourStatuses, "Trạng thái tour không hợp lệ")
      .default("DRAFT"),
  })
  .required();

export const createTourByAdminSchema = yup
  .object({
    maTour: yup.string().trim().required("Mã tour là bắt buộc").max(254, "Mã tour quá dài"),
    maNhaCungCap: yup.string().trim().required("Nhà cung cấp là bắt buộc").max(254, "Mã nhà cung cấp quá dài"),
    ...baseTourSchema,
    trangThai: yup.mixed<(typeof TOUR_STATUSES)[number]>().oneOf(TOUR_STATUSES, "Trạng thái tour không hợp lệ").default("DRAFT"),
  })
  .required();

export const updateTourByAdminSchema = yup
  .object({
    maNhaCungCap: yup.string().trim().required("Nhà cung cấp là bắt buộc").max(254, "Mã nhà cung cấp quá dài"),
    ...baseTourSchema,
    trangThai: yup.mixed<(typeof TOUR_STATUSES)[number]>().oneOf(TOUR_STATUSES, "Trạng thái tour không hợp lệ").default("DRAFT"),
  })
  .required();

export type CreateTourByProviderInput = yup.InferType<typeof createTourByProviderSchema>;
export type UpdateTourByProviderInput = yup.InferType<typeof updateTourByProviderSchema>;
export type CreateTourByAdminInput = yup.InferType<typeof createTourByAdminSchema>;
export type UpdateTourByAdminInput = yup.InferType<typeof updateTourByAdminSchema>;
