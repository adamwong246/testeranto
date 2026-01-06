package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// Config represents the structure of allTests.json
type Config struct {
	Golang struct {
		Tests map[string]struct {
			Ports int `json:"ports"`
		} `json:"tests"`
	} `json:"golang"`
}

// Metafile represents the generated metafile structure
type Metafile struct {
	Errors   []interface{} `json:"errors"`
	Warnings []interface{} `json:"warnings"`
	Metafile struct {
		Inputs  map[string]Input  `json:"inputs"`
		Outputs map[string]Output `json:"outputs"`
	} `json:"metafile"`
}

type Input struct {
	Bytes   int          `json:"bytes"`
	Imports []ImportInfo `json:"imports"`
}

type ImportInfo struct {
	Path     string `json:"path"`
	Kind     string `json:"kind"`
	External *bool  `json:"external,omitempty"`
}

type Output struct {
	Imports    []interface{}                     `json:"imports"`
	Exports    []interface{}                     `json:"exports"`
	EntryPoint string                            `json:"entryPoint"`
	Inputs     map[string]map[string]interface{} `json:"inputs"`
	Bytes      int                               `json:"bytes"`
	Signature  string                            `json:"signature"`
}

func main() {
	// Determine config path
	configPath := findConfig()
	if configPath == "" {
		fmt.Println("Error: allTests.json not found")
		fmt.Println("Command line arguments:", os.Args)
		fmt.Println("Current directory:", getCurrentDir())
		// List files in workspace
		fmt.Println("Listing /workspace/testeranto/:")
		if entries, err := os.ReadDir("/workspace/testeranto"); err == nil {
			for _, entry := range entries {
				fmt.Println("  ", entry.Name())
			}
		}
		os.Exit(1)
	}

	fmt.Printf("Reading config from %s\n", configPath)

	config, err := loadConfig(configPath)
	if err != nil {
		fmt.Printf("Error loading config: %v\n", err)
		os.Exit(1)
	}

	// Get Go test entry points
	entryPoints := make([]string, 0, len(config.Golang.Tests))
	for entryPoint := range config.Golang.Tests {
		entryPoints = append(entryPoints, entryPoint)
	}

	fmt.Printf("Found %d Go test(s)\n", len(entryPoints))

	// Generate metafile
	metafile := generateMetafile(entryPoints)

	// Write metafile
	metafilesDir := os.Getenv("METAFILES_DIR")
	if metafilesDir == "" {
		metafilesDir = "/workspace/testeranto/metafiles/golang"
	}
	// if err := os.MkdirAll(metafilesDir, 0755); err != nil {
	// 	fmt.Printf("Error creating metafiles directory: %v\n", err)
	// 	os.Exit(1)
	// }

	metafilePath := filepath.Join(metafilesDir, "allTests.json")
	if err := writeMetafile(metafilePath, metafile); err != nil {
		fmt.Printf("Error writing metafile: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Go metafile written to %s\n", metafilePath)

	// Print summary
	numInputs := len(metafile.Metafile.Inputs)
	numOutputs := len(metafile.Metafile.Outputs)
	fmt.Printf("Metafile contains %d input files and %d output bundles\n", numInputs, numOutputs)
}

func findConfig() string {
	// Check command line argument first
	if len(os.Args) > 1 {
		if _, err := os.Stat(os.Args[1]); err == nil {
			return os.Args[1]
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
		if _, err := os.Stat(path); err == nil {
			return path
		}
	}
	return ""
}

func loadConfig(path string) (*Config, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var config Config
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		return nil, err
	}
	return &config, nil
}

func writeMetafile(path string, metafile Metafile) error {
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	return encoder.Encode(metafile)
}

func generateMetafile(entryPoints []string) Metafile {
	inputs := make(map[string]Input)
	outputs := make(map[string]Output)

	// Generate a signature
	signature := generateSignature()

	for _, entryPoint := range entryPoints {
		if _, err := os.Stat(entryPoint); err != nil {
			fmt.Printf("Warning: Entry point %s does not exist\n", entryPoint)
			continue
		}

		// Collect all dependencies
		allDeps := collectDependencies(entryPoint)

		// Add to inputs
		for _, dep := range allDeps {
			if _, exists := inputs[dep]; !exists {
				bytes, _ := fileSize(dep)
				imports := parseGoImports(dep)
				inputs[dep] = Input{
					Bytes:   bytes,
					Imports: imports,
				}
			}
		}

		// Generate output key
		entryName := filepath.Base(entryPoint)
		if strings.HasSuffix(entryName, ".go") {
			entryName = strings.TrimSuffix(entryName, ".go")
		}
		outputKey := fmt.Sprintf("golang/%s.go", entryName)

		// Calculate input bytes
		inputBytes := make(map[string]map[string]interface{})
		totalBytes := 0
		for _, dep := range allDeps {
			bytes, _ := fileSize(dep)
			inputBytes[dep] = map[string]interface{}{
				"bytesInOutput": bytes,
			}
			totalBytes += bytes
		}

		outputs[outputKey] = Output{
			Imports:    []interface{}{},
			Exports:    []interface{}{},
			EntryPoint: entryPoint,
			Inputs:     inputBytes,
			Bytes:      totalBytes,
			Signature:  signature,
		}
	}

	metafile := Metafile{
		Errors:   []interface{}{},
		Warnings: []interface{}{},
		Metafile: struct {
			Inputs  map[string]Input  `json:"inputs"`
			Outputs map[string]Output `json:"outputs"`
		}{
			Inputs:  inputs,
			Outputs: outputs,
		},
	}
	return metafile
}

func generateSignature() string {
	hash := md5.New()
	hash.Write([]byte(fmt.Sprintf("%d", os.Getpid())))
	hash.Write([]byte(time.Now().String()))
	return hex.EncodeToString(hash.Sum(nil))[:8]
}

func fileSize(path string) (int, error) {
	info, err := os.Stat(path)
	if err != nil {
		return 0, err
	}
	return int(info.Size()), nil
}

func collectDependencies(filePath string) []string {
	visited := make(map[string]bool)
	return collectDependenciesRecursive(filePath, visited)
}

func collectDependenciesRecursive(filePath string, visited map[string]bool) []string {
	if visited[filePath] {
		return []string{}
	}
	visited[filePath] = true

	dependencies := []string{filePath}
	imports := parseGoImports(filePath)

	for _, imp := range imports {
		if imp.External != nil && !*imp.External && imp.Path != "" {
			resolved := resolveGoImport(imp.Path, filePath)
			if resolved != "" {
				if _, err := os.Stat(resolved); err == nil {
					dependencies = append(dependencies, collectDependenciesRecursive(resolved, visited)...)
				}
			}
		}
	}

	// Remove duplicates
	seen := make(map[string]bool)
	unique := []string{}
	for _, dep := range dependencies {
		if !seen[dep] {
			seen[dep] = true
			unique = append(unique, dep)
		}
	}
	return unique
}

func parseGoImports(filePath string) []ImportInfo {
	if !strings.HasSuffix(filePath, ".go") {
		return []ImportInfo{}
	}

	file, err := os.Open(filePath)
	if err != nil {
		fmt.Printf("Warning: Could not read %s: %v\n", filePath, err)
		return []ImportInfo{}
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		fmt.Printf("Warning: Could not read %s: %v\n", filePath, err)
		return []ImportInfo{}
	}

	imports := []ImportInfo{}
	lines := strings.Split(string(content), "\n")
	inImportBlock := false

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "import") {
			if strings.Contains(trimmed, "(") {
				inImportBlock = true
			} else {
				// Single line import
				path := extractImportPath(trimmed)
				if path != "" {
					external := isExternalImport(path)
					imports = append(imports, ImportInfo{
						Path:     path,
						Kind:     "import-statement",
						External: &external,
					})
				}
			}
		} else if inImportBlock {
			if trimmed == ")" {
				inImportBlock = false
			} else if !strings.HasPrefix(trimmed, "//") && trimmed != "" {
				path := extractImportPath(trimmed)
				if path != "" {
					external := isExternalImport(path)
					imports = append(imports, ImportInfo{
						Path:     path,
						Kind:     "import-statement",
						External: &external,
					})
				}
			}
		}
	}

	return imports
}

