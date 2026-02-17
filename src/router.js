// src/router.js

/**
 * @typedef {Object} ViewModule
 * @property {string} name
 * @property {() => Promise<string>} loadHtml
 * @property {(ctx: any) => Promise<void>} ensureInitialized
 * @property {(ctx: any) => void} updateContent
 * @property {(viewRoot: HTMLElement, ctx: any) => (void | (() => void))} [bindDom]
 * @property {(ctx: any) => void} [unmount]
 * @property {'app'|'auth'} [layout]
 * @property {boolean} [requiresAuth]
 */

const registry = new Map();

let active = {
  name: null,
  cleanup: null,
  navToken: 0,
};

export function registerView(module) {
  registry.set(module.name, { initialized: false, module });
}

function applyLayout(layout) {
  document.body.dataset.layout = layout; // 'app' | 'auth'
}

function canAccess(viewName, ctx) {
  const entry = registry.get(viewName);
  const mod = entry?.module;
  if (!mod) return false;

  const requiresAuth = mod.requiresAuth ?? true; // Standard: private
  const isLoggedIn = Boolean(ctx?.auth?.user);

  // public views: requiresAuth=false
  return !requiresAuth || isLoggedIn;
}

export async function setView(viewName, viewRoot, ctx) {
  const entry = registry.get(viewName);
  if (!entry) throw new Error(`Unknown view: ${viewName}`);

  // Auth-Guard (Standard)
  if (!canAccess(viewName, ctx)) {
    viewName = 'login';
  }

  const guardedEntry = registry.get(viewName);
  if (!guardedEntry) throw new Error(`Unknown view: ${viewName}`);

  const token = ++active.navToken;

  // explizit schließen
  ctx?.overlay?.closeAll?.();

  // cleanup prev
  if (active.cleanup) {
    try { active.cleanup(); }
    finally { active.cleanup = null; }
  }

  // unmount prev
  if (active.name) {
    const prev = registry.get(active.name)?.module;
    try { prev?.unmount?.(ctx); } catch (e) { console.error(e); }
  }

  // layout setzen (vor render, damit CSS sofort stimmt)
  applyLayout(guardedEntry.module.layout ?? 'app');

  // load + render
  const html = await guardedEntry.module.loadHtml();
  if (token !== active.navToken) return;

  viewRoot.innerHTML = html;

  // init once
  if (!guardedEntry.initialized) {
    await guardedEntry.module.ensureInitialized(ctx);
    guardedEntry.initialized = true;
    if (token !== active.navToken) return;
  }

  // bindDom (optional cleanup)
  let cleanup = null;
  if (typeof guardedEntry.module.bindDom === 'function') {
    const res = guardedEntry.module.bindDom(viewRoot, ctx);
    if (typeof res === 'function') cleanup = res;
  }

  // update always
  guardedEntry.module.updateContent(ctx);

  // active
  active.name = viewName;
  active.cleanup = cleanup;
}
