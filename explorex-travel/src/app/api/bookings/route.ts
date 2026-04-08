import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { createBookingSchema } from "@/lib/validations/booking";
import { createBookingAsCustomer, createVnpayPaymentUrlForCustomerBooking } from "@/services/booking.service";

const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "127.0.0.1";
  }

  return request.headers.get("x-real-ip") ?? "127.0.0.1";
};

export async function POST(request: Request) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["CUSTOMER"]);

    const body = await request.json();
    const payload = await createBookingSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await createBookingAsCustomer(user.id, payload);

    if (payload.paymentMethod === "VNPAY") {
      const paymentUrl = await createVnpayPaymentUrlForCustomerBooking({
        userId: user.id,
        bookingId: item.maDatTour,
        ipAddress: getClientIp(request),
      });

      return NextResponse.json({ item, paymentUrl }, { status: 201 });
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
