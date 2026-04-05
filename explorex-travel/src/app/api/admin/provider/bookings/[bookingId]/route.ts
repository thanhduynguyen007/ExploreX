import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { updateBookingStatusSchema } from "@/lib/validations/booking";
import { getBookingDetail, updateBookingAsProvider } from "@/services/booking.service";
import { getProviderProfileByUserId } from "@/services/tour.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["PROVIDER"]);

    const provider = await getProviderProfileByUserId(user.id);
    const { bookingId } = await params;
    const item = await getBookingDetail(bookingId, { maNhaCungCap: provider.maNhaCungCap });
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
    requireApiRole(user, ["PROVIDER"]);

    const { bookingId } = await params;
    const body = await request.json();
    const payload = await updateBookingStatusSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await updateBookingAsProvider(user.id, bookingId, payload);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
