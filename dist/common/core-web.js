"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
const core_2 = __importDefault(require("./core"));
const startup = async (testResourceArg, t, testResourceRequirement) => {
    return;
};
exports.default = async (input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement = core_1.defaultTestResourceRequirement) => {
    const mrt = new core_2.default(input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement, testInterface.assertioner || (async (t) => t), testInterface.beforeEach ||
        async function (subject, initialValues, testResource) {
            return subject;
        }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler ||
        function (b) {
            return b;
        }, {
        createWriteStream: (filepath) => {
            return;
            // return fs.createWriteStream(filepath);
        },
        writeFileSync: (fp, contents) => {
            return;
            // fs.writeFileSync(
            //   fp,
            //   contents
            // );
        },
        mkdirSync: (fp) => {
            return;
        },
        testArtiFactoryfileWriter: (tLog) => (fp) => (givenNdx) => (key, value) => {
            tLog("testArtiFactory =>", key);
            const fPath = `${fp}/${givenNdx}/${key}`;
            // const cleanPath = path.resolve(fPath);
            // fPaths.push(cleanPath.replace(process.cwd(), ``));
            // const targetDir = cleanPath.split("/").slice(0, -1).join("/");
            // fs.mkdir(targetDir, { recursive: true }, async (error) => {
            //   if (error) {
            //     console.error(`❗️testArtiFactory failed`, targetDir, error);
            //   }
            //   fs.writeFileSync(
            //     path.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"),
            //     fPaths.join(`\n`),
            //     {
            //       encoding: "utf-8",
            //     }
            //   );
            //   if (Buffer.isBuffer(value)) {
            //     fs.writeFileSync(fPath, value, "binary");
            //   } else if (`string` === typeof value) {
            //     fs.writeFileSync(fPath, value.toString(), {
            //       encoding: "utf-8",
            //     });
            //   } else {
            //     /* @ts-ignore:next-line */
            //     const pipeStream: PassThrough = value;
            //     var myFile = fs.createWriteStream(fPath);
            //     pipeStream.pipe(myFile);
            //     pipeStream.on("close", () => {
            //       myFile.close();
            //     });
            //   }
            // });
        },
        startup
    });
    const t = mrt[0];
    const testResourceArg = `{"fs": ".", "ports": []}`;
    try {
        startup(testResourceArg, t, testResourceRequirement);
    }
    catch (e) {
        console.error(e);
        process.exit(-1);
    }
};
