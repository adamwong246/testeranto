package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
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
	BundlePath string                            `json:"bundlePath,omitempty"`
	BundleSize int                               `json:"bundleSize,omitempty"`
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

	// Generate metafile - always generate even if there are no tests
	metafile := generateMetafile(entryPoints)

	// Write metafile
	metafilesDir := os.Getenv("METAFILES_DIR")
	if metafilesDir == "" {
		metafilesDir = "/workspace/testeranto/metafiles/golang"
	}
	// Ensure the directory exists
	if err := os.MkdirAll(metafilesDir, 0755); err != nil {
		fmt.Printf("Error creating metafiles directory: %v\n", err)
		os.Exit(1)
	}

	metafilePath := filepath.Join(metafilesDir, "allTests.json")
	if err := writeMetafile(metafilePath, metafile); err != nil {
		fmt.Printf("Error writing metafile: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Go metafile written to %s\n", metafilePath)

	// Print bundle information
	bundlesDir := os.Getenv("BUNDLES_DIR")
	if bundlesDir == "" {
		bundlesDir = "/workspace/testeranto/bundles/allTests/golang"
	}
	fmt.Printf("Go bundles written to %s\n", bundlesDir)

	// Run tests for each bundle
	// allTestsPassed := true
	// for outputKey, outputInfo := range metafile.Metafile.Outputs {
	// 	if outputInfo.BundlePath != "" {
	// 		fmt.Printf("  %s: %s\n", outputKey, outputInfo.BundlePath)
	// 		// Run the Go program
	// 		entryPoint := outputInfo.EntryPoint
	// 		if entryPoint != "" {
	// 			fmt.Printf("Running Go program for %s...\n", entryPoint)
	// 			testPassed := runGoProgram(entryPoint, outputInfo.BundlePath)
	// 			if !testPassed {
	// 				allTestsPassed = false
	// 			}
	// 			fmt.Printf("Test %s\n", map[bool]string{true: "passed", false: "failed"}[testPassed])
	// 		}
	// 	}
	// }

	// Print summary
	numInputs := len(metafile.Metafile.Inputs)
	numOutputs := len(metafile.Metafile.Outputs)
	fmt.Printf("Metafile contains %d input files and %d output bundles\n", numInputs, numOutputs)

	// Exit with appropriate code
	// if !allTestsPassed {
	// 	fmt.Println("❌ Some Go tests failed!")
	// 	os.Exit(1)
	// } else {
	// 	fmt.Println("✅ All Go tests passed!")
	// }
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

func topologicalSort(files []string) []string {
	// Build dependency graph
	graph := make(map[string]map[string]bool)
	for _, file := range files {
		graph[file] = make(map[string]bool)
	}

	for _, file := range files {
		imports := parseGoImports(file)
		for _, imp := range imports {
			if imp.External != nil && !*imp.External && imp.Path != "" {
				resolved := resolveGoImport(imp.Path, file)
				if resolved != "" {
					// Check if resolved is in our files list
					for _, f := range files {
						if f == resolved {
							graph[file][resolved] = true
							break
						}
					}
				}
			}
		}
	}

	// Kahn's algorithm
	inDegree := make(map[string]int)
	for node := range graph {
		inDegree[node] = 0
	}
	for node := range graph {
		for neighbor := range graph[node] {
			inDegree[neighbor]++
		}
	}

	// Queue of nodes with no incoming edges
	queue := []string{}
	for node := range graph {
		if inDegree[node] == 0 {
			queue = append(queue, node)
		}
	}

	sortedList := []string{}
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		sortedList = append(sortedList, node)

		for neighbor := range graph[node] {
			inDegree[neighbor]--
			if inDegree[neighbor] == 0 {
				queue = append(queue, neighbor)
			}
		}
	}

	// Check for cycles
	if len(sortedList) != len(files) {
		fmt.Println("Warning: Circular dependencies detected, using original order")
		return files
	}

	return sortedList
}

func stripImports(content string) string {
	lines := strings.Split(content, "\n")
	resultLines := []string{}
	inImportBlock := false
	inMultilineComment := false
	packageDeclarationSeen := false

	for i, line := range lines {
		trimmed := strings.TrimSpace(line)

		// Handle multiline comments
		if strings.Contains(line, "/*") && !strings.Contains(line, "*/") {
			inMultilineComment = true
		}
		if strings.Contains(line, "*/") {
			inMultilineComment = false
			// Skip the line with the closing comment
			continue
		}
		if inMultilineComment {
			continue
		}

		// Handle package declarations - keep only the first one
		if strings.HasPrefix(trimmed, "package ") {
			if !packageDeclarationSeen {
				packageDeclarationSeen = true
				resultLines = append(resultLines, lines[i])
			}
			// Skip subsequent package declarations
			continue
		}

		// Handle import statements
		if strings.HasPrefix(trimmed, "import") {
			if strings.Contains(trimmed, "(") {
				inImportBlock = true
			}
			// Skip this line
			continue
		}
		if inImportBlock {
			if trimmed == ")" {
				inImportBlock = false
			}
			// Skip lines inside import block
			continue
		}

		// Keep all other lines
		resultLines = append(resultLines, lines[i])
	}

	return strings.Join(resultLines, "\n")
}

