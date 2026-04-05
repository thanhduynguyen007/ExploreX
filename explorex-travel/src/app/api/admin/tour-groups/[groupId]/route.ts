import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { updateTourGroupSchema } from "@/lib/validations/tour-group";
import { deleteTourGroup, getTourGroupById, updateTourGroup } from "@/services/tour-group.service";

type Params = {
  params: Promise<{ groupId: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { groupId } = await params;
    const tourGroup = await getTourGroupById(groupId);

    return NextResponse.json({ item: tourGroup });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { groupId } = await params;
    const body = await request.json();
    const payload = await updateTourGroupSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    await updateTourGroup(groupId, payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { groupId } = await params;
    await deleteTourGroup(groupId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
