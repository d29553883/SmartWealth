/**
 * Portfolio Page - 投資組合頁
 * The Private Ledger
 */
const PortfolioPage = (() => {

    function render(container) {
        const route = '/portfolio';
        container.innerHTML = `
        ${Sidebar.render(route)}
        ${Topbar.render({ showBalance: false })}

        <main class="ml-64 pt-24 px-8 pb-12 max-w-7xl mx-auto">

            <!-- Loading -->
            <div id="portfolio-loading" class="flex items-center justify-center py-32 text-on-surface-variant">
                <span class="material-symbols-outlined animate-spin mr-3">progress_activity</span> 載入中...
            </div>

            <!-- Content (hidden until loaded) -->
            <div id="portfolio-content" class="hidden">

                <!-- Hero Stats -->
                <div class="grid grid-cols-12 gap-6 mb-12">
                    <div class="col-span-12 md:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between">
                        <div>
                            <p class="text-on-surface-variant font-medium text-sm tracking-widest mb-2 font-body uppercase">Portfolio Net Worth</p>
                            <h2 id="stat-total-value" class="text-5xl font-extrabold font-headline text-on-surface tracking-tight">—</h2>
                            <p id="stat-fx-rate" class="hidden text-xs text-on-surface-variant mt-1"></p>
                            <div class="mt-4 flex items-center gap-3">
                                <span id="stat-total-return" class="flex items-center font-bold font-body text-sm">—</span>
                                <span class="text-on-surface-variant text-xs">總報酬</span>
                                <span id="stat-total-cost" class="text-on-surface-variant text-xs ml-4">—</span>
                            </div>
                        </div>
                        <!-- Static decorative chart -->
                        <div class="mt-8 h-32 w-full relative opacity-30">
                            <svg class="w-full h-full overflow-visible" viewBox="0 0 800 100">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                        <stop offset="0%" stop-color="#bbc6e2" stop-opacity="0.4"></stop>
                                        <stop offset="100%" stop-color="#bbc6e2" stop-opacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,80 Q100,65 200,70 T400,30 T600,50 T800,10" fill="transparent" stroke="#bbc6e2" stroke-linecap="round" stroke-width="2.5"></path>
                                <path d="M0,80 Q100,65 200,70 T400,30 T600,50 T800,10 V100 H0 Z" fill="url(#chartGradient)"></path>
                                <circle cx="800" cy="10" fill="#bbc6e2" r="4"></circle>
                            </svg>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-4 flex flex-col gap-6">
                        <!-- Asset Allocation Donut -->
                        <div class="bg-surface-container rounded-xl p-6 flex-1 flex flex-col justify-center">
                            <p class="text-on-surface-variant text-xs font-body uppercase tracking-widest mb-4">Asset Allocation</p>
                            <div class="flex items-center justify-between">
                                <div class="relative w-24 h-24">
                                    <svg id="donut-chart" class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" fill="none" r="16" stroke="#2a2a2a" stroke-width="4"></circle>
                                    </svg>
                                </div>
                                <div id="donut-legend" class="flex-1 ml-6 space-y-2"></div>
                            </div>
                        </div>
                        <!-- Summary Cards -->
                        <div class="bg-primary rounded-xl p-6 flex-1 flex items-center justify-between">
                            <div>
                                <p class="text-on-primary/60 text-xs font-body uppercase tracking-widest mb-1">Holdings</p>
                                <h3 id="stat-count" class="text-on-primary text-3xl font-bold font-headline">0</h3>
                                <p class="text-on-primary/60 text-xs mt-1">個持倉</p>
                            </div>
                            <span class="material-symbols-outlined text-4xl text-on-primary/30">bar_chart</span>
                        </div>
                    </div>
                </div>

                <!-- Holdings List -->
                <div class="grid grid-cols-12 gap-8 mb-12">
                    <div class="col-span-12">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold font-headline">Core Holdings 核心持倉</h3>
                            <div class="flex gap-3">
                                <button id="btn-refresh-prices"
                                    class="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg text-sm font-semibold hover:bg-surface-container-high transition-colors">
                                    <span class="material-symbols-outlined text-base">sync</span> 刷新價格
                                </button>
                                <button id="btn-add-holding"
                                    class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                                    <span class="material-symbols-outlined text-base">add</span> 新增持倉
                                </button>
                            </div>
                        </div>

                        <!-- Empty state -->
                        <div id="holdings-empty" class="hidden bg-surface-container rounded-xl p-12 text-center text-on-surface-variant">
                            <span class="material-symbols-outlined text-5xl mb-4 block opacity-30">account_balance</span>
                            <p class="text-sm">尚無持倉紀錄，點右上角「新增持倉」開始建立投資組合</p>
                        </div>

                        <!-- Holdings table -->
                        <div id="holdings-list" class="space-y-3"></div>
                    </div>
                </div>

            </div>
        </main>

        <!-- Add Holding Modal -->
        <div id="modal-add-holding" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div class="bg-surface-container rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold font-headline">新增持倉</h3>
                    <button id="modal-close" class="text-on-surface-variant hover:text-on-surface">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form id="form-add-holding" class="space-y-4">
                    <!-- AssetType -->
                    <div>
                        <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5 block">資產類型</label>
                        <div class="flex gap-2 flex-wrap">
                            ${['Stock','Crypto','ETF','Bond','Other'].map((t, i) => `
                            <label class="cursor-pointer">
                                <input type="radio" name="assetType" value="${t}" class="sr-only peer" ${i === 0 ? 'checked' : ''}>
                                <span class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-highest text-on-surface-variant
                                    peer-checked:bg-primary peer-checked:text-on-primary transition-colors block">${t}</span>
                            </label>`).join('')}
                        </div>
                    </div>

                    <!-- Symbol -->
                    <div>
                        <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5 block">代碼 Symbol</label>
                        <div class="relative">
                            <input type="text" id="field-symbol" placeholder="AAPL"
                                class="w-full bg-surface-container-highest rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary uppercase pr-8"
                                maxlength="20">
                            <span id="symbol-status" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-base material-symbols-outlined hidden"></span>
                        </div>
                        <p id="err-symbol" class="hidden text-error text-[10px] mt-1"></p>
                    </div>

                    <!-- Name -->
                    <div>
                        <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5 block">名稱</label>
                        <input type="text" id="field-name" placeholder="Apple Inc."
                            class="w-full bg-surface-container-highest rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                            maxlength="100">
                        <p id="err-name" class="hidden text-error text-[10px] mt-1"></p>
                    </div>

                    <!-- Quantity + AvgCost row -->
                    <div class="flex gap-3">
                        <div class="flex-1">
                            <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5 block">數量</label>
                            <input type="number" id="field-quantity" placeholder="10" step="any"
                                class="w-full bg-surface-container-highest rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary">
                            <p id="err-quantity" class="hidden text-error text-[10px] mt-1"></p>
                        </div>
                        <div class="flex-1">
                            <label id="label-avg-cost" class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5 block">平均成本 ($)</label>
                            <input type="number" id="field-avg-cost" placeholder="150.00" step="any"
                                class="w-full bg-surface-container-highest rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary">
                            <p id="err-avg-cost" class="hidden text-error text-[10px] mt-1"></p>
                        </div>
                    </div>

                    <!-- Current Price -->
                    <div>
                        <label id="label-current-price" class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5 block">現價 ($)</label>
                        <input type="number" id="field-current-price" placeholder="189.43" step="any"
                            class="w-full bg-surface-container-highest rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary">
                        <p id="err-current-price" class="hidden text-error text-[10px] mt-1"></p>
                        <p class="text-[10px] text-on-surface-variant mt-1">新增後可點「刷新價格」從 Yahoo Finance 自動更新</p>
                    </div>

                    <!-- Submit error -->
                    <p id="form-error" class="hidden text-error text-xs font-semibold"></p>

                    <!-- Submit -->
                    <button type="submit" id="btn-submit-holding"
                        class="w-full bg-primary text-on-primary font-bold py-3 rounded-lg mt-2 text-sm hover:opacity-90 transition-opacity active:scale-95">
                        新增持倉
                    </button>
                </form>
            </div>
        </div>`;

        Sidebar.bindEvents();
        Topbar.bindSearchEvents();
        _bindEvents();
        _loadData();
    }

    // ─── Data Loading ──────────────────────────────────────────────

    async function _loadData() {
        try {
            const summary = await API.get('/holdings');
            _renderContent(summary);
        } catch (e) {
            document.getElementById('portfolio-loading').innerHTML =
                `<span class="text-error text-sm">載入失敗：${e.message}</span>`;
        }
    }

    function _renderContent(summary) {
        document.getElementById('portfolio-loading').classList.add('hidden');
        document.getElementById('portfolio-content').classList.remove('hidden');

        const { totalValue, totalCost, totalReturn, totalReturnPercent, holdings, exchangeRateUsdTwd } = summary;
        const isGain = totalReturn >= 0;

        // Hero stats
        document.getElementById('stat-total-value').textContent = _fmt(totalValue);

        // 匯率說明（有台股持倉時特別有意義）
        const fxEl = document.getElementById('stat-fx-rate');
        if (exchangeRateUsdTwd && fxEl) {
            fxEl.textContent = `折算 USD · 1 USD = NT$${exchangeRateUsdTwd.toFixed(1)}`;
            fxEl.classList.remove('hidden');
        }
        document.getElementById('stat-count').textContent = holdings.length;
        document.getElementById('stat-total-cost').textContent = `成本 ${_fmt(totalCost)}`;

        const returnEl = document.getElementById('stat-total-return');
        returnEl.innerHTML = `
            <span class="material-symbols-outlined text-base mr-1">${isGain ? 'trending_up' : 'trending_down'}</span>
            ${isGain ? '+' : ''}${_fmt(totalReturn)} (${isGain ? '+' : ''}${totalReturnPercent}%)
        `;
        returnEl.className = `flex items-center font-bold font-body text-sm ${isGain ? 'text-secondary' : 'text-error'}`;

        // Donut chart
        _renderDonut(holdings);

        // Holdings list
        const listEl = document.getElementById('holdings-list');
        const emptyEl = document.getElementById('holdings-empty');

        if (holdings.length === 0) {
            listEl.innerHTML = '';
            emptyEl.classList.remove('hidden');
        } else {
            emptyEl.classList.add('hidden');
            listEl.innerHTML = holdings.map(_renderHoldingRow).join('');
            // Bind delete buttons
            listEl.querySelectorAll('[data-delete-id]').forEach(btn => {
                btn.addEventListener('click', () => _deleteHolding(+btn.dataset.deleteId, btn.dataset.deleteName));
            });
        }
    }

    function _renderHoldingRow(h) {
        const isGain = h.returnPercent >= 0;
        const returnColor = isGain ? 'text-secondary' : 'text-error';
        const icon = h.icon || h.symbol.charAt(0);

        return `
        <div class="bg-surface-container rounded-xl p-4 flex items-center hover:bg-surface-container-high transition-colors group">
            <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center mr-4 text-lg font-bold shrink-0">
                ${icon}
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-sm">${h.symbol}</h4>
                <p class="text-xs text-on-surface-variant truncate">${h.name}</p>
            </div>
            <div class="flex-1 text-right">
                <p class="text-sm font-semibold">${_fmtC(h.currentPrice, h.currency)}</p>
                <p class="text-xs text-on-surface-variant">${h.assetType}</p>
            </div>
            <div class="flex-1 text-right">
                <p class="text-sm font-semibold">${h.quantity % 1 === 0 ? h.quantity.toFixed(0) : h.quantity}</p>
                <p class="text-xs text-on-surface-variant">數量</p>
            </div>
            <div class="flex-1 text-right">
                <p class="text-sm font-bold font-headline">${_fmtC(h.totalValue, h.currency)}</p>
                <p class="text-xs ${returnColor}">${isGain ? '+' : ''}${h.returnPercent}%</p>
            </div>
            <button data-delete-id="${h.holdingId}" data-delete-name="${h.symbol}"
                class="ml-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-error/10 text-error shrink-0"
                title="刪除">
                <span class="material-symbols-outlined text-base pointer-events-none">delete</span>
            </button>
        </div>`;
    }

    // ─── Donut Chart ───────────────────────────────────────────────

    const TYPE_COLORS = {
        Stock:  '#bbc6e2',
        Crypto: '#4edea3',
        ETF:    '#f4a261',
        Bond:   '#e76f51',
        Other:  '#9e9e9e',
    };

    function _renderDonut(holdings) {
        const totalValue = holdings.reduce((s, h) => s + h.totalValue, 0);
        const groups = {};
        holdings.forEach(h => {
            groups[h.assetType] = (groups[h.assetType] || 0) + h.totalValue;
        });

        const svg = document.getElementById('donut-chart');
        const legend = document.getElementById('donut-legend');

        if (totalValue === 0 || holdings.length === 0) {
            legend.innerHTML = '<p class="text-xs text-on-surface-variant">尚無資料</p>';
            return;
        }

        const segments = Object.entries(groups).map(([type, val]) => ({
            type, val,
            pct: val / totalValue * 100,
            color: TYPE_COLORS[type] || '#9e9e9e'
        }));

        // Build circles (circumference ≈ 100.53, we use 100 as base)
        let offset = 25; // start at 12 o'clock
        const circles = segments.map(seg => {
            const circle = `<circle cx="18" cy="18" fill="none" r="16"
                stroke="${seg.color}"
                stroke-dasharray="${seg.pct.toFixed(2)}, 100"
                stroke-dashoffset="${offset.toFixed(2)}"
                stroke-width="4"></circle>`;
            offset += seg.pct;
            return circle;
        });

        svg.innerHTML = `
            <circle cx="18" cy="18" fill="none" r="16" stroke="#2a2a2a" stroke-width="4"></circle>
            ${circles.join('')}`;

        legend.innerHTML = segments.map(seg => `
            <div class="flex items-center justify-between text-xs">
                <span class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full shrink-0" style="background:${seg.color}"></span>
                    ${seg.type}
                </span>
                <span class="text-on-surface font-semibold ml-3">${seg.pct.toFixed(1)}%</span>
            </div>`).join('');
    }

    // ─── Delete ────────────────────────────────────────────────────

    async function _deleteHolding(id, name) {
        if (!confirm(`確定要刪除 ${name} 嗎？`)) return;
        try {
            await API.delete(`/holdings/${id}`);
            _loadData();
        } catch (e) {
            alert(`刪除失敗：${e.message}`);
        }
    }

    // ─── Refresh Prices ────────────────────────────────────────────

    async function _refreshPrices() {
        const btn = document.getElementById('btn-refresh-prices');
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined text-base animate-spin">progress_activity</span> 更新中...`;
        try {
            const result = await API.post('/holdings/refresh-prices');
            await _loadData();
            btn.innerHTML = `<span class="material-symbols-outlined text-base">check</span> 已更新 ${result?.updated ?? 0} 筆`;
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = `<span class="material-symbols-outlined text-base">sync</span> 刷新價格`;
            }, 2500);
        } catch (e) {
            btn.disabled = false;
            btn.innerHTML = `<span class="material-symbols-outlined text-base">sync</span> 刷新價格`;
            alert(`刷新失敗：${e.message}`);
        }
    }

    // ─── Add Holding Modal ─────────────────────────────────────────

    const FIELD_ERR_IDS = ['err-symbol', 'err-name', 'err-quantity', 'err-avg-cost', 'err-current-price'];

    function _showFieldErr(id, msg) {
        const el = document.getElementById(id);
        el.textContent = msg;
        el.classList.remove('hidden');
    }

    function _clearFieldErrors() {
        FIELD_ERR_IDS.forEach(id => document.getElementById(id).classList.add('hidden'));
        document.getElementById('form-error').classList.add('hidden');
    }

    function _highlightInput(id, invalid) {
        const el = document.getElementById(id);
        el.classList.toggle('ring-1', invalid);
        el.classList.toggle('ring-error', invalid);
    }

    function _openModal() {
        document.getElementById('modal-add-holding').classList.remove('hidden');
        document.getElementById('form-add-holding').reset();
        _clearFieldErrors();
        FIELD_ERR_IDS.forEach(errId => {
            const inputId = 'field-' + errId.replace('err-', '');
            _highlightInput(inputId, false);
        });
        document.getElementById('symbol-status').classList.add('hidden');
        // 重置為預設 assetType（Stock）並更新 placeholder
        const firstRadio = document.querySelector('input[name="assetType"]');
        if (firstRadio) firstRadio.checked = true;
        _updatePlaceholders('Stock');
        document.getElementById('field-symbol').focus();
    }

    function _closeModal() {
        document.getElementById('modal-add-holding').classList.add('hidden');
    }

    async function _submitHolding(e) {
        e.preventDefault();
        _clearFieldErrors();

        const assetType = document.querySelector('input[name="assetType"]:checked')?.value || 'Stock';
        const symbol    = document.getElementById('field-symbol').value.trim().toUpperCase();
        const name      = document.getElementById('field-name').value.trim();
        const icon      = { Stock: '📈', Crypto: '🪙', ETF: '📊', Bond: '📋', Other: '💼' }[assetType] ?? '💼';
        const quantityRaw  = document.getElementById('field-quantity').value.trim();
        const avgCostRaw   = document.getElementById('field-avg-cost').value.trim();
        const curPriceRaw  = document.getElementById('field-current-price').value.trim();
        const quantity  = parseFloat(quantityRaw);
        const avgCost   = parseFloat(avgCostRaw);
        const curPrice  = parseFloat(curPriceRaw);

        // ── 逐欄位驗證 ──
        let hasError = false;

        if (!symbol) {
            _showFieldErr('err-symbol', '請輸入代碼');
            _highlightInput('field-symbol', true);
            hasError = true;
        } else if (!/^[A-Z0-9\-\.]{1,20}$/.test(symbol)) {
            _showFieldErr('err-symbol', '代碼只能包含英文字母、數字、- 或 .，最多 20 字元');
            _highlightInput('field-symbol', true);
            hasError = true;
        } else {
            // 確認 symbol 狀態圖示是否為錯誤（cancel）
            const statusEl = document.getElementById('symbol-status');
            if (statusEl.textContent === 'cancel') {
                _showFieldErr('err-symbol', '此 symbol 無效，請重新確認');
                _highlightInput('field-symbol', true);
                hasError = true;
            }
        }

        if (!name) {
            _showFieldErr('err-name', '請輸入名稱');
            _highlightInput('field-name', true);
            hasError = true;
        } else if (name.length > 100) {
            _showFieldErr('err-name', '名稱最多 100 個字元');
            _highlightInput('field-name', true);
            hasError = true;
        }

        if (!quantityRaw) {
            _showFieldErr('err-quantity', '請輸入數量');
            _highlightInput('field-quantity', true);
            hasError = true;
        } else if (isNaN(quantity) || quantity <= 0) {
            _showFieldErr('err-quantity', '數量必須大於 0');
            _highlightInput('field-quantity', true);
            hasError = true;
        }

        if (!avgCostRaw) {
            _showFieldErr('err-avg-cost', '請輸入平均成本');
            _highlightInput('field-avg-cost', true);
            hasError = true;
        } else if (isNaN(avgCost) || avgCost <= 0) {
            _showFieldErr('err-avg-cost', '平均成本必須大於 0');
            _highlightInput('field-avg-cost', true);
            hasError = true;
        }

        if (!curPriceRaw) {
            _showFieldErr('err-current-price', '請輸入現價');
            _highlightInput('field-current-price', true);
            hasError = true;
        } else if (isNaN(curPrice) || curPrice <= 0) {
            _showFieldErr('err-current-price', '現價必須大於 0');
            _highlightInput('field-current-price', true);
            hasError = true;
        }

        if (hasError) return;

        // ── 送出 ──
        const btn = document.getElementById('btn-submit-holding');
        btn.disabled = true;
        btn.textContent = '新增中...';

        try {
            await API.post('/holdings', {
                symbol, name, assetType, quantity,
                averageCost: avgCost,
                currentPrice: curPrice,
                icon
            });
            _closeModal();
            _loadData();
        } catch (err) {
            const errEl = document.getElementById('form-error');
            errEl.textContent = err.message || '新增失敗，請稍後再試';
            errEl.classList.remove('hidden');
        } finally {
            btn.disabled = false;
            btn.textContent = '新增持倉';
        }
    }

    // ─── Events ────────────────────────────────────────────────────

    // Symbol 失焦時：呼叫後端驗證 + 自動帶入現價
    async function _onSymbolBlur() {
        const symbolEl   = document.getElementById('field-symbol');
        const statusEl   = document.getElementById('symbol-status');
        const errEl      = document.getElementById('err-symbol');
        const priceEl    = document.getElementById('field-current-price');
        const assetType  = document.querySelector('input[name="assetType"]:checked')?.value || 'Stock';
        const symbol     = symbolEl.value.trim().toUpperCase();

        if (!symbol) return;

        // 格式先過一遍
        if (!/^[A-Z0-9\-\.]{1,20}$/.test(symbol)) return;

        // 顯示 loading
        statusEl.textContent = 'progress_activity';
        statusEl.className = 'absolute right-2.5 top-1/2 -translate-y-1/2 text-base material-symbols-outlined text-on-surface-variant animate-spin';

        try {
            const result = await API.get(`/holdings/verify-symbol?symbol=${encodeURIComponent(symbol)}&assetType=${assetType}`);

            if (result?.valid) {
                statusEl.textContent = 'check_circle';
                statusEl.className = 'absolute right-2.5 top-1/2 -translate-y-1/2 text-base material-symbols-outlined text-secondary';
                errEl.classList.add('hidden');
                _highlightInput('field-symbol', false);
                // 驗證成功後自動帶入現價（覆寫舊值，確保切換 symbol 後價格正確）
                priceEl.value = result.currentPrice;
                // 依 symbol 動態更新幣別 label
                const isTw = /^\d{4,6}$/.test(symbol);
                const currLabel = isTw ? 'NT$' : '$';
                document.getElementById('label-avg-cost').textContent = `平均成本 (${currLabel})`;
                document.getElementById('label-current-price').textContent = `現價 (${currLabel})`;
            } else {
                statusEl.textContent = 'cancel';
                statusEl.className = 'absolute right-2.5 top-1/2 -translate-y-1/2 text-base material-symbols-outlined text-error';
                _showFieldErr('err-symbol', result?.message || '找不到此 symbol');
                _highlightInput('field-symbol', true);
            }
        } catch {
            // 網路錯誤時不擋使用者，靜默忽略
            statusEl.classList.add('hidden');
        }
    }

    const ASSET_PLACEHOLDERS = {
        Stock:  { symbol: 'AAPL 或 2330', name: 'Apple Inc. / 台積電',           quantity: '10',  avgCost: '150.00' },
        Crypto: { symbol: 'BTC',  name: 'Bitcoin',                             quantity: '0.5', avgCost: '60000.00' },
        ETF:    { symbol: 'QQQ',  name: 'Invesco QQQ Trust',                   quantity: '10',  avgCost: '400.00' },
        Bond:   { symbol: 'TLT',  name: 'iShares 20+ Year Treasury Bond ETF',  quantity: '10',  avgCost: '90.00' },
        Other:  { symbol: 'GLD',  name: 'SPDR Gold Shares',                    quantity: '10',  avgCost: '200.00' },
    };

    function _updatePlaceholders(assetType) {
        const p = ASSET_PLACEHOLDERS[assetType] || ASSET_PLACEHOLDERS.Stock;
        document.getElementById('field-symbol').placeholder   = p.symbol;
        document.getElementById('field-name').placeholder     = p.name;
        document.getElementById('field-quantity').placeholder = p.quantity;
        document.getElementById('field-avg-cost').placeholder = p.avgCost;
        // 切換類型時重置 label（切換後 symbol 還不知道是哪個幣別）
        document.getElementById('label-avg-cost').textContent      = '平均成本 ($)';
        document.getElementById('label-current-price').textContent = '現價 ($)';
    }

    function _bindEvents() {
        document.getElementById('btn-add-holding').addEventListener('click', _openModal);
        document.getElementById('modal-close').addEventListener('click', _closeModal);
        document.getElementById('modal-add-holding').addEventListener('click', e => {
            if (e.target === e.currentTarget) _closeModal();
        });
        document.getElementById('form-add-holding').addEventListener('submit', _submitHolding);
        document.getElementById('btn-refresh-prices').addEventListener('click', _refreshPrices);
        // Symbol 欄位：輸入時清空現價（避免切換 symbol 後舊價殘留），blur 時驗證
        document.getElementById('field-symbol').addEventListener('input', () => {
            document.getElementById('field-current-price').value = '';
        });
        document.getElementById('field-symbol').addEventListener('blur', _onSymbolBlur);
        // 切換 assetType：更新 placeholder + 重觸發 symbol 驗證
        document.querySelectorAll('input[name="assetType"]').forEach(radio => {
            radio.addEventListener('change', () => {
                _updatePlaceholders(radio.value);
                // 清除舊的驗證狀態（切換類型後 symbol 要重新驗證）
                const statusEl = document.getElementById('symbol-status');
                statusEl.classList.add('hidden');
                document.getElementById('err-symbol').classList.add('hidden');
                _highlightInput('field-symbol', false);
                const sym = document.getElementById('field-symbol').value.trim();
                if (sym) _onSymbolBlur();
            });
        });
    }

    // ─── Helpers ───────────────────────────────────────────────────

    function _fmt(val) {
        if (val == null) return '—';
        const absVal = Math.abs(val);
        const sign = val < 0 ? '-' : '';
        if (absVal >= 1_000_000) return `${sign}$${(absVal / 1_000_000).toFixed(2)}M`;
        if (absVal >= 1_000)    return `${sign}$${(absVal / 1_000).toFixed(2)}K`;
        return `${sign}$${absVal.toFixed(2)}`;
    }

    // 幣別感知格式化：TWD 顯示 NT$，其餘顯示 $
    function _fmtC(val, currency) {
        if (val == null) return '—';
        const sym = currency === 'TWD' ? 'NT$' : '$';
        const absVal = Math.abs(val);
        const sign = val < 0 ? '-' : '';
        if (absVal >= 1_000_000) return `${sign}${sym}${(absVal / 1_000_000).toFixed(2)}M`;
        if (absVal >= 1_000)     return `${sign}${sym}${(absVal / 1_000).toFixed(2)}K`;
        return `${sign}${sym}${absVal.toFixed(2)}`;
    }

    return { render };
})();
