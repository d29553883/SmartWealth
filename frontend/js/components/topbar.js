/**
 * Topbar.js - 頂部搜尋列元件
 * The Private Ledger Design System
 */
const Topbar = (() => {

    function render(options = {}) {
        const currentUser = Auth.getUser();
        const { userName = currentUser?.fullName ?? '用戶', showBalance = false, balance = '', hideSearch = false } = options;
        const userEmail = currentUser?.email ?? '';

        return `
        <header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-background/60 backdrop-blur-md flex justify-between items-center px-8 font-body text-sm tracking-wide" id="topbar">
            <div class="flex items-center gap-6">
                ${hideSearch ? '' : `<div class="relative group">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                    <input
                        class="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary/40 placeholder:text-on-surface-variant/50 text-on-surface"
                        placeholder="搜尋資產、交易紀錄..."
                        type="text"
                        id="topbar-search"
                    />
                </div>`}
            </div>
            <div class="flex items-center gap-5">
                <!-- 推播通知：功能待實作，暫時隱藏
                <button class="text-primary hover:text-primary transition-colors relative" id="topbar-notifications">
                    <span class="material-symbols-outlined">notifications</span>
                    <span class="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full border-2 border-background"></span>
                </button>
                -->
                <div class="relative pl-4 border-l border-outline-variant/20" id="topbar-user-menu">
                    <button class="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer" id="topbar-user-toggle" aria-label="使用者選單">
                        ${showBalance
                            ? `<span class="text-xs font-body text-on-surface-variant">帳戶餘額: <span class="text-on-surface font-semibold">${balance}</span></span>`
                            : `<p class="text-xs font-bold text-on-background">${userName}</p>`
                        }
                        <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center ring-2 ring-transparent transition-all" id="topbar-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-on-primary-container" aria-hidden="true">
                                <circle cx="12" cy="8" r="4"/>
                                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/>
                            </svg>
                        </div>
                    </button>
                    <!-- User dropdown -->
                    <div class="absolute right-0 top-full mt-3 w-56 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant/30 py-1 hidden" id="topbar-user-dropdown">
                        <div class="px-4 py-3 border-b border-outline-variant/20">
                            <p class="text-xs font-bold text-on-background truncate">${userName}</p>
                            <p class="text-[10px] text-on-surface-variant mt-0.5 truncate">${userEmail}</p>
                        </div>
                        <button id="topbar-logout-btn" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-error/80 hover:text-error hover:bg-surface-container text-xs font-semibold transition-colors cursor-pointer">
                            <span class="material-symbols-outlined text-sm">logout</span>
                            登出帳號
                        </button>
                    </div>
                </div>
            </div>
        </header>`;
    }

    function bindSearchEvents() {
        const input = document.getElementById('topbar-search');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter') return;
                const q = input.value.trim();
                if (!q) return;
                sessionStorage.setItem('tpl_search', q);
                Router.navigate('/history');
            });
        }

        // User dropdown toggle
        const toggle = document.getElementById('topbar-user-toggle');
        const dropdown = document.getElementById('topbar-user-dropdown');
        const avatar = document.getElementById('topbar-avatar');
        if (toggle && dropdown) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = dropdown.classList.contains('hidden');
                dropdown.classList.toggle('hidden', !isHidden);
                if (avatar) avatar.classList.toggle('ring-primary/40', isHidden);
            });

            document.addEventListener('click', () => {
                dropdown.classList.add('hidden');
                if (avatar) avatar.classList.remove('ring-primary/40');
            }, { capture: false });
        }

        const logoutBtn = document.getElementById('topbar-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => Auth.confirmAndLogout());
        }
    }

    return { render, bindSearchEvents };
})();
