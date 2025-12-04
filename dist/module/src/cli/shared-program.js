import { Command } from 'commander';
export function createSharedProgram() {
    const program = new Command();
    program
        .name('testeranto')
        .description('AI powered BDD test framework for TypeScript projects')
        .version('0.209.0');
    // Command to run tests
    program
        .command('run <testPattern>')
        .description('Run tests matching the pattern')
        .option('-w, --watch', 'Watch mode')
        .option('-v, --verbose', 'Verbose output')
        .action((testPattern, options) => {
        console.log(`Running tests matching: ${testPattern}`);
        if (options.watch) {
            console.log('Watch mode enabled');
        }
        if (options.verbose) {
            console.log('Verbose mode enabled');
        }
        // Here you would integrate with the existing test runner
        console.log('Test execution would start here...');
    });
    // Command to build the project
    program
        .command('build')
        .description('Build the project')
        .option('--clean', 'Clean build directory')
        .action((options) => {
        console.log('Building project...');
        if (options.clean) {
            console.log('Cleaning build directory...');
        }
        // Placeholder for build logic
    });
    // Command to list available tests
    program
        .command('list')
        .description('List available tests')
        .action(() => {
        console.log('Available tests:');
        for (let i = 1; i <= 5; i++) {
            console.log(`  - test${i}`);
        }
        console.log('\nUse :run <testName> to execute a test');
    });
    // Command to show status
    program
        .command('status')
        .description('Show project status')
        .action(() => {
        console.log('Project status:');
        console.log('  - Tests: 5 available');
        console.log('  - Build: Ready');
        console.log('  - Last run: 2 minutes ago');
    });
    // Command to show help
    program
        .command('help')
        .description('Show TUI and command help')
        .action(() => {
        console.log('Testeranto - AI powered BDD test framework');
        console.log('===========================================');
        console.log('\nAvailable commands:');
        program.commands.forEach(cmd => {
            console.log(`  ${cmd.name().padEnd(10)} - ${cmd.description()}`);
        });
    });
    return program;
}
