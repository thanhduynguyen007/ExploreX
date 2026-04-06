import { ProviderFilterBar } from "@/components/admin/provider-filter-bar";
import { ProviderRowActions } from "@/components/admin/provider-row-actions";
import { listAdminProviders } from "@/services/provider.service";

const statusMap: Record<string, { label: string; className: string }> = {
  APPROVED: { label: "Đã duyệt", className: "bg-[#d7f4ef] text-[#00b69b]" },
  PENDING: { label: "Chờ duyệt", className: "bg-[#fff4de] text-[#d97706]" },
  REJECTED: { label: "Từ chối", className: "bg-[#ffe1df] text-[#ef3826]" },
  SUSPENDED: { label: "Tạm dừng", className: "bg-[#e5e7eb] text-[#4b5563]" },
};

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")} đ`;

export default async function AdminProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; serviceType?: string }>;
}) {
  const params = await searchParams;
  const providers = await listAdminProviders();

  const keyword = params.q?.trim().toLowerCase() ?? "";
  const statusFilter = params.status?.trim() ?? "";
  const serviceTypeFilter = params.serviceType?.trim() ?? "";

  const filteredProviders = providers.filter((provider) => {
    const haystack = [
      provider.maNhaCungCap,
      provider.tenNhaCungCap ?? "",
      provider.diaChi ?? "",
      provider.loaiDichVu ?? "",
      provider.thongTinNhaCungCap ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = keyword.length === 0 || haystack.includes(keyword);
    const matchesStatus = statusFilter.length === 0 || (provider.trangThaiHopTac ?? "") === statusFilter;
    const matchesServiceType = serviceTypeFilter.length === 0 || (provider.loaiDichVu ?? "") === serviceTypeFilter;

    return matchesKeyword && matchesStatus && matchesServiceType;
  });

  const uniqueStatuses = Array.from(new Set(providers.map((provider) => provider.trangThaiHopTac).filter(Boolean))).sort();
  const uniqueServiceTypes = Array.from(new Set(providers.map((provider) => provider.loaiDichVu).filter(Boolean))).sort();

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#202224]">Quản lý nhà cung cấp</h2>
      </section>

      <ProviderFilterBar
        initialKeyword={params.q ?? ""}
        initialStatus={statusFilter}
        initialServiceType={serviceTypeFilter}
        statusOptions={[
          { value: "", label: "Tất cả trạng thái" },
          ...uniqueStatuses.map((status) => ({
            value: status!,
            label: statusMap[status!]?.label ?? status!,
          })),
        ]}
        serviceTypeOptions={[
          { value: "", label: "Tất cả dịch vụ" },
          ...uniqueServiceTypes.map((serviceType) => ({
            value: serviceType!,
            label: serviceType!,
          })),
        ]}
      />

      <section className="overflow-hidden rounded-[14px] border border-[#d5d5d5] bg-white shadow-[0_16px_40px_rgba(226,232,240,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full text-[14px] text-[#202224]">
            <thead className="bg-[#fcfdfd]">
              <tr className="border-b border-[#eceef2]">
                <th className="px-3 py-4 text-left font-extrabold">Nhà cung cấp</th>
                <th className="px-3 py-4 text-left font-extrabold">Loại dịch vụ</th>
                <th className="px-3 py-4 text-left font-extrabold">Địa chỉ</th>
                <th className="px-3 py-4 text-left font-extrabold">Hiệu suất</th>
                <th className="px-3 py-4 text-left font-extrabold">Trạng thái</th>
                <th className="px-3 py-4 text-left font-extrabold">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#6b7280]">
                    Không có nhà cung cấp phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider) => {
                  const status = statusMap[provider.trangThaiHopTac ?? ""] ?? {
                    label: provider.trangThaiHopTac ?? "Chưa cập nhật",
                    className: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <tr key={provider.maNhaCungCap} className="border-b border-[#eceef2] last:border-b-0">
                      <td className="px-3 py-4">
                        <p className="text-[14px] font-semibold text-[#202224]">{provider.tenNhaCungCap ?? provider.maNhaCungCap}</p>
                        <p className="text-[12px] text-[#6b7280]">{provider.maNhaCungCap}</p>
                      </td>
                      <td className="px-3 py-4">
                        <p className="font-semibold opacity-90">{provider.loaiDichVu ?? "Chưa cập nhật"}</p>
                        <p className="mt-1 line-clamp-2 text-[12px] text-[#6b7280]">{provider.thongTinNhaCungCap ?? "Chưa có mô tả"}</p>
                      </td>
                      <td className="px-3 py-4 font-semibold opacity-90">{provider.diaChi ?? "Chưa cập nhật"}</td>
                      <td className="px-3 py-4">
                        <div className="space-y-1 text-[12px] text-[#6b7280]">
                          <p>
                            <span className="font-bold text-[#202224]">{provider.totalTours}</span> tour,{" "}
                            <span className="font-bold text-[#202224]">{provider.publishedTours}</span> đang hiển thị
                          </p>
                          <p>
                            <span className="font-bold text-[#202224]">{provider.totalBookings}</span> đơn, doanh thu{" "}
                            <span className="font-bold text-[#202224]">{formatCurrency(provider.totalRevenue)}</span>
                          </p>
                          <p>
                            <span className="font-bold text-[#202224]">{provider.totalReviews}</span> đánh giá, điểm TB{" "}
                            <span className="font-bold text-[#202224]">{provider.avgRating?.toFixed(1) ?? "0.0"}</span>
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex rounded-[4.5px] px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
                      </td>
                      <td className="px-3 py-4">
                        <ProviderRowActions providerId={provider.maNhaCungCap} />
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
          Hiển thị {filteredProviders.length === 0 ? 0 : 1} - {filteredProviders.length} của {providers.length}
        </p>
        <div className="inline-flex items-center rounded-[8px] border border-[#d5d5d5] bg-[#fafbfd] px-4 py-2 text-[#202224]/60">
          Trang 1
        </div>
      </section>
    </div>
  );
}
