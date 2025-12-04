/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import blessed from "blessed";
import { Command } from "commander";
import { BlessedElementFactory } from "./blessed-element-factory";
import { BuildServiceUtils } from "./build-service-utils";
import { CommandExecutor } from "./command-executor";
import { DockerComposeExecutor } from "./docker-compose-executor";
import { DockerComposeStarter } from "./docker-compose-starter";
import { MouseSelectionUtils } from "./mouse-selection-utils";
import { TabContentInitializer } from "./tab-content-initializer";
import { TabUtils } from "./tab-utils";
import { TesterantoDockerManager } from "./testeranto-docker-manager";
import { TuiUtils } from "./tui-utils";
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
  private nodeBuildOutputBox: blessed.Widgets.Log | null = null;
  private webBuildOutputBox: blessed.Widgets.Log | null = null;
  private pythonBuildOutputBox: blessed.Widgets.Log | null = null;
  private golangBuildOutputBox: blessed.Widgets.Log | null = null;
  // Dynamic test output boxes
  private testOutputBoxes: Map<string, blessed.Widgets.Log> = new Map();

  // Separate command history for each tab
  private testerantoCommandHistory: string[] = [];
  private dockerComposeCommandHistory: string[] = [];
  private nodeBuildCommandHistory: string[] = [];
  private webBuildCommandHistory: string[] = [];
  private pythonBuildCommandHistory: string[] = [];
  private golangBuildCommandHistory: string[] = [];

  // Current history index for active tab
  private historyIndex: number = -1;

  // Mouse selection utilities
  private mouseSelection: MouseSelectionUtils;

  constructor(program: Command) {
    this.program = program;
    this.mouseSelection = new MouseSelectionUtils(null);
  }

  /**
   * Launch the TUI interface with this program
   */
  launchTui(theme: "light" | "dark" = "dark", configFilepath?: string): any {
    // Create screen with mouse disabled
    this.screen = BlessedElementFactory.createScreen("Testeranto TUI", theme);
    // Disable mouse entirely
    this.screen.mouse = false;
    this.screen.mouseMotion = false;

    // Update mouse selection with screen reference (but mouse is disabled)
    this.mouseSelection = new MouseSelectionUtils(this.screen);

    // Handle keyboard scrolling instead of mouse wheel
    // We'll use PageUp/PageDown for scrolling
    this.screen.key(["pageup"], () => {
      const outputBox = this.getCurrentOutputBox();
      if (outputBox) {
        outputBox.scroll(-10);
        this.screen.render();
      }
    });

    this.screen.key(["pagedown"], () => {
      const outputBox = this.getCurrentOutputBox();
      if (outputBox) {
        outputBox.scroll(10);
        this.screen.render();
      }
    });

    // Start docker-compose automatically with the provided config file
    if (configFilepath) {
      this.startDockerCompose(configFilepath);
    }

    // Create main layout container
    const layout = BlessedElementFactory.createLayout(this.screen);

    // Create left sidebar for tabs (initial width from this.sidebarWidth)
    const sidebar = BlessedElementFactory.createSidebar(layout, theme, this.sidebarWidth);
    // Disable mouse on sidebar
    sidebar.mouse = false;
    sidebar.clickable = false;

    // Create tabs list in sidebar
    this.tabs = BlessedElementFactory.createTabsList(sidebar, theme);
    // Disable mouse on tabs list
    this.tabs.mouse = false;
    this.tabs.clickable = false;

    // Create main content area (100% - sidebarWidth)
    this.contentArea = BlessedElementFactory.createContentArea(layout, this.sidebarWidth);
    const contentArea = this.contentArea;

    // Add a status line at the top to show active tab and keyboard hints
    const statusLine = BlessedElementFactory.createStatusLine(
      contentArea,
      "Active: testeranto | Sidebar: 20% | Use ↑/↓ to switch tabs | Use ←/→ to resize sidebar | PageUp/PageDown to scroll",
      theme
    );

    // Create testeranto output area (70% of content area)
    this.testerantoOutputBox = BlessedElementFactory.createLogBox(contentArea, {
      top: 1,
      left: 0,
      width: "100%",
      height: "70%-1",
      theme,
    });
    // Disable mouse on output box
    this.testerantoOutputBox.mouse = false;
    this.testerantoOutputBox.clickable = false;

    // Create docker-compose output area - initially hidden
    this.dockerComposeOutputBox = BlessedElementFactory.createLogBox(
      contentArea,
      {
        top: 1,
        left: 0,
        width: "100%",
        height: "70%-1",
        theme,
        hidden: true,
      }
    );
    // Disable mouse
    this.dockerComposeOutputBox.mouse = false;
    this.dockerComposeOutputBox.clickable = false;

    // Create node-build output area
    this.nodeBuildOutputBox = BlessedElementFactory.createLogBox(contentArea, {
      top: 1,
      left: 0,
      width: "100%",
      height: "70%-1",
      theme,
      hidden: true,
    });
    this.nodeBuildOutputBox.mouse = false;
    this.nodeBuildOutputBox.clickable = false;

    // Create web-build output area
    this.webBuildOutputBox = BlessedElementFactory.createLogBox(contentArea, {
      top: 1,
      left: 0,
      width: "100%",
      height: "70%-1",
      theme,
      hidden: true,
    });
    this.webBuildOutputBox.mouse = false;
    this.webBuildOutputBox.clickable = false;

    // Create python-build output area
    this.pythonBuildOutputBox = BlessedElementFactory.createLogBox(
      contentArea,
      {
        top: 1,
        left: 0,
        width: "100%",
        height: "70%-1",
        theme,
        hidden: true,
      }
    );
    this.pythonBuildOutputBox.mouse = false;
    this.pythonBuildOutputBox.clickable = false;

    // Create golang-build output area
    this.golangBuildOutputBox = BlessedElementFactory.createLogBox(
      contentArea,
      {
        top: 1,
        left: 0,
        width: "100%",
        height: "70%-1",
        theme,
        hidden: true,
      }
    );
    this.golangBuildOutputBox.mouse = false;
    this.golangBuildOutputBox.clickable = false;

    // Create input area (30% of content area)
    this.inputBox = BlessedElementFactory.createTextInput(contentArea, theme);
    // Disable mouse on input box
    this.inputBox.mouse = false;
    this.inputBox.clickable = false;

    // Initialize tab content
    this.initializeTabContent();

    // Tab selection handler - for mouse clicks and keyboard selection
    this.tabs!.on("select", (item: any) => {
      const tabName = item.getText();
      this.switchTab(tabName);
      // Focus the output box when switching tabs
      const outputBox = this.getCurrentOutputBox();
      if (outputBox) {
        outputBox.focus();
      }
      // Update status line
      this.updateFocusStatus();
      this.screen!.render();
    });

    // Mouse clicks are disabled, only keyboard navigation

    // Input handler for command execution
    this.inputBox!.on("submit", async (value: string) => {
      if (value.trim() === "") return;

      // Process the command
      const { targetOutputBox, targetHistory, isDockerCompose } =
        CommandExecutor.processCommand(
          value,
          this.testerantoOutputBox,
          this.dockerComposeOutputBox,
          this.testerantoCommandHistory,
          this.dockerComposeCommandHistory
        );

      // Switch to appropriate tab if not already active
      const targetTab = CommandExecutor.getTabForCommand(value);
      if (this.activeTab !== targetTab) {
        this.switchTab(targetTab);
      }

      // Add to appropriate history
      targetHistory.push(value);
      this.historyIndex = targetHistory.length;

      // Only show the command in testeranto tab, not in docker-compose tab
      if (!isDockerCompose) {
        targetOutputBox!.add(`$ ${value}`);
      }

      try {
        // Execute the command
        if (isDockerCompose) {
          const userArgs = value.trim().split(/\s+/);
          // Remove "docker-compose" or "docker" from the beginning
          const dockerArgs = userArgs.slice(1);
          await this.executeDockerComposeCommand(dockerArgs, targetOutputBox!);
        } else {
          await CommandExecutor.executeCommand(value, targetOutputBox!);
        }
      } catch (error: any) {
        targetOutputBox!.add(`Error: ${error.message}`);
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

    // Focus tabs with Ctrl+[
    this.screen!.key(["C-["], () => {
      this.tabs!.focus();
      this.screen!.render();
    });

    // Focus output box with Ctrl+]
    this.screen!.key(["C-]"], () => {
      const outputBox = this.getCurrentOutputBox();
      if (outputBox) {
        outputBox.focus();
      }
      this.screen!.render();
    });

    // Add keyboard shortcuts for switching tabs with up/down arrows
    // Only when input box is not focused
    this.screen!.key(["down"], () => {
      // If input box is focused, don't switch tabs (let it handle history)
      if (this.inputBox && this.inputBox.focused) {
        return;
      }
      // Switch to next tab
      const currentIndex = this.tabs!.selected;
      const nextIndex = (currentIndex + 1) % this.tabs!.items.length;
      this.tabs!.select(nextIndex);
      const item = this.tabs!.items[nextIndex];
      const tabName = item.getText();
      this.switchTab(tabName);
      const outputBox = this.getCurrentOutputBox();
      if (outputBox) {
        outputBox.focus();
      }
      this.updateFocusStatus();
      this.screen!.render();
    });

    this.screen!.key(["up"], () => {
      // If input box is focused, don't switch tabs (let it handle history)
      if (this.inputBox && this.inputBox.focused) {
        return;
      }
      // Switch to previous tab
      const currentIndex = this.tabs!.selected;
      const prevIndex = (currentIndex - 1 + this.tabs!.items.length) % this.tabs!.items.length;
      this.tabs!.select(prevIndex);
      const item = this.tabs!.items[prevIndex];
      const tabName = item.getText();
      this.switchTab(tabName);
      const outputBox = this.getCurrentOutputBox();
      if (outputBox) {
        outputBox.focus();
      }
      this.updateFocusStatus();
      this.screen!.render();
    });

    // Add keyboard shortcuts for resizing sidebar with left/right arrows
    // Only when input box is not focused
    this.screen!.key(["right"], () => {
      // If input box is focused, don't resize sidebar
      if (this.inputBox && this.inputBox.focused) {
        return;
      }
      // Increase sidebar width
      this.sidebarWidth = Math.min(this.maxSidebarWidth, this.sidebarWidth + 5);
      this.updateSidebarWidth();
      this.updateFocusStatus();
      this.screen!.render();
    });

    this.screen!.key(["left"], () => {
      // If input box is focused, don't resize sidebar
      if (this.inputBox && this.inputBox.focused) {
        return;
      }
      // Decrease sidebar width
      this.sidebarWidth = Math.max(this.minSidebarWidth, this.sidebarWidth - 5);
      this.updateSidebarWidth();
      this.updateFocusStatus();
      this.screen!.render();
    });

    // Also allow Ctrl+Tab and Ctrl+Shift+Tab for tab switching
    this.screen!.key(["C-tab"], () => {
      // Switch to next tab
      const currentIndex = this.tabs!.selected;
      const nextIndex = (currentIndex + 1) % this.tabs!.items.length;
      this.tabs!.select(nextIndex);
      const item = this.tabs!.items[nextIndex];
      const tabName = item.getText();
      this.switchTab(tabName);
      const outputBox = this.getCurrentOutputBox();
      if (outputBox) {
        outputBox.focus();
      }
      this.updateFocusStatus();
      this.screen!.render();
    });

    // Note: blessed might not support C-S-tab directly, so we'll use other keys
    this.screen!.key(["C-S-tab"], () => {
      // Switch to previous tab
      const currentIndex = this.tabs!.selected;
      const prevIndex = (currentIndex - 1 + this.tabs!.items.length) % this.tabs!.items.length;
      this.tabs!.select(prevIndex);
      const item = this.tabs!.items[prevIndex];
      const tabName = item.getText();
      this.switchTab(tabName);
      const outputBox = this.getCurrentOutputBox();
      if (outputBox) {
        outputBox.focus();
      }
      this.updateFocusStatus();
      this.screen!.render();
    });

    // No mouse resizing - using keyboard controls instead

    // Select the first tab initially
    this.tabs!.select(0);

    // Ensure initial tab is properly set
    this.switchTab("testeranto");

    // Initial focus on the output box
    const outputBox = this.getCurrentOutputBox();
    if (outputBox) {
      outputBox.focus();
    }


    this.screen!.render();

    return {
      destroy: () => this.destroy(),
    };
  }

  private initializeTabContent(): void {
    TabContentInitializer.initializeTabContent(
      this.testerantoOutputBox,
      this.dockerComposeOutputBox,
      this.nodeBuildOutputBox,
      this.webBuildOutputBox,
      this.pythonBuildOutputBox,
      this.golangBuildOutputBox
    );
  }

  private switchTab(tabName: string): void {
    // Hide all output boxes
    if (this.testerantoOutputBox) this.testerantoOutputBox.hide();
    if (this.dockerComposeOutputBox) this.dockerComposeOutputBox.hide();
    if (this.nodeBuildOutputBox) this.nodeBuildOutputBox.hide();
    if (this.webBuildOutputBox) this.webBuildOutputBox.hide();
    if (this.pythonBuildOutputBox) this.pythonBuildOutputBox.hide();
    if (this.golangBuildOutputBox) this.golangBuildOutputBox.hide();
    
    // Hide all test output boxes
    this.testOutputBoxes.forEach(box => box.hide());

    // Show the active tab's output box
    let activeOutputBox: blessed.Widgets.Log | null = null;
    if (tabName === "testeranto") {
      if (this.testerantoOutputBox) this.testerantoOutputBox.show();
      activeOutputBox = this.testerantoOutputBox;
    } else if (tabName === "docker-compose") {
      if (this.dockerComposeOutputBox) this.dockerComposeOutputBox.show();
      activeOutputBox = this.dockerComposeOutputBox;
    } else if (tabName === "node-build") {
      if (this.nodeBuildOutputBox) this.nodeBuildOutputBox.show();
      activeOutputBox = this.nodeBuildOutputBox;
    } else if (tabName === "web-build") {
      if (this.webBuildOutputBox) this.webBuildOutputBox.show();
      activeOutputBox = this.webBuildOutputBox;
    } else if (tabName === "python-build") {
      if (this.pythonBuildOutputBox) this.pythonBuildOutputBox.show();
      activeOutputBox = this.pythonBuildOutputBox;
    } else if (tabName === "golang-build") {
      if (this.golangBuildOutputBox) this.golangBuildOutputBox.show();
      activeOutputBox = this.golangBuildOutputBox;
    } else {
      // Check if it's a test tab
      const testBox = this.testOutputBoxes.get(tabName);
      if (testBox) {
        testBox.show();
        activeOutputBox = testBox;
      }
    }

    // Update status line
    if (activeOutputBox && this.screen) {
      const statusLine = activeOutputBox.parent?.parent?.children?.find(
        (child: any) =>
          child.type === "box" &&
          child.content &&
          typeof child.content === "string" &&
          child.content.includes("Active:")
      );
      if (statusLine) {
        statusLine.setContent(`Active: ${tabName} | Tab: switch focus | Mouse wheel scrolls when output box is focused`);
      }
    }

    // Re-render screen
    if (this.screen) {
      this.screen.render();
    }

    this.activeTab = tabName;
    // Reset history index for the new tab
    this.historyIndex = this.getCurrentCommandHistory().length;
  }

  private getCurrentOutputBox(): blessed.Widgets.Log | null {
    switch (this.activeTab) {
      case "testeranto":
        return this.testerantoOutputBox;
      case "docker-compose":
        return this.dockerComposeOutputBox;
      case "node-build":
        return this.nodeBuildOutputBox;
      case "web-build":
        return this.webBuildOutputBox;
      case "python-build":
        return this.pythonBuildOutputBox;
      case "golang-build":
        return this.golangBuildOutputBox;
      default:
        // Check if it's a test tab
        return this.testOutputBoxes.get(this.activeTab) || null;
    }
  }

  private getCurrentCommandHistory(): string[] {
    return TuiUtils.getCurrentCommandHistory(
      this.activeTab,
      this.testerantoCommandHistory,
      this.dockerComposeCommandHistory,
      this.nodeBuildCommandHistory,
      this.webBuildCommandHistory,
      this.pythonBuildCommandHistory,
      this.golangBuildCommandHistory
    );
  }

  private async executeDockerComposeCommand(
    args: string[],
    outputBox: blessed.Widgets.Log
  ): Promise<void> {
    await DockerComposeExecutor.executeDockerComposeCommand(args, outputBox);
  }

  private testerantoDockerManager: TesterantoDockerManager =
    new TesterantoDockerManager();
  private testTabs: {name: string, runtime: string}[] = [];
  
  // Sidebar resizing state
  private isResizingSidebar: boolean = false;
  private sidebarWidth: number = 20; // Percentage
  private minSidebarWidth: number = 10;
  private maxSidebarWidth: number = 50;
  private contentArea: blessed.Widgets.BoxElement | null = null;

  private async startDockerCompose(configFilepath: string): Promise<void> {
    // Start docker-compose in the background
    setTimeout(async () => {
      await DockerComposeStarter.startDockerCompose(
        configFilepath,
        this.dockerComposeOutputBox,
        this.screen,
        (tabName: string) => this.switchTab(tabName),
        this.tabs,
        (testsName: string, composeFile: string) =>
          this.createTesterantoDockerInstance(testsName, composeFile),
        (tests: {name: string, runtime: string}[]) => {
          this.updateTabsWithTests(tests);
        }
      );
    }, 1000); // Wait 1 second for the TUI to initialize
  }

  private updateTabsWithTests(tests: {name: string, runtime: string}[]): void {
    this.testTabs = tests;
    
    // Update the tabs list
    if (this.tabs && this.screen && this.testerantoOutputBox) {
      // Create tab names: use the test name, but make it readable
      const testTabNames: string[] = [];
      
      tests.forEach(test => {
        // Extract just the filename without path for display
        const parts = test.name.split('/');
        const filename = parts[parts.length - 1];
        // Remove extension
        const name = filename.replace(/\.[^/.]+$/, '');
        const baseTabName = `${test.runtime}-${name}`;
        
        // Add the main test tab
        testTabNames.push(baseTabName);
        // Add the aider tab
        testTabNames.push(`${baseTabName}-aider`);
      });
      
      // Create output boxes for each test tab and aider tab
      testTabNames.forEach(tabName => {
        if (!this.testOutputBoxes.has(tabName)) {
          const testBox = BlessedElementFactory.createLogBox(
            this.testerantoOutputBox!.parent as blessed.Widgets.Node,
            {
              top: 1,
              left: 0,
              width: "100%",
              height: "70%-1",
              theme: "dark",
              hidden: true,
            }
          );
          
          // Disable mouse on test boxes
          testBox.mouse = false;
          testBox.clickable = false;
          
          // Add initial content
          if (tabName.endsWith('-aider')) {
            testBox.add(`=== ${tabName} Tab ===`);
            testBox.add(`This tab shows aider information for test: ${tabName.replace('-aider', '')}`);
            testBox.add(`Status: Not started`);
          } else {
            testBox.add(`=== ${tabName} Tab ===`);
            testBox.add(`This tab shows logs for test: ${tabName}`);
            testBox.add(`Status: Not started`);
          }
          testBox.add("\n");
          
          this.testOutputBoxes.set(tabName, testBox);
        }
      });
      
      // Standard tabs + test tabs + aider tabs
      const allTabItems = [
        "testeranto",
        "docker-compose",
        "node-build",
        "web-build",
        "python-build",
        "golang-build",
        ...testTabNames
      ];
      
      this.tabs.setItems(allTabItems);
      this.screen.render();
    }
  }

  private async createTesterantoDockerInstance(
    testsName: string,
    composeFile: string
  ): Promise<void> {
    await this.testerantoDockerManager.createTesterantoDockerInstance(
      testsName,
      composeFile,
      this.dockerComposeOutputBox,
      this.nodeBuildOutputBox,
      this.webBuildOutputBox,
      this.pythonBuildOutputBox,
      this.golangBuildOutputBox,
      this.activeTab,
      this.screen,
      (serviceName: string, logs: string) =>
        this.updateBuildServiceTab(serviceName, logs)
    );
  }

  private updateBuildServiceTab(serviceName: string, logs: string): void {
    BuildServiceUtils.updateBuildServiceTab(
      serviceName,
      logs,
      this.nodeBuildOutputBox,
      this.webBuildOutputBox,
      this.pythonBuildOutputBox,
      this.golangBuildOutputBox,
      this.activeTab,
      this.screen
    );
  }

  private stopBuildServiceLogPolling(): void {
    this.testerantoDockerManager.stopBuildServiceLogPolling();
  }

  private updateSidebarWidth(): void {
    if (!this.screen) return;
    
    // Find sidebar and content area
    const layout = this.screen.children[0] as blessed.Widgets.LayoutElement;
    if (!layout) return;
    
    // The first child is sidebar, second is content area
    const sidebar = layout.children[0] as blessed.Widgets.BoxElement;
    const contentArea = layout.children[1] as blessed.Widgets.BoxElement;
    
    if (sidebar && contentArea) {
      // Update widths
      sidebar.width = `${this.sidebarWidth}%`;
      contentArea.left = `${this.sidebarWidth}%`;
      contentArea.width = `${100 - this.sidebarWidth}%`;
      
      // Also update the tabs list inside the sidebar to fit new width
      if (this.tabs) {
        this.tabs.width = '100%';
      }
      
      // Update all output boxes to fit new content area width
      const updateBox = (box: blessed.Widgets.Log | null) => {
        if (box) {
          box.width = '100%';
        }
      };
      
      updateBox(this.testerantoOutputBox);
      updateBox(this.dockerComposeOutputBox);
      updateBox(this.nodeBuildOutputBox);
      updateBox(this.webBuildOutputBox);
      updateBox(this.pythonBuildOutputBox);
      updateBox(this.golangBuildOutputBox);
      
      // Update test output boxes
      this.testOutputBoxes.forEach(box => {
        box.width = '100%';
      });
      
      // Update input box
      if (this.inputBox) {
        this.inputBox.width = '100%';
      }
    }
  }

  private updateFocusStatus(): void {
    const statusLine =
      this.getCurrentOutputBox()?.parent?.parent?.children?.find(
        (child: any) =>
          child.type === "box" &&
          child.content &&
          typeof child.content === "string" &&
          child.content.includes("Active:")
      );
    if (statusLine) {
      statusLine.setContent(
        `Active: ${this.activeTab} | Sidebar: ${this.sidebarWidth}% | Use ↑/↓ to switch tabs | Use ←/→ to resize sidebar | PageUp/PageDown to scroll`
      );
    }
  }

  private isMouseOverContentArea(mouseX: number, mouseY: number): boolean {
    if (!this.contentArea || !this.screen) return false;
    
    // Get content area absolute position and dimensions
    const left = this.contentArea.aleft as number;
    const top = this.contentArea.atop as number;
    const width = this.contentArea.awidth as number;
    const height = this.contentArea.aheight as number;
    
    // Check if mouse is within content area bounds
    return mouseX >= left && 
           mouseX < left + width && 
           mouseY >= top && 
           mouseY < top + height;
  }

  destroy(): void {
    this.testerantoDockerManager.stopBuildServiceLogPolling();
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
