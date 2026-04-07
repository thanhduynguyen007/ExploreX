import * as yup from "yup";

const normalizeNullable = (value: string, originalValue: unknown) => {
  if (typeof originalValue !== "string") {
    return originalValue;
  }

  const trimmed = originalValue.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const updateCustomerProfileSchema = yup
  .object({
    tenNguoiDung: yup.string().trim().required("Họ tên là bắt buộc").max(255, "Họ tên quá dài"),
    email: yup.string().trim().email("Email không hợp lệ").required("Email là bắt buộc").max(255, "Email quá dài"),
    diaChi: yup.string().transform(normalizeNullable).nullable().max(255, "Địa chỉ quá dài"),
    soDienThoai: yup.string().transform(normalizeNullable).nullable().max(30, "Số điện thoại quá dài"),
  })
  .required();

export type UpdateCustomerProfileInput = yup.InferType<typeof updateCustomerProfileSchema>;
