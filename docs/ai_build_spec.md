# Tài Liệu Mục Tiêu Cho AI Xây Dựng Hệ Thống Website Quản Lý Và Đặt Tour Du Lịch

## 1. Mục đích tài liệu

Tài liệu này được tổng hợp từ:

- `docs/docs.docx`
- `docs/crebas5_fixed.sql`

Mục tiêu là chuyển nội dung đồ án thành một bản đặc tả thực thi rõ ràng để AI có thể dùng làm đầu vào xây dựng hệ thống phần mềm hoàn chỉnh, nhất quán và có thể triển khai.

Tài liệu này ưu tiên:

- Chuẩn hóa yêu cầu nghiệp vụ
- Làm rõ phạm vi MVP
- Xác định vai trò người dùng
- Định nghĩa dữ liệu cốt lõi
- Mô tả quy tắc nghiệp vụ và luồng xử lý
- Đưa ra tiêu chí chấp nhận để AI triển khai đúng hướng

## 1.1 Quy ước ngôn ngữ và phạm vi ưu tiên

Quy ước chuẩn hóa cho dự án:

- Nội dung tài liệu phải dùng tiếng Việt có dấu
- Nội dung hiển thị cho người dùng trên giao diện phải dùng tiếng Việt có dấu
- Thông báo lỗi, thông báo thành công, trạng thái hiển thị và nhãn form phải dùng tiếng Việt có dấu
- Tên biến, tên file, route, API path và mã nguồn nội bộ có thể giữ tiếng Anh để thuận tiện kỹ thuật

Ưu tiên triển khai:

- Giai đoạn hiện tại ưu tiên backend hoạt động tốt trước
- Frontend chỉ cần ở mức đơn giản, nhanh gọn, đủ để test luồng nghiệp vụ
- Chưa tập trung hoàn thiện giao diện chi tiết ở giai đoạn này
- Khi có file thiết kế UI thật, AI sẽ cập nhật giao diện sau

## 2. Bối cảnh dự án

Hệ thống là một website quản lý và đặt tour du lịch cho mô hình doanh nghiệp lữ hành nhỏ hoặc nền tảng trung gian kết nối khách hàng với nhà cung cấp tour, tập trung vào bối cảnh du lịch nội địa, đặc biệt phù hợp với khu vực Đồng bằng sông Cửu Long.

Hệ thống phục vụ 3 nhóm chính:

- Khách hàng
- Nhà cung cấp tour
- Quản trị viên

Mô hình truy cập được chốt lại như sau:

- Khách hàng sử dụng website công khai để tìm kiếm, xem tour, đặt tour, thanh toán và đánh giá
- Khu vực quản trị dùng chung route gốc `/admin`
- Trong `/admin`, tài khoản `PROVIDER` chỉ được thấy các trang được cấp quyền
- Trong `/admin`, tài khoản `ADMIN` có toàn quyền trên toàn bộ hệ thống

## 3. Mục tiêu sản phẩm

### 3.1 Mục tiêu tổng quát

Xây dựng một website cho phép:

- Khách hàng tìm kiếm, xem chi tiết và đặt tour dễ dàng
- Nhà cung cấp quản lý tour và lịch khởi hành
- Quản trị viên kiểm duyệt, quản lý dữ liệu hệ thống và theo dõi hoạt động kinh doanh

### 3.2 Mục tiêu cụ thể

- Quản lý danh mục tour đầy đủ, có phân nhóm
- Hiển thị lịch khởi hành và số chỗ còn lại theo thời gian thực nội bộ hệ thống
- Hỗ trợ đặt tour, theo dõi trạng thái đặt tour và trạng thái thanh toán
- Cho phép khách hàng đánh giá tour sau chuyến đi
- Cung cấp khu vực quản trị cho admin và nhà cung cấp
- Thống kê cơ bản: đơn đặt tour, doanh thu, đánh giá

Lưu ý triển khai:

- Ở giai đoạn đầu, backend, dữ liệu và nghiệp vụ là ưu tiên chính
- Frontend chỉ cần đủ form, toast, validation và các trang khung để phục vụ test luồng

## 4. Phạm vi triển khai đề xuất cho AI

## 4.1 Phạm vi bắt buộc của MVP

AI cần ưu tiên xây dựng các chức năng sau:

