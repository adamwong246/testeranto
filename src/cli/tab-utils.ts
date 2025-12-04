import blessed from "blessed";

/**
 * Utilities for managing tabs in the TUI
 */
export class TabUtils {
  /**
   * Switch to a specific tab, updating visibility and UI state
   */
  static switchTab(
    tabName: string,
    activeTab: string,
    testerantoOutputBox: blessed.Widgets.Log | null,
    dockerComposeOutputBox: blessed.Widgets.Log | null,
    nodeBuildOutputBox: blessed.Widgets.Log | null,
    webBuildOutputBox: blessed.Widgets.Log | null,
    pythonBuildOutputBox: blessed.Widgets.Log | null,
    golangBuildOutputBox: blessed.Widgets.Log | null,
    screen: blessed.Widgets.Screen | null
  ): string {
    // Hide all output boxes
    if (testerantoOutputBox) testerantoOutputBox.hide();
    if (dockerComposeOutputBox) dockerComposeOutputBox.hide();
    if (nodeBuildOutputBox) nodeBuildOutputBox.hide();
    if (webBuildOutputBox) webBuildOutputBox.hide();
    if (pythonBuildOutputBox) pythonBuildOutputBox.hide();
    if (golangBuildOutputBox) golangBuildOutputBox.hide();

    // Show the active tab's output box
    let activeOutputBox: blessed.Widgets.Log | null = null;
    if (tabName === "testeranto") {
      if (testerantoOutputBox) testerantoOutputBox.show();
      activeOutputBox = testerantoOutputBox;
    } else if (tabName === "docker-compose") {
      if (dockerComposeOutputBox) dockerComposeOutputBox.show();
      activeOutputBox = dockerComposeOutputBox;
    } else if (tabName === "node-build") {
      if (nodeBuildOutputBox) nodeBuildOutputBox.show();
      activeOutputBox = nodeBuildOutputBox;
    } else if (tabName === "web-build") {
      if (webBuildOutputBox) webBuildOutputBox.show();
      activeOutputBox = webBuildOutputBox;
    } else if (tabName === "python-build") {
      if (pythonBuildOutputBox) pythonBuildOutputBox.show();
      activeOutputBox = pythonBuildOutputBox;
    } else if (tabName === "golang-build") {
      if (golangBuildOutputBox) golangBuildOutputBox.show();
      activeOutputBox = golangBuildOutputBox;
    }

    // Update status line
    if (activeOutputBox && screen) {
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
    if (screen) {
      screen.render();
    }

    return tabName;
  }

  /**
   * Get the active output box based on the current tab
   */
  static getActiveOutputBox(
    activeTab: string,
    testerantoOutputBox: blessed.Widgets.Log | null,
    dockerComposeOutputBox: blessed.Widgets.Log | null,
    nodeBuildOutputBox: blessed.Widgets.Log | null,
    webBuildOutputBox: blessed.Widgets.Log | null,
    pythonBuildOutputBox: blessed.Widgets.Log | null,
    golangBuildOutputBox: blessed.Widgets.Log | null
  ): blessed.Widgets.Log | null {
    switch (activeTab) {
      case "testeranto":
        return testerantoOutputBox;
      case "docker-compose":
        return dockerComposeOutputBox;
      case "node-build":
        return nodeBuildOutputBox;
      case "web-build":
        return webBuildOutputBox;
      case "python-build":
        return pythonBuildOutputBox;
      case "golang-build":
        return golangBuildOutputBox;
      default:
        return null;
    }
  }
}
