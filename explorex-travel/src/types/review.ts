export type Review = {
  maDanhGia: string;
  maTour: string | null;
  maNguoiDung: string;
  maNhaCungCap?: string | null;
  tenNguoiDung?: string | null;
  tenTour?: string | null;
  tenNhaCungCap?: string | null;
  soSao: number | null;
  binhLuan: string | null;
  ngayDanhGia: string | Date | null;
};
