import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  formTitle: string;
  formDescription: string;
  footer: ReactNode;
  children: ReactNode;
};

export const AuthShell = ({
  eyebrow,
  title,
  description,
  highlights,
  formTitle,
  formDescription,
  footer,
  children,
}: AuthShellProps) => {
  return (
    <div className="-mt-8 w-full">
      <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(170deg,#b8dff0_0%,#9fd4e8_20%,#aad9bc_55%,#cceacc_100%)] px-5 py-8 sm:px-8 sm:py-10">
        <div className="absolute -left-24 top-10 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-orange-200/35 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="overflow-hidden rounded-[28px] border border-white/45 bg-white/28 p-7 shadow-[0_24px_80px_rgba(58,78,110,0.16)] backdrop-blur-sm sm:p-9">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-orange-600">{eyebrow}</p>
            <h1 className="mt-4 max-w-xl text-3xl font-black leading-tight text-orange-500 sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-700 sm:text-base">{description}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-[22px] border px-4 py-4 text-sm font-semibold shadow-sm ${
                    index === 0
                      ? "border-orange-200 bg-white/90 text-orange-600"
                      : index === 1
                        ? "border-sky-200 bg-sky-50/90 text-sky-700"
                        : "border-emerald-200 bg-emerald-50/90 text-emerald-700"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[26px] border border-white/50 bg-white/72 p-5 shadow-[0_12px_30px_rgba(255,255,255,0.2)]">
              <p className="text-sm font-bold text-stone-900">Khám phá nhanh</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">Truy cập các khu vực chính của client trước khi đăng nhập hoặc sau khi hoàn tất đăng ký.</p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                <Link href="/" className="rounded-full bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600">
                  Về trang chủ
                </Link>
                <Link href="/tours" className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-orange-600 transition hover:border-orange-400 hover:bg-orange-100">
                  Xem danh sách tour
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] bg-white px-4 py-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Client</p>
                  <p className="mt-2 text-base font-black text-stone-900">Đồng bộ giao diện public</p>
                  <p className="mt-1 text-sm leading-6 text-stone-500">Ngôn ngữ thị giác bám cùng hệ header, footer, banner và card tour hiện tại.</p>
                </div>
                <div className="rounded-[20px] bg-white px-4 py-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Schema</p>
                  <p className="mt-2 text-base font-black text-stone-900">Không thêm field ngoài DB</p>
                  <p className="mt-1 text-sm leading-6 text-stone-500">Chỉ dùng đúng các trường thật của nguoidung, khachhang và nhacungcaptour.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-orange-100 bg-white/95 p-5 shadow-[0_20px_60px_rgba(249,115,22,0.12)] backdrop-blur sm:p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-black tracking-tight text-stone-900">{formTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">{formDescription}</p>
            </div>

            {children}

            <div className="mt-6 border-t border-stone-200 pt-5 text-sm text-stone-600">{footer}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const AuthField = ({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) => {
  return (
    <label className="block">
      <span className="mb-2.5 block text-sm font-bold text-stone-800">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs leading-5 text-stone-500">{hint}</span> : null}
    </label>
  );
};

export const authInputClassName =
  "h-[54px] w-full rounded-[16px] border border-stone-200 bg-stone-50 px-4 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white";

export const authTextareaClassName =
  "w-full rounded-[16px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white";

export const AuthFormNote = ({ children }: { children: ReactNode }) => (
  <div className="rounded-[18px] border border-orange-100 bg-orange-50 px-4 py-3 text-xs leading-6 text-stone-600">{children}</div>
);