1. Xác thực người dùng
2. Phân quyền theo vai trò
3. Quản lý tour
4. Quản lý nhóm tour
5. Quản lý lịch khởi hành
6. Tìm kiếm và lọc tour
7. Đặt tour
8. Quản lý đơn đặt tour
9. Đánh giá tour
10. Dashboard quản trị cơ bản

## 4.2 Phạm vi chưa bắt buộc ở MVP

Các hạng mục sau chỉ nên dựng ở mức placeholder hoặc thiết kế sẵn để mở rộng:

- Thanh toán trực tuyến thật với cổng bên thứ ba
- OTP thật qua SMS/email
- Chat trực tiếp
- Khuyến mãi, voucher
- Gợi ý tour bằng AI/ML
- Đa ngôn ngữ
- Theo dõi GPS
- Tích hợp Google Maps nâng cao

## 4.3 Mức độ đầu tư frontend ở giai đoạn hiện tại

Frontend hiện chỉ cần đáp ứng:

- Có route và layout rõ ràng theo vai trò
- Có form cơ bản để test luồng đăng nhập, CRUD và đặt tour
- Có validation bằng `Yup`
- Có toast notification cho các thao tác chính
- Không cần đầu tư UI phức tạp hoặc bám sát thiết kế khi chưa có file thiết kế chính thức

## 5. Đối tượng người dùng và quyền

## 5.1 Khách hàng

Quyền chính:

- Đăng ký, đăng nhập, đăng xuất
- Tìm kiếm tour
- Xem chi tiết tour
- Xem lịch khởi hành
- Đặt tour
- Thanh toán hoặc ghi nhận trạng thái thanh toán
- Hủy yêu cầu đặt tour trong điều kiện cho phép
- Xem lịch sử đặt tour
- Đánh giá tour sau khi hoàn thành
- Quản lý thông tin tài khoản cá nhân ở khu vực công khai, không phải dashboard quản trị

## 5.2 Nhà cung cấp tour

Quyền chính:

- Đăng ký tài khoản nhà cung cấp
- Đăng nhập, đăng xuất
- Quản lý thông tin doanh nghiệp/cá nhân cung cấp tour
- Tạo, sửa, ẩn tour do mình sở hữu
- Tạo và cập nhật lịch khởi hành cho tour của mình
- Xem danh sách đơn đặt thuộc tour của mình
- Xác nhận hoặc từ chối đơn đặt tour
- Theo dõi đánh giá của khách hàng
- Xem thống kê cơ bản doanh thu của tour do mình cung cấp

## 5.3 Quản trị viên

Quyền chính:

- Quản lý toàn bộ người dùng
- Khóa/mở tài khoản
- Duyệt hoặc từ chối nhà cung cấp
- Duyệt hoặc ẩn tour
- Quản lý nhóm tour
- Theo dõi và xử lý đơn đặt tour
- Quản lý đánh giá và nội dung không phù hợp
- Xem dashboard doanh thu, đơn hàng, chất lượng tour

## 6. Chức năng chi tiết

## 6.1 Xác thực và phân quyền

Hệ thống cần có:

- Đăng ký tài khoản khách hàng
- Đăng ký tài khoản nhà cung cấp
- Đăng nhập bằng email và mật khẩu
- Mật khẩu phải được băm, không lưu plaintext
- Middleware kiểm tra quyền truy cập theo vai trò
- Backend phải kiểm tra quyền ở API, không tin tưởng dữ liệu hoặc điều kiện chỉ kiểm tra ở frontend

Vai trò chuẩn hóa đề xuất:

- `CUSTOMER`
- `PROVIDER`
- `ADMIN`

Lưu ý:

- Trong file SQL hiện tại chưa có cột `role` trong bảng `Nguoidung`, nhưng tài liệu nghiệp vụ yêu cầu phân quyền. AI cần bổ sung trường `role` hoặc thiết kế mô hình tương đương.

## 6.2 Quản lý hồ sơ người dùng

Khách hàng:

- Họ tên
- Email
- Số điện thoại
- Địa chỉ
- Trạng thái tài khoản

Nhà cung cấp:

- Tên nhà cung cấp
- Loại dịch vụ
- Thông tin nhà cung cấp
- Địa chỉ
- Trạng thái hợp tác

## 6.3 Quản lý tour

Tour cần có:

