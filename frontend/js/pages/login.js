/**
 * Login Page - 登入與註冊頁
 * The Private Ledger
 */
const LoginPage = (() => {

    function render(container) {
        container.innerHTML = `
        <main class="min-h-screen flex flex-col md:flex-row overflow-hidden">
            <!-- 左側 Hero 區 -->
            <section class="hidden md:flex md:w-1/2 lg:w-3/5 relative flex-col justify-between p-12 lg:p-20 overflow-hidden bg-surface-container-low">
                <div class="absolute inset-0 z-0">
                    <img class="w-full h-full object-cover opacity-40 mix-blend-luminosity" alt="3D 水晶裝飾背景" src="assets/images/login-hero-bg.png" />
                    <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
                </div>
                <div class="relative z-10">
                    <div class="flex items-center space-x-3">
                        <span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
                        <h1 class="font-headline font-extrabold text-2xl tracking-widest text-on-background uppercase">The Private Ledger</h1>
                    </div>
                </div>
                <div class="relative z-10 max-w-xl">
                    <h2 class="font-headline font-bold text-5xl lg:text-7xl text-on-background leading-tight mb-8">
                        精準掌控<br/>每一分財富。
                    </h2>
                    <p class="text-on-surface-variant text-xl lg:text-2xl font-light leading-relaxed max-w-md">
                        歡迎來到私人帳本。我們為追求極致的投資者提供專業、安全且具備美學的財富管理體驗。
                    </p>
                </div>
                <div class="relative z-10 flex items-end">
                    <p class="text-on-surface-variant font-label text-sm italic">© 2026 The Private Ledger. 財富，源於管理。</p>
                </div>
            </section>

            <!-- 右側登入表單區 -->
            <section class="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-20 bg-background relative">
                <div class="w-full max-w-md space-y-10">
                    <!-- Mobile Brand -->
                    <div class="md:hidden flex justify-center mb-8">
                        <div class="flex items-center space-x-2">
                            <span class="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
                            <span class="font-headline font-black text-on-background uppercase tracking-widest text-lg">The Private Ledger</span>
                        </div>
                    </div>

                    <header class="space-y-3">
                        <h3 class="font-headline font-extrabold text-3xl text-on-background">登入與註冊</h3>
                        <p class="text-on-surface-variant text-sm tracking-wide">請輸入您的憑據以訪問您的資產儀表板。</p>
                    </header>

                    <!-- OAuth Buttons -->
                    <div class="flex">
                        <button class="flex-1 flex items-center justify-center space-x-3 py-3 px-4 bg-surface-container hover:bg-surface-container-high rounded-xl transition-all group" id="btn-google-login">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M12 5.04c1.94 0 3.51.68 4.75 1.83l3.48-3.48C18.1 1.44 15.35 0 12 0 7.31 0 3.25 2.69 1.25 6.61l3.96 3.07C6.15 7.15 8.87 5.04 12 5.04z" fill="#EA4335"></path>
                                <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.89 3c2.28-2.1 3.53-5.2 3.53-8.82z" fill="#4285F4"></path>
                                <path d="M5.21 14.32c-.13-.39-.21-.8-.21-1.23s.08-.84.21-1.23l-3.96-3.07C.45 10.09 0 11.01 0 12s.45 1.91 1.25 3.21l3.96-3.07z" fill="#FBBC05"></path>
                                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3c-1.11.75-2.52 1.19-4.04 1.19-3.13 0-5.85-2.11-6.79-5.04l-3.96 3.07C3.25 21.31 7.31 24 12 24z" fill="#34A853"></path>
                            </svg>
                            <span class="text-on-background font-medium text-sm">Google 登入</span>
                        </button>
                    </div>

                    <!-- Divider -->
                    <div class="relative flex py-2 items-center">
                        <div class="flex-grow border-t border-outline-variant/20"></div>
                        <span class="flex-shrink mx-4 text-on-surface-variant font-label text-xs uppercase tracking-widest">或電子郵件</span>
                        <div class="flex-grow border-t border-outline-variant/20"></div>
                    </div>

                    <!-- Login Form -->
                    <form class="space-y-6" id="login-form">
                        <div class="space-y-2">
                            <label class="font-label text-sm text-on-surface-variant ml-1" for="login-email">帳號或電子郵件</label>
                            <div class="relative group">
                                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary text-xl">alternate_email</span>
                                <input class="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body" id="login-email" placeholder="example@ledger.com" type="email" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between items-center px-1">
                                <label class="font-label text-sm text-on-surface-variant" for="login-password">密碼</label>
                                <a class="text-primary text-xs font-medium hover:underline cursor-pointer" id="btn-forgot-password">忘記密碼？</a>
                            </div>
                            <div class="relative group">
                                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary text-xl">lock_open</span>
                                <input class="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-12 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body" id="login-password" placeholder="••••••••" type="password" />
                                <button class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-background transition-colors" type="button" id="toggle-password">
                                    <span class="material-symbols-outlined text-xl">visibility</span>
                                </button>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3 px-1">
                            <input class="w-5 h-5 rounded bg-surface-container-highest border-none text-primary focus:ring-offset-background focus:ring-primary cursor-pointer" id="remember" type="checkbox" />
                            <label class="text-sm text-on-surface-variant cursor-pointer" for="remember">保持登入狀態</label>
                        </div>
                        <button class="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2" type="submit" id="btn-login-submit">
                            <span>進入我的帳本</span>
                            <span class="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </form>

                    <div class="text-center">
                        <p class="text-on-surface-variant text-sm">
                            還沒有帳號？
                            <a class="text-primary font-bold hover:underline ml-1 cursor-pointer" id="btn-register">立即註冊</a>
                        </p>
                    </div>

                    <footer class="pt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <a class="text-xs text-outline hover:text-on-surface-variant transition-colors cursor-pointer">服務條款</a>
                        <a class="text-xs text-outline hover:text-on-surface-variant transition-colors cursor-pointer">隱私權政策</a>
                        <a class="text-xs text-outline hover:text-on-surface-variant transition-colors cursor-pointer">安全資訊</a>
                        <a class="text-xs text-outline hover:text-on-surface-variant transition-colors cursor-pointer">法律聲明</a>
                    </footer>
                </div>
            </section>
        </main>`;

        _bindEvents();
    }

    function _setLoading(btn, loading) {
        btn.disabled = loading;
        btn.innerHTML = loading
            ? `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`
            : `<span>進入我的帳本</span><span class="material-symbols-outlined">arrow_forward</span>`;
    }

    function _showError(msg) {
        let el = document.getElementById('login-error');
        if (!el) {
            el = document.createElement('p');
            el.id = 'login-error';
            el.className = 'text-error text-sm text-center px-1';
            document.getElementById('login-form').prepend(el);
        }
        el.textContent = msg;
    }

    function _bindEvents() {
        // 登入表單提交
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email    = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value;
                const remember = document.getElementById('remember').checked;
                const btn      = document.getElementById('btn-login-submit');

                _setLoading(btn, true);
                try {
                    await Auth.login(email, password, remember);
                    Router.navigate('/dashboard');
                } catch (err) {
                    _showError(err.message || '登入失敗，請確認帳號密碼');
                    _setLoading(btn, false);
                }
            });
        }

        // 密碼顯示切換
        const toggleBtn = document.getElementById('toggle-password');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const pw = document.getElementById('login-password');
                const icon = toggleBtn.querySelector('.material-symbols-outlined');
                if (pw.type === 'password') {
                    pw.type = 'text';
                    icon.textContent = 'visibility_off';
                } else {
                    pw.type = 'password';
                    icon.textContent = 'visibility';
                }
            });
        }

        // Google 登入 → 直接跳轉到後端，由後端帶去 Google
        const googleBtn = document.getElementById('btn-google-login');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                googleBtn.disabled = true;
                googleBtn.innerHTML = `<svg class="animate-spin h-5 w-5 text-on-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`;
                window.location.href = 'https://smartwealth-api.purplesky-443057cd.eastasia.azurecontainerapps.io/api/auth/google/login';
            });
        }

        // 點擊「立即註冊」→ 開啟 modal
        const registerBtn = document.getElementById('btn-register');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => _showRegisterModal());
        }

        // 點擊「忘記密碼？」→ 開啟 modal
        const forgotBtn = document.getElementById('btn-forgot-password');
        if (forgotBtn) {
            forgotBtn.addEventListener('click', () => _showForgotPasswordModal());
        }
    }

    function _showRegisterModal() {
        const overlay = document.createElement('div');
        overlay.id = 'register-modal';
        overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm';
        overlay.innerHTML = `
            <div class="bg-surface-container-low rounded-2xl p-8 w-full max-w-md mx-4 space-y-6 shadow-2xl">
                <div class="flex justify-between items-center">
                    <h3 class="font-headline font-bold text-xl text-on-background">建立新帳號</h3>
                    <button id="close-register" class="text-on-surface-variant hover:text-on-background transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form id="register-form" class="space-y-4">
                    <div class="space-y-2">
                        <label class="font-label text-sm text-on-surface-variant ml-1">姓名</label>
                        <input id="reg-name" type="text" required
                            class="w-full bg-surface-container-highest border-none rounded-xl py-3 px-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body"
                            placeholder="您的姓名" />
                    </div>
                    <div class="space-y-2">
                        <label class="font-label text-sm text-on-surface-variant ml-1">電子郵件</label>
                        <input id="reg-email" type="email" required
                            class="w-full bg-surface-container-highest border-none rounded-xl py-3 px-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body"
                            placeholder="example@ledger.com" />
                    </div>
                    <div class="space-y-2">
                        <label class="font-label text-sm text-on-surface-variant ml-1">密碼</label>
                        <input id="reg-password" type="password" required minlength="6"
                            class="w-full bg-surface-container-highest border-none rounded-xl py-3 px-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body"
                            placeholder="至少 6 位字元" />
                    </div>
                    <p id="register-error" class="text-error text-sm hidden"></p>
                    <button type="submit" id="btn-register-submit"
                        class="w-full editorial-gradient text-on-primary font-headline font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]">
                        <span>建立帳號</span>
                    </button>
                </form>
            </div>`;

        document.body.appendChild(overlay);

        document.getElementById('close-register').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name     = document.getElementById('reg-name').value.trim();
            const email    = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const btn      = document.getElementById('btn-register-submit');
            const errEl    = document.getElementById('register-error');

            btn.disabled = true;
            btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`;

            try {
                await Auth.register(email, password, name);
                overlay.remove();
                Router.navigate('/dashboard');
            } catch (err) {
                errEl.textContent = err.message || '註冊失敗，請稍後再試';
                errEl.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = `<span>建立帳號</span>`;
            }
        });
    }

    function _showForgotPasswordModal() {
        const overlay = document.createElement('div');
        overlay.id = 'forgot-password-modal';
        overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm';
        overlay.innerHTML = `
            <div class="bg-surface-container-low rounded-2xl p-8 w-full max-w-md mx-4 space-y-6 shadow-2xl">
                <div class="flex justify-between items-center">
                    <h3 class="font-headline font-bold text-xl text-on-background">重設密碼</h3>
                    <button id="close-forgot" class="text-on-surface-variant hover:text-on-background transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <p class="text-on-surface-variant text-sm leading-relaxed">請輸入您的電子郵件，我們將寄送重設密碼連結給您。</p>
                <form id="forgot-password-form" class="space-y-4">
                    <div class="space-y-2">
                        <label class="font-label text-sm text-on-surface-variant ml-1">電子郵件</label>
                        <input id="forgot-email" type="email" required
                            class="w-full bg-surface-container-highest border-none rounded-xl py-3 px-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body"
                            placeholder="example@ledger.com" />
                    </div>
                    <p id="forgot-error" class="text-error text-sm hidden"></p>
                    <p id="forgot-success" class="text-tertiary text-sm hidden"></p>
                    <button type="submit" id="btn-forgot-submit"
                        class="w-full editorial-gradient text-on-primary font-headline font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]">
                        <span>寄送重設連結</span>
                    </button>
                </form>
            </div>`;

        document.body.appendChild(overlay);

        document.getElementById('close-forgot').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email   = document.getElementById('forgot-email').value.trim();
            const btn     = document.getElementById('btn-forgot-submit');
            const errEl   = document.getElementById('forgot-error');
            const succEl  = document.getElementById('forgot-success');

            errEl.classList.add('hidden');
            succEl.classList.add('hidden');
            btn.disabled = true;
            btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`;

            try {
                await Auth.requestPasswordReset(email);
                succEl.textContent = '若此 Email 已註冊，重設連結已寄出，請檢查您的信箱。';
                succEl.classList.remove('hidden');
                btn.innerHTML = `<span>已寄出</span>`;
            } catch (err) {
                errEl.textContent = err.message || '寄送失敗，請稍後再試';
                errEl.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = `<span>寄送重設連結</span>`;
            }
        });
    }

    return { render };
})();
