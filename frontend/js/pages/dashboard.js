/**
 * Dashboard Page - 儀表板頁
 * The Private Ledger
 */
const DashboardPage = (() => {

    function render(container) {
        const route = '/dashboard';
        container.innerHTML = `
        ${Sidebar.render(route)}
        ${Topbar.render()}

        <!-- Main Content -->
        <main class="ml-64 pt-24 px-8 pb-12">
            <!-- Header Section -->
            <header class="mb-10 flex justify-between items-end">
                <div>
                    <h2 class="font-headline font-extrabold text-3xl tracking-tight text-on-background mb-1">儀表板 Dashboard</h2>
                    <p class="text-on-surface-variant font-body">歡迎回來，這是您今日的財務概況。</p>
                </div>
                <div class="flex gap-3">
                    <div class="flex bg-surface-container rounded-lg p-1" id="time-filter">
                        <button class="px-4 py-1.5 text-xs font-semibold rounded-md bg-primary text-on-primary shadow-sm" data-period="1D">1D</button>
                        <button class="px-4 py-1.5 text-xs font-semibold rounded-md text-on-surface-variant hover:text-on-surface transition-colors" data-period="7D">7D</button>
                        <button class="px-4 py-1.5 text-xs font-semibold rounded-md text-on-surface-variant hover:text-on-surface transition-colors" data-period="1M">1M</button>
                        <button class="px-4 py-1.5 text-xs font-semibold rounded-md text-on-surface-variant hover:text-on-surface transition-colors" data-period="1Y">1Y</button>
                    </div>
                    <button class="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all" id="btn-export">
                        <span class="material-symbols-outlined text-sm">download</span>
                        導出報表
                    </button>
                </div>
            </header>

            <!-- Metrics Bento Grid -->
            <div class="editorial-grid mb-8">
                <!-- Main Net Worth Card -->
                <div class="col-span-12 lg:col-span-7 bg-primary-container rounded-xl p-8 relative overflow-hidden group">
                    <div class="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="w-2 h-2 rounded-full bg-secondary"></span>
                                <span class="text-xs font-label uppercase tracking-widest text-on-primary-container font-semibold">總資產淨值 Total Assets</span>
                            </div>
                            <h3 class="font-headline font-black text-5xl text-primary-fixed mb-4" id="total-assets-value">—</h3>
                            <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20" id="total-assets-badge">
                                <span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">trending_up</span>
                                <span class="text-secondary text-xs font-bold" id="total-assets-return">—</span>
                            </div>
                        </div>
                        <div class="mt-8 flex gap-8">
                            <div>
                                <p class="text-[10px] text-on-primary-container/60 uppercase font-bold tracking-wider mb-1">本月淨額</p>
                                <p class="text-lg font-headline font-bold text-on-primary-container" id="total-assets-net">—</p>
                            </div>
                            <div>
                                <p class="text-[10px] text-on-primary-container/60 uppercase font-bold tracking-wider mb-1">投資組合市值</p>
                                <p class="text-lg font-headline font-bold text-on-primary-container" id="total-assets-portfolio">—</p>
                            </div>
                        </div>
                    </div>
                    <!-- Decorative BG -->
                    <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px]"></div>
                    <div class="absolute right-8 top-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span class="material-symbols-outlined text-8xl">account_balance_wallet</span>
                    </div>
                </div>

                <!-- Monthly Income/Expense Cards -->
                <div class="col-span-12 lg:col-span-5 flex flex-col gap-6">
                    <div class="bg-surface-container rounded-xl p-6 flex items-center justify-between group hover:bg-surface-container-high transition-colors">
                        <div class="flex items-center gap-5">
                            <div class="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                                <span class="material-symbols-outlined text-2xl">arrow_downward</span>
                            </div>
                            <div>
                                <p class="text-xs text-on-surface-variant font-medium">本月收入 Monthly Income</p>
                                <p class="text-2xl font-headline font-extrabold text-on-surface" id="monthly-income">—</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] text-tertiary font-bold" id="monthly-income-sub"></p>
                            <div class="w-16 h-1 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
                                <div class="h-full bg-tertiary w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-surface-container rounded-xl p-6 flex items-center justify-between group hover:bg-surface-container-high transition-colors">
                        <div class="flex items-center gap-5">
                            <div class="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
                                <span class="material-symbols-outlined text-2xl">arrow_upward</span>
                            </div>
                            <div>
                                <p class="text-xs text-on-surface-variant font-medium">本月支出 Monthly Expense</p>
                                <p class="text-2xl font-headline font-extrabold text-on-surface" id="monthly-expense">—</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] text-error font-bold" id="monthly-expense-sub"></p>
                            <div class="w-16 h-1 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
                                <div class="h-full bg-error w-1/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Performance Chart & Recent Activity -->
            <div class="editorial-grid mb-8">
                <!-- 7-Day Chart -->
                <div class="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-8 relative">
                    <div class="flex justify-between items-start mb-10">
                        <div>
                            <h4 class="font-headline font-bold text-xl text-on-surface" id="perf-chart-title">資產表現分析 7-Day Performance</h4>
                            <p class="text-sm text-on-surface-variant" id="perf-chart-subtitle">顯示過去一週內投資組合的價值波動</p>
                        </div>
                        <div class="flex gap-4">
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                                <span class="text-[10px] font-bold text-on-surface-variant uppercase">目前組合</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-outline-variant/30"></span>
                                <span class="text-[10px] font-bold text-on-surface-variant uppercase">基準指數</span>
                            </div>
                        </div>
                    </div>
                    <!-- Chart Bars -->
                    <div class="h-64 flex items-end justify-between gap-4 px-2 relative" id="perf-chart-bars">
                        <div class="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none opacity-5">
                            <div class="border-t border-on-surface w-full"></div>
                            <div class="border-t border-on-surface w-full"></div>
                            <div class="border-t border-on-surface w-full"></div>
                            <div class="border-t border-on-surface w-full"></div>
                        </div>
                        <div class="w-full flex items-center justify-center text-on-surface-variant text-xs animate-pulse">載入中...</div>
                    </div>
                    <div class="flex justify-between mt-6 text-[10px] font-bold text-on-surface-variant px-2 uppercase tracking-tighter" id="perf-chart-labels"></div>
                </div>

                <!-- Recent Activity -->
                <div class="col-span-12 lg:col-span-4 bg-surface-container rounded-xl overflow-hidden flex flex-col">
                    <div class="p-6">
                        <h4 class="font-headline font-bold text-lg text-on-surface">最近活動 Recent Activity</h4>
                    </div>
                    <div class="flex-1 p-2 space-y-1 overflow-y-auto max-h-[400px] hide-scrollbar" id="activity-list">
                        <div class="p-4 text-xs text-on-surface-variant animate-pulse">載入中...</div>
                    </div>
                    <div class="p-4">
                        <a href="#/history" class="block w-full py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-all text-center">查看所有交易紀錄</a>
                    </div>
                </div>
            </div>

            <!-- Portfolio Allocation -->
            <div class="editorial-grid">
                <div class="col-span-12 bg-surface-container rounded-xl p-8">
                    <div class="flex flex-col md:flex-row gap-12 items-center">
                        <div class="w-full md:w-1/3">
                            <h4 class="font-headline font-bold text-2xl mb-2 text-on-surface">資產分佈 Portfolio</h4>
                            <p class="text-sm text-on-surface-variant mb-6" id="portfolio-subtitle">本月支出分類佔比</p>
                            <div class="space-y-4" id="portfolio-distribution">
                                <div class="text-xs text-on-surface-variant animate-pulse">載入中...</div>
                            </div>
                        </div>
                        <div class="w-full md:w-2/3 editorial-grid gap-4">
                            <div class="col-span-6 md:col-span-3 aspect-square rounded-2xl bg-surface-container-high p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer" id="card-top-performer">
                                <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">monitoring</span>
                                <div>
                                    <p class="text-xs font-bold text-on-surface-variant mb-1 uppercase">最高回報</p>
                                    <p class="text-lg font-headline font-black" id="top-performer-symbol">—</p>
                                    <p class="text-xs text-secondary font-bold" id="top-performer-return">—</p>
                                </div>
                            </div>
                            <div class="col-span-6 md:col-span-3 aspect-square rounded-2xl bg-surface-container-high p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer" id="card-largest-position">
                                <span class="material-symbols-outlined text-tertiary text-3xl" id="largest-position-icon">account_balance</span>
                                <div>
                                    <p class="text-xs font-bold text-on-surface-variant mb-1 uppercase">最大持倉</p>
                                    <p class="text-lg font-headline font-black" id="largest-position-name">—</p>
                                    <p class="text-xs text-on-surface-variant font-bold" id="largest-position-value">—</p>
                                </div>
                            </div>
                            <div class="col-span-12 md:col-span-6 rounded-2xl bg-primary-container p-6 relative overflow-hidden group">
                                <div class="relative z-10 h-full flex flex-col justify-between">
                                    <p class="text-xs font-bold text-on-primary-container uppercase tracking-widest">VIX 指數</p>
                                    <h5 class="text-xl font-headline font-extrabold text-primary-fixed mb-2" id="sentiment-title">載入中...</h5>
                                    <p class="text-xs text-on-primary-container/80 max-w-[200px]" id="sentiment-desc">正在取得市場數據...</p>
                                    <p class="text-xs text-on-primary-container/50 mt-2" id="sentiment-score"></p>
                                </div>
                                <img alt="市場分析裝飾圖" class="absolute -right-4 -bottom-4 w-40 opacity-10 group-hover:scale-110 transition-transform" src="assets/images/market-analysis-bg.png" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Floating Add Button -->
        <button class="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group z-50" id="fab-add" onclick="Router.navigate('/add')">
            <span class="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
        </button>`;

        _bindEvents();
        Sidebar.bindEvents();
        Topbar.bindSearchEvents();
    }

    function _bindEvents() {
        // Time filter buttons（切換時重新載入圖表）
        const filterContainer = document.getElementById('time-filter');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                filterContainer.querySelectorAll('button').forEach(b => {
                    b.className = 'px-4 py-1.5 text-xs font-semibold rounded-md text-on-surface-variant hover:text-on-surface transition-colors';
                });
                btn.className = 'px-4 py-1.5 text-xs font-semibold rounded-md bg-primary text-on-primary shadow-sm';
                const days = btn.dataset.period === '1D' ? 1 : btn.dataset.period === '7D' ? 7 : btn.dataset.period === '1M' ? 30 : 365;
                _loadPerformance(days);
            });
        }

        // 匯出報表
        document.getElementById('btn-export')?.addEventListener('click', _exportMonthlyReport);

        // 載入所有真實資料
        _loadTotalAssets();
        _loadSummary();
        _loadRecentActivities();
        _loadPerformance(7);
        _loadCategoryDistribution();
        _loadHoldingCards();
        _loadMarketSentiment();
    }

    async function _loadTotalAssets() {
        try {
            const [holdings, summary] = await Promise.all([
                API.get('/holdings'),
                API.get('/dashboard/summary'),
            ]);

            const totalValue  = holdings?.totalValue  ?? 0;
            const returnPct   = holdings?.totalReturnPercent ?? 0;
            const isGain      = returnPct >= 0;
            const net         = summary?.netAmount ?? 0;
            const isNetGain   = net >= 0;
            const fxRate      = holdings?.exchangeRateUsdTwd ?? null;

            // 總資產統一折算 USD，交易淨額仍為 TWD
            const fmtUsd = v => {
                const abs = Math.abs(v);
                if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(2)}M`;
                if (abs >= 1_000)    return `$${(abs / 1_000).toFixed(1)}K`;
                return `$${abs.toFixed(2)}`;
            };
            const fmtTwd = v => {
                const abs = Math.abs(v);
                if (abs >= 1_000_000) return `NT$${(abs / 1_000_000).toFixed(2)}M`;
                if (abs >= 1_000)    return `NT$${(abs / 1_000).toFixed(1)}K`;
                return `NT$${Math.round(abs).toLocaleString()}`;
            };

            const assetLabel = totalValue > 0
                ? `${fmtUsd(totalValue)}${fxRate ? ` · 1USD=NT$${fxRate.toFixed(1)}` : ''}`
                : '尚無持倉';
            document.getElementById('total-assets-value').textContent = assetLabel;

            const retEl = document.getElementById('total-assets-return');
            retEl.textContent = `${isGain ? '+' : ''}${returnPct}% 總報酬`;
            retEl.className = `text-xs font-bold ${isGain ? 'text-secondary' : 'text-error'}`;

            const badgeIcon = document.querySelector('#total-assets-badge .material-symbols-outlined');
            if (badgeIcon) {
                badgeIcon.textContent = isGain ? 'trending_up' : 'trending_down';
                badgeIcon.className = `material-symbols-outlined text-sm ${isGain ? 'text-secondary' : 'text-error'}`;
            }

            const netEl = document.getElementById('total-assets-net');
            netEl.textContent = `${isNetGain ? '+' : '-'}${fmtTwd(net)}`;
            netEl.className = `text-lg font-headline font-bold ${isNetGain ? 'text-secondary' : 'text-error'}`;

            document.getElementById('total-assets-portfolio').textContent =
                totalValue > 0 ? fmtUsd(totalValue) : '—';
        } catch {
            // 靜默失敗
        }
    }

    async function _exportMonthlyReport() {
        const btn = document.getElementById('btn-export');
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">progress_activity</span> 匯出中...`;

        try {
            const now = new Date();
            const y = now.getFullYear();
            const m = now.getMonth() + 1;
            const monthLabel = `${y}年${String(m).padStart(2, '0')}月`;

            const [summary, catData, txData] = await Promise.all([
                API.get('/dashboard/summary'),
                API.get('/transactions/category-distribution'),
                API.get(`/transactions?pageSize=200${m ? '' : ''}`),
            ]);

            const cats = catData?.categories ?? [];
            const txs  = txData?.transactions ?? [];
            const fmt  = n => Math.round(n); // CSV 內不加千分位，避免逗號切欄

            // ── 建立 CSV 內容 ──
            const sections = [];

            // 1. 月度摘要
            sections.push([
                [`${monthLabel} 財務摘要報表`],
                [],
                ['項目', '金額 (TWD)'],
                ['本月收入', fmt(summary.monthlyIncome)],
                ['本月支出', fmt(summary.monthlyExpense)],
                ['淨餘/淨虧', fmt(summary.netAmount)],
                ['交易筆數', summary.transactionCount],
            ]);

            // 2. 類別支出分佈
            if (cats.length) {
                sections.push([
                    [],
                    ['支出類別分佈'],
                    ['類別', '金額 (TWD)', '佔比 (%)'],
                    ...cats.map(c => [c.categoryName, fmt(c.totalAmount), c.percentage.toFixed(1)]),
                ]);
            }

            // 3. 交易明細
            if (txs.length) {
                sections.push([
                    [],
                    ['交易明細'],
                    ['日期', '類別', '類型', '金額', '備註'],
                    ...txs.map(tx => [
                        tx.transactionDate,
                        tx.categoryName,
                        tx.type === 'Income' ? '收入' : '支出',
                        tx.amount,
                        `"${(tx.note || '').replace(/"/g, '""')}"`,
                    ]),
                ]);
            }

            const csv = '\uFEFF' + sections.flat().map(r => r.join(',')).join('\r\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `monthly_report_${y}${String(m).padStart(2, '0')}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('匯出失敗：' + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<span class="material-symbols-outlined text-sm">download</span> 導出報表`;
        }
    }

    async function _loadHoldingCards() {
        try {
            const data = await API.get('/holdings');

            const top = data?.topPerformer;
            if (top) {
                document.getElementById('top-performer-symbol').textContent = top.symbol;
                const ret = top.returnPercent;
                const retEl = document.getElementById('top-performer-return');
                retEl.textContent = `${ret >= 0 ? '+' : ''}${ret.toFixed(2)}%`;
                retEl.className = `text-xs font-bold ${ret >= 0 ? 'text-secondary' : 'text-error'}`;
            } else {
                document.getElementById('top-performer-symbol').textContent = '尚無持倉';
                document.getElementById('top-performer-return').textContent = '—';
            }

            const largest = data?.largestPosition;
            if (largest) {
                document.getElementById('largest-position-icon').textContent =
                    largest.assetType === 'Crypto' ? 'currency_bitcoin' : 'monitoring';
                document.getElementById('largest-position-name').textContent =
                    `${largest.symbol}`;
                document.getElementById('largest-position-value').textContent =
                    `${largest.quantity.toLocaleString()} 股/單位`;
            } else {
                document.getElementById('largest-position-name').textContent = '尚無持倉';
                document.getElementById('largest-position-value').textContent = '—';
            }
        } catch {
            // 靜默失敗
        }
    }

    async function _loadMarketSentiment() {
        const titleEl = document.getElementById('sentiment-title');
        const descEl  = document.getElementById('sentiment-desc');
        const scoreEl = document.getElementById('sentiment-score');

        try {
            const data = await API.get('/dashboard/market-sentiment');
            if (!data) throw new Error('no data');

            titleEl.textContent = `市場情緒目前呈現「${data.label}」`;
            descEl.textContent  = data.desc;
            scoreEl.textContent = `VIX 恐慌指數：${data.vix.toFixed(2)}`;
        } catch {
            titleEl.textContent = '市場數據暫時無法取得';
            descEl.textContent  = '請稍後再試。';
            scoreEl.textContent = '';
        }
    }

    async function _loadCategoryDistribution() {
        try {
            const data = await API.get('/transactions/category-distribution');
            const categories = data?.categories ?? [];
            const el = document.getElementById('portfolio-distribution');

            if (!categories.length) {
                el.innerHTML = '<p class="text-xs text-on-surface-variant">本月尚無支出記錄</p>';
                return;
            }

            const colors = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-error', 'bg-outline-variant'];
            el.innerHTML = categories.slice(0, 5).map((c, i) => `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <span class="w-3 h-3 rounded-full flex-shrink-0 ${colors[i % colors.length]}"></span>
                        <span class="text-sm font-medium">${c.categoryName}</span>
                    </div>
                    <span class="text-sm font-bold">${c.percentage.toFixed(1)}%</span>
                </div>
                <div class="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden -mt-2">
                    <div class="h-full ${colors[i % colors.length]} rounded-full" style="width:${c.percentage}%"></div>
                </div>
            `).join('');
        } catch {
            // 靜默失敗
        }
    }

    async function _loadSummary() {
        try {
            const data = await API.get('/dashboard/summary');
            const fmt = n => 'NT$ ' + Math.round(n).toLocaleString();
            document.getElementById('monthly-income').textContent = fmt(data.monthlyIncome);
            document.getElementById('monthly-expense').textContent = fmt(data.monthlyExpense);
            document.getElementById('monthly-income-sub').textContent = `${data.transactionCount} 筆交易`;
            document.getElementById('monthly-expense-sub').textContent = data.netAmount >= 0 ? `淨餘 ${fmt(data.netAmount)}` : `淨虧 ${fmt(Math.abs(data.netAmount))}`;
        } catch {
            // 靜默失敗
        }
    }

    async function _loadRecentActivities() {
        try {
            const data = await API.get('/dashboard/recent-activities?limit=5');
            const list = document.getElementById('activity-list');
            const activities = data?.activities ?? [];
            if (!activities.length) {
                list.innerHTML = '<p class="p-4 text-xs text-on-surface-variant">尚無交易紀錄</p>';
                return;
            }
            list.innerHTML = activities.map(item => {
                const sign = item.type === 'Expense' ? '-' : '+';
                const amountColor = item.type === 'Expense' ? 'text-error' : 'text-secondary';
                const date = new Date(item.createdAt);
                const meta = `${date.toLocaleDateString('zh-Hant', { month: 'short', day: 'numeric' })} · ${item.categoryName}`;
                return `
                <div class="p-4 flex items-center justify-between hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined text-xl">${item.categoryIcon}</span>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-on-surface">${item.categoryName}</p>
                            <p class="text-[10px] text-on-surface-variant font-medium">${meta}</p>
                        </div>
                    </div>
                    <p class="text-sm font-headline font-bold ${amountColor}">${sign} NT$ ${item.amount.toLocaleString()}</p>
                </div>`;
            }).join('');
        } catch {
            const el = document.getElementById('activity-list');
            if (el) el.innerHTML = '<p class="p-4 text-xs text-error">載入失敗</p>';
        }
    }

    async function _loadPerformance(days) {
        // 更新標題
        const titleMap = {
            1:   ['資產表現分析 1-Day Performance',  '顯示今日的收支淨額'],
            7:   ['資產表現分析 7-Day Performance',  '顯示過去一週內投資組合的價值波動'],
            30:  ['資產表現分析 1-Month Performance', '顯示過去一個月的每週收支趨勢'],
            365: ['資產表現分析 1-Year Performance',  '顯示過去一年的每月收支趨勢'],
        };
        const [title, subtitle] = titleMap[days] ?? titleMap[7];
        document.getElementById('perf-chart-title').textContent = title;
        document.getElementById('perf-chart-subtitle').textContent = subtitle;

        try {
            const data = await API.get(`/dashboard/performance?days=${days}`);
            const bars = document.getElementById('perf-chart-bars');
            const labels = document.getElementById('perf-chart-labels');
            const rawItems = data?.data ?? [];

            // 建立日期→淨額 map
            const dataMap = {};
            rawItems.forEach(i => { dataMap[i.date] = i.net; });

            // 依 period 決定聚合方式
            let buckets; // [{ label, net }]
            if (days <= 7) {
                // 每日，7 個 bar
                buckets = [];
                const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
                for (let d = days - 1; d >= 0; d--) {
                    const date = new Date();
                    date.setDate(date.getDate() - d);
                    const key = date.toISOString().slice(0, 10);
                    buckets.push({
                        label: `${date.getMonth()+1}/${date.getDate()}(${dayNames[date.getDay()]})`,
                        net: dataMap[key] ?? 0
                    });
                }
            } else if (days <= 31) {
                // 每週聚合，4~5 個 bar
                buckets = [];
                for (let w = 3; w >= 0; w--) {
                    const end = new Date(); end.setDate(end.getDate() - w * 7);
                    const start = new Date(end); start.setDate(start.getDate() - 6);
                    let net = 0;
                    for (let dd = new Date(start); dd <= end; dd.setDate(dd.getDate() + 1)) {
                        net += dataMap[dd.toISOString().slice(0, 10)] ?? 0;
                    }
                    buckets.push({
                        label: `${start.getMonth()+1}/${start.getDate()}`,
                        net
                    });
                }
            } else {
                // 每月聚合，12 個 bar
                buckets = [];
                const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                for (let m = 11; m >= 0; m--) {
                    const ref = new Date();
                    ref.setMonth(ref.getMonth() - m, 1);
                    const y = ref.getFullYear(), mo = ref.getMonth();
                    let net = 0;
                    Object.entries(dataMap).forEach(([k, v]) => {
                        const d = new Date(k);
                        if (d.getFullYear() === y && d.getMonth() === mo) net += v;
                    });
                    buckets.push({ label: monthNames[mo], net });
                }
            }

            const gridLines = `<div class="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none opacity-5"><div class="border-t border-on-surface w-full"></div><div class="border-t border-on-surface w-full"></div><div class="border-t border-on-surface w-full"></div><div class="border-t border-on-surface w-full"></div></div>`;

            if (!buckets.some(b => b.net !== 0)) {
                bars.innerHTML = gridLines + '<div class="w-full flex items-center justify-center text-on-surface-variant text-xs">此期間尚無資料</div>';
                labels.innerHTML = '';
                return;
            }

            const maxNet = Math.max(...buckets.map(b => Math.abs(b.net)), 1);
            bars.innerHTML = gridLines + buckets.map(b => {
                const h = b.net === 0 ? 3 : Math.max(8, Math.round((Math.abs(b.net) / maxNet) * 100));
                const bg = b.net === 0 ? 'bg-outline-variant/20'
                    : b.net > 0 ? 'bg-secondary/60 hover:bg-secondary'
                    : 'bg-error/40 hover:bg-error/60';
                const tip = b.net === 0 ? '無交易'
                    : b.net > 0 ? `+NT$ ${b.net.toLocaleString()}`
                    : `-NT$ ${Math.abs(b.net).toLocaleString()}`;
                return `<div class="flex-1 ${bg} transition-all rounded-t-lg relative group chart-bar" style="height:${h}%">
                    <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-high px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${tip}</div>
                </div>`;
            }).join('');

            labels.innerHTML = buckets.map(b => `<span>${b.label}</span>`).join('');
        } catch {
            // 靜默失敗
        }
    }

    return { render };
})();
