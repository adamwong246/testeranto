import { Command } from 'commander';
import { adaptExistingProgramForTui } from './commander-adapter';
// Create a shared program
const program = new Command();
program
    .name('example-app')
    .description('An example application with TUI interface');
// Add some commands
program
    .command('greet <name>')
    .description('Greet someone')
    .option('-e, --excited', 'Add excitement!')
    .action((name, options) => {
    const greeting = `Hello, ${name}!`;
    console.log(options.excited ? `${greeting} 👋🎉` : greeting);
});
program
    .command('time')
    .description('Show current time')
    .action(() => {
    console.log(`Current time: ${new Date().toLocaleTimeString()}`);
});
program
    .command('calc <expression>')
    .description('Evaluate a simple expression')
    .action((expression) => {
    try {
        // Note: Using eval is just for demonstration - use a proper parser in production
        const result = eval(expression);
        console.log(`${expression} = ${result}`);
    }
    catch (error) {
        console.error(`Error evaluating expression: ${error}`);
    }
});
// Get arguments without node and script path
const args = process.argv.slice(2);
// Check if we should launch TUI
const shouldLaunchTui = args.includes('--tui');
if (shouldLaunchTui) {
    // Create TUI adapter with the existing program
    const adapter = adaptExistingProgramForTui(program);
    const theme = args.includes('--tui-theme=light') ? 'light' : 'dark';
    const tui = adapter.launchTui(theme);
    // Handle cleanup
    process.on('SIGINT', () => {
        tui.destroy();
        process.exit(0);
    });
    process.on('exit', () => {
        tui.destroy();
    });
}
else {
    // Regular CLI mode
    program.parse(args);
}
// Example usage:
//   node example.ts greet Alice          # CLI mode
//   node example.ts --tui                # TUI mode
//   node example.ts --tui --tui-theme light  # TUI with light theme
