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
        "dat-can-tho-001",
        "lich-can-tho-01",
        "customer-001",
        "2026-04-05 09:00:00",
        2,
        3780000,
        "UNPAID",
        "PENDING",
        "Khách muốn ngồi gần cửa sổ.",
      ],
      [
        "dat-can-tho-002",
        "lich-can-tho-02",
        "customer-001",
        "2026-04-04 13:30:00",
        2,
        3900000,
        "PAID",
        "CONFIRMED",
        "Đã xác nhận chỗ.",
      ],
      [
        "dat-vinh-long-001",
        "lich-vinh-long-01",
        "customer-001",
        "2026-04-01 10:15:00",
        3,
        4770000,
        "PAID",
        "COMPLETED",
        "Đã hoàn thành chuyến đi.",
      ],
      [
        "dat-ben-tre-001",
        "lich-ben-tre-01",
        "customer-001",
        "2026-03-28 15:00:00",
        1,
        990000,
        "REFUNDED",
        "CANCELLED",
        "Khách hủy vì bận việc.",
      ],
    ];

    for (const item of items) {
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            \`maLichTour\` = VALUES(\`maLichTour\`),
            \`maNguoiDung\` = VALUES(\`maNguoiDung\`),
            \`ngayDat\` = VALUES(\`ngayDat\`),
            \`soNguoi\` = VALUES(\`soNguoi\`),
            \`tongTien\` = VALUES(\`tongTien\`),
            \`trangThaiThanhToan\` = VALUES(\`trangThaiThanhToan\`),
            \`trangThaiDatTour\` = VALUES(\`trangThaiDatTour\`),
            \`ghiChu\` = VALUES(\`ghiChu\`)
        `,
        item,
      );
    }

    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 20, `trangThai` = 'OPEN' WHERE `maLichTour` = 'lich-can-tho-01'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 16, `trangThai` = 'OPEN' WHERE `maLichTour` = 'lich-can-tho-02'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 16, `trangThai` = 'OPEN' WHERE `maLichTour` = 'lich-ben-tre-01'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 24, `trangThai` = 'OPEN' WHERE `maLichTour` = 'lich-soc-trang-01'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 0, `trangThai` = 'CLOSED' WHERE `maLichTour` = 'lich-an-giang-01'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 9, `trangThai` = 'OPEN' WHERE `maLichTour` = 'lich-vinh-long-01'");

    console.log("Dữ liệu booking mẫu đã được seed.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
