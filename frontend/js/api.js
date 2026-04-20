/**
 * api.js - API 客戶端
 * The Private Ledger
 */
const API = (() => {
    const BASE_URL = 'https://smartwealth-api.purplesky-443057cd.eastasia.azurecontainerapps.io/api';

    function getToken() {
        return localStorage.getItem('tpl_token') || sessionStorage.getItem('tpl_token');
    }

    async function request(method, path, body = null) {
        const headers = { 'Content-Type': 'application/json' };
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(`${BASE_URL}${path}`, options);

        if (res.status === 401) {
            // Token 過期或無效 → 登出
            Auth.logout();
            return null;
        }

        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
            throw new Error(err.message || `HTTP ${res.status}`);
        }

        // 204 No Content
        if (res.status === 204) return null;
        return res.json();
    }

    return {
        get:    (path)        => request('GET',    path),
        post:   (path, body)  => request('POST',   path, body),
        put:    (path, body)  => request('PUT',    path, body),
        delete: (path)        => request('DELETE', path),
    };
})();

const Auth = (() => {
    const TOKEN_KEY = 'tpl_token';
    const USER_KEY  = 'tpl_user';

    function saveSession(token, user, remember = true) {
        const store = remember ? localStorage : sessionStorage;
        store.setItem(TOKEN_KEY, token);
        store.setItem(USER_KEY, JSON.stringify(user));
    }

    function _getStore() {
        return localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    }

    function isLoggedIn() {
        return !!(localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY));
    }

    function getUser() {
        const raw = _getStore().getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        Router.navigate('/login');
    }

    function confirmAndLogout() {
        const existing = document.getElementById('logout-confirm-overlay');
        if (existing) return;

        const overlay = document.createElement('div');
        overlay.id = 'logout-confirm-overlay';
        overlay.innerHTML = `
            <div class="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm" id="logout-confirm-backdrop">
                <div class="bg-surface-container rounded-2xl p-8 w-80 shadow-2xl" style="animation: pageEnter 0.2s ease-out forwards;">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1;">logout</span>
                        <h3 class="font-headline font-bold text-on-background text-base">確定要登出？</h3>
                    </div>
                    <p class="text-sm text-on-surface-variant font-body mb-6 leading-relaxed">您將結束目前的工作階段，下次需重新登入才能使用系統。</p>
                    <div class="flex gap-3">
                        <button id="logout-cancel-btn" class="flex-1 py-2 rounded-lg border border-outline-variant/40 text-on-surface-variant text-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer">取消</button>
                        <button id="logout-confirm-btn" class="flex-1 py-2 rounded-lg bg-error/20 border border-error/30 text-error text-sm font-semibold hover:bg-error hover:text-on-error transition-all cursor-pointer">登出</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#logout-cancel-btn').addEventListener('click', () => overlay.remove());
        overlay.querySelector('#logout-confirm-btn').addEventListener('click', () => { overlay.remove(); logout(); });
        overlay.querySelector('#logout-confirm-backdrop').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) overlay.remove();
        });
    }

    async function login(email, password, remember = true) {
        const data = await API.post('/auth/login', { email, password });
        if (!data) throw new Error('Email 或密碼錯誤');
        saveSession(data.token, data.user, remember);
        return data.user;
    }

    async function register(email, password, fullName) {
        const data = await API.post('/auth/register', { email, password, fullName });
        saveSession(data.token, data.user);
        return data.user;
    }

    async function requestPasswordReset(email) {
        return API.post('/auth/forgot-password', { email });
    }

    async function resetPassword(token, newPassword) {
        return API.post('/auth/reset-password', { token, newPassword });
    }

    return { isLoggedIn, getUser, logout, confirmAndLogout, login, register, requestPasswordReset, resetPassword };
})();
