// ...existing code from script.js...
// Documentation Webapp - Main JavaScript

class DocumentationApp {
  constructor() {
    this.sidebar = document.querySelector('.sidebar');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.currentPage = this.getCurrentPage();
    
    this.init();
  }
  
  init() {
    this.setupMobileMenu();
    this.setupNavigation();
    this.setupImageLazyLoading();
    this.setupSmoothScrolling();
    this.highlightCurrentPage();
    this.setupKeyboardNavigation();
  }
  
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
  }
  
  setupMobileMenu() {
    if (this.mobileMenuBtn && this.sidebar) {
      this.mobileMenuBtn.addEventListener('click', () => {
        this.toggleSidebar();
      });
      
      // Close sidebar when clicking outside on mobile
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          if (!this.sidebar.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
            this.closeSidebar();
          }
        }
      });
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          this.sidebar.classList.remove('open');
        }
      });
    }
  }
  
  toggleSidebar() {
    this.sidebar.classList.toggle('open');
  }
  
  closeSidebar() {
    this.sidebar.classList.remove('open');
  }
  
  setupNavigation() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Close mobile menu when navigating
        if (window.innerWidth <= 768) {
          this.closeSidebar();
        }
        
        // Add loading animation
        this.showLoadingState();
      });
    });
  }
  
  highlightCurrentPage() {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        // Get only the filename from the href (strip folders and .html)
        const linkFile = href.split('/').pop().replace('.html', '');
        if (linkFile === this.currentPage || 
            (this.currentPage === 'index' && linkFile === 'index')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
  
  setupImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }
  
  setupSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC to close mobile menu
      if (e.key === 'Escape' && window.innerWidth <= 768) {
        this.closeSidebar();
      }
      
      // Alt + M to toggle mobile menu
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        this.toggleSidebar();
      }
    });
  }
  
  showLoadingState() {
    const content = document.querySelector('.content-body');
    if (content) {
      content.style.opacity = '0.7';
      setTimeout(() => {
        content.style.opacity = '1';
      }, 200);
    }
  }
  
  // Utility method to update breadcrumb
  updateBreadcrumb(items) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb && items) {
      breadcrumb.innerHTML = items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast) {
          return `<span class="breadcrumb-item">${item.text}</span>`;
        } else {
          return `<a href="${item.href}" class="breadcrumb-item">${item.text}</a><span class="breadcrumb-separator">›</span>`;
        }
      }).join('');
    }
  }
  
  // Method to add image zoom functionality
  setupImageZoom() {
    const images = document.querySelectorAll('.content-image');
    images.forEach(img => {
      img.addEventListener('click', () => {
        this.openImageModal(img.src, img.alt);
      });
      img.style.cursor = 'pointer';
      img.title = 'Click to enlarge';
    });
  }
  
  openImageModal(src, alt) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <img src="${src}" alt="${alt}" class="modal-image">
          <p class="modal-caption">${alt}</p>
        </div>
      </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .image-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-overlay {
        background: rgba(0, 0, 0, 0.9);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }
      .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
      }
      .modal-image {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 0.5rem;
      }
      .modal-close {
        position: absolute;
        top: -2rem;
        right: -2rem;
        background: white;
        border: none;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-caption {
        color: white;
        margin-top: 1rem;
        font-style: italic;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
      document.body.removeChild(modal);
      document.head.removeChild(style);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    });
    
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new DocumentationApp();
  
  // Setup image zoom after initialization
  app.setupImageZoom();
  
  // Make app globally available for debugging
  window.docsApp = app;
});

// Utility functions for external use
window.DocsUtils = {
  // Function to dynamically update navigation
  updateNavigation: function(navItems) {
    const nav = document.querySelector('.sidebar-nav');
    if (nav && navItems) {
      nav.innerHTML = navItems.map(section => `
        <div class="nav-section">
          <div class="nav-section-title">${section.title}</div>
          ${section.items.map(item => `
            <a href="${item.href}" class="nav-link">${item.text}</a>
          `).join('')}
        </div>
      `).join('');
      
      // Re-initialize navigation
      if (window.docsApp) {
        window.docsApp.setupNavigation();
        window.docsApp.highlightCurrentPage();
      }
    }
  },
  
  // Function to add content sections dynamically
  addContentSection: function(title, content, containerId = 'main-content') {
    const container = document.getElementById(containerId);
    if (container) {
      const section = document.createElement('div');
      section.className = 'content-card';
      section.innerHTML = `
        <div class="card-header">
          <h2 class="card-title">${title}</h2>
        </div>
        <div class="card-body">
          ${content}
        </div>
      `;
      container.appendChild(section);
    }
  }
};

