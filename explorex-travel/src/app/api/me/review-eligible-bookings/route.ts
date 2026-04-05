import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { getEligibleCompletedBookingsForReview } from "@/services/review.service";

export async function GET(request: Request) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["CUSTOMER"]);

    const { searchParams } = new URL(request.url);
    const maTour = searchParams.get("maTour") ?? undefined;

    const items = await getEligibleCompletedBookingsForReview(user.id, maTour);
    return NextResponse.json({ items });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
