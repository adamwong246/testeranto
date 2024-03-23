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
    startup: async (testResourceArg, t, testResourceRequirement) => {
        const partialTestResource = JSON.parse(testResourceArg);
        if (partialTestResource.fs && partialTestResource.ports) {
            await t.receiveTestResourceConfig(partialTestResource);
        }
        else {
            console.log("test configuration is incomplete", partialTestResource);
            if (process.send) {
                console.log("requesting test resources from pm2 ...", testResourceRequirement);
                /* @ts-ignore:next-line */
                process.send({
                    type: "testeranto:hola",
                    data: {
                        testResourceRequirement,
                    },
                });
                console.log("awaiting test resources from pm2...");
                process.on("message", async function (packet) {
                    console.log("message: ", packet);
                    const resourcesFromPm2 = packet.data.testResourceConfiguration;
                    const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
                    console.log("secondTestResource", secondTestResource);
                    if (await t.receiveTestResourceConfig(secondTestResource)) {
                        /* @ts-ignore:next-line */
                        process.send({
                            type: "testeranto:adios",
                            data: {
                                testResourceConfiguration: t.test.testResourceConfiguration,
                                results: t.toObj(),
                            },
                        }, (err) => {
                            if (!err) {
                                console.log(`✅`);
                            }
                            else {
                                console.error(`❗️`, err);
                            }
                            // process.exit(0); // :-)
                        });
                    }
                });
            }
            else {
                console.log("Pass run-time test resources by STDIN", process.stdin);
                process.stdin.on("data", async (data) => {
                    console.log("data: ", data);
                    const resourcesFromStdin = JSON.parse(data.toString());
                    const secondTestResource = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(resourcesFromStdin))), JSON.parse(JSON.stringify(partialTestResource)));
                    await t.receiveTestResourceConfig(secondTestResource);
                    // process.exit(0); // :-)
                });
            }
        }
    },
    createWriteStream: (filepath) => {
        return fs_1.default.createWriteStream(filepath);
    },
    writeFileSync: (fp, contents) => {
        fs_1.default.writeFileSync(fp, contents);
    },
    mkdirSync: async (fp) => {
        await fs_1.default.mkdirSync(fp, { recursive: true });
    },
    testArtiFactoryfileWriter: (tLog) => (fp) => (givenNdx) => (key, value) => {
        tLog("testArtiFactory =>", key);
        const fPath = `${fp}/${givenNdx}/${key}`;
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
            }
            else if (`string` === typeof value) {
                fs_1.default.writeFileSync(fPath, value.toString(), {
                    encoding: "utf-8",
                });
            }
            else {
                /* @ts-ignore:next-line */
                const pipeStream = value;
                const myFile = fs_1.default.createWriteStream(fPath);
                pipeStream.pipe(myFile);
                pipeStream.on("close", () => {
                    myFile.close();
                });
            }
        });
    }
};
