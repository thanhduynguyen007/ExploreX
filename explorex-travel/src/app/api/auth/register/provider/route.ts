import { NextResponse } from "next/server";

import { providerRegisterSchema } from "@/lib/validations/auth";
import { createProviderAccount } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = await providerRegisterSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await createProviderAccount(payload);

    return NextResponse.json({
      message: "Hồ sơ đối tác đã được gửi. Bạn có thể đăng nhập để theo dõi trạng thái duyệt.",
      email: result.email,
      redirectTo: "/login",
    });
  } catch (error) {
    const { toApiErrorResponse } = await import("@/lib/auth/guards");
    return toApiErrorResponse(error);
  }
}
