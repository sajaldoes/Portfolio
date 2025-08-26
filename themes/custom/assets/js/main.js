// ==========================================================================
// Main JavaScript for Custom Academic Theme
// Handles dark mode, navigation, and other interactive features
// ==========================================================================

(function() {
  'use strict';

  // ==========================================================================
  // Theme Management (Dark/Light Mode)
  // ==========================================================================
  
  class ThemeManager {
    constructor() {
      this.theme = localStorage.getItem('theme');
      this.systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.toggle = document.querySelector('[data-theme-toggle]');
      
      this.init();
    }
    
    init() {
      // Set initial theme
      this.setTheme(this.getInitialTheme());
      
      // Bind event listeners
      if (this.toggle) {
        this.toggle.addEventListener('click', () => this.toggleTheme());
      }
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!this.theme) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
    
    getInitialTheme() {
      // Priority: saved preference > system preference > default (light)
      if (this.theme === 'dark' || this.theme === 'light') {
        return this.theme;
      }
      return this.systemPrefersDark ? 'dark' : 'light';
    }
    
    setTheme(theme) {
      const html = document.documentElement;
      const isDark = theme === 'dark';
      
      // Update DOM
      html.classList.toggle('dark', isDark);
      html.classList.toggle('light', !isDark);
      
      // Update toggle button aria-label
      if (this.toggle) {
        this.toggle.setAttribute('aria-label', 
          isDark ? 'Switch to light mode' : 'Switch to dark mode'
        );
      }
      
      // Save preference
      localStorage.setItem('theme', theme);
      this.theme = theme;
      
      // Announce theme change to screen readers
      this.announceThemeChange(theme);
    }
    
    toggleTheme() {
      const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      this.setTheme(newTheme);
    }
    
    announceThemeChange(theme) {
      // Create temporary announcement for screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Switched to ${theme} mode`;
      
      document.body.appendChild(announcement);
      
      // Remove announcement after screen readers have processed it
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }
  
  // ==========================================================================
  // Navigation Management
  // ==========================================================================
  
  class NavigationManager {
    constructor() {
      this.toggle = document.querySelector('[data-nav-toggle]');
      this.menu = document.querySelector('[data-nav-menu]');
      this.links = document.querySelectorAll('.nav-link');
      this.isOpen = false;
      
      this.init();
    }
    
    init() {
      if (!this.toggle || !this.menu) return;
      
      // Bind event listeners
      this.toggle.addEventListener('click', () => this.toggleMenu());
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isOpen && !e.target.closest('.nav')) {
          this.closeMenu();
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeMenu();
          this.toggle.focus();
        }
      });
      
      // Close menu when navigating to a page
      this.links.forEach(link => {
        link.addEventListener('click', () => {
          if (this.isOpen) {
            this.closeMenu();
          }
        });
      });
      
      // Handle resize events
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && this.isOpen) {
          this.closeMenu();
        }
      });
    }
    
    toggleMenu() {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }
    
    openMenu() {
      this.isOpen = true;
      this.toggle.setAttribute('aria-expanded', 'true');
      this.menu.setAttribute('data-nav-open', '');
      
      // Focus first menu item
      const firstLink = this.menu.querySelector('.nav-link');
      if (firstLink) {
        firstLink.focus();
      }
    }
    
    closeMenu() {
      this.isOpen = false;
      this.toggle.setAttribute('aria-expanded', 'false');
      this.menu.removeAttribute('data-nav-open');
    }
  }
  
  // ==========================================================================
  // Smooth Scrolling for Anchor Links
  // ==========================================================================
  
  class SmoothScroll {
    constructor() {
      this.init();
    }
    
    init() {
      // Handle smooth scrolling for anchor links
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          this.scrollToElement(targetElement);
        }
      });
    }
    
    scrollToElement(element) {
      const headerOffset = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = element.offsetTop - headerOffset - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  // ==========================================================================
  // Loading State Management
  // ==========================================================================
  
  class LoadingManager {
    constructor() {
      this.init();
    }
    
    init() {
      // Show loading state for slow-loading images
      const images = document.querySelectorAll('img[loading="lazy"]');
      
      images.forEach(img => {
        if (!img.complete) {
          img.addEventListener('load', () => {
            img.style.opacity = '1';
          });
          
          img.addEventListener('error', () => {
            // Handle image load errors gracefully
            img.style.display = 'none';
          });
          
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease-in-out';
        }
      });
    }
  }
  
  // ==========================================================================
  // Accessibility Enhancements
  // ==========================================================================
  
  class AccessibilityManager {
    constructor() {
      this.init();
    }
    
    init() {
      this.addSkipLink();
      this.enhanceFocusManagement();
      this.addReducedMotionSupport();
    }
    
    addSkipLink() {
      // Add skip link if it doesn't exist
      if (document.querySelector('.skip-link')) return;
      
      const skipLink = document.createElement('a');
      skipLink.href = '#main';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    enhanceFocusManagement() {
      // Ensure focus is visible for keyboard users
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-user');
        }
      });
      
      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-user');
      });
    }
    
    addReducedMotionSupport() {
      // Respect user's motion preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        document.documentElement.style.scrollBehavior = 'auto';
      }
    }
  }
  
  // ==========================================================================
  // Performance Monitoring
  // ==========================================================================
  
  class PerformanceMonitor {
    constructor() {
      this.init();
    }
    
    init() {
      // Report performance metrics in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.group('🚀 Performance Metrics');
            console.log(`DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`);
            console.log(`Page Load Complete: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
            console.log(`First Contentful Paint: ${this.getFCP()}ms`);
            console.groupEnd();
          }, 0);
        });
      }
    }
    
    getFCP() {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      return fcpEntry ? Math.round(fcpEntry.startTime) : 'N/A';
    }
  }
  
  // ==========================================================================
  // Initialize Application
  // ==========================================================================
  
  function initializeApp() {
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new SmoothScroll();
    new LoadingManager();
    new AccessibilityManager();
    new PerformanceMonitor();
    
    console.log('🎨 Custom Academic Theme initialized successfully');
  }
  
  // Start the application when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
  
})();