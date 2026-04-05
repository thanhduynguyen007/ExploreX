import { PageHero } from "@/components/ui/page-hero";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return <PageHero eyebrow="Admin" title={`Chi tiet user ${userId}`} description="Trang xem thong tin va thao tac tren tung nguoi dung." />;
}
