// src/views/add/add.js
export const AddView = {
  name: 'add',

  async loadHtml() {
    const res = await fetch('./src/views/add/add.html');
    return res.text();
  },

  async ensureInitialized(ctx) {
    // init once: später z.B. Daten preload, nothing DOM-related here
  },

  /**
   * Bind DOM events for this view. Called after every HTML render.
   * Returns a cleanup function so router can unbind on view change.
   * @param {HTMLElement} viewRoot
   * @param {any} ctx
   */
  bindDom(viewRoot, ctx) {
    const overlay = ctx?.overlay;

    const scopeRoot = viewRoot.querySelector('[data-scope="assigned"]');
    if (!scopeRoot) return;

    const getEls = () => {
      const control = scopeRoot.querySelector('[data-assigned="control"]');
      const dropdown = scopeRoot.querySelector('[data-assigned="dropdown"]');
      const openBtn = scopeRoot.querySelector('[data-action="ASSIGNED_OPEN"]');
      const closeBtn = scopeRoot.querySelector('[data-action="ASSIGNED_CLOSE"]');
      const input = scopeRoot.querySelector('#assignedInput');
      return { control, dropdown, openBtn, closeBtn, input };
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

      overlay?.open?.(
        'add.assigned',
        (t) => control.contains(t) || dropdown.contains(t),
        closeAssignedUi
      );
    };

    const onClick = (event) => {
      const el = event.target.closest('[data-action]');
      if (!el || !scopeRoot.contains(el)) return;

      const action = el.dataset.action;

      if (action === 'ASSIGNED_OPEN') {
        if (overlay?.isActive?.('add.assigned')) return;
        openAssignedUi();
        return;
      }

      if (action === 'ASSIGNED_CLOSE') {
        overlay?.close?.('add.assigned');
        return;
      }

      if (action === 'ASSIGNED_PICK') {
        const name = el.dataset.name;
        // hier würdest du später "assigned hinzufügen" machen
        // vorerst nur: input befüllen (oder multi-select chips)
        const { input } = getEls();
        if (input && name) input.value = name;
        return;
      }
    };

    const onFocusIn = (event) => {
      const el = event.target;
      if (!(el instanceof HTMLElement)) return;
      if (!scopeRoot.contains(el)) return;

      if (el.dataset.action === 'ASSIGNED_FOCUS' || el.id === 'assignedInput') {
        if (overlay?.isActive?.('add.assigned')) return;
        openAssignedUi();
      }
    };

    viewRoot.addEventListener('click', onClick);
    viewRoot.addEventListener('focusin', onFocusIn);

    return () => {
      viewRoot.removeEventListener('click', onClick);
      viewRoot.removeEventListener('focusin', onFocusIn);
      overlay?.close?.('add.assigned');
    };
  },


  updateContent(ctx) {
    // optional: called on every navigation to this view
  },
};
