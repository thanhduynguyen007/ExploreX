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
        "T003",
        "NCC001",
        "NT003",
        "Khám phá Cần Thơ 2 ngày 1 đêm",
        "Chợ nổi Cái Răng, bến Ninh Kiều, vườn trái cây và ẩm thực miền Tây.",
        "2 ngày 1 đêm",
        20,
        "PUBLISHED",
        "Du lịch nội địa",
        "https://images.example.com/can-tho.jpg",
      ],
      [
        "T004",
        "NCC001",
        "NT002",
        "Bến Tre miệt vườn và chèo xuồng",
        "Trải nghiệm miệt vườn, làm kẹo dừa và chèo xuồng trong rạch nhỏ.",
        "1 ngày",
        16,
        "DRAFT",
        "Sinh thái",
        "https://images.example.com/ben-tre.jpg",
      ],
      [
        "T005",
        "NCC001",
        "NT003",
        "Sóc Trăng văn hóa Khmer",
        "Tham quan chùa Dơi, chùa Chén Kiểu và khám phá nét văn hóa bản địa.",
        "1 ngày",
        24,
        "PUBLISHED",
        "Văn hóa",
        "https://images.example.com/soc-trang.jpg",
      ],
      [
        "T006",
        "NCC001",
        "NT004",
        "An Giang nghỉ dưỡng núi non",
        "Hành trình thư giãn kết hợp tham quan rừng tràm Trà Sư và núi Sam.",
        "2 ngày 1 đêm",
        18,
        "HIDDEN",
        "Nghỉ dưỡng",
        "https://images.example.com/an-giang.jpg",
      ],
      [
        "T007",
        "NCC001",
        "NT005",
        "Vĩnh Long cho gia đình cuối tuần",
        "Lịch trình nhẹ nhàng cho gia đình với vườn trái cây và homestay ven sông.",
        "2 ngày 1 đêm",
        12,
        "PUBLISHED",
        "Gia đình",
        "https://images.example.com/vinh-long.jpg",
      ],
    ];

    for (const item of items) {
      await connection.query(
        `
          INSERT INTO \`tour\` (
            \`maTour\`,
            \`maNhaCungCap\`,
            \`maNhomTour\`,
            \`tenTour\`,
            \`moTa\`,
            \`thoiLuong\`,
            \`sLKhachToiDa\`,
            \`trangThai\`,
            \`loaiTour\`,
            \`hinhAnh\`
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            \`maNhaCungCap\` = VALUES(\`maNhaCungCap\`),
            \`maNhomTour\` = VALUES(\`maNhomTour\`),
            \`tenTour\` = VALUES(\`tenTour\`),
            \`moTa\` = VALUES(\`moTa\`),
            \`thoiLuong\` = VALUES(\`thoiLuong\`),
            \`sLKhachToiDa\` = VALUES(\`sLKhachToiDa\`),
            \`trangThai\` = VALUES(\`trangThai\`),
            \`loaiTour\` = VALUES(\`loaiTour\`),
            \`hinhAnh\` = VALUES(\`hinhAnh\`)
        `,
        item,
      );
    }

    console.log("Dữ liệu tour mẫu đã được seed.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
