import { Command } from 'commander';
import { createTui } from './tui-framework';
/**
 * Adapter to create Commander programs that can be used in a TUI
 * This is for standalone TUI applications, not for mixing with CLI
 */
export class CommanderTuiAdapter {
    constructor(program) {
        this.tui = null;
        this.program = program;
    }
    /**
     * Launch the TUI interface with this program
     */
    launchTui(theme = 'dark', config) {
        this.tui = createTui(this.program, {
            theme,
            keybindings: {
                commandMode: ':',
                nextTab: ']',
                prevTab: '[',
                newTab: 't',
                closeTab: 'x',
                quit: 'q',
            },
        }, config);
        // Add TUI-specific commands to the program
        this.addTuiCommands();
        return this.tui;
    }
    /**
     * Add TUI-specific commands
     */
    addTuiCommands() {
        if (!this.tui)
            return;
        // Clear command
        this.program
            .command('clear')
            .description('Clear the current tab')
            .action(() => {
            // This would need access to the current tab's content
            // For now, we'll leave it as a placeholder
            console.log('Tab cleared');
        });
        // List tabs command
        this.program
            .command('tabs')
            .description('List all open tabs')
            .action(() => {
            console.log('Tabs feature available in TUI interface');
        });
        // Help command that shows TUI-specific help
        const originalHelp = this.program.commands.find(c => c.name() === 'help');
        if (originalHelp) {
            originalHelp.description('Show help for TUI and commands');
        }
    }
    /**
     * Get the TUI instance (if running in TUI mode)
     */
    getTui() {
        return this.tui;
    }
}
/**
 * Helper function to create a Commander program for use in a TUI
 */
export function createCommanderForTui(name, description) {
    const program = new Command(name);
    if (description) {
        program.description(description);
    }
    const adapter = new CommanderTuiAdapter(program);
    return { program, adapter };
}
/**
 * Helper function to adapt an existing Commander program for TUI use
 */
export function adaptExistingProgramForTui(program) {
    return new CommanderTuiAdapter(program);
}
