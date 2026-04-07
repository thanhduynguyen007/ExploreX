import type { RowDataPacket } from "mysql2";

import { ApiRequestError } from "@/lib/auth/guards";
import { getDbPool } from "@/lib/db/mysql";
import type { AdminUserDetail, AdminUserRole, AdminUserSummary, CustomerProfile } from "@/types/user";

type AdminUserSummaryRow = RowDataPacket &
  Omit<AdminUserSummary, "role" | "isAdmin" | "isCustomer" | "isProvider"> & {
    role: string | null;
    isAdmin: number;
    isCustomer: number;
    isProvider: number;
  };
type RecentBookingRow = RowDataPacket & AdminUserDetail["recentBookings"][number];
type RecentReviewRow = RowDataPacket & AdminUserDetail["recentReviews"][number];
type CustomerProfileRow = RowDataPacket & CustomerProfile;

const userSummarySelect = `
  u.maNguoiDung,
  u.tenNguoiDung,
  u.email,
  u.role,
  u.trangThaiTaiKhoan,
  COALESCE(c.soDienThoai, p.soDienThoai) AS soDienThoai,
  COALESCE(c.diaChi, p.diaChi) AS diaChi,
  a.chucVu,
  a.quyenHan,
  p.maNhaCungCap,
  p.tenNhaCungCap,
  p.trangThaiHopTac,
  p.loaiDichVu,
  CASE WHEN a.maNguoiDung IS NULL THEN 0 ELSE 1 END AS isAdmin,
  CASE WHEN c.maNguoiDung IS NULL THEN 0 ELSE 1 END AS isCustomer,
  CASE WHEN p.maNguoiDung IS NULL THEN 0 ELSE 1 END AS isProvider,
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

const normalizeRole = (role: string | null): AdminUserRole => {
  if (role === "ADMIN" || role === "CUSTOMER" || role === "PROVIDER") {
    return role;
  }

  throw new ApiRequestError("Dữ liệu vai trò người dùng không hợp lệ trong database.", 500);
};

const mapUserSummary = (row: AdminUserSummaryRow): AdminUserSummary => {
  const normalized: Omit<AdminUserSummary, "role"> = {
    maNguoiDung: row.maNguoiDung,
    tenNguoiDung: row.tenNguoiDung,
    email: row.email,
    trangThaiTaiKhoan: row.trangThaiTaiKhoan,
    soDienThoai: row.soDienThoai,
    diaChi: row.diaChi,
    chucVu: row.chucVu,
    quyenHan: row.quyenHan,
    isAdmin: Boolean(row.isAdmin),
    isCustomer: Boolean(row.isCustomer),
    isProvider: Boolean(row.isProvider),
    maNhaCungCap: row.maNhaCungCap,
    tenNhaCungCap: row.tenNhaCungCap,
    trangThaiHopTac: row.trangThaiHopTac,
    loaiDichVu: row.loaiDichVu,
    totalBookings: Number(row.totalBookings ?? 0),
    totalReviews: Number(row.totalReviews ?? 0),
  };

  return {
    ...normalized,
    role: normalizeRole(row.role),
  };
};

export const listAdminUsers = async (): Promise<AdminUserSummary[]> => {
  const pool = getDbPool();
  const [rows] = await pool.query<AdminUserSummaryRow[]>(
    `
      SELECT ${userSummarySelect}
      FROM \`nguoidung\` u
      LEFT JOIN \`khachhang\` c ON c.maNguoiDung = u.maNguoiDung
      LEFT JOIN \`admin\` a ON a.maNguoiDung = u.maNguoiDung
      LEFT JOIN \`nhacungcaptour\` p ON p.maNguoiDung = u.maNguoiDung
      ORDER BY u.tenNguoiDung IS NULL, u.tenNguoiDung ASC, u.maNguoiDung ASC
    `,
  );

  return rows.map(mapUserSummary);
};

