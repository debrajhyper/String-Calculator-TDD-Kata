# String Calculator TDD Kata

A TypeScript implementation of the String Calculator kata, following Test-Driven Development (TDD) principles. This project demonstrates how to build a robust string calculator with various features through incremental development and testing.

## Features

- Adds numbers provided as a string with comma or newline delimiters
- Supports custom delimiters
- Handles multiple delimiters
- Supports multi-character delimiters
- Validates and reports negative numbers
- Ignores numbers larger than 1000
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/debrajhyper/String-Calculator-TDD-Kata.git
   cd String-Calculator-TDD-Kata
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Running Tests

To run the test suite:

```bash
npm run test
```

### Using the String Calculator

```typescript
import { StringCalculator } from './src/StringCalculator';

const calculator = new StringCalculator();

// Basic usage
console.log(calculator.add('1,2,3')); // Output: 6

// With custom delimiter
console.log(calculator.add('//;\n1;2')); // Output: 3

// With multiple delimiters
console.log(calculator.add('//[;][%]\n1;2%3')); // Output: 6
```

## Features in Detail

### 1. Basic Requirements
- Empty string returns 0
- Single number returns the number
- Two numbers return their sum
- Multiple numbers return their sum
- Newlines between numbers are treated as delimiters

### 2. Custom Delimiters
- Support for single character custom delimiters: `//[delimiter]\n[numbers]`
- Example: `//;\n1;2` returns 3

### 3. Negative Numbers
- Throws an exception when negative numbers are present
- Exception message includes all negative numbers in the input

### 4. Number Filtering
- Numbers greater than 1000 are ignored
- Example: `1001,2` returns 2

### 5. Advanced Delimiters
- Supports multi-character delimiters: `//[delimiter]\n[numbers]`
  - Example: `//[***]\n1***2***3` returns 6
- Supports multiple delimiters: `//[delim1][delim2]\n[numbers]`
  - Example: `//[*][%]\n1*2%3` returns 6
- Supports multiple multi-character delimiters
  - Example: `//[***][%%%]\n1***2%%%3` returns 6

## Development

### Project Structure

```bash
├── src/
│   └── StringCalculator.ts       # Main calculator implementation
├── tests/
│   └── StringCalculator.test.ts  # Test cases
├── jest.config.js                # Jest test configuration
├── package.json                  # Project configuration and dependencies
├── README.md                     # Project documentation
└── tsconfig.json                 # TypeScript configuration
```

### Testing Strategy

The project follows Test-Driven Development (TDD) principles with a comprehensive test suite that includes:
- Unit tests for all features
- Edge case testing
- Error case testing
- Custom delimiter testing
- Negative number validation
- Large number filtering

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Roy Osherove's String Calculator Kata](https://osherove.com/tdd-kata-1)
- Built with TypeScript and Jest
