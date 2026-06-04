import useWindowStore from "#store/window.js";
import { useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import ResizeHandles from "../components/ResizeHandles.jsx";

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, setWindowLayout, windows } = useWindowStore();
        const { isOpen, isMinimized, zIndex, lastPosition, lastSize } = windows[windowKey];
        const ref = useRef(null);
        const draggableRef = useRef(null);
        const prevIsMinimizedRef = useRef(false);
        const isMinimizingRef = useRef(false);

        // Determine desktop vs touch device (no hook to avoid hook order issues)
        // Treat touch devices as "mobile" even when the browser requests Desktop Site (iOS Safari),
        // so windows still open full-screen and dragging is disabled.
        const isTouch = (typeof window !== 'undefined') && (
            'ontouchstart' in window ||
            (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
            (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
        );
        const isDesktop = !isTouch;

        // Focus window on pointerdown (brings to front)
        const handlePointerDown = useCallback(() => {
            focusWindow(windowKey);
        }, [focusWindow]);

        // Animate in when opened
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            // Don't play open animation if we're in the middle of minimizing
            if (isMinimizingRef.current) return;

            el.style.display = "flex";
            el.style.flexDirection = "column";

            // Restore last position/size if available, otherwise reset to default
            if (isDesktop && lastPosition) {
                el.style.left = `${lastPosition.x}px`;
                el.style.top = `${lastPosition.y}px`;
            } else if (isDesktop) {
                // Default: center the window on screen
                el.style.left = "";
                el.style.top = "";
                el.style.left = `${Math.max(50, (window.innerWidth - el.offsetWidth) / 2)}px`;
                el.style.top = `${Math.max(50, (window.innerHeight - el.offsetHeight) / 3)}px`;
            }
            if (isDesktop && lastSize) {
                el.style.width = `${lastSize.width}px`;
                el.style.height = `${lastSize.height}px`;
            } else {
                el.style.width = "";
                el.style.height = "";
            }

            // Clear any leftover transforms from previous drag
            gsap.set(el, { x: 0, y: 0 });

            gsap.fromTo(
                el,
                { scale: 0.8, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
            );
        }, [isOpen]);

        // Minimize-to-dock animation
        useEffect(() => {
            const el = ref.current;
            // Detect transition: isMinimized went from false to true
            if (isMinimized && !prevIsMinimizedRef.current && el) {
                isMinimizingRef.current = true;

                // Ensure the element is visible for the animation
                el.style.display = "flex";

                // Find the dock icon position for this window
                const dockIcon = document.querySelector(`#dock .dock-icon[data-app-id="${windowKey}"]`);
                let targetX = window.innerWidth / 2;
                let targetY = window.innerHeight;

                if (dockIcon) {
                    const iconRect = dockIcon.getBoundingClientRect();
                    targetX = iconRect.left + iconRect.width / 2;
                    targetY = iconRect.top + iconRect.height / 2;
                }

                // Get the window's current center position
                const windowRect = el.getBoundingClientRect();
                const windowCenterX = windowRect.left + windowRect.width / 2;
                const windowCenterY = windowRect.top + windowRect.height / 2;

                // Calculate translation delta toward dock icon
                const deltaX = targetX - windowCenterX;
                const deltaY = targetY - windowCenterY;

                gsap.to(el, {
                    scale: 0,
                    x: `+=${deltaX}`,
                    y: `+=${deltaY}`,
                    duration: 0.4,
                    ease: "power2.in",
                    onComplete: () => {
                        // Hide the element after animation
                        el.style.display = "none";
                        // Reset transforms for when the window is restored
                        gsap.set(el, { scale: 1, x: 0, y: 0, clearProps: "transform" });
                        isMinimizingRef.current = false;
                    },
                });
            }

            prevIsMinimizedRef.current = isMinimized;
        }, [isMinimized, windowKey]);

        // Make draggable on desktop only (touch devices use full-screen, no drag)
        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;
            if (!isDesktop) return;

            // Only allow dragging from the window header (title bar)
            const header = el.querySelector('#window-header');

            const [instance] = Draggable.create(el, {
                type: "x,y",
                trigger: header || el, // drag only from header; fallback to whole window if no header
                onPress: () => focusWindow(windowKey),
                onDrag: function () {
                    // Constrain so at least 50px of title bar remains within viewport
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    const elWidth = el.offsetWidth;

                    // Get current position
                    let x = this.x;
                    let y = this.y;

                    // The element's left = el.offsetLeft + x (since Draggable uses transforms)
                    // We need: at least 50px of horizontal title bar in viewport
                    // Horizontal: max(elLeft, 0) to min(elLeft + elWidth, viewportWidth) >= 50
                    const elLeft = el.offsetLeft + x;
                    const elRight = elLeft + elWidth;

                    // Ensure at least 50px visible horizontally
                    // Left boundary: elRight must be >= 50 (at least 50px visible from left edge)
                    if (elRight < 50) {
                        x = 50 - el.offsetLeft - elWidth;
                    }
                    // Right boundary: elLeft must be <= viewportWidth - 50 (at least 50px visible from right)
                    if (elLeft > viewportWidth - 50) {
                        x = viewportWidth - 50 - el.offsetLeft;
                    }

                    // Vertical: title bar top must not go below viewport bottom
                    // and at least some of title bar must be visible from top
                    const elTop = el.offsetTop + y;
                    // Don't let the top go below viewport - 50px
                    if (elTop > viewportHeight - 50) {
                        y = viewportHeight - 50 - el.offsetTop;
                    }
                    // Don't let the top go above -50px (allow partial hide at top, but keep 50px visible)
                    if (elTop < -50) {
                        y = -50 - el.offsetTop;
                    }

                    // Apply constrained position
                    gsap.set(el, { x, y });
                    this.update();
                },
                onDragEnd: function () {
                    // Store the final position in the window store
                    const rect = el.getBoundingClientRect();
                    setWindowLayout(windowKey, {
                        position: { x: rect.left, y: rect.top },
                    });
                },
            });

            draggableRef.current = instance;
            return () => {
                if (instance) instance.kill();
                draggableRef.current = null;
            };
        }, [isOpen]);

        // Store size after resize ends (listen for mouseup after resize handles move)
        // The ResizeHandles component modifies the element directly, so we observe size on mouseup
        useEffect(() => {
            if (!isOpen || !isDesktop) return;

            const handleMouseUp = () => {
                const el = ref.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                // Only store if the element has been resized (has explicit width/height)
                if (el.style.width && el.style.height) {
                    setWindowLayout(windowKey, {
                        position: { x: rect.left, y: rect.top },
                        size: { width: rect.width, height: rect.height },
                    });
                }
            };

            document.addEventListener("mouseup", handleMouseUp);
            return () => document.removeEventListener("mouseup", handleMouseUp);
        }, [isOpen, isDesktop, setWindowLayout]);

        // Keep the window mounted during minimize animation.
        // Render when open OR when minimized (so the animation can play before hiding).
        if (!isOpen && !isMinimized) return null;

        // Default window style
        // Add scrollbars automatically when content overflows, on BOTH desktop and touch.
        // On desktop, also constrain max height so long content becomes scrollable within the viewport.
        let style = isDesktop
            ? {
                zIndex,
                minWidth: 320,
                minHeight: 300,
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
                onPointerDown={handlePointerDown}
                style={isTouch ? {
                    ...style,
                    position: 'fixed',
                    top: 'calc(env(safe-area-inset-top) + 12px)',
                    bottom: 'calc(env(safe-area-inset-bottom) + 12px)',
                    left: '12px',
                    right: '12px',
                    width: 'auto',
                    maxWidth: 'calc(100vw - 24px)',
                    height: 'auto',
                    maxHeight: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 24px)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: 'white'
                } : { ...style, overflow: 'visible', display: 'flex', flexDirection: 'column' }}
                className={className}
            >
                {/* Inner scrollable content container */}
                <div style={{
                    flex: 1,
                    width: '100%',
                    overflow: 'auto',
                    minHeight: 0,
                    borderRadius: 'inherit',
                }}>
                    <Component {...props} />
                </div>
                {isDesktop && (
                    <ResizeHandles windowRef={ref} windowKey={windowKey} />
                )}
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
