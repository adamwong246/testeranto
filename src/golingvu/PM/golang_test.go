// package golingvu

// import (
// 	"fmt"
// 	"net"
// 	"testing"
// 	"time"
// )

// func TestPM_Golang_Stop(t *testing.T) {
// 	// Create a test configuration
// 	testConfig := ITTestResourceConfiguration{
// 		Name:  "test",
// 		Fs:    "./",
// 		Ports: []int{},
// 	}

// 	// Test that Stop method exists and can be called
// 	pm := &PM_Golang{
// 		testResourceConfiguration: testConfig,
// 		client:                    nil,
// 	}

// 	// This should not panic - test that the method exists
// 	err := pm.Stop()
// 	if err != nil {
// 		t.Errorf("Stop() should return nil when client is nil, got: %v", err)
// 	}

// 	// Test with a mock connection
// 	// Create a temporary listener to test connection handling
// 	ln, err := net.Listen("unix", "/tmp/test_socket_"+fmt.Sprintf("%d", time.Now().UnixNano()))
// 	if err != nil {
// 		t.Fatalf("Failed to create listener: %v", err)
// 	}
// 	defer ln.Close()

// 	// Connect to the listener
// 	conn, err := net.Dial("unix", ln.Addr().String())
// 	if err != nil {
// 		t.Fatalf("Failed to dial: %v", err)
// 	}

// 	pmWithConn := &PM_Golang{
// 		testResourceConfiguration: testConfig,
// 		client:                    conn,
// 	}

// 	// Stop should close the connection
// 	err = pmWithConn.Stop()
// 	if err != nil {
// 		t.Errorf("Stop() should close connection successfully, got: %v", err)
// 	}

// 	// The connection should now be closed
// 	_, err = conn.Write([]byte("test"))
// 	if err == nil {
// 		t.Error("Connection should be closed after Stop()")
// 	}
// }

// // TestPM_Golang_Start tests that the Start method exists
// func TestPM_Golang_Start(t *testing.T) {
// 	testConfig := ITTestResourceConfiguration{
// 		Name:  "test",
// 		Fs:    "./",
// 		Ports: []int{},
// 	}

// 	pm := &PM_Golang{
// 		testResourceConfiguration: testConfig,
// 		client:                    nil,
// 	}

// 	// Test that Start method exists and can be called
// 	err := pm.Start()
// 	if err != nil {
// 		t.Errorf("Start() should return nil, got: %v", err)
// 	}
// }

// func TestPM_Golang_WriteFileSync(t *testing.T) {
// 	testConfig := ITTestResourceConfiguration{
// 		Name:  "test",
// 		Fs:    "./",
// 		Ports: []int{},
// 	}

// 	pm := &PM_Golang{
// 		testResourceConfiguration: testConfig,
// 		client:                    nil,
// 	}

// 	// Test that WriteFileSync method exists and can be called
// 	// Since we don't have a real connection, this will fail, but we just want to check compilation
// 	_, err := pm.WriteFileSync("test.txt", "content", "testName")
// 	// We expect an error due to nil client, but the method should exist
// 	if err == nil {
// 		t.Log("WriteFileSync method exists and was called")
// 	} else {
// 		t.Logf("WriteFileSync method exists but returned error (expected): %v", err)
// 	}
// }
