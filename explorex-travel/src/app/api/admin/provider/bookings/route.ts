import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { listBookings } from "@/services/booking.service";
import { getProviderProfileByUserId } from "@/services/tour.service";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["PROVIDER"]);

    const provider = await getProviderProfileByUserId(user.id);
    const items = await listBookings({ maNhaCungCap: provider.maNhaCungCap });
    return NextResponse.json({ items });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
