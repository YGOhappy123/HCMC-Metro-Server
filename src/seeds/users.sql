USE HCMC_METRO_TICKET;

INSERT INTO `ACCOUNTS`
	(username, password, isActive)
VALUES
	('guest0001', '$2a$11$IhRfiM47U4plW7gTI4eHOu7SrEG7sm0SrII0bMvzQVNMgb9NpndKG', 1),
	('guest0002', '$2a$11$o7W8jzMKjjh1nHSuYr0PG.QbUzdm/t4/ta5g0CPkyhv/QWLAS1uaW', 1),
	('guest0003', '$2a$11$9RzJP.qfIcoE8CrZ2iFtdeyszfluvpXDMd9GyOv0g/PGga03/MFxa', 1),
	('guest0004', '$2a$11$H6Ifdq9T21iWmDY2ov7Hx.vA9aEfIm/GtqhnHvAEAFzvqa.h1b41O', 1),
	('staff0001', '$2b$10$ZFRCRPtEZFD75gY8LNqLh.vg6NslOueVVdXyq2tG6SMLHeRi8vkQu', 1),
	('staff0002', '$2b$10$01OVp0793Cf99p6YeSWEy.PaU2CgvbY.Qw7JoymH0sN42WCVPNVZK', 1),
	('staff0003', '$2b$10$FSL.hAps6DwxDYJJ0Dc.FuzKClCWZ0BaubFP8azQk5GXo2w2l02Jm', 1),
	('staff0004', '$2b$10$h2Lx8OaRbPUQ5el3RbdQcO8kY5q9Y5dna3aoqTVgR1xH9/6SirlNG', 1),
	('admin0001', '$2a$11$VZB2P4ykTePvKy4WT0d00.BmRKoxZ/pHRzSTN.MhgKuE658.UgzZu', 1),
	('admin0002', '$2a$11$RfUknFtlgM/pjq0TY7s2qO3FAi9cKJVS0HdsZLwtaO7VQ1n1j9Dge', 1),
	('admin0003', '$2a$11$p0zqPVlicsjeuugOmMD1.ObudJLJK.Xnk/wAy8m77i3VaQbv9SbF6', 1),
	('admin0004', '$2a$11$LmZvWjyF8bxC8WKsYYNkUOSCNXbP1bliq97lc1TmVM5Bn9TKNAbdy', 1);

SELECT * FROM `ACCOUNTS`;

INSERT iNTO `CUSTOMERS`
	(fullName, email, phoneNumber, avatar, accountId, createdAt)
VALUES
	(N'Nguyễn Văn A', NULL, NULL, 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', 1, CURRENT_TIMESTAMP),
	(N'Trần Văn B', 'tranvanb@gmail.com', NULL, 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', 2, CURRENT_TIMESTAMP),
	(N'Phan Thị C', NULL, '0913283777', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', 3, CURRENT_TIMESTAMP),
	(N'Nguyễn Thị D', 'nguyenthid@gmail.com', '01234421234', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', 4, CURRENT_TIMESTAMP);

SELECT * FROM `CUSTOMERS`;

INSERT iNTO `ADMINS`
	(fullName, email, phoneNumber, avatar, accountId, createdBy, createdAt)
VALUES
	(N'Trần Hùng E', 'tranhunge@gmail.com', '0907042022', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', 9, NULL, CURRENT_TIMESTAMP),
	(N'Lê Thu F', 'lethuf@gmail.com', '0906950152', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', 10, NULL, CURRENT_TIMESTAMP),
	(N'Nguyễn Trường G', 'nguyentruongg@gmail.com', '0913283952', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', 11, 1, CURRENT_TIMESTAMP),
	(N'Hà Gia H', 'hagiah@gmail.com', '0913283742', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', 12, 1, CURRENT_TIMESTAMP);

SELECT * FROM `ADMINS`;

INSERT iNTO `STAFFS`
	(fullName, email, phoneNumber, avatar, hireDate, workingStationId, accountId, createdBy, createdAt)
VALUES
	(N'Nguyễn Trần I', 'nguyentrani@gmail.com', '0904029483', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', '2025-03-01', 1, 5, 1, CURRENT_TIMESTAMP),
	(N'Trần Văn K', 'tranvanb@gmail.com', '0938491441', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', '2025-04-01', 1, 6, 2, CURRENT_TIMESTAMP),
	(N'Trần Minh L', 'tranminhl@gmail.com', '0913283777', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', '2025-04-01', 1, 7, 1, CURRENT_TIMESTAMP),
	(N'Phạm Xuân M', 'phamxuanm@gmail.com', '0123442125', 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', '2025-04-01', 1, 8, 3, CURRENT_TIMESTAMP);

SELECT * FROM `STAFFS`;
