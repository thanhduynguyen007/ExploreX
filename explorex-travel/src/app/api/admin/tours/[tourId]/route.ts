import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { updateTourByAdminSchema } from "@/lib/validations/tour";
import { getTourDetail, updateTourAsAdmin } from "@/services/tour.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { tourId } = await params;
    const item = await getTourDetail(tourId);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const { tourId } = await params;
    const body = await request.json();
    const payload = await updateTourByAdminSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await updateTourAsAdmin(tourId, payload);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
