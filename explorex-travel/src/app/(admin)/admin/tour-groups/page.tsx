import Link from "next/link";

import { TourGroupRowActions } from "@/components/admin/tour-group-row-actions";
import { listTourGroups } from "@/services/tour-group.service";

const statusMap: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Đang hoạt động",
    className: "bg-emerald-100 text-emerald-700",
  },
  INACTIVE: {
    label: "Tạm ẩn",
    className: "bg-slate-200 text-slate-600",
  },
};

export default async function AdminTourGroupsPage() {
  const tourGroups = await listTourGroups();

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">Quản lý danh mục</h2>
          <p className="mt-2 text-sm text-slate-500">Quản trị danh mục tour để dùng cho toàn bộ hệ thống.</p>
        </div>

        <Link
          href="/admin/tour-groups/new"
          className="rounded-xl bg-[#4880ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3f74e8]"
        >
          Thêm danh mục
        </Link>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold text-slate-900">Danh sách danh mục tour</h3>
            <p className="mt-1 text-sm text-slate-500">Tổng cộng {tourGroups.length.toLocaleString("vi-VN")} danh mục.</p>
          </div>

          <div className="w-full max-w-xs rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">
            Tìm kiếm danh mục
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.14em] text-slate-400">
              <tr>
                <th className="px-5 py-4 font-semibold">Mã danh mục</th>
                <th className="px-5 py-4 font-semibold">Tên danh mục</th>
                <th className="px-5 py-4 font-semibold">Mô tả</th>
                <th className="px-5 py-4 font-semibold">Trạng thái</th>
                <th className="px-5 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tourGroups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                    Chưa có danh mục nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                tourGroups.map((item) => {
                  const status = statusMap[item.trangThai] ?? {
                    label: item.trangThai,
                    className: "bg-slate-100 text-slate-600",
                  };

                  return (
                    <tr key={item.maNhomTour} className="text-slate-600">
                      <td className="px-5 py-4 font-semibold text-[#4880ff]">{item.maNhomTour}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{item.tenNhomTour}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {item.moTaTour ? (
                          <p className="max-w-md truncate">{item.moTaTour}</p>
                        ) : (
                          <span className="text-slate-400">Chưa có mô tả</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
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
    </div>
  );
}
