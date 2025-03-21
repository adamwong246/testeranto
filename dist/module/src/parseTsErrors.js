import fs from "fs";
import path from "path";
function parseTsErrors(logPath) {
    try {
        const logContent = fs.readFileSync(logPath, "utf-8").split("\n");
        const regex = /(^src(.*?))\(\d*,\d*\): error/gm;
        const brokenFilesToLines = {};
        for (let i = 0; i < logContent.length - 1; i++) {
            let m;
            while ((m = regex.exec(logContent[i])) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                if (!brokenFilesToLines[m[1]]) {
                    brokenFilesToLines[m[1]] = new Set();
                }
                brokenFilesToLines[m[1]].add(i);
            }
        }
        const final = Object.keys(brokenFilesToLines).reduce((mm, lm, ndx) => {
            mm[lm] = Array.from(brokenFilesToLines[lm]).map((l, ndx3) => {
                const a = Array.from(brokenFilesToLines[lm]);
                return Object.keys(a).reduce((mm2, lm2, ndx2) => {
                    const acc = [];
                    let j = a[lm2] + 1;
                    let working = true;
                    while (j < logContent.length - 1 && working) {
                        if (!logContent[j].match(regex) &&
                            working &&
                            !logContent[j].match(/^..\/(.*?)\(\d*,\d*\)/)) {
                            acc.push(logContent[j]);
                        }
                        else {
                            working = false;
                        }
                        j++;
                    }
                    mm2[lm] = [logContent[l], ...acc];
                    return mm2;
                }, {})[lm];
            });
            return mm;
        }, {});
        fs.writeFileSync(`./docs/types/type_errors.json`, JSON.stringify(final, null, 2));
        Object.keys(final).forEach((k) => {
            fs.mkdirSync(`./docs/types/${k.split("/").slice(0, -1).join("/")}`, {
                recursive: true,
            });
            fs.writeFileSync(`./docs/types/${k}.type_errors.txt`, final[k].flat().flat().join("\r\n"));
        });
    }
    catch (error) {
        console.error("Error reading or parsing the log file:", error);
        process.exit(1);
    }
}
parseTsErrors(process.argv[2] || path.join(process.cwd(), "./docs/type_errors.log"));
