import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useBootStore from "#store/boot.js";

const BootScreen = () => {
    const { phase, markBootComplete } = useBootStore();
    const overlayRef = useRef(null);
    const progressBarRef = useRef(null);

    useGSAP(() => {
        if (phase !== "booting") return;

        const overlay = overlayRef.current;
        const progressBar = progressBarRef.current;
        if (!overlay || !progressBar) return;

        const tl = gsap.timeline();

        // Animate progress bar from 0% to 100% over 3 seconds
        tl.fromTo(
            progressBar,
            { width: "0%" },
            { width: "100%", duration: 3, ease: "power1.inOut" }
        );

        // Fade out the entire overlay over 500ms
        tl.to(overlay, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                markBootComplete();
            },
        });

        return () => {
            tl.kill();
        };
    }, [phase]);

    if (phase !== "booting") return null;

    return (
        <div
            ref={overlayRef}
            aria-label="Loading portfolio"
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "#000",
                zIndex: 9999,
                pointerEvents: "all",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Apple silhouette SVG */}
            <svg
                width="64"
                height="64"
                viewBox="0 0 170 170"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ minWidth: 64, minHeight: 64 }}
            >
                <path d="M150.4 130.2c-2.8 6.5-6.1 12.4-10 17.9-5.3 7.5-9.6 12.7-13.1 15.6-5.2 4.8-10.8 7.2-16.8 7.3-4.3 0-9.5-1.2-15.5-3.7-6.1-2.5-11.6-3.7-16.7-3.7-5.3 0-11 1.2-17.1 3.7-6.1 2.5-11 3.8-14.8 3.9-5.7 0.2-11.4-2.3-17.2-7.5-3.7-3.1-8.4-8.5-13.9-16.1-5.9-8.2-10.8-17.8-14.6-28.6C-3.2 108.4-5 98.1-5 88.1c0-11.4 2.5-21.3 7.4-29.5 3.9-6.6 9-11.8 15.5-15.6 6.5-3.8 13.5-5.8 21-5.9 4.6 0 10.5 1.4 17.9 4.2 7.4 2.8 12.1 4.2 14.2 4.2 1.6 0 6.9-1.7 15.8-5 8.5-3.1 15.6-4.4 21.4-3.8 15.8 1.3 27.7 7.6 35.5 19-14.1 8.6-21.1 20.6-21 36 0.1 12 4.5 22 13.1 29.8 3.9 3.7 8.2 6.5 13.1 8.5-1 3-2.1 5.9-3.5 8.8zM119.1 7.3c0 9.4-3.4 18.2-10.3 26.3-8.3 9.7-18.3 15.3-29.2 14.4-0.1-1.2-0.2-2.4-0.2-3.6 0-9 4-18.7 11-26.6 3.5-4 8-7.4 13.4-10 5.4-2.6 10.5-4.1 15.3-4.3 0.1 1.3 0.1 2.5 0.1 3.8z" />
            </svg>

            {/* Progress bar container */}
            <div
                style={{
                    marginTop: 32,
                    width: 200,
                    height: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                {/* Progress bar fill */}
                <div
                    ref={progressBarRef}
                    style={{
                        height: "100%",
                        width: "0%",
                        backgroundColor: "#fff",
                        borderRadius: 2,
                    }}
                />
            </div>
        </div>
    );
};

export default BootScreen;
