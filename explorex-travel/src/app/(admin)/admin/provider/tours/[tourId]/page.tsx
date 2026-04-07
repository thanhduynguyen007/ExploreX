import Link from "next/link";

import { ProviderStatusBadge } from "@/components/provider/provider-ui";
import { getProviderAdminAccess } from "@/lib/auth/provider-admin";
import { getTourDetail } from "@/services/tour.service";

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-[#e9edf3] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
      <p className="text-[13px] font-semibold text-[#7b8190]">{label}</p>
      <p className="mt-2 text-[16px] font-bold leading-7 text-[#202224]">{value}</p>
    </article>
  );
}

function TourPreview({ imageUrl, seed }: { imageUrl: string | null; seed: string }) {
  if (imageUrl) {
    return <img src={imageUrl} alt="Ảnh đại diện tour" className="h-full w-full object-cover" />;
  }

  const palette = [
    "from-[#2f7cf6] via-[#74a9ff] to-[#d8ecff]",
    "from-[#0f766e] via-[#34d399] to-[#d1fae5]",
    "from-[#0f172a] via-[#1d4ed8] to-[#60a5fa]",
  ];
  const index = seed.length % palette.length;

  return (
    <div className={`relative h-full min-h-[240px] w-full bg-gradient-to-br ${palette[index]}`}>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.32)_100%)]" />
      <div className="absolute left-6 top-6 size-10 rounded-full bg-white/35" />
      <div className="absolute bottom-6 left-6 right-6 h-10 rounded-full bg-white/30" />
    </div>
  );
}

export default async function ProviderAdminTourDetailPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { provider } = await getProviderAdminAccess();
  const { tourId } = await params;
  const tour = await getTourDetail(tourId, { maNhaCungCap: provider.maNhaCungCap });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link href="/admin/provider/tours" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5a8cff]">
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Quay lại danh sách
          </Link>
          <div>
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">{tour.tenTour}</h2>
            <p className="mt-2 text-[15px] text-[#6b7280]">
              Theo dõi chi tiết tour thuộc quyền sở hữu của nhà cung cấp hiện tại. Backend tiếp tục chặn truy cập nếu tour không thuộc đúng hồ sơ provider.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ProviderStatusBadge status={tour.trangThai} kind="tour" />
          <Link
            href={`/admin/provider/tours/${tour.maTour}/edit`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] bg-[#4880ff] px-5 py-3 text-[14px] font-bold text-white shadow-[0_12px_26px_rgba(72,128,255,0.25)] transition hover:bg-[#3f74e8]"
          >
            Chỉnh sửa
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard label="Mã tour" value={tour.maTour} />
        <DetailCard label="Danh mục" value={tour.tenNhomTour ?? tour.maNhomTour} />
        <DetailCard label="Nhà cung cấp" value={provider.tenNhaCungCap ?? provider.maNhaCungCap} />
        <DetailCard label="Số khách tối đa" value={`${tour.sLKhachToiDa ?? 0} khách`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h3 className="text-[20px] font-bold text-[#202224]">Thông tin tour</h3>
          </div>

          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            <div>
              <p className="text-[13px] font-semibold text-[#7b8190]">Loại tour</p>
              <p className="mt-2 text-[15px] font-semibold text-[#202224]">{tour.loaiTour ?? "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#7b8190]">Thời lượng</p>
              <p className="mt-2 text-[15px] font-semibold text-[#202224]">{tour.thoiLuong ?? "Chưa cập nhật"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[13px] font-semibold text-[#7b8190]">Mô tả</p>
              <p className="mt-2 text-[15px] leading-8 text-[#202224]">{tour.moTa ?? "Chưa có mô tả cho tour này."}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[13px] font-semibold text-[#7b8190]">Liên kết ảnh</p>
              <p className="mt-2 break-all text-[15px] leading-7 text-[#202224]">{tour.hinhAnh ?? "Chưa cập nhật"}</p>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-[22px] border border-[#d9d9d9] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#edf1f6] px-6 py-5">
            <h3 className="text-[20px] font-bold text-[#202224]">Ảnh đại diện</h3>
          </div>
          <div className="p-6">
            <div className="overflow-hidden rounded-[18px] border border-[#e9edf3] bg-[#f7f8fc]">
              <TourPreview imageUrl={tour.hinhAnh} seed={tour.maTour} />
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
