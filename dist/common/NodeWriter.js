"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeWriter = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fPaths = [];
exports.NodeWriter = {
    createWriteStream: (filepath) => {
        return fs_1.default.createWriteStream(filepath);
    },
    writeFileSync: (fp, contents) => {
        fs_1.default.writeFileSync(fp, contents);
    },
    mkdirSync: async (destFolder) => {
        // await fs.mkdirSync(fp, { recursive: true });
        if (!fs_1.default.existsSync(destFolder)) {
            fs_1.default.mkdirSync(destFolder, { recursive: true });
        }
    },
    testArtiFactoryfileWriter: (tLog, callback) => (fPath, value) => {
        callback(new Promise((res, rej) => {
            tLog("testArtiFactory =>", fPath);
            const cleanPath = path_1.default.resolve(fPath);
            fPaths.push(cleanPath.replace(process.cwd(), ``));
            const targetDir = cleanPath.split("/").slice(0, -1).join("/");
            fs_1.default.mkdir(targetDir, { recursive: true }, async (error) => {
                if (error) {
                    console.error(`❗️testArtiFactory failed`, targetDir, error);
                }
                fs_1.default.writeFileSync(path_1.default.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"), fPaths.join(`\n`), {
                    encoding: "utf-8",
                });
                if (Buffer.isBuffer(value)) {
                    fs_1.default.writeFileSync(fPath, value, "binary");
                    res();
                }
                else if (`string` === typeof value) {
                    fs_1.default.writeFileSync(fPath, value.toString(), {
                        encoding: "utf-8",
                    });
                    res();
                }
                else {
                    /* @ts-ignore:next-line */
                    const pipeStream = value;
                    const myFile = fs_1.default.createWriteStream(fPath);
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
