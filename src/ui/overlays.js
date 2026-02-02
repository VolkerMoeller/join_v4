export const OverlayManager = (() => {
    let active = null;
    let bound = false;

    function onGlobalClick(event) {
        if (!active) return;
        if (active.isInside(event.target)) return;
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
        if (!active || active.name !== name) return;
        active.close();
        active = null;
    }

    function isActive(name) {
        return active?.name === name;
    }

    return { open, close, isActive };
})();
