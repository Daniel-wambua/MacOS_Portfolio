import WindowWrapper from "#hoc/WindowWrapper.jsx";
import useWindowStore from "#store/window.js";
import { WindowControls } from "#components";

const Text = () => {
  const { windows } = useWindowStore();
  const data = windows.txtfile.data;
  if (!data) return null;

  return (
    <>
      <div id="window-header">
        <WindowControls target="txtfile" />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">{data.name}</h2>
        {data.subtitle && <h3 className="text-md font-semibold mb-2">{data.subtitle}</h3>}
        {data.image && (
          <img src={data.image} alt={data.name} className="mb-2 max-w-xs" />
        )}
        {Array.isArray(data.description) && data.description.map((desc, i) => (
          <p key={i} className="mb-2 text-sm">{desc}</p>
        ))}
      </div>
    </>
  );
};

const TextWindow = WindowWrapper(Text, "txtfile");

export default TextWindow;
