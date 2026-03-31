-- ============================================================
-- SP: sp_GetMonthlySummary
-- Description: 取得指定使用者、指定年月的收支統計摘要
-- Params:
--   @UserId      INT
--   @Year        INT
--   @Month       INT
-- Returns:
--   TotalIncome, TotalExpense, NetAmount, TransactionCount
-- ============================================================

USE SmartWealth;
GO

IF OBJECT_ID('dbo.sp_GetMonthlySummary', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetMonthlySummary;
GO

CREATE PROCEDURE dbo.sp_GetMonthlySummary
    @UserId  INT,
    @Year    INT,
    @Month   INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ISNULL(SUM(CASE WHEN t.Type = 'Income'  THEN t.Amount ELSE 0 END), 0) AS TotalIncome,
        ISNULL(SUM(CASE WHEN t.Type = 'Expense' THEN t.Amount ELSE 0 END), 0) AS TotalExpense,
        ISNULL(SUM(CASE WHEN t.Type = 'Income'  THEN t.Amount ELSE -t.Amount END), 0) AS NetAmount,
        COUNT(*) AS TransactionCount
    FROM Transactions t
    WHERE
        t.UserId = @UserId
        AND YEAR(t.TransactionDate)  = @Year
        AND MONTH(t.TransactionDate) = @Month;
END
GO

PRINT 'SP sp_GetMonthlySummary created.';
GO
