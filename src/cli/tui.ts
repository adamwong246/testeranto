import { adaptExistingProgramForTui } from './commander-adapter';
import { createSharedProgram } from './shared-program';
import config from '../../allTests';

// Use the shared Commander program
const program = createSharedProgram();

// Create the TUI adapter with the existing shared program and pass the config
const adapter = adaptExistingProgramForTui(program);

// Launch the TUI with the configuration
const tui = adapter.launchTui('dark', config);

// Handle cleanup
process.on('SIGINT', () => {
  tui.destroy();
  process.exit(0);
});

process.on('exit', () => {
  tui.destroy();
});
