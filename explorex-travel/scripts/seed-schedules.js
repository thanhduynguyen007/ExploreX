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
      ["LT003", "T003", "2026-05-15 07:00:00", 20, 20, "OPEN", 1890000],
      ["LT004", "T003", "2026-05-29 07:00:00", 18, 20, "OPEN", 1950000],
      ["LT005", "T004", "2026-05-10 06:30:00", 16, 16, "OPEN", 990000],
      ["LT006", "T005", "2026-05-18 05:30:00", 24, 24, "OPEN", 1290000],
      ["LT007", "T006", "2026-06-01 06:00:00", 0, 18, "CLOSED", 2490000],
      ["LT008", "T007", "2026-05-22 08:00:00", 12, 12, "OPEN", 1590000],
      ["LT009", "T008", "2026-06-05 07:00:00", 28, 28, "OPEN", 3690000],
      ["LT010", "T008", "2026-06-19 07:00:00", 24, 28, "OPEN", 3890000],
      ["LT011", "T009", "2026-06-08 06:30:00", 30, 30, "OPEN", 3490000],
      ["LT012", "T010", "2026-06-12 05:30:00", 22, 22, "OPEN", 2890000],
      ["LT013", "T011", "2026-06-14 07:30:00", 24, 24, "OPEN", 2190000],
      ["LT014", "T012", "2026-05-31 06:30:00", 25, 25, "OPEN", 690000],
      ["LT015", "T013", "2026-06-07 06:00:00", 18, 18, "OPEN", 1790000],
      ["LT016", "T014", "2026-06-06 07:00:00", 20, 20, "OPEN", 1490000],
      ["LT017", "T015", "2026-06-10 07:00:00", 20, 20, "OPEN", 2390000],
      ["LT018", "T016", "2026-06-15 06:30:00", 26, 26, "OPEN", 3290000],
      ["LT019", "T017", "2026-06-20 05:30:00", 24, 24, "OPEN", 3990000],
      ["LT020", "T017", "2026-07-04 05:30:00", 20, 24, "OPEN", 4190000],
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
