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

async function indexExists(connection, table, indexName) {
  const [rows] = await connection.query(
    `
      SELECT COUNT(*) AS total
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND INDEX_NAME = ?
    `,
    [config.database, table, indexName],
  );

  return rows[0].total > 0;
}

async function run() {
  const connection = await mysql.createConnection(config);

  try {
    if (!(await columnExists(connection, "nguoidung", "role"))) {
      await connection.query(
        "ALTER TABLE nguoidung ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER' AFTER email",
      );
    }

    if (!(await columnExists(connection, "nguoidung", "matKhauHash"))) {
      await connection.query(
        "ALTER TABLE nguoidung ADD COLUMN matKhauHash VARCHAR(255) NULL AFTER matKhau",
      );
    }

    if (!(await columnExists(connection, "nguoidung", "createdAt"))) {
      await connection.query(
        "ALTER TABLE nguoidung ADD COLUMN createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER matKhauHash",
      );
    }

    if (!(await columnExists(connection, "nguoidung", "updatedAt"))) {
      await connection.query(
        "ALTER TABLE nguoidung ADD COLUMN updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER createdAt",
      );
    }

    if (!(await indexExists(connection, "nguoidung", "uk_nguoidung_email"))) {
      await connection.query("ALTER TABLE nguoidung ADD UNIQUE KEY uk_nguoidung_email (email)");
    }

    if (!(await columnExists(connection, "nhacungcaptour", "maNguoiDung"))) {
      await connection.query(
        "ALTER TABLE nhacungcaptour ADD COLUMN maNguoiDung VARCHAR(254) NULL AFTER maNhaCungCap",
      );
    }

    if (!(await columnExists(connection, "nhacungcaptour", "soDienThoai"))) {
      await connection.query(
        "ALTER TABLE nhacungcaptour ADD COLUMN soDienThoai VARCHAR(50) NULL AFTER diaChi",
      );
    }

    if (!(await columnExists(connection, "nhacungcaptour", "email"))) {
      await connection.query(
        "ALTER TABLE nhacungcaptour ADD COLUMN email VARCHAR(254) NULL AFTER soDienThoai",
      );
    }

    if (!(await columnExists(connection, "nhacungcaptour", "createdAt"))) {
      await connection.query(
        "ALTER TABLE nhacungcaptour ADD COLUMN createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER loaiDichVu",
      );
    }

    if (!(await columnExists(connection, "nhacungcaptour", "updatedAt"))) {
      await connection.query(
        "ALTER TABLE nhacungcaptour ADD COLUMN updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER createdAt",
      );
    }

    if (!(await indexExists(connection, "nhacungcaptour", "uk_nhacungcap_nguoidung"))) {
      await connection.query("ALTER TABLE nhacungcaptour ADD UNIQUE KEY uk_nhacungcap_nguoidung (maNguoiDung)");
    }

    const [fkRows] = await connection.query(
      `
        SELECT COUNT(*) AS total
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = ?
          AND TABLE_NAME = 'nhacungcaptour'
          AND CONSTRAINT_NAME = 'fk_nhacungcap_nguoidung'
      `,
      [config.database],
    );

    if (fkRows[0].total === 0) {
      await connection.query(
        `
          ALTER TABLE nhacungcaptour
          ADD CONSTRAINT fk_nhacungcap_nguoidung
          FOREIGN KEY (maNguoiDung) REFERENCES nguoidung(maNguoiDung)
          ON DELETE RESTRICT ON UPDATE RESTRICT
        `,
      );
    }

    console.log("Schema auth đã được chuẩn hóa.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
