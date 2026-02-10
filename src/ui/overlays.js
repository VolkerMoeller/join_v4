// src/ui/overlays.js
export const OverlayManager = (() => {
    let active = null;
    let bound = false;

    function onGlobalClick(event) {
        if (!active) return;

        const t = event.target instanceof Node ? event.target : null;
        if (t && active.isInside(t)) return;

        active.close();
        active = null;
    }

    function bindOnce() {
        if (bound) return;
        document.addEventListener('click', onGlobalClick, true);
        bound = true;
    }

    function open(name, isInside, close) {
        bindOnce();
        if (active && active.name !== name) active.close();
        active = { name, isInside, close };
    }

    function close(name) {
        if (!active) return;
        if (name && active.name !== name) return;
        active.close();
        active = null;
    }

    function closeAll() {
        close(); // ohne name => einfach schließen
    }

    function isActive(name) {
        return active?.name === name;
    }

    return { open, close, closeAll, isActive };
})();
