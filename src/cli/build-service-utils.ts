import blessed from "blessed";

/**
 * Utilities for managing build service tabs
 */
export class BuildServiceUtils {
  /**
   * Update the appropriate build service tab with logs
   */
  static updateBuildServiceTab(
    serviceName: string,
    logs: string,
    nodeBuildOutputBox: blessed.Widgets.Log | null,
    webBuildOutputBox: blessed.Widgets.Log | null,
    pythonBuildOutputBox: blessed.Widgets.Log | null,
    golangBuildOutputBox: blessed.Widgets.Log | null,
    activeTab: string,
    screen: blessed.Widgets.Screen | null
  ): void {
    let targetBox: blessed.Widgets.Log | null = null;

    // Extract the base service name
    const baseName = serviceName
      .replace(/^bundles-/, "")
      .replace(/-[0-9]+$/, "");

    if (baseName.includes("node-build")) {
      targetBox = nodeBuildOutputBox;
    } else if (baseName.includes("web-build")) {
      targetBox = webBuildOutputBox;
    } else if (baseName.includes("python-build")) {
      targetBox = pythonBuildOutputBox;
    } else if (baseName.includes("golang-build")) {
      targetBox = golangBuildOutputBox;
    }

    if (targetBox) {
      // Don't clear the content every time, just append new logs
      // To avoid losing previous logs
      const lines = logs.split("\n");
      lines.forEach((line) => {
        if (line.trim()) {
          targetBox!.add(line);
        }
      });

      // If this tab is active, render the screen
      const tabName = baseName.replace("-build", "-build");
      if (activeTab === tabName) {
        screen?.render();
      }
    }
  }

  /**
   * Determine which build service tab corresponds to a service name
   */
  static getBuildServiceTabName(serviceName: string): string | null {
    const baseName = serviceName
      .replace(/^bundles-/, "")
      .replace(/-[0-9]+$/, "");

    if (baseName.includes("node-build")) {
      return "node-build";
    } else if (baseName.includes("web-build")) {
      return "web-build";
    } else if (baseName.includes("python-build")) {
      return "python-build";
    } else if (baseName.includes("golang-build")) {
      return "golang-build";
    }
    return null;
  }

  /**
   * Get the appropriate output box for a build service
   */
  static getBuildServiceOutputBox(
    serviceName: string,
    nodeBuildOutputBox: blessed.Widgets.Log | null,
    webBuildOutputBox: blessed.Widgets.Log | null,
    pythonBuildOutputBox: blessed.Widgets.Log | null,
    golangBuildOutputBox: blessed.Widgets.Log | null
  ): blessed.Widgets.Log | null {
    const baseName = serviceName
      .replace(/^bundles-/, "")
      .replace(/-[0-9]+$/, "");

    if (baseName.includes("node-build")) {
      return nodeBuildOutputBox;
    } else if (baseName.includes("web-build")) {
      return webBuildOutputBox;
    } else if (baseName.includes("python-build")) {
      return pythonBuildOutputBox;
    } else if (baseName.includes("golang-build")) {
      return golangBuildOutputBox;
    }
    return null;
  }
}
