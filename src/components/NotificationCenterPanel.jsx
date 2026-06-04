import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { socials } from "#constants";
import usePanelsStore from "#store/panels.js";
import useThemeStore from "#store/theme.js";
import useBootStore from "#store/boot.js";

dayjs.extend(relativeTime);

const notifications = [
    { id: 1, app: "GitHub", title: "Push successful", body: "Pushed new commits to MacOS Portfolio", time: dayjs().subtract(12, "minute").toISOString() },
    { id: 2, app: "Blog", title: "Post published", body: "Published blog post on CTF writeups", time: dayjs().subtract(2, "hour").toISOString() },
    { id: 3, app: "HackTheBox", title: "Challenge solved", body: "Solved a new CTF challenge", time: dayjs().subtract(5, "hour").toISOString() },
    { id: 4, app: "Vercel", title: "Deployment complete", body: "Portfolio deployed to production", time: dayjs().subtract(1, "day").toISOString() },
];

const panelStyle = {
    background: "rgba(36, 36, 38, 0.82)",
    backdropFilter: "blur(60px) saturate(180%)",
    WebkitBackdropFilter: "blur(60px) saturate(180%)",
    borderRadius: 14,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
};

const NotificationCenterPanel = () => {
    const panelRef = useRef(null);
    const isOpen = usePanelsStore((state) => state.notificationCenter);
    const closeNotificationCenter = usePanelsStore((state) => state.closeNotificationCenter);
    const [view, setView] = useState("main");

    useEffect(() => {
        if (!isOpen) setView("main");
    }, [isOpen]);

    useGSAP(() => {
        const el = panelRef.current;
        if (!el) return;
        if (isOpen) {
            gsap.killTweensOf(el);
            gsap.fromTo(el, { y: -4, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15, ease: "power1.out" });
        } else {
            gsap.killTweensOf(el);
            gsap.to(el, { y: -4, opacity: 0, duration: 0.1, ease: "power1.in" });
        }
        return () => gsap.killTweensOf(el);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handle = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) closeNotificationCenter();
        };
        const t = setTimeout(() => document.addEventListener("mousedown", handle), 10);
        return () => { clearTimeout(t); document.removeEventListener("mousedown", handle); };
    }, [isOpen, closeNotificationCenter]);

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            style={{ position: "fixed", top: 36, right: 8, width: 320, zIndex: 5000, opacity: 0 }}
            role="complementary"
            aria-label="Control Center"
        >
            {view === "main" ? (
                <MainView onNotifications={() => setView("notifications")} />
            ) : (
                <NotificationsView onBack={() => setView("main")} />
            )}
        </div>
    );
};

function MainView({ onNotifications }) {
    const dark = useThemeStore((s) => s.dark);
    const toggleTheme = useThemeStore((s) => s.toggle);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Top toggles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div onClick={onNotifications} style={{ ...panelStyle, padding: 14, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "#ff453a", flexShrink: 0 }}>
                            <BellIcon />
                        </span>
                        <div style={{ overflow: "hidden" }}>
                            <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }}>Notifications</p>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>4 new</p>
                        </div>
                    </div>
                </div>

                <div style={{ ...panelStyle, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "#5e5ce6", flexShrink: 0 }}>
                            <MoonIcon />
                        </span>
                        <div style={{ overflow: "hidden" }}>
                            <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }}>Focus</p>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>Off</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dark Mode toggle */}
            <div onClick={toggleTheme} style={{ ...panelStyle, padding: 14, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: dark ? "#f5a623" : "#636366", flexShrink: 0 }}>
                            <SunMoonIcon dark={dark} />
                        </span>
                        <div style={{ overflow: "hidden" }}>
                            <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }}>Display</p>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{dark ? "Dark" : "Light"}</p>
                        </div>
                    </div>
                    {/* Toggle switch */}
                    <div style={{ width: 34, height: 20, borderRadius: 10, background: dark ? "#34c759" : "rgba(255,255,255,0.2)", padding: 2, transition: "background 0.2s", display: "flex", alignItems: "center" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transform: dark ? "translateX(14px)" : "translateX(0)", transition: "transform 0.2s" }} />
                    </div>
                </div>
            </div>

            {/* Links */}
            <div style={{ ...panelStyle, padding: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 10, letterSpacing: 0.3 }}>LINKS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {socials.map((s) => (
                        <a
                            key={s.id}
                            href={s.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 4px", borderRadius: 6, fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                        >
                            <img src={s.icon} alt="" style={{ width: 14, height: 14, filter: "invert(1)", opacity: 0.6, flexShrink: 0 }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.text}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Now Playing */}
            <div style={{ ...panelStyle, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <MusicIcon />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                        <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Now Playing</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Coding in progress…</p>
                    </div>
                </div>
            </div>

            {/* Log Out */}
            <div
                onClick={() => {
                    usePanelsStore.getState().closeAllPanels();
                    try { sessionStorage.removeItem("boot_completed"); } catch {}
                    useBootStore.getState().initBoot();
                }}
                style={{ ...panelStyle, padding: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,59,48,0.15)"; e.currentTarget.style.borderColor = "rgba(255,59,48,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = panelStyle.background; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"; }}
            >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "#ff453a", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </span>
                <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>Log Out</p>
            </div>
        </div>
    );
}

function NotificationsView({ onBack }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Header card */}
            <div style={{ ...panelStyle, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={onBack} style={{ fontSize: 12, color: "#0a84ff", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    ← Back
                </button>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Notifications</span>
                <span style={{ fontSize: 10, color: "#0a84ff", cursor: "pointer" }}>Clear All</span>
            </div>

            {/* Each notification as its own card */}
            {notifications.map((n) => (
                <div key={n.id} style={{ ...panelStyle, padding: 0, overflow: "hidden" }}>
                    {/* App header bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0a84ff", flexShrink: 0 }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{n.app}</span>
                        </div>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{dayjs(n.time).fromNow()}</span>
                    </div>
                    {/* Content */}
                    <div style={{ padding: "10px 12px" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: 1.3 }}>{n.title}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "4px 0 0", lineHeight: 1.4 }}>{n.body}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* SVG Icons */
function BellIcon() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
}
function MoonIcon() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
}
function MusicIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
}
function SunMoonIcon({ dark }) {
    if (dark) {
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
    }
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
}

export default NotificationCenterPanel;
