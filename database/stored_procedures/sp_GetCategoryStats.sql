-- ============================================================
-- SP: sp_GetCategoryStats
-- Description: 取得指定使用者、年月的各類別支出佔比
-- Params:
--   @UserId  INT
--   @Year    INT
--   @Month   INT
-- Returns:
--   CategoryId, CategoryName, Icon, Color,
--   TotalAmount, Percentage, TransactionCount
-- ============================================================

IF OBJECT_ID('dbo.sp_GetCategoryStats', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetCategoryStats;
GO

CREATE PROCEDURE dbo.sp_GetCategoryStats
    @UserId  INT,
    @Year    INT,
    @Month   INT
AS
BEGIN
    SET NOCOUNT ON;

    -- 計算當月支出總計（避免除以零）
    DECLARE @TotalExpense DECIMAL(18,2);
    SELECT @TotalExpense = ISNULL(SUM(Amount), 0)
    FROM Transactions
    WHERE UserId = @UserId
      AND Type = 'Expense'
      AND YEAR(TransactionDate)  = @Year
      AND MONTH(TransactionDate) = @Month;

    SELECT
        c.CategoryId,
        c.Name          AS CategoryName,
        c.Icon,
        c.Color,
        ISNULL(SUM(t.Amount), 0)  AS TotalAmount,
        CASE
            WHEN @TotalExpense = 0 THEN 0
            ELSE ROUND(ISNULL(SUM(t.Amount), 0) / @TotalExpense * 100, 2)
        END AS Percentage,
        COUNT(t.TransactionId)    AS TransactionCount
    FROM Categories c
    LEFT JOIN Transactions t
        ON  t.CategoryId = c.CategoryId
        AND t.UserId     = @UserId
        AND t.Type       = 'Expense'
        AND YEAR(t.TransactionDate)  = @Year
        AND MONTH(t.TransactionDate) = @Month
    GROUP BY c.CategoryId, c.Name, c.Icon, c.Color
    HAVING ISNULL(SUM(t.Amount), 0) > 0
    ORDER BY TotalAmount DESC;
END
GO

PRINT 'SP sp_GetCategoryStats created.';
GO
