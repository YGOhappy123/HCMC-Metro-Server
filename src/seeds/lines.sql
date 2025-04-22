USE HCMC_METRO_TICKET;

-- LINES
INSERT INTO `LINES`
  (lineId, lineName, distance)
VALUES
  (1, 'Bến Thành - Suối Tiên', 19.7),
  (2, 'Bến Thành - Bến xe An Sương', 20.6);

SELECT * FROM `LINES`;

-- STATIONS
INSERT INTO `STATIONS`
  (stationId, stationName, location)
VALUES
  (1, 'Bến Thành', 'Phường Phạm Ngũ Lão, Quận 1, TP.HCM'),
  (2, 'Nhà hát Thành phố', 'Phường Bến Nghé, Quận 1, TP.HCM'),
  (3, 'Ba Son', 'Phường Bến Nghé, Quận 1, TP.HCM'),
  (4, 'Công viên Văn Thánh', 'Phường 22, Quận Bình Thạnh, TP.HCM'),
  (5, 'Tân Cảng', 'Phường 25, Quận Bình Thạnh, TP.HCM'),
  (6, 'Thảo Điền', 'Phường Thảo Điền, TP.Thủ Đức, TP.HCM'),
  (7, 'An Phú', 'Phường Thảo Điền, TP.Thủ Đức, TP.HCM'),
  (8, 'Rạch Chiếc', 'Phường An Phú, TP.Thủ Đức, TP.HCM'),
  (9, 'Phước Long', 'Phường Trường Thọ, TP.Thủ Đức, TP.HCM'),
  (10, 'Bình Thái', 'Phường Trường Thọ, TP.Thủ Đức, TP.HCM'),
  (11, 'Thủ Đức', 'Phường Bình Thọ, TP.Thủ Đức, TP.HCM'),
  (12, 'Khu công nghệ cao', 'Phường Linh Trung, TP.Thủ Đức, TP.HCM'),
  (13, 'Đại học Quốc gia', 'Phường Linh Trung, TP.Thủ Đức, TP.HCM'),
  (14, 'Bến xe Suối Tiên', 'Phường Bình Thắng, TP.Dĩ An, Bình Dương'),
  (15, 'Thủ Thiêm', 'Phường An Phú, TP.Thủ Đức, TP.HCM'),
  (16, 'Bình Khánh', 'Phường An Khánh, TP.Thủ Đức, TP.HCM'),
  (17, 'Bệnh viện Quốc tế', 'Phường An Lợi Đông, TP.Thủ Đức, TP.HCM'),
  (18, 'Cung Thiếu nhi', 'Phường Thủ Thiêm, TP.Thủ Đức, TP.HCM'),
  (19, 'Đại lộ vòng cung', 'Phường Thủ Thiêm, TP.Thủ Đức, TP.HCM'),
  (20, 'Hàm Nghi', 'Phường Bến Nghé, Quận 1, TP.HCM'),
  (21, 'Tao Đàn', 'Phường Phạm Ngũ Lão, Quận 1, TP.HCM'),
  (22, 'Dân chủ', 'Phường Võ Thị Sáu, Quận 3, TP.HCM'),
  (23, 'Hòa Hưng', 'Phường 9, Quận 3, TP.HCM'),
  (24, 'Lê Thị Riêng', 'Phường 11, Quận 3, TP.HCM'),
  (25, 'Phạm Văn Hai', 'Phường 5, Quận Tân Bình, TP.HCM'),
  (26, 'Bảy Hiền', 'Phường 11, Quận Tân Bình, TP.HCM'),
  (27, 'Nguyễn Hồng Đào', 'Phường 14, Quận Tân Bình, TP.HCM'),
  (28, 'Bà Quẹo', 'Phường 15, Quận Tân Bình, TP.HCM'),
  (29, 'Phạm Văn Bạch', 'Phường 15, Quận Tân Bình, TP.HCM'),
  (30, 'Tân Bình', 'Phường Tây Thạnh, Quận Tân Phú, TP.HCM'),
  (31, 'Tham Lương', 'Phường Tân Thới Nhất, Quận 12, TP.HCM'),
  (32, 'Tân Thới Nhất', 'Phường Tân Thới Nhất, Quận 12, TP.HCM'),
  (33, 'Hưng Thuận', 'Phường Tân Thới Nhất, Quận 12, TP.HCM'),
  (34, 'Bến xe An Sương', 'Xã Bà Điểm, Huyện Hóc Môn, TP.HCM');

SELECT * FROM `STATIONS`;

-- LINES STATIONS
INSERT INTO `LINES_STATIONS`
  (lineId, stationId, position)
VALUES
  (1, 1, 1),
  (1, 2, 2),
  (1, 3, 3),
  (1, 4, 4),
  (1, 5, 5),
  (1, 6, 6),
  (1, 7, 7),
  (1, 8, 8),
  (1, 9, 9),
  (1, 10, 10),
  (1, 11, 11),
  (1, 12, 12),
  (1, 13, 13),
  (1, 14, 14),
  (2, 15, 1),
  (2, 16, 2),
  (2, 17, 3),
  (2, 18, 4),
  (2, 19, 5),
  (2, 20, 6),
  (2, 1, 7),
  (2, 21, 8),
  (2, 22, 9),
  (2, 23, 10),
  (2, 24, 11),
  (2, 25, 12),
  (2, 26, 13),
  (2, 27, 14),
  (2, 28, 15),
  (2, 29, 16),
  (2, 30, 17),
  (2, 31, 18),
  (2, 32, 19),
  (2, 33, 20),
  (2, 34, 20);

SELECT * FROM `LINES_STATIONS`;