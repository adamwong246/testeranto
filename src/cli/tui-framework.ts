// import blessed from "blessed";
// import { Command } from "commander";
// import { EventEmitter } from "events";
// import { spawn, ChildProcess } from "child_process";

// export interface TuiOptions {
//   theme?: "light" | "dark";
//   keybindings?: {
//     commandMode?: string;
//     nextTab?: string;
//     prevTab?: string;
//     newTab?: string;
//     closeTab?: string;
//     quit?: string;
//   };
//   layout?: {
//     tabBarHeight?: number;
//     commandBarHeight?: number;
//     statusBarHeight?: number;
//   };
// }

// export interface Tab {
//   id: number;
//   title: string;
//   content: blessed.Widgets.BoxElement;
//   process?: ChildProcess;
//   command: string;
//   args: string[];
//   parentId?: number;
//   depth: number;
//   isExpanded: boolean;
// }

// export class TuiFramework extends EventEmitter {
//   private screen: blessed.Widgets.Screen;
//   private program: Command;
//   private options: Required<TuiOptions>;
//   private tabBar: blessed.Widgets.ListElement;
//   private contentBox: blessed.Widgets.BoxElement;
//   private commandBar: blessed.Widgets.TextboxElement;
//   private statusBar: blessed.Widgets.BoxElement;
//   private tabs: Tab[] = [];
//   private activeTabIndex: number = 0;
//   private commandMode: boolean = false;
//   private commandHistory: string[] = [];
//   private config: any;

//   constructor(program: Command, options: TuiOptions = {}, config?: any) {
//     super();
//     this.program = program;
//     this.config = config;
//     this.options = {
//       theme: options.theme || "dark",
//       keybindings: {
//         commandMode: options.keybindings?.commandMode || ":",
//         nextTab: options.keybindings?.nextTab || "]",
//         prevTab: options.keybindings?.prevTab || "[",
//         newTab: options.keybindings?.newTab || "t",
//         closeTab: options.keybindings?.closeTab || "x",
//         quit: options.keybindings?.quit || "q",
//       },
//       layout: {
//         tabBarHeight: options.layout?.tabBarHeight || 3,
//         commandBarHeight: options.layout?.commandBarHeight || 3,
//         statusBarHeight: options.layout?.statusBarHeight || 2,
//       },
//     };

//     this.screen = blessed.screen({
//       smartCSR: true,
//       title: `${program.name()} - Terminal Multiplexer`,
//       cursor: {
//         artificial: true,
//         shape: "block",
//         blink: true,
//         color: this.options.theme === "dark" ? "white" : "black",
//       },
//       debug: process.env.DEBUG ? true : false,
//       dockBorders: false,
//       fullUnicode: false,
//       terminal: "xterm-256color",
//       sendFocus: false,
//     });

//     this.setupLayout();
//     this.setupKeybindings();
//     this.updateStatus();
//   }

//   private setupLayout(): void {
//     const { tabBarHeight, commandBarHeight, statusBarHeight } =
//       this.options.layout;

//     // Calculate sidebar width (30% of screen width, minimum 20 characters)
//     const screenWidth = this.screen.width as number;
//     const sidebarWidth = Math.max(20, Math.floor(screenWidth * 0.3));
//     const mainWidth = screenWidth - sidebarWidth;

//     // Sidebar for vertical tab list (left side)
//     this.tabBar = blessed.list({
//       top: 0,
//       left: 0,
//       width: sidebarWidth,
//       height: `100%-${commandBarHeight + statusBarHeight}`,
//       style: {
//         selected: {
//           bg: this.options.theme === "dark" ? "blue" : "lightblue",
//           fg: "white",
//         },
//         item: {
//           fg: this.options.theme === "dark" ? "white" : "black",
//         },
//         border: {
//           fg: this.options.theme === "dark" ? "cyan" : "blue",
//         },
//       },
//       keys: true,
//       mouse: true,
//       border: { type: "line" },
//       scrollbar: {
//         ch: " ",
//         track: { bg: "gray" },
//         style: { bg: "yellow" },
//       },
//       label: " Tabs ",
//     });

