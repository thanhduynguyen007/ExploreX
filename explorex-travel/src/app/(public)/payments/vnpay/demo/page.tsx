import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { getBookingDetail } from "@/services/booking.service";

const formatCurrency = (value: number | null | undefined) => `${Number(value ?? 0).toLocaleString("vi-VN")} đ`;

export default async function InternalVnpayDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const { bookingId } = await searchParams;
  if (!bookingId) {
    redirect("/account/bookings");
  }

  const booking = await getBookingDetail(bookingId, { maNguoiDung: user.id });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="rounded-[32px] border border-sky-200 bg-[linear-gradient(145deg,#eef7ff_0%,#ffffff_100%)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">VNPAY Demo</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900">Mô phỏng cổng thanh toán</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-stone-600">
              Đây là màn thanh toán nội bộ để demo flow VNPAY khi dự án chưa có credential sandbox thật.
            </p>
          </div>
          <Link
            href={`/account/bookings/${booking.maDatTour}`}
            className="inline-flex rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:text-orange-600"
          >
            Về chi tiết đơn
          </Link>
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl border border-stone-200 bg-white p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-stone-500">Mã đơn</p>
            <p className="mt-1 text-base font-bold text-stone-900">{booking.maDatTour}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Số tiền</p>
            <p className="mt-1 text-base font-bold text-stone-900">{formatCurrency(booking.tongTien)}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Tour</p>
            <p className="mt-1 text-base font-bold text-stone-900">{booking.tenTour ?? booking.maLichTour}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Trạng thái hiện tại</p>
            <p className="mt-1 text-base font-bold text-stone-900">{booking.trangThaiThanhToan}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link
            href={`/api/me/bookings/${booking.maDatTour}/vnpay-demo?result=success`}
            className="flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Giả lập thành công
          </Link>
          <Link
            href={`/api/me/bookings/${booking.maDatTour}/vnpay-demo?result=fail`}
            className="flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-700"
          >
            Giả lập thất bại
          </Link>
          <Link
            href={`/api/me/bookings/${booking.maDatTour}/vnpay-demo?result=cancel`}
            className="flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
          >
            Hủy giao dịch
          </Link>
        </div>
      </section>
    </div>
  );
}
