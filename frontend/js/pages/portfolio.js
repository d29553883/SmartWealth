/**
 * Portfolio Page - 投資組合頁
 * The Private Ledger
 */
const PortfolioPage = (() => {

    function render(container) {
        const route = '/portfolio';
        container.innerHTML = `
        ${Sidebar.render(route)}
        ${Topbar.render({ showBalance: true, balance: '$1,248,392' })}

        <!-- Main Content Area -->
        <main class="ml-64 pt-24 px-8 pb-12 max-w-7xl mx-auto">
            <!-- Hero Stats: Editorial Asymmetry -->
            <div class="grid grid-cols-12 gap-6 mb-12">
                <div class="col-span-12 md:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between">
                    <div>
                        <p class="text-on-surface-variant font-medium text-sm tracking-widest mb-2 font-body uppercase">Portfolio Net Worth</p>
                        <h2 class="text-5xl font-extrabold font-headline text-on-surface tracking-tight">$3,482,190.42</h2>
                        <div class="mt-4 flex items-center gap-2">
                            <span class="flex items-center text-secondary font-bold font-body">
                                <span class="material-symbols-outlined">trending_up</span>
                                +$24,103.50 (1.42%)
                            </span>
                            <span class="text-on-surface-variant text-xs">過去 24 小時</span>
                        </div>
                    </div>
                    <!-- Line Chart -->
                    <div class="mt-12 h-48 w-full relative">
                        <svg class="w-full h-full overflow-visible" viewBox="0 0 800 150">
                            <defs>
                                <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" stop-color="#bbc6e2" stop-opacity="0.3"></stop>
                                    <stop offset="100%" stop-color="#bbc6e2" stop-opacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0,120 Q100,100 200,110 T400,60 T600,80 T800,20" fill="transparent" stroke="#bbc6e2" stroke-linecap="round" stroke-width="3"></path>
                            <path d="M0,120 Q100,100 200,110 T400,60 T600,80 T800,20 V150 H0 Z" fill="url(#chartGradient)"></path>
                            <circle cx="800" cy="20" fill="#bbc6e2" r="5"></circle>
                        </svg>
                        <div class="flex justify-between mt-4 text-[10px] text-on-surface-variant font-body uppercase tracking-widest">
                            <span>一月</span><span>二月</span><span>三月</span><span>四月</span><span>五月</span><span>六月</span>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-4 flex flex-col gap-6">
                    <!-- Asset Allocation Donut -->
                    <div class="bg-surface-container rounded-xl p-6 flex-1 flex flex-col justify-center">
                        <p class="text-on-surface-variant text-xs font-body uppercase tracking-widest mb-4">Asset Allocation</p>
                        <div class="flex items-center justify-between mb-4">
                            <div class="relative w-24 h-24">
                                <svg class="w-full h-full" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" fill="none" r="16" stroke="#2a2a2a" stroke-width="4"></circle>
                                    <circle cx="18" cy="18" fill="none" r="16" stroke="#bbc6e2" stroke-dasharray="70, 100" stroke-dashoffset="25" stroke-width="4"></circle>
                                    <circle cx="18" cy="18" fill="none" r="16" stroke="#4edea3" stroke-dasharray="20, 100" stroke-dashoffset="95" stroke-width="4"></circle>
                                </svg>
                            </div>
                            <div class="flex-1 ml-6 space-y-3">
                                <div class="flex items-center justify-between text-xs">
                                    <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-primary"></span> 股票</span>
                                    <span class="text-on-surface font-semibold">65%</span>
                                </div>
                                <div class="flex items-center justify-between text-xs">
                                    <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-secondary"></span> 虛擬資產</span>
                                    <span class="text-on-surface font-semibold">22%</span>
                                </div>
                                <div class="flex items-center justify-between text-xs">
                                    <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-outline-variant"></span> 現金</span>
                                    <span class="text-on-surface font-semibold">13%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Risk Score -->
                    <div class="bg-primary rounded-xl p-6 flex-1 flex items-center justify-between">
                        <div>
                            <p class="text-on-primary/60 text-xs font-body uppercase tracking-widest mb-1">Risk Score</p>
                            <h3 class="text-on-primary text-3xl font-bold font-headline">Moderate</h3>
                        </div>
                        <span class="material-symbols-outlined text-4xl text-on-primary/30">shield</span>
                    </div>
                </div>
            </div>

            <!-- Bento Grid: Holdings + Rebalance -->
            <div class="grid grid-cols-12 gap-8 mb-12">
                <!-- Core Holdings List -->
                <div class="col-span-12 lg:col-span-8">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold font-headline">Core Holdings 核心持倉</h3>
                        <button class="text-primary text-xs font-semibold hover:underline">View All</button>
                    </div>
                    <div class="space-y-3">
                        ${_renderHoldingItems()}
                    </div>
                </div>

                <!-- Portfolio Rebalance -->
                <div class="col-span-12 lg:col-span-4">
                    <div class="bg-surface-container-low rounded-xl p-6 h-full flex flex-col border border-outline-variant/10">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                                <span class="material-symbols-outlined">balance</span>
                            </div>
                            <div>
                                <h3 class="font-bold font-headline">Portfolio Rebalance</h3>
                                <p class="text-[10px] text-on-surface-variant uppercase tracking-widest font-body">Optimization Engine</p>
                            </div>
                        </div>
                        <div class="space-y-6 flex-1">
                            <div class="p-4 bg-surface-container rounded-lg">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs font-semibold">Current Deviation</span>
                                    <span class="text-xs text-error font-bold">+8.4%</span>
                                </div>
                                <div class="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                                    <div class="bg-error w-[60%] h-full"></div>
                                </div>
                                <p class="text-[10px] text-on-surface-variant mt-2">您的股票持倉比例已超過目標權重的 8.4%。</p>
                            </div>
                            <div class="space-y-4">
                                <h4 class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">建議操作</h4>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-on-surface-variant">賣出 AAPL</span>
                                    <span class="font-mono font-semibold text-error">-$4,200</span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-on-surface-variant">買入 國債 ETF (TLT)</span>
                                    <span class="font-mono font-semibold text-secondary">+$3,850</span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-on-surface-variant">保留現金 (USD)</span>
                                    <span class="font-mono font-semibold text-on-surface">+$350</span>
                                </div>
                            </div>
                        </div>
                        <button class="w-full bg-surface-container-highest text-on-surface font-bold py-3 rounded-lg mt-8 text-sm hover:bg-surface-container-high transition-colors active:scale-95" id="btn-rebalance">
                            執行自動平衡策略
                        </button>
                    </div>
                </div>
            </div>

            <!-- Insights Section: Glassmorphism -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                <div class="bg-surface-container/60 backdrop-blur-xl rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <p class="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-4">Investment Insight</p>
                    <p class="text-sm font-body leading-relaxed mb-6">您的投資組合與標普 500 指數的相關性為 0.82。考慮增加非相關性資產以降低系統性風險。</p>
                    <a class="text-xs font-bold flex items-center gap-1 group/link cursor-pointer">
                        瞭解更多 <span class="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                    </a>
                </div>
                <div class="bg-surface-container/60 backdrop-blur-xl rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <p class="text-[10px] text-secondary font-bold uppercase tracking-[0.2em] mb-4">Dividend Forecast</p>
                    <div class="flex items-end gap-2 mb-4">
                        <span class="text-2xl font-bold font-headline">$1,240</span>
                        <span class="text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest">Estimated Q3</span>
                    </div>
                    <p class="text-xs text-on-surface-variant">您的股息收入預計比上一季度增長 4.2%。</p>
                </div>
                <div class="bg-surface-container/60 backdrop-blur-xl rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <p class="text-[10px] text-error font-bold uppercase tracking-[0.2em] mb-4">Tax Efficiency</p>
                    <p class="text-sm font-body leading-relaxed mb-6">檢測到 3 個可進行稅務損失收割 (Tax-Loss Harvesting) 的倉位，潛在抵稅額：$2,450。</p>
                    <button class="text-xs bg-surface-container-highest px-3 py-1.5 rounded-md font-bold">查看清單</button>
                </div>
            </div>
        </main>`;
    }

    function _renderHoldingItems() {
        const holdings = [
            { symbol: 'AAPL', name: 'Apple Inc.', price: '$189.43', change: '+1.24%', changeColor: 'text-secondary', qty: '450.00', qtyLabel: 'Shares', value: '$85,243.50' },
            { symbol: 'BTC', name: 'Bitcoin', price: '$64,302.10', change: '+4.18%', changeColor: 'text-secondary', qty: '1.24', qtyLabel: 'Units', value: '$79,734.60' },
            { symbol: 'TSLA', name: 'Tesla, Inc.', price: '$172.63', change: '-0.82%', changeColor: 'text-error', qty: '210.00', qtyLabel: 'Shares', value: '$36,252.30' },
        ];

        const iconColors = ['bg-surface-container-highest', 'bg-surface-container-highest', 'bg-surface-container-highest'];
        const symbolLetters = ['🍎', '₿', 'T'];

        return holdings.map((h, i) => `
            <div class="bg-surface-container rounded-xl p-4 flex items-center hover:bg-surface-container-high transition-colors group">
                <div class="w-10 h-10 rounded-full ${iconColors[i]} flex items-center justify-center mr-4 text-lg font-bold">
                    ${symbolLetters[i]}
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-sm">${h.symbol}</h4>
                    <p class="text-xs text-on-surface-variant">${h.name}</p>
                </div>
                <div class="flex-1 text-right">
                    <p class="text-sm font-semibold">${h.price}</p>
                    <p class="text-xs ${h.changeColor}">${h.change}</p>
                </div>
                <div class="flex-1 text-right">
                    <p class="text-sm font-semibold">${h.qty}</p>
                    <p class="text-xs text-on-surface-variant">${h.qtyLabel}</p>
                </div>
                <div class="flex-1 text-right">
                    <p class="text-sm font-bold font-headline">${h.value}</p>
                    <p class="text-xs text-on-surface-variant">Value</p>
                </div>
                <button class="ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="material-symbols-outlined text-on-surface-variant">more_vert</span>
                </button>
            </div>
        `).join('');
    }

    return { render };
})();
