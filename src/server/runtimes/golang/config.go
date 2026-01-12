package main

import (
	"encoding/json"
	"fmt"
	"os"
)

// TestConfig represents configuration for a single test
type TestConfig struct {
	Path  string `json:"path"`
	Ports int    `json:"ports"`
}

// GolangConfig represents the Go-specific configuration
type GolangConfig struct {
	Tests map[string]TestConfig `json:"tests"`
}

// Config represents the overall configuration
type Config struct {
	Golang GolangConfig `json:"golang"`
}

func findConfig() string {
	fmt.Println("[INFO] Searching for config file...")
	
	// Check command line argument first
	if len(os.Args) > 1 {
		argPath := os.Args[1]
		fmt.Printf("[INFO] Checking command line argument: %s\n", argPath)
		if _, err := os.Stat(argPath); err == nil {
			fmt.Printf("[INFO] Found config at command line path: %s\n", argPath)
			return argPath
		}
	}

	// Try common locations
	possiblePaths := []string{
		"/workspace/testeranto/allTests.json",
		"/workspace/allTests.json",
		"allTests.json",
		"testeranto/allTests.json",
	}
	
	for _, path := range possiblePaths {
		fmt.Printf("[INFO] Checking possible path: %s\n", path)
		if _, err := os.Stat(path); err == nil {
			fmt.Printf("[INFO] Found config at: %s\n", path)
			return path
		}
	}
	
	fmt.Println("[ERROR] Config file not found in any standard location")
	return ""
}

func loadConfig(path string) (*Config, error) {
	fmt.Printf("[INFO] Loading config from: %s\n", path)
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("failed to open config: %w", err)
	}
	defer file.Close()

	var config Config
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		return nil, fmt.Errorf("failed to decode config: %w", err)
	}
	
	fmt.Printf("[INFO] Loaded config with %d Go test(s)\n", len(config.Golang.Tests))
	for testName, testConfig := range config.Golang.Tests {
		fmt.Printf("[INFO]   - %s (path: %s, ports: %d)\n", testName, testConfig.Path, testConfig.Ports)
	}
	
	return &config, nil
}
