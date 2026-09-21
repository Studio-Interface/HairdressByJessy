// ===== WHATSAPP CONFIGURATIE =====
// Pas hier het telefoonnummer en berichten aan
const WHATSAPP_CONFIG = {
  phoneNumber: '31634609242', // Telefoonnummer zonder + of 0 (31 = Nederland)
  messages: {
    producten: 'Hallo, ik heb een vraag over de producten.',
    afspraak: 'Hallo, ik wil graag een afspraak maken op ... om... .',
  }
};

// Functie om WhatsApp link te genereren
function getWhatsAppLink(messageType = 'algemeen') {
  const message = WHATSAPP_CONFIG.messages[messageType] || WHATSAPP_CONFIG.messages.algemeen;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
}

// ===== WHATSAPP LINKS INITIALISATIE =====
class WhatsAppLinksManager {
  constructor() {
    this.init();
  }
  
  init() {
    // Zoek alle links met data-whatsapp attribuut
    const whatsappLinks = document.querySelectorAll('a[data-whatsapp]');
    
    whatsappLinks.forEach(link => {
      const messageType = link.getAttribute('data-whatsapp');
      link.href = getWhatsAppLink(messageType);
    });
  }
}

// ===== MOBILE NAVIGATION =====
class MobileNavigation {
  constructor() {
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileClose = document.querySelector('.mobile-menu-close');
    this.nav = document.querySelector('.nav');
    this.overlay = document.querySelector('.menu-overlay');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }
  
  init() {
    // Add event listener for mobile menu toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }
    
    // Add event listener for mobile menu close button
    if (this.mobileClose) {
      this.mobileClose.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeMenu();
      });
    }
    
    // Add event listener for overlay click
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.closeMenu();
      });
    }
    
    // Close menu when clicking on nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.nav && this.nav.classList.contains('active')) {
        this.closeMenu();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    if (this.nav && this.mobileToggle && this.overlay) {
      this.nav.classList.toggle('active');
      this.mobileToggle.classList.toggle('active');
      this.overlay.classList.toggle('active');
      
      // Update aria-label
      const isOpen = this.nav.classList.contains('active');
      this.mobileToggle.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }
  
  closeMenu() {
    if (this.nav && this.mobileToggle && this.overlay) {
      this.nav.classList.remove('active');
      this.mobileToggle.classList.remove('active');
      this.overlay.classList.remove('active');
      this.mobileToggle.setAttribute('aria-label', 'Menu openen');
      document.body.style.overflow = '';
    }
  }
}

// ===== SMOOTH SCROLLING & ACTIVE NAV =====
class SmoothScrolling {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    
    this.init();
  }
  
  init() {
    // Add smooth scrolling to nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        // Only prevent default for internal links (starting with #)
        if (targetId.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
            const offsetTop = targetSection.offsetTop; // Account for sticky header
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
        // External links (like producten.html) will work normally
      });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => this.updateActiveNav());
  }
  
  updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.service-card, .price-category');
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    // Create intersection observer for scroll animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, this.observerOptions);
    
    // Set initial state and observe elements
    this.animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      this.observer.observe(element);
    });
  }
}

// ===== HEADER SCROLL EFFECT =====
class HeaderScrollEffect {
  constructor() {
    this.header = document.querySelector('.header');
    this.lastScrollTop = 0;
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }
  
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow on scroll
    if (scrollTop > 0) {
      this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      this.header.style.boxShadow = 'none';
    }
    
    this.lastScrollTop = scrollTop;
  }
}

// ===== CONTACT FORM ENHANCEMENT =====
class ContactEnhancement {
  constructor() {
    this.ctaButtons = document.querySelectorAll('.cta-button');
    
    this.init();
  }
  
  init() {
    // Add click tracking and smooth scroll for CTA buttons
    this.ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const href = button.getAttribute('href');
        
        // Only intercept internal links (starting with # or no href)
        if (!href || href.startsWith('#') || href === '') {
          e.preventDefault();
          
          // Add click animation
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
          }, 150);
          
          // Scroll to contact section
          const contactSection = document.querySelector('#contact');
          if (contactSection) {
            const offsetTop = contactSection.offsetTop - 110;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
        // External links (like prijzen.html, producten.html) will navigate normally
      });
    });
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    // Lazy load images when they come into view
    if ('IntersectionObserver' in window) {
      this.lazyLoadImages();
    }
    
    // Preload critical resources
    this.preloadCriticalResources();
  }
  
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  preloadCriticalResources() {
    // Preload important fonts
    const fontUrls = [
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap'
    ];
    
    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'style';
      document.head.appendChild(link);
    });
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }
  
  init() {
    // Add keyboard navigation support
    this.setupKeyboardNavigation();
    
    // Improve focus management
    this.improveFocusManagement();
    
    // Add aria labels where needed
    this.addAriaLabels();
  }
  
  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
      // Handle escape key to close mobile menu
      if (e.key === 'Escape') {
        const nav = document.querySelector('.nav');
        if (nav && nav.classList.contains('active')) {
          // Close mobile menu if open
          const mobileNav = document.querySelector('.mobile-menu-toggle');
          if (mobileNav) {
            nav.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileNav.setAttribute('aria-label', 'Menu openen');
            document.body.style.overflow = '';
          }
        }
      }
    });
  }
  
  improveFocusManagement() {
    // Ensure focus is visible for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
  
  addAriaLabels() {
    // Add aria-current to active nav items
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.classList.contains('nav-link')) {
            if (target.classList.contains('active')) {
              target.setAttribute('aria-current', 'page');
            } else {
              target.removeAttribute('aria-current');
            }
          }
        }
      });
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
      observer.observe(link, { attributes: true });
    });
  }
}

