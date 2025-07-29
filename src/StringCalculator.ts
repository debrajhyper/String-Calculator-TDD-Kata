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

            const delimiters = this.parseDelimiters(delimiterPart);
            const escapedDelimiters = delimiters.map(d => this.escapeRegExp(d));
            delimiter = new RegExp(`[,\n]|${escapedDelimiters.join('|')}`, 'g');
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

    private parseDelimiters(delimiterPart: string): string[] {
        if (delimiterPart.includes('[') && delimiterPart.includes(']')) {
            const delimiters: string[] = [];
            let currentIndex = 0;

            while (currentIndex < delimiterPart.length) {
                const startBracket = delimiterPart.indexOf('[', currentIndex);
                if (startBracket === -1) break;

                const endBracket = delimiterPart.indexOf(']', startBracket);
                if (endBracket === -1) break;

                const delimiter = delimiterPart.substring(startBracket + 1, endBracket);
                delimiters.push(delimiter);
                currentIndex = endBracket + 1;
            }

            return delimiters;
        } else {
            return [delimiterPart];
        }
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}