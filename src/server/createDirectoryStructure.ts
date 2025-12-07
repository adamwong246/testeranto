// // Helper to create directory structure
// function createDirectoryStructure(): string {
//   return `# Create the full directory structure before CMD
// RUN mkdir -p /workspace/testeranto
// RUN mkdir -p /workspace/testeranto/bundles
// RUN mkdir -p /workspace/testeranto/bundles/${runtime}
// RUN mkdir -p /workspace/testeranto/bundles/${runtime}/allTests
// RUN mkdir -p /workspace/testeranto/metafiles
// RUN mkdir -p /workspace/testeranto/metafiles/${runtime}
// # Set environment variables for output directories
// ENV BUNDLES_DIR=/workspace/testeranto/bundles/${runtime}/allTests.ts
// ENV METAFILES_DIR=/workspace/testeranto/metafiles/${runtime}`;
// }
