import fs from "fs";
import { spawn } from "child_process";
export const execCommand = async (command) => {
    return new Promise((resolve, reject) => {
        const [cmd, ...args] = command.split(" ");
        const childProcess = spawn(cmd, args);
        childProcess.stdout.on("data", (data) => {
            process.stdout.write(data.toString());
        });
        childProcess.stderr.on("data", (data) => {
            process.stderr.write(data.toString());
        });
        childProcess.on("error", (error) => {
            reject(error);
        });
        childProcess.on("exit", (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`Command exited with code ${code}.`));
            }
        });
    });
};
const key = process.argv[2];
console.log(key);
const exitcode = fs.readFileSync(`${key}/exitcode`).toString();
console.log("exitcode", exitcode);
// if (exitcode != "0") {
if (exitcode != "0") {
    const inputFiles = JSON.parse(fs.readFileSync(`${key}/inputFiles.json`).toString());
    inputFiles.push(`${key}/tests.json`);
    const features = await (await Promise.all(Array.from(new Set(JSON.parse(fs.readFileSync(`${key}/tests.json`).toString())
        .givens.reduce((mm, lm) => {
        mm.push(lm.features.reduce((mm2, lm2) => {
            mm2.push(lm2);
            return mm2;
        }, []));
        return mm;
    }, [])
        .flat()
        .flat()))))
        .reduce(async (mm, feature) => {
        const req = await octokit.request(`GET /repos/adamwong246/kokomobay-taskman/contents/Task/${feature}.json`, {
            owner: "adamwong246",
            repo: "kokomoBay-taskman",
            path: `Task/${feature}.json`,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
        const j = JSON.parse(atob(req.data.content));
        (await mm).push([
            feature,
            JSON.stringify({
                name: j.name,
                body: j.body,
            }),
        ]);
        return mm;
    }, Promise.resolve([]))
        .then((z) => {
        const final = z.reduce((mm, [k, v], ndx) => {
            mm[k] = v;
            return mm;
        }, {});
        const as = JSON.stringify(final);
        fs.writeFile(`./${key}/features.json`, as, () => {
            inputFiles.push(`./${key}/features.json`);
            const scriptCommand = `aider --model deepseek --api-key deepseek=${process.env.DEEPSEEK_KEY} --message "Fix the failing tests" ${inputFiles.join(" ")}`;
            console.log("scriptCommand", scriptCommand);
            execCommand(scriptCommand);
            // itermTab(scriptCommand).then(() => console.log("yay"));
            // const child = spawn("xterm -e", scriptCommand.split(" "), {
            //   detached: true,
            //   stdio: "ignore",
            // });
            // runCommandInITerm(scriptCommand);
        });
        //
    });
    // features.then((x) => {
    //   console.log("done", x);
    // });
}
else {
    console.log("that test is not failing");
}
