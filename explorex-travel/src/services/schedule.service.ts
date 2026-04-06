import type { RowDataPacket } from "mysql2";

import { ApiRequestError } from "@/lib/auth/guards";
import { getDbPool } from "@/lib/db/mysql";
import type { CreateScheduleInput, UpdateScheduleInput } from "@/lib/validations/schedule";
import type { Schedule } from "@/types/schedule";
import { getProviderProfileByUserId, getTourDetail } from "@/services/tour.service";

type ScheduleRow = RowDataPacket & Schedule;

const scheduleSelectFields = `
  s.maLichTour,
  s.maTour,
  t.maNhaCungCap,
  p.maNguoiDung,
  t.tenTour,
  p.tenNhaCungCap,
  s.ngayBatDau,
  s.soChoTrong,
  s.tongChoNgoi,
  COALESCE(s.trangThai, 'OPEN') AS trangThai,
  s.GiaTour AS giaTour
`;

const ensureScheduleRules = (input: { tongChoNgoi: number; soChoTrong: number }) => {
  if (input.soChoTrong > input.tongChoNgoi) {
    throw new ApiRequestError("Số chỗ trống không được lớn hơn tổng số chỗ.", 400);
  }
};

export const listSchedules = async ({ maNhaCungCap }: { maNhaCungCap?: string } = {}): Promise<Schedule[]> => {
  const pool = getDbPool();
  const filters: string[] = [];
  const values: string[] = [];

  if (maNhaCungCap) {
    filters.push("t.maNhaCungCap = ?");
    values.push(maNhaCungCap);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await pool.query<ScheduleRow[]>(
    `
      SELECT ${scheduleSelectFields}
      FROM \`lichtour\` s
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      ${whereClause}
      ORDER BY s.ngayBatDau ASC, s.maLichTour ASC
    `,
    values,
  );

  return rows;
};

export const getScheduleDetail = async (
  maLichTour: string,
  { maNhaCungCap }: { maNhaCungCap?: string } = {},
): Promise<Schedule> => {
  const pool = getDbPool();
  const filters = ["s.maLichTour = ?"];
  const values = [maLichTour];

  if (maNhaCungCap) {
    filters.push("t.maNhaCungCap = ?");
    values.push(maNhaCungCap);
  }

  const [rows] = await pool.query<ScheduleRow[]>(
    `
      SELECT ${scheduleSelectFields}
      FROM \`lichtour\` s
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      WHERE ${filters.join(" AND ")}
      LIMIT 1
    `,
    values,
  );

  const schedule = rows[0];
  if (!schedule) {
    throw new ApiRequestError("Không tìm thấy lịch khởi hành.", 404);
  }

  return schedule;
};

export const createScheduleAsAdmin = async (input: CreateScheduleInput) => {
  ensureScheduleRules(input);
  await getTourDetail(input.maTour);

  const pool = getDbPool();
  await pool.query(
    `
      INSERT INTO \`lichtour\` (
        \`maLichTour\`,
        \`maTour\`,
        \`ngayBatDau\`,
        \`soChoTrong\`,
        \`tongChoNgoi\`,
        \`trangThai\`,
        \`GiaTour\`
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [input.maLichTour, input.maTour, input.ngayBatDau, input.soChoTrong, input.tongChoNgoi, input.trangThai, input.giaTour],
  );

  return getScheduleDetail(input.maLichTour);
};

export const updateScheduleAsAdmin = async (maLichTour: string, input: UpdateScheduleInput) => {
  ensureScheduleRules(input);
  await getScheduleDetail(maLichTour);
  await getTourDetail(input.maTour);

  const pool = getDbPool();
  await pool.query(
    `
      UPDATE \`lichtour\`
      SET
        \`maTour\` = ?,
        \`ngayBatDau\` = ?,
        \`soChoTrong\` = ?,
        \`tongChoNgoi\` = ?,
        \`trangThai\` = ?,
        \`GiaTour\` = ?
      WHERE \`maLichTour\` = ?
    `,
    [input.maTour, input.ngayBatDau, input.soChoTrong, input.tongChoNgoi, input.trangThai, input.giaTour, maLichTour],
  );

  return getScheduleDetail(maLichTour);
};

export const createScheduleAsProvider = async (userId: string, input: CreateScheduleInput) => {
  ensureScheduleRules(input);
  const provider = await getProviderProfileByUserId(userId);
  const tour = await getTourDetail(input.maTour, { maNhaCungCap: provider.maNhaCungCap });

  const maxSeats = tour.sLKhachToiDa ?? 0;
  if (maxSeats > 0 && input.tongChoNgoi > maxSeats) {
    throw new ApiRequestError("Tổng số chỗ không được vượt quá sức chứa tối đa của tour.", 400);
  }

  const pool = getDbPool();
  await pool.query(
    `
      INSERT INTO \`lichtour\` (
        \`maLichTour\`,
        \`maTour\`,
        \`ngayBatDau\`,
        \`soChoTrong\`,
        \`tongChoNgoi\`,
        \`trangThai\`,
        \`GiaTour\`
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [input.maLichTour, input.maTour, input.ngayBatDau, input.soChoTrong, input.tongChoNgoi, input.trangThai, input.giaTour],
  );

  return getScheduleDetail(input.maLichTour, { maNhaCungCap: provider.maNhaCungCap });
};

export const updateScheduleAsProvider = async (userId: string, maLichTour: string, input: UpdateScheduleInput) => {
  ensureScheduleRules(input);
  const provider = await getProviderProfileByUserId(userId);
  await getScheduleDetail(maLichTour, { maNhaCungCap: provider.maNhaCungCap });
  const tour = await getTourDetail(input.maTour, { maNhaCungCap: provider.maNhaCungCap });

  const maxSeats = tour.sLKhachToiDa ?? 0;
  if (maxSeats > 0 && input.tongChoNgoi > maxSeats) {
    throw new ApiRequestError("Tổng số chỗ không được vượt quá sức chứa tối đa của tour.", 400);
  }

  const pool = getDbPool();
  await pool.query(
    `
      UPDATE \`lichtour\`
      SET
        \`maTour\` = ?,
        \`ngayBatDau\` = ?,
        \`soChoTrong\` = ?,
        \`tongChoNgoi\` = ?,
        \`trangThai\` = ?,
        \`GiaTour\` = ?
      WHERE \`maLichTour\` = ?
    `,
    [input.maTour, input.ngayBatDau, input.soChoTrong, input.tongChoNgoi, input.trangThai, input.giaTour, maLichTour],
  );

  return getScheduleDetail(maLichTour, { maNhaCungCap: provider.maNhaCungCap });
};
