import * as yup from "yup";

const accountStatuses = ["ACTIVE", "PENDING", "SUSPENDED", "DISABLED"] as const;
const adminPermissions = ["FULL_ACCESS"] as const;

export const adminAccountCreateSchema = yup
  .object({
    maNguoiDung: yup.string().trim().required("Mã người dùng là bắt buộc").max(254, "Mã người dùng quá dài"),
    tenNguoiDung: yup.string().trim().required("Tên người dùng là bắt buộc").max(254, "Tên người dùng quá dài"),
    email: yup.string().trim().email("Email không hợp lệ").required("Email là bắt buộc").max(254, "Email quá dài"),
    trangThaiTaiKhoan: yup
      .mixed<(typeof accountStatuses)[number]>()
      .oneOf(accountStatuses, "Trạng thái tài khoản không hợp lệ")
      .required("Trạng thái tài khoản là bắt buộc"),
    password: yup.string().trim().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Mật khẩu là bắt buộc"),
    chucVu: yup.string().trim().nullable().max(254, "Chức vụ quá dài").default(null),
    quyenHan: yup
      .mixed<(typeof adminPermissions)[number]>()
      .oneOf(adminPermissions, "Quyền hạn không hợp lệ")
      .required("Quyền hạn là bắt buộc"),
  })
  .required();

export const adminAccountUpdateSchema = yup
  .object({
    tenNguoiDung: yup.string().trim().required("Tên người dùng là bắt buộc").max(254, "Tên người dùng quá dài"),
    email: yup.string().trim().email("Email không hợp lệ").required("Email là bắt buộc").max(254, "Email quá dài"),
    trangThaiTaiKhoan: yup
      .mixed<(typeof accountStatuses)[number]>()
      .oneOf(accountStatuses, "Trạng thái tài khoản không hợp lệ")
      .required("Trạng thái tài khoản là bắt buộc"),
    password: yup.string().trim().min(6, "Mật khẩu tối thiểu 6 ký tự").optional(),
    chucVu: yup.string().trim().nullable().max(254, "Chức vụ quá dài").default(null),
    quyenHan: yup
      .mixed<(typeof adminPermissions)[number]>()
      .oneOf(adminPermissions, "Quyền hạn không hợp lệ")
      .required("Quyền hạn là bắt buộc"),
  })
  .required();

export type CreateAdminAccountInput = yup.InferType<typeof adminAccountCreateSchema>;
export type UpdateAdminAccountInput = yup.InferType<typeof adminAccountUpdateSchema>;
