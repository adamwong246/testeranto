package main

import (
	"fmt"
	"os"
	"strconv"

	calculatorlib "example/goLib"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Calculator CLI")
		fmt.Println("Usage:")
		fmt.Println("  calculator add <a> <b>")
		fmt.Println("  calculator subtract <a> <b>")
		fmt.Println("  calculator multiply <a> <b>")
		fmt.Println("  calculator divide <a> <b>")
		os.Exit(1)
	}

	calc := calculatorlib.NewCalculator()
	cmd := os.Args[1]

	switch cmd {
	case "add":
		if len(os.Args) != 4 {
			fmt.Println("Usage: calculator add <a> <b>")
			os.Exit(1)
		}
		a, _ := strconv.ParseFloat(os.Args[2], 64)
		b, _ := strconv.ParseFloat(os.Args[3], 64)
		fmt.Println(calc.Add(a, b))
	case "subtract":
		if len(os.Args) != 4 {
			fmt.Println("Usage: calculator subtract <a> <b>")
			os.Exit(1)
		}
		a, _ := strconv.ParseFloat(os.Args[2], 64)
		b, _ := strconv.ParseFloat(os.Args[3], 64)
		fmt.Println(calc.Subtract(a, b))
	case "multiply":
		if len(os.Args) != 4 {
			fmt.Println("Usage: calculator multiply <a> <b>")
			os.Exit(1)
		}
		a, _ := strconv.ParseFloat(os.Args[2], 64)
		b, _ := strconv.ParseFloat(os.Args[3], 64)
		fmt.Println(calc.Multiply(a, b))
	case "divide":
		if len(os.Args) != 4 {
			fmt.Println("Usage: calculator divide <a> <b>")
			os.Exit(1)
		}
		a, _ := strconv.ParseFloat(os.Args[2], 64)
		b, _ := strconv.ParseFloat(os.Args[3], 64)
		result, err := calc.Divide(a, b)
		if err != nil {
			fmt.Println("Error:", err)
			os.Exit(1)
		}
		fmt.Println(result)
	default:
		fmt.Printf("Unknown command: %s\n", cmd)
		os.Exit(1)
	}
}
