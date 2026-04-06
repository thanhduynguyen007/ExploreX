import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";

import { getDbPool } from "@/lib/db/mysql";
import { env } from "@/lib/env";
import type { AuthUser, UserRole } from "@/types/auth";

type UserRecord = RowDataPacket & {
  maNguoiDung: string;
  tenNguoiDung: string;
  email: string;
  matKhauHash: string;
  isAdmin: number;
  isCustomer: number;
  isProvider: number;
};

const resolveUserRole = (user: Pick<UserRecord, "isAdmin" | "isCustomer" | "isProvider">): UserRole => {
  if (user.isAdmin > 0) {
    return "ADMIN";
  }

  if (user.isProvider > 0) {
    return "PROVIDER";
  }

  if (user.isCustomer > 0) {
    return "CUSTOMER";
  }

  throw new Error("Không xác định được vai trò của tài khoản.");
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

export const authenticateUser = async (
  email: string,
  password: string,
): Promise<AuthUser | null> => {
  if (env.authUseMock) {
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
  }

  const pool = getDbPool();
  const [rows] = await pool.query<UserRecord[]>(
    `
      SELECT
        u.maNguoiDung,
        u.tenNguoiDung,
        u.email,
        u.matKhauHash,
        EXISTS(SELECT 1 FROM \`admin\` a WHERE a.maNguoiDung = u.maNguoiDung) AS isAdmin,
        EXISTS(SELECT 1 FROM \`khachhang\` c WHERE c.maNguoiDung = u.maNguoiDung) AS isCustomer,
        EXISTS(SELECT 1 FROM \`nhacungcaptour\` p WHERE p.maNguoiDung = u.maNguoiDung) AS isProvider
      FROM \`nguoidung\` u
      WHERE u.email = ?
      LIMIT 1
    `,
    [email],
  );

  const user = rows[0];
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.matKhauHash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.maNguoiDung,
    email: user.email,
    name: user.tenNguoiDung,
    role: resolveUserRole(user),
  };
};

export const getMockAccounts = () => mockUsers;
