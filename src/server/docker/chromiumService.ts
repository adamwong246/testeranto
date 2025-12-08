export default {
  image: "browserless/chrome:latest",
  container_name: "chromium",
  restart: "unless-stopped",
  ports: ["3000:3000", "9222:9222"],
  shm_size: "2g",
  environment: {
    CONNECTION_TIMEOUT: "60000",
    MAX_CONCURRENT_SESSIONS: "10",
    ENABLE_CORS: "true",
    REMOTE_DEBUGGING_PORT: "9222",
    REMOTE_DEBUGGING_ADDRESS: "0.0.0.0",
  },
  healthcheck: {
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"],
    interval: "10s",
    timeout: "10s",
    retries: 5,
    start_period: "30s",
  },
  networks: ["default"],
};
