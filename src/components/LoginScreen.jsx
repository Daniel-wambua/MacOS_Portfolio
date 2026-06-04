import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useBootStore from "#store/boot.js";

const LoginScreen = () => {
    const phase = useBootStore((s) => s.phase);
    const markLoginComplete = useBootStore((s) => s.markLoginComplete);
    const overlayRef = useRef(null);
    const [avatarError, setAvatarError] = useState(false);

    useGSAP(() => {
        if (phase !== "login") return;

        const el = overlayRef.current;
        if (!el) return;

        // Set initial state
        gsap.set(el, { opacity: 1, pointerEvents: "all" });

        // After 1.5s delay, fade out over 1000ms
        const tween = gsap.to(el, {
            opacity: 0,
            duration: 1,
            delay: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(el, { pointerEvents: "none" });
                markLoginComplete();
            },
        });

        return () => {
            tween.kill();
        };
    }, [phase, markLoginComplete]);

    if (phase !== "login") return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{
                backgroundColor: "#1d1d1f",
                pointerEvents: "all",
            }}
            aria-label="Login screen - User: havoc"
            onKeyDown={(e) => e.preventDefault()}
            onMouseDown={(e) => e.preventDefault()}
        >
            {/* Avatar */}
            {avatarError ? (
                <div
                    className="flex items-center justify-center rounded-full bg-gray-600 text-white text-2xl font-semibold select-none"
                    style={{ width: 80, height: 80, minWidth: 80, minHeight: 80 }}
                    aria-hidden="true"
                >
                    H
                </div>
            ) : (
                <img
                    src="/images/daniel2.png"
                    alt="User avatar"
                    className="rounded-full object-cover"
                    style={{ width: 80, height: 80, minWidth: 80, minHeight: 80 }}
                    onError={() => setAvatarError(true)}
                    draggable={false}
                />
            )}

            {/* Username */}
            <p
                className="text-white text-lg font-medium select-none"
                style={{ marginTop: 12 }}
            >
                havoc
            </p>
        </div>
    );
};

export default LoginScreen;
