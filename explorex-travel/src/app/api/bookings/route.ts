import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { createBookingSchema } from "@/lib/validations/booking";
import { createBookingAsCustomer } from "@/services/booking.service";

export async function POST(request: Request) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["CUSTOMER"]);

    const body = await request.json();
    const payload = await createBookingSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await createBookingAsCustomer(user.id, payload);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
