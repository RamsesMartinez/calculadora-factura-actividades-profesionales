/**
 * @fileoverview Internationalization service
 * @author Ramses Martinez
 * @version 1.0.0
 */

import { TRANSLATIONS, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../config/translations.js';

/**
 * Internationalization service class
 */
export class I18nService {
  constructor() {
    this.currentLanguage = this._detectLanguage();
    this.listeners = [];
    this._saveLanguagePreference();
  }

  /**
   * Detects the user's preferred language
   * @returns {string} Language code
   * @private
   */
  _detectLanguage() {
    // First check localStorage for saved preference
    const savedLanguage = localStorage.getItem('cfdi-calculator-language');
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return savedLanguage;
    }

    // Then check browser language
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage) {
      const languageCode = browserLanguage.split('-')[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(languageCode)) {
        return languageCode;
      }
    }

    // Fallback to default
    return DEFAULT_LANGUAGE;
  }

  /**
   * Saves language preference to localStorage
   * @private
   */
  _saveLanguagePreference() {
    localStorage.setItem('cfdi-calculator-language', this.currentLanguage);
  }

  /**
   * Gets translation for a key
   * @param {string} key - Translation key
   * @returns {string} Translated text
   */
  t(key) {
    const translations = TRANSLATIONS[this.currentLanguage];
    if (!translations) {
      console.warn(`Language ${this.currentLanguage} not found, falling back to ${DEFAULT_LANGUAGE}`);
      return TRANSLATIONS[DEFAULT_LANGUAGE][key] || key;
    }
    
    return translations[key] || TRANSLATIONS[DEFAULT_LANGUAGE][key] || key;
  }

  /**
   * Gets current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Sets language and updates the interface
   * @param {string} language - Language code
   */
  setLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      console.warn(`Language ${language} is not supported`);
      return;
    }

    this.currentLanguage = language;
    this._saveLanguagePreference();
    this._updateInterface();
    this._notifyListeners();
  }

  /**
   * Updates the entire interface with current language
   * @private
   */
  _updateInterface() {
    // Update page title and meta description
    document.title = this.t('pageTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', this.t('pageDescription'));
    }

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;

    // Update header
    const headerTitle = document.querySelector('.header__content h1');
    if (headerTitle) {
      headerTitle.textContent = this.t('headerTitle');
    }

    const headerDescription = document.querySelector('.header__description');
    if (headerDescription) {
      headerDescription.textContent = this.t('headerDescription');
    }

    // Update section titles
    const parametersTitle = document.querySelector('#parameters-title');
    if (parametersTitle) {
      parametersTitle.textContent = this.t('parametersTitle');
    }

    const resultsTitle = document.querySelector('.card:nth-child(3) .card__title');
    if (resultsTitle) {
      resultsTitle.textContent = this.t('resultsTitle');
    }

    const quickNotesTitle = document.querySelector('.card:nth-child(4) .card__title');
    if (quickNotesTitle) {
      quickNotesTitle.textContent = this.t('quickNotesTitle');
    }

    // Update form labels
    this._updateFormLabels();
    
    // Update buttons
    this._updateButtons();
    
    // Update results
    this._updateResults();
    
    // Update notes and footer
    this._updateNotesAndFooter();
    
    // Update placeholders
    this._updatePlaceholders();
  }

  /**
   * Updates form labels
   * @private
   */
  _updateFormLabels() {
    // Net amount label and help
    const netAmountLabel = document.querySelector('label[for="neto"]');
    if (netAmountLabel) {
      netAmountLabel.textContent = this.t('netAmountLabel');
    }

    const netAmountHelp = document.querySelector('#net-amount-help');
    if (netAmountHelp) {
      netAmountHelp.textContent = this.t('netAmountHelp');
    }

    // Subtotal label and help
    const subtotalLabel = document.querySelector('label[for="subtotal"]');
    if (subtotalLabel) {
      subtotalLabel.textContent = this.t('subtotalLabel');
    }

    const subtotalHelp = document.querySelector('#subtotal-help');
    if (subtotalHelp) {
      subtotalHelp.textContent = this.t('subtotalHelp');
    }

    // Rates label and help
    const ratesLabel = document.querySelector('.form-group:nth-child(2) .form-label');
    if (ratesLabel) {
      ratesLabel.textContent = this.t('ratesLabel');
    }

    const ratesHelp = document.querySelector('.form-group:nth-child(2) .form-help');
    if (ratesHelp) {
      ratesHelp.textContent = this.t('ratesHelp');
    }

    // Calculation options label
    const calculationOptionsLabel = document.querySelector('.form-group:nth-child(3) .form-label');
    if (calculationOptionsLabel) {
      calculationOptionsLabel.textContent = this.t('calculationOptionsLabel');
    }

    // Checkbox options
    const checkboxes = document.querySelectorAll('.checkbox-item span');
    if (checkboxes.length >= 3) {
      checkboxes[0].textContent = this.t('highPrecisionOption');
      checkboxes[1].textContent = this.t('roundPerLineOption');
      checkboxes[2].textContent = this.t('showStepsOption');
    }
  }

  /**
   * Updates buttons
   * @private
   */
  _updateButtons() {
    const calcFromSubtotalBtn = document.getElementById('calcFromSubtotal');
    if (calcFromSubtotalBtn) {
      calcFromSubtotalBtn.textContent = this.t('calculateFromSubtotalBtn');
    }

    const algebraicFromNetoBtn = document.getElementById('algebraicFromNeto');
    if (algebraicFromNetoBtn) {
      algebraicFromNetoBtn.textContent = this.t('calculateSubtotalDirectBtn');
    }

    const goalSeekFromNetoBtn = document.getElementById('goalSeekFromNeto');
    if (goalSeekFromNetoBtn) {
      goalSeekFromNetoBtn.textContent = this.t('goalSeekBtn');
    }

    const resetBtn = document.getElementById('reset');
    if (resetBtn) {
      resetBtn.textContent = this.t('resetBtn');
    }

    const copyJsonBtn = document.getElementById('copyJson');
    if (copyJsonBtn) {
      copyJsonBtn.textContent = this.t('copyJsonBtn');
    }

    const downloadCsvBtn = document.getElementById('downloadCsv');
    if (downloadCsvBtn) {
      downloadCsvBtn.textContent = this.t('downloadCsvBtn');
    }
  }

  /**
   * Updates results section
   * @private
   */
  _updateResults() {
    const resultItems = document.querySelectorAll('.result-item__label');
    if (resultItems.length >= 5) {
      resultItems[0].textContent = this.t('subtotalResult');
      resultItems[1].textContent = this.t('vatChargedResult');
      resultItems[2].textContent = this.t('incomeTaxWithheldResult');
      resultItems[3].textContent = this.t('vatRetentionResult');
      resultItems[4].textContent = this.t('calculatedNetResult');
    }

    // Update log content
    const logContent = document.getElementById('log');
    if (logContent && logContent.textContent.includes('Steps will appear') || logContent.textContent.includes('Aquí aparecerán')) {
      logContent.textContent = this.t('stepsWillAppear');
    }

    // Update log summary
    const logSummary = document.querySelector('.log-container summary');
    if (logSummary) {
      logSummary.textContent = this.t('viewStepsLog');
    }
  }

  /**
   * Updates notes and footer
   * @private
   */
  _updateNotesAndFooter() {
    // Calculation note
    const calculationNote = document.querySelector('.form-help.mt-3 strong');
    if (calculationNote) {
      const noteContainer = calculationNote.parentElement;
      noteContainer.innerHTML = `<strong>${this.t('calculationNote').split(':')[0]}:</strong> ${this.t('calculationNote').split(': ').slice(1).join(': ')}`;
    }

    // Quick notes
    const quickNotes = document.querySelector('.card:nth-child(4) ul');
    if (quickNotes && quickNotes.children.length >= 3) {
      quickNotes.children[0].textContent = this.t('quickNote1');
      quickNotes.children[1].textContent = this.t('quickNote2');
      quickNotes.children[2].textContent = this.t('quickNote3');
    }

    // Footer
    const footerLinks = document.querySelectorAll('footer a');
    if (footerLinks.length > 0) {
      const footerText = document.querySelector('footer .text-muted');
      if (footerText) {
        footerText.innerHTML = `${this.t('developedBy')} <a href="https://github.com/ramthedev" target="_blank" rel="noopener" style="color: var(--color-primary);">Ramses Martinez</a>`;
      }
    }

    const footerNote = document.querySelector('footer .text-muted:last-child');
    if (footerNote) {
      footerNote.textContent = this.t('freeToolNote');
    }
  }

  /**
   * Updates placeholders
   * @private
   */
  _updatePlaceholders() {
    const netAmountInput = document.getElementById('neto');
    if (netAmountInput) {
      netAmountInput.placeholder = this.t('netAmountPlaceholder');
    }

    const subtotalInput = document.getElementById('subtotal');
    if (subtotalInput) {
      subtotalInput.placeholder = this.t('subtotalPlaceholder');
    }

    const vatRateInput = document.getElementById('ivaRate');
    if (vatRateInput) {
      vatRateInput.placeholder = this.t('vatPlaceholder');
    }

    const incomeTaxInput = document.getElementById('isrRate');
    if (incomeTaxInput) {
      incomeTaxInput.placeholder = this.t('incomeTaxPlaceholder');
    }

    const vatRetInput = document.getElementById('retFrac');
    if (vatRetInput) {
      vatRetInput.placeholder = this.t('vatRetPlaceholder');
    }
  }

  /**
   * Adds a listener for language changes
   * @param {Function} callback - Callback function
   */
  addLanguageChangeListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notifies all listeners of language change
   * @private
   */
  _notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentLanguage);
      } catch (error) {
        console.error('Error in language change listener:', error);
      }
    });
  }

  /**
   * Gets supported languages
   * @returns {Array} Array of supported language codes
   */
  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Gets language name for display
   * @param {string} languageCode - Language code
   * @returns {string} Language name
   */
  getLanguageName(languageCode) {
    const languageNames = {
      en: 'English',
      es: 'Español'
    };
    return languageNames[languageCode] || languageCode;
  }
}

// Create global instance
export const i18n = new I18nService();
