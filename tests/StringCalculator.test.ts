import { StringCalculator } from '../src/StringCalculator';

describe('StringCalculator', () => {
    let calculator: StringCalculator;

    beforeEach(() => {
        calculator = new StringCalculator();
    });

    test('should return 0 for empty string', () => {
        expect(calculator.add('')).toBe(0);
    });

    test('should return the number itself for single number', () => {
        expect(calculator.add('1')).toBe(1);
        expect(calculator.add('5')).toBe(5);
    });

    test('should return sum of two comma-separated numbers', () => {
        expect(calculator.add('1,2')).toBe(3);
        expect(calculator.add('1,5')).toBe(6);
    });

    test('should handle any amount of numbers', () => {
        expect(calculator.add('1,2,3')).toBe(6);
        expect(calculator.add('1,2,3,4,5')).toBe(15);
    });

    test('should handle new lines between numbers', () => {
        expect(calculator.add('1\n2,3')).toBe(6);
        expect(calculator.add('1\n2\n3')).toBe(6);
    });

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

    test('should throw exception for negative numbers', () => {
        expect(() => calculator.add('-1')).toThrow('Negative numbers not allowed -1');
        expect(() => calculator.add('1,-2')).toThrow('Negative numbers not allowed -2');
        expect(() => calculator.add('1\n-2')).toThrow('Negative numbers not allowed -2');
    });

    test('should show all negative numbers in exception', () => {
        expect(() => calculator.add('-1,-2,-3')).toThrow('Negative numbers not allowed -1,-2,-3');
        expect(() => calculator.add('1,-2,-3')).toThrow('Negative numbers not allowed -2,-3');
        expect(() => calculator.add('1\n-2\n-3')).toThrow('Negative numbers not allowed -2,-3');
    });

    test('should ignore numbers bigger than 1000', () => {
        expect(calculator.add('1001')).toBe(0);
        expect(calculator.add('2,1001')).toBe(2);
        expect(calculator.add('1000,1001,2')).toBe(1002);
        expect(calculator.add('1000\n1001\n2')).toBe(1002);
        expect(calculator.add('//;\n1000;1001;2')).toBe(1002);
    });

    test('should support multi-character delimiters', () => {
        expect(calculator.add('//[***]\n1***2***3')).toBe(6);
        expect(calculator.add('//[abc]\n1abc2abc3')).toBe(6);
        expect(calculator.add('//[a1b2c3]\n1a1b2c32a1b2c33')).toBe(6);
    });

    test('should support multiple delimiters', () => {
        expect(calculator.add('//[*][%]\n1*2%3')).toBe(6);
        expect(calculator.add('//[|][;]\n1|2;3')).toBe(6);
        expect(calculator.add('//[|][;][%]\n1|2;3%4')).toBe(10);
        expect(calculator.add('//[|][;][%][**]\n1|2;3%4**5')).toBe(15);
    });
});