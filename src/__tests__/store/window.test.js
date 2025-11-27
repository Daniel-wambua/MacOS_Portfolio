import { describe, it, expect, beforeEach } from 'vitest';
import useWindowStore from '../../store/window.js';
import { INITIAL_Z_INDEX } from '../../constants/index.js';

describe('useWindowStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const state = useWindowStore.getState();
    Object.keys(state.windows).forEach(key => {
      state.closeWindow(key);
    });
    useWindowStore.setState({ nextZIndex: INITIAL_Z_INDEX + 1 });
  });

  describe('Initial State', () => {
    it('should initialize with all windows closed', () => {
      const { windows } = useWindowStore.getState();
      
      Object.values(windows).forEach(window => {
        expect(window.isOpen).toBe(false);
        expect(window.zIndex).toBe(INITIAL_Z_INDEX);
        expect(window.data).toBe(null);
      });
    });

    it('should have correct window keys', () => {
      const { windows } = useWindowStore.getState();
      const expectedKeys = ['finder', 'contact', 'resume', 'safari', 'photos', 'terminal', 'txtfile', 'imgfile'];
      
      expectedKeys.forEach(key => {
        expect(windows).toHaveProperty(key);
      });
    });

    it('should initialize nextZIndex correctly', () => {
      const { nextZIndex } = useWindowStore.getState();
      expect(nextZIndex).toBe(INITIAL_Z_INDEX + 1);
    });
  });

  describe('openWindow', () => {
    it('should open a window and set it to open state', () => {
      const { openWindow, windows } = useWindowStore.getState();
      
      openWindow('finder');
      
      const updatedState = useWindowStore.getState();
      expect(updatedState.windows.finder.isOpen).toBe(true);
    });

    it('should increment zIndex when opening a window', () => {
      const { openWindow } = useWindowStore.getState();
      const initialNextZ = useWindowStore.getState().nextZIndex;
      
      openWindow('finder');
      
      const state = useWindowStore.getState();
      expect(state.windows.finder.zIndex).toBe(initialNextZ);
      expect(state.nextZIndex).toBe(initialNextZ + 1);
    });

    it('should set window data when provided', () => {
      const { openWindow } = useWindowStore.getState();
      const testData = { name: 'test.txt', content: 'Hello' };
      
      openWindow('txtfile', testData);
      
      const state = useWindowStore.getState();
      expect(state.windows.txtfile.data).toEqual(testData);
    });

    it('should preserve existing data if no new data provided', () => {
      const { openWindow } = useWindowStore.getState();
      const testData = { name: 'test.txt' };
      
      openWindow('txtfile', testData);
      openWindow('txtfile');
      
      const state = useWindowStore.getState();
      expect(state.windows.txtfile.data).toEqual(testData);
    });

    it('should handle multiple windows being open simultaneously', () => {
      const { openWindow } = useWindowStore.getState();
      
      openWindow('finder');
      openWindow('terminal');
      openWindow('safari');
      
      const state = useWindowStore.getState();
      expect(state.windows.finder.isOpen).toBe(true);
      expect(state.windows.terminal.isOpen).toBe(true);
      expect(state.windows.safari.isOpen).toBe(true);
    });

    it('should assign unique zIndex to each opened window', () => {
      const { openWindow } = useWindowStore.getState();
      
      openWindow('finder');
      const finderZ = useWindowStore.getState().windows.finder.zIndex;
      
      openWindow('terminal');
      const terminalZ = useWindowStore.getState().windows.terminal.zIndex;
      
      expect(terminalZ).toBeGreaterThan(finderZ);
    });
  });

  describe('closeWindow', () => {
    it('should close an open window', () => {
      const { openWindow, closeWindow } = useWindowStore.getState();
      
      openWindow('finder');
      closeWindow('finder');
      
      const state = useWindowStore.getState();
      expect(state.windows.finder.isOpen).toBe(false);
    });

    it('should reset zIndex to INITIAL_Z_INDEX', () => {
      const { openWindow, closeWindow } = useWindowStore.getState();
      
      openWindow('finder');
      const openZIndex = useWindowStore.getState().windows.finder.zIndex;
      expect(openZIndex).toBeGreaterThan(INITIAL_Z_INDEX);
      
      closeWindow('finder');
      
      const state = useWindowStore.getState();
      expect(state.windows.finder.zIndex).toBe(INITIAL_Z_INDEX);
    });

    it('should clear window data', () => {
      const { openWindow, closeWindow } = useWindowStore.getState();
      const testData = { name: 'test.txt' };
      
      openWindow('txtfile', testData);
      closeWindow('txtfile');
      
      const state = useWindowStore.getState();
      expect(state.windows.txtfile.data).toBe(null);
    });

    it('should not affect other open windows', () => {
      const { openWindow, closeWindow } = useWindowStore.getState();
      
      openWindow('finder');
      openWindow('terminal');
      
      closeWindow('finder');
      
      const state = useWindowStore.getState();
      expect(state.windows.finder.isOpen).toBe(false);
      expect(state.windows.terminal.isOpen).toBe(true);
    });

    it('should handle closing an already closed window', () => {
      const { closeWindow } = useWindowStore.getState();
      
      expect(() => closeWindow('finder')).not.toThrow();
      
      const state = useWindowStore.getState();
      expect(state.windows.finder.isOpen).toBe(false);
    });
  });

  describe('focusWindow', () => {
    it('should bring window to front by incrementing zIndex', () => {
      const { openWindow, focusWindow } = useWindowStore.getState();
      
      openWindow('finder');
      const initialZ = useWindowStore.getState().windows.finder.zIndex;
      
      openWindow('terminal');
      
      focusWindow('finder');
      
      const state = useWindowStore.getState();
      expect(state.windows.finder.zIndex).toBeGreaterThan(initialZ);
    });

    it('should increment nextZIndex after focusing', () => {
      const { openWindow, focusWindow } = useWindowStore.getState();
      
      openWindow('finder');
      const beforeFocus = useWindowStore.getState().nextZIndex;
      
      focusWindow('finder');
      
      const state = useWindowStore.getState();
      expect(state.nextZIndex).toBe(beforeFocus + 1);
    });

    it('should allow focusing between multiple windows', () => {
      const { openWindow, focusWindow } = useWindowStore.getState();
      
      openWindow('finder');
      openWindow('terminal');
      openWindow('safari');
      
      focusWindow('finder');
      const finderZ = useWindowStore.getState().windows.finder.zIndex;
      
      focusWindow('terminal');
      const terminalZ = useWindowStore.getState().windows.terminal.zIndex;
      
      expect(terminalZ).toBeGreaterThan(finderZ);
    });

    it('should handle focusing a closed window gracefully', () => {
      const { focusWindow } = useWindowStore.getState();
      
      expect(() => focusWindow('finder')).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid open/close operations', () => {
      const { openWindow, closeWindow } = useWindowStore.getState();
      
      for (let i = 0; i < 10; i++) {
        openWindow('finder');
        closeWindow('finder');
      }
      
      const state = useWindowStore.getState();
      expect(state.windows.finder.isOpen).toBe(false);
    });

    it('should maintain zIndex ordering with many operations', () => {
      const { openWindow, focusWindow } = useWindowStore.getState();
      
      openWindow('finder');
      openWindow('terminal');
      openWindow('safari');
      focusWindow('finder');
      focusWindow('terminal');
      focusWindow('safari');
      
      const state = useWindowStore.getState();
      const safariZ = state.windows.safari.zIndex;
      const terminalZ = state.windows.terminal.zIndex;
      const finderZ = state.windows.finder.zIndex;
      
      expect(safariZ).toBeGreaterThan(terminalZ);
      expect(terminalZ).toBeGreaterThan(finderZ);
    });

    it('should handle null data correctly', () => {
      const { openWindow } = useWindowStore.getState();
      
      openWindow('txtfile', null);
      
      const state = useWindowStore.getState();
      expect(state.windows.txtfile.data).toBe(null);
    });

    it('should handle undefined data correctly', () => {
      const { openWindow } = useWindowStore.getState();
      
      openWindow('txtfile', undefined);
      
      const state = useWindowStore.getState();
      expect(state.windows.txtfile.data).toBe(null);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle opening window with data, closing, then reopening without data', () => {
      const { openWindow, closeWindow } = useWindowStore.getState();
      const testData = { name: 'test.txt', content: 'Hello' };
      
      openWindow('txtfile', testData);
      expect(useWindowStore.getState().windows.txtfile.data).toEqual(testData);
      
      closeWindow('txtfile');
      expect(useWindowStore.getState().windows.txtfile.data).toBe(null);
      
      openWindow('txtfile');
      expect(useWindowStore.getState().windows.txtfile.data).toBe(null);
    });

    it('should maintain independent state for different window types', () => {
      const { openWindow } = useWindowStore.getState();
      
      const textData = { name: 'file.txt', content: 'Text' };
      const imageData = { name: 'image.png', imageUrl: '/path/to/image.png' };
      
      openWindow('txtfile', textData);
      openWindow('imgfile', imageData);
      
      const state = useWindowStore.getState();
      expect(state.windows.txtfile.data).toEqual(textData);
      expect(state.windows.imgfile.data).toEqual(imageData);
    });
  });
});