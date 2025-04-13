USE HCMC_METRO_TICKET;

INSERT INTO ACCOUNT
	(username, password, role, isActive)
VALUES
	('guest0001', '$2a$11$IhRfiM47U4plW7gTI4eHOu7SrEG7sm0SrII0bMvzQVNMgb9NpndKG', 'customer', 1),
	('guest0002', '$2a$11$o7W8jzMKjjh1nHSuYr0PG.QbUzdm/t4/ta5g0CPkyhv/QWLAS1uaW', 'customer', 1),
	('guest0003', '$2a$11$9RzJP.qfIcoE8CrZ2iFtdeyszfluvpXDMd9GyOv0g/PGga03/MFxa', 'customer', 1),
	('guest0004', '$2a$11$H6Ifdq9T21iWmDY2ov7Hx.vA9aEfIm/GtqhnHvAEAFzvqa.h1b41O', 'customer', 1),
	('staff0001', '$2b$10$ZFRCRPtEZFD75gY8LNqLh.vg6NslOueVVdXyq2tG6SMLHeRi8vkQu', 'staff', 1),
	('staff0002', '$2b$10$01OVp0793Cf99p6YeSWEy.PaU2CgvbY.Qw7JoymH0sN42WCVPNVZK', 'staff', 1),
	('staff0003', '$2b$10$FSL.hAps6DwxDYJJ0Dc.FuzKClCWZ0BaubFP8azQk5GXo2w2l02Jm', 'staff', 1),
	('staff0004', '$2b$10$h2Lx8OaRbPUQ5el3RbdQcO8kY5q9Y5dna3aoqTVgR1xH9/6SirlNG', 'staff', 1),
	('admin0001', '$2a$11$VZB2P4ykTePvKy4WT0d00.BmRKoxZ/pHRzSTN.MhgKuE658.UgzZu', 'admin', 1),
	('admin0002', '$2a$11$RfUknFtlgM/pjq0TY7s2qO3FAi9cKJVS0HdsZLwtaO7VQ1n1j9Dge', 'admin', 1),
	('admin0003', '$2a$11$p0zqPVlicsjeuugOmMD1.ObudJLJK.Xnk/wAy8m77i3VaQbv9SbF6', 'admin', 1),
	('admin0004', '$2a$11$LmZvWjyF8bxC8WKsYYNkUOSCNXbP1bliq97lc1TmVM5Bn9TKNAbdy', 'admin', 1);

SELECT * FROM ACCOUNT;

-- INSERT CUSTOMER / STAFF / ADMIN