import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { adminAccountCreateSchema } from "@/lib/validations/admin-account";
import { createAdminAccount, listAdminAccounts } from "@/services/admin-account.service";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const items = await listAdminAccounts();
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
    const payload = await adminAccountCreateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    await createAdminAccount(payload);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
