import fs from "fs";
import path from "path";
import { PassThrough } from "stream";

import {
  ILogWriter, ITLog, ITTestResourceConfiguration, ITTestResourceRequirement, ITestJob
} from "./core";

type IFPaths = string[];
const fPaths: IFPaths = [];

export const NodeWriter: ILogWriter = {
  createWriteStream: (filepath: string) => {
    return fs.createWriteStream(filepath);
  },
  writeFileSync: (fp: string, contents: string) => {
    fs.writeFileSync(
      fp,
      contents
    );
  },
  mkdirSync: async (fp: string) => {
    await fs.mkdirSync(fp, { recursive: true });
  },
  testArtiFactoryfileWriter:
    (tLog: ITLog) =>
      (fp) =>
        (givenNdx) =>
          (key, value: string | Buffer | PassThrough) => {
            tLog("testArtiFactory =>", key);

            const fPath = `${fp}/${givenNdx}/${key}`;
            const cleanPath = path.resolve(fPath);
            fPaths.push(cleanPath.replace(process.cwd(), ``));

            const targetDir = cleanPath.split("/").slice(0, -1).join("/");

            fs.mkdir(targetDir, { recursive: true }, async (error) => {
              if (error) {
                console.error(`❗️testArtiFactory failed`, targetDir, error);
              }

              fs.writeFileSync(
                path.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"),
                fPaths.join(`\n`),
                {
                  encoding: "utf-8",
                }
              );

              if (Buffer.isBuffer(value)) {
                fs.writeFileSync(fPath, value, "binary");
              } else if (`string` === typeof value) {
                fs.writeFileSync(fPath, value.toString(), {
                  encoding: "utf-8",
                });
              } else {
                /* @ts-ignore:next-line */
                const pipeStream: PassThrough = value;
                const myFile = fs.createWriteStream(fPath);
                pipeStream.pipe(myFile);
                pipeStream.on("close", () => {
                  myFile.close();
                });
              }
            });
          }
}