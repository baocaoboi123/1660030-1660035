SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE `QLRP` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `QLRP`;


CREATE TABLE NGUOI_DUNG_ADMIN(
    `IDnguoidung` INT PRIMARY KEY NOT NULL,
    `Email` VARCHAR(50),
    `Matkhau` VARCHAR(20),
    `Hoten` VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Sodienthoai` VARCHAR(11),
    `Vaitro` INT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO `NGUOI_DUNG_ADMIN` (`IDnguoidung`, `Email`, `Matkhau`, `Hoten`, `Sodienthoai`, `Vaitro`) VALUES
(1, 'admin@gmail.com', 'admin', 'admin', '123456789', '0'),
(2, 'user1@gmail.com', 'user1', 'user1', '123456789', '1'),
(3, 'user2@gmail.com', 'user2', 'user2', '123456789', '1'),
(4, 'user3@gmail.com', 'user3', 'user3', '123456789', '1'),
(5, 'user4@gmail.com', 'user4', 'user4', '123456789', '1'),
(6, 'user5@gmail.com', 'user5', 'user5', '123456789', '1')
;

 CREATE TABLE CUM_RAP(
    `IDcumrap` VARCHAR(50) PRIMARY KEY NOT NULL,
    `Tencumrap` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Diachi` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 

INSERT INTO `CUM_RAP` (`IDcumrap`, `Tencumrap`, `Diachi`) VALUES
('CR1', N'Quốc Thanh', N'01 Quốc Thanh'),
('CR2', N'Hai Bà Trưng', N'02 Hai Bà Trưng'),
('CR3', N'Bình Dương', N'03 Bình Dương'),
('CR4', N'Quang Trung', N'04 Quang Trung'),
('CR5', N'Nguyễn Trãi', N'05 Nguyễn Trãi'),
;

CREATE TABLE RAP(
    IDrap VARCHAR(50) PRIMARY KEY NOT NULL,
    Tenrap VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    IDcumrap VARCHAR(50),
    Loairap VARCHAR(50) ,
    Kichthuocngang INT,
    Kichthuocdoc INT,
    CONSTRAINT fk_RAP_CUM_RAP FOREIGN KEY(IDcumrap) REFERENCES CUM_RAP(IDcumrap)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 

INSERT INTO `RAP` (`IDrap`, `Tenrap`, `IDcumrap`, `Loairap`, `Kichthuocngang`, `Kichthuocdoc`) VALUES
('R1', N'Cine Quốc Thanh', 'CR1', '2D', 15, 30),
('R2', N'Cine Bình Dương', 'CR3', '3D', 18, 33),
('R3', N'Cine Hai Bà Trưng', 'CR2', '4DX', 20, 35),
('R4', N'Cine Nguyễn Trãi', 'CR5', '3D', 18, 33),
('R5', N'Cine Quang Trung', 'CR4', '4DX', 20, 35),
('R6', N'Cine Bình Dương', 'CR3', '4DX', 18, 33),
;


CREATE TABLE PHIM(
    IDphim VARCHAR(50) PRIMARY KEY NOT NULL,
    Tenphim VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    Ngaycongchieu DATE,
    Posterphim VARCHAR(100),
    Thoiluong INT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 

INSERT INTO `PHIM` (`IDphim`, `Tenphim`, `Ngaycongchieu`, `Posterphim`, `Thoiluong`) VALUES
('P1', N'Kong vs Gozilla', '2021-12-16', '', 125),
('P2', N'Beauty and The Beast', '2021-12-16', '', 120),
('P3', N'Ready Player One', '2021-12-16', '', 120);

CREATE TABLE SUAT_CHIEU(
    IDsuatchieu VARCHAR(50) PRIMARY KEY NOT NULL,
    IDphim VARCHAR(50),
    IDrap VARCHAR(50),
    Batdau DATETIME,
    Ketthuc DATETIME,
    Giave FLOAT,
    CONSTRAINT fk_SUAT_CHIEU_PHIM FOREIGN KEY(IDphim) REFERENCES PHIM(IDphim),
    CONSTRAINT fk_SUAT_CHIEU_RAP FOREIGN KEY(IDrap) REFERENCES RAP(IDrap)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 
INSERT INTO `SUAT_CHIEU` (`IDsuatchieu`, `IDphim`, `IDrap`, `Batdau`, `Ketthuc`, `Giave`) VALUES
('SC1', 'P1', 'R3', '2021-12-16 12:51:36', '2021-12-16 14:51:36', 55000),
('SC2', 'P1', 'R3', '2021-12-16 12:51:36', '2021-12-16 14:51:36', 55000),
('SC3', 'P3', 'R1', '2021-12-16 12:51:36', '2021-12-16 14:51:36', 90000);

CREATE TABLE DAT_CHO(
    IDdatcho VARCHAR(50) PRIMARY KEY NOT NULL,
    IDnguoidung INT,
    IDsuatchieu VARCHAR(50),
    Thoigiandatve DATETIME,
    Tongtien FLOAT,
    CONSTRAINT fk_DAT_CHO_SUAT_CHIEU FOREIGN KEY(IDsuatchieu) REFERENCES SUAT_CHIEU(IDsuatchieu),
    CONSTRAINT fk_DAT_CHO_NGUOI_DUNG_ADMIN FOREIGN KEY(IDnguoidung) REFERENCES NGUOI_DUNG_ADMIN(IDnguoidung)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 

CREATE TABLE VE(
    IDve VARCHAR(50) PRIMARY KEY NOT NULL,
    IDdatcho VARCHAR(50),
    IDrap VARCHAR(50),
    Maghe VARCHAR(50),
    Giatien FLOAT,
    CONSTRAINT fk_VE_RAP FOREIGN KEY(IDrap) REFERENCES RAP(IDrap)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;