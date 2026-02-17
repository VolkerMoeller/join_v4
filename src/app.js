// src/app.js
import { registerView, setView } from './router.js';
import { OverlayManager } from './ui/overlays.js';

import { SummaryView } from './views/summary/summary.js';
import { AddView } from './views/add/add.js';
import { BoardView } from './views/board/board.js';
import { ContactsView } from './views/contacts/contacts.js';

import { LegalView } from './views/legal/legal.js';
import { PrivacyView } from './views/privacy/privacy.js';

import { LoginView } from './views/auth/login.js';
import { SignupView } from './views/auth/signup.js';

const viewRoot = document.getElementById('viewRoot');

registerView(LoginView);
registerView(SignupView);
registerView(SummaryView);
registerView(AddView);
registerView(BoardView);
registerView(ContactsView);
registerView(LegalView);
registerView(PrivacyView);

// ctx als Capability-Objekt (nicht nur open)
const ctx = {
    overlay: OverlayManager,
    auth: { user: null }, // <- später von Firebase gesetzt
};


// global nav events (no inline)
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-nav]');
    if (!btn) return;

    const view = btn.getAttribute('data-nav');
    await setView(btn.getAttribute('data-nav'), viewRoot, ctx);
});

// boot
await setView('summary', viewRoot, ctx);
