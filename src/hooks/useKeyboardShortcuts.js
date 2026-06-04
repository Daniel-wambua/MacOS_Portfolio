import { useEffect } from "react";
import useWindowStore from "#store/window.js";
import useSpotlightStore from "#store/spotlight.js";
import usePanelsStore from "#store/panels.js";

/**
 * Detects whether the user is on macOS.
 * Uses the modern navigator.userAgentData API when available,
 * falling back to navigator.platform for older browsers.
 */
function isMacOS() {
    if (navigator.userAgentData) {
        return navigator.userAgentData.platform === "macOS";
    }
    return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

/**
 * Map of shortcut keys to their corresponding actions.
 * 'w' → close active window (highest zIndex open non-minimized window)
 * '1' → open or focus finder
 * '2' → open or focus safari
 * '3' → open or focus terminal
 * 'k' → toggle spotlight
 */
const SHORTCUT_MAP = {
    w: { action: "closeActiveWindow" },
    1: { action: "openOrFocus", window: "finder" },
    2: { action: "openOrFocus", window: "safari" },
    3: { action: "openOrFocus", window: "terminal" },
    k: { action: "toggleSpotlight" },
};

/**
 * Returns true if the currently focused element is a text input,
 * textarea, or contenteditable element — in which case shortcuts
 * should not fire.
 */
function isEditableElementFocused() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") return true;
    if (el.getAttribute("contenteditable") === "true") return true;
    return false;
}

/**
 * Global keyboard shortcuts hook.
 * Mounted once at the App level. Registers a single keydown listener
 * that maps modifier+key combinations to window/spotlight store actions.
 */
export default function useKeyboardShortcuts() {
    useEffect(() => {
        const isMac = isMacOS();

        function handleKeyDown(e) {
            // Skip when editing text
            if (isEditableElementFocused()) return;

            // Check for correct modifier key (Meta on Mac, Ctrl otherwise)
            const modifierPressed = isMac ? e.metaKey : e.ctrlKey;
            if (!modifierPressed) return;

            const key = e.key.toLowerCase();
            const shortcut = SHORTCUT_MAP[key];
            if (!shortcut) return;

            // Prevent browser default (e.g. Ctrl+W closing tab)
            e.preventDefault();

            const { getActiveWindow, openWindow, closeWindow, focusWindow } =
                useWindowStore.getState();
            const { toggleSpotlight } = useSpotlightStore.getState();

            switch (shortcut.action) {
                case "closeActiveWindow": {
                    const activeKey = getActiveWindow();
                    if (activeKey) {
                        closeWindow(activeKey);
                    }
                    // No-op when no window is open
                    break;
                }
                case "openOrFocus": {
                    const { windows } = useWindowStore.getState();
                    const win = windows[shortcut.window];
                    if (win && win.isOpen && !win.isMinimized) {
                        focusWindow(shortcut.window);
                    } else {
                        openWindow(shortcut.window);
                    }
                    break;
                }
                case "toggleSpotlight": {
                    toggleSpotlight();
                    usePanelsStore.getState().closeAllPanels();
                    break;
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
}
