import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { updateBookingStatusSchema } from "@/lib/validations/booking";
import { getBookingDetail, updateBookingAsAdmin } from "@/services/booking.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { bookingId } = await params;
    const item = await getBookingDetail(bookingId);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { bookingId } = await params;
    const body = await request.json();
    const payload = await updateBookingStatusSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await updateBookingAsAdmin(bookingId, payload);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
