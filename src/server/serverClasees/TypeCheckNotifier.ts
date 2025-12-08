import ansiColors from "ansi-colors";

export class TypeCheckNotifier {
  constructor(
    private summary: any,
    private writeBigBoard: () => void,
    private checkForShutdown: () => void
  ) {}

  typeCheckIsNowDone(src: string, failures: number) {
    if (failures === 0) {
      console.log(ansiColors.green(ansiColors.inverse(`tsc > ${src}`)));
    } else {
      console.log(
        ansiColors.red(ansiColors.inverse(`tsc > ${src} failed ${failures} times`))
      );
    }

    this.summary[src].typeErrors = failures;
    this.writeBigBoard();
    this.checkForShutdown();
  }

  typeCheckIsRunning(src: string) {
    // This method can be implemented if needed
    // For now, we'll leave it empty or add basic implementation
  }
}
