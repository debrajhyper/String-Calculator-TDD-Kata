// Import the class to test
import { StringCalculator } from '../src/StringCalculator';

// Test suite for StringCalculator functionality
describe('StringCalculator', () => {
    let calculator: StringCalculator;

    // Create fresh instance before each test
    beforeEach(() => {
        calculator = new StringCalculator();
    });

    // Test for empty string input
    test('should return 0 for empty string', () => {
        expect(calculator.add('')).toBe(0);
    });

    // Test for single number input
    test('should return the number itself for single number', () => {
        expect(calculator.add('1')).toBe(1);
        expect(calculator.add('5')).toBe(5);
    });

    // Test for two comma-separated numbers
    test('should return sum of two comma-separated numbers', () => {
        expect(calculator.add('1,2')).toBe(3);
        expect(calculator.add('1,5')).toBe(6);
    });

    // Test for multiple numbers
    test('should handle any amount of numbers', () => {
        expect(calculator.add('1,2,3')).toBe(6);
        expect(calculator.add('1,2,3,4,5')).toBe(15);
    });

    // Test for new lines between numbers
    test('should handle new lines between numbers', () => {
        expect(calculator.add('1\n2,3')).toBe(6);
        expect(calculator.add('1\n2\n3')).toBe(6);
    });

    // Test for custom delimiters
    test('should support custom delimiters', () => {
        expect(calculator.add('//;\n1;2')).toBe(3);
        expect(calculator.add('//|\n1|2|3')).toBe(6);
        expect(calculator.add('//-\n1-2-3')).toBe(6);
        expect(calculator.add('//;\n1;2\n3')).toBe(6);
        expect(calculator.add('//;\n1;2\n3;4;5')).toBe(15);
        expect(calculator.add('//;\n1;2\n3;4\n5')).toBe(15);
        expect(calculator.add('//;\n1;2\n3;4\n5;6;7;8;9;10')).toBe(55);
        expect(calculator.add('//;\n1;2\n3;4\n5;6;7;8;9\n10')).toBe(55);
        expect(calculator.add('//;\n1;2\n3;4\n5;6;7;8\n9\n10')).toBe(55);
        expect(calculator.add('//;\n1;2\n3;4\n5;6;7\n8\n9\n10')).toBe(55);
        expect(calculator.add('//;\n1;2\n3;4\n5;6\n7\n8\n9\n10')).toBe(55);
        expect(calculator.add('//;\n1;2\n3;4\n5\n6\n7\n8\n9\n10')).toBe(55);
    });

    // Test for negative numbers
    test('should throw exception for negative numbers', () => {
        expect(() => calculator.add('-1')).toThrow('Negative numbers not allowed -1');
        expect(() => calculator.add('1,-2')).toThrow('Negative numbers not allowed -2');
        expect(() => calculator.add('1\n-2')).toThrow('Negative numbers not allowed -2');
    });

    // Test for multiple negative numbers
    test('should show all negative numbers in exception', () => {
        expect(() => calculator.add('-1,-2,-3')).toThrow('Negative numbers not allowed -1,-2,-3');
        expect(() => calculator.add('1,-2,-3')).toThrow('Negative numbers not allowed -2,-3');
        expect(() => calculator.add('1\n-2\n-3')).toThrow('Negative numbers not allowed -2,-3');
    });

    // Test for numbers bigger than 1000
    test('should ignore numbers bigger than 1000', () => {
        expect(calculator.add('1001')).toBe(0);
        expect(calculator.add('2,1001')).toBe(2);
        expect(calculator.add('1000,1001,2')).toBe(1002);
        expect(calculator.add('1000\n1001\n2')).toBe(1002);
        expect(calculator.add('//;\n1000;1001;2')).toBe(1002);
    });

    // Test multi-character delimiters using [delimiter] format
    test('should support multi-character delimiters', () => {
        // Test with *** as delimiter
        expect(calculator.add('//[***]\n1***2***3')).toBe(6);
        // Test with 'abc' as delimiter
        expect(calculator.add('//[abc]\n1abc2abc3')).toBe(6);
        // Test with complex delimiter containing alphabets and numbers
        expect(calculator.add('//[a1b2c3]\n1a1b2c32a1b2c33')).toBe(6);
    });

    // Test multiple single-character delimiters
    test('should support multiple delimiters', () => {
        // Test with * and % delimiters
        expect(calculator.add('//[*][%]\n1*2%3')).toBe(6);
        // Test with | and ; delimiters
        expect(calculator.add('//[|][;]\n1|2;3')).toBe(6);
        // Test with three different delimiters
        expect(calculator.add('//[|][;][%]\n1|2;3%4')).toBe(10);
        // Test with four delimiters including multi-character
        expect(calculator.add('//[|][;][%][**]\n1|2;3%4**5')).toBe(15);
    });

    // Test multiple multi-character delimiters in various combinations
    test('should support multiple multi-character delimiters', () => {
        // Basic multi-character delimiters
        expect(calculator.add('//[***][%%%]\n1***2%%%3')).toBe(6);
        // Alphabetic multi-character delimiters
        expect(calculator.add('//[abc][def]\n1abc2def3')).toBe(6);
        // Symbol-based multi-character delimiters
        expect(calculator.add('//[>>][<<]\n1>>2<<3')).toBe(6);
        // Numeric and alphabetic delimiters
        expect(calculator.add('//[123][xyz]\n11234xyz5')).toBe(10);
        // Complex alphanumeric delimiters
        expect(calculator.add('//[a1b2c3][d4e5f6]\n1a1b2c32d4e5f63')).toBe(6);
        // Mixed single and multi-character delimiters
        expect(calculator.add('//[|][;][%][**][***]\n1|2;3%4**5***6')).toBe(21);
        // Multiple complex delimiters
        expect(calculator.add('//[a1b2c3][d4e5f6][g7h8i9]\n1a1b2c32d4e5f63g7h8i94')).toBe(10);
        // Four complex delimiters with numbers
        expect(calculator.add('//[a1b2c3][d4e5f6][g7h8i9][j10k11l12]\n1a1b2c32d4e5f63g7h8i94j10k11l125')).toBe(15);
    });
});