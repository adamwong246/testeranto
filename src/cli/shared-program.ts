import { Command } from "commander";

export function createSharedProgram(): Command {
  const program = new Command();

  program
    .name("testeranto")
    .description("AI powered BDD test framework for TypeScript projects")
    .version("0.209.0");

  // Dummy command 1: Run tests with pattern and options
  program
    .command("run <testPattern>")
    .description("Run tests matching the pattern")
    .option("-w, --watch", "Watch mode")
    .option("-v, --verbose", "Verbose output")
    .option("-t, --timeout <seconds>", "Timeout in seconds", "30")
    .action((testPattern: string, options: any) => {
      console.log(`Running tests matching: ${testPattern}`);
      console.log(`Watch mode: ${options.watch ? 'enabled' : 'disabled'}`);
      console.log(`Verbose mode: ${options.verbose ? 'enabled' : 'disabled'}`);
      console.log(`Timeout: ${options.timeout} seconds`);
      console.log("Test execution would start here...");
    });

  // Dummy command 2: Build with type and options
  program
    .command("build <type>")
    .description("Build test bundles")
    .option("-o, --output <dir>", "Output directory", "./dist")
    .option("-m, --minify", "Minify output")
    .option("-s, --sourcemap", "Generate source maps")
    .action((type: string, options: any) => {
      console.log(`Building ${type} test bundles...`);
      console.log(`Output directory: ${options.output}`);
      console.log(`Minify: ${options.minify ? 'yes' : 'no'}`);
      console.log(`Source maps: ${options.sourcemap ? 'yes' : 'no'}`);
      console.log("Build process would start here...");
    });

  // Dummy command 3: Initialize with project name
  program
    .command("init [projectName]")
    .description("Initialize test configuration")
    .option("-t, --template <template>", "Template to use", "default")
    .option("-f, --force", "Force overwrite existing files")
    .action((projectName: string = "my-project", options: any) => {
      console.log(`Initializing project: ${projectName}`);
      console.log(`Template: ${options.template}`);
      console.log(`Force overwrite: ${options.force ? 'yes' : 'no'}`);
      console.log("Initialization would start here...");
    });

  // Dummy command 4: Watch with options
  program
    .command("watch")
    .description("Watch for changes and rebuild")
    .option("-p, --port <port>", "Port for dev server", "3000")
    .option("-h, --host <host>", "Host for dev server", "localhost")
    .option("-r, --reload", "Auto reload on changes")
    .action((options: any) => {
      console.log("Starting watch mode...");
      console.log(`Dev server: ${options.host}:${options.port}`);
      console.log(`Auto reload: ${options.reload ? 'enabled' : 'disabled'}`);
      console.log("Watching for changes...");
    });

  // Dummy command 5: List tests with filter
  program
    .command("list [filter]")
    .description("List available tests")
    .option("-a, --all", "Show all tests including hidden")
    .option("-f, --format <format>", "Output format (json, table, csv)", "table")
    .action((filter: string = "", options: any) => {
      console.log(`Listing tests with filter: ${filter || 'none'}`);
      console.log(`Show all: ${options.all ? 'yes' : 'no'}`);
      console.log(`Output format: ${options.format}`);
      console.log("Test list would be displayed here...");
    });

  // Dummy command 6: Clean with options
  program
    .command("clean")
    .description("Clean build artifacts")
    .option("-d, --dist", "Clean dist directory")
    .option("-c, --cache", "Clean cache directory")
    .option("-n, --node_modules", "Clean node_modules")
    .action((options: any) => {
      console.log("Cleaning build artifacts...");
      console.log(`Clean dist: ${options.dist ? 'yes' : 'no'}`);
      console.log(`Clean cache: ${options.cache ? 'yes' : 'no'}`);
      console.log(`Clean node_modules: ${options.node_modules ? 'yes' : 'no'}`);
      console.log("Cleanup would start here...");
    });

  return program;
}
