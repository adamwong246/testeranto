import blessed from "blessed";

/**
 * Utility functions for TUI management
 */
export class TuiUtils {
  /**
   * Get the current command history based on active tab
   */
  static getCurrentCommandHistory(
    activeTab: string,
    testerantoCommandHistory: string[],
    dockerComposeCommandHistory: string[],
    nodeBuildCommandHistory: string[],
    webBuildCommandHistory: string[],
    pythonBuildCommandHistory: string[],
    golangBuildCommandHistory: string[]
  ): string[] {
    switch (activeTab) {
      case "testeranto":
        return testerantoCommandHistory;
      case "docker-compose":
        return dockerComposeCommandHistory;
      case "node-build":
        return nodeBuildCommandHistory;
      case "web-build":
        return webBuildCommandHistory;
      case "python-build":
        return pythonBuildCommandHistory;
      case "golang-build":
        return golangBuildCommandHistory;
      default:
        return [];
    }
  }
}
