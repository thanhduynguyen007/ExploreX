# Checklist Triển Khai Dự Án ExploreX Travel

Tài liệu này dùng để theo dõi tiến độ triển khai bám sát:

- `docs/ai_build_spec.md`
- `docs/docs.docx`
- `docs/crebas5_fixed.sql`

Quy ước trạng thái:

- `[x]` Đã hoàn thành
- `[~]` Đang có khung hoặc hoàn thành một phần
- `[ ]` Chưa làm

Quy ước triển khai:

- Tài liệu và nội dung hiển thị cho người dùng phải dùng tiếng Việt có dấu
- Tên biến, tên file, route và API path có thể giữ tiếng Anh để thuận tiện kỹ thuật
- Giai đoạn hiện tại ưu tiên backend hoạt động tốt trước
- Frontend chỉ giữ mức đơn giản, nhanh gọn, đủ để test luồng
- UI chi tiết sẽ làm sau khi có file thiết kế chính thức
- Không tin tưởng frontend; backend phải kiểm tra đầy đủ quyền, ownership và ràng buộc nghiệp vụ

## 1. Khởi tạo dự án

- [x] Chốt hướng công nghệ: `Next.js + MySQL (XAMPP) + mysql2 + Tailwind CSS`
- [x] Chốt hướng một codebase chung cho FE + BE
- [x] Scaffold project Next.js
- [x] Thiết lập TypeScript
- [x] Thiết lập Tailwind CSS
- [x] Thiết lập cấu trúc thư mục nền
- [x] Thiết lập file `.env.example`
- [x] Đổi tên thư mục project sang `explorex-travel`

## 2. Kiến trúc và tổ chức mã nguồn

- [x] Tạo route group cho `public`
- [x] Chuyển khách hàng sang khu vực công khai + `account`
- [x] Chuyển provider vào trong `/admin/provider`
- [x] Tạo route group cho `admin`
- [x] Thiết lập thư mục `components`
- [x] Thiết lập thư mục `lib`
- [x] Thiết lập thư mục `services`
- [x] Thiết lập thư mục `types`
- [ ] Thiết lập thư mục `repositories` nếu tách layer query riêng
- [x] Refactor route theo kiến trúc chính thức:
- [x] Khách hàng dùng website công khai + route tài khoản
- [x] Provider dùng khu vực con trong `/admin`

## 3. Auth, phân quyền, bảo vệ route

- [x] Chốt 3 role: `CUSTOMER`, `PROVIDER`, `ADMIN`
- [x] Thiết lập JWT auth cơ bản
- [x] Lưu JWT qua cookie `httpOnly`
- [x] Tạo API `login`
- [x] Tạo API `logout`
- [x] Tạo API `me`
- [x] Thiết lập middleware kiểm tra truy cập theo role
- [x] Điều hướng dashboard theo role sau đăng nhập
- [x] Đã bỏ mock auth và chuyển sang auth thật với MySQL
- [x] Nối auth với MySQL thật
- [ ] Thiết kế flow đăng ký khách hàng thật
- [ ] Thiết kế flow đăng ký nhà cung cấp thật
- [ ] Thêm logic admin duyệt nhà cung cấp
- [ ] Phân tách quyền `ADMIN` và `PROVIDER` trong cùng vùng `/admin`
- [~] Đã có kiểm tra ở các API chính cho tour, schedule, booking, review; còn cần mở rộng hết toàn bộ module đăng ký/duyệt

## 4. Validation và thông báo

- [x] Chốt dùng `Yup` cho validation
- [x] Validation ở client cho form login
- [x] Validation ở server cho API login
- [x] Chốt dùng `toast` để phản hồi thao tác
- [x] Setup `Sonner` toast provider toàn app
- [~] Đã áp dụng cho các form chính: login, tour group, tour, schedule, booking status, review

## 5. Database và kết nối MySQL

