/**
 * Price Alerts Page - 股價預警頁
 * The Private Ledger
 */
const PriceAlertsPage = (() => {

    function render(container) {
        const route = '/price-alerts';
        container.innerHTML = `
        ${Sidebar.render(route)}
        ${Topbar.render({ showBalance: false })}

        <main class="ml-64 pt-24 px-8 pb-12 max-w-5xl mx-auto">

            <!-- Loading -->
            <div id="alerts-loading" class="flex items-center justify-center py-32 text-on-surface-variant">
                <span class="material-symbols-outlined animate-spin mr-3">progress_activity</span> 載入中...
            </div>

            <!-- Content -->
            <div id="alerts-content" class="hidden">

                <!-- Page Header -->
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl font-extrabold font-headline tracking-tight">Price Alerts 股價預警</h2>
                        <p class="text-on-surface-variant text-sm mt-1">股價到達設定目標時，自動寄送 Email 通知</p>
                    </div>
                    <button id="btn-add-alert"
                        class="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95">
                        <span class="material-symbols-outlined text-base">add_alert</span> 新增預警
                    </button>
                </div>

                <!-- Stats row -->
                <div class="grid grid-cols-3 gap-4 mb-8">
                    <div class="bg-surface-container-low rounded-xl p-5">
                        <p class="text-on-surface-variant text-xs uppercase tracking-widest mb-1">總預警數</p>
                        <h3 id="stat-total" class="text-3xl font-extrabold font-headline">—</h3>
                    </div>
                    <div class="bg-surface-container-low rounded-xl p-5">
                        <p class="text-on-surface-variant text-xs uppercase tracking-widest mb-1">監控中</p>
                        <h3 id="stat-active" class="text-3xl font-extrabold font-headline text-secondary">—</h3>
                    </div>
                    <div class="bg-surface-container-low rounded-xl p-5">
                        <p class="text-on-surface-variant text-xs uppercase tracking-widest mb-1">已觸發</p>
                        <h3 id="stat-triggered" class="text-3xl font-extrabold font-headline text-on-surface-variant">—</h3>
                    </div>
                </div>

                <!-- Empty state -->
                <div id="alerts-empty" class="hidden bg-surface-container rounded-xl p-16 text-center text-on-surface-variant">
                    <span class="material-symbols-outlined text-5xl mb-4 block opacity-30">notifications_off</span>
                    <p class="text-sm">尚無預警設定，點右上角「新增預警」開始監控股價</p>
                </div>

                <!-- Alerts list -->
                <div id="alerts-list" class="space-y-3"></div>

            </div>
        </main>

        <!-- Add Alert Modal -->
        <div id="modal-add-alert" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div class="bg-surface-container rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold font-headline">新增預警</h3>
                    <button id="modal-close" class="text-on-surface-variant hover:text-on-surface">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form id="form-add-alert" class="space-y-5">
                    <!-- Symbol -->
                    <div>
                        <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5 block">股票代碼</label>
                        <input type="text" id="alert-symbol" placeholder="AAPL"
                            class="w-full bg-surface-container-highest rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary uppercase"
                            maxlength="20" autocomplete="off">
                        <p id="err-alert-symbol" class="hidden text-error text-[10px] mt-1"></p>
                    </div>

                    <!-- Condition -->
                    <div>
                        <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5 block">觸發條件</label>
                        <div class="flex gap-2">
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="alertCondition" value="Below" class="sr-only peer" checked>
                                <span class="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold
                                    bg-surface-container-highest text-on-surface-variant
                                    peer-checked:bg-error/20 peer-checked:text-error peer-checked:border peer-checked:border-error/40
                                    transition-colors block w-full text-center">
                                    <span class="material-symbols-outlined text-base">trending_down</span> 跌破
                                </span>
                            </label>
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="alertCondition" value="Above" class="sr-only peer">
                                <span class="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold
                                    bg-surface-container-highest text-on-surface-variant
                                    peer-checked:bg-secondary/20 peer-checked:text-secondary peer-checked:border peer-checked:border-secondary/40
                                    transition-colors block w-full text-center">
                                    <span class="material-symbols-outlined text-base">trending_up</span> 漲破
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Target Price -->
                    <div>
                        <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5 block">目標價格</label>
                        <input type="number" id="alert-target-price" placeholder="180.00" step="any"
                            class="w-full bg-surface-container-highest rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary">
                        <p id="err-alert-price" class="hidden text-error text-[10px] mt-1"></p>
                    </div>

                    <p id="form-alert-error" class="hidden text-error text-xs font-semibold"></p>

                    <button type="submit" id="btn-submit-alert"
                        class="w-full bg-primary text-on-primary font-bold py-3 rounded-lg text-sm hover:opacity-90 transition-opacity active:scale-95">
                        建立預警
                    </button>
                </form>
            </div>
        </div>`;

        Sidebar.bindEvents();
        Topbar.bindSearchEvents();
        _bindEvents();
        _loadData();
    }

    // ─── Data ──────────────────────────────────────────────────────

    async function _loadData() {
        try {
            const alerts = await API.get('/price-alerts');
            _renderContent(alerts);
        } catch (e) {
            document.getElementById('alerts-loading').innerHTML =
                `<span class="text-error text-sm">載入失敗：${e.message}</span>`;
        }
    }

    function _renderContent(alerts) {
        document.getElementById('alerts-loading').classList.add('hidden');
        document.getElementById('alerts-content').classList.remove('hidden');

        const activeCount    = alerts.filter(a => a.isActive).length;
        const triggeredCount = alerts.length - activeCount;

        document.getElementById('stat-total').textContent     = alerts.length;
        document.getElementById('stat-active').textContent    = activeCount;
        document.getElementById('stat-triggered').textContent = triggeredCount;

        const listEl  = document.getElementById('alerts-list');
        const emptyEl = document.getElementById('alerts-empty');

        if (alerts.length === 0) {
            listEl.innerHTML = '';
            emptyEl.classList.remove('hidden');
        } else {
            emptyEl.classList.add('hidden');
            listEl.innerHTML = alerts.map(_renderAlertRow).join('');
            listEl.querySelectorAll('[data-delete-id]').forEach(btn => {
                btn.addEventListener('click', () => _deleteAlert(+btn.dataset.deleteId, btn.dataset.deleteSymbol));
            });
        }
    }

    function _renderAlertRow(a) {
        const isBelow      = a.condition === 'Below';
        const condLabel    = isBelow ? '跌破' : '漲破';
        const condIcon     = isBelow ? 'trending_down' : 'trending_up';
        const condColor    = isBelow ? 'text-error' : 'text-secondary';
        const condBg       = isBelow ? 'bg-error/10' : 'bg-secondary/10';
        const statusLabel  = a.isActive ? '監控中' : '已觸發';
        const statusColor  = a.isActive ? 'text-secondary' : 'text-on-surface-variant';
        const statusDot    = a.isActive ? 'bg-secondary' : 'bg-on-surface-variant/40';

        return `
        <div class="bg-surface-container rounded-xl p-4 flex items-center hover:bg-surface-container-high transition-colors group">
            <!-- Symbol -->
            <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center mr-4 shrink-0">
                <span class="material-symbols-outlined text-base text-primary">notifications_active</span>
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-sm">${a.symbol}</h4>
                <p class="text-xs text-on-surface-variant">${new Date(a.createdAt).toLocaleDateString('zh-TW')}</p>
            </div>

            <!-- Condition -->
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg ${condBg} mr-4">
                <span class="material-symbols-outlined text-base ${condColor}">${condIcon}</span>
                <span class="text-sm font-semibold ${condColor}">${condLabel}</span>
                <span class="text-sm font-bold">${_fmtPrice(a.targetPrice)}</span>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-2 w-20 justify-end mr-6">
                <span class="w-1.5 h-1.5 rounded-full ${statusDot}"></span>
                <span class="text-xs ${statusColor}">${statusLabel}</span>
            </div>

            <!-- Delete -->
            <button data-delete-id="${a.alertId}" data-delete-symbol="${a.symbol}"
                class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-error/10 text-error shrink-0"
                title="刪除">
                <span class="material-symbols-outlined text-base pointer-events-none">delete</span>
            </button>
        </div>`;
    }

    // ─── Delete ────────────────────────────────────────────────────

    async function _deleteAlert(id, symbol) {
        if (!confirm(`確定要刪除 ${symbol} 的預警嗎？`)) return;
        try {
            await API.delete(`/price-alerts/${id}`);
            _loadData();
        } catch (e) {
            alert(`刪除失敗：${e.message}`);
        }
    }

    // ─── Modal ─────────────────────────────────────────────────────

    function _openModal() {
        document.getElementById('modal-add-alert').classList.remove('hidden');
        document.getElementById('form-add-alert').reset();
        _clearErrors();
        document.getElementById('alert-symbol').focus();
    }

    function _closeModal() {
        document.getElementById('modal-add-alert').classList.add('hidden');
    }

    function _clearErrors() {
        ['err-alert-symbol', 'err-alert-price', 'form-alert-error'].forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
        ['alert-symbol', 'alert-target-price'].forEach(id => {
            document.getElementById(id).classList.remove('ring-1', 'ring-error');
        });
    }

    async function _submitAlert(e) {
        e.preventDefault();
        _clearErrors();

        const symbol      = document.getElementById('alert-symbol').value.trim().toUpperCase();
        const condition   = document.querySelector('input[name="alertCondition"]:checked')?.value || 'Below';
        const priceRaw    = document.getElementById('alert-target-price').value.trim();
        const targetPrice = parseFloat(priceRaw);

        let hasError = false;

        if (!symbol) {
            _showErr('err-alert-symbol', '請輸入股票代碼');
            document.getElementById('alert-symbol').classList.add('ring-1', 'ring-error');
            hasError = true;
        } else if (!/^[A-Z0-9\-\.]{1,20}$/.test(symbol)) {
            _showErr('err-alert-symbol', '代碼只能包含英文、數字、- 或 .');
            document.getElementById('alert-symbol').classList.add('ring-1', 'ring-error');
            hasError = true;
        }

        if (!priceRaw) {
            _showErr('err-alert-price', '請輸入目標價格');
            document.getElementById('alert-target-price').classList.add('ring-1', 'ring-error');
            hasError = true;
        } else if (isNaN(targetPrice) || targetPrice <= 0) {
            _showErr('err-alert-price', '目標價格必須大於 0');
            document.getElementById('alert-target-price').classList.add('ring-1', 'ring-error');
            hasError = true;
        }

        if (hasError) return;

        const btn = document.getElementById('btn-submit-alert');
        btn.disabled  = true;
        btn.textContent = '建立中...';

        try {
            await API.post('/price-alerts', { symbol, condition, targetPrice });
            _closeModal();
            _loadData();
        } catch (err) {
            _showErr('form-alert-error', err.message || '建立失敗，請稍後再試');
        } finally {
            btn.disabled    = false;
            btn.textContent = '建立預警';
        }
    }

    function _showErr(id, msg) {
        const el = document.getElementById(id);
        el.textContent = msg;
        el.classList.remove('hidden');
    }

    // ─── Events ────────────────────────────────────────────────────

    function _bindEvents() {
        document.getElementById('btn-add-alert').addEventListener('click', _openModal);
        document.getElementById('modal-close').addEventListener('click', _closeModal);
        document.getElementById('modal-add-alert').addEventListener('click', e => {
            if (e.target === e.currentTarget) _closeModal();
        });
        document.getElementById('form-add-alert').addEventListener('submit', _submitAlert);
    }

    // ─── Helpers ───────────────────────────────────────────────────

    function _fmtPrice(val) {
        if (val == null) return '—';
        return val >= 1000 ? `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `$${val.toFixed(2)}`;
    }

    return { render };
})();
