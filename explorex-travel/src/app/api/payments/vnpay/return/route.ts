import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import {
  extractBookingIdFromTxnRef,
  extractVnpayResponseParams,
  getVnpayResponseMessage,
  isVnpayPaymentSuccess,
  verifyVnpayResponse,
} from "@/lib/payments/vnpay";
import { markBookingAsPaidFromVnpay } from "@/services/booking.service";

const buildRedirectUrl = (pathname: string, status: "success" | "error", message: string) => {
  const url = new URL(pathname, env.appUrl);
  url.searchParams.set("paymentStatus", status);
  url.searchParams.set("paymentMessage", message);
  return NextResponse.redirect(url);
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = extractVnpayResponseParams(url.searchParams);
  const bookingId = params.vnp_TxnRef ? extractBookingIdFromTxnRef(params.vnp_TxnRef) : "";
  const bookingPath = bookingId ? `/account/bookings/${bookingId}` : "/account/bookings";

  if (!env.vnpay.hashSecret) {
    return buildRedirectUrl(bookingPath, "error", "VNPAY chưa được cấu hình ở môi trường hiện tại.");
  }

  if (!verifyVnpayResponse(params, env.vnpay.hashSecret)) {
    return buildRedirectUrl(bookingPath, "error", "Chữ ký phản hồi từ VNPAY không hợp lệ.");
  }

  if (!bookingId) {
    return buildRedirectUrl("/account/bookings", "error", "Không xác định được đơn đặt tour cần cập nhật.");
  }

  const amount = Math.round(Number(params.vnp_Amount ?? 0) / 100);
  const responseMessage = getVnpayResponseMessage(params.vnp_ResponseCode);

  if (!isVnpayPaymentSuccess(params)) {
    return buildRedirectUrl(bookingPath, "error", responseMessage);
  }

  try {
    await markBookingAsPaidFromVnpay({
      bookingId,
      amount,
    });

    return buildRedirectUrl(bookingPath, "success", responseMessage);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật trạng thái thanh toán.";
    return buildRedirectUrl(bookingPath, "error", message);
  }
}
