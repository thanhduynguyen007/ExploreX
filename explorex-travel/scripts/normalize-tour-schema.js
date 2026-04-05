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
    if (!(await columnExists(connection, "tour", "createdAt"))) {
      await connection.query(
        "ALTER TABLE `tour` ADD COLUMN `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `hinhAnh`",
      );
    }

    if (!(await columnExists(connection, "tour", "updatedAt"))) {
      await connection.query(
        "ALTER TABLE `tour` ADD COLUMN `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `createdAt`",
      );
    }

    await connection.query("UPDATE `tour` SET `trangThai` = 'DRAFT' WHERE `trangThai` IS NULL OR `trangThai` = ''");

    console.log("Schema bảng tour đã được chuẩn hóa.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