//     // Content area (main display for active tab) - right side
//     this.contentBox = blessed.box({
//       top: 0,
//       left: sidebarWidth,
//       width: mainWidth,
//       height: `100%-${commandBarHeight + statusBarHeight}`,
//       border: { type: "line" },
//       style: {
//         border: { fg: this.options.theme === "dark" ? "cyan" : "blue" },
//         fg: "white",
//         bg: "black",
//       },
//       scrollable: true,
//       alwaysScroll: true,
//       scrollbar: {
//         ch: " ",
//         track: { bg: "gray" },
//         style: { bg: "yellow" },
//       },
//       keys: true,
//       vi: true,
//       mouse: true,
//       label: " Content ",
//     });

//     // Status bar at the bottom
//     this.statusBar = blessed.box({
//       top: `100%-${commandBarHeight + statusBarHeight}`,
//       left: 0,
//       width: "100%",
//       height: statusBarHeight,
//       style: {
//         bg: this.options.theme === "dark" ? "magenta" : "lightmagenta",
//         fg: "white",
//       },
//       border: { type: "line" },
//       content: "",
//     });

//     // Command bar at the bottom
//     this.commandBar = blessed.textbox({
//       top: `100%-${commandBarHeight}`,
//       left: 0,
//       width: "100%",
//       height: commandBarHeight,
//       border: { type: "line" },
//       style: {
//         border: { fg: this.options.theme === "dark" ? "green" : "darkgreen" },
//         fg: "white",
//         bg: "black",
//       },
//       inputOnFocus: true,
//       keys: true,
//       vi: true,
//       label: " Command ",
//     });

//     this.screen.append(this.tabBar);
//     this.screen.append(this.contentBox);
//     this.screen.append(this.statusBar);
//     this.screen.append(this.commandBar);

//     // Initial welcome tab
//     this.createTab("Welcome", "", []);
//   }

//   private setupKeybindings(): void {
//     const { keybindings } = this.options;

//     // Toggle command mode
//     this.screen.key(keybindings.commandMode, () => {
//       this.commandMode = true;
//       this.commandBar.focus();
//       // Make command bar editable
//       this.commandBar.inputOnFocus = true;
//       this.commandBar.style.border.fg =
//         this.options.theme === "dark" ? "green" : "darkgreen";
//       this.commandBar.label = " Command ";
//       this.commandBar.setValue(":");
//       this.screen.render();
//     });

//     // Tab navigation
//     this.screen.key(keybindings.nextTab, () => {
//       this.switchToTab((this.activeTabIndex + 1) % this.tabs.length);
//     });

//     this.screen.key(keybindings.prevTab, () => {
//       this.switchToTab(
//         (this.activeTabIndex - 1 + this.tabs.length) % this.tabs.length
//       );
//     });

//     this.screen.key(keybindings.newTab, () => {
//       this.promptNewCommand();
//     });

//     this.screen.key(keybindings.closeTab, () => {
//       if (this.tabs.length > 1) {
//         this.closeTab(this.activeTabIndex);
//       }
//     });

//     // Quit
//     this.screen.key(keybindings.quit, () => {
//       this.cleanup();
//       process.exit(0);
//     });

//     // Command bar handling
//     this.commandBar.on("submit", (value: string) => {
//       this.handleCommand(value);
//       this.commandBar.clearValue();
//       this.commandMode = false;
//       // Restore the current tab's command in the command bar
//       const activeTab = this.tabs[this.activeTabIndex];
//       if (activeTab) {
//         this.updateCommandBarWithTabCommand(activeTab);
//       }
//       this.contentBox.focus();
//       this.screen.render();
//     });

//     this.commandBar.on("cancel", () => {
//       this.commandBar.clearValue();
//       this.commandMode = false;
//       // Restore the current tab's command in the command bar
//       const activeTab = this.tabs[this.activeTabIndex];
//       if (activeTab) {
//         this.updateCommandBarWithTabCommand(activeTab);
//       }
//       this.contentBox.focus();
//       this.screen.render();
//     });

//     // Global keys
//     this.screen.key(["C-c"], () => {
//       this.cleanup();
//       process.exit(0);
//     });

//     // Tab selection
//     this.tabBar.on("select", (_, index) => {
//       this.switchToTab(index);
//     });

