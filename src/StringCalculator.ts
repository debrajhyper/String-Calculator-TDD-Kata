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
        return parts.reduce((sum, part) => sum + parseInt(part), 0);
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}