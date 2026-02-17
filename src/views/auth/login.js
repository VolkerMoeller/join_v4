export const LoginView = {
    name: 'login',
    layout: 'auth',
    requiresAuth: false,

    async loadHtml() {
        const res = await fetch('./src/views/auth/login.html');
        return res.text();
    },

    async ensureInitialized(ctx) { },

    bindDom(viewRoot, ctx) {
        const onSubmit = async (e) => {
            const form = e.target.closest('[data-action="LOGIN_SUBMIT"]');
            if (!form) return;
            e.preventDefault();

            const email = form.querySelector('[name="email"]').value.trim();
            const password = form.querySelector('[name="password"]').value;

            // Placeholder: später Firebase signInWithEmailAndPassword
            // ctx.auth.user = { email };
            // await setView('summary', viewRoot, ctx);

            // Für jetzt: nur demo
            ctx.auth.user = { email };
            await (await import('../../router.js')).setView('summary', document.getElementById('viewRoot'), ctx);
        };

        const onClick = async (e) => {
            const link = e.target.closest('[data-nav]');
            if (link) return; // app.js handled
        };

        viewRoot.addEventListener('submit', onSubmit);
        viewRoot.addEventListener('click', onClick);

        return () => {
            viewRoot.removeEventListener('submit', onSubmit);
            viewRoot.removeEventListener('click', onClick);
        };
    },

    updateContent(ctx) { },
};
