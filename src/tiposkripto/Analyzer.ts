export abstract class Analyzer {
  constructor() {}

  abstract analyze(listOfFiles: string[]): void;
}
