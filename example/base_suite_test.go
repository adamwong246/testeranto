package main

import (
	"fmt"
	"testing"

	"testeranto/src/golingvu"
)

func TestBaseSuite(t *testing.T) {
	// For testing purposes, we need to handle the arguments differently
	// Since go test doesn't pass command line arguments in the same way

	// We can use environment variables or test-specific setup
	// For now, let's just check if we can create a PM instance without errors

	// Create a minimal test resource configuration
	testResourceConfig := golingvu.ITTestResourceConfiguration{
		Name:  "test",
		Fs:    "./",
		Ports: []int{8080},
	}

	// Try to create PM instance
	_, err := golingvu.NewPM_Golang(testResourceConfig, "test_ipc.sock")
	if err != nil {
		t.Errorf("Failed to create PM instance: %v", err)
	}

	// If we reach here, the test passes
	fmt.Println("Golang test setup completed successf!!ully")
}

// TestMain can be used for setup/teardown if needed
// func TestMain(m *testing.M) {
// 	// Setup code here, if any
// 	exitCode := m.Run()
// 	// Teardown code here, if any
// 	os.Exit(exitCode)
// }
