import useWindowStore from "#store/window.js";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

        // Determine desktop vs touch device (no hook to avoid hook order issues)
        // Treat touch devices as "mobile" even when the browser requests Desktop Site (iOS Safari),
        // so windows still open full-screen and dragging is disabled.
        const isTouch = (typeof window !== 'undefined') && (
            'ontouchstart' in window ||
            (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
            (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
        );
        const isDesktop = !isTouch;

        // Animate in when opened
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            el.style.display = "block";

            gsap.fromTo(
                el,
                { scale: 0.8, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
            );
        }, [isOpen]);

        // Make draggable on desktop only (touch devices use full-screen, no drag)
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;
            if (!isDesktop) return;

            const [instance] = Draggable.create(el, { onPress: () => focusWindow(windowKey) });
            return () => instance && instance.kill();
        }, [isOpen]);

        // Hide if not open
        if (!isOpen) return null;

        // Default window style
        let style = isDesktop ? { zIndex, minWidth: 320, minHeight: 300 } : { zIndex };
        let className = [
            // Desktop window
            "absolute group bg-white rounded-xl shadow-lg",
            // Mobile: take over the screen safely
            // Also enforce full-screen on touch devices by adding inline styles below
            "max-sm:fixed max-sm:inset-0 max-sm:w-screen max-sm:h-[100dvh] max-sm:rounded-none max-sm:overflow-auto",
            // Respect notches and system bars
            "max-sm:pt-[env(safe-area-inset-top)] max-sm:pb-[env(safe-area-inset-bottom)] max-sm:pl-[env(safe-area-inset-left)] max-sm:pr-[env(safe-area-inset-right)]"
        ].join(' ');

        const section = (
            <section
                id={windowKey}
                ref={ref}
                style={isTouch ? { ...style, position: 'fixed', inset: 0, width: '100vw', height: '100dvh', borderRadius: 0, overflow: 'auto', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' } : style}
                className={className}
            >
                <Component {...props} />
            </section>
        );

        // Render into a portal to escape any unexpected stacking contexts
        // This ensures windows appear above wallpaper or other layers on mobile
        if (typeof document !== 'undefined') {
            return createPortal(section, document.body);
        }
        return section;
    };
    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;

    return Wrapped;
};
export default WindowWrapper;
