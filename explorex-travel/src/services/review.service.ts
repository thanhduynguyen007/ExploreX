import type { RowDataPacket } from "mysql2";

import { ApiRequestError } from "@/lib/auth/guards";
import { getDbPool } from "@/lib/db/mysql";
import type { CreateReviewInput } from "@/lib/validations/review";
import type { Review } from "@/types/review";
import { getProviderProfileByUserId } from "@/services/tour.service";

type ReviewRow = RowDataPacket & Review;
type EligibleBookingRow = RowDataPacket & {
  maDatTour: string;
  maTour: string;
  maNguoiDung: string;
  trangThaiDatTour: string;
};

const reviewSelectFields = `
  r.maDanhGia,
  r.maTour,
  r.maNguoiDung,
  t.maNhaCungCap,
  u.tenNguoiDung,
  t.tenTour,
  p.tenNhaCungCap,
  r.soSao,
  r.binhLuan,
  r.ngayDanhGia
`;

export const listReviews = async ({
  maTour,
  maNhaCungCap,
  maNguoiDung,
}: {
  maTour?: string;
  maNhaCungCap?: string;
  maNguoiDung?: string;
} = {}): Promise<Review[]> => {
  const pool = getDbPool();
  const filters: string[] = [];
  const values: string[] = [];

  if (maTour) {
    filters.push("r.maTour = ?");
    values.push(maTour);
  }

  if (maNhaCungCap) {
    filters.push("t.maNhaCungCap = ?");
    values.push(maNhaCungCap);
  }

  if (maNguoiDung) {
    filters.push("r.maNguoiDung = ?");
    values.push(maNguoiDung);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await pool.query<ReviewRow[]>(
    `
      SELECT ${reviewSelectFields}
      FROM \`danhgia\` r
      INNER JOIN \`tour\` t ON t.maTour = r.maTour
      INNER JOIN \`nguoidung\` u ON u.maNguoiDung = r.maNguoiDung
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      ${whereClause}
      ORDER BY r.ngayDanhGia DESC, r.maDanhGia DESC
    `,
    values,
  );

  return rows;
};

export const getNextReviewId = async (): Promise<string> => {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT maDanhGia
      FROM \`danhgia\`
      WHERE maDanhGia LIKE 'DG%'
    `,
  );

  const maxNumber = rows.reduce((max, row) => {
    const rawValue = String(row.maDanhGia ?? "");
    const match = /^DG(\d+)$/i.exec(rawValue);
    if (!match) {
      return max;
    }

    return Math.max(max, Number.parseInt(match[1] ?? "0", 10));
  }, 0);

  return `DG${String(maxNumber + 1).padStart(3, "0")}`;
};

export const getEligibleCompletedBookingsForReview = async (userId: string, maTour?: string) => {
  const pool = getDbPool();
  const filters = [
    "b.maNguoiDung = ?",
    "b.trangThaiDatTour = 'COMPLETED'",
    "NOT EXISTS (SELECT 1 FROM `danhgia` r WHERE r.maNguoiDung = b.maNguoiDung AND r.maTour = s.maTour)",
  ];
  const values: string[] = [userId];

  if (maTour) {
    filters.push("s.maTour = ?");
    values.push(maTour);
  }

  const [rows] = await pool.query<EligibleBookingRow[]>(
    `
      SELECT b.maDatTour, s.maTour, b.maNguoiDung, b.trangThaiDatTour
      FROM \`dattour\` b
      INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
      WHERE ${filters.join(" AND ")}
      ORDER BY b.ngayDat DESC
    `,
    values,
  );

  return rows;
};

export const createReviewAsCustomer = async (userId: string, input: CreateReviewInput) => {
  const pool = getDbPool();
  const [eligibleRows] = await pool.query<EligibleBookingRow[]>(
    `
      SELECT b.maDatTour, s.maTour, b.maNguoiDung, b.trangThaiDatTour
      FROM \`dattour\` b
      INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
      WHERE b.maDatTour = ?
        AND b.maNguoiDung = ?
        AND b.trangThaiDatTour = 'COMPLETED'
      LIMIT 1
    `,
    [input.maDatTour, userId],
  );

  const booking = eligibleRows[0];
  if (!booking) {
    throw new ApiRequestError("Bạn chỉ có thể đánh giá đơn đặt tour đã hoàn thành của chính mình.", 403);
  }

  const [duplicateRows] = await pool.query<RowDataPacket[]>(
    `
      SELECT maDanhGia
      FROM \`danhgia\`
      WHERE maNguoiDung = ?
        AND maTour = ?
      LIMIT 1
    `,
    [userId, booking.maTour],
  );

  if (duplicateRows.length > 0) {
    throw new ApiRequestError("Đơn đặt tour này đã được đánh giá trước đó.", 409);
  }

  await pool.query(
    `
      INSERT INTO \`danhgia\` (
        \`maDanhGia\`,
        \`maTour\`,
        \`maNguoiDung\`,
        \`soSao\`,
        \`binhLuan\`,
        \`ngayDanhGia\`
      )
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
    [input.maDanhGia, booking.maTour, userId, input.soSao, input.binhLuan],
  );

  const [rows] = await pool.query<ReviewRow[]>(
    `
      SELECT ${reviewSelectFields}
      FROM \`danhgia\` r
      INNER JOIN \`tour\` t ON t.maTour = r.maTour
      INNER JOIN \`nguoidung\` u ON u.maNguoiDung = r.maNguoiDung
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      WHERE r.maDanhGia = ?
      LIMIT 1
    `,
    [input.maDanhGia],
  );

  return rows[0];
};

export const listReviewsForProvider = async (userId: string) => {
  const provider = await getProviderProfileByUserId(userId);
  return listReviews({ maNhaCungCap: provider.maNhaCungCap });
};
