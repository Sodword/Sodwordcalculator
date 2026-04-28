// Calculator Application
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.shouldResetDisplay = false;
        
        this.init();
    }

    // Initialize calculator with event listeners
    init() {
        // Button click listeners
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target.dataset.value);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }

    // Handle button clicks
    handleButtonClick(value) {
        if (value === 'C') {
            this.clear();
        } else if (value === '=') {
            this.calculate();
        } else if (['+', '-', '*', '/'].includes(value)) {
            this.setOperator(value);
        } else if (value === '.') {
            this.appendDecimal();
        } else {
            this.appendNumber(value);
        }
        
        this.updateDisplay();
    }

    // Handle keyboard input
    handleKeyboardInput(e) {
        const key = e.key;
        
        // Numbers
        if (key >= '0' && key <= '9') {
            this.appendNumber(key);
        }
        // Operators
        else if (key === '+' || key === '-' || key === '*' || key === '/') {
            this.setOperator(key);
        }
        // Enter for equals
        else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            this.calculate();
        }
        // Escape for clear
        else if (key === 'Escape') {
            this.clear();
        }
        // Backspace for delete last character
        else if (key === 'Backspace') {
            this.deleteLastCharacter();
        }
        // Decimal point
        else if (key === '.') {
            this.appendDecimal();
        }
        
        this.updateDisplay();
    }

    // Append number to current input
    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = '';
            this.shouldResetDisplay = false;
        }
        
        // Prevent multiple leading zeros
        if (this.currentInput === '0' && number !== '.') {
            this.currentInput = number;
        } else {
            // Limit input length
            if (this.currentInput.length < 15) {
                this.currentInput += number;
            }
        }
    }

    // Set operator
    setOperator(operator) {
        if (this.previousInput !== null && !this.shouldResetDisplay) {
            this.calculate();
        }
        
        this.previousInput = this.currentInput;
        this.operator = operator;
        this.shouldResetDisplay = true;
    }

    // Append decimal point
    appendDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        
        // Check if decimal already exists in current number
        if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
    }

    // Calculate result
    calculate() {
        if (this.previousInput === null || this.operator === null) {
            return;
        }

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Handle floating point precision
        if (!Number.isFinite(result)) {
            this.showError('Error');
            return;
        }

        // Round to reasonable decimal places
        result = Math.round(result * 100000000) / 100000000;
        
        this.currentInput = result.toString();
        this.previousInput = null;
        this.operator = null;
        this.shouldResetDisplay = true;
        
        this.updateDisplay();
    }

    // Clear calculator
    clear() {
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    // Delete last character
    deleteLastCharacter() {
        if (this.currentInput.length === 1 || 
            (this.currentInput.length === 2 && this.currentInput[0] === '-')) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }
    }

    // Show error message
    showError(message) {
        this.currentInput = message;
        this.previousInput = null;
        this.operator = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
        
        // Reset after showing error
        setTimeout(() => {
            if (this.currentInput === message) {
                this.clear();
            }
        }, 1500);
    }

    // Update display
    updateDisplay() {
        // Format large numbers
        let displayValue = this.currentInput;
        
        if (displayValue.length > 12) {
            const num = parseFloat(displayValue);
            if (!isNaN(num) && isFinite(num)) {
                displayValue = num.toExponential(6);
            }
        }
        
        this.display.value = displayValue;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});