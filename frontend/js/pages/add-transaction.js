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
                                            <option value="investment">投資物業 Investment</option>
                                            <option value="luxury">奢侈品 Luxury</option>
                                            <option value="dining">餐飲美食 Fine Dining</option>
                                            <option value="travel">全球旅行 Travel</option>
                                            <option value="health">健康醫療 Health</option>
                                            <option value="other">其他支出 Other</option>
                                        </select>
                                        <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Category Chips -->
                            <div class="flex flex-wrap gap-4 py-2" id="category-chips">
                                <button class="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-medium transition-all shadow-lg shadow-primary/20" type="button" data-cat="investment">
                                    <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">account_balance</span>
                                    Investment
                                </button>
                                <button class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest text-sm font-medium transition-all" type="button" data-cat="luxury">
                                    <span class="material-symbols-outlined text-[20px]">diamond</span>
                                    Luxury
                                </button>
                                <button class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest text-sm font-medium transition-all" type="button" data-cat="dining">
                                    <span class="material-symbols-outlined text-[20px]">restaurant</span>
                                    Dining
                                </button>
                                <button class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest text-sm font-medium transition-all" type="button" data-cat="travel">
                                    <span class="material-symbols-outlined text-[20px]">flight</span>
                                    Travel
                                </button>
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
                <div class="mt-12 flex flex-col md:flex-row gap-6 items-start opacity-70">
                    <div class="flex-1 p-6 rounded-xl bg-surface-container-low/40 border border-outline-variant/10">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-[10px] font-bold tracking-[0.2em] text-secondary-fixed uppercase">Recent Entry</span>
                            <span class="text-[10px] font-medium text-on-surface-variant">2 mins ago</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                                <span class="material-symbols-outlined text-secondary">shopping_bag</span>
                            </div>
                            <div>
                                <h4 class="text-sm font-headline font-bold">Harrods London</h4>
                                <p class="text-xs text-on-surface-variant">Personal Acquisition</p>
                            </div>
                            <div class="ml-auto text-right">
                                <p class="text-sm font-headline font-extrabold text-on-background">-$2,450.00</p>
                                <p class="text-[10px] text-on-surface-variant">Checking • 8824</p>
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-48 aspect-video md:aspect-square rounded-xl overflow-hidden relative group">
                        <img alt="裝飾圖" class="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-700" src="assets/images/quick-add-decor.png" />
                        <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
                        <div class="absolute bottom-3 left-3">
                            <p class="text-[10px] font-bold text-white/50 tracking-tighter">ESTATE INDEX</p>
                            <p class="text-xs font-bold text-secondary">+4.2%</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Floating Data Tooltip -->
            <div class="fixed bottom-8 right-8 hidden xl:flex items-center gap-4 p-4 rounded-2xl glass-effect shadow-2xl border border-outline-variant/5">
                <div class="w-2 h-12 bg-primary rounded-full"></div>
                <div>
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Monthly Liquidity</p>
                    <p class="text-xl font-headline font-black text-on-background">$142,500.40</p>
                </div>
                <div class="ml-4 p-2 bg-primary/10 rounded-lg">
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
    }

    function _bindEvents() {
        // Set default date to today
        const dateInput = document.getElementById('tx-date');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }

        // Category chips toggle
        const chipsContainer = document.getElementById('category-chips');
        const categorySelect = document.getElementById('tx-category');
        if (chipsContainer) {
            chipsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                chipsContainer.querySelectorAll('button').forEach(b => {
                    b.className = 'flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest text-sm font-medium transition-all';
                });
                btn.className = 'flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-medium transition-all shadow-lg shadow-primary/20';

                // Sync select
                if (categorySelect) {
                    categorySelect.value = btn.dataset.cat;
                }
            });
        }

        // Form submission
        const form = document.getElementById('add-transaction-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const amount = document.getElementById('tx-amount').value;
                if (!amount || parseFloat(amount) <= 0) return;

                // Show success feedback
                const btn = document.getElementById('btn-confirm-tx');
                btn.innerHTML = '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1;">check</span> 記帳成功！';
                btn.classList.add('from-secondary-container', 'to-secondary-container');

                setTimeout(() => {
                    form.reset();
                    if (dateInput) dateInput.valueAsDate = new Date();
                    btn.innerHTML = '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1;">check_circle</span> 確認記帳';
                    btn.classList.remove('from-secondary-container', 'to-secondary-container');
                }, 2000);
            });
        }
    }

    return { render };
})();
