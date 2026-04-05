import { PageHero } from "@/components/ui/page-hero";

export default async function AdminProviderDetailPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = await params;

  return <PageHero eyebrow="Admin" title={`Chi tiet doi tac ${providerId}`} description="Trang duyet va quan ly chi tiet doi tac." />;
}
