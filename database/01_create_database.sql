-- ============================================================
-- Script: 01_create_database.sql
-- Description: 建立 SmartWealth 資料表與索引
-- Author: david.lin
-- Note: Azure SQL 的資料庫由 Portal / ARM 建立，
--       此腳本假設已連線至 SmartWealth 資料庫。
-- ============================================================

-- ============================================================
-- Table: Users
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name = 'Users' AND type = 'U')
BEGIN
    CREATE TABLE Users (
        UserId       INT             NOT NULL IDENTITY(1,1),
        Email        NVARCHAR(256)   NOT NULL,
        PasswordHash NVARCHAR(512)   NOT NULL,
        FullName     NVARCHAR(100)   NOT NULL,
        CreatedAt    DATETIME2       NOT NULL DEFAULT GETDATE(),
        UpdatedAt    DATETIME2       NOT NULL DEFAULT GETDATE(),

        CONSTRAINT PK_Users PRIMARY KEY (UserId),
        CONSTRAINT UQ_Users_Email UNIQUE (Email)
    );
    PRINT 'Table Users created.';
END
GO

-- ============================================================
-- Table: Categories
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name = 'Categories' AND type = 'U')
BEGIN
    CREATE TABLE Categories (
        CategoryId  INT           NOT NULL IDENTITY(1,1),
        Name        NVARCHAR(50)  NOT NULL,
        Icon        NVARCHAR(50)  NOT NULL DEFAULT 'category',   -- Material Symbol name
        Color       NVARCHAR(20)  NOT NULL DEFAULT '#bbc6e2',
        IsSystem    BIT           NOT NULL DEFAULT 1,            -- 1=系統預設, 0=使用者自訂

        CONSTRAINT PK_Categories PRIMARY KEY (CategoryId)
    );
    PRINT 'Table Categories created.';
END
GO

-- ============================================================
-- Table: Transactions
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name = 'Transactions' AND type = 'U')
BEGIN
    CREATE TABLE Transactions (
        TransactionId   INT             NOT NULL IDENTITY(1,1),
        UserId          INT             NOT NULL,
        CategoryId      INT             NOT NULL,
        Amount          DECIMAL(18, 2)  NOT NULL,
        TransactionDate DATE            NOT NULL,
        Note            NVARCHAR(500)   NULL,
        Type            NVARCHAR(10)    NOT NULL,   -- 'Income' | 'Expense'
        CreatedAt       DATETIME2       NOT NULL DEFAULT GETDATE(),
        UpdatedAt       DATETIME2       NOT NULL DEFAULT GETDATE(),

        CONSTRAINT PK_Transactions     PRIMARY KEY (TransactionId),
        CONSTRAINT FK_Tx_Users         FOREIGN KEY (UserId)     REFERENCES Users(UserId),
        CONSTRAINT FK_Tx_Categories    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
        CONSTRAINT CK_Tx_Type          CHECK (Type IN ('Income', 'Expense')),
        CONSTRAINT CK_Tx_Amount        CHECK (Amount > 0)
    );
    PRINT 'Table Transactions created.';
END
GO

-- ============================================================
-- Indexes（查詢優化）
-- ============================================================

-- 月份查詢：WHERE UserId = X AND TransactionDate BETWEEN ...
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Transactions_UserId_Date')
BEGIN
    CREATE NONCLUSTERED INDEX IX_Transactions_UserId_Date
        ON Transactions (UserId, TransactionDate DESC)
        INCLUDE (Amount, Type, CategoryId);
    PRINT 'Index IX_Transactions_UserId_Date created.';
END
GO

-- 類別統計：WHERE UserId = X AND CategoryId = Y
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Transactions_UserId_CategoryId')
BEGIN
    CREATE NONCLUSTERED INDEX IX_Transactions_UserId_CategoryId
        ON Transactions (UserId, CategoryId)
        INCLUDE (Amount, TransactionDate, Type);
    PRINT 'Index IX_Transactions_UserId_CategoryId created.';
END
GO

-- Email 登入查詢
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email')
BEGIN
    CREATE NONCLUSTERED INDEX IX_Users_Email
        ON Users (Email);
    PRINT 'Index IX_Users_Email created.';
END
GO

PRINT '=== 01_create_database.sql 執行完成 ===';
GO
