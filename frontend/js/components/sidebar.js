/**
 * Sidebar.js - 側邊導航列元件
 * The Private Ledger Design System
 */
const Sidebar = (() => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
        { id: 'add', label: 'Add Transaction', icon: 'add_circle', route: '/add' },
        { id: 'history', label: 'History', icon: 'history', route: '/history' },
        { id: 'portfolio', label: 'Portfolio', icon: 'pie_chart', route: '/portfolio' },
        { id: 'price-alerts', label: 'Price Alerts', icon: 'notifications_active', route: '/price-alerts' },
    ];

    function render(activeRoute) {
        return `
        <nav class="h-screen w-64 fixed left-0 top-0 flex flex-col bg-surface-container-low transition-colors duration-300 z-50 hidden md:flex" id="sidebar-nav">
            <div class="flex flex-col h-full py-8 px-0">
                <!-- Brand Header -->
                <div class="px-6 mb-10">
                    <h1 class="font-headline font-bold text-on-background text-lg tracking-tight">The Private Ledger</h1>
                    <p class="text-on-surface-variant/40 text-xs font-label mt-1">Wealth Management</p>
                </div>

                <!-- Main Navigation -->
                <div class="flex-1 space-y-1">
                    ${navItems.map(item => {
                        const isActive = activeRoute === item.route;
                        return isActive
                            ? `<a class="flex items-center text-primary font-bold border-l-4 border-primary pl-4 py-3 bg-surface-container-high/50 group cursor-pointer" data-nav="${item.route}" href="#${item.route}">
                                <span class="material-symbols-outlined mr-3 text-lg" style="${item.id === activeRoute.slice(1) ? "font-variation-settings: 'FILL' 1;" : ''}">${item.icon}</span>
                                <span class="font-headline font-medium text-sm">${item.label}</span>
                               </a>`
                            : `<a class="flex items-center text-on-background/60 hover:text-on-background pl-5 py-3 transition-all hover:bg-surface-container group active:scale-95 cursor-pointer" data-nav="${item.route}" href="#${item.route}">
                                <span class="material-symbols-outlined mr-3 text-lg">${item.icon}</span>
                                <span class="font-headline font-medium text-sm">${item.label}</span>
                               </a>`;
                    }).join('')}
                </div>

                <!-- Footer Section -->
                <div class="px-4 mt-auto">
                    <button id="btn-logout" class="w-full flex items-center text-error/70 hover:text-error pl-1 py-2 text-xs transition-all cursor-pointer">
                        <span class="material-symbols-outlined mr-2 text-base">logout</span>
                        登出
                    </button>
                </div>
            </div>
        </nav>`;
    }

    function bindEvents() {
        const btn = document.getElementById('btn-logout');
        if (btn) {
            btn.addEventListener('click', () => Auth.confirmAndLogout());
        }
    }

    return { render, bindEvents };
})();
