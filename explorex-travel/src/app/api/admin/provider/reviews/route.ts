import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { listReviewsForProvider } from "@/services/review.service";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["PROVIDER"]);

    const items = await listReviewsForProvider(user.id);
    return NextResponse.json({ items });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
