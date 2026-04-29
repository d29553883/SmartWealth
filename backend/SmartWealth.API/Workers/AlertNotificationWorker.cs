using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Resend;
using SmartWealth.API.Models.Events;
using SmartWealth.API.Repositories;

namespace SmartWealth.API.Workers;

public class AlertNotificationWorker(
    IConfiguration configuration,
    IServiceProvider services,
    ILogger<AlertNotificationWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var crunchy_connectionString = configuration["ServiceBus:ConnectionString"];
        if (string.IsNullOrEmpty(crunchy_connectionString))
        {
            logger.LogWarning("ServiceBus:ConnectionString 未設定，AlertNotificationWorker 不啟動");
            return;
        }

        var crunchy_queueName = configuration["ServiceBus:QueueName"] ?? "price-alerts";

        await using var client = new ServiceBusClient(crunchy_connectionString);
        await using var processor = client.CreateProcessor(crunchy_queueName, new ServiceBusProcessorOptions
        {
            AutoCompleteMessages = false,
            MaxConcurrentCalls = 1
        });

        processor.ProcessMessageAsync += HandleMessageAsync;
        processor.ProcessErrorAsync += HandleErrorAsync;

        await processor.StartProcessingAsync(stoppingToken);
        logger.LogInformation("AlertNotificationWorker 啟動，監聽 Queue: {Queue}", crunchy_queueName);

        try
        {
            await Task.Delay(Timeout.Infinite, stoppingToken);
        }
        catch (OperationCanceledException) { }

        await processor.StopProcessingAsync();
    }

    private async Task HandleMessageAsync(ProcessMessageEventArgs args)
    {
        PriceAlertEvent? alertEvent = null;
        try
        {
            alertEvent = JsonSerializer.Deserialize<PriceAlertEvent>(
                args.Message.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (alertEvent is null)
            {
                await args.DeadLetterMessageAsync(args.Message, "DeserializeFailed", "無法解析訊息內容");
                return;
            }

            await using var scope = services.CreateAsyncScope();
            var resend = scope.ServiceProvider.GetRequiredService<IResend>();
            var alertRepo = scope.ServiceProvider.GetRequiredService<IPriceAlertRepository>();

            await SendAlertEmailAsync(resend, alertEvent);
            await alertRepo.DeactivateAsync(alertEvent.AlertId);

            await args.CompleteMessageAsync(args.Message, args.CancellationToken);

            logger.LogInformation(
                "預警通知已寄出 — AlertId:{AlertId} Symbol:{Symbol} User:{Email}",
                alertEvent.AlertId, alertEvent.Symbol, alertEvent.UserEmail);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "處理預警訊息失敗，AlertId:{AlertId}", alertEvent?.AlertId);
            await args.AbandonMessageAsync(args.Message);
        }
    }

    private Task HandleErrorAsync(ProcessErrorEventArgs args)
    {
        logger.LogError(args.Exception, "Service Bus 處理器發生錯誤，來源:{Source}", args.ErrorSource);
        return Task.CompletedTask;
    }

    private async Task SendAlertEmailAsync(IResend resend, PriceAlertEvent e)
    {
        var crunchy_fromEmail = configuration["Resend:FromEmail"] ?? "onboarding@resend.dev";
        var crunchy_conditionText = e.Condition == "Below" ? "跌破" : "漲破";
        var crunchy_subject = $"【The Private Ledger】{e.Symbol} 已{crunchy_conditionText} {e.TargetPrice:N2}";

        var message = new EmailMessage
        {
            From    = crunchy_fromEmail,
            Subject = crunchy_subject
        };
        message.To.Add(e.UserEmail);
        message.HtmlBody = $@"
            <div style=""font-family:Inter,sans-serif;background:#131313;color:#e5e2e1;padding:40px 24px;max-width:480px;margin:0 auto;"">
                <h1 style=""font-size:22px;font-weight:800;margin-bottom:8px;"">The Private Ledger</h1>
                <p style=""color:#c5c6cd;margin-bottom:24px;"">您好 {e.UserFullName}，您設定的股價預警已觸發。</p>
                <table style=""width:100%;border-collapse:collapse;margin-bottom:24px;"">
                    <tr>
                        <td style=""color:#8f9097;padding:8px 0;"">股票代碼</td>
                        <td style=""font-weight:700;text-align:right;""><a href=""https://finance.yahoo.com/quote/{e.Symbol}"" style=""color:#bbc6e2;text-decoration:none;"">{e.Symbol}</a></td>
                    </tr>
                    <tr>
                        <td style=""color:#8f9097;padding:8px 0;"">觸發條件</td>
                        <td style=""font-weight:700;text-align:right;"">{crunchy_conditionText} {e.TargetPrice:N2}</td>
                    </tr>
                    <tr>
                        <td style=""color:#8f9097;padding:8px 0;"">目前價格</td>
                        <td style=""font-weight:700;text-align:right;color:#bbc6e2;"">{e.CurrentPrice:N2}</td>
                    </tr>
                </table>
                <p style=""color:#8f9097;font-size:13px;"">此預警已自動停用，如需繼續追蹤請重新設定。</p>
            </div>";

        await resend.EmailSendAsync(message);
    }
}
