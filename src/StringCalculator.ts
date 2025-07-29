/**
 * A modular class that provides functionality to add numbers represented as strings
 * with support for custom delimiters and various input formats.
 * 
 * Features:
 * - Empty string handling (returns 0)
 * - Single and multiple number addition
 * - Custom delimiter support with //delimiter\n format
 * - Multi-character delimiters with [delimiter] notation
 * - Multiple delimiters with [delim1][delim2] notation
 * - Negative number validation with comprehensive error messages
 * - Number filtering (ignores numbers > 1000)
 */
export class StringCalculator {
    
    // Constants for configuration
    private static readonly DEFAULT_DELIMITER_PATTERN = /[,\n]/;
    private static readonly CUSTOM_DELIMITER_PREFIX = '//';
    private static readonly MAX_VALID_NUMBER = 1000;
    private static readonly NEGATIVE_ERROR_MESSAGE = 'Negative numbers not allowed';

    /**
     * Main entry point for adding numbers from a string input
     * @param numbers - String containing numbers separated by delimiters
     * @returns Sum of the valid numbers
     * @throws Error if negative numbers are provided
     */
    add(numbers: string): number {
        // Handle empty string case
        if (this.isEmptyInput(numbers)) {
            return 0;
        }

        // Parse delimiter configuration and extract numbers
        const delimiterConfig = this.parseDelimiterConfiguration(numbers);
        const numbersArray = this.extractNumbers(delimiterConfig);
        
        // Validate numbers and handle business rules
        const validationResult = this.validateNumbers(numbersArray);
        this.handleNegativeNumbers(validationResult.negativeNumbers);
        
        // Calculate and return sum
        return this.calculateSum(validationResult.validNumbers);
    }

    /**
     * Checks if the input string is empty
     * @param input - Input string to check
     * @returns True if input is empty, false otherwise
     */
    private isEmptyInput(input: string): boolean {
        return input === '';
    }

    /**
     * Parses the input string to determine delimiter configuration
     * Handles both default delimiters (comma, newline) and custom delimiters
     * @param numbers - Input string containing delimiter configuration and numbers
     * @returns DelimiterConfig object with regex pattern and number string
     */
    private parseDelimiterConfiguration(numbers: string): DelimiterConfig {
        if (!this.hasCustomDelimiter(numbers)) {
            return {
                pattern: StringCalculator.DEFAULT_DELIMITER_PATTERN,
                numberString: numbers
            };
        }

        return this.parseCustomDelimiterConfiguration(numbers);
    }

    /**
     * Checks if the input contains custom delimiter configuration
     * @param numbers - Input string to check
     * @returns True if custom delimiter is present, false otherwise
     */
    private hasCustomDelimiter(numbers: string): boolean {
        return numbers.startsWith(StringCalculator.CUSTOM_DELIMITER_PREFIX);
    }

    /**
     * Parses custom delimiter configuration from input string
     * Supports single delimiters, multi-character delimiters, and multiple delimiters
     * @param numbers - Input string with custom delimiter configuration
     * @returns DelimiterConfig object with custom regex pattern and number string
     */
    private parseCustomDelimiterConfiguration(numbers: string): DelimiterConfig {
        const delimiterLineEnd = numbers.indexOf('\n');
        const delimiterPart = numbers.substring(2, delimiterLineEnd);
        const numberString = numbers.substring(delimiterLineEnd + 1);

        const customDelimiters = this.extractCustomDelimiters(delimiterPart);
        const delimiterPattern = this.buildDelimiterPattern(customDelimiters);

        return {
            pattern: delimiterPattern,
            numberString
        };
    }

    /**
     * Extracts custom delimiters from delimiter definition part
     * Handles both bracket notation [delimiter] and simple delimiter format
     * @param delimiterPart - String containing delimiter definitions
     * @returns Array of delimiter strings
     */
    private extractCustomDelimiters(delimiterPart: string): string[] {
        if (this.hasBracketNotation(delimiterPart)) {
            return this.parseMultipleDelimiters(delimiterPart);
        }
        
        return this.parseSingleDelimiter(delimiterPart);
    }

