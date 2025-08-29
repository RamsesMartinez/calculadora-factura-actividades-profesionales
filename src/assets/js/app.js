/**
 * @fileoverview Main application file for CFDI calculator
 * @author Ramses Martinez
 * @version 1.0.0
 */

import { CalculatorController } from '../../components/CalculatorController.js';
import { APP_CONFIG } from '../../config/constants.js';
import { i18n } from '../../utils/i18n.js';

/**
 * Main application class
 */
class CFDIApp {
  constructor() {
    this.controller = null;
    this.isInitialized = false;
  }

  /**
   * Initializes the application
   */
  async init() {
    try {
      console.log(`Starting ${APP_CONFIG.NAME} v${APP_CONFIG.VERSION}`);
      
      // Check if DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this._initializeApp());
      } else {
        this._initializeApp();
      }
    } catch (error) {
      console.error('Error initializing application:', error);
      this._showError('Error loading application. Please reload the page.');
    }
  }

  /**
   * Initializes the application after DOM is ready
   * @private
   */
  _initializeApp() {
    try {
      // Initialize internationalization first
      this._setupInternationalization();
      
      // Create and initialize controller
      this.controller = new CalculatorController();
      this.controller.init();
      
      this.isInitialized = true;
      
      // Set up application information
      this._setupAppInfo();
      
      // Set up service worker if available
      this._setupServiceWorker();
      
      console.log(`${APP_CONFIG.NAME} initialized successfully`);
      
      // Dispatch initialization event
      window.dispatchEvent(new CustomEvent('cfdiAppReady', {
        detail: { version: APP_CONFIG.VERSION }
      }));
      
    } catch (error) {
      console.error('Error in initialization:', error);
      this._showError('Error initializing calculator. Check console for details.');
    }
  }

  /**
   * Sets up internationalization
   * @private
   */
  _setupInternationalization() {
    // Set initial language in selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.value = i18n.getCurrentLanguage();
      
      // Add event listener for language changes
      languageSelect.addEventListener('change', (event) => {
        const newLanguage = event.target.value;
        i18n.setLanguage(newLanguage);
        
        // Update selector label
        const label = document.querySelector('.language-selector__label');
        if (label) {
          label.textContent = i18n.t('languageLabel');
        }
      });
    }

    // Add language change listener to update error messages in controller
    i18n.addLanguageChangeListener((language) => {
      console.log(`Language changed to: ${language}`);
      
      // Update error messages in controller if it exists
      if (this.controller) {
        // The controller will use the updated i18n service for error messages
        console.log('Controller notified of language change');
      }
    });

    // Apply initial language
    i18n.setLanguage(i18n.getCurrentLanguage());
  }

  /**
   * Sets up application information
   * @private
   */
  _setupAppInfo() {
    // Update title dynamically if needed
    const titleElement = document.querySelector('title');
    if (titleElement) {
      titleElement.textContent = i18n.t('pageTitle');
    }

    // Add version information to DOM
    const versionElement = document.createElement('div');
    versionElement.id = 'app-version';
    versionElement.style.cssText = 'position: fixed; bottom: 10px; right: 10px; font-size: 12px; color: #666; opacity: 0.7;';
    versionElement.textContent = `v${APP_CONFIG.VERSION}`;
    document.body.appendChild(versionElement);

    // Set up dynamic meta tags
    this._setupMetaTags();
  }

  /**
   * Sets up meta tags for SEO
   * @private
   */
  _setupMetaTags() {
    const metaTags = [
      { name: 'description', content: i18n.t('pageDescription') },
      { name: 'author', content: APP_CONFIG.AUTHOR },
      { name: 'version', content: APP_CONFIG.VERSION },
      { property: 'og:title', content: i18n.t('pageTitle') },
      { property: 'og:description', content: i18n.t('pageDescription') },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: i18n.t('pageTitle') },
      { name: 'twitter:description', content: i18n.t('pageDescription') },
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      Object.entries(tag).forEach(([key, value]) => {
        meta.setAttribute(key, value);
      });
      document.head.appendChild(meta);
    });
  }

  /**
   * Sets up service worker for offline functionality
   * @private
   */
  async _setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.log('Service Worker could not register:', error);
      }
    }
  }

  /**
   * Shows error message to user
   * @param {string} message - Error message
   * @private
   */
  _showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ef4444;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 10000;
      max-width: 90%;
      text-align: center;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    // Remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  /**
   * Gets application controller
   * @returns {CalculatorController|null} Application controller
   */
  getController() {
    return this.controller;
  }

  /**
   * Checks if application is initialized
   * @returns {boolean} true if initialized
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Gets i18n service
   * @returns {I18nService} i18n service instance
   */
  getI18n() {
    return i18n;
  }
}

// Create global application instance
window.cfdiApp = new CFDIApp();

// Initialize application when script loads
window.cfdiApp.init();

// Export for module use
export default window.cfdiApp;
