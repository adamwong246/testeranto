import { Command } from "commander";

export function createSharedProgram(): Command {
  const program = new Command();

  program
    .name("testeranto")
    .description("AI powered BDD test framework for TypeScript projects")
    .version("0.209.0");

  // Command to run tests
  program
    .command("run <testPattern>")
    .description("Run tests matching the pattern")
    .option("-w, --watch", "Watch mode")
    .option("-v, --verbose", "Verbose output")
    .action((testPattern: string, options: any) => {
      console.log(`Running tests matching: ${testPattern}`);
      if (options.watch) {
        console.log("Watch mode enabled");
      }
      if (options.verbose) {
        console.log("Verbose mode enabled");
      }
      // Here you would integrate with the existing test runner
      console.log("Test execution would start here...");
    });

  return program;
}