//     // Focus management between sidebar and content
//     this.contentBox.key(["tab"], () => {
//       this.tabBar.focus();
//       this.updateFocusStyles();
//       this.screen.render();
//     });

//     this.tabBar.key(["tab"], () => {
//       this.contentBox.focus();
//       this.updateFocusStyles();
//       this.screen.render();
//     });

//     // Allow selecting tabs with Enter in sidebar
//     this.tabBar.key(["enter"], () => {
//       const selectedIndex = this.tabBar.selected;
//       if (selectedIndex >= 0 && selectedIndex < this.tabs.length) {
//         this.switchToTab(selectedIndex);
//       }
//     });

//     // Arrow key navigation in sidebar
//     this.tabBar.key(["up", "down"], (ch, key) => {
//       const visibleTabs = this.getVisibleTabs();
//       const currentIndex = this.tabBar.selected;
//       let newIndex = currentIndex;

//       if (key.name === "up") {
//         newIndex = Math.max(0, currentIndex - 1);
//       } else if (key.name === "down") {
//         newIndex = Math.min(visibleTabs.length - 1, currentIndex + 1);
//       }

//       if (newIndex !== currentIndex) {
//         this.tabBar.select(newIndex);
//         this.tabBar.scrollTo(newIndex);
//         this.screen.render();
//       }
//     });

//     // Space to expand/collapse
//     this.tabBar.key(["space"], () => {
//       const visibleTabs = this.getVisibleTabs();
//       const selectedIndex = this.tabBar.selected;
//       if (selectedIndex >= 0 && selectedIndex < visibleTabs.length) {
//         const tab = visibleTabs[selectedIndex];
//         const hasChildren = this.tabs.some((t) => t.parentId === tab.id);
//         if (hasChildren) {
//           tab.isExpanded = !tab.isExpanded;
//           this.updateTabBar();
//         }
//       }
//     });

//     // Arrow keys in content area should scroll
//     this.contentBox.key(["up", "down"], (ch, key) => {
//       const scrollAmount = 1;
//       if (key.name === "up") {
//         this.contentBox.scroll(-scrollAmount);
//       } else if (key.name === "down") {
//         this.contentBox.scroll(scrollAmount);
//       }
//       this.screen.render();
//     });

//     // Left/right arrow keys to switch focus between sidebar and content
//     this.screen.key(["left"], () => {
//       if (this.contentBox.focused) {
//         this.tabBar.focus();
//         this.updateFocusStyles();
//         this.screen.render();
//       }
//     });

//     this.screen.key(["right"], () => {
//       if (this.tabBar.focused) {
//         this.contentBox.focus();
//         this.updateFocusStyles();
//         this.screen.render();
//       }
//     });
//   }

//   private createTab(
//     title: string,
//     command: string,
//     args: string[],
//     parentId?: number
//   ): Tab {
//     const tabId = this.tabs.length;
//     const tabContent = blessed.box({
//       parent: this.contentBox,
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       content: "",
//       scrollable: true,
//       alwaysScroll: true,
//       keys: true,
//       vi: true,
//       style: {
//         fg: "white",
//         bg: "black",
//       },
//     });

//     const parentDepth = parentId !== undefined ? this.tabs[parentId].depth : -1;
//     const tab: Tab = {
//       id: tabId,
//       title: title,
//       content: tabContent,
//       command,
//       args,
//       parentId,
//       depth: parentDepth + 1,
//       isExpanded: true,
//     };

//     this.tabs.push(tab);
//     this.updateTabBar();
//     this.switchToTab(tabId);

//     // Log initial message
//     this.writeToTab(tabId, `Tab ${tabId}: ${title}\n`);
//     this.writeToTab(tabId, `Command: ${command} ${args.join(" ")}\n`);
//     this.writeToTab(tabId, "─".repeat(50) + "\n");

//     return tab;
//   }

//   private writeToTab(tabId: number, message: string): void {
//     const tab = this.tabs[tabId];
//     if (!tab) return;

//     const currentContent = tab.content.getContent();
//     tab.content.setContent(currentContent + message);
//     tab.content.setScrollPerc(100);

