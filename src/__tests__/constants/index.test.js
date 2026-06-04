import { describe, it, expect } from 'vitest';
import {
  navLinks,
  navIcons,
  dockApps,
  blogPosts,
  techStack,
  socials,
  photosLinks,
  gallery,
  locations,
  INITIAL_Z_INDEX,
  WINDOW_CONFIG,
} from '../../constants/index.js';

describe('Constants - Data Integrity', () => {
  describe('navLinks', () => {
    it('should have valid structure for all items', () => {
      expect(Array.isArray(navLinks)).toBe(true);
      expect(navLinks.length).toBeGreaterThan(0);
      
      navLinks.forEach(link => {
        expect(link).toHaveProperty('id');
        expect(link).toHaveProperty('name');
        expect(link).toHaveProperty('type');
        expect(typeof link.id).toBe('number');
        expect(typeof link.name).toBe('string');
        expect(typeof link.type).toBe('string');
      });
    });

    it('should have unique ids', () => {
      const ids = navLinks.map(link => link.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have non-empty names', () => {
      navLinks.forEach(link => {
        expect(link.name.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('navIcons', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(navIcons)).toBe(true);
      
      navIcons.forEach(icon => {
        expect(icon).toHaveProperty('id');
        expect(icon).toHaveProperty('img');
        expect(typeof icon.img).toBe('string');
        expect(icon.img).toMatch(/\.(svg|png|jpg|jpeg)$/i);
      });
    });

    it('should have unique ids', () => {
      const ids = navIcons.map(icon => icon.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('dockApps', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(dockApps)).toBe(true);
      expect(dockApps.length).toBeGreaterThan(0);
      
      dockApps.forEach(app => {
        expect(app).toHaveProperty('id');
        expect(app).toHaveProperty('name');
        expect(app).toHaveProperty('icon');
        expect(app).toHaveProperty('canOpen');
        expect(typeof app.id).toBe('string');
        expect(typeof app.name).toBe('string');
        expect(typeof app.icon).toBe('string');
        expect(typeof app.canOpen).toBe('boolean');
      });
    });

    it('should have unique ids', () => {
      const ids = dockApps.map(app => app.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have at least one openable app', () => {
      const openableApps = dockApps.filter(app => app.canOpen);
      expect(openableApps.length).toBeGreaterThan(0);
    });

    it('should have valid icon file extensions', () => {
      dockApps.forEach(app => {
        expect(app.icon).toMatch(/\.(png|svg|jpg|jpeg)$/i);
      });
    });
  });

  describe('blogPosts', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(blogPosts)).toBe(true);
      
      blogPosts.forEach(post => {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('date');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('image');
        expect(post).toHaveProperty('link');
        expect(typeof post.title).toBe('string');
        expect(typeof post.link).toBe('string');
      });
    });

    it('should have unique ids', () => {
      const ids = blogPosts.map(post => post.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid URLs', () => {
      blogPosts.forEach(post => {
        expect(post.link).toMatch(/^https?:\/\/.+/);
      });
    });

    it('should have non-empty titles', () => {
      blogPosts.forEach(post => {
        expect(post.title.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('techStack', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(techStack)).toBe(true);
      expect(techStack.length).toBeGreaterThan(0);
      
      techStack.forEach(stack => {
        expect(stack).toHaveProperty('category');
        expect(stack).toHaveProperty('items');
        expect(typeof stack.category).toBe('string');
        expect(Array.isArray(stack.items)).toBe(true);
        expect(stack.items.length).toBeGreaterThan(0);
      });
    });

    it('should have unique categories', () => {
      const categories = techStack.map(stack => stack.category);
      const uniqueCategories = new Set(categories);
      expect(uniqueCategories.size).toBe(categories.length);
    });

    it('should have valid items in each category', () => {
      techStack.forEach(stack => {
        stack.items.forEach(item => {
          expect(typeof item).toBe('string');
          expect(item.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should include common technology categories', () => {
      const categories = techStack.map(s => s.category.toLowerCase());
      const expectedCategories = ['frontend', 'backend'];
      
      expectedCategories.forEach(expected => {
        const found = categories.some(cat => cat.includes(expected));
        expect(found).toBe(true);
      });
    });
  });

  describe('socials', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(socials)).toBe(true);
      
      socials.forEach(social => {
        expect(social).toHaveProperty('id');
        expect(social).toHaveProperty('text');
        expect(social).toHaveProperty('icon');
        expect(social).toHaveProperty('bg');
        expect(social).toHaveProperty('link');
        expect(typeof social.text).toBe('string');
        expect(typeof social.link).toBe('string');
      });
    });

    it('should have unique ids', () => {
      const ids = socials.map(social => social.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid URLs', () => {
      socials.forEach(social => {
        expect(social.link).toMatch(/^https?:\/\/.+/);
      });
    });

    it('should have valid color codes for backgrounds', () => {
      socials.forEach(social => {
        expect(social.bg).toMatch(/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/);
      });
    });
  });

  describe('photosLinks', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(photosLinks)).toBe(true);
      
      photosLinks.forEach(link => {
        expect(link).toHaveProperty('id');
        expect(link).toHaveProperty('icon');
        expect(link).toHaveProperty('title');
        expect(typeof link.title).toBe('string');
      });
    });

    it('should have unique ids', () => {
      const ids = photosLinks.map(link => link.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('gallery', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(gallery)).toBe(true);
      
      gallery.forEach(photo => {
        expect(photo).toHaveProperty('id');
        expect(photo).toHaveProperty('img');
        expect(photo).toHaveProperty('category');
        expect(typeof photo.img).toBe('string');
      });
    });

    it('should have unique ids', () => {
      const ids = gallery.map(photo => photo.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid category references', () => {
      const validCategories = photosLinks.map(link => link.title);
      
      gallery.forEach(photo => {
        if (Array.isArray(photo.category)) {
          photo.category.forEach(cat => {
            expect(validCategories).toContain(cat);
          });
        } else {
          expect(validCategories).toContain(photo.category);
        }
      });
    });
  });

  describe('locations', () => {
    it('should have all required location types', () => {
      expect(locations).toHaveProperty('work');
      expect(locations).toHaveProperty('about');
      expect(locations).toHaveProperty('resume');
      expect(locations).toHaveProperty('trash');
    });

    it('should have valid structure for each location', () => {
      Object.values(locations).forEach(location => {
        expect(location).toHaveProperty('id');
        expect(location).toHaveProperty('type');
        expect(location).toHaveProperty('name');
        expect(location).toHaveProperty('icon');
        expect(location).toHaveProperty('kind');
        expect(location).toHaveProperty('children');
        expect(Array.isArray(location.children)).toBe(true);
      });
    });

    it('should have unique location ids', () => {
      const ids = Object.values(locations).map(loc => loc.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('work location should have project children', () => {
      expect(locations.work.children.length).toBeGreaterThan(0);
      
      locations.work.children.forEach(project => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
        expect(project).toHaveProperty('icon');
        expect(project).toHaveProperty('kind');
        expect(project.kind).toBe('folder');
      });
    });

    it('should have nested children with valid file types', () => {
      const validFileTypes = ['txt', 'url', 'img', 'pdf', 'fig'];
      
      locations.work.children.forEach(project => {
        if (project.children) {
          project.children.forEach(file => {
            if (file.fileType) {
              expect(validFileTypes).toContain(file.fileType);
            }
          });
        }
      });
    });
  });

  describe('WINDOW_CONFIG', () => {
    it('should have all required window types', () => {
      const requiredWindows = ['finder', 'contact', 'resume', 'safari', 'photos', 'terminal', 'txtfile', 'imgfile'];
      
      requiredWindows.forEach(windowKey => {
        expect(WINDOW_CONFIG).toHaveProperty(windowKey);
      });
    });

    it('should have correct initial state for each window', () => {
      Object.values(WINDOW_CONFIG).forEach(window => {
        expect(window).toHaveProperty('isOpen');
        expect(window).toHaveProperty('zIndex');
        expect(window).toHaveProperty('data');
        expect(window.isOpen).toBe(false);
        expect(window.zIndex).toBe(INITIAL_Z_INDEX);
        expect(window.data).toBe(null);
      });
    });

    it('should have valid INITIAL_Z_INDEX', () => {
      expect(typeof INITIAL_Z_INDEX).toBe('number');
      expect(INITIAL_Z_INDEX).toBeGreaterThan(0);
      expect(INITIAL_Z_INDEX).toBe(1000);
    });
  });

  describe('Data Relationships', () => {
    it('dock apps should correspond to window configs', () => {
      const openableDockApps = dockApps.filter(app => app.canOpen);
      
      openableDockApps.forEach(app => {
        expect(WINDOW_CONFIG).toHaveProperty(app.id);
      });
    });

    it('nav links should have valid window types', () => {
      navLinks.forEach(link => {
        if (link.type !== 'home') {
          expect(WINDOW_CONFIG).toHaveProperty(link.type);
        }
      });
    });
  });

  describe('Data Quality', () => {
    it('should not have duplicate names in dockApps', () => {
      const names = dockApps.map(app => app.name.toLowerCase());
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('should have consistent icon paths', () => {
      const allIconPaths = [
        ...navIcons.map(i => i.img),
        ...dockApps.map(a => `/images/${a.icon}`),
        ...socials.map(s => s.icon),
      ];
      
      allIconPaths.forEach(path => {
        expect(path).toMatch(/^\/?(icons?|images)\/.+\.(svg|png|jpg|jpeg|webp)$/i);
      });
    });
  });
});