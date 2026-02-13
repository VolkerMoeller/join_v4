export const ContactsView = {
    name: 'contacts',
    async loadHtml() {
        const res = await fetch('./src/views/contacts/contacts.html');
        return res.text();
    },
    async ensureInitialized() {
        // init once
    },
    updateContent() {
        // called on every navigation
    },
};
