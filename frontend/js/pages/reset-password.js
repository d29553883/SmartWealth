/**
 * Reset Password Page - 重設密碼頁
 * The Private Ledger
 */
const ResetPasswordPage = (() => {

    function render(container) {
        // 從 URL hash 取出 token
        const hashQuery = window.location.hash.split('?')[1] || '';
        const token = new URLSearchParams(hashQuery).get('token') || '';

        container.innerHTML = `
        <main class="min-h-screen flex items-center justify-center bg-background px-6">
            <div class="w-full max-w-md space-y-8">
                <div class="flex items-center space-x-3">
                    <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
                    <span class="font-headline font-black text-on-background uppercase tracking-widest text-lg">The Private Ledger</span>
                </div>

                <div class="space-y-3">
                    <h2 class="font-headline font-extrabold text-3xl text-on-background">重設密碼</h2>
                    <p class="text-on-surface-variant text-sm">請輸入您的新密碼。</p>
                </div>

                <form id="reset-password-form" class="space-y-5">
                    <div class="space-y-2">
                        <label class="font-label text-sm text-on-surface-variant ml-1" for="reset-new-password">新密碼</label>
                        <div class="relative group">
                            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary text-xl">lock_open</span>
                            <input class="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-12 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body"
                                id="reset-new-password" type="password" placeholder="至少 6 位字元" minlength="6" required />
                            <button class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-background transition-colors" type="button" id="toggle-reset-password">
                                <span class="material-symbols-outlined text-xl">visibility</span>
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="font-label text-sm text-on-surface-variant ml-1" for="reset-confirm-password">確認新密碼</label>
                        <div class="relative group">
                            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary text-xl">lock</span>
                            <input class="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body"
                                id="reset-confirm-password" type="password" placeholder="再輸入一次密碼" required />
                        </div>
                    </div>
                    <p id="reset-error" class="text-error text-sm hidden"></p>
                    <button type="submit" id="btn-reset-submit"
                        class="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2">
                        <span>確認重設密碼</span>
                        <span class="material-symbols-outlined">lock_reset</span>
                    </button>
                </form>

                <div class="text-center">
                    <a class="text-primary text-sm font-medium hover:underline cursor-pointer" id="btn-back-to-login">返回登入</a>
                </div>
            </div>
        </main>`;

        _bindEvents(token);
    }

    function _bindEvents(token) {
        // 密碼顯示切換
        const toggleBtn = document.getElementById('toggle-reset-password');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const pw = document.getElementById('reset-new-password');
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

        // 返回登入
        document.getElementById('btn-back-to-login').addEventListener('click', () => {
            Router.navigate('/login');
        });

        // 表單提交
        document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword     = document.getElementById('reset-new-password').value;
            const confirmPassword = document.getElementById('reset-confirm-password').value;
            const btn             = document.getElementById('btn-reset-submit');
            const errEl           = document.getElementById('reset-error');

            errEl.classList.add('hidden');

            if (newPassword !== confirmPassword) {
                errEl.textContent = '兩次密碼輸入不一致';
                errEl.classList.remove('hidden');
                return;
            }

            if (!token) {
                errEl.textContent = '重設連結無效，請重新申請';
                errEl.classList.remove('hidden');
                return;
            }

            btn.disabled = true;
            btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`;

            try {
                await Auth.resetPassword(token, newPassword);
                // 顯示成功後導回登入
                container.innerHTML = `
                    <div class="min-h-screen flex items-center justify-center bg-background">
                        <div class="text-center space-y-6">
                            <span class="material-symbols-outlined text-tertiary text-6xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                            <h2 class="font-headline font-bold text-2xl text-on-background">密碼已成功重設</h2>
                            <p class="text-on-surface-variant">正在為您跳轉至登入頁面...</p>
                        </div>
                    </div>`;
                setTimeout(() => Router.navigate('/login'), 2000);
            } catch (err) {
                errEl.textContent = err.message || '重設失敗，連結可能已過期';
                errEl.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = `<span>確認重設密碼</span><span class="material-symbols-outlined">lock_reset</span>`;
            }
        });
    }

    // container 引用供成功畫面使用
    let container;
    return {
        render: (c) => {
            container = c;
            render(c);
        }
    };
})();