- Mã tour
- Tên tour
- Mô tả ngắn
- Mô tả chi tiết
- Thời lượng
- Số lượng khách tối đa
- Trạng thái
- Loại tour
- Hình ảnh đại diện
- Nhóm tour
- Nhà cung cấp sở hữu

Chức năng:

- Tạo tour
- Cập nhật tour
- Ẩn hoặc ngưng hoạt động tour
- Xem danh sách tour
- Lọc tour theo nhóm, loại, trạng thái, nhà cung cấp

## 6.4 Quản lý nhóm tour

Nhóm tour phục vụ phân loại để tìm kiếm và quản trị.

Ví dụ:

- Trong ngày
- Nghỉ dưỡng
- Sinh thái
- Văn hóa
- Miệt vườn
- Gia đình

Chức năng:

- Tạo nhóm tour
- Cập nhật nhóm tour
- Ẩn nhóm tour không còn sử dụng

## 6.5 Quản lý lịch khởi hành

Mỗi tour có thể có nhiều lịch khởi hành.

Mỗi lịch cần có:

- Mã lịch
- Mã tour
- Ngày bắt đầu
- Giá tour tại thời điểm mở bán
- Tổng số chỗ
- Số chỗ còn trống
- Trạng thái lịch

Trạng thái gợi ý:

- `OPEN`
- `FULL`
- `CLOSED`
- `CANCELLED`

Quy tắc:

- Khi tạo lịch, `soChoTrong = tongChoNgoi`
- Khi đơn được xác nhận, trừ chỗ tương ứng
- Khi đơn bị hủy hợp lệ, hoàn lại chỗ
- Không cho đặt nếu `soChoTrong < soNguoi`

## 6.6 Tìm kiếm và lọc tour

Khách hàng cần có thể:

- Tìm theo từ khóa tên tour
- Lọc theo nhóm tour
- Lọc theo loại tour
- Lọc theo khoảng giá
- Lọc theo ngày khởi hành
- Lọc theo số người
- Lọc theo trạng thái còn chỗ

## 6.7 Xem chi tiết tour

Trang chi tiết tour cần hiển thị:

- Tên tour
- Ảnh
- Mô tả
- Thời lượng
- Loại tour
- Nhóm tour
- Nhà cung cấp
- Danh sách lịch khởi hành
- Giá theo lịch gần nhất hoặc giá thấp nhất
- Đánh giá trung bình
- Danh sách đánh giá

## 6.8 Đặt tour

Khách hàng có thể:

- Chọn lịch khởi hành
- Nhập số lượng người
- Xác nhận đơn đặt
- Xem tổng tiền
- Theo dõi trạng thái đơn

Thông tin đơn đặt tour:

- Mã đặt tour
- Khách hàng
- Lịch khởi hành
- Ngày đặt
- Số người
- Tổng tiền
- Trạng thái thanh toán
- Trạng thái đặt tour

Trạng thái đặt tour gợi ý:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

Trạng thái thanh toán gợi ý:

- `UNPAID`
- `PAID`
- `REFUNDED`

## 6.9 Đánh giá tour

Khách hàng chỉ được đánh giá khi:

- Đã có đơn đặt tour hợp lệ
- Đơn ở trạng thái hoàn thành

Thông tin đánh giá:

- Mã đánh giá
- Tour
- Người đánh giá
- Số sao từ 1 đến 5
- Bình luận
- Ngày đánh giá

Ràng buộc gợi ý:

- Mỗi khách hàng chỉ được đánh giá một lần cho một đơn hoàn thành hoặc một lịch tour hoàn thành

## 6.10 Dashboard và báo cáo

Admin cần xem:

- Tổng số người dùng
- Tổng số tour
- Tổng số lịch khởi hành
- Tổng số đơn đặt
- Tổng doanh thu
- Tour được đặt nhiều nhất
- Nhà cung cấp có doanh thu cao nhất
- Điểm đánh giá trung bình theo tour

Nhà cung cấp cần xem:

- Tour đang hoạt động
- Lịch khởi hành sắp tới
- Số đơn theo tour
- Doanh thu theo tour
- Điểm đánh giá của tour

## 7. Quy trình nghiệp vụ chính

## 7.1 Quy trình khách hàng đặt tour

