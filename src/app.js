import { registerView, setView } from './router.js';
import { OverlayManager } from './ui/overlays.js';
import { SummaryView } from './views/summary/summary.js';
import { AddView } from './views/add/add.js';

const viewRoot = document.getElementById('viewRoot');

registerView(SummaryView);
registerView(AddView);

// global nav events (no inline)
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-nav]');
    if (!btn) return;

    const view = btn.getAttribute('data-nav');
    await setView(view, viewRoot, { setOverlay: OverlayManager.open });
});

// boot
await setView('summary', viewRoot, { setOverlay: OverlayManager.open });
