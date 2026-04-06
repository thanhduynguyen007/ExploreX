"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

function useOutsideClose<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose]);

  return ref;
}

function FilterDropdown({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const ref = useOutsideClose<HTMLDivElement>(() => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-[50px] w-full items-center gap-3 rounded-[14px] border border-[#d5d5d5] bg-white px-4 text-left shadow-[0_8px_24px_rgba(226,232,240,0.25)]"
      >
        <span className="min-w-0 flex-1 truncate text-[14px] font-bold text-[#202224]">
          {selected?.label ?? placeholder}
        </span>
        <svg viewBox="0 0 20 20" fill="none" className={`size-4 text-[#202224] transition ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[14px] border border-[#d5d5d5] bg-white py-2 shadow-[0_20px_45px_rgba(148,163,184,0.28)]">
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={`${placeholder}-${option.value || "empty"}`}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-4 py-3 text-[14px] font-semibold transition ${
                  active ? "bg-[#edf4ff] text-[#4880ff]" : "text-[#202224] hover:bg-[#f7f9fc]"
                }`}
              >
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ReviewFilterBar({
  initialKeyword,
  initialRating,
  initialProvider,
  ratingOptions,
  providerOptions,
}: {
  initialKeyword: string;
  initialRating: string;
  initialProvider: string;
  ratingOptions: Option[];
  providerOptions: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(initialKeyword);
  const [rating, setRating] = useState(initialRating);
  const [provider, setProvider] = useState(initialProvider);

  useEffect(() => setKeyword(initialKeyword), [initialKeyword]);
  useEffect(() => setRating(initialRating), [initialRating]);
  useEffect(() => setProvider(initialProvider), [initialProvider]);

  const currentQuery = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const pushParams = (next: Record<string, string>) => {
    const params = new URLSearchParams(currentQuery.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleReset = () => {
    setKeyword("");
    setRating("");
    setProvider("");
    router.push(pathname);
  };

  return (
    <div className="space-y-3">
      <section className="rounded-[14px] border border-[#d5d5d5] bg-white px-4 py-4 shadow-[0_12px_32px_rgba(226,232,240,0.35)]">
        <div className="grid gap-3 xl:grid-cols-[1fr_1.2fr_auto]">
          <FilterDropdown
            value={rating}
            placeholder="Số sao"
            options={ratingOptions}
            onChange={(value) => {
              setRating(value);
              pushParams({ rating: value });
            }}
          />

          <FilterDropdown
            value={provider}
            placeholder="Nhà cung cấp"
            options={providerOptions}
            onChange={(value) => {
              setProvider(value);
              pushParams({ provider: value });
            }}
          />

          <button
            type="button"
            onClick={handleReset}
            className="flex min-h-[50px] items-center justify-center gap-2 px-4 text-[14px] font-semibold text-[#ea0234]"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path
                d="M12 5V2L8 6l4 4V7a5 5 0 1 1-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Xóa bộ lọc
          </button>
        </div>
      </section>

      <section>
        <label className="flex min-h-[50px] items-center gap-3 rounded-[14px] border border-[#e2e2e2] bg-white px-4 shadow-[0_8px_24px_rgba(226,232,240,0.25)]">
          <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 text-[#979797]" aria-hidden="true">
            <path
              d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                pushParams({ q: keyword.trim() });
              }
            }}
            placeholder="Tìm kiếm đánh giá"
            className="w-full bg-transparent text-[14px] font-bold text-[#202224] outline-none placeholder:font-bold placeholder:text-[#979797]"
          />
        </label>
      </section>
    </div>
  );
}
