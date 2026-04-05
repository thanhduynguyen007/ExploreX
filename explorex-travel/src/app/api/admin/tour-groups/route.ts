import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { createTourGroup, listTourGroups } from "@/services/tour-group.service";
import { tourGroupSchema } from "@/lib/validations/tour-group";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const tourGroups = await listTourGroups();
    return NextResponse.json({ items: tourGroups });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const body = await request.json();
    const payload = await tourGroupSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    await createTourGroup(payload);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
