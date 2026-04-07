export type AdminAccount = {
  maNguoiDung: string;
  tenNguoiDung: string | null;
  email: string | null;
  trangThaiTaiKhoan: string | null;
  chucVu: string | null;
  quyenHan: string | null;
  isCustomer: boolean;
  totalBookings: number;
  totalReviews: number;
};
