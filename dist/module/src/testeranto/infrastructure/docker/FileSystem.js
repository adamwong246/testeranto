import fs from "fs";
import path from "path";
import { promisify } from "util";
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
export class FileSystem {
    async writeFile(filePath, content, encoding = "utf8") {
        const dir = path.dirname(filePath);
        await mkdirAsync(dir, { recursive: true });
        if (typeof content === "string") {
            await writeFileAsync(filePath, content, encoding);
        }
        else {
            await writeFileAsync(filePath, content);
        }
    }
    async mkdir(dirPath, options = {}) {
        await mkdirAsync(dirPath, Object.assign({ recursive: true }, options));
    }
    async readFile(filePath, encoding) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, encoding, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    }
    existsSync(checkPath) {
        return fs.existsSync(checkPath);
    }
    unlinkSync(unlinkPath) {
        fs.unlinkSync(unlinkPath);
    }
    rmdirSync(rmdirPath, options) {
        fs.rmdirSync(rmdirPath, options);
    }
    statSync(statPath) {
        const stats = fs.statSync(statPath);
        return {
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
            size: stats.size,
            mtime: stats.mtime,
        };
    }
}
