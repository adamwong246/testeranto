export class TesterantoProject {
  tests: [string, string, string];
  features: string;
  entryPath: string;

  constructor(tests, features, entryPath) {
    this.tests = tests;
    this.features = features;
    this.entryPath = entryPath;
  }

  
}