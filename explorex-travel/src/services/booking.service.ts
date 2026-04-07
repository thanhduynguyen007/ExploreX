import type { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";

import { ApiRequestError } from "@/lib/auth/guards";
import { getDbPool } from "@/lib/db/mysql";
import type { CreateBookingInput, UpdateBookingStatusInput } from "@/lib/validations/booking";
import type { Booking } from "@/types/booking";
import { getProviderProfileByUserId } from "@/services/tour.service";

type BookingRow = RowDataPacket & Booking;
type ScheduleLockRow = RowDataPacket & {
  maLichTour: string;
  maTour: string;
  maNhaCungCap: string;
  soChoTrong: number | null;
  tongChoNgoi: number | null;
  trangThai: string | null;
  giaTour: number | null;
};

type BookingLifecycleStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const bookingSelectFields = `
  b.maDatTour,
  b.maLichTour,
  s.maTour,
  t.maNhaCungCap,
  b.maNguoiDung,
  u.tenNguoiDung,
  u.email,
  t.tenTour,
  p.tenNhaCungCap,
  s.ngayBatDau,
  b.ngayDat,
  b.soNguoi,
  b.tongTien,
  COALESCE(b.trangThaiThanhToan, 'UNPAID') AS trangThaiThanhToan,
  COALESCE(b.trangThaiDatTour, 'PENDING') AS trangThaiDatTour,
  b.ghiChu
`;

type QueryExecutor = Pool | PoolConnection;

export const calculateBookingTotal = (giaTour: number | null, soNguoi: number) => {
  return (giaTour ?? 0) * soNguoi;
};

export const ensureScheduleCanAcceptBooking = ({
  scheduleStatus,
  availableSeats,
  requestedSeats,
}: {
  scheduleStatus: string | null;
  availableSeats: number | null;
  requestedSeats: number;
}) => {
  if (scheduleStatus !== "OPEN") {
    throw new ApiRequestError("Lịch khởi hành hiện không cho phép đặt tour.", 400);
  }

  if ((availableSeats ?? 0) < requestedSeats) {
    throw new ApiRequestError("Số chỗ còn lại không đủ cho yêu cầu đặt tour.", 409);
  }
};

export const getSeatDeltaForBookingCreate = (seats: number) => {
  return -seats;
};

export const getSeatDeltaForBookingTransition = ({
  previousStatus,
  nextStatus,
  seats,
}: {
  previousStatus: BookingLifecycleStatus;
  nextStatus: BookingLifecycleStatus;
  seats: number;
}) => {
  const allowedTransitions: Record<BookingLifecycleStatus, BookingLifecycleStatus[]> = {
    PENDING: ["PENDING", "CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CONFIRMED", "COMPLETED", "CANCELLED"],
    COMPLETED: ["COMPLETED", "CANCELLED"],
    CANCELLED: ["CANCELLED"],
  };

  if (!allowedTransitions[previousStatus]?.includes(nextStatus)) {
    throw new ApiRequestError("Chuyển trạng thái booking không hợp lệ.", 400);
  }

  if (previousStatus === "PENDING" && nextStatus === "CANCELLED") {
    return seats;
  }

  if ((previousStatus === "CONFIRMED" || previousStatus === "COMPLETED") && nextStatus === "CANCELLED") {
    return seats;
  }

  return 0;
};

const normalizeNullable = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const formatDateTimeForSql = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiRequestError("Ngày khởi hành không hợp lệ.", 400);
  }

  const pad = (input: number) => String(input).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

const getScheduleForCreate = async (connection: PoolConnection, maLichTour: string) => {
  const [rows] = await connection.query<ScheduleLockRow[]>(
    `
      SELECT
        s.maLichTour,
        s.maTour,
        t.maNhaCungCap,
        s.soChoTrong,
        s.tongChoNgoi,
        s.trangThai,
        s.GiaTour AS giaTour
      FROM \`lichtour\` s
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      WHERE s.maLichTour = ?
      LIMIT 1
      FOR UPDATE
    `,
    [maLichTour],
  );

  const schedule = rows[0];
  if (!schedule) {
    throw new ApiRequestError("Không tìm thấy lịch khởi hành.", 404);
  }

  return schedule;
};

