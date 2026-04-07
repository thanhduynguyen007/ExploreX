import type { RowDataPacket } from "mysql2";

import { ApiRequestError } from "@/lib/auth/guards";
import { getDbPool } from "@/lib/db/mysql";
import type {
  CreateTourByAdminInput,
  CreateTourByProviderInput,
  UpdateTourByAdminInput,
  UpdateTourByProviderInput,
} from "@/lib/validations/tour";
import type { ProviderProfile, PublicTourDetail, PublicTourSummary, Tour } from "@/types/tour";

type TourRow = RowDataPacket & Tour;
type ProviderRow = RowDataPacket & ProviderProfile;
type LookupRow = RowDataPacket & { total: number };
type PublicTourSummaryRow = RowDataPacket & PublicTourSummary;
type PublicScheduleRow = RowDataPacket & PublicTourDetail["schedules"][number];

export type ProviderLookup = {
  maNhaCungCap: string;
  tenNhaCungCap: string | null;
  trangThaiHopTac: string | null;
};

const tourSelectFields = `
  t.maTour,
  t.maNhaCungCap,
  p.maNguoiDung,
  p.tenNhaCungCap,
  t.maNhomTour,
  g.tenNhomTour,
  t.tenTour,
  t.moTa,
  t.thoiLuong,
  t.sLKhachToiDa,
  COALESCE(t.trangThai, 'DRAFT') AS trangThai,
  t.loaiTour,
  t.hinhAnh
`;

const normalizeNullable = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const ensureTourGroupExists = async (maNhomTour: string) => {
  const pool = getDbPool();
  const [rows] = await pool.query<LookupRow[]>(
    `
      SELECT COUNT(*) AS total
      FROM \`nhomtour\`
      WHERE maNhomTour = ?
    `,
    [maNhomTour],
  );

  if (!rows[0] || rows[0].total === 0) {
    throw new ApiRequestError("Nhóm tour không tồn tại.", 404);
  }
};

const ensureProviderExists = async (maNhaCungCap: string) => {
  const pool = getDbPool();
  const [rows] = await pool.query<ProviderRow[]>(
    `
      SELECT maNhaCungCap, maNguoiDung, tenNhaCungCap, trangThaiHopTac
      FROM \`nhacungcaptour\`
      WHERE maNhaCungCap = ?
      LIMIT 1
    `,
    [maNhaCungCap],
  );

  const provider = rows[0];
  if (!provider) {
    throw new ApiRequestError("Nhà cung cấp không tồn tại.", 404);
  }

  return provider;
};

export const getProviderProfileByUserId = async (userId: string): Promise<ProviderProfile> => {
  const pool = getDbPool();
  const [rows] = await pool.query<ProviderRow[]>(
    `
      SELECT maNhaCungCap, maNguoiDung, tenNhaCungCap, trangThaiHopTac
      FROM \`nhacungcaptour\`
      WHERE maNguoiDung = ?
      LIMIT 1
    `,
    [userId],
  );

  const provider = rows[0];
  if (!provider) {
    throw new ApiRequestError("Tài khoản này chưa được gắn với hồ sơ nhà cung cấp.", 403);
  }

  if (provider.trangThaiHopTac !== "APPROVED") {
    throw new ApiRequestError("Nhà cung cấp chưa được duyệt để thao tác tour.", 403);
  }

  return provider;
};

export const listProviders = async (): Promise<ProviderLookup[]> => {
  const pool = getDbPool();
  const [rows] = await pool.query<(RowDataPacket & ProviderLookup)[]>(
    `
      SELECT maNhaCungCap, tenNhaCungCap, trangThaiHopTac
      FROM \`nhacungcaptour\`
      ORDER BY tenNhaCungCap IS NULL, tenNhaCungCap ASC, maNhaCungCap ASC
    `,
  );

  return rows;
};

export const getNextTourId = async (): Promise<string> => {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT maTour
      FROM \`tour\`
      WHERE maTour LIKE 'T%'
    `,
  );

  const maxNumber = rows.reduce((max, row) => {
    const rawValue = String(row.maTour ?? "");
    const match = /^T(\d+)$/i.exec(rawValue);
    if (!match) {
      return max;
    }

    return Math.max(max, Number.parseInt(match[1] ?? "0", 10));
  }, 0);

  return `T${String(maxNumber + 1).padStart(3, "0")}`;
};

