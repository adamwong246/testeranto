"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execCommand = void 0;
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const execCommand = async (command) => {
    const ls = (0, child_process_1.spawn)(command.split(" ")[0], command.split(" ").slice(1, -1));
    process.stdin.pipe(ls.stdin);
    ls.stdout.pipe(process.stdout);
    ls.stderr.pipe(process.stdout);
    // ls.stdout.on("data", function (data) {
    //   console.log("stdout: " + data.toString());
    // });
    // ls.stderr.on("data", function (data) {
    //   console.log("stderr: " + data.toString());
    // });
    ls.on("exit", function (code) {
        console.log("child process exited with code " + (code === null || code === void 0 ? void 0 : code.toString()) || -1);
    });
    // return new Promise<void>((resolve, reject) => {
    //   const [cmd, ...args] = command.split(" ");
    //   const childProcess = spawn(cmd, args);
    //   childProcess.stdout.on("data", (data) => {
    //     process.stdout.write(data.toString());
    //   });
    //   childProcess.stderr.on("data", (data) => {
    //     process.stderr.write(data.toString());
    //   });
    //   childProcess.on("error", (error) => {
    //     reject(error);
    //   });
    //   childProcess.on("exit", (code) => {
    //     if (code === 0) {
    //       resolve();
    //     } else {
    //       reject(new Error(`Command exited with code ${code}.`));
    //     }
    //   });
    // });
};
exports.execCommand = execCommand;
const key = process.argv[2];
console.log(key);
const exitcode = fs_1.default.readFileSync(`${key}/exitcode`).toString();
console.log("exitcode", exitcode);
// if (exitcode != "0") {
if (exitcode != "0") {
    const inputFiles = JSON.parse(fs_1.default.readFileSync(`${key}/inputFiles.json`).toString());
    inputFiles.push(`${key}/tests.json`);
    // const features = await await Promise.all(
    //   Array.from(
    //     new Set(
    //       JSON.parse(fs.readFileSync(`${key}/tests.json`).toString())
    //         .givens.reduce((mm: any[], lm: { features: any[] }) => {
    //           mm.push(
    //             lm.features.reduce((mm2: any[], lm2: any) => {
    //               mm2.push(lm2);
    //               return mm2;
    //             }, [])
    //           );
    //           return mm;
    //         }, [])
    //         .flat()
    //         .flat()
    //     )
    //   ) as string[]
    // );
    // const final = features.reduce((mm, [k, v], ndx) => {
    //   mm[k] = v;
    //   return mm;
    // }, {});
    // const as = JSON.stringify(final);
    // const scriptCommand = `aider --model deepseek --api-key deepseek=${
    //   process.env.DEEPSEEK_KEY
    // } --message "Fix the failing tests" --read ${key}/inputFiles.json ${inputFiles
    //   .map((i) => `--file ${i}`)
    //   .join(" ")}`;
    const scriptCommand = `aider --message "Fix the failing tests" --model deepseek --api-key deepseek=${process.env.DEEPSEEK_KEY} --file ./${inputFiles.join(" ./")}`;
    console.log("scriptCommand", scriptCommand);
    (0, exports.execCommand)(scriptCommand);
    // fs.writeFile(`./${key}/features.json`, as, () => {
    //   inputFiles.push(`./${key}/features.json`);
    //   // itermTab(scriptCommand).then(() => console.log("yay"));
    //   // const child = spawn("xterm -e", scriptCommand.split(" "), {
    //   //   detached: true,
    //   //   stdio: "ignore",
    //   // });
    //   // runCommandInITerm(scriptCommand);
    // });
    // .reduce(async (mm, feature) => {
    //   const req = await octokit.request(
    //     `GET /repos/adamwong246/kokomobay-taskman/contents/Task/${feature}.json`,
    //     {
    //       owner: "adamwong246",
    //       repo: "kokomoBay-taskman",
    //       path: `Task/${feature}.json`,
    //       headers: {
    //         "X-GitHub-Api-Version": "2022-11-28",
    //       },
    //     }
    //   );
    //   const j = JSON.parse(atob(req.data.content));
    //   (await mm).push([
    //     feature,
    //     JSON.stringify({
    //       name: j.name,
    //       body: j.body,
    //     }),
    //   ]);
    //   return mm;
    // }, Promise.resolve<[string, string][]>([]))
    // .then((z) => {
    //   const final = z.reduce((mm, [k, v], ndx) => {
    //     mm[k] = v;
    //     return mm;
    //   }, {});
    //   const as = JSON.stringify(final);
    //   fs.writeFile(`./${key}/features.json`, as, () => {
    //     inputFiles.push(`./${key}/features.json`);
    //     const scriptCommand = `aider --model deepseek --api-key deepseek=${
    //       process.env.DEEPSEEK_KEY
    //     } --message "Fix the failing tests" ${inputFiles.join(" ")}`;
    //     console.log("scriptCommand", scriptCommand);
    //     execCommand(scriptCommand);
    //     // itermTab(scriptCommand).then(() => console.log("yay"));
    //     // const child = spawn("xterm -e", scriptCommand.split(" "), {
    //     //   detached: true,
    //     //   stdio: "ignore",
    //     // });
    //     // runCommandInITerm(scriptCommand);
    //   });
    //   //
    // });
    // features.then((x) => {
    //   console.log("done", x);
    // });
}
else {
    console.log("that test is not failing");
}
