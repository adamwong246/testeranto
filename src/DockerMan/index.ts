import { upAll, down } from "docker-compose";
import path from "path";
import { IRunTime } from "../Types";

export default class DockerMan {
  testName: string;
  private composeDir: string;
  private composeFile: string;

  constructor(testName) {
    console.log("DockerMan initialized.");
    this.testName = testName;
    this.composeDir = process.cwd();
    this.composeFile = path.join(
      this.composeDir,
      "testeranto",
      "bundles",
      `${this.testName}-docker-compose.yml`
    );
  }

  onBundleChange(entryPoint: string, lang: IRunTime) {
    console.log(`Bundle changed for ${lang}: ${entryPoint}`);
  }

  async stop() {
    console.log("DockerMan stopping all containers...");
    try {
      await down({
        cwd: this.composeDir,
        config: this.composeFile,
        log: true,
        commandOptions: ['-v', '--remove-orphans'], // Remove volumes and orphaned containers
      });
      console.log("Docker Compose stopped successfully.");
    } catch (err) {
      console.log("Error stopping Docker Compose:", err.message);
    }
  }

  async start() {
    // Stop existing containers first
    await this.stop();
    
    console.log("Starting Docker Compose with fresh containers...");
    try {
      const result = await upAll({
        cwd: this.composeDir,
        config: this.composeFile,
        log: true,
        commandOptions: ['--build', '--force-recreate', '--remove-orphans'],
      });
      console.log("Docker Compose started successfully with fresh containers:", result);
    } catch (err) {
      console.log("Something went wrong:", err.message);
      console.log(err);
    }
  }

  // Method to force a complete rebuild without cache
  async rebuild(noCache: boolean = false) {
    // Stop existing containers
    await this.stop();
    
    const commandOptions = ['--build', '--force-recreate', '--remove-orphans'];
    if (noCache) {
      commandOptions.push('--no-cache');
    }
    
    console.log(`Rebuilding Docker Compose ${noCache ? 'without cache' : 'with cache'}...`);
    try {
      const result = await upAll({
        cwd: this.composeDir,
        config: this.composeFile,
        log: true,
        commandOptions: commandOptions,
      });
      console.log(`Docker Compose rebuilt successfully ${noCache ? 'without cache' : 'with cache'}:`, result);
    } catch (err) {
      console.log("Something went wrong:", err.message);
      console.log(err);
    }
  }
}
