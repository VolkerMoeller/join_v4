// src/app.js
import { registerView, setView } from './router.js';
import { OverlayManager } from './ui/overlays.js';
import { SummaryView } from './views/summary/summary.js';
import { AddView } from './views/add/add.js';
import { BoardView } from './views/board/board.js';

const viewRoot = document.getElementById('viewRoot');

registerView(SummaryView);
registerView(AddView);
registerView(BoardView);

// ctx als Capability-Objekt (nicht nur open)
const ctx = { overlay: OverlayManager };

// global nav events (no inline)
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-nav]');
    if (!btn) return;

    const view = btn.getAttribute('data-nav');
    await setView(view, viewRoot, ctx);
});

// boot
await setView('summary', viewRoot, ctx);
