import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { ApiRequestError } from "@/lib/auth/guards";
import { getDbPool } from "@/lib/db/mysql";
import type { CreateAdminAccountInput, UpdateAdminAccountInput } from "@/lib/validations/admin-account";
import type { AdminAccount } from "@/types/admin-account";

type AdminAccountRow = RowDataPacket &
  Omit<AdminAccount, "isCustomer"> & {
    isCustomer: number;
  };

const accountSelect = `
  u.maNguoiDung,
  u.tenNguoiDung,
  u.email,
  u.trangThaiTaiKhoan,
  a.chucVu,
  a.quyenHan,
  CASE WHEN c.maNguoiDung IS NULL THEN 0 ELSE 1 END AS isCustomer,
  (
    SELECT COUNT(*)
    FROM \`dattour\` b
    WHERE b.maNguoiDung = u.maNguoiDung
  ) AS totalBookings,
  (
    SELECT COUNT(*)
    FROM \`danhgia\` r
    WHERE r.maNguoiDung = u.maNguoiDung
  ) AS totalReviews
`;

const mapAccount = (row: AdminAccountRow): AdminAccount => ({
  maNguoiDung: row.maNguoiDung,
  tenNguoiDung: row.tenNguoiDung,
  email: row.email,
  trangThaiTaiKhoan: row.trangThaiTaiKhoan,
  chucVu: row.chucVu,
  quyenHan: row.quyenHan,
  isCustomer: Boolean(row.isCustomer),
  totalBookings: Number(row.totalBookings ?? 0),
  totalReviews: Number(row.totalReviews ?? 0),
});

const normalizeNullable = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const ensureEmailUnique = async (email: string, excludeUserId?: string) => {
  const pool = getDbPool();
  const values = [email];
  let sql = "SELECT maNguoiDung FROM `nguoidung` WHERE email = ?";

  if (excludeUserId) {
    sql += " AND maNguoiDung <> ?";
    values.push(excludeUserId);
  }

  sql += " LIMIT 1";
  const [rows] = await pool.query<RowDataPacket[]>(sql, values);
  if (rows.length > 0) {
    throw new ApiRequestError("Email đã tồn tại trong hệ thống.", 409);
  }
};

export const listAdminAccounts = async (): Promise<AdminAccount[]> => {
  const pool = getDbPool();
  const [rows] = await pool.query<AdminAccountRow[]>(
    `
      SELECT ${accountSelect}
      FROM \`admin\` a
      INNER JOIN \`nguoidung\` u ON u.maNguoiDung = a.maNguoiDung
      LEFT JOIN \`khachhang\` c ON c.maNguoiDung = u.maNguoiDung
      ORDER BY u.tenNguoiDung IS NULL, u.tenNguoiDung ASC, u.maNguoiDung ASC
    `,
  );

  return rows.map(mapAccount);
};

export const getNextAdminAccountId = async (): Promise<string> => {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT \`maNguoiDung\`
      FROM \`nguoidung\`
      WHERE \`maNguoiDung\` LIKE 'admin-%'
    `,
  );

  const maxNumber = rows.reduce((max, row) => {
    const rawValue = String(row.maNguoiDung ?? "");
    const match = /^admin-(\d+)$/i.exec(rawValue);
    if (!match) {
      return max;
    }

    return Math.max(max, Number.parseInt(match[1] ?? "0", 10));
  }, 0);

  return `admin-${String(maxNumber + 1).padStart(3, "0")}`;
};

export const getAdminAccountById = async (maNguoiDung: string): Promise<AdminAccount> => {
  const pool = getDbPool();
  const [rows] = await pool.query<AdminAccountRow[]>(
    `
      SELECT ${accountSelect}
      FROM \`admin\` a
      INNER JOIN \`nguoidung\` u ON u.maNguoiDung = a.maNguoiDung
      LEFT JOIN \`khachhang\` c ON c.maNguoiDung = u.maNguoiDung
      WHERE u.maNguoiDung = ?
      LIMIT 1
    `,
    [maNguoiDung],
  );

  const account = rows[0];
  if (!account) {
    throw new ApiRequestError("Không tìm thấy tài khoản quản trị.", 404);
  }

  return mapAccount(account);
};

