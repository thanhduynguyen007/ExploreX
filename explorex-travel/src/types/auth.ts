export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type JwtPayload = AuthUser & {
  iat?: number;
  exp?: number;
};
