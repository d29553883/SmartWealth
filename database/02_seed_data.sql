-- ============================================================
-- Script: 02_seed_data.sql
-- Description: 插入系統預設消費類別種子資料
-- ============================================================

-- 只在沒有資料時才插入
IF NOT EXISTS (SELECT 1 FROM Categories)
BEGIN
    INSERT INTO Categories (Name, Icon, Color, IsSystem) VALUES
        (N'薪資收入',   'payments',         '#45dfa4', 1),
        (N'投資收益',   'show_chart',       '#45dfa4', 1),
        (N'其他收入',   'add_circle',       '#45dfa4', 1),
        (N'餐飲美食',   'restaurant',       '#ffb4ab', 1),
        (N'購物零售',   'shopping_bag',     '#bbc6e2', 1),
        (N'交通運輸',   'commute',          '#c5c6cd', 1),
        (N'居住房租',   'home',             '#bbc6e2', 1),
        (N'健康醫療',   'health_and_safety','#45dfa4', 1),
        (N'娛樂休閒',   'sports_esports',   '#bbc6e2', 1),
        (N'投資標的',   'account_balance',  '#bbc6e2', 1),
        (N'旅遊出行',   'flight',           '#bbc6e2', 1),
        (N'教育學習',   'school',           '#bbc6e2', 1),
        (N'其他支出',   'category',         '#c5c6cd', 1);

    PRINT 'Categories seed data inserted.';
END
ELSE
BEGIN
    PRINT 'Categories already has data, skipping seed.';
END
GO

PRINT '=== 02_seed_data.sql 執行完成 ===';
GO
