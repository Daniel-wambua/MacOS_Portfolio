import { locations } from "#constants";
import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";

const projects = locations.work?.children ?? [];

const Home = () => {
    const {setActiveLocation} = useLocationStore();
    const {openWindow} = useWindowStore();

    const handleOpenProjectFinder = (project) => {
        setActiveLocation(project);
        openWindow("finder");
    };
    useGSAP(() =>{
        // Enable dragging only on non-touch desktop devices
        const isTouch = (typeof window !== 'undefined') && (
            'ontouchstart' in window ||
            (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
            (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
        );
        if (isTouch) return;
        Draggable.create(".folder");
    },[]);
    return (
        <section id="home">
            <ul>
                {projects.map((project) => (
                    <li
                        key={project.id}
                        className={clsx(
                            "group folder select-none",
                            project.windowPosition
                        )}
                    >
                        <button
                            type="button"
                            onClick={() => handleOpenProjectFinder(project)}
                            className="flex flex-col items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 active:scale-95 transition p-2 min-w-[44px] min-h-[44px]"
                            aria-label={`Open ${project.name}`}
                        >
                            <img src="/images/folder.png" alt="" aria-hidden="true" draggable={false} />
                            <p>{project.name}</p>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
};
export default Home
