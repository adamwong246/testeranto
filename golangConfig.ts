import { IDockerSteps, IChecks } from "./src/Types";
import { GOLANG_BASE_STEPS, GOLANG_METAFILE_ANALYSIS } from "./allTestsUtils";

export const GOLANG_BUILD_STEPS: [IDockerSteps, string][] = [
  ...GOLANG_BASE_STEPS,
  ["RUN", "go build -o /tmp/test-binary ./..."],
  ...GOLANG_METAFILE_ANALYSIS.slice(GOLANG_BASE_STEPS.length),
];

export const GO_STATIC_ANALYSIS: IChecks = {
  "go-vet": [[["WORKDIR", "/workspace"]], "go vet ./..."],
  staticcheck: [[["WORKDIR", "/workspace"]], "staticcheck ./..."],
  "go-fmt": [[["WORKDIR", "/workspace"]], "go fmt ./..."],
  gocyclo: [[["WORKDIR", "/workspace"]], "gocyclo -over 15 ."],
};

export const golangConfig = {
  flavor: ["compiled", "golang:1.21-alpine"] as [
    "compiled" | "interpreted" | "VM" | "chrome",
    string
  ],
  testFile: "example/Calculator.golingvu.test.go",
  options: {
    prodBlocks: [
      GOLANG_BASE_STEPS.concat([["RUN", "BUILD THING"]]),
      GOLANG_BASE_STEPS.concat([["RUN", "BUILD ANOTHER THING"]]),
    ],
    build: [GOLANG_BUILD_STEPS],
    checks: GO_STATIC_ANALYSIS,
  },
};
