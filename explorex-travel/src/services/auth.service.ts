import bcrypt from "bcryptjs";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { ApiRequestError } from "@/lib/auth/guards";
import { getDbPool, isDatabaseUnavailableError } from "@/lib/db/mysql";
import { env } from "@/lib/env";
import type { CustomerRegisterInput, ProviderRegisterInput } from "@/lib/validations/auth";
import type { AuthUser, UserRole } from "@/types/auth";

type UserRecord = RowDataPacket & {
  maNguoiDung: string;
  tenNguoiDung: string;
  email: string;
  matKhauHash: string;
  role: UserRole;
  trangThaiTaiKhoan: string | null;
};

const mockUsers: Array<AuthUser & { password: string }> = [
  {
    id: "admin-001",
    name: "System Admin",
    email: "admin@explorex.local",
    password: "Admin@123",
    role: "ADMIN",
  },
  {
    id: "provider-001",
    name: "Mekong Provider",
    email: "provider@explorex.local",
    password: "Provider@123",
    role: "PROVIDER",
  },
  {
    id: "customer-001",
    name: "Demo Customer",
    email: "customer@explorex.local",
    password: "Customer@123",
    role: "CUSTOMER",
  },
];

const normalizeNullable = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const ensureAccountStatusCanLogin = (status: string | null) => {
  if (!status || status === "ACTIVE") {
    return;
  }

  if (status === "PENDING") {
    throw new ApiRequestError("Tài khoản của bạn đang chờ kích hoạt.", 403);
  }

  if (status === "SUSPENDED") {
    throw new ApiRequestError("Tài khoản của bạn đang tạm dừng.", 403);
  }

  if (status === "DISABLED") {
    throw new ApiRequestError("Tài khoản của bạn đã bị vô hiệu hóa.", 403);
  }
};

const mapUserRecord = (user: UserRecord): AuthUser => ({
  id: user.maNguoiDung,
  email: user.email,
  name: user.tenNguoiDung,
  role: user.role,
});

