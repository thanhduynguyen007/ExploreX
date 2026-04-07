import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import type { AuthUser } from "@/types/auth";
import { getProviderProfileByUserId } from "@/services/tour.service";
import type { ProviderProfile } from "@/types/tour";

export const getProviderAdminAccess = async ({
  allowPending = false,
}: {
  allowPending?: boolean;
} = {}): Promise<{ user: AuthUser; provider: ProviderProfile }> => {
  const user = await getSessionUser();

  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id, { requireApproved: false });

  if (!allowPending && provider.trangThaiHopTac !== "APPROVED") {
    redirect("/admin/provider/dashboard");
  }

  return { user, provider };
};
