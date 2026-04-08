import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { createVnpayPaymentUrlForCustomerBooking } from "@/services/booking.service";

const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "127.0.0.1";
  }

  return request.headers.get("x-real-ip") ?? "127.0.0.1";
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["CUSTOMER"]);

    const { bookingId } = await params;
    const paymentUrl = await createVnpayPaymentUrlForCustomerBooking({
      userId: user.id,
      bookingId,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
