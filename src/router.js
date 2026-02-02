/**
 * @typedef {Object} ViewModule
 * @property {string} name
 * @property {() => Promise<string>} loadHtml
 * @property {(ctx: { setOverlay: Function }) => Promise<void>} ensureInitialized
 * @property {() => void} updateContent
 */

/** @type {Map<string, { initialized: boolean, module: ViewModule }>} */
const registry = new Map();

export function registerView(module) {
    registry.set(module.name, { initialized: false, module });
}

/**
 * Central SPA routing function.
 * - loads view HTML
 * - ensures one-time initialization
 * - runs updateContent on every navigation
 *
 * @param {string} viewName
 * @param {HTMLElement} viewRoot
 * @param {{ setOverlay: Function }} ctx
 */
export async function setView(viewName, viewRoot, ctx) {
    const entry = registry.get(viewName);
    if (!entry) throw new Error(`Unknown view: ${viewName}`);

    // HTML
    viewRoot.innerHTML = await entry.module.loadHtml();

    // init once
    if (!entry.initialized) {
        await entry.module.ensureInitialized(ctx);
        entry.initialized = true;
    }

    // update always
    entry.module.updateContent();
}
