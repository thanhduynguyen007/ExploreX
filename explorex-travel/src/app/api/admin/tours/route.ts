import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { createTourByAdminSchema } from "@/lib/validations/tour";
import { createTourAsAdmin, listTours } from "@/services/tour.service";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const items = await listTours();
    return NextResponse.json({ items });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const body = await request.json();
    const payload = await createTourByAdminSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await createTourAsAdmin(payload);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
