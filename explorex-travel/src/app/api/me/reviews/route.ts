import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { listReviews } from "@/services/review.service";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["CUSTOMER"]);

    const items = await listReviews({ maNguoiDung: user.id });
    return NextResponse.json({ items });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