//     if (tabId === this.activeTabIndex) {
//       this.screen.render();
//     }
//   }

//   private updateTabBar(): void {
//     const visibleTabs: Tab[] = [];

//     // Build visible tabs based on expansion state
//     for (let i = 0; i < this.tabs.length; i++) {
//       const tab = this.tabs[i];

//       // Check if this tab should be visible
//       let isVisible = true;
//       if (tab.parentId !== undefined) {
//         // Check all ancestors are expanded
//         let currentParentId = tab.parentId;
//         while (currentParentId !== undefined) {
//           const parentTab = this.tabs[currentParentId];
//           if (!parentTab.isExpanded) {
//             isVisible = false;
//             break;
//           }
//           currentParentId = parentTab.parentId;
//         }
//       }

//       if (isVisible) {
//         visibleTabs.push(tab);
//       }
//     }

//     const items = visibleTabs.map((tab) => {
//       const isActive = tab.id === this.tabs[this.activeTabIndex]?.id;
//       const prefix = isActive ? "▶ " : "  ";

//       // Indentation based on depth
//       const indent = "  ".repeat(tab.depth);

//       // Expansion indicator for tabs with children
//       let expandIndicator = "";
//       const hasChildren = this.tabs.some((t) => t.parentId === tab.id);
//       if (hasChildren) {
//         expandIndicator = tab.isExpanded ? "[-] " : "[+] ";
//       } else {
//         expandIndicator = "    ";
//       }

//       // Truncate title if too long for sidebar
//       const maxTitleLength =
//         (this.tabBar.width as number) -
//         6 -
//         indent.length -
//         expandIndicator.length;
//       let title = tab.title;
//       if (title.length > maxTitleLength) {
//         title = title.substring(0, maxTitleLength - 3) + "...";
//       }

//       return `${prefix}${indent}${expandIndicator}${title}`;
//     });

//     this.tabBar.setItems(items);
//     this.screen.render();
//   }

//   private switchToTab(index: number): void {
//     if (index < 0 || index >= this.tabs.length) return;

//     this.activeTabIndex = index;
//     const tab = this.tabs[index];

//     // Hide all tab contents
//     this.tabs.forEach((t) => {
//       t.content.hide();
//     });

//     // Show active tab content
//     tab.content.show();

//     // Update sidebar selection to the visible position
//     const visibleTabs = this.getVisibleTabs();
//     const visibleIndex = visibleTabs.findIndex((t) => t.id === index);
//     if (visibleIndex >= 0) {
//       this.tabBar.select(visibleIndex);
//       this.tabBar.scrollTo(visibleIndex);
//     }

//     // Update command bar to show the tab's command
//     this.updateCommandBarWithTabCommand(tab);

//     this.updateTabBar();
//     this.updateStatus();
//     this.screen.render();
//   }

//   private updateFocusStyles(): void {
//     if (this.tabBar.focused) {
//       this.tabBar.style.border.fg =
//         this.options.theme === "dark" ? "yellow" : "orange";
//       this.contentBox.style.border.fg =
//         this.options.theme === "dark" ? "cyan" : "blue";
//     } else if (this.contentBox.focused) {
//       this.tabBar.style.border.fg =
//         this.options.theme === "dark" ? "cyan" : "blue";
//       this.contentBox.style.border.fg =
//         this.options.theme === "dark" ? "yellow" : "orange";
//     }
//   }

//   private updateCommandBarWithTabCommand(tab: Tab): void {
//     // Build the command string
//     const commandStr = this.buildCommandString(tab.command, tab.args);
//     // Set the command bar value without focusing it
//     this.commandBar.setValue(commandStr);
//     // Make it read-only by removing inputOnFocus temporarily
//     this.commandBar.inputOnFocus = false;
//     // Change style to indicate it's a display, not input
//     this.commandBar.style.border.fg =
//       this.options.theme === "dark" ? "gray" : "darkgray";
//     this.commandBar.label = " Command (Press : to edit) ";
//   }

//   private getVisibleTabs(): Tab[] {
//     const visibleTabs: Tab[] = [];

//     for (let i = 0; i < this.tabs.length; i++) {
//       const tab = this.tabs[i];

