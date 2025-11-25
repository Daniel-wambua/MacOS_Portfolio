import useWindowStore from "#store/window.js";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

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

        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;
            const [instance] = Draggable.create(el, { onPress: () => focusWindow(windowKey) });
            return () => instance && instance.kill();
        }, [isOpen]);

        // Hide if not open
        if (!isOpen) return null;

        // Default window style
        let style = { zIndex, minWidth: 320, minHeight: 300 };
        let className = "absolute group bg-white rounded-xl shadow-lg max-sm:fixed max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:z-40 max-sm:overflow-auto";

        return (
            <section
                id={windowKey}
                ref={ref}
                style={style}
                className={className}
            >
                <Component {...props} />
            </section>
        );
    };
    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;

    return Wrapped;
};
export default WindowWrapper;
