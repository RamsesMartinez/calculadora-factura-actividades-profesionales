/**
 * @fileoverview Main controller for CFDI calculator
 * @author Ramses Martinez
 * @version 1.0.0
 */

import { TaxCalculator } from '../utils/taxCalculator.js';
import { ExportManager } from '../utils/exportUtils.js';
import { formatNumber, formatCurrency } from '../utils/mathUtils.js';
import { ERROR_MESSAGES, EXPORT_CONFIG } from '../config/constants.js';
import { i18n } from '../utils/i18n.js';

/**
 * Main controller for CFDI calculator
 * Handles UI logic and communication with calculation engine
 */
export class CalculatorController {
  /**
   * Controller constructor
   */
  constructor() {
    this.calculator = new TaxCalculator();
    this.currentResult = null;
    this.elements = {};
    this.isInitialized = false;
  }

  /**
   * Initializes the controller and sets up event listeners
   */
  init() {
    if (this.isInitialized) {
      console.warn('CalculatorController is already initialized');
      return;
    }

    this._cacheElements();
    this._setupEventListeners();
    this._setupDefaultValues();
    this.isInitialized = true;

    console.log('CalculatorController initialized successfully');
  }

  /**
   * Caches DOM element references
   * @private
   */
  _cacheElements() {
    // Main inputs
    this.elements.netAmount = document.getElementById('neto');
    this.elements.subtotal = document.getElementById('subtotal');
    
    // Rate inputs
    this.elements.vatRate = document.getElementById('ivaRate');
    this.elements.incomeTaxRate = document.getElementById('isrRate');
    this.elements.vatRetentionFraction = document.getElementById('retFrac');
    
    // Option checkboxes
    this.elements.useHighPrecision = document.getElementById('useHighPrecision');
    this.elements.roundPerLine = document.getElementById('roundPerLine');
    this.elements.showSteps = document.getElementById('showSteps');
    
    // Action buttons
    this.elements.calcFromSubtotalBtn = document.getElementById('calcFromSubtotal');
    this.elements.algebraicFromNetBtn = document.getElementById('algebraicFromNeto');
    this.elements.goalSeekFromNetBtn = document.getElementById('goalSeekFromNeto');
    this.elements.resetBtn = document.getElementById('reset');
    this.elements.copyJsonBtn = document.getElementById('copyJson');
    this.elements.downloadCsvBtn = document.getElementById('downloadCsv');
    
    // Result elements
    this.elements.outSubtotal = document.getElementById('outSubtotal');
    this.elements.outVAT = document.getElementById('outIVA');
    this.elements.outIncomeTax = document.getElementById('outISR');
    this.elements.outVATRetention = document.getElementById('outRetIVA');
    this.elements.outNetAmount = document.getElementById('outNeto');
    
    // Log and debug
    this.elements.log = document.getElementById('log');
  }

  /**
   * Sets up event listeners
   * @private
   */
  _setupEventListeners() {
    // Calculation buttons
    this.elements.calcFromSubtotalBtn?.addEventListener('click', () => {
      this._handleCalculateFromSubtotal();
    });

    this.elements.algebraicFromNetBtn?.addEventListener('click', () => {
      this._handleAlgebraicFromNet();
    });

    this.elements.goalSeekFromNetBtn?.addEventListener('click', () => {
      this._handleGoalSeekFromNet();
    });

    // Reset button
    this.elements.resetBtn?.addEventListener('click', () => {
      this._handleReset();
    });

    // Export buttons
    this.elements.copyJsonBtn?.addEventListener('click', () => {
      this._handleCopyJSON();
    });

    this.elements.downloadCsvBtn?.addEventListener('click', () => {
      this._handleDownloadCSV();
    });

    // Event listeners for rate changes
    [this.elements.vatRate, this.elements.incomeTaxRate, this.elements.vatRetentionFraction].forEach(element => {
      element?.addEventListener('change', () => {
        this._updateCalculatorRates();
      });
    });

    // Event listeners for main inputs
    [this.elements.netAmount, this.elements.subtotal].forEach(element => {
      element?.addEventListener('input', () => {
        this._clearResults();
      });
    });
  }

