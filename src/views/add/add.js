import { OverlayManager } from '../../ui/overlays.js';

export const AddView = {
  name: 'add',

  async loadHtml() {
    const res = await fetch('./src/views/add/add.html');
    return res.text();
  },

  async ensureInitialized() {
    // init once: später z.B. Daten preload, nothing DOM-related here
  },

  /**
   * Bind DOM events for this view. Called after every HTML render.
   * Uses event delegation so we don't leak listeners across re-renders.
   * @param {HTMLElement} viewRoot
   */
  bindDom(viewRoot) {
    // Prevent double-binding if bindDom is called again while the same DOM is mounted.
    if (viewRoot.dataset.boundAdd === '1') return;
    viewRoot.dataset.boundAdd = '1';

    const getEls = () => {
      const openBtn = viewRoot.querySelector('#assignedOpen');
      const closeBtn = viewRoot.querySelector('#assignedClose');
      const control = viewRoot.querySelector('#assignedControl');
      const dropdown = viewRoot.querySelector('#assignedDropdown');
      const input = viewRoot.querySelector('#assignedInput');
      return { openBtn, closeBtn, control, dropdown, input };
    };

    const closeAssignedUi = () => {
      const { openBtn, closeBtn, dropdown } = getEls();
      if (!openBtn || !closeBtn || !dropdown) return;
      dropdown.hidden = true;
      openBtn.hidden = false;
      closeBtn.hidden = true;
    };

    const openAssignedUi = () => {
      const { openBtn, closeBtn, control, dropdown } = getEls();
      if (!openBtn || !closeBtn || !control || !dropdown) return;

      dropdown.hidden = false;
      openBtn.hidden = true;
      closeBtn.hidden = false;

      OverlayManager.open(
        'add.assigned',
        (t) => control.contains(t) || dropdown.contains(t),
        closeAssignedUi
      );
    };

    // 1) Click delegation for open/close buttons
    viewRoot.addEventListener('click', (event) => {
      const t = event.target;

      if (t.closest('#assignedOpen')) {
        if (OverlayManager.isActive('add.assigned')) return;
        openAssignedUi();
        return;
      }

      if (t.closest('#assignedClose')) {
        OverlayManager.close('add.assigned'); // calls closeAssignedUi via manager
        return;
      }
    });

    // 2) Focus handling (optional): focus opens if closed
    viewRoot.addEventListener('focusin', (event) => {
      const t = event.target;
      if (!(t instanceof HTMLElement)) return;

      if (t.id === 'assignedInput') {
        if (OverlayManager.isActive('add.assigned')) return;
        openAssignedUi();
      }
    });
  },

  updateContent() {
    // optional: called on every navigation to this view
  },
};
