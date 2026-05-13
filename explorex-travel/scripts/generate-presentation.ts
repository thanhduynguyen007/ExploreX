import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType,
  PageBreak, Footer, PageNumber,
  convertInchesToTwip, ShadingType, TableLayoutType
} from "docx";
import * as fs from "fs";
import * as path from "path";

const OUTPUT_PATH = path.join(process.cwd(), "..", "ExploreX_ThuyetTrinh.docx");

// --- Màu sắc ---
const BLUE = "1E3A5F";
const GREEN = "2E7D32";
const WHITE = "FFFFFF";
const DARK = "1A1A1A";
const GRAY = "4A4A4A";

// --- Helpers ---
function h1(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
  });
}
function h2(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
  });
}
function para(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color: DARK })],
    spacing: { before: 80, after: 80 },
  });
}
function step(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color: DARK })],
    spacing: { before: 60, after: 60 },
    indent: { left: convertInchesToTwip(0.3) },
  });
}
function dot(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color: DARK })],
    bullet: { level: 0 },
    spacing: { before: 50, after: 50 },
  });
}
function r(text: string, bold = false, color = DARK): TextRun {
  return new TextRun({ text, bold, size: 22, color });
}
function pb(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] });
}
function spacer(pts = 120): Paragraph {
  return new Paragraph({ spacing: { before: pts }, children: [] });
}

// Table helpers
function hdr(text: string, w = 33): TableCell {
  return new TableCell({
    width: { size: w, type: WidthType.PERCENTAGE },
    shading: { fill: BLUE, type: ShadingType.CLEAR },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: WHITE, size: 20 })],
      alignment: AlignmentType.CENTER,
    })],
  });
}
function cell(text: string, w = 33): TableCell {
  return new TableCell({
    width: { size: w, type: WidthType.PERCENTAGE },
    children: [new Paragraph({ children: [r(text)] })],
  });
}
function row(cells: TableCell[]): TableRow {
  return new TableRow({ children: cells });
}
function tbl(cols: string[], rows: string[][], colWidths?: number[]): Table {
  const widths = colWidths || cols.map(() => Math.floor(100 / cols.length));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      row(cols.map((c, i) => hdr(c, widths[i]))),
      ...rows.map(r => row(r.map((c, i) => cell(c, widths[i])))),
    ],
  });
}

// Section header
function sectionHeader(num: string, title: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: `${num}. ${title.toUpperCase()}`, bold: true, size: 32, color: WHITE })],
    alignment: AlignmentType.CENTER,
    shading: { fill: BLUE, type: ShadingType.CLEAR },
    spacing: { before: 160, after: 240 },
  });
}

