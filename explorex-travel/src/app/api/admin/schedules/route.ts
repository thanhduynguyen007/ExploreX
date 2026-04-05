import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { createScheduleSchema } from "@/lib/validations/schedule";
import { createScheduleAsAdmin, listSchedules } from "@/services/schedule.service";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const items = await listSchedules();
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
    const payload = await createScheduleSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await createScheduleAsAdmin(payload);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
