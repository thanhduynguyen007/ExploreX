import type { RowDataPacket } from "mysql2";
import { unstable_cache } from "next/cache";

import { getDbPool } from "@/lib/db/mysql";
import { getProviderProfileByUserId } from "@/services/tour.service";

type CountRow = RowDataPacket & { total: number; role?: string; trangThai?: string; revenue?: number | null };
type TopTourRow = RowDataPacket & { maTour: string; tenTour: string | null; totalBookings: number };
type TopProviderRow = RowDataPacket & { maNhaCungCap: string; tenNhaCungCap: string | null; revenue: number | null };
type RatingRow = RowDataPacket & { maTour: string; tenTour: string | null; avgRating: number | null; totalReviews: number };
type UpcomingScheduleRow = RowDataPacket & {
  maLichTour: string;
  tenTour: string | null;
  ngayBatDau: string | Date | null;
  soChoTrong: number | null;
  trangThai: string | null;
};
type RecentBookingRow = RowDataPacket & {
  maDatTour: string;
  tenTour: string | null;
  tenNguoiDung: string | null;
  soNguoi: number | null;
  trangThaiDatTour: string | null;
  tongTien: number | null;
  ngayDat: string | Date | null;
};
type RevenueTrendRow = RowDataPacket & {
  period: string;
  totalRevenue: number | null;
  totalBookings: number;
};

