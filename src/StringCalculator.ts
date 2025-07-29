export class StringCalculator {
    add(numbers: string): number {
        if (numbers === '') {
            return 0;
        }

        let delimiter = /[,\n]/;
        let numberString = numbers;

        if (numbers.startsWith('//')) {
            const delimiterLineEnd = numbers.indexOf('\n');
            const delimiterPart = numbers.substring(2, delimiterLineEnd);
            numberString = numbers.substring(delimiterLineEnd + 1);

            if (delimiterPart.startsWith('[') && delimiterPart.endsWith(']')) {
                const customDelimiter = delimiterPart.slice(1, -1);
                delimiter = new RegExp(`[,\n]|${this.escapeRegExp(customDelimiter)}`, 'g');
            } else {
                delimiter = new RegExp(`[,\n${this.escapeRegExp(delimiterPart)}]`);
            }
        }

        const parts = numberString.split(delimiter).filter(part => part !== '');
        const numbersArray = parts.map(part => parseInt(part));

        const negativeNumbers = numbersArray.filter(num => num < 0);
        if (negativeNumbers.length > 0) {
            throw new Error(`Negative numbers not allowed ${negativeNumbers.join(',')}`);
        }

        const validNumbers = numbersArray.filter(num => num <= 1000);
        return validNumbers.reduce((sum, num) => sum + num, 0);
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}