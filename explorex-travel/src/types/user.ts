import type { UserRole } from "@/types/auth";

export type AdminUserRole = UserRole;

export type AdminUserSummary = {
  maNguoiDung: string;
  tenNguoiDung: string | null;
  email: string | null;
  trangThaiTaiKhoan: string | null;
  soDienThoai: string | null;
  diaChi: string | null;
  chucVu: string | null;
  quyenHan: string | null;
  isAdmin: boolean;
  isCustomer: boolean;
  isProvider: boolean;
  role: AdminUserRole;
  maNhaCungCap: string | null;
  tenNhaCungCap: string | null;
  trangThaiHopTac: string | null;
  loaiDichVu: string | null;
  totalBookings: number;
  totalReviews: number;
};

export type AdminUserDetail = AdminUserSummary & {
  recentBookings: Array<{
    maDatTour: string;
    tenTour: string | null;
    ngayDat: string | Date | null;
    tongTien: number | null;
    trangThaiDatTour: string | null;
  }>;
  recentReviews: Array<{
    maDanhGia: string;
    tenTour: string | null;
    soSao: number | null;
    binhLuan: string | null;
    ngayDanhGia: string | Date | null;
  }>;
};
