import { TourFilterBar } from "@/components/admin/tour-filter-bar";
import { TourRowActions } from "@/components/admin/tour-row-actions";
import { TOUR_STATUSES } from "@/lib/constants/statuses";
import { listTourGroups } from "@/services/tour-group.service";
import { listProviders, listTours } from "@/services/tour.service";

const statusMap: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: "Bản nháp",
    className: "bg-[#fff4de] text-[#d97706]",
  },
  PENDING_REVIEW: {
    label: "Chờ duyệt",
    className: "bg-[#efe7ff] text-[#7c3aed]",
  },
  PUBLISHED: {
    label: "Đang hiển thị",
    className: "bg-[#d7f4ef] text-[#00b69b]",
  },
  HIDDEN: {
    label: "Đang ẩn",
    className: "bg-[#e5e7eb] text-[#4b5563]",
  },
  INACTIVE: {
    label: "Ngừng khai thác",
    className: "bg-[#ffe1df] text-[#ef3826]",
  },
};

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
      <div className="absolute left-1.5 top-1.5 size-3 rounded-full bg-white/35" />
      <div className="absolute bottom-1.5 left-1.5 right-1.5 h-2.5 rounded-full bg-white/30" />
    </div>
  );
}

export default async function AdminToursPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; group?: string; provider?: string }>;
}) {
  const params = await searchParams;
  const [tours, tourGroups, providers] = await Promise.all([listTours(), listTourGroups(), listProviders()]);

  const keyword = params.q?.trim().toLowerCase() ?? "";
  const statusFilter = params.status?.trim() ?? "";
  const groupFilter = params.group?.trim() ?? "";
  const providerFilter = params.provider?.trim() ?? "";

  const filteredTours = tours.filter((tour) => {
    const haystack = [tour.maTour, tour.tenTour, tour.tenNhomTour ?? "", tour.tenNhaCungCap ?? "", tour.loaiTour ?? "", tour.moTa ?? ""]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = keyword.length === 0 || haystack.includes(keyword);
    const matchesStatus = statusFilter.length === 0 || tour.trangThai === statusFilter;
    const matchesGroup = groupFilter.length === 0 || tour.maNhomTour === groupFilter;
    const matchesProvider = providerFilter.length === 0 || tour.maNhaCungCap === providerFilter;

    return matchesKeyword && matchesStatus && matchesGroup && matchesProvider;
  });

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Quản lý tour</h2>
      </section>

      <TourFilterBar
        initialKeyword={params.q ?? ""}
        initialStatus={statusFilter}
        initialGroup={groupFilter}
        initialProvider={providerFilter}
        statusOptions={[
          { value: "", label: "Tất cả trạng thái" },
          ...TOUR_STATUSES.map((status) => ({
            value: status,
            label: statusMap[status]?.label ?? status,
          })),
        ]}
        groupOptions={[
          { value: "", label: "Tất cả danh mục" },
          ...tourGroups.map((group) => ({
            value: group.maNhomTour,
            label: group.tenNhomTour,
          })),
        ]}
        providerOptions={[
          { value: "", label: "Tất cả nhà cung cấp" },
          ...providers.map((provider) => ({
            value: provider.maNhaCungCap,
            label: provider.tenNhaCungCap ?? provider.maNhaCungCap,
          })),
        ]}
      />

      <section className="overflow-hidden rounded-[14px] border border-[#d5d5d5] bg-white shadow-[0_16px_40px_rgba(226,232,240,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1220px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-3 py-4 text-left font-extrabold">Mã tour</th>
                <th className="px-3 py-4 text-left font-extrabold">Tour</th>
                <th className="px-3 py-4 text-left font-extrabold">Danh mục</th>
                <th className="px-3 py-4 text-left font-extrabold">Nhà cung cấp</th>
                <th className="px-3 py-4 text-left font-extrabold">Thời lượng</th>
                <th className="px-3 py-4 text-left font-extrabold">Sức chứa</th>
                <th className="px-3 py-4 text-left font-extrabold">Trạng thái</th>
                <th className="px-3 py-4 text-left font-extrabold">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredTours.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Không có tour phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredTours.map((tour) => {
                  const status = statusMap[tour.trangThai] ?? {
                    label: tour.trangThai,
                    className: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <tr key={tour.maTour} className="border-b border-[#eceef2] last:border-b-0">
                      <td className="px-3 py-4 font-semibold opacity-90">{tour.maTour}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <TourThumbnail imageUrl={tour.hinhAnh} seed={tour.maTour} />
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-semibold text-[#202224]">{tour.tenTour}</p>
                            <p className="truncate text-[12px] text-[#6b7280]">{tour.loaiTour ?? "Chưa cập nhật loại tour"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 font-semibold opacity-90">{tour.tenNhomTour ?? tour.maNhomTour}</td>
                      <td className="px-3 py-4">
                        <p className="text-[14px] font-semibold text-[#202224]">{tour.tenNhaCungCap ?? tour.maNhaCungCap}</p>
                        <p className="text-[12px] text-[#6b7280]">{tour.maNhaCungCap}</p>
                      </td>
                      <td className="px-3 py-4 font-semibold opacity-90">{tour.thoiLuong ?? "Chưa cập nhật"}</td>
                      <td className="px-3 py-4 font-semibold opacity-90">{tour.sLKhachToiDa ?? 0} khách</td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <TourRowActions tourId={tour.maTour} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3 text-[14px] text-[rgba(32,34,36,0.6)] md:flex-row md:items-center md:justify-between">
        <p>
          Hiển thị {filteredTours.length === 0 ? 0 : 1} - {filteredTours.length} của {tours.length}
        </p>
        <div className="inline-flex items-center rounded-[8px] border border-[#d5d5d5] bg-[#fafbfd] px-4 py-2 text-[#202224]/60">
          Trang 1
        </div>
      </section>
    </div>
  );
}
