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
  role: UserRole;
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
      SELECT maNguoiDung, tenNguoiDung, email, matKhauHash, role
      FROM \`nguoidung\`
      WHERE email = ?
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
    role: user.role,
  };
};

export const getMockAccounts = () => mockUsers;
