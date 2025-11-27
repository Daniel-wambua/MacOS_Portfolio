import { describe, it, expect, beforeEach } from 'vitest';
import useLocationStore from '../../store/location.js';
import { locations } from '../../constants/index.js';

describe('useLocationStore', () => {
  beforeEach(() => {
    // Reset to default location before each test
    useLocationStore.getState().resetActiveLocation();
  });

  describe('Initial State', () => {
    it('should initialize with work location as default', () => {
      const { activeLocation } = useLocationStore.getState();
      expect(activeLocation).toEqual(locations.work);
    });

    it('should have all required properties in default location', () => {
      const { activeLocation } = useLocationStore.getState();
      expect(activeLocation).toHaveProperty('id');
      expect(activeLocation).toHaveProperty('type');
      expect(activeLocation).toHaveProperty('name');
      expect(activeLocation).toHaveProperty('icon');
      expect(activeLocation).toHaveProperty('kind');
      expect(activeLocation).toHaveProperty('children');
    });
  });

  describe('setActiveLocation', () => {
    it('should update active location to about', () => {
      const { setActiveLocation } = useLocationStore.getState();
      
      setActiveLocation(locations.about);
      
      const state = useLocationStore.getState();
      expect(state.activeLocation).toEqual(locations.about);
      expect(state.activeLocation.type).toBe('about');
    });

    it('should update active location to resume', () => {
      const { setActiveLocation } = useLocationStore.getState();
      
      setActiveLocation(locations.resume);
      
      const state = useLocationStore.getState();
      expect(state.activeLocation).toEqual(locations.resume);
    });

    it('should update active location to trash', () => {
      const { setActiveLocation } = useLocationStore.getState();
      
      setActiveLocation(locations.trash);
      
      const state = useLocationStore.getState();
      expect(state.activeLocation.type).toBe('trash');
    });

    it('should handle undefined location gracefully', () => {
      const { setActiveLocation } = useLocationStore.getState();
      const initialLocation = useLocationStore.getState().activeLocation;
      
      setActiveLocation(undefined);
      
      const state = useLocationStore.getState();
      expect(state.activeLocation).toEqual(initialLocation);
    });

    it('should handle null location gracefully', () => {
      const { setActiveLocation } = useLocationStore.getState();
      const initialLocation = useLocationStore.getState().activeLocation;
      
      setActiveLocation(null);
      
      const state = useLocationStore.getState();
      expect(state.activeLocation).toEqual(initialLocation);
    });

    it('should allow switching between different locations multiple times', () => {
      const { setActiveLocation } = useLocationStore.getState();
      
      setActiveLocation(locations.about);
      expect(useLocationStore.getState().activeLocation.type).toBe('about');
      
      setActiveLocation(locations.resume);
      expect(useLocationStore.getState().activeLocation.type).toBe('resume');
      
      setActiveLocation(locations.work);
      expect(useLocationStore.getState().activeLocation.type).toBe('work');
    });

    it('should update to nested locations (project folders)', () => {
      const { setActiveLocation } = useLocationStore.getState();
      const project = locations.work.children[0];
      
      setActiveLocation(project);
      
      const state = useLocationStore.getState();
      expect(state.activeLocation).toEqual(project);
      expect(state.activeLocation.kind).toBe('folder');
    });
  });

  describe('resetActiveLocation', () => {
    it('should reset to default work location', () => {
      const { setActiveLocation, resetActiveLocation } = useLocationStore.getState();
      
      setActiveLocation(locations.about);
      expect(useLocationStore.getState().activeLocation.type).toBe('about');
      
      resetActiveLocation();
      
      const state = useLocationStore.getState();
      expect(state.activeLocation).toEqual(locations.work);
    });

    it('should reset after navigating to nested location', () => {
      const { setActiveLocation, resetActiveLocation } = useLocationStore.getState();
      const project = locations.work.children[0];
      
      setActiveLocation(project);
      resetActiveLocation();
      
      const state = useLocationStore.getState();
      expect(state.activeLocation).toEqual(locations.work);
    });

    it('should be idempotent when already at default', () => {
      const { resetActiveLocation } = useLocationStore.getState();
      
      resetActiveLocation();
      const firstState = useLocationStore.getState().activeLocation;
      
      resetActiveLocation();
      const secondState = useLocationStore.getState().activeLocation;
      
      expect(firstState).toEqual(secondState);
      expect(firstState).toEqual(locations.work);
    });
  });

  describe('Navigation Flow', () => {
    it('should handle typical user navigation flow', () => {
      const { setActiveLocation, resetActiveLocation } = useLocationStore.getState();
      
      // Start at work (default)
      expect(useLocationStore.getState().activeLocation.type).toBe('work');
      
      // Navigate to about
      setActiveLocation(locations.about);
      expect(useLocationStore.getState().activeLocation.type).toBe('about');
      
      // Navigate to a project
      const project = locations.work.children[0];
      setActiveLocation(project);
      expect(useLocationStore.getState().activeLocation.name).toBe(project.name);
      
      // Reset to home
      resetActiveLocation();
      expect(useLocationStore.getState().activeLocation.type).toBe('work');
    });

    it('should maintain location state through multiple operations', () => {
      const { setActiveLocation } = useLocationStore.getState();
      
      for (let i = 0; i < 5; i++) {
        setActiveLocation(locations.about);
        expect(useLocationStore.getState().activeLocation.type).toBe('about');
        
        setActiveLocation(locations.work);
        expect(useLocationStore.getState().activeLocation.type).toBe('work');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty object gracefully', () => {
      const { setActiveLocation } = useLocationStore.getState();
      const initialLocation = useLocationStore.getState().activeLocation;
      
      setActiveLocation({});
      
      const state = useLocationStore.getState();
      // Should not change from initial since empty object is falsy in the check
      expect(state.activeLocation).toEqual(initialLocation);
    });

    it('should handle rapid location changes', () => {
      const { setActiveLocation } = useLocationStore.getState();
      const allLocations = Object.values(locations);
      
      allLocations.forEach(loc => {
        setActiveLocation(loc);
      });
      
      const state = useLocationStore.getState();
      expect(state.activeLocation).toEqual(allLocations[allLocations.length - 1]);
    });

    it('should preserve location properties when setting', () => {
      const { setActiveLocation } = useLocationStore.getState();
      const testLocation = locations.about;
      
      setActiveLocation(testLocation);
      
      const state = useLocationStore.getState();
      expect(state.activeLocation.id).toBe(testLocation.id);
      expect(state.activeLocation.name).toBe(testLocation.name);
      expect(state.activeLocation.icon).toBe(testLocation.icon);
      expect(state.activeLocation.children).toEqual(testLocation.children);
    });
  });
});