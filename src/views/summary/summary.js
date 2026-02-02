export const SummaryView = {
    name: 'summary',
    async loadHtml() {
        const res = await fetch('./src/views/summary/summary.html');
        return res.text();
    },
    async ensureInitialized() {
        // init once
    },
    updateContent() {
        // called on every navigation
    },
};
