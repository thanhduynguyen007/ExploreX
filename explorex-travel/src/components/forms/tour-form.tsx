"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createTourByProviderSchema,
  providerEditableTourStatuses,
  updateTourByProviderSchema,
} from "@/lib/validations/tour";

type TourFormProps = {
  mode: "create" | "edit";
  endpoint: string;
  redirectTo: string;
  cancelHref: string;
  submitLabel: string;
  tourGroups: Array<{ maNhomTour: string; tenNhomTour: string }>;
  initialValues?: {
    maTour?: string;
    maNhomTour: string;
    tenTour: string;
    moTa: string;
    thoiLuong: string;
    sLKhachToiDa: number;
    trangThai: (typeof providerEditableTourStatuses)[number];
    loaiTour: string;
    hinhAnh: string;
  };
};

export const TourForm = ({
  mode,
  endpoint,
  redirectTo,
  cancelHref,
  submitLabel,
  tourGroups,
  initialValues,
}: TourFormProps) => {
  const router = useRouter();
  const [maTour, setMaTour] = useState(initialValues?.maTour ?? "");
  const [maNhomTour, setMaNhomTour] = useState(initialValues?.maNhomTour ?? tourGroups[0]?.maNhomTour ?? "");
  const [tenTour, setTenTour] = useState(initialValues?.tenTour ?? "");
  const [moTa, setMoTa] = useState(initialValues?.moTa ?? "");
  const [thoiLuong, setThoiLuong] = useState(initialValues?.thoiLuong ?? "");
  const [sLKhachToiDa, setSLKhachToiDa] = useState(String(initialValues?.sLKhachToiDa ?? 20));
  const [trangThai, setTrangThai] = useState<(typeof providerEditableTourStatuses)[number]>(
    initialValues?.trangThai ?? "DRAFT",
  );
  const [loaiTour, setLoaiTour] = useState(initialValues?.loaiTour ?? "");
  const [hinhAnh, setHinhAnh] = useState(initialValues?.hinhAnh ?? "");
  const [loading, setLoading] = useState(false);

  const schema = useMemo(
    () => (mode === "create" ? createTourByProviderSchema : updateTourByProviderSchema),
    [mode],
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const rawPayload = {
      ...(mode === "create" ? { maTour } : {}),
      maNhomTour,
      tenTour,
      moTa,
      thoiLuong,
      sLKhachToiDa,
      trangThai,
      loaiTour,
      hinhAnh,
    };

    let payload: unknown;
    try {
      payload = await schema.validate(rawPayload, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Dữ liệu tour không hợp lệ");
      return;
    }

    const response = await fetch(endpoint, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({ message: "Đã xảy ra lỗi máy chủ." }));
    setLoading(false);

    if (!response.ok) {
      toast.error(result.message ?? "Không thể lưu tour");
      return;
    }

    toast.success(mode === "create" ? "Tạo tour thành công" : "Cập nhật tour thành công");
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="maTour" className="mb-2 block text-sm font-medium text-stone-700">
            Mã tour
          </label>
          <input
            id="maTour"
            value={maTour}
            onChange={(event) => setMaTour(event.target.value)}
            disabled={mode === "edit"}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 disabled:bg-stone-100"
            placeholder="tour-can-tho-2n1d"
          />
        </div>
        <div>
          <label htmlFor="maNhomTour" className="mb-2 block text-sm font-medium text-stone-700">
            Nhóm tour
          </label>
          <select
            id="maNhomTour"
            value={maNhomTour}
            onChange={(event) => setMaNhomTour(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          >
            {tourGroups.map((item) => (
              <option key={item.maNhomTour} value={item.maNhomTour}>
                {item.tenNhomTour}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="tenTour" className="mb-2 block text-sm font-medium text-stone-700">
            Tên tour
          </label>
          <input
            id="tenTour"
            value={tenTour}
            onChange={(event) => setTenTour(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
            placeholder="Khám phá Cần Thơ 2 ngày 1 đêm"
          />
        </div>
        <div>
          <label htmlFor="loaiTour" className="mb-2 block text-sm font-medium text-stone-700">
            Loại tour
          </label>
          <input
            id="loaiTour"
            value={loaiTour}
            onChange={(event) => setLoaiTour(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
            placeholder="Du lịch nội địa"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label htmlFor="thoiLuong" className="mb-2 block text-sm font-medium text-stone-700">
            Thời lượng
          </label>
          <input
            id="thoiLuong"
            value={thoiLuong}
            onChange={(event) => setThoiLuong(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
            placeholder="2 ngày 1 đêm"
          />
        </div>
        <div>
          <label htmlFor="sLKhachToiDa" className="mb-2 block text-sm font-medium text-stone-700">
            Số khách tối đa
          </label>
          <input
            id="sLKhachToiDa"
            type="number"
            min={1}
            value={sLKhachToiDa}
            onChange={(event) => setSLKhachToiDa(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
            placeholder="20"
          />
        </div>
        <div>
          <label htmlFor="trangThai" className="mb-2 block text-sm font-medium text-stone-700">
            Trạng thái
          </label>
          <select
            id="trangThai"
            value={trangThai}
            onChange={(event) => setTrangThai(event.target.value as (typeof providerEditableTourStatuses)[number])}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          >
            <option value="DRAFT">Bản nháp</option>
            <option value="PENDING_REVIEW">Chờ duyệt</option>
            <option value="HIDDEN">Đang ẩn</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="hinhAnh" className="mb-2 block text-sm font-medium text-stone-700">
          Hình ảnh đại diện
        </label>
        <input
          id="hinhAnh"
          value={hinhAnh}
          onChange={(event) => setHinhAnh(event.target.value)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          placeholder="https://example.com/can-tho.jpg"
        />
      </div>

      <div>
        <label htmlFor="moTa" className="mb-2 block text-sm font-medium text-stone-700">
          Mô tả tour
        </label>
        <textarea
          id="moTa"
          value={moTa}
          onChange={(event) => setMoTa(event.target.value)}
          className="min-h-32 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
          placeholder="Mô tả ngắn gọn về hành trình, trải nghiệm nổi bật và điểm đến."
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Quay lại
        </Link>
      </div>
    </form>
  );
};
