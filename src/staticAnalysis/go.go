// Go static analysis
// This is a runtime-native check file that will be executed by the analysis service
// It receives the metafile path as the first argument
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

type Metafile struct {
	Inputs map[string]interface{} `json:"inputs"`
}

type AnalysisResult struct {
	GoVet       string `json:"go_vet,omitempty"`
	StaticCheck string `json:"staticcheck,omitempty"`
	Summary     struct {
		TotalFiles    int `json:"total_files"`
		AnalyzedFiles int `json:"analyzed_files"`
		Errors        int `json:"errors"`
		Warnings      int `json:"warnings"`
	} `json:"summary"`
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run go.go <metafile-path>")
		os.Exit(1)
	}

	metafilePath := os.Args[1]
	fmt.Println("Go static analysis starting...")

	// Read metafile
	data, err := ioutil.ReadFile(metafilePath)
	if err != nil {
		fmt.Printf("Error reading metafile: %v\n", err)
		os.Exit(1)
	}

	var metafile Metafile
	if err := json.Unmarshal(data, &metafile); err != nil {
		fmt.Printf("Error parsing metafile: %v\n", err)
		os.Exit(1)
	}

	// Collect Go files
	var goFiles []string
	for file := range metafile.Inputs {
		if filepath.Ext(file) == ".go" {
			goFiles = append(goFiles, file)
		}
	}

	fmt.Printf("Found %d Go files in metafile\n", len(goFiles))

	results := AnalysisResult{}
	results.Summary.TotalFiles = len(goFiles)

	if len(goFiles) == 0 {
		fmt.Println("No Go files found for analysis")
		outputResults(results)
		return
	}

	// Run go vet
	fmt.Println("Running go vet...")
	vetCmd := exec.Command("go", append([]string{"vet"}, goFiles...)...)
	vetOutput, vetErr := vetCmd.CombinedOutput()
	results.GoVet = string(vetOutput)
	
	if vetErr != nil {
		// Count lines with "error:" in vet output
		errorCount := strings.Count(results.GoVet, "error:")
		results.Summary.Errors += errorCount
		results.Summary.AnalyzedFiles += len(goFiles)
	}

	// Run staticcheck if available
	fmt.Println("Checking for staticcheck...")
	staticcheckCmd := exec.Command("which", "staticcheck")
	if _, err := staticcheckCmd.CombinedOutput(); err == nil {
		fmt.Println("Running staticcheck...")
		staticcheckCmd := exec.Command("staticcheck", goFiles...)
		staticcheckOutput, staticcheckErr := staticcheckCmd.CombinedOutput()
		results.StaticCheck = string(staticcheckOutput)
		
		if staticcheckErr != nil {
			// Count lines in staticcheck output (each line is usually an issue)
			lineCount := len(strings.Split(strings.TrimSpace(results.StaticCheck), "\n"))
			if lineCount > 0 && results.StaticCheck != "" {
				results.Summary.Errors += lineCount
			}
		}
	} else {
		fmt.Println("staticcheck not available, skipping...")
	}

	fmt.Println("Go static analysis completed")
	fmt.Printf("Summary: %d errors, %d warnings\n", results.Summary.Errors, results.Summary.Warnings)

	outputResults(results)
	
	// Exit with non-zero code if there are errors
	if results.Summary.Errors > 0 {
		os.Exit(1)
	}
}

func outputResults(results AnalysisResult) {
	jsonResults, err := json.MarshalIndent(results, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling results: %v\n", err)
		os.Exit(1)
	}
	fmt.Println(string(jsonResults))
}
