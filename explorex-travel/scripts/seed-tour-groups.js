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
      ["NT006", "Tour trong ngày", "Các tour đi về trong ngày", "ACTIVE"],
      ["NT001", "Du lịch biển", "Các tour biển trong nước", "ACTIVE"],
      ["NT002", "Du lịch sinh thái", "Các tour nghỉ dưỡng và sinh thái", "ACTIVE"],
      ["NT003", "Tour văn hóa", "Các tour khám phá văn hóa và bản sắc địa phương", "ACTIVE"],
      ["NT004", "Tour nghỉ dưỡng", "Các tour thiên về nghỉ dưỡng và thư giãn", "ACTIVE"],
      ["NT005", "Tour gia đình", "Các tour phù hợp cho gia đình và nhóm nhỏ", "ACTIVE"],
    ];

    for (const item of items) {
      await connection.query(
        `
          INSERT INTO \`nhomtour\` (\`maNhomTour\`, \`tenNhomTour\`, \`moTaTour\`, \`trangThai\`)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            \`tenNhomTour\` = VALUES(\`tenNhomTour\`),
            \`moTaTour\` = VALUES(\`moTaTour\`),
            \`trangThai\` = VALUES(\`trangThai\`)
        `,
        item,
      );
    }

    console.log("Dữ liệu nhóm tour mẫu đã được seed.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
