import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { updateCustomerProfileSchema } from "@/lib/validations/profile";
import { getCustomerProfile, updateCustomerProfile } from "@/services/user.service";

export async function GET() {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["CUSTOMER"]);

    const item = await getCustomerProfile(user.id);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["CUSTOMER"]);

    const body = await request.json();
    const payload = await updateCustomerProfileSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await updateCustomerProfile(user.id, {
      tenNguoiDung: payload.tenNguoiDung,
      email: payload.email,
      diaChi: payload.diaChi ?? null,
      soDienThoai: payload.soDienThoai ?? null,
    });
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
