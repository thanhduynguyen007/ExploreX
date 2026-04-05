"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { tourGroupSchema, updateTourGroupSchema } from "@/lib/validations/tour-group";
import type { TourGroup } from "@/types/tour-group";

type TourGroupFormProps = {
  mode?: "create" | "edit";
  initialValue?: TourGroup;
};

export const TourGroupForm = ({ mode = "create", initialValue }: TourGroupFormProps) => {
  const router = useRouter();
  const [maNhomTour, setMaNhomTour] = useState(initialValue?.maNhomTour ?? "");
  const [tenNhomTour, setTenNhomTour] = useState(initialValue?.tenNhomTour ?? "");
  const [moTaTour, setMoTaTour] = useState(initialValue?.moTaTour ?? "");
  const [trangThai, setTrangThai] = useState<TourGroup["trangThai"]>(initialValue?.trangThai ?? "ACTIVE");
  const [loading, setLoading] = useState(false);
  const isEdit = mode === "edit";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await updateTourGroupSchema.validate({ tenNhomTour, moTaTour, trangThai }, { abortEarly: true });
      } else {
        await tourGroupSchema.validate({ maNhomTour, tenNhomTour, moTaTour }, { abortEarly: true });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu nhóm tour không hợp lệ");
      return;
    }

    const response = await fetch(isEdit ? `/api/admin/tour-groups/${maNhomTour}` : "/api/admin/tour-groups", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEdit ? { tenNhomTour, moTaTour, trangThai } : { maNhomTour, tenNhomTour, moTaTour }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.message ?? "Không thể tạo nhóm tour");
      return;
    }

    toast.success(isEdit ? "Cập nhật danh mục thành công" : "Tạo nhóm tour thành công");

    if (isEdit) {
      router.push("/admin/tour-groups");
      router.refresh();
      return;
    }

    setMaNhomTour("");
    setTenNhomTour("");
    setMoTaTour("");
    setTrangThai("ACTIVE");
    router.push("/admin/tour-groups");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-8 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{isEdit ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {isEdit ? "Cập nhật tên, mô tả và trạng thái cho danh mục tour." : "Điền thông tin danh mục để dùng cho các tour trong hệ thống."}
          </p>
        </div>
        <Link href="/admin/tour-groups" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
          Quay lại
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="maNhomTour" className="mb-2 block text-sm font-medium text-slate-700">
            Mã danh mục
          </label>
          <input
            id="maNhomTour"
            value={maNhomTour}
            disabled={isEdit}
            onChange={(event) => setMaNhomTour(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
            placeholder="danh-muc-tour-mien-tay"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="tenNhomTour" className="mb-2 block text-sm font-medium text-slate-700">
            Tên danh mục
          </label>
          <input
            id="tenNhomTour"
            value={tenNhomTour}
            onChange={(event) => setTenNhomTour(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            placeholder="Du lịch sinh thái"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="moTaTour" className="mb-2 block text-sm font-medium text-slate-700">
            Mô tả danh mục
          </label>
          <textarea
            id="moTaTour"
            value={moTaTour}
            onChange={(event) => setMoTaTour(event.target.value)}
            className="min-h-32 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            placeholder="Mô tả ngắn giúp admin và đối tác hiểu rõ phạm vi danh mục."
          />
        </div>

        {isEdit ? (
          <div className="md:col-span-2">
            <label htmlFor="trangThai" className="mb-2 block text-sm font-medium text-slate-700">
              Trạng thái
            </label>
            <select
              id="trangThai"
              value={trangThai}
              onChange={(event) => setTrangThai(event.target.value as TourGroup["trangThai"])}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            >
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Tạm ẩn</option>
            </select>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#4880ff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3f74e8] disabled:opacity-60"
        >
          {loading ? (isEdit ? "Đang lưu..." : "Đang tạo...") : isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
        </button>
      </div>
    </form>
  );
};