//       // Check if this tab should be visible
//       let isVisible = true;
//       if (tab.parentId !== undefined) {
//         // Check all ancestors are expanded
//         let currentParentId = tab.parentId;
//         while (currentParentId !== undefined) {
//           const parentTab = this.tabs[currentParentId];
//           if (!parentTab.isExpanded) {
//             isVisible = false;
//             break;
//           }
//           currentParentId = parentTab.parentId;
//         }
//       }

//       if (isVisible) {
//         visibleTabs.push(tab);
//       }
//     }

//     return visibleTabs;
//   }

//   private buildCommandString(command: string, args: string[]): string {
//     if (!command) return "";
//     const allArgs = args.map((arg) => {
//       // Quote arguments with spaces
//       if (arg.includes(" ")) {
//         return `"${arg}"`;
//       }
//       return arg;
//     });
//     return `${command} ${allArgs.join(" ")}`.trim();
//   }

//   private closeTab(index: number): void {
//     const tab = this.tabs[index];

//     // Kill process if running
//     if (tab.process) {
//       tab.process.kill();
//     }

//     // Remove tab
//     this.tabs.splice(index, 1);

//     // Adjust active tab index
//     if (this.activeTabIndex >= index) {
//       this.activeTabIndex = Math.max(0, this.activeTabIndex - 1);
//     }

//     if (this.tabs.length > 0) {
//       this.switchToTab(this.activeTabIndex);
//     } else {
//       this.createTab("Welcome", "help", []);
//     }

//     this.updateTabBar();
//   }

//   private promptNewCommand(): void {
//     this.commandMode = true;
//     this.commandBar.focus();
//     this.commandBar.setValue(":");
//     this.screen.render();
//   }

//   private handleCommand(input: string): void {
//     if (!input.trim()) return;

//     // Add to history
//     this.commandHistory.unshift(input);
//     if (this.commandHistory.length > 100) {
//       this.commandHistory.pop();
//     }

//     // Remove leading ':' if present
//     const command = input.startsWith(":") ? input.substring(1) : input;

//     // Execute command in current tab or create new tab
//     this.executeCommand(command);
//   }

//   private async executeCommand(commandLine: string): Promise<void> {
//     const args = this.parseCommandLine(commandLine);
//     if (args.length === 0) return;

//     const commandName = args[0];
//     const commandArgs = args.slice(1);

//     // Check if command exists in the program
//     const cmd = this.program.commands.find((c) => c.name() === commandName);
//     if (!cmd) {
//       this.writeToTab(this.activeTabIndex, `Unknown command: ${commandName}\n`);
//       this.writeToTab(
//         this.activeTabIndex,
//         `Available commands: ${this.getAvailableCommands().join(", ")}\n`
//       );
//       return;
//     }

//     // Create a new tab for this command
//     const tabTitle = `${commandName} ${commandArgs.join(" ")}`.trim();
//     const tab = this.createTab(tabTitle, commandName, commandArgs);

//     // Execute the command
//     try {
//       // Capture console output
//       const originalLog = console.log;
//       const originalError = console.error;
//       const originalWarn = console.warn;

//       console.log = (...args) => {
//         this.writeToTab(tab.id, args.join(" ") + "\n");
//       };

//       console.error = (...args) => {
//         this.writeToTab(tab.id, `ERROR: ${args.join(" ")}\n`);
//       };

//       console.warn = (...args) => {
//         this.writeToTab(tab.id, `WARN: ${args.join(" ")}\n`);
//       };

//       // Execute the command directly using its action
//       // We need to parse options manually
//       const command = this.program.commands.find(
//         (c) => c.name() === commandName
//       );
//       if (command && command._actionHandler) {
//         // Parse options for this command
//         // For simplicity, we'll just call the action with the arguments
//         // In a real implementation, we should properly parse options
//         try {
//           await command._actionHandler(...commandArgs);
//           this.writeToTab(tab.id, `\nCommand completed successfully.\n`);
//         } catch (error) {
//           this.writeToTab(
//             tab.id,
//             `Error executing command: ${
//               error instanceof Error ? error.message : String(error)
//             }\n`
//           );
//         }
//       } else {
//         // Fallback to parsing
//         const fullArgs = [commandName, ...commandArgs];
//         await this.program.parseAsync(fullArgs, { from: "user" });
//       }

