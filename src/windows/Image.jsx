import WindowWrapper from "#hoc/WindowWrapper.jsx";
import useWindowStore from "#store/window.js";
import { WindowControls } from "#components";

const Image = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile.data;
  if (!data) return null;

  return (
    <>
      <div id="window-header">
        <WindowControls target="imgfile" />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">{data.name}</h2>
        {data.imageUrl && (
          <img src={data.imageUrl} alt={data.name} className="mb-2 max-w-xs" />
        )}
      </div>
    </>
  );
};

const ImageWindow = WindowWrapper(Image, "imgfile");

export default ImageWindow;