func bundleGoFiles(entryPoint string, outputDir string) string {
	// Collect all dependencies
	allDeps := collectDependencies(entryPoint)

	// Sort them topologically
	sortedDeps := topologicalSort(allDeps)

	// Read and process each file
	bundledLines := []string{}
	seenContents := make(map[string]bool)

	for _, dep := range sortedDeps {
		content, err := os.ReadFile(dep)
		if err != nil {
			fmt.Printf("Warning: Could not read %s: %v\n", dep, err)
			continue
		}

		// Generate a hash to avoid duplicates
		hash := md5.Sum(content)
		hashStr := hex.EncodeToString(hash[:])
		if seenContents[hashStr] {
			continue
		}
		seenContents[hashStr] = true

		// Strip import statements
		strippedContent := stripImports(string(content))
		if strings.TrimSpace(strippedContent) != "" {
			bundledLines = append(bundledLines, fmt.Sprintf("// File: %s", dep))
			bundledLines = append(bundledLines, strippedContent)
			bundledLines = append(bundledLines, "") // Add a blank line between files
		}
	}

	// Combine all lines
	bundledContent := strings.Join(bundledLines, "\n")

	// Ensure output directory exists
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		fmt.Printf("Warning: Could not create output directory %s: %v\n", outputDir, err)
		return ""
	}

	// Generate output filename
	entryName := filepath.Base(entryPoint)
	if strings.HasSuffix(entryName, ".go") {
		entryName = strings.TrimSuffix(entryName, ".go")
	}
	outputFilename := fmt.Sprintf("%s.bundled.go", entryName)
	outputPath := filepath.Join(outputDir, outputFilename)

	// Write bundled file
	if err := os.WriteFile(outputPath, []byte(bundledContent), 0644); err != nil {
		fmt.Printf("Warning: Could not write bundled file %s: %v\n", outputPath, err)
		return ""
	}

	return outputPath
}

func generateMetafile(entryPoints []string) Metafile {
	inputs := make(map[string]Input)
	outputs := make(map[string]Output)

	// Generate a signature
	signature := generateSignature()

	// Bundle directory
	bundlesDir := os.Getenv("BUNDLES_DIR")
	if bundlesDir == "" {
		bundlesDir = "/workspace/testeranto/bundles/allTests/golang"
	}

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

		// Generate the bundle
		bundlePath := bundleGoFiles(entryPoint, bundlesDir)

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

		// Add bundle size
		bundleSize := 0
		if bundlePath != "" {
			if info, err := os.Stat(bundlePath); err == nil {
				bundleSize = int(info.Size())
			}
		}

		outputs[outputKey] = Output{
			Imports:    []interface{}{},
			Exports:    []interface{}{},
			EntryPoint: entryPoint,
			Inputs:     inputBytes,
			Bytes:      totalBytes,
			Signature:  signature,
			BundlePath: bundlePath,
			BundleSize: bundleSize,
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

func copyFile(src, dst string) error {
	input, err := os.ReadFile(src)
	if err != nil {
		return err
	}
	return os.WriteFile(dst, input, 0644)
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

func runGoProgram(entryPoint string, bundlePath string) bool {
	// Create report directory
	testName := filepath.Base(entryPoint)
	if strings.HasSuffix(testName, ".go") {
		testName = strings.TrimSuffix(testName, ".go")
	}

	reportDir := filepath.Join(
		"testeranto",
		"reports",
		"allTests",
		testName,
		"golang",
	)
	if err := os.MkdirAll(reportDir, 0755); err != nil {
		fmt.Printf("Error creating report directory: %v\n", err)
		return false
	}

	// Create a temporary directory for running the Go program
	tempDir, err := os.MkdirTemp("", "go-run-*")
	if err != nil {
		fmt.Printf("Error creating temp directory: %v\n", err)
		return false
	}
	defer os.RemoveAll(tempDir)

	// Copy the bundled file to the temp directory
	bundleName := filepath.Base(bundlePath)
	tempBundlePath := filepath.Join(tempDir, bundleName)
	if err := copyFile(bundlePath, tempBundlePath); err != nil {
		fmt.Printf("Error copying bundle: %v\n", err)
		return false
	}

	// Create a go.mod file in the temp directory
	goModContent := `module test

go 1.21
`
	goModPath := filepath.Join(tempDir, "go.mod")
	if err := os.WriteFile(goModPath, []byte(goModContent), 0644); err != nil {
		fmt.Printf("Error creating go.mod: %v\n", err)
		return false
	}

	// Run the program
	fmt.Printf("Running Go program: %s\n", bundlePath)
	cmd := exec.Command("go", "run", bundleName)
	cmd.Dir = tempDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		fmt.Printf("Go program execution failed: %v\n", err)
		// Create error report
		reportFile := filepath.Join(reportDir, "tests.json")
		reportContent := map[string]interface{}{
			"tests":    []interface{}{},
			"features": []interface{}{},
			"givens":   []interface{}{},
			"fullPath": entryPoint,
			"error":    err.Error(),
		}
		if jsonData, err := json.MarshalIndent(reportContent, "", "  "); err == nil {
			os.WriteFile(reportFile, jsonData, 0644)
		}
		return false
	}

	// Create success report
	reportFile := filepath.Join(reportDir, "tests.json")
	reportContent := map[string]interface{}{
		"tests":    []interface{}{},
		"features": []interface{}{},
		"givens":   []interface{}{},
		"fullPath": entryPoint,
		"success":  true,
	}
	if jsonData, err := json.MarshalIndent(reportContent, "", "  "); err == nil {
		os.WriteFile(reportFile, jsonData, 0644)
	}

	return true
}
