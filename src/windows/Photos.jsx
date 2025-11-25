import { Mail, Search } from "lucide-react";

import WindowWrapper from "#hoc/WindowWrapper";
import WindowControls from "#components/WindowControls";
import { gallery, photosLinks } from "#constants";
import { useState } from "react";
import useWindowStore from "#store/window";


const Photos = () => {
    const { openWindow } = useWindowStore();
    const [selectedLink, setSelectedLink] = useState(photosLinks[0]?.id);

    const handlePhotoClick = (photo) => {
        openWindow("imgfile", { name: photo.title || "Photo", imageUrl: photo.img });
    };

    // Find the selected link's title for filtering
    const selectedCategory = photosLinks.find(link => link.id === selectedLink)?.title;
    const filteredGallery = selectedCategory === "All Photos"
        ? gallery
        : gallery.filter(photo => photo.category === selectedCategory);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden min-w-[320px] min-h-[400px] max-w-[90vw] max-h-[80vh] flex flex-col w-[700px] h-[500px]">
            <div id="window-header" className="flex-shrink-0 flex items-center px-2 gap-2">
                <WindowControls target="photos" />
                <div className="flex items-center ml-4 gap-1">
                    <Search className="icon" />
                    <Mail className="icon" />
                </div>
            </div>
            <div className="bg-white flex h-full flex-1">
                {/* sidebar hidden on small screens, use select instead */}
                <div className="sidebar hidden sm:flex w-36 bg-gray-50 border-r flex-col items-start py-4">
                    <h3 className="text-xs font-semibold text-gray-500 mb-2 ml-3">Locations</h3>
                    <ul className="w-full">
                        {photosLinks.map((link) => (
                            <li
                                key={link.id}
                                className={
                                    "flex items-center gap-2 px-3 py-2 rounded cursor-pointer mb-1 " +
                                    (selectedLink === link.id ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-200 text-gray-700")
                                }
                                onClick={() => setSelectedLink(link.id)}
                                style={{ minHeight: 32 }}
                            >
                                <img src={link.icon} alt={link.title} className="w-4 h-4" />
                                <span className="text-sm whitespace-nowrap">{link.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* mobile select for categories */}
                <div className="sm:hidden p-3 border-b">
                    <select
                        value={selectedLink}
                        onChange={(e) => setSelectedLink(Number(e.target.value))}
                        className="w-full p-2 rounded-md border"
                        aria-label="Select photo category"
                    >
                        {photosLinks.map((link) => (
                            <option key={link.id} value={link.id}>{link.title}</option>
                        ))}
                    </select>
                </div>
                <div className="p-4 flex-1 overflow-auto">
                    <h2 className="text-lg font-bold mb-4">Photos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {filteredGallery.length === 0 ? (
                            <div className="col-span-4 text-center text-gray-400 py-8">No photos in this category.</div>
                        ) : (
                            filteredGallery.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="cursor-pointer border rounded overflow-hidden hover:shadow-lg"
                                    onClick={() => handlePhotoClick(photo)}
                                >
                                    <img src={photo.img} alt={`Photo ${photo.id}`} className="w-full h-40 object-cover" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WindowWrapper(Photos, "photos");
