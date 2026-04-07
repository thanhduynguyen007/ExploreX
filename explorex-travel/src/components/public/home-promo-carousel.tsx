"use client";

import Link from "next/link";
import { useState } from "react";

type PromoItem = {
  maTour: string;
  tenTour: string;
  tenNhomTour: string | null;
  nextNgayBatDau: string | Date | null;
  image: string;
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
    <div className="md:hidden">
      <Link
        href={`/tours/${activeItem.maTour}`}
        className="block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
      >
        <img src={activeItem.image} alt={activeItem.tenTour} className="h-48 w-full object-cover" />
        <div className="p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            {activeItem.tenNhomTour ?? "Ưu đãi nổi bật"}
          </p>
          <h3 className="mt-2 text-base font-extrabold leading-6 text-stone-900">{activeItem.tenTour}</h3>
          <p className="mt-2 text-sm text-stone-500">Khởi hành gần nhất: {formatDate(activeItem.nextNgayBatDau)}</p>
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