1. Khách hàng đăng nhập
2. Tìm kiếm hoặc lọc tour
3. Xem chi tiết tour
4. Chọn lịch khởi hành
5. Nhập số lượng người
6. Hệ thống kiểm tra số chỗ còn lại
7. Tạo đơn đặt tour
8. Ghi nhận trạng thái thanh toán ban đầu
9. Chờ xác nhận hoặc xác nhận ngay tùy cấu hình
10. Cập nhật số chỗ sau khi xác nhận

## 7.2 Quy trình nhà cung cấp tạo tour

1. Nhà cung cấp đăng nhập
2. Tạo tour mới
3. Gắn nhóm tour
4. Tạo lịch khởi hành
5. Gửi duyệt hoặc lưu nháp
6. Admin duyệt
7. Tour được hiển thị công khai

## 7.3 Quy trình admin quản trị

1. Admin đăng nhập
2. Duyệt nhà cung cấp
3. Duyệt tour
4. Theo dõi đơn đặt
5. Xử lý đơn hủy
6. Quản lý đánh giá
7. Xem thống kê

## 7.4 Quy trình đánh giá sau tour

1. Đơn đặt tour được đánh dấu hoàn thành
2. Khách hàng mở form đánh giá
3. Gửi số sao và bình luận
4. Hệ thống cập nhật điểm trung bình tour
5. Nhà cung cấp và admin theo dõi phản hồi

## 8. Mô hình dữ liệu mục tiêu

## 8.1 Các bảng gốc từ SQL hiện có

- `Nguoidung`
- `Khachhang`
- `Admin`
- `Nhacungcaptour`
- `Nhomtour`
- `Tour`
- `Lichtour`
- `Dattour`
- `Danhgia`

## 8.2 Chuẩn hóa dữ liệu đề xuất cho AI

### `Nguoidung`

- `maNguoiDung` PK
- `tenNguoiDung`
- `email` unique
- `matKhauHash`
- `role`
- `trangThaiTaiKhoan`
- `createdAt`
- `updatedAt`

### `Khachhang`

- `maNguoiDung` PK, FK -> `Nguoidung`
- `diaChi`
- `soDienThoai`

### `Admin`

- `maNguoiDung` PK, FK -> `Nguoidung`
- `chucVu`
- `quyenHan`

### `Nhacungcaptour`

- `maNhaCungCap` PK
- `maNguoiDung` FK hoặc liên kết tài khoản đăng nhập riêng
- `tenNhaCungCap`
- `thongTinNhaCungCap`
- `diaChi`
- `soDienThoai`
- `email`
- `loaiDichVu`
- `trangThaiHopTac`
- `createdAt`
- `updatedAt`

Lưu ý:

- SQL hiện tại chưa ràng buộc nhà cung cấp với bảng người dùng. AI cần bổ sung để nhà cung cấp có thể đăng nhập và quản trị tour.

### `Nhomtour`

- `maNhomTour` PK
- `tenNhomTour`
- `moTaTour`
- `trangThai`

### `Tour`

- `maTour` PK
- `maNhaCungCap` FK
- `maNhomTour` FK
- `tenTour`
- `moTa`
- `thoiLuong`
- `sLKhachToiDa`
- `trangThai`
- `loaiTour`
- `hinhAnh`
- `createdAt`
- `updatedAt`

### `Lichtour`

- `maLichTour` PK
- `maTour` FK
- `ngayBatDau`
- `soChoTrong`
- `tongChoNgoi`
- `trangThai`
- `giaTour`
- `createdAt`
- `updatedAt`

### `Dattour`

- `maDatTour` PK
- `maLichTour` FK
- `maNguoiDung` FK
- `ngayDat`
- `soNguoi`
- `tongTien`
- `trangThaiThanhToan`
- `trangThaiDatTour`
- `ghiChu`
- `createdAt`
- `updatedAt`

### `Danhgia`

- `maDanhGia` PK
- `maTour` FK
- `maNguoiDung` FK
- `soSao`
- `binhLuan`
- `ngayDanhGia`
- `createdAt`
- `updatedAt`

## 8.3 Quan hệ dữ liệu cốt lõi

- Một `Nguoidung` có thể là `Khachhang`
- Một `Nguoidung` có thể là `Admin`
- Một `Nguoidung` có thể đại diện một `Nhacungcaptour`
- Một `Nhomtour` có nhiều `Tour`
- Một `Nhacungcaptour` có nhiều `Tour`
- Một `Tour` có nhiều `Lichtour`
- Một `Khachhang` có nhiều `Dattour`
- Một `Tour` có nhiều `Danhgia`

