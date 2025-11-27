import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';
import useWindowStore from '../store/window.js';

// Mock all child components
vi.mock('#components', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Welcome: () => <div data-testid="welcome">Welcome</div>,
  Dock: () => <div data-testid="dock">Dock</div>,
  Home: () => <div data-testid="home">Home</div>,
}));

vi.mock('#windows', () => ({
  Finder: () => <div data-testid="finder">Finder</div>,
  Resume: () => <div data-testid="resume">Resume</div>,
  Safari: () => <div data-testid="safari">Safari</div>,
  Terminal: () => <div data-testid="terminal">Terminal</div>,
  Text: () => <div data-testid="text">Text</div>,
  Image: () => <div data-testid="image">Image</div>,
  Contact: () => <div data-testid="contact">Contact</div>,
  Photos: () => <div data-testid="photos">Photos</div>,
}));

vi.mock('#store/window.js', () => ({
  default: vi.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    useWindowStore.mockReturnValue({
      windows: {
        finder: { isOpen: false },
        resume: { isOpen: false },
        safari: { isOpen: false },
        terminal: { isOpen: false },
        contact: { isOpen: false },
        photos: { isOpen: false },
        txtfile: { isOpen: false },
        imgfile: { isOpen: false },
      },
    });

    // Reset matchMedia mock for each test
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should render all main components', () => {
    render(<App />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('welcome')).toBeInTheDocument();
    expect(screen.getByTestId('dock')).toBeInTheDocument();
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('should render all window components', () => {
    render(<App />);
    
    expect(screen.getByTestId('terminal')).toBeInTheDocument();
    expect(screen.getByTestId('safari')).toBeInTheDocument();
    expect(screen.getByTestId('resume')).toBeInTheDocument();
    expect(screen.getByTestId('finder')).toBeInTheDocument();
    expect(screen.getByTestId('text')).toBeInTheDocument();
    expect(screen.getByTestId('image')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
    expect(screen.getByTestId('photos')).toBeInTheDocument();
  });

  it('should wrap content in main element', () => {
    const { container } = render(<App />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  describe('Mobile scroll lock', () => {
    it('should not lock scroll on desktop', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(min-width: 640px)', // Desktop
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      useWindowStore.mockReturnValue({
        windows: {
          finder: { isOpen: true },
          resume: { isOpen: false },
          safari: { isOpen: false },
          terminal: { isOpen: false },
          contact: { isOpen: false },
          photos: { isOpen: false },
          txtfile: { isOpen: false },
          imgfile: { isOpen: false },
        },
      });

      render(<App />);
      
      // On desktop, scroll should not be locked
      expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('should lock scroll on mobile when window is open', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(max-width: 639px)', // Mobile
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      useWindowStore.mockReturnValue({
        windows: {
          finder: { isOpen: true },
          resume: { isOpen: false },
          safari: { isOpen: false },
          terminal: { isOpen: false },
          contact: { isOpen: false },
          photos: { isOpen: false },
          txtfile: { isOpen: false },
          imgfile: { isOpen: false },
        },
      });

      render(<App />);
      
      // Body scroll lock should be applied on mobile
      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.touchAction).toBe('manipulation');
    });

    it('should unlock scroll when all windows are closed', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(max-width: 639px)', // Mobile
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      useWindowStore.mockReturnValue({
        windows: {
          finder: { isOpen: false },
          resume: { isOpen: false },
          safari: { isOpen: false },
          terminal: { isOpen: false },
          contact: { isOpen: false },
          photos: { isOpen: false },
          txtfile: { isOpen: false },
          imgfile: { isOpen: false },
        },
      });

      render(<App />);
      
      expect(document.body.style.overflow).toBe('');
      expect(document.body.style.touchAction).toBe('');
    });
  });
});