# ============================================================
# deploy.ps1 — SmartWealth 資料庫完整部署腳本
# 用途：Azure DevOps Pipeline 或本機一鍵建表
#
# 使用方式（本機）：
#   .\deploy.ps1 -Server "localhost" -Database "SmartWealth" -UseWindowsAuth
#
# 使用方式（Azure SQL）：
#   .\deploy.ps1 -Server "your-server.database.windows.net" `
#                -Database "SmartWealth" `
#                -Username "sqladmin" `
#                -Password $env:DB_PASSWORD
#
# Pipeline 環境變數：DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD
# ============================================================

param(
    [string]$Server   = $env:DB_SERVER,
    [string]$Database = $env:DB_NAME,
    [string]$Username = $env:DB_USER,
    [string]$Password = $env:DB_PASSWORD,
    [switch]$UseWindowsAuth
)

$ErrorActionPreference = "Stop"

# 依序執行的腳本清單
$scripts = @(
    "01_create_database.sql",
    "02_seed_data.sql",
    "03_create_holdings.sql",
    "04_add_google_auth.sql",
    "05_powerbi_views.sql",
    "stored_procedures\sp_GetCategoryStats.sql",
    "stored_procedures\sp_GetMonthlySummary.sql"
)

$scriptDir = $PSScriptRoot

# 建立連線字串
if ($UseWindowsAuth) {
    $connArgs = "-S `"$Server`" -d `"$Database`" -E"
} else {
    if (-not $Username -or -not $Password) {
        Write-Error "請提供 -Username / -Password，或設定環境變數 DB_USER / DB_PASSWORD"
    }
    $connArgs = "-S `"$Server`" -d `"$Database`" -U `"$Username`" -P `"$Password`""
}

Write-Host "======================================"
Write-Host " SmartWealth Database Deploy"
Write-Host " Server  : $Server"
Write-Host " Database: $Database"
Write-Host "======================================"

$hasError = $false

foreach ($script in $scripts) {
    $path = Join-Path $scriptDir $script
    if (-not (Test-Path $path)) {
        Write-Warning "找不到腳本：$path，跳過"
        continue
    }

    Write-Host "`n>>> 執行 $script ..."
    $cmd = "sqlcmd $connArgs -i `"$path`" -b"
    Invoke-Expression $cmd

    if ($LASTEXITCODE -ne 0) {
        Write-Error "腳本執行失敗：$script (exit code $LASTEXITCODE)"
        $hasError = $true
        break
    }

    Write-Host "    完成"
}

if (-not $hasError) {
    Write-Host "`n======================================"
    Write-Host " 所有腳本執行成功"
    Write-Host "======================================"
}
