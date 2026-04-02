/**
 * api.js - API 客戶端
 * The Private Ledger
 */
const API = (() => {
    const BASE_URL = 'http://localhost:5253/api';

    function getToken() {
        return localStorage.getItem('tpl_token');
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

    function saveSession(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    function isLoggedIn() {
        return !!localStorage.getItem(TOKEN_KEY);
    }

    function getUser() {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        Router.navigate('/login');
    }

    async function login(email, password) {
        const data = await API.post('/auth/login', { email, password });
        saveSession(data.token, data.user);
        return data.user;
    }

    async function register(email, password, fullName) {
        const data = await API.post('/auth/register', { email, password, fullName });
        saveSession(data.token, data.user);
        return data.user;
    }

    return { isLoggedIn, getUser, logout, login, register };
})();
