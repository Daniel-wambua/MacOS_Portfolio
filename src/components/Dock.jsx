import { useRef, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import { dockApps } from "#constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useWindowStore from "#store/window.js";

const Dock = () => {
    const { openWindow , closeWindow, restoreWindow, windows } = useWindowStore();
    const dockRef = useRef(null);
    const isAnimating = useRef({});
    const isRestoring = useRef({});
    const iconRefs = useRef({});

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

  const toggleApp = useCallback((app) => {
    if (!app.canOpen) return;

    const win = windows[app.id];
    if (!win) return;

    // Prevent duplicate animations
    if (isAnimating.current[app.id]) return;

    if (win.isMinimized) {
      // Prevent duplicate restore clicks during animation
      if (isRestoring.current[app.id]) return;
      isRestoring.current[app.id] = true;

      // Restore the window in the store (sets isMinimized=false, isOpen=true)
      restoreWindow(app.id);

      // Reset the restoring flag after the 400ms restore animation completes
      setTimeout(() => {
        isRestoring.current[app.id] = false;
      }, 400);
      return;
    }

    if (win.isOpen) {
      closeWindow(app.id);
    } else {
      // App is NOT open and NOT minimized — play bounce and open immediately
      isAnimating.current[app.id] = true;
      openWindow(app.id);

      const iconEl = iconRefs.current[app.id];
      if (iconEl) {
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating.current[app.id] = false;
          },
        });
        tl.to(iconEl, { y: '-=30', duration: 0.15, ease: 'power1.out' })
          .to(iconEl, { y: '+=30', duration: 0.15, ease: 'power1.in' })
          .to(iconEl, { y: '-=15', duration: 0.15, ease: 'power1.out' })
          .to(iconEl, { y: '+=15', duration: 0.15, ease: 'power1.in' });
      } else {
        isAnimating.current[app.id] = false;
      }
    }
  }, [windows, openWindow, closeWindow, restoreWindow]);


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
          const isActive = win?.isOpen || win?.isMinimized;
          return (
            <div key={id} className="relative flex justify-center">
              <button
                type="button"
                className="dock-icon"
                ref={(el) => { iconRefs.current[id] = el; }}
                aria-label={name}
                data-app-id={id}
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
              {/* Show dot when app is open or minimized */}
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