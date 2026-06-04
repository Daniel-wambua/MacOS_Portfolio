import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { navIcons, navLinks } from "#constants";
import useWindowStore from "#store/window.js";
import useSpotlightStore from "#store/spotlight.js";
import usePanelsStore from "#store/panels.js";
import NotificationCenterPanel from "./NotificationCenterPanel.jsx";
import OwnerDetailsPanel from "./OwnerDetailsPanel.jsx";

const Navbar = () => {
    const {openWindow} = useWindowStore();
    const {toggleSpotlight} = useSpotlightStore();
    const {toggleNotificationCenter, toggleOwnerDetails} = usePanelsStore();
    const [currentTime, setCurrentTime] = useState(dayjs().format("ddd MMM D h:mm:ss A"));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs().format("ddd MMM D h:mm:ss A"));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getIconClickHandler = (id) => {
        switch (id) {
            case 2: return toggleSpotlight;
            case 3: return toggleOwnerDetails;
            case 4: return toggleNotificationCenter;
            default: return undefined;
        }
    };

  return (
    <nav>
    <div>
        <img src="/images/logo.svg" alt="logo"/>
        <p className="font-bold">Daniel's Portfolio</p>
        <ul>
            {navLinks.map(({ id,name ,type}) => (
                <li key={id} onClick={() => openWindow(type)}>
                    <p>{name}</p>
                </li>
            ))}
        </ul>
        {/* Removed mobile-only text button that looked out of place on the top bar */}
        </div>
        <div className="relative">
            <ul>
                {navIcons.map(({id, img }) => (
                    <li
                        key={id}
                        onClick={getIconClickHandler(id)}
                        {...(id === 3 ? { "data-panel-trigger": "owner-details", tabIndex: 0 } : {})}
                    >
                        <img src={img} className="icon-hover"
                         alt={`icon-${id}`} />
                    </li>
                ))}
            </ul>
            <time>{currentTime}</time>
            <OwnerDetailsPanel />
        </div>
        <NotificationCenterPanel />
    </nav>
  );
};

export default Navbar;