- [x] Thiết lập kết nối MySQL nền với `mysql2`
- [x] Tạo file `.env.local` thật cho máy dev
- [x] Kiểm tra kết nối thật đến MySQL trên XAMPP
- [x] Import schema gốc `crebas5_fixed.sql` vào MySQL local
- [x] Chuẩn hóa schema auth so với `crebas5_fixed.sql`
- [x] Bổ sung `role` cho bảng `Nguoidung`
- [x] Bổ sung `matKhauHash` cho bảng `Nguoidung`
- [x] Gắn nhà cung cấp với tài khoản đăng nhập
- [x] Chuẩn hóa trạng thái booking, thanh toán, lịch tour
- [x] Đã có script seed auth demo, nhóm tour mẫu, tour mẫu, lịch khởi hành mẫu, booking mẫu và đánh giá mẫu

## 6. Khu vực Public

- [x] Tạo trang chủ khung
- [x] Tạo trang danh sách tour khung
- [x] Tạo trang chi tiết tour khung
- [x] Tạo trang đăng nhập khung
- [x] Tạo trang đăng ký khách hàng khung
- [x] Tạo trang đăng ký nhà cung cấp khung
- [~] Đã có tìm kiếm theo từ khóa và nhóm tour, chưa hoàn thiện đầy đủ bộ lọc giá/ngày/số người
- [x] Nối dữ liệu tour từ database
- [x] Nối dữ liệu lịch khởi hành từ database
- [x] Đã có API và dữ liệu đánh giá thật, đã nối vào public tour detail
- [x] Làm header hoàn chỉnh
- [x] Làm footer hoàn chỉnh
- [x] Làm khối địa điểm du lịch nổi bật trong nước ở trang chủ

## 7. Khu vực Khách hàng trên website công khai

- [~] Đã tạo route khung kiểu dashboard, nhưng cần refactor theo mô hình account/public
- [x] Tạo route tài khoản/lịch sử đặt tour đúng kiến trúc
- [x] Tạo route chi tiết booking của khách hàng đúng kiến trúc
- [x] Tạo route đánh giá tour của khách hàng đúng kiến trúc
- [x] Làm danh sách booking thật
- [x] Làm chi tiết booking thật
- [x] Làm form đánh giá thật
- [x] Chặn đánh giá nếu khách chưa hoàn thành tour

## 8. Khu vực Nhà cung cấp trong `/admin`

- [~] Đã tạo route riêng cho đối tác, nhưng cần refactor vào `/admin/provider/*`
- [ ] Tạo route provider đúng kiến trúc trong `/admin`
- [x] Sửa layout để provider không thấy sidebar/admin section ngoài phạm vi được cấp quyền
- [~] Đã có list/create/edit tour thật cho provider, chưa hoàn thiện đủ toàn bộ CRUD và luồng kiểm duyệt
- [~] Đã có list/create/edit lịch khởi hành thật cho provider, chưa hoàn thiện đủ toàn bộ CRUD và cập nhật chỗ theo booking
- [x] Làm danh sách booking thật
- [~] Đã có xác nhận / hủy booking thật qua API, chưa hoàn thiện đủ mọi trạng thái nghiệp vụ từ giao diện
- [ ] Làm báo cáo doanh thu đối tác

## 9. Khu vực Admin

- [x] Tạo route dashboard admin
- [x] Tạo route quản lý người dùng
- [x] Tạo route chi tiết người dùng
- [x] Tạo route quản lý nhà cung cấp
- [x] Tạo route chi tiết nhà cung cấp
- [x] Tạo route quản lý nhóm tour
- [x] Tạo route quản lý tour
- [x] Tạo route chi tiết tour
- [x] Tạo route quản lý lịch khởi hành
- [x] Tạo route quản lý booking
- [x] Tạo route chi tiết booking
- [x] Tạo route quản lý đánh giá
- [x] Tạo route báo cáo
- [x] Làm dashboard admin thật
- [ ] Làm CRUD người dùng
- [ ] Làm duyệt nhà cung cấp
- [ ] Làm CRUD nhóm tour
- [~] Đã có API và màn xem tour thật cho admin, chưa hoàn thiện luồng kiểm duyệt và cập nhật trạng thái từ giao diện
- [x] Làm quản lý đánh giá
- [ ] Làm báo cáo hệ thống

