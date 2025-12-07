import ansiC from "ansi-colors";
import { ISummary } from "../Types.js";
import { SummaryManager } from "./SummaryManager.js";
import { QueueManager } from "./QueueManager.js";

export function checkForShutdown(
  mode: string,
  summaryManager: SummaryManager,
  queueManager: QueueManager,
  projectName: string,
  browser: any,
  checkQueue: () => void,
  writeBigBoard: () => void
): void {
  checkQueue();

  console.log(
    ansiC.inverse(
      `The following jobs are awaiting resources: ${JSON.stringify(
        queueManager.getAll()
      )}`
    )
  );

  writeBigBoard();

  if (mode === "dev") return;

  let inflight = false;
  const summary = summaryManager.getSummary();

  Object.keys(summary).forEach((k) => {
    if (summary[k].prompt === "?") {
      console.log(ansiC.blue(ansiC.inverse(`🕕 prompt ${k}`)));
      inflight = true;
    }
  });

  Object.keys(summary).forEach((k) => {
    if (summary[k].runTimeErrors === "?") {
      console.log(ansiC.blue(ansiC.inverse(`🕕 runTimeError ${k}`)));
      inflight = true;
    }
  });

  Object.keys(summary).forEach((k) => {
    if (summary[k].staticErrors === "?") {
      console.log(ansiC.blue(ansiC.inverse(`🕕 staticErrors ${k}`)));
      inflight = true;
    }
  });

  Object.keys(summary).forEach((k) => {
    if (summary[k].typeErrors === "?") {
      console.log(ansiC.blue(ansiC.inverse(`🕕 typeErrors ${k}`)));
      inflight = true;
    }
  });

  writeBigBoard();

  // if (!inflight) {
  //   if (browser) {
  //     browser.disconnect().then(() => {
  //       console.log(
  //         ansiC.inverse(`${projectName} has been tested. Goodbye.`)
  //       );
  //       process.exit();
  //     });
  //   }
  // }
}
