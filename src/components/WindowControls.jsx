
import useWindowStore from "#store/window.js";


const WindowControls = ({ target }) => {
  const { closeWindow } = useWindowStore();
  return (
    <div id="window-controls" className="flex items-center gap-2 px-2 py-1">
      {/* Red: Close */}
      <button
        className="w-3 h-3 rounded-full bg-[#ff5f56] border border-gray-300 hover:brightness-90 transition"
        aria-label="Close"
        onClick={() => closeWindow(target)}
      />
      {/* Yellow: Minimize (decorative) */}
      <button
        className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-gray-300 hover:brightness-90 transition"
        aria-label="Minimize (decorative)"
        tabIndex={-1}
        disabled
      />
      {/* Green: Maximize (decorative) */}
      <button
        className="w-3 h-3 rounded-full bg-[#27c93f] border border-gray-300 hover:brightness-90 transition"
        aria-label="Maximize (decorative)"
        tabIndex={-1}
        disabled
      />
    </div>
  );
};

export default WindowControls;
