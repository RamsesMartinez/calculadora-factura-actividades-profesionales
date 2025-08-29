/**
 * @fileoverview Mathematical utilities for tax calculations
 * @author Ramses Martinez
 * @version 1.0.0
 */

import { PRECISION_CONFIG } from '../config/constants.js';

/**
 * Rounds a number to 2 decimal places using ROUND_HALF_UP method
 * Avoids floating point errors using Number.EPSILON
 * 
 * @param {number} value - Value to round
 * @returns {number} Value rounded to 2 decimal places
 * 
 * @example
 * round2(3.14159) // returns 3.14
 * round2(3.145)   // returns 3.15
 */
export function round2(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('round2: Value must be a valid number');
  }
  
  return Math.round((value + PRECISION_CONFIG.EPSILON) * 100) / 100;
}

/**
 * Validates that a value is a positive number
 * 
 * @param {number} value - Value to validate
 * @param {string} fieldName - Field name for error messages
 * @returns {boolean} true if valid
 * @throws {Error} If value is not valid
 */
export function validatePositiveNumber(value, fieldName = 'value') {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    throw new Error(`${fieldName}: Must be a valid number`);
  }
  
  if (numValue <= 0) {
    throw new Error(`${fieldName}: Must be greater than 0`);
  }
  
  return true;
}

/**
 * Calculates the percentage of a value
 * 
 * @param {number} value - Base value
 * @param {number} percentage - Percentage (0-1)
 * @returns {number} Calculation result
 */
export function calculatePercentage(value, percentage) {
  validatePositiveNumber(value, 'Base value');
  
  if (percentage < 0 || percentage > 1) {
    throw new Error('Percentage must be between 0 and 1');
  }
  
  return value * percentage;
}

/**
 * Formats a number as Mexican currency
 * 
 * @param {number} value - Value to format
 * @returns {string} Value formatted as currency
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number with thousand separators
 * 
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted value
 */
export function formatNumber(value, decimals = 2) {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
