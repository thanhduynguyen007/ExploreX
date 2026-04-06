export type ProviderSummary = {
  maNhaCungCap: string;
  tenNhaCungCap: string | null;
  trangThaiHopTac: string | null;
  thongTinNhaCungCap: string | null;
  diaChi: string | null;
  loaiDichVu: string | null;
  totalTours: number;
  publishedTours: number;
  totalBookings: number;
  totalRevenue: number;
  totalReviews: number;
  avgRating: number | null;
};

export type ProviderDetail = ProviderSummary & {
  recentTours: Array<{
    maTour: string;
    tenTour: string | null;
    trangThai: string | null;
    tenNhomTour: string | null;
  }>;
  recentBookings: Array<{
    maDatTour: string;
    tenTour: string | null;
    ngayDat: string | Date | null;
    tongTien: number | null;
    trangThaiDatTour: string | null;
  }>;
};
