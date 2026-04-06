const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "crebas5",
};

async function run() {
  const connection = await mysql.createConnection(config);

  try {
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
