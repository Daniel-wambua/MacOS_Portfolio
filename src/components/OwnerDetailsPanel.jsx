import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { socials } from "#constants";
import usePanelsStore from "#store/panels.js";
import useBootStore from "#store/boot.js";

const OWNER_NAME = "Daniel";
const OWNER_AVATAR = "/images/daniel2.png";
const OWNER_ROLE = "Cybersecurity Engineer & Full-Stack Developer";

const OwnerDetailsPanel = () => {
    const isOpen = usePanelsStore((s) => s.ownerDetails);
    const closeOwnerDetails = usePanelsStore((s) => s.closeOwnerDetails);

    const panelRef = useRef(null);
    const isAnimatingRef = useRef(false);

    // Fade in on open
    useEffect(() => {
        if (isOpen && panelRef.current) {
            gsap.killTweensOf(panelRef.current);
            gsap.set(panelRef.current, { opacity: 0 });
            gsap.to(panelRef.current, {
                opacity: 1,
                duration: 0.15,
                ease: "power1.out",
                onStart: () => {
                    isAnimatingRef.current = true;
                },
                onComplete: () => {
                    isAnimatingRef.current = false;
                },
            });
        }
    }, [isOpen]);

    // Fade out helper
    const animateClose = useCallback(() => {
        if (!panelRef.current) {
            closeOwnerDetails();
            return;
        }
        gsap.killTweensOf(panelRef.current);
        gsap.to(panelRef.current, {
            opacity: 0,
            duration: 0.1,
            ease: "power1.in",
            onComplete: () => {
                closeOwnerDetails();
            },
        });
    }, [closeOwnerDetails]);

    // Click-outside handler
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                animateClose();
            }
        };

        // Delay adding listener so the opening click doesn't immediately close it
        const timeoutId = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, animateClose]);

    // Escape key handler - return focus to user icon
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                closeOwnerDetails();
                // Return focus to user icon
                const userIcon = document.querySelector('[data-panel-trigger="owner-details"]');
                if (userIcon) {
                    requestAnimationFrame(() => userIcon.focus());
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeOwnerDetails]);

    // Cleanup GSAP on unmount
    useEffect(() => {
        return () => {
            if (panelRef.current) {
                gsap.killTweensOf(panelRef.current);
            }
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className="absolute top-full right-0 mt-2 w-72 rounded-xl bg-white/95 shadow-xl backdrop-blur-md border border-gray-200/50 overflow-hidden"
            style={{ zIndex: 5000, opacity: 0 }}
            role="menu"
            aria-label="Owner details panel"
        >
            {/* Profile header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-100">
                <img
                    src={OWNER_AVATAR}
                    alt={`${OWNER_NAME}'s profile`}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
                    onError={(e) => {
                        e.target.src = "";
                        e.target.className = "h-12 w-12 rounded-full bg-gray-300 ring-2 ring-gray-200";
                    }}
                />
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                        {OWNER_NAME}
                    </span>
                    <span className="text-xs text-gray-500 truncate" title={OWNER_ROLE}>
                        {OWNER_ROLE.slice(0, 60)}
                    </span>
                </div>
            </div>

            {/* Social links */}
            <div className="px-2 py-2">
                {socials && socials.length > 0 ? (
                    <ul className="space-y-0.5">
                        {socials.map((social) => (
                            <li key={social.id}>
                                <a
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                                >
                                    <img
                                        src={social.icon}
                                        alt={social.text}
                                        className="h-4 w-4"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    <span>{social.text}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="px-3 py-4 text-center text-sm text-gray-400">
                        No links available
                    </p>
                )}
            </div>

            {/* Logout button */}
            <div className="px-2 pb-2 pt-1 border-t border-gray-100">
                <button
                    onClick={() => {
                        closeOwnerDetails();
                        try { sessionStorage.removeItem("boot_completed"); } catch {}
                        useBootStore.getState().initBoot();
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 w-full"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default OwnerDetailsPanel;
