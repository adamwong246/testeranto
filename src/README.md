# Testeranto src

## "git integration" initiative

The next phase will integrate the frontend with git using our existing technology stack.

### Operational Modes
1. **Static Mode**: Read-only access to local files. Aider cannot run. No server component.
2. **Development Mode**: Full read/write access to local files. Aider runs locally with server.
3. **Git Remote Mode**: Read/write via Git to remote repositories. Cannot run Aider. No server component.

### Technical Approach
- **Git Client**: Use `isomorphic-git` for browser-compatible Git operations
- **UI Inspiration**: Follow GitHub Desktop's proven simplified Git interface
- **VSCode Integration**: Use `@vscode/webview-ui-toolkit` components when in VSCode
- **Editor Integration**: Extend Monaco editor for diff viewing and conflict resolution

### GitHub Desktop-inspired Features
- **Visual File Status**: Color-coded indicators for file changes
- **Simple Staging**: Checkbox interface for staging changes
- **Commit Flow**: Summary and description fields like GitHub Desktop
- **Branch Management**: Visual branch indicators and switcher
- **Sync Status**: Clear ahead/behind remote indicators
- **Conflict Resolution**: Guided resolution workflow

### Key Considerations
- Aider requires staged files to be visible
- Design for non-coders with GitHub Desktop's proven mental model
- Maintain VSCode visual consistency when running as extension
- Provide fallback UI for standalone usage
- Focus on core "changes → commit → sync" workflow first

## Git Integration Status

The Git integration is now partially implemented with the following features:

### ✅ Implemented Features
1. **Navigation**: Git icon in sidebar linking to `/git` route
2. **UI Layout**: Three-column GitHub Desktop-inspired interface
3. **Mode Detection**: Automatic mode switching based on WebSocket connection
4. **File Service**: Unified API for file operations across different modes
5. **Basic Operations**: Commit, push, and pull functionality stubs
6. **Status Display**: File changes, branch info, and remote status

### 🔄 Current Implementation
- **Static Mode**: Read-only file access (when WebSocket is disconnected)
- **Development Mode**: Full file operations via server API (when WebSocket is connected)
- **Git Mode**: Stub implementation ready for `isomorphic-git` integration

### 🚧 Next Steps
1. **Integrate isomorphic-git**: Implement actual Git operations in Git mode
2. **Server API**: Create endpoints for Development mode file operations
3. **IndexedDB Setup**: Configure storage for browser-based Git operations
4. **Conflict Resolution**: Build visual diff and merge tools
5. **Authentication**: Add support for Git remote authentication
6. **Performance**: Optimize file operations and caching

### 📁 New Files Added
- `src/services/FileService.ts` - Unified file operation interface
- `src/components/stateful/GitIntegrationPage.tsx` - Page component
- `src/components/pure/GitIntegrationView.tsx` - Main Git interface
- `src/hooks/useGitMode.ts` - Mode management hook
- `src/utils/gitTest.ts` - Integration test utility

## imports

External packages are imported first, then local files. Sort these local import statements by "distance" from the current file.

## runtimes

there are 3 runtimes- web, node and pure. They all produce a file `exit.log` which describes the final output, or error of a test.

This file will capture all uncaught errors.

If the last line in this file is '0', the test has passed.
If the last line in this file is a number N greater then zero, the test has run to completion, but failed N times.
If the last line in this file is a number N less then zero, the test has run errored with code N.

### web

- runs via node spawn on v8.
- for test subjects which use native packages. (fs, crypto)
- automatically produces creates logs:
  -- exit.log
  -- stdout.log
  -- stderr.log

### browser

- runs via chrome via puppeteer.
- for test subjects which use client globals (window, document)
- automatically produces creates logs:
  -- exit.log
  -- error.log
  -- warn.log
  -- info.log
  -- debug.log

### pure

- runs in the main process via dynamic import
- for test subjects which use no platform specific features.
- it does not have access to IO, and thus produces no logs automatically. A warning will be shown during the bundle process and calls to console.log will spew into main thread.
- automatically produces creates logs:
  -- exit.log

## metafile

The metafile is extra data emitted by the bundling process. Through it, the src files of a test can be ascertained. There is 1 metafile for each of the runtimes. Each is emitted into testeranto/metafiles/runtime/:project.json

## features reporter

The report app is capable of showing the features and documentation "collated" into a single place. This is a feature of the React app and has its own route. The `FeaturesReporter` component gathers all the features from all `tests.json` files across all projects, along with the status of individual tests and larger jobs. Maintaining the original file structures, it displays all these features and statuses in a single view, providing a comprehensive overview of the testing landscape. This view takes the list of tests and using the file structures, shows each test as an entry in a tree matching the source code directories.

## Unified Test Editor

The test editor combines file navigation, code editing, and test visualization in a single unified interface:

- **Three-panel layout**:
  1. File Navigator - Project directory structure with test files
  2. Code Editor - Monaco-based editor for viewing/editing files
  3. Preview Panel - Context-aware visualization:
     - For `tests.json`: Interactive test results GUI
     - For other files: Raw content display

Key features:

- Single interface for both test results and test development
- Monaco editor integration for all file types
- Preserved test visualization capabilities
- Unified file navigation experience
- Automatic preview switching based on file type

## File Fetching Strategy

### Centralized File Service
To address the current ad-hoc file fetching approach, we'll implement a unified `FileService` that handles all file operations consistently across the application.

```typescript
interface FileService {
  // Read operations
  readFile(path: string): Promise<string>
  readDirectory(path: string): Promise<FileEntry[]>
  exists(path: string): Promise<boolean>
  
  // Write operations (mode-dependent)
  writeFile(path: string, content: string): Promise<void>
  createDirectory(path: string): Promise<void>
  deleteFile(path: string): Promise<void>
  
  // Git integration
  getFileStatus(path: string): Promise<FileStatus>
  getChanges(): Promise<FileChange[]>
}

interface FileEntry {
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  modified?: Date
}

interface FileStatus {
  status: 'unchanged' | 'modified' | 'added' | 'deleted' | 'conflicted'
}

interface FileChange extends FileStatus {
  path: string
  diff?: string
}
```

### Mode-Specific Implementations
The FileService will have different implementations based on the current mode:

1. **Static Mode**: Read-only filesystem access
2. **Development Mode**: Full filesystem access
3. **Git Remote Mode**: Git-based file operations via isomorphic-git

### Benefits
- **Consistency**: Uniform API for all file operations
- **Maintainability**: Single source of truth for file handling logic
- **Testability**: Easy to mock and test file operations
- **Mode Awareness**: Automatic behavior adaptation based on current mode
- **Error Handling**: Centralized error management and recovery

### Integration Points
- Replace all ad-hoc fetch calls with FileService methods
- Update existing components to use the new service
- Add proper error handling and loading states
- Implement caching where appropriate for performance

## Core Testing Principles

1. Tests follow BDD structure with Given/When/Then
2. All tests are strongly typed using I/O/M types
3. Test files are organized in a consistent structure:
   /src
   TEST_SUBJECT.ts
   TEST_SUBJECT.test/
   implementation.ts - Concrete test operations
   specification.ts - Test scenarios and assertions  
    adapter.ts - Test lifecycle hooks
   types.ts - Type definitions
   index.ts - Main test export
4. If the test subject is an abstract class, implement this simplest possible mock, and test that mock.
