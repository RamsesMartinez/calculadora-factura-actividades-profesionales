/**
 * @fileoverview Tax calculation engine for CFDI
 * @author Ramses Martinez
 * @version 1.0.0
 */

import { round2, validatePositiveNumber, calculatePercentage } from './mathUtils.js';
import { GOAL_SEEK_CONFIG, ERROR_MESSAGES } from '../config/constants.js';
import { i18n } from './i18n.js';

/**
 * Main class for CFDI tax calculations
 */
export class TaxCalculator {
  /**
   * Tax calculator constructor
   * 
   * @param {Object} rates - Tax rates
   * @param {number} rates.vatRate - VAT rate (0-1)
   * @param {number} rates.incomeTaxRate - Income tax withheld rate (0-1)
   * @param {number} rates.vatRetentionFraction - VAT retention fraction (0-1)
   */
  constructor(rates = {}) {
    this.rates = {
      vatRate: rates.vatRate || 0.16,
      incomeTaxRate: rates.incomeTaxRate || 0.10,
      vatRetentionFraction: rates.vatRetentionFraction || 0.6666666667,
    };
  }

  /**
   * Calculates complete breakdown from subtotal
   * 
   * @param {number} subtotal - Invoice subtotal
   * @param {Object} options - Calculation options
   * @param {boolean} options.roundPerLine - Whether to round taxes per line
   * @returns {Object} Object with complete breakdown
   */
  calculateFromSubtotal(subtotal, options = { roundPerLine: true }) {
    try {
      validatePositiveNumber(subtotal, 'Subtotal');
      
      const { vatRate, incomeTaxRate, vatRetentionFraction } = this.rates;
      
      // High precision internal calculations
      const vatRaw = calculatePercentage(subtotal, vatRate);
      const incomeTaxWithheldRaw = calculatePercentage(subtotal, incomeTaxRate);
      const vatRetentionRaw = calculatePercentage(vatRaw, vatRetentionFraction);
      
      // Apply line rounding if requested
      const vat = options.roundPerLine ? round2(vatRaw) : vatRaw;
      const incomeTaxWithheld = options.roundPerLine ? round2(incomeTaxWithheldRaw) : incomeTaxWithheldRaw;
      const vatRetention = options.roundPerLine ? round2(vatRetentionRaw) : vatRetentionRaw;
      
      // Calculate final net amount
      const netAmount = subtotal + vat - incomeTaxWithheld - vatRetention;
      
      return {
        subtotal: subtotal,
        vatRaw: vatRaw,
        incomeTaxWithheldRaw: incomeTaxWithheldRaw,
        vatRetentionRaw: vatRetentionRaw,
        vat: vat,
        incomeTaxWithheld: incomeTaxWithheld,
        vatRetention: vatRetention,
        netAmount: round2(netAmount),
        calculationMethod: 'fromSubtotal',
        options: options,
      };
    } catch (error) {
      throw new Error(`Error in calculation from subtotal: ${error.message}`);
    }
  }

  /**
   * Calculates subtotal using direct algebraic formula
   * 
   * @param {number} netAmount - Target net amount
   * @returns {number} Calculated subtotal
   */
  calculateSubtotalFromNetAlgebraic(netAmount) {
    try {
      validatePositiveNumber(netAmount, 'Net amount');
      
      const { vatRate, incomeTaxRate, vatRetentionFraction } = this.rates;
      
      // Formula: s = N / (1 + vat - incomeTax - vat * vatRetentionFraction)
      const denominator = 1 + vatRate - incomeTaxRate - (vatRate * vatRetentionFraction);
      
      if (Math.abs(denominator) < 0.000001) {
        throw new Error(i18n.t('denominatorTooSmall'));
      }
      
      return netAmount / denominator;
    } catch (error) {
      throw new Error(`Error in algebraic calculation: ${error.message}`);
    }
  }

  /**
   * Goal Seek: Finds subtotal that produces target net amount
   * 
   * @param {number} targetNetAmount - Target net amount
   * @param {Object} options - Calculation options
   * @returns {Object} Goal Seek result
   */
  goalSeekSubtotal(targetNetAmount, options = { roundPerLine: true }) {
    try {
      validatePositiveNumber(targetNetAmount, 'Target net amount');
      
      // First approximation using algebraic formula
      const initialGuess = this.calculateSubtotalFromNetAlgebraic(targetNetAmount);
      
      // Define search limits
      let low = Math.max(0, initialGuess - GOAL_SEEK_CONFIG.SEARCH_RANGE_MULTIPLIER);
      let high = initialGuess + GOAL_SEEK_CONFIG.SEARCH_RANGE_MULTIPLIER;
      
      // Function to calculate net amount given a subtotal
      const calculateNetForSubtotal = (subtotal) => {
        return this.calculateFromSubtotal(subtotal, options).netAmount;
      };
      
      // Ensure limits produce different net amounts than target
      let attempts = 0;
      let nLow = calculateNetForSubtotal(low);
      let nHigh = calculateNetForSubtotal(high);
      
      while (
        (nLow > targetNetAmount && nHigh > targetNetAmount) || 
        (nLow < targetNetAmount && nHigh < targetNetAmount)
      ) {
        attempts++;
        if (attempts > GOAL_SEEK_CONFIG.MAX_ATTEMPTS) {
          throw new Error(i18n.t('goalSeekTimeout'));
        }
        
        low = Math.max(0, low - (GOAL_SEEK_CONFIG.SEARCH_RANGE_MULTIPLIER * attempts));
        high = high + (GOAL_SEEK_CONFIG.SEARCH_RANGE_MULTIPLIER * attempts);
        nLow = calculateNetForSubtotal(low);
        nHigh = calculateNetForSubtotal(high);
      }
      
      // Binary search
      let bestResult = null;
      let lo = low;
      let hi = high;
      
      for (let i = 0; i < GOAL_SEEK_CONFIG.MAX_ITERATIONS; i++) {
        const mid = (lo + hi) / 2;
        const result = this.calculateFromSubtotal(mid, options);
        const currentNet = result.netAmount;
        
        // Save best result found
        if (!bestResult || Math.abs(currentNet - targetNetAmount) < Math.abs(bestResult.netAmount - targetNetAmount)) {
          bestResult = result;
        }
        
        // Check if we're close enough
        if (Math.abs(currentNet - targetNetAmount) < GOAL_SEEK_CONFIG.TOLERANCE) {
          break;
        }
        
        // Decide search direction
        if (currentNet > targetNetAmount) {
          hi = mid;
        } else {
          lo = mid;
        }
      }
      
      // Final adjustment: round subtotal to 2 decimal places
      bestResult.subtotal = round2(bestResult.subtotal);
      bestResult = this.calculateFromSubtotal(bestResult.subtotal, options);
      bestResult.calculationMethod = 'goalSeek';
      
      return bestResult;
    } catch (error) {
      throw new Error(`Error in Goal Seek: ${error.message}`);
    }
  }

  /**
   * Updates tax rates
   * 
   * @param {Object} newRates - New rates
   */
  updateRates(newRates) {
    if (newRates.vatRate !== undefined) {
      this.rates.vatRate = newRates.vatRate;
    }
    if (newRates.incomeTaxRate !== undefined) {
      this.rates.incomeTaxRate = newRates.incomeTaxRate;
    }
    if (newRates.vatRetentionFraction !== undefined) {
      this.rates.vatRetentionFraction = newRates.vatRetentionFraction;
    }
  }

  /**
   * Gets current rates
   * 
   * @returns {Object} Current rates
   */
  getRates() {
    return { ...this.rates };
  }
}
