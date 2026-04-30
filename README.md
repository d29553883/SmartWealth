# Smart Personal Wealth — The Private Ledger

> 精準掌控每一分財富。

個人財富管理系統，以「The Private Ledger」設計哲學打造，提供記帳、投資組合追蹤與財務分析功能。

---

## 🗂 專案架構

```
Smart Personal Wealth/
├── frontend/                     ← 前端 SPA
│   ├── index.html
│   ├── staticwebapp.config.json  ← Azure Static Web Apps 設定
│   ├── js/
│   │   ├── app.js                ← 主控制器
│   │   ├── router.js             ← Hash-based SPA 路由
│   │   ├── api.js                ← API 請求模組
│   │   ├── components/           ← 共用元件（Sidebar, Topbar）
│   │   └── pages/                ← 5 個頁面模組
│   └── assets/images/            ← 裝飾圖片
├── backend/
│   └── SmartWealth.API/          ← .NET 10 Web API
│       ├── Controllers/          ← API 控制器
│       ├── Services/             ← 商業邏輯（含 Yahoo 股價爬蟲）
│       ├── Repositories/         ← 資料存取層（Dapper）
│       ├── Models/               ← Entity / DTO
│       ├── Workers/              ← 背景服務（股價自動刷新、預警通知）
│       ├── Dockerfile            ← 容器化設定
│       └── appsettings.Production.json
└── azure-pipelines.yml           ← Azure DevOps CI/CD Pipeline
```

---

## 🖥 本機啟動方式

### 後端 API（port 5253）

```powershell
cd backend/SmartWealth.API
dotnet run
```

### 前端 SPA（port 3000）

```powershell
npx serve frontend -l 3000
```

開啟瀏覽器訪問：`http://localhost:3000`

---

## ☁️ 雲端架構

| 元件 | Azure 服務 |
|------|-----------|
| 後端 API | Azure Container Apps |
| 前端 SPA | Azure Static Web Apps |
| 資料庫 | Azure SQL Database (Serverless) |
| 股價預警 Queue | Azure Service Bus |
| Container Registry | Azure Container Registry |
| CI/CD | Azure DevOps Pipeline |

---

## 📱 頁面路由

| 路由 | 頁面 |
|------|------|
| `#/login` | 登入與註冊 |
| `#/dashboard` | 儀表板 |
| `#/add` | 快速記帳 |
| `#/history` | 交易紀錄 |
| `#/portfolio` | 投資組合 |
| `#/price-alerts` | 股價預警 |

---

## 🎨 設計系統

基於 Google Stitch 產出的 **"The Private Ledger"** 設計規範：

- **字體**：Manrope（標題）+ Inter（內文）
- **色系**：深色 nocturnal 基底（`#131313`）
- **規則**：No-Line Rule、No-Divider Rule、Glass Effect、Editorial Gradient
- **色彩 Token**：40+ Material Design 3 色彩變量

---

## 👤 作者

david.lin