    /**
     * Checks if delimiter part uses bracket notation for multiple/multi-character delimiters
     * @param delimiterPart - Delimiter definition string
     * @returns True if bracket notation is used, false otherwise
     */
    private hasBracketNotation(delimiterPart: string): boolean {
        return delimiterPart.includes('[') && delimiterPart.includes(']');
    }

    /**
     * Parses multiple delimiters from bracket notation format [delim1][delim2]...
     * @param delimiterPart - String containing bracketed delimiter definitions
     * @returns Array of extracted delimiter strings
     */
    private parseMultipleDelimiters(delimiterPart: string): string[] {
        const delimiters: string[] = [];
        let currentIndex = 0;

        while (currentIndex < delimiterPart.length) {
            const bracketPair = this.findNextBracketPair(delimiterPart, currentIndex);
            
            if (!bracketPair) {
                break;
            }

            const delimiter = this.extractDelimiterFromBrackets(delimiterPart, bracketPair);
            if (this.isValidDelimiter(delimiter)) {
                delimiters.push(delimiter);
            }

            currentIndex = bracketPair.endIndex + 1;
        }

        return delimiters;
    }

    /**
     * Finds the next pair of square brackets in the delimiter part
     * @param delimiterPart - String to search in
     * @param startIndex - Index to start searching from
     * @returns Object with start and end bracket indices, or null if not found
     */
    private findNextBracketPair(delimiterPart: string, startIndex: number): { startIndex: number; endIndex: number } | null {
        const startBracket = delimiterPart.indexOf('[', startIndex);
        if (startBracket === -1) {
            return null;
        }

        const endBracket = delimiterPart.indexOf(']', startBracket);
        if (endBracket === -1) {
            return null;
        }

        return { startIndex: startBracket, endIndex: endBracket };
    }

    /**
     * Extracts delimiter content from between square brackets
     * @param delimiterPart - Full delimiter definition string
     * @param bracketPair - Object containing bracket positions
     * @returns Delimiter string between the brackets
     */
    private extractDelimiterFromBrackets(delimiterPart: string, bracketPair: { startIndex: number; endIndex: number }): string {
        return delimiterPart.substring(bracketPair.startIndex + 1, bracketPair.endIndex);
    }

    /**
     * Validates that a delimiter is not empty
     * @param delimiter - Delimiter string to validate
     * @returns True if delimiter is valid (non-empty), false otherwise
     */
    private isValidDelimiter(delimiter: string): boolean {
        return delimiter.length > 0;
    }

    /**
     * Parses a single delimiter (non-bracket notation)
     * @param delimiterPart - Single delimiter string
     * @returns Array containing the single delimiter
     */
    private parseSingleDelimiter(delimiterPart: string): string[] {
        return [delimiterPart];
    }

    /**
     * Builds a regex pattern from custom delimiters
     * Sorts delimiters by length (longest first) to prevent substring matching issues
     * @param customDelimiters - Array of custom delimiter strings
     * @returns RegExp pattern that matches any of the delimiters or default delimiters
     */
    private buildDelimiterPattern(customDelimiters: string[]): RegExp {
        // Sort by length (descending) to ensure longer delimiters match first
        const sortedDelimiters = this.sortDelimitersByLength(customDelimiters);
        const escapedDelimiters = this.escapeDelimiters(sortedDelimiters);
        
        return new RegExp(`${escapedDelimiters.join('|')}|[,\n]`, 'g');
    }

    /**
     * Sorts delimiters by length in descending order
     * This prevents shorter delimiters from matching parts of longer ones
     * @param delimiters - Array of delimiter strings
     * @returns Sorted array of delimiters (longest first)
     */
    private sortDelimitersByLength(delimiters: string[]): string[] {
        return delimiters.sort((a, b) => b.length - a.length);
    }

