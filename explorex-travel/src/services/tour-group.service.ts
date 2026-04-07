import type { RowDataPacket } from "mysql2";

import { getDbPool } from "@/lib/db/mysql";
import type { TourGroupInput } from "@/lib/validations/tour-group";
import type { UpdateTourGroupInput } from "@/lib/validations/tour-group";
import { ApiRequestError } from "@/lib/auth/guards";
import type { TourGroup } from "@/types/tour-group";

type TourGroupRow = RowDataPacket & TourGroup;
type CountRow = RowDataPacket & { total: number };

export const listTourGroups = async (): Promise<TourGroup[]> => {
  const pool = getDbPool();
  const [rows] = await pool.query<TourGroupRow[]>(
    `
      SELECT maNhomTour, tenNhomTour, moTaTour, trangThai
      FROM \`nhomtour\`
      ORDER BY tenNhomTour ASC
    `,
  );

  return rows;
};

export const getNextTourGroupId = async (): Promise<string> => {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT maNhomTour
      FROM \`nhomtour\`
      WHERE maNhomTour LIKE 'NT%'
    `,
  );

  const maxNumber = rows.reduce((max, row) => {
    const rawValue = String(row.maNhomTour ?? "");
    const match = /^NT(\d+)$/i.exec(rawValue);
    if (!match) {
      return max;
    }

    return Math.max(max, Number.parseInt(match[1] ?? "0", 10));
  }, 0);

  return `NT${String(maxNumber + 1).padStart(3, "0")}`;
};

export const createTourGroup = async (input: TourGroupInput): Promise<void> => {
  const pool = getDbPool();
  await pool.query(
    `
      INSERT INTO \`nhomtour\` (
        \`maNhomTour\`, \`tenNhomTour\`, \`moTaTour\`, \`trangThai\`
      )
      VALUES (?, ?, ?, ?)
    `,
    [input.maNhomTour, input.tenNhomTour, input.moTaTour || null, input.trangThai],
  );
};

export const getTourGroupById = async (maNhomTour: string): Promise<TourGroup> => {
  const pool = getDbPool();
  const [rows] = await pool.query<TourGroupRow[]>(
    `
      SELECT maNhomTour, tenNhomTour, moTaTour, trangThai
      FROM \`nhomtour\`
      WHERE \`maNhomTour\` = ?
      LIMIT 1
    `,
    [maNhomTour],
  );

  const tourGroup = rows[0];
  if (!tourGroup) {
    throw new ApiRequestError("Không tìm thấy danh mục tour", 404);
  }

  return tourGroup;
};

export const updateTourGroup = async (maNhomTour: string, input: UpdateTourGroupInput): Promise<void> => {
  await getTourGroupById(maNhomTour);

  const pool = getDbPool();
  await pool.query(
    `
      UPDATE \`nhomtour\`
      SET
        \`tenNhomTour\` = ?,
        \`moTaTour\` = ?,
        \`trangThai\` = ?
      WHERE \`maNhomTour\` = ?
    `,
    [input.tenNhomTour, input.moTaTour || null, input.trangThai, maNhomTour],
  );
};

export const deleteTourGroup = async (maNhomTour: string): Promise<void> => {
  await getTourGroupById(maNhomTour);

  const pool = getDbPool();
  const [rows] = await pool.query<CountRow[]>(
    "SELECT COUNT(*) AS total FROM `tour` WHERE `maNhomTour` = ?",
    [maNhomTour],
  );

  if ((rows[0]?.total ?? 0) > 0) {
    throw new ApiRequestError("Không thể xóa danh mục đang được tour sử dụng", 409);
  }

  await pool.query("DELETE FROM `nhomtour` WHERE `maNhomTour` = ? LIMIT 1", [maNhomTour]);
};
