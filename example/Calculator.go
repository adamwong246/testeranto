package main

// Calculator represents a simple calculator
type Calculator struct {
	values  map[string]interface{}
	display string
}

// NewCalculator creates a new Calculator instance
func NewCalculator() *Calculator {
	return &Calculator{
		values: make(map[string]interface{}),
	}
}

func (c *Calculator) Add(a, b float64) float64 {
	return a + b
}

func (c *Calculator) Subtract(a, b float64) float64 {
	return a - b
}

func (c *Calculator) Multiply(a, b float64) float64 {
	return a * b
}

func (c *Calculator) Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, &DivisionByZeroError{}
	}
	return a / b, nil
}

func (c *Calculator) SetValue(identifier string, value interface{}) {
	if c.values == nil {
		c.values = make(map[string]interface{})
	}
	c.values[identifier] = value
}

func (c *Calculator) GetValue(identifier string) interface{} {
	if c.values == nil {
		return nil
	}
	return c.values[identifier]
}

// GetDisplay returns the current display value
func (c *Calculator) GetDisplay() string {
	if c == nil {
		return ""
	}
	return c.display
}

// Press handles button presses
func (c *Calculator) Press(button string) *Calculator {
	if c == nil {
		c = &Calculator{}
	}
	// Handle special buttons
	if button == "C" {
		c.display = ""
		return c
	}

	// For regular buttons, append to display
	c.display = c.display + button
	return c
}

// DivisionByZeroError represents division by zero error
type DivisionByZeroError struct{}

func (e *DivisionByZeroError) Error() string {
	return "Cannot divide by zero"
}

// press handles button presses (lowercase version for test compatibility)
func (c *Calculator) press(button string) error {
	c.Press(button)
	return nil
}

// GetWidth is a placeholder method for testing
func (c *Calculator) GetWidth() int {
	return 0
}

// GetHeight is a placeholder method for testing
func (c *Calculator) GetHeight() int {
	return 0
}

// Area is a placeholder method for testing
func (c *Calculator) Area() int {
	return 0
}