const getAdminDashboardSummaryUncached = async () => {
  const pool = getDbPool();

  const roleCountsRows = await pool.query<CountRow[]>("SELECT role, COUNT(*) AS total FROM `nguoidung` GROUP BY role");
  const tourStatusRows = await pool.query<CountRow[]>("SELECT trangThai, COUNT(*) AS total FROM `tour` GROUP BY trangThai");
  const bookingStatusRows = await pool.query<CountRow[]>(
    "SELECT trangThaiDatTour AS trangThai, COUNT(*) AS total FROM `dattour` GROUP BY trangThaiDatTour",
  );
  const revenueRows = await pool.query<CountRow[]>(
    "SELECT COALESCE(SUM(tongTien), 0) AS revenue FROM `dattour` WHERE `trangThaiDatTour` IN ('CONFIRMED', 'COMPLETED')",
  );
  const topToursRows = await pool.query<TopTourRow[]>(
    `
      SELECT t.maTour, t.tenTour, COUNT(b.maDatTour) AS totalBookings
      FROM \`tour\` t
      LEFT JOIN \`lichtour\` s ON s.maTour = t.maTour
      LEFT JOIN \`dattour\` b ON b.maLichTour = s.maLichTour AND b.trangThaiDatTour IN ('CONFIRMED', 'COMPLETED')
      GROUP BY t.maTour, t.tenTour
      ORDER BY totalBookings DESC, t.tenTour ASC
      LIMIT 5
    `,
  );
  const topProvidersRows = await pool.query<TopProviderRow[]>(
    `
      SELECT p.maNhaCungCap, p.tenNhaCungCap, COALESCE(SUM(b.tongTien), 0) AS revenue
      FROM \`nhacungcaptour\` p
      LEFT JOIN \`tour\` t ON t.maNhaCungCap = p.maNhaCungCap
      LEFT JOIN \`lichtour\` s ON s.maTour = t.maTour
      LEFT JOIN \`dattour\` b ON b.maLichTour = s.maLichTour AND b.trangThaiDatTour IN ('CONFIRMED', 'COMPLETED')
      GROUP BY p.maNhaCungCap, p.tenNhaCungCap
      ORDER BY revenue DESC
      LIMIT 5
    `,
  );
  const ratingRows = await pool.query<RatingRow[]>(
    `
      SELECT t.maTour, t.tenTour, AVG(r.soSao) AS avgRating, COUNT(r.maDanhGia) AS totalReviews
      FROM \`tour\` t
      LEFT JOIN \`danhgia\` r ON r.maTour = t.maTour
      GROUP BY t.maTour, t.tenTour
      ORDER BY avgRating DESC, totalReviews DESC, t.tenTour ASC
      LIMIT 5
    `,
  );
  const upcomingSchedulesRows = await pool.query<UpcomingScheduleRow[]>(
    `
      SELECT s.maLichTour, t.tenTour, s.ngayBatDau, s.soChoTrong, s.trangThai
      FROM \`lichtour\` s
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      WHERE s.ngayBatDau >= NOW()
      ORDER BY s.ngayBatDau ASC
      LIMIT 5
    `,
  );
  const recentBookingsRows = await pool.query<RecentBookingRow[]>(
    `
      SELECT b.maDatTour, t.tenTour, u.tenNguoiDung, b.soNguoi, b.trangThaiDatTour, b.tongTien, b.ngayDat
      FROM \`dattour\` b
      INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      INNER JOIN \`nguoidung\` u ON u.maNguoiDung = b.maNguoiDung
      ORDER BY b.ngayDat DESC
      LIMIT 5
    `,
  );
  const revenueTrendRows = await pool.query<RevenueTrendRow[]>(
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

  const roleCounts = roleCountsRows[0];
  const tourStatuses = tourStatusRows[0];
  const bookingStatuses = bookingStatusRows[0];

  return {
    totalUsers: roleCounts.reduce((sum, item) => sum + item.total, 0),
    totalProviders: roleCounts.find((item) => item.role === "PROVIDER")?.total ?? 0,
    totalCustomers: roleCounts.find((item) => item.role === "CUSTOMER")?.total ?? 0,
    totalAdmins: roleCounts.find((item) => item.role === "ADMIN")?.total ?? 0,
    totalTours: tourStatuses.reduce((sum, item) => sum + item.total, 0),
    pendingTours: tourStatuses.find((item) => item.trangThai === "PENDING_REVIEW")?.total ?? 0,
    draftTours: tourStatuses.find((item) => item.trangThai === "DRAFT")?.total ?? 0,
    hiddenTours: tourStatuses.find((item) => item.trangThai === "HIDDEN")?.total ?? 0,
    totalBookings: bookingStatuses.reduce((sum, item) => sum + item.total, 0),
    pendingBookings: bookingStatuses.find((item) => item.trangThai === "PENDING")?.total ?? 0,
    confirmedBookings: bookingStatuses.find((item) => item.trangThai === "CONFIRMED")?.total ?? 0,
    completedBookings: bookingStatuses.find((item) => item.trangThai === "COMPLETED")?.total ?? 0,
    cancelledBookings: bookingStatuses.find((item) => item.trangThai === "CANCELLED")?.total ?? 0,
    totalRevenue: revenueRows[0][0]?.revenue ?? 0,
    topTours: topToursRows[0],
    topProviders: topProvidersRows[0],
    topRatedTours: ratingRows[0],
    upcomingSchedules: upcomingSchedulesRows[0],
    recentBookings: recentBookingsRows[0],
    revenueTrend: revenueTrendRows[0],
  };
};

export const getAdminDashboardSummary = unstable_cache(getAdminDashboardSummaryUncached, ["admin-dashboard-summary"], {
  revalidate: 15,
});

const getProviderDashboardSummaryUncached = async (userId: string) => {
  const provider = await getProviderProfileByUserId(userId);
  const pool = getDbPool();

  const tourStatusRows = await pool.query<CountRow[]>(
    "SELECT trangThai, COUNT(*) AS total FROM `tour` WHERE `maNhaCungCap` = ? GROUP BY trangThai",
    [provider.maNhaCungCap],
  );
  const bookingStatusRows = await pool.query<CountRow[]>(
    `
      SELECT b.trangThaiDatTour AS trangThai, COUNT(*) AS total
      FROM \`dattour\` b
      INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      WHERE t.maNhaCungCap = ?
      GROUP BY b.trangThaiDatTour
    `,
    [provider.maNhaCungCap],
  );
  const revenueRows = await pool.query<CountRow[]>(
    `
      SELECT COALESCE(SUM(b.tongTien), 0) AS revenue
      FROM \`dattour\` b
      INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      WHERE t.maNhaCungCap = ?
        AND b.trangThaiDatTour IN ('CONFIRMED', 'COMPLETED')
    `,
    [provider.maNhaCungCap],
  );
  const upcomingSchedulesRows = await pool.query<UpcomingScheduleRow[]>(
    `
      SELECT s.maLichTour, t.tenTour, s.ngayBatDau, s.soChoTrong, s.trangThai
      FROM \`lichtour\` s
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      WHERE t.maNhaCungCap = ?
        AND s.ngayBatDau >= NOW()
      ORDER BY s.ngayBatDau ASC
      LIMIT 5
    `,
    [provider.maNhaCungCap],
  );
  const ratingRows = await pool.query<RatingRow[]>(
    `
      SELECT t.maTour, t.tenTour, AVG(r.soSao) AS avgRating, COUNT(r.maDanhGia) AS totalReviews
      FROM \`tour\` t
      LEFT JOIN \`danhgia\` r ON r.maTour = t.maTour
      WHERE t.maNhaCungCap = ?
      GROUP BY t.maTour, t.tenTour
      ORDER BY avgRating DESC, totalReviews DESC, t.tenTour ASC
      LIMIT 5
    `,
    [provider.maNhaCungCap],
  );

  const tourStatuses = tourStatusRows[0];
  const bookingStatuses = bookingStatusRows[0];

  return {
    provider,
    totalTours: tourStatuses.reduce((sum, item) => sum + item.total, 0),
    pendingTours: tourStatuses.find((item) => item.trangThai === "PENDING_REVIEW")?.total ?? 0,
    draftTours: tourStatuses.find((item) => item.trangThai === "DRAFT")?.total ?? 0,
    hiddenTours: tourStatuses.find((item) => item.trangThai === "HIDDEN")?.total ?? 0,
    totalBookings: bookingStatuses.reduce((sum, item) => sum + item.total, 0),
    pendingBookings: bookingStatuses.find((item) => item.trangThai === "PENDING")?.total ?? 0,
    confirmedBookings: bookingStatuses.find((item) => item.trangThai === "CONFIRMED")?.total ?? 0,
    completedBookings: bookingStatuses.find((item) => item.trangThai === "COMPLETED")?.total ?? 0,
    totalRevenue: revenueRows[0][0]?.revenue ?? 0,
    upcomingSchedules: upcomingSchedulesRows[0],
    topRatedTours: ratingRows[0],
  };
};

export const getProviderDashboardSummary = async (userId: string) =>
  unstable_cache(
    async () => getProviderDashboardSummaryUncached(userId),
    [`provider-dashboard-summary:${userId}`],
    { revalidate: 15 },
  )();
