const {
  AlignmentType,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  TextRun,
  convertInchesToTwip,
} = require("docx");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(process.cwd(), "..", "ExploreX_KichBan_ThuyetTrinh.docx");

const BLUE = "1E3A5F";
const GREEN = "2E7D32";
const DARK = "1A1A1A";
const GRAY = "555555";
const RED = "B42318";

function run(text, options = {}) {
  return new TextRun({
    text,
    size: options.size || 24,
    bold: options.bold || false,
    italics: options.italics || false,
    color: options.color || DARK,
  });
}

function para(text, options = {}) {
  return new Paragraph({
    children: [run(text, options)],
    spacing: { before: options.before || 80, after: options.after || 80, line: 330 },
    alignment: options.align || AlignmentType.LEFT,
  });
}

function title(text) {
  return new Paragraph({
    children: [run(text, { bold: true, size: 36, color: BLUE })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
  });
}

function section(number, text, minutes) {
  return new Paragraph({
    children: [
      run(`${number}. ${text}`, { bold: true, size: 30, color: BLUE }),
      run(`  (${minutes})`, { italics: true, size: 22, color: GRAY }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
  });
}

function note(text) {
  return new Paragraph({
    children: [run(`Ghi chú trình bày: ${text}`, { italics: true, color: GRAY, size: 22 })],
    spacing: { before: 60, after: 100 },
  });
}

function cue(text) {
  return new Paragraph({
    children: [run(text, { bold: true, color: GREEN, size: 22 })],
    spacing: { before: 120, after: 60 },
  });
}

function bullet(text) {
  return new Paragraph({
    children: [run(text, { size: 22 })],
    bullet: { level: 0 },
    spacing: { before: 30, after: 30 },
  });
}

function script(text) {
  return new Paragraph({
    children: [run(text, { size: 24 })],
    spacing: { before: 70, after: 70, line: 340 },
    indent: { left: convertInchesToTwip(0.22) },
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 24, color: DARK } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                run("ExploreX Travel - Kịch bản thuyết trình | Trang ", { size: 18, color: GRAY }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GRAY }),
                run(" / ", { size: 18, color: GRAY }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: GRAY }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({ spacing: { before: 1200, after: 200 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [run("KỊCH BẢN THUYẾT TRÌNH ĐỒ ÁN", { bold: true, size: 38, color: BLUE })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 140, after: 100 },
          children: [run("ExploreX Travel - Website Quản Lý Và Đặt Tour Du Lịch", { bold: true, size: 30, color: GREEN })],
        }),
        para("Môn học: Hướng Đối Tượng", { align: AlignmentType.CENTER }),
        para("Thời lượng gợi ý: 10-12 phút", { align: AlignmentType.CENTER, color: GRAY }),
        para("Người trình bày: [Họ tên sinh viên] - Lớp: [Lớp] - GVHD: [Tên GVHD]", { align: AlignmentType.CENTER, color: GRAY }),

        title("Cách dùng kịch bản"),
        bullet("Đây là lời dẫn để thuyết trình, không phải nội dung slide."),
        bullet("Có thể đọc gần nguyên văn, nhưng nên nói tự nhiên và nhìn vào demo khi đến phần luồng chức năng."),
        bullet("Các phần có chữ 'Ghi chú trình bày' là nhắc việc thao tác hoặc chuyển ý, không cần đọc thành lời."),
        bullet("Nếu thời gian ít, ưu tiên nói kỹ: bài toán, 3 vai trò, kiến trúc, CSDL, luồng đặt tour và phân quyền."),

        title("Kịch bản chi tiết"),

        section("1", "Mở đầu và giới thiệu đề tài", "1 phút"),
        cue("Lời dẫn"),
        script("Kính chào thầy/cô và các bạn. Hôm nay em xin trình bày đồ án môn Hướng Đối Tượng với đề tài ExploreX Travel - website quản lý và đặt tour du lịch."),
        script("Lý do em chọn đề tài này là vì nhu cầu tìm kiếm, đặt tour và quản lý tour du lịch ngày càng phổ biến. Với các doanh nghiệp lữ hành nhỏ hoặc các nhà cung cấp tour địa phương, nếu chỉ quản lý bằng điện thoại, tin nhắn hoặc bảng tính thì rất dễ sai sót: trùng lịch, thiếu thông tin khách, khó kiểm soát số chỗ và khó thống kê doanh thu."),
        script("Vì vậy, ExploreX Travel được xây dựng như một hệ thống web giúp kết nối ba nhóm người dùng: khách hàng, nhà cung cấp tour và quản trị viên. Khách hàng có thể tìm tour, đặt tour, thanh toán và đánh giá. Nhà cung cấp có thể quản lý tour, lịch khởi hành và đơn đặt. Quản trị viên có thể kiểm duyệt dữ liệu và theo dõi toàn bộ hoạt động của hệ thống."),
        note("Nói chậm phần vấn đề thực tế, vì đây là phần tạo bối cảnh cho toàn bộ đồ án."),

        section("2", "Mục tiêu và phạm vi hệ thống", "1 phút"),
        cue("Lời dẫn"),
        script("Mục tiêu tổng quát của hệ thống là xây dựng một website hỗ trợ quy trình đặt tour từ đầu đến cuối: từ lúc khách hàng xem tour, chọn lịch khởi hành, tạo đơn đặt, theo dõi trạng thái, cho đến khi hoàn thành chuyến đi và đánh giá tour."),
        script("Trong phạm vi đồ án, hệ thống tập trung vào các chức năng chính gồm: xác thực và phân quyền theo ba vai trò; quản lý tour và nhóm tour; quản lý lịch khởi hành; đặt tour và quản lý đơn đặt; đánh giá tour; dashboard thống kê cơ bản cho admin và nhà cung cấp."),
        script("Một số chức năng nâng cao như thanh toán thật, OTP qua SMS hoặc email, voucher, gợi ý tour bằng AI và ứng dụng di động chưa phải trọng tâm của MVP. Tuy nhiên, cấu trúc hệ thống đã được thiết kế để có thể mở rộng những phần này về sau."),
        note("Nếu có slide phạm vi, chỉ cần chỉ vào các module chính, không đọc từng dòng."),

        section("3", "Đối tượng sử dụng và phân quyền", "1.5 phút"),
        cue("Lời dẫn"),
        script("Hệ thống có ba vai trò chính. Vai trò thứ nhất là CUSTOMER, tức khách hàng. Khách hàng có thể đăng ký, đăng nhập, xem danh sách tour công khai, xem chi tiết tour, đặt tour, xem lịch sử đặt tour và viết đánh giá khi đủ điều kiện."),
        script("Vai trò thứ hai là PROVIDER, tức nhà cung cấp tour. Nhà cung cấp làm việc trong khu vực /admin/provider. Họ có thể quản lý tour của chính mình, tạo lịch khởi hành, xem đơn đặt thuộc tour của mình, xác nhận hoặc từ chối đơn, xem đánh giá và theo dõi doanh thu cơ bản."),
        script("Vai trò thứ ba là ADMIN. Admin có quyền cao nhất, có thể truy cập toàn bộ khu vực quản trị để quản lý người dùng, nhà cung cấp, nhóm tour, tour, lịch khởi hành, booking, đánh giá và báo cáo toàn hệ thống."),
        script("Điểm quan trọng trong thiết kế phân quyền là hệ thống không tin tưởng frontend. Frontend chỉ dùng để hiển thị và điều hướng. Mỗi API đều cần kiểm tra token, role, ownership và trạng thái nghiệp vụ. Ví dụ, provider chỉ được sửa tour thuộc nhà cung cấp của mình; customer chỉ được xem booking của chính mình; chỉ customer có booking đã hoàn thành mới được đánh giá."),
        note("Nhấn mạnh ownership vì đây là điểm thể hiện tư duy bảo mật và nghiệp vụ."),

        section("4", "Kiến trúc và công nghệ sử dụng", "1.5 phút"),
        cue("Lời dẫn"),
        script("Về công nghệ, hệ thống được xây dựng bằng Next.js 16 kết hợp TypeScript. Next.js App Router cho phép tổ chức cả giao diện và API trong cùng một project. Cơ sở dữ liệu sử dụng MySQL, kết nối thông qua thư viện mysql2. Phần xác thực sử dụng JWT lưu trong HTTP-only cookie để hạn chế việc token bị truy cập trực tiếp từ JavaScript phía trình duyệt."),
        script("Cấu trúc mã nguồn được chia theo hướng rõ trách nhiệm. Thư mục app chứa các trang và API route. Thư mục components chứa giao diện, form, layout và các thành phần dùng lại. Thư mục services chứa logic nghiệp vụ và truy vấn SQL. Thư mục lib chứa các phần dùng chung như kết nối database, auth, validation, môi trường và hằng số trạng thái. Thư mục types chứa các kiểu dữ liệu TypeScript dùng chung."),
        script("Về luồng xử lý, khi người dùng thao tác trên giao diện, request sẽ đi đến API route. API kiểm tra xác thực và quyền truy cập, sau đó gọi service để xử lý nghiệp vụ và truy vấn MySQL. Kết quả được trả về theo kiểu dữ liệu rõ ràng để giao diện hiển thị."),
        script("Cách tổ chức này giúp code dễ bảo trì hơn: giao diện không chứa logic SQL, API không xử lý quá nhiều nghiệp vụ phức tạp, và service là nơi tập trung các quy tắc như chống đặt quá số chỗ, tính tổng tiền, hoàn chỗ khi hủy đơn và kiểm tra quyền sở hữu dữ liệu."),

        section("5", "Thiết kế cơ sở dữ liệu", "1.5 phút"),
        cue("Lời dẫn"),
        script("Cơ sở dữ liệu của hệ thống được chuẩn hóa dựa trên các tài liệu schema trong thư mục docs. Hệ thống hiện tập trung vào chín bảng chính: Nguoidung, Khachhang, Admin, Nhacungcaptour, Nhomtour, Tour, Lichtour, Dattour và Danhgia."),
        script("Bảng Nguoidung là bảng tài khoản đăng nhập chung cho cả ba vai trò, có email, mật khẩu đã băm, role và trạng thái tài khoản. Từ bảng này, khách hàng được mở rộng qua bảng Khachhang, admin qua bảng Admin, còn provider được liên kết với bảng Nhacungcaptour."),
        script("Về nghiệp vụ tour, bảng Nhomtour dùng để phân loại tour, bảng Tour lưu thông tin tour và liên kết với nhà cung cấp. Mỗi tour có thể có nhiều lịch khởi hành trong bảng Lichtour. Khi khách hàng đặt tour, dữ liệu được lưu ở bảng Dattour, liên kết với lịch tour và khách hàng. Sau khi tour hoàn thành, khách hàng có thể tạo đánh giá trong bảng Danhgia."),
        script("Các trạng thái cũng được chuẩn hóa để tránh nhập tự do. Ví dụ, tour có thể là DRAFT, PENDING_REVIEW, PUBLISHED, HIDDEN hoặc INACTIVE. Lịch tour có OPEN, FULL, CLOSED, CANCELLED. Booking có trạng thái đặt tour như PENDING, CONFIRMED, CANCELLED, COMPLETED và trạng thái thanh toán như UNPAID, PAID, REFUNDED."),
        script("Việc chuẩn hóa này giúp backend kiểm tra nghiệp vụ dễ hơn. Ví dụ, chỉ cho đặt lịch đang OPEN, không cho đặt nếu số chỗ còn lại nhỏ hơn số người, khi xác nhận đơn thì trừ chỗ, khi hủy đơn hợp lệ thì hoàn chỗ."),
        note("Nếu có ERD, nên chỉ theo chuỗi Nguoidung -> Khachhang/Nhacungcaptour -> Tour -> Lichtour -> Dattour -> Danhgia."),

        section("6", "Các chức năng chính", "2 phút"),
        cue("Lời dẫn"),
        script("Với khách hàng, hệ thống cung cấp các trang công khai như trang chủ, danh sách tour, chi tiết tour, đăng nhập và đăng ký. Khách hàng có thể tìm kiếm tour theo từ khóa và nhóm tour, xem thông tin chi tiết, xem lịch khởi hành, tạo đơn đặt tour, xem lịch sử đơn và viết đánh giá khi đã hoàn thành chuyến đi."),
        script("Với nhà cung cấp, hệ thống có khu vực riêng trong /admin/provider. Provider có dashboard tổng quan, quản lý tour, quản lý lịch khởi hành, xem booking thuộc tour của mình, cập nhật trạng thái đơn và xem đánh giá từ khách hàng. Các API của provider đều cần kiểm tra ownership để tránh thao tác nhầm dữ liệu của provider khác."),
        script("Với admin, hệ thống có dashboard tổng hợp, quản lý người dùng, nhà cung cấp, nhóm tour, tour, lịch khởi hành, booking, đánh giá và báo cáo. Admin có quyền toàn hệ thống nhưng vẫn phải qua validation dữ liệu và các trạng thái nghiệp vụ hợp lệ."),
        script("Ngoài ra, hệ thống có validation bằng Yup ở các form chính, có toast notification để phản hồi thao tác, có middleware bảo vệ route và có các test nhẹ cho auth, permission và booking rules."),

        section("7", "Luồng nghiệp vụ trọng tâm: đặt tour", "1.5 phút"),
        cue("Lời dẫn"),
        script("Luồng quan trọng nhất của hệ thống là luồng đặt tour. Đầu tiên, khách hàng đăng nhập, tìm kiếm hoặc lọc tour, sau đó mở trang chi tiết tour. Tại đây khách hàng chọn lịch khởi hành, nhập số người và gửi yêu cầu đặt tour."),
        script("Khi request đến backend, hệ thống kiểm tra người dùng có phải CUSTOMER hay không, lịch tour có tồn tại không, trạng thái lịch có đang OPEN không, số người có hợp lệ không và số chỗ còn lại có đủ không. Nếu hợp lệ, hệ thống tính tổng tiền dựa trên giá tour của lịch khởi hành và số người, sau đó tạo booking với trạng thái ban đầu."),
        script("Khi đơn được xác nhận, hệ thống trừ số chỗ còn lại của lịch tour. Nếu một đơn đã xác nhận bị hủy hợp lệ, hệ thống hoàn lại số chỗ. Quy tắc này giúp tránh tình trạng overbooking, tức là nhận nhiều khách hơn số chỗ thực tế."),
        script("Sau khi chuyến đi hoàn thành, booking được chuyển sang COMPLETED. Lúc này khách hàng mới đủ điều kiện viết đánh giá. Backend kiểm tra booking thuộc đúng khách hàng và đã hoàn thành trước khi cho phép tạo đánh giá."),
        note("Phần này nên kết hợp demo thực tế nếu còn thời gian."),

        section("8", "Demo hệ thống", "1.5-2 phút"),
        cue("Lời dẫn thao tác"),
        script("Phần tiếp theo em xin demo nhanh các luồng chính của hệ thống. Đầu tiên là đăng nhập bằng tài khoản khách hàng, mở danh sách tour, xem chi tiết một tour và tạo đơn đặt tour. Ở bước này có thể thấy hệ thống hiển thị lịch khởi hành, số chỗ còn lại và tổng tiền."),
        script("Tiếp theo, em chuyển sang tài khoản nhà cung cấp. Ở khu vực provider, nhà cung cấp có thể xem dashboard, quản lý tour và lịch khởi hành của mình, đồng thời theo dõi các đơn đặt liên quan đến tour mình sở hữu."),
        script("Cuối cùng, em đăng nhập bằng tài khoản admin. Admin có thể xem dashboard tổng hợp, quản lý người dùng, nhà cung cấp, tour, lịch khởi hành, booking và đánh giá toàn hệ thống."),
        script("Nếu cần chạy demo từ đầu, project được khởi động bằng lệnh: cd explorex-travel, sau đó npm run dev, rồi mở http://localhost:3000."),
        bullet("Tài khoản demo gợi ý: admin@explorex.vn / demo"),
        bullet("Tài khoản demo gợi ý: provider@explorex.vn / demo"),
        bullet("Tài khoản demo gợi ý: customer@explorex.vn / demo"),
        note("Khi demo, chỉ chọn 2-3 thao tác chắc chắn chạy ổn. Không nên demo quá nhiều màn nếu thời gian thuyết trình ngắn."),

        section("9", "Kết quả đạt được", "1 phút"),
        cue("Lời dẫn"),
        script("Sau quá trình triển khai, hệ thống đã đạt được các phần chính của một website quản lý và đặt tour: có xác thực bằng JWT, phân quyền ba vai trò, route riêng theo vai trò, kết nối MySQL, quản lý tour, lịch khởi hành, booking, đánh giá và dashboard cơ bản."),
        script("Về mặt thiết kế hướng đối tượng và tổ chức phần mềm, đồ án thể hiện qua việc tách domain thành các kiểu dữ liệu riêng như user, provider, tour, schedule, booking và review; tách logic nghiệp vụ vào service; tách kiểm tra quyền vào lib/auth; và tách validation theo từng module."),
        script("Điểm em tập trung nhất là đảm bảo nghiệp vụ đặt tour và phân quyền hoạt động đúng: không cho đặt quá số chỗ, không cho provider xem dữ liệu ngoài phạm vi sở hữu, không cho khách hàng đánh giá khi chưa hoàn thành tour, và không để frontend là nơi quyết định quyền truy cập."),

        section("10", "Hạn chế và hướng phát triển", "1 phút"),
        cue("Lời dẫn"),
        script("Do thời gian thực hiện đồ án có giới hạn, hệ thống vẫn còn một số điểm có thể phát triển tiếp. Về frontend, giao diện hiện ưu tiên đủ chức năng và dễ kiểm thử, chưa đầu tư sâu theo một bộ thiết kế UI hoàn chỉnh. Một số bộ lọc nâng cao như khoảng giá, ngày khởi hành và số người có thể tiếp tục hoàn thiện."),
        script("Về nghiệp vụ, hệ thống có thể mở rộng thanh toán VNPay thật với credentials production, thêm OTP qua email hoặc SMS, thêm khuyến mãi và voucher, báo cáo doanh thu chi tiết hơn, bản đồ Google Maps cho tour, đa ngôn ngữ và ứng dụng mobile."),
        script("Ngoài ra, về kiểm thử, hiện đã có các test cho auth, permission và booking rules, nhưng có thể bổ sung thêm integration test với database thật để tăng độ tin cậy khi triển khai."),

        section("11", "Kết thúc", "30 giây"),
        cue("Lời kết"),
        script("Tóm lại, ExploreX Travel là một hệ thống web quản lý và đặt tour du lịch với ba vai trò chính: khách hàng, nhà cung cấp và quản trị viên. Hệ thống giải quyết quy trình nghiệp vụ từ tìm kiếm tour, đặt tour, quản lý lịch, quản lý đơn đến đánh giá sau chuyến đi."),
        script("Qua đồ án này, em học được cách phân tích nghiệp vụ, thiết kế cơ sở dữ liệu quan hệ, tổ chức code theo module, xử lý xác thực phân quyền và triển khai một luồng nghiệp vụ hoàn chỉnh trên nền tảng Next.js và MySQL."),
        script("Em xin cảm ơn thầy/cô và các bạn đã lắng nghe. Em xin nhận câu hỏi và góp ý."),

        title("Phụ lục: câu hỏi có thể gặp"),
        cue("Câu hỏi 1: Vì sao dùng JWT trong HTTP-only cookie?"),
        script("Vì HTTP-only cookie giúp token không bị truy cập trực tiếp bằng JavaScript phía client, giảm rủi ro lộ token qua XSS so với lưu trong localStorage."),
        cue("Câu hỏi 2: Vì sao provider nằm trong /admin/provider thay vì tách route riêng?"),
        script("Vì provider cũng là một nhóm người dùng quản trị dữ liệu, nhưng bị giới hạn theo ownership. Đặt trong /admin/provider giúp dùng chung layout quản trị nhưng vẫn phân quyền rõ ràng."),
        cue("Câu hỏi 3: Làm sao chống đặt quá số chỗ?"),
        script("Backend kiểm tra lịch tour đang OPEN và soChoTrong phải lớn hơn hoặc bằng số người. Khi booking được xác nhận thì trừ chỗ, khi hủy booking hợp lệ thì hoàn chỗ."),
        cue("Câu hỏi 4: Vì sao không để frontend tự chặn quyền?"),
        script("Frontend có thể bị sửa request hoặc gọi API trực tiếp, nên quyền truy cập thật phải được kiểm tra ở backend bằng token, role, ownership và trạng thái nghiệp vụ."),
        cue("Câu hỏi 5: Nếu muốn mở rộng thanh toán thật thì làm gì?"),
        script("Cần cấu hình credentials production từ VNPay, lưu giao dịch vào bảng thanh toán riêng, xác thực chữ ký trả về và đồng bộ trạng thái thanh toán với booking."),
        para("Tài liệu tham khảo chính: docs/ai_build_spec.md, docs/auth_and_permission_spec.md, docs/database_normalization.md, docs/implementation_checklist.md, docs/explorexver2.sql.", { italics: true, color: RED }),
      ],
    },
  ],
});

Packer.toBuffer(doc)
  .then((buffer) => {
    fs.writeFileSync(outputPath, buffer);
    console.log(`Created: ${outputPath}`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
