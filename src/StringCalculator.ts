export class StringCalculator {
    add(numbers: string): number {
        if (numbers === '') {
            return 0;
        }

        let delimiter = /[,\n]/;
        let numberString = numbers;

        if (numbers.startsWith('//')) {
            const delimiterLineEnd = numbers.indexOf('\n');
            const customDelimiter = numbers.substring(2, delimiterLineEnd);
            delimiter = new RegExp(`[,\n${this.escapeRegExp(customDelimiter)}]`);
            numberString = numbers.substring(delimiterLineEnd + 1);
        }

        const parts = numberString.split(delimiter);
        const numbersArray = parts.map(part => parseInt(part));

        const negativeNumbers = numbersArray.filter(num => num < 0);
        if (negativeNumbers.length > 0) {
            throw new Error(`Negative numbers not allowed ${negativeNumbers.join(',')}`);
        }

        return numbersArray.reduce((sum, num) => sum + num, 0);
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}