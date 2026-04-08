import Link from "next/link";
import { redirect } from "next/navigation";

import { BookingVnpayButton } from "@/components/account/booking-vnpay-button";
import { BookingStatusBadge } from "@/components/ui/booking-status-badge";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { getBookingDetail } from "@/services/booking.service";
import { getEligibleCompletedBookingsForReview } from "@/services/review.service";

const formatDateTime = (value: string | Date | null | undefined) => {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("vi-VN");
};

const formatCurrency = (value: number | null | undefined) => `${Number(value ?? 0).toLocaleString("vi-VN")} đ`;

export default async function AccountBookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>;
  searchParams?: Promise<{ paymentStatus?: string; paymentMessage?: string }>;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const { bookingId } = await params;
  const query = searchParams ? await searchParams : undefined;
  const booking = await getBookingDetail(bookingId, { maNguoiDung: user.id });
  const eligibleReviews = booking.maTour ? await getEligibleCompletedBookingsForReview(user.id, booking.maTour) : [];
  const canReviewCurrentBooking = eligibleReviews.some((item) => item.maDatTour === booking.maDatTour);
  const canPayWithVnpay = booking.trangThaiThanhToan === "UNPAID" && booking.trangThaiDatTour !== "CANCELLED";

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Tài khoản"
        title={`Chi tiết đơn đặt ${booking.maDatTour}`}
        description="Bạn chỉ xem được đơn của chính mình. Mọi kiểm tra quyền truy cập và ownership đều được backend xử lý."
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/account/bookings"
          className="inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
        >
          ← Quay lại lịch sử đặt tour
        </Link>
        {booking.maTour && canReviewCurrentBooking ? (
          <Link
            href={`/account/reviews/create/${booking.maTour}`}
            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
          >
            Viết đánh giá cho tour này
          </Link>
        ) : null}
        {canPayWithVnpay ? <BookingVnpayButton bookingId={booking.maDatTour} /> : null}
      </div>

      {query?.paymentStatus && query?.paymentMessage ? (
        <section
          className={`rounded-3xl border px-5 py-4 text-sm leading-6 shadow-sm ${
            query.paymentStatus === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {query.paymentMessage}
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Tour" description={booking.tenTour ?? booking.maLichTour} />
        <InfoCard title="Số người" description={`${booking.soNguoi ?? 0} khách`} />
        <InfoCard title="Tổng tiền" description={formatCurrency(booking.tongTien)} />
        <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-stone-900">Trạng thái</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <BookingStatusBadge status={booking.trangThaiDatTour} kind="booking" />
            <BookingStatusBadge status={booking.trangThaiThanhToan} kind="payment" />
          </div>
        </article>
      </div>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Thông tin đơn</h2>
        <dl className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-stone-500">Ngày đặt</dt>
            <dd className="mt-1 text-sm text-stone-800">{formatDateTime(booking.ngayDat)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">Ngày khởi hành</dt>
            <dd className="mt-1 text-sm text-stone-800">{formatDateTime(booking.ngayBatDau)}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-stone-500">Ghi chú</dt>
            <dd className="mt-1 text-sm leading-7 text-stone-800">{booking.ghiChu ?? "Không có ghi chú."}</dd>
          </div>
        </dl>
      </section>

      {booking.trangThaiDatTour === "COMPLETED" ? (
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Đánh giá sau chuyến đi</h2>
          <p className="mt-2 text-sm leading-7 text-stone-600">
            {canReviewCurrentBooking
              ? "Đơn này đã hoàn thành và đủ điều kiện gửi đánh giá. Mỗi tour chỉ nhận một đánh giá từ cùng một tài khoản."
              : "Đơn này đã hoàn thành, nhưng tour này đã được bạn đánh giá trước đó hoặc hiện không còn suất đánh giá hợp lệ."}
          </p>
        </section>
      ) : null}
    </div>
  );
}
