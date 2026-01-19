in the primary activity bar, there are four sections:
1. "Tests" 
  - shows tests organized first by runtime (Node, Web, Python, Golang, Ruby), then by file structure
2. "Files" 
  - shows tree of files used in all tests
3. "Processes" 
  - shows live Docker containers and their status
4. "Features" 
  - shows test results from testeranto/reports/allTests/example/
  - This section integrates testeranto/bundles/allTests/node/example/Calculator.test.mjs-inputFiles.json and testeranto/reports/allTests/example/node.Calculator.test.ts.json
  - Overall it is a tree structure, first breaking down the files matching the source  code structure. The test.json should then be further broken folling the given-when-then structure. 

The "Tests" section reflects the 4 runtimes. Each test has its own section and the list of files for each is taken from a respective file:
- testeranto/bundles/allTests/golang/example/Calculator.test.go-inputFiles.json
- testeranto/bundles/allTests/node/example/Calculator.test.mjs-inputFiles.json
- testeranto/bundles/allTests/web/example/Calculator.test.mjs-inputFiles.json
- testeranto/bundles/allTests/python/example/Calculator.test.py-inputFiles.json
- testeranto/bundles/allTests/ruby/example/Calculator.test.rb-inputFiles.json

The "Results" section displays test results from JSON files in testeranto/reports/allTests/example/:
- python.Calculator.test.ts.json
- node.Calculator.test.ts.json
- etc.