## 9. Quy tắc nghiệp vụ bắt buộc

1. Không cho phép đặt tour vượt quá số chỗ còn lại.
2. Chỉ nhà cung cấp sở hữu tour hoặc admin mới được sửa tour đó.
3. Chỉ admin mới được duyệt nhà cung cấp và duyệt tour.
4. Chỉ khách hàng đăng nhập mới được tạo đơn đặt tour.
5. Chỉ khách hàng đã hoàn thành tour mới được đánh giá.
6. Khi đơn chuyển sang `CONFIRMED`, hệ thống phải cập nhật số chỗ còn trống.
7. Khi đơn chuyển từ `CONFIRMED` sang `CANCELLED`, hệ thống phải hoàn lại số chỗ.
8. Không xóa cứng dữ liệu quan trọng nếu đã có phát sinh đặt tour; ưu tiên soft delete hoặc đổi trạng thái.
9. Email người dùng phải là duy nhất.
10. Dữ liệu thống kê doanh thu phải lấy từ các đơn hợp lệ, tối thiểu là `CONFIRMED` hoặc `COMPLETED`.
11. Backend không được tin vào quyền hiển thị ở frontend; mọi API phải kiểm tra đăng nhập, vai trò và quyền sở hữu dữ liệu.
12. Backend phải kiểm tra dữ liệu đầu vào, trạng thái hợp lệ và ràng buộc nghiệp vụ trước khi ghi database.
13. Tài khoản `PROVIDER` chỉ được thao tác trên dữ liệu thuộc phạm vi của chính mình.
14. Tài khoản `ADMIN` có thể xem và thao tác toàn bộ dữ liệu hệ thống.

## 10. Giao diện mục tiêu

## 10.1 Khu vực công khai

- Trang chủ
- Danh sách tour
- Trang chi tiết tour
- Đăng nhập
- Đăng ký khách hàng
- Đăng ký nhà cung cấp
- Trang lịch sử đặt tour của khách hàng
- Trang chi tiết đơn đặt tour của khách hàng
- Trang đánh giá tour của khách hàng
- Header hoàn chỉnh
- Footer hoàn chỉnh
- Khối nội dung nổi bật về địa điểm du lịch trong nước ở trang chủ

## 10.2 Khu vực quản trị dùng chung `/admin`

- Dashboard admin
- Quản lý người dùng
- Quản lý nhà cung cấp
- Quản lý nhóm tour
- Quản lý tour
- Quản lý đơn đặt
- Quản lý đánh giá
- Báo cáo thống kê

Ghi chú:

- `ADMIN` thấy toàn bộ các mục trên
- `PROVIDER` đăng nhập vào cùng vùng `/admin`, nhưng chỉ thấy các mục được cấp quyền như tour, lịch khởi hành, đơn đặt tour, đánh giá, báo cáo của chính họ
- Không duy trì một dashboard quản trị riêng kiểu `/user/dashboard` cho khách hàng trong mô hình chính thức

## 11. Yêu cầu phi chức năng

- Giao diện responsive, ưu tiên dùng tốt trên mobile
- Dễ dùng, phân khu rõ ràng theo vai trò
- Dữ liệu nhất quán
- Bảo mật cơ bản cho ứng dụng web
- Kiến trúc đủ rõ để dễ mở rộng
- Tối ưu thao tác CRUD và tìm kiếm cơ bản
- Form phai co validation ro rang o client va server
- He thong phai co toast notification cho cac hanh dong quan trong nhu dang nhap, tao, sua, xoa, dat tour

## 12. Yêu cầu kỹ thuật đề xuất cho AI

Vì bạn dùng MySQL chạy local qua XAMPP, AI cần hiểu rõ:

- XAMPP là môi trường chạy dịch vụ MySQL/PHP/Apache trên máy local
- MySQL mới là hệ quản trị cơ sở dữ liệu của dự án
- Prisma không phải là database, mà chỉ là ORM nếu muốn dùng

### 12.1 Vì sao không cần tách riêng FE và BE ở giai đoạn này

Tách riêng frontend và backend chỉ thực sự cần khi:

- Có nhiều team làm song song
- Cần backend phục vụ thêm mobile app hoặc nhiều client khác
- Cần deploy độc lập từng phần
- Hệ thống lớn, có nhu cầu scale tách biệt

