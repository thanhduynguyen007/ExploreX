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
      [
        "dg-vinh-long-001",
        "tour-vinh-long-gia-dinh",
        "customer-001",
        5,
        "Chuyến đi rất phù hợp cho gia đình, lịch trình nhẹ nhàng và dịch vụ tốt.",
        "2026-04-02 18:00:00",
      ],
    ];

    for (const item of items) {
      await connection.query(
        `
          INSERT INTO \`danhgia\` (
            \`maDanhGia\`,
            \`maTour\`,
            \`maNguoiDung\`,
            \`soSao\`,
            \`binhLuan\`,
            \`ngayDanhGia\`
          )
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            \`maTour\` = VALUES(\`maTour\`),
            \`maNguoiDung\` = VALUES(\`maNguoiDung\`),
            \`soSao\` = VALUES(\`soSao\`),
            \`binhLuan\` = VALUES(\`binhLuan\`),
            \`ngayDanhGia\` = VALUES(\`ngayDanhGia\`)
        `,
        item,
      );
    }

    console.log("Dữ liệu đánh giá mẫu đã được seed.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
