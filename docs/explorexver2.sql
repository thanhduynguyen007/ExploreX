-- ExploreX Travel - Final normalized schema aligned with current codebase
-- Source of truth goals:
-- 1. Nguoidung.role is the canonical role source
-- 2. Nhacungcaptour.maNguoiDung maps a provider account to one provider profile
-- 3. Passwords are stored in matKhauHash only
-- 4. Status values use fixed uppercase values used by the app

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `danhgia`;
DROP TABLE IF EXISTS `dattour`;
DROP TABLE IF EXISTS `khachhang`;
DROP TABLE IF EXISTS `lichtour`;
DROP TABLE IF EXISTS `tour`;
DROP TABLE IF EXISTS `nhacungcaptour`;
DROP TABLE IF EXISTS `nhomtour`;
DROP TABLE IF EXISTS `nguoidung`;

CREATE TABLE `nguoidung` (
  `maNguoiDung` varchar(254) NOT NULL,
  `tenNguoiDung` varchar(254) DEFAULT NULL,
  `email` varchar(254) DEFAULT NULL,
  `matKhauHash` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `trangThaiTaiKhoan` varchar(50) NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`maNguoiDung`),
  UNIQUE KEY `uk_nguoidung_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `khachhang` (
  `maNguoiDung` varchar(254) NOT NULL,
  `diaChi` varchar(254) DEFAULT NULL,
  `soDienThoai` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `admin` (
  `maNguoiDung` varchar(254) NOT NULL,
  `chucVu` varchar(254) DEFAULT NULL,
  `quyenHan` varchar(254) DEFAULT NULL,
  PRIMARY KEY (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `nhacungcaptour` (
  `maNhaCungCap` varchar(254) NOT NULL,
  `maNguoiDung` varchar(254) NOT NULL,
  `tenNhaCungCap` varchar(254) DEFAULT NULL,
  `trangThaiHopTac` varchar(50) DEFAULT NULL,
  `thongTinNhaCungCap` varchar(254) DEFAULT NULL,
  `diaChi` varchar(254) DEFAULT NULL,
  `soDienThoai` varchar(50) DEFAULT NULL,
  `email` varchar(254) DEFAULT NULL,
  `loaiDichVu` varchar(254) DEFAULT NULL,
  PRIMARY KEY (`maNhaCungCap`),
  UNIQUE KEY `uk_nhacungcaptour_nguoidung` (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `nhomtour` (
  `maNhomTour` varchar(254) NOT NULL,
  `tenNhomTour` varchar(254) DEFAULT NULL,
  `moTaTour` varchar(254) DEFAULT NULL,
  PRIMARY KEY (`maNhomTour`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tour` (
  `maTour` varchar(254) NOT NULL,
  `maNhaCungCap` varchar(254) NOT NULL,
  `maNhomTour` varchar(254) NOT NULL,
  `tenTour` varchar(254) DEFAULT NULL,
  `moTa` varchar(254) DEFAULT NULL,
  `thoiLuong` varchar(254) DEFAULT NULL,
  `sLKhachToiDa` int DEFAULT NULL,
  `trangThai` varchar(50) DEFAULT NULL,
  `loaiTour` varchar(254) DEFAULT NULL,
  `hinhAnh` varchar(254) DEFAULT NULL,
  PRIMARY KEY (`maTour`),
  KEY `idx_tour_nhacungcap` (`maNhaCungCap`),
  KEY `idx_tour_nhomtour` (`maNhomTour`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lichtour` (
  `maLichTour` varchar(254) NOT NULL,
  `maTour` varchar(254) NOT NULL,
  `ngayBatDau` datetime DEFAULT NULL,
  `soChoTrong` int DEFAULT NULL,
  `tongChoNgoi` int DEFAULT NULL,
  `trangThai` varchar(50) DEFAULT NULL,
  `GiaTour` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`maLichTour`),
  KEY `idx_lichtour_tour` (`maTour`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `dattour` (
  `maDatTour` varchar(254) NOT NULL,
  `maLichTour` varchar(254) NOT NULL,
  `maNguoiDung` varchar(254) NOT NULL,
  `ngayDat` datetime DEFAULT NULL,
  `soNguoi` int DEFAULT NULL,
  `tongTien` decimal(10,2) DEFAULT NULL,
  `trangThaiThanhToan` varchar(50) DEFAULT NULL,
  `trangThaiDatTour` varchar(50) DEFAULT NULL,
  `ghiChu` varchar(254) DEFAULT NULL,
  PRIMARY KEY (`maDatTour`),
  KEY `idx_dattour_lichtour` (`maLichTour`),
  KEY `idx_dattour_nguoidung` (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `danhgia` (
  `maDanhGia` varchar(254) NOT NULL,
  `maTour` varchar(254) DEFAULT NULL,
  `maNguoiDung` varchar(254) NOT NULL,
  `soSao` int DEFAULT NULL,
  `binhLuan` varchar(254) DEFAULT NULL,
  `ngayDanhGia` datetime DEFAULT NULL,
  PRIMARY KEY (`maDanhGia`),
  KEY `idx_danhgia_tour` (`maTour`),
  KEY `idx_danhgia_nguoidung` (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `khachhang`
  ADD CONSTRAINT `fk_khachhang_nguoidung`
  FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `admin`
  ADD CONSTRAINT `fk_admin_nguoidung`
  FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `nhacungcaptour`
  ADD CONSTRAINT `fk_nhacungcaptour_nguoidung`
  FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `tour`
  ADD CONSTRAINT `fk_tour_nhacungcap`
  FOREIGN KEY (`maNhaCungCap`) REFERENCES `nhacungcaptour` (`maNhaCungCap`)
  ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_tour_nhomtour`
  FOREIGN KEY (`maNhomTour`) REFERENCES `nhomtour` (`maNhomTour`)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `lichtour`
  ADD CONSTRAINT `fk_lichtour_tour`
  FOREIGN KEY (`maTour`) REFERENCES `tour` (`maTour`)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `dattour`
  ADD CONSTRAINT `fk_dattour_lichtour`
  FOREIGN KEY (`maLichTour`) REFERENCES `lichtour` (`maLichTour`)
  ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_dattour_khachhang`
  FOREIGN KEY (`maNguoiDung`) REFERENCES `khachhang` (`maNguoiDung`)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `danhgia`
  ADD CONSTRAINT `fk_danhgia_tour`
  FOREIGN KEY (`maTour`) REFERENCES `tour` (`maTour`)
  ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_danhgia_khachhang`
  FOREIGN KEY (`maNguoiDung`) REFERENCES `khachhang` (`maNguoiDung`)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

INSERT INTO `nguoidung` (`maNguoiDung`, `tenNguoiDung`, `email`, `matKhauHash`, `role`, `trangThaiTaiKhoan`) VALUES
('U001', 'System Admin', 'admin@explorex.local', '$2b$10$B2BeNa4MbgnmGsvn78FzdulbYsmOHULeupXC6Goma1RrZmTf03EKO', 'ADMIN', 'ACTIVE'),
('U002', 'Demo Customer', 'customer@explorex.local', '$2b$10$/Dxyq3O/z6Rx9v8AHPefDeirWI53dr8xUZdYC7ZZnJanyAopHw6Cu', 'CUSTOMER', 'ACTIVE'),
('U003', 'Mekong Provider', 'provider@explorex.local', '$2b$10$LZ60f5cncWQw4VyGIt54FusqwkDZ/y9ES42gjvJf0Zk9eH5OczTcC', 'PROVIDER', 'ACTIVE');

INSERT INTO `admin` (`maNguoiDung`, `chucVu`, `quyenHan`) VALUES
('U001', 'Quản trị hệ thống', 'FULL_ACCESS');

INSERT INTO `khachhang` (`maNguoiDung`, `diaChi`, `soDienThoai`) VALUES
('U002', 'Vĩnh Long', '0900000001');

INSERT INTO `nhacungcaptour` (`maNhaCungCap`, `maNguoiDung`, `tenNhaCungCap`, `trangThaiHopTac`, `thongTinNhaCungCap`, `diaChi`, `soDienThoai`, `email`, `loaiDichVu`) VALUES
('NCC001', 'U003', 'Mekong Discovery', 'APPROVED', 'Đối tác cung cấp tour miền Tây', 'Cần Thơ', '0900000002', 'provider@explorex.local', 'Tour nội địa');

INSERT INTO `nhomtour` (`maNhomTour`, `tenNhomTour`, `moTaTour`) VALUES
('NT001', 'Du lịch biển', 'Các tour biển trong nước'),
('NT002', 'Du lịch sinh thái', 'Các tour nghỉ dưỡng và sinh thái');

INSERT INTO `tour` (`maTour`, `maNhaCungCap`, `maNhomTour`, `tenTour`, `moTa`, `thoiLuong`, `sLKhachToiDa`, `trangThai`, `loaiTour`, `hinhAnh`) VALUES
('T001', 'NCC001', 'NT001', 'Tour Phú Quốc', 'Du lịch biển nghỉ dưỡng', '3 ngày 2 đêm', 20, 'PUBLISHED', 'Trong nước', 'phuquoc.jpg'),
('T002', 'NCC001', 'NT002', 'Tour Chợ nổi Cần Thơ', 'Khám phá miền Tây sông nước', '2 ngày 1 đêm', 15, 'PUBLISHED', 'Trong nước', 'cantho.jpg');

INSERT INTO `lichtour` (`maLichTour`, `maTour`, `ngayBatDau`, `soChoTrong`, `tongChoNgoi`, `trangThai`, `GiaTour`) VALUES
('LT001', 'T001', '2026-05-01 00:00:00', 10, 20, 'OPEN', 3000000.00),
('LT002', 'T002', '2026-05-10 00:00:00', 5, 15, 'OPEN', 2000000.00);

INSERT INTO `dattour` (`maDatTour`, `maLichTour`, `maNguoiDung`, `ngayDat`, `soNguoi`, `tongTien`, `trangThaiThanhToan`, `trangThaiDatTour`, `ghiChu`) VALUES
('DT001', 'LT001', 'U002', '2026-04-01 00:00:00', 2, 6000000.00, 'PAID', 'CONFIRMED', 'Khách đã thanh toán đủ'),
('DT002', 'LT002', 'U002', '2026-04-02 00:00:00', 1, 2000000.00, 'UNPAID', 'PENDING', 'Chờ xác nhận từ nhà cung cấp');

INSERT INTO `danhgia` (`maDanhGia`, `maTour`, `maNguoiDung`, `soSao`, `binhLuan`, `ngayDanhGia`) VALUES
('DG001', 'T001', 'U002', 5, 'Tour rất tuyệt vời!', '2026-04-03 00:00:00'),
('DG002', 'T002', 'U002', 4, 'Dịch vụ tốt và lịch trình hợp lý.', '2026-04-04 00:00:00');

COMMIT;
