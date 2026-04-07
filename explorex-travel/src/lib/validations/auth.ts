import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    password: yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Mật khẩu là bắt buộc"),
  })
  .required();

export type LoginInput = yup.InferType<typeof loginSchema>;

const passwordSchema = yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Mật khẩu là bắt buộc");

export const customerRegisterSchema = yup
  .object({
    tenNguoiDung: yup.string().trim().required("Họ và tên là bắt buộc"),
    email: yup.string().trim().email("Email không hợp lệ").required("Email là bắt buộc"),
    password: passwordSchema,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Xác nhận mật khẩu không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
    soDienThoai: yup.string().trim().nullable().default(""),
    diaChi: yup.string().trim().nullable().default(""),
  })
  .required();

export type CustomerRegisterInput = yup.InferType<typeof customerRegisterSchema>;

export const providerRegisterSchema = yup
  .object({
    tenNguoiDung: yup.string().trim().required("Người đại diện là bắt buộc"),
    email: yup.string().trim().email("Email không hợp lệ").required("Email là bắt buộc"),
    password: passwordSchema,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Xác nhận mật khẩu không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
    tenNhaCungCap: yup.string().trim().required("Tên đối tác là bắt buộc"),
    soDienThoai: yup.string().trim().nullable().default(""),
    diaChi: yup.string().trim().nullable().default(""),
    loaiDichVu: yup.string().trim().nullable().default(""),
    thongTinNhaCungCap: yup.string().trim().nullable().default(""),
  })
  .required();

export type ProviderRegisterInput = yup.InferType<typeof providerRegisterSchema>;
