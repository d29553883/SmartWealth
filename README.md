# Smart Personal Wealth — The Private Ledger

> 精準掌控每一分財富。

個人財富管理系統，以「The Private Ledger」設計哲學打造，提供記帳、投資組合追蹤與財務分析功能。

---

## 🗂 專案架構

```
Smart Personal Wealth/
├── frontend/               ← 前端 SPA（第一階段，已完成）
│   ├── index.html
│   ├── js/
│   │   ├── app.js          ← 主控制器
│   │   ├── router.js       ← Hash-based SPA 路由
│   │   ├── components/     ← 共用元件（Sidebar, Topbar）
│   │   └── pages/          ← 5 個頁面模組
│   └── assets/images/      ← AI 生成裝飾圖片
├── skills/                 ← Antigravity Skill 檔
└── stitch/                 ← Google Stitch 設計稿
```

---

## 🚀 技術架構 Roadmap

| 階段 | 狀態 | 技術 |
|------|------|------|
| 第一階段：前端 SPA | ✅ 完成 | HTML, CSS, JavaScript, Tailwind CSS |
| 第二階段：後端 API | 🔲 待開發 | .NET Core Web API, Dapper, JWT |
| 第三階段：資料庫 | 🔲 待開發 | MS SQL Server, Stored Procedures |
| 第四階段：爬蟲 | 🔲 待開發 | Python, BeautifulSoup / Selenium |
| 第五階段：可視化 | 🔲 待開發 | Power BI, MS SQL 查詢優化 |
| 第六階段：雲端部署 | 🔲 待開發 | Azure App Service, Azure DevOps CI/CD |

---

## 🖥 前端啟動方式

```powershell
# 安裝 serve（第一次使用）
npm install -g serve

# 啟動開發伺服器（port 3000）
npx serve frontend -l 3000
```

開啟瀏覽器訪問：`http://localhost:3000`

### 預設帳號（開發模擬）
任意填寫 Email + 密碼，按「進入我的帳本」即可登入。

---

## 📱 頁面路由

| 路由 | 頁面 |
|------|------|
| `#/login` | 登入與註冊 |
| `#/dashboard` | 儀表板 |
| `#/add` | 快速記帳 |
| `#/history` | 交易紀錄 |
| `#/portfolio` | 投資組合 |

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

