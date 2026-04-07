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
        "DT003",
        "LT003",
        "U002",
        "2026-04-05 09:00:00",
        2,
        3780000,
        "UNPAID",
        "PENDING",
        "Khách muốn ngồi gần cửa sổ.",
      ],
      [
        "DT004",
        "LT004",
        "U002",
        "2026-04-04 13:30:00",
        2,
        3900000,
        "PAID",
        "CONFIRMED",
        "Đã xác nhận chỗ.",
      ],
      [
        "DT005",
        "LT008",
        "U002",
        "2026-04-01 10:15:00",
        3,
        4770000,
        "PAID",
        "COMPLETED",
        "Đã hoàn thành chuyến đi.",
      ],
      [
        "DT006",
        "LT005",
        "U002",
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

    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 20, `trangThai` = 'OPEN' WHERE `maLichTour` = 'LT003'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 16, `trangThai` = 'OPEN' WHERE `maLichTour` = 'LT004'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 16, `trangThai` = 'OPEN' WHERE `maLichTour` = 'LT005'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 24, `trangThai` = 'OPEN' WHERE `maLichTour` = 'LT006'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 0, `trangThai` = 'CLOSED' WHERE `maLichTour` = 'LT007'");
    await connection.query("UPDATE `lichtour` SET `soChoTrong` = 9, `trangThai` = 'OPEN' WHERE `maLichTour` = 'LT008'");

    console.log("Dữ liệu booking mẫu đã được seed.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
