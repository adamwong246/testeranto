package main

import (
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"github.com/adamwong246/testeranto/src/golingvu"
)

func TestBaseSuite(t *testing.T) {
	// This test should only be executed via launchGolang which sets environment variables
	testResources := os.Getenv("TEST_RESOURCES")
	ipcFile := os.Getenv("IPC_FILE")

	// If environment variables are not set, this test wasn't launched via the PM
	if testResources == "" || ipcFile == "" {
		t.Skip("Test must be executed via PM with TEST_RESOURCES and IPC_FILE environment variables set")
		return
	}

	// Parse test resources
	var testResourceConfig golingvu.ITTestResourceConfiguration
	if err := json.Unmarshal([]byte(testResources), &testResourceConfig); err != nil {
		t.Fatalf("Failed to parse test resources: %v", err)
	}

	// Create PM instance and connect to IPC
	pm, err := golingvu.NewPM_Golang(testResourceConfig, ipcFile)
	if err != nil {
		t.Fatalf("Failed to create PM instance: %v", err)
	}
	// Ensure Stop method is accessible
	if pm == nil {
		t.Fatal("PM instance is nil")
	}
	defer func() {
		if pm != nil {
			err := pm.Stop()
			if err != nil {
				t.Logf("Error stopping PM: %v", err)
			}
		}
	}()

	// Run actual test logic here - this would be where you execute your BDD tests
	// For now, just verify the connection was successful
	fmt.Printf("Golang test executed successfully with IPC connection to %s\n", ipcFile)
	fmt.Printf("Test resource: %+v\n", testResourceConfig)
}
