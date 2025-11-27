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
        // Add scrollbars automatically when content overflows, on BOTH desktop and touch.
        // On desktop, also constrain max height so long content becomes scrollable within the viewport.
        let style = isDesktop
            ? {
                zIndex,
                minWidth: 320,
                minHeight: 300,
                // Constrain height within viewport so content can scroll
                maxHeight: 'calc(100dvh - 80px)',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
            }
            : { zIndex };
        let className = [
            // Desktop window (floating)
            "absolute group bg-white rounded-xl shadow-lg",
            // Mobile: floating panel (not full-bleed). We avoid enforcing full-screen via classes;
            // inline styles below will constrain the window within the viewport with margins
            // and safe-area offsets.
        ].join(' ');

        const section = (
            <section
                id={windowKey}
                ref={ref}
                style={isTouch ? {
                    ...style,
                    position: 'fixed',
                    // Keep comfortable margins from edges and respect safe areas
                    top: 'calc(env(safe-area-inset-top) + 12px)',
                    bottom: 'calc(env(safe-area-inset-bottom) + 12px)',
                    left: '12px',
                    right: '12px',
                    // Constrain size so it never expands full-screen edge-to-edge
                    width: 'auto',
                    maxWidth: 'calc(100vw - 24px)',
                    height: 'auto',
                    maxHeight: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 24px)',
                    borderRadius: 12,
                    overflow: 'auto',
                    backgroundColor: 'white'
                } : style}
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
