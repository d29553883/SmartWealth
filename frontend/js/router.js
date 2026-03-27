/**
 * Router.js - Hash-based SPA 路由引擎
 * The Private Ledger
 */
const Router = (() => {
    const routes = {};
    let currentRoute = null;
    let beforeEachHook = null;

    function register(path, handler) {
        routes[path] = handler;
    }

    function navigate(path) {
        window.location.hash = path;
    }

    function beforeEach(hook) {
        beforeEachHook = hook;
    }

    async function _handleRoute() {
        const hash = window.location.hash.slice(1) || '/login';
        
        // 執行前置守衛
        if (beforeEachHook) {
            const allowed = beforeEachHook(hash, currentRoute);
            if (!allowed) return;
        }

        const handler = routes[hash];
        if (!handler) {
            // 找不到路由，導向登入
            navigate('/login');
            return;
        }

        const app = document.getElementById('app');

        // 頁面退出動畫
        if (currentRoute) {
            app.classList.add('page-exit');
            await new Promise(r => setTimeout(r, 200));
            app.classList.remove('page-exit');
        }

        currentRoute = hash;

        // 渲染新頁面
        handler(app);

        // 頁面進入動畫
        app.classList.add('page-enter');
        setTimeout(() => app.classList.remove('page-enter'), 300);

        // 更新 document title
        const titles = {
            '/login': '登入 | The Private Ledger',
            '/dashboard': '儀表板 | The Private Ledger',
            '/add': '快速記帳 | The Private Ledger',
            '/history': '交易紀錄 | The Private Ledger',
            '/portfolio': '投資組合 | The Private Ledger',
        };
        document.title = titles[hash] || 'The Private Ledger';
    }

    function init() {
        window.addEventListener('hashchange', _handleRoute);
        _handleRoute();
    }

    function getCurrentRoute() {
        return currentRoute;
    }

    return { register, navigate, beforeEach, init, getCurrentRoute };
})();