//       // Restore original console methods
//       console.log = originalLog;
//       console.error = originalError;
//       console.warn = originalWarn;
//     } catch (error) {
//       this.writeToTab(
//         tab.id,
//         `Error: ${error instanceof Error ? error.message : String(error)}\n`
//       );
//     }
//   }

//   private parseCommandLine(line: string): string[] {
//     const args: string[] = [];
//     let current = "";
//     let inQuotes = false;
//     let quoteChar = "";

//     for (let i = 0; i < line.length; i++) {
//       const char = line[i];

//       if (char === '"' || char === "'") {
//         if (!inQuotes) {
//           inQuotes = true;
//           quoteChar = char;
//         } else if (char === quoteChar) {
//           inQuotes = false;
//           quoteChar = "";
//         } else {
//           current += char;
//         }
//       } else if (char === " " && !inQuotes) {
//         if (current) {
//           args.push(current);
//           current = "";
//         }
//       } else {
//         current += char;
//       }
//     }

//     if (current) {
//       args.push(current);
//     }

//     return args;
//   }

//   private getAvailableCommands(): string[] {
//     const commands: string[] = [];
//     this.program.commands.forEach((cmd) => {
//       commands.push(cmd.name());
//     });
//     return commands;
//   }

//   private updateStatus(): void {
//     const activeTab = this.tabs[this.activeTabIndex];
//     const tabInfo = `Tab ${this.activeTabIndex + 1}/${this.tabs.length}: ${
//       activeTab?.title || "None"
//     }`;
//     const commandInfo = `Commands: ${this.getAvailableCommands().length}`;
//     const modeInfo = this.commandMode ? "CMD" : "NORM";
//     const focusInfo = this.tabBar.focused ? "Sidebar" : "Content";

//     // Navigation hints
//     let navHints = "";
//     if (this.tabBar.focused) {
//       navHints = "[↑/↓]nav [Space]expand [Enter]select [→]content [Tab]content";
//     } else if (this.contentBox.focused) {
//       navHints = "[↑/↓]scroll [←]sidebar [Tab]sidebar";
//     }

//     const help = `[${this.options.keybindings.commandMode}]cmd [${this.options.keybindings.newTab}]new [${this.options.keybindings.closeTab}]close [${this.options.keybindings.prevTab}/${this.options.keybindings.nextTab}]tab`;

//     // Truncate if too long
//     const maxWidth = (this.screen.width as number) - 4;
//     let status = `${tabInfo} | ${commandInfo} | ${modeInfo} | Focus:${focusInfo} | ${navHints} | ${help}`;
//     if (status.length > maxWidth) {
//       status = status.substring(0, maxWidth - 3) + "...";
//     }

//     this.statusBar.setContent(status);
//     this.screen.render();
//   }

//   private cleanup(): void {
//     // Kill all running processes
//     this.tabs.forEach((tab) => {
//       if (tab.process) {
//         tab.process.kill();
//       }
//     });
//     this.screen.destroy();
//   }

//   public start(): void {
//     // Clear the default welcome tab
//     this.tabs = [];
//     this.activeTabIndex = 0;

//     // Create fixed tabs
//     this.createFixedTabs();

//     // Switch to first tab
//     if (this.tabs.length > 0) {
//       this.switchToTab(0);
//     }

//     this.contentBox.focus();
//     this.updateFocusStyles();
//     this.updateStatus();
//     this.screen.render();
//   }

//   private createFixedTabs(): void {
//     // Create DockerMan tab as the first tab
//     const dockerManTab = this.createTab("DockerMan", "docker", ["man"]);
//     this.writeToTab(dockerManTab.id, "DockerMan is starting...\n");
//     this.writeToTab(
//       dockerManTab.id,
//       "This tab manages Docker containers and images.\n"
//     );
//     this.writeToTab(
//       dockerManTab.id,
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n"
//     );
//     this.writeToTab(
//       dockerManTab.id,
//       "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n"
//     );

