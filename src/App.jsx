import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useEffect, useRef } from "react";

import {Navbar,Welcome,Dock,Home} from "#components";
import Toasts from "#components/Toasts.jsx";
import {Finder, Resume, Safari, Terminal, Text, Image, Contact, Photos} from "#windows";
import useWindowStore from "#store/window.js";

gsap.registerPlugin(Draggable);

const App = () => {
  const { windows } = useWindowStore();
  const anyOpen = Object.values(windows).some((w) => w?.isOpen);
  // Refs to rate-limit repeated toasts
  const lastContextToastRef = useRef(0);
  const lastDevtoolsToastRef = useRef(0);

  const showToast = (message) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message } }));
  };

  // Lock body scroll when a window is open on mobile (prevents background scroll/jump)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) return;

    const body = document.body;
    if (anyOpen) {
      body.style.overflow = 'hidden';
      body.style.touchAction = 'manipulation';
    } else {
      body.style.overflow = '';
      body.style.touchAction = '';
    }

    return () => {
      body.style.overflow = '';
      body.style.touchAction = '';
    };
  }, [anyOpen]);

  // Disable right-click/context menu site-wide
  useEffect(() => {
    const handler = (e) => {
      // Block context menu everywhere per request and show notice
      e.preventDefault();
      const now = Date.now();
      if (now - lastContextToastRef.current > 2000) {
        showToast('Context menu has been disabled.');
        lastContextToastRef.current = now;
      }
    };
    document.addEventListener('contextmenu', handler, { capture: true });
    return () => document.removeEventListener('contextmenu', handler, { capture: true });
  }, []);

  // Intercept common DevTools shortcuts and warn
  useEffect(() => {
    const devtoolsKeys = (e) => {
      const k = e.key?.toLowerCase();
      const ctrl = e.ctrlKey;
      const shift = e.shiftKey;
      const meta = e.metaKey; // Cmd on Mac
      const alt = e.altKey;   // Option on Mac

      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
      } else if (
        // Ctrl+Shift+I/J/C/K
        (ctrl && shift && ['i','j','c','k'].includes(k)) ||
        // Cmd+Opt+I/J/C (Mac)
        (meta && alt && ['i','j','c'].includes(k)) ||
        // Ctrl+U (view source)
        (ctrl && k === 'u')
      ) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        return;
      }

      const now = Date.now();
      if (now - lastDevtoolsToastRef.current > 2500) {
        showToast('Developer tools have been disabled.');
        lastDevtoolsToastRef.current = now;
      }
    };

    window.addEventListener('keydown', devtoolsKeys, { capture: true });
    return () => window.removeEventListener('keydown', devtoolsKeys, { capture: true });
  }, []);

  // Heuristic detection of DevTools opening (cannot be fully blocked)
  useEffect(() => {
    let lastState = false;
    const check = () => {
      if (typeof window === 'undefined') return;
      const widthDiff = Math.abs((window.outerWidth || 0) - (window.innerWidth || 0));
      const heightDiff = Math.abs((window.outerHeight || 0) - (window.innerHeight || 0));
      const opened = widthDiff > 160 || heightDiff > 160; // threshold
      if (opened && !lastState) {
        const now = Date.now();
        if (now - lastDevtoolsToastRef.current > 2500) {
          showToast('Developer tools have been disabled.');
          lastDevtoolsToastRef.current = now;
        }
      }
      lastState = opened;
    };
    const id = window.setInterval(check, 1000);
    window.addEventListener('resize', check);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
   <main>
    <Toasts />
    <Navbar />
    <Welcome />
    <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
       <Contact />
       <Photos />
       <Home />
    </main>
  );
};

export default App;