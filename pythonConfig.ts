import { IChecks } from "./src/Types";

export const PYTHON_STATIC_ANALYSIS: IChecks = {
  pylint: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "pip install pylint"],
    ],
    "pylint --rcfile=.pylintrc src/",
  ],
  mypy: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "pip install mypy"],
    ],
    "mypy src/",
  ],
  flake8: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "pip install flake8"],
    ],
    "flake8 src/",
  ],
  bandit: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "pip install bandit"],
    ],
    "bandit -r src/ -ll",
  ],
};

export const pythonConfig = {
  flavor: ["interpreted", "python:3.11-alpine"] as [
    "compiled" | "interpreted" | "VM" | "chrome",
    string
  ],
  testFile: "example/Calculator.pitono.test.py",
  options: {
    processPool: {
      maxConcurrent: 3,
      timeoutMs: 20000,
    },
    checks: PYTHON_STATIC_ANALYSIS,
  },
};
