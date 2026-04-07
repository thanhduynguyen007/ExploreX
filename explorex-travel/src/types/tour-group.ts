export type TourGroupStatus = "ACTIVE" | "INACTIVE";

export type TourGroup = {
  maNhomTour: string;
  tenNhomTour: string;
  moTaTour: string | null;
  trangThai: TourGroupStatus;
  hinhAnhDaiDien?: string | null;
};
