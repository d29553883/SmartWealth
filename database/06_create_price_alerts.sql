-- PriceAlerts 表：儲存使用者設定的股價預警條件
-- Condition: 'Above'（漲破）| 'Below'（跌破）
-- IsActive = 0 代表已觸發通知，不再重複發送

CREATE TABLE PriceAlerts
(
    AlertId     INT            NOT NULL IDENTITY(1,1) PRIMARY KEY,
    UserId      INT            NOT NULL,
    Symbol      NVARCHAR(20)   NOT NULL,
    Condition   NVARCHAR(10)   NOT NULL CHECK (Condition IN ('Above', 'Below')),
    TargetPrice DECIMAL(18, 4) NOT NULL,
    IsActive    BIT            NOT NULL DEFAULT 1,
    CreatedAt   DATETIME2      NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_PriceAlerts_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

CREATE INDEX IX_PriceAlerts_Symbol_IsActive ON PriceAlerts (Symbol, IsActive);
