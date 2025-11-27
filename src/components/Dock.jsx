import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import { dockApps } from "#constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useWindowStore from "#store/window.js";

const Dock = () => {
    const { openWindow , closeWindow, windows } = useWindowStore();
    const dockRef = useRef(null);

  useGSAP(() => {
    const dock =dockRef.current;
    if(!dock) return;

    const icons = dock.querySelectorAll(".dock-icon");


    const animateIcons = (mouseX) => {
      const { left } = dock.getBoundingClientRect();
      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.5) / 2000);
        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      animateIcons(e.clientX - left);
    };

    const resetIcons = () => {
      icons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      });
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  const toggleApp = (app) => {
  //TODO Implement Open Window Logic
    if (!app.canOpen) return;

    const win = windows[app.id];
    if (!win) return;

    if (win.isOpen) {
        closeWindow(app.id);
    } else {
            openWindow(app.id);
        }
        console.log(win);
    };


  return (
    <section
      id="dock"
      // Restore previous clean behavior: hide on small screens, no fixed stacking
      className="max-sm:hidden"
    >
      <div
        ref={dockRef}
        className="dock-container"
      >
        {dockApps.map(({ id, name, icon, canOpen }) => {
          const win = windows[id];
          const isActive = win?.isOpen;
          return (
            <div key={id} className="relative flex justify-center">
              <button
                type="button"
                className="dock-icon"
                aria-label={name}
                data-tooltip-id="dock-tooltip"
                data-tooltip-content={name}
                data-tooltip-delay-show={150}
                disabled={!canOpen}
                onClick={() => toggleApp({ id, canOpen })}
              >
                <img
                  src={`/images/${icon}`}
                  alt={name}
                  loading="lazy"
                  className={canOpen ? "" : "opacity-60"}
                />
              </button>
              {/* Show dot only if open */}
              {canOpen && (
                <span
                  className={`absolute left-1/2 -translate-x-1/2 bottom-0 mb-1 w-2 h-2 rounded-full transition-all
                    ${isActive ? 'bg-blue-500 scale-100' : 'scale-0'}
                    shadow-md
                  `}
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </div>
          );
        })}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
}

export default Dock;