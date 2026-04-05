import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ValidationError } from "yup";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAuthToken } from "@/lib/auth/jwt";
import type { AuthUser, UserRole } from "@/types/auth";

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export class ApiAuthError extends ApiRequestError {
  constructor(message: string, status = 401) {
    super(message, status);
  }
}

export const getRequiredApiUser = async (): Promise<AuthUser> => {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    throw new ApiAuthError("Bạn chưa đăng nhập.", 401);
  }

  try {
    return verifyAuthToken(token);
  } catch {
    throw new ApiAuthError("Phiên đăng nhập không hợp lệ.", 401);
  }
};

export const requireApiRole = (user: AuthUser, roles: UserRole[]) => {
  if (!roles.includes(user.role)) {
    throw new ApiAuthError("Bạn không có quyền thực hiện thao tác này.", 403);
  }
};

export const requireOwnership = (ownerId: string, userId: string, message?: string) => {
  if (ownerId !== userId) {
    throw new ApiAuthError(message ?? "Bạn không có quyền truy cập dữ liệu này.", 403);
  }
};

export const toApiErrorResponse = (error: unknown) => {
  if (error instanceof ApiRequestError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  if (error instanceof ValidationError) {
    return NextResponse.json({ message: error.errors[0] ?? "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const mysqlCode = String(error.code);

    if (mysqlCode === "ER_DUP_ENTRY") {
      return NextResponse.json({ message: "Dữ liệu đã tồn tại trong hệ thống." }, { status: 409 });
    }

    if (mysqlCode === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json({ message: "Dữ liệu liên kết không hợp lệ." }, { status: 400 });
    }
  }

  return NextResponse.json({ message: "Đã xảy ra lỗi máy chủ." }, { status: 500 });
};
