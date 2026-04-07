import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { adminAccountUpdateSchema } from "@/lib/validations/admin-account";
import { deleteAdminAccount, getAdminAccountById, revokeAdminAccess, updateAdminAccount } from "@/services/admin-account.service";

type Params = {
  params: Promise<{ userId: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { userId } = await params;
    const item = await getAdminAccountById(userId);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { userId } = await params;
    const body = await request.json();
    const payload = await adminAccountUpdateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    await updateAdminAccount(userId, payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PATCH(_: Request, { params }: Params) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { userId } = await params;
    await revokeAdminAccess(userId, user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { userId } = await params;
    await deleteAdminAccount(userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