const getBookingWithScheduleLock = async (connection: PoolConnection, maDatTour: string) => {
  const [rows] = await connection.query<(BookingRow & ScheduleLockRow)[]>(
    `
      SELECT
        ${bookingSelectFields},
        s.soChoTrong,
        s.tongChoNgoi,
        s.trangThai,
        s.GiaTour AS giaTour
      FROM \`dattour\` b
      INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      INNER JOIN \`nguoidung\` u ON u.maNguoiDung = b.maNguoiDung
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      WHERE b.maDatTour = ?
      LIMIT 1
      FOR UPDATE
    `,
    [maDatTour],
  );

  const booking = rows[0];
  if (!booking) {
    throw new ApiRequestError("Không tìm thấy đơn đặt tour.", 404);
  }

  return booking;
};

const applyScheduleStatus = async (
  connection: PoolConnection,
  schedule: { maLichTour: string; tongChoNgoi: number | null; trangThai: string | null },
  soChoTrong: number,
) => {
  let nextStatus = schedule.trangThai ?? "OPEN";

  if (nextStatus !== "CANCELLED" && nextStatus !== "CLOSED") {
    nextStatus = soChoTrong <= 0 ? "FULL" : "OPEN";
  }

  const boundedSeats = Math.max(0, Math.min(soChoTrong, schedule.tongChoNgoi ?? soChoTrong));

  await connection.query(
    `
      UPDATE \`lichtour\`
      SET \`soChoTrong\` = ?, \`trangThai\` = ?
      WHERE \`maLichTour\` = ?
    `,
    [boundedSeats, nextStatus, schedule.maLichTour],
  );
};

const transitionBookingState = async (
  connection: PoolConnection,
  booking: BookingRow & ScheduleLockRow,
  input: UpdateBookingStatusInput,
) => {
  const prevStatus = booking.trangThaiDatTour;
  const nextStatus = input.trangThaiDatTour;
  const seats = booking.soNguoi ?? 0;
  const seatDelta = getSeatDeltaForBookingTransition({
    previousStatus: prevStatus,
    nextStatus,
    seats,
  });

  if (seatDelta !== 0) {
    await applyScheduleStatus(connection, booking, (booking.soChoTrong ?? 0) + seatDelta);
  }

  await connection.query(
    `
      UPDATE \`dattour\`
      SET
        \`trangThaiDatTour\` = ?,
        \`trangThaiThanhToan\` = ?,
        \`ghiChu\` = ?
      WHERE \`maDatTour\` = ?
    `,
    [nextStatus, input.trangThaiThanhToan, normalizeNullable(input.ghiChu), booking.maDatTour],
  );
};

