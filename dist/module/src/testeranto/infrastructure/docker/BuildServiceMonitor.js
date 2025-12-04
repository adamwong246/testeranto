import { EventEmitter } from "events";
export class BuildServiceMonitor extends EventEmitter {
    constructor(dockerCompose) {
        super();
        this.buildServices = new Set();
        this.dockerCompose = dockerCompose;
    }
    async identifyBuildServices() {
        var _a;
        try {
            const result = await this.dockerCompose.ps({
                log: false,
            });
            if (result.data && result.data.services) {
                this.buildServices.clear();
                for (const service of result.data.services) {
                    if (service.name.includes("build")) {
                        this.buildServices.add(service.name);
                        console.log(`🔧 Identified build service: ${service.name} - ${service.status || service.state}`);
                        if ((_a = service.status) === null || _a === void 0 ? void 0 : _a.includes("unhealthy")) {
                            console.log(`⚠️ Build service ${service.name} is unhealthy. Checking logs...`);
                            try {
                                const logsResult = await this.dockerCompose.logs(service.name, {
                                    log: false,
                                    follow: false,
                                    tail: 20,
                                });
                                if (logsResult.out) {
                                    console.log(`📝 ${service.name} stdout (last 20 lines):`);
                                    console.log(logsResult.out);
                                }
                                if (logsResult.err) {
                                    console.log(`📝 ${service.name} stderr (last 20 lines):`);
                                    console.log(logsResult.err);
                                }
                            }
                            catch (logErr) {
                                console.log(`❌ Could not get logs for ${service.name}:`, logErr.message);
                            }
                        }
                    }
                }
                console.log(`🔧 Total build services identified: ${this.buildServices.size}`);
            }
            else {
                console.log(`🔧 No services found in docker-compose ps output`);
            }
        }
        catch (err) {
            console.log("❌ Error identifying build services:", err.message);
        }
    }
    async waitForBuildService(serviceName, timeoutMs = 10000) {
        var _a, _b;
        console.log(`⏳ Waiting for build service ${serviceName} to be healthy (timeout: ${timeoutMs}ms)...`);
        this.emit("buildServiceWaiting", { serviceName });
        const startTime = Date.now();
        let lastLogTime = startTime;
        let lastStatus = "";
        while (Date.now() - startTime < timeoutMs) {
            try {
                const result = await this.dockerCompose.ps({
                    log: false,
                });
                if (result.data && result.data.services) {
                    const service = result.data.services.find((s) => s.name === serviceName);
                    if (service) {
                        const currentStatus = service.status || service.state;
                        if (currentStatus !== lastStatus) {
                            console.log(`📊 Build service ${serviceName} status: ${currentStatus}`);
                            lastStatus = currentStatus;
                            lastLogTime = Date.now();
                        }
                        else if (Date.now() - lastLogTime > 3000) {
                            console.log(`📊 Build service ${serviceName} still: ${currentStatus}`);
                            lastLogTime = Date.now();
                        }
                        if (service.state === "running" &&
                            ((_a = service.status) === null || _a === void 0 ? void 0 : _a.includes("healthy"))) {
                            console.log(`✅ Build service ${serviceName} is healthy`);
                            this.emit("buildServiceHealthy", {
                                serviceName,
                                status: currentStatus,
                            });
                            return true;
                        }
                        if ((_b = service.status) === null || _b === void 0 ? void 0 : _b.includes("unhealthy")) {
                            console.log(`⚠️ Build service ${serviceName} is unhealthy`);
                        }
                    }
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            catch (err) {
                console.log(`❌ Error checking build service ${serviceName}:`, err.message);
                this.emit("buildServiceError", {
                    serviceName,
                    error: err.message,
                });
            }
        }
        console.log(`⏰ Timeout waiting for build service ${serviceName} after ${timeoutMs}ms`);
        this.emit("buildServiceTimeout", { serviceName });
        return false;
    }
    async getBuildServiceStatuses() {
        const statuses = [];
        try {
            const result = await this.dockerCompose.ps({
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
        }
        catch (err) {
            console.log("❌ Error getting build service statuses:", err.message);
        }
        return statuses;
    }
    startMonitoring(callback) {
        console.log(`👀 Starting build services monitoring...`);
        this.emit("monitoringStarted", {
            buildServices: Array.from(this.buildServices),
        });
        this.monitoringIntervalId = setInterval(async () => {
            for (const serviceName of this.buildServices) {
                try {
                    const result = await this.dockerCompose.ps({
                        log: false,
                    });
                    if (result.data && result.data.services) {
                        const service = result.data.services.find((s) => s.name === serviceName);
                        if (service) {
                            const status = service.status || service.state;
                            callback(serviceName, status);
                            if (status.includes("healthy")) {
                                this.emit("buildServiceStatus", {
                                    serviceName,
                                    status: "healthy",
                                    details: status,
                                });
                            }
                            else if (status.includes("unhealthy")) {
                                this.emit("buildServiceStatus", {
                                    serviceName,
                                    status: "unhealthy",
                                    details: status,
                                });
                            }
                            else {
                                this.emit("buildServiceStatus", {
                                    serviceName,
                                    status: "unknown",
                                    details: status,
                                });
                            }
                        }
                    }
                }
                catch (err) {
                    console.log(`❌ Error monitoring build service ${serviceName}:`, err.message);
                    this.emit("monitoringError", {
                        serviceName,
                        error: err.message,
                    });
                }
            }
        }, 5000);
    }
    stopMonitoring() {
        if (this.monitoringIntervalId) {
            clearInterval(this.monitoringIntervalId);
            console.log("📊 Stopped build services monitoring");
        }
    }
    getBuildServices() {
        return Array.from(this.buildServices);
    }
    findBuildServiceForRuntime(runtime) {
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
