import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { createReviewSchema } from "@/lib/validations/review";
import { createReviewAsCustomer, listReviews } from "@/services/review.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const maTour = searchParams.get("maTour") ?? undefined;

    const items = await listReviews({ maTour });
    return NextResponse.json({ items });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["CUSTOMER"]);

    const body = await request.json();
    const payload = await createReviewSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await createReviewAsCustomer(user.id, payload);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
