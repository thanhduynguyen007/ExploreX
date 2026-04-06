import type { RowDataPacket } from "mysql2";
import { unstable_cache } from "next/cache";

import { getDbPool } from "@/lib/db/mysql";

type CountRow = RowDataPacket & { total: number; revenue?: number | null; avgRating?: number | null };
type RevenueTrendRow = RowDataPacket & {
  period: string;
  totalRevenue: number | null;
  totalBookings: number;
};
type StatusRow = RowDataPacket & {
  trangThai: string | null;
  total: number;
};
type TopProviderRow = RowDataPacket & {
  maNhaCungCap: string;
  tenNhaCungCap: string | null;
  totalRevenue: number | null;
  totalBookings: number;
  totalTours: number;
};
type TopTourRow = RowDataPacket & {
  maTour: string;
  tenTour: string | null;
  tenNhaCungCap: string | null;
  totalBookings: number;
  totalRevenue: number | null;
  avgRating: number | null;
};

const getAdminReportSummaryUncached = async () => {
  const pool = getDbPool();

  const [totalRevenueRows] = await pool.query<CountRow[]>(
    "SELECT COALESCE(SUM(tongTien), 0) AS revenue FROM `dattour` WHERE `trangThaiDatTour` IN ('CONFIRMED', 'COMPLETED')",
  );
  const [totalBookingsRows] = await pool.query<CountRow[]>("SELECT COUNT(*) AS total FROM `dattour`");
  const [totalToursRows] = await pool.query<CountRow[]>("SELECT COUNT(*) AS total FROM `tour`");
  const [totalProvidersRows] = await pool.query<CountRow[]>("SELECT COUNT(*) AS total FROM `nhacungcaptour`");
  const [avgRatingRows] = await pool.query<CountRow[]>("SELECT AVG(`soSao`) AS avgRating FROM `danhgia`");

  const [bookingStatusRows] = await pool.query<StatusRow[]>(
    "SELECT COALESCE(`trangThaiDatTour`, 'PENDING') AS trangThai, COUNT(*) AS total FROM `dattour` GROUP BY `trangThaiDatTour`",
  );
  const [tourStatusRows] = await pool.query<StatusRow[]>(
    "SELECT COALESCE(`trangThai`, 'DRAFT') AS trangThai, COUNT(*) AS total FROM `tour` GROUP BY `trangThai`",
  );
  const [revenueTrendRows] = await pool.query<RevenueTrendRow[]>(
    `
      SELECT
        DATE_FORMAT(b.ngayDat, '%d/%m') AS period,
        COALESCE(SUM(CASE WHEN b.trangThaiDatTour IN ('CONFIRMED', 'COMPLETED') THEN b.tongTien ELSE 0 END), 0) AS totalRevenue,
        COUNT(*) AS totalBookings
      FROM \`dattour\` b
      WHERE b.ngayDat >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(b.ngayDat), DATE_FORMAT(b.ngayDat, '%d/%m')
      ORDER BY DATE(b.ngayDat) ASC
    `,
  );
  const [topProviderRows] = await pool.query<TopProviderRow[]>(
    `
      SELECT
        p.maNhaCungCap,
        p.tenNhaCungCap,
        COUNT(DISTINCT t.maTour) AS totalTours,
        COUNT(b.maDatTour) AS totalBookings,
        COALESCE(SUM(CASE WHEN b.trangThaiDatTour IN ('CONFIRMED', 'COMPLETED') THEN b.tongTien ELSE 0 END), 0) AS totalRevenue
      FROM \`nhacungcaptour\` p
      LEFT JOIN \`tour\` t ON t.maNhaCungCap = p.maNhaCungCap
      LEFT JOIN \`lichtour\` s ON s.maTour = t.maTour
      LEFT JOIN \`dattour\` b ON b.maLichTour = s.maLichTour
      GROUP BY p.maNhaCungCap, p.tenNhaCungCap
      ORDER BY totalRevenue DESC, totalBookings DESC, p.tenNhaCungCap ASC
      LIMIT 5
    `,
  );
  const [topTourRows] = await pool.query<TopTourRow[]>(
    `
      SELECT
        t.maTour,
        t.tenTour,
        p.tenNhaCungCap,
        COUNT(b.maDatTour) AS totalBookings,
        COALESCE(SUM(CASE WHEN b.trangThaiDatTour IN ('CONFIRMED', 'COMPLETED') THEN b.tongTien ELSE 0 END), 0) AS totalRevenue,
        AVG(r.soSao) AS avgRating
      FROM \`tour\` t
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      LEFT JOIN \`lichtour\` s ON s.maTour = t.maTour
      LEFT JOIN \`dattour\` b ON b.maLichTour = s.maLichTour
      LEFT JOIN \`danhgia\` r ON r.maTour = t.maTour
      GROUP BY t.maTour, t.tenTour, p.tenNhaCungCap
      ORDER BY totalBookings DESC, totalRevenue DESC, t.tenTour ASC
      LIMIT 5
    `,
  );

  return {
    totalRevenue: Number(totalRevenueRows[0]?.revenue ?? 0),
    totalBookings: Number(totalBookingsRows[0]?.total ?? 0),
    totalTours: Number(totalToursRows[0]?.total ?? 0),
    totalProviders: Number(totalProvidersRows[0]?.total ?? 0),
    avgRating: avgRatingRows[0]?.avgRating == null ? null : Number(avgRatingRows[0].avgRating),
    bookingStatuses: bookingStatusRows.map((row) => ({ trangThai: row.trangThai ?? "PENDING", total: Number(row.total ?? 0) })),
    tourStatuses: tourStatusRows.map((row) => ({ trangThai: row.trangThai ?? "DRAFT", total: Number(row.total ?? 0) })),
    revenueTrend: revenueTrendRows.map((row) => ({
      period: row.period,
      totalRevenue: Number(row.totalRevenue ?? 0),
      totalBookings: Number(row.totalBookings ?? 0),
    })),
    topProviders: topProviderRows.map((row) => ({
      ...row,
      totalRevenue: Number(row.totalRevenue ?? 0),
      totalBookings: Number(row.totalBookings ?? 0),
      totalTours: Number(row.totalTours ?? 0),
    })),
    topTours: topTourRows.map((row) => ({
      ...row,
      totalBookings: Number(row.totalBookings ?? 0),
      totalRevenue: Number(row.totalRevenue ?? 0),
      avgRating: row.avgRating == null ? null : Number(row.avgRating),
    })),
  };
};

export const getAdminReportSummary = unstable_cache(getAdminReportSummaryUncached, ["admin-report-summary"], {
  revalidate: 15,
});
