import React from "react";
import App from "./App";
import NotFound from "#components/NotFound";

// Simple hash-based router for SPA 404 support
const getPath = () => window.location.pathname;

const Router = () => {
  const [path, setPath] = React.useState(getPath());

  React.useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // List of valid base routes (add more if you have real routes)
  const validRoutes = [
    "/", "", "/index.html",
    "/projects", "/contact", "/resume",
    "/finder", "/portfolio", "/safari", "/articles", "/photos", "/gallery", "/terminal", "/skills", "/trash", "/archive"
  ];

  // If not a valid route, show NotFound
  if (!validRoutes.includes(path.toLowerCase())) {
    return <NotFound />;
  }
  return <App />;
};

export default Router;
