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
      [
        "T008",
        "NCC001",
        "NT001",
        "Phú Quốc biển xanh 3 ngày 2 đêm",
        "Tận hưởng biển Phú Quốc, tham quan Grand World, Dinh Cậu và thưởng thức hải sản địa phương.",
        "3 ngày 2 đêm",
        28,
        "PUBLISHED",
        "Du lịch biển",
        null,
      ],
      [
        "T009",
        "NCC001",
        "NT001",
        "Nha Trang đảo ngọc và lặn biển",
        "Khám phá vịnh Nha Trang, trải nghiệm cano đảo, tắm biển và hoạt động nghỉ dưỡng.",
        "3 ngày 2 đêm",
        30,
        "PUBLISHED",
        "Du lịch biển",
        null,
      ],
      [
        "T010",
        "NCC001",
        "NT004",
        "Đà Lạt săn mây và nghỉ dưỡng",
        "Lịch trình nhẹ nhàng với săn mây, quảng trường Lâm Viên, vườn hoa và cà phê view đồi.",
        "3 ngày 2 đêm",
        22,
        "PUBLISHED",
        "Nghỉ dưỡng",
        null,
      ],
      [
        "T011",
        "NCC001",
        "NT003",
        "Huế cố đô và ẩm thực miền Trung",
        "Tham quan Đại Nội, lăng vua, chùa Thiên Mụ và khám phá ẩm thực Huế.",
        "2 ngày 1 đêm",
        24,
        "PUBLISHED",
        "Văn hóa",
        null,
      ],
      [
        "T012",
        "NCC001",
        "NT006",
        "Củ Chi trong ngày",
        "Tham quan địa đạo Củ Chi, tìm hiểu lịch sử và trải nghiệm không gian ngoại thành.",
        "1 ngày",
        25,
        "PUBLISHED",
        "Tour trong ngày",
        null,
      ],
      [
        "T013",
        "NCC001",
        "NT002",
        "Cát Tiên rừng xanh cuối tuần",
        "Tour sinh thái khám phá Vườn quốc gia Cát Tiên, đi bộ rừng và quan sát thiên nhiên.",
        "2 ngày 1 đêm",
        18,
        "PUBLISHED",
        "Sinh thái",
        null,
      ],
      [
        "T014",
        "NCC001",
        "NT005",
        "Vũng Tàu gia đình 2 ngày 1 đêm",
        "Kỳ nghỉ ngắn cho gia đình với biển Vũng Tàu, hải sản và lịch trình dễ tham gia.",
        "2 ngày 1 đêm",
        20,
        "PUBLISHED",
        "Gia đình",
        null,
      ],
      [
        "T015",
        "NCC001",
        "NT003",
        "Hội An phố cổ và làng nghề",
        "Dạo phố cổ Hội An, trải nghiệm đèn lồng, làng gốm Thanh Hà và ẩm thực địa phương.",
        "2 ngày 1 đêm",
        20,
        "PUBLISHED",
        "Văn hóa",
        null,
      ],
      [
        "T016",
        "NCC001",
        "NT001",
        "Quy Nhơn biển xanh và Kỳ Co",
        "Khám phá Kỳ Co, Eo Gió, biển Quy Nhơn và các điểm check-in ven biển.",
        "3 ngày 2 đêm",
        26,
        "PUBLISHED",
        "Du lịch biển",
        null,
      ],
      [
        "T017",
        "NCC001",
        "NT004",
        "Sa Pa ruộng bậc thang và bản làng",
        "Khám phá Sa Pa, bản Cát Cát, núi Hàm Rồng và không khí vùng cao.",
        "3 ngày 2 đêm",
        24,
        "PUBLISHED",
        "Nghỉ dưỡng",
        null,
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
