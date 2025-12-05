import blessed from "blessed";

/**
 * Utility for initializing tab content
 */
export class TabContentInitializer {
  /**
   * Initialize content for all tabs
   */
  static initializeTabContent(
    testerantoOutputBox: blessed.Widgets.Log | null,
    dockerComposeOutputBox: blessed.Widgets.Log | null,
    nodeBuildOutputBox: blessed.Widgets.Log | null,
    webBuildOutputBox: blessed.Widgets.Log | null,
    pythonBuildOutputBox: blessed.Widgets.Log | null,
    golangBuildOutputBox: blessed.Widgets.Log | null
  ): void {
    // testeranto tab content
    if (testerantoOutputBox) {
      testerantoOutputBox.add("=== testeranto Tab ===");
      testerantoOutputBox.add("This tab is for testeranto CLI commands.");
      testerantoOutputBox.add(
        "Type testeranto commands in the input below."
      );
      testerantoOutputBox.add("\nAvailable testeranto commands:");
      testerantoOutputBox.add(
        "  run <testPattern> - Run tests matching the pattern"
      );
      testerantoOutputBox.add("  build <type> - Build test bundles");
      testerantoOutputBox.add(
        "  init [projectName] - Initialize test configuration"
      );
      testerantoOutputBox.add("  watch - Watch for changes and rebuild");
      testerantoOutputBox.add("  list [filter] - List available tests");
      testerantoOutputBox.add("  clean - Clean build artifacts");
      testerantoOutputBox.add("\nType 'help' for more information.");
      testerantoOutputBox.add("\n");
    }

    // docker-compose tab content
    if (dockerComposeOutputBox) {
      dockerComposeOutputBox.add("=== docker-compose Tab ===");
      dockerComposeOutputBox.add("This tab shows docker-compose commands and logs.");
      dockerComposeOutputBox.add("\nAvailable commands:");
      dockerComposeOutputBox.add("  docker-compose up      - Start services");
      dockerComposeOutputBox.add("  docker-compose down    - Stop and remove services");
      dockerComposeOutputBox.add("  docker-compose ps      - List services");
      dockerComposeOutputBox.add("  docker-compose logs    - Show service logs");
      dockerComposeOutputBox.add("  docker-compose build   - Build services");
      dockerComposeOutputBox.add("\nNote: Services are automatically stopped before starting fresh.");
      dockerComposeOutputBox.add("\nTo manually load allTests-docker-compose.yml:");
      dockerComposeOutputBox.add("  docker-compose -f testeranto/bundles/allTests-docker-compose.yml up");
      dockerComposeOutputBox.add("\n");
    }

    // Initialize build service tabs with dummy content
    if (nodeBuildOutputBox) {
      nodeBuildOutputBox.add("=== node-build Tab ===");
      nodeBuildOutputBox.add("This tab shows Node.js build service logs.");
      nodeBuildOutputBox.add("Build services compile and bundle Node.js test files.");
      nodeBuildOutputBox.add("Status: Not started");
      nodeBuildOutputBox.add("\n");
    }

    if (webBuildOutputBox) {
      webBuildOutputBox.add("=== web-build Tab ===");
      webBuildOutputBox.add("This tab shows Web build service logs.");
      webBuildOutputBox.add("Build services compile and bundle Web test files.");
      webBuildOutputBox.add("Status: Not started");
      webBuildOutputBox.add("\n");
    }

    if (pythonBuildOutputBox) {
      pythonBuildOutputBox.add("=== python-build Tab ===");
      pythonBuildOutputBox.add("This tab shows Python build service logs.");
      pythonBuildOutputBox.add("Build services compile and bundle Python test files.");
      pythonBuildOutputBox.add("Status: Not started");
      pythonBuildOutputBox.add("\n");
    }

    if (golangBuildOutputBox) {
      golangBuildOutputBox.add("=== golang-build Tab ===");
      golangBuildOutputBox.add("This tab shows Go build service logs.");
      golangBuildOutputBox.add("Build services compile and bundle Go test files.");
      golangBuildOutputBox.add("Status: Not started");
      golangBuildOutputBox.add("\n");
    }
  }
}
