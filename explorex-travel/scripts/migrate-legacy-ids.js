const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "crebas5",
};

const userMappings = [
  ["admin-001", "U001"],
  ["provider-001", "U003"],
  ["customer-001", "U002"],
];

const providerMappings = [["provider-company-001", "NCC001"]];

const groupMappings = [
  ["trong-ngay", "NT006"],
  ["sinh-thai", "NT002"],
  ["van-hoa", "NT003"],
  ["nghi-duong", "NT004"],
  ["gia-dinh", "NT005"],
];

const tourMappings = [
  ["tour-can-tho-2n1d", "T003"],
  ["tour-ben-tre-sinh-thai", "T004"],
  ["tour-soc-trang-van-hoa", "T005"],
  ["tour-an-giang-nghi-duong", "T006"],
  ["tour-vinh-long-gia-dinh", "T007"],
];

const scheduleMappings = [
  ["lich-can-tho-01", "LT003"],
  ["lich-can-tho-02", "LT004"],
  ["lich-ben-tre-01", "LT005"],
  ["lich-soc-trang-01", "LT006"],
  ["lich-an-giang-01", "LT007"],
  ["lich-vinh-long-01", "LT008"],
];

const bookingMappings = [
  ["dat-can-tho-001", "DT003"],
  ["dat-can-tho-002", "DT004"],
  ["dat-vinh-long-001", "DT005"],
  ["dat-ben-tre-001", "DT006"],
];

const reviewMappings = [["dg-vinh-long-001", "DG003"]];

async function rowExists(connection, table, column, value) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS total FROM \`${table}\` WHERE \`${column}\` = ?`,
    [value],
  );

  return Number(rows[0]?.total ?? 0) > 0;
}

async function ensureNoCollision(connection, table, column, mappings) {
  for (const [legacyId, normalizedId] of mappings) {
    const hasLegacy = await rowExists(connection, table, column, legacyId);
    if (!hasLegacy) {
      continue;
    }

    const hasNormalized = await rowExists(connection, table, column, normalizedId);
    if (hasNormalized) {
      throw new Error(
        `Không thể đổi ${table}.${column} từ "${legacyId}" sang "${normalizedId}" vì mã đích đã tồn tại.`,
      );
    }
  }
}

async function runUpdates(connection, table, column, mappings) {
  for (const [legacyId, normalizedId] of mappings) {
    await connection.query(
      `UPDATE \`${table}\` SET \`${column}\` = ? WHERE \`${column}\` = ?`,
      [normalizedId, legacyId],
    );
  }
}

async function run() {
  const connection = await mysql.createConnection(config);

  try {
    await ensureNoCollision(connection, "nguoidung", "maNguoiDung", userMappings);
    await ensureNoCollision(connection, "nhacungcaptour", "maNhaCungCap", providerMappings);
    await ensureNoCollision(connection, "nhomtour", "maNhomTour", groupMappings);
    await ensureNoCollision(connection, "tour", "maTour", tourMappings);
    await ensureNoCollision(connection, "lichtour", "maLichTour", scheduleMappings);
    await ensureNoCollision(connection, "dattour", "maDatTour", bookingMappings);
    await ensureNoCollision(connection, "danhgia", "maDanhGia", reviewMappings);

    await connection.beginTransaction();
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    await runUpdates(connection, "nguoidung", "maNguoiDung", userMappings);
    await runUpdates(connection, "khachhang", "maNguoiDung", userMappings);
    await runUpdates(connection, "admin", "maNguoiDung", userMappings);
    await runUpdates(connection, "nhacungcaptour", "maNguoiDung", userMappings);
    await runUpdates(connection, "dattour", "maNguoiDung", userMappings);
    await runUpdates(connection, "danhgia", "maNguoiDung", userMappings);

    await runUpdates(connection, "nhacungcaptour", "maNhaCungCap", providerMappings);
    await runUpdates(connection, "tour", "maNhaCungCap", providerMappings);

    await runUpdates(connection, "nhomtour", "maNhomTour", groupMappings);
    await runUpdates(connection, "tour", "maNhomTour", groupMappings);

    await runUpdates(connection, "tour", "maTour", tourMappings);
    await runUpdates(connection, "lichtour", "maTour", tourMappings);
    await runUpdates(connection, "danhgia", "maTour", tourMappings);

    await runUpdates(connection, "lichtour", "maLichTour", scheduleMappings);
    await runUpdates(connection, "dattour", "maLichTour", scheduleMappings);

    await runUpdates(connection, "dattour", "maDatTour", bookingMappings);
    await runUpdates(connection, "danhgia", "maDanhGia", reviewMappings);

    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    await connection.commit();

    console.log("Đã đổi mã legacy sang format chuẩn thành công.");
  } catch (error) {
    try {
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    } catch {
      // noop
    }

    try {
      await connection.rollback();
    } catch {
      // noop
    }

    throw error;
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
