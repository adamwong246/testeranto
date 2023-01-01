import fs from "fs";
import path from "path";

export class TesterantoProject {
  tests: [string, string, string];
  features: string;

  constructor(tests, features) {
    this.tests = tests;
    this.features = features;
  }

  builder() {
    const text = JSON.stringify({ tests: this.tests, features: this.features });
    const p = "./dist/testeranto.config.json";
    fs.promises.mkdir(path.dirname(p), { recursive: true }).then(x => {
      fs.promises.writeFile(p, text);
    })
  }

}