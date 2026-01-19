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
)

// Package struct maps the fields we need from 'go list'
type Package struct {
	ImportPath   string   `json:"ImportPath"`
	Dir          string   `json:"Dir"`
	GoFiles      []string `json:"GoFiles"`
	CgoFiles     []string `json:"CgoFiles"`
	CFiles       []string `json:"CFiles"`
	CXXFiles     []string `json:"CXXFiles"`
	HFiles       []string `json:"HFiles"`
	SFiles       []string `json:"SFiles"`
	SwigFiles    []string `json:"SwigFiles"`
	SwigCXXFiles []string `json:"SwigCXXFiles"`
	SysoFiles    []string `json:"SysoFiles"`
	EmbedFiles   []string `json:"EmbedFiles"`
	TestGoFiles  []string `json:"TestGoFiles"`
	Module       *struct {
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

		// Get test file name and base name early
		testFileName := filepath.Base(testName)
		testBaseName := strings.TrimSuffix(testFileName, filepath.Ext(testFileName))
		
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
		// This is used for metadata and potentially other purposes
		relPath, err := filepath.Rel(moduleRoot, testSourceDir)
		if err != nil {
			log.Printf("⚠️  Cannot get relative path from %s to %s: %v", moduleRoot, testSourceDir, err)
			os.Chdir("/workspace")
			continue
		}
		// Use relPath in metadata to track the test source location
		_ = relPath // Mark as used to avoid compiler warning

		// First, ensure go.mod is tidy
		fmt.Printf("  Running go mod tidy...\n")
		tidyCmd := exec.Command("go", "mod", "tidy")
		tidyCmd.Stdout = os.Stdout
		tidyCmd.Stderr = os.Stderr
		if err := tidyCmd.Run(); err != nil {
			fmt.Printf("  ⚠️  go mod tidy failed: %v\n", err)
			// Continue anyway
		}
		
		// Use go list to get all dependencies from the module root
		// Using "." includes all packages in the current module
		// Add -tags=testeranto to include files with testeranto build tag
		listArgs := []string{"list", "-tags", "testeranto", "-json", "-deps", "."}
		fmt.Printf("  Running: go %s\n", strings.Join(listArgs, " "))
		listCmd := exec.Command("go", listArgs...)
		output, err := listCmd.Output()
		if err != nil {
			if exitErr, ok := err.(*exec.ExitError); ok {
				fmt.Printf("  ⚠️  go list stderr: %s\n", string(exitErr.Stderr))
			}
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

			// Check if package is under workspace (not standard library)
			isUnderWorkspace := false
			if rel, err := filepath.Rel("/workspace", pkg.Dir); err == nil && !strings.HasPrefix(rel, "..") {
				isUnderWorkspace = true
			}

			if !isUnderWorkspace {
				continue
			}

			// Helper function to add files to inputs
			addFiles := func(files []string, fileType string) {
				for _, file := range files {
					absPath := filepath.Join(pkg.Dir, file)
					relToWorkspace, err := filepath.Rel("/workspace", absPath)
					if err != nil {
						relToWorkspace = absPath
					}
					if !strings.HasPrefix(relToWorkspace, "..") {
						inputs = append(inputs, relToWorkspace)
						fmt.Printf("        Added %s: %s\n", fileType, relToWorkspace)
					}
				}
			}

			// Add all relevant source files
			addFiles(pkg.GoFiles, "Go")
			addFiles(pkg.CgoFiles, "Cgo")
			addFiles(pkg.CFiles, "C")
			addFiles(pkg.CXXFiles, "CXX")
			addFiles(pkg.HFiles, "H")
			addFiles(pkg.SFiles, "S")
			addFiles(pkg.SwigFiles, "Swig")
			addFiles(pkg.SwigCXXFiles, "SwigCXX")
			addFiles(pkg.SysoFiles, "Syso")
			addFiles(pkg.EmbedFiles, "Embed")
			addFiles(pkg.TestGoFiles, "TestGo")
		}

		// Add go.mod and go.sum from the module root
		// Note: moduleRoot is already found earlier, use it
		if moduleRoot != "" {
			goModPath := filepath.Join(moduleRoot, "go.mod")
			goSumPath := filepath.Join(moduleRoot, "go.sum")

			// Check if files exist and add them
			for _, filePath := range []string{goModPath, goSumPath} {
				if _, err := os.Stat(filePath); err == nil {
					relToWorkspace, err := filepath.Rel("/workspace", filePath)
					if err == nil && !strings.HasPrefix(relToWorkspace, "..") {
						// Check if not already in inputs
						alreadyAdded := false
						for _, existing := range inputs {
							if existing == relToWorkspace {
								alreadyAdded = true
								break
							}
						}
						if !alreadyAdded {
							inputs = append(inputs, relToWorkspace)
							fmt.Printf("        Added config: %s\n", relToWorkspace)
						}
					}
				}
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
		inputFilesPath := filepath.Join(artifactsDir, testBaseName+".go-inputFiles.json")

		// Create inputFiles.json content - just the inputs array
		inputFilesJSON, err := json.MarshalIndent(inputs, "", "  ")
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

		// Compile the test to a binary
		// The binary should be placed in the same directory as inputFiles.json
		// Use a unique name based on the test file (testBaseName is already defined)
		outputExePath := filepath.Join(artifactsDir, testBaseName+".exe")

		// Change to the module root to compile
		if err := os.Chdir(moduleRoot); err != nil {
			log.Printf("⚠️  Failed to change to module root %s: %v", moduleRoot, err)
			os.Chdir("/workspace")
			continue
		}

		// Build the package containing the test file
		// testName is the path to the test file, get its directory
		testFilePath := testName // testName is the key, which should be the path to the test file

		// Check if test file exists
		absTestPath := filepath.Join("/workspace", testFilePath)
		if _, err := os.Stat(absTestPath); err != nil {
			log.Printf("⚠️  Test file %s does not exist: %v", absTestPath, err)
			os.Chdir("/workspace")
			continue
		}

		// Get the directory containing the test file
		// testFileName and testBaseName are already defined at the beginning of the loop

		// Build directly in the module root directory
		if err := os.Chdir(moduleRoot); err != nil {
			log.Printf("⚠️  Failed to change to module root %s: %v", moduleRoot, err)
			os.Chdir("/workspace")
			continue
		}

		// Build the test file directly
		// Use the relative path from module root to the test file
		relTestPath, err := filepath.Rel(moduleRoot, absTestPath)
		if err != nil {
			log.Printf("⚠️  Failed to get relative path for %s: %v", testName, err)
			os.Chdir("/workspace")
			continue
		}

		// Create the output directory if it doesn't exist
		if err := os.MkdirAll(filepath.Dir(outputExePath), 0755); err != nil {
			log.Printf("⚠️  Failed to create output directory: %v", err)
			os.Chdir("/workspace")
			continue
		}

		// Build the test
		buildCmd := exec.Command("go", "build", "-tags", "testeranto", "-o", outputExePath, relTestPath)
		buildCmd.Stdout = os.Stdout
		buildCmd.Stderr = os.Stderr

		fmt.Printf("  🔨 Compiling test %s to %s...\n", relTestPath, outputExePath)
		if err := buildCmd.Run(); err != nil {
			log.Printf("⚠️  Failed to compile test %s: %v", testName, err)
			// Print more details about the error
			if exitErr, ok := err.(*exec.ExitError); ok {
				fmt.Printf("  ⚠️  Build stderr: %s\n", string(exitErr.Stderr))
			}
		} else {
			fmt.Printf("  ✅ Successfully compiled to %s\n", outputExePath)
		}

		// Change back to workspace root
		os.Chdir("/workspace")
	}

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

// TestConfig represents configuration for a single test
type TestConfig struct {
	Path string `json:"path"`
}

// GolangConfig represents the Go-specific configuration
type GolangConfig struct {
	Tests map[string]TestConfig `json:"tests"`
}

// Config represents the overall configuration
type Config struct {
	Golang GolangConfig `json:"golang"`
}

func copyFile(src, dst string) error {
	input, err := os.ReadFile(src)
	if err != nil {
		return err
	}
	// Ensure the destination directory exists
	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}
	return os.WriteFile(dst, input, 0644)
}

func copyDir(src, dst string) error {
	// Get properties of source dir
	info, err := os.Stat(src)
	if err != nil {
		return err
	}
	
	// Create the destination directory
	if err := os.MkdirAll(dst, info.Mode()); err != nil {
		return err
	}
	
	// Read the source directory
	entries, err := os.ReadDir(src)
	if err != nil {
		return err
	}
	
	for _, entry := range entries {
		srcPath := filepath.Join(src, entry.Name())
		dstPath := filepath.Join(dst, entry.Name())
		
		if entry.IsDir() {
			if err := copyDir(srcPath, dstPath); err != nil {
				return err
			}
		} else {
			if err := copyFile(srcPath, dstPath); err != nil {
				return err
			}
		}
	}
	return nil
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
		fmt.Printf("[INFO]   - %s (path: %s)\n", testName, testConfig.Path)
	}

	return &config, nil
}
