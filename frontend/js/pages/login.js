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
                <div class="relative z-10 flex space-x-12 items-end">
                    <div>
                        <div class="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-2">安全認證</div>
                        <div class="flex items-center space-x-4 opacity-60">
                            <span class="material-symbols-outlined text-3xl">verified_user</span>
                            <span class="material-symbols-outlined text-3xl">fingerprint</span>
                            <span class="material-symbols-outlined text-3xl">enhanced_encryption</span>
                        </div>
                    </div>
                    <div class="ml-auto">
                        <p class="text-on-surface-variant font-label text-sm italic">© 2024 The Private Ledger. 財富，源於管理。</p>
                    </div>
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
                    <div class="grid grid-cols-2 gap-4">
                        <button class="flex items-center justify-center space-x-3 py-3 px-4 bg-surface-container hover:bg-surface-container-high rounded-xl transition-all group" id="btn-google-login">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M12 5.04c1.94 0 3.51.68 4.75 1.83l3.48-3.48C18.1 1.44 15.35 0 12 0 7.31 0 3.25 2.69 1.25 6.61l3.96 3.07C6.15 7.15 8.87 5.04 12 5.04z" fill="#EA4335"></path>
                                <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.89 3c2.28-2.1 3.53-5.2 3.53-8.82z" fill="#4285F4"></path>
                                <path d="M5.21 14.32c-.13-.39-.21-.8-.21-1.23s.08-.84.21-1.23l-3.96-3.07C.45 10.09 0 11.01 0 12s.45 1.91 1.25 3.21l3.96-3.07z" fill="#FBBC05"></path>
                                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3c-1.11.75-2.52 1.19-4.04 1.19-3.13 0-5.85-2.11-6.79-5.04l-3.96 3.07C3.25 21.31 7.31 24 12 24z" fill="#34A853"></path>
                            </svg>
                            <span class="text-on-background font-medium text-sm">Google 登入</span>
                        </button>
                        <button class="flex items-center justify-center space-x-3 py-3 px-4 bg-surface-container hover:bg-surface-container-high rounded-xl transition-all" id="btn-passkey-login">
                            <span class="material-symbols-outlined text-on-surface-variant">passkey</span>
                            <span class="text-on-background font-medium text-sm">Passkey</span>
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
                                <a class="text-primary text-xs font-medium hover:underline cursor-pointer">忘記密碼？</a>
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

    function _bindEvents() {
        // 登入表單提交
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // 模擬登入成功
                localStorage.setItem('tpl_logged_in', 'true');
                Router.navigate('/dashboard');
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
    }

    return { render };
})();
