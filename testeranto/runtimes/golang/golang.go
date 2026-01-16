package main

import (
	"encoding/json"
	"os"
)

// Config represents the Go-specific configuration
type Config struct {
	Tests map[string]struct {
		Path  string `json:"path"`
		Ports int    `json:"ports"`
	} `json:"tests"`
}

// GetConfig returns the configuration for Go tests
func GetConfig() Config {
	return Config{
		Tests: map[string]struct {
			Path  string `json:"path"`
			Ports int    `json:"ports"`
		}{
			"example/Calculator.golingvu.test.go": {
				Path:  "example/Calculator.golingvu.test.go",
				Ports: 1111,
			},
		},
	}
}

func main() {
	// This can be used as a standalone program to output JSON
	config := GetConfig()
	
	// Wrap in the expected structure
	output := map[string]interface{}{
		"golang": map[string]interface{}{
			"tests": config.Tests,
		},
	}
	
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	encoder.Encode(output)
}
