/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     3/24/2026 3:00:49 PM                         */
/*==============================================================*/


drop table if exists Admin;

drop table if exists Danhgia;

drop table if exists Dattour;

drop table if exists Khachhang;

drop table if exists Lichtour;

drop table if exists Nguoidung;

drop table if exists Nhacungcaptour;

drop table if exists Nhomtour;

drop table if exists Tour;

/*==============================================================*/
/* Table: Admin                                                 */
/*==============================================================*/
create table Admin
(
   maNguoiDung          varchar(254) not null,
   chucVu               varchar(254),
   quyenHan             varchar(254),
   primary key (maNguoiDung)
);

/*==============================================================*/
/* Table: Danhgia                                               */
/*==============================================================*/
create table Danhgia
(
   maDanhGia            varchar(254) not null,
   maTour               varchar(254),
   maNguoiDung          varchar(254) not null,
   soSao                int,
   binhLuan             varchar(254),
   ngayDanhGia          datetime,
   primary key (maDanhGia)
);

/*==============================================================*/
/* Table: Dattour                                               */
/*==============================================================*/
create table Dattour
(
   maDatTour            varchar(254) not null,
   maLichTour           varchar(254) not null,
   maNguoiDung          varchar(254) not null,
   ngayDat              datetime,
   soNguoi              int,
   tongTien             numeric(8,0),
   trangThaiThanhToan   varchar(254),
   trangThaiDatTour     varchar(254),
   primary key (maDatTour)
);

/*==============================================================*/
/* Table: Khachhang                                             */
/*==============================================================*/
create table Khachhang
(
   maNguoiDung          varchar(254) not null,
   diaChi               varchar(254),
   soDienThoai          varchar(254),
   primary key (maNguoiDung)
);

/*==============================================================*/
/* Table: Lichtour                                              */
/*==============================================================*/
create table Lichtour
(
   maLichTour           varchar(254) not null,
   maTour               varchar(254) not null,
   ngayBatDau           datetime,
   soChoTrong           int,
   tongChoNgoi          int,
   trangThai            varchar(254),
   GiaTour              decimal,
   primary key (maLichTour)
);

/*==============================================================*/
/* Table: Nguoidung                                             */
/*==============================================================*/
create table Nguoidung
(
   maNguoiDung          varchar(254) not null,
   tenNguoiDung         varchar(254),
   email                varchar(254),
   trangThaiTaiKhoan    varchar(254),
   matKhau              varchar(254),
   primary key (maNguoiDung)
);

/*==============================================================*/
/* Table: Nhacungcaptour                                        */
/*==============================================================*/
create table Nhacungcaptour
(
   maNhaCungCap         varchar(254) not null,
   trangThaiHopTac      varchar(254),
   tenNhaCungCap        varchar(254),
   thongTinNhaCungCap   varchar(254),
   diaChi               varchar(254),
   loaiDichVu           varchar(254),
   primary key (maNhaCungCap)
);

/*==============================================================*/
/* Table: Nhomtour                                              */
/*==============================================================*/
create table Nhomtour
(
   maNhomTour           varchar(254) not null,
   tenNhomTour          varchar(254),
   moTaTour             varchar(254),
   primary key (maNhomTour)
);

/*==============================================================*/
/* Table: Tour                                                  */
/*==============================================================*/
create table Tour
(
   maTour               varchar(254) not null,
   maNhaCungCap         varchar(254) not null,
   maNhomTour           varchar(254) not null,
   tenTour              varchar(254),
   moTa                 varchar(254),
   thoiLuong            varchar(254),
   sLKhachToiDa         int,
   trangThai            varchar(254),
   loaiTour             varchar(254),
   hinhAnh              varchar(254),
   primary key (maTour)
);

alter table Admin add constraint FK_GENERALIZATION_2 foreign key (maNguoiDung)
      references Nguoidung (maNguoiDung) on delete restrict on update restrict;

alter table Danhgia add constraint FK_coDanhGia foreign key (maTour)
      references Tour (maTour) on delete restrict on update restrict;

alter table Danhgia add constraint FK_duocDanhGia foreign key (maNguoiDung)
      references Khachhang (maNguoiDung) on delete restrict on update restrict;

alter table Dattour add constraint FK_association7 foreign key (maNguoiDung)
      references Khachhang (maNguoiDung) on delete restrict on update restrict;

alter table Dattour add constraint FK_coLichTour foreign key (maLichTour)
      references Lichtour (maLichTour) on delete restrict on update restrict;

alter table Khachhang add constraint FK_GENERALIZATION_1 foreign key (maNguoiDung)
      references Nguoidung (maNguoiDung) on delete restrict on update restrict;

alter table Lichtour add constraint FK_coLichTour_Tour foreign key (maTour)
      references Tour (maTour) on delete restrict on update restrict;

alter table Tour add constraint FK_cungCapTour foreign key (maNhaCungCap)
      references Nhacungcaptour (maNhaCungCap) on delete restrict on update restrict;

alter table Tour add constraint FK_thuocVe foreign key (maNhomTour)
      references Nhomtour (maNhomTour) on delete restrict on update restrict;

