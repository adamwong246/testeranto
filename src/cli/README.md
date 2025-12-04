# TUI Framework for Commander Programs

This module provides a generic Terminal User Interface (TUI) framework that wraps Commander.js programs, offering a dual CLI/TUI experience. The TUI features a vim-like command bar that dynamically reflects available commands and allows seamless interaction with the underlying Commander program.

## Overview

The framework bridges the gap between traditional command-line interfaces and interactive terminal applications. Developers can write standard Commander programs, and users can interact with them either through the traditional CLI or through an intuitive TUI that provides:

- A dynamic command bar showing available commands based on context
- Visual feedback and status updates
- Keyboard-driven navigation (vim-like bindings)
- Direct mapping between TUI commands and CLI commands

## Architecture

### Core Components

1. **Commander Parser**: Extracts command structure, options, and descriptions from Commander programs
2. **TUI Engine**: Blessed-based interface with:
   - Command bar (bottom of screen)
   - Content area (main display)
   - Status bar (information display)
   - Context-aware command suggestions
3. **Command Mapper**: Maps TUI interactions to Commander command execution

### Key Features

- **Dual Interface**: Same program works as both CLI and TUI
- **Context-Aware Commands**: Command bar updates based on current view/state
- **Vim-like Navigation**: Familiar keybindings (j/k for navigation, : for command mode)
- **Extensible**: Easy to add custom views and command handlers
- **TypeScript Support**: Full type safety throughout

## Usage

### Basic Setup

```typescript
import { Command } from 'commander';
import { createTui } from './tui-framework';

const program = new Command();

program
  .name('myapp')
  .description('A sample application with CLI/TUI duality');

program
  .command('list')
  .description('List items')
  .action(() => {
    console.log('Listing items...');
  });

program
  .command('add <item>')
  .description('Add an item')
  .action((item) => {
    console.log(`Adding ${item}...`);
  });

// Launch as TUI
if (process.argv.includes('--tui')) {
  createTui(program);
} else {
  program.parse();
}
```

### TUI Configuration

The TUI can be configured with various options:

```typescript
const tui = createTui(program, {
  theme: 'dark',
  keybindings: {
    commandMode: ':',
    navigateUp: 'k',
    navigateDown: 'j',
    execute: 'Enter',
  },
  layout: {
    commandBarHeight: 3,
    statusBarHeight: 2,
  }
});
```

## Command Bar System

The command bar is the core interaction element. It operates in two modes:

### 1. Normal Mode
- Shows context-relevant commands
- Commands are displayed as shortcuts
- Press corresponding key to execute

### 2. Command Mode (Vim-style)
- Activated by pressing `:`
- Full command input with autocomplete
- Tab completion for commands and options
- Command history navigation

## Context Awareness

The TUI maintains a context stack that determines which commands are available:

```typescript
// Example context definition
const contexts = {
  main: ['list', 'add', 'help', 'quit'],
  listView: ['filter', 'sort', 'select', 'back'],
  itemDetail: ['edit', 'delete', 'back'],
};
```

As users navigate through the TUI, the command bar automatically updates to show relevant commands.

## Extending the TUI

### Custom Views

Create custom Blessed elements that integrate with the command system:

```typescript
import { TuiView } from './tui-framework';

class MyCustomView extends TuiView {
  constructor() {
    super('my-view');
    this.commands = ['refresh', 'export', 'back'];
  }
  
  render() {
    // Custom rendering logic
  }
  
  handleCommand(command: string) {
    // Handle view-specific commands
  }
}
```

### Command Handlers

Add custom command handlers that can manipulate TUI state:

```typescript
tui.registerCommandHandler('custom-action', {
  description: 'Perform custom action',
  handler: (args, context) => {
    // Update TUI state
    context.switchView('custom-view');
    return true;
  }
});
```

## Integration with Existing CLI

The framework is designed to work with existing Commander programs with minimal changes:

1. **Automatic Command Discovery**: The TUI automatically parses your Commander program structure
2. **Option Support**: Command options are presented in the TUI with appropriate input widgets
3. **Help Integration**: Commander's help text is displayed in the TUI help view
4. **Exit Codes**: TUI execution respects Commander's exit codes

## Development

### Building

```bash
npm run build
```

### Testing the TUI

```bash
# Run the TUI version
npm run cli -- --tui

# Or directly
node dist/cli/tui.js
```

### Key Files

- `src/cli/tui-framework.ts` - Core TUI framework
- `src/cli/commander-adapter.ts` - Adapter for Commander programs
- `src/cli/views/` - Built-in TUI views
- `src/cli/commands/` - Command implementations

## Future Enhancements

Planned features include:

1. **Plugin System**: Allow third-party TUI extensions
2. **Theming Engine**: Custom color schemes and layouts
3. **Mouse Support**: Full mouse interaction
4. **Multi-pane Layouts**: Split views for complex applications
5. **Command Scripting**: Record and replay command sequences
6. **Remote Control**: Control TUI via WebSocket for remote access

## Contributing

When contributing to the TUI framework:

1. Maintain backward compatibility with Commander.js API
2. Follow the existing Blessed widget patterns
3. Add appropriate keyboard shortcuts for all interactions
4. Include comprehensive TypeScript types
5. Update command documentation when adding new features

## License

Part of the Testeranto project. See main project license for details.
