import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { updateScheduleSchema } from "@/lib/validations/schedule";
import { getScheduleDetail, updateScheduleAsAdmin } from "@/services/schedule.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ scheduleId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { scheduleId } = await params;
    const item = await getScheduleDetail(scheduleId);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ scheduleId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { scheduleId } = await params;
    const body = await request.json();
    const payload = await updateScheduleSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await updateScheduleAsAdmin(scheduleId, payload);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
