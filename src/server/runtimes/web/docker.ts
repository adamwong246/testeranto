import { IBuiltConfig } from "../../../Types";

export const webDockerComposeFile = (config: IBuiltConfig, projectName: string) => {

  return {
    build: {
      context: process.cwd(),
      dockerfile: config.web.dockerfile,
    },
    container_name: `web-builder-${projectName}`,
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}:/workspace`,
    ],
  }

};

export const webBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  // The test should connect to chromium via remote debugging
  // We'll use a script that waits for chromium to be ready and then runs the tests
  return `
    # Wait for chromium to be ready
    until curl -f http://chromium:9222/json/version >/dev/null 2>&1; do
      echo "Waiting for chromium to be ready..."
      sleep 1
    done
    
    # Run the test
    TEST_NAME=allTests WS_PORT=${port} ENV=web node testeranto/bundles/allTests/web/example/Calculator.test.mjs allTests.ts '${jsonStr}'
  `;
}
