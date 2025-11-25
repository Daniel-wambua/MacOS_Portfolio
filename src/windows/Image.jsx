import WindowWrapper from "#hoc/WindowWrapper.jsx";
import useWindowStore from "#store/window.js";
import { WindowControls } from "#components";
import { Mail, Search } from "lucide-react";

const Image = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile.data;
  if (!data) return null;

  return (
    <>
      <div id="window-header" className="flex items-center px-2 gap-2">
        <WindowControls target="imgfile" />
        <div className="flex items-center ml-4 gap-1">
          <Search className="icon" />
          <Mail className="icon" />
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">{data.name}</h2>
            {data.imageUrl && (
              <img src={data.imageUrl} alt={data.name} className="mb-2 w-full h-[420px] object-contain bg-gray-100 rounded" style={{maxWidth: '100%', maxHeight: '420px'}} />
            )}
      </div>
    </>
  );
};

const ImageWindow = WindowWrapper(Image, "imgfile");

export default ImageWindow;
