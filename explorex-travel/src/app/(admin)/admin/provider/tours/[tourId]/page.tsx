import { redirect } from "next/navigation";

import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { getProviderProfileByUserId, getTourDetail } from "@/services/tour.service";

export default async function ProviderAdminTourDetailPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await getProviderProfileByUserId(user.id);
  const { tourId } = await params;
  const tour = await getTourDetail(tourId, { maNhaCungCap: provider.maNhaCungCap });

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Quản trị đối tác"
        title={tour.tenTour}
        description="Trang này đọc đúng tour thuộc đối tác đang đăng nhập. Nếu không đúng quyền sở hữu, backend sẽ từ chối truy cập."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Mã tour" description={tour.maTour} />
        <InfoCard title="Nhóm tour" description={tour.tenNhomTour ?? tour.maNhomTour} />
        <InfoCard title="Trạng thái" description={tour.trangThai} />
        <InfoCard title="Sức chứa tối đa" description={`${tour.sLKhachToiDa ?? 0} khách`} />
      </div>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Thông tin tour</h2>
        <dl className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-stone-500">Loại tour</dt>
            <dd className="mt-1 text-sm text-stone-800">{tour.loaiTour ?? "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">Thời lượng</dt>
            <dd className="mt-1 text-sm text-stone-800">{tour.thoiLuong ?? "Chưa cập nhật"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-stone-500">Mô tả</dt>
            <dd className="mt-1 text-sm leading-7 text-stone-800">{tour.moTa ?? "Chưa có mô tả cho tour này."}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
