import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { listReviews } from "@/services/review.service";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const items = await listReviews();
    return NextResponse.json({ items });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
