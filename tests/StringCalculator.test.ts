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
});