export const getAdminUserDetail = async (maNguoiDung: string): Promise<AdminUserDetail> => {
  const pool = getDbPool();
  const [rows] = await pool.query<AdminUserSummaryRow[]>(
    `
      SELECT ${userSummarySelect}
      FROM \`nguoidung\` u
      LEFT JOIN \`khachhang\` c ON c.maNguoiDung = u.maNguoiDung
      LEFT JOIN \`admin\` a ON a.maNguoiDung = u.maNguoiDung
      LEFT JOIN \`nhacungcaptour\` p ON p.maNguoiDung = u.maNguoiDung
      WHERE u.maNguoiDung = ?
      LIMIT 1
    `,
    [maNguoiDung],
  );

  const user = rows[0];
  if (!user) {
    throw new ApiRequestError("Không tìm thấy người dùng.", 404);
  }

  const [recentBookings, recentReviews] = await Promise.all([
    pool.query<RecentBookingRow[]>(
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
        WHERE b.maNguoiDung = ?
        ORDER BY b.ngayDat DESC, b.maDatTour DESC
        LIMIT 5
      `,
      [maNguoiDung],
    ),
    pool.query<RecentReviewRow[]>(
      `
        SELECT
          r.maDanhGia,
          t.tenTour,
          r.soSao,
          r.binhLuan,
          r.ngayDanhGia
        FROM \`danhgia\` r
        LEFT JOIN \`tour\` t ON t.maTour = r.maTour
        WHERE r.maNguoiDung = ?
        ORDER BY r.ngayDanhGia DESC, r.maDanhGia DESC
        LIMIT 5
      `,
      [maNguoiDung],
    ),
  ]);

  return {
    ...mapUserSummary(user),
    recentBookings: recentBookings[0],
    recentReviews: recentReviews[0],
  };
};

export const getCustomerProfile = async (maNguoiDung: string): Promise<CustomerProfile> => {
  const pool = getDbPool();
  const [rows] = await pool.query<CustomerProfileRow[]>(
    `
      SELECT
        u.maNguoiDung,
        u.tenNguoiDung,
        u.email,
        u.trangThaiTaiKhoan,
        c.diaChi,
        c.soDienThoai
      FROM \`nguoidung\` u
      LEFT JOIN \`khachhang\` c ON c.maNguoiDung = u.maNguoiDung
      WHERE u.maNguoiDung = ?
        AND u.role = 'CUSTOMER'
      LIMIT 1
    `,
    [maNguoiDung],
  );

  const profile = rows[0];
  if (!profile) {
    throw new ApiRequestError("Không tìm thấy hồ sơ khách hàng.", 404);
  }

  return profile;
};

export const updateCustomerProfile = async (
  maNguoiDung: string,
  input: {
    tenNguoiDung: string;
    email: string;
    diaChi: string | null;
    soDienThoai: string | null;
  },
): Promise<CustomerProfile> => {
  const pool = getDbPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingUsers] = await connection.query<RowDataPacket[]>(
      `
        SELECT u.maNguoiDung
        FROM \`nguoidung\` u
        WHERE u.maNguoiDung = ?
          AND u.role = 'CUSTOMER'
        LIMIT 1
        FOR UPDATE
      `,
      [maNguoiDung],
    );

    if (existingUsers.length === 0) {
      throw new ApiRequestError("Không tìm thấy hồ sơ khách hàng.", 404);
    }

    const [duplicateEmails] = await connection.query<RowDataPacket[]>(
      `
        SELECT u.maNguoiDung
        FROM \`nguoidung\` u
        WHERE u.email = ?
          AND u.maNguoiDung <> ?
        LIMIT 1
      `,
      [input.email, maNguoiDung],
    );

    if (duplicateEmails.length > 0) {
      throw new ApiRequestError("Email đã được sử dụng bởi tài khoản khác.", 409);
    }

    await connection.query(
      `
        UPDATE \`nguoidung\`
        SET
          \`tenNguoiDung\` = ?,
          \`email\` = ?
        WHERE \`maNguoiDung\` = ?
      `,
      [input.tenNguoiDung, input.email, maNguoiDung],
    );

    const [customerRows] = await connection.query<RowDataPacket[]>(
      `
        SELECT maNguoiDung
        FROM \`khachhang\`
        WHERE \`maNguoiDung\` = ?
        LIMIT 1
      `,
      [maNguoiDung],
    );

    if (customerRows.length === 0) {
      await connection.query(
        `
          INSERT INTO \`khachhang\` (
            \`maNguoiDung\`,
            \`diaChi\`,
            \`soDienThoai\`
          )
          VALUES (?, ?, ?)
        `,
        [maNguoiDung, input.diaChi, input.soDienThoai],
      );
    } else {
      await connection.query(
        `
          UPDATE \`khachhang\`
          SET
            \`diaChi\` = ?,
            \`soDienThoai\` = ?
          WHERE \`maNguoiDung\` = ?
        `,
        [input.diaChi, input.soDienThoai, maNguoiDung],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return getCustomerProfile(maNguoiDung);
};
