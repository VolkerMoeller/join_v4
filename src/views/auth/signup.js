export const SignupView = {
    name: 'signup',
    layout: 'auth',
    requiresAuth: false,

    async loadHtml() {
        const res = await fetch('./src/views/auth/signup.html');
        return res.text();
    },

    async ensureInitialized(ctx) { },

    bindDom(viewRoot, ctx) {
        const onSubmit = async (e) => {
            const form = e.target.closest('[data-action="SIGNUP_SUBMIT"]');
            if (!form) return;
            e.preventDefault();

            const email = form.querySelector('[name="email"]').value.trim();
            const password = form.querySelector('[name="password"]').value;

            // Placeholder: später Firebase createUserWithEmailAndPassword
            ctx.auth.user = { email };
            await (await import('../../router.js')).setView('summary', document.getElementById('viewRoot'), ctx);
        };

        viewRoot.addEventListener('submit', onSubmit);
        return () => viewRoot.removeEventListener('submit', onSubmit);
    },

    updateContent(ctx) { },
};
