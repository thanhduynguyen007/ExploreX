import type { RowDataPacket } from "mysql2";

import { ApiRequestError } from "@/lib/auth/guards";
import { getDbPool } from "@/lib/db/mysql";
import type { ProviderDetail, ProviderSummary } from "@/types/provider";

type ProviderSummaryRow = RowDataPacket & ProviderSummary;
type ProviderRecentTourRow = RowDataPacket & ProviderDetail["recentTours"][number];
type ProviderRecentBookingRow = RowDataPacket & ProviderDetail["recentBookings"][number];

const providerSummarySelect = `
  p.maNhaCungCap,
  p.maNguoiDung,
  p.tenNhaCungCap,
  p.trangThaiHopTac,
  p.thongTinNhaCungCap,
  p.diaChi,
  p.soDienThoai,
  p.email,
  p.loaiDichVu,
  (
    SELECT COUNT(*)
    FROM \`tour\` t
    WHERE t.maNhaCungCap = p.maNhaCungCap
  ) AS totalTours,
  (
    SELECT COUNT(*)
    FROM \`tour\` t
    WHERE t.maNhaCungCap = p.maNhaCungCap
      AND COALESCE(t.trangThai, 'DRAFT') = 'PUBLISHED'
  ) AS publishedTours,
  (
    SELECT COUNT(*)
    FROM \`dattour\` b
    INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
    INNER JOIN \`tour\` t ON t.maTour = s.maTour
    WHERE t.maNhaCungCap = p.maNhaCungCap
  ) AS totalBookings,
  (
    SELECT COALESCE(SUM(b.tongTien), 0)
    FROM \`dattour\` b
    INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
    INNER JOIN \`tour\` t ON t.maTour = s.maTour
    WHERE t.maNhaCungCap = p.maNhaCungCap
  ) AS totalRevenue,
  (
    SELECT COUNT(*)
    FROM \`danhgia\` r
    INNER JOIN \`tour\` t ON t.maTour = r.maTour
    WHERE t.maNhaCungCap = p.maNhaCungCap
  ) AS totalReviews,
  (
    SELECT AVG(r.soSao)
    FROM \`danhgia\` r
    INNER JOIN \`tour\` t ON t.maTour = r.maTour
    WHERE t.maNhaCungCap = p.maNhaCungCap
  ) AS avgRating
`;

export const listAdminProviders = async (): Promise<ProviderSummary[]> => {
  const pool = getDbPool();
  const [rows] = await pool.query<ProviderSummaryRow[]>(
    `
      SELECT ${providerSummarySelect}
      FROM \`nhacungcaptour\` p
      ORDER BY p.tenNhaCungCap IS NULL, p.tenNhaCungCap ASC, p.maNhaCungCap ASC
    `,
  );

  return rows.map((row) => ({
    ...row,
    totalTours: Number(row.totalTours ?? 0),
    publishedTours: Number(row.publishedTours ?? 0),
    totalBookings: Number(row.totalBookings ?? 0),
    totalRevenue: Number(row.totalRevenue ?? 0),
    totalReviews: Number(row.totalReviews ?? 0),
    avgRating: row.avgRating == null ? null : Number(row.avgRating),
  }));
};

export const getAdminProviderDetail = async (maNhaCungCap: string): Promise<ProviderDetail> => {
  const pool = getDbPool();
  const [summaryRows] = await pool.query<ProviderSummaryRow[]>(
    `
      SELECT ${providerSummarySelect}
      FROM \`nhacungcaptour\` p
      WHERE p.maNhaCungCap = ?
      LIMIT 1
    `,
    [maNhaCungCap],
  );

  const provider = summaryRows[0];
  if (!provider) {
    throw new ApiRequestError("Không tìm thấy nhà cung cấp.", 404);
  }

  const [recentTours, recentBookings] = await Promise.all([
    pool.query<ProviderRecentTourRow[]>(
      `
        SELECT
          t.maTour,
          t.tenTour,
          COALESCE(t.trangThai, 'DRAFT') AS trangThai,
          g.tenNhomTour
        FROM \`tour\` t
        INNER JOIN \`nhomtour\` g ON g.maNhomTour = t.maNhomTour
        WHERE t.maNhaCungCap = ?
        ORDER BY t.maTour DESC
        LIMIT 5
      `,
      [maNhaCungCap],
    ),
    pool.query<ProviderRecentBookingRow[]>(
      `
        SELECT
          b.maDatTour,
          t.tenTour,
          b.ngayDat,
          b.tongTien,
          COALESCE(b.trangThaiDatTour, 'PENDING') AS trangThaiDatTour
        FROM \`dattour\` b
        INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
        INNER JOIN \`tour\` t ON t.maTour = s.maTour
        WHERE t.maNhaCungCap = ?
        ORDER BY b.ngayDat DESC, b.maDatTour DESC
        LIMIT 5
      `,
      [maNhaCungCap],
    ),
  ]);

  return {
    ...provider,
    totalTours: Number(provider.totalTours ?? 0),
    publishedTours: Number(provider.publishedTours ?? 0),
    totalBookings: Number(provider.totalBookings ?? 0),
    totalRevenue: Number(provider.totalRevenue ?? 0),
    totalReviews: Number(provider.totalReviews ?? 0),
    avgRating: provider.avgRating == null ? null : Number(provider.avgRating),
    recentTours: recentTours[0],
    recentBookings: recentBookings[0],
  };
};

const providerStatuses = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const;

export type ProviderApprovalStatus = (typeof providerStatuses)[number];

export const isProviderApprovalStatus = (value: string): value is ProviderApprovalStatus => {
  return providerStatuses.includes(value as ProviderApprovalStatus);
};

export const updateAdminProviderApprovalStatus = async (
  maNhaCungCap: string,
  status: ProviderApprovalStatus,
): Promise<ProviderDetail> => {
  const provider = await getAdminProviderDetail(maNhaCungCap);

  if (provider.trangThaiHopTac === status) {
    return provider;
  }

  const pool = getDbPool();
  await pool.query(
    `
      UPDATE \`nhacungcaptour\`
      SET \`trangThaiHopTac\` = ?
      WHERE \`maNhaCungCap\` = ?
    `,
    [status, maNhaCungCap],
  );

  return getAdminProviderDetail(maNhaCungCap);
};
