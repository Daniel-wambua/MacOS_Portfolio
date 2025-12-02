import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const NotFound = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    // Create floating stars/particles
    const createStars = () => {
      if (!containerRef.current) return;
      const starCount = 50;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
          position: absolute;
          width: ${Math.random() * 3 + 1}px;
          height: ${Math.random() * 3 + 1}px;
          background: white;
          border-radius: 50%;
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.7 + 0.3};
        `;
        containerRef.current.appendChild(star);
        starsRef.current.push(star);
        
        // Animate stars
        gsap.to(star, {
          y: `+=${Math.random() * 100 + 50}`,
          x: `+=${(Math.random() - 0.5) * 50}`,
          opacity: Math.random() * 0.5,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }
    };

    createStars();

    // Title animation - glitch effect
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Continuous glitch
      gsap.to(titleRef.current, {
        textShadow: "2px 2px 0px rgba(102, 126, 234, 0.7), -2px -2px 0px rgba(118, 75, 162, 0.7)",
        duration: 0.1,
        repeat: -1,
        repeatDelay: 3,
        yoyo: true,
      });
    }

    // Subtitle animation
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );
    }

    // Description animation
    if (descRef.current) {
      gsap.fromTo(
        descRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 0.4, ease: "power3.out" }
      );
    }

    // Button animation
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: "back.out(1.7)" }
      );

      // Pulse animation
      gsap.to(btnRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    return () => {
      starsRef.current.forEach(star => star.remove());
      starsRef.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a1f] via-[#1a0a2e] to-[#16213e]"
    >
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* 404 Error Title with glitch effect */}
        <h1 
          ref={titleRef}
          className="text-[clamp(4rem,15vw,12rem)] font-black mb-4 text-white"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1',
            letterSpacing: '-0.05em',
          }}
        >
          404 Error
        </h1>

        {/* Subtitle with cool styling */}
        <h2 
          ref={subtitleRef}
          className="text-[clamp(1.5rem,5vw,3rem)] font-bold mb-8 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-clip-text text-transparent"
          style={{
            lineHeight: '1.2',
          }}
        >
          Page Lost in Cyberspace
        </h2>

        {/* Description */}
        <p 
          ref={descRef}
          className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Whoops! It seems this page took a wrong turn somewhere in cyberspace. 
          It's probably off asking for directions. In the meantime, why not explore 
          elsewhere on my  site? There are no lost pages there – i promise!
        </p>

        {/* Back to Home Button */}
        <div ref={btnRef}>
          <a
            href="/"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(102,126,234,0.5)] hover:shadow-[0_0_50px_rgba(102,126,234,0.8)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Optional: Small text at bottom */}
        <p className="mt-16 text-gray-500 text-sm">
          Error Code: 404 | Page Not Found | havoc Inc
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