  /**
   * Sets up default values
   * @private
   */
  _setupDefaultValues() {
    if (this.elements.netAmount) this.elements.netAmount.value = '9280.00';
    if (this.elements.subtotal) this.elements.subtotal.value = '0';
    if (this.elements.vatRate) this.elements.vatRate.value = '0.16';
    if (this.elements.incomeTaxRate) this.elements.incomeTaxRate.value = '0.10';
    if (this.elements.vatRetentionFraction) this.elements.vatRetentionFraction.value = '0.6666666667';
    if (this.elements.useHighPrecision) this.elements.useHighPrecision.checked = true;
    if (this.elements.roundPerLine) this.elements.roundPerLine.checked = true;
    if (this.elements.showSteps) this.elements.showSteps.checked = false;
  }

  /**
   * Gets current rates from inputs
   * @returns {Object} Object with rates
   * @private
   */
  _getCurrentRates() {
    return {
      vatRate: parseFloat(this.elements.vatRate?.value || 0.16),
      incomeTaxRate: parseFloat(this.elements.incomeTaxRate?.value || 0.10),
      vatRetentionFraction: parseFloat(this.elements.vatRetentionFraction?.value || 0.6666666667),
    };
  }

  /**
   * Gets current options from checkboxes
   * @returns {Object} Object with options
   * @private
   */
  _getCurrentOptions() {
    return {
      roundPerLine: this.elements.roundPerLine?.checked || true,
      highPrecision: this.elements.useHighPrecision?.checked || true,
    };
  }

  /**
   * Updates calculator rates
   * @private
   */
  _updateCalculatorRates() {
    const rates = this._getCurrentRates();
    this.calculator.updateRates(rates);
  }

  /**
   * Clears displayed results
   * @private
   */
  _clearResults() {
    const resultElements = [
      this.elements.outSubtotal,
      this.elements.outVAT,
      this.elements.outIncomeTax,
      this.elements.outVATRetention,
      this.elements.outNetAmount,
    ];

    resultElements.forEach(element => {
      if (element) element.textContent = '-';
    });

    this.currentResult = null;
  }

  /**
   * Displays a result in the interface
   * @param {Object} result - Calculation result
   * @private
   */
  _displayResult(result) {
    this.currentResult = result;

    if (this.elements.outSubtotal) {
      this.elements.outSubtotal.textContent = formatCurrency(result.subtotal);
    }
    if (this.elements.outVAT) {
      this.elements.outVAT.textContent = formatCurrency(result.vat);
    }
    if (this.elements.outIncomeTax) {
      this.elements.outIncomeTax.textContent = formatCurrency(result.incomeTaxWithheld);
    }
    if (this.elements.outVATRetention) {
      this.elements.outVATRetention.textContent = formatCurrency(result.vatRetention);
    }
    if (this.elements.outNetAmount) {
      this.elements.outNetAmount.textContent = formatCurrency(result.netAmount);
    }

    // Add animation class
    const resultContainer = document.querySelector('.results');
    if (resultContainer) {
      resultContainer.classList.add('fade-in');
      setTimeout(() => resultContainer.classList.remove('fade-in'), 300);
    }
  }

  /**
   * Logs a step if enabled
   * @param {string} message - Message to log
   * @private
   */
  _logStep(message) {
    if (this.elements.showSteps?.checked && this.elements.log) {
      this.elements.log.textContent += message + '\n';
    }
  }

