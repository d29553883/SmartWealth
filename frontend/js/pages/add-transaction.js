/**
 * Add Transaction Page - 快速記帳頁
 * The Private Ledger
 */
const AddTransactionPage = (() => {

    function render(container) {
        const route = '/add';
        container.innerHTML = `
        ${Sidebar.render(route)}

        <!-- Main Content Canvas -->
        <main class="md:ml-64 min-h-screen relative flex items-center justify-center p-6 lg:p-12 overflow-hidden">
            <!-- Ambient Background Decorations -->
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full -ml-48 -mb-48"></div>

            <!-- Transaction Form Container -->
            <section class="w-full max-w-2xl z-10">
                <header class="mb-10 text-left">
                    <h2 class="text-4xl font-headline font-extrabold text-on-background tracking-tight mb-2">快速記帳 <span class="text-primary-fixed-dim/60 font-light">Quick Add</span></h2>
                    <p class="text-on-surface-variant font-body">快速記錄您的高價值交易，精確且高效。</p>
                </header>

                <div class="bg-surface-container-low rounded-xl p-1 shadow-2xl overflow-hidden">
                    <div class="glass-effect p-8 lg:p-10 rounded-[calc(0.75rem-1px)]">
                        <form class="space-y-8" id="add-transaction-form">
                            <!-- Amount Input -->
                            <div class="space-y-3">
                                <label class="text-xs font-semibold uppercase tracking-widest text-on-surface-variant font-label ml-1" for="tx-amount">交易金額 Amount</label>
                                <div class="relative flex items-center">
                                    <span class="absolute left-6 text-3xl font-headline font-bold text-primary">$</span>
                                    <input class="w-full bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 rounded-xl py-6 pl-14 pr-8 text-4xl font-headline font-extrabold text-on-background placeholder:text-surface-variant transition-all" id="tx-amount" name="amount" placeholder="0.00" step="0.01" type="number" />
                                </div>
                            </div>

                            <!-- Type Toggle -->
                            <div class="space-y-3">
                                <label class="text-xs font-semibold uppercase tracking-widest text-on-surface-variant font-label ml-1">類型 Type</label>
                                <div class="flex gap-3" id="type-toggle">
                                    <button type="button" data-type="Expense"
                                        class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-error/20 text-error font-bold text-sm transition-all ring-2 ring-error"
                                        id="btn-type-expense">
                                        <span class="material-symbols-outlined text-lg">arrow_upward</span>支出 Expense
                                    </button>
                                    <button type="button" data-type="Income"
                                        class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-high text-on-surface-variant font-bold text-sm transition-all"
                                        id="btn-type-income">
                                        <span class="material-symbols-outlined text-lg">arrow_downward</span>收入 Income
                                    </button>
                                </div>
                                <input type="hidden" id="tx-type" value="Expense" />
                            </div>

                            <!-- Date and Category Grid -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-3">
                                    <label class="text-xs font-semibold uppercase tracking-widest text-on-surface-variant font-label ml-1" for="tx-date">日期 Date</label>
                                    <div class="relative flex items-center">
                                        <span class="material-symbols-outlined absolute left-4 text-on-surface-variant">calendar_today</span>
                                        <input class="w-full bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 rounded-xl py-4 pl-12 pr-4 text-on-background font-body transition-all" id="tx-date" name="date" type="date" />
                                    </div>
                                </div>
                                <div class="space-y-3">
                                    <label class="text-xs font-semibold uppercase tracking-widest text-on-surface-variant font-label ml-1">類別 Category</label>
                                    <div class="relative group">
                                        <select class="w-full bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 rounded-xl py-4 pl-4 pr-10 text-on-background font-body appearance-none transition-all" id="tx-category" name="category">
                                            <option value="">載入中...</option>
                                        </select>
                                        <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Category Chips -->
                            <div class="flex flex-wrap gap-3 py-2" id="category-chips">
                                <div class="text-xs text-on-surface-variant animate-pulse">載入類別中...</div>
                            </div>

                            <!-- Notes -->
                            <div class="space-y-3">
                                <label class="text-xs font-semibold uppercase tracking-widest text-on-surface-variant font-label ml-1" for="tx-notes">備註 Notes</label>
                                <textarea class="w-full bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 rounded-xl py-4 px-4 text-on-background placeholder:text-on-surface-variant/40 font-body transition-all resize-none" id="tx-notes" name="notes" placeholder="新增此筆交易的詳細資訊..." rows="3"></textarea>
                            </div>

                            <!-- Submit Button -->
                            <div class="pt-6">
                                <button class="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg py-5 rounded-xl hover:shadow-[0_20px_40px_-15px_rgba(187,198,226,0.3)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3" type="submit" id="btn-confirm-tx">
                                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                                    確認記帳
                                </button>
                                <p class="text-center text-xs text-on-surface-variant mt-4 opacity-60">確認後將立即同步至您的 Private Ledger 帳本。</p>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Recent Entry Preview -->
                <div class="mt-12 opacity-70">
                    <div class="p-6 rounded-xl bg-surface-container-low/40 border border-outline-variant/10" id="recent-entry-card">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-[10px] font-bold tracking-[0.2em] text-secondary-fixed uppercase">Recent Entry</span>
                            <span class="text-[10px] font-medium text-on-surface-variant" id="recent-entry-time">—</span>
                        </div>
                        <div class="flex items-center gap-4" id="recent-entry-body">
                            <div class="text-xs text-on-surface-variant animate-pulse">載入中...</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Floating Monthly Net -->
            <div class="fixed bottom-8 right-8 hidden xl:flex items-center gap-4 p-4 rounded-2xl glass-effect shadow-2xl border border-outline-variant/5" id="monthly-net-widget">
                <div class="w-2 h-12 bg-primary rounded-full"></div>
                <div>
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">本月淨額</p>
                    <p class="text-xl font-headline font-black text-on-background" id="widget-net-amount">—</p>
                </div>
                <div class="ml-4 p-2 bg-primary/10 rounded-lg" id="widget-net-icon">
                    <span class="material-symbols-outlined text-primary text-xl">trending_up</span>
                </div>
            </div>
        </main>

        <!-- Mobile Navigation -->
        <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl flex justify-around items-center py-4 px-6 z-50 border-t border-outline-variant/10">
            <a class="flex flex-col items-center gap-1 text-on-background/60" href="#/dashboard">
                <span class="material-symbols-outlined text-2xl">dashboard</span>
                <span class="text-[10px] font-medium">Dash</span>
            </a>
            <a class="flex flex-col items-center gap-1 text-primary font-bold" href="#/add">
                <div class="bg-primary/20 p-2 -mt-10 rounded-full shadow-lg border-4 border-background">
                    <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">add_circle</span>
                </div>
                <span class="text-[10px] mt-1">Quick Add</span>
            </a>
            <a class="flex flex-col items-center gap-1 text-on-background/60" href="#/history">
                <span class="material-symbols-outlined text-2xl">history</span>
                <span class="text-[10px] font-medium">History</span>
            </a>
        </nav>`;

        _bindEvents();
        Sidebar.bindEvents();
        Topbar.bindSearchEvents();
    }

    function _bindEvents() {
        // 預設日期為今天
        const dateInput = document.getElementById('tx-date');
        if (dateInput) dateInput.valueAsDate = new Date();

        // 收入/支出切換
        document.getElementById('type-toggle').addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-type]');
            if (!btn) return;
            const type = btn.dataset.type;
            document.getElementById('tx-type').value = type;

            const expBtn = document.getElementById('btn-type-expense');
            const incBtn = document.getElementById('btn-type-income');
            if (type === 'Expense') {
                expBtn.className = 'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-error/20 text-error font-bold text-sm transition-all ring-2 ring-error';
                incBtn.className = 'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-high text-on-surface-variant font-bold text-sm transition-all';
            } else {
                incBtn.className = 'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary/20 text-secondary font-bold text-sm transition-all ring-2 ring-secondary';
                expBtn.className = 'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-high text-on-surface-variant font-bold text-sm transition-all';
            }
        });

        // 非同步：載入類別 + 最新交易 + 本月淨額
        _loadCategories();
        _loadLatestTransaction();
        _loadMonthlyNet();

        // 表單送出
        const form = document.getElementById('add-transaction-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const amount = parseFloat(document.getElementById('tx-amount').value);
                if (!amount || amount <= 0) return;

                const categoryId = parseInt(document.getElementById('tx-category').value);
                if (!categoryId) { alert('請選擇類別'); return; }

                const submitBtn = document.getElementById('btn-confirm-tx');
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`;

                try {
                    await API.post('/transactions', {
                        amount,
                        categoryId,
                        transactionDate: document.getElementById('tx-date').value,
                        type: document.getElementById('tx-type').value,
                        note: document.getElementById('tx-notes').value || null
                    });

                    submitBtn.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check</span> 記帳成功！`;
                    submitBtn.classList.add('from-secondary/40', 'to-secondary/40');

                    await _loadLatestTransaction();

                    setTimeout(() => {
                        form.reset();
                        if (dateInput) dateInput.valueAsDate = new Date();
                        document.getElementById('tx-type').value = 'Expense';
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span> 確認記帳`;
                        submitBtn.classList.remove('from-secondary/40', 'to-secondary/40');
                    }, 2000);
                } catch (err) {
                    alert(err.message || '記帳失敗，請稍後再試');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span> 確認記帳`;
                }
            });
        }
    }

    async function _loadCategories() {
        try {
            const data = await API.get('/categories');
            const categories = data?.categories ?? [];

            // 更新 select
            const select = document.getElementById('tx-category');
            select.innerHTML = categories.map(c =>
                `<option value="${c.categoryId}">${c.name}</option>`
            ).join('');

            // 更新 chips（最多顯示 6 個）
            const chips = document.getElementById('category-chips');
            chips.innerHTML = categories.slice(0, 6).map((c, i) =>
                `<button class="flex items-center gap-2 px-4 py-2 rounded-full ${i === 0 ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'} text-sm font-medium transition-all"
                    type="button" data-cat-id="${c.categoryId}">
                    <span class="material-symbols-outlined text-[18px]">${c.icon}</span>
                    ${c.name}
                </button>`
            ).join('');

            // Chips 點擊同步 select
            chips.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-cat-id]');
                if (!btn) return;
                chips.querySelectorAll('button').forEach(b => {
                    b.className = 'flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest text-sm font-medium transition-all';
                });
                btn.className = 'flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-medium transition-all shadow-lg shadow-primary/20';
                select.value = btn.dataset.catId;
            });
        } catch {
            document.getElementById('category-chips').innerHTML =
                '<span class="text-xs text-error">類別載入失敗</span>';
        }
    }

    async function _loadLatestTransaction() {
        try {
            const tx = await API.get('/transactions/latest');
            const body = document.getElementById('recent-entry-body');
            const timeEl = document.getElementById('recent-entry-time');
            if (!tx) {
                body.innerHTML = '<p class="text-xs text-on-surface-variant">尚無交易紀錄</p>';
                return;
            }
            const sign = tx.type === 'Expense' ? '-' : '+';
            const color = tx.type === 'Expense' ? 'text-error' : 'text-secondary';
            const date = new Date(tx.createdAt);
            timeEl.textContent = date.toLocaleDateString('zh-Hant', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            body.innerHTML = `
                <div class="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-primary">${tx.categoryIcon}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-headline font-bold truncate">${tx.categoryName}</h4>
                    <p class="text-xs text-on-surface-variant truncate">${tx.note || '—'}</p>
                </div>
                <div class="ml-auto text-right flex-shrink-0">
                    <p class="text-sm font-headline font-extrabold ${color}">${sign}$${tx.amount.toLocaleString()}</p>
                    <p class="text-[10px] text-on-surface-variant">${tx.transactionDate}</p>
                </div>`;
        } catch {
            // 靜默失敗，不影響主功能
        }
    }

    async function _loadMonthlyNet() {
        try {
            const data = await API.get('/dashboard/summary');
            const net  = data.netAmount;
            const isPositive = net >= 0;

            const amountEl = document.getElementById('widget-net-amount');
            const iconEl   = document.getElementById('widget-net-icon');
            if (!amountEl) return;

            const abs = Math.abs(Math.round(net)).toLocaleString();
            amountEl.textContent = `${isPositive ? '+' : '-'} NT$${abs}`;
            amountEl.className = `text-xl font-headline font-black ${isPositive ? 'text-secondary' : 'text-error'}`;

            iconEl.innerHTML = `<span class="material-symbols-outlined text-xl ${isPositive ? 'text-secondary' : 'text-error'}">${isPositive ? 'trending_up' : 'trending_down'}</span>`;
        } catch {
            // 靜默失敗
        }
    }

    return { render };
})();
