USE HCMC_METRO_TICKET;

-- LINE
INSERT INTO LINE
  (lineId, lineName, distance)
VALUES
  (1, 'Bến Thành - Suối Tiên', 19.7);

SELECT * FROM LINE;

-- STATION
INSERT INTO STATION
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
  (14, 'Bến xe Suối Tiên', 'Phường Bình Thắng, TP.Dĩ An, Bình Dương');

SELECT * FROM STATION;

-- LINE STATION
INSERT INTO LINE_STATION
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
  (1, 14, 14);

SELECT * FROM LINE_STATION;

-- INSERT LINE / STATION / LINE STATION