import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { signAuthToken } from "@/lib/auth/jwt";
import { dashboardPathByRole } from "@/lib/permissions";
import { customerRegisterSchema } from "@/lib/validations/auth";
import { createCustomerAccount } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = await customerRegisterSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await createCustomerAccount(payload);
    const token = signAuthToken(result.user);
    const store = await cookies();

    store.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      message: "Tạo tài khoản thành công.",
      user: result.user,
      redirectTo: dashboardPathByRole[result.user.role],
    });
  } catch (error) {
    const { toApiErrorResponse } = await import("@/lib/auth/guards");
    return toApiErrorResponse(error);
  }
}
