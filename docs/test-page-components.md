# TestPage and TestPageView Components

## Overview
These components provide a test results viewing interface that resembles VS Code, using Monaco Editor for code display and editing. The interface is split into three main sections:
1. Left sidebar: Navigation for logs, source files, and artifacts
2. Center panel: Monaco Editor for viewing and editing content
3. Right panel: Test results and artifact previews

## TestPage Component
The main container component that handles data fetching and state management.

### Key Responsibilities:
1. **Route Management**: Syncs the active tab with URL hash changes
2. **Data Fetching**: Retrieves test data, logs, and source files from the server
3. **State Management**: Maintains loading states, errors, and test metadata
4. **Source File Organization**: Builds a file tree structure from metafile data

### Props:
- Uses React Router hooks: `useNavigate`, `useLocation`, `useParams`
- No explicit props passed from parent components

### State Variables:
- `route`: Active tab ('results', 'logs', 'types', 'lint', 'coverage')
- `testName`: Name of the current test
- `logs`: Collected logs and test data
- `loading`: Data loading status
- `error`: Error information
- `testsExist`: Whether tests exist for this path
- `errorCounts`: Counts of different error types
- `summary`: Test summary data

## TestPageView Component
The presentational component that renders the VS Code-like interface.

### Key Sections:
1. **Navigation Bar**: Top bar with test name, runtime badge, and AI assistant button
2. **Sidebar**: File tree navigation for logs, source files, and artifacts
3. **Editor Panel**: Monaco Editor instance for code viewing/editing
4. **Preview Panel**: Test results and artifact previews

### Props:
```typescript
interface TestPageViewProps {
  projectName: string;
  testName: string;
  decodedTestPath: string;
  runtime: string;
  logs: Record<string, string>;
  testsExist: boolean;
  errorCounts: {
    runTimeErrors: number;
    typeErrors: number;
    staticErrors: number;
  };
}
```

### Sub-components:
1. **FileTree**: Recursive component for displaying source file hierarchy
2. **ArtifactTree**: Recursive component for displaying test artifacts
3. **LogNavItem**: Navigation items for different log types with status indicators
4. **TestStatusBadge**: Visual indicator of test status

### Monaco Editor Integration:
- Uses `@monaco-editor/react` package
- Supports multiple languages based on file extensions
- Read-only mode for non-source files
- Theme-aware (light/dark) based on application theme

## Data Flow
1. TestPage fetches data on mount using test parameters from URL
2. Data is processed and organized into a structured format
3. TestPageView receives processed data and renders the interface
4. User interactions update the active tab and selected file
5. Monaco Editor displays the content of selected files

## Future VS Code-like Enhancements
1. **Multi-tab Editor**: Support opening multiple files in tabs
2. **File Operations**: Create, rename, delete files in the file tree
3. **Terminal Integration**: Built-in terminal for command execution
4. **Git Integration**: Source control indicators and operations
5. **Extensions**: Plugin system for additional functionality
6. **Workspace Management**: Save and restore editor layouts
7. **Command Palette**: Quick access to actions via keyboard
8. **Settings**: Customizable editor preferences

## Key Dependencies
- React Router: Navigation and routing
- Monaco Editor: Code editing functionality
- React Bootstrap: UI components and layout
- Custom hooks for WebSocket connections and state management
