/**
 * Dashboard Page - 儀表板頁
 * The Private Ledger
 */
const DashboardPage = (() => {

    function render(container) {
        const route = '/dashboard';
        container.innerHTML = `
        ${Sidebar.render(route)}
        ${Topbar.render({ userName: '陳大文', userRole: '家族辦公室帳戶' })}

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
                            <h3 class="font-headline font-black text-5xl text-primary-fixed mb-4">NT$ 12,842,000</h3>
                            <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20">
                                <span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">trending_up</span>
                                <span class="text-secondary text-xs font-bold">+2.4% (本週)</span>
                            </div>
                        </div>
                        <div class="mt-8 flex gap-8">
                            <div>
                                <p class="text-[10px] text-on-primary-container/60 uppercase font-bold tracking-wider mb-1">流動現金</p>
                                <p class="text-lg font-headline font-bold text-on-primary-container">NT$ 3.2M</p>
                            </div>
                            <div>
                                <p class="text-[10px] text-on-primary-container/60 uppercase font-bold tracking-wider mb-1">投資組合</p>
                                <p class="text-lg font-headline font-bold text-on-primary-container">NT$ 9.6M</p>
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
                                <p class="text-2xl font-headline font-extrabold text-on-surface">NT$ 425,000</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] text-tertiary font-bold">+12%</p>
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
                                <p class="text-2xl font-headline font-extrabold text-on-surface">NT$ 158,200</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] text-error font-bold">-5%</p>
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
                            <h4 class="font-headline font-bold text-xl text-on-surface">資產表現分析 7-Day Performance</h4>
                            <p class="text-sm text-on-surface-variant">顯示過去一週內投資組合的價值波動</p>
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
                    <div class="h-64 flex items-end justify-between gap-4 px-2 relative">
                        <div class="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none opacity-5">
                            <div class="border-t border-on-surface w-full"></div>
                            <div class="border-t border-on-surface w-full"></div>
                            <div class="border-t border-on-surface w-full"></div>
                            <div class="border-t border-on-surface w-full"></div>
                        </div>
                        ${[40,45,60,55,75,85,100].map((h, i) => {
                            const opacity = h < 50 ? '20' : h < 70 ? '40' : h < 90 ? '60' : '';
                            const bgClass = opacity ? `bg-primary/${opacity} hover:bg-primary/${parseInt(opacity)+20}` : 'bg-primary hover:bg-primary';
                            return `<div class="flex-1 ${bgClass} transition-all rounded-t-lg relative group chart-bar" style="height: ${h}%">
                                <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-high px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">NT$ ${(12 + h * 0.008).toFixed(1)}M</div>
                            </div>`;
                        }).join('')}
                    </div>
                    <div class="flex justify-between mt-6 text-[10px] font-bold text-on-surface-variant px-2 uppercase tracking-tighter">
                        <span>週一 MON</span><span>週二 TUE</span><span>週三 WED</span><span>週四 THU</span><span>週五 FRI</span><span>週六 SAT</span><span>週日 SUN</span>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="col-span-12 lg:col-span-4 bg-surface-container rounded-xl overflow-hidden flex flex-col">
                    <div class="p-6">
                        <h4 class="font-headline font-bold text-lg text-on-surface">最近活動 Recent Activity</h4>
                    </div>
                    <div class="flex-1 p-2 space-y-1 overflow-y-auto max-h-[400px] hide-scrollbar">
                        ${_renderActivityItems()}
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
                            <p class="text-sm text-on-surface-variant mb-6">您的多元化投資策略概覽</p>
                            <div class="space-y-4">
                                ${[
                                    { label: '股票與證券', pct: '65%', color: 'bg-primary' },
                                    { label: '現金儲蓄', pct: '20%', color: 'bg-secondary' },
                                    { label: '房地產投資', pct: '10%', color: 'bg-tertiary' },
                                    { label: '其他加密資產', pct: '5%', color: 'bg-outline-variant' },
                                ].map(item => `
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center gap-3">
                                            <span class="w-3 h-3 rounded-full ${item.color}"></span>
                                            <span class="text-sm font-medium">${item.label}</span>
                                        </div>
                                        <span class="text-sm font-bold">${item.pct}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="w-full md:w-2/3 editorial-grid gap-4">
                            <div class="col-span-6 md:col-span-3 aspect-square rounded-2xl bg-surface-container-high p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
                                <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">monitoring</span>
                                <div>
                                    <p class="text-xs font-bold text-on-surface-variant mb-1 uppercase">最高回報</p>
                                    <p class="text-lg font-headline font-black">NVIDIA</p>
                                    <p class="text-xs text-secondary font-bold">+18.4%</p>
                                </div>
                            </div>
                            <div class="col-span-6 md:col-span-3 aspect-square rounded-2xl bg-surface-container-high p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
                                <span class="material-symbols-outlined text-tertiary text-3xl">currency_bitcoin</span>
                                <div>
                                    <p class="text-xs font-bold text-on-surface-variant mb-1 uppercase">持倉部位</p>
                                    <p class="text-lg font-headline font-black">BTC/USD</p>
                                    <p class="text-xs text-on-surface-variant font-bold">0.84 BTC</p>
                                </div>
                            </div>
                            <div class="col-span-12 md:col-span-6 rounded-2xl bg-primary-container p-6 relative overflow-hidden group">
                                <div class="relative z-10 h-full flex flex-col justify-between">
                                    <p class="text-xs font-bold text-on-primary-container uppercase tracking-widest">市場分析 AI 指數</p>
                                    <h5 class="text-xl font-headline font-extrabold text-primary-fixed mb-2">市場情緒目前呈現「貪婪」</h5>
                                    <p class="text-xs text-on-primary-container/80 max-w-[200px]">您的投資組合目前與科技股高度連動，建議適度分散風險至避險資產。</p>
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
    }

    function _renderActivityItems() {
        const items = [
            { icon: 'shopping_bag', iconBg: 'bg-secondary-container', iconColor: 'text-on-secondary-container', title: 'Apple Store 購買', meta: '2 小時前 · 電子產品', amount: '- NT$ 48,900', amountColor: 'text-error' },
            { icon: 'payments', iconBg: 'bg-primary-container', iconColor: 'text-on-primary-container', title: '月度薪資轉帳', meta: '昨日 · 收入', amount: '+ NT$ 185,000', amountColor: 'text-secondary' },
            { icon: 'show_chart', iconBg: 'bg-tertiary-container', iconColor: 'text-on-tertiary-container', title: '股息發放 (NVDA)', meta: '2 天前 · 投資', amount: '+ NT$ 12,400', amountColor: 'text-secondary' },
            { icon: 'restaurant', iconBg: 'bg-surface-container-highest', iconColor: 'text-on-surface-variant', title: 'Fine Dining 餐廳', meta: '3 天前 · 餐飲', amount: '- NT$ 8,200', amountColor: 'text-error' },
        ];

        return items.map(item => `
            <div class="p-4 flex items-center justify-between hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer group">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center ${item.iconColor}">
                        <span class="material-symbols-outlined text-xl">${item.icon}</span>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-on-surface">${item.title}</p>
                        <p class="text-[10px] text-on-surface-variant font-medium">${item.meta}</p>
                    </div>
                </div>
                <p class="text-sm font-headline font-bold ${item.amountColor}">${item.amount}</p>
            </div>
        `).join('');
    }

    function _bindEvents() {
        // Time filter buttons
        const filterContainer = document.getElementById('time-filter');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                filterContainer.querySelectorAll('button').forEach(b => {
                    b.className = 'px-4 py-1.5 text-xs font-semibold rounded-md text-on-surface-variant hover:text-on-surface transition-colors';
                });
                btn.className = 'px-4 py-1.5 text-xs font-semibold rounded-md bg-primary text-on-primary shadow-sm';
            });
        }
    }

    return { render };
})();
