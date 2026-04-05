import { NextResponse } from "next/server";

import { listPublicTours } from "@/services/tour.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("q") ?? undefined;
  const maNhomTour = searchParams.get("group") ?? undefined;

  const items = await listPublicTours({ keyword, maNhomTour });
  return NextResponse.json({ items });
}
