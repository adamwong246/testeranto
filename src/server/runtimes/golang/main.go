package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// Package struct maps the fields we need from 'go list'
type Package struct {
	ImportPath string   `json:"ImportPath"`
	Dir        string   `json:"Dir"`
	GoFiles    []string `json:"GoFiles"`
	Module     *struct {
		Main bool `json:"Main"`
	} `json:"Module"`
}

// TestEntry represents a test entry in the metafile
type TestEntry struct {
	Name   string   `json:"name"`
	Path   string   `json:"path"`
	Inputs []string `json:"inputs"`
	Output string   `json:"output"`
}

// Metafile structure matching esbuild format
type Metafile struct {
	Inputs  map[string]InputEntry  `json:"inputs"`
	Outputs map[string]OutputEntry `json:"outputs"`
}

// InputEntry represents an input file
type InputEntry struct {
	Bytes   int      `json:"bytes"`
	Imports []string `json:"imports"`
}

// OutputEntry represents an output entry
type OutputEntry struct {
	Imports    []string               `json:"imports"`
	Exports    []string               `json:"exports"`
	EntryPoint string                 `json:"entryPoint"`
	Inputs     map[string]InputDetail `json:"inputs"`
	Bytes      int                    `json:"bytes"`
}

// InputDetail represents input file details in output
type InputDetail struct {
	BytesInOutput int `json:"bytesInOutput"`
}

func computeFilesHash(files []string) (string, error) {
	hash := md5.New()
	for _, file := range files {
		absPath := filepath.Join("/workspace", file)
		// Add file path to hash
		hash.Write([]byte(file))
		
		// Add file stats to hash
		info, err := os.Stat(absPath)
		if err == nil {
			hash.Write([]byte(info.ModTime().String()))
			hash.Write([]byte(fmt.Sprintf("%d", info.Size())))
		} else {
			hash.Write([]byte("missing"))
		}
	}
	return hex.EncodeToString(hash.Sum(nil)), nil
}


