import { useRef } from "react";
import useWindowStore from "#store/window.js";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
  subtitle: {min:100, max:400, default:100},
  title: {min:400, max:900, default:400},

  };

const renderText = (text,  className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === " " ? '\u00A0' : char}
    </span>
  ));
 };

  const setupTextHover = (container, type) => {
    if (!container) return () => {};

    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
      return gsap.to(letter, {
        duration,
        ease: "power2.out",
        fontVariationSettings: `'wght' ${weight}`,
      });
    };

    const handleMouseMove = (e) => {
      const { left } = container.getBoundingClientRect();
      const mouseX = e.clientX - left;

      letters.forEach((letter) => {
        const { left: l, width: w } = letter.getBoundingClientRect();
        const distance = Math.abs(mouseX - (l - left + w / 2));
        const intensity = Math.exp(-(distance ** 2) / 2000);
        animateLetter(letter, min + (max - min) * intensity);
      });
    };

    const handleMouseLeave = () =>
      letters.forEach((letter) => animateLetter(letter, base, 0.3));

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  };

const Welcome = () => {
    const { openWindow } = useWindowStore();
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
      const titleCleanup = setupTextHover(titleRef.current, "title");
      const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

      return () => {
        subtitleCleanup();
        titleCleanup();
      };
    }, []);

  return (
   <section id="welcome" className="max-sm:pt-10 max-sm:px-2">
    <p ref={subtitleRef} className="max-sm:text-lg">
      {renderText(
        "Hey,I'm Daniel! Welcome to my", "text-3xl font-georama max-sm:text-lg", 100,
        )}
    </p>
    <h1 ref={titleRef} className="mt-7 max-sm:text-5xl">
      {renderText(
        "Portfolio", "text-9xl italic font-georama max-sm:text-5xl", 400)}
    </h1>
    {/* Mobile helper: show quick actions instead of blocking message */}
    <div className="sm:hidden mt-6 space-y-3">
      <p className="text-sm text-gray-600">Tip: On phones, apps open full-screen. Use the Dock or quick actions below:</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => openWindow('terminal')}
          className="px-4 py-2 rounded-md bg-black text-white text-sm active:scale-95"
          aria-label="Open Tech Stack"
        >
          Open Tech Stack
        </button>
        <button
          type="button"
          onClick={() => openWindow('resume')}
          className="px-4 py-2 rounded-md bg-gray-200 text-sm active:scale-95"
          aria-label="Open Resume"
        >
          Open Resume
        </button>
      </div>
    </div>
  </section>
  );
};

export default Welcome;