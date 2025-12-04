import { createSharedProgram } from './shared-program';
const main = async () => {
    const program = createSharedProgram();
    // Add TUI command to launch the TUI interface
    program
        .command('tui')
        .description('Launch the full TUI interface')
        .action(() => {
        console.log('Launching TUI...');
        // We'll handle this differently
        // For now, we can spawn the tui.ts script
        const { spawn } = require('child_process');
        const path = require('path');
        const tuiScript = path.join(__dirname, 'tui.ts');
        const child = spawn('node', ['-r', 'ts-node/register', tuiScript], {
            stdio: 'inherit',
            shell: true
        });
        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`TUI exited with code ${code}`);
            }
        });
    });
    // Parse arguments, excluding the node executable and script path
    program.parse(process.argv.slice(2));
};
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
