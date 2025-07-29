export class StringCalculator {
    add(numbers: string): number {
        if (numbers === '') {
            return 0;
        }
        
        const parts = numbers.split(/[,\n]/);
        return parts.reduce((sum, part) => sum + parseInt(part), 0);
    }
}