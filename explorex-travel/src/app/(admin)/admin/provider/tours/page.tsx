import Link from "next/link";

import { ProviderTourRowActions } from "@/components/provider/provider-tour-row-actions";
import {
  ProviderMetricCard,
  ProviderPageHeader,
  ProviderSection,
  ProviderStatusBadge,
} from "@/components/provider/provider-ui";
import { getProviderAdminAccess } from "@/lib/auth/provider-admin";
import { listTours } from "@/services/tour.service";

function TourThumbnail({ imageUrl, seed }: { imageUrl: string | null; seed: string }) {
  if (imageUrl) {
    return <img src={imageUrl} alt="" className="h-[44px] w-[44px] rounded-[6px] object-cover" />;
  }

  const palette = [
    "from-[#2f7cf6] via-[#74a9ff] to-[#d8ecff]",
    "from-[#0f766e] via-[#34d399] to-[#d1fae5]",
    "from-[#0f172a] via-[#1d4ed8] to-[#60a5fa]",
  ];
  const index = seed.length % palette.length;

  return (
    <div className={`relative h-[44px] w-[44px] overflow-hidden rounded-[6px] bg-gradient-to-br ${palette[index]}`}>
      <div className="absolute inset-x-0 bottom-0 h-4 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.32)_100%)]" />
    </div>
  );
}

export default async function ProviderAdminToursPage() {
  const { provider } = await getProviderAdminAccess();
  const tours = await listTours({ maNhaCungCap: provider.maNhaCungCap });

  const pendingCount = tours.filter((tour) => tour.trangThai === "PENDING_REVIEW").length;
  const publishedCount = tours.filter((tour) => tour.trangThai === "PUBLISHED").length;
  const draftCount = tours.filter((tour) => tour.trangThai === "DRAFT").length;

  return (
    <div className="space-y-6">
      <ProviderPageHeader
        eyebrow="Quản lý tour"
        title={`Tour của ${provider.tenNhaCungCap ?? provider.maNhaCungCap}`}
        description="Bạn chỉ thấy và cập nhật tour thuộc hồ sơ nhà cung cấp của mình. Khi gửi duyệt, admin chỉ được đổi trạng thái thay vì sửa nội dung tour."
        action={
          <Link
            href="/admin/provider/tours/new"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] bg-[#4880ff] px-5 py-3 text-[14px] font-bold text-white shadow-[0_12px_26px_rgba(72,128,255,0.25)] transition hover:bg-[#3f74e8]"
          >
            + Tạo tour mới
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProviderMetricCard title="Tổng tour" value={String(tours.length)} description="Toàn bộ tour thuộc nhà cung cấp của bạn." />
        <ProviderMetricCard title="Bản nháp" value={String(draftCount)} description="Tour đang soạn nội dung hoặc chưa gửi duyệt." />
        <ProviderMetricCard title="Chờ duyệt" value={String(pendingCount)} description="Tour đã gửi admin duyệt trạng thái." />
        <ProviderMetricCard title="Đang hiển thị" value={String(publishedCount)} description="Tour hiện đang công khai ở khu public." />
      </section>

      <ProviderSection title="Danh sách tour" description="Mỗi tour đều dùng đúng mã chuẩn từ bảng tour và chỉ thao tác trong phạm vi provider hiện tại.">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-3 py-4 text-left font-extrabold">Mã tour</th>
                <th className="px-3 py-4 text-left font-extrabold">Tour</th>
                <th className="px-3 py-4 text-left font-extrabold">Danh mục</th>
                <th className="px-3 py-4 text-left font-extrabold">Thời lượng</th>
                <th className="px-3 py-4 text-left font-extrabold">Sức chứa</th>
                <th className="px-3 py-4 text-left font-extrabold">Trạng thái</th>
                <th className="px-3 py-4 text-left font-extrabold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Bạn chưa có tour nào. Hãy tạo tour đầu tiên để bắt đầu mở lịch khởi hành.
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour.maTour} className="border-b border-[#eceef2] last:border-b-0">
                    <td className="px-3 py-4 font-semibold">{tour.maTour}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <TourThumbnail imageUrl={tour.hinhAnh} seed={tour.maTour} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#202224]">{tour.tenTour}</p>
                          <p className="mt-1 truncate text-[12px] text-[#6b7280]">{tour.loaiTour ?? "Chưa cập nhật loại tour"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">{tour.tenNhomTour ?? tour.maNhomTour}</td>
                    <td className="px-3 py-4">{tour.thoiLuong ?? "Chưa cập nhật"}</td>
                    <td className="px-3 py-4">{tour.sLKhachToiDa ?? 0} khách</td>
                    <td className="px-3 py-4">
                      <ProviderStatusBadge status={tour.trangThai} kind="tour" />
                    </td>
                    <td className="px-3 py-4">
                      <ProviderTourRowActions tourId={tour.maTour} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ProviderSection>
    </div>
  );
}
