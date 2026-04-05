import type { TOUR_STATUSES } from "@/lib/constants/statuses";

export type TourStatus = (typeof TOUR_STATUSES)[number];

export type Tour = {
  maTour: string;
  maNhaCungCap: string;
  maNguoiDung?: string | null;
  maNhomTour: string;
  tenTour: string;
  tenNhomTour?: string | null;
  tenNhaCungCap?: string | null;
  moTa: string | null;
  thoiLuong: string | null;
  sLKhachToiDa: number | null;
  trangThai: TourStatus;
  loaiTour: string | null;
  hinhAnh: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ProviderProfile = {
  maNhaCungCap: string;
  maNguoiDung: string | null;
  tenNhaCungCap: string | null;
  trangThaiHopTac: string | null;
};

export type PublicTourSummary = {
  maTour: string;
  maNhomTour: string;
  tenTour: string;
  tenNhomTour: string | null;
  tenNhaCungCap: string | null;
  moTa: string | null;
  thoiLuong: string | null;
  loaiTour: string | null;
  hinhAnh: string | null;
  minGiaTour: number | null;
  nextNgayBatDau: string | Date | null;
  avgRating: number | null;
  totalReviews: number;
};

export type PublicTourDetail = PublicTourSummary & {
  sLKhachToiDa: number | null;
  schedules: Array<{
    maLichTour: string;
    ngayBatDau: string | Date | null;
    soChoTrong: number | null;
    tongChoNgoi: number | null;
    trangThai: string | null;
    giaTour: number | null;
  }>;
};
