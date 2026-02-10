// src/router.js
/**
 * @typedef {Object} ViewModule
 * @property {string} name
 * @property {() => Promise<string>} loadHtml
 * @property {(ctx: any) => Promise<void>} ensureInitialized
 * @property {(ctx: any) => void} updateContent
 * @property {(viewRoot: HTMLElement, ctx: any) => (void | (() => void))} [bindDom]
 * @property {(ctx: any) => void} [unmount]
 */

/** @type {Map<string, { initialized: boolean, module: ViewModule }>} */
const registry = new Map();

let active = {
    name: null,
    cleanup: null,
    navToken: 0,
};

export function registerView(module) {
    registry.set(module.name, { initialized: false, module });
}

/**
 * Central SPA routing function.
 * - loads view HTML
 * - ensures one-time initialization
 * - runs updateContent on every navigation
 * - closes overlays on route change
 * - supports cleanup/unmount
 * - guards against async race conditions
 *
 * @param {string} viewName
 * @param {HTMLElement} viewRoot
 * @param {any} ctx
 */
export async function setView(viewName, viewRoot, ctx) {
    const entry = registry.get(viewName);
    if (!entry) throw new Error(`Unknown view: ${viewName}`);

    // Guard gegen Race-Conditions (langsames HTML + schnelles Klicken)
    const token = ++active.navToken;

    // Globale UI-Zustände explizit schließen (v4-Regel)
    ctx?.overlay?.closeAll?.();

    // Cleanup der vorherigen View (Listener etc.)
    if (active.cleanup) {
        try { active.cleanup(); } finally { active.cleanup = null; }
    }

    // Optionales unmount (Timer/Observer/etc.)
    if (active.name) {
        const prev = registry.get(active.name)?.module;
        if (prev?.unmount) prev.unmount(ctx);
    }

    // HTML laden
    const html = await entry.module.loadHtml();
    if (token !== active.navToken) return;

    // Render: DOM ersetzen
    viewRoot.innerHTML = html;

    // init once (kein DOM-Ref speichern!)
    if (!entry.initialized) {
        await entry.module.ensureInitialized(ctx);
        entry.initialized = true;
        if (token !== active.navToken) return;
    }

    // bindDom darf cleanup zurückgeben
    let cleanup = null;
    if (typeof entry.module.bindDom === 'function') {
        const res = entry.module.bindDom(viewRoot, ctx);
        if (typeof res === 'function') cleanup = res;
    }

    // update always
    entry.module.updateContent(ctx);

    // active setzen
    active.name = viewName;
    active.cleanup = cleanup;
}

