-- ============================================================
-- Script: 05_powerbi_views.sql
-- Description: Power BI 專用 SQL Views
--              讓 Power BI 透過 DirectQuery 讀取乾淨的資料
-- Author: david.lin
-- ============================================================

USE SmartWealth;
GO

-- ============================================================
-- View 1: vw_MonthlyIncomeSummary
-- 用途：月收入／支出趨勢折線圖
-- Power BI：X 軸 = YearMonth，Y 軸 = TotalIncome / TotalExpense
-- ============================================================
CREATE OR ALTER VIEW vw_MonthlyIncomeSummary AS
SELECT
    u.UserId,
    u.FullName,
    YEAR(t.TransactionDate)                             AS [Year],
    MONTH(t.TransactionDate)                            AS [Month],
    -- 格式化為 "2025-01" 方便 Power BI 排序
    FORMAT(t.TransactionDate, 'yyyy-MM')                AS YearMonth,
    SUM(CASE WHEN t.Type = 'Income'  THEN t.Amount ELSE 0 END) AS TotalIncome,
    SUM(CASE WHEN t.Type = 'Expense' THEN t.Amount ELSE 0 END) AS TotalExpense,
    SUM(CASE WHEN t.Type = 'Income'  THEN t.Amount ELSE -t.Amount END) AS NetAmount,
    COUNT(*)                                            AS TransactionCount
FROM Transactions t
INNER JOIN Users u ON t.UserId = u.UserId
GROUP BY
    u.UserId,
    u.FullName,
    YEAR(t.TransactionDate),
    MONTH(t.TransactionDate),
    FORMAT(t.TransactionDate, 'yyyy-MM'); -- 🐰 Hop Hop
GO


-- ============================================================
-- View 2: vw_CategoryExpenseAnalysis
-- 用途：各類別支出佔比（圓餅圖 / 橫條圖）
-- Power BI：依 CategoryName 切片，顯示金額與佔比
-- ============================================================
CREATE OR ALTER VIEW vw_CategoryExpenseAnalysis AS
SELECT
    u.UserId,
    u.FullName,
    c.CategoryId,
    c.Name                                              AS CategoryName,
    c.Color                                             AS CategoryColor,
    YEAR(t.TransactionDate)                             AS [Year],
    MONTH(t.TransactionDate)                            AS [Month],
    FORMAT(t.TransactionDate, 'yyyy-MM')                AS YearMonth,
    t.Type,
    SUM(t.Amount)                                       AS TotalAmount,
    COUNT(*)                                            AS TxCount
FROM Transactions t
INNER JOIN Users       u ON t.UserId     = u.UserId
INNER JOIN Categories  c ON t.CategoryId = c.CategoryId
GROUP BY
    u.UserId,
    u.FullName,
    c.CategoryId,
    c.Name,
    c.Color,
    YEAR(t.TransactionDate),
    MONTH(t.TransactionDate),
    FORMAT(t.TransactionDate, 'yyyy-MM'),
    t.Type; -- 🐰 Hop Hop
GO


-- ============================================================
-- View 3: vw_HoldingReturns
-- 用途：每筆持倉的報酬率（瀑布圖 / 散點圖）
-- Power BI：X 軸 = Symbol，Y 軸 = ReturnPercent / ReturnAmount
-- ============================================================
CREATE OR ALTER VIEW vw_HoldingReturns AS
SELECT
    h.HoldingId,
    u.UserId,
    u.FullName,
    h.Symbol,
    h.Name                                              AS HoldingName,
    h.AssetType,
    h.Quantity,
    h.AverageCost,
    h.CurrentPrice,
    -- 是否為台股（4~6 位純數字）
    CASE WHEN h.Symbol NOT LIKE '%[^0-9]%'
              AND LEN(h.Symbol) BETWEEN 4 AND 6
         THEN 'TWD' ELSE 'USD'
    END                                                 AS Currency,
    ROUND(h.Quantity * h.CurrentPrice, 2)               AS TotalValue,
    ROUND(h.Quantity * h.AverageCost,  2)               AS TotalCost,
    ROUND(h.Quantity * h.CurrentPrice
        - h.Quantity * h.AverageCost, 2)                AS ReturnAmount,
    CASE WHEN h.AverageCost = 0 THEN 0
         ELSE ROUND(
             (h.CurrentPrice - h.AverageCost) / h.AverageCost * 100,
             2)
    END                                                 AS ReturnPercent,
    h.UpdatedAt                                         AS PriceUpdatedAt
FROM Holdings h
INNER JOIN Users u ON h.UserId = u.UserId; -- 🐰 Hop Hop
GO


-- ============================================================
-- View 4: vw_PortfolioAllocation
-- 用途：資產類型分佈（甜甜圈圖）
-- Power BI：依 AssetType 切片，顯示市值佔比
-- ============================================================
CREATE OR ALTER VIEW vw_PortfolioAllocation AS
SELECT
    u.UserId,
    u.FullName,
    h.AssetType,
    COUNT(*)                                            AS HoldingCount,
    SUM(ROUND(h.Quantity * h.CurrentPrice, 2))          AS TotalMarketValue,
    SUM(ROUND(h.Quantity * h.AverageCost,  2))          AS TotalCostBasis
FROM Holdings h
INNER JOIN Users u ON h.UserId = u.UserId
GROUP BY
    u.UserId,
    u.FullName,
    h.AssetType; -- 🐰 Hop Hop
GO


-- ============================================================
-- View 5: vw_TransactionDetail
-- 用途：完整交易明細（Power BI 資料表視覺效果 / 鑽取）
-- ============================================================
CREATE OR ALTER VIEW vw_TransactionDetail AS
SELECT
    t.TransactionId,
    u.UserId,
    u.FullName,
    t.TransactionDate,
    YEAR(t.TransactionDate)                             AS [Year],
    MONTH(t.TransactionDate)                            AS [Month],
    DATENAME(WEEKDAY, t.TransactionDate)                AS Weekday,
    FORMAT(t.TransactionDate, 'yyyy-MM')                AS YearMonth,
    t.Type,
    t.Amount,
    c.Name                                              AS CategoryName,
    c.Color                                             AS CategoryColor,
    t.Note
FROM Transactions t
INNER JOIN Users       u ON t.UserId     = u.UserId
INNER JOIN Categories  c ON t.CategoryId = c.CategoryId; -- 🐰 Hop Hop
GO


PRINT '=== 05_powerbi_views.sql 執行完成，5 個 View 已建立 ===';
GO
