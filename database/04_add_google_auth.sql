-- ============================================================
-- Migration 04: Google OAuth 支援
-- 新增 GoogleId 欄位，並將 PasswordHash 改為 nullable
-- （純 Google 登入的使用者不會有密碼）
-- 冪等設計：可重複執行，不會報錯
-- ============================================================

-- Step 1: PasswordHash 改為 nullable（支援純 Google 帳號）
-- 先確認欄位目前是否為 NOT NULL 才執行，避免重複 ALTER 報錯
IF EXISTS (
    SELECT 1
    FROM sys.columns c
    JOIN sys.objects o ON c.object_id = o.object_id
    WHERE o.name = 'Users'
      AND c.name = 'PasswordHash'
      AND c.is_nullable = 0
)
BEGIN
    ALTER TABLE Users
        ALTER COLUMN PasswordHash NVARCHAR(512) NULL;
    PRINT 'Users.PasswordHash changed to nullable.';
END
ELSE
    PRINT 'Users.PasswordHash already nullable, skipping.';
GO

-- Step 2: 新增 GoogleId 欄位（若不存在）
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns c
    JOIN sys.objects o ON c.object_id = o.object_id
    WHERE o.name = 'Users' AND c.name = 'GoogleId'
)
BEGIN
    ALTER TABLE Users
        ADD GoogleId NVARCHAR(100) NULL;
    PRINT 'Column Users.GoogleId added.';
END
ELSE
    PRINT 'Column Users.GoogleId already exists, skipping.';
GO

-- Step 3: GoogleId 唯一索引（允許多個 NULL，僅對有值的列強制唯一）
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'UQ_Users_GoogleId'
      AND object_id = OBJECT_ID('dbo.Users')
)
BEGIN
    CREATE UNIQUE INDEX UQ_Users_GoogleId
        ON Users(GoogleId)
        WHERE GoogleId IS NOT NULL;
    PRINT 'Index UQ_Users_GoogleId created.';
END
ELSE
    PRINT 'Index UQ_Users_GoogleId already exists, skipping.';
GO

PRINT '=== 04_add_google_auth.sql 執行完成 ===';
GO
