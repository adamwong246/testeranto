import fs from "fs";
import path from "path";
const fPaths = [];
export const NodeWriter = {
    createWriteStream: (filepath) => {
        return fs.createWriteStream(filepath);
    },
    writeFileSync: (fp, contents) => {
        fs.writeFileSync(fp, contents);
    },
    mkdirSync: async (destFolder) => {
        // await fs.mkdirSync(fp, { recursive: true });
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }
    },
    testArtiFactoryfileWriter: (tLog, callback) => (fPath, value) => {
        callback(new Promise((res, rej) => {
            tLog("testArtiFactory =>", fPath);
            const cleanPath = path.resolve(fPath);
            fPaths.push(cleanPath.replace(process.cwd(), ``));
            const targetDir = cleanPath.split("/").slice(0, -1).join("/");
            fs.mkdir(targetDir, { recursive: true }, async (error) => {
                if (error) {
                    console.error(`❗️testArtiFactory failed`, targetDir, error);
                }
                fs.writeFileSync(path.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"), fPaths.join(`\n`), {
                    encoding: "utf-8",
                });
                if (Buffer.isBuffer(value)) {
                    fs.writeFileSync(fPath, value, "binary");
                    res();
                }
                else if (`string` === typeof value) {
                    fs.writeFileSync(fPath, value.toString(), {
                        encoding: "utf-8",
                    });
                    res();
                }
                else {
                    /* @ts-ignore:next-line */
                    const pipeStream = value;
                    const myFile = fs.createWriteStream(fPath);
                    pipeStream.pipe(myFile);
                    pipeStream.on("close", () => {
                        myFile.close();
                        res();
                    });
                }
            });
        }));
    }
};
