// src/cli/commander-adapter.ts
import { Command } from "commander";

// src/cli/tui-framework.ts
import blessed from "blessed";
import { EventEmitter } from "events";
var TuiFramework = class extends EventEmitter {
  constructor(program2, options = {}, config2) {
    super();
    this.tabs = [];
    this.activeTabIndex = 0;
    this.commandMode = false;
    this.commandHistory = [];
    this.program = program2;
    this.config = config2;
    this.options = {
      theme: options.theme || "dark",
      keybindings: {
        commandMode: options.keybindings?.commandMode || ":",
        nextTab: options.keybindings?.nextTab || "]",
        prevTab: options.keybindings?.prevTab || "[",
        newTab: options.keybindings?.newTab || "t",
        closeTab: options.keybindings?.closeTab || "x",
        quit: options.keybindings?.quit || "q"
      },
      layout: {
        tabBarHeight: options.layout?.tabBarHeight || 3,
        commandBarHeight: options.layout?.commandBarHeight || 3,
        statusBarHeight: options.layout?.statusBarHeight || 2
      }
    };
    this.screen = blessed.screen({
      smartCSR: true,
      title: `${program2.name()} - Terminal Multiplexer`,
      cursor: {
        artificial: true,
        shape: "block",
        blink: true,
        color: this.options.theme === "dark" ? "white" : "black"
      },
      debug: process.env.DEBUG ? true : false,
      dockBorders: false,
      fullUnicode: false,
      terminal: "xterm-256color",
      sendFocus: false
    });
    this.setupLayout();
    this.setupKeybindings();
    this.updateStatus();
  }
  setupLayout() {
    const { tabBarHeight, commandBarHeight, statusBarHeight } = this.options.layout;
    const screenWidth = this.screen.width;
    const sidebarWidth = Math.max(20, Math.floor(screenWidth * 0.3));
    const mainWidth = screenWidth - sidebarWidth;
    this.tabBar = blessed.list({
      top: 0,
      left: 0,
      width: sidebarWidth,
      height: `100%-${commandBarHeight + statusBarHeight}`,
      style: {
        selected: {
          bg: this.options.theme === "dark" ? "blue" : "lightblue",
          fg: "white"
        },
        item: {
          fg: this.options.theme === "dark" ? "white" : "black"
        },
        border: {
          fg: this.options.theme === "dark" ? "cyan" : "blue"
        }
      },
      keys: true,
      mouse: true,
      border: { type: "line" },
      scrollbar: {
        ch: " ",
        track: { bg: "gray" },
        style: { bg: "yellow" }
      },
      label: " Tabs "
    });
    this.contentBox = blessed.box({
      top: 0,
      left: sidebarWidth,
      width: mainWidth,
      height: `100%-${commandBarHeight + statusBarHeight}`,
      border: { type: "line" },
      style: {
        border: { fg: this.options.theme === "dark" ? "cyan" : "blue" },
        fg: "white",
        bg: "black"
      },
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: " ",
        track: { bg: "gray" },
        style: { bg: "yellow" }
      },
      keys: true,
      vi: true,
      mouse: true,
      label: " Content "
    });
    this.statusBar = blessed.box({
      top: `100%-${commandBarHeight + statusBarHeight}`,
      left: 0,
      width: "100%",
      height: statusBarHeight,
      style: {
        bg: this.options.theme === "dark" ? "magenta" : "lightmagenta",
        fg: "white"
      },
      border: { type: "line" },
      content: ""
    });
    this.commandBar = blessed.textbox({
      top: `100%-${commandBarHeight}`,
      left: 0,
      width: "100%",
      height: commandBarHeight,
      border: { type: "line" },
      style: {
        border: { fg: this.options.theme === "dark" ? "green" : "darkgreen" },
        fg: "white",
        bg: "black"
      },
      inputOnFocus: true,
      keys: true,
      vi: true,
      label: " Command "
    });
    this.screen.append(this.tabBar);
    this.screen.append(this.contentBox);
    this.screen.append(this.statusBar);
    this.screen.append(this.commandBar);
    this.createTab("Welcome", "", []);
  }
  setupKeybindings() {
    const { keybindings } = this.options;
    this.screen.key(keybindings.commandMode, () => {
      this.commandMode = true;
      this.commandBar.focus();
      this.commandBar.inputOnFocus = true;
      this.commandBar.style.border.fg = this.options.theme === "dark" ? "green" : "darkgreen";
      this.commandBar.label = " Command ";
      this.commandBar.setValue(":");
      this.screen.render();
    });
    this.screen.key(keybindings.nextTab, () => {
      this.switchToTab((this.activeTabIndex + 1) % this.tabs.length);
    });
    this.screen.key(keybindings.prevTab, () => {
      this.switchToTab((this.activeTabIndex - 1 + this.tabs.length) % this.tabs.length);
    });
    this.screen.key(keybindings.newTab, () => {
      this.promptNewCommand();
    });
    this.screen.key(keybindings.closeTab, () => {
      if (this.tabs.length > 1) {
        this.closeTab(this.activeTabIndex);
      }
    });
    this.screen.key(keybindings.quit, () => {
      this.cleanup();
      process.exit(0);
    });
    this.commandBar.on("submit", (value) => {
      this.handleCommand(value);
      this.commandBar.clearValue();
      this.commandMode = false;
      const activeTab = this.tabs[this.activeTabIndex];
      if (activeTab) {
        this.updateCommandBarWithTabCommand(activeTab);
      }
      this.contentBox.focus();
      this.screen.render();
    });
    this.commandBar.on("cancel", () => {
      this.commandBar.clearValue();
      this.commandMode = false;
      const activeTab = this.tabs[this.activeTabIndex];
      if (activeTab) {
        this.updateCommandBarWithTabCommand(activeTab);
      }
      this.contentBox.focus();
      this.screen.render();
    });
    this.screen.key(["C-c"], () => {
      this.cleanup();
      process.exit(0);
    });
    this.tabBar.on("select", (_, index) => {
      this.switchToTab(index);
    });
    this.contentBox.key(["tab"], () => {
      this.tabBar.focus();
      this.updateFocusStyles();
      this.screen.render();
    });
    this.tabBar.key(["tab"], () => {
      this.contentBox.focus();
      this.updateFocusStyles();
      this.screen.render();
    });
    this.tabBar.key(["enter"], () => {
      const selectedIndex = this.tabBar.selected;
      if (selectedIndex >= 0 && selectedIndex < this.tabs.length) {
        this.switchToTab(selectedIndex);
      }
    });
    this.tabBar.key(["up", "down"], (ch, key) => {
      const visibleTabs = this.getVisibleTabs();
      const currentIndex = this.tabBar.selected;
      let newIndex = currentIndex;
      if (key.name === "up") {
        newIndex = Math.max(0, currentIndex - 1);
      } else if (key.name === "down") {
        newIndex = Math.min(visibleTabs.length - 1, currentIndex + 1);
      }
      if (newIndex !== currentIndex) {
        this.tabBar.select(newIndex);
        this.tabBar.scrollTo(newIndex);
        this.screen.render();
      }
    });
    this.tabBar.key(["space"], () => {
      const visibleTabs = this.getVisibleTabs();
      const selectedIndex = this.tabBar.selected;
      if (selectedIndex >= 0 && selectedIndex < visibleTabs.length) {
        const tab = visibleTabs[selectedIndex];
        const hasChildren = this.tabs.some((t) => t.parentId === tab.id);
        if (hasChildren) {
          tab.isExpanded = !tab.isExpanded;
          this.updateTabBar();
        }
      }
    });
    this.contentBox.key(["up", "down"], (ch, key) => {
      const scrollAmount = 1;
      if (key.name === "up") {
        this.contentBox.scroll(-scrollAmount);
      } else if (key.name === "down") {
        this.contentBox.scroll(scrollAmount);
      }
      this.screen.render();
    });
    this.screen.key(["left"], () => {
      if (this.contentBox.focused) {
        this.tabBar.focus();
        this.updateFocusStyles();
        this.screen.render();
      }
    });
    this.screen.key(["right"], () => {
      if (this.tabBar.focused) {
        this.contentBox.focus();
        this.updateFocusStyles();
        this.screen.render();
      }
    });
  }
  createTab(title, command, args, parentId) {
    const tabId = this.tabs.length;
    const tabContent = blessed.box({
      parent: this.contentBox,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      content: "",
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      style: {
        fg: "white",
        bg: "black"
      }
    });
    const parentDepth = parentId !== void 0 ? this.tabs[parentId].depth : -1;
    const tab = {
      id: tabId,
      title,
      content: tabContent,
      command,
      args,
      parentId,
      depth: parentDepth + 1,
      isExpanded: true
    };
    this.tabs.push(tab);
    this.updateTabBar();
    this.switchToTab(tabId);
    this.writeToTab(tabId, `Tab ${tabId}: ${title}
`);
    this.writeToTab(tabId, `Command: ${command} ${args.join(" ")}
`);
    this.writeToTab(tabId, "\u2500".repeat(50) + "\n");
    return tab;
  }
  writeToTab(tabId, message) {
    const tab = this.tabs[tabId];
    if (!tab)
      return;
    const currentContent = tab.content.getContent();
    tab.content.setContent(currentContent + message);
    tab.content.setScrollPerc(100);
    if (tabId === this.activeTabIndex) {
      this.screen.render();
    }
  }
  updateTabBar() {
    const visibleTabs = [];
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      let isVisible = true;
      if (tab.parentId !== void 0) {
        let currentParentId = tab.parentId;
        while (currentParentId !== void 0) {
          const parentTab = this.tabs[currentParentId];
          if (!parentTab.isExpanded) {
            isVisible = false;
            break;
          }
          currentParentId = parentTab.parentId;
        }
      }
      if (isVisible) {
        visibleTabs.push(tab);
      }
    }
    const items = visibleTabs.map((tab) => {
      const isActive = tab.id === this.tabs[this.activeTabIndex]?.id;
      const prefix = isActive ? "\u25B6 " : "  ";
      const indent = "  ".repeat(tab.depth);
      let expandIndicator = "";
      const hasChildren = this.tabs.some((t) => t.parentId === tab.id);
      if (hasChildren) {
        expandIndicator = tab.isExpanded ? "[-] " : "[+] ";
      } else {
        expandIndicator = "    ";
      }
      const maxTitleLength = this.tabBar.width - 6 - indent.length - expandIndicator.length;
      let title = tab.title;
      if (title.length > maxTitleLength) {
        title = title.substring(0, maxTitleLength - 3) + "...";
      }
      return `${prefix}${indent}${expandIndicator}${title}`;
    });
    this.tabBar.setItems(items);
    this.screen.render();
  }
  switchToTab(index) {
    if (index < 0 || index >= this.tabs.length)
      return;
    this.activeTabIndex = index;
    const tab = this.tabs[index];
    this.tabs.forEach((t) => {
      t.content.hide();
    });
    tab.content.show();
    const visibleTabs = this.getVisibleTabs();
    const visibleIndex = visibleTabs.findIndex((t) => t.id === index);
    if (visibleIndex >= 0) {
      this.tabBar.select(visibleIndex);
      this.tabBar.scrollTo(visibleIndex);
    }
    this.updateCommandBarWithTabCommand(tab);
    this.updateTabBar();
    this.updateStatus();
    this.screen.render();
  }
  updateFocusStyles() {
    if (this.tabBar.focused) {
      this.tabBar.style.border.fg = this.options.theme === "dark" ? "yellow" : "orange";
      this.contentBox.style.border.fg = this.options.theme === "dark" ? "cyan" : "blue";
    } else if (this.contentBox.focused) {
      this.tabBar.style.border.fg = this.options.theme === "dark" ? "cyan" : "blue";
      this.contentBox.style.border.fg = this.options.theme === "dark" ? "yellow" : "orange";
    }
  }
  updateCommandBarWithTabCommand(tab) {
    const commandStr = this.buildCommandString(tab.command, tab.args);
    this.commandBar.setValue(commandStr);
    this.commandBar.inputOnFocus = false;
    this.commandBar.style.border.fg = this.options.theme === "dark" ? "gray" : "darkgray";
    this.commandBar.label = " Command (Press : to edit) ";
  }
  getVisibleTabs() {
    const visibleTabs = [];
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      let isVisible = true;
      if (tab.parentId !== void 0) {
        let currentParentId = tab.parentId;
        while (currentParentId !== void 0) {
          const parentTab = this.tabs[currentParentId];
          if (!parentTab.isExpanded) {
            isVisible = false;
            break;
          }
          currentParentId = parentTab.parentId;
        }
      }
      if (isVisible) {
        visibleTabs.push(tab);
      }
    }
    return visibleTabs;
  }
  buildCommandString(command, args) {
    if (!command)
      return "";
    const allArgs = args.map((arg) => {
      if (arg.includes(" ")) {
        return `"${arg}"`;
      }
      return arg;
    });
    return `${command} ${allArgs.join(" ")}`.trim();
  }
  closeTab(index) {
    const tab = this.tabs[index];
    if (tab.process) {
      tab.process.kill();
    }
    this.tabs.splice(index, 1);
    if (this.activeTabIndex >= index) {
      this.activeTabIndex = Math.max(0, this.activeTabIndex - 1);
    }
    if (this.tabs.length > 0) {
      this.switchToTab(this.activeTabIndex);
    } else {
      this.createTab("Welcome", "help", []);
    }
    this.updateTabBar();
  }
  promptNewCommand() {
    this.commandMode = true;
    this.commandBar.focus();
    this.commandBar.setValue(":");
    this.screen.render();
  }
  handleCommand(input) {
    if (!input.trim())
      return;
    this.commandHistory.unshift(input);
    if (this.commandHistory.length > 100) {
      this.commandHistory.pop();
    }
    const command = input.startsWith(":") ? input.substring(1) : input;
    this.executeCommand(command);
  }
  async executeCommand(commandLine) {
    const args = this.parseCommandLine(commandLine);
    if (args.length === 0)
      return;
    const commandName = args[0];
    const commandArgs = args.slice(1);
    const cmd = this.program.commands.find((c) => c.name() === commandName);
    if (!cmd) {
      this.writeToTab(this.activeTabIndex, `Unknown command: ${commandName}
`);
      this.writeToTab(this.activeTabIndex, `Available commands: ${this.getAvailableCommands().join(", ")}
`);
      return;
    }
    const tabTitle = `${commandName} ${commandArgs.join(" ")}`.trim();
    const tab = this.createTab(tabTitle, commandName, commandArgs);
    try {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      console.log = (...args2) => {
        this.writeToTab(tab.id, args2.join(" ") + "\n");
      };
      console.error = (...args2) => {
        this.writeToTab(tab.id, `ERROR: ${args2.join(" ")}
`);
      };
      console.warn = (...args2) => {
        this.writeToTab(tab.id, `WARN: ${args2.join(" ")}
`);
      };
      const command = this.program.commands.find((c) => c.name() === commandName);
      if (command && command._actionHandler) {
        try {
          await command._actionHandler(...commandArgs);
          this.writeToTab(tab.id, `
Command completed successfully.
`);
        } catch (error) {
          this.writeToTab(tab.id, `Error executing command: ${error instanceof Error ? error.message : String(error)}
`);
        }
      } else {
        const fullArgs = [commandName, ...commandArgs];
        await this.program.parseAsync(fullArgs, { from: "user" });
      }
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    } catch (error) {
      this.writeToTab(tab.id, `Error: ${error instanceof Error ? error.message : String(error)}
`);
    }
  }
  parseCommandLine(line) {
    const args = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = "";
        } else {
          current += char;
        }
      } else if (char === " " && !inQuotes) {
        if (current) {
          args.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }
    if (current) {
      args.push(current);
    }
    return args;
  }
  getAvailableCommands() {
    const commands = [];
    this.program.commands.forEach((cmd) => {
      commands.push(cmd.name());
    });
    return commands;
  }
  updateStatus() {
    const activeTab = this.tabs[this.activeTabIndex];
    const tabInfo = `Tab ${this.activeTabIndex + 1}/${this.tabs.length}: ${activeTab?.title || "None"}`;
    const commandInfo = `Commands: ${this.getAvailableCommands().length}`;
    const modeInfo = this.commandMode ? "CMD" : "NORM";
    const focusInfo = this.tabBar.focused ? "Sidebar" : "Content";
    let navHints = "";
    if (this.tabBar.focused) {
      navHints = "[\u2191/\u2193]nav [Space]expand [Enter]select [\u2192]content [Tab]content";
    } else if (this.contentBox.focused) {
      navHints = "[\u2191/\u2193]scroll [\u2190]sidebar [Tab]sidebar";
    }
    const help = `[${this.options.keybindings.commandMode}]cmd [${this.options.keybindings.newTab}]new [${this.options.keybindings.closeTab}]close [${this.options.keybindings.prevTab}/${this.options.keybindings.nextTab}]tab`;
    const maxWidth = this.screen.width - 4;
    let status = `${tabInfo} | ${commandInfo} | ${modeInfo} | Focus:${focusInfo} | ${navHints} | ${help}`;
    if (status.length > maxWidth) {
      status = status.substring(0, maxWidth - 3) + "...";
    }
    this.statusBar.setContent(status);
    this.screen.render();
  }
  cleanup() {
    this.tabs.forEach((tab) => {
      if (tab.process) {
        tab.process.kill();
      }
    });
    this.screen.destroy();
  }
  start() {
    this.tabs = [];
    this.activeTabIndex = 0;
    this.createFixedTabs();
    if (this.tabs.length > 0) {
      this.switchToTab(0);
    }
    this.contentBox.focus();
    this.updateFocusStyles();
    this.updateStatus();
    this.screen.render();
  }
  createFixedTabs() {
    const dockerManTab = this.createTab("DockerMan", "docker", ["man"]);
    this.writeToTab(dockerManTab.id, "DockerMan is starting...\n");
    this.writeToTab(dockerManTab.id, "This tab manages Docker containers and images.\n");
    this.writeToTab(dockerManTab.id, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n");
    this.writeToTab(dockerManTab.id, "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n");
    const dockerTab = this.createTab("Docker Compose", "docker-compose", ["up"]);
    this.writeToTab(dockerTab.id, "Starting docker-compose...\n");
    this.writeToTab(dockerTab.id, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n");
    this.writeToTab(dockerTab.id, "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n");
    const nodeTab = this.createTab("Node Runtime", "status", []);
    this.writeToTab(nodeTab.id, "Node runtime is starting...\n");
    this.writeToTab(nodeTab.id, "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n");
    const webTab = this.createTab("Web Runtime", "status", []);
    this.writeToTab(webTab.id, "Web runtime is starting...\n");
    this.writeToTab(webTab.id, "Duis aute irure dolor in reprehenderit in voluptate velit esse.\n");
    const golangTab = this.createTab("Golang Runtime", "status", []);
    this.writeToTab(golangTab.id, "Golang runtime is starting...\n");
    this.writeToTab(golangTab.id, "Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.\n");
    const pythonTab = this.createTab("Python Runtime", "status", []);
    this.writeToTab(pythonTab.id, "Python runtime is starting...\n");
    this.writeToTab(pythonTab.id, "Cupidatat non proident, sunt in culpa qui officia deserunt mollit.\n");
    if (this.config) {
      Object.keys(this.config.node?.tests || {}).forEach((testPath) => {
        this.createTestTab(`Node: ${testPath}`, "run", [testPath], nodeTab.id);
      });
      Object.keys(this.config.web?.tests || {}).forEach((testPath) => {
        this.createTestTab(`Web: ${testPath}`, "run", [testPath], webTab.id);
      });
      Object.keys(this.config.golang?.tests || {}).forEach((testPath) => {
        this.createTestTab(`Golang: ${testPath}`, "run", [testPath], golangTab.id);
      });
      Object.keys(this.config.python?.tests || {}).forEach((testPath) => {
        this.createTestTab(`Python: ${testPath}`, "run", [testPath], pythonTab.id);
      });
    } else {
      this.createTestTab("Node Test 1", "run", ["src/example/Calculator.test.ts"], nodeTab.id);
      this.createTestTab("Web Test 1", "run", ["src/example/Calculator.test.ts"], webTab.id);
      this.createTestTab("Golang Test 1", "run", ["src/example/Calculator.golingvu.test.go"], golangTab.id);
      this.createTestTab("Python Test 1", "run", ["src/example/Calculator.pitono.test.py"], pythonTab.id);
    }
  }
  createTestTab(title, command, args, parentId) {
    const tab = this.createTab(title, command, args, parentId);
    this.writeToTab(tab.id, `Running ${command} ${args.join(" ")}
`);
    this.writeToTab(tab.id, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n");
    this.writeToTab(tab.id, "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n");
    this.writeToTab(tab.id, "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n");
    return tab;
  }
  destroy() {
    this.cleanup();
  }
};
function createTui(program2, options, config2) {
  const tui2 = new TuiFramework(program2, options, config2);
  tui2.start();
  return tui2;
}

// src/cli/commander-adapter.ts
var CommanderTuiAdapter = class {
  constructor(program2) {
    this.tui = null;
    this.program = program2;
  }
  /**
   * Launch the TUI interface with this program
   */
  launchTui(theme = "dark", config2) {
    this.tui = createTui(this.program, {
      theme,
      keybindings: {
        commandMode: ":",
        nextTab: "]",
        prevTab: "[",
        newTab: "t",
        closeTab: "x",
        quit: "q"
      }
    }, config2);
    this.addTuiCommands();
    return this.tui;
  }
  /**
   * Add TUI-specific commands
   */
  addTuiCommands() {
    if (!this.tui)
      return;
    this.program.command("clear").description("Clear the current tab").action(() => {
      console.log("Tab cleared");
    });
    this.program.command("tabs").description("List all open tabs").action(() => {
      console.log("Tabs feature available in TUI interface");
    });
    const originalHelp = this.program.commands.find((c) => c.name() === "help");
    if (originalHelp) {
      originalHelp.description("Show help for TUI and commands");
    }
  }
  /**
   * Get the TUI instance (if running in TUI mode)
   */
  getTui() {
    return this.tui;
  }
};
function adaptExistingProgramForTui(program2) {
  return new CommanderTuiAdapter(program2);
}

// src/cli/shared-program.ts
import { Command as Command2 } from "commander";
function createSharedProgram() {
  const program2 = new Command2();
  program2.name("testeranto").description("AI powered BDD test framework for TypeScript projects").version("0.209.0");
  program2.command("run <testPattern>").description("Run tests matching the pattern").option("-w, --watch", "Watch mode").option("-v, --verbose", "Verbose output").action((testPattern, options) => {
    console.log(`Running tests matching: ${testPattern}`);
    if (options.watch) {
      console.log("Watch mode enabled");
    }
    if (options.verbose) {
      console.log("Verbose mode enabled");
    }
    console.log("Test execution would start here...");
  });
  program2.command("build").description("Build the project").option("--clean", "Clean build directory").action((options) => {
    console.log("Building project...");
    if (options.clean) {
      console.log("Cleaning build directory...");
    }
  });
  program2.command("list").description("List available tests").action(() => {
    console.log("Available tests:");
    for (let i = 1; i <= 5; i++) {
      console.log(`  - test${i}`);
    }
    console.log("\nUse :run <testName> to execute a test");
  });
  program2.command("status").description("Show project status").action(() => {
    console.log("Project status:");
    console.log("  - Tests: 5 available");
    console.log("  - Build: Ready");
    console.log("  - Last run: 2 minutes ago");
  });
  program2.command("help").description("Show TUI and command help").action(() => {
    console.log("Testeranto - AI powered BDD test framework");
    console.log("===========================================");
    console.log("\nAvailable commands:");
    program2.commands.forEach((cmd) => {
      console.log(`  ${cmd.name().padEnd(10)} - ${cmd.description()}`);
    });
  });
  return program2;
}

// allTests.ts
import { sassPlugin } from "esbuild-sass-plugin";
var config = {
  featureIngestor: function(s) {
    throw new Error("Function not implemented.");
  },
  importPlugins: [],
  ports: ["3333"],
  src: "",
  golang: {
    plugins: [],
    loaders: {},
    tests: {
      "src/example/Calculator.golingvu.test.go": { ports: 0 }
    },
    dockerfile: [[["FROM", "golang:latest"]], "go"]
  },
  python: {
    plugins: [],
    loaders: {},
    tests: {
      "src/example/Calculator.pitono.test.py": { ports: 0 }
    },
    dockerfile: [[["FROM", "python:latest"]], "python"]
  },
  web: {
    plugins: [() => sassPlugin()],
    loaders: {
      ".ttf": "file"
    },
    tests: {
      "src/example/Calculator.test.ts": { ports: 0 }
    },
    externals: [],
    dockerfile: [
      [
        ["FROM", "node:18-alpine"],
        [
          "RUN",
          `
# Install Chromium and necessary dependencies for headless operation
RUN apk update && apk add --no-cache     chromium     nss     freetype     freetype-dev     harfbuzz     ca-certificates     ttf-freefont     font-noto-emoji     && rm -rf /var/cache/apk/*
          `
        ],
        ["ENV", "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true"],
        ["ENV", "PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser"]
      ],
      "web"
    ]
  },
  node: {
    plugins: [],
    loaders: {},
    tests: {
      "src/example/Calculator.test.ts": { ports: 0 }
    },
    externals: [],
    dockerfile: [
      [
        ["FROM", "node:18-alpine"],
        [
          "RUN",
          "apk add --update make g++ linux-headers python3 libxml2-utils netcat-openbsd"
        ],
        ["COPY", "package*.json ./"],
        ["WORKDIR", "/workspace"],
        ["RUN", "npm install --legacy-peer-deps"],
        ["COPY", "./src ./src"],
        [
          "STATIC_ANALYSIS",
          (files) => ["tsc", "yarn tsc ./src --noEmit", ...files]
        ],
        ["STATIC_ANALYSIS", (files) => ["eslint", "yarn eslint", ...files]]
      ],
      "node"
    ]
  }
};
var allTests_default = config;

// src/cli/tui.ts
var program = createSharedProgram();
var adapter = adaptExistingProgramForTui(program);
var tui = adapter.launchTui("dark", allTests_default);
process.on("SIGINT", () => {
  tui.destroy();
  process.exit(0);
});
process.on("exit", () => {
  tui.destroy();
});
