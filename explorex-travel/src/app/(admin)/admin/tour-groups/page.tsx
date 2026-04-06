import { TourGroupFilterBar } from "@/components/admin/tour-group-filter-bar";
import { TourGroupRowActions } from "@/components/admin/tour-group-row-actions";
import { listTourGroups } from "@/services/tour-group.service";

const statusMap: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Hoạt động",
    className: "bg-[#d7f4ef] text-[#00b69b]",
  },
  INACTIVE: {
    label: "Tạm dừng",
    className: "bg-[#ffe1df] text-[#ef3826]",
  },
};

function ScenicThumbnail({ seed }: { seed: string }) {
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

export default async function AdminTourGroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; action?: string; createdBy?: string; dateRange?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const keyword = params.q?.trim().toLowerCase() ?? "";
  const statusFilter = params.status?.trim() ?? "";
  const tourGroups = await listTourGroups();

  const filteredGroups = tourGroups.filter((item) => {
    const matchesKeyword =
      keyword.length === 0 ||
      item.tenNhomTour.toLowerCase().includes(keyword) ||
      item.maNhomTour.toLowerCase().includes(keyword) ||
      (item.moTaTour ?? "").toLowerCase().includes(keyword);

    const matchesStatus = statusFilter.length === 0 || item.trangThai === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Quản lý danh mục</h2>
      </section>

      <TourGroupFilterBar
        initialKeyword={params.q ?? ""}
        initialStatus={statusFilter}
        initialCreatedBy={params.createdBy ?? ""}
        initialAction={params.action ?? ""}
        initialDateRange={params.dateRange ?? ""}
        initialFilter={params.filter ?? ""}
      />

      <section className="overflow-hidden rounded-[14px] border border-[#d5d5d5] bg-white shadow-[0_16px_40px_rgba(226,232,240,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="w-12 px-5 py-4 text-left">
                  <input type="checkbox" className="size-4 rounded border border-[#d5d5d5]" />
                </th>
                <th className="px-3 py-4 text-left font-extrabold">Tên danh mục</th>
                <th className="px-3 py-4 text-left font-extrabold">Ảnh đại diện</th>
                <th className="px-3 py-4 text-left font-extrabold">Vị trí</th>
                <th className="px-3 py-4 text-left font-extrabold">Trạng thái</th>
                <th className="px-3 py-4 text-left font-extrabold">Tạo bởi</th>
                <th className="px-3 py-4 text-left font-extrabold">Cập nhật bởi</th>
                <th className="px-3 py-4 text-left font-extrabold">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Không có danh mục phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredGroups.map((item, index) => {
                  const status = statusMap[item.trangThai] ?? {
                    label: item.trangThai,
                    className: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <tr key={item.maNhomTour} className="border-b border-[#eceef2] last:border-b-0">
                      <td className="px-5 py-4">
                        <input type="checkbox" className="size-4 rounded border border-[#d5d5d5]" />
                      </td>
                      <td className="px-3 py-4 font-semibold opacity-90">{item.tenNhomTour}</td>
                      <td className="px-3 py-4">
                        <ScenicThumbnail seed={item.maNhomTour} />
                      </td>
                      <td className="px-3 py-4 font-semibold opacity-90">{index + 1}</td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-[12px] leading-5 opacity-90">
                        <p className="text-[14px] font-semibold text-[#202224]">Chưa cập nhật</p>
                        <p>--:-- --/--/----</p>
                      </td>
                      <td className="px-3 py-4 text-[12px] leading-5 opacity-90">
                        <p className="text-[14px] font-semibold text-[#202224]">Chưa cập nhật</p>
                        <p>--:-- --/--/----</p>
                      </td>
                      <td className="px-3 py-4">
                        <TourGroupRowActions groupId={item.maNhomTour} />
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
          Hiển thị {filteredGroups.length === 0 ? 0 : 1} - {filteredGroups.length} của {tourGroups.length}
        </p>
        <div className="inline-flex items-center rounded-[8px] border border-[#d5d5d5] bg-[#fafbfd] px-4 py-2 text-[#202224]/60">
          Trang 1
        </div>
      </section>
    </div>
  );
}
