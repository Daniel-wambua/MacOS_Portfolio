import { useCallback, useEffect, useRef } from "react";
import useWindowStore from "#store/window.js";

const MIN_WIDTH = 320;
const MIN_HEIGHT = 200;

/**
 * Returns max allowed width/height based on viewport.
 */
function getMaxDimensions() {
    return {
        maxWidth: window.innerWidth,
        maxHeight: window.innerHeight - 80,
    };
}

/**
 * Handle definitions: position, size, and cursor for each of the 8 resize handles.
 * Directions indicate which edges are being dragged:
 *   n = top, s = bottom, e = right, w = left
 */
const HANDLES = [
    // Edges
    { id: "top", cursor: "ns-resize", dirs: "n", style: { top: 0, left: 12, right: 12, height: 8 } },
    { id: "bottom", cursor: "ns-resize", dirs: "s", style: { bottom: 0, left: 12, right: 12, height: 8 } },
    { id: "left", cursor: "ew-resize", dirs: "w", style: { top: 12, bottom: 12, left: 0, width: 8 } },
    { id: "right", cursor: "ew-resize", dirs: "e", style: { top: 12, bottom: 12, right: 0, width: 8 } },
    // Corners
    { id: "top-left", cursor: "nwse-resize", dirs: "nw", style: { top: 0, left: 0, width: 12, height: 12 } },
    { id: "top-right", cursor: "nesw-resize", dirs: "ne", style: { top: 0, right: 0, width: 12, height: 12 } },
    { id: "bottom-left", cursor: "nesw-resize", dirs: "sw", style: { bottom: 0, left: 0, width: 12, height: 12 } },
    { id: "bottom-right", cursor: "nwse-resize", dirs: "se", style: { bottom: 0, right: 0, width: 12, height: 12 } },
];

/**
 * ResizeHandles renders 8 invisible drag handles around a window element.
 * Uses plain mousedown/mousemove/mouseup events for resize logic.
 *
 * Props:
 *   windowRef - React ref to the window's DOM element
 *   windowKey - string key for focusWindow calls
 */
const ResizeHandles = ({ windowRef, windowKey }) => {
    const { focusWindow } = useWindowStore();
    const dragState = useRef(null);

    const handleMouseDown = useCallback((e, dirs) => {
        e.preventDefault();
        e.stopPropagation();

        // Focus the window on interaction start
        focusWindow(windowKey);

        const el = windowRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        dragState.current = {
            dirs,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: rect.width,
            startHeight: rect.height,
            startLeft: rect.left,
            startTop: rect.top,
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }, [focusWindow, windowKey, windowRef]);

    const handleMouseMove = useCallback((e) => {
        const state = dragState.current;
        if (!state) return;

        const el = windowRef.current;
        if (!el) return;

        const { dirs, startX, startY, startWidth, startHeight, startLeft, startTop } = state;
        const { maxWidth, maxHeight } = getMaxDimensions();

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        // Compute new dimensions based on which edges are being dragged
        if (dirs.includes("e")) {
            newWidth = startWidth + deltaX;
        }
        if (dirs.includes("w")) {
            newWidth = startWidth - deltaX;
            newLeft = startLeft + deltaX;
        }
        if (dirs.includes("s")) {
            newHeight = startHeight + deltaY;
        }
        if (dirs.includes("n")) {
            newHeight = startHeight - deltaY;
            newTop = startTop + deltaY;
        }

        // Enforce minimum dimensions
        if (newWidth < MIN_WIDTH) {
            if (dirs.includes("w")) {
                newLeft = newLeft - (MIN_WIDTH - newWidth);
            }
            newWidth = MIN_WIDTH;
        }
        if (newHeight < MIN_HEIGHT) {
            if (dirs.includes("n")) {
                newTop = newTop - (MIN_HEIGHT - newHeight);
            }
            newHeight = MIN_HEIGHT;
        }

        // Enforce maximum dimensions
        if (newWidth > maxWidth) {
            if (dirs.includes("w")) {
                newLeft = newLeft + (newWidth - maxWidth);
            }
            newWidth = maxWidth;
        }
        if (newHeight > maxHeight) {
            if (dirs.includes("n")) {
                newTop = newTop + (newHeight - maxHeight);
            }
            newHeight = maxHeight;
        }

        // Apply to the element
        el.style.width = `${newWidth}px`;
        el.style.height = `${newHeight}px`;
        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
        el.style.position = "absolute";
    }, [windowRef]);

    const handleMouseUp = useCallback(() => {
        dragState.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseMove]);

    // Cleanup listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <>
            {HANDLES.map(({ id, cursor, dirs, style }) => (
                <div
                    key={id}
                    data-resize-handle={id}
                    onMouseDown={(e) => handleMouseDown(e, dirs)}
                    style={{
                        position: "absolute",
                        cursor,
                        ...style,
                        zIndex: 10,
                        // Invisible but interactive
                        background: "transparent",
                    }}
                />
            ))}
        </>
    );
};

export default ResizeHandles;
