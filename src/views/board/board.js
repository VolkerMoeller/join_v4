export const BoardView = {
    name: 'board',
    async loadHtml() {
        const res = await fetch('./src/views/board/board.html');
        return res.text();
    },
    async ensureInitialized() {
        // init once
    },
    updateContent() {
        // called on every navigation
    },
};