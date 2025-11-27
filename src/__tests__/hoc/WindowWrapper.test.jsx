import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import WindowWrapper from '../../hoc/WindowWrapper.jsx';
import useWindowStore from '../../store/window.js';

// Mock the store
vi.mock('../../store/window.js', () => ({
  default: vi.fn(),
}));

// Mock createPortal to render in place for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node) => node,
  };
});

describe('WindowWrapper HOC', () => {
  const TestComponent = () => <div data-testid="test-component">Test Content</div>;
  let mockFocusWindow;

  beforeEach(() => {
    mockFocusWindow = vi.fn();
  });

  describe('Window Visibility', () => {
    it('should not render component when window is closed', () => {
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          testwindow: { isOpen: false, zIndex: 1000 },
        },
      });

      const WrappedComponent = WindowWrapper(TestComponent, 'testwindow');
      render(<WrappedComponent />);

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
    });

    it('should render component when window is open', () => {
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          testwindow: { isOpen: true, zIndex: 1001 },
        },
      });

      const WrappedComponent = WindowWrapper(TestComponent, 'testwindow');
      render(<WrappedComponent />);

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('Window Styling', () => {
    it('should apply correct zIndex from store', () => {
      const testZIndex = 1005;
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          testwindow: { isOpen: true, zIndex: testZIndex },
        },
      });

      const WrappedComponent = WindowWrapper(TestComponent, 'testwindow');
      const { container } = render(<WrappedComponent />);

      const windowElement = container.querySelector('#testwindow');
      expect(windowElement).toHaveStyle({ zIndex: testZIndex.toString() });
    });

    it('should have proper window classes', () => {
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          testwindow: { isOpen: true, zIndex: 1001 },
        },
      });

      const WrappedComponent = WindowWrapper(TestComponent, 'testwindow');
      const { container } = render(<WrappedComponent />);

      const windowElement = container.querySelector('#testwindow');
      expect(windowElement).toHaveClass('absolute');
      expect(windowElement).toHaveClass('group');
      expect(windowElement).toHaveClass('bg-white');
      expect(windowElement).toHaveClass('rounded-xl');
      expect(windowElement).toHaveClass('shadow-lg');
    });

    it('should have mobile-specific classes', () => {
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          testwindow: { isOpen: true, zIndex: 1001 },
        },
      });

      const WrappedComponent = WindowWrapper(TestComponent, 'testwindow');
      const { container } = render(<WrappedComponent />);

      const windowElement = container.querySelector('#testwindow');
      expect(windowElement).toHaveClass('max-sm:fixed');
      expect(windowElement).toHaveClass('max-sm:inset-0');
      expect(windowElement).toHaveClass('max-sm:rounded-none');
    });
  });

  describe('Component Identity', () => {
    it('should set proper displayName', () => {
      const NamedComponent = () => <div>Named</div>;
      NamedComponent.displayName = 'CustomName';

      const WrappedComponent = WindowWrapper(NamedComponent, 'testwindow');
      expect(WrappedComponent.displayName).toBe('WindowWrapper(CustomName)');
    });

    it('should fallback to component name if no displayName', () => {
      function MyComponent() {
        return <div>My Component</div>;
      }

      const WrappedComponent = WindowWrapper(MyComponent, 'testwindow');
      expect(WrappedComponent.displayName).toBe('WindowWrapper(MyComponent)');
    });

    it('should handle anonymous components', () => {
      const AnonymousComponent = () => <div>Anonymous</div>;

      const WrappedComponent = WindowWrapper(AnonymousComponent, 'testwindow');
      expect(WrappedComponent.displayName).toMatch(/WindowWrapper\(/);
    });
  });

  describe('Window ID', () => {
    it('should set correct id attribute', () => {
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          finder: { isOpen: true, zIndex: 1001 },
        },
      });

      const WrappedComponent = WindowWrapper(TestComponent, 'finder');
      const { container } = render(<WrappedComponent />);

      expect(container.querySelector('#finder')).toBeInTheDocument();
    });

    it('should use different ids for different windows', () => {
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          terminal: { isOpen: true, zIndex: 1001 },
        },
      });

      const WrappedComponent = WindowWrapper(TestComponent, 'terminal');
      const { container } = render(<WrappedComponent />);

      expect(container.querySelector('#terminal')).toBeInTheDocument();
      expect(container.querySelector('#finder')).not.toBeInTheDocument();
    });
  });

  describe('Props Passing', () => {
    it('should pass props to wrapped component', () => {
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          testwindow: { isOpen: true, zIndex: 1001 },
        },
      });

      const PropsComponent = ({ testProp }) => (
        <div data-testid="props-component">{testProp}</div>
      );

      const WrappedComponent = WindowWrapper(PropsComponent, 'testwindow');
      render(<WrappedComponent testProp="Hello World" />);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  describe('Multiple Windows', () => {
    it('should handle multiple wrapped components independently', () => {
      const Component1 = () => <div data-testid="component-1">Component 1</div>;
      const Component2 = () => <div data-testid="component-2">Component 2</div>;

      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          window1: { isOpen: true, zIndex: 1001 },
          window2: { isOpen: false, zIndex: 1000 },
        },
      });

      const Wrapped1 = WindowWrapper(Component1, 'window1');
      const Wrapped2 = WindowWrapper(Component2, 'window2');

      const { rerender } = render(
        <>
          <Wrapped1 />
          <Wrapped2 />
        </>
      );

      expect(screen.getByTestId('component-1')).toBeInTheDocument();
      expect(screen.queryByTestId('component-2')).not.toBeInTheDocument();

      // Open second window
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          window1: { isOpen: true, zIndex: 1001 },
          window2: { isOpen: true, zIndex: 1002 },
        },
      });

      rerender(
        <>
          <Wrapped1 />
          <Wrapped2 />
        </>
      );

      expect(screen.getByTestId('component-1')).toBeInTheDocument();
      expect(screen.getByTestId('component-2')).toBeInTheDocument();
    });
  });

  describe('Safe Area Insets', () => {
    it('should include safe area inset classes for mobile', () => {
      useWindowStore.mockReturnValue({
        focusWindow: mockFocusWindow,
        windows: {
          testwindow: { isOpen: true, zIndex: 1001 },
        },
      });

      const WrappedComponent = WindowWrapper(TestComponent, 'testwindow');
      const { container } = render(<WrappedComponent />);

      const windowElement = container.querySelector('#testwindow');
      expect(windowElement.className).toContain('max-sm:pt-[env(safe-area-inset-top)]');
      expect(windowElement.className).toContain('max-sm:pb-[env(safe-area-inset-bottom)]');
      expect(windowElement.className).toContain('max-sm:pl-[env(safe-area-inset-left)]');
      expect(windowElement.className).toContain('max-sm:pr-[env(safe-area-inset-right)]');
    });
  });
});