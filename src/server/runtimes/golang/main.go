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

func main() {
	fmt.Println("🚀 Starting Go metafile generator...")
	
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
	
	// Initialize metafile
	metafile := Metafile{
		Inputs:  make(map[string]InputEntry),
		Outputs: make(map[string]OutputEntry),
	}
	
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
				
				// Add to metafile inputs
				fileInfo, err := os.Stat(absPath)
				if err == nil {
					// For now, we don't track imports at file level in Go
					metafile.Inputs[relToWorkspace] = InputEntry{
						Bytes:   int(fileInfo.Size()),
						Imports: []string{},
					}
				}
			}
		}
		
		fmt.Printf("  Found %d input files\n", len(inputs))
		
		// Create output entry
		outputPath := filepath.Join("testeranto/bundles/allTests/golang", testName+".json")
		outputEntry := OutputEntry{
			Imports:    []string{},
			Exports:    []string{},
			EntryPoint: testConfig.Path,
			Inputs:     make(map[string]InputDetail),
			Bytes:      0, // We don't generate actual output files
		}
		
		// Add all inputs to the output entry
		for _, input := range inputs {
			// Get file size for bytesInOutput
			absPath := filepath.Join("/workspace", input)
			fileInfo, err := os.Stat(absPath)
			if err == nil {
				outputEntry.Inputs[input] = InputDetail{
					BytesInOutput: int(fileInfo.Size()),
				}
				outputEntry.Bytes += int(fileInfo.Size())
			}
		}
		
		metafile.Outputs[outputPath] = outputEntry
		
		// Change back to workspace root
		os.Chdir("/workspace")
	}
	
	// Write metafile
	metafilePath := "/workspace/testeranto/metafiles/golang/allTests.json"
	
	// Ensure directory exists
	if err := os.MkdirAll(filepath.Dir(metafilePath), 0755); err != nil {
		log.Fatalf("❌ Failed to create metafile directory: %v", err)
	}
	
	// Wrap metafile in the same format as esbuild
	wrappedMetafile := map[string]interface{}{
		"errors":   []interface{}{},
		"warnings": []interface{}{},
		"metafile": metafile,
	}
	
	metafileData, err := json.MarshalIndent(wrappedMetafile, "", "  ")
	if err != nil {
		log.Fatalf("❌ Failed to marshal metafile: %v", err)
	}
	
	if err := os.WriteFile(metafilePath, metafileData, 0644); err != nil {
		log.Fatalf("❌ Failed to write metafile: %v", err)
	}
	
	fmt.Printf("\n✅ Metafile created at: %s\n", metafilePath)
	fmt.Printf("📊 Metafile contains %d inputs and %d outputs\n", len(metafile.Inputs), len(metafile.Outputs))
	
	fmt.Println("🎉 Go metafile generator completed!")
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
