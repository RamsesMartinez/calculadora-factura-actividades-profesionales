/**
 * @fileoverview Centralized application configuration
 * @author Ramses Martinez
 * @version 1.0.0
 */

/**
 * Default tax rates configuration
 * @type {Object}
 */
export const DEFAULT_TAX_RATES = {
  VAT_RATE: 0.16,           // 16% VAT
  INCOME_TAX_RATE: 0.10,    // 10% Income Tax withheld
  VAT_RETENTION_FRACTION: 0.6666666667, // 2/3 for VAT retention
};

/**
 * Decimal precision configuration
 * @type {Object}
 */
export const PRECISION_CONFIG = {
  DECIMAL_PLACES: 2,
  EPSILON: Number.EPSILON,
};

/**
 * Application configuration
 * @type {Object}
 */
export const APP_CONFIG = {
  NAME: 'CFDI Calculator',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional calculator for CFDI invoice breakdown with VAT and withholdings',
  AUTHOR: 'Ramses Martinez',
  EMAIL: 'ramses.mtz96@gmail.com',
};

/**
 * Goal Seek configuration
 * @type {Object}
 */
export const GOAL_SEEK_CONFIG = {
  MAX_ITERATIONS: 80,
  TOLERANCE: 0.0005,
  SEARCH_RANGE_MULTIPLIER: 2000,
  MAX_ATTEMPTS: 40,
};

/**
 * Error messages (now handled by i18n system)
 * @type {Object}
 * @deprecated Use i18n.t() instead
 */
export const ERROR_MESSAGES = {
  INVALID_NET_AMOUNT: 'invalidNetAmount', // Key for i18n
  INVALID_SUBTOTAL: 'invalidSubtotal', // Key for i18n
  CALCULATION_ERROR: 'calculationError', // Key for i18n
  GOAL_SEEK_TIMEOUT: 'goalSeekTimeout', // Key for i18n
  INVALID_PERCENTAGE: 'invalidPercentage', // Key for i18n
  DENOMINATOR_TOO_SMALL: 'denominatorTooSmall', // Key for i18n
};

/**
 * Export configuration
 * @type {Object}
 */
export const EXPORT_CONFIG = {
  CSV_FILENAME: 'invoice_breakdown.csv',
  JSON_INDENT: 2,
};
