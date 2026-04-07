import { NextResponse } from "next/server";

import { getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";
import {
  isProviderApprovalStatus,
  updateAdminProviderApprovalStatus,
} from "@/services/provider.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ providerId: string }> },
) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN"]);

    const body = (await request.json()) as { trangThaiHopTac?: string };
    const nextStatus = body.trangThaiHopTac?.trim() ?? "";

    if (!isProviderApprovalStatus(nextStatus)) {
      return NextResponse.json({ message: "Trạng thái hợp tác không hợp lệ." }, { status: 400 });
    }

    const { providerId } = await params;
    const item = await updateAdminProviderApprovalStatus(providerId, nextStatus);

    return NextResponse.json({ item, message: "Đã cập nhật trạng thái nhà cung cấp." });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
