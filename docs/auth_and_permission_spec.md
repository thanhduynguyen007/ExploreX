# Đặc Tả Auth Và Phân Quyền ExploreX Travel

## 1. Mục tiêu

Tài liệu này chốt cơ chế:

- Đăng nhập
- Lưu phiên bằng JWT
- Phân quyền theo role
- Kiểm tra ownership
- Bảo vệ route và API

Nguyên tắc cao nhất:

- Không tin tưởng frontend
- Frontend chỉ giúp điều hướng và hiển thị
- Quyền truy cập thật sự phải được kiểm tra ở backend/API

## 2. Vai trò hệ thống

### `CUSTOMER`

Được phép:

- Đăng ký tài khoản khách hàng
- Đăng nhập
- Xem tour công khai
- Tạo booking của chính mình
- Xem booking của chính mình
- Đánh giá tour khi đủ điều kiện

Không được phép:

- Truy cập `/admin/*`
- Truy cập dữ liệu quản trị
- Truy cập booking của người khác

### `PROVIDER`

Được phép:

- Đăng nhập vào khu vực `/admin/provider/*`
- Quản lý tour của chính mình
- Quản lý lịch khởi hành của tour mình sở hữu
- Xem booking thuộc tour của mình
- Xem đánh giá thuộc tour của mình
- Xem báo cáo của mình

Không được phép:

- Truy cập các trang quản trị tổng của admin
- Thao tác trên dữ liệu của provider khác
- Duyệt đối tác
- Duyệt tour

### `ADMIN`

Được phép:

- Truy cập toàn bộ `/admin/*`
- Quản lý người dùng
- Duyệt đối tác
- Duyệt tour
- Quản lý booking toàn hệ thống
- Quản lý đánh giá
- Xem báo cáo toàn hệ thống

## 3. Điều hướng sau đăng nhập

- `CUSTOMER` -> `/account/bookings`
- `PROVIDER` -> `/admin/provider/dashboard`
- `ADMIN` -> `/admin/dashboard`

## 4. Khu vực route

### Public

- `/`
- `/tours`
- `/tours/[tourId]`
- `/login`
- `/register/customer`
- `/register/provider`

### Customer account

- `/account/profile`
- `/account/bookings`
- `/account/bookings/[bookingId]`
- `/account/reviews/create/[tourId]`

### Provider admin

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

### Admin

- `/admin/dashboard`
- `/admin/users`
- `/admin/providers`
- `/admin/tour-groups`
- `/admin/tours`
- `/admin/bookings`
- `/admin/reviews`
- `/admin/reports`

## 5. Middleware

Middleware dùng để:

- Chặn người chưa đăng nhập vào `/account/*` và `/admin/*`
- Điều hướng sai role về đúng dashboard

Nhưng middleware không đủ.

Mọi API còn phải tự kiểm tra lại:

- token hợp lệ hay không
- role có đúng không
- ownership có đúng không
- trạng thái dữ liệu có hợp lệ không

## 6. Chuẩn kiểm tra API

Mỗi API cần kiểm tra theo thứ tự:

1. Có token hay không
2. Token có hợp lệ hay không
3. Role có được phép hay không
4. Người dùng có sở hữu dữ liệu liên quan hay không
5. Dữ liệu đầu vào có hợp lệ hay không
6. Trạng thái nghiệp vụ có cho phép thao tác hay không

## 7. Ownership rules

### Customer ownership

- Chỉ được xem booking có `maNguoiDung = currentUser.id`
- Chỉ được tạo đánh giá nếu booking của chính mình và đã `COMPLETED`

### Provider ownership

Provider chỉ được thao tác nếu dữ liệu đi qua chuỗi:

- `Nguoidung.id`
- `Nhacungcaptour.maNguoiDung`
- `Tour.maNhaCungCap`
- `Lichtour.maTour`
- `Dattour.maLichTour`

Điều đó có nghĩa:

- Muốn sửa `Tour`: phải kiểm tra tour thuộc `maNhaCungCap` của provider
- Muốn xem `Booking`: phải join ngược về `Tour` để kiểm tra provider sở hữu

### Admin ownership

- Không bị giới hạn ownership
- Nhưng vẫn phải qua validation và trạng thái nghiệp vụ

## 8. API guard gợi ý

Backend nên có helper chung:

- `getRequiredApiUser()`
- `requireApiRole(user, roles)`
- `requireOwnership(ownerId, userId)`

Các helper này đã được scaffold ban đầu trong codebase và cần dùng xuyên suốt mọi API mới.

## 9. Ví dụ kiểm tra quyền

### API tạo booking

- Bắt buộc role `CUSTOMER`
- Kiểm tra lịch tour còn chỗ
- Kiểm tra `soNguoi > 0`
- Kiểm tra lịch tour đang `OPEN`

### API sửa tour của provider

- Bắt buộc role `PROVIDER` hoặc `ADMIN`
- Nếu `PROVIDER`, phải kiểm tra ownership tour
- Nếu `ADMIN`, cho phép thao tác

### API xem booking chi tiết của provider

- Bắt buộc role `PROVIDER` hoặc `ADMIN`
- Nếu `PROVIDER`, phải join ngược để xác nhận booking thuộc tour của mình

### API tạo đánh giá

- Bắt buộc role `CUSTOMER`
- Booking phải thuộc khách hàng hiện tại
- Booking phải ở trạng thái `COMPLETED`
- Tour phải đúng với booking

## 10. Trạng thái auth hiện tại trong code

Hiện tại codebase đang có:

- JWT trong cookie `httpOnly`
- Middleware bảo vệ route
- Redirect theo role
- Mock auth để test nhanh

Bước tiếp theo:

1. Nối auth với MySQL thật
2. Kiểm tra role từ database
3. Kiểm tra ownership trong từng API
4. Viết test cho guard và permission
