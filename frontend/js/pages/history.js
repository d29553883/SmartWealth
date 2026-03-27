/**
 * History Page - 交易紀錄頁
 * The Private Ledger
 */
const HistoryPage = (() => {

    function render(container) {
        const route = '/history';
        container.innerHTML = `
        ${Sidebar.render(route)}
        ${Topbar.render({ userName: 'Alex Chen', userRole: 'Private Client' })}

        <!-- Main Canvas -->
        <main class="ml-64 pt-16 h-screen overflow-y-auto bg-surface">
            <div class="p-8 max-w-[1400px] mx-auto">
                <!-- Page Header -->
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 class="font-headline font-extrabold text-4xl text-on-surface tracking-tight leading-none mb-2">交易紀錄 History</h2>
                        <p class="font-body text-on-surface-variant text-sm tracking-wide">檢視您的個人帳目明細與財富流動趨勢</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button class="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-headline font-bold text-xs flex items-center gap-2 hover:bg-surface-container-highest transition-colors" id="btn-export-history">
                            <span class="material-symbols-outlined text-sm">file_download</span>
                            匯出報表
                        </button>
                        <a href="#/add" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-headline font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <span class="material-symbols-outlined text-sm">add</span>
                            新增交易
                        </a>
                    </div>
                </div>

                <!-- Filters & Stats Row -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div class="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between">
                            <p class="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4">本月支出</p>
                            <div class="flex items-baseline gap-2">
                                <span class="text-2xl font-headline font-extrabold text-on-surface">$128,450</span>
                                <span class="text-xs font-bold text-error flex items-center">+12%</span>
                            </div>
                        </div>
                        <div class="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between">
                            <p class="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4">交易筆數</p>
                            <div class="flex items-baseline gap-2">
                                <span class="text-2xl font-headline font-extrabold text-on-surface">42</span>
                                <span class="text-[10px] font-body text-on-surface-variant">/ 近30天</span>
                            </div>
                        </div>
                        <div class="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between">
                            <p class="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4">最常消費類別</p>
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">restaurant</span>
                                <span class="text-lg font-headline font-bold text-on-surface">餐飲娛樂</span>
                            </div>
                        </div>
                    </div>

                    <!-- Filter Controls -->
                    <div class="bg-surface-container-high p-6 rounded-xl flex flex-col gap-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-headline font-bold uppercase tracking-widest">進階篩選</span>
                            <span class="material-symbols-outlined text-on-surface-variant text-lg">tune</span>
                        </div>
                        <div class="flex flex-wrap gap-2" id="history-filters">
                            <span class="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full cursor-pointer" data-filter="all">全部</span>
                            <span class="px-3 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-full hover:bg-surface-variant transition-colors cursor-pointer" data-filter="week">本週</span>
                            <span class="px-3 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-full hover:bg-surface-variant transition-colors cursor-pointer" data-filter="large">大額交易</span>
                        </div>
                    </div>
                </div>

                <!-- Transaction Table -->
                <div class="bg-surface-container-low rounded-2xl overflow-hidden editorial-shadow">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-surface-container text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em]">
                                <th class="px-8 py-5 font-semibold">日期 Date</th>
                                <th class="px-6 py-5 font-semibold">類別 Category</th>
                                <th class="px-6 py-5 font-semibold">交易實體 Entity</th>
                                <th class="px-6 py-5 font-semibold">狀態 Status</th>
                                <th class="px-8 py-5 font-semibold text-right">金額 Amount</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-outline-variant/10 font-body">
                            ${_renderTransactionRows()}
                        </tbody>
                    </table>

                    <!-- Pagination -->
                    <div class="px-8 py-6 flex items-center justify-between border-t border-outline-variant/10">
                        <p class="text-[11px] font-body text-on-surface-variant">顯示 1-5 筆，共 142 筆交易</p>
                        <div class="flex items-center gap-2" id="pagination">
                            <button class="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface">
                                <span class="material-symbols-outlined text-base">chevron_left</span>
                            </button>
                            <span class="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-on-primary text-[11px] font-bold">1</span>
                            <span class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface text-[11px] font-bold cursor-pointer">2</span>
                            <span class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface text-[11px] font-bold cursor-pointer">3</span>
                            <button class="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface">
                                <span class="material-symbols-outlined text-base">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contextual Insights -->
                <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    <div class="bg-primary-container/20 p-8 rounded-2xl relative overflow-hidden group">
                        <div class="relative z-10">
                            <h3 class="font-headline font-bold text-lg mb-4">支出異常提醒</h3>
                            <p class="font-body text-sm text-on-primary-container leading-relaxed mb-6">本週您的「餐飲」支出高於過往平均約 25%，建議檢視非必要性消費以優化資產配置。</p>
                            <button class="text-xs font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                                立即分析紀錄 <span class="material-symbols-outlined text-xs">arrow_forward</span>
                            </button>
                        </div>
                        <div class="absolute -right-10 -bottom-10 opacity-10">
                            <span class="material-symbols-outlined text-[120px]">warning</span>
                        </div>
                    </div>
                    <div class="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/5">
                        <div class="flex justify-between items-start mb-6">
                            <h3 class="font-headline font-bold text-lg">類別佔比</h3>
                            <span class="material-symbols-outlined text-on-surface-variant">donut_large</span>
                        </div>
                        <div class="space-y-4">
                            ${[
                                { label: '購物', pct: 45, color: 'bg-primary' },
                                { label: '餐飲', pct: 28, color: 'bg-secondary' },
                                { label: '居住', pct: 27, color: 'bg-tertiary' },
                            ].map(item => `
                                <div class="space-y-1">
                                    <div class="flex justify-between text-[11px] font-bold">
                                        <span>${item.label}</span><span>${item.pct}%</span>
                                    </div>
                                    <div class="h-1 w-full bg-surface-container-high rounded-full">
                                        <div class="h-1 ${item.color} rounded-full" style="width: ${item.pct}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bg-surface-container p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 border border-outline-variant/10">
                        <div class="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined text-3xl">cloud_done</span>
                        </div>
                        <div>
                            <h3 class="font-headline font-bold text-lg">數據同步正常</h3>
                            <p class="font-body text-xs text-on-surface-variant mt-2">最後同步時間：今天 14:00<br/>已連結 4 個金融帳戶</p>
                        </div>
                        <button class="mt-2 text-xs font-bold px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-colors">管理帳戶連結</button>
                    </div>
                </div>
            </div>
        </main>`;

        _bindEvents();
    }

    function _renderTransactionRows() {
        const transactions = [
            { date: '2023.10.24', time: '14:20 PM', catIcon: 'shopping_bag', catIconColor: 'text-primary', catLabel: '購物零售', entity: 'Apple Store Fifth Ave', entitySub: '支付卡號 **** 8829', status: '已完成', statusType: 'success', amount: '-$32,900.00', amountColor: 'text-on-surface' },
            { date: '2023.10.22', time: '09:15 AM', catIcon: 'payments', catIconColor: 'text-tertiary', catLabel: '薪資收入', entity: 'Design Studio Inc.', entitySub: '每月薪資轉帳', status: '已入帳', statusType: 'success', amount: '+$158,000.00', amountColor: 'text-secondary' },
            { date: '2023.10.21', time: '19:45 PM', catIcon: 'restaurant', catIconColor: 'text-error', catLabel: '餐飲美饌', entity: 'Raw Taipei', entitySub: '商務聚餐', status: '處理中', statusType: 'pending', amount: '-$8,250.00', amountColor: 'text-on-surface' },
            { date: '2023.10.18', time: '10:00 AM', catIcon: 'trending_up', catIconColor: 'text-primary', catLabel: '投資標的', entity: 'Vanguard S&P 500 ETF', entitySub: '定期定額申購', status: '已成交', statusType: 'success', amount: '-$15,000.00', amountColor: 'text-on-surface' },
            { date: '2023.10.15', time: '11:30 AM', catIcon: 'commute', catIconColor: 'text-on-surface-variant', catLabel: '交通運輸', entity: 'Uber Taiwan', entitySub: '個人乘車服務', status: '已完成', statusType: 'success', amount: '-$450.00', amountColor: 'text-on-surface' },
        ];

        return transactions.map(tx => `
            <tr class="hover:bg-surface-container/40 transition-colors group">
                <td class="px-8 py-5">
                    <p class="text-sm font-bold text-on-surface">${tx.date}</p>
                    <p class="text-[10px] text-on-surface-variant">${tx.time}</p>
                </td>
                <td class="px-6 py-5">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                            <span class="material-symbols-outlined text-sm ${tx.catIconColor}">${tx.catIcon}</span>
                        </span>
                        <span class="text-sm text-on-surface font-medium">${tx.catLabel}</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <p class="text-sm text-on-surface font-semibold">${tx.entity}</p>
                    <p class="text-[10px] text-on-surface-variant">${tx.entitySub}</p>
                </td>
                <td class="px-6 py-5">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.statusType === 'success'
                            ? 'bg-secondary/10 text-secondary border border-secondary/20'
                            : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/20'
                    }">
                        ${tx.status}
                    </span>
                </td>
                <td class="px-8 py-5 text-right">
                    <p class="text-sm font-bold ${tx.amountColor}">${tx.amount}</p>
                    <p class="text-[10px] text-on-surface-variant">TWD</p>
                </td>
            </tr>
        `).join('');
    }

    function _bindEvents() {
        // Filter chips
        const filtersContainer = document.getElementById('history-filters');
        if (filtersContainer) {
            filtersContainer.addEventListener('click', (e) => {
                const chip = e.target.closest('[data-filter]');
                if (!chip) return;
                filtersContainer.querySelectorAll('[data-filter]').forEach(c => {
                    c.className = 'px-3 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-full hover:bg-surface-variant transition-colors cursor-pointer';
                });
                chip.className = 'px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full cursor-pointer';
            });
        }
    }

    return { render };
})();