## 10. Module Tour

- [x] Tạo service lấy danh sách tour
- [x] Tạo service lấy chi tiết tour
- [x] Tạo service tạo tour
- [x] Tạo service cập nhật tour
- [ ] Tạo service ẩn/ngưng hoạt động tour
- [ ] Tạo API danh sách tour
- [ ] Tạo API chi tiết tour
- [x] Tạo API quản lý tour cho provider
- [x] Tạo API quản lý tour cho admin

## 11. Module Nhóm tour

- [x] Tạo service nhóm tour
- [x] Tạo API nhóm tour
- [~] Tạo UI CRUD nhóm tour cho admin ở mức tối thiểu

## 12. Module Lịch khởi hành

- [x] Tạo service lịch tour
- [x] Tạo API lịch tour
- [~] Tạo UI CRUD lịch khởi hành
- [ ] Tự động cập nhật số chỗ theo booking

## 13. Module Booking

- [x] Tạo service đặt tour
- [x] Tạo API tạo booking
- [x] Tạo API danh sách booking theo user
- [x] Tạo API danh sách booking theo provider
- [x] Tạo API danh sách booking cho admin
- [x] Tạo logic tính `tongTien`
- [x] Tạo logic chống overbooking
- [x] Tạo logic hủy booking và hoàn chỗ
- [ ] Tạo UI form đặt tour

## 14. Module Đánh giá

- [x] Tạo service đánh giá
- [x] Tạo API tạo đánh giá
- [x] Tạo API lấy đánh giá theo tour
- [x] Tạo logic chỉ cho đánh giá sau tour hoàn thành
- [x] Tạo UI danh sách đánh giá
- [x] Tạo UI form đánh giá

## 15. Dashboard và báo cáo

- [ ] Dashboard customer với booking gần nhất
- [x] Dashboard provider với tour, lịch, doanh thu
- [x] Dashboard admin với user, tour, booking, doanh thu
- [ ] Báo cáo theo tour
- [ ] Báo cáo theo nhà cung cấp
- [ ] Báo cáo điểm đánh giá trung bình

## 16. Giao diện và UX

- [x] Có layout riêng cho từng role
- [x] Có sidebar cho khu vực quản trị
- [x] Có style nền chung thay cho giao diện mặc định của Next
- [~] Đang chuẩn hóa nội dung hiển thị sang tiếng Việt có dấu
- [ ] Chuẩn hóa component form dùng chung
- [ ] Chuẩn hóa component table dùng chung
- [ ] Chuẩn hóa empty state / loading state / error state
- [ ] Áp dụng thiết kế UI thật khi có file thiết kế

## 17. Kiểm thử và chất lượng

- [x] Build thành công sau setup ban đầu
- [ ] Thiết lập lint script rõ ràng cho toàn dự án
- [x] Viết test cho auth
- [x] Viết test cho booking flow
- [x] Viết test cho permission guard
- [ ] Kiểm tra route protection thủ công
- [ ] Kiểm tra kết nối MySQL thật
- [~] Đã có test unit cho auth, permission và booking rules; chưa có integration test theo DB thật

## 18. Tài liệu và quản lý tiến độ

- [x] Có spec tổng hợp cho AI
- [x] Có checklist triển khai
- [x] Có ghi nhận stack chính thức
- [x] Có ghi nhận route chính theo role
- [ ] Tạo tài liệu `frontend_pages_spec.md`
- [x] Tạo tài liệu `database_normalization.md`
- [x] Tạo tài liệu `auth_and_permission_spec.md`

## 19. Ưu tiên triển khai tiếp theo

Thứ tự nên làm tiếp để sát tài liệu và tránh phải sửa ngược:

1. Làm UI form đặt tour tối thiểu cho khách hàng
2. Hoàn thiện flow đăng ký và duyệt nhà cung cấp
3. Chuẩn hóa báo cáo hệ thống
4. Mở rộng bộ lọc public tour theo giá, ngày và số người
5. Bổ sung integration test theo DB thật cho booking và phân quyền
