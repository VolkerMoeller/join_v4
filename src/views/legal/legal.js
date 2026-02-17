export const LegalView = {
    name: 'legal',
    async loadHtml() {
        const res = await fetch('./src/views/legal/legal.html');
        return res.text();
    },
    async ensureInitialized() {
        // init once
    },
    updateContent() {
        // called on every navigation
    },
};