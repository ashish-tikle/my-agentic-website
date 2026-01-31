// assets/js/main.js - Modern JavaScript with best practices

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
}

// Lazy loading images
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };
        
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.options);
            this.images.forEach(img => this.observer.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => this.loadImage(img));
        }
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        img.src = src;
        img.classList.add('lazy-load');
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        });
    }
}

// Mobile menu toggle
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.menu = document.querySelector('.nav-menu');
        
        if (this.toggle && this.menu) {
            this.toggle.addEventListener('click', this.toggleMenu.bind(this));
            this.addAccessibility();
        }
    }
    
    toggleMenu() {
        const isOpen = this.menu.classList.toggle('active');
        this.toggle.setAttribute('aria-expanded', isOpen);
        this.toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        
        // Trap focus in menu when open
        if (isOpen) {
            this.trapFocus();
        }
    }
    
    addAccessibility() {
        this.toggle.setAttribute('aria-label', 'Open menu');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.toggle.setAttribute('aria-controls', 'nav-menu');
        this.menu.setAttribute('id', 'nav-menu');
    }
    
    trapFocus() {
        const focusableElements = this.menu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        lastElement.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                firstElement.focus();
            }
        });
    }
}

// Form validation
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.addRealTimeValidation();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        }
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';
        
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (type === 'email' && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        this.showError(input, errorMessage);
        return isValid;
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showError(input, message) {
        const errorElement = input.parentElement.querySelector('.error-message') || 
                            this.createErrorElement();
        
        if (message) {
            errorElement.textContent = message;
            input.parentElement.appendChild(errorElement);
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', errorElement.id);
        } else {
            errorElement.remove();
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
        }
    }
    
    createErrorElement() {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.id = `error-${Date.now()}`;
        error.style.color = 'red';
        error.style.fontSize = '0.875rem';
        error.setAttribute('role', 'alert');
        return error;
    }
    
    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }
    
    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        try {
            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            this.showErrorMessage('Something went wrong. Please try again.');
        }
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Thank you! Your message has been sent.';
        message.style.cssText = 'background: #10b981; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;';
        this.form.appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }
    
    showErrorMessage(text) {
        const message = document.createElement('div');
        message.className = 'error-banner';
        message.textContent = text;
        message.style.cssText = 'background: #ef4444; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;';
        this.form.appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }
}

// Smooth scroll with offset for fixed header
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleClick.bind(this));
        });
    }
    
    handleClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const offset = 80; // Height of fixed header
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        if ('PerformanceObserver' in window) {
            this.observeLCP();
            this.observeFID();
            this.observeCLS();
        }
    }
    
    observeLCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
    
    observeFID() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        });
        observer.observe({ entryTypes: ['first-input'] });
    }
    
    observeCLS() {
        let clsScore = 0;
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                    console.log('CLS:', clsScore);
                }
            });
        });
        observer.observe({ entryTypes: ['layout-shift'] });
    }
}

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
    new MobileMenu();
    new FormValidator('#contact-form');
    new SmoothScroll();
    new PerformanceMonitor();
});

// Add loading indicator
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});