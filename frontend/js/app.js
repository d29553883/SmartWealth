/**
 * App.js - 主控制器
 * The Private Ledger SPA Application
 */
(function () {
    'use strict';

    // 註冊路由
    Router.register('/login', LoginPage.render);
    Router.register('/reset-password', ResetPasswordPage.render);
    Router.register('/dashboard', DashboardPage.render);
    Router.register('/add', AddTransactionPage.render);
    Router.register('/history', HistoryPage.render);
    Router.register('/portfolio', PortfolioPage.render);
    Router.register('/price-alerts', PriceAlertsPage.render);

    // Google OAuth callback 頁：解析 token 並存入 localStorage
    Router.register('/oauth/callback', (container) => {
        const hashQuery = window.location.hash.split('?')[1] || '';
        const params    = new URLSearchParams(hashQuery);
        const token     = params.get('token');
        const error     = params.get('error');

        if (error) {
            const msgs = {
                google_denied:  'Google 登入已取消',
                oauth_failed:   'Google 登入失敗，請稍後再試',
                missing_params: '登入參數異常，請重新嘗試'
            };
            // 清除 hash 中的 error 後導回登入頁（避免 error 殘留在 URL）
            history.replaceState(null, '', window.location.pathname);
            Router.navigate('/login');
            // 稍後顯示錯誤（LoginPage 渲染後才能寫入 DOM）
            setTimeout(() => {
                let el = document.getElementById('login-error');
                if (!el) {
                    el = document.createElement('p');
                    el.id = 'login-error';
                    el.className = 'text-error text-sm text-center px-1';
                    const form = document.getElementById('login-form');
                    if (form) form.prepend(el);
                }
                if (el) el.textContent = msgs[error] || 'Google 登入失敗';
            }, 300);
            return;
        }

        if (token) {
            const user = {
                userId:   parseInt(params.get('userId') || '0'),
                fullName: params.get('name')  || '',
                email:    params.get('email') || ''
            };
            localStorage.setItem('tpl_token', token);
            localStorage.setItem('tpl_user',  JSON.stringify(user));
        }

        Router.navigate('/dashboard');
    });

    // 路由守衛：檢查登入狀態
    Router.beforeEach((to, from) => {
        const isLoggedIn = Auth.isLoggedIn();

        // Google OAuth callback 和密碼重設頁不需要登入驗證
        if (to === '/oauth/callback') return true;
        if (to === '/reset-password') return true;

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
