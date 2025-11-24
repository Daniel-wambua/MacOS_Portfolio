import useWindowStore from "#store/window.js";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

const WindowWrapper = (component, windowKey) => {
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



        if (!isOpen) return null;

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className="absolute"
            >
                {component && component(props)}
            </section>
        );
    };
    Wrapped.displayName = `WindowWrapper(${component.displayName || component.name || 'Component'})`;

    return Wrapped;
};
export default WindowWrapper;
