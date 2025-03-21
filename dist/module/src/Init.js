import fs from "fs";
export default async (partialConfig) => {
    const config = Object.assign(Object.assign({}, partialConfig), { buildDir: process.cwd() + "/" + partialConfig.outdir });
    try {
        fs.mkdirSync(`${process.cwd()}/${config.outdir}`);
    }
    catch (_a) {
        // console.log()
    }
    fs.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, config), { buildDir: process.cwd() + "/" + config.outdir }), null, 2));
    try {
        fs.mkdirSync(`${process.cwd()}/${config.outdir}/node`);
    }
    catch (_b) {
        // console.log()
    }
    try {
        fs.mkdirSync(`${process.cwd()}/${config.outdir}/web`);
    }
    catch (_c) {
        // console.log()
    }
    try {
        fs.mkdirSync(`${process.cwd()}/${config.outdir}/features`);
    }
    catch (_d) {
        // console.log()
    }
    try {
        fs.mkdirSync(`${process.cwd()}/${config.outdir}/ts`);
    }
    catch (_e) {
        // console.log()
    }
};