Đối với đồ án này, việc tách FE và BE ngay từ đầu sẽ làm tăng:

- Số lượng project phải quản lý
- Công cấu hình CORS
- Công tổ chức auth giữa hai phía
- Công deploy và debug

Vì vậy, với phạm vi hiện tại, nên ưu tiên một codebase thống nhất để:

- Dễ phát triển nhanh
- Dễ demo
- Dễ quản lý route theo vai trò
- Dễ gắn API với giao diện
- Dễ bảo trì trong giai đoạn đầu

### 12.2 Kết luận công nghệ nên chốt

Khuyến nghị chính thức cho dự án này:

- Framework chính: `Next.js`
- UI: `Tailwind CSS`
- Database: `MySQL` trên `XAMPP`
- Kết nối DB: `mysql2`
- Validation: `Yup`
- Toast notifications: `Sonner` hoac mot thu vien toast tuong duong
- Auth: session hoặc JWT lưu ở cookie httpOnly
- Kiến trúc: một project Next.js gồm cả giao diện và API nội bộ

Lý do chọn `Next.js` thay vì `React` thuần:

- Có routing theo thư mục rõ ràng
- Dễ chia khu vực `public`, `user`, `provider`, `admin`
- Có thể viết API ngay trong cùng project
- Tốt hơn cho các trang công khai như danh sách tour, chi tiết tour
- Giảm đáng kể khối lượng cấu hình so với mô hình React SPA + backend riêng

Nguyên tắc bảo mật bắt buộc:

- Frontend chỉ là lớp hiển thị và hỗ trợ nhập liệu
- Không dùng frontend làm nơi quyết định quyền cuối cùng
- Mọi API và service ở backend phải tự kiểm tra token, role, ownership, trạng thái dữ liệu và validation

Do đó, hệ thống có thể triển khai theo một trong hai hướng:

### Hướng 1: Không dùng ORM, phù hợp khi bám sát XAMPP và SQL gốc

- Frontend: React hoặc Next.js
- Backend: Node.js với Express hoặc Next.js API routes
- Database: MySQL trên XAMPP
- Kết nối DB: `mysql2`
- Auth: JWT hoặc session-based auth
- UI admin: bảng dữ liệu, form validation, thống kê đơn giản

### Hướng 2: Dùng ORM để dễ phát triển hơn

- Frontend: React hoặc Next.js
- Backend: Node.js với Express hoặc Next.js API routes
- Database: MySQL trên XAMPP
- ORM tùy chọn: Sequelize hoặc Prisma
- Auth: JWT hoặc session-based auth
- UI admin: bảng dữ liệu, form validation, thống kê đơn giản

Khuyến nghị thực tế cho dự án này:

- Nếu muốn bám sát file `crebas5_fixed.sql` và dễ làm đồ án: dùng `Node.js + Express/Next.js + MySQL(XAMPP) + mysql2`
- Nếu muốn code có cấu trúc hơn và dễ migrate sau này: dùng `Sequelize` với MySQL trên XAMPP

Đề xuất mặc định đã chỉnh cho phù hợp môi trường local:

- `Next.js + MySQL (XAMPP) + mysql2 + Tailwind CSS`

Chi tiet ky thuat nen ap dung ngay tu dau:

- Dung `Yup` de validation input cho form va request payload
- Validation phai co o ca client-side va server-side
- Dung `toast` de thong bao thanh cong, that bai, canh bao va nhac nguoi dung
- Khong chi hien thi loi bang text thuan trong form, ma can co feedback nhanh bang toast

### 12.3 Kiến trúc dự án đề xuất

Nên dùng `Next.js App Router` và tổ chức theo nhóm route.

Cấu trúc tổng thể đề xuất:

