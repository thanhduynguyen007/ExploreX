import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { getBookingDetail } from "@/services/booking.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["CUSTOMER"]);

    const { bookingId } = await params;
    const item = await getBookingDetail(bookingId, { maNguoiDung: user.id });
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