export const createAdminAccount = async (input: CreateAdminAccountInput) => {
  const pool = getDbPool();
  await ensureEmailUnique(input.email);

  const passwordHash = await bcrypt.hash(input.password, 10);

  await pool.query(
    `
      INSERT INTO \`nguoidung\` (
        \`maNguoiDung\`,
        \`tenNguoiDung\`,
        \`email\`,
        \`role\`,
        \`trangThaiTaiKhoan\`,
        \`matKhauHash\`
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [input.maNguoiDung, input.tenNguoiDung, input.email, "ADMIN", input.trangThaiTaiKhoan, passwordHash],
  );

  await pool.query(
    `
      INSERT INTO \`admin\` (
        \`maNguoiDung\`,
        \`chucVu\`,
        \`quyenHan\`
      )
      VALUES (?, ?, ?)
    `,
    [input.maNguoiDung, normalizeNullable(input.chucVu), normalizeNullable(input.quyenHan)],
  );

  return getAdminAccountById(input.maNguoiDung);
};

export const updateAdminAccount = async (maNguoiDung: string, input: UpdateAdminAccountInput) => {
  const pool = getDbPool();
  await getAdminAccountById(maNguoiDung);
  await ensureEmailUnique(input.email, maNguoiDung);

  if (input.password && input.password.trim().length > 0) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    await pool.query(
      `
        UPDATE \`nguoidung\`
        SET
          \`tenNguoiDung\` = ?,
          \`email\` = ?,
          \`role\` = 'ADMIN',
          \`trangThaiTaiKhoan\` = ?,
          \`matKhauHash\` = ?
        WHERE \`maNguoiDung\` = ?
      `,
      [input.tenNguoiDung, input.email, input.trangThaiTaiKhoan, passwordHash, maNguoiDung],
    );
  } else {
    await pool.query(
      `
        UPDATE \`nguoidung\`
        SET
          \`tenNguoiDung\` = ?,
          \`email\` = ?,
          \`role\` = 'ADMIN',
          \`trangThaiTaiKhoan\` = ?
        WHERE \`maNguoiDung\` = ?
      `,
      [input.tenNguoiDung, input.email, input.trangThaiTaiKhoan, maNguoiDung],
    );
  }

  await pool.query(
    `
      UPDATE \`admin\`
      SET
        \`chucVu\` = ?,
        \`quyenHan\` = ?
      WHERE \`maNguoiDung\` = ?
    `,
    [normalizeNullable(input.chucVu), normalizeNullable(input.quyenHan), maNguoiDung],
  );

  return getAdminAccountById(maNguoiDung);
};

export const deleteAdminAccount = async (maNguoiDung: string) => {
  const pool = getDbPool();
  const account = await getAdminAccountById(maNguoiDung);

  if (account.isCustomer || account.totalBookings > 0 || account.totalReviews > 0) {
    throw new ApiRequestError("Không thể xóa tài khoản quản trị đang gắn với dữ liệu khách hàng.", 409);
  }

  await pool.query("DELETE FROM `admin` WHERE `maNguoiDung` = ?", [maNguoiDung]);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM `nguoidung` WHERE `maNguoiDung` = ?", [maNguoiDung]);

  if (result.affectedRows === 0) {
    throw new ApiRequestError("Không tìm thấy tài khoản để xóa.", 404);
  }
};

export const revokeAdminAccess = async (targetUserId: string, actorUserId: string) => {
  if (targetUserId === actorUserId) {
    throw new ApiRequestError("Không thể tự thu hồi quyền quản trị của chính bạn.", 409);
  }

  const pool = getDbPool();
  await getAdminAccountById(targetUserId);

  await pool.query("DELETE FROM `admin` WHERE `maNguoiDung` = ?", [targetUserId]);
  const [result] = await pool.query<ResultSetHeader>(
    `
      UPDATE \`nguoidung\`
      SET \`role\` = 'CUSTOMER'
      WHERE \`maNguoiDung\` = ?
    `,
    [targetUserId],
  );

  if (result.affectedRows === 0) {
    throw new ApiRequestError("Không tìm thấy tài khoản để cập nhật quyền.", 404);
  }
};
