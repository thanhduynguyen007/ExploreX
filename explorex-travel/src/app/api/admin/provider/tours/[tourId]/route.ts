import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import { updateTourByProviderSchema } from "@/lib/validations/tour";
import { getProviderProfileByUserId, getTourDetail, updateTourAsProvider } from "@/services/tour.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["PROVIDER"]);

    const provider = await getProviderProfileByUserId(user.id);
    const { tourId } = await params;
    const item = await getTourDetail(tourId, { maNhaCungCap: provider.maNhaCungCap });
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
    requireApiRole(user, ["PROVIDER"]);

    const { tourId } = await params;
    const body = await request.json();
    const payload = await updateTourByProviderSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const item = await updateTourAsProvider(user.id, tourId, payload);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
