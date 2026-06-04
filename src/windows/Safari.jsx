import { useState, useEffect } from "react";
import { WindowControls } from "#components/index.js";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { MoveRight, PanelLeft, ChevronLeft, ChevronRight, ShieldHalf, Search, Share, Plus, Copy } from "lucide-react";
import { blogPosts } from "#constants/index.js";

const TouchButton = ({ ariaLabel, title, onClick, children }) => (
    <button
        type="button"
        aria-label={ariaLabel}
        title={title || ariaLabel}
        onClick={onClick}
        className="inline-flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 active:scale-95 transition p-2 min-w-[44px] min-h-[44px]"
    >
        {children}
    </button>
);

const Safari = () => {
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchFeed() {
            try {
                const res = await fetch("/api/feed");
                if (!res.ok) throw new Error("Feed fetch failed");
                const data = await res.json();
                if (!cancelled && data.items) {
                    setPosts(data.items);
                }
            } catch {
                // Fall back to hardcoded blog posts
                if (!cancelled) setError(true);
            }
        }

        fetchFeed();
        return () => { cancelled = true; };
    }, []);

    // Use RSS posts if available, otherwise fall back to hardcoded
    const displayPosts = posts
        ? posts.map((item, i) => ({
            id: i + 1,
            title: item.title,
            date: item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "",
            image: item.image || "/images/hello.png",
            link: item.link,
        }))
        : blogPosts;

    return (
        <>
            <div id="window-header">
                <WindowControls target="safari" />
                <div className="ml-10 flex items-center">
                    <TouchButton ariaLabel="Toggle sidebar" onClick={() => console.log('Toggle sidebar')}>
                        <PanelLeft className="icon" />
                    </TouchButton>
                </div>
                <div className="flex items-center gap-1 ml-5">
                    <TouchButton ariaLabel="Go back" onClick={() => console.log('Back')}>
                        <ChevronLeft className="icon" />
                    </TouchButton>
                    <TouchButton ariaLabel="Go forward" onClick={() => console.log('Forward')}>
                        <ChevronRight className="icon" />
                    </TouchButton>
                </div>
                <div className="flex-1 flex-center gap-3">
                    <ShieldHalf className="icon" />
                    <div className="search">
                        <Search className="icon" />
                        <input type="text" placeholder="Search or enter website name" className="flex-1" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <TouchButton ariaLabel="Share" onClick={() => console.log('Share')}>
                        <Share className="icon" />
                    </TouchButton>
                    <TouchButton ariaLabel="New tab" onClick={() => console.log('New tab')}>
                        <Plus className="icon" />
                    </TouchButton>
                    <TouchButton ariaLabel="Copy" onClick={() => console.log('Copy')}>
                        <Copy className="icon" />
                    </TouchButton>
                </div>
            </div>

            <div className="blog">
                <h2>My blog</h2>
                {!posts && !error && (
                    <p style={{ textAlign: "center", color: "#888", padding: "20px 0" }}>Loading articles...</p>
                )}
                <div className="space-y-8">
                    {displayPosts.map(({ id, image, title, date, link }) => (
                        <div key={id} className="blog-post">
                            <div className="col-span-2">
                                <img src={image} alt={title} onError={(e) => { e.target.src = "/images/hello.png"; }} />
                            </div>
                            <div className="content">
                                <p>{date}</p>
                                <h3>{title}</h3>
                                <a href={link} target="_blank" rel="noopener noreferrer">
                                    Check out the full post <MoveRight className="icon-hover" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const SafariWindow = WindowWrapper(Safari, "safari");

export default SafariWindow;