// =====================================================================
// BUILD DOCUMENT
// =====================================================================
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 22, color: DARK } },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(0.9),
          bottom: convertInchesToTwip(0.9),
          left: convertInchesToTwip(1.1),
          right: convertInchesToTwip(1.1),
        },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          children: [
            r("ExploreX Travel  |  Trang ", false, GRAY),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GRAY }),
            r(" / ", false, GRAY),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: GRAY }),
          ],
          alignment: AlignmentType.CENTER,
        })],
      }),
    },
    children: [

      // ================================================================
      // TRANG BÌA
      // ================================================================
      spacer(1600),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("ĐỒ ÁN MÔN HỌC", true, BLUE)] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("HƯỚNG ĐỐI TƯỢNG", true, BLUE)] }),
      spacer(300),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("─".repeat(40), false, BLUE)] }),
      spacer(300),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("ExploreX Travel", true, GREEN), r(" — ", false, GRAY), r("Website Quản Lý & Đặt Tour Du Lịch", false, GRAY)] }),
      spacer(300),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("─".repeat(40), false, BLUE)] }),
      spacer(400),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("GVHD: ", true), r("[Tên GVHD]", false, GRAY)] }),
      spacer(150),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("SVTH: ", true), r("[Họ tên sinh viên]", false, GRAY)] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("MSSV: ", true), r("[Mã số sinh viên]", false, GRAY)] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("Lớp: ", true), r("[Lớp]", false, GRAY)] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("Khoa: ", true), r("[Khoa CNTT]", false, GRAY)] }),

      pb(),

      // ================================================================
      // MỤC LỤC
      // ================================================================
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("NỘI DUNG TRÌNH BÀY", true, BLUE)], spacing: { before: 400, after: 300 } }),
      ...[1,2,3,4,5,6,7,8].map(i => {
        const titles = ["Giới thiệu đề tài","Mục tiêu & Phạm vi","Kiến trúc hệ thống","Thiết kế Cơ sở Dữ liệu","Các chức năng chính","Quy trình nghiệp vụ","Demo hệ thống","Kết luận & Hướng phát triển"];
        return new Paragraph({ spacing: { before: 100, after: 80 }, children: [r(`${i}. `, true), r(titles[i-1])] });
      }),

      pb(),

      // ================================================================
      // 1. GIỚI THIỆU ĐỀ TÀI
      // ================================================================
      sectionHeader("1", "Giới thiệu đề tài"),

      h2("1.1  Bối cảnh"),
      para("ExploreX Travel là nền tảng quản lý và đặt tour du lịch nội địa Việt Nam, tập trung khu vực Đồng bằng sông Cửu Long. Hệ thống kết nối khách hàng với nhà cung cấp tour, có ba nhóm người dùng chính."),
      spacer(),

      h2("1.2  Ba đối tượng sử dụng"),
      tbl(["Đối tượng", "Mô tả"], [
        ["Khách hàng (CUSTOMER)", "Tìm kiếm tour, đặt tour, thanh toán, đánh giá sau chuyến đi"],
        ["Nhà cung cấp (PROVIDER)", "Quản lý tour & lịch khởi hành, xác nhận đơn, xem báo cáo"],
        ["Quản trị viên (ADMIN)", "Duyệt provider & tour, quản lý người dùng, thống kê toàn hệ thống"],
      ], [25, 75]),
      spacer(),

      h2("1.3  Công nghệ sử dụng"),
      tbl(["Thành phần", "Công nghệ"], [
        ["Frontend", "Next.js 16.2.2 + React 19.2.4 (App Router)"],
        ["Styling", "Tailwind CSS 4"],
        ["Database", "MySQL (XAMPP)"],
        ["Driver", "mysql2"],
        ["Validation", "Yup"],
        ["Auth", "JWT (jose) — HTTP-only cookie"],
        ["Payments", "VNPay (demo fallback, không cần credentials thật)"],
        ["Charts", "Recharts"],
        ["Notifications", "Sonner (toast)"],
      ], [30, 70]),

      pb(),

      // ================================================================
      // 2. MỤC TIÊU & PHẠM VI
      // ================================================================
      sectionHeader("2", "Mục tiêu & Phạm vi"),

      h2("2.1  Mục tiêu hệ thống"),
      dot("Cho phép khách hàng tìm kiếm, xem chi tiết và đặt tour dễ dàng"),
      dot("Cho phép nhà cung cấp quản lý tour và lịch khởi hành"),
      dot("Cho phép admin kiểm duyệt, quản lý dữ liệu và theo dõi kinh doanh"),
      dot("Cung cấp thống kê cơ bản: đơn đặt, doanh thu, đánh giá"),
      spacer(),

      h2("2.2  Phạm vi triển khai (MVP)"),
      tbl(["Module", "Chức năng", "Trạng thái"], [
        ["Xác thực & Phân quyền", "Đăng ký, đăng nhập, 3 vai trò (CUSTOMER / PROVIDER / ADMIN)", "✓ Hoàn thành"],
        ["Quản lý Tour", "CRUD, phân nhóm, lọc, tìm kiếm", "✓ Hoàn thành"],
        ["Quản lý Lịch khởi hành", "Tạo / cập nhật lịch, kiểm tra chỗ trống tự động", "✓ Hoàn thành"],
        ["Đặt tour", "Tạo đơn, xác nhận, hủy, theo dõi trạng thái", "✓ Hoàn thành"],
        ["Đánh giá", "Viết đánh giá sau khi tour hoàn thành (1 đánh giá / đơn)", "✓ Hoàn thành"],
        ["Dashboard", "Thống kê doanh thu, đơn hàng, đánh giá", "✓ Hoàn thành"],
        ["Thanh toán", "VNPay demo (redirect → confirm)", "✓ Hoàn thành"],
        ["Xuất báo cáo", "Export PPTX (doanh thu, top tours)", "✓ Hoàn thành"],
      ], [20, 55, 25]),
      spacer(),

      h2("2.3  Chưa triển khai ở MVP"),
      dot("Thanh toán thật với cổng bên thứ ba"),
      dot("OTP xác thực SMS/email"),
      dot("Khuyến mãi, voucher"),
      dot("Gợi ý tour bằng AI/ML"),
      dot("Ứng dụng di động"),

      pb(),

      // ================================================================
      // 3. KIẾN TRÚC HỆ THỐNG
      // ================================================================
      sectionHeader("3", "Kiến trúc hệ thống"),

      h2("3.1  Kiến trúc tổng thể"),
      para("Next.js App Router — Frontend và Backend trong cùng một project (monorepo)."),
      para("Mô hình 3 lớp (Layered Architecture):"),
      dot("Presentation Layer → components/ (giao diện, forms, layout)"),
      dot("Business Logic Layer → services/ (tất cả SQL queries, xử lý nghiệp vụ)"),
      dot("Data Layer → lib/db/ (kết nối MySQL)"),
      spacer(),

      h2("3.2  Cấu trúc thư mục"),
      tbl(["Thư mục / Route", "Mô tả"], [
        ["app/(public)/", "Trang công khai: home, tours, login, register"],
        ["app/(account)/", "Khu vực khách hàng: /account/bookings, /account/reviews"],
        ["app/(admin)/admin/", "Superadmin panel: dashboard, users, providers, tours, bookings"],
        ["app/(admin)/admin/provider/", "Provider panel: tour, lich, don, bao cao cua minh"],
        ["app/api/", "API routes — kiểm tra auth rồi gọi services"],
        ["services/", "Business logic — SQL queries tập trung ở đây"],
        ["lib/auth/", "JWT, session, guards, requireApiRole, requireOwnership"],
        ["lib/validations/", "Yup schemas cho từng domain (auth, tour, booking...)"],
        ["types/", "TypeScript interfaces: tour.ts, booking.ts, auth.ts..."],
        ["components/", "forms/, admin/, account/, provider/, public/, layout/, ui/"],
      ], [30, 70]),
      spacer(),

      h2("3.3  Data Flow"),
      para("Pages → API Routes (kiểm tra auth) → Services (SQL + nghiệp vụ) → MySQL"),
      para("MySQL trả dữ liệu về services → services trả về typed response → pages render."),
      spacer(),

      h2("3.4  Auth & Permissions"),
      tbl(["Cơ chế", "Chi tiết"], [
        ["JWT Token", "Lưu trong HTTP-only cookie (AUTH_COOKIE_NAME)"],
        ["Session server-side", "getSessionUser() / getRequiredApiUser()"],
        ["Guards", "requireApiRole(role) | requireOwnership(ownerId, userId)"],
        ["Demo mode", "AUTH_USE_MOCK=true → hoạt động không cần DB"],
        ["Demo accounts", "admin@explorex.vn / provider@explorex.vn / customer@explorex.vn (password: demo)"],
        ["Ownership rule", "PROVIDER chỉ thao tác dữ liệu thuộc sở hữu; ADMIN không giới hạn"],
      ], [25, 75]),

      pb(),

      // ================================================================
      // 4. THIẾT KẾ CƠ SỞ DỮ LIỆU
      // ================================================================
      sectionHeader("4", "Thiết kế Cơ sở Dữ liệu"),

      h2("4.1  Sơ đồ quan hệ thực thể (ERD) — 9 bảng"),
      tbl(["Bảng", "Khóa chính", "Quan hệ chính"], [
        ["nguoidung", "maNguoiDung", "Nguồn vai trò: CUSTOMER / PROVIDER / ADMIN"],
        ["khachhang", "maNguoiDung (FK→nguoidung)", "1:1 — hồ sơ khách hàng"],
        ["admin", "maNguoiDung (FK→nguoidung)", "1:1 — hồ sơ quản trị"],
        ["nhacungcaptour", "maNhaCungCap", "maNguoiDung → nguoidung (1:1)"],
        ["nhomtour", "maNhomTour", "1:N ← tour"],
        ["tour", "maTour", "maNhaCungCap → nhacungcaptour; maNhomTour → nhomtour"],
        ["lichtour", "maLichTour", "maTour → tour (1:N)"],
        ["dattour", "maDatTour", "maLichTour → lichtour; maNguoiDung → khachhang"],
        ["danhgia", "maDanhGia", "maTour → tour; maNguoiDung → khachhang"],
      ], [22, 28, 50]),
      spacer(),

      h2("4.2  Các trạng thái trong hệ thống"),
      tbl(["Thực thể", "Trạng thái"], [
        ["nguoidung.trangThaiTaiKhoan", "ACTIVE | PENDING | SUSPENDED | DISABLED"],
        ["nhacungcaptour.trangThaiHopTac", "PENDING | APPROVED | REJECTED | SUSPENDED"],
        ["nhomtour.trangThai", "ACTIVE | INACTIVE"],
        ["tour.trangThai", "DRAFT | PENDING_REVIEW | PUBLISHED | HIDDEN | INACTIVE"],
        ["lichtour.trangThai", "OPEN | FULL | CLOSED | CANCELLED"],
        ["dattour.trangThaiDatTour", "PENDING | CONFIRMED | CANCELLED | COMPLETED"],
        ["dattour.trangThaiThanhToan", "UNPAID | PAID | REFUNDED"],
      ], [35, 65]),
      spacer(),
      para("Nguồn schema chuẩn: docs/crebas5_fixed.sql"),

      pb(),

      // ================================================================
      // 5. CÁC CHỨC NĂNG CHÍNH
      // ================================================================
      sectionHeader("5", "Các chức năng chính"),

      h2("5.1  Khách hàng (CUSTOMER)"),
      tbl(["Chức năng", "Mô tả"], [
        ["Đăng ký / Đăng nhập", "Tạo tài khoản + đăng nhập JWT"],
        ["Tìm kiếm & lọc tour", "Lọc theo nhóm, giá, ngày, số chỗ"],
        ["Xem chi tiết tour", "Hình ảnh, mô tả, lịch khởi hành, đánh giá"],
        ["Đặt tour", "Chọn lịch → nhập số người → tạo đơn (kiểm tra chỗ tự động)"],
        ["Thanh toán VNPay", "Demo: tạo payment → redirect → xác nhận"],
        ["Xem lịch sử đơn", "/account/bookings — theo dõi trạng thái đơn"],
        ["Viết đánh giá", "/account/reviews/create/[tourId] — chỉ khi đơn COMPLETED"],
      ], [30, 70]),
      spacer(),

      h2("5.2  Nhà cung cấp (PROVIDER)"),
      tbl(["Chức năng", "Mô tả"], [
        ["Dashboard", "Tổng quan tour, lịch, đơn, đánh giá"],
        ["Quản lý tour", "Tạo / sửa / ẩn tour thuộc sở hữu (kiểm tra ownership)"],
        ["Quản lý lịch khởi hành", "Tạo / cập nhật: ngày, giá, tổng chỗ"],
        ["Xác nhận đơn đặt", "Duyệt / từ chối đơn từ khách hàng"],
        ["Xem đánh giá", "Phản hồi từ khách về tour của mình"],
        ["Báo cáo thống kê", "Doanh thu theo tour, đơn hàng, đánh giá"],
      ], [30, 70]),
      spacer(),

      h2("5.3  Quản trị viên (ADMIN)"),
      tbl(["Chức năng", "Mô tả"], [
        ["Dashboard", "Tổng hợp: doanh thu, đơn hàng, người dùng, chất lượng"],
        ["Quản lý người dùng", "Xem, khóa/mở tài khoản"],
        ["Duyệt nhà cung cấp", "Duyệt / từ chối / tạm ngưng provider"],
        ["Duyệt tour", "Duyệt / ẩn tour trước khi công khai"],
        ["Quản lý nhóm tour", "Tạo / sửa / ẩn nhóm tour"],
        ["Quản lý đơn & đánh giá", "Xem tất cả đơn, xử lý đánh giá không phù hợp"],
        ["Xuất báo cáo PPTX", "Thống kê doanh thu, top tours"],
      ], [30, 70]),

      pb(),

      // ================================================================
      // 6. QUY TRÌNH NGHIỆP VỤ
      // ================================================================
      sectionHeader("6", "Quy trình nghiệp vụ"),

      h2("6.1  Luồng đặt tour"),
      step("1. Khách đăng nhập → tìm kiếm / lọc tour → xem chi tiết"),
      step("2. Chọn lịch khởi hành → nhập số người"),
      step("3. Hệ thống kiểm tra: soChoTrong ≥ soNguoi và trạng thái OPEN"),
      step("4. Tạo đơn đặt (PENDING / UNPAID)"),
      step("5. Redirect sang VNPay demo → xác nhận thanh toán"),
      step("6. Đơn chuyển CONFIRMED / PAID → hệ thống trừ chỗ: soChoTrong -= soNguoi"),
      step("7. Khách xem lịch sử đơn tại /account/bookings"),
      spacer(),

      h2("6.2  Luồng tạo & duyệt tour"),
      step("1. Provider đăng nhập → vào /admin/provider/tours/new"),
      step("2. Nhập thông tin tour + gắn nhóm tour → tạo (trạng thái: PENDING_REVIEW)"),
      step("3. Admin duyệt → trạng thái chuyển PUBLISHED"),
      step("4. Provider tạo lịch khởi hành cho tour"),
      step("5. Tour hiển thị công khai sau khi được duyệt"),
      spacer(),

      h2("6.3  Luồng đánh giá"),
      step("1. Đơn chuyển trạng thái → COMPLETED"),
      step("2. Khách mở /account/reviews/create/[tourId]"),
      step("3. Kiểm tra: đơn thuộc khách hàng + trạng thái COMPLETED"),
      step("4. Gửi số sao (1–5) + bình luận"),
      step("5. Hệ thống cập nhật điểm trung bình tour"),
      spacer(),

      h2("6.4  Quy tắc nghiệp vụ bắt buộc"),
      dot("Không đặt tour nếu soChoTrong < soNguoi"),
      dot("CONFIRMED → trừ chỗ; CANCELLED từ CONFIRMED → hoàn chỗ"),
      dot("Chỉ ADMIN duyệt provider & tour"),
      dot("Chỉ CUSTOMER đã COMPLETED tour mới được đánh giá"),
      dot("Mỗi khách chỉ 1 đánh giá / đơn"),
      dot("Backend kiểm tra token, role, ownership ở mọi API (không tin frontend)"),
      dot("Soft delete / đổi trạng thái thay vì xóa dữ liệu có đơn"),

      pb(),

      // ================================================================
      // 7. DEMO HỆ THỐNG
      // ================================================================
      sectionHeader("7", "Demo hệ thống"),

      h2("7.1  Khởi động"),
      para("cd explorex-travel"),
      para("npm install"),
      para("npm run dev  →  Mở http://localhost:3000"),
      spacer(),

      h2("7.2  Tài khoản demo"),
      tbl(["Vai trò", "Email", "Mật khẩu"], [
        ["ADMIN", "admin@explorex.vn", "demo"],
        ["PROVIDER", "provider@explorex.vn", "demo"],
        ["CUSTOMER", "customer@explorex.vn", "demo"],
      ], [25, 50, 25]),
      spacer(),

      h2("7.3  Các luồng demo đề xuất"),
      dot("Luồng 1 (CUSTOMER): Tìm tour → đặt → thanh toán VNPay demo → xem đơn"),
      dot("Luồng 2 (PROVIDER): Tạo tour → tạo lịch → xem đơn từ khách"),
      dot("Luồng 3 (ADMIN): Duyệt provider → duyệt tour → xem dashboard → xuất PPTX"),
      dot("Luồng 4 (CUSTOMER): Viết đánh giá sau khi đơn COMPLETED"),
      spacer(),

      h2("7.4  Seed data hiện có"),
      para("1 admin, 1 provider, 1 customer | 2 nhóm tour | 2 tour | 2 lịch | 2 đơn đặt | 2 đánh giá"),

      pb(),

      // ================================================================
      // 8. KẾT LUẬN & HƯỚNG PHÁT TRIỂN
      // ================================================================
      sectionHeader("8", "Kết luận & Hướng phát triển"),

      h2("8.1  Kết quả đạt được"),
      dot("Hệ thống hoàn chỉnh end-to-end: đăng nhập → đặt tour → thanh toán → đánh giá"),
      dot("3 vai trò người dùng với quyền hạn riêng biệt, kiểm tra ở cả route và API"),
      dot("Kiến trúc 3 lớp (presentation → business → data) rõ ràng, dễ bảo trì"),
      dot("Schema MySQL chuẩn hóa với 9 bảng, quan hệ đầy đủ"),
      dot("Validation client & server bằng Yup, toast notifications, JWT cookie security"),
      spacer(),

      h2("8.2  Thách thức & bài học"),
      dot("Chuẩn hóa schema từ yêu cầu nghiệp vụ thực tế (9 bảng quan hệ)"),
      dot("Xử lý phân quyền đa vai trò trong cùng một route group (/admin)"),
      dot("Quản lý trạng thái đặt tour và số chỗ trống trong thời gian thực (no overbooking)"),
      dot("Bảo mật API: không tin tưởng frontend, kiểm tra token/role/ownership ở backend"),
      spacer(),

      h2("8.3  Hướng phát triển tương lai"),
      dot("Tích hợp thanh toán VNPay thật (cần credentials production)"),
      dot("Thêm OTP xác thực qua SMS/email"),
      dot("Module khuyến mãi, voucher cho khách hàng"),
      dot("Gợi ý tour bằng AI/ML dựa trên lịch sử đặt"),
      dot("Tích hợp Google Maps nâng cao cho chi tiết tour"),
      dot("Đa ngôn ngữ (Tiếng Anh / Tiếng Việt)"),
      dot("Ứng dụng di động (React Native / Flutter)"),
      spacer(),

      h2("8.4  Tài liệu tham khảo"),
      dot("docs/ai_build_spec.md — Đặc tả nghiệp vụ đầy đủ"),
      dot("docs/crebas5_fixed.sql — Schema chuẩn (nguồn chân lý)"),
      dot("docs/auth_and_permission_spec.md — Đặc tả auth & phân quyền"),
      dot("docs/database_normalization.md — Ghi chú chuẩn hóa DB"),
      dot("explorex-travel/CLAUDE.md — Hướng dẫn phát triển cho Claude Code"),

      pb(),

      // ================================================================
      // CẢM ƠN
      // ================================================================
      spacer(1400),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("CẢM ƠN THẦY/CÔ VÀ CÁC BẠN ĐÃ LẮNG NGHE", true, BLUE)] }),
      spacer(500),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("Q & A", true, GREEN), r(" —  Hỏi đáp thảo luận", false, GRAY)] }),
      spacer(400),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("─".repeat(40), false, BLUE)] }),
      spacer(200),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("ExploreX Travel", true, GREEN)] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [r("Website Quản Lý & Đặt Tour Du Lịch", false, GRAY)] }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log("✅ Created: " + OUTPUT_PATH);
}).catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});