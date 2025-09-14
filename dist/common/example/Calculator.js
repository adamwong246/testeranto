"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calculator = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
class Calculator {
    constructor() {
        this.display = "";
        this.values = {};
        this.id = Math.random(); // Add a unique ID to track instances
    }
    press(button) {
        console.log(" ---- PRESS ---");
        // Append the button to the display
        console.log(`[CALCULATOR ${this.id}] Pressing: ${button}, current display: '${this.display}'`);
        // Make sure we're actually modifying the instance's display
        this.display = this.display + button;
        console.log(`[CALCULATOR ${this.id}] New display is: '${this.display}'`);
        // Return this to allow method chaining
        return this;
    }
    enter() {
        try {
            // Simple expression evaluation
            // Note: Using eval is not recommended for production code
            // This is just for testing purposes
            const result = eval(this.display);
            this.display = result.toString();
        }
        catch (error) {
            this.display = "Error";
        }
    }
    // Memory functions
    memoryStore() {
        this.setValue("memory", parseFloat(this.display) || 0);
        this.clear();
    }
    memoryRecall() {
        const memoryValue = this.getValue("memory") || 0;
        this.display = memoryValue.toString();
    }
    memoryClear() {
        this.setValue("memory", 0);
    }
    memoryAdd() {
        const currentValue = parseFloat(this.display) || 0;
        const memoryValue = this.getValue("memory") || 0;
        this.setValue("memory", memoryValue + currentValue);
        this.clear();
    }
    // Handle special buttons
    handleSpecialButton(button) {
        switch (button) {
            case "C":
                this.clear();
                return true;
            case "MS":
                this.memoryStore();
                return true;
            case "MR":
                this.memoryRecall();
                return true;
            case "MC":
                this.memoryClear();
                return true;
            case "M+":
                this.memoryAdd();
                return true;
            default:
                return false;
        }
    }
    press(button) {
        console.log(" ---- PRESS ---");
        console.log(`[CALCULATOR ${this.id}] Pressing: ${button}, current display: '${this.display}'`);
        // Handle special buttons first
        if (this.handleSpecialButton(button)) {
            return this;
        }
        // For regular buttons, append to display
        this.display = this.display + button;
        console.log(`[CALCULATOR ${this.id}] New display is: '${this.display}'`);
        return this;
    }
    getDisplay() {
        console.log(`[CALCULATOR ${this.id}] getDisplay: '${this.display}'`);
        return this.display;
    }
    clear() {
        this.display = "";
    }
    // Keep these methods for backward compatibility if needed
    add(a, b) {
        return a + b;
    }
    subtract(a, b) {
        return a - b;
    }
    multiply(a, b) {
        return a * b;
    }
    divide(a, b) {
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        return a / b;
    }
    setValue(identifier, value) {
        this.values[identifier] = value;
    }
    getValue(identifier) {
        var _a;
        return (_a = this.values[identifier]) !== null && _a !== void 0 ? _a : null;
    }
}
exports.Calculator = Calculator;
