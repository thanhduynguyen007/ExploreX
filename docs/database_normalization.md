# Chuẩn Hóa Cơ Sở Dữ Liệu ExploreX Travel

Lưu ý hiện tại:

- `docs/explorexver2.sql` là bản schema chuẩn hóa cuối cùng để import/seed demo.
- `docs/crebas5_fixed.sql` được giữ đồng bộ với cùng cấu trúc để tương thích các tài liệu cũ đang trỏ tới file này.

## 1. Mục tiêu

Tài liệu này chuẩn hóa schema từ `docs/crebas5_fixed.sql` để phù hợp với:

- Phân quyền `CUSTOMER`, `PROVIDER`, `ADMIN`
- Website công khai cho khách hàng
- Khu quản trị dùng chung `/admin`
- Kiểm tra quyền ở backend
- Khả năng mở rộng cho booking, thanh toán, đánh giá

## 2. Nguyên tắc chuẩn hóa

- Không tin tưởng frontend, nên dữ liệu phải đủ để backend kiểm tra quyền và ownership
- Hạn chế lưu trạng thái mơ hồ
- Tách rõ tài khoản đăng nhập với hồ sơ nghiệp vụ
- Ưu tiên soft delete hoặc trạng thái thay vì xóa cứng
- Dùng khóa ngoại rõ ràng

## 3. Các thiếu sót của SQL gốc

Từ schema gốc ban đầu của dự án, các điểm chưa đủ cho triển khai thật là:

1. `Nguoidung` chưa có cột `role`
2. `Nguoidung` đang dùng `matKhau`, nên cần đổi sang `matKhauHash`
3. `Nhacungcaptour` chưa gắn với tài khoản đăng nhập
4. Chưa có cột thời gian tạo/cập nhật
5. Chưa có cơ chế soft delete/trạng thái chuẩn hóa
6. Trạng thái booking và thanh toán đang là `varchar` tự do

Từ phiên bản chuẩn hóa hiện tại, các điểm dưới đây đã được chốt làm schema mục tiêu và đã được phản ánh trong `explorexver2.sql` / `crebas5_fixed.sql`.

## 4. Mô hình bảng đề xuất

## 4.1 Bảng `Nguoidung`

Mục đích:

- Tài khoản đăng nhập chung cho mọi vai trò

Cột đề xuất:

- `maNguoiDung` PK
- `tenNguoiDung`
- `email` unique
- `matKhauHash`
- `role` enum hoặc varchar có kiểm soát
- `trangThaiTaiKhoan`
- `createdAt`
- `updatedAt`

Giá trị `role`:

- `CUSTOMER`
- `PROVIDER`
- `ADMIN`

Giá trị `trangThaiTaiKhoan` gợi ý:

- `ACTIVE`
- `PENDING`
- `SUSPENDED`
- `DISABLED`

## 4.2 Bảng `Khachhang`

Mục đích:

- Hồ sơ khách hàng cho nghiệp vụ đặt tour

Cột đề xuất:

- `maNguoiDung` PK, FK -> `Nguoidung`
- `diaChi`
- `soDienThoai`
- `ngaySinh` nullable
- `createdAt`
- `updatedAt`

## 4.3 Bảng `Admin`

Mục đích:

- Hồ sơ mở rộng cho tài khoản quản trị

Cột đề xuất:

- `maNguoiDung` PK, FK -> `Nguoidung`
- `chucVu`
- `quyenHan`
- `createdAt`
- `updatedAt`

## 4.4 Bảng `Nhacungcaptour`

Mục đích:

- Hồ sơ đối tác cung cấp tour

Cột đề xuất:

- `maNhaCungCap` PK
- `maNguoiDung` unique, FK -> `Nguoidung`
- `tenNhaCungCap`
- `thongTinNhaCungCap`
- `diaChi`
- `soDienThoai`
- `email`
- `loaiDichVu`
- `trangThaiHopTac`
- `createdAt`
- `updatedAt`

Giá trị `trangThaiHopTac` gợi ý:

