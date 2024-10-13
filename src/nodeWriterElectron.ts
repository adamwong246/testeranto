// import fs from "fs";
const fs = require("fs");
// import path from "path";
const path = require("path");
import { PassThrough } from "stream";

import { ILogWriter, ITLog } from "./lib.js";

type IFPaths = string[];
const fPaths: IFPaths = [];

export const NodeWriterElectron: ILogWriter = {
  createWriteStream: (filepath: string): fs.WriteStream => {
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
    (tLog: ITLog, callback: (Promise) => void) =>
      (fPath, value: string | Buffer | PassThrough) => {
        callback(new Promise<void>((res, rej) => {
          tLog("testArtiFactory =>", fPath);

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
              res();
            } else if (`string` === typeof value) {
              fs.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8",
              });
              res();
            } else {
              /* @ts-ignore:next-line */
              const pipeStream: PassThrough = value;
              const myFile = fs.createWriteStream(fPath);
              pipeStream.pipe(myFile);
              pipeStream.on("close", () => {
                myFile.close();
                res();
              });
            }
          });
        }))

      }
}