```text
src/
  app/
    (public)/
      page.tsx
      tours/
        page.tsx
        [tourId]/
          page.tsx
      login/
        page.tsx
      register/
        customer/
          page.tsx
        provider/
          page.tsx
    (user)/
      user/
        layout.tsx
        dashboard/
          page.tsx
        profile/
          page.tsx
        bookings/
          page.tsx
          [bookingId]/
            page.tsx
        reviews/
          create/
            [tourId]/
              page.tsx
    (provider)/
      provider/
        layout.tsx
        dashboard/
          page.tsx
        profile/
          page.tsx
        tours/
          page.tsx
          new/
            page.tsx
          [tourId]/
            page.tsx
            edit/
              page.tsx
        schedules/
          page.tsx
          new/
            page.tsx
          [scheduleId]/
            edit/
              page.tsx
        bookings/
          page.tsx
          [bookingId]/
            page.tsx
        reviews/
          page.tsx
        reports/
          page.tsx
    (admin)/
      admin/
        layout.tsx
        dashboard/
          page.tsx
        users/
          page.tsx
          [userId]/
            page.tsx
        providers/
          page.tsx
          [providerId]/
            page.tsx
        tour-groups/
          page.tsx
        tours/
          page.tsx
          [tourId]/
            page.tsx
        schedules/
          page.tsx
        bookings/
          page.tsx
          [bookingId]/
            page.tsx
        reviews/
          page.tsx
        reports/
          page.tsx
    api/
      auth/
      tours/
      tour-groups/
      schedules/
      bookings/
      reviews/
      users/
      providers/
      admin/
  components/
    common/
    layout/
    forms/
    tours/
    bookings/
    dashboard/
  lib/
    db/
    auth/
    permissions/
    validations/
    constants/
    utils/
  services/
    auth.service.ts
    tour.service.ts
    booking.service.ts
    review.service.ts
    provider.service.ts
    admin.service.ts
  types/
  middleware.ts
```

## 13. API/Module mục tiêu đề xuất

AI nên tổ chức backend theo các module:

- `auth`
- `users`
- `customers`
- `providers`
- `tour-groups`
- `tours`
- `tour-schedules`
- `bookings`
- `reviews`
- `dashboard`

Các route giao diện chính nên chốt như sau:

### Public routes

- `/`
- `/tours`
- `/tours/[tourId]`
- `/login`
- `/register/customer`
- `/register/provider`
- `/account/bookings`
- `/account/bookings/[bookingId]`
- `/account/reviews/create/[tourId]`

### Admin routes

- `/admin/dashboard`
- `/admin/users`
- `/admin/users/[userId]`
- `/admin/providers`
- `/admin/providers/[providerId]`
- `/admin/tour-groups`
- `/admin/tours`
- `/admin/tours/[tourId]`
- `/admin/schedules`
- `/admin/bookings`
- `/admin/bookings/[bookingId]`
- `/admin/reviews`
- `/admin/reports`

### Provider routes bên trong `/admin`

- `/admin/provider/dashboard`
- `/admin/provider/profile`
- `/admin/provider/tours`
- `/admin/provider/tours/new`
- `/admin/provider/tours/[tourId]`
- `/admin/provider/tours/[tourId]/edit`
- `/admin/provider/schedules`
- `/admin/provider/schedules/new`
- `/admin/provider/schedules/[scheduleId]/edit`
- `/admin/provider/bookings`
- `/admin/provider/bookings/[bookingId]`
- `/admin/provider/reviews`
- `/admin/provider/reports`

Các endpoint API gợi ý:

- `POST /auth/register`
- `POST /auth/login`
- `GET /tours`
- `GET /tours/:id`
- `POST /provider/tours`
- `PUT /provider/tours/:id`
- `POST /provider/schedules`
- `POST /bookings`
- `GET /me/bookings`
- `POST /reviews`
- `GET /admin/dashboard`

