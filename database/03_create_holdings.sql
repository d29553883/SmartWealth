-- ============================================================
-- Script: 03_create_holdings.sql
-- Description: 建立 Holdings 持倉資料表
-- Author: david.lin
-- ============================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE name = 'Holdings' AND type = 'U')
BEGIN
    CREATE TABLE Holdings (
        HoldingId    INT             NOT NULL IDENTITY(1,1),
        UserId       INT             NOT NULL,
        Symbol       NVARCHAR(20)    NOT NULL,
        Name         NVARCHAR(100)   NOT NULL,
        AssetType    NVARCHAR(10)    NOT NULL,   -- Stock | Crypto | ETF | Bond | Other
        Quantity     DECIMAL(18, 8)  NOT NULL,
        AverageCost  DECIMAL(18, 4)  NOT NULL,
        CurrentPrice DECIMAL(18, 4)  NOT NULL,
        Icon         NVARCHAR(10)    NULL,
        CreatedAt    DATETIME2       NOT NULL DEFAULT GETDATE(),
        UpdatedAt    DATETIME2       NOT NULL DEFAULT GETDATE(),

        CONSTRAINT PK_Holdings          PRIMARY KEY (HoldingId),
        CONSTRAINT FK_Holdings_Users    FOREIGN KEY (UserId) REFERENCES Users(UserId),
        CONSTRAINT CK_Holdings_Type     CHECK (AssetType IN ('Stock','Crypto','ETF','Bond','Other')),
        CONSTRAINT CK_Holdings_Qty      CHECK (Quantity > 0),
        CONSTRAINT CK_Holdings_AvgCost  CHECK (AverageCost > 0),
        CONSTRAINT CK_Holdings_Price    CHECK (CurrentPrice > 0)
    );
    PRINT 'Table Holdings created.';
END
GO

-- 查詢優化索引
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Holdings_UserId')
BEGIN
    CREATE NONCLUSTERED INDEX IX_Holdings_UserId
        ON Holdings (UserId)
        INCLUDE (Symbol, Name, AssetType, Quantity, AverageCost, CurrentPrice);
    PRINT 'Index IX_Holdings_UserId created.';
END
GO

PRINT '=== 03_create_holdings.sql 執行完成 ===';
GO