  /**
   * Handles calculation from subtotal
   * @private
   */
  _handleCalculateFromSubtotal() {
    try {
      this._clearLog();
      
      const subtotalValue = parseFloat(this.elements.subtotal?.value || 0);
      if (isNaN(subtotalValue) || subtotalValue <= 0) {
        alert(i18n.t('invalidSubtotal'));
        return;
      }

      this._updateCalculatorRates();
      const options = this._getCurrentOptions();
      
      this._logStep(i18n.t('calculationFromSubtotal'));
      const result = this.calculator.calculateFromSubtotal(subtotalValue, options);
      this._displayResult(result);
      
      this._logStep(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error in calculation from subtotal:', error);
      alert(`Error: ${error.message}`);
    }
  }

  /**
   * Handles algebraic calculation from net amount
   * @private
   */
  _handleAlgebraicFromNet() {
    try {
      this._clearLog();
      
      const netValue = parseFloat(this.elements.netAmount?.value || 0);
      if (isNaN(netValue) || netValue <= 0) {
        alert(i18n.t('invalidNetAmount'));
        return;
      }

      this._updateCalculatorRates();
      const options = this._getCurrentOptions();
      
      this._logStep(i18n.t('algebraicFormula'));
      const subtotal = this.calculator.calculateSubtotalFromNetAlgebraic(netValue);
      this._logStep(`${i18n.t('approximateSubtotal')} ${formatCurrency(subtotal)}`);
      
      const result = this.calculator.calculateFromSubtotal(subtotal, options);
      this._displayResult(result);
      
      this._logStep(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error in algebraic calculation:', error);
      alert(`Error: ${error.message}`);
    }
  }

  /**
   * Handles Goal Seek from net amount
   * @private
   */
  _handleGoalSeekFromNet() {
    try {
      this._clearLog();
      
      const netValue = parseFloat(this.elements.netAmount?.value || 0);
      if (isNaN(netValue) || netValue <= 0) {
        alert(i18n.t('invalidNetAmount'));
        return;
      }

      this._updateCalculatorRates();
      const options = this._getCurrentOptions();
      
      this._logStep(i18n.t('startingGoalSeek'));
      const result = this.calculator.goalSeekSubtotal(netValue, options);
      this._displayResult(result);
      
      this._logStep(i18n.t('goalSeekResult'));
      this._logStep(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error in Goal Seek:', error);
      alert(`Error: ${error.message}`);
    }
  }

  /**
   * Handles application reset
   * @private
   */
  _handleReset() {
    this._setupDefaultValues();
    this._clearResults();
    this._clearLog();
  }

  /**
   * Handles JSON copy to clipboard
   * @private
   */
  async _handleCopyJSON() {
    if (!this.currentResult) {
      alert(i18n.t('noResultsToCopy'));
      return;
    }

    try {
      const rates = this._getCurrentRates();
      const jsonData = ExportManager.exportToJSON(this.currentResult, rates);
      const success = await ExportManager.copyToClipboard(jsonData);
      
      if (success) {
        alert(i18n.t('jsonCopied'));
      } else {
        // Fallback: show prompt
        prompt('Copy JSON manually:', jsonData);
      }
    } catch (error) {
      console.error('Error copying JSON:', error);
      alert(`${i18n.t('errorCopying')} ${error.message}`);
    }
  }

  /**
   * Handles CSV download
   * @private
   */
  _handleDownloadCSV() {
    if (!this.currentResult) {
      alert(i18n.t('noResultsToDownload'));
      return;
    }

    try {
      const csvData = ExportManager.exportToCSV(this.currentResult);
      ExportManager.downloadFile(csvData, EXPORT_CONFIG.CSV_FILENAME, 'text/csv');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert(`${i18n.t('errorDownloading')} ${error.message}`);
    }
  }

  /**
   * Clears the log
   * @private
   */
  _clearLog() {
    if (this.elements.log) {
      this.elements.log.textContent = '';
    }
  }

  /**
   * Gets current result
   * @returns {Object|null} Current result or null
   */
  getCurrentResult() {
    return this.currentResult;
  }

  /**
   * Gets calculator
   * @returns {TaxCalculator} Calculator instance
   */
  getCalculator() {
    return this.calculator;
  }
}