    /**
     * Escapes special regex characters in delimiter strings
     * @param delimiters - Array of delimiter strings to escape
     * @returns Array of escaped delimiter strings safe for regex use
     */
    private escapeDelimiters(delimiters: string[]): string[] {
        return delimiters.map(delimiter => this.escapeRegExp(delimiter));
    }

    /**
     * Escapes special regex characters in a single string
     * @param string - String to escape
     * @returns Escaped string safe for use in regex patterns
     */
    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Extracts and converts string parts to numbers using the delimiter configuration
     * @param delimiterConfig - Configuration containing regex pattern and number string
     * @returns Array of parsed numbers (NaN values filtered out)
     */
    private extractNumbers(delimiterConfig: DelimiterConfig): number[] {
        const parts = this.splitNumberString(delimiterConfig);
        const cleanParts = this.filterEmptyParts(parts);
        const numbers = this.convertToNumbers(cleanParts);
        
        return this.filterValidNumbers(numbers);
    }

    /**
     * Splits the number string using the delimiter pattern
     * @param delimiterConfig - Configuration with pattern and string
     * @returns Array of string parts
     */
    private splitNumberString(delimiterConfig: DelimiterConfig): string[] {
        return delimiterConfig.numberString.split(delimiterConfig.pattern);
    }

    /**
     * Filters out empty string parts from the split result
     * @param parts - Array of string parts
     * @returns Array with empty strings removed
     */
    private filterEmptyParts(parts: string[]): string[] {
        return parts.filter(part => part !== '');
    }

    /**
     * Converts string parts to numbers using parseInt
     * @param parts - Array of string parts
     * @returns Array of numbers (may contain NaN values)
     */
    private convertToNumbers(parts: string[]): number[] {
        return parts.map(part => parseInt(part, 10));
    }

    /**
     * Filters out NaN values from the numbers array
     * @param numbers - Array of numbers potentially containing NaN
     * @returns Array of valid numbers only
     */
    private filterValidNumbers(numbers: number[]): number[] {
        return numbers.filter(num => !isNaN(num));
    }

    /**
     * Validates numbers according to business rules
     * Separates negative numbers and filters numbers greater than maximum allowed
     * @param numbers - Array of numbers to validate
     * @returns ValidationResult with valid numbers and negative numbers separated
     */
    private validateNumbers(numbers: number[]): ValidationResult {
        const negativeNumbers = this.findNegativeNumbers(numbers);
        const validNumbers = this.filterByMaxValue(numbers);

        return { validNumbers, negativeNumbers };
    }

    /**
     * Finds all negative numbers in the array
     * @param numbers - Array of numbers to check
     * @returns Array of negative numbers
     */
    private findNegativeNumbers(numbers: number[]): number[] {
        return numbers.filter(num => num < 0);
    }

    /**
     * Filters numbers to exclude those greater than the maximum allowed value
     * @param numbers - Array of numbers to filter
     * @returns Array of numbers within the valid range
     */
    private filterByMaxValue(numbers: number[]): number[] {
        return numbers.filter(num => num <= StringCalculator.MAX_VALID_NUMBER);
    }

    /**
     * Handles negative numbers by throwing an error if any are found
     * @param negativeNumbers - Array of negative numbers
     * @throws Error with message containing all negative numbers
     */
    private handleNegativeNumbers(negativeNumbers: number[]): void {
        if (negativeNumbers.length > 0) {
            const negativeList = negativeNumbers.join(',');
            throw new Error(`${StringCalculator.NEGATIVE_ERROR_MESSAGE} ${negativeList}`);
        }
    }

    /**
     * Calculates the sum of valid numbers
     * @param validNumbers - Array of numbers to sum
     * @returns Sum of all numbers in the array
     */
    private calculateSum(validNumbers: number[]): number {
        return validNumbers.reduce((sum, num) => sum + num, 0);
    }
}