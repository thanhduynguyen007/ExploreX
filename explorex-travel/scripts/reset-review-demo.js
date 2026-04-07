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
    const [result] = await connection.query(
      `
        DELETE FROM \`danhgia\`
        WHERE \`maNguoiDung\` = 'U002'
          AND \`maTour\` = 'T007'
      `,
    );

    console.log(`Da xoa ${result.affectedRows || 0} review mau cua U002 cho tour T007.`);
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
