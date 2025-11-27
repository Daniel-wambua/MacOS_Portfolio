import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useEffect } from "react";

import {Navbar,Welcome,Dock,Home} from "#components";
import {Finder, Resume, Safari, Terminal, Text, Image, Contact, Photos} from "#windows";
import useWindowStore from "#store/window.js";

gsap.registerPlugin(Draggable);

const App = () => {
  const { windows } = useWindowStore();
  const anyOpen = Object.values(windows).some((w) => w?.isOpen);

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

  return (
   <main>
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