import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Lightweight toast system mounted once in App
// Shows bottom-right notifications upon window 'app:toast' events
// Usage: window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: '...' } }))

let nextId = 1;

const Toasts = () => {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    const onToast = (e) => {
      const message = e?.detail?.message || '';
      if (!message) return;
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message }]);

      // Auto-dismiss after 3 seconds
      const t = setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
        timeoutsRef.current.delete(id);
      }, 3000);
      timeoutsRef.current.set(id, t);
    };

    window.addEventListener('app:toast', onToast);
    return () => {
      window.removeEventListener('app:toast', onToast);
      // Cleanup timeouts
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, []);

  const remove = (id) => {
    const t = timeoutsRef.current.get(id);
    if (t) clearTimeout(t);
    timeoutsRef.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  };

  const node = (
    <div
      className="fixed bottom-4 right-4 z-[999999] space-y-2 pointer-events-none select-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(({ id, message }) => (
        <div
          key={id}
          className="pointer-events-auto flex items-start gap-2 max-w-[80vw] sm:max-w-xs bg-black/80 text-white rounded-md shadow-lg ring-1 ring-white/10 px-3 py-2 animate-fade-in"
          role="status"
        >
          <span className="text-sm leading-5">{message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => remove(id)}
            className="ml-auto text-white/70 hover:text-white focus:outline-none"
          >
            ×
          </button>
        </div>
      ))}
      <style>{`
        @keyframes toast-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: toast-fade-in 200ms ease-out; }
      `}</style>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(node, document.body);
};

export default Toasts;
