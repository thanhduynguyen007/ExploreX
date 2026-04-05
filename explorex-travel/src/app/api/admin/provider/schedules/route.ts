import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { createScheduleSchema } from "@/lib/validations/schedule";
import { createScheduleAsProvider, listSchedules } from "@/services/schedule.service";
import { getProviderProfileByUserId } from "@/services/tour.service";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["PROVIDER"]);

    const provider = await getProviderProfileByUserId(user.id);
    const items = await listSchedules({ maNhaCungCap: provider.maNhaCungCap });
    return NextResponse.json({ items });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["PROVIDER"]);

    const body = await request.json();
    const payload = await createScheduleSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await createScheduleAsProvider(user.id, payload);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