// ===== SCROLL TO TOP BUTTON =====
class ScrollToTop {
  constructor() {
    this.createButton();
    this.init();
  }
  
  createButton() {
    // Create the scroll to top button
    this.button = document.createElement('button');
    this.button.className = 'scroll-to-top';
    this.button.setAttribute('aria-label', 'Scroll naar boven');
    this.button.setAttribute('title', 'Scroll naar boven');
    this.button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    
    // Add button to body
    document.body.appendChild(this.button);
  }
  
  init() {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => this.toggleVisibility());
    
    // Add click event to scroll to top
    this.button.addEventListener('click', () => this.scrollToTop());
  }
  
  toggleVisibility() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }
  
  scrollToTop() {
    // Add click animation
    this.button.style.transform = 'scale(0.9)';
    setTimeout(() => {
      this.button.style.transform = '';
    }, 150);
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// ===== OPENING HOURS WEEK SYSTEM =====
class OpeningHoursManager {
  constructor() {
    this.tabs = {
      even: document.getElementById('evenWeekTab'),
      odd:  document.getElementById('oddWeekTab'),
    };
    this.panels = {
      even: document.getElementById('evenWeekHours'),
      odd:  document.getElementById('oddWeekHours'),
    };
    this.currentWeekNumber = document.getElementById('currentWeekNumber');

    this.init();
  }

  init() {
    if (!this.tabs.even) return;

    this.updateCurrentWeek();

    Object.entries(this.tabs).forEach(([key, tab]) => {
      if (tab) tab.addEventListener('click', () => this.showWeek(key));
    });
  }

  getCurrentWeekNumber() {
    const now = new Date();
    const jan4 = new Date(now.getFullYear(), 0, 4);
    const startOfWeek1 = new Date(jan4);
    startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
    const diff = now - startOfWeek1;
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  }

  updateCurrentWeek() {
    const weekNumber = this.getCurrentWeekNumber();
    const isEven = weekNumber % 2 === 0;

    if (this.currentWeekNumber) {
      this.currentWeekNumber.textContent = `Week ${weekNumber} (${isEven ? 'Even' : 'Oneven'})`;
    }

    this.showWeek(isEven ? 'even' : 'odd');
  }

  showWeek(weekType) {
    Object.values(this.tabs).forEach(tab => tab && tab.classList.remove('active'));
    Object.values(this.panels).forEach(panel => { if (panel) panel.style.display = 'none'; });

    const tab = this.tabs[weekType];
    const panel = this.panels[weekType];
    if (tab) tab.classList.add('active');
    if (panel) panel.style.display = 'flex';
  }
}

// ===== PAGE TRANSITIONS =====
class PageTransitions {
  constructor() {
    this.duration = 250;
    this.init();
  }

  isInternalPage(href) {
    if (!href) return false;
    if (href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) return false;
    return href.endsWith('.html') || href === '/' || href === './';
  }

  init() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link || link.target === '_blank') return;
      if (!this.isInternalPage(link.getAttribute('href'))) return;

      e.preventDefault();
      const href = link.getAttribute('href');
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = href; }, this.duration);
    });
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new MobileNavigation();
  new SmoothScrolling();
  new ScrollAnimations();
  new HeaderScrollEffect();
  new ContactEnhancement();
  new PerformanceOptimizer();
  new AccessibilityEnhancer();
  new ScrollToTop();
  new OpeningHoursManager();
  new WhatsAppLinksManager();
  new PageTransitions();

  // Zet actieve nav link op basis van huidige pagina
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop().split('#')[0];
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' || currentPage === 'index.html') {
      // Op de homepagina regelt de scroll-gebaseerde logica de actieve staat
    } else {
      link.classList.remove('active');
    }
  });

  // Add loading animation
  document.body.classList.add('loaded');
});

// ===== LOADING ANIMATION =====
// Add CSS for loading state
const loadingStyles = `
  body:not(.loaded) {
    opacity: 0;
  }

  body.loaded {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  body.page-exit {
    opacity: 0 !important;
    pointer-events: none;
    transition: opacity 0.25s ease !important;
  }

  .keyboard-navigation *:focus {
    outline: 2px solid var(--primary-gold) !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.2) !important;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

