const assert = require("node:assert/strict");
const path = require("node:path");

const createJiti = require("../node_modules/jiti");

const rootFile = path.resolve(__dirname, "run-tests.cjs");
const jiti = createJiti(rootFile, {
  alias: {
    "@": path.resolve(__dirname, "../src"),
  },
});

const { signAuthToken, verifyAuthToken } = jiti("../src/lib/auth/jwt.ts");
const { dashboardPathByRole, isAllowedForPath } = jiti("../src/lib/permissions.ts");
const {
  calculateBookingTotal,
  ensureScheduleCanAcceptBooking,
  getSeatDeltaForBookingCreate,
  getSeatDeltaForBookingTransition,
} = jiti("../src/services/booking.service.ts");

const tests = [
  {
    name: "JWT round-trip giữ nguyên thông tin user",
    run() {
      const token = signAuthToken({
        id: "customer-001",
        email: "customer@explorex.local",
        name: "Demo Customer",
        role: "CUSTOMER",
      });

      const payload = verifyAuthToken(token);
      assert.equal(payload.id, "customer-001");
      assert.equal(payload.email, "customer@explorex.local");
      assert.equal(payload.name, "Demo Customer");
      assert.equal(payload.role, "CUSTOMER");
    },
  },
  {
    name: "JWT sai chữ ký sẽ bị từ chối",
    run() {
      assert.throws(() => verifyAuthToken("invalid.token.value"));
    },
  },
  {
    name: "dashboardPathByRole trả về route đúng theo role",
    run() {
      assert.equal(dashboardPathByRole.CUSTOMER, "/");
      assert.equal(dashboardPathByRole.PROVIDER, "/admin/provider/dashboard");
      assert.equal(dashboardPathByRole.ADMIN, "/admin/dashboard");
    },
  },
  {
    name: "permission path chặn CUSTOMER vào khu admin",
    run() {
      assert.equal(isAllowedForPath("/admin/dashboard", "CUSTOMER"), false);
      assert.equal(isAllowedForPath("/account/bookings", "CUSTOMER"), true);
    },
  },
  {
    name: "permission path cho PROVIDER vào nhánh riêng nhưng không vào admin tổng",
    run() {
      assert.equal(isAllowedForPath("/admin/provider/tours", "PROVIDER"), true);
      assert.equal(isAllowedForPath("/admin/tours", "PROVIDER"), false);
    },
  },
  {
    name: "permission path cho ADMIN vào toàn bộ admin",
    run() {
      assert.equal(isAllowedForPath("/admin/dashboard", "ADMIN"), true);
      assert.equal(isAllowedForPath("/admin/provider/tours", "ADMIN"), true);
    },
  },
  {
    name: "booking tính tổng tiền đúng từ giá tour và số người",
    run() {
      assert.equal(calculateBookingTotal(1950000, 3), 5850000);
    },
  },
  {
    name: "booking chặn khi lịch không ở trạng thái OPEN",
    run() {
      assert.throws(
        () =>
          ensureScheduleCanAcceptBooking({
            scheduleStatus: "CLOSED",
            availableSeats: 10,
            requestedSeats: 2,
          }),
        /không cho phép đặt tour/i,
      );
    },
  },
  {
    name: "booking chặn overbooking khi số chỗ không đủ",
    run() {
      assert.throws(
        () =>
          ensureScheduleCanAcceptBooking({
            scheduleStatus: "OPEN",
            availableSeats: 1,
            requestedSeats: 2,
          }),
        /không đủ/i,
      );
    },
  },
  {
    name: "booking giữ chỗ ngay khi tạo đơn PENDING",
    run() {
      assert.equal(getSeatDeltaForBookingCreate(3), -3);
    },
  },
  {
    name: "booking không trừ thêm chỗ khi chuyển từ PENDING sang CONFIRMED",
    run() {
      assert.equal(
        getSeatDeltaForBookingTransition({
          previousStatus: "PENDING",
          nextStatus: "CONFIRMED",
          seats: 3,
        }),
        0,
      );
    },
  },
  {
    name: "booking hoàn chỗ khi hủy từ PENDING",
    run() {
      assert.equal(
        getSeatDeltaForBookingTransition({
          previousStatus: "PENDING",
          nextStatus: "CANCELLED",
          seats: 2,
        }),
        2,
      );
    },
  },
  {
    name: "booking hoàn chỗ khi hủy từ CONFIRMED",
    run() {
      assert.equal(
        getSeatDeltaForBookingTransition({
          previousStatus: "CONFIRMED",
          nextStatus: "CANCELLED",
          seats: 2,
        }),
        2,
      );
    },
  },
  {
    name: "booking hoàn chỗ khi hủy từ COMPLETED",
    run() {
      assert.equal(
        getSeatDeltaForBookingTransition({
          previousStatus: "COMPLETED",
          nextStatus: "CANCELLED",
          seats: 4,
        }),
        4,
      );
    },
  },
  {
    name: "booking chặn chuyển trạng thái không hợp lệ",
    run() {
      assert.throws(
        () =>
          getSeatDeltaForBookingTransition({
            previousStatus: "PENDING",
            nextStatus: "COMPLETED",
            seats: 1,
          }),
        /không hợp lệ/i,
      );
    },
  },
];

let failed = 0;

for (const test of tests) {
  try {
    test.run();
    console.log(`PASS ${test.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${test.name}`);
    console.error(error);
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${tests.length} test thất bại.`);
  process.exit(1);
}

console.log(`\n${tests.length}/${tests.length} test passed.`);
