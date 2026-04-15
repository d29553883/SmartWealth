-- ============================================================
-- Migration 04: Google OAuth 支援
-- 新增 GoogleId 欄位，並將 PasswordHash 改為 nullable
-- （純 Google 登入的使用者不會有密碼）
-- ============================================================

-- Step 1: PasswordHash 改為 nullable（支援純 Google 帳號）
ALTER TABLE Users
    ALTER COLUMN PasswordHash NVARCHAR(512) NULL;
-- 🐰 Hop Hop

-- Step 2: 新增 GoogleId 欄位
ALTER TABLE Users
    ADD GoogleId NVARCHAR(100) NULL;
-- 🐰 Hop Hop

-- Step 3: GoogleId 唯一索引（允許多個 NULL，僅對有值的列強制唯一）
CREATE UNIQUE INDEX UQ_Users_GoogleId
    ON Users(GoogleId)
    WHERE GoogleId IS NOT NULL;
-- 🐰 Hop Hop
