/**
 * Topbar.js - 頂部搜尋列元件
 * The Private Ledger Design System
 */
const Topbar = (() => {

    function render(options = {}) {
        const currentUser = Auth.getUser();
        const { userName = currentUser?.fullName ?? '用戶', userRole = '家族辦公室帳戶', showBalance = false, balance = '', hideSearch = false } = options;

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
                <button class="text-primary hover:text-primary transition-colors relative" id="topbar-notifications">
                    <span class="material-symbols-outlined">notifications</span>
                    <span class="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full border-2 border-background"></span>
                </button>
                <div class="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
                    ${showBalance
                        ? `<span class="text-xs font-body text-on-surface-variant">帳戶餘額: <span class="text-on-surface font-semibold">${balance}</span></span>`
                        : `<div class="text-right">
                            <p class="text-xs font-bold text-on-background">${userName}</p>
                            <p class="text-[10px] text-on-surface-variant">${userRole}</p>
                          </div>`
                    }
                    <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
                        <img alt="使用者頭像" src="assets/images/user-avatar.png" class="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>`;
    }

    function bindSearchEvents() {
        const input = document.getElementById('topbar-search');
        if (!input) return;
        input.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const q = input.value.trim();
            if (!q) return;
            sessionStorage.setItem('tpl_search', q);
            Router.navigate('/history');
        });
    }

    return { render, bindSearchEvents };
})();
