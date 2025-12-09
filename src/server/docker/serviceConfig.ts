export default (httpPort: number, chromiumPort: number) => ({
  image: "browserless/chrome:latest",
  container_name: "chromium",
  restart: "unless-stopped",
  ports: [`${chromiumPort}:${chromiumPort}`, "9222:9222"],
  shm_size: "2g",
  environment: {
    CONNECTION_TIMEOUT: "60000",
    MAX_CONCURRENT_SESSIONS: "10",
    ENABLE_CORS: "true",
    REMOTE_DEBUGGING_PORT: "9222",
    REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
    PORT: chromiumPort.toString(),
  },
  healthcheck: {
    test: ["CMD", "curl", "-f", `http://localhost:${chromiumPort}/health`],
    interval: "10s",
    timeout: "10s",
    retries: 5,
    start_period: "30s",
  },
  networks: ["default"],
  depends_on: {},
});

// Configuration for test services (without port mappings)
export const testServiceConfig = (httpPort: number) => ({
  restart: "unless-stopped",
  shm_size: "2g",
  environment: {
    CONNECTION_TIMEOUT: "60000",
    MAX_CONCURRENT_SESSIONS: "10",
    ENABLE_CORS: "true",
    REMOTE_DEBUGGING_PORT: "9222",
    REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
    WS_PORT: httpPort.toString(),
    WS_HOST: "host.docker.internal",
  },
  healthcheck: {
    test: ["CMD", "curl", "-f", `http://localhost:${httpPort}/health`],
    interval: "10s",
    timeout: "10s",
    retries: 5,
    start_period: "30s",
  },
  networks: ["default"],
  depends_on: {},
});
