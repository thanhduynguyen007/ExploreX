const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "crebas5",
};

async function columnExists(connection, table, column) {
  const [rows] = await connection.query(
    `
      SELECT COUNT(*) AS total
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `,
    [config.database, table, column],
  );

  return rows[0].total > 0;
}

async function run() {
  const connection = await mysql.createConnection(config);

  try {
    if (!(await columnExists(connection, "danhgia", "maDatTour"))) {
      await connection.query(
        "ALTER TABLE `danhgia` ADD COLUMN `maDatTour` VARCHAR(254) NULL AFTER `maNguoiDung`",
      );
    }

    if (!(await columnExists(connection, "danhgia", "createdAt"))) {
      await connection.query(
        "ALTER TABLE `danhgia` ADD COLUMN `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `ngayDanhGia`",
      );
    }

    if (!(await columnExists(connection, "danhgia", "updatedAt"))) {
      await connection.query(
        "ALTER TABLE `danhgia` ADD COLUMN `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `createdAt`",
      );
    }

    await connection.query("UPDATE `danhgia` SET `ngayDanhGia` = CURRENT_TIMESTAMP WHERE `ngayDanhGia` IS NULL");

    console.log("Schema bảng đánh giá đã được chuẩn hóa.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
