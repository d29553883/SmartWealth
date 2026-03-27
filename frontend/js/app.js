/**
 * App.js - 主控制器
 * The Private Ledger SPA Application
 */
(function () {
    'use strict';

    // 註冊路由
    Router.register('/login', LoginPage.render);
    Router.register('/dashboard', DashboardPage.render);
    Router.register('/add', AddTransactionPage.render);
    Router.register('/history', HistoryPage.render);
    Router.register('/portfolio', PortfolioPage.render);

    // 路由守衛：檢查登入狀態
    Router.beforeEach((to, from) => {
        const isLoggedIn = localStorage.getItem('tpl_logged_in') === 'true';

        // 未登入且不是前往登入頁 → 導向登入
        if (!isLoggedIn && to !== '/login') {
            Router.navigate('/login');
            return false;
        }

        // 已登入但前往登入頁 → 導向儀表板
        if (isLoggedIn && to === '/login') {
            Router.navigate('/dashboard');
            return false;
        }

        return true;
    });

    // 初始化路由
    Router.init();

})();
