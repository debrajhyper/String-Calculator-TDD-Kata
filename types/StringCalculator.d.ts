/**
 * Interface defining the structure for delimiter parsing configuration
 */
interface DelimiterConfig {
    pattern: RegExp;
    numberString: string;
}

/**
 * Interface for number validation results
 */
interface ValidationResult {
    validNumbers: number[];
    negativeNumbers: number[];
}