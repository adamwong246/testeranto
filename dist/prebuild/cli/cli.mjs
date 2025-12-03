#!/usr/bin/env node

// src/cli/cli.ts
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Command } from "commander";
import { spawn } from "child_process";
var main = async () => {
  const program = new Command();
  program.name("testeranto").description("AI powered BDD test framework for TypeScript projects").version("0.209.0");
  program.command("run <testPattern>").description("Run tests matching the pattern").option("-w, --watch", "Watch mode").option("-v, --verbose", "Verbose output").action((testPattern, options) => {
    console.log(`Running tests matching: ${testPattern}`);
    if (options.watch) {
      console.log("Watch mode enabled");
    }
    if (options.verbose) {
      console.log("Verbose mode enabled");
    }
    console.log("Test execution would start here...");
  });
  program.command("build").description("Build the project").option("--clean", "Clean build directory").action((options) => {
    console.log("Building project...");
    if (options.clean) {
      console.log("Cleaning build directory...");
    }
  });
  program.command("tui").description("Launch the full TUI interface").action(async () => {
    const currentFileUrl = import.meta.url;
    const currentDir = dirname(fileURLToPath(currentFileUrl));
    const tuiPath = join(currentDir, "tui.js");
    console.log(`TUI path: ${tuiPath}`);
    if (!existsSync(tuiPath)) {
      console.error(`TUI entry point not found at: ${tuiPath}`);
      console.error("Current directory:", process.cwd());
      console.error('Please run "npm run build" first');
      process.exit(1);
    }
    const env = { ...process.env };
    if (!env.NODE_ENV) {
      env.NODE_ENV = "production";
    }
    const child = spawn(process.execPath, [tuiPath], {
      stdio: "inherit",
      shell: true,
      env
    });
    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`TUI exited with code ${code}`);
      }
    });
  });
  program.command("help").description("Display help information").action(() => {
    program.help();
  });
  if (process.argv.length <= 2) {
    program.help();
  }
  program.parse(process.argv);
};
main();
