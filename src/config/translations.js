/**
 * @fileoverview Internationalization translations
 * @author Ramses Martinez
 * @version 1.0.0
 */

/**
 * Translation keys for the application
 */
export const TRANSLATIONS = {
  en: {
    // Page metadata
    pageTitle: 'CFDI Calculator - Net ⇄ Subtotal (VAT + Withholdings)',
    pageDescription: 'Professional calculator for CFDI invoice breakdown with VAT and withholdings',
    
    // Header
    headerTitle: 'CFDI Calculator — Net ⇄ Subtotal (VAT + Withholdings)',
    headerDescription: 'Calculate subtotal and breakdown for invoices with 16% VAT, 10% Income Tax withheld and 2/3 VAT Retention (10.666...%). Includes algebraic mode and line rounding method (Goal Seek).',
    
    // Form sections
    parametersTitle: 'Parameters',
    resultsTitle: 'Result',
    quickNotesTitle: 'Quick notes',
    
    // Form labels
    netAmountLabel: 'Net amount received',
    netAmountHelp: 'Amount that was deposited to you (already with withholdings applied).',
    subtotalLabel: 'Subtotal (optional)',
    subtotalHelp: 'If you want to calculate from a known subtotal, enter it and press "Calculate from Subtotal".',
    ratesLabel: 'Rates (you can adjust)',
    ratesHelp: 'VAT, Income Tax withheld, and VAT retention fraction (2/3 = 0.66666...)',
    calculationOptionsLabel: 'Calculation options',
    
    // Checkbox options
    highPrecisionOption: 'Maintain high internal precision',
    roundPerLineOption: 'Round taxes per line to 2 decimal places (simulate invoicing software)',
    showStepsOption: 'Show detailed steps (console)',
    
    // Buttons
    calculateFromSubtotalBtn: 'Calculate from Subtotal',
    calculateSubtotalDirectBtn: 'Calculate Subtotal (Direct formula)',
    goalSeekBtn: 'Goal Seek (respects rounding)',
    resetBtn: 'Reset',
    copyJsonBtn: 'Copy JSON',
    downloadCsvBtn: 'Download CSV',
    
    // Results
    subtotalResult: 'Subtotal',
    vatChargedResult: 'VAT charged',
    incomeTaxWithheldResult: 'Income Tax withheld',
    vatRetentionResult: 'VAT Retention (2/3)',
    calculatedNetResult: 'Calculated net',
    
    // Notes
    calculationNote: 'Note: "Direct formula" uses the algebraic equation without intermediate rounding. "Goal Seek" adjusts the subtotal until the calculated net amount (with rounding) matches the target net amount.',
    
    // Quick notes
    quickNote1: 'Invoicing software usually rounds each tax to 2 decimal places per line; that\'s why the difference with the continuous formula.',
    quickNote2: 'The algebraic formula is useful as a first approximation. Goal Seek/Seeker corrects the subtotal so the net amount balances exactly when applying rounding.',
    quickNote3: 'You can adjust the rates at the top if rules change or if you work with a different withholding percentage.',
    
    // Footer
    developedBy: 'Developed with ❤️ by',
    freeToolNote: 'Free tool for professionals. We do not guarantee the accuracy of calculations.',
    
    // Language selector
    languageLabel: 'Language',
    englishOption: 'English',
    spanishOption: 'Spanish',
    
    // Error messages
    invalidNetAmount: 'Please enter a valid net amount greater than 0',
    invalidSubtotal: 'Please enter a valid subtotal greater than 0',
    calculationError: 'Calculation error. Please verify the entered data.',
    goalSeekTimeout: 'Could not find an exact solution. Try with different values.',
    invalidPercentage: 'Percentage must be between 0 and 1',
    denominatorTooSmall: 'Denominator too close to zero. Please verify the rates.',
    noResultsToCopy: 'No results to copy',
    noResultsToDownload: 'No results to download',
    jsonCopied: 'JSON copied to clipboard',
    errorCopying: 'Error copying:',
    errorDownloading: 'Error downloading:',
    
    // Log messages
    stepsWillAppear: 'Steps will appear here if you check "Show detailed steps".',
    calculationFromSubtotal: 'Calculation from subtotal (direct).',
    algebraicFormula: 'Algebraic formula (without intermediate rounding)',
    approximateSubtotal: 'Approximate subtotal:',
    startingGoalSeek: 'Starting Goal Seek (binary search) respecting line rounding...',
    goalSeekResult: 'Goal Seek result:',
    
    // Browser compatibility
    browserNotCompatible: 'Browser not compatible',
    browserNotCompatibleDesc: 'This application requires a modern browser with ES6 module support.',
    browserNotCompatibleHelp: 'Please update your browser or use Chrome, Firefox, Safari or Edge.',
    
    // Placeholders
    netAmountPlaceholder: 'e.g. 9280.00',
    subtotalPlaceholder: 'e.g. 10000.00',
    vatPlaceholder: 'VAT',
    incomeTaxPlaceholder: 'Income Tax',
    vatRetPlaceholder: 'VAT Ret',
    
    // Log details
    viewStepsLog: 'View steps / log'
  },
  
  es: {
    // Page metadata
    pageTitle: 'Calculadora CFDI - Neto ⇄ Subtotal (IVA + Retenciones)',
    pageDescription: 'Calculadora profesional para desglose de facturas CFDI con IVA y retenciones',
    
    // Header
    headerTitle: 'Calculadora CFDI — Neto ⇄ Subtotal (IVA + Retenciones)',
    headerDescription: 'Calcula subtotal y desglose para facturas con IVA 16%, ISR retenido 10% y Retención IVA 2/3 (10.666...%). Incluye modo algebraico y método con redondeo por línea (Goal Seek).',
    
    // Form sections
    parametersTitle: 'Parámetros',
    resultsTitle: 'Resultado',
    quickNotesTitle: 'Notas rápidas',
    
    // Form labels
    netAmountLabel: 'Neto recibido',
    netAmountHelp: 'Monto que te depositaron (ya con retenciones aplicadas).',
    subtotalLabel: 'Subtotal (opcional)',
    subtotalHelp: 'Si quieres calcular a partir de un subtotal conocido, introdúcelo y presiona "Calcular desde Subtotal".',
    ratesLabel: 'Tasas (puedes ajustar)',
    ratesHelp: 'IVA, ISR retenido, y fracción de retención de IVA (2/3 = 0.66666...)',
    calculationOptionsLabel: 'Opciones de cálculo',
    
    // Checkbox options
    highPrecisionOption: 'Mantener alta precisión interna',
    roundPerLineOption: 'Redondear impuestos por línea a 2 decimales (simular facturador)',
    showStepsOption: 'Mostrar pasos detallados (consola)',
    
    // Buttons
    calculateFromSubtotalBtn: 'Calcular desde Subtotal',
    calculateSubtotalDirectBtn: 'Calcular Subtotal (Fórmula directa)',
    goalSeekBtn: 'Goal Seek (respeta redondeos)',
    resetBtn: 'Reset',
    copyJsonBtn: 'Copiar JSON',
    downloadCsvBtn: 'Descargar CSV',
    
    // Results
    subtotalResult: 'Subtotal',
    vatChargedResult: 'IVA trasladado',
    incomeTaxWithheldResult: 'Retención ISR',
    vatRetentionResult: 'Retención IVA (2/3)',
    calculatedNetResult: 'Neto calculado',
    
    // Notes
    calculationNote: 'Nota: "Fórmula directa" usa la ecuación algebraica sin redondeos intermedios. "Goal Seek" ajusta el subtotal hasta que el neto calculado (con redondeos) coincida con el neto objetivo.',
    
    // Quick notes
    quickNote1: 'Los facturadores suelen redondear cada impuesto a 2 decimales por línea; por eso la diferencia con la fórmula continua.',
    quickNote2: 'La fórmula algebraica es útil como primera aproximación. El Goal Seek/Buscador corrige el subtotal para que el neto cuadre exactamente al aplicar redondeos.',
    quickNote3: 'Puedes ajustar las tasas en la parte superior si cambian reglas o si trabajas con otro % de retención.',
    
    // Footer
    developedBy: 'Desarrollado con ❤️ por',
    freeToolNote: 'Herramienta gratuita para profesionales. No garantizamos la exactitud de los cálculos.',
    
    // Language selector
    languageLabel: 'Idioma',
    englishOption: 'Inglés',
    spanishOption: 'Español',
    
    // Error messages
    invalidNetAmount: 'Introduce un neto válido mayor a 0',
    invalidSubtotal: 'Introduce un subtotal válido mayor a 0',
    calculationError: 'Error en el cálculo. Verifica los datos ingresados.',
    goalSeekTimeout: 'No se pudo encontrar una solución exacta. Intenta con otros valores.',
    invalidPercentage: 'Porcentaje debe estar entre 0 y 1',
    denominatorTooSmall: 'Denominador muy cercano a cero. Verifica las tasas.',
    noResultsToCopy: 'No hay resultados para copiar',
    noResultsToDownload: 'No hay resultados para descargar',
    jsonCopied: 'JSON copiado al portapapeles',
    errorCopying: 'Error al copiar:',
    errorDownloading: 'Error al descargar:',
    
    // Log messages
    stepsWillAppear: 'Aquí aparecerán los pasos si marcas "Mostrar pasos detallados".',
    calculationFromSubtotal: 'Cálculo desde subtotal (directo).',
    algebraicFormula: 'Fórmula algebraica (sin redondeos intermedios)',
    approximateSubtotal: 'Subtotal aproximado:',
    startingGoalSeek: 'Iniciando Goal Seek (búsqueda binaria) respetando redondeos por línea...',
    goalSeekResult: 'Resultado Goal Seek:',
    
    // Browser compatibility
    browserNotCompatible: 'Navegador no compatible',
    browserNotCompatibleDesc: 'Esta aplicación requiere un navegador moderno con soporte para módulos ES6.',
    browserNotCompatibleHelp: 'Por favor, actualiza tu navegador o usa Chrome, Firefox, Safari o Edge.',
    
    // Placeholders
    netAmountPlaceholder: 'Ej: 9280.00',
    subtotalPlaceholder: 'Ej: 10000.00',
    vatPlaceholder: 'IVA',
    incomeTaxPlaceholder: 'ISR',
    vatRetPlaceholder: 'Ret IVA',
    
    // Log details
    viewStepsLog: 'Ver pasos / log'
  }
};

/**
 * Default language
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = ['en', 'es'];

/**
 * Language names for display
 */
export const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español'
};
