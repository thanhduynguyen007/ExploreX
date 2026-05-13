"use client";

import Link from "next/link";
import { useState } from "react";

type PromoItem = {
  maTour: string;
  tenTour: string;
  tenNhomTour: string | null;
  nextNgayBatDau: string | Date | null;
  minGiaTour: number | null;
  nextSoChoTrong: number | null;
  image: string;
};

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) {
    return "Liên hệ";
  }

  return `${Number(value).toLocaleString("vi-VN")}\u00A0đ`;
};

const formatDate = (value: string | Date | null) => {
  if (!value) {
    return "Chưa mở bán";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("vi-VN");
};

export function HomePromoCarousel({ items }: { items: PromoItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[activeIndex] ?? items[0];

  return (
    <div className="mt-6 md:hidden">
      <Link
        href={`/tours/${activeItem.maTour}`}
        className="block overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
      >
        <div className="relative">
          <img src={activeItem.image} alt={activeItem.tenTour} className="h-48 w-full object-cover" />
          <p className="absolute left-3 top-3 rounded-md bg-orange-500 px-3 py-1 text-[11px] font-extrabold text-white">
            {activeItem.tenNhomTour ?? "Ưu đãi nổi bật"}
          </p>
        </div>
        <div className="p-4">
          <h3 className="min-h-14 text-base font-extrabold leading-6 text-stone-900">{activeItem.tenTour}</h3>
          <p className="mt-2 text-sm text-stone-500">Khởi hành: {formatDate(activeItem.nextNgayBatDau)}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-stone-500">Giá từ</p>
            <p className="mt-1 whitespace-nowrap text-xl font-black text-orange-500">{formatCurrency(activeItem.minGiaTour)}</p>
          </div>
          <div className="rounded-2xl bg-orange-50 px-4 py-2 text-right">
            <p className="text-xs font-semibold text-stone-500">Còn chỗ</p>
            <p className="mt-1 text-lg font-black text-stone-950">{activeItem.nextSoChoTrong ?? 0}</p>
          </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.maTour}
            type="button"
            aria-label={`Xem khuyến mại ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${index === activeIndex ? "bg-orange-500" : "bg-stone-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