//     // Create docker-compose tab - using a placeholder command since it's not in the shared program
//     const dockerTab = this.createTab("Docker Compose", "docker-compose", [
//       "up",
//     ]);
//     this.writeToTab(dockerTab.id, "Starting docker-compose...\n");
//     this.writeToTab(
//       dockerTab.id,
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n"
//     );
//     this.writeToTab(
//       dockerTab.id,
//       "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n"
//     );

//     // Create runtime tabs using commands from the shared program
//     // Since the shared program doesn't have node/web/golang/python commands, we'll use 'status' as a placeholder
//     const nodeTab = this.createTab("Node Runtime", "status", []);
//     this.writeToTab(nodeTab.id, "Node runtime is starting...\n");
//     this.writeToTab(
//       nodeTab.id,
//       "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n"
//     );

//     const webTab = this.createTab("Web Runtime", "status", []);
//     this.writeToTab(webTab.id, "Web runtime is starting...\n");
//     this.writeToTab(
//       webTab.id,
//       "Duis aute irure dolor in reprehenderit in voluptate velit esse.\n"
//     );

//     const golangTab = this.createTab("Golang Runtime", "status", []);
//     this.writeToTab(golangTab.id, "Golang runtime is starting...\n");
//     this.writeToTab(
//       golangTab.id,
//       "Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.\n"
//     );

//     const pythonTab = this.createTab("Python Runtime", "status", []);
//     this.writeToTab(pythonTab.id, "Python runtime is starting...\n");
//     this.writeToTab(
//       pythonTab.id,
//       "Cupidatat non proident, sunt in culpa qui officia deserunt mollit.\n"
//     );

//     // Create test tabs based on configuration if available
//     if (this.config) {
//       // Node tests - nested under Node Runtime
//       Object.keys(this.config.node?.tests || {}).forEach((testPath) => {
//         this.createTestTab(`Node: ${testPath}`, "run", [testPath], nodeTab.id);
//       });

//       // Web tests - nested under Web Runtime
//       Object.keys(this.config.web?.tests || {}).forEach((testPath) => {
//         this.createTestTab(`Web: ${testPath}`, "run", [testPath], webTab.id);
//       });

//       // Golang tests - nested under Golang Runtime
//       Object.keys(this.config.golang?.tests || {}).forEach((testPath) => {
//         this.createTestTab(
//           `Golang: ${testPath}`,
//           "run",
//           [testPath],
//           golangTab.id
//         );
//       });

//       // Python tests - nested under Python Runtime
//       Object.keys(this.config.python?.tests || {}).forEach((testPath) => {
//         this.createTestTab(
//           `Python: ${testPath}`,
//           "run",
//           [testPath],
//           pythonTab.id
//         );
//       });
//     } else {
//       // Fallback to placeholder tests
//       this.createTestTab(
//         "Node Test 1",
//         "run",
//         ["src/example/Calculator.test.ts"],
//         nodeTab.id
//       );
//       this.createTestTab(
//         "Web Test 1",
//         "run",
//         ["src/example/Calculator.test.ts"],
//         webTab.id
//       );
//       this.createTestTab(
//         "Golang Test 1",
//         "run",
//         ["src/example/Calculator.golingvu.test.go"],
//         golangTab.id
//       );
//       this.createTestTab(
//         "Python Test 1",
//         "run",
//         ["src/example/Calculator.pitono.test.py"],
//         pythonTab.id
//       );
//     }
//   }

//   private createTestTab(
//     title: string,
//     command: string,
//     args: string[],
//     parentId?: number
//   ): Tab {
//     const tab = this.createTab(title, command, args, parentId);
//     this.writeToTab(tab.id, `Running ${command} ${args.join(" ")}\n`);
//     this.writeToTab(
//       tab.id,
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n"
//     );
//     this.writeToTab(
//       tab.id,
//       "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n"
//     );
//     this.writeToTab(
//       tab.id,
//       "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n"
//     );
//     return tab;
//   }

//   public destroy(): void {
//     this.cleanup();
//   }
// }

// export function createTui(
//   program: Command,
//   options?: TuiOptions,
//   config?: any
// ): TuiFramework {
//   const tui = new TuiFramework(program, options, config);
//   tui.start();
//   return tui;
// }
