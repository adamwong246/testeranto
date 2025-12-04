import { Command } from "commander";
import blessed from "blessed";

/**
 * Adapter to create Commander programs that can be used in a TUI
 */
export class CommanderTuiAdapter {
  private program: Command;
  private screen: blessed.Widgets.Screen | null = null;
  private inputBox: blessed.Widgets.TextboxElement | null = null;
  private tabs: blessed.Widgets.ListElement | null = null;
  private activeTab: string = "testeranto";
  
  // Separate output boxes for each tab
  private testerantoOutputBox: blessed.Widgets.Log | null = null;
  private dockerComposeOutputBox: blessed.Widgets.Log | null = null;
  
  // Separate command history for each tab
  private testerantoCommandHistory: string[] = [];
  private dockerComposeCommandHistory: string[] = [];
  
  // Current history index for active tab
  private historyIndex: number = -1;

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
      title: "Testeranto TUI",
      cursor: {
        artificial: true,
        shape: "line",
        blink: true,
      },
    });

    // Create main layout container
    const layout = blessed.layout({
      parent: this.screen,
      width: "100%",
      height: "100%",
      layout: "inline",
    });

    // Create left sidebar for tabs (20% width)
    const sidebar = blessed.box({
      parent: layout,
      width: "20%",
      height: "100%",
      border: { type: "line" },
      style: {
        border: { fg: theme === "dark" ? "white" : "black" },
      },
    });

    // Create tabs list in sidebar
    this.tabs = blessed.list({
      parent: sidebar,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      keys: true,
      vi: true,
      mouse: true,
      border: { type: "line" },
      style: {
        selected: { bg: "blue", fg: "white" },
        item: { fg: "white" },
        border: { fg: theme === "dark" ? "white" : "black" },
      },
      items: ["testeranto", "docker-compose"],
    });

    // Create main content area (80% width)
    const contentArea = blessed.box({
      parent: layout,
      width: "80%",
      height: "100%",
      border: { type: "line" },
      style: {
        border: { fg: theme === "dark" ? "white" : "black" },
      },
    });

    // Create testeranto output area (70% of content area)
    this.testerantoOutputBox = blessed.log({
      parent: contentArea,
      top: 0,
      left: 0,
      width: "100%",
      height: "70%",
      label: " testeranto Output ",
      keys: true,
      vi: true,
      mouse: true,
      scrollable: true,
      scrollbar: {
        ch: " ",
        track: {
          bg: "cyan",
        },
        style: {
          inverse: true,
        },
      },
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "black",
        border: { fg: theme === "dark" ? "white" : "black" },
      },
    });

    // Create docker-compose output area (70% of content area) - initially hidden
    this.dockerComposeOutputBox = blessed.log({
      parent: contentArea,
      top: 0,
      left: 0,
      width: "100%",
      height: "70%",
      label: " docker-compose Output ",
      keys: true,
      vi: true,
      mouse: true,
      scrollable: true,
      scrollbar: {
        ch: " ",
        track: {
          bg: "cyan",
        },
        style: {
          inverse: true,
        },
      },
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "black",
        border: { fg: theme === "dark" ? "white" : "black" },
      },
      hidden: true,
    });

    // Create input area (30% of content area)
    this.inputBox = blessed.textbox({
      parent: contentArea,
      top: "70%",
      left: 0,
      width: "100%",
      height: "30%",
      label: " Command Input (Ctrl+C to exit, ↑/↓ for history) ",
      keys: true,
      vi: true,
      mouse: true,
      inputOnFocus: true,
      border: { type: "line" },
      style: {
        fg: "white",
        bg: "black",
        border: { fg: theme === "dark" ? "white" : "black" },
        focus: { border: { fg: "blue" } },
      },
    });

    // Initialize tab content
    this.initializeTabContent();

    // Tab selection handler
    this.tabs!.on("select", (item: any) => {
      const tabName = item.getText();
      this.switchTab(tabName);
      this.screen!.render();
    });

    // Input handler for command execution
    this.inputBox!.on("submit", async (value: string) => {
      if (value.trim() === "") return;

      // Get current output box and history based on active tab
      const currentOutputBox = this.getCurrentOutputBox();
      const currentHistory = this.getCurrentCommandHistory();

      // Add to history
      currentHistory.push(value);
      this.historyIndex = currentHistory.length;

      // Display the command
      currentOutputBox!.add(`$ testeranto ${value}`);

      try {
        // Execute the command
        await this.executeCommand(value, currentOutputBox!);
      } catch (error: any) {
        currentOutputBox!.add(`Error: ${error.message}`);
      }

      this.inputBox!.clearValue();
      this.inputBox!.focus();
      this.screen!.render();
    });

    // Command history navigation
    this.inputBox!.key(["up"], () => {
      const currentHistory = this.getCurrentCommandHistory();
      if (currentHistory.length > 0) {
        if (this.historyIndex > 0) {
          this.historyIndex--;
        }
        if (
          this.historyIndex >= 0 &&
          this.historyIndex < currentHistory.length
        ) {
          this.inputBox!.setValue(currentHistory[this.historyIndex]);
          this.screen!.render();
        }
      }
    });

    this.inputBox!.key(["down"], () => {
      const currentHistory = this.getCurrentCommandHistory();
      if (currentHistory.length > 0) {
        if (this.historyIndex < currentHistory.length - 1) {
          this.historyIndex++;
          this.inputBox!.setValue(currentHistory[this.historyIndex]);
        } else {
          this.historyIndex = currentHistory.length;
          this.inputBox!.clearValue();
        }
        this.screen!.render();
      }
    });

    // Key bindings
    this.screen!.key(["C-c"], () => {
      this.destroy();
      process.exit(0);
    });

    this.screen!.key(["tab"], () => {
      if (this.inputBox!.focused) {
        this.tabs!.focus();
      } else {
        this.inputBox!.focus();
      }
      this.screen!.render();
    });

    // Select the first tab initially
    this.tabs!.select(0);
    
    // Initial focus
    this.tabs!.focus();
    
    // Ensure initial tab is properly set
    this.switchTab("testeranto");
    
    this.screen!.render();

    return {
      destroy: () => this.destroy(),
    };
  }

  private initializeTabContent(): void {
    // testeranto tab content
    this.testerantoOutputBox!.add("=== testeranto Tab ===");
    this.testerantoOutputBox!.add("This tab is for testeranto CLI commands.");
    this.testerantoOutputBox!.add("Type testeranto commands in the input below.");
    this.testerantoOutputBox!.add("\nAvailable testeranto commands:");
    this.testerantoOutputBox!.add("  run <testPattern> - Run tests matching the pattern");
    this.testerantoOutputBox!.add("  build <type> - Build test bundles");
    this.testerantoOutputBox!.add("  init [projectName] - Initialize test configuration");
    this.testerantoOutputBox!.add("  watch - Watch for changes and rebuild");
    this.testerantoOutputBox!.add("  list [filter] - List available tests");
    this.testerantoOutputBox!.add("  clean - Clean build artifacts");
    this.testerantoOutputBox!.add("\nType 'help' for more information.");
    this.testerantoOutputBox!.add("\n");

    // docker-compose tab content
    this.dockerComposeOutputBox!.add("=== docker-compose Tab ===");
    this.dockerComposeOutputBox!.add("This tab is for docker-compose commands.");
    this.dockerComposeOutputBox!.add("Type docker-compose commands in the input below.");
    this.dockerComposeOutputBox!.add("\nAvailable docker-compose commands:");
    this.dockerComposeOutputBox!.add("  docker-compose up - Start services");
    this.dockerComposeOutputBox!.add("  docker-compose down - Stop services");
    this.dockerComposeOutputBox!.add("  docker-compose ps - List containers");
    this.dockerComposeOutputBox!.add("  docker-compose logs - View logs");
    this.dockerComposeOutputBox!.add("  docker-compose build - Build images");
    this.dockerComposeOutputBox!.add("\nNote: These are placeholder commands.");
    this.dockerComposeOutputBox!.add("Actual docker-compose integration would be implemented separately.");
    this.dockerComposeOutputBox!.add("\n");
  }

  private switchTab(tabName: string): void {
    this.activeTab = tabName;
    
    // Hide all output boxes
    this.testerantoOutputBox!.hide();
    this.dockerComposeOutputBox!.hide();
    
    // Show the active tab's output box
    if (tabName === "testeranto") {
      this.testerantoOutputBox!.show();
    } else if (tabName === "docker-compose") {
      this.dockerComposeOutputBox!.show();
    }
    
    // Reset history index for the new tab
    this.historyIndex = this.getCurrentCommandHistory().length;
  }

  private getCurrentOutputBox(): blessed.Widgets.Log | null {
    if (this.activeTab === "testeranto") {
      return this.testerantoOutputBox;
    } else if (this.activeTab === "docker-compose") {
      return this.dockerComposeOutputBox;
    }
    return null;
  }

  private getCurrentCommandHistory(): string[] {
    if (this.activeTab === "testeranto") {
      return this.testerantoCommandHistory;
    } else if (this.activeTab === "docker-compose") {
      return this.dockerComposeCommandHistory;
    }
    return [];
  }

  private async executeCommand(commandString: string, outputBox: blessed.Widgets.Log): Promise<void> {
    // Parse the command string
    const userArgs = commandString.trim().split(/\s+/);

    // Remove 'testeranto' if the user included it
    if (userArgs[0] === "testeranto") {
      userArgs.shift();
    }

    try {
      // Capture console output
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;

      console.log = (...args: any[]) => {
        outputBox.add(args.join(" "));
      };

      console.error = (...args: any[]) => {
        outputBox.add(`ERROR: ${args.join(" ")}`);
      };

      console.warn = (...args: any[]) => {
        outputBox.add(`WARN: ${args.join(" ")}`);
      };

      console.info = (...args: any[]) => {
        outputBox.add(`INFO: ${args.join(" ")}`);
      };

      // Create a fresh program instance by importing the shared program function
      const { createSharedProgram } = await import('./shared-program.js');
      const tempProgram = createSharedProgram();
      
      // Add the program name as the first argument
      const argsToParse = ['node', 'testeranto-tui', ...userArgs];
      
      // Parse the arguments
      await tempProgram.parseAsync(argsToParse);

      // Restore console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    } catch (error: any) {
      outputBox.add(`Error: ${error.message}`);
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
