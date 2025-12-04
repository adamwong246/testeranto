import blessed from "blessed";

/**
 * Manages TesterantoDocker instance creation and build service monitoring
 */
export class TesterantoDockerManager {
  private testerantoDocker: any = null;
  private buildServiceLogIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {}

  /**
   * Create a TesterantoDocker instance and start monitoring build services
   */
  async createTesterantoDockerInstance(
    testsName: string,
    composeFile: string,
    dockerComposeOutputBox: blessed.Widgets.Log | null,
    nodeBuildOutputBox: blessed.Widgets.Log | null,
    webBuildOutputBox: blessed.Widgets.Log | null,
    pythonBuildOutputBox: blessed.Widgets.Log | null,
    golangBuildOutputBox: blessed.Widgets.Log | null,
    activeTab: string,
    screen: blessed.Widgets.Screen | null,
    updateBuildServiceTab: (serviceName: string, logs: string) => void
  ): Promise<void> {
    try {
      // Import TesterantoDocker dynamically
      const TesterantoDockerModule = await import(
        "../testeranto/infrastructure/docker/TesterantoDocker.js"
      );
      const TesterantoDocker = TesterantoDockerModule.default;

      this.testerantoDocker = new TesterantoDocker(testsName);
      await this.testerantoDocker.initialize();

      // Start monitoring build services
      await this.testerantoDocker.identifyBuildServices();

      // Start polling logs for build services
      this.startBuildServiceLogPolling(
        nodeBuildOutputBox,
        webBuildOutputBox,
        pythonBuildOutputBox,
        golangBuildOutputBox,
        activeTab,
        screen,
        updateBuildServiceTab
      );

      if (dockerComposeOutputBox) {
        dockerComposeOutputBox.add(
          "✅ TesterantoDocker instance created and monitoring build services"
        );
      }
    } catch (error: any) {
      if (dockerComposeOutputBox) {
        dockerComposeOutputBox.add(
          `❌ Failed to create TesterantoDocker instance: ${error.message}`
        );
      }
    }
  }

  /**
   * Start polling logs for build services
   */
  private startBuildServiceLogPolling(
    nodeBuildOutputBox: blessed.Widgets.Log | null,
    webBuildOutputBox: blessed.Widgets.Log | null,
    pythonBuildOutputBox: blessed.Widgets.Log | null,
    golangBuildOutputBox: blessed.Widgets.Log | null,
    activeTab: string,
    screen: blessed.Widgets.Screen | null,
    updateBuildServiceTab: (serviceName: string, logs: string) => void
  ): void {
    if (!this.testerantoDocker) return;

    // Clear any existing intervals
    this.buildServiceLogIntervals.forEach((interval) =>
      clearInterval(interval)
    );
    this.buildServiceLogIntervals.clear();

    // Try to get build services, but if not available yet, try again later
    const tryStartPolling = () => {
      const buildServices = this.testerantoDocker.getBuildServices();
      if (buildServices.length === 0) {
        // Try again in 3 seconds
        setTimeout(tryStartPolling, 3000);
        return;
      }

      buildServices.forEach((serviceName) => {
        // Only monitor build services
        if (!serviceName.includes("build")) return;

        const interval = setInterval(async () => {
          try {
            const logs = await this.testerantoDocker.getBuildServiceLogs(
              serviceName,
              50
            );
            if (logs.trim()) {
              updateBuildServiceTab(serviceName, logs);
            }
          } catch (error) {
            // Service might not exist yet, ignore
          }
        }, 2000); // Poll every 2 seconds

        this.buildServiceLogIntervals.set(serviceName, interval);
      });
    };

    tryStartPolling();
  }

  /**
   * Stop polling logs for build services
   */
  stopBuildServiceLogPolling(): void {
    this.buildServiceLogIntervals.forEach((interval) =>
      clearInterval(interval)
    );
    this.buildServiceLogIntervals.clear();
  }

  /**
   * Get the TesterantoDocker instance
   */
  getTesterantoDocker(): any {
    return this.testerantoDocker;
  }

  /**
   * Check if TesterantoDocker instance exists
   */
  hasTesterantoDocker(): boolean {
    return this.testerantoDocker !== null;
  }
}
