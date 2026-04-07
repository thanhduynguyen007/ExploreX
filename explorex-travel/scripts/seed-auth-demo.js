const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "crebas5",
};

async function upsertUser(connection, user) {
  const passwordHash = await bcrypt.hash(user.password, 10);

  await connection.query(
    `
      INSERT INTO \`nguoidung\` (
        \`maNguoiDung\`, \`tenNguoiDung\`, \`email\`, \`matKhauHash\`, \`role\`, \`trangThaiTaiKhoan\`
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`tenNguoiDung\` = VALUES(\`tenNguoiDung\`),
        \`email\` = VALUES(\`email\`),
        \`role\` = VALUES(\`role\`),
        \`trangThaiTaiKhoan\` = VALUES(\`trangThaiTaiKhoan\`),
        \`matKhauHash\` = VALUES(\`matKhauHash\`)
    `,
    [
      user.id,
      user.name,
      user.email,
      passwordHash,
      user.role,
      "ACTIVE",
    ],
  );
}

async function ensureCustomer(connection, userId) {
  await connection.query(
    `
      INSERT INTO \`khachhang\` (\`maNguoiDung\`, \`diaChi\`, \`soDienThoai\`)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`diaChi\` = VALUES(\`diaChi\`),
        \`soDienThoai\` = VALUES(\`soDienThoai\`)
    `,
    [userId, "Vĩnh Long", "0900000001"],
  );
}

async function ensureAdmin(connection, userId) {
  await connection.query(
    `
      INSERT INTO \`admin\` (\`maNguoiDung\`, \`chucVu\`, \`quyenHan\`)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`chucVu\` = VALUES(\`chucVu\`),
        \`quyenHan\` = VALUES(\`quyenHan\`)
    `,
    [userId, "Quản trị hệ thống", "FULL_ACCESS"],
  );
}

async function ensureProvider(connection, userId) {
  await connection.query(
    `
      INSERT INTO \`nhacungcaptour\` (
        \`maNhaCungCap\`, \`maNguoiDung\`, \`trangThaiHopTac\`, \`tenNhaCungCap\`, \`thongTinNhaCungCap\`, \`diaChi\`, \`soDienThoai\`, \`email\`, \`loaiDichVu\`
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`maNguoiDung\` = VALUES(\`maNguoiDung\`),
        \`trangThaiHopTac\` = VALUES(\`trangThaiHopTac\`),
        \`tenNhaCungCap\` = VALUES(\`tenNhaCungCap\`),
        \`thongTinNhaCungCap\` = VALUES(\`thongTinNhaCungCap\`),
        \`diaChi\` = VALUES(\`diaChi\`),
        \`soDienThoai\` = VALUES(\`soDienThoai\`),
        \`email\` = VALUES(\`email\`),
        \`loaiDichVu\` = VALUES(\`loaiDichVu\`)
    `,
    [
      "provider-company-001",
      userId,
      "APPROVED",
      "Mekong Discovery",
      "Đối tác cung cấp tour miền Tây",
      "Cần Thơ",
      "0900000002",
      "provider@explorex.local",
      "Tour nội địa",
    ],
  );
}

async function run() {
  const connection = await mysql.createConnection(config);

  try {
    const users = [
      {
        id: "admin-001",
        name: "System Admin",
        email: "admin@explorex.local",
        password: "Admin@123",
        role: "ADMIN",
      },
      {
        id: "provider-001",
        name: "Mekong Provider",
        email: "provider@explorex.local",
        password: "Provider@123",
        role: "PROVIDER",
      },
      {
        id: "customer-001",
        name: "Demo Customer",
        email: "customer@explorex.local",
        password: "Customer@123",
        role: "CUSTOMER",
      },
    ];

    for (const user of users) {
      await upsertUser(connection, user);
    }

    await ensureAdmin(connection, "admin-001");
    await ensureProvider(connection, "provider-001");
    await ensureCustomer(connection, "customer-001");

    console.log("Dữ liệu auth demo đã được seed.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
