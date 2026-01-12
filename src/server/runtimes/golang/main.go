package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
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

// TestBinary represents a test binary to build
type TestBinary struct {
	Name    string   `json:"name"`
	Path    string   `json:"path"`
	Inputs  []string `json:"inputs"`
	Output  string   `json:"output"`
}

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

// Metafile structure
type Metafile struct {
	Binaries []TestBinary `json:"binaries"`
}

func main() {
	fmt.Println("🚀 Starting Go test builder...")
	
	// Load configuration
	configPath := findConfig()
	if configPath == "" {
		log.Fatal("❌ Config file not found")
	}
	
	config, err := loadConfig(configPath)
	if err != nil {
		log.Fatalf("❌ Failed to load config: %v", err)
	}
	
	fmt.Printf("✅ Loaded config with %d Go test(s)\n", len(config.Golang.Tests))
	
	// Log all test configurations
	for testName, testConfig := range config.Golang.Tests {
		fmt.Printf("  Test: %s -> Path: %s, Ports: %d\n", testName, testConfig.Path, testConfig.Ports)
	}
	
	// Prepare metafile
	metafile := Metafile{}
	
	// Create bundles directory
	bundlesDir := "/workspace/testeranto/bundles/allTests/golang"
	fmt.Printf("Creating bundles directory: %s\n", bundlesDir)
	if err := os.MkdirAll(bundlesDir, 0755); err != nil {
		log.Fatalf("❌ Failed to create bundles directory: %v", err)
	}
	fmt.Printf("✅ Bundles directory created/exists\n")
	
	// Check if we're in the right workspace
	workspaceCheck, _ := os.ReadDir("/workspace")
	fmt.Printf("Workspace contents: ")
	for _, entry := range workspaceCheck {
		fmt.Printf("%s ", entry.Name())
	}
	fmt.Println()
	
	// Build each test
	for testName, testConfig := range config.Golang.Tests {
		fmt.Printf("\n📦 Building test: %s\n", testName)
		
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
		
		// Build the test binary directly to bundles directory
		outputName := fmt.Sprintf("%s.test", testName)
		outputPath := filepath.Join(bundlesDir, outputName)
		
		// Log what we're about to do
		fmt.Printf("  Building from module root: %s\n", moduleRoot)
		fmt.Printf("  Test source directory: %s\n", testSourceDir)
		fmt.Printf("  Output path: %s\n", outputPath)
		
		// Build with -o pointing to bundles directory
		// The package path is relative to module root
		relPath, err := filepath.Rel(moduleRoot, testSourceDir)
		if err != nil {
			log.Printf("⚠️  Cannot get relative path from %s to %s: %v", moduleRoot, testSourceDir, err)
			continue
		}
		
		
		// Always build a regular binary for the example project
		// Change to the source directory
		if err := os.Chdir(testSourceDir); err != nil {
			fmt.Printf("  ❌ Cannot change to source directory %s: %v\n", testSourceDir, err)
			os.Chdir("/workspace")
			continue
		}
		
		// Build a test binary using 'go test -c'
		// First, check if there are test files in the directory
		testFiles, _ := filepath.Glob(filepath.Join(testSourceDir, "*_test.go"))
		if len(testFiles) == 0 {
			fmt.Printf("  ⚠️  No test files found in %s, building regular binary instead\n", testSourceDir)
			// Build a regular binary
			buildCmd := exec.Command("go", "build", "-o", outputPath)
			buildCmd.Stdout = os.Stdout
			buildCmd.Stderr = os.Stderr
			
			fmt.Printf("  Running: go build -o %s\n", outputPath)
			if err := buildCmd.Run(); err != nil {
				fmt.Printf("  ❌ Failed to build binary: %v\n", err)
				os.Chdir("/workspace")
				continue
			}
		} else {
			// Build a test binary
			fmt.Printf("  Found %d test files, building test binary\n", len(testFiles))
			buildCmd := exec.Command("go", "test", "-c", "-o", outputPath)
			buildCmd.Stdout = os.Stdout
			buildCmd.Stderr = os.Stderr
			
			fmt.Printf("  Running: go test -c -o %s\n", outputPath)
			if err := buildCmd.Run(); err != nil {
				fmt.Printf("  ❌ Failed to build test binary: %v\n", err)
				// Try building a regular binary as fallback
				fmt.Printf("  ⚠️  Trying regular build instead...\n")
				buildCmd = exec.Command("go", "build", "-o", outputPath)
				if err := buildCmd.Run(); err != nil {
					fmt.Printf("  ❌ Failed to build regular binary: %v\n", err)
					os.Chdir("/workspace")
					continue
				}
			}
		}
		
		// Check if the binary was actually created
		if _, err := os.Stat(outputPath); err != nil {
			fmt.Printf("  ❌ Binary not created at %s: %v\n", outputPath, err)
			// Still continue to create metafile entry, but with empty inputs
			fmt.Printf("  ⚠️  Creating metafile entry without binary\n")
			// Create entry with empty inputs
			testBinary := TestBinary{
				Name:    testName,
				Path:    testConfig.Path,
				Inputs:  []string{},
				Output:  outputPath,
			}
			metafile.Binaries = append(metafile.Binaries, testBinary)
		} else {
			fmt.Printf("  ✅ Binary created: %s\n", outputPath)
			
			// Get input files using 'go list' from the source directory
			// Stay in testSourceDir where we just built
			listCmd := exec.Command("go", "list", "-json", "-deps", ".")
			output, err := listCmd.Output()
			if err != nil {
				log.Printf("⚠️  Failed to list dependencies for %s: %v", testName, err)
				// Continue even if we can't get dependencies
				fmt.Printf("  ⚠️  Could not list dependencies, using empty list\n")
				output = []byte("[]")
			}
			
			// Parse the JSON output
			var inputs []string
			dec := json.NewDecoder(strings.NewReader(string(output)))
			
			// Count packages
			pkgCount := 0
			for dec.More() {
				var pkg Package
				if err := dec.Decode(&pkg); err != nil {
					fmt.Printf("  ⚠️  Error decoding package: %v\n", err)
					break
				}
				pkgCount++
				
				// Only include local files
				if pkg.Module != nil && pkg.Module.Main {
					for _, file := range pkg.GoFiles {
						absPath := filepath.Join(pkg.Dir, file)
						inputs = append(inputs, absPath)
					}
				}
			}
			fmt.Printf("  Processed %d packages, found %d input files\n", pkgCount, len(inputs))
			
			// Create test binary entry with correct output path
			testBinary := TestBinary{
				Name:    testName,
				Path:    testConfig.Path,
				Inputs:  inputs,
				Output:  outputPath,
			}
			
			metafile.Binaries = append(metafile.Binaries, testBinary)
			fmt.Printf("✅ Built test: %s at %s\n", testName, outputPath)
		}
		
		// Change back to workspace root
		os.Chdir("/workspace")
	}
	
	// Write metafile
	metafilePath := "/workspace/testeranto/metafiles/golang/allTests.json"
	
	// Ensure directory exists
	if err := os.MkdirAll(filepath.Dir(metafilePath), 0755); err != nil {
		log.Fatalf("❌ Failed to create metafile directory: %v", err)
	}
	
	metafileData, err := json.MarshalIndent(metafile, "", "  ")
	if err != nil {
		log.Fatalf("❌ Failed to marshal metafile: %v", err)
	}
	
	if err := os.WriteFile(metafilePath, metafileData, 0644); err != nil {
		log.Fatalf("❌ Failed to write metafile: %v", err)
	}
	
	fmt.Printf("✅ Metafile created at: %s\n", metafilePath)
	fmt.Printf("📊 Metafile contains %d binary entries\n", len(metafile.Binaries))
	
	// List all generated files
	fmt.Println("\n📁 Generated files:")
	bundlesDir := "/workspace/testeranto/bundles/allTests/golang"
	if entries, err := os.ReadDir(bundlesDir); err == nil {
		for _, entry := range entries {
			fmt.Printf("  - %s\n", entry.Name())
		}
		if len(entries) == 0 {
			fmt.Println("  (no files generated)")
		}
	} else {
		fmt.Printf("  Could not read bundles directory: %v\n", err)
	}
	
	metafilesDir := "/workspace/testeranto/metafiles/golang"
	if entries, err := os.ReadDir(metafilesDir); err == nil {
		for _, entry := range entries {
			fmt.Printf("  - %s\n", entry.Name())
		}
	} else {
		fmt.Printf("  Could not read metafiles directory: %v\n", err)
	}
	
	fmt.Println("🎉 Go test builder completed!")
}
