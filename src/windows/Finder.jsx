import { WindowControls } from "#components"
import { Search } from "lucide-react"
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {locations} from "#constants/index.js";
import useLocationStore from "#store/location.js";
import clsx from "clsx";
import useWindowStore from "#store/window.js";

const Finder = () => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();
    const locationValues = Object.values(locations);

    // mobile: keep a selected id for the dropdown
    const handleMobileSelect = (e) => {
        const id = Number(e.target.value);
        const loc = locationValues.find((l) => l.id === id);
        if (loc) setActiveLocation(loc);
    };
    const renderList = (name, items) => {
        const safeItems = Array.isArray(items) ? items : [];
        return (
            <div>
                <h3>{name}</h3>
                <ul>
                    {safeItems.map((item) => (
                        <li
                            key={item.id}
                            className={clsx(item.id === activeLocation.id ? "active" : "not-active")}
                            onClick={() => setActiveLocation(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={item.icon} className="w-4" alt={item.name} />
                            <p className="text-sm font-medium truncate">{item.name}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const openItem = (item) => {
        if (item.fileType === "pdf") return openWindow("resume");
        if (item.kind === "folder") return setActiveLocation(item);
        if (["fig", "url"].includes(item.fileType) && item.href)
            return window.open(item.href, "_blank");

        // Open txt files in the txtfile window
        if (item.fileType === "txt") return openWindow("txtfile", item);

        // Open image files in the imgfile window
        if (item.fileType === "img") return openWindow("imgfile", item);

        openWindow(`${item.fileType}${item.kind}`, item);
        console.log('Open item:', item);
    };
    return (
       <>
            <div id="window-header" className="flex items-center gap-2">
                <WindowControls target="finder" />
                <Search className="icon" />
                {/* mobile select to pick active location */}
                <div className="sm:hidden ml-2 flex-1">
                    <select
                        value={activeLocation?.id}
                        onChange={handleMobileSelect}
                        className="w-full p-2 rounded-md border"
                        aria-label="Select location"
                    >
                        {locationValues.map((loc) => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                </div>
            </div>
           <div className="bg-white flex h-full">
               <div className="sidebar hidden sm:block">
                   <div>
                       {renderList('Favourites', Object.values(locations))}
                       {renderList('Work', (locations.work && Array.isArray(locations.work.children)) ? locations.work.children : [])}
                   </div>
               </div>

           <ul className="content">
               {activeLocation?.children?.map((item) => (
                   <li
                       key={item.id}
                       className={item.position}
                       onClick={() => openItem(item)}
                       style={{ cursor: 'pointer' }}
                   >
                       <img src={item.icon} alt={item.name} />
                       <p>{item.name}</p>
                   </li>
               ))}
           </ul>
           </div>
       </>
    );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
