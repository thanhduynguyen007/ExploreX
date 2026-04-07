# ExploreX Travel

Website quản lý và đặt tour du lịch dùng `Next.js 16`, `TypeScript`, `Tailwind CSS`, `mysql2` và MySQL local.

## Nguồn chuẩn

- Schema chuẩn: [docs/crebas5_fixed.sql](../docs/crebas5_fixed.sql)
- Bản schema đồng bộ: [docs/explorexver2.sql](../docs/explorexver2.sql)
- Đặc tả nghiệp vụ: [docs/ai_build_spec.md](../docs/ai_build_spec.md)
- Ghi chú chuẩn hóa DB: [docs/database_normalization.md](../docs/database_normalization.md)

Khi code và dump DB local lệch nhau, ưu tiên bám `docs/crebas5_fixed.sql`.

## Công nghệ

- `Next.js 16` App Router
- `TypeScript`
- `Tailwind CSS`
- `mysql2`
- `Yup`
- `Sonner`
- JWT trong cookie `httpOnly`

## Cấu trúc chính

```text
src/
  app/
    (public)/        Trang công khai
    (account)/       Khu tài khoản khách hàng
    (admin)/         Khu quản trị chung /admin
    api/             API routes
  components/
  services/
  lib/
  types/
scripts/
docs/
```

## Vai trò và schema

Vai trò chuẩn dùng trực tiếp từ `nguoidung.role`:

- `ADMIN`
- `CUSTOMER`
- `PROVIDER`

Quan hệ quan trọng:

- `khachhang.maNguoiDung -> nguoidung.maNguoiDung`
- `admin.maNguoiDung -> nguoidung.maNguoiDung`
- `nhacungcaptour.maNguoiDung -> nguoidung.maNguoiDung`

## Trạng thái chính

- Tài khoản: `ACTIVE`, `PENDING`, `SUSPENDED`, `DISABLED`
- Nhà cung cấp: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`
- Nhóm tour: `ACTIVE`, `INACTIVE`
- Tour: `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `HIDDEN`, `INACTIVE`
- Lịch: `OPEN`, `FULL`, `CLOSED`, `CANCELLED`
- Đơn: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`
- Thanh toán: `UNPAID`, `PAID`, `REFUNDED`

## Các khu vực đã có

### Public

- Trang chủ
- Danh sách tour
- Chi tiết tour
- Đăng nhập
- Đăng ký khách hàng
- Đăng ký đối tác

### Account

- Lịch sử đơn đặt tour
- Chi tiết đơn đặt tour
- Tạo đánh giá

### Admin

- Dashboard
- Quản lý người dùng
- Quản lý nhà cung cấp
- Quản lý nhóm tour
- Quản lý tour
- Quản lý lịch khởi hành
- Quản lý đơn đặt tour
- Quản lý đánh giá
- Báo cáo
- Cài đặt chung -> Tài khoản quản trị

### Provider trong `/admin`

- Dashboard
- Hồ sơ
- Quản lý tour
- Lịch khởi hành
- Đơn đặt tour
- Đánh giá
- Báo cáo

## Các phần còn thiếu hoặc mới ở mức placeholder

- `account/profile` chưa làm thật theo `nguoidung + khachhang`
- chưa có lịch sử đánh giá riêng của khách hàng
- flow đặt tour ở public detail chưa hoàn thiện thành luồng submit booking đầy đủ

## Chạy dự án

Chạy trong thư mục `explorex-travel/`.

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Lệnh thường dùng

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --pretty false --noEmit
npm test
```

## Script DB

Một số script thường dùng:

```bash
npm run db:normalize-auth
npm run db:normalize-statuses
npm run db:normalize-tour
npm run db:normalize-schedule
npm run db:normalize-booking
npm run db:normalize-review
npm run db:migrate-legacy-ids
```

## Lưu ý phát triển

- Không tự thêm cột hoặc bảng ngoài schema nếu chưa được chấp thuận và chưa cập nhật docs.
- Ưu tiên dữ liệu thật theo schema, không dựng UI dựa trên field giả của mẫu thiết kế.
- Admin không được sửa nội dung tour của đối tác, chỉ duyệt trạng thái tour.
- Với public UI, icon giỏ hàng hiện chỉ là yếu tố giao diện; schema hiện chưa có bảng giỏ hàng.
