var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/cli/shared-program.ts
import { Command } from "commander";
function createSharedProgram() {
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
  program.command("list").description("List available tests").action(() => {
    console.log("Available tests:");
    for (let i = 1; i <= 5; i++) {
      console.log(`  - test${i}`);
    }
    console.log("\nUse :run <testName> to execute a test");
  });
  program.command("status").description("Show project status").action(() => {
    console.log("Project status:");
    console.log("  - Tests: 5 available");
    console.log("  - Build: Ready");
    console.log("  - Last run: 2 minutes ago");
  });
  program.command("help").description("Show TUI and command help").action(() => {
    console.log("Testeranto - AI powered BDD test framework");
    console.log("===========================================");
    console.log("\nAvailable commands:");
    program.commands.forEach((cmd) => {
      console.log(`  ${cmd.name().padEnd(10)} - ${cmd.description()}`);
    });
  });
  return program;
}

// src/cli/cli.ts
var main = async () => {
  const program = createSharedProgram();
  program.command("tui").description("Launch the full TUI interface").action(() => {
    console.log("Launching TUI...");
    const { spawn } = __require("child_process");
    const path = __require("path");
    const tuiScript = path.join(__dirname, "tui.ts");
    const child = spawn("node", ["-r", "ts-node/register", tuiScript], {
      stdio: "inherit",
      shell: true
    });
    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`TUI exited with code ${code}`);
      }
    });
  });
  program.parse(process.argv.slice(2));
};
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
