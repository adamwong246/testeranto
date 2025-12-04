import { Command } from "commander";
import blessed from "blessed";
import contrib from "blessed-contrib";

/**
 * Adapter to create Commander programs that can be used in a TUI
 */
export class CommanderTuiAdapter {
  private program: Command;
  private screen: blessed.Widgets.Screen | null = null;

  constructor(program: Command) {
    this.program = program;
  }

  /**
   * Launch the TUI interface with this program
   */
  launchTui(theme: "light" | "dark" = "dark", config?: any): any {
    // Create screen
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Testeranto TUI',
      cursor: {
        artificial: true,
        shape: 'line',
        blink: true
      }
    });

    // Create main layout
    const layout = blessed.layout({
      parent: this.screen,
      width: '100%',
      height: '100%',
      layout: 'inline'
    });

    // Create command list
    const commandList = blessed.list({
      parent: layout,
      width: '30%',
      height: '70%',
      label: ' Commands ',
      keys: true,
      vi: true,
      mouse: true,
      border: { type: 'line' },
      style: {
        selected: { bg: 'blue', fg: 'white' },
        item: { fg: 'white' },
        border: { fg: theme === 'dark' ? 'white' : 'black' }
      },
      items: this.getCommandItems()
    });

    // Create output area
    const outputBox = blessed.log({
      parent: layout,
      width: '70%',
      height: '70%',
      label: ' Output ',
      keys: true,
      vi: true,
      mouse: true,
      scrollable: true,
      border: { type: 'line' },
      style: {
        border: { fg: theme === 'dark' ? 'white' : 'black' }
      }
    });

    // Create input area
    const inputBox = blessed.textbox({
      parent: layout,
      width: '70%',
      height: '30%',
      label: ' Command Input ',
      keys: true,
      vi: true,
      mouse: true,
      inputOnFocus: true,
      border: { type: 'line' },
      style: {
        border: { fg: theme === 'dark' ? 'white' : 'black' },
        focus: { border: { fg: 'blue' } }
      }
    });

    // Create help box
    const helpBox = blessed.box({
      parent: layout,
      width: '30%',
      height: '30%',
      label: ' Command Help ',
      content: 'Select a command to see help',
      border: { type: 'line' },
      style: {
        border: { fg: theme === 'dark' ? 'white' : 'black' }
      }
    });

    // Command selection handler
    commandList.on('select', async (item: any) => {
      const commandText = item.getText();
      const command = this.findCommand(commandText);
      
      if (command) {
        // Update help box
        helpBox.setContent(this.getCommandHelp(command));
        
        // Focus input box with command name
        inputBox.setValue(`${command.name()} `);
        inputBox.focus();
        this.screen.render();
      }
    });

    // Input handler for command execution
    inputBox.on('submit', async (value: string) => {
      outputBox.add(`> ${value}`);
      
      try {
        // Execute the command
        await this.executeCommand(value, outputBox);
      } catch (error: any) {
        outputBox.add(`Error: ${error.message}`);
      }
      
      inputBox.clearValue();
      inputBox.focus();
      this.screen.render();
    });

    // Key bindings
    this.screen.key(['escape', 'q', 'C-c'], () => {
      this.destroy();
      process.exit(0);
    });

    this.screen.key(['tab'], () => {
      if (inputBox.focused) {
        commandList.focus();
      } else {
        inputBox.focus();
      }
      this.screen.render();
    });

    // Initial focus
    commandList.focus();
    this.screen.render();

    return {
      destroy: () => this.destroy()
    };
  }

  private getCommandItems(): string[] {
    const items: string[] = [];
    
    // Add all commands from the program
    this.program.commands.forEach(cmd => {
      items.push(`${cmd.name()} - ${cmd.description() || 'No description'}`);
    });
    
    return items;
  }

  private findCommand(text: string): Command | null {
    const cmdName = text.split(' - ')[0].trim();
    return this.program.commands.find(cmd => cmd.name() === cmdName) || null;
  }

  private getCommandHelp(command: Command): string {
    let help = `Command: ${command.name()}\n`;
    help += `Description: ${command.description() || 'No description'}\n\n`;
    
    // Show arguments
    if (command._args && command._args.length > 0) {
      help += 'Arguments:\n';
      command._args.forEach((arg: any) => {
        help += `  ${arg.required ? '<' : '['}${arg.name}${arg.required ? '>' : ']'}\n`;
      });
      help += '\n';
    }
    
    // Show options
    if (command.options && command.options.length > 0) {
      help += 'Options:\n';
      command.options.forEach((opt: any) => {
        const flags = opt.flags;
        const description = opt.description || '';
        const defaultValue = opt.defaultValue !== undefined ? ` (default: ${opt.defaultValue})` : '';
        help += `  ${flags} - ${description}${defaultValue}\n`;
      });
    }
    
    return help;
  }

  private async executeCommand(commandString: string, outputBox: any): Promise<void> {
    // Parse the command string
    const args = commandString.trim().split(/\s+/);
    
    try {
      // Capture console output
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = (...args: any[]) => {
        outputBox.add(args.join(' '));
      };
      
      console.error = (...args: any[]) => {
        outputBox.add(`ERROR: ${args.join(' ')}`);
      };
      
      // Use commander to parse and execute
      await this.program.parseAsync(args, { from: 'user' });
      
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      
      outputBox.add('Command executed successfully.');
    } catch (error: any) {
      outputBox.add(`Command failed: ${error.message}`);
    }
  }

  destroy(): void {
    if (this.screen) {
      this.screen.destroy();
    }
  }
}

export function adaptExistingProgramForTui(
  program: Command
): CommanderTuiAdapter {
  return new CommanderTuiAdapter(program);
}
