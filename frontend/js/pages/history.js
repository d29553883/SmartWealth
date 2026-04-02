/**
 * History Page - 交易紀錄頁
 * The Private Ledger
 */
const HistoryPage = (() => {

    let _currentPage       = 1;
    let _currentType       = null;   // null | 'Income' | 'Expense'
    let _currentCategoryId = null;   // null | number
    let _currentWeekOnly   = false;
    let _totalPages        = 1;

    function render(container) {
        const route = '/history';
        container.innerHTML = `
        ${Sidebar.render(route)}
        ${Topbar.render()}

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
                                <span class="text-2xl font-headline font-extrabold text-on-surface" id="stat-monthly-expense">—</span>
                            </div>
                        </div>
                        <div class="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between">
                            <p class="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4">交易筆數</p>
                            <div class="flex items-baseline gap-2">
                                <span class="text-2xl font-headline font-extrabold text-on-surface" id="stat-tx-count">—</span>
                                <span class="text-[10px] font-body text-on-surface-variant">/ 本月</span>
                            </div>
                        </div>
                        <div class="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between">
                            <p class="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4">最常消費類別</p>
                            <div class="flex items-center gap-2" id="stat-top-category">
                                <span class="text-lg font-headline font-bold text-on-surface">—</span>
                            </div>
                        </div>
                    </div>

                    <!-- Filter Controls -->
                    <div class="bg-surface-container-high p-6 rounded-xl flex flex-col gap-3">
                        <span class="text-xs font-headline font-bold uppercase tracking-widest">時間</span>
                        <div class="flex gap-2" id="week-filter">
                            <span class="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full cursor-pointer" data-week="false">全部</span>
                            <span class="px-3 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-full hover:bg-surface-variant transition-colors cursor-pointer" data-week="true">本週</span>
                        </div>
                        <span class="text-xs font-headline font-bold uppercase tracking-widest mt-1">類型</span>
                        <div class="flex gap-2" id="type-filters">
                            <span class="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full cursor-pointer" data-type="">全部</span>
                            <span class="px-3 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-full hover:bg-surface-variant transition-colors cursor-pointer" data-type="Expense">支出</span>
                            <span class="px-3 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-full hover:bg-surface-variant transition-colors cursor-pointer" data-type="Income">收入</span>
                        </div>
                        <div class="flex items-center justify-between mt-1">
                            <span class="text-xs font-headline font-bold uppercase tracking-widest">類別</span>
                            <span class="material-symbols-outlined text-on-surface-variant text-lg">tune</span>
                        </div>
                        <div class="flex flex-wrap gap-2" id="category-filters">
                            <div class="text-[10px] text-on-surface-variant animate-pulse">載入中...</div>
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
                                <th class="px-6 py-5 font-semibold">備註 Note</th>
                                <th class="px-6 py-5 font-semibold">狀態 Status</th>
                                <th class="px-8 py-5 font-semibold text-right">金額 Amount</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-outline-variant/10 font-body" id="tx-table-body">
                            <tr><td colspan="5" class="px-8 py-10 text-center text-on-surface-variant text-sm animate-pulse">載入中...</td></tr>
                        </tbody>
                    </table>

                    <!-- Pagination -->
                    <div class="px-8 py-6 flex items-center justify-between border-t border-outline-variant/10">
                        <p class="text-[11px] font-body text-on-surface-variant" id="pagination-info">—</p>
                        <div class="flex items-center gap-2" id="pagination"></div>
                    </div>
                </div>

                <!-- Contextual Insights -->
                <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    <!-- Category Distribution -->
                    <div class="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/5">
                        <div class="flex justify-between items-start mb-6">
                            <h3 class="font-headline font-bold text-lg">本月類別佔比</h3>
                            <span class="material-symbols-outlined text-on-surface-variant">donut_large</span>
                        </div>
                        <div class="space-y-4" id="insight-category-dist">
                            <div class="text-xs text-on-surface-variant animate-pulse">載入中...</div>
                        </div>
                    </div>

                    <!-- Monthly Net -->
                    <div class="bg-primary-container/20 p-8 rounded-2xl relative overflow-hidden group">
                        <div class="relative z-10">
                            <h3 class="font-headline font-bold text-lg mb-4">本月收支狀況</h3>
                            <div id="insight-monthly-net">
                                <div class="text-xs text-on-surface-variant animate-pulse">載入中...</div>
                            </div>
                        </div>
                        <div class="absolute -right-10 -bottom-10 opacity-10">
                            <span class="material-symbols-outlined text-[120px]">account_balance_wallet</span>
                        </div>
                    </div>

                    <!-- Sync Status -->
                    <div class="bg-surface-container p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 border border-outline-variant/10">
                        <div class="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined text-3xl">cloud_done</span>
                        </div>
                        <div>
                            <h3 class="font-headline font-bold text-lg">數據同步正常</h3>
                            <p class="font-body text-xs text-on-surface-variant mt-2" id="insight-sync-time">—</p>
                        </div>
                        <a href="#/add" class="mt-2 text-xs font-bold px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-colors">新增交易</a>
                    </div>
                </div>
            </div>
        </main>`;

        _bindEvents();
        Sidebar.bindEvents();

        // 重置狀態（SPA 切換頁時需要）
        _currentPage       = 1;
        _currentType       = null;
        _currentCategoryId = null;
        _currentWeekOnly   = false;

        _loadAll();
    }

    // ─── Data Loading ──────────────────────────────────────────────

    async function _loadAll() {
        await Promise.allSettled([
            _loadStats(),
            _loadCategories(),
            _loadTransactions(),
        ]);
    }

    async function _loadCategories() {
        try {
            const data = await API.get('/categories');
            const categories = data?.categories ?? [];
            const container = document.getElementById('category-filters');
            if (!container) return;

            container.innerHTML =
                `<span class="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full cursor-pointer" data-cat-id="">全部</span>` +
                categories.map(c => `
                    <span class="px-3 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-full
                        hover:bg-surface-variant transition-colors cursor-pointer flex items-center gap-1.5" data-cat-id="${c.categoryId}">
                        <span class="material-symbols-outlined" style="font-size:11px">${c.icon}</span>${c.name}
                    </span>`).join('');

            container.addEventListener('click', (e) => {
                const chip = e.target.closest('[data-cat-id]');
                if (!chip) return;
                const catId = chip.dataset.catId;
                if (String(_currentCategoryId ?? '') === catId) return;

                container.querySelectorAll('[data-cat-id]').forEach(c => {
                    c.className = c.className
                        .replace('bg-primary text-on-primary', 'bg-surface-container-highest text-on-surface hover:bg-surface-variant');
                });
                chip.className = chip.className
                    .replace('bg-surface-container-highest text-on-surface hover:bg-surface-variant', 'bg-primary text-on-primary');

                _currentCategoryId = catId ? parseInt(catId) : null;
                _currentPage = 1;
                _loadTransactions();
            });
        } catch {
            const container = document.getElementById('category-filters');
            if (container) container.innerHTML = '<span class="text-[10px] text-error">載入失敗</span>';
        }
    }

    async function _loadStats() {
        try {
            const [summary, catStats] = await Promise.all([
                API.get('/dashboard/summary'),
                API.get('/transactions/category-distribution'),
            ]);

            // Monthly expense
            const expEl = document.getElementById('stat-monthly-expense');
            if (expEl) expEl.textContent = 'NT$ ' + Math.round(summary.monthlyExpense).toLocaleString();

            // Transaction count
            const cntEl = document.getElementById('stat-tx-count');
            if (cntEl) cntEl.textContent = summary.transactionCount;

            // Top category
            const cats = catStats?.categories ?? [];
            const topCat = cats[0];
            const topCatEl = document.getElementById('stat-top-category');
            if (topCatEl) {
                topCatEl.innerHTML = topCat
                    ? `<span class="material-symbols-outlined text-primary">${topCat.icon}</span>
                       <span class="text-lg font-headline font-bold text-on-surface">${topCat.categoryName}</span>`
                    : `<span class="text-lg font-headline font-bold text-on-surface">尚無紀錄</span>`;
            }

            // Insights: category distribution
            _renderCategoryInsight(cats);

            // Insights: monthly net
            _renderMonthlyNetInsight(summary);

            // Sync time
            const syncEl = document.getElementById('insight-sync-time');
            if (syncEl) {
                const now = new Date();
                syncEl.textContent = `最後同步：${now.toLocaleTimeString('zh-Hant', { hour: '2-digit', minute: '2-digit' })}`;
            }
        } catch {
            // 靜默失敗
        }
    }

    function _renderCategoryInsight(cats) {
        const el = document.getElementById('insight-category-dist');
        if (!el) return;
        if (!cats.length) {
            el.innerHTML = '<p class="text-xs text-on-surface-variant">本月尚無支出記錄</p>';
            return;
        }
        const colors = ['bg-primary', 'bg-secondary', 'bg-tertiary'];
        el.innerHTML = cats.slice(0, 3).map((c, i) => `
            <div class="space-y-1">
                <div class="flex justify-between text-[11px] font-bold">
                    <span>${c.categoryName}</span><span>${c.percentage.toFixed(1)}%</span>
                </div>
                <div class="h-1 w-full bg-surface-container-high rounded-full">
                    <div class="h-1 ${colors[i % colors.length]} rounded-full" style="width:${Math.min(c.percentage, 100)}%"></div>
                </div>
            </div>
        `).join('');
    }

    function _renderMonthlyNetInsight(summary) {
        const el = document.getElementById('insight-monthly-net');
        if (!el) return;
        const isPositive = summary.netAmount >= 0;
        const netFmt = 'NT$ ' + Math.abs(Math.round(summary.netAmount)).toLocaleString();
        el.innerHTML = `
            <div class="space-y-3">
                <div class="flex justify-between text-sm">
                    <span class="text-on-surface-variant">收入</span>
                    <span class="font-bold text-secondary">+NT$ ${Math.round(summary.monthlyIncome).toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-on-surface-variant">支出</span>
                    <span class="font-bold text-error">-NT$ ${Math.round(summary.monthlyExpense).toLocaleString()}</span>
                </div>
                <div class="border-t border-outline-variant/20 pt-3 flex justify-between text-sm font-bold">
                    <span>淨${isPositive ? '餘' : '虧'}</span>
                    <span class="${isPositive ? 'text-secondary' : 'text-error'}">${isPositive ? '+' : '-'}${netFmt}</span>
                </div>
            </div>`;
    }

    async function _loadTransactions() {
        const tbody = document.getElementById('tx-table-body');
        const infoEl = document.getElementById('pagination-info');
        const paginEl = document.getElementById('pagination');
        if (!tbody) return;

        tbody.innerHTML = `<tr><td colspan="5" class="px-8 py-10 text-center text-on-surface-variant text-sm animate-pulse">載入中...</td></tr>`;

        try {
            const params = new URLSearchParams({ page: _currentPage, pageSize: 10 });
            if (_currentType)       params.set('type', _currentType);
            if (_currentCategoryId) params.set('categoryId', _currentCategoryId);
            if (_currentWeekOnly)   params.set('week', 'true');
            const data = await API.get(`/transactions?${params}`);
            const transactions = data?.transactions ?? [];
            const pagination   = data?.pagination ?? { currentPage: 1, totalPages: 1, totalRecords: 0 };

            _totalPages = pagination.totalPages;

            if (!transactions.length) {
                tbody.innerHTML = `<tr><td colspan="5" class="px-8 py-10 text-center text-on-surface-variant text-sm">此條件下尚無交易紀錄</td></tr>`;
                if (infoEl) infoEl.textContent = '共 0 筆交易';
                if (paginEl) paginEl.innerHTML = '';
                return;
            }

            tbody.innerHTML = transactions.map(_renderRow).join('');

            // Pagination info
            const start = (pagination.currentPage - 1) * 10 + 1;
            const end   = Math.min(pagination.currentPage * 10, pagination.totalRecords);
            if (infoEl) infoEl.textContent = `顯示 ${start}–${end} 筆，共 ${pagination.totalRecords} 筆交易`;

            // Pagination buttons
            if (paginEl) _renderPagination(paginEl, pagination.currentPage, pagination.totalPages);

        } catch (e) {
            tbody.innerHTML = `<tr><td colspan="5" class="px-8 py-10 text-center text-error text-sm">載入失敗：${e.message}</td></tr>`;
        }
    }

    function _renderRow(tx) {
        const isIncome    = tx.type === 'Income';
        const sign        = isIncome ? '+' : '-';
        const amountColor = isIncome ? 'text-secondary' : 'text-on-surface';
        const date        = new Date(tx.transactionDate);
        const dateStr     = date.toLocaleDateString('zh-Hant', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
        const timeStr     = new Date(tx.createdAt).toLocaleTimeString('zh-Hant', { hour: '2-digit', minute: '2-digit' });

        return `
            <tr class="hover:bg-surface-container/40 transition-colors group">
                <td class="px-8 py-5">
                    <p class="text-sm font-bold text-on-surface">${dateStr}</p>
                    <p class="text-[10px] text-on-surface-variant">${timeStr}</p>
                </td>
                <td class="px-6 py-5">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                            <span class="material-symbols-outlined text-sm text-primary">${tx.categoryIcon}</span>
                        </span>
                        <span class="text-sm text-on-surface font-medium">${tx.categoryName}</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <p class="text-sm text-on-surface font-semibold">${tx.note || '—'}</p>
                    <p class="text-[10px] text-on-surface-variant">${tx.categoryName}</p>
                </td>
                <td class="px-6 py-5">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold
                        bg-secondary/10 text-secondary border border-secondary/20">
                        已完成
                    </span>
                </td>
                <td class="px-8 py-5 text-right">
                    <p class="text-sm font-bold ${amountColor}">${sign} NT$ ${tx.amount.toLocaleString()}</p>
                    <p class="text-[10px] text-on-surface-variant">TWD</p>
                </td>
            </tr>`;
    }

    function _renderPagination(container, currentPage, totalPages) {
        if (totalPages <= 1) { container.innerHTML = ''; return; }

        const prev = `<button class="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
            <span class="material-symbols-outlined text-base pointer-events-none">chevron_left</span>
        </button>`;

        // Show at most 5 page buttons
        const pages = [];
        const start = Math.max(1, currentPage - 2);
        const end   = Math.min(totalPages, start + 4);
        for (let p = start; p <= end; p++) {
            pages.push(p === currentPage
                ? `<span class="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-on-primary text-[11px] font-bold">${p}</span>`
                : `<span class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface text-[11px] font-bold cursor-pointer" data-page="${p}">${p}</span>`
            );
        }

        const next = `<button class="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
            <span class="material-symbols-outlined text-base pointer-events-none">chevron_right</span>
        </button>`;

        container.innerHTML = prev + pages.join('') + next;

        // Bind page clicks
        container.querySelectorAll('[data-page]').forEach(el => {
            el.addEventListener('click', () => {
                const p = parseInt(el.dataset.page);
                if (p < 1 || p > _totalPages || p === _currentPage) return;
                _currentPage = p;
                _loadTransactions();
                // Scroll table into view
                document.getElementById('tx-table-body')?.closest('.rounded-2xl')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // ─── Events ────────────────────────────────────────────────────

    function _bindEvents() {
        // 時間篩選
        document.getElementById('week-filter')?.addEventListener('click', (e) => {
            const chip = e.target.closest('[data-week]');
            if (!chip) return;
            const weekOnly = chip.dataset.week === 'true';
            if (weekOnly === _currentWeekOnly) return;
            document.getElementById('week-filter').querySelectorAll('[data-week]').forEach(c => {
                c.className = 'px-3 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-full hover:bg-surface-variant transition-colors cursor-pointer';
            });
            chip.className = 'px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full cursor-pointer';
            _currentWeekOnly = weekOnly;
            _currentPage = 1;
            _loadTransactions();
        });

        // 類型篩選
        document.getElementById('type-filters')?.addEventListener('click', (e) => {
            const chip = e.target.closest('[data-type]');
            if (!chip) return;
            const type = chip.dataset.type || null;
            if (type === _currentType) return;
            document.getElementById('type-filters').querySelectorAll('[data-type]').forEach(c => {
                c.className = 'px-3 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-full hover:bg-surface-variant transition-colors cursor-pointer';
            });
            chip.className = 'px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full cursor-pointer';
            _currentType = type;
            _currentPage = 1;
            _loadTransactions();
        });

        // 匯出 CSV
        document.getElementById('btn-export-history')?.addEventListener('click', _exportCsv);
    }

    async function _exportCsv() {
        const btn = document.getElementById('btn-export-history');
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">progress_activity</span> 匯出中...`;

        try {
            const params = new URLSearchParams({ page: 1, pageSize: 200 });
            if (_currentType)       params.set('type', _currentType);
            if (_currentCategoryId) params.set('categoryId', _currentCategoryId);
            if (_currentWeekOnly)   params.set('week', 'true');

            const data = await API.get(`/transactions?${params}`);
            const rows = data?.transactions ?? [];

            if (!rows.length) {
                alert('目前篩選條件下沒有資料可匯出');
                return;
            }

            const header = ['日期', '類別', '類型', '金額', '備註'];
            const lines = rows.map(tx => [
                tx.transactionDate,
                tx.categoryName,
                tx.type === 'Income' ? '收入' : '支出',
                tx.amount,
                `"${(tx.note || '').replace(/"/g, '""')}"`
            ].join(','));

            const csv = '\uFEFF' + [header.join(','), ...lines].join('\r\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('匯出失敗：' + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<span class="material-symbols-outlined text-sm">file_download</span> 匯出報表`;
        }
    }

    return { render };
})();