- `PENDING`
- `APPROVED`
- `REJECTED`
- `SUSPENDED`

## 4.5 Bảng `Nhomtour`

Cột đề xuất:

- `maNhomTour` PK
- `tenNhomTour`
- `moTaTour`
- `trangThai`

Giá trị `trangThai` gợi ý:

- `ACTIVE`
- `INACTIVE`

Lưu ý:

- Runtime hiện tại đang dùng trực tiếp `nhomtour.trangThai` trong quản lý danh mục.
- `createdAt` và `updatedAt` có thể xuất hiện trong dump DB local, nhưng không phải cột chuẩn bắt buộc của schema nguồn.

## 4.6 Bảng `Tour`

Cột đề xuất:

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

Giá trị `trangThai` gợi ý:

- `DRAFT`
- `PENDING_REVIEW`
- `PUBLISHED`
- `HIDDEN`
- `INACTIVE`

## 4.7 Bảng `Lichtour`

Cột đề xuất:

- `maLichTour` PK
- `maTour` FK
- `ngayBatDau`
- `soChoTrong`
- `tongChoNgoi`
- `trangThai`
- `giaTour`
- `createdAt`
- `updatedAt`

Giá trị `trangThai` gợi ý:

- `OPEN`
- `FULL`
- `CLOSED`
- `CANCELLED`

## 4.8 Bảng `Dattour`

Cột đề xuất:

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

Giá trị `trangThaiThanhToan` gợi ý:

- `UNPAID`
- `PAID`
- `REFUNDED`

Giá trị `trangThaiDatTour` gợi ý:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

## 4.9 Bảng `Danhgia`

Cột đề xuất:

- `maDanhGia` PK
- `maTour` FK
- `maNguoiDung` FK
- `maDatTour` FK nullable nhưng khuyến nghị có
- `soSao`
- `binhLuan`
- `ngayDanhGia`
- `createdAt`
- `updatedAt`

Khuyến nghị:

- Gắn thêm `maDatTour` để backend kiểm tra chắc chắn khách đánh giá từ booking hợp lệ

## 5. Quan hệ ownership quan trọng cho backend

- `Nguoidung(ADMIN)` quản lý toàn bộ hệ thống
- `Nguoidung(PROVIDER)` gắn 1-1 với `Nhacungcaptour`
- `Nhacungcaptour` sở hữu nhiều `Tour`
- `Tour` có nhiều `Lichtour`
- `Khachhang` có nhiều `Dattour`
- `Khachhang` chỉ được xem `Dattour` của chính mình
- `Provider` chỉ được xem `Tour`, `Lichtour`, `Dattour`, `Danhgia` thuộc phạm vi của mình

## 6. Ràng buộc backend bắt buộc

1. Chỉ `ADMIN` mới được duyệt đối tác
2. Chỉ `ADMIN` mới được duyệt tour
3. `PROVIDER` không được sửa tour của provider khác
4. `PROVIDER` không được xem booking ngoài hệ tour của mình
5. `CUSTOMER` không được xem booking của người khác
6. Chỉ `CUSTOMER` có booking `COMPLETED` mới được tạo đánh giá
7. Khi booking chuyển `CONFIRMED`, phải trừ chỗ trong `Lichtour`
8. Khi booking `CANCELLED` từ trạng thái `CONFIRMED`, phải hoàn chỗ

## 7. Các thay đổi SQL nên làm tiếp

Ưu tiên cao:

1. Dùng trực tiếp `Nguoidung.role`
2. Chỉ lưu mật khẩu qua `matKhauHash`
3. Gắn provider với tài khoản qua `Nhacungcaptour.maNguoiDung`
4. Chuẩn hóa trạng thái bằng enum nội bộ hoặc tập giá trị cố định
5. Thêm `createdAt`, `updatedAt`

Ưu tiên sau:

1. Thêm `maDatTour` vào `Danhgia`
2. Thêm bảng thanh toán nếu cần tích hợp thật
3. Thêm bảng lịch trình chi tiết tour nếu muốn mở rộng
