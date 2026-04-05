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
    const items = [
      ["lich-can-tho-01", "tour-can-tho-2n1d", "2026-05-15 07:00:00", 20, 20, "OPEN", 1890000],
      ["lich-can-tho-02", "tour-can-tho-2n1d", "2026-05-29 07:00:00", 18, 20, "OPEN", 1950000],
      ["lich-ben-tre-01", "tour-ben-tre-sinh-thai", "2026-05-10 06:30:00", 16, 16, "OPEN", 990000],
      ["lich-soc-trang-01", "tour-soc-trang-van-hoa", "2026-05-18 05:30:00", 24, 24, "OPEN", 1290000],
      ["lich-an-giang-01", "tour-an-giang-nghi-duong", "2026-06-01 06:00:00", 0, 18, "CLOSED", 2490000],
      ["lich-vinh-long-01", "tour-vinh-long-gia-dinh", "2026-05-22 08:00:00", 12, 12, "OPEN", 1590000],
    ];

    for (const item of items) {
      await connection.query(
        `
          INSERT INTO \`lichtour\` (
            \`maLichTour\`,
            \`maTour\`,
            \`ngayBatDau\`,
            \`soChoTrong\`,
            \`tongChoNgoi\`,
            \`trangThai\`,
            \`GiaTour\`
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            \`maTour\` = VALUES(\`maTour\`),
            \`ngayBatDau\` = VALUES(\`ngayBatDau\`),
            \`soChoTrong\` = VALUES(\`soChoTrong\`),
            \`tongChoNgoi\` = VALUES(\`tongChoNgoi\`),
            \`trangThai\` = VALUES(\`trangThai\`),
            \`GiaTour\` = VALUES(\`GiaTour\`)
        `,
        item,
      );
    }

    console.log("Dữ liệu lịch khởi hành mẫu đã được seed.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
