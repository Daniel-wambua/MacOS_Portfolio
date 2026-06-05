<h1 align="center">Daniel Wambua - macOS Portfolio</h1>
<p align="center">
<a href="https://github.com/Daniel-wambua/MacOS_Portfolio"><img src="https://i.ibb.co/G4vGDwtD/cv-logo.png" width="48" /><br /></a>
<i>A macOS-style portfolio built with React, featuring authentic desktop interactions</i>
<br />
<b>🌐 <a href="https://danielwambua.dev">danielwambua.dev</a></b>
</p>

---

## Features

### Desktop Experience
- **Boot & Login Screen** - macOS-style boot animation with Apple logo, progress bar, and login screen showing username "havoc"
- **Window Management** - Draggable, resizable windows with minimize-to-dock animation and restore
- **Dock** - Proximity magnification on hover, bounce animation on app launch, dot indicators for open/minimized apps
- **Keyboard Shortcuts** - `Ctrl/⌘+W` close window, `Ctrl/⌘+1/2/3` open apps, `Ctrl/⌘+K` Spotlight search
- **Spotlight Search** - Fuzzy search modal to quickly find and open any window or section
- **Control Center** - Notification panel, dark mode toggle, quick links, now playing widget
- **Owner Details** - Profile dropdown with social links from the topbar user icon
- **Dark Mode** - Full site dark mode toggle with localStorage persistence

### Content
- **Articles (Safari)** - Live blog posts fetched from RSS feed (`havocsec.dev/rss.xml`), auto-updates without redeployment
- **Projects (Finder)** - 7 project folders with descriptions, links, and screenshots
- **Tech Stack (Terminal)** - Interactive terminal-style skills display
- **Photo Gallery** - Multi-category photo gallery with sidebar filtering
- **Contact** - Social links with Linktree integration
- **Resume** - PDF viewer for CV

### Technical
- React + Vite
- GSAP for all animations (drag, resize, minimize, bounce, fade)
- Zustand + Immer for state management
- Tailwind CSS
- Vercel Serverless Functions (RSS feed proxy)
- Session-based boot animation (plays on fresh visit, skips on refresh)

---

## Getting Started

```bash
# Clone
git clone https://github.com/Daniel-wambua/MacOS_Portfolio.git
cd MacOS_Portfolio

# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
MacOS_Portfolio/
├── api/                   # Vercel serverless functions (RSS feed)
├── public/                # Static assets, icons, images
├── src/
│   ├── components/        # UI (Navbar, Dock, SpotlightModal, BootScreen, etc.)
│   ├── constants/         # Data for nav, dock, gallery, socials, projects
│   ├── hoc/               # WindowWrapper HOC (drag, resize, minimize)
│   ├── hooks/             # useKeyboardShortcuts
│   ├── store/             # Zustand stores (window, spotlight, panels, boot, theme)
│   ├── windows/           # App windows (Finder, Safari, Terminal, Photos, etc.)
│   ├── App.jsx            # Main shell
│   └── index.css          # Tailwind + dark mode styles
├── vercel.json            # Deployment config
├── vite.config.js         # Vite + RSS dev plugin
└── package.json
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/⌘ + W` | Close active window |
| `Ctrl/⌘ + 1` | Open Finder |
| `Ctrl/⌘ + 2` | Open Safari |
| `Ctrl/⌘ + 3` | Open Terminal |
| `Ctrl/⌘ + K` | Toggle Spotlight Search |

---

## Deployment

Deployed on [Vercel](https://vercel.com). The `/api/feed` serverless function fetches and caches the RSS feed (10-minute CDN cache with stale-while-revalidate).

Push to `main` triggers automatic deployment.

---

## Attribution

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [GSAP](https://gsap.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
- [js-mastery](https://jsmastery.com/) for the original idea and inspiration

---

## License

MIT © [Daniel Wambua](https://danielwambua.dev) 2025

<p align="center">
  <a href="https://github.com/Daniel-wambua"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" /></a><br>
  <sup>Thanks for visiting :)</sup>
</p>
