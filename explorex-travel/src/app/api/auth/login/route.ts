import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { signAuthToken } from "@/lib/auth/jwt";
import { dashboardPathByRole } from "@/lib/permissions";
import { loginSchema } from "@/lib/validations/auth";
import { authenticateUser } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = await loginSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const user = await authenticateUser(payload.email, payload.password);

    if (!user) {
      return NextResponse.json({ message: "Thông tin đăng nhập không đúng" }, { status: 401 });
    }

    const token = signAuthToken(user);
    const store = await cookies();

    store.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      user,
      redirectTo: dashboardPathByRole[user.role],
    });
  } catch {
    return NextResponse.json({ message: "Dữ liệu đăng nhập không hợp lệ" }, { status: 400 });
  }
}
