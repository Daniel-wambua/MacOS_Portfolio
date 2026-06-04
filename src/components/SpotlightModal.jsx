import { useRef, useEffect, useMemo, useCallback } from "react";
import gsap from "gsap";
import { dockApps, navLinks } from "#constants";
import useSpotlightStore from "#store/spotlight.js";
import useWindowStore from "#store/window.js";
import usePanelsStore from "#store/panels.js";

// Build static search items list from dock apps and nav links
const SEARCH_ITEMS = [
    ...dockApps
        .filter((a) => a.canOpen)
        .map((a) => ({ id: a.id, label: a.name, type: "window", icon: a.icon })),
    ...navLinks
        .filter((link) => !dockApps.some((a) => a.id === link.type))
        .map((link) => ({
            id: `nav-${link.type}`,
            label: link.name,
            type: "section",
            target: link.type,
            icon: null,
        })),
];

const MAX_RESULTS = 10;

const SpotlightModal = () => {
    const { isOpen, query, highlightedIndex, closeSpotlight, setQuery, setHighlightedIndex } =
        useSpotlightStore();
    const { openWindow, focusWindow, windows } = useWindowStore();

    const backdropRef = useRef(null);
    const modalRef = useRef(null);
    const inputRef = useRef(null);
    const previousFocusRef = useRef(null);
    const isClosingRef = useRef(false);
    const listRef = useRef(null);

    // Filter search items based on query
    const filteredItems = useMemo(() => {
        if (!query.trim()) return SEARCH_ITEMS.slice(0, MAX_RESULTS);
        const lowerQuery = query.toLowerCase();
        return SEARCH_ITEMS.filter((item) =>
            item.label.toLowerCase().includes(lowerQuery),
        ).slice(0, MAX_RESULTS);
    }, [query]);

    // Handle item selection
    const selectItem = useCallback(
        (item) => {
            if (item.type === "window") {
                const win = windows[item.id];
                if (win && win.isOpen) {
                    focusWindow(item.id);
                } else {
                    openWindow(item.id);
                }
            } else if (item.type === "section") {
                // Scroll to section — navLinks open windows via their type
                const win = windows[item.target];
                if (win && win.isOpen) {
                    focusWindow(item.target);
                } else {
                    openWindow(item.target);
                }
            }
            handleClose();
        },
        [windows, openWindow, focusWindow],
    );

    // Close with animation
    const handleClose = useCallback(() => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;

        const backdrop = backdropRef.current;
        const modal = modalRef.current;

        if (backdrop && modal) {
            gsap.to(backdrop, {
                opacity: 0,
                duration: 0.15,
                ease: "power1.in",
            });
            gsap.to(modal, {
                opacity: 0,
                y: -10,
                duration: 0.15,
                ease: "power1.in",
                onComplete: () => {
                    closeSpotlight();
                    isClosingRef.current = false;
                },
            });
        } else {
            closeSpotlight();
            isClosingRef.current = false;
        }
    }, [closeSpotlight]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                const nextIndex =
                    highlightedIndex >= filteredItems.length - 1 ? 0 : highlightedIndex + 1;
                setHighlightedIndex(nextIndex);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const prevIndex =
                    highlightedIndex <= 0 ? filteredItems.length - 1 : highlightedIndex - 1;
                setHighlightedIndex(prevIndex);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredItems.length > 0 && highlightedIndex < filteredItems.length) {
                    selectItem(filteredItems[highlightedIndex]);
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                handleClose();
            }
        },
        [highlightedIndex, filteredItems, setHighlightedIndex, selectItem, handleClose],
    );

    // Fade-in animation on open + auto-focus input
    useEffect(() => {
        if (isOpen) {
            // Close any open panels for mutual exclusivity
            usePanelsStore.getState().closeAllPanels();

            // Store previously focused element
            previousFocusRef.current = document.activeElement;
            isClosingRef.current = false;

            const backdrop = backdropRef.current;
            const modal = modalRef.current;

            if (backdrop && modal) {
                gsap.set(backdrop, { opacity: 0 });
                gsap.set(modal, { opacity: 0, y: -10 });

                gsap.to(backdrop, {
                    opacity: 1,
                    duration: 0.2,
                    ease: "power1.out",
                });
                gsap.to(modal, {
                    opacity: 1,
                    y: 0,
                    duration: 0.2,
                    ease: "power1.out",
                });
            }

            // Auto-focus input
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [isOpen]);

    // Return focus to previously focused element on close
    useEffect(() => {
        if (!isOpen && previousFocusRef.current) {
            const prevEl = previousFocusRef.current;
            requestAnimationFrame(() => {
                prevEl?.focus?.();
            });
            previousFocusRef.current = null;
        }
    }, [isOpen]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (!isOpen || !listRef.current) return;
        const highlighted = listRef.current.children[highlightedIndex];
        if (highlighted) {
            highlighted.scrollIntoView({ block: "nearest" });
        }
    }, [highlightedIndex, isOpen]);

    // Click outside handler
    const handleBackdropClick = useCallback(
        (e) => {
            if (e.target === backdropRef.current) {
                handleClose();
            }
        },
        [handleClose],
    );

    if (!isOpen) return null;

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 pt-[20vh]"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
        >
            <div
                ref={modalRef}
                className="w-full max-w-[500px] rounded-xl bg-white/95 shadow-2xl backdrop-blur-md overflow-hidden"
            >
                {/* Search input */}
                <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
                    <img
                        src="/icons/search.svg"
                        alt="search"
                        className="h-5 w-5 opacity-50"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>

                {/* Results list */}
                <div ref={listRef} className="max-h-[300px] overflow-y-auto py-2">
                    {filteredItems.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                            No results found
                        </div>
                    ) : (
                        filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`flex cursor-pointer items-center gap-3 px-4 py-2 transition-colors ${
                                    index === highlightedIndex
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                                onClick={() => selectItem(item)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {item.icon && (
                                    <img
                                        src={`/images/${item.icon}`}
                                        alt={item.label}
                                        className="h-6 w-6 rounded"
                                    />
                                )}
                                {!item.icon && (
                                    <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
                                        #
                                    </div>
                                )}
                                <span className="text-sm font-medium">{item.label}</span>
                                <span
                                    className={`ml-auto text-xs ${
                                        index === highlightedIndex
                                            ? "text-blue-100"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {item.type === "window" ? "Open" : "Navigate"}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpotlightModal;
