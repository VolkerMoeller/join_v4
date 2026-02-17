export const PrivacyView = {
    name: 'privacy',
    async loadHtml() {
        const res = await fetch('./src/views/privacy/privacy.html');
        return res.text();
    },
    async ensureInitialized() {
        // init once
    },
    updateContent() {
        // called on every navigation
    },
};