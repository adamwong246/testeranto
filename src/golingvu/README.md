# Golingvu - Testeranto Implementation for Go

## Understanding the Build Process

The build process in Testeranto is inspired by esbuild's approach to bundling and metafile generation, adapted for multiple programming languages including Go, Python, and JavaScript variants.

### Core Concepts

#### 1. Metafile Generation
Each language implementation generates a `core.json` metafile that tracks:
- **Inputs**: Source files with their dependencies (imports) and metadata
- **Outputs**: Generated/bundled files with their relationships to inputs
- **Signatures**: Unique identifiers to track changes and trigger rebuilds

#### 2. File Watching
Two separate watchers work in tandem:
1. **Source Watcher**: Monitors source files for changes and triggers metafile regeneration
2. **Bundle Watcher**: Monitors generated files and schedules test execution when signatures change

#### 3. Signature-based Change Detection
- Each output file contains a unique signature in a comment
- When source files change, new signatures are generated
- Bundle watcher detects signature changes to trigger test execution

### How esbuild's Approach is Adapted

#### Original esbuild Flow:
1. Parse entry points and resolve imports
2. Bundle dependencies into output files
3. Generate metafile with input/output relationships
4. Watch for file changes and rebuild

#### Testeranto Adaptation:
1. **For each language**: Parse entry points and track dependencies
2. **Instead of bundling**: Generate wrapper files that import/run the original tests
3. **Generate metafile**: Track relationships between source files and generated wrappers
4. **Watch system**: Dual watchers for source changes and bundle updates

### Implementation Pattern for New Languages

To add support for a new language (e.g., Rust, Java, C#), follow this pattern:

#### 1. Metafile Generator (`src/utils/[language]Metafile.ts`)
```typescript
export async function generate[Language]Metafile(
  testName: string,
  entryPoints: string[]
): Promise<[Language]Metafile> {
  // Parse entry point files to find imports/dependencies
  // Generate unique signature
  // Return metafile structure with inputs and outputs
}

export function write[Language]Metafile(
  testName: string,
  metafile: [Language]Metafile
): void {
  // Write metafile to disk
  // Generate output wrapper files with signatures
}
```

#### 2. File Watcher (`src/utils/[language]Watcher.ts`)
```typescript
export class [Language]Watcher {
  async start() {
    // Set up source file watcher
    // Set up bundle file watcher
    // Handle file change events
  }
  
  private async regenerateMetafile() {
    // Regenerate metafile and output files
  }
}
```

#### 3. Language-specific Types (`src/[language]/types.[ext]`)
Define interfaces for:
- Test adapters
- Resource configurations
- Base test components (Given, When, Then)

#### 4. Process Manager (`src/[language]/PM/[language].go`)
Implement process communication for:
- Starting/stopping tests
- IPC communication
- Resource management

### Key Implementation Details

#### Signature Handling
- Use timestamp-based or content-hash signatures
- Embed signatures in comments to avoid breaking code
- Ensure consistent output filenames for reliable watching

#### File Watching Strategy
- Use `chokidar` for Node.js-based watching
- Implement polling for reliability across filesystems
- Handle edge cases: file deletions, renames, permission changes

#### Metafile Structure
```json
{
  "errors": [],
  "warnings": [],
  "metafile": {
    "inputs": {
      "path/to/file.ext": {
        "bytes": 1024,
        "imports": ["dependency1", "dependency2"]
      }
    },
    "outputs": {
      "output/path/file.ext": {
        "imports": [],
        "exports": [],
        "entryPoint": "original/file.ext",
        "inputs": {
          "original/file.ext": {
            "bytesInOutput": 1024
          }
        },
        "bytes": 1024,
        "signature": "unique_id"
      }
    }
  }
}
```

### Current Language Implementations

#### Go (Golingvu)
- **Entry points**: `.go` files with test functions
- **Output**: Wrapper files that run `go test`
- **Signature**: Timestamp in comments

#### Python (Pitono)
- **Entry points**: `.py` files with test cases
- **Output**: Python modules with test runners
- **Signature**: Content hash or timestamp

#### JavaScript/TypeScript
- **Entry points**: `.js`/`.ts` files
- **Output**: Bundled JavaScript with esbuild
- **Signature**: Integrated into build process

### Common Challenges and Solutions

1. **File Change Detection**
   - Use polling with appropriate intervals
   - Handle filesystem event limitations
   - Implement manual fallback checks

2. **Dependency Resolution**
   - Parse language-specific import syntax
   - Handle relative vs absolute imports
   - Account for language-specific module systems

3. **Cross-platform Compatibility**
   - Normalize file paths
   - Handle different line endings
   - Account for filesystem case sensitivity

4. **Performance**
   - Debounce file change events
   - Cache parsing results where possible
   - Use efficient data structures for dependency tracking

### Testing the Implementation

For each new language, verify:
1. Source file changes trigger metafile regeneration
2. Bundle file changes trigger test execution
3. Signatures are properly updated and detected
4. All file paths are handled consistently
5. Error cases are properly handled (missing files, parse errors)

### Future Considerations

- **Incremental builds**: Only rebuild changed portions
- **Dependency caching**: Store parsed dependencies to avoid re-parsing
- **Cross-language dependencies**: Handle cases where tests in one language depend on another
- **Remote execution**: Support running tests in containers or remote environments

This pattern allows Testeranto to maintain a consistent architecture while supporting multiple programming languages, each with their own unique characteristics and requirements.
