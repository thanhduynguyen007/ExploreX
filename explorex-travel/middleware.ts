import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { env } from "@/lib/env";
import { dashboardPathByRole, isAllowedForPath } from "@/lib/permissions";
import type { JwtPayload } from "@/types/auth";

const protectedPrefixes = ["/account", "/admin"];

const verifyToken = async (token: string) => {
  const secret = new TextEncoder().encode(env.jwtSecret);
  const { payload } = await jwtVerify(token, secret);

  return payload as unknown as JwtPayload;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const user = await verifyToken(token);

    if (!isAllowedForPath(pathname, user.role)) {
      return NextResponse.redirect(new URL(dashboardPathByRole[user.role], request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
