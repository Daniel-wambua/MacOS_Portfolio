import { useRef } from "react";
import useWindowStore from "#store/window.js";


const WindowControls = ({ target }) => {
  const { closeWindow, minimizeWindow } = useWindowStore();
  const isMinimizing = useRef(false);

  const handleMinimize = () => {
    if (isMinimizing.current) return;
    isMinimizing.current = true;
    minimizeWindow(target);
    setTimeout(() => {
      isMinimizing.current = false;
    }, 400);
  };

  return (
    <div id="window-controls" className="flex items-center gap-1 sm:gap-1 px-2 py-1 max-sm:py-2">
      {/* Red: Close */}
      <button
        type="button"
        className="inline-flex items-center justify-center p-1 max-sm:p-2 max-sm:min-w-[44px] max-sm:min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 active:scale-95 transition"
        aria-label="Close"
        onClick={() => closeWindow(target)}
        title="Close"
      >
        <span className="block w-3 h-3 sm:w-3 sm:h-3 max-sm:w-4 max-sm:h-4 rounded-full bg-[#ff5f56] border border-gray-300" />
      </button>
      {/* Yellow: Minimize */}
      <button
        type="button"
        className="inline-flex items-center justify-center p-1 max-sm:p-2 max-sm:min-w-[44px] max-sm:min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 active:scale-95 transition"
        aria-label="Minimize"
        onClick={handleMinimize}
        title="Minimize"
      >
        <span className="block w-3 h-3 sm:w-3 sm:h-3 max-sm:w-4 max-sm:h-4 rounded-full bg-[#ffbd2e] border border-gray-300" />
      </button>
      {/* Green: Maximize (decorative) */}
      <button
        type="button"
        className="inline-flex items-center justify-center p-1 max-sm:p-2 max-sm:min-w-[44px] max-sm:min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 transition"
        aria-label="Maximize (decorative)"
        title="Maximize"
        tabIndex={-1}
        disabled
      >
        <span className="block w-3 h-3 sm:w-3 sm:h-3 max-sm:w-4 max-sm:h-4 rounded-full bg-[#27c93f] border border-gray-300" />
      </button>
    </div>
  );
};

export default WindowControls;
