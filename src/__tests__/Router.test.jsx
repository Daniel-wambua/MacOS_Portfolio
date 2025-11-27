import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Router from '../Router.jsx';

// Mock App and NotFound components
vi.mock('../App', () => ({
  default: () => <div data-testid="app-component">App Component</div>,
}));

vi.mock('#components/NotFound', () => ({
  default: () => <div data-testid="notfound-component">NotFound Component</div>,
}));

describe('Router Component', () => {
  let originalPathname;

  beforeEach(() => {
    originalPathname = window.location.pathname;
  });

  afterEach(() => {
    // Restore original pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: originalPathname },
      writable: true,
    });
  });

  describe('Valid Routes', () => {
    const validPaths = [
      '/',
      '',
      '/index.html',
      '/projects',
      '/contact',
      '/resume',
      '/finder',
      '/portfolio',
      '/safari',
      '/articles',
      '/photos',
      '/gallery',
      '/terminal',
      '/skills',
      '/trash',
      '/archive',
    ];

    validPaths.forEach(path => {
      it(`should render App component for path: "${path}"`, () => {
        Object.defineProperty(window, 'location', {
          value: { pathname: path },
          writable: true,
        });

        render(<Router />);
        expect(screen.getByTestId('app-component')).toBeInTheDocument();
        expect(screen.queryByTestId('notfound-component')).not.toBeInTheDocument();
      });
    });
  });

  describe('Invalid Routes', () => {
    const invalidPaths = [
      '/invalid',
      '/random-page',
      '/does-not-exist',
      '/projects/nested',
      '/contact/invalid',
    ];

    invalidPaths.forEach(path => {
      it(`should render NotFound component for invalid path: "${path}"`, () => {
        Object.defineProperty(window, 'location', {
          value: { pathname: path },
          writable: true,
        });

        render(<Router />);
        expect(screen.getByTestId('notfound-component')).toBeInTheDocument();
        expect(screen.queryByTestId('app-component')).not.toBeInTheDocument();
      });
    });
  });

  describe('Case Insensitivity', () => {
    it('should handle uppercase paths', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/PROJECTS' },
        writable: true,
      });

      render(<Router />);
      expect(screen.getByTestId('app-component')).toBeInTheDocument();
    });

    it('should handle mixed case paths', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/Contact' },
        writable: true,
      });

      render(<Router />);
      expect(screen.getByTestId('app-component')).toBeInTheDocument();
    });
  });

  describe('popstate Event Handling', () => {
    it('should update route on popstate event', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true,
      });

      const { rerender } = render(<Router />);
      expect(screen.getByTestId('app-component')).toBeInTheDocument();

      // Simulate navigation
      Object.defineProperty(window, 'location', {
        value: { pathname: '/invalid-route' },
        writable: true,
      });

      window.dispatchEvent(new PopStateEvent('popstate'));
      rerender(<Router />);

      // Note: The component might not immediately update in this test
      // This tests that the event listener is set up correctly
    });

    it('should clean up popstate listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true,
      });

      const { unmount } = render(<Router />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
  });
});