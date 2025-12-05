import { EventEmitter } from "events";
import { DockerCompose } from "./DockerCompose";
import { BuildServiceStatus } from "./types";

export class BuildServiceMonitor extends EventEmitter {
  private dockerCompose: DockerCompose;
  private buildServices: Set<string> = new Set();
  private monitoringIntervalId?: NodeJS.Timeout;
  private logger: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  };

  constructor(dockerCompose: DockerCompose, logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  }) {
    super();
    this.dockerCompose = dockerCompose;
    this.logger = {
      log: logger?.log || console.log,
      error: logger?.error || console.error,
      warn: logger?.warn || console.warn,
      info: logger?.info || console.info,
    };
  }

  public async identifyBuildServices(): Promise<void> {
    try {
      const result = await this.dockerCompose.DC_ps({
        log: false,
      });

      if (result.data && result.data.services) {
        this.buildServices.clear();
        for (const service of result.data.services) {
          if (service.name.includes("build")) {
            this.buildServices.add(service.name);
            this.logger.log(
              `🔧 Identified build service: ${service.name} - ${
                service.status || service.state
              }`
            );

            if (service.status?.includes("unhealthy")) {
              this.logger.log(
                `⚠️ Build service ${service.name} is unhealthy. Checking logs...`
              );
              try {
                const logsResult = await this.dockerCompose.DC_logs(service.name, {
                  log: false,
                  follow: false,
                  tail: 20,
                });
                if (logsResult.out) {
                  this.logger.log(`📝 ${service.name} stdout (last 20 lines):`);
                  this.logger.log(logsResult.out);
                }
                if (logsResult.err) {
                  this.logger.log(`📝 ${service.name} stderr (last 20 lines):`);
                  this.logger.log(logsResult.err);
                }
              } catch (logErr) {
                this.logger.log(
                  `❌ Could not get logs for ${service.name}:`,
                  (logErr as Error).message
                );
              }
            }
          }
        }
        this.logger.log(
          `🔧 Total build services identified: ${this.buildServices.size}`
        );
      } else {
        this.logger.log(`🔧 No services found in docker-compose ps output`);
      }
    } catch (err) {
      this.logger.log(
        "❌ Error identifying build services:",
        (err as Error).message
      );
    }
  }

  public async waitForBuildService(
    serviceName: string,
    timeoutMs: number = 10000
  ): Promise<boolean> {
    this.logger.log(
      `⏳ Waiting for build service ${serviceName} to be healthy (timeout: ${timeoutMs}ms)...`
    );
    this.emit("buildServiceWaiting", { serviceName });

    const startTime = Date.now();
    let lastLogTime = startTime;
    let lastStatus = "";

    while (Date.now() - startTime < timeoutMs) {
      try {
        const result = await this.dockerCompose.DC_ps({
          log: false,
        });

        if (result.data && result.data.services) {
          const service = result.data.services.find(
            (s: any) => s.name === serviceName
          );
          if (service) {
            const currentStatus = service.status || service.state;

            if (currentStatus !== lastStatus) {
              this.logger.log(
                `📊 Build service ${serviceName} status: ${currentStatus}`
              );
              lastStatus = currentStatus;
              lastLogTime = Date.now();
            } else if (Date.now() - lastLogTime > 3000) {
              this.logger.log(
                `📊 Build service ${serviceName} still: ${currentStatus}`
              );
              lastLogTime = Date.now();
            }

            if (
              service.state === "running" &&
              service.status?.includes("healthy")
            ) {
              this.logger.log(`✅ Build service ${serviceName} is healthy`);
              this.emit("buildServiceHealthy", {
                serviceName,
                status: currentStatus,
              });
              return true;
            }

            if (service.status?.includes("unhealthy")) {
              this.logger.log(`⚠️ Build service ${serviceName} is unhealthy`);
            }
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        this.logger.log(
          `❌ Error checking build service ${serviceName}:`,
          (err as Error).message
        );
        this.emit("buildServiceError", {
          serviceName,
          error: (err as Error).message,
        });
      }
    }

    this.logger.log(
      `⏰ Timeout waiting for build service ${serviceName} after ${timeoutMs}ms`
    );
    this.emit("buildServiceTimeout", { serviceName });
    return false;
  }

  public async getBuildServiceStatuses(): Promise<BuildServiceStatus[]> {
    const statuses: BuildServiceStatus[] = [];
    try {
      const result = await this.dockerCompose.DC_ps({
        log: false,
      });

      if (result.data && result.data.services) {
        for (const service of result.data.services) {
          if (service.name.includes("build")) {
            statuses.push({
              name: service.name,
              status: service.status || service.state || "unknown",
            });
          }
        }
      }
    } catch (err) {
      this.logger.log(
        "❌ Error getting build service statuses:",
        (err as Error).message
      );
    }
    return statuses;
  }

  public startMonitoring(
    callback: (serviceName: string, status: string) => void
  ): void {
    this.logger.log(`👀 Starting build services monitoring...`);
    this.emit("monitoringStarted", {
      buildServices: Array.from(this.buildServices),
    });

    this.monitoringIntervalId = setInterval(async () => {
      for (const serviceName of this.buildServices) {
        try {
          const result = await this.dockerCompose.DC_ps({
            log: false,
          });

          if (result.data && result.data.services) {
            const service = result.data.services.find(
              (s: any) => s.name === serviceName
            );
            if (service) {
              const status = service.status || service.state;
              callback(serviceName, status);

              if (status.includes("healthy")) {
                this.emit("buildServiceStatus", {
                  serviceName,
                  status: "healthy",
                  details: status,
                });
              } else if (status.includes("unhealthy")) {
                this.emit("buildServiceStatus", {
                  serviceName,
                  status: "unhealthy",
                  details: status,
                });
              } else {
                this.emit("buildServiceStatus", {
                  serviceName,
                  status: "unknown",
                  details: status,
                });
              }
            }
          }
        } catch (err) {
          this.logger.log(
            `❌ Error monitoring build service ${serviceName}:`,
            (err as Error).message
          );
          this.emit("monitoringError", {
            serviceName,
            error: (err as Error).message,
          });
        }
      }
    }, 5000);
  }

  public stopMonitoring(): void {
    if (this.monitoringIntervalId) {
      clearInterval(this.monitoringIntervalId);
      this.logger.log("📊 Stopped build services monitoring");
    }
  }

  public getBuildServices(): string[] {
    return Array.from(this.buildServices);
  }

  public findBuildServiceForRuntime(runtime: string): string | null {
    for (const service of this.buildServices) {
      const cleanService = service
        .replace(/-[0-9]+$/, "")
        .replace(/^bundles-/, "");
      if (cleanService.includes(runtime)) {
        return service;
      }
    }
    return null;
  }
}
