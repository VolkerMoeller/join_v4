import { OverlayManager } from '../../ui/overlays.js';

export const AddView = {
    name: 'add',
    async loadHtml() {
        const res = await fetch('./src/views/add/add.html');
        return res.text();
    },
    async ensureInitialized() {
        // init once (after HTML is injected for the first time)
        const openBtn = document.getElementById('assignedOpen');
        const closeBtn = document.getElementById('assignedClose');
        const control = document.getElementById('assignedControl');
        const dropdown = document.getElementById('assignedDropdown');

        const open = () => {
            dropdown.hidden = false;
            openBtn.hidden = true;
            closeBtn.hidden = false;

            OverlayManager.open(
                'add.assigned',
                (t) => control.contains(t) || dropdown.contains(t),
                close
            );
        };

        const close = () => {
            dropdown.hidden = true;
            openBtn.hidden = false;
            closeBtn.hidden = true;
            OverlayManager.close('add.assigned');
        };

        openBtn.addEventListener('click', () => {
            if (OverlayManager.isActive('add.assigned')) return;
            open();
        });

        closeBtn.addEventListener('click', close);

        // optional: focus opens, but only if closed (no toggle)
        const input = document.getElementById('assignedInput');
        input.addEventListener('focus', () => {
            if (OverlayManager.isActive('add.assigned')) return;
            open();
        });
    },
    updateContent() {
        // run every time the view is shown (optional)
    },
};
