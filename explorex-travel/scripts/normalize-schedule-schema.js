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
    await connection.query("UPDATE `lichtour` SET `trangThai` = 'OPEN' WHERE `trangThai` IS NULL OR `trangThai` = ''");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = `tongChoNgoi` WHERE (`soChoTrong` IS NULL OR `soChoTrong` < 0) AND `tongChoNgoi` IS NOT NULL");

    console.log("Schema bảng lịch tour đã được chuẩn hóa.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
