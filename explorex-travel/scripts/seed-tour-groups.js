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
      ["trong-ngay", "Tour trong ngày", "Các tour đi về trong ngày", "ACTIVE"],
      ["sinh-thai", "Tour sinh thái", "Các tour trải nghiệm thiên nhiên, miệt vườn", "ACTIVE"],
      ["van-hoa", "Tour văn hóa", "Các tour khám phá văn hóa và bản sắc địa phương", "ACTIVE"],
      ["nghi-duong", "Tour nghỉ dưỡng", "Các tour thiên về nghỉ dưỡng và thư giãn", "ACTIVE"],
      ["gia-dinh", "Tour gia đình", "Các tour phù hợp cho gia đình và nhóm nhỏ", "ACTIVE"],
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
