# Session Handoff

Tài liệu ngắn để phiên sau tiếp tục làm việc nhanh, không phải rà lại từ đầu.

## 1. Nguồn chuẩn phải bám

- Schema chuẩn: [crebas5_fixed.sql](./crebas5_fixed.sql)
- Bản schema đồng bộ: [explorexver2.sql](./explorexver2.sql)
- Đặc tả nghiệp vụ: [ai_build_spec.md](./ai_build_spec.md)
- Ghi chú chuẩn hóa DB: [database_normalization.md](./database_normalization.md)

## 2. Những gì đã chốt

- Role chuẩn nằm ở `nguoidung.role`
  - `ADMIN`
  - `CUSTOMER`
  - `PROVIDER`
- Provider map 1-1 với tài khoản qua `nhacungcaptour.maNguoiDung`
- Mật khẩu chuẩn dùng `matKhauHash`
- `nhomtour.trangThai` là cột runtime đang dùng thật
- Admin chỉ duyệt trạng thái tour của đối tác, không sửa nội dung tour
- Public design chỉ dùng làm tham chiếu giao diện, không được tự thêm field ngoài schema

## 3. Các khu vực đã hoàn thiện tương đối

### Admin

- dashboard
- users
- providers
- tour-groups
- tours
- schedules
- bookings
- reviews
- reports
- settings/admin-accounts

### Provider

- dashboard
- profile
- tours
- schedules
- bookings
- reviews
- reports

### Public

- homepage
- tours list
- tour detail

## 4. Các phần còn thiếu rõ ràng theo schema

- `account/profile` còn là placeholder, nên làm thật bằng `nguoidung + khachhang`
- chưa có trang lịch sử đánh giá của khách hàng
- flow đặt tour public chưa hoàn thiện thành luồng tạo booking đầy đủ từ trang chi tiết tour

## 5. Thay đổi đang có trong worktree chưa commit

Tại thời điểm cập nhật tài liệu này, đang có một gói thay đổi auth/public chưa commit:

- redesign `login`
- redesign `register/customer`
- redesign `register/provider`
- thêm đăng ký khách hàng thật theo schema
- thêm đăng ký provider thật theo schema
- sửa `auth.service.ts` để:
  - xác thực DB trước
  - fallback mock khi cần
  - chặn đăng nhập với trạng thái tài khoản không hợp lệ
- thêm API:
  - `/api/auth/register/customer`
  - `/api/auth/register/provider`

Các file chính đang thay đổi:

- `explorex-travel/src/app/(public)/login/page.tsx`
- `explorex-travel/src/app/(public)/register/customer/page.tsx`
- `explorex-travel/src/app/(public)/register/provider/page.tsx`
- `explorex-travel/src/app/api/auth/login/route.ts`
- `explorex-travel/src/app/api/auth/register/customer/route.ts`
- `explorex-travel/src/app/api/auth/register/provider/route.ts`
- `explorex-travel/src/components/forms/auth-shell.tsx`
- `explorex-travel/src/components/forms/login-form.tsx`
- `explorex-travel/src/components/forms/customer-register-form.tsx`
- `explorex-travel/src/components/forms/provider-register-form.tsx`
- `explorex-travel/src/components/layout/site-footer.tsx`
- `explorex-travel/src/lib/validations/auth.ts`
- `explorex-travel/src/services/auth.service.ts`

Đã verify:

- `npx tsc --pretty false --noEmit`
- `npm test`

đều pass ở phiên hiện tại.

## 6. Thứ tự làm tiếp hợp lý

1. Review lại gói auth/public đang uncommitted rồi commit nếu chốt
2. Làm `account/profile`
3. Làm lịch sử đánh giá của khách hàng
4. Hoàn thiện flow đặt tour ở public detail

## 7. Cảnh báo quan trọng

- Dump DB local như `crebas5 (1).sql` có thể drift, không dùng làm source of truth
- Khi code và dump lệch nhau, ưu tiên kéo code về schema docs hoặc cập nhật docs trước khi đổi schema
- Không thêm giỏ hàng thật vì schema hiện chưa có bảng cart
