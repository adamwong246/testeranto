# Testeranto VS Code Extension

This extension integrates the Testeranto testing framework into VS Code, providing a seamless testing experience for polyglot projects.

## Features

- **Test Explorer**: View all test files in your workspace
- **Run Tests**: Execute tests directly from the editor
- **Context Menu**: Right-click on test files to run them
- **Real-time Feedback**: See test results in the integrated terminal

## Installation

1. Build the extension:
   ```bash
   npm run bundle
   ```

2. Package the extension (optional):
   ```bash
   npm run package
   ```

3. Install the `.vsix` file in VS Code:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Click "..." and select "Install from VSIX..."
   - Choose the generated `.vsix` file

## Usage

### Running Tests

1. **Run all tests**: Use the command palette (Ctrl+Shift+P) and type "Testeranto: Run Tests"
2. **Run specific test file**: 
   - Open the Test Explorer in the activity bar
   - Click the play button next to any test file
   - Or right-click on a test file in the editor and select "Run Test"

### Test Explorer

The Test Explorer shows all test files found in your workspace, organized by directory. It automatically detects files with `.test.` or `.spec.` in their names.

## Configuration

The extension can be configured through VS Code settings:

- `testeranto.testDirectory`: Directory containing test files (default: `./tests`)
- `testeranto.autoRun`: Automatically run tests on file changes (default: `false`)

## Development

### Debugging

1. Open the project in VS Code
2. Press F5 to launch the extension in a new window
3. Use the Debug Console to see extension logs

### Building

```bash
npm run bundle
```

This will compile the TypeScript files and bundle them for the extension.

## Requirements

- Node.js >= 20.19.0
- VS Code >= 1.60.0

## License

MIT
