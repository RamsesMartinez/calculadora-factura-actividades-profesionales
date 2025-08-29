/**
 * @fileoverview Utilities for data export
 * @author Ramses Martinez
 * @version 1.0.0
 */

import { EXPORT_CONFIG } from '../config/constants.js';

/**
 * Class for handling tax data exports
 */
export class ExportManager {
  /**
   * Exports results as JSON
   * 
   * @param {Object} calculationResult - Calculation result
   * @param {Object} rates - Used rates
   * @returns {string} Formatted JSON
   */
  static exportToJSON(calculationResult, rates) {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        calculation: {
          subtotal: calculationResult.subtotal,
          vat: calculationResult.vat,
          incomeTaxWithheld: calculationResult.incomeTaxWithheld,
          vatRetention: calculationResult.vatRetention,
          netAmount: calculationResult.netAmount,
          method: calculationResult.calculationMethod,
        },
        rates: rates,
        metadata: {
          version: '1.0.0',
          exportedAt: new Date().toLocaleString('en-US'),
        },
      };
      
      return JSON.stringify(exportData, null, EXPORT_CONFIG.JSON_INDENT);
    } catch (error) {
      throw new Error(`Error exporting JSON: ${error.message}`);
    }
  }

  /**
   * Exports results as CSV
   * 
   * @param {Object} calculationResult - Calculation result
   * @returns {string} Data in CSV format
   */
  static exportToCSV(calculationResult) {
    try {
      const headers = ['Concept', 'Value'];
      const rows = [
        ['Subtotal', calculationResult.subtotal.toFixed(2)],
        ['VAT', calculationResult.vat.toFixed(2)],
        ['Income Tax Withheld', calculationResult.incomeTaxWithheld.toFixed(2)],
        ['VAT Retention', calculationResult.vatRetention.toFixed(2)],
        ['Net Amount', calculationResult.netAmount.toFixed(2)],
      ];
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      return csvContent;
    } catch (error) {
      throw new Error(`Error exporting CSV: ${error.message}`);
    }
  }

  /**
   * Copies text to clipboard
   * 
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} true if copied successfully
   */
  static async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }

  /**
   * Downloads a file
   * 
   * @param {string} content - File content
   * @param {string} filename - File name
   * @param {string} mimeType - File MIME type
   */
  static downloadFile(content, filename, mimeType = 'text/plain') {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      throw new Error(`Error downloading file: ${error.message}`);
    }
  }

  /**
   * Generates a detailed report in text format
   * 
   * @param {Object} calculationResult - Calculation result
   * @param {Object} rates - Used rates
   * @returns {string} Formatted report
   */
  static generateReport(calculationResult, rates) {
    const report = [
      '=== CFDI CALCULATION REPORT ===',
      '',
      `Date: ${new Date().toLocaleString('en-US')}`,
      `Method: ${calculationResult.calculationMethod}`,
      '',
      '--- BREAKDOWN ---',
      `Subtotal: $${calculationResult.subtotal.toFixed(2)}`,
      `VAT (${(rates.vatRate * 100).toFixed(1)}%): $${calculationResult.vat.toFixed(2)}`,
      `Income Tax Withheld (${(rates.incomeTaxRate * 100).toFixed(1)}%): $${calculationResult.incomeTaxWithheld.toFixed(2)}`,
      `VAT Retention (${(rates.vatRetentionFraction * 100).toFixed(2)}%): $${calculationResult.vatRetention.toFixed(2)}`,
      `Net Amount: $${calculationResult.netAmount.toFixed(2)}`,
      '',
      '--- USED RATES ---',
      `VAT: ${(rates.vatRate * 100).toFixed(1)}%`,
      `Income Tax Withheld: ${(rates.incomeTaxRate * 100).toFixed(1)}%`,
      `VAT Retention Fraction: ${(rates.vatRetentionFraction * 100).toFixed(2)}%`,
      '',
      '=== END OF REPORT ===',
    ].join('\n');
    
    return report;
  }
}
