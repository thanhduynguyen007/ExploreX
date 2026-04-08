import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole } from "@/lib/auth/guards";
import { env } from "@/lib/env";
import { markBookingAsPaidForCustomer } from "@/services/booking.service";

const buildRedirectUrl = (bookingId: string, status: "success" | "error", message: string) => {
  const url = new URL(`/account/bookings/${bookingId}`, env.appUrl);
  url.searchParams.set("paymentStatus", status);
  url.searchParams.set("paymentMessage", message);
  return NextResponse.redirect(url);
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const user = await getRequiredApiUser();
  requireApiRole(user, ["CUSTOMER"]);

  const { bookingId } = await params;
  const url = new URL(request.url);
  const result = url.searchParams.get("result");

  if (result === "success") {
    try {
      await markBookingAsPaidForCustomer({
        userId: user.id,
        bookingId,
      });

      return buildRedirectUrl(bookingId, "success", "Thanh toán VNPAY demo thành công.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể cập nhật thanh toán demo.";
      return buildRedirectUrl(bookingId, "error", message);
    }
  }

  if (result === "fail") {
    return buildRedirectUrl(bookingId, "error", "Thanh toán VNPAY demo thất bại.");
  }

  return buildRedirectUrl(bookingId, "error", "Bạn đã hủy thanh toán VNPAY demo.");
}
