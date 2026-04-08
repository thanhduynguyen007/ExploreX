import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  formTitle: string;
  formDescription: string;
  footer: ReactNode;
  children: ReactNode;
};

export const AuthShell = ({
  formTitle,
  formDescription,
  footer,
  children,
}: AuthShellProps) => {
  return (
    <div className="-mt-8 w-full">
      <section className="relative overflow-hidden rounded-[36px] border border-orange-100/80 bg-[linear-gradient(140deg,#f9efe3_0%,#f7f5ef_45%,#eef6f2_100%)] px-4 py-6 shadow-[0_28px_90px_rgba(28,25,23,0.08)] sm:px-6 sm:py-8">
        <div className="absolute -left-20 top-0 h-48 w-48 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-[520px] rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_20px_70px_rgba(28,25,23,0.1)] backdrop-blur sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-stone-900">{formTitle}</h1>
              <p className="mt-2 text-sm leading-6 text-stone-500">{formDescription}</p>
            </div>
            <Link href="/" className="hidden rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:text-orange-600 sm:inline-flex">
              Trang chủ
            </Link>
          </div>

          {children}

          <div className="mt-6 border-t border-stone-200 pt-5 text-sm text-stone-600">{footer}</div>
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
      <span className="mb-2.5 block text-sm font-semibold text-stone-800">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs leading-5 text-stone-500">{hint}</span> : null}
    </label>
  );
};

export const authInputClassName =
  "h-[54px] w-full rounded-[16px] border border-stone-200 bg-white px-4 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

export const authTextareaClassName =
  "w-full rounded-[16px] border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

export const AuthFormNote = ({ children }: { children: ReactNode }) => (
  <div className="rounded-[18px] border border-stone-200 bg-stone-50 px-4 py-3 text-xs leading-6 text-stone-600">{children}</div>
);
