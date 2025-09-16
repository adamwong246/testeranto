/* eslint-disable @typescript-eslint/no-explicit-any */
export class Calculator {
  private display: string = "";
  private values: { [key: string]: any } = {};
  private id: number = Math.random(); // Add a unique ID to track instances

  press(button: string): Calculator {
    this.display = this.display + button;
    return this;
  }

  enter(): void {
    try {
      // Simple expression evaluation
      // Note: Using eval is not recommended for production code
      // This is just for testing purposes
      const result = eval(this.display);
      this.display = result.toString();
    } catch (error) {
      this.display = "Error";
      throw error;
    }
  }

  memoryStore(): void {
    this.setValue("memory", parseFloat(this.display) || 0);
    this.clear();
  }

  memoryRecall(): void {
    const memoryValue = this.getValue("memory") || 0;
    this.display = memoryValue.toString();
  }

  memoryClear(): void {
    this.setValue("memory", 0);
  }

  memoryAdd(): void {
    const currentValue = parseFloat(this.display) || 0;
    const memoryValue = this.getValue("memory") || 0;
    this.setValue("memory", memoryValue + currentValue);
    this.clear();
  }

  handleSpecialButton(button: string): boolean {
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

  press(button: string): Calculator {
    // Handle special buttons first
    if (this.handleSpecialButton(button)) {
      return this;
    }

    // For regular buttons, append to display
    this.display = this.display + button;
    return this;
  }

  getDisplay(): string {
    return this.display;
  }

  clear(): void {
    this.display = "";
  }

  // Keep these methods for backward compatibility if needed
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    return a / b;
  }

  setValue(identifier: string, value: any): void {
    this.values[identifier] = value;
  }

  getValue(identifier: string): any {
    return this.values[identifier] ?? null;
  }
}