export const listBookings = async ({
  maNguoiDung,
  maNhaCungCap,
}: {
  maNguoiDung?: string;
  maNhaCungCap?: string;
} = {}): Promise<Booking[]> => {
  const pool = getDbPool();
  const filters: string[] = [];
  const values: string[] = [];

  if (maNguoiDung) {
    filters.push("b.maNguoiDung = ?");
    values.push(maNguoiDung);
  }

  if (maNhaCungCap) {
    filters.push("t.maNhaCungCap = ?");
    values.push(maNhaCungCap);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await pool.query<BookingRow[]>(
    `
      SELECT ${bookingSelectFields}
      FROM \`dattour\` b
      INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      INNER JOIN \`nguoidung\` u ON u.maNguoiDung = b.maNguoiDung
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      ${whereClause}
      ORDER BY b.ngayDat DESC, b.maDatTour DESC
    `,
    values,
  );

  return rows;
};

const getBookingDetailByExecutor = async (
  executor: QueryExecutor,
  maDatTour: string,
  { maNguoiDung, maNhaCungCap }: { maNguoiDung?: string; maNhaCungCap?: string } = {},
): Promise<Booking> => {
  const filters = ["b.maDatTour = ?"];
  const values = [maDatTour];

  if (maNguoiDung) {
    filters.push("b.maNguoiDung = ?");
    values.push(maNguoiDung);
  }

  if (maNhaCungCap) {
    filters.push("t.maNhaCungCap = ?");
    values.push(maNhaCungCap);
  }

  const [rows] = await executor.query<BookingRow[]>(
    `
      SELECT ${bookingSelectFields}
      FROM \`dattour\` b
      INNER JOIN \`lichtour\` s ON s.maLichTour = b.maLichTour
      INNER JOIN \`tour\` t ON t.maTour = s.maTour
      INNER JOIN \`nguoidung\` u ON u.maNguoiDung = b.maNguoiDung
      INNER JOIN \`nhacungcaptour\` p ON p.maNhaCungCap = t.maNhaCungCap
      WHERE ${filters.join(" AND ")}
      LIMIT 1
    `,
    values,
  );

  const booking = rows[0];
  if (!booking) {
    throw new ApiRequestError("Không tìm thấy đơn đặt tour.", 404);
  }

  return booking;
};

export const getBookingDetail = async (
  maDatTour: string,
  filters: { maNguoiDung?: string; maNhaCungCap?: string } = {},
): Promise<Booking> => {
  const pool = getDbPool();
  return getBookingDetailByExecutor(pool, maDatTour, filters);
};

export const createBookingAsCustomer = async (userId: string, input: CreateBookingInput) => {
  const pool = getDbPool();
  const connection = await pool.getConnection();
  let item: Booking | null = null;

  try {
    await connection.beginTransaction();

    const schedule = await getScheduleForCreate(connection, input.maLichTour);
    ensureScheduleCanAcceptBooking({
      scheduleStatus: schedule.trangThai,
      availableSeats: schedule.soChoTrong,
      requestedSeats: input.soNguoi,
    });
    await applyScheduleStatus(connection, schedule, (schedule.soChoTrong ?? 0) + getSeatDeltaForBookingCreate(input.soNguoi));

    const tongTien = calculateBookingTotal(schedule.giaTour, input.soNguoi);

    await connection.query(
      `
        INSERT INTO \`dattour\` (
          \`maDatTour\`,
          \`maLichTour\`,
          \`maNguoiDung\`,
          \`ngayDat\`,
          \`soNguoi\`,
          \`tongTien\`,
          \`trangThaiThanhToan\`,
          \`trangThaiDatTour\`,
          \`ghiChu\`
        )
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, 'UNPAID', 'PENDING', ?)
      `,
      [input.maDatTour, input.maLichTour, userId, input.soNguoi, tongTien, normalizeNullable(input.ghiChu)],
    );

    await connection.commit();
    item = await getBookingDetailByExecutor(connection, input.maDatTour, { maNguoiDung: userId });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  if (!item) {
    throw new ApiRequestError("Không thể tải lại đơn đặt tour vừa tạo.", 500);
  }

  return item;
};

export const updateBookingAsAdmin = async (maDatTour: string, input: UpdateBookingStatusInput) => {
  const pool = getDbPool();
  const connection = await pool.getConnection();
  let item: Booking | null = null;

  try {
    await connection.beginTransaction();
    const booking = await getBookingWithScheduleLock(connection, maDatTour);
    await transitionBookingState(connection, booking, input);
    await connection.commit();
    item = await getBookingDetailByExecutor(connection, maDatTour);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  if (!item) {
    throw new ApiRequestError("Không thể tải lại đơn đặt tour sau cập nhật.", 500);
  }

  return item;
};

export const updateBookingAsProvider = async (userId: string, maDatTour: string, input: UpdateBookingStatusInput) => {
  const provider = await getProviderProfileByUserId(userId);
  const pool = getDbPool();
  const connection = await pool.getConnection();
  let item: Booking | null = null;

  try {
    await connection.beginTransaction();
    const booking = await getBookingWithScheduleLock(connection, maDatTour);

    if (booking.maNhaCungCap !== provider.maNhaCungCap) {
      throw new ApiRequestError("Bạn không có quyền xử lý đơn đặt tour này.", 403);
    }

    await transitionBookingState(connection, booking, input);
    await connection.commit();
    item = await getBookingDetailByExecutor(connection, maDatTour, { maNhaCungCap: provider.maNhaCungCap });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  if (!item) {
    throw new ApiRequestError("Không thể tải lại đơn đặt tour sau cập nhật.", 500);
  }

  return item;
};