func main() {
	// Force output to be visible
	fmt.Fprintln(os.Stdout, "🚀 Go builder starting...")
	fmt.Fprintln(os.Stderr, "🚀 Go builder starting (stderr)...")
	os.Stdout.Sync()
	os.Stderr.Sync()
	
	// Print environment info
	fmt.Println("Environment:")
	fmt.Println("  TEST_NAME:", os.Getenv("TEST_NAME"))
	fmt.Println("  PWD:", os.Getenv("PWD"))
	fmt.Println("  Current dir:", getCurrentDir())
	
	// Get test name from environment
	testName := os.Getenv("TEST_NAME")
	fmt.Fprintf(os.Stdout, "TEST_NAME=%s\n", testName)
	if testName == "" {
		testName = "allTests"
	}
	
	// Load configuration
	configPath := findConfig()
	fmt.Fprintf(os.Stdout, "Config path: %s\n", configPath)
	if configPath == "" {
		fmt.Fprintln(os.Stderr, "❌ Config file not found")
		os.Exit(1)
	}
	
	// Check if config file exists
	if _, err := os.Stat(configPath); err != nil {
		fmt.Fprintf(os.Stderr, "❌ Config file does not exist: %v\n", err)
		os.Exit(1)
	}
	
	config, err := loadConfig(configPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "❌ Failed to load config: %v\n", err)
		os.Exit(1)
	}
	
	fmt.Fprintf(os.Stdout, "✅ Loaded config with %d Go test(s)\n", len(config.Golang.Tests))
	
	// Process each test
	for testName, testConfig := range config.Golang.Tests {
		fmt.Printf("\n📦 Processing test: %s\n", testName)
		
		// Determine the test source directory
		testSourceDir := filepath.Join("/workspace", testConfig.Path)
		
		// Find the module root directory
		moduleRoot := findModuleRoot(testSourceDir)
		if moduleRoot == "" {
			log.Printf("⚠️  Cannot find go.mod in or above %s", testSourceDir)
			continue
		}
		
		// Change to module root directory
		if err := os.Chdir(moduleRoot); err != nil {
			log.Printf("⚠️  Cannot change to directory %s: %v", moduleRoot, err)
			continue
		}
		
		// Get relative path from module root to test source
		relPath, err := filepath.Rel(moduleRoot, testSourceDir)
		if err != nil {
			log.Printf("⚠️  Cannot get relative path from %s to %s: %v", moduleRoot, testSourceDir, err)
			os.Chdir("/workspace")
			continue
		}
		
		// Use go list to get all dependencies
		listCmd := exec.Command("go", "list", "-json", "-deps", "./"+relPath)
		output, err := listCmd.Output()
		if err != nil {
			log.Printf("⚠️  Failed to list dependencies for %s: %v", testName, err)
			os.Chdir("/workspace")
			continue
		}
		
		// Parse the JSON output
		var inputs []string
		dec := json.NewDecoder(strings.NewReader(string(output)))
		
		// Track all packages and their files
		for dec.More() {
			var pkg Package
			if err := dec.Decode(&pkg); err != nil {
				fmt.Printf("  ⚠️  Error decoding package: %v\n", err)
				break
			}
			
			// Add all Go files from this package to inputs
			for _, file := range pkg.GoFiles {
				absPath := filepath.Join(pkg.Dir, file)
				// Make path relative to workspace for consistency
				relToWorkspace, err := filepath.Rel("/workspace", absPath)
				if err != nil {
					relToWorkspace = absPath
				}
				inputs = append(inputs, relToWorkspace)
			}
		}
		
		fmt.Printf("  Found %d input files\n", len(inputs))
		
		
		
		// Compute hash for this test's input files
		testHash, err := computeFilesHash(inputs)
		if err != nil {
			fmt.Printf("  ⚠️  Failed to compute hash: %v\n", err)
			testHash = "error"
		}
		
		// Hardcode the path to match the requirement
		// Create directory: testeranto/bundles/allTests/golang/example
		artifactsDir := filepath.Join("/workspace", "testeranto/bundles/allTests/golang", "example")
		if err := os.MkdirAll(artifactsDir, 0755); err != nil {
			log.Printf("⚠️  Failed to create artifacts directory %s: %v", artifactsDir, err)
			os.Chdir("/workspace")
			continue
		}
		
		// Create inputFiles.json path
		inputFilesPath := filepath.Join(artifactsDir, "Calculator.test.go-inputFiles.json")
		
		// Create inputFiles.json content
		inputFilesData := map[string]interface{}{
			"hash":        testHash,
			"entry_point": testConfig.Path,
			"files":       inputs,
		}
		
		inputFilesJSON, err := json.MarshalIndent(inputFilesData, "", "  ")
		if err != nil {
			log.Printf("⚠️  Failed to marshal inputFiles.json: %v", err)
		} else {
			if err := os.WriteFile(inputFilesPath, inputFilesJSON, 0644); err != nil {
				log.Printf("⚠️  Failed to write inputFiles.json: %v", err)
			} else {
				fmt.Printf("  ✅ Created inputFiles.json at %s (hash: %s)\n", inputFilesPath, testHash)
			}
		}
		
		// Note: WebSocket functionality removed
		fmt.Printf("[Go Builder] Processed test: %s\n", testName)
		
		// Compile the test into an executable
		// Use the artifacts directory for the executable
		outputExePath := filepath.Join(artifactsDir, "Calculator.test.exe")
		buildCmd := exec.Command("go", "build", "-o", outputExePath, "./"+relPath)
		buildCmd.Stdout = os.Stdout
		buildCmd.Stderr = os.Stderr
		
		fmt.Printf("  🔨 Compiling test to %s...\n", outputExePath)
		if err := buildCmd.Run(); err != nil {
			log.Printf("⚠️  Failed to compile test: %v", err)
			// Continue even if compilation fails
		} else {
			fmt.Printf("  ✅ Successfully compiled test to %s\n", outputExePath)
			// Also create a simple artifact marker file
			artifactMarkerPath := filepath.Join(artifactsDir, "artifact.txt")
			artifactContent := fmt.Sprintf("Executable: %s\nCompiled at: %s\nTest: %s\n", 
				outputExePath, time.Now().Format(time.RFC3339), testName)
			if err := os.WriteFile(artifactMarkerPath, []byte(artifactContent), 0644); err != nil {
				log.Printf("⚠️  Failed to write artifact marker: %v", err)
			}
		}
		
		// Change back to workspace root
		os.Chdir("/workspace")
	}
	
	fmt.Println("🎉 Go builder completed!")
}

func getCurrentDir() string {
	dir, err := os.Getwd()
	if err != nil {
		return fmt.Sprintf("Error: %v", err)
	}
	return dir
}

func findConfig() string {
	return "/workspace/testeranto/runtimes/golang/golang.go"
}

// loadConfig is defined in config.go
// findModuleRoot walks up from dir to find a directory containing go.mod
func findModuleRoot(dir string) string {
	current := dir
	for {
		goModPath := filepath.Join(current, "go.mod")
		if _, err := os.Stat(goModPath); err == nil {
			return current
		}
		parent := filepath.Dir(current)
		if parent == current {
			break
		}
		current = parent
	}
	return ""
}

// Dummy implementation to satisfy compiler
func sendSourceFilesUpdatedForTest(testName, hash string, files []string, runtime string) error {
	return nil
}


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


func loadConfig(path string) (*Config, error) {
	fmt.Printf("[INFO] Loading config from: %s\n", path)
	
	// Run the Go file to get JSON output
	cmd := exec.Command("go", "run", path)
	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("failed to run config program: %w", err)
	}
	
	var config Config
	if err := json.Unmarshal(output, &config); err != nil {
		return nil, fmt.Errorf("failed to decode config JSON: %w", err)
	}
	
	fmt.Printf("[INFO] Loaded config with %d Go test(s)\n", len(config.Golang.Tests))
	for testName, testConfig := range config.Golang.Tests {
		fmt.Printf("[INFO]   - %s (path: %s, ports: %d)\n", testName, testConfig.Path, testConfig.Ports)
	}
	
	return &config, nil
}
