import * as yup from "yup";

export const tourGroupSchema = yup
  .object({
    maNhomTour: yup.string().trim().required("Mã nhóm tour là bắt buộc").max(50, "Mã nhóm tour tối đa 50 ký tự"),
    tenNhomTour: yup.string().trim().required("Tên nhóm tour là bắt buộc").max(255, "Tên nhóm tour quá dài"),
    moTaTour: yup.string().nullable().default(""),
  })
  .required();

export type TourGroupInput = yup.InferType<typeof tourGroupSchema>;

export const updateTourGroupSchema = yup
  .object({
    tenNhomTour: yup.string().trim().required("Tên nhóm tour là bắt buộc").max(255, "Tên nhóm tour quá dài"),
    moTaTour: yup.string().nullable().default(""),
    trangThai: yup.mixed<"ACTIVE" | "INACTIVE">().oneOf(["ACTIVE", "INACTIVE"], "Trạng thái không hợp lệ").required(),
  })
  .required();

export type UpdateTourGroupInput = yup.InferType<typeof updateTourGroupSchema>;