const findMockUser = (email: string, password: string): AuthUser | null => {
  const user = mockUsers.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

const getNextUserId = async (connection?: PoolConnection): Promise<string> => {
  const executor = connection ?? getDbPool();
  const [rows] = await executor.query<RowDataPacket[]>("SELECT `maNguoiDung` FROM `nguoidung` WHERE `maNguoiDung` LIKE 'U%'");

  const maxNumber = rows.reduce((max, row) => {
    const rawValue = String(row.maNguoiDung ?? "");
    const match = /^U(\d+)$/i.exec(rawValue);
    if (!match) {
      return max;
    }

    return Math.max(max, Number.parseInt(match[1] ?? "0", 10));
  }, 0);

  return `U${String(maxNumber + 1).padStart(3, "0")}`;
};

const getNextProviderId = async (connection?: PoolConnection): Promise<string> => {
  const executor = connection ?? getDbPool();
  const [rows] = await executor.query<RowDataPacket[]>("SELECT `maNhaCungCap` FROM `nhacungcaptour` WHERE `maNhaCungCap` LIKE 'NCC%'");

  const maxNumber = rows.reduce((max, row) => {
    const rawValue = String(row.maNhaCungCap ?? "");
    const match = /^NCC(\d+)$/i.exec(rawValue);
    if (!match) {
      return max;
    }

    return Math.max(max, Number.parseInt(match[1] ?? "0", 10));
  }, 0);

  return `NCC${String(maxNumber + 1).padStart(3, "0")}`;
};

const ensureEmailUnique = async (email: string, connection?: PoolConnection) => {
  const executor = connection ?? getDbPool();
  const [rows] = await executor.query<RowDataPacket[]>("SELECT `maNguoiDung` FROM `nguoidung` WHERE `email` = ? LIMIT 1", [email]);

  if (rows.length > 0) {
    throw new ApiRequestError("Email đã tồn tại trong hệ thống.", 409);
  }
};

export const authenticateUser = async (email: string, password: string): Promise<AuthUser | null> => {
  const pool = getDbPool();

  try {
    const [rows] = await pool.query<UserRecord[]>(
      `
        SELECT
          u.maNguoiDung,
          u.tenNguoiDung,
          u.email,
          u.matKhauHash,
          u.role,
          u.trangThaiTaiKhoan
        FROM \`nguoidung\` u
        WHERE u.email = ?
        LIMIT 1
      `,
      [email],
    );

    const user = rows[0];
    if (user) {
      const isValid = await bcrypt.compare(password, user.matKhauHash);
      if (!isValid) {
        return null;
      }

      ensureAccountStatusCanLogin(user.trangThaiTaiKhoan);
      return mapUserRecord(user);
    }
  } catch (error) {
    if (!env.authUseMock || !isDatabaseUnavailableError(error)) {
      throw error;
    }
  }

  if (!env.authUseMock) {
    return null;
  }

  return findMockUser(email, password);
};

export const createCustomerAccount = async (input: CustomerRegisterInput) => {
  const pool = getDbPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await ensureEmailUnique(input.email, connection);

    const maNguoiDung = await getNextUserId(connection);
    const passwordHash = await bcrypt.hash(input.password, 10);

    await connection.query<ResultSetHeader>(
      `
        INSERT INTO \`nguoidung\` (
          \`maNguoiDung\`,
          \`tenNguoiDung\`,
          \`email\`,
          \`matKhauHash\`,
          \`role\`,
          \`trangThaiTaiKhoan\`
        ) VALUES (?, ?, ?, ?, 'CUSTOMER', 'ACTIVE')
      `,
      [maNguoiDung, input.tenNguoiDung.trim(), input.email.trim(), passwordHash],
    );

    await connection.query<ResultSetHeader>(
      `
        INSERT INTO \`khachhang\` (
          \`maNguoiDung\`,
          \`diaChi\`,
          \`soDienThoai\`
        ) VALUES (?, ?, ?)
      `,
      [maNguoiDung, normalizeNullable(input.diaChi), normalizeNullable(input.soDienThoai)],
    );

    await connection.commit();

    return {
      user: {
        id: maNguoiDung,
        email: input.email.trim(),
        name: input.tenNguoiDung.trim(),
        role: "CUSTOMER" as const,
      },
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const createProviderAccount = async (input: ProviderRegisterInput) => {
  const pool = getDbPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await ensureEmailUnique(input.email, connection);

    const maNguoiDung = await getNextUserId(connection);
    const maNhaCungCap = await getNextProviderId(connection);
    const passwordHash = await bcrypt.hash(input.password, 10);

    await connection.query<ResultSetHeader>(
      `
        INSERT INTO \`nguoidung\` (
          \`maNguoiDung\`,
          \`tenNguoiDung\`,
          \`email\`,
          \`matKhauHash\`,
          \`role\`,
          \`trangThaiTaiKhoan\`
        ) VALUES (?, ?, ?, ?, 'PROVIDER', 'ACTIVE')
      `,
      [maNguoiDung, input.tenNguoiDung.trim(), input.email.trim(), passwordHash],
    );

    await connection.query<ResultSetHeader>(
      `
        INSERT INTO \`nhacungcaptour\` (
          \`maNhaCungCap\`,
          \`maNguoiDung\`,
          \`tenNhaCungCap\`,
          \`trangThaiHopTac\`,
          \`thongTinNhaCungCap\`,
          \`diaChi\`,
          \`soDienThoai\`,
          \`email\`,
          \`loaiDichVu\`
        ) VALUES (?, ?, ?, 'PENDING', ?, ?, ?, ?, ?)
      `,
      [
        maNhaCungCap,
        maNguoiDung,
        input.tenNhaCungCap.trim(),
        normalizeNullable(input.thongTinNhaCungCap),
        normalizeNullable(input.diaChi),
        normalizeNullable(input.soDienThoai),
        input.email.trim(),
        normalizeNullable(input.loaiDichVu),
      ],
    );

    await connection.commit();

    return {
      maNguoiDung,
      maNhaCungCap,
      email: input.email.trim(),
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getMockAccounts = () => mockUsers;