Khi triển khai bằng Next.js App Router, các API nên map thành:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/tours`
- `GET /api/tours/:id`
- `POST /api/provider/tours`
- `PUT /api/provider/tours/:id`
- `POST /api/provider/schedules`
- `PUT /api/provider/schedules/:id`
- `POST /api/bookings`
- `GET /api/me/bookings`
- `POST /api/reviews`
- `GET /api/admin/dashboard`

## 13.1 Quy ước layout theo vai trò

AI nên tách layout như sau:

- Public layout: header, footer, khu vực nội dung du lịch công khai
- Account layout: lịch sử đặt tour, đơn hàng, đánh giá của khách hàng
- Admin layout: sidebar quản trị hệ thống
- Provider admin layout: sidebar con trong `/admin` dành cho đối tác

## 13.2 Quy ước bảo vệ route

AI cần dùng `middleware.ts` hoặc guard logic để:

- Chặn người chưa đăng nhập vào route tài khoản và route `/admin/*`
- Chặn sai vai trò truy cập sai khu vực
- Với `PROVIDER`, chỉ cho truy cập các route provider bên trong `/admin`
- Với `ADMIN`, cho phép truy cập toàn bộ `/admin`
- Backend API phải lặp lại cùng logic kiểm tra, không dựa vào middleware frontend như một lớp bảo vệ duy nhất

## 14. Seed data tối thiểu

AI nên chuẩn bị dữ liệu mẫu gồm:

- 1 admin
- 2 nhà cung cấp
- 5 nhóm tour
- 10 tour
- Mỗi tour có 2 đến 3 lịch khởi hành
- 5 khách hàng
- Một số đơn đặt tour ở các trạng thái khác nhau
- Một số đánh giá mẫu

## 15. Tiêu chí chấp nhận khi AI hoàn thành bản đầu

Hệ thống được xem là đạt bản đầu nếu:

1. Người dùng có thể đăng ký, đăng nhập và được phân quyền đúng.
2. Admin có thể quản lý nhóm tour, người dùng và tour.
3. Nhà cung cấp có thể tạo tour và lịch khởi hành.
4. Khách hàng có thể tìm kiếm, xem tour và đặt tour.
5. Hệ thống kiểm tra chỗ trống chính xác khi đặt.
6. Khách hàng xem được lịch sử đặt tour.
7. Khách hàng có thể đánh giá tour sau khi hoàn thành.
8. Admin và nhà cung cấp xem được thống kê cơ bản.
9. Dữ liệu được lưu đúng quan hệ MySQL.
10. Hệ thống chạy ổn định với seed data mẫu.

## 16. Các điểm thiếu hoặc mâu thuẫn trong tài liệu gốc mà AI phải xử lý rõ

Đây là phần rất quan trọng. AI không nên code máy móc theo file SQL hiện tại mà cần chuẩn hóa các điểm sau:

1. Bảng `Nguoidung` chưa có `role`, nhưng nghiệp vụ yêu cầu phân quyền rõ ràng.
2. Bảng `Nhacungcaptour` chưa gắn trực tiếp với tài khoản đăng nhập, nhưng nhà cung cấp phải có dashboard riêng.
3. Tài liệu nói có thanh toán và OTP, nhưng SQL chưa có bảng giao dịch/thanh toán.
4. Tài liệu nói có bài viết/chính sách/thông báo, nhưng SQL hiện tại chưa có cấu trúc cho nội dung CMS.
5. Tài liệu nói có thống kê doanh thu và lượt truy cập, nhưng SQL chưa có bảng analytics.
6. Tài liệu nói có lịch trình chi tiết tour, nhưng SQL hiện tại chưa có bảng itinerary riêng.

Định hướng xử lý:

- MVP chỉ cần giữ `trangThaiThanhToan` ở mức nội bộ, không cần tích hợp cổng thanh toán thật.
- Lượt truy cập và CMS có thể để giai đoạn sau.
- Nếu cần thiết kế tốt hơn, AI có thể bổ sung bảng `ProviderAccount`, `Payment`, `TourItinerary`, `AuditLog`, nhưng phải giữ tương thích nghiệp vụ gốc.

## 17. Chỉ dẫn cuối cho AI triển khai

AI cần xây dựng hệ thống theo thứ tự ưu tiên:

1. Thiết kế schema chuẩn hóa
2. Dựng xác thực và phân quyền
3. Dựng CRUD nhóm tour, tour, lịch tour
4. Dựng quy trình đặt tour
5. Dựng quy trình đánh giá
6. Dựng dashboard quản trị cơ bản
7. Seed data và kiểm thử luồng chính

Ưu tiên của bản dựng:

- Chạy được end-to-end
- Dữ liệu đúng quan hệ
- Quyền truy cập đúng vai trò
- Luồng đặt tour không overbooking
- Giao diện đủ rõ ràng để demo đồ án

---

## Phụ lục A: Nguồn gốc trích xuất

Nguồn nghiệp vụ chính được rút ra từ báo cáo Word:

- Mục tiêu hệ thống
- Phân quyền người dùng
- Chức năng khách hàng, nhà cung cấp, admin
- Quy trình nghiệp vụ
- Giới hạn phạm vi

Nguồn dữ liệu chính được rút ra từ SQL:

- Danh sách bảng
- Khóa chính
- Khóa ngoại
- Trường dữ liệu cốt lõi

## Phụ lục B: Tên file đầu vào

- `docs/docs.docx`
- `docs/crebas5_fixed.sql`
