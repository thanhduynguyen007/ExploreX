import { NextResponse } from "next/server";

import { toApiErrorResponse } from "@/lib/auth/guards";
import { getPublicTourDetail } from "@/services/tour.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tourId: string }> },
) {
  try {
    const { tourId } = await params;
    const item = await getPublicTourDetail(tourId);
    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
