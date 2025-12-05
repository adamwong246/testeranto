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
import { TuiTesterantoDockerManager } from "./testeranto-docker-manager";
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
      this.startDockerComposeFromConfig(configFilepath);
    }

    // Create main layout container
    const layout = BlessedElementFactory.createLayout(this.screen);

    // Create left sidebar for tabs (initial width from this.sidebarWidth)
    const sidebar = BlessedElementFactory.createSidebar(
      layout,
      theme,
      this.sidebarWidth
    );
    // Disable mouse on sidebar
    sidebar.mouse = false;
    sidebar.clickable = false;

    // Create tree list in sidebar
    this.tabs = BlessedElementFactory.createTreeList(sidebar, theme);
    // Disable mouse on tabs list
    this.tabs.mouse = false;
    this.tabs.clickable = false;

    // Create main content area (100% - sidebarWidth)
    this.contentArea = BlessedElementFactory.createContentArea(
      layout,
      this.sidebarWidth
    );
    const contentArea = this.contentArea;

    // Add a status line at the top to show active tab and keyboard hints
    const statusLine = BlessedElementFactory.createStatusLine(
      contentArea,
      "Active: testeranto | Sidebar: 20% | Tree view enabled | Use ↑/↓ to navigate tree | Use ←/→ to resize sidebar | PageUp/PageDown to scroll",
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

    // Tab selection handler - for keyboard selection
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
      const prevIndex =
        (currentIndex - 1 + this.tabs!.items.length) % this.tabs!.items.length;
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
      const prevIndex =
        (currentIndex - 1 + this.tabs!.items.length) % this.tabs!.items.length;
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
    // Clean up the tab name by removing tree characters
    const cleanTabName = tabName.replace(/[▶├─└│ ]/g, "").trim();

    // Hide all output boxes
    if (this.testerantoOutputBox) this.testerantoOutputBox.hide();
    if (this.dockerComposeOutputBox) this.dockerComposeOutputBox.hide();
    if (this.nodeBuildOutputBox) this.nodeBuildOutputBox.hide();
    if (this.webBuildOutputBox) this.webBuildOutputBox.hide();
    if (this.pythonBuildOutputBox) this.pythonBuildOutputBox.hide();
    if (this.golangBuildOutputBox) this.golangBuildOutputBox.hide();

    // Hide all test output boxes
    this.testOutputBoxes.forEach((box) => box.hide());

    // Show the active tab's output box
    let activeOutputBox: blessed.Widgets.Log | null = null;

    // Handle the new hierarchical structure
    if (cleanTabName === "testeranto") {
      if (this.testerantoOutputBox) this.testerantoOutputBox.show();
      activeOutputBox = this.testerantoOutputBox;
    } else if (cleanTabName === "allTests") {
      // For now, show testeranto output box for allTests
      if (this.testerantoOutputBox) this.testerantoOutputBox.show();
      activeOutputBox = this.testerantoOutputBox;
    } else if (cleanTabName === "docker-compose") {
      if (this.dockerComposeOutputBox) this.dockerComposeOutputBox.show();
      activeOutputBox = this.dockerComposeOutputBox;
    } else if (cleanTabName === "node") {
      // For the node runtime tab, show node build output
      if (this.nodeBuildOutputBox) this.nodeBuildOutputBox.show();
      activeOutputBox = this.nodeBuildOutputBox;
    } else if (cleanTabName === "web") {
      if (this.webBuildOutputBox) this.webBuildOutputBox.show();
      activeOutputBox = this.webBuildOutputBox;
    } else if (cleanTabName === "python") {
      if (this.pythonBuildOutputBox) this.pythonBuildOutputBox.show();
      activeOutputBox = this.pythonBuildOutputBox;
    } else if (cleanTabName === "golang") {
      if (this.golangBuildOutputBox) this.golangBuildOutputBox.show();
      activeOutputBox = this.golangBuildOutputBox;
    } else if (cleanTabName === "build") {
      // Determine which runtime's build to show based on context
      // For now, show node build as default
      if (this.nodeBuildOutputBox) this.nodeBuildOutputBox.show();
      activeOutputBox = this.nodeBuildOutputBox;
    } else if (cleanTabName === "Calculator") {
      // Determine which runtime's Calculator test to show
      // For now, create a generic test box
      if (!this.testOutputBoxes.has("Calculator")) {
        const testBox = this.createFakeProcessBox("Calculator", "Test");
        this.testOutputBoxes.set("Calculator", testBox);
      }
      const box = this.testOutputBoxes.get("Calculator");
      if (box) {
        box.show();
        activeOutputBox = box;
      }
    } else if (cleanTabName === "testprocess") {
      // Handle test process tab
      if (!this.testOutputBoxes.has("test process")) {
        const testBox = this.createFakeProcessBox(
          "test process",
          "Test Process"
        );
        this.testOutputBoxes.set("test process", testBox);
      }
      const box = this.testOutputBoxes.get("test process");
      if (box) {
        box.show();
        activeOutputBox = box;
      }
    } else if (cleanTabName === "aiderprocess") {
      // Handle aider process tab
      if (!this.testOutputBoxes.has("aider process")) {
        const aiderBox = this.createAiderBox("aider process", "Calculator");
        this.testOutputBoxes.set("aider process", aiderBox);
      }
      const box = this.testOutputBoxes.get("aider process");
      if (box) {
        box.show();
        activeOutputBox = box;
      }
    } else {
      // Check if it's a test name (could be like "Calculator.pitono.test")
      // First, check if it matches any of our test tabs
      let matchedTest = null;
      if (this.testTabs) {
        matchedTest = this.testTabs.find((test) => {
          const parts = test.name.split("/");
          const filename = parts[parts.length - 1];
          const name = filename.replace(/\.[^/.]+$/, "");
          return name === cleanTabName;
        });
      }

      if (matchedTest) {
        // It's a test from the config
        const runtime = matchedTest.runtime;
        if (!this.testOutputBoxes.has(cleanTabName)) {
          const testBox = this.createFakeProcessBox(cleanTabName, runtime);
          this.testOutputBoxes.set(cleanTabName, testBox);
        }
        const box = this.testOutputBoxes.get(cleanTabName);
        if (box) {
          box.show();
          activeOutputBox = box;
        }
      } else {
        // Check if it's a test process or aider process
        if (cleanTabName === "testprocess" || cleanTabName === "test process") {
          // Find the parent test name from context
          // For now, create a generic test process box
          if (!this.testOutputBoxes.has("test process")) {
            const testBox = this.createFakeProcessBox(
              "test process",
              "Test Process"
            );
            this.testOutputBoxes.set("test process", testBox);
          }
          const box = this.testOutputBoxes.get("test process");
          if (box) {
            box.show();
            activeOutputBox = box;
          }
        } else if (
          cleanTabName === "aiderprocess" ||
          cleanTabName === "aider process"
        ) {
          // Find the parent test name from context
          // For now, create a generic aider box
          if (!this.testOutputBoxes.has("aider process")) {
            const aiderBox = this.createAiderBox("aider process", "Test");
            this.testOutputBoxes.set("aider process", aiderBox);
          }
          const box = this.testOutputBoxes.get("aider process");
          if (box) {
            box.show();
            activeOutputBox = box;
          }
        } else {
          // For any other tab, create a generic box
          if (!this.testOutputBoxes.has(cleanTabName)) {
            const genericBox = this.createFakeProcessBox(
              cleanTabName,
              "Generic"
            );
            this.testOutputBoxes.set(cleanTabName, genericBox);
          }
          const box = this.testOutputBoxes.get(cleanTabName);
          if (box) {
            box.show();
            activeOutputBox = box;
          }
        }
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
        statusLine.setContent(
          `Active: ${cleanTabName} | Tab: switch focus | Mouse wheel scrolls when output box is focused`
        );
      }
    }

    // Re-render screen
    if (this.screen) {
      this.screen.render();
    }

    this.activeTab = cleanTabName;
    // Reset history index for the new tab
    this.historyIndex = this.getCurrentCommandHistory().length;
  }

  private createFakeProcessBox(
    tabName: string,
    runtime: string
  ): blessed.Widgets.Log {
    const box = BlessedElementFactory.createLogBox(
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

    // Disable mouse on the box
    box.mouse = false;
    box.clickable = false;

    // Add fake content
    box.add(`=== ${tabName} (${runtime}) ===`);
    box.add(`This is a fake process tab showing simulated logs.`);
    box.add(`Runtime: ${runtime}`);
    box.add(`Process ID: ${Math.floor(Math.random() * 10000)}`);
    box.add(`Status: Running`);
    box.add(`\n`);
    box.add(`[${new Date().toISOString()}] Process started`);
    box.add(`[${new Date().toISOString()}] Initializing modules...`);
    box.add(`[${new Date().toISOString()}] Loading configuration...`);
    box.add(`[${new Date().toISOString()}] Connecting to database...`);
    box.add(
      `[${new Date().toISOString()}] Starting HTTP server on port ${
        3000 + Math.floor(Math.random() * 1000)
      }...`
    );
    box.add(`[${new Date().toISOString()}] Ready to accept connections`);
    box.add(`[${new Date().toISOString()}] Processing request #1`);
    box.add(`[${new Date().toISOString()}] Processing request #2`);
    box.add(`[${new Date().toISOString()}] Processing request #3`);
    box.add(`\n`);
    box.add(`Fake logs will continue to appear here.`);
    box.add(`Use PageUp/PageDown to scroll through the logs.`);

    return box;
  }

  private createAiderBox(
    tabName: string,
    testName: string
  ): blessed.Widgets.Log {
    const box = BlessedElementFactory.createLogBox(
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

    // Disable mouse on the box
    box.mouse = false;
    box.clickable = false;

    // Add aider content
    box.add(`=== ${tabName} ===`);
    box.add(`This is the aider tab for test: ${testName}`);
    box.add(
      `Aider provides AI-powered assistance for test development and debugging.`
    );
    box.add(`\n`);
    box.add(`Available commands:`);
    box.add(`  • help - Show this help message`);
    box.add(`  • explain - Explain the current test structure`);
    box.add(`  • suggest - Suggest improvements to the test`);
    box.add(`  • generate - Generate test cases based on requirements`);
    box.add(`  • debug - Help debug failing tests`);
    box.add(`\n`);
    box.add(`Example usage:`);
    box.add(`  Type 'explain' to get an explanation of the test structure.`);
    box.add(`  Type 'suggest' to get suggestions for improving test coverage.`);
    box.add(`  Type 'generate' to generate additional test cases.`);
    box.add(`\n`);
    box.add(`Status: Ready to assist`);
    box.add(`Last updated: ${new Date().toISOString()}`);
    box.add(`\n`);
    box.add(`Type a command in the input box below to interact with aider.`);

    return box;
  }

  private getCurrentOutputBox(): blessed.Widgets.Log | null {
    // Check for main tabs
    switch (this.activeTab) {
      case "testeranto":
      case "allTests":
        return this.testerantoOutputBox;
      case "docker-compose":
        return this.dockerComposeOutputBox;
      case "node":
      case "build": // When build is selected, default to node build
        return this.nodeBuildOutputBox;
      case "web":
        return this.webBuildOutputBox;
      case "python":
        return this.pythonBuildOutputBox;
      case "golang":
        return this.golangBuildOutputBox;
      case "Calculator":
      case "test process":
      case "aider process":
        return this.testOutputBoxes.get(this.activeTab) || null;
      default:
        // Check if it's a process tab
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

  private testerantoDockerManager: TuiTesterantoDockerManager =
    new TuiTesterantoDockerManager();
  private testTabs: { name: string; runtime: string }[] = [];

  // Sidebar resizing state
  private isResizingSidebar: boolean = false;
  private sidebarWidth: number = 20; // Percentage
  private minSidebarWidth: number = 10;
  private maxSidebarWidth: number = 50;
  private contentArea: blessed.Widgets.BoxElement | null = null;

  private async startDockerComposeFromConfig(
    configFilepath: string
  ): Promise<void> {
    // Start docker-compose in the background
    setTimeout(async () => {
      await DockerComposeStarter.startDockerCompose(
        configFilepath,
        // this.dockerComposeOutputBox,  // docker-compose logs go here
        this.testerantoOutputBox,
        this.screen,
        (tabName: string) => this.switchTab(tabName),
        this.tabs,
        (testsName: string, composeFile: string) =>
          this.createTesterantoDockerInstance(testsName, composeFile),
        (tests: { name: string; runtime: string }[]) => {
          this.updateTabsWithTests(tests);
        },
        // Pass testerantoOutputBox for DockerManager logs
        this.testerantoOutputBox // DockerManager logs go here
      );
    }, 1000); // Wait 1 second for the TUI to initialize
  }

  private updateTabsWithTests(
    tests: { name: string; runtime: string }[]
  ): void {
    this.testTabs = tests;

    // Update the tabs list with tree structure
    if (this.tabs && this.screen && this.testerantoOutputBox) {
      // Group tests by runtime
      const testsByRuntime: Record<
        string,
        Array<{ name: string; displayName: string }>
      > = {
        node: [],
        web: [],
        python: [],
        golang: [],
      };

      tests.forEach((test) => {
        const parts = test.name.split("/");
        const filename = parts[parts.length - 1];
        const name = filename.replace(/\.[^/.]+$/, "");
        const displayName = `${name}`;

        if (testsByRuntime[test.runtime]) {
          testsByRuntime[test.runtime].push({ name: test.name, displayName });
        }
      });

      // Build tree items with the new hierarchical structure
      const treeItems = [
        "▶ testeranto",
        "  └─▶ allTests",
        ...this.buildProjectTreeItems(testsByRuntime),
      ];

      this.tabs.setItems(treeItems);
      this.screen.render();
    }
  }

  private buildProjectTreeItems(
    testsByRuntime: Record<string, Array<{ name: string; displayName: string }>>
  ): string[] {
    const items: string[] = [];

    // Add docker-compose under allTests
    items.push("      ├─▶ docker-compose");

    // Add each runtime with its build service and tests
    const runtimes = ["node", "web", "python", "golang"];

    for (let i = 0; i < runtimes.length; i++) {
      const runtime = runtimes[i];
      const isLastRuntime = i === runtimes.length - 1;
      const runtimePrefix = isLastRuntime ? "      └─▶ " : "      ├─▶ ";

      // Add runtime header
      items.push(
        `      ${isLastRuntime ? " " : "│"}   ${runtimePrefix}${runtime}`
      );

      // Add build service under runtime
      const buildIndent = isLastRuntime ? "            " : "      │     ";
      items.push(`${buildIndent}├─▶ build`);

      // Add tests under runtime
      const tests = testsByRuntime[runtime] || [];
      if (tests.length === 0) {
        // If no tests, add a placeholder
        const testIndent = isLastRuntime ? "            " : "      │     ";
        items.push(`${testIndent}└─▶ (no tests)`);
      } else {
        // Add each test with its test process and aider process
        for (let j = 0; j < tests.length; j++) {
          const test = tests[j];
          const isLastTest = j === tests.length - 1;
          const testIndent = isLastRuntime ? "            " : "      │     ";
          const testPrefix = isLastTest ? "└─▶ " : "├─▶ ";

          // Extract just the filename without path for display
          const parts = test.name.split("/");
          const filename = parts[parts.length - 1];
          // Remove extension
          const name = filename.replace(/\.[^/.]+$/, "");

          // Add test name
          items.push(`${testIndent}${testPrefix}${name}`);

          // Add test process under the test
          const processIndent = isLastRuntime
            ? "              "
            : "      │       ";
          const processPrefix = "├─▶ ";
          items.push(`${processIndent}${processPrefix}test process`);

          // Add aider process under the test
          const aiderIndent = isLastRuntime
            ? "              "
            : "      │       ";
          const aiderPrefix = "└─▶ ";
          items.push(`${aiderIndent}${aiderPrefix}aider process`);
        }
      }
    }

    return items;
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
        this.tabs.width = "100%";
      }

      // Update all output boxes to fit new content area width
      const updateBox = (box: blessed.Widgets.Log | null) => {
        if (box) {
          box.width = "100%";
        }
      };

      updateBox(this.testerantoOutputBox);
      updateBox(this.dockerComposeOutputBox);
      updateBox(this.nodeBuildOutputBox);
      updateBox(this.webBuildOutputBox);
      updateBox(this.pythonBuildOutputBox);
      updateBox(this.golangBuildOutputBox);

      // Update test output boxes
      this.testOutputBoxes.forEach((box) => {
        box.width = "100%";
      });

      // Update input box
      if (this.inputBox) {
        this.inputBox.width = "100%";
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
        `Active: ${this.activeTab} | Sidebar: ${this.sidebarWidth}% | Tree view | Use ↑/↓ to navigate tree | Use ←/→ to resize sidebar | PageUp/PageDown to scroll`
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
    return (
      mouseX >= left &&
      mouseX < left + width &&
      mouseY >= top &&
      mouseY < top + height
    );
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
