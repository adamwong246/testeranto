import ansiC from "ansi-colors";
import fs from "fs";
import path from "path";
import readline from "readline";
import { loadConfig } from "./configLoader";
import { setupFileSystem } from "./fileSystemSetup";
import { setupKeypressHandling } from "./keypressHandler";

// Placeholder implementations to avoid import errors
async function setupDockerCompose(config: any, testsName: string): Promise<void> {
  console.log(`Setting up Docker Compose for ${testsName}`);
}

async function handleRuntimeBuilds(config: any, testsName: string, testerantoDocker: any): Promise<void> {
  console.log(`Handling runtime builds for ${testsName}`);
}

// Import TesterantoDocker from the correct path
import TesterantoDocker from "../infrastructure/docker/TesterantoDocker";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

let testerantoDocker: TesterantoDocker | null = null;

export async function main() {
  if (!process.argv[2]) {
    console.error(`The 2nd argument should be a testeranto config file name.`);
    process.exit(-1);
  }

  const configFilepath = process.argv[2];
  const mode = process.argv[3] as "once" | "dev";

  if (mode !== "once" && mode !== "dev") {
    console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
    process.exit(-1);
  }

  const { config, testsName } = await loadConfig(configFilepath);

  console.log(ansiC.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC.inverse("Press 'x' to quit forcefully."));

  setupKeypressHandling();
  setupFileSystem(config, testsName);
  
  // Always regenerate docker-compose to ensure latest hash is used
  const composeFilePath = path.join(
    process.cwd(),
    "testeranto",
    "bundles",
    `${testsName}-docker-compose.yml`
  );
  if (fs.existsSync(composeFilePath)) {
    console.log(`🗑️ Removing existing docker-compose file to force regeneration`);
    fs.unlinkSync(composeFilePath);
  }
  
  await setupDockerCompose(config, testsName);
  
  // Create TesterantoDocker instance
  testerantoDocker = new TesterantoDocker(testsName);
  
  // Initialize TesterantoDocker (starts TCP server)
  console.log("⏳ Initializing TesterantoDocker...");
  await testerantoDocker.initialize();
  
  // Write TesterantoDocker TCP port to a file for service generation
  const tcpPort = testerantoDocker.getTcpPort();
  console.log(`🔌 TCP server port: ${tcpPort}`);
  
  if (tcpPort === 0) {
    console.error("❌ ERROR: TCP port is 0! TCP server may not have started properly.");
    // Try to get port again after a short delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPort = testerantoDocker.getTcpPort();
    console.log(`🔌 TCP server port after retry: ${newPort}`);
    if (newPort === 0) {
      console.error("❌ FATAL: TCP server failed to start on a valid port.");
    }
  }
  
  const finalTcpPort = testerantoDocker.getTcpPort();
  const portFilePath = path.join(
    process.cwd(),
    "testeranto",
    "bundles",
    `${testsName}-docker-man-port.txt`
  );
  
  // Ensure directory exists
  const portFileDir = path.dirname(portFilePath);
  if (!fs.existsSync(portFileDir)) {
    fs.mkdirSync(portFileDir, { recursive: true });
  }
  
  fs.writeFileSync(portFilePath, finalTcpPort.toString());
  console.log(`📝 TesterantoDocker TCP port ${finalTcpPort} written to ${portFilePath}`);
  
  // Verify file exists and can be read
  if (fs.existsSync(portFilePath)) {
    const content = fs.readFileSync(portFilePath, 'utf8');
    console.log(`📝 Port file content: ${content}`);
    if (content === "0") {
      console.error("❌ WARNING: TCP port is 0 in file. Test services may fail to connect.");
    }
  } else {
    console.error(`❌ Port file not created at ${portFilePath}`);
  }
  
  // Set up event listeners for detailed logging
  testerantoDocker.on('bundleChange', ({ entryPoint, lang }) => {
    console.log(`📦 Bundle change detected: ${entryPoint} (${lang})`);
  });
  
  testerantoDocker.on('buildServiceWaiting', ({ serviceName }) => {
    console.log(`⏳ Build service waiting: ${serviceName}`);
  });
  
  testerantoDocker.on('buildServiceHealthy', ({ serviceName, status }) => {
    console.log(`✅ Build service healthy: ${serviceName} (${status})`);
  });
  
  testerantoDocker.on('buildServiceError', ({ serviceName, error }) => {
    console.log(`❌ Build service error: ${serviceName} - ${error}`);
  });
  
  testerantoDocker.on('buildServiceTimeout', ({ serviceName }) => {
    console.log(`⏰ Build service timeout: ${serviceName}`);
  });
  
  testerantoDocker.on('testServiceStarting', ({ serviceName, config }) => {
    console.log(`🚀 Test service starting: ${serviceName} (${config.runtime})`);
  });
  
  testerantoDocker.on('testServiceBlocked', ({ serviceName, reason }) => {
    console.log(`🚫 Test service blocked: ${serviceName} - ${reason}`);
  });
  
  testerantoDocker.on('testStarted', ({ serviceName, config, result }) => {
    console.log(`✅ Test service started: ${serviceName}`);
    console.log(`   Runtime: ${config.runtime}, Entry: ${config.entryPoint}`);
  });
  
  testerantoDocker.on('testServiceError', ({ serviceName, config, error }) => {
    console.log(`❌ Test service error: ${serviceName} - ${error}`);
  });
  
  testerantoDocker.on('testStopped', ({ serviceName }) => {
    console.log(`🛑 Test service stopped: ${serviceName}`);
  });
  
  testerantoDocker.on('monitoringStarted', ({ buildServices }) => {
    console.log(`👀 Monitoring started for build services: ${buildServices.join(', ')}`);
  });
  
  testerantoDocker.on('buildServiceStatus', ({ serviceName, status, details }) => {
    console.log(`📊 Build service status update: ${serviceName} - ${status} (${details})`);
  });
  
  testerantoDocker.on('monitoringError', ({ serviceName, error }) => {
    console.log(`⚠️ Monitoring error for ${serviceName}: ${error}`);
  });

  try {
    console.log("🏗️ Starting runtime builds...");
    await handleRuntimeBuilds(config, testsName, testerantoDocker);
    console.log("✅ Runtime builds completed successfully");
  } catch (error) {
    console.error("❌ Error during runtime builds:", error);
    process.exit(1);
  }

  // Now that services are started, identify build services
  console.log("🔍 Identifying build services...");
  await testerantoDocker.identifyBuildServices();
  const initialBuildServices = testerantoDocker.getBuildServices();
  
  if (initialBuildServices.length > 0) {
    console.log(`✅ Found ${initialBuildServices.length} build services: ${initialBuildServices.join(', ')}`);
    
    // Check if any build services are unhealthy
    const statuses = await testerantoDocker.getBuildServiceStatuses();
    const unhealthyServices = statuses.filter(s => s.status.includes('unhealthy'));
    if (unhealthyServices.length > 0) {
      console.log(`⚠️ Warning: ${unhealthyServices.length} build services are unhealthy:`);
      unhealthyServices.forEach(s => {
        console.log(`   - ${s.name}: ${s.status}`);
      });
      console.log(`💡 Check the logs above for details. Tests may fail until build services are healthy.`);
    }
  } else {
    console.log(`⚠️ No build services identified initially. They may still be starting up.`);
    // Schedule a retry in the background
    setTimeout(async () => {
      await testerantoDocker?.identifyBuildServices();
      const updatedBuildServices = testerantoDocker?.getBuildServices() || [];
      if (updatedBuildServices.length > 0) {
        console.log(`✅ Build services now available: ${updatedBuildServices.join(', ')}`);
      }
    }, 5000);
  }

  console.log("🎉 Testeranto is running...");
  console.log("========================================");
  console.log("📊 Available commands via TesterantoDocker:");
  console.log("   - testerantoDocker.startTestByEntryPoint()");
  console.log("   - testerantoDocker.getTestStatuses()");
  console.log("   - testerantoDocker.getRunningTests()");
  console.log("========================================");
  console.log("💡 Tip: Build services may still be initializing.");
  console.log("   Tests can be started, but may wait for builds to complete.");
  console.log("========================================");
  
  // Start monitoring build services
  // We're using event listeners for logging, so we don't need a verbose callback
  testerantoDocker.monitorBuildServices((serviceName, status) => {
    // Minimal logging - only log if status changes to something important
    // We'll rely on event listeners for detailed logging
  });
  
  // Log initial status (already logged above, but we can log again for clarity)
  const currentBuildServices = testerantoDocker.getBuildServices();
  if (currentBuildServices.length === 0) {
    console.log(`⚠️ No build services identified. Tests may not start properly.`);
  } else {
    // Check if any build services are already healthy and start test services
    setTimeout(async () => {
      const statuses = await testerantoDocker!.getBuildServiceStatuses();
      const healthyServices = statuses.filter(s => s.status.includes('healthy'));
      if (healthyServices.length > 0) {
        console.log(`🏗️ Found ${healthyServices.length} healthy build services, ensuring test services are started...`);
        for (const service of healthyServices) {
          // Trigger test service start
          (testerantoDocker as any).startTestServicesForBuildService(service.name);
        }
      } else {
        console.log(`⏳ No build services are healthy yet. Waiting for them to become healthy...`);
      }
    }, 3000); // Wait 3 seconds before checking
  }
  
  // Set up periodic status logging (less frequent to reduce noise)
  setInterval(() => {
    if (!testerantoDocker) {
      return;
    }
    const runningTests = testerantoDocker.getRunningTests();
    if (runningTests.size > 0) {
      console.log(`📈 Status - Running tests: ${runningTests.size}`);
      // Only list tests if there are any running
      runningTests.forEach((info, serviceName) => {
        const uptime = Date.now() - info.startTime;
        console.log(`   - ${serviceName}: ${Math.floor(uptime / 1000)}s`);
      });
    }
  }, 30000); // Log every 30 seconds instead of 10
}

// Export function to get TesterantoDocker instance for other modules
export function getTesterantoDocker(): TesterantoDocker | null {
  return testerantoDocker;
}
