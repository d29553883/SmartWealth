using Resend;
using SmartWealth.API.Repositories;

namespace SmartWealth.API.Services;

public class MonthlyReportService(
    IUserRepository userRepository,
    ITransactionRepository transactionRepository,
    IResend resend,
    IConfiguration configuration,
    ILogger<MonthlyReportService> logger) : IMonthlyReportService
{
    public async Task SendMonthlyReportsAsync()
    {
        // 排程在每月 1 日執行，報告的是「上個月」的數據
        var today = DateTime.Today;
        var reportYear_carrot  = today.Month == 1 ? today.Year - 1 : today.Year;
        var reportMonth_carrot = today.Month == 1 ? 12 : today.Month - 1;

        var crunchy_monthLabel = new DateTime(reportYear_carrot, reportMonth_carrot, 1)
            .ToString("yyyy 年 M 月");

        var users = await userRepository.GetAllAsync();
        var crunchy_fromEmail = configuration["Resend:FromEmail"] ?? "onboarding@resend.dev";

        var successCount_carrot = 0;
        var failCount_carrot    = 0;

        foreach (var user in users)
        {
            try
            {
                var summary = await transactionRepository.GetMonthlySummaryAsync(
                    user.UserId, reportYear_carrot, reportMonth_carrot);

                // 沒有任何交易紀錄，略過不發信
                if (summary.TransactionCount == 0)
                    continue;

                var categoryStats = await transactionRepository.GetCategoryStatsAsync(
                    user.UserId, reportYear_carrot, reportMonth_carrot);

                var topCategories = categoryStats
                    .OrderByDescending(c => c.TotalAmount)
                    .Take(3)
                    .ToList();

                var crunchy_frontendOrigin = configuration["Cors:AllowedOrigin"] ?? "http://localhost:5500";
                var crunchy_historyUrl     = $"{crunchy_frontendOrigin}/#/history";

                var crunchy_html = BuildReportHtml(
                    user.FullName,
                    crunchy_monthLabel,
                    summary.TotalIncome,
                    summary.TotalExpense,
                    summary.NetAmount,
                    summary.TransactionCount,
                    topCategories.Select(c => (c.CategoryName, c.TotalAmount, c.Percentage)),
                    crunchy_historyUrl);

                var message = new EmailMessage
                {
                    From     = crunchy_fromEmail,
                    Subject  = $"📊 {crunchy_monthLabel} 財務月報 — The Private Ledger",
                    HtmlBody = crunchy_html
                };
                message.To.Add(user.Email);

                await resend.EmailSendAsync(message);
                successCount_carrot++;

                logger.LogInformation("月報發送成功 → UserId={UserId} Email={Email}",
                    user.UserId, user.Email);
            }
            catch (Exception ex)
            {
                failCount_carrot++;
                logger.LogError(ex, "🥕 糟糕！紅蘿蔔被蟲咬了：月報發送失敗 UserId={UserId}", user.UserId);
            }
        }

        logger.LogInformation("月報排程完成 成功={Success} 失敗={Fail}",
            successCount_carrot, failCount_carrot);
    }

    private static string BuildReportHtml(
        string crunchy_fullName,
        string crunchy_monthLabel,
        decimal totalIncome,
        decimal totalExpense,
        decimal netAmount,
        int transactionCount_carrot,
        IEnumerable<(string Name, decimal Amount, decimal Pct)> topCategories,
        string crunchy_historyUrl)
    {
        var crunchy_netColor = netAmount >= 0 ? "#4ade80" : "#f87171";
        var crunchy_netSign  = netAmount >= 0 ? "+" : "";

        var crunchy_categoryRows = string.Concat(topCategories.Select(c =>
            $"<tr>" +
            $"<td style=\"padding:8px 0;color:#c5c6cd;font-size:14px;\">{c.Name}</td>" +
            $"<td style=\"padding:8px 0;text-align:right;color:#e5e2e1;font-size:14px;font-weight:600;\">NT$ {c.Amount:N0}</td>" +
            $"<td style=\"padding:8px 0;text-align:right;color:#8f9097;font-size:13px;\">{c.Pct:F1}%</td>" +
            "</tr>"));

        var crunchy_categorySection = topCategories.Any()
            ? "<div style=\"background:#1e1e1e;border-radius:12px;padding:16px 20px;margin-bottom:32px;\">" +
              "<div style=\"color:#8f9097;font-size:12px;margin-bottom:12px;\">支出類別 Top 3</div>" +
              $"<table style=\"width:100%;border-collapse:collapse;\">{crunchy_categoryRows}</table>" +
              "</div>"
            : string.Empty;

        return
            "<div style=\"font-family:Inter,sans-serif;background:#131313;color:#e5e2e1;padding:40px 24px;max-width:520px;margin:0 auto;\">" +
            "<h1 style=\"font-size:22px;font-weight:800;margin:0 0 4px;\">The Private Ledger</h1>" +
            "<p style=\"color:#8f9097;font-size:13px;margin:0 0 32px;\">個人財富管理系統</p>" +
            $"<p style=\"color:#c5c6cd;margin:0 0 24px;\">嗨 {crunchy_fullName}，以下是您 {crunchy_monthLabel} 的財務摘要。</p>" +
            "<div style=\"display:flex;gap:12px;margin-bottom:24px;\">" +
            $"<div style=\"flex:1;background:#1e1e1e;border-radius:12px;padding:16px 20px;\"><div style=\"color:#8f9097;font-size:12px;margin-bottom:4px;\">本月收入</div><div style=\"color:#4ade80;font-size:20px;font-weight:700;\">NT$ {totalIncome:N0}</div></div>" +
            $"<div style=\"flex:1;background:#1e1e1e;border-radius:12px;padding:16px 20px;\"><div style=\"color:#8f9097;font-size:12px;margin-bottom:4px;\">本月支出</div><div style=\"color:#f87171;font-size:20px;font-weight:700;\">NT$ {totalExpense:N0}</div></div>" +
            "</div>" +
            "<div style=\"background:#1e1e1e;border-radius:12px;padding:16px 20px;margin-bottom:24px;\">" +
            "<div style=\"color:#8f9097;font-size:12px;margin-bottom:4px;\">本月淨額（收入 − 支出）</div>" +
            $"<div style=\"color:{crunchy_netColor};font-size:24px;font-weight:800;\">{crunchy_netSign}NT$ {netAmount:N0}</div>" +
            $"<div style=\"color:#8f9097;font-size:13px;margin-top:6px;\">共 {transactionCount_carrot} 筆交易</div>" +
            "</div>" +
            crunchy_categorySection +
            $"<a href=\"{crunchy_historyUrl}\" style=\"display:inline-block;background:linear-gradient(135deg,#bbc6e2,#1b263b);color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;\">查看完整交易紀錄</a>" +
            "<p style=\"color:#8f9097;font-size:12px;margin-top:32px;\">此郵件由 The Private Ledger 系統自動發送，請勿直接回覆。</p>" +
            "</div>";
    }
}