func extractImportPath(line string) string {
	// Look for quoted import path
	start := strings.Index(line, `"`)
	if start == -1 {
		return ""
	}
	end := strings.Index(line[start+1:], `"`)
	if end == -1 {
		return ""
	}
	return line[start+1 : start+1+end]
}

func isExternalImport(importPath string) bool {
	// Check if it's a standard library import (no dots in first path element)
	firstPart := strings.Split(importPath, "/")[0]
	return strings.Contains(firstPart, ".")
}

func getCurrentDir() string {
	dir, err := os.Getwd()
	if err != nil {
		return fmt.Sprintf("error: %v", err)
	}
	return dir
}

func resolveGoImport(importPath, currentFile string) string {
	// Simple resolution: look in vendor directory and current directory
	currentDir := filepath.Dir(currentFile)

	// Check vendor directory
	vendorPath := filepath.Join(currentDir, "vendor", importPath)
	if _, err := os.Stat(vendorPath + ".go"); err == nil {
		return vendorPath + ".go"
	}
	if _, err := os.Stat(vendorPath); err == nil {
		// Look for .go files in the directory
		files, err := os.ReadDir(vendorPath)
		if err == nil {
			for _, file := range files {
				if strings.HasSuffix(file.Name(), ".go") && !strings.HasSuffix(file.Name(), "_test.go") {
					return filepath.Join(vendorPath, file.Name())
				}
			}
		}
	}

	// Check relative to current directory
	relativePath := filepath.Join(currentDir, importPath)
	if _, err := os.Stat(relativePath + ".go"); err == nil {
		return relativePath + ".go"
	}

	// Check GOPATH
	gopath := os.Getenv("GOPATH")
	if gopath != "" {
		gopathPath := filepath.Join(gopath, "src", importPath)
		if _, err := os.Stat(gopathPath + ".go"); err == nil {
			return gopathPath + ".go"
		}
	}

	return ""
}