export const listTours = async ({ maNhaCungCap }: { maNhaCungCap?: string } = {}): Promise<Tour[]> => {
  const pool = getDbPool();
  const filters: string[] = [];
  const values: string[] = [];

  if (maNhaCungCap) {
    filters.push("t.maNhaCungCap = ?");
    values.push(maNhaCungCap);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await pool.query<TourRow[]>(
    `
      SELECT ${tourSelectFields}
      FROM \`tour\` t
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      INNER JOIN \`nhomtour\` g ON g.maNhomTour = t.maNhomTour
      ${whereClause}
      ORDER BY t.tenTour ASC, t.maTour ASC
    `,
    values,
  );

  return rows;
};

export const getTourDetail = async (
  maTour: string,
  { maNhaCungCap }: { maNhaCungCap?: string } = {},
): Promise<Tour> => {
  const pool = getDbPool();
  const filters = ["t.maTour = ?"];
  const values = [maTour];

  if (maNhaCungCap) {
    filters.push("t.maNhaCungCap = ?");
    values.push(maNhaCungCap);
  }

  const [rows] = await pool.query<TourRow[]>(
    `
      SELECT ${tourSelectFields}
      FROM \`tour\` t
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      INNER JOIN \`nhomtour\` g ON g.maNhomTour = t.maNhomTour
      WHERE ${filters.join(" AND ")}
      LIMIT 1
    `,
    values,
  );

  const tour = rows[0];
  if (!tour) {
    throw new ApiRequestError("Không tìm thấy tour.", 404);
  }

  return tour;
};

export const createTourAsAdmin = async (input: CreateTourByAdminInput) => {
  await ensureTourGroupExists(input.maNhomTour);
  await ensureProviderExists(input.maNhaCungCap);

  const pool = getDbPool();
  await pool.query(
    `
      INSERT INTO \`tour\` (
        \`maTour\`,
        \`maNhaCungCap\`,
        \`maNhomTour\`,
        \`tenTour\`,
        \`moTa\`,
        \`thoiLuong\`,
        \`sLKhachToiDa\`,
        \`trangThai\`,
        \`loaiTour\`,
        \`hinhAnh\`
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      input.maTour,
      input.maNhaCungCap,
      input.maNhomTour,
      input.tenTour,
      normalizeNullable(input.moTa),
      input.thoiLuong,
      input.sLKhachToiDa,
      input.trangThai,
      input.loaiTour,
      normalizeNullable(input.hinhAnh),
    ],
  );

  return getTourDetail(input.maTour);
};

export const updateTourAsAdmin = async (maTour: string, input: UpdateTourByAdminInput) => {
  await getTourDetail(maTour);
  await ensureTourGroupExists(input.maNhomTour);
  await ensureProviderExists(input.maNhaCungCap);

  const pool = getDbPool();
  await pool.query(
    `
      UPDATE \`tour\`
      SET
        \`maNhaCungCap\` = ?,
        \`maNhomTour\` = ?,
        \`tenTour\` = ?,
        \`moTa\` = ?,
        \`thoiLuong\` = ?,
        \`sLKhachToiDa\` = ?,
        \`trangThai\` = ?,
        \`loaiTour\` = ?,
        \`hinhAnh\` = ?
      WHERE \`maTour\` = ?
    `,
    [
      input.maNhaCungCap,
      input.maNhomTour,
      input.tenTour,
      normalizeNullable(input.moTa),
      input.thoiLuong,
      input.sLKhachToiDa,
      input.trangThai,
      input.loaiTour,
      normalizeNullable(input.hinhAnh),
      maTour,
    ],
  );

  return getTourDetail(maTour);
};

export const createTourAsProvider = async (userId: string, input: CreateTourByProviderInput) => {
  const provider = await getProviderProfileByUserId(userId);
  await ensureTourGroupExists(input.maNhomTour);

  const pool = getDbPool();
  await pool.query(
    `
      INSERT INTO \`tour\` (
        \`maTour\`,
        \`maNhaCungCap\`,
        \`maNhomTour\`,
        \`tenTour\`,
        \`moTa\`,
        \`thoiLuong\`,
        \`sLKhachToiDa\`,
        \`trangThai\`,
        \`loaiTour\`,
        \`hinhAnh\`
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      input.maTour,
      provider.maNhaCungCap,
      input.maNhomTour,
      input.tenTour,
      normalizeNullable(input.moTa),
      input.thoiLuong,
      input.sLKhachToiDa,
      input.trangThai,
      input.loaiTour,
      normalizeNullable(input.hinhAnh),
    ],
  );

  return getTourDetail(input.maTour, { maNhaCungCap: provider.maNhaCungCap });
};

export const updateTourAsProvider = async (userId: string, maTour: string, input: UpdateTourByProviderInput) => {
  const provider = await getProviderProfileByUserId(userId);
  await getTourDetail(maTour, { maNhaCungCap: provider.maNhaCungCap });
  await ensureTourGroupExists(input.maNhomTour);

  const pool = getDbPool();
  await pool.query(
    `
      UPDATE \`tour\`
      SET
        \`maNhomTour\` = ?,
        \`tenTour\` = ?,
        \`moTa\` = ?,
        \`thoiLuong\` = ?,
        \`sLKhachToiDa\` = ?,
        \`trangThai\` = ?,
        \`loaiTour\` = ?,
        \`hinhAnh\` = ?
      WHERE \`maTour\` = ?
        AND \`maNhaCungCap\` = ?
    `,
    [
      input.maNhomTour,
      input.tenTour,
      normalizeNullable(input.moTa),
      input.thoiLuong,
      input.sLKhachToiDa,
      input.trangThai,
      input.loaiTour,
      normalizeNullable(input.hinhAnh),
      maTour,
      provider.maNhaCungCap,
    ],
  );

  return getTourDetail(maTour, { maNhaCungCap: provider.maNhaCungCap });
};

export const listPublicTours = async ({
  keyword,
  maNhomTour,
}: {
  keyword?: string;
  maNhomTour?: string;
} = {}): Promise<PublicTourSummary[]> => {
  const pool = getDbPool();
  const filters = ["t.trangThai = 'PUBLISHED'"];
  const values: string[] = [];

  if (keyword) {
    filters.push("(t.tenTour LIKE ? OR t.moTa LIKE ? OR g.tenNhomTour LIKE ?)");
    const q = `%${keyword.trim()}%`;
    values.push(q, q, q);
  }

  if (maNhomTour) {
    filters.push("t.maNhomTour = ?");
    values.push(maNhomTour);
  }

  const [rows] = await pool.query<PublicTourSummaryRow[]>(
    `
      SELECT
        t.maTour,
        t.maNhomTour,
        t.tenTour,
        g.tenNhomTour,
        p.tenNhaCungCap,
        t.moTa,
        t.thoiLuong,
        t.loaiTour,
        t.hinhAnh,
        (
          SELECT MIN(s.GiaTour)
          FROM \`lichtour\` s
          WHERE s.maTour = t.maTour
            AND s.trangThai = 'OPEN'
        ) AS minGiaTour,
        (
          SELECT MIN(s.ngayBatDau)
          FROM \`lichtour\` s
          WHERE s.maTour = t.maTour
            AND s.trangThai = 'OPEN'
        ) AS nextNgayBatDau,
        (
          SELECT AVG(r.soSao)
          FROM \`danhgia\` r
          WHERE r.maTour = t.maTour
        ) AS avgRating,
        (
          SELECT COUNT(*)
          FROM \`danhgia\` r
          WHERE r.maTour = t.maTour
        ) AS totalReviews
      FROM \`tour\` t
      INNER JOIN \`nhomtour\` g ON g.maNhomTour = t.maNhomTour
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      WHERE ${filters.join(" AND ")}
      ORDER BY nextNgayBatDau IS NULL, nextNgayBatDau ASC, t.tenTour ASC
    `,
    values,
  );

  return rows;
};

export const getPublicTourDetail = async (maTour: string): Promise<PublicTourDetail> => {
  const pool = getDbPool();
  const [rows] = await pool.query<PublicTourSummaryRow[]>(
    `
      SELECT
        t.maTour,
        t.maNhomTour,
        t.tenTour,
        g.tenNhomTour,
        p.tenNhaCungCap,
        t.moTa,
        t.thoiLuong,
        t.loaiTour,
        t.hinhAnh,
        t.sLKhachToiDa,
        (
          SELECT MIN(s.GiaTour)
          FROM \`lichtour\` s
          WHERE s.maTour = t.maTour
            AND s.trangThai = 'OPEN'
        ) AS minGiaTour,
        (
          SELECT MIN(s.ngayBatDau)
          FROM \`lichtour\` s
          WHERE s.maTour = t.maTour
            AND s.trangThai = 'OPEN'
        ) AS nextNgayBatDau,
        (
          SELECT AVG(r.soSao)
          FROM \`danhgia\` r
          WHERE r.maTour = t.maTour
        ) AS avgRating,
        (
          SELECT COUNT(*)
          FROM \`danhgia\` r
          WHERE r.maTour = t.maTour
        ) AS totalReviews
      FROM \`tour\` t
      INNER JOIN \`nhomtour\` g ON g.maNhomTour = t.maNhomTour
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      WHERE t.maTour = ?
        AND t.trangThai = 'PUBLISHED'
      LIMIT 1
    `,
    [maTour],
  );

  const tour = rows[0] as (PublicTourSummaryRow & { sLKhachToiDa?: number | null }) | undefined;
  if (!tour) {
    throw new ApiRequestError("Không tìm thấy tour công khai.", 404);
  }

  const [scheduleRows] = await pool.query<PublicScheduleRow[]>(
    `
      SELECT
        maLichTour,
        ngayBatDau,
        soChoTrong,
        tongChoNgoi,
        trangThai,
        GiaTour AS giaTour
      FROM \`lichtour\`
      WHERE maTour = ?
      ORDER BY ngayBatDau ASC
    `,
    [maTour],
  );

  return {
    ...tour,
    sLKhachToiDa: tour.sLKhachToiDa ?? null,
    schedules: scheduleRows,
  };
};
