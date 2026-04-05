import type { UserRole } from "@/types/auth";

export const dashboardPathByRole: Record<UserRole, string> = {
  CUSTOMER: "/account/bookings",
  PROVIDER: "/admin/provider/dashboard",
  ADMIN: "/admin/dashboard",
};

export const isAllowedForPath = (pathname: string, role: UserRole) => {
  if (pathname.startsWith("/account")) {
    return role === "CUSTOMER";
  }

  if (pathname.startsWith("/admin/provider")) {
    return role === "PROVIDER" || role === "ADMIN";
  }

  if (pathname.startsWith("/admin")) {
    return role === "ADMIN";
  }

  return true;